// src/components/Form/FormGroup.js
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { validateRequiredProps } from '../../utils/validation.js';
import Typography from '../Typography/Typography.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { formGroupStyles } from './FormGroup.styles.js';
import { formValidationStyles } from './FormValidation.styles.js';

// Create style injectors for FormGroup component
const injectFormGroupStyles = createStyleInjector('FormGroup');
const injectFormValidationStyles = createStyleInjector('FormValidation');

/**
 * Creates a FormGroup component for grouping form controls with labels
 * @param {Object} props - FormGroup properties
 * @returns {Object} FormGroup component API
 */
const createFormGroup = (props) => {
  // Inject styles on component creation
  injectFormGroupStyles(formGroupStyles);
  injectFormValidationStyles(formValidationStyles);

  // Migrate legacy props to standardized props
  const migrateLegacyProps = (props) => {
    const migrated = { ...props };

    // Standardize labelPosition with defaultValue alias
    if ('defaultValue' in props && !('labelPosition' in props)) {
      console.warn('[FormGroup] defaultValue is being used for labelPosition');
      migrated.labelPosition = props.defaultValue;
      delete migrated.defaultValue;
    }

    return migrated;
  };

  // Normalize props - but keep original props for validation
  const normalizedProps = migrateLegacyProps(props);

  // Validate required props - use original props to maintain backward compatibility with tests
  validateRequiredProps(
    props,
    {
      label: { required: true, type: 'string' },
      field: { required: true },
      labelPosition: {
        required: false,
        type: 'string',
        allowedValues: ['top', 'left', 'right', 'bottom'],
        validator: (position) => {
          if (
            position &&
            !['top', 'left', 'right', 'bottom'].includes(position)
          ) {
            return 'must be one of: top, left, right, bottom';
          }
          return true;
        },
      },
    },
    'FormGroup'
  );

  // Initialize state from normalized props with defaults
  const state = {
    label: normalizedProps.label,
    field: normalizedProps.field,
    helpText: normalizedProps.helpText,
    id: normalizedProps.id,
    required: normalizedProps.required || false,
    className: normalizedProps.className || '',
    labelPosition: normalizedProps.labelPosition || 'top',
    fieldType: normalizedProps.fieldType || 'text',
  };

  // Reference to the field component
  let fieldComponent = null;
  let validationMessageElement = null;

  // Create base component with render function
  const component = createBaseComponent((componentState) => {
    return createFormGroupContainer(componentState);
  })(state);

  /**
   * Creates the form group container
   * @private
   * @param {Object} state - Current state
   * @returns {HTMLElement} The form group container element
   */
  function createFormGroupContainer(state) {
    const { label, field, helpText, id, required, className, labelPosition } =
      state;

    // Create container div with has-help-text class if helpText is provided
    const container = createElement('div', {
      classes: [
        'form-group',
        `form-group--${labelPosition}`,
        helpText ? 'has-help-text' : '',
        className,
      ],
    });

    // Create label directly without using Typography
    const labelId = id ? `${id}-label` : null;
    const labelElement = createElement('label', {
      classes: [
        'form-group__label',
        required ? 'form-group__label--required' : '',
      ],
      attributes: {
        for: id,
        id: labelId,
      },
      text: label,
    });

    // Create field container
    const fieldContainer = createElement('div', {
      classes: ['form-group__field'],
    });

    // Process field - either use the provided component or create an Input from string
    let fieldElement;

    if (typeof field === 'string') {
      // If field is a string, create an Input component (would need to be imported)
      throw new Error(
        'FormGroup: field as string is not supported in this refactored version'
      );
    } else if (typeof field.getElement === 'function') {
      // If field is a component with getElement method
      fieldElement = field.getElement();
      fieldComponent = field;
    } else if (field instanceof HTMLElement) {
      // If field is already an HTMLElement
      fieldElement = field;
      fieldComponent = null;
    } else {
      throw new Error(
        'FormGroup: field must be a component with getElement method or an HTMLElement'
      );
    }

    // Add field to container
    fieldContainer.appendChild(fieldElement);

    // Create validation message element
    validationMessageElement = createElement('div', {
      classes: ['form-group__validation-message'],
      attributes: { 'aria-live': 'polite' },
      // No textContent initially to ensure it doesn't take up space
    });

    // Create help text if provided - using Typography for this
    let helpTextElement = null;
    if (helpText) {
      helpTextElement = Typography({
        children: helpText,
        as: 'div',
        className: 'form-group__help-text',
      }).getElement();
    }

    // Assemble the component based on label position
    switch (labelPosition) {
      case 'left':
        container.appendChild(labelElement);
        container.appendChild(fieldContainer);
        container.appendChild(validationMessageElement);
        if (helpTextElement) {
          container.appendChild(helpTextElement);
        }
        break;

      case 'right':
        container.appendChild(fieldContainer);
        container.appendChild(labelElement);
        container.appendChild(validationMessageElement);
        if (helpTextElement) {
          container.appendChild(helpTextElement);
        }
        break;

      case 'bottom':
        container.appendChild(fieldContainer);
        container.appendChild(labelElement);
        container.appendChild(validationMessageElement);
        if (helpTextElement) {
          container.appendChild(helpTextElement);
        }
        break;

      case 'top':
      default:
        container.appendChild(labelElement);
        container.appendChild(fieldContainer);
        container.appendChild(validationMessageElement);
        if (helpTextElement) {
          container.appendChild(helpTextElement);
        }
        break;
    }

    return container;
  }

  // Get the container element
  const containerElement = component.getElement();

  /**
   * Updates the validation message for the field
   * @param {string} message - The validation message to display
   * @param {boolean} isValid - Whether the field is valid
   * @returns {Object} FormGroup component for chaining
   */
  function updateValidation(message, isValid) {
    if (validationMessageElement) {
      validationMessageElement.textContent = message || '';

      // Always update the validation state classes based on isValid
      // regardless of whether there's a message
      containerElement.classList.remove('has-error', 'has-success');
      containerElement.classList.add(isValid ? 'has-success' : 'has-error');
    }
    return api;
  }

  // Public API
  const api = {
    /**
     * Gets the form group element
     * @returns {HTMLElement} The form group container element
     */
    getElement() {
      return containerElement;
    },

    /**
     * Gets the field component or element
     * @returns {Object|HTMLElement} The field component or element
     */
    getField() {
      return (
        fieldComponent ||
        containerElement.querySelector('.form-group__field > *')
      );
    },

    /**
     * Updates the validation message for the field
     * @param {string} message - The validation message to display
     * @param {boolean} isValid - Whether the field is valid
     * @returns {Object} FormGroup component for chaining
     */
    updateValidation,

    /**
     * Validates the field if it has a validate method
     * @returns {boolean} Whether the field is valid
     */
    validate() {
      if (fieldComponent && typeof fieldComponent.validate === 'function') {
        const isValid = fieldComponent.validate();

        // Get validation message from the field component if available
        let message = '';
        if (fieldComponent.validationMessageElement) {
          message = fieldComponent.validationMessageElement.textContent;
        }

        // Update our own validation message
        this.updateValidation(message, isValid);

        return isValid;
      }
      return true;
    },

    /**
     * Updates component with new props
     * @param {Object} newProps - New properties
     * @returns {Object} FormGroup component for chaining
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
      // Clean up references
      fieldComponent = null;
      validationMessageElement = null;

      // Call base component's destroy
      component.destroy();
    },
  };

  return api;
};

// Define required props for validation
createFormGroup.requiredProps = ['label', 'field'];

// Export as a component factory
export default createComponent('FormGroup', createFormGroup);
