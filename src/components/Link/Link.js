// src/components/Link/Link.js
import './Link.css';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';

/**
 * Creates a Link component
 * @param {Object} props - Link properties
 * @returns {Object} Link component
 */
const createLink = (props) => {
  // Validate props
  const validTargets = ['_self', '_blank', '_parent', '_top'];
  if (props.target && !validTargets.includes(props.target)) {
    throw new Error(
      `Invalid target: ${props.target}. Must be one of: ${validTargets.join(', ')}`
    );
  }

  if (props.underline !== undefined && typeof props.underline !== 'boolean') {
    throw new Error('underline must be a boolean');
  }

  if (props.block !== undefined && typeof props.block !== 'boolean') {
    throw new Error('block must be a boolean');
  }

  if (!props.children) {
    throw new Error('children is required');
  }

  if (!props.href) {
    throw new Error('href is required');
  }

  /**
   * Renders the link element based on current state
   * @param {Object} state - Current component state
   * @returns {HTMLElement} Link element
   */
  const renderLink = (state) => {
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
      target: state.target || '_self',
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

  // Create component using baseComponent
  const baseComponent = createBaseComponent(renderLink)(props);

  /**
   * Determines if component needs to fully re-render based on prop changes
   * @param {Object} newProps - New properties
   * @returns {boolean} Whether a full re-render is required
   */
  const shouldRerender = (newProps) => {
    // Only rebuild if these props change
    const criticalProps = ['children', 'href', 'target', 'block'];
    return Object.keys(newProps).some((key) => criticalProps.includes(key));
  };

  /**
   * Perform partial update without full re-render
   * @param {HTMLElement} element - Current element
   * @param {Object} newProps - New properties
   */
  const partialUpdate = (element, newProps) => {
    // Update styles directly
    if (newProps.underline !== undefined) {
      element.style.textDecoration = newProps.underline ? 'underline' : 'none';
    }

    // Update className
    if (newProps.className !== undefined) {
      // Just set the new classes directly
      const baseClass = 'link';
      const newClasses = newProps.className
        ? [baseClass, newProps.className]
        : [baseClass];
      element.className = newClasses.join(' ');
    }
  };

  // Extended component with custom methods
  const linkComponent = {
    ...baseComponent,

    /**
     * Determines if component should fully re-render
     * @param {Object} newProps - New properties
     * @returns {boolean} Whether a full re-render is required
     */
    shouldRerender,

    /**
     * Performs efficient partial updates
     * @param {HTMLElement} element - Current element
     * @param {Object} newProps - New properties
     */
    partialUpdate,

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
  };

  // Add theme change handler
  linkComponent.onThemeChange = (newTheme, previousTheme) => {
    // This could apply theme-specific adjustments if needed
    console.debug(`Link: theme changed from ${previousTheme} to ${newTheme}`);
  };

  return linkComponent;
};

// Define required props for validation
createLink.requiredProps = ['children', 'href'];

// Export as a factory function
export default createLink;
