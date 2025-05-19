// src/utils/componentFactory.js
export class Component {
  constructor() {
    // Component state
    this._state = {};
    this._observers = {};
    this._eventListeners = [];
    this._mounted = false;
    this._initialized = false;

    // Bind methods to ensure consistent 'this'
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
  }

  /**
   * Initialize component - called during construction
   * @protected
   */
  initialize() {
    // Override in subclass
    this._initialized = true;
  }

  /**
   * Component is attached to DOM
   * @protected
   */
  mounted() {
    // Override in subclass
    this._mounted = true;
  }

  /**
   * Component is detached from DOM
   * @protected
   */
  unmounted() {
    // Override in subclass
    this._mounted = false;
  }

  /**
   * Clean up resources, remove event listeners
   * @public
   */
  destroy() {
    this.unmounted();
    this._removeAllEventListeners();
    this._observers = {};
    this._eventListeners = [];
  }

  /**
   * Create and return an element
   * @param {string} tagName - HTML tag name
   * @param {Object} options - Element options
   * @returns {HTMLElement} The created element
   */
  createElement(tagName, options = {}) {
    const {
      attributes = {},
      styles = {},
      events = {},
      children,
      className,
      innerHTML,
      textContent,
      disabled,
      value,
      readonly,
    } = options;

    const element = document.createElement(tagName);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (value != null) element.setAttribute(key, value);
    });

    // Set styles
    Object.entries(styles).forEach(([prop, value]) => {
      if (value != null) element.style[prop] = value;
    });

    // Add event listeners with tracking for automatic cleanup
    Object.entries(events).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        this._trackEventListener(element, event, handler);
        element.addEventListener(event, handler);
      }
    });

    // Set direct properties
    if (className) element.className = className;
    if (innerHTML !== undefined) element.innerHTML = innerHTML;
    if (textContent !== undefined) element.textContent = textContent;
    if (disabled !== undefined) element.disabled = disabled;
    if (value !== undefined) element.value = value;
    if (readonly !== undefined) element.readOnly = readonly;

    // Append children
    if (children) this.appendChildren(element, children);

    return element;
  }

  /**
   * Append children to a parent element
   * @param {HTMLElement} parent - Parent element
   * @param {any} children - Child elements or content
   */
  appendChildren(parent, children) {
    if (!parent) return;

    if (typeof children === 'string') {
      parent.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach((child) => {
        if (!child) return;

        if (typeof child === 'string') {
          parent.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
          parent.appendChild(child);
        } else if (typeof child.getElement === 'function') {
          parent.appendChild(child.getElement());
        }
      });
    } else if (children instanceof HTMLElement) {
      parent.appendChild(children);
    } else if (typeof children.getElement === 'function') {
      parent.appendChild(children.getElement());
    }
  }

  /**
   * Create class names from various inputs
   * @param {...any} args - Class names, objects or arrays
   * @returns {string} Combined class names
   */
  createClassNames(...args) {
    return args
      .reduce((classes, arg) => {
        if (!arg) return classes;

        if (typeof arg === 'string') {
          classes.push(arg);
        } else if (Array.isArray(arg)) {
          classes.push(this.createClassNames(...arg));
        } else if (typeof arg === 'object') {
          Object.entries(arg).forEach(([key, value]) => {
            if (value) classes.push(key);
          });
        }

        return classes;
      }, [])
      .filter(Boolean)
      .join(' ');
  }

  /**
   * Validate required props
   * @param {Object} props - Component props
   * @param {Array<string>} requiredProps - Required prop names
   * @param {string} componentName - Component name for error messages
   */
  validateRequiredProps(props, requiredProps, componentName) {
    requiredProps.forEach((propName) => {
      if (props[propName] == null) {
        throw new Error(`${componentName}: ${propName} is required`);
      }
    });
  }

  /**
   * Set component state with immutable updates
   * @param {Object|Function} newState - New state object or updater function
   * @param {Function} [callback] - Optional callback after state update
   */
  setState(newState, callback) {
    const prevState = { ...this._state };

    // Handle function or object updates
    if (typeof newState === 'function') {
      this._state = { ...this._state, ...newState(this._state) };
    } else {
      this._state = { ...this._state, ...newState };
    }

    // Notify observers for each changed property
    const changedProps = Object.keys(this._state).filter(
      (key) => this._state[key] !== prevState[key]
    );

    changedProps.forEach((prop) => {
      if (this._observers[prop]) {
        this._observers[prop].forEach((callback) =>
          callback(this._state[prop], prevState[prop])
        );
      }
    });

    // Notify global state observers
    if (this._observers['*']) {
      this._observers['*'].forEach((callback) =>
        callback(this._state, prevState)
      );
    }

    // Call callback if provided
    if (typeof callback === 'function') {
      callback(this._state, prevState);
    }
  }

  /**
   * Get current state or a specific state property
   * @param {string} [prop] - Optional property name
   * @returns {any} State value
   */
  getState(prop) {
    if (prop) {
      return this._state[prop];
    }
    return { ...this._state };
  }

  /**
   * Subscribe to state changes
   * @param {string|Function} propOrCallback - Property name or callback
   * @param {Function} [callback] - Callback if propOrCallback is a string
   * @returns {Function} Unsubscribe function
   */
  subscribe(propOrCallback, callback) {
    if (typeof propOrCallback === 'function') {
      // Subscribe to all state changes
      if (!this._observers['*']) {
        this._observers['*'] = [];
      }
      this._observers['*'].push(propOrCallback);

      // Return unsubscribe function
      return () => {
        this._observers['*'] = this._observers['*'].filter(
          (cb) => cb !== propOrCallback
        );
      };
    } else {
      // Subscribe to specific property changes
      const prop = propOrCallback;
      if (!this._observers[prop]) {
        this._observers[prop] = [];
      }
      this._observers[prop].push(callback);

      // Return unsubscribe function
      return () => {
        this._observers[prop] = this._observers[prop].filter(
          (cb) => cb !== callback
        );
      };
    }
  }

  /**
   * Track event listener for automatic cleanup
   * @private
   * @param {HTMLElement} element - DOM element
   * @param {string} eventName - Event name
   * @param {Function} handler - Event handler
   */
  _trackEventListener(element, eventName, handler) {
    this._eventListeners.push({ element, eventName, handler });
  }

  /**
   * Remove all tracked event listeners
   * @private
   */
  _removeAllEventListeners() {
    this._eventListeners.forEach(({ element, eventName, handler }) => {
      element.removeEventListener(eventName, handler);
    });
    this._eventListeners = [];
  }

  /**
   * Mount component to DOM element
   * @param {HTMLElement} container - Container element
   * @returns {Component} This component instance
   */
  mount(container) {
    if (!this._initialized) {
      this.initialize();
    }

    if (container && container instanceof HTMLElement) {
      container.appendChild(this.getElement());
      this.mounted();
    }

    return this;
  }

  /**
   * Unmount component from DOM
   * @returns {Component} This component instance
   */
  unmount() {
    const element = this.getElement();
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
      this.unmounted();
    }

    return this;
  }

  /**
   * Get the component's element
   * @returns {HTMLElement} Component element
   */
  getElement() {
    // This should be implemented by subclasses
    throw new Error('Component subclasses must implement getElement()');
  }
}

/**
 * Factory function to create component instances
 * @param {string} name - Component name
 * @param {Function} createInstance - Function to create component instance
 * @returns {Function} Factory function
 */
export function createComponentFactory(name, createInstance) {
  return (props = {}) => {
    try {
      const instance = createInstance(props);
      instance.initialize();
      return instance;
    } catch (error) {
      console.error(`Error creating ${name}:`, error);
      throw error;
    }
  };
}
