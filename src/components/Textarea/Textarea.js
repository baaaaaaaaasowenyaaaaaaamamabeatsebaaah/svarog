// src/components/Textarea/Textarea.js
import { createElement, appendChildren } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { textareaStyles } from './Textarea.styles.js';

// Create style injector for Textarea component
const injectTextareaStyles = createStyleInjector('Textarea');

/**
 * Create a Textarea component
 * @param {Object} props - Textarea properties
 * @returns {Object} Textarea component
 */
const createTextarea = (props) => {
  // Inject styles on component creation
  injectTextareaStyles(textareaStyles);

  // Migrate legacy props to standardized props
  const normalizedProps = migrateLegacyProps(props);

  // Use base component for standardized lifecycle
  const baseComponent = createBaseComponent((state) => {
    const {
      id,
      name,
      value,
      defaultValue,
      placeholder = '',
      required = false,
      disabled = false,
      readonly = false,
      rows = 3,
      cols,
      minLength,
      maxLength,
      className = '',
      error = null,
      errorMessage = '',
      loading = false,
      showValidation = true,
      autoResize = true,
      resizable = true,
      showCharCount = false,
    } = state;

    // Use value if provided, otherwise use defaultValue
    const currentValue = value !== undefined ? value : defaultValue || '';

    // Create container with data attribute for delegation
    const container = createElement('div', {
      classes: ['textarea-container', className],
      attributes: {
        'data-component': 'textarea',
        'data-valid': error === false ? 'true' : error ? 'false' : null,
      },
    });

    // Create textarea wrapper
    const textareaWrapper = createElement('div', {
      classes: ['textarea-wrapper'],
    });

    // Create custom textarea UI
    const customClasses = ['textarea-custom'];
    if (disabled) customClasses.push('textarea-custom--disabled');
    if (readonly) customClasses.push('textarea-custom--readonly');
    if (loading) customClasses.push('textarea-custom--loading');
    if (error === false) customClasses.push('textarea-custom--valid');
    if (error) customClasses.push('textarea-custom--invalid');
    if (!resizable) customClasses.push('textarea-custom--no-resize');
    if (autoResize) customClasses.push('textarea-custom--auto-resize');

    const customTextarea = createElement('div', {
      classes: customClasses,
      attributes: {
        'data-element': 'custom-textarea',
      },
    });

    // Create native textarea
    const textareaAttributes = {
      id,
      name,
      placeholder,
      required: required ? 'required' : null,
      rows,
      'aria-required': required ? 'true' : null,
      'aria-invalid': error ? 'true' : null,
      'data-element': 'textarea',
    };

    // Add optional attributes
    if (cols !== undefined) textareaAttributes.cols = cols;
    if (minLength !== undefined) textareaAttributes.minLength = minLength;
    if (maxLength !== undefined) textareaAttributes.maxLength = maxLength;
    if (disabled) textareaAttributes.disabled = true;
    if (readonly) textareaAttributes.readOnly = true;

    const textarea = createElement('textarea', {
      classes: ['textarea-native'],
      attributes: textareaAttributes,
    });

    // Set value directly
    textarea.value = currentValue;

    // Create character count display
    let charCountElement = null;
    if (showCharCount || maxLength !== undefined) {
      const charCount = currentValue.length;
      const charCountText =
        maxLength !== undefined ? `${charCount}/${maxLength}` : `${charCount}`;

      charCountElement = createElement('div', {
        classes: ['textarea-char-count'],
        attributes: {
          'data-element': 'char-count',
          'aria-live': 'polite',
        },
        text: charCountText,
      });
    }

    // Append elements
    appendChildren(textareaWrapper, [customTextarea, textarea]);
    if (charCountElement) {
      textareaWrapper.appendChild(charCountElement);
    }

    // Create validation message element
    const validationMessageElement = createElement('div', {
      classes: ['textarea-validation-message'],
      attributes: {
        'aria-live': 'polite',
        'data-element': 'validation-message',
      },
      text: error ? errorMessage : '',
      style: {
        display: showValidation ? 'block' : 'none',
      },
    });

    appendChildren(container, [textareaWrapper, validationMessageElement]);

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

  /**
   * Auto-resize textarea based on content
   */
  const autoResizeTextarea = () => {
    if (!state.autoResize) return;

    const textarea = element.querySelector('.textarea-native');
    if (!textarea) return;

    // Reset height to auto to get accurate scrollHeight
    textarea.style.height = 'auto';

    // Set height to match content
    const computedStyle = window.getComputedStyle(textarea);
    const minHeight = parseInt(computedStyle.minHeight) || 0;
    const newHeight = Math.max(textarea.scrollHeight, minHeight);

    textarea.style.height = `${newHeight}px`;

    // Update custom element height
    const customTextarea = element.querySelector('.textarea-custom');
    if (customTextarea) {
      customTextarea.style.height = `${newHeight}px`;
    }
  };

  /**
   * Update character count display
   */
  const updateCharCount = () => {
    const charCountElement = element.querySelector(
      '[data-element="char-count"]'
    );
    if (!charCountElement) return;

    const currentLength = (state.value || '').length;
    const charCountText =
      state.maxLength !== undefined
        ? `${currentLength}/${state.maxLength}`
        : `${currentLength}`;

    charCountElement.textContent = charCountText;

    // Add warning class if approaching limit
    if (state.maxLength !== undefined) {
      const ratio = currentLength / state.maxLength;
      charCountElement.classList.toggle(
        'textarea-char-count--warning',
        ratio >= 0.9
      );
      charCountElement.classList.toggle(
        'textarea-char-count--error',
        ratio >= 1
      );
    }
  };

  /**
   * Handle textarea focus event
   * @param {Event} event - The focus event
   */
  const handleFocus = (event) => {
    element.classList.add('textarea-container--focused');
    const customTextarea = element.querySelector('.textarea-custom');
    if (customTextarea) {
      customTextarea.classList.add('textarea-custom--focused');
    }

    if (typeof state.onFocus === 'function') {
      state.onFocus(event);
    }
  };

  /**
   * Handle textarea blur event
   * @param {Event} event - The blur event
   */
  const handleBlur = (event) => {
    element.classList.remove('textarea-container--focused');
    const customTextarea = element.querySelector('.textarea-custom');
    if (customTextarea) {
      customTextarea.classList.remove('textarea-custom--focused');
    }

    if (state.showValidation) {
      validate();
    }

    if (typeof state.onBlur === 'function') {
      state.onBlur(event);
    }
  };

  // Event delegation handler
  const handleEvents = (event) => {
    const targetElement = event.target;
    const eventType = event.type;

    // Handle textarea element events
    if (targetElement.classList.contains('textarea-native')) {
      switch (eventType) {
        case 'input':
          // Update state but don't re-render the component
          state.value = targetElement.value;

          // Update character count
          updateCharCount();

          // Auto-resize if enabled
          if (state.autoResize) {
            autoResizeTextarea();
          }

          // Update validation if needed
          if (state.showValidation) {
            validate();
          }

          // Call onChange handler
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
   * Handle keydown events
   * @param {KeyboardEvent} event - Keyboard event
   */
  const handleKeydown = (event) => {
    // Handle Tab key for accessibility
    if (event.key === 'Tab' && !event.shiftKey && !event.ctrlKey) {
      // Allow default tab behavior
      return;
    }

    // Handle Ctrl/Cmd + Enter for form submission
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      if (typeof state.onSubmit === 'function') {
        state.onSubmit(event, getValue());
      }
    }
  };

  /**
   * Get the textarea value
   * @returns {string} Current value
   */
  const getValue = () => {
    return state.value || '';
  };

  /**
   * Set the textarea value
   * @param {string} newValue - New value
   * @returns {Object} Component for chaining
   */
  const setValue = (newValue) => {
    state.value = newValue;

    const textareaElement = element.querySelector('.textarea-native');
    if (textareaElement) {
      textareaElement.value = newValue;
    }

    updateCharCount();

    if (state.autoResize) {
      autoResizeTextarea();
    }

    if (state.showValidation) {
      validate();
    }

    return api;
  };

  /**
   * Validate the textarea
   * @returns {boolean} Whether the textarea is valid
   */
  const validate = () => {
    const textareaElement = element.querySelector('.textarea-native');
    const customElement = element.querySelector('.textarea-custom');
    const messageElement = element.querySelector(
      '.textarea-validation-message'
    );

    if (!textareaElement || !customElement || !messageElement) return false;

    // Use native validation
    const isValid = textareaElement.checkValidity();

    // Update state.error
    state.error = isValid ? false : true;

    // Update UI
    element.setAttribute('data-valid', isValid ? 'true' : 'false');
    customElement.classList.toggle('textarea-custom--valid', isValid);
    customElement.classList.toggle('textarea-custom--invalid', !isValid);

    // Update validation message
    messageElement.textContent = !isValid
      ? state.errorMessage || textareaElement.validationMessage
      : '';

    return isValid;
  };

  // Set up delegated event listeners
  element.addEventListener('input', handleEvents);
  element.addEventListener('focus', handleEvents, true); // Use capture for focus/blur
  element.addEventListener('blur', handleEvents, true);
  element.addEventListener('keydown', handleEvents);

  // Initial setup
  if (state.autoResize) {
    // Use RAF to ensure DOM is ready
    requestAnimationFrame(() => {
      autoResizeTextarea();
    });
  }

  /**
   * Migrate legacy props to standardized props
   * @param {Object} props - Original props
   * @returns {Object} Normalized props
   */
  function migrateLegacyProps(props) {
    const migrated = { ...props };

    // Migrate isValid to error
    if ('isValid' in props && !('error' in props)) {
      console.warn('[Textarea] isValid is deprecated, use error instead');
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
        '[Textarea] validationMessage is deprecated, use errorMessage instead'
      );
      migrated.errorMessage = props.validationMessage;
      delete migrated.validationMessage;
    }

    // Migrate isLoading to loading
    if ('isLoading' in props && !('loading' in props)) {
      console.warn('[Textarea] isLoading is deprecated, use loading instead');
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
     * Set the textarea value
     * @param {string} value - New value
     * @returns {Object} Component for chaining
     */
    setValue,

    /**
     * Validate the textarea
     * @returns {boolean} Whether textarea is valid
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

      // For full updates, use the component update
      component.update(state);

      // Handle special update cases
      const textareaElement = element.querySelector('.textarea-native');
      const customTextarea = element.querySelector('.textarea-custom');

      // Update value if changed
      if (normalizedProps.value !== undefined && textareaElement) {
        textareaElement.value = normalizedProps.value;
        updateCharCount();
        if (state.autoResize) {
          autoResizeTextarea();
        }
      }

      // Update validation classes directly
      if (normalizedProps.error === false && customTextarea) {
        customTextarea.classList.add('textarea-custom--valid');
        customTextarea.classList.remove('textarea-custom--invalid');
      } else if (normalizedProps.error === true && customTextarea) {
        customTextarea.classList.add('textarea-custom--invalid');
        customTextarea.classList.remove('textarea-custom--valid');
      }

      return api;
    },

    /**
     * Theme change handler (for withThemeAwareness HOC)
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      console.debug(
        `Textarea: theme changed from ${previousTheme} to ${theme}`
      );
    },

    /**
     * Clean up resources
     */
    destroy() {
      // Remove all event listeners
      element.removeEventListener('input', handleEvents);
      element.removeEventListener('focus', handleEvents, true);
      element.removeEventListener('blur', handleEvents, true);
      element.removeEventListener('keydown', handleEvents);

      // Call base component's destroy
      component.destroy();
    },
  };

  return api;
};

// Enhance component with theme awareness
export default withThemeAwareness(createTextarea);
