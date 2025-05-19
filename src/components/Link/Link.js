// src/components/Link/Link.js
import './Link.css';
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';

/**
 * Creates a Link component
 * @param {Object} props - Link properties
 * @returns {Object} Link component
 */
const createLink = (props) => {
  // Destructure props with defaults
  const {
    children,
    href,
    target = '_self',
    underline = false,
    block = false,
    className = '',
    id = null,
    onClick = null,
  } = props;

  // Target validation
  const validTargets = ['_self', '_blank', '_parent', '_top'];
  if (!validTargets.includes(target)) {
    throw new Error(
      `Invalid target: ${target}. Must be one of: ${validTargets.join(', ')}`
    );
  }

  // Type validation
  if (typeof underline !== 'boolean') {
    throw new Error('underline must be a boolean');
  }
  if (typeof block !== 'boolean') {
    throw new Error('block must be a boolean');
  }

  // Component state
  const state = {
    children,
    href,
    target,
    underline,
    block,
    className,
    id,
    onClick,
  };

  /**
   * Build the link element
   * @returns {HTMLElement} Link element
   */
  const buildLinkElement = () => {
    // Build class names
    const classNames = ['link', state.className].filter(Boolean);

    // Create element style
    const style = {
      textDecoration: state.underline ? 'underline' : 'none',
      display: state.block ? 'block' : 'inline-flex',
    };

    // Create element attributes
    const attributes = {
      href: state.href,
      target: state.target,
      id: state.id || null,
    };

    // Create element events
    const events = {
      click: state.onClick,
    };

    // Create element
    const element = createElement('a', {
      attributes,
      classes: classNames,
      style,
      events,
    });

    // Handle different types of children content
    if (typeof state.children === 'string') {
      element.textContent = state.children;
    } else if (state.children instanceof HTMLElement) {
      element.appendChild(state.children);
    } else if (typeof state.children.getElement === 'function') {
      element.appendChild(state.children.getElement());
    } else {
      throw new Error(
        'Link children must be string, HTMLElement, or component with getElement method'
      );
    }

    return element;
  };

  // Create initial element
  let element = buildLinkElement();

  // Public API
  return {
    /**
     * Get the link element
     * @returns {HTMLElement} Link element
     */
    getElement() {
      return element;
    },

    /**
     * Update link properties
     * @param {Object} newProps - New properties
     * @returns {Object} Link component (for chaining)
     */
    update(newProps) {
      // Update state
      Object.assign(state, newProps);

      // Rebuild element
      const oldElement = element;
      element = buildLinkElement();

      // Replace in DOM if inserted
      if (oldElement.parentNode) {
        oldElement.parentNode.replaceChild(element, oldElement);
      }

      return this;
    },

    /**
     * Set link href
     * @param {string} newHref - New href
     * @returns {Object} Link component (for chaining)
     */
    setHref(newHref) {
      return this.update({ href: newHref });
    },

    /**
     * Set link target
     * @param {string} newTarget - New target
     * @returns {Object} Link component (for chaining)
     */
    setTarget(newTarget) {
      return this.update({ target: newTarget });
    },

    /**
     * Toggle underline
     * @param {boolean} value - Whether to underline the link
     * @returns {Object} Link component (for chaining)
     */
    setUnderline(value) {
      return this.update({ underline: value });
    },

    /**
     * Clean up resources
     */
    destroy() {
      // Remove event listeners
      if (element._listeners) {
        Object.entries(element._listeners).forEach(([event, handler]) => {
          element.removeEventListener(event, handler);
        });
        element._listeners = {};
      }

      element = null;
    },
  };
};

// Define required props for validation
createLink.requiredProps = ['children', 'href'];

// Export as a factory function
export default createComponent('Link', createLink);
