// src/components/Radio/Radio.js
import './Radio.css';
import { createComponent } from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { validateInput } from '../../utils/validation.js';
import { measurePerformance, debounce } from '../../utils/performance.js';

/**
 * Creates a radio button component
 * @param {Object} props - Radio properties
 * @param {string} props.label - Radio label
 * @param {string} props.value - Radio value
 * @param {string} [props.id] - Radio id
 * @param {string} [props.name] - Radio name
 * @param {boolean} [props.checked=false] - Whether the radio is checked
 * @param {boolean} [props.required=false] - Whether the radio is required
 * @param {boolean} [props.disabled=false] - Whether the radio is disabled
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {Function} [props.onChange] - Change event handler
 * @param {string} [props.validationMessage] - Custom validation message
 * @returns {Object} Radio component API
 */
const createRadio = createBaseComponent((props) => {
  // Validate required props
  if (!props.label) {
    throw new Error('Radio: label is required');
  }

  if (props.value === undefined || props.value === null) {
    throw new Error('Radio: value is required');
  }

  // Get default props
  const className = props.className || '';

  // Create the full markup
  const container = document.createElement('div');
  container.className = `radio-container ${className}`.trim();

  const wrapper = document.createElement('label');
  wrapper.className = 'radio-wrapper';

  // For accessibility, if id is not provided, generate one
  const id = props.id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  const input = document.createElement('input');
  input.type = 'radio';
  input.className = 'radio-input';
  input.id = id;
  if (props.name) input.name = props.name;
  if (props.value !== undefined) input.value = props.value;
  if (props.required) input.required = true;
  input.checked = props.checked || false;
  if (props.disabled) input.disabled = true;

  // Enhanced accessibility attributes
  input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
  if (props.disabled) input.setAttribute('aria-disabled', 'true');
  if (props.required) input.setAttribute('aria-required', 'true');

  const indicator = document.createElement('span');
  indicator.className = 'radio-indicator';
  indicator.setAttribute('aria-hidden', 'true'); // Hide from screen readers

  const labelText = document.createElement('span');
  labelText.className = 'radio-label';
  labelText.textContent = props.label;
  labelText.setAttribute('for', id); // Associate with input for accessibility

  // Add change handler
  const handleChange = (event) => {
    // Update aria-checked attribute for accessibility
    input.setAttribute('aria-checked', event.target.checked ? 'true' : 'false');

    // If validation message is provided, validate on change
    if (props.validationMessage && container.validationContainer) {
      validateInput(input, {
        container: container,
        messageElement: container.validationContainer,
        customMessage: props.validationMessage,
      });
    }

    if (typeof props.onChange === 'function') {
      props.onChange(event, props.value);
    }
  };

  // Use debounced handler for high-frequency changes (like rapid clicks)
  const debouncedHandler = debounce(handleChange, 50);

  input.addEventListener('change', debouncedHandler);

  // Store handler reference for cleanup
  input._changeHandler = debouncedHandler;

  // Build the component
  wrapper.appendChild(input);
  wrapper.appendChild(indicator);
  wrapper.appendChild(labelText);
  container.appendChild(wrapper);

  // Add validation message container if provided
  if (props.validationMessage) {
    const validationContainer = document.createElement('div');
    validationContainer.className = 'radio-validation-message';
    validationContainer.setAttribute('aria-live', 'polite');
    container.appendChild(validationContainer);
    container.validationContainer = validationContainer;
  }

  // Store references for updates
  container._input = input;
  container._label = labelText;

  return container;
});

/**
 * Radio component factory with extended API
 * @param {Object} props - Radio properties
 * @returns {Object} Radio component API
 */
const RadioFactory = (props) => {
  // Create base component
  const component = createRadio(props);
  const element = component.getElement();
  const inputElement = element._input;

  // Add partial update implementation for efficient updates
  component.shouldRerender = (newProps) => {
    // Always do a full rerender if key props change that affect the structure
    return (
      newProps.label !== props.label ||
      newProps.className !== props.className ||
      (newProps.validationMessage !== props.validationMessage &&
        (!newProps.validationMessage || !props.validationMessage))
    );
  };

  // Partial update implementation
  component.partialUpdate = (element, newProps) => {
    // Measure performance of update operation
    return measurePerformance(() => {
      // Update basic properties
      if (
        newProps.checked !== undefined &&
        inputElement.checked !== newProps.checked
      ) {
        inputElement.checked = newProps.checked;
        inputElement.setAttribute(
          'aria-checked',
          newProps.checked ? 'true' : 'false'
        );
      }

      if (
        newProps.disabled !== undefined &&
        inputElement.disabled !== newProps.disabled
      ) {
        inputElement.disabled = newProps.disabled;
        inputElement.setAttribute(
          'aria-disabled',
          newProps.disabled ? 'true' : 'false'
        );
      }

      if (
        newProps.required !== undefined &&
        inputElement.required !== newProps.required
      ) {
        inputElement.required = newProps.required;
        inputElement.setAttribute(
          'aria-required',
          newProps.required ? 'true' : 'false'
        );
      }

      if (newProps.name !== undefined && inputElement.name !== newProps.name) {
        inputElement.name = newProps.name;
      }

      if (
        newProps.value !== undefined &&
        inputElement.value !== newProps.value
      ) {
        inputElement.value = newProps.value;
      }

      if (
        newProps.label !== undefined &&
        element._label.textContent !== newProps.label
      ) {
        element._label.textContent = newProps.label;
      }

      // Update validation message if applicable
      if (
        newProps.validationMessage !== undefined &&
        element.validationContainer &&
        props.validationMessage !== newProps.validationMessage
      ) {
        validateInput(inputElement, {
          container: element,
          messageElement: element.validationContainer,
          customMessage: newProps.validationMessage,
        });
      }

      // Update props reference
      Object.assign(props, newProps);
    }, 'Radio.partialUpdate');
  };

  // Add additional methods to the component API
  return {
    ...component,

    /**
     * Gets the radio value
     * @returns {string} The radio value
     */
    getValue: () => props.value,

    /**
     * Checks if the radio is checked
     * @returns {boolean} Whether the radio is checked
     */
    isChecked: () => inputElement.checked,

    /**
     * Sets the checked state
     * @param {boolean} checked - The new checked state
     * @returns {Object} Component instance for chaining
     */
    setChecked: function (checked) {
      inputElement.checked = checked;
      inputElement.setAttribute('aria-checked', checked ? 'true' : 'false');
      return this;
    },

    /**
     * Validates the radio input
     * @returns {boolean} Whether the input is valid
     */
    validate: function () {
      if (element.validationContainer) {
        return validateInput(inputElement, {
          container: element,
          messageElement: element.validationContainer,
          customMessage: props.validationMessage,
        });
      }
      return inputElement.checkValidity();
    },

    /**
     * Focuses the radio input
     * @returns {Object} Component instance for chaining
     */
    focus: function () {
      inputElement.focus();
      return this;
    },

    /**
     * Custom destroy method to ensure event listener cleanup
     */
    destroy: function () {
      if (inputElement && inputElement._changeHandler) {
        inputElement.removeEventListener('change', inputElement._changeHandler);
      }
      component.destroy();
    },
  };
};

/**
 * Radio component factory
 */
export default createComponent('Radio', RadioFactory);
