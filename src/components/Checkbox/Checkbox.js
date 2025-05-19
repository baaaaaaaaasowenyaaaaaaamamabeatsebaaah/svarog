// src/components/Checkbox/Checkbox.js
import './Checkbox.css';
import { createComponent } from '../../utils/componentFactory.js';

/**
 * Creates a Checkbox component
 * @param {Object} props - Checkbox properties
 * @returns {Object} Checkbox component
 */
const createCheckbox = (props) => {
  // Destructure props with defaults
  const {
    label,
    id,
    name,
    checked = false,
    required = false,
    disabled = false,
    className = '',
    onChange,
    validationMessage = '',
    showValidation = true,
    indeterminate = false,
  } = props;

  // Component state
  const state = {
    label,
    id,
    name,
    checked,
    required,
    disabled,
    className,
    onChange,
    validationMessage,
    showValidation,
    indeterminate,
    isValid: true,
  };

  /**
   * Handles change events
   * @param {Event} event - The change event
   */
  const handleChange = (event) => {
    // Call onChange callback if provided
    if (typeof state.onChange === 'function') {
      state.onChange(event, event.target.checked);
    }

    // Create a new component with updated state
    componentApi.update({ checked: event.target.checked });
  };

  /**
   * Validates the checkbox
   * @returns {boolean} Whether the checkbox is valid
   */
  const validateCheckbox = () => {
    return !state.required || state.checked;
  };

  /**
   * Build the checkbox element
   * @returns {HTMLElement} The checkbox container element
   */
  const buildCheckboxElement = () => {
    // Determine validation state
    const isValid = validateCheckbox();

    // Create container div with appropriate classes
    const containerClasses = ['checkbox-container'];
    if (state.className) containerClasses.push(state.className);
    if (state.required && isValid)
      containerClasses.push('checkbox-container--valid');
    if (!isValid) containerClasses.push('checkbox-container--invalid');

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
    if (state.id) input.id = state.id;
    if (state.name) input.name = state.name;
    if (state.required) input.required = true;

    // Set properties
    input.checked = state.checked;
    input.disabled = state.disabled;

    // Add event listener
    input.addEventListener('change', handleChange);

    // Store listener reference for cleanup
    input._listeners = { change: handleChange };

    // Create custom indicator
    const indicator = document.createElement('span');
    indicator.className = 'checkbox-indicator';

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

    // Set indeterminate state after creation since it can't be set as an attribute
    if (state.indeterminate) {
      setTimeout(() => {
        input.indeterminate = true;
      }, 0);
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
      // Update state
      Object.assign(state, newProps);

      // Rebuild element
      const oldElement = element;
      element = buildCheckboxElement();

      // Replace in DOM if inserted
      if (oldElement.parentNode) {
        oldElement.parentNode.replaceChild(element, oldElement);
      }

      return this;
    },

    /**
     * Set checked state
     * @param {boolean} isChecked - Whether the checkbox should be checked
     * @returns {Object} Checkbox component (for chaining)
     */
    setChecked(isChecked) {
      return this.update({ checked: isChecked });
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
