// src/components/Input/Input.js
import './Input.css';
import { createElement } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';

/**
 * Create an Input component
 * @param {Object} props - Input properties
 * @returns {Object} Input component
 */
const createInput = (props) => {
  // Initial state
  let state = {
    type: props.type || 'text',
    id: props.id,
    name: props.name,
    value: props.value || '',
    placeholder: props.placeholder || '',
    required: props.required || false,
    disabled: props.disabled || false,
    readonly: props.readonly || false,
    pattern: props.pattern,
    minLength: props.minLength,
    maxLength: props.maxLength,
    className: props.className || '',
    onChange: props.onChange,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    validationMessage: props.validationMessage || '',
    showValidation:
      props.showValidation !== undefined ? props.showValidation : true,
    isValid: null,
    isPasswordVisible: false,
  };

  // Create container
  const container = createElement('div', {
    classes: ['input-container', state.className],
  });

  // Create input wrapper
  const inputWrapper = createElement('div', {
    classes: ['input-wrapper'],
  });
  container.appendChild(inputWrapper);

  // Create native input
  const input = createElement('input', {
    classes: ['input-native'],
    attributes: {
      type: state.type,
      id: state.id,
      name: state.name,
      placeholder: state.placeholder,
      required: state.required ? 'required' : null,
      pattern: state.pattern,
      minLength: state.minLength !== undefined ? state.minLength : null,
      maxLength: state.maxLength !== undefined ? state.maxLength : null,
      disabled: state.disabled ? 'disabled' : null,
      readOnly: state.readonly ? 'readonly' : null,
    },
  });

  // Set value directly
  input.value = state.value;

  // Add event listeners
  input.addEventListener('input', handleInput);
  input.addEventListener('change', handleChange);
  input.addEventListener('focus', handleFocus);
  input.addEventListener('blur', handleBlur);
  input.addEventListener('keydown', handleKeydown);

  inputWrapper.appendChild(input);

  // Create custom input
  const customInput = createElement('div', {
    classes: ['input-custom', `input-custom--${state.type}`],
    attributes: {
      tabindex: '-1',
      role: 'textbox',
      'aria-readonly': state.readonly ? 'true' : 'false',
      'aria-disabled': state.disabled ? 'true' : 'false',
    },
  });

  if (state.disabled) {
    customInput.classList.add('input-custom--disabled');
  }

  if (state.readonly) {
    customInput.classList.add('input-custom--readonly');
  }

  inputWrapper.appendChild(customInput);

  // Create value display
  const valueDisplay = createElement('div', {
    classes: ['input-custom__value'],
    attributes: {
      'data-placeholder': state.placeholder,
    },
    text: state.value,
  });

  if (state.value) {
    valueDisplay.classList.add('input-custom__value--has-value');
  }

  customInput.appendChild(valueDisplay);

  // Add type-specific elements
  if (state.type === 'search') {
    const clearButton = createElement('button', {
      classes: ['input-custom__clear'],
      attributes: {
        type: 'button',
        'aria-label': 'Clear search',
        tabindex: '-1',
      },
    });
    clearButton.addEventListener('click', handleClearClick);
    customInput.appendChild(clearButton);

    if (state.value) {
      customInput.classList.add('input-custom--has-value');
    }
  } else if (state.type === 'password') {
    const toggleButton = createElement('button', {
      classes: ['input-custom__toggle'],
      attributes: {
        type: 'button',
        'aria-label': 'Toggle password visibility',
        tabindex: '-1',
      },
    });
    toggleButton.addEventListener('click', handleTogglePassword);
    customInput.appendChild(toggleButton);
  } else if (state.type === 'number') {
    const controlsWrapper = createElement('div', {
      classes: ['input-custom__number-controls'],
    });

    const incrementButton = createElement('button', {
      classes: ['input-custom__increment'],
      attributes: {
        type: 'button',
        'aria-label': 'Increment value',
        tabindex: '-1',
      },
    });
    incrementButton.addEventListener('click', handleIncrement);

    const decrementButton = createElement('button', {
      classes: ['input-custom__decrement'],
      attributes: {
        type: 'button',
        'aria-label': 'Decrement value',
        tabindex: '-1',
      },
    });
    decrementButton.addEventListener('click', handleDecrement);

    controlsWrapper.appendChild(incrementButton);
    controlsWrapper.appendChild(decrementButton);
    customInput.appendChild(controlsWrapper);
  }

  // Create validation message
  const validationMessageElement = createElement('div', {
    classes: ['input-validation-message'],
    attributes: {
      'aria-live': 'polite',
    },
    text: state.validationMessage,
  });

  if (!state.showValidation) {
    validationMessageElement.style.display = 'none';
  }

  container.appendChild(validationMessageElement);

  // Document event handler for click handling
  const documentClickHandler = () => {
    // For future use - for handling clicks outside the input
  };
  document.addEventListener('click', documentClickHandler);

  // Event handlers
  function handleInput(event) {
    state.value = event.target.value;
    updateValueDisplay();

    if (state.showValidation && state.isValid !== null) {
      validate();
    }
  }

  function handleChange(event) {
    if (typeof state.onChange === 'function') {
      state.onChange(event, getValue());
    }
  }

  function handleFocus(event) {
    container.classList.add('input-container--focused');
    customInput.classList.add('input-custom--focused');
    if (typeof state.onFocus === 'function') {
      state.onFocus(event);
    }
  }

  function handleBlur(event) {
    container.classList.remove('input-container--focused');
    customInput.classList.remove('input-custom--focused');

    if (state.showValidation && state.isValid !== null) {
      validate();
    }

    if (typeof state.onBlur === 'function') {
      state.onBlur(event);
    }
  }

  function handleKeydown(event) {
    switch (state.type) {
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

  function updateValueDisplay() {
    // Update value display
    valueDisplay.textContent = state.value;
    valueDisplay.classList.toggle(
      'input-custom__value--has-value',
      !!state.value
    );

    // Update search type
    if (state.type === 'search') {
      customInput.classList.toggle('input-custom--has-value', !!state.value);
    }
  }

  function handleClearClick(event) {
    event.preventDefault();
    setValue('');
    input.focus();
  }

  function handleTogglePassword(event) {
    event.preventDefault();
    state.isPasswordVisible = !state.isPasswordVisible;

    // Update the type
    input.type = state.isPasswordVisible ? 'text' : 'password';

    // Update toggle button
    event.currentTarget.setAttribute(
      'aria-label',
      state.isPasswordVisible ? 'Hide password' : 'Show password'
    );
    event.currentTarget.classList.toggle(
      'input-custom__toggle--visible',
      state.isPasswordVisible
    );

    input.focus();
  }

  function handleIncrement() {
    if (state.disabled || state.readonly) return;

    const numValue = parseFloat(getValue()) || 0;
    const step = parseFloat(input.step) || 1;
    const max = input.max ? parseFloat(input.max) : Infinity;

    setValue(Math.min(numValue + step, max).toString());
    input.focus();
  }

  function handleDecrement() {
    if (state.disabled || state.readonly) return;

    const numValue = parseFloat(getValue()) || 0;
    const step = parseFloat(input.step) || 1;
    const min = input.min ? parseFloat(input.min) : -Infinity;

    setValue(Math.max(numValue - step, min).toString());
    input.focus();
  }

  function getValue() {
    return state.value;
  }

  function setValue(newValue) {
    state.value = newValue;
    input.value = newValue;
    updateValueDisplay();

    if (state.showValidation && state.isValid !== null) {
      validate();
    }

    return api;
  }

  function validate() {
    const isValid = input.checkValidity();
    state.isValid = isValid;

    // Set data-valid attribute
    container.setAttribute('data-valid', isValid ? 'true' : 'false');

    // Update container classes
    container.classList.toggle('input-container--invalid', !isValid);
    container.classList.toggle('input-container--valid', isValid);
    container.classList.toggle('has-error', !isValid);
    container.classList.toggle('has-success', isValid);

    // Update custom input classes
    customInput.classList.toggle('input-custom--invalid', !isValid);
    customInput.classList.toggle('input-custom--valid', isValid);

    // Update validation message
    if (!isValid) {
      validationMessageElement.textContent =
        state.validationMessage || input.validationMessage;
    } else {
      validationMessageElement.textContent = '';
    }

    return isValid;
  }

  // API
  const api = {
    getElement() {
      return container;
    },

    getValue,

    setValue,

    validate,

    update(newProps) {
      // Update state
      Object.assign(state, newProps);

      // Update value
      if (newProps.value !== undefined) {
        input.value = newProps.value;
        updateValueDisplay();
      }

      // Update password visibility
      if (
        newProps.isPasswordVisible !== undefined &&
        state.type === 'password'
      ) {
        input.type = newProps.isPasswordVisible ? 'text' : 'password';
        const toggleButton = container.querySelector('.input-custom__toggle');
        if (toggleButton) {
          toggleButton.classList.toggle(
            'input-custom__toggle--visible',
            newProps.isPasswordVisible
          );
          toggleButton.setAttribute(
            'aria-label',
            newProps.isPasswordVisible ? 'Hide password' : 'Show password'
          );
        }
      }

      // Update disabled state
      if (newProps.disabled !== undefined) {
        input.disabled = newProps.disabled;
        customInput.classList.toggle(
          'input-custom--disabled',
          newProps.disabled
        );
        customInput.setAttribute(
          'aria-disabled',
          newProps.disabled ? 'true' : 'false'
        );
      }

      // Update readonly state
      if (newProps.readonly !== undefined) {
        input.readOnly = newProps.readonly;
        customInput.classList.toggle(
          'input-custom--readonly',
          newProps.readonly
        );
        customInput.setAttribute(
          'aria-readonly',
          newProps.readonly ? 'true' : 'false'
        );
      }

      // Update validation message
      if (newProps.validationMessage !== undefined && state.isValid === false) {
        validationMessageElement.textContent = newProps.validationMessage;
      }

      return api;
    },

    onThemeChange() {
      // Theme-specific adjustments
    },

    destroy() {
      // Clean up event listeners
      input.removeEventListener('input', handleInput);
      input.removeEventListener('change', handleChange);
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('keydown', handleKeydown);

      // Clean up type-specific listeners
      if (state.type === 'search') {
        const clearButton = container.querySelector('.input-custom__clear');
        if (clearButton)
          clearButton.removeEventListener('click', handleClearClick);
      } else if (state.type === 'password') {
        const toggleButton = container.querySelector('.input-custom__toggle');
        if (toggleButton)
          toggleButton.removeEventListener('click', handleTogglePassword);
      } else if (state.type === 'number') {
        const incrementButton = container.querySelector(
          '.input-custom__increment'
        );
        const decrementButton = container.querySelector(
          '.input-custom__decrement'
        );
        if (incrementButton)
          incrementButton.removeEventListener('click', handleIncrement);
        if (decrementButton)
          decrementButton.removeEventListener('click', handleDecrement);
      }

      document.removeEventListener('click', documentClickHandler);
    },
  };

  return api;
};

// Enhance with theme awareness
export default withThemeAwareness(createInput);
