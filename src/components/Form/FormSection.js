// src/components/Form/FormSection.js
import {
  createComponent,
  createElement,
  appendChildren,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { validateRequiredProps } from '../../utils/validation.js';

/**
 * Creates a FormSection component for grouping related form fields
 * @param {Object} props - FormSection properties
 * @returns {Object} FormSection component API
 */
const createFormSection = (props) => {
  // Migrate legacy props to standardized props
  const migrateLegacyProps = (props) => {
    const migrated = { ...props };

    // Example for future migrations if needed
    // if ('sectionTitle' in props && !('title' in props)) {
    //   console.warn('[FormSection] sectionTitle is deprecated, use title instead');
    //   migrated.title = props.sectionTitle;
    //   delete migrated.sectionTitle;
    // }

    return migrated;
  };

  // Normalize props - but keep original props for validation
  const normalizedProps = migrateLegacyProps(props);

  // Validate required props - use original props to maintain backward compatibility with tests
  validateRequiredProps(
    props,
    {
      children: { required: true },
      title: { required: false, type: 'string' },
      description: { required: false, type: 'string' },
    },
    'FormSection'
  );

  // Initialize state from normalized props with defaults
  const state = {
    children: normalizedProps.children,
    title: normalizedProps.title,
    description: normalizedProps.description,
    className: normalizedProps.className || '',
  };

  // Create base component with render function
  const component = createBaseComponent((componentState) => {
    return createSectionElement(componentState);
  })(state);

  /**
   * Creates the section element
   * @private
   * @param {Object} state - Current state
   * @returns {HTMLElement} The section element
   */
  function createSectionElement(state) {
    const { title, description, className, children } = state;

    // Create section element
    const section = createElement('div', {
      classes: ['form-section', className],
    });

    // Add title if provided
    if (title) {
      const titleElement = createElement('h3', {
        classes: ['form-section__title'],
        text: title,
      });
      section.appendChild(titleElement);
    }

    // Add description if provided
    if (description) {
      const descriptionElement = createElement('p', {
        classes: ['form-section__description'],
        text: description,
      });
      section.appendChild(descriptionElement);
    }

    // Create content container
    const content = createElement('div', {
      classes: ['form-section__content'],
    });

    // Add content
    appendChildren(content, children);
    section.appendChild(content);

    return section;
  }

  // Get the section element
  const sectionElement = component.getElement();

  // Public API
  return {
    /**
     * Gets the section element
     * @returns {HTMLElement} The section element
     */
    getElement() {
      return sectionElement;
    },

    /**
     * Updates component with new props
     * @param {Object} newProps - New properties
     * @returns {Object} FormSection component for chaining
     */
    update(newProps) {
      // Apply prop standardization to new props
      const normalizedNewProps = migrateLegacyProps(newProps);

      // Update state
      Object.assign(state, normalizedNewProps);

      // Update component
      component.update(state);

      return this;
    },

    /**
     * Clean up resources
     */
    destroy() {
      // Call base component's destroy
      component.destroy();
    },
  };
};

// Define required props for validation
createFormSection.requiredProps = ['children'];

// Export as a component factory
export default createComponent('FormSection', createFormSection);
