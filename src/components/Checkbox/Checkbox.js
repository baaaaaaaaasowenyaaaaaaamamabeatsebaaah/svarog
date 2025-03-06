// src/components/Checkbox/Checkbox.js
import './Checkbox.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Checkbox component
 * @extends Component
 */
export default class Checkbox extends Component {
  /**
   * Creates a new Checkbox instance
   *
   * @param {Object} props - Checkbox properties
   * @param {string} props.label - Checkbox label
   * @param {string} [props.id] - Checkbox id
   * @param {string} [props.name] - Checkbox name
   * @param {boolean} [props.checked=false] - Whether the checkbox is checked
   * @param {boolean} [props.required=false] - Whether the checkbox is required
   * @param {boolean} [props.disabled=false] - Whether the checkbox is disabled
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {Function} [props.onChange] - Change event handler
   * @param {string} [props.validationMessage] - Custom validation message
   * @param {boolean} [props.showValidation=true] - Whether to show validation messages
   */
  constructor({
    label,
    id,
    name,
    checked = false,
    required = false,
    disabled = false,
    className = '',
    onChange,
    validationMessage,
    showValidation = true,
  }) {
    super();

    // Validation
    if (!label) {
      throw new Error('Checkbox: label is required');
    }

    // Store props
    this.props = {
      label,
      id,
      name,
      checked,
      required,
      disabled,
      className,
      onChange,
      validationMessage,
      showValidation,
    };

    // Create element
    this.container = this.createCheckboxContainer();

    // Set initial validation state
    this.isValid = true;
    this.validationMessageElement = null;

    if (this.props.showValidation) {
      this.validationMessageElement = this.createValidationMessage();
      this.container.appendChild(this.validationMessageElement);
    }
  }

  /**
   * Creates the checkbox container
   * @private
   * @returns {HTMLElement} The checkbox container element
   */
  createCheckboxContainer() {
    // Create container div
    const container = this.createElement('div', {
      className: this.createClassNames(
        'checkbox-container',
        this.props.className
      ),
    });

    // Create the checkbox wrapper
    const wrapper = this.createElement('label', {
      className: 'checkbox-wrapper',
    });

    // Create the actual checkbox input
    const input = this.createCheckboxInput();

    // Create custom checkbox indicator
    const indicator = this.createElement('span', {
      className: 'checkbox-indicator',
    });

    // Create label text
    const labelText = this.createElement('span', {
      className: 'checkbox-label',
      textContent: this.props.label,
    });

    // Assemble the component
    wrapper.appendChild(input);
    wrapper.appendChild(indicator);
    wrapper.appendChild(labelText);
    container.appendChild(wrapper);

    // Store reference to the input element
    this.input = input;

    return container;
  }

  /**
   * Creates the checkbox input element
   * @private
   * @returns {HTMLInputElement} The checkbox input element
   */
  createCheckboxInput() {
    const { id, name, checked, required, disabled } = this.props;

    // Create attributes object with only defined properties
    const attributes = {};
    if (id) attributes.id = id;
    if (name) attributes.name = name;
    if (required) attributes.required = required;

    // Create input element
    const input = this.createElement('input', {
      className: 'checkbox-input',
      attributes: {
        type: 'checkbox',
        ...attributes,
      },
      events: {
        change: this.handleChange.bind(this),
      },
    });

    // Set properties that can't be set via attributes
    input.checked = checked;
    if (disabled) input.disabled = true;

    return input;
  }

  /**
   * Creates the validation message element
   * @private
   * @returns {HTMLElement} The validation message element
   */
  createValidationMessage() {
    return this.createElement('div', {
      className: 'checkbox-validation-message',
      textContent: this.props.validationMessage || '',
      attributes: {
        'aria-live': 'polite',
      },
    });
  }

  /**
   * Handles change events
   * @private
   * @param {Event} event - The change event
   */
  handleChange(event) {
    // Update internal state
    this.props.checked = event.target.checked;

    // Validate if needed
    if (this.props.showValidation) {
      this.validate();
    }

    // Call onChange callback if provided
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, this.isChecked());
    }
  }

  /**
   * Validates the checkbox value
   * @private
   * @returns {boolean} Whether the checkbox is valid
   */
  validate() {
    const input = this.input;
    const isValid = input.checkValidity();

    // Update validation state
    this.isValid = isValid;

    // Update validation classes
    if (isValid) {
      this.container.classList.remove('checkbox-container--invalid');
      this.container.classList.add('checkbox-container--valid');
    } else {
      this.container.classList.add('checkbox-container--invalid');
      this.container.classList.remove('checkbox-container--valid');

      // Update validation message
      if (this.validationMessageElement) {
        const message = this.props.validationMessage || input.validationMessage;
        this.validationMessageElement.textContent = message;
      }
    }

    return isValid;
  }

  /**
   * Checks if the checkbox is checked
   * @returns {boolean} Whether the checkbox is checked
   */
  isChecked() {
    return this.props.checked;
  }

  /**
   * Sets the checked state
   * @param {boolean} checked - The new checked state
   */
  setChecked(checked) {
    this.props.checked = checked;
    this.input.checked = checked;

    // Validate if needed
    if (this.props.showValidation) {
      this.validate();
    }

    return this;
  }

  /**
   * Checks if the checkbox is valid
   * @returns {boolean} Whether the checkbox is valid
   */
  isValid() {
    return this.validate();
  }

  /**
   * Gets the checkbox element
   * @returns {HTMLElement} The checkbox container element
   */
  getElement() {
    return this.container;
  }
}
