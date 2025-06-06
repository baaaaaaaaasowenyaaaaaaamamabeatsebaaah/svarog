// src/components/Checkbox/Checkbox.js
import { createComponent } from '../../utils/componentFactory.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { checkboxStyles } from './Checkbox.styles.js';

// Create style injector for Checkbox component
const injectCheckboxStyles = createStyleInjector('Checkbox');

/**
 * Factory for creating change event handlers
 * @param {Object} state - Component state
 * @param {Function} updateCallback - Function to call to update component state
 * @returns {Function} Change event handler
 * @private
 */
const createChangeHandler = (state, updateCallback) => {
  return function handleChange(event) {
    // Call onChange callback if provided
    if (typeof state.onChange === 'function') {
      state.onChange(event, event.target.checked);
    }

    // Update component state
    updateCallback({
      checked: event.target.checked,
      value: event.target.checked,
    });
  };
};

/**
 * Migrates legacy props to standardized ones
 * @param {Object} props - Input props
 * @returns {Object} Normalized props
 * @private
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  // Handle value/checked alias
  if ('value' in props && !('checked' in props)) {
    console.warn(
      '[Checkbox] value is an alias for checked, prefer using checked directly'
    );
    migrated.checked = Boolean(props.value);
    // Keep both properties in sync
    migrated.value = migrated.checked;
  }

  // Handle defaultValue alias for initial checked state
  if ('defaultValue' in props && !('checked' in props) && !('value' in props)) {
    console.warn(
      '[Checkbox] defaultValue is an alias for checked, prefer using checked directly'
    );
    migrated.checked = Boolean(props.defaultValue);
    migrated.value = migrated.checked;
  }

  // Handle isLoading alias for loading
  if ('isLoading' in props && !('loading' in props)) {
    console.warn('[Checkbox] isLoading is deprecated, use loading instead');
    migrated.loading = props.isLoading;
  }

  return migrated;
};

/**
 * Creates a Checkbox component
 * @param {Object} props - Checkbox properties
 * @returns {Object} Checkbox component
 */
