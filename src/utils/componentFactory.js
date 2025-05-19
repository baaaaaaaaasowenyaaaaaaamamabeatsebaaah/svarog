// src/utils/componentFactory.js
/**
 * Creates a new component factory
 * @param {string} name - Component name for error reporting
 * @param {Function} createFn - Function that creates the component
 * @returns {Function} Factory function for creating components
 */
export const createComponent = (name, createFn) => {
  return (props = {}) => {
    try {
      // Validate required props
      const requiredProps = createFn.requiredProps || [];
      requiredProps.forEach((propName) => {
        if (props[propName] === undefined) {
          throw new Error(`${name}: ${propName} is required`);
        }
      });

      // Create the component
      const component = createFn(props);

      // Add component metadata
      component._name = name;

      // Ensure essential methods exist
      if (!component.getElement) {
        throw new Error(`${name}: Component must implement getElement()`);
      }

      // Add default destroy method if not provided
      if (!component.destroy) {
        component.destroy = () => {
          // Default cleanup behavior
          const element = component.getElement();
          if (element && element._listeners) {
            Object.entries(element._listeners).forEach(([event, handler]) => {
              element.removeEventListener(event, handler);
            });
            element._listeners = {};
          }
        };
      }

      return component;
    } catch (error) {
      console.error(`Error creating ${name}:`, error);
      throw error;
    }
  };
};

/**
 * DOM element creation utility
 * @param {string} tag - HTML tag name
 * @param {Object} options - Element options
 * @returns {HTMLElement} Created element
 */
export const createElement = (tag, options = {}) => {
  const {
    attributes = {},
    classes = [],
    children = [],
    events = {},
    style = {},
    text,
    html,
  } = options;

  const element = document.createElement(tag);

  // Apply classes
  if (Array.isArray(classes)) {
    element.className = classes.filter(Boolean).join(' ');
  } else if (typeof classes === 'string') {
    element.className = classes;
  }

  // Apply attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });

  // Apply style
  Object.entries(style).forEach(([prop, value]) => {
    element.style[prop] = value;
  });

  // Store event listeners for easy cleanup
  element._listeners = {};

  // Add event listeners
  Object.entries(events).forEach(([event, handler]) => {
    if (typeof handler === 'function') {
      element.addEventListener(event, handler);
      element._listeners[event] = handler;
    }
  });

  // Set content
  if (html !== undefined) {
    element.innerHTML = html;
  } else if (text !== undefined) {
    element.textContent = text;
  }

  // Append children
  if (children.length > 0) {
    appendChildren(element, children);
  }

  return element;
};

/**
 * Append children to an element
 * @param {HTMLElement} parent - Parent element
 * @param {Array} children - Child elements or components
 */
export const appendChildren = (parent, children) => {
  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();

  children.forEach((child) => {
    if (!child) return;

    if (typeof child === 'string') {
      fragment.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      fragment.appendChild(child);
    } else if (typeof child.getElement === 'function') {
      fragment.appendChild(child.getElement());
    }
  });

  parent.appendChild(fragment);
};
