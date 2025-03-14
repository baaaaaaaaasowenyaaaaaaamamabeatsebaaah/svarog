// src/components/Input/Input.js - Improved Version
import './Input.css';
import { Component } from '../../utils/componentFactory.js';

export default class Input extends Component {
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

    this.container = this.createElement('div', {
      className: this.createClassNames('input-container', this.props.className),
    });

    this.input = this.createInputElement();
    this.container.appendChild(this.input);

    if (this.props.showValidation) {
      this.validationMessage = this.createElement('div', {
        className: 'input-validation-message',
        textContent: this.props.validationMessage || '',
        attributes: { 'aria-live': 'polite' },
      });
      this.container.appendChild(this.validationMessage);
    }
  }

  createInputElement() {
    const {
      type,
      id,
      name,
      value,
      placeholder,
      required,
      pattern,
      minLength,
      maxLength,
      disabled,
      readonly,
    } = this.props;

    const attributes = { type };
    if (id) attributes.id = id;
    if (name) attributes.name = name;
    if (placeholder) attributes.placeholder = placeholder;
    if (required) attributes.required = true;
    if (pattern) attributes.pattern = pattern;
    if (minLength !== undefined) attributes.minLength = minLength;
    if (maxLength !== undefined) attributes.maxLength = maxLength;

    return this.createElement('input', {
      className: 'input',
      attributes,
      value,
      disabled,
      readonly,
      events: {
        input: this.handleInput.bind(this),
        change: this.handleChange.bind(this),
        focus: this.handleFocus.bind(this),
        blur: this.handleBlur.bind(this),
      },
    });
  }

  handleInput(event) {
    this.props.value = event.target.value;
    if (this.props.showValidation) this.validate();
  }

  handleChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event, this.getValue());
    }
  }

  handleFocus(event) {
    this.container.classList.add('input-container--focused');
    if (this.props.onFocus) this.props.onFocus(event);
  }

  handleBlur(event) {
    this.container.classList.remove('input-container--focused');
    if (this.props.showValidation) this.validate();
    if (this.props.onBlur) this.props.onBlur(event);
  }

  validate() {
    const isValid = this.input.checkValidity();

    this.container.classList.toggle('input-container--invalid', !isValid);
    this.container.classList.toggle('input-container--valid', isValid);

    if (!isValid && this.validationMessage) {
      this.validationMessage.textContent =
        this.props.validationMessage || this.input.validationMessage;
    }

    return isValid;
  }

  getValue() {
    return this.props.value;
  }

  setValue(value) {
    this.props.value = value;
    this.input.value = value;
    if (this.props.showValidation) this.validate();
    return this;
  }

  getElement() {
    return this.container;
  }
}
