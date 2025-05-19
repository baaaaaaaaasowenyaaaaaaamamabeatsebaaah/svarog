// src/utils/componentFactory.js
export class Component {
  /**
   * Creates a DOM element in a performance-optimized way
   * @param {string} tagName - Element tag name
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

    // Create the element
    const element = document.createElement(tagName);

    // Use performant properties over setAttribute when possible
    if (className) element.className = className;
    if (innerHTML !== undefined) element.innerHTML = innerHTML;
    if (textContent !== undefined) element.textContent = textContent;
    if (disabled !== undefined) element.disabled = disabled;
    if (value !== undefined) element.value = value;
    if (readonly !== undefined) element.readOnly = readonly;

    // Apply attributes (only for those that don't have direct properties)
    Object.entries(attributes).forEach(([key, value]) => {
      if (value != null) element.setAttribute(key, value);
    });

    // Apply styles efficiently
    if (Object.keys(styles).length > 0) {
      Object.assign(element.style, styles);
    }

    // Add event listeners
    Object.entries(events).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        element.addEventListener(event, handler);
      }
    });

    // Append children
    if (children) this.appendChildren(element, children);

    return element;
  }

  /**
   * Appends children to a parent element in a performance-optimized way
   * @param {HTMLElement} parent - Parent element
   * @param {*} children - Children to append
   */
  appendChildren(parent, children) {
    if (!parent) return;

    if (typeof children === 'string') {
      parent.textContent = children;
    } else if (Array.isArray(children)) {
      // Use DocumentFragment for batched append
      const fragment = document.createDocumentFragment();

      children.forEach((child) => {
        if (!child) return;

        if (typeof child === 'string') {
          fragment.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
          fragment.appendChild(child);
        } else if (typeof child.getElement === 'function') {
          fragment.appendChild(child.getElement());
        }
      });

      parent.appendChild(fragment);
    } else if (children instanceof HTMLElement) {
      parent.appendChild(children);
    } else if (typeof children.getElement === 'function') {
      parent.appendChild(children.getElement());
    }
  }

  /**
   * Memoized class name generation
   * @param  {...any} args - Class name arguments
   * @returns {string} Combined class names
   */
  createClassNames(...args) {
    // Use a simple cache to avoid recomputing the same class names
    const key = JSON.stringify(args);

    if (!this._classNameCache) {
      this._classNameCache = new Map();
    }

    if (this._classNameCache.has(key)) {
      return this._classNameCache.get(key);
    }

    const result = args
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

    // Cache the result
    this._classNameCache.set(key, result);

    return result;
  }

  /**
   * Validate required props for a component
   * @param {Object} props - Component props
   * @param {Array} requiredProps - Array of required prop names
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
   * Utility for removing event listeners when component is destroyed
   * @param {HTMLElement} element - Element to clean up
   * @param {Object} events - Map of event names to handlers
   */
  removeEventListeners(element, events) {
    if (!element) return;

    Object.entries(events).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        element.removeEventListener(event, handler);
      }
    });
  }

  /**
   * Utility for creating a debounced function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Debounce wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Base destroy method for component cleanup
   * Override in components to add specific cleanup logic
   */
  destroy() {
    // Default implementation does nothing
    // Components should override this to clean up event listeners, etc.
  }
}

/**
 * Factory function for creating component instances
 * @param {string} name - Component name
 * @param {Function} createInstance - Function that creates a component instance
 * @returns {Function} Factory function
 */
export function createComponentFactory(name, createInstance) {
  return (props = {}) => {
    try {
      return createInstance(props);
    } catch (error) {
      console.error(`Error creating ${name}:`, error);
      throw error;
    }
  };
}
