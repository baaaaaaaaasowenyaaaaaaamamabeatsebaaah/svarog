// src/utils/componentFactory.js

/**
 * Base component class that all Svarog components can extend
 * This provides common functionality and helps standardize the component API
 */
export class Component {
  /**
   * Creates a DOM element with attributes and event listeners
   *
   * @param {string} tagName - HTML tag to create
   * @param {Object} [options={}] - Element options
   * @param {Object} [options.attributes={}] - HTML attributes to set
   * @param {Object} [options.styles={}] - CSS styles to apply
   * @param {Object} [options.events={}] - Event listeners to attach
   * @param {string|Array|HTMLElement} [options.children] - Child content (string, array of elements, or element)
   * @param {string} [options.className] - CSS class names
   * @param {string} [options.innerHTML] - Inner HTML content
   * @param {string} [options.textContent] - Text content
   * @returns {HTMLElement} The created DOM element
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
    } = options;

    const element = document.createElement(tagName);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        element.setAttribute(key, value);
      }
    });

    // Set styles
    Object.entries(styles).forEach(([property, value]) => {
      if (value !== undefined && value !== null) {
        element.style[property] = value;
      }
    });

    // Add event listeners
    Object.entries(events).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        element.addEventListener(event, handler);
      }
    });

    // Set class name
    if (className) {
      element.className = className;
    }

    // Set inner HTML
    if (innerHTML !== undefined) {
      element.innerHTML = innerHTML;
    }

    // Set text content
    if (textContent !== undefined) {
      element.textContent = textContent;
    }

    // Append children
    if (children) {
      this.appendChildren(element, children);
    }

    return element;
  }

  /**
   * Appends children to a parent element
   *
   * @param {HTMLElement} parent - Parent element to append to
   * @param {string|Array|HTMLElement} children - Children to append
   */
  appendChildren(parent, children) {
    if (!parent) return;

    if (typeof children === 'string') {
      parent.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach((child) => {
        if (child) {
          if (typeof child === 'string') {
            const textNode = document.createTextNode(child);
            parent.appendChild(textNode);
          } else if (child instanceof HTMLElement) {
            parent.appendChild(child);
          } else if (child && typeof child.getElement === 'function') {
            parent.appendChild(child.getElement());
          }
        }
      });
    } else if (children instanceof HTMLElement) {
      parent.appendChild(children);
    } else if (children && typeof children.getElement === 'function') {
      parent.appendChild(children.getElement());
    }
  }

  /**
   * Creates a set of CSS classes from various inputs
   *
   * @param {...(string|Object|Array)} args - Class names, objects, or arrays
   * @returns {string} Combined class string
   *
   * @example
   * // Returns "btn btn--primary is-active"
   * createClassNames('btn', { 'btn--primary': true, 'btn--secondary': false }, 'is-active')
   */
  createClassNames(...args) {
    const classes = [];

    args.forEach((arg) => {
      if (!arg) return;

      if (typeof arg === 'string') {
        classes.push(arg);
      } else if (Array.isArray(arg)) {
        classes.push(this.createClassNames(...arg));
      } else if (typeof arg === 'object') {
        Object.entries(arg).forEach(([key, value]) => {
          if (value) {
            classes.push(key);
          }
        });
      }
    });

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Validates required props and throws errors if any are missing
   *
   * @param {Object} props - Component props
   * @param {Array<string>} requiredProps - List of required prop names
   * @param {string} componentName - Component name for error messages
   * @throws {Error} If any required props are missing
   */
  validateRequiredProps(props, requiredProps, componentName) {
    requiredProps.forEach((propName) => {
      if (props[propName] === undefined || props[propName] === null) {
        throw new Error(`${componentName}: ${propName} is required`);
      }
    });
  }
}

/**
 * Creates a consistent component factory
 *
 * @param {string} name - Component name
 * @param {Function} createInstance - Function that creates a component instance
 * @returns {Function} Component factory function
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
