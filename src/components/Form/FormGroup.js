// src/components/Form/FormGroup.js
import './FormGroup.css';
import { Component } from '../../utils/componentFactory.js';

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
   * @param {Object} props.field - Form field component
   * @param {string} [props.helpText] - Help text to display below the field
   * @param {string} [props.id] - ID for the label (will be linked to field)
   * @param {boolean} [props.required=false] - Whether the field is required
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {string} [props.labelPosition='top'] - Label position ('top', 'left', 'right', 'bottom')
   */
  constructor({
    label,
    field,
    helpText,
    id,
    required = false,
    className = '',
    labelPosition = 'top',
  }) {
    super();

    // Validation
    if (!label) {
      throw new Error('FormGroup: label is required');
    }

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
    const { label, field, helpText, id, required, className, labelPosition } =
      this.props;

    // Create container div
    const container = this.createElement('div', {
      className: this.createClassNames(
        'form-group',
        `form-group--${labelPosition}`,
        className
      ),
    });

    // Create label
    const labelId = id ? `${id}-label` : null;
    const labelElement = this.createElement('label', {
      className: 'form-group__label',
      textContent: label,
      attributes: {
        for: id,
        id: labelId,
      },
    });

    // Add required indicator if needed
    if (required) {
      labelElement.classList.add('form-group__label--required');
    }

    // Create field container
    const fieldContainer = this.createElement('div', {
      className: 'form-group__field',
    });

    // Get field element
    let fieldElement;
    if (typeof field.getElement === 'function') {
      fieldElement = field.getElement();
    } else if (field instanceof HTMLElement) {
      fieldElement = field;
    } else {
      throw new Error(
        'FormGroup: field must be a component with getElement method or an HTMLElement'
      );
    }

    // Add field to container
    fieldContainer.appendChild(fieldElement);

    // Create help text if provided
    let helpTextElement = null;
    if (helpText) {
      helpTextElement = this.createElement('div', {
        className: 'form-group__help-text',
        textContent: helpText,
      });
    }

    // Assemble the component based on label position
    switch (labelPosition) {
      case 'left':
        container.appendChild(labelElement);
        container.appendChild(fieldContainer);
        if (helpTextElement) {
          container.appendChild(helpTextElement);
        }
        break;

      case 'right':
        container.appendChild(fieldContainer);
        container.appendChild(labelElement);
        if (helpTextElement) {
          container.appendChild(helpTextElement);
        }
        break;

      case 'bottom':
        container.appendChild(fieldContainer);
        container.appendChild(labelElement);
        if (helpTextElement) {
          container.appendChild(helpTextElement);
        }
        break;

      case 'top':
      default:
        container.appendChild(labelElement);
        container.appendChild(fieldContainer);
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
   * Gets the field component
   * @returns {Object|HTMLElement} The field component or element
   */
  getField() {
    return this.props.field;
  }

  /**
   * Gets the form group element
   * @returns {HTMLElement} The form group container element
   */
  getElement() {
    return this.container;
  }
}
