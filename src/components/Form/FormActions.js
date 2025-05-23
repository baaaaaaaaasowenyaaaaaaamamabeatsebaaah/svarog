// src/components/Form/FormActions.js
import {
  createComponent,
  createElement,
  appendChildren,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { validateRequiredProps } from '../../utils/validation.js';

/**
 * Creates a FormActions component for form buttons and actions
 * @param {Object} props - FormActions properties
 * @returns {Object} FormActions component API
 */
const createFormActions = (props) => {
  // Migrate legacy props to standardized props
  const migrateLegacyProps = (props) => {
    const migrated = { ...props };

    // Standardize align with alignment alias (per standards reference)
    if ('alignment' in props && !('align' in props)) {
      console.warn('[FormActions] alignment is deprecated, use align instead');
      migrated.align = props.alignment;
      delete migrated.alignment;
    }

    return migrated;
  };

  // Normalize props - but keep original props for validation
  const normalizedProps = migrateLegacyProps(props);

  // Validate required props - use original props to maintain backward compatibility with tests
  validateRequiredProps(
    props,
    {
      children: { required: true },
      align: {
        required: false,
        type: 'string',
        allowedValues: ['left', 'center', 'right', 'stretched'],
        validator: (align) => {
          if (
            align &&
            !['left', 'center', 'right', 'stretched'].includes(align)
          ) {
            return 'must be one of: left, center, right, stretched';
          }
          return true;
        },
      },
    },
    'FormActions'
  );

  // Initialize state from normalized props with defaults
  const state = {
    children: normalizedProps.children,
    align: normalizedProps.align || 'right',
    className: normalizedProps.className || '',
  };

  // Create base component with render function
  const component = createBaseComponent((componentState) => {
    return createActionsContainer(componentState);
  })(state);

  /**
   * Creates the actions container
   * @private
   * @param {Object} state - Current state
   * @returns {HTMLElement} The actions container element
   */
  function createActionsContainer(state) {
    const { align, className, children } = state;

    // Create container element
    const container = createElement('div', {
      classes: [
        'form-actions',
        align !== 'right' ? `form-actions--${align}` : '',
        className,
      ],
    });

    // Add buttons
    appendChildren(container, children);

    return container;
  }

  // Get the container element
  const containerElement = component.getElement();

  // Public API
  return {
    /**
     * Gets the actions container element
     * @returns {HTMLElement} The actions container element
     */
    getElement() {
      return containerElement;
    },

    /**
     * Updates component with new props
     * @param {Object} newProps - New properties
     * @returns {Object} FormActions component for chaining
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
createFormActions.requiredProps = ['children'];

// Export as a component factory
export default createComponent('FormActions', createFormActions);