const createCheckbox = (props) => {
  // Inject styles on component creation
  injectCheckboxStyles(checkboxStyles);

  // Standardize props
  const normalizedProps = migrateLegacyProps(props);

  // Destructure props with defaults
  const {
    label,
    id,
    name,
    checked = false,
    required = false,
    disabled = false,
    loading = false,
    className = '',
    onChange,
    validationMessage = '',
    showValidation = true,
    indeterminate = false,
  } = normalizedProps;

  // Component state
  const state = {
    label,
    id,
    name,
    checked,
    required,
    disabled,
    loading,
    className,
    onChange,
    validationMessage,
    showValidation,
    indeterminate,
    isValid: true,
  };

  // Create handler reference once
  let handleChangeRef = null;

  /**
   * Validates the checkbox
   * @returns {boolean} Whether the checkbox is valid
   * @private
   */
  const validateCheckbox = () => {
    return !state.required || state.checked;
  };

  /**
   * Applies partial updates to the DOM without rebuilding the entire element
   * @param {HTMLElement} element - The element to update
   * @param {Object} newProps - Changed properties
   * @private
   */
  const partialUpdate = (element, newProps) => {
    const input = element.querySelector('.checkbox-input');
    if (!input) {
      return;
    } // Safety check

    // Update checked/value state
    if ('checked' in newProps || 'value' in newProps) {
      const newChecked =
        'checked' in newProps ? newProps.checked : newProps.value;
      input.checked = newChecked;
    }

    // Update disabled state
    if ('disabled' in newProps) {
      input.disabled = newProps.disabled;
    }

    // Update loading state
    if ('loading' in newProps) {
      element.classList.toggle('checkbox-container--loading', newProps.loading);
      input.disabled = newProps.loading || state.disabled;
    }

    // Update indeterminate state
    if ('indeterminate' in newProps) {
      setIndeterminateState(input, newProps.indeterminate);
    }

    // Update label text
    if ('label' in newProps) {
      const labelEl = element.querySelector('.checkbox-label');
      if (labelEl) {
        labelEl.textContent = newProps.label;
      }
    }

    // Update validation state
    const isValid = validateCheckbox();
    element.classList.toggle(
      'checkbox-container--valid',
      state.required && isValid
    );
    element.classList.toggle('checkbox-container--invalid', !isValid);

    // Update validation message if applicable
    if (showValidation) {
      const messageEl = element.querySelector('.checkbox-validation-message');
      if (messageEl) {
        messageEl.textContent = !isValid
          ? state.validationMessage || 'This field is required'
          : '';
      }
    }

    // Update class name
    if ('className' in newProps && state.className !== newProps.className) {
      // Remove old class if it exists
      if (state.className) {
        element.classList.remove(state.className);
      }
      // Add new class if it exists
      if (newProps.className) {
        element.classList.add(newProps.className);
      }
    }
  };

  /**
   * Sets indeterminate state on a checkbox input
   * @param {HTMLInputElement} input - Checkbox input element
   * @param {boolean} isIndeterminate - Whether the checkbox should be indeterminate
   * @private
   */
  const setIndeterminateState = (input, isIndeterminate) => {
    // The indeterminate property can only be set via JavaScript, not as an HTML attribute.
    // We use setTimeout with 0ms delay as a "microtask" to ensure this runs after the
    // current execution context (after the element is fully created and possibly attached
    // to the DOM). This avoids potential timing issues in some browsers.
    setTimeout(() => {
      input.indeterminate = isIndeterminate;
    }, 0);
  };

  /**
   * Build the checkbox element
   * @returns {HTMLElement} The checkbox container element
   * @private
   */
  const buildCheckboxElement = () => {
    // Determine validation state
    const isValid = validateCheckbox();

    // Create container div with appropriate classes
    const containerClasses = ['checkbox-container'];
    if (state.className) {
      containerClasses.push(state.className);
    }
    if (state.required && isValid) {
      containerClasses.push('checkbox-container--valid');
    }
    if (!isValid) {
      containerClasses.push('checkbox-container--invalid');
    }
    if (state.loading) {
      containerClasses.push('checkbox-container--loading');
    }

    // Create container element
    const container = document.createElement('div');
    container.className = containerClasses.join(' ');

    // Create label wrapper
    const wrapper = document.createElement('label');
    wrapper.className = 'checkbox-wrapper';

    // Create input element - CRITICAL: Must have className set to 'checkbox-input'
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'checkbox-input'; // This must be exactly 'checkbox-input'

    // Set input attributes
    if (state.id) {
      input.id = state.id;
    }
    if (state.name) {
      input.name = state.name;
    }
    if (state.required) {
      input.required = true;
    }

    // Set properties
    input.checked = state.checked;
    input.disabled = state.disabled || state.loading;

    // Create or get the change handler once per component instance
    if (!handleChangeRef) {
      handleChangeRef = createChangeHandler(state, (newProps) =>
        componentApi.update(newProps)
      );
    }

    // Add event listener
    input.addEventListener('change', handleChangeRef);

    // Store listener reference for cleanup
    input._listeners = { change: handleChangeRef };

    // Create custom indicator
    const indicator = document.createElement('span');
    indicator.className = 'checkbox-indicator';

    // Create loading indicator if needed
    if (state.loading) {
      const spinner = document.createElement('span');
      spinner.className = 'checkbox-loading-spinner';
      indicator.appendChild(spinner);
    }

    // Create label text element - CRITICAL: Must have className set to 'checkbox-label'
    const labelText = document.createElement('span');
    labelText.className = 'checkbox-label'; // This must be exactly 'checkbox-label'
    labelText.textContent = state.label;

    // Assemble the component
    wrapper.appendChild(input);
    wrapper.appendChild(indicator);
    wrapper.appendChild(labelText);
    container.appendChild(wrapper);

    // Add validation message if needed
    if (state.showValidation) {
      const validationMessage = document.createElement('div');
      validationMessage.className = 'checkbox-validation-message';

      // Only show message text when invalid
      if (!isValid) {
        validationMessage.textContent =
          state.validationMessage || 'This field is required';
      }

      validationMessage.setAttribute('aria-live', 'polite');
      container.appendChild(validationMessage);
    }

    // Set indeterminate state after creation
    if (state.indeterminate) {
      setIndeterminateState(input, true);
    }

    return container;
  };

  // Build the initial element
  let element = buildCheckboxElement();

  // Public API
  const componentApi = {
    /**
     * Get the checkbox element
     * @returns {HTMLElement} The checkbox container element
     */
    getElement() {
      return element;
    },

    /**
     * Update checkbox properties
     * @param {Object} newProps - New properties
     * @returns {Object} Checkbox component (for chaining)
     */
    update(newProps) {
      // Handle prop aliasing
      const normalizedProps = migrateLegacyProps(newProps);

      // Keep checked and value in sync
      if ('checked' in normalizedProps && !('value' in normalizedProps)) {
        normalizedProps.value = normalizedProps.checked;
      } else if (
        'value' in normalizedProps &&
        !('checked' in normalizedProps)
      ) {
        normalizedProps.checked = normalizedProps.value;
      }

      // Determine if we need a full rebuild
      const needsFullRebuild =
        'id' in normalizedProps ||
        'name' in normalizedProps ||
        'showValidation' in normalizedProps;

      // Update state first
      Object.assign(state, normalizedProps);

      if (needsFullRebuild) {
        // Full rebuild for structural changes
        const oldElement = element;
        element = buildCheckboxElement();

        // Replace in DOM if inserted
        if (oldElement.parentNode) {
          oldElement.parentNode.replaceChild(element, oldElement);
        }
      } else {
        // Partial update for better performance
        partialUpdate(element, normalizedProps);
      }

      return this;
    },

    /**
     * Set checked state
     * @param {boolean} isChecked - Whether the checkbox should be checked
     * @returns {Object} Checkbox component (for chaining)
     */
    setChecked(isChecked) {
      return this.update({ checked: isChecked, value: isChecked });
    },

    /**
     * Set value (alias for setChecked)
     * @param {boolean} isChecked - Whether the checkbox should be checked
     * @returns {Object} Checkbox component (for chaining)
     */
    setValue(isChecked) {
      return this.setChecked(isChecked);
    },

    /**
     * Set indeterminate state
     * @param {boolean} isIndeterminate - Whether the checkbox should be indeterminate
     * @returns {Object} Checkbox component (for chaining)
     */
    setIndeterminate(isIndeterminate) {
      return this.update({ indeterminate: isIndeterminate });
    },

    /**
     * Get checked state
     * @returns {boolean} Whether the checkbox is checked
     */
    isChecked() {
      return state.checked;
    },

    /**
     * Get value (alias for isChecked)
     * @returns {boolean} Whether the checkbox is checked
     */
    getValue() {
      return state.checked;
    },

    /**
     * Validate the checkbox
     * @returns {boolean} Whether the checkbox is valid
     */
    validate() {
      const isValid = validateCheckbox();

      // Update validation state and trigger rebuild only if validation state changed
      if (state.isValid !== isValid) {
        this.update({ isValid });
      }

      return isValid;
    },

    /**
     * Check if the checkbox is valid
     * @returns {boolean} Whether the checkbox is valid
     */
    isValid() {
      return validateCheckbox();
    },

    /**
     * Clean up resources
     */
    destroy() {
      // Explicitly remove the event listener
      const input = element?.querySelector('input');
      if (input && input._listeners) {
        Object.entries(input._listeners).forEach(([event, handler]) => {
          input.removeEventListener(event, handler);
        });
        input._listeners = {};
      }

      // Clean up handler reference
      handleChangeRef = null;

      // Clear reference to element
      element = null;
    },
  };

  return componentApi;
};

// Define required props for validation
createCheckbox.requiredProps = ['label'];

// Export as a factory function
export default createComponent('Checkbox', createCheckbox);
