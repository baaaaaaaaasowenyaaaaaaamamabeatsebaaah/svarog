// src/components/Form/FormGroup.js
import './FormGroup.css';
import './FormValidation.css';
import { Component } from '../../utils/componentFactory.js';
import Typography from '../Typography/Typography.js';
import Input from '../Input/Input.js';

/**
 * FormGroup component for grouping form controls with labels
 * @extends Component
 */
export default class FormGroup extends Component {
  /**
   * Creates a new FormGroup instance
   *
   * @param {Object} props - FormGroup properties
   * @param {string} props.label - Input label
   * @param {Object|string} props.field - Form field component or value string
   * @param {string} [props.helpText] - Help text to display below the field
   * @param {string} [props.id] - ID for the label (will be linked to field)
   * @param {boolean} [props.required=false] - Whether the field is required
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {string} [props.labelPosition='top'] - Label position ('top', 'left', 'right', 'bottom')
   * @param {string} [props.fieldType='text'] - Type of field if passing a string value instead of component
   */
  constructor({
    label,
    field,
    helpText,
    id,
    required = false,
    className = '',
    labelPosition = 'top',
    fieldType = 'text',
  }) {
    super();

    // Validation
    this.validateRequiredProps({ label }, ['label'], 'FormGroup');

    if (!field) {
      throw new Error('FormGroup: field is required');
    }

    if (!['top', 'left', 'right', 'bottom'].includes(labelPosition)) {
      throw new Error(
        'FormGroup: labelPosition must be one of: top, left, right, bottom'
      );
    }

    // Store props
    this.props = {
      label,
      field,
      helpText,
      id,
      required,
      className,
      labelPosition,
      fieldType,
    };

    // Create element
    this.container = this.createFormGroupContainer();
  }

  /**
   * Creates the form group container
   * @private
   * @returns {HTMLElement} The form group container element
   */
  createFormGroupContainer() {
    const {
      label,
      field,
      helpText,
      id,
      required,
      className,
      labelPosition,
      fieldType,
    } = this.props;

    // Create container div with has-help-text class if helpText is provided
    const container = this.createElement('div', {
      className: this.createClassNames(
        'form-group',
        `form-group--${labelPosition}`,
        helpText ? 'has-help-text' : '',
        className
      ),
    });

    // Create label directly without using Typography
    const labelId = id ? `${id}-label` : null;
    const labelElement = this.createElement('label', {
      className: this.createClassNames('form-group__label', {
        'form-group__label--required': required,
      }),
      attributes: {
        for: id,
        id: labelId,
      },
      textContent: label,
    });

    // Create field container
    const fieldContainer = this.createElement('div', {
      className: 'form-group__field',
    });

    // Process field - either use the provided component or create an Input from string
    let fieldElement;

    if (typeof field === 'string') {
      // If field is a string, create an Input component
      const inputField = new Input({
        type: fieldType,
        id,
        name: id,
        value: field,
        required,
      });
      fieldElement = inputField.getElement();
      this.fieldComponent = inputField;
    } else if (typeof field.getElement === 'function') {
      // If field is a component with getElement method
      fieldElement = field.getElement();
      this.fieldComponent = field;
    } else if (field instanceof HTMLElement) {
      // If field is already an HTMLElement
      fieldElement = field;
      this.fieldComponent = null;
    } else {
      throw new Error(
        'FormGroup: field must be a component with getElement method, an HTMLElement, or a string value'
      );
    }

    // Add field to container
    fieldContainer.appendChild(fieldElement);

    // Create validation message element - NEW
    this.validationMessageElement = this.createElement('div', {
      className: 'form-group__validation-message',
      attributes: { 'aria-live': 'polite' },
      // No textContent initially to ensure it doesn't take up space
    });

    // Create help text if provided - still use Typography for this
    let helpTextElement = null;
    if (helpText) {
      helpTextElement = new Typography({
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
        container.appendChild(this.validationMessageElement); // Add validation message
        if (helpTextElement) {
          container.appendChild(helpTextElement);
        }
        break;

      case 'right':
        container.appendChild(fieldContainer);
        container.appendChild(labelElement);
        container.appendChild(this.validationMessageElement); // Add validation message
        if (helpTextElement) {
          container.appendChild(helpTextElement);
        }
        break;

      case 'bottom':
        container.appendChild(fieldContainer);
        container.appendChild(labelElement);
        container.appendChild(this.validationMessageElement); // Add validation message
        if (helpTextElement) {
          container.appendChild(helpTextElement);
        }
        break;

      case 'top':
      default:
        container.appendChild(labelElement);
        container.appendChild(fieldContainer);
        container.appendChild(this.validationMessageElement); // Add validation message
        if (helpTextElement) {
          container.appendChild(helpTextElement);
        }
        break;
    }

    // Store references
    this.fieldElement = fieldElement;

    return container;
  }

  /**
   * Updates the validation message for the field
   * @param {string} message - The validation message to display
   * @param {boolean} isValid - Whether the field is valid
   * @returns {FormGroup} The form group instance for chaining
   */

  updateValidation(message, isValid) {
    if (this.validationMessageElement) {
      this.validationMessageElement.textContent = message || '';

      // Always update the validation state classes based on isValid
      // regardless of whether there's a message
      this.container.classList.remove('has-error', 'has-success');
      this.container.classList.add(isValid ? 'has-success' : 'has-error');
    }
    return this;
  }

  /**
   * Gets the field component or element
   * @returns {Object|HTMLElement} The field component or element
   */
  getField() {
    return this.fieldComponent || this.fieldElement;
  }

  /**
   * Gets the form group element
   * @returns {HTMLElement} The form group container element
   */
  getElement() {
    return this.container;
  }

  /**
   * Validates the field if it has a validate method
   * @returns {boolean} Whether the field is valid
   */
  validate() {
    if (
      this.fieldComponent &&
      typeof this.fieldComponent.validate === 'function'
    ) {
      const isValid = this.fieldComponent.validate();

      // Get validation message from the field component if available
      let message = '';
      if (this.fieldComponent.validationMessageElement) {
        message = this.fieldComponent.validationMessageElement.textContent;
      }

      // Update our own validation message
      this.updateValidation(message, isValid);

      return isValid;
    }
    return true;
  }
}
