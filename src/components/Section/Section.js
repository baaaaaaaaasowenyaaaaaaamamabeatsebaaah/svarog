// src/components/Section/Section.js
import './Section.css';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement, appendChildren } from '../../utils/componentFactory.js';
import Typography from '../Typography/Typography.js';

/**
 * Creates a Section component for defining page sections
 * @param {Object} props - Section properties
 * @param {string|HTMLElement|Array} props.children - Content for the section
 * @param {string} [props.id] - Section ID for anchor links
 * @param {string} [props.variant] - Section variant ("minor" for alternative styling)
 * @param {HTMLElement} [props.backgroundImage] - Optional background image element
 * @param {string} [props.backgroundColor] - Custom background color (CSS color value)
 * @param {boolean} [props.noPaddingBottom=false] - Whether to remove bottom padding
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {string} [props.title] - Optional section title
 * @param {string} [props.description] - Optional section description
 * @returns {Object} Section component API
 */
const createSection = (props) => {
  // Validate props
  if (!props.children) {
    throw new Error('Section: children is required');
  }

  if (props.variant && props.variant !== 'minor') {
    throw new Error('Section: variant must be "minor" or undefined');
  }

  if (
    props.backgroundImage &&
    !(props.backgroundImage instanceof HTMLElement)
  ) {
    throw new Error('Section: backgroundImage must be an HTMLElement');
  }

  /**
   * Renders the section element based on current state
   * @param {Object} state - Current component state
   * @returns {HTMLElement} Section element
   */
  const renderSection = (state) => {
    // Build class names
    const classNames = ['section'];

    if (state.className) {
      classNames.push(state.className);
    }

    if (state.variant === 'minor') {
      classNames.push('section--minor');
    }

    if (state.noPaddingBottom) {
      classNames.push('section--no-padding-bottom');
    }

    // Create the main section element
    const section = createElement('div', {
      classes: classNames,
      attributes: {
        id: state.id || null,
      },
      style: state.backgroundColor
        ? { backgroundColor: state.backgroundColor }
        : {},
    });

    // Add background image if provided
    if (state.backgroundImage) {
      const bgContainer = createElement('div', {
        classes: ['section__background-image'],
      });
      bgContainer.appendChild(state.backgroundImage);
      section.appendChild(bgContainer);
    }

    // Create content container
    const content = createElement('div', {
      classes: ['section__content'],
    });

    // Add title if provided
    if (state.title) {
      const titleEl = Typography({
        children: state.title,
        as: 'h2',
        className: 'section__title',
      }).getElement();
      content.appendChild(titleEl);
    }

    // Add description if provided
    if (state.description) {
      const descriptionEl = Typography({
        children: state.description,
        as: 'p',
        className: 'section__description',
      }).getElement();
      content.appendChild(descriptionEl);
    }

    // Add main content - handle both string and array children
    if (typeof state.children === 'string') {
      content.textContent = state.children;
    } else if (state.children instanceof HTMLElement) {
      content.appendChild(state.children);
    } else if (Array.isArray(state.children)) {
      appendChildren(content, state.children);
    } else if (typeof state.children.getElement === 'function') {
      content.appendChild(state.children.getElement());
    }

    // Add content to section
    section.appendChild(content);

    return section;
  };

  // Create component using baseComponent
  const baseComponent = createBaseComponent(renderSection)(props);

  /**
   * Determines if component needs to fully re-render based on prop changes
   * @param {Object} newProps - New properties
   * @returns {boolean} Whether a full re-render is required
   */
  const shouldRerender = (newProps) => {
    // Only rebuild if critical props change
    const criticalProps = [
      'children',
      'variant',
      'backgroundImage',
      'title',
      'description',
    ];
    return Object.keys(newProps).some((key) => criticalProps.includes(key));
  };

  /**
   * Perform partial update without full re-render
   * @param {HTMLElement} element - Current element
   * @param {Object} newProps - New properties
   */
  const partialUpdate = (element, newProps) => {
    // Update background color
    if (newProps.backgroundColor !== undefined) {
      element.style.backgroundColor = newProps.backgroundColor || '';
    }

    // Update class names
    if (
      newProps.className !== undefined ||
      newProps.noPaddingBottom !== undefined ||
      newProps.variant !== undefined
    ) {
      const baseClasses = ['section'];

      // Get current state with updates
      const currentState = { ...baseComponent.state };

      if (newProps.className !== undefined) {
        currentState.className = newProps.className;
      }

      if (newProps.noPaddingBottom !== undefined) {
        currentState.noPaddingBottom = newProps.noPaddingBottom;
      }

      if (newProps.variant !== undefined) {
        currentState.variant = newProps.variant;
      }

      // Build new class names
      if (currentState.className) {
        baseClasses.push(currentState.className);
      }

      if (currentState.variant === 'minor') {
        baseClasses.push('section--minor');
      }

      if (currentState.noPaddingBottom) {
        baseClasses.push('section--no-padding-bottom');
      }

      element.className = baseClasses.join(' ');
    }

    // Update ID
    if (newProps.id !== undefined) {
      if (newProps.id) {
        element.setAttribute('id', newProps.id);
      } else {
        element.removeAttribute('id');
      }
    }
  };

  // Extended component with custom methods
  const sectionComponent = {
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
     * Sets the section variant
     * @param {string} variant - Section variant ("minor" or null)
     * @returns {Object} Section component (for chaining)
     */
    setVariant(variant) {
      if (variant !== 'minor' && variant !== null && variant !== undefined) {
        throw new Error('Section: variant must be "minor", null, or undefined');
      }
      return this.update({ variant });
    },

    /**
     * Sets the background color
     * @param {string} color - CSS color value
     * @returns {Object} Section component (for chaining)
     */
    setBackgroundColor(color) {
      return this.update({ backgroundColor: color });
    },

    /**
     * Toggles bottom padding
     * @param {boolean} value - Whether to remove bottom padding
     * @returns {Object} Section component (for chaining)
     */
    setNoPaddingBottom(value) {
      return this.update({ noPaddingBottom: !!value });
    },

    /**
     * Sets the section title
     * @param {string} title - Section title
     * @returns {Object} Section component (for chaining)
     */
    setTitle(title) {
      return this.update({ title });
    },

    /**
     * Sets the section description
     * @param {string} description - Section description
     * @returns {Object} Section component (for chaining)
     */
    setDescription(description) {
      return this.update({ description });
    },
  };

  // Add theme change handler
  sectionComponent.onThemeChange = (newTheme, previousTheme) => {
    console.debug(
      `Section: theme changed from ${previousTheme} to ${newTheme}`
    );
    // We could apply theme-specific adjustments here if needed
  };

  return sectionComponent;
};

// Define required props for validation
createSection.requiredProps = ['children'];

// Export as both named export and default export
export { createSection as createSection };
export default createSection;
