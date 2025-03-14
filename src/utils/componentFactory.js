// src/utils/componentFactory.js - Improved Version
export class Component {
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

    // Add event listeners
    Object.entries(events).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
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

  validateRequiredProps(props, requiredProps, componentName) {
    requiredProps.forEach((propName) => {
      if (props[propName] == null) {
        throw new Error(`${componentName}: ${propName} is required`);
      }
    });
  }
}

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
