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
      validateProps(props, createFn.requiredProps, name);

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
          cleanupEventListeners(element);
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
 * Validates required props
 * @param {Object} props - Component props
 * @param {Array} requiredProps - List of required prop names
 * @param {string} componentName - Component name for error messages
 */
export const validateProps = (
  props,
  requiredProps = [],
  componentName = 'Component'
) => {
  if (!requiredProps || !requiredProps.length) return;

  requiredProps.forEach((propName) => {
    if (props[propName] === undefined) {
      throw new Error(`${componentName}: ${propName} is required`);
    }
  });
};

/**
 * Cleans up event listeners from an element
 * @param {HTMLElement} element - DOM element
 */
export const cleanupEventListeners = (element) => {
  if (!element || !element._listeners) return;

  Object.entries(element._listeners).forEach(([event, handler]) => {
    element.removeEventListener(event, handler);
  });
  element._listeners = {};
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

  // Apply classes - simplified to handle both array and string efficiently
  if (classes) {
    element.className = Array.isArray(classes)
      ? classes.filter(Boolean).join(' ')
      : classes;
  }

  // Apply attributes - only set non-null attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });

  // Apply style
  Object.assign(element.style, style);

  // Store event listeners for easy cleanup
  element._listeners = {};

  // Add event listeners - only add valid handlers
  Object.entries(events).forEach(([event, handler]) => {
    if (typeof handler === 'function') {
      element.addEventListener(event, handler);
      element._listeners[event] = handler;
    }
  });

  // Set content - prioritize content setting
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
