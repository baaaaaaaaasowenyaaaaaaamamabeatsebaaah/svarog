// src/components/Input/Input.js
import './Input.css';

/**
 * Create an Input component
 * @param {Object} props - Input properties
 * @returns {Object} Input component
 */
const Input = (props) => {
  const {
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
  } = props;

  // State
  let inputState = {
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
    isValid: null, // Start with no validation state
    isPasswordVisible: false,
  };

  // Create the input container
  const container = document.createElement('div');
  container.className = 'input-container';
  if (className) {
    container.className += ' ' + className;
  }

  // Create input wrapper
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'input-wrapper';
  container.appendChild(inputWrapper);

  // Create native input
  const input = document.createElement('input');
  input.className = 'input-native';
  input.type = type;
  if (id) input.id = id;
  if (name) input.name = name;
  if (placeholder) input.placeholder = placeholder;
  if (required) input.required = true;
  if (pattern) input.pattern = pattern;
  if (minLength !== undefined) input.minLength = minLength;
  if (maxLength !== undefined) input.maxLength = maxLength;
  if (disabled) input.disabled = true;
  if (readonly) input.readOnly = true;
  input.value = value;

  // Add event listeners
  input.addEventListener('input', handleInput);
  input.addEventListener('change', handleChange);
  input.addEventListener('focus', handleFocus);
  input.addEventListener('blur', handleBlur);
  input.addEventListener('keydown', handleKeydown);

  inputWrapper.appendChild(input);

  // Create custom input UI
  const customInput = document.createElement('div');
  customInput.className = `input-custom input-custom--${type}`;
  if (disabled) customInput.classList.add('input-custom--disabled');
  if (readonly) customInput.classList.add('input-custom--readonly');
  customInput.setAttribute('tabindex', '-1');
  customInput.setAttribute('role', 'textbox');
  customInput.setAttribute('aria-readonly', readonly ? 'true' : 'false');
  customInput.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  inputWrapper.appendChild(customInput);

  // Create value display element
  const valueDisplay = document.createElement('div');
  valueDisplay.className = 'input-custom__value';
  valueDisplay.setAttribute('data-placeholder', placeholder);
  customInput.appendChild(valueDisplay);

  // Add type-specific elements
  if (type === 'search') {
    // Add clear button for search
    const clearButton = document.createElement('button');
    clearButton.className = 'input-custom__clear';
    clearButton.type = 'button';
    clearButton.setAttribute('aria-label', 'Clear search');
    clearButton.setAttribute('tabindex', '-1');
    clearButton.addEventListener('click', handleClearClick);
    customInput.appendChild(clearButton);
  } else if (type === 'password') {
    // Add toggle password visibility button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'input-custom__toggle';
    toggleButton.type = 'button';
    toggleButton.setAttribute('aria-label', 'Toggle password visibility');
    toggleButton.setAttribute('tabindex', '-1');
    toggleButton.addEventListener('click', handleTogglePassword);
    customInput.appendChild(toggleButton);
  } else if (type === 'number') {
    // Add increment/decrement buttons
    const controlsWrapper = document.createElement('div');
    controlsWrapper.className = 'input-custom__number-controls';

    const incrementButton = document.createElement('button');
    incrementButton.className = 'input-custom__increment';
    incrementButton.type = 'button';
    incrementButton.setAttribute('aria-label', 'Increment value');
    incrementButton.setAttribute('tabindex', '-1');
    incrementButton.addEventListener('click', handleIncrement);

    const decrementButton = document.createElement('button');
    decrementButton.className = 'input-custom__decrement';
    decrementButton.type = 'button';
    decrementButton.setAttribute('aria-label', 'Decrement value');
    decrementButton.setAttribute('tabindex', '-1');
    decrementButton.addEventListener('click', handleDecrement);

    controlsWrapper.appendChild(incrementButton);
    controlsWrapper.appendChild(decrementButton);
    customInput.appendChild(controlsWrapper);
  }

  // Create validation message element
  const validationMessageElement = document.createElement('div');
  validationMessageElement.className = 'input-validation-message';
  validationMessageElement.textContent = validationMessage || '';
  validationMessageElement.setAttribute('aria-live', 'polite');
  if (!showValidation) {
    validationMessageElement.style.display = 'none';
  }
  container.appendChild(validationMessageElement);

  // Document event handler for click handling
  const documentClickHandler = () => {
    // For future use - for handling clicks outside the input
  };
  document.addEventListener('click', documentClickHandler);

  // Set initial value display
  updateValueDisplay();

  /**
   * Handle input event
   * @param {Event} event - Input event
   */
  function handleInput(event) {
    inputState.value = event.target.value;
    updateValueDisplay();

    if (inputState.showValidation && inputState.isValid !== null) {
      validate();
    }
  }

  /**
   * Handle change event
   * @param {Event} event - Change event
   */
  function handleChange(event) {
    if (typeof onChange === 'function') {
      onChange(event, getValue());
    }
  }

  /**
   * Handle focus event
   * @param {Event} event - Focus event
   */
  function handleFocus(event) {
    container.classList.add('input-container--focused');
    customInput.classList.add('input-custom--focused');
    if (typeof onFocus === 'function') {
      onFocus(event);
    }
  }

  /**
   * Handle blur event
   * @param {Event} event - Blur event
   */
  function handleBlur(event) {
    container.classList.remove('input-container--focused');
    customInput.classList.remove('input-custom--focused');

    if (inputState.showValidation && inputState.isValid !== null) {
      validate();
    }

    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  }

  /**
   * Handle keydown event
   * @param {Event} event - Keydown event
   */
  function handleKeydown(event) {
    // Handle special keys based on input type
    switch (type) {
      case 'number':
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          handleIncrement();
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          handleDecrement();
        }
        break;

      case 'search':
        if (event.key === 'Escape') {
          event.preventDefault();
          setValue('');
        }
        break;
    }
  }

  /**
   * Update the displayed value
   */
  function updateValueDisplay() {
    const value = getValue();

    if (value) {
      valueDisplay.textContent = value;
      valueDisplay.classList.add('input-custom__value--has-value');
    } else {
      valueDisplay.textContent = '';
      valueDisplay.classList.remove('input-custom__value--has-value');
    }

    // Update password input visibility if needed
    if (type === 'password' && inputState.isPasswordVisible) {
      input.type = 'text';
    }

    // Update other type-specific displays
    if (type === 'search' && value) {
      customInput.classList.add('input-custom--has-value');
    } else if (type === 'search') {
      customInput.classList.remove('input-custom--has-value');
    }
  }

  /**
   * Handle clear button click for search inputs
   * @param {Event} event - Click event
   */
  function handleClearClick(event) {
    event.preventDefault();
    setValue('');
    input.focus();
  }

  /**
   * Handle toggle password visibility
   * @param {Event} event - Click event
   */
  function handleTogglePassword(event) {
    event.preventDefault();
    inputState.isPasswordVisible = !inputState.isPasswordVisible;

    // Update the native input type
    if (inputState.isPasswordVisible) {
      input.type = 'text';
      event.currentTarget.setAttribute('aria-label', 'Hide password');
      event.currentTarget.classList.add('input-custom__toggle--visible');
    } else {
      input.type = 'password';
      event.currentTarget.setAttribute('aria-label', 'Show password');
      event.currentTarget.classList.remove('input-custom__toggle--visible');
    }

    input.focus();
  }

  /**
   * Handle increment button click for number inputs
   */
  function handleIncrement() {
    if (inputState.disabled || inputState.readonly) return;

    let value = parseFloat(getValue()) || 0;
    const step = parseFloat(input.step) || 1;
    const max = input.max ? parseFloat(input.max) : Infinity;

    value = Math.min(value + step, max);
    setValue(value.toString());
    input.focus();
  }

  /**
   * Handle decrement button click for number inputs
   */
  function handleDecrement() {
    if (inputState.disabled || inputState.readonly) return;

    let value = parseFloat(getValue()) || 0;
    const step = parseFloat(input.step) || 1;
    const min = input.min ? parseFloat(input.min) : -Infinity;

    value = Math.max(value - step, min);
    setValue(value.toString());
    input.focus();
  }

  /**
   * Validate the input
   * @returns {boolean} Whether the input is valid
   */
  function validate() {
    const isValid = input.checkValidity();
    inputState.isValid = isValid;

    // Update container classes
    container.classList.toggle('input-container--invalid', !isValid);
    container.classList.toggle('input-container--valid', isValid);
    container.classList.toggle('has-error', !isValid);
    container.classList.toggle('has-success', isValid);

    // Update custom input classes
    customInput.classList.toggle('input-custom--invalid', !isValid);
    customInput.classList.toggle('input-custom--valid', isValid);

    // Update validation message
    if (validationMessageElement) {
      if (!isValid) {
        // Only set validation message text if invalid
        validationMessageElement.textContent =
          inputState.validationMessage || input.validationMessage;
      } else {
        // Clear validation message when valid
        validationMessageElement.textContent = '';
      }
    }

    return isValid;
  }

  /**
   * Get the input value
   * @returns {string} Current input value
   */
  function getValue() {
    return inputState.value;
  }

  /**
   * Set the input value
   * @param {string} newValue - New input value
   * @returns {Object} Input component (for chaining)
   */
  function setValue(newValue) {
    inputState.value = newValue;
    input.value = newValue;
    updateValueDisplay();

    if (inputState.showValidation && inputState.isValid !== null) {
      validate();
    }

    return api;
  }

  // Create public API
  const api = {
    /**
     * Get the input element
     * @returns {HTMLElement} Input container element
     */
    getElement() {
      return container;
    },

    /**
     * Get the input value
     * @returns {string} Current input value
     */
    getValue,

    /**
     * Set the input value
     * @param {string} newValue - New input value
     * @returns {Object} Input component (for chaining)
     */
    setValue,

    /**
     * Validate the input
     * @returns {boolean} Whether the input is valid
     */
    validate,

    /**
     * Update multiple props at once
     * @param {Object} newProps - New properties
     * @returns {Object} Input component (for chaining)
     */
    update(newProps) {
      // Update state with new props
      Object.assign(inputState, newProps);

      // Update simple properties
      if (newProps.value !== undefined) {
        setValue(newProps.value);
      }

      if (newProps.disabled !== undefined) {
        input.disabled = inputState.disabled;
        customInput.classList.toggle(
          'input-custom--disabled',
          inputState.disabled
        );
        customInput.setAttribute(
          'aria-disabled',
          inputState.disabled ? 'true' : 'false'
        );
      }

      if (newProps.readonly !== undefined) {
        input.readOnly = inputState.readonly;
        customInput.classList.toggle(
          'input-custom--readonly',
          inputState.readonly
        );
        customInput.setAttribute(
          'aria-readonly',
          inputState.readonly ? 'true' : 'false'
        );
      }

      if (newProps.validationMessage !== undefined) {
        if (inputState.isValid === false) {
          validationMessageElement.textContent = inputState.validationMessage;
        }
      }

      return api;
    },

    /**
     * Clean up resources
     */
    destroy() {
      document.removeEventListener('click', documentClickHandler);
    },
  };

  return api;
};

// Export component
export default Input;
