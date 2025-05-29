// src/components/Input/Input.js
import { createElement, appendChildren } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { validateInput } from '../../utils/validation.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { inputStyles } from './Input.styles.js';

// Create style injector for Input component
const injectInputStyles = createStyleInjector('Input');

/**
 * Create an Input component
 * @param {Object} props - Input properties
 * @returns {Object} Input component
 */
const createInput = (props) => {
  // Inject styles on component creation
  injectInputStyles(inputStyles);

  // Migrate legacy props to standardized props
  const normalizedProps = migrateLegacyProps(props);

  // Use base component for standardized lifecycle
  const baseComponent = createBaseComponent((state) => {
    const {
      type = 'text',
      id,
      name,
      value,
      defaultValue,
      placeholder = '',
      required = false,
      disabled = false,
      readonly = false,
      pattern,
      minLength,
      maxLength,
      className = '',
      error = null,
      errorMessage = '',
      loading = false,
      showValidation = true,
      isPasswordVisible = false,
    } = state;

    // Use value if provided, otherwise use defaultValue
    const currentValue = value !== undefined ? value : defaultValue || '';

    // Create container with data attribute for delegation
    const container = createElement('div', {
      classes: ['input-container', className],
      attributes: {
        'data-component': 'input',
        'data-type': type,
        'data-valid': error === false ? 'true' : error ? 'false' : null,
      },
    });

    // Create input wrapper
    const inputWrapper = createElement('div', {
      classes: ['input-wrapper'],
    });

    // Create custom input UI first (for proper z-index layering)
    const customClasses = ['input-custom', `input-custom--${type}`];
    if (disabled) {
      customClasses.push('input-custom--disabled');
    }
    if (readonly) {
      customClasses.push('input-custom--readonly');
    }
    if (loading) {
      customClasses.push('input-custom--loading');
    }
    if (error === false) {
      customClasses.push('input-custom--valid');
    }
    if (error) {
      customClasses.push('input-custom--invalid');
    }
    if (currentValue) {
      customClasses.push('input-custom--has-value');
    }

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
        currentValue ? 'input-custom__value--has-value' : '',
      ],
      attributes: {
        'data-placeholder': placeholder,
        'data-element': 'value-display',
      },
      // For password, display masked text when not visible
      text:
        type === 'password' && !isPasswordVisible && currentValue
          ? '•'.repeat(currentValue.length)
          : currentValue,
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
          tabindex: '0', // Make it focusable and accessible
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
          tabindex: '0', // Make it focusable
          'data-action': 'increment',
        },
      });

      const decrementButton = createElement('button', {
        classes: ['input-custom__decrement'],
        attributes: {
          type: 'button',
          'aria-label': 'Decrement value',
          tabindex: '0', // Make it focusable
          'data-action': 'decrement',
        },
      });

      appendChildren(controlsWrapper, [incrementButton, decrementButton]);
      customInput.appendChild(controlsWrapper);
    }

    // Create native input (after custom UI for z-index layering)
    const inputAttributes = {
      type: type === 'password' && isPasswordVisible ? 'text' : type,
      id,
      name,
      placeholder,
      required: required ? 'required' : null,
      pattern,
      'aria-required': required ? 'true' : null,
      'aria-invalid': error ? 'true' : null,
      'data-element': 'input',
    };

    // Add optional attributes
    if (minLength !== undefined) {
      inputAttributes.minLength = minLength;
    }
    if (maxLength !== undefined) {
      inputAttributes.maxLength = maxLength;
    }
    if (disabled) {
      inputAttributes.disabled = true;
    }
    if (readonly) {
      inputAttributes.readOnly = true;
    }

    const input = createElement('input', {
      classes: ['input-native'],
      attributes: inputAttributes,
    });

    // Set value directly
    input.value = currentValue;

    // Append elements with input first, then custom UI
    appendChildren(inputWrapper, [customInput, input]);

    // Create validation message element
    const validationMessageElement = createElement('div', {
      classes: ['input-validation-message'],
      attributes: {
        'aria-live': 'polite',
        'data-element': 'validation-message',
      },
      text: error ? errorMessage : '',
      style: {
        display: showValidation ? 'block' : 'none',
      },
    });

    appendChildren(container, [inputWrapper, validationMessageElement]);

    return container;
  });

  // Initialize component with normalized props
  const component = baseComponent(normalizedProps);
  const element = component.getElement();

  // Store state
  let state = { ...normalizedProps };

  // Initialize state.value from defaultValue if value is not provided
  if (state.value === undefined && state.defaultValue !== undefined) {
    state.value = state.defaultValue;
  }

  // Initialize password visibility to false
  if (state.type === 'password' && state.isPasswordVisible === undefined) {
    state.isPasswordVisible = false;
  }

  // Selection state tracking for displaying selections properly
  let selectionStart = 0;
  let selectionEnd = 0;

  /**
   * Handle input focus event
   * @param {Event} event - The focus event
   */
  const handleFocus = (event) => {
    element.classList.add('input-container--focused');
    const customInput = element.querySelector('.input-custom');
    if (customInput) {
      customInput.classList.add('input-custom--focused');
    }

    if (typeof state.onFocus === 'function') {
      state.onFocus(event);
    }
  };

  /**
   * Handle input blur event
   * @param {Event} event - The blur event
   */
  const handleBlur = (event) => {
    element.classList.remove('input-container--focused');
    const customInput = element.querySelector('.input-custom');
    if (customInput) {
      customInput.classList.remove('input-custom--focused');
    }

    // Reset selection tracking
    selectionStart = 0;
    selectionEnd = 0;
    updateValueDisplay();

    if (state.showValidation) {
      validate();
    }

    if (typeof state.onBlur === 'function') {
      state.onBlur(event);
    }
  };

  /**
   * Update password toggle button appearance
   * @param {boolean} isVisible - Whether password is visible
   */
  const updatePasswordToggleButton = (isVisible) => {
    const toggleButton = element.querySelector('.input-custom__toggle');
    if (toggleButton) {
      toggleButton.classList.toggle('input-custom__toggle--visible', isVisible);
      toggleButton.setAttribute(
        'aria-label',
        isVisible ? 'Hide password' : 'Show password'
      );
    }
  };

  /**
   * Handle password visibility toggle
   */
  const togglePasswordVisibility = () => {
    state.isPasswordVisible = !state.isPasswordVisible;

    const inputElement = element.querySelector('.input-native');
    if (inputElement) {
      inputElement.type = state.isPasswordVisible ? 'text' : 'password';
      inputElement.focus();
    }

    // Update toggle button appearance
    updatePasswordToggleButton(state.isPasswordVisible);

    // Update display value
    updateValueDisplay();
  };

  /**
   * Directly handle button clicks for controls
   * @param {Event} event - The click event
   */
  const handleControlClick = (event) => {
    // Only handle direct clicks on buttons with data-action
    const button = event.target.closest('[data-action]');
    if (!button) {
      return;
    }

    // Get the action type
    const action = button.getAttribute('data-action');
    if (!action) {
      return;
    }

    // Reference to native input
    const inputElement = element.querySelector('.input-native');
    if (!inputElement) {
      return;
    }

    // Process different actions
    switch (action) {
      case 'clear':
        setValue('');
        inputElement.focus();
        event.stopPropagation(); // Stop event from reaching the input
        break;

      case 'toggle-password':
        togglePasswordVisibility();
        event.stopPropagation(); // Stop event from reaching the input
        break;

      case 'increment':
        if (state.disabled || state.readonly) {
          return;
        }
        incrementValue(inputElement);
        event.stopPropagation();
        break;

      case 'decrement':
        if (state.disabled || state.readonly) {
          return;
        }
        decrementValue(inputElement);
        event.stopPropagation();
        break;
    }
  };

  // Event delegation handler
  const handleEvents = (event) => {
    const targetElement = event.target;
    const eventType = event.type;

    // Handle input element events
    if (targetElement.classList.contains('input-native')) {
      switch (eventType) {
        case 'input':
          // Update state but don't re-render the component
          state.value = targetElement.value;

          // Directly update the display value without re-rendering
          updateValueDisplay();

          // Update validation if needed
          if (state.showValidation) {
            validate();
          }
          break;

        case 'select':
        case 'click':
        case 'keyup':
          // Handle selection (even for password fields)
          handleSelection(targetElement);
          break;

        case 'change':
          if (typeof state.onChange === 'function') {
            state.onChange(event, getValue());
          }
          break;

        case 'focus':
          handleFocus(event);
          break;

        case 'blur':
          handleBlur(event);
          break;

        case 'keydown':
          handleKeydown(event);
          break;
      }
    }
  };

  /**
   * Handle selection events
   * @param {HTMLElement} inputElement - The input element
   */
  const handleSelection = (inputElement) => {
    if (
      inputElement.selectionStart !== undefined &&
      inputElement.selectionEnd !== undefined
    ) {
      selectionStart = inputElement.selectionStart;
      selectionEnd = inputElement.selectionEnd;

      // For password fields we don't show selection visually, but still track it
      if (state.type !== 'password') {
        updateValueDisplay();
      }
    }
  };

  /**
   * Increment the input value
   * @param {HTMLElement} inputElement - The input element
   */
  const incrementValue = (inputElement) => {
    const numValue = parseFloat(getValue()) || 0;
    const step = parseFloat(inputElement.step) || 1;
    const max = inputElement.hasAttribute('max')
      ? parseFloat(inputElement.getAttribute('max'))
      : Infinity;

    setValue(Math.min(numValue + step, max).toString());
    inputElement.focus();
  };

  /**
   * Decrement the input value
   * @param {HTMLElement} inputElement - The input element
   */
  const decrementValue = (inputElement) => {
    const numValue = parseFloat(getValue()) || 0;
    const step = parseFloat(inputElement.step) || 1;
    const min = inputElement.hasAttribute('min')
      ? parseFloat(inputElement.getAttribute('min'))
      : -Infinity;

    setValue(Math.max(numValue - step, min).toString());
    inputElement.focus();
  };

  /**
   * Handle keydown events specifically
   * @param {KeyboardEvent} event - Keyboard event
   */
  const handleKeydown = (event) => {
    const inputElement = element.querySelector('.input-native');
    if (!inputElement) {
      return;
    }

    switch (state.type) {
      case 'number':
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          incrementValue(inputElement);
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          decrementValue(inputElement);
        }
        break;

      case 'search':
        if (event.key === 'Escape') {
          event.preventDefault();
          setValue('');
        }
        break;
    }
  };

  /**
   * Update the input value display
   */
  const updateValueDisplay = () => {
    const valueDisplay = element.querySelector('.input-custom__value');
    const customInput = element.querySelector('.input-custom');

    if (!valueDisplay || !customInput) {
      return;
    }

    // Ensure value is always a string, never undefined
    const value = state.value || '';

    // Handle password masking
    if (state.type === 'password') {
      valueDisplay.textContent = state.isPasswordVisible
        ? value
        : '•'.repeat(value.length);
    } else {
      // For non-password fields, display the text with selection highlighting if needed
      if (
        selectionStart !== selectionEnd &&
        document.activeElement === element.querySelector('.input-native')
      ) {
        // Clear the display
        valueDisplay.innerHTML = '';

        // If there's a selection, we need to create three parts:
        // 1. Text before selection
        if (selectionStart > 0) {
          const beforeSpan = document.createElement('span');
          beforeSpan.textContent = value.substring(0, selectionStart);
          valueDisplay.appendChild(beforeSpan);
        }

        // 2. Selected text
        const selectionSpan = document.createElement('span');
        selectionSpan.className = 'input-custom__selection';
        selectionSpan.textContent = value.substring(
          selectionStart,
          selectionEnd
        );
        valueDisplay.appendChild(selectionSpan);

        // 3. Text after selection
        if (selectionEnd < value.length) {
          const afterSpan = document.createElement('span');
          afterSpan.textContent = value.substring(selectionEnd);
          valueDisplay.appendChild(afterSpan);
        }
      } else {
        // No selection, just display the text
        valueDisplay.textContent = value;
      }
    }

    // Toggle has-value class based on whether there's content
    valueDisplay.classList.toggle('input-custom__value--has-value', !!value);

    // Update search button visibility
    if (state.type === 'search') {
      customInput.classList.toggle('input-custom--has-value', !!value);
    }
  };

  /**
   * Get the input value
   * @returns {string} Current value
   */
  const getValue = () => {
    return state.value || '';
  };

  /**
   * Set the input value
   * @param {string} newValue - New value
   * @returns {Object} Component for chaining
   */
  const setValue = (newValue) => {
    state.value = newValue;

    const inputElement = element.querySelector('.input-native');
    if (inputElement) {
      inputElement.value = newValue;
    }

    updateValueDisplay();

    if (state.showValidation) {
      validate();
    }

    return api;
  };

  /**
   * Validate the input
   * @returns {boolean} Whether the input is valid
   */
  const validate = () => {
    const inputElement = element.querySelector('.input-native');
    const customElement = element.querySelector('.input-custom');
    const messageElement = element.querySelector('.input-validation-message');

    if (!inputElement || !customElement || !messageElement) {
      return false;
    }

    // Use the abstracted validation utility
    const isValid = validateInput(inputElement, {
      container: element,
      customElement,
      messageElement,
      customMessage: state.errorMessage,
    });

    // Update state.error instead of state.isValid
    state.error = isValid ? false : true;
    return isValid;
  };

  // Set up delegated event listeners for input events
  element.addEventListener('input', handleEvents);
  element.addEventListener('change', handleEvents);
  element.addEventListener('focus', handleEvents, true); // Use capture for focus/blur
  element.addEventListener('blur', handleEvents, true);
  element.addEventListener('keydown', handleEvents);
  element.addEventListener('click', handleEvents);

  // Add dedicated click handler for control buttons
  element.addEventListener('click', handleControlClick);

  // Additional listeners for selection tracking
  element.addEventListener('select', handleEvents);
  element.addEventListener('keyup', handleEvents);

  /**
   * Migrate legacy props to standardized props
   * @param {Object} props - Original props
   * @returns {Object} Normalized props
   */
  function migrateLegacyProps(props) {
    const migrated = { ...props };

    // Migrate isValid to error
    if ('isValid' in props && !('error' in props)) {
      console.warn('[Input] isValid is deprecated, use error instead');
      // Note: error is inverse of isValid (error = !isValid)
      if (props.isValid === true) {
        migrated.error = false;
      } else if (props.isValid === false) {
        migrated.error = true;
      } else {
        migrated.error = null;
      }
      delete migrated.isValid;
    }

    // Migrate validationMessage to errorMessage
    if ('validationMessage' in props && !('errorMessage' in props)) {
      console.warn(
        '[Input] validationMessage is deprecated, use errorMessage instead'
      );
      migrated.errorMessage = props.validationMessage;
      delete migrated.validationMessage;
    }

    // Migrate isLoading to loading
    if ('isLoading' in props && !('loading' in props)) {
      console.warn('[Input] isLoading is deprecated, use loading instead');
      migrated.loading = props.isLoading;
      delete migrated.isLoading;
    }

    return migrated;
  }

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
      // Normalize new props
      const normalizedProps = migrateLegacyProps(newProps);

      // Update state
      state = { ...state, ...normalizedProps };

      // For full updates, we'll use the component update
      component.update(state);

      // Handle special update cases that need DOM mutation
      const inputElement = element.querySelector('.input-native');
      const customInput = element.querySelector('.input-custom');

      // Update value if changed
      if (normalizedProps.value !== undefined && inputElement) {
        inputElement.value = normalizedProps.value;
        updateValueDisplay();
      }

      // Update validation classes directly for the legacy props test
      if (normalizedProps.error === false && customInput) {
        customInput.classList.add('input-custom--valid');
        customInput.classList.remove('input-custom--invalid');
      } else if (normalizedProps.error === true && customInput) {
        customInput.classList.add('input-custom--invalid');
        customInput.classList.remove('input-custom--valid');
      }

      // Update password visibility
      if (
        normalizedProps.isPasswordVisible !== undefined &&
        state.type === 'password'
      ) {
        if (inputElement) {
          inputElement.type = normalizedProps.isPasswordVisible
            ? 'text'
            : 'password';
        }

        updatePasswordToggleButton(normalizedProps.isPasswordVisible);
        updateValueDisplay();
      }

      return api;
    },

    /**
     * Theme change handler (for withThemeAwareness HOC)
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      // Handle theme changes if needed
      console.debug(`Input: theme changed from ${previousTheme} to ${theme}`);
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
      element.removeEventListener('click', handleControlClick);
      element.removeEventListener('select', handleEvents);
      element.removeEventListener('keyup', handleEvents);

      // Call base component's destroy
      component.destroy();
    },
  };

  return api;
};

// Enhance component with theme awareness
export default withThemeAwareness(createInput);
