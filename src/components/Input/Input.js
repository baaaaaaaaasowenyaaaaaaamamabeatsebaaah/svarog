// src/components/Input/Input.js
import './Input.css';
import { createElement, appendChildren } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { validateInput } from '../../utils/validation.js';

/**
 * Create an Input component
 * @param {Object} props - Input properties
 * @returns {Object} Input component
 */
const createInput = (props) => {
  // Use base component for standardized lifecycle
  const baseComponent = createBaseComponent((state) => {
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
      validationMessage = '',
      showValidation = true,
      isValid = null,
      isPasswordVisible = false,
    } = state;

    // Create container with data attribute for delegation
    const container = createElement('div', {
      classes: ['input-container', className],
      attributes: {
        'data-component': 'input',
        'data-type': type,
        'data-valid':
          isValid === true ? 'true' : isValid === false ? 'false' : null,
      },
    });

    // Create input wrapper
    const inputWrapper = createElement('div', {
      classes: ['input-wrapper'],
    });

    // Create native input
    const inputAttributes = {
      type: type === 'password' && isPasswordVisible ? 'text' : type,
      id,
      name,
      placeholder,
      required: required ? 'required' : null,
      pattern,
      'aria-required': required ? 'true' : null,
      'aria-invalid': isValid === false ? 'true' : null,
      'data-element': 'input',
    };

    // Add optional attributes
    if (minLength !== undefined) inputAttributes.minLength = minLength;
    if (maxLength !== undefined) inputAttributes.maxLength = maxLength;
    if (disabled) inputAttributes.disabled = true;
    if (readonly) inputAttributes.readOnly = true;

    const input = createElement('input', {
      classes: ['input-native'],
      attributes: inputAttributes,
    });

    // Set value directly
    input.value = value;

    // Create custom input UI
    const customClasses = ['input-custom', `input-custom--${type}`];
    if (disabled) customClasses.push('input-custom--disabled');
    if (readonly) customClasses.push('input-custom--readonly');
    if (isValid === true) customClasses.push('input-custom--valid');
    if (isValid === false) customClasses.push('input-custom--invalid');
    if (value) customClasses.push('input-custom--has-value');

    const customInput = createElement('div', {
      classes: customClasses,
      attributes: {
        tabindex: '-1',
        role: 'textbox',
        'aria-readonly': readonly ? 'true' : 'false',
        'aria-disabled': disabled ? 'true' : 'false',
        'data-element': 'custom-input',
      },
    });

    // Create value display element
    const valueDisplay = createElement('div', {
      classes: [
        'input-custom__value',
        value ? 'input-custom__value--has-value' : '',
      ],
      attributes: {
        'data-placeholder': placeholder,
        'data-element': 'value-display',
      },
      text: value,
    });

    customInput.appendChild(valueDisplay);

    // Add type-specific elements
    if (type === 'search') {
      // Add clear button for search
      const clearButton = createElement('button', {
        classes: ['input-custom__clear'],
        attributes: {
          type: 'button',
          'aria-label': 'Clear search',
          tabindex: '-1',
          'data-action': 'clear',
        },
      });
      customInput.appendChild(clearButton);
    } else if (type === 'password') {
      // Add toggle password visibility button
      const toggleButton = createElement('button', {
        classes: [
          'input-custom__toggle',
          isPasswordVisible ? 'input-custom__toggle--visible' : '',
        ],
        attributes: {
          type: 'button',
          'aria-label': isPasswordVisible ? 'Hide password' : 'Show password',
          tabindex: '-1',
          'data-action': 'toggle-password',
        },
      });
      customInput.appendChild(toggleButton);
    } else if (type === 'number') {
      // Add increment/decrement buttons
      const controlsWrapper = createElement('div', {
        classes: ['input-custom__number-controls'],
      });

      const incrementButton = createElement('button', {
        classes: ['input-custom__increment'],
        attributes: {
          type: 'button',
          'aria-label': 'Increment value',
          tabindex: '-1',
          'data-action': 'increment',
        },
      });

      const decrementButton = createElement('button', {
        classes: ['input-custom__decrement'],
        attributes: {
          type: 'button',
          'aria-label': 'Decrement value',
          tabindex: '-1',
          'data-action': 'decrement',
        },
      });

      appendChildren(controlsWrapper, [incrementButton, decrementButton]);
      customInput.appendChild(controlsWrapper);
    }

    // Append elements
    appendChildren(inputWrapper, [input, customInput]);

    // Create validation message element
    const validationMessageElement = createElement('div', {
      classes: ['input-validation-message'],
      attributes: {
        'aria-live': 'polite',
        'data-element': 'validation-message',
      },
      text: isValid === false ? validationMessage : '',
      style: {
        display: showValidation ? 'block' : 'none',
      },
    });

    appendChildren(container, [inputWrapper, validationMessageElement]);

    return container;
  });

  // Initialize component with props
  const component = baseComponent(props);
  const element = component.getElement();

  // Store state
  let state = { ...props };

  // Event delegation handler
  function handleEvents(event) {
    const targetElement = event.target;
    const eventType = event.type;

    // Handle input element events
    if (targetElement.classList.contains('input-native')) {
      switch (eventType) {
        case 'input': {
          state.value = targetElement.value;
          component.update({ value: targetElement.value });

          // Update validation if needed
          if (state.showValidation && state.isValid !== null) {
            validate();
          }
          break;
        }

        case 'change': {
          if (typeof state.onChange === 'function') {
            state.onChange(event, getValue());
          }
          break;
        }

        case 'focus': {
          element.classList.add('input-container--focused');
          const customInput = element.querySelector('.input-custom');
          customInput.classList.add('input-custom--focused');

          if (typeof state.onFocus === 'function') {
            state.onFocus(event);
          }
          break;
        }

        case 'blur': {
          element.classList.remove('input-container--focused');
          const customInput = element.querySelector('.input-custom');
          customInput.classList.remove('input-custom--focused');

          if (state.showValidation && state.isValid !== null) {
            validate();
          }

          if (typeof state.onBlur === 'function') {
            state.onBlur(event);
          }
          break;
        }

        case 'keydown': {
          handleKeydown(event);
          break;
        }
      }
    }

    // Handle action buttons using delegation
    const action = targetElement
      .closest('[data-action]')
      ?.getAttribute('data-action');
    if (action && eventType === 'click') {
      const inputElement = element.querySelector('.input-native');

      switch (action) {
        case 'clear':
          setValue('');
          inputElement.focus();
          break;

        case 'toggle-password':
          state.isPasswordVisible = !state.isPasswordVisible;
          component.update({ isPasswordVisible: state.isPasswordVisible });
          inputElement.focus();
          break;

        case 'increment': {
          if (state.disabled || state.readonly) return;

          const numValue = parseFloat(getValue()) || 0;
          const step = parseFloat(inputElement.step) || 1;
          const max = inputElement.max
            ? parseFloat(inputElement.max)
            : Infinity;

          setValue(Math.min(numValue + step, max).toString());
          inputElement.focus();
          break;
        }

        case 'decrement': {
          if (state.disabled || state.readonly) return;

          const numValue = parseFloat(getValue()) || 0;
          const step = parseFloat(inputElement.step) || 1;
          const min = inputElement.min
            ? parseFloat(inputElement.min)
            : -Infinity;

          setValue(Math.max(numValue - step, min).toString());
          inputElement.focus();
          break;
        }
      }
    }
  }

  /**
   * Handle keydown events specifically
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleKeydown(event) {
    // Remove the unused inputElement variable
    switch (state.type) {
      case 'number':
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          const incrementBtn = element.querySelector(
            '.input-custom__increment'
          );
          if (incrementBtn) incrementBtn.click();
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          const decrementBtn = element.querySelector(
            '.input-custom__decrement'
          );
          if (decrementBtn) decrementBtn.click();
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
   * Update the input value display
   */
  function updateValueDisplay() {
    const valueDisplay = element.querySelector('.input-custom__value');
    const customInput = element.querySelector('.input-custom');

    // Update text and classes
    valueDisplay.textContent = state.value;
    valueDisplay.classList.toggle(
      'input-custom__value--has-value',
      !!state.value
    );

    // Update search button visibility
    if (state.type === 'search') {
      customInput.classList.toggle('input-custom--has-value', !!state.value);
    }
  }

  /**
   * Get the input value
   * @returns {string} Current value
   */
  function getValue() {
    return state.value;
  }

  /**
   * Set the input value
   * @param {string} newValue - New value
   * @returns {Object} Component for chaining
   */
  function setValue(newValue) {
    state.value = newValue;

    const inputElement = element.querySelector('.input-native');
    inputElement.value = newValue;

    updateValueDisplay();

    if (state.showValidation && state.isValid !== null) {
      validate();
    }

    return api;
  }

  /**
   * Validate the input
   * @returns {boolean} Whether the input is valid
   */
  function validate() {
    const inputElement = element.querySelector('.input-native');
    const customElement = element.querySelector('.input-custom');
    const messageElement = element.querySelector('.input-validation-message');

    // Use the abstracted validation utility
    const isValid = validateInput(inputElement, {
      container: element,
      customElement,
      messageElement,
      customMessage: state.validationMessage,
    });

    state.isValid = isValid;
    return isValid;
  }

  // Set up delegated event listeners
  element.addEventListener('input', handleEvents);
  element.addEventListener('change', handleEvents);
  element.addEventListener('focus', handleEvents, true); // Use capture for focus/blur
  element.addEventListener('blur', handleEvents, true);
  element.addEventListener('keydown', handleEvents);
  element.addEventListener('click', handleEvents);

  // Public API
  const api = {
    /**
     * Get the component element
     * @returns {HTMLElement} Component element
     */
    getElement() {
      return element;
    },

    /**
     * Get the current value
     * @returns {string} Current value
     */
    getValue,

    /**
     * Set the input value
     * @param {string} value - New value
     * @returns {Object} Component for chaining
     */
    setValue,

    /**
     * Validate the input
     * @returns {boolean} Whether input is valid
     */
    validate,

    /**
     * Update component with new props
     * @param {Object} newProps - New properties
     * @returns {Object} Component for chaining
     */
    update(newProps) {
      // Update state
      state = { ...state, ...newProps };

      // Update component
      component.update(state);

      // Handle special update cases that need DOM mutation
      const inputElement = element.querySelector('.input-native');

      // Update value if changed
      if (newProps.value !== undefined) {
        inputElement.value = newProps.value;
        updateValueDisplay();
      }

      // Update password visibility
      if (
        newProps.isPasswordVisible !== undefined &&
        state.type === 'password'
      ) {
        inputElement.type = newProps.isPasswordVisible ? 'text' : 'password';

        const toggleButton = element.querySelector('.input-custom__toggle');
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

      return api;
    },

    /**
     * Theme change handler (for withThemeAwareness HOC)
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      // Handle theme changes
      console.log(
        `Input component theme changed: ${previousTheme} -> ${theme}`
      );
    },

    /**
     * Clean up resources
     */
    destroy() {
      // Remove all event listeners
      element.removeEventListener('input', handleEvents);
      element.removeEventListener('change', handleEvents);
      element.removeEventListener('focus', handleEvents, true);
      element.removeEventListener('blur', handleEvents, true);
      element.removeEventListener('keydown', handleEvents);
      element.removeEventListener('click', handleEvents);

      // Call base component's destroy
      component.destroy();
    },
  };

  return api;
};

// Enhance component with theme awareness
export default withThemeAwareness(createInput);
