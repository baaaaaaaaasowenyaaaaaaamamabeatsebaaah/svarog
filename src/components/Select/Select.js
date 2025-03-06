import './Select.css';
import { Component } from '../../utils/componentFactory.js';

export default class Select extends Component {
  constructor({
    options = [],
    id,
    name,
    value = '',
    placeholder = 'Select an option',
    required = false,
    disabled = false,
    multiple = false,
    className = '',
    onChange,
    onFocus,
    onBlur,
    validationMessage,
    showValidation = true,
  }) {
    super();

    if (!Array.isArray(options)) {
      throw new Error('Select: options must be an array');
    }

    this.props = {
      options,
      id,
      name,
      value,
      placeholder,
      required,
      disabled,
      multiple,
      className,
      onChange,
      onFocus,
      onBlur,
      validationMessage,
      showValidation,
    };

    this.container = this.createSelectContainer();
    this.isValid = true;
    this.validationMessageElement = null;

    if (this.props.showValidation) {
      this.validationMessageElement = this.createValidationMessage();
      this.container.appendChild(this.validationMessageElement);
    }

    // ✅ Set initial value correctly
    this.setValue(this.props.value);
  }

  createSelectContainer() {
    const container = this.createElement('div', {
      className: this.createClassNames(
        'select-container',
        this.props.className
      ),
    });

    const select = this.createSelectElement();
    container.appendChild(select);
    this.select = select;

    return container;
  }

  createSelectElement() {
    const { options, id, name, required, disabled, multiple } = this.props;

    const attributes = {};
    if (id) attributes.id = id;
    if (name) attributes.name = name;
    if (required) attributes.required = required;
    if (multiple) attributes.multiple = true;

    const select = this.createElement('select', {
      className: 'select',
      attributes,
      events: {
        change: this.handleChange.bind(this),
        focus: this.handleFocus.bind(this),
        blur: this.handleBlur.bind(this),
      },
    });

    if (disabled) select.disabled = true;

    // Placeholder for single select only
    if (!multiple && this.props.placeholder) {
      const placeholderOption = this.createElement('option', {
        attributes: {
          value: '',
          disabled: true,
          selected: true,
        },
        textContent: this.props.placeholder,
      });
      select.appendChild(placeholderOption);
    }

    options.forEach((option) => {
      const optionElement = this.createElement('option', {
        attributes: { value: option.value },
        textContent: option.label || option.value,
      });
      select.appendChild(optionElement);
    });

    return select;
  }

  createValidationMessage() {
    return this.createElement('div', {
      className: 'select-validation-message',
      textContent: this.props.validationMessage || '',
      attributes: { 'aria-live': 'polite' },
    });
  }

  handleChange(event) {
    if (this.props.multiple) {
      const selectedOptions = Array.from(event.target.selectedOptions);
      this.props.value = selectedOptions.map((option) => option.value);
    } else {
      this.props.value = event.target.value;
    }

    if (this.props.showValidation) {
      this.validate();
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, this.getValue());
    }
  }

  handleFocus(event) {
    this.container.classList.add('select-container--focused');
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus(event);
    }
  }

  handleBlur(event) {
    this.container.classList.remove('select-container--focused');
    if (this.props.showValidation) {
      this.validate();
    }
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(event);
    }
  }

  validate() {
    let isValid = true;

    if (this.props.required) {
      if (this.props.multiple) {
        isValid =
          Array.isArray(this.props.value) && this.props.value.length > 0;
      } else {
        isValid = !!this.props.value && this.props.value !== '';
      }
    }

    this.isValid = isValid;
    this.updateValidationStyles(isValid);
    return isValid;
  }

  updateValidationStyles(isValid) {
    if (isValid) {
      this.container.classList.remove('select-container--invalid');
      this.container.classList.add('select-container--valid');
    } else {
      this.container.classList.add('select-container--invalid');
      this.container.classList.remove('select-container--valid');

      if (this.validationMessageElement) {
        const message =
          this.props.validationMessage || 'Please select an option';
        this.validationMessageElement.textContent = message;
      }
    }
  }

  getValue() {
    return this.props.value;
  }

  setValue(value) {
    this.props.value = value;

    if (this.props.multiple && Array.isArray(value)) {
      Array.from(this.select.options).forEach((option) => {
        option.selected = value.includes(option.value);
      });
    } else {
      this.select.value = value;
    }

    if (this.props.showValidation) {
      this.validate();
    }
    return this;
  }

  getElement() {
    return this.container;
  }
}
