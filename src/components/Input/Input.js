// src/components/Input/Input.js
import './Input.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Input component for text, email, password, etc.
 * @extends Component
 */
export default class Input extends Component {
  /**
   * Creates a new Input instance
   *
   * @param {Object} props - Input properties
   * @param {string} [props.type='text'] - Input type (text, email, password, etc.)
   * @param {string} [props.id] - Input id
   * @param {string} [props.name] - Input name
   * @param {string} [props.value=''] - Input value
   * @param {string} [props.placeholder=''] - Input placeholder
   * @param {boolean} [props.required=false] - Whether the input is required
   * @param {boolean} [props.disabled=false] - Whether the input is disabled
   * @param {boolean} [props.readonly=false] - Whether the input is readonly
   * @param {string} [props.pattern] - Input validation pattern
   * @param {number} [props.minLength] - Minimum length
   * @param {number} [props.maxLength] - Maximum length
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {Function} [props.onChange] - Change event handler
   * @param {Function} [props.onFocus] - Focus event handler
   * @param {Function} [props.onBlur] - Blur event handler
   * @param {string} [props.validationMessage] - Custom validation message
   * @param {boolean} [props.showValidation=true] - Whether to show validation messages
   */
  constructor({
    type = 'text',
    id,
    name,
    value = '',
    placeholder = '',
    required = false,
    disabled = false,
    readonly = false,
    pattern,
    minLength,
    maxLength,
    className = '',
    onChange,
    onFocus,
    onBlur,
    validationMessage,
    showValidation = true,
  }) {
    super();

    // Store props
    this.props = {
      type,
      id,
      name,
      value,
      placeholder,
      required,
      disabled,
      readonly,
      pattern,
      minLength,
      maxLength,
      className,
      onChange,
      onFocus,
      onBlur,
      validationMessage,
      showValidation,
    };

    // Create element
    this.container = this.createInputContainer();

    // Set initial validation state
    this.isValid = true;
    this.validationMessageElement = null;

    if (this.props.showValidation) {
      this.validationMessageElement = this.createValidationMessage();
      this.container.appendChild(this.validationMessageElement);
    }
  }

  /**
   * Creates the input container
   * @private
   * @returns {HTMLElement} The input container element
   */
  createInputContainer() {
    // Create container div
    const container = this.createElement('div', {
      className: this.createClassNames('input-container', this.props.className),
    });

    // Create the input element
    const input = this.createInputElement();
    container.appendChild(input);

    // Store reference to the input element
    this.input = input;

    return container;
  }

  /**
   * Creates the input element
   * @private
   * @returns {HTMLInputElement} The input element
   */
  createInputElement() {
    const {
      type,
      id,
      name,
      value,
      placeholder,
      required,
      disabled,
      readonly,
      pattern,
      minLength,
      maxLength,
      onChange,
      onFocus,
      onBlur,
    } = this.props;

    // Create attributes object with only defined properties
    const attributes = {};
    if (id) attributes.id = id;
    if (name) attributes.name = name;
    if (placeholder) attributes.placeholder = placeholder;
    if (required) attributes.required = required;
    if (pattern) attributes.pattern = pattern;
    if (minLength !== undefined) attributes.minLength = minLength;
    if (maxLength !== undefined) attributes.maxLength = maxLength;

    // Create input element
    const input = this.createElement('input', {
      className: 'input',
      attributes: {
        type,
        value,
        ...attributes,
      },
      events: {
        input: this.handleInput.bind(this),
        change: this.handleChange.bind(this),
        focus: this.handleFocus.bind(this),
        blur: this.handleBlur.bind(this),
      },
    });

    // Set properties that can't be set via attributes
    if (disabled) input.disabled = true;
    if (readonly) input.readOnly = true;

    return input;
  }

  /**
   * Creates the validation message element
   * @private
   * @returns {HTMLElement} The validation message element
   */
  createValidationMessage() {
    return this.createElement('div', {
      className: 'input-validation-message',
      textContent: this.props.validationMessage || '',
      attributes: {
        'aria-live': 'polite',
      },
    });
  }

  /**
   * Handles input events
   * @private
   * @param {Event} event - The input event
   */
  handleInput(event) {
    // Update internal value
    this.props.value = event.target.value;

    // Validate if needed
    if (this.props.showValidation) {
      this.validate();
    }
  }

  /**
   * Handles change events
   * @private
   * @param {Event} event - The change event
   */
  handleChange(event) {
    // Call onChange callback if provided
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, this.getValue());
    }
  }

  /**
   * Handles focus events
   * @private
   * @param {Event} event - The focus event
   */
  handleFocus(event) {
    this.container.classList.add('input-container--focused');

    // Call onFocus callback if provided
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus(event);
    }
  }

  /**
   * Handles blur events
   * @private
   * @param {Event} event - The blur event
   */
  handleBlur(event) {
    this.container.classList.remove('input-container--focused');

    // Validate on blur
    if (this.props.showValidation) {
      this.validate();
    }

    // Call onBlur callback if provided
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(event);
    }
  }

  /**
   * Validates the input value
   * @private
   * @returns {boolean} Whether the input is valid
   */
  validate() {
    const input = this.input;
    const isValid = input.checkValidity();

    // Update validation state
    this.isValid = isValid;

    // Update validation classes
    if (isValid) {
      this.container.classList.remove('input-container--invalid');
      this.container.classList.add('input-container--valid');
    } else {
      this.container.classList.add('input-container--invalid');
      this.container.classList.remove('input-container--valid');

      // Update validation message
      if (this.validationMessageElement) {
        const message = this.props.validationMessage || input.validationMessage;
        this.validationMessageElement.textContent = message;
      }
    }

    return isValid;
  }

  /**
   * Gets the current value
   * @returns {string} The current value
   */
  getValue() {
    return this.props.value;
  }

  /**
   * Sets the value
   * @param {string} value - The new value
   */
  setValue(value) {
    this.props.value = value;
    this.input.value = value;

    // Validate if needed
    if (this.props.showValidation) {
      this.validate();
    }

    return this;
  }

  /**
   * Checks if the input is valid
   * @returns {boolean} Whether the input is valid
   */
  isValid() {
    return this.validate();
  }

  /**
   * Gets the input element
   * @returns {HTMLElement} The input container element
   */
  getElement() {
    return this.container;
  }
}
