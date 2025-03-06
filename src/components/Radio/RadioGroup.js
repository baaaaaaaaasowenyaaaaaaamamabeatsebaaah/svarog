// src/components/Radio/RadioGroup.js
import './RadioGroup.css';
import { Component } from '../../utils/componentFactory.js';
import Radio from './Radio.js';

/**
 * RadioGroup component
 * @extends Component
 */
export default class RadioGroup extends Component {
  /**
   * Creates a new RadioGroup instance
   *
   * @param {Object} props - RadioGroup properties
   * @param {Array<Object>} props.options - Radio options
   * @param {string} [props.name] - Group name
   * @param {string} [props.value] - Selected value
   * @param {string} [props.legend] - Group legend/title
   * @param {boolean} [props.required=false] - Whether a selection is required
   * @param {boolean} [props.disabled=false] - Whether the group is disabled
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {Function} [props.onChange] - Change event handler
   * @param {string} [props.layout='vertical'] - Layout direction ('vertical' or 'horizontal')
   * @param {string} [props.validationMessage] - Custom validation message
   * @param {boolean} [props.showValidation=true] - Whether to show validation messages
   */
  constructor({
    options = [],
    name,
    value,
    legend,
    required = false,
    disabled = false,
    className = '',
    onChange,
    layout = 'vertical',
    validationMessage,
    showValidation = true,
  }) {
    super();

    // Validation
    if (!Array.isArray(options) || options.length === 0) {
      throw new Error(
        'RadioGroup: options array is required and must not be empty'
      );
    }

    if (!name) {
      throw new Error('RadioGroup: name is required');
    }

    if (layout !== 'vertical' && layout !== 'horizontal') {
      throw new Error(
        'RadioGroup: layout must be either "vertical" or "horizontal"'
      );
    }

    // Store props
    this.props = {
      options,
      name,
      value,
      legend,
      required,
      disabled,
      className,
      onChange,
      layout,
      validationMessage,
      showValidation,
    };

    // Store radio components
    this.radios = [];

    // Create element
    this.container = this.createRadioGroupContainer();

    // Set initial validation state
    this.isValid = true;
    this.validationMessageElement = null;

    if (this.props.showValidation) {
      this.validationMessageElement = this.createValidationMessage();
      this.container.appendChild(this.validationMessageElement);
    }
  }

  /**
   * Creates the radio group container
   * @private
   * @returns {HTMLElement} The radio group container element
   */
  createRadioGroupContainer() {
    // Create fieldset container
    const container = this.createElement('fieldset', {
      className: this.createClassNames(
        'radio-group',
        `radio-group--${this.props.layout}`,
        this.props.className
      ),
      attributes: {
        name: this.props.name,
      },
    });

    // Add legend if provided
    if (this.props.legend) {
      const legend = this.createElement('legend', {
        className: 'radio-group__legend',
        textContent: this.props.legend,
      });
      container.appendChild(legend);
    }

    // Create options wrapper
    const optionsWrapper = this.createElement('div', {
      className: `radio-group__options radio-group__options--${this.props.layout}`,
    });

    // Create radio buttons for each option
    this.props.options.forEach((option, index) => {
      const radio = new Radio({
        label: option.label,
        value: option.value,
        id: option.id || `${this.props.name}-${index}`,
        name: this.props.name,
        checked: option.value === this.props.value,
        required: this.props.required && index === 0, // Only set required on first radio
        disabled: this.props.disabled || option.disabled,
        onChange: this.handleRadioChange.bind(this),
      });

      // Add to container
      optionsWrapper.appendChild(radio.getElement());

      // Store reference
      this.radios.push(radio);
    });

    container.appendChild(optionsWrapper);

    return container;
  }

  /**
   * Creates the validation message element
   * @private
   * @returns {HTMLElement} The validation message element
   */
  createValidationMessage() {
    return this.createElement('div', {
      className: 'radio-group__validation-message',
      textContent: this.props.validationMessage || '',
      attributes: {
        'aria-live': 'polite',
      },
    });
  }

  /**
   * Handles radio change events
   * @private
   * @param {Event} event - The change event
   * @param {string} value - The radio value
   */
  handleRadioChange(event, value) {
    // Update internal state
    this.props.value = value;

    // Update checked state of all radios
    this.radios.forEach((radio) => {
      radio.setChecked(radio.getValue() === value);
    });

    // Validate if needed
    if (this.props.showValidation) {
      this.validate();
    }

    // Call onChange callback if provided
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, value);
    }
  }

  /**
   * Validates the radio group
   * @returns {boolean} Whether the radio group is valid
   */
  validate() {
    // A radio group is valid if any radio is checked when required
    const isValid = !this.props.required || this.props.value !== undefined;

    // Update validation state
    this.isValid = isValid;

    // Update validation classes
    if (isValid) {
      this.container.classList.remove('radio-group--invalid');
      this.container.classList.add('radio-group--valid');
    } else {
      this.container.classList.add('radio-group--invalid');
      this.container.classList.remove('radio-group--valid');

      // Update validation message
      if (this.validationMessageElement) {
        this.validationMessageElement.textContent =
          this.props.validationMessage || 'Please select an option';
      }
    }

    return isValid;
  }

  /**
   * Gets the selected value
   * @returns {string} The selected value
   */
  getValue() {
    return this.props.value;
  }

  /**
   * Sets the selected value
   * @param {string} value - The new value
   */
  setValue(value) {
    this.props.value = value;

    // Update checked state of all radios
    this.radios.forEach((radio) => {
      radio.setChecked(radio.getValue() === value);
    });

    // Validate if needed
    if (this.props.showValidation) {
      this.validate();
    }

    return this;
  }

  /**
   * Gets the radio group element
   * @returns {HTMLElement} The radio group container element
   */
  getElement() {
    return this.container;
  }
}
