// src/components/Input/Input.js
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
    validationMessage = '',
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

    this.container = this.createInputContainer();
    this.isValid = null; // Start with no validation state

    if (this.props.showValidation) {
      this.validationMessageElement = this.createValidationMessage();
      this.container.appendChild(this.validationMessageElement);
    }

    // Set initial value correctly
    this.setValue(this.props.value);

    // Adds document event listeners for better interaction
    this.documentClickHandler = this.handleDocumentClick.bind(this);
    document.addEventListener('click', this.documentClickHandler);
  }

  createInputContainer() {
    const container = this.createElement('div', {
      className: this.createClassNames('input-container', this.props.className),
    });

    // Create both the native input (for accessibility/form submission) and custom UI
    const inputWrapper = this.createElement('div', {
      className: 'input-wrapper',
    });

    // Create native input (hidden visually but accessible)
    const nativeInput = this.createNativeInput();
    inputWrapper.appendChild(nativeInput);
    this.input = nativeInput; // Maintain backward compatibility

    // Create custom UI elements
    const customInput = this.createCustomInput();
    inputWrapper.appendChild(customInput);
    this.customInput = customInput;

    container.appendChild(inputWrapper);

    return container;
  }

  createNativeInput() {
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
    if (disabled) attributes.disabled = true;
    if (readonly) attributes.readOnly = true;

    return this.createElement('input', {
      className: 'input-native',
      attributes,
      value,
      events: {
        input: this.handleInput.bind(this),
        change: this.handleChange.bind(this),
        focus: this.handleFocus.bind(this),
        blur: this.handleBlur.bind(this),
        keydown: this.handleKeydown.bind(this),
      },
    });
  }

  createCustomInput() {
    const { placeholder, disabled, readonly, type } = this.props;

    // Create custom input container
    const customInput = this.createElement('div', {
      className: this.createClassNames(
        'input-custom',
        disabled ? 'input-custom--disabled' : '',
        readonly ? 'input-custom--readonly' : '',
        `input-custom--${type}`
      ),
      attributes: {
        tabindex: '-1', // Make non-focusable as the native input handles focus
        role: 'textbox',
        'aria-readonly': readonly ? 'true' : 'false',
        'aria-disabled': disabled ? 'true' : 'false',
      },
    });

    // Create value display area
    const valueDisplay = this.createElement('div', {
      className: 'input-custom__value',
      attributes: {
        'data-placeholder': placeholder,
      },
    });
    this.valueDisplay = valueDisplay;
    customInput.appendChild(valueDisplay);

    // Add type-specific elements (like clear button for search, password toggle, etc.)
    this.addTypeSpecificElements(customInput, type);

    return customInput;
  }

  addTypeSpecificElements(customInput, type) {
    switch (type) {
      case 'search': {
        // Add clear button for search
        const clearButton = this.createElement('button', {
          className: 'input-custom__clear',
          type: 'button',
          attributes: {
            'aria-label': 'Clear search',
            tabindex: '-1',
          },
          events: {
            click: this.handleClearClick.bind(this),
          },
        });
        customInput.appendChild(clearButton);
        break;
      }

      case 'password': {
        // Add toggle password visibility button
        const toggleButton = this.createElement('button', {
          className: 'input-custom__toggle',
          type: 'button',
          attributes: {
            'aria-label': 'Toggle password visibility',
            tabindex: '-1',
          },
          events: {
            click: this.handleTogglePassword.bind(this),
          },
        });
        customInput.appendChild(toggleButton);
        this.isPasswordVisible = false;
        break;
      }

      case 'number': {
        // Add increment/decrement buttons
        const controlsWrapper = this.createElement('div', {
          className: 'input-custom__number-controls',
        });

        const incrementButton = this.createElement('button', {
          className: 'input-custom__increment',
          type: 'button',
          attributes: {
            'aria-label': 'Increment value',
            tabindex: '-1',
          },
          events: {
            click: this.handleIncrement.bind(this),
          },
        });

        const decrementButton = this.createElement('button', {
          className: 'input-custom__decrement',
          type: 'button',
          attributes: {
            'aria-label': 'Decrement value',
            tabindex: '-1',
          },
          events: {
            click: this.handleDecrement.bind(this),
          },
        });

        controlsWrapper.appendChild(incrementButton);
        controlsWrapper.appendChild(decrementButton);
        customInput.appendChild(controlsWrapper);
        break;
      }
    }
  }

  createValidationMessage() {
    return this.createElement('div', {
      className: 'input-validation-message',
      textContent: this.props.validationMessage || '',
      attributes: { 'aria-live': 'polite' },
    });
  }

  handleInput(event) {
    this.props.value = event.target.value;
    this.updateValueDisplay();

    if (this.props.showValidation && this.isValid !== null) {
      this.validate();
    }
  }

  handleChange(event) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, this.getValue());
    }
  }

  handleFocus(event) {
    this.container.classList.add('input-container--focused');
    this.customInput.classList.add('input-custom--focused');
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus(event);
    }
  }

  handleBlur(event) {
    this.container.classList.remove('input-container--focused');
    this.customInput.classList.remove('input-custom--focused');

    if (this.props.showValidation && this.isValid !== null) {
      this.validate();
    }

    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(event);
    }
  }

  handleKeydown(event) {
    // Handle special keys based on input type
    switch (this.props.type) {
      case 'number':
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          this.handleIncrement();
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          this.handleDecrement();
        }
        break;

      case 'search':
        if (event.key === 'Escape') {
          event.preventDefault();
          this.setValue('');
        }
        break;
    }
  }

  handleClearClick(event) {
    event.preventDefault();
    this.setValue('');
    this.input.focus();
  }

  handleTogglePassword(event) {
    event.preventDefault();
    this.isPasswordVisible = !this.isPasswordVisible;

    // Update the native input type
    if (this.isPasswordVisible) {
      this.input.type = 'text';
      event.currentTarget.setAttribute('aria-label', 'Hide password');
      event.currentTarget.classList.add('input-custom__toggle--visible');
    } else {
      this.input.type = 'password';
      event.currentTarget.setAttribute('aria-label', 'Show password');
      event.currentTarget.classList.remove('input-custom__toggle--visible');
    }

    this.input.focus();
  }

  handleIncrement() {
    if (this.props.disabled || this.props.readonly) return;

    let value = parseFloat(this.getValue()) || 0;
    const step = parseFloat(this.input.step) || 1;
    const max = this.input.max ? parseFloat(this.input.max) : Infinity;

    value = Math.min(value + step, max);
    this.setValue(value.toString());
    this.input.focus();
  }

  handleDecrement() {
    if (this.props.disabled || this.props.readonly) return;

    let value = parseFloat(this.getValue()) || 0;
    const step = parseFloat(this.input.step) || 1;
    const min = this.input.min ? parseFloat(this.input.min) : -Infinity;

    value = Math.max(value - step, min);
    this.setValue(value.toString());
    this.input.focus();
  }

  handleDocumentClick() {
    // For future use - keeping the method as a placeholder
    // This might be used for handling clicks outside the input for advanced features
  }

  updateValueDisplay() {
    const value = this.getValue();

    if (value) {
      this.valueDisplay.textContent = value;
      this.valueDisplay.classList.add('input-custom__value--has-value');
    } else {
      this.valueDisplay.textContent = '';
      this.valueDisplay.classList.remove('input-custom__value--has-value');
    }

    // Update password input visibility if needed
    if (this.props.type === 'password' && this.isPasswordVisible) {
      this.input.type = 'text';
    }

    // Update other type-specific displays
    if (this.props.type === 'search' && value) {
      this.customInput.classList.add('input-custom--has-value');
    } else if (this.props.type === 'search') {
      this.customInput.classList.remove('input-custom--has-value');
    }
  }

  validate() {
    const isValid = this.input.checkValidity();
    this.isValid = isValid;

    this.updateValidationStyles(isValid);
    return isValid;
  }

  updateValidationStyles(isValid) {
    // Update container classes
    this.container.classList.toggle('input-container--invalid', !isValid);
    this.container.classList.toggle('input-container--valid', isValid);
    this.container.classList.toggle('has-error', !isValid);
    this.container.classList.toggle('has-success', isValid);

    // Update custom input classes
    this.customInput.classList.toggle('input-custom--invalid', !isValid);
    this.customInput.classList.toggle('input-custom--valid', isValid);

    // Update validation message
    if (this.validationMessageElement) {
      if (!isValid) {
        // Only set validation message text if invalid
        this.validationMessageElement.textContent =
          this.props.validationMessage || this.input.validationMessage;
      } else {
        // Clear validation message when valid
        this.validationMessageElement.textContent = '';
      }
    }
  }

  getValue() {
    return this.props.value;
  }

  setValue(value) {
    this.props.value = value;
    this.input.value = value;
    this.updateValueDisplay();

    if (this.props.showValidation && this.isValid !== null) {
      this.validate();
    }

    return this;
  }

  getElement() {
    return this.container;
  }

  // Clean up event listeners to prevent memory leaks
  destroy() {
    document.removeEventListener('click', this.documentClickHandler);
  }
}
