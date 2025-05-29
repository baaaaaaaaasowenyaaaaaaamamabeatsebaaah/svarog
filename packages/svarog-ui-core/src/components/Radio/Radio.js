// src/components/Radio/Radio.js
import { createComponent } from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import {
  validateInput,
  validateRequiredProps,
} from '../../utils/validation.js';
import { debounce, PerformanceBenchmark } from '../../utils/performance.js';
import { isTestEnvironment } from '../../utils/environment.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { radioStyles } from './Radio.styles.js';

// Create style injector for Radio component
const injectRadioStyles = createStyleInjector('Radio');

/**
 * Migrate legacy props to standardized props
 * @param {Object} props - Component properties
 * @returns {Object} Normalized properties
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  // No specific property migrations needed for Radio component currently

  return migrated;
};

/**
 * Create the DOM structure for the radio component
 * @param {Object} props - Component properties
 * @returns {HTMLElement} The created DOM structure
 */
const createRadioDOM = (props) => {
  // Inject styles on first render
  injectRadioStyles(radioStyles);

  // Create container
  const container = document.createElement('div');
  container.className = `radio-container ${props.className || ''}`.trim();

  // Create label wrapper
  const wrapper = document.createElement('label');
  wrapper.className = 'radio-wrapper';

  // Create input element
  const id = props.id || `radio-${Math.random().toString(36).substr(2, 9)}`;
  const input = createRadioInput(props, id);

  // Create visual indicator
  const indicator = document.createElement('span');
  indicator.className = 'radio-indicator';
  indicator.setAttribute('aria-hidden', 'true');

  // Create label text
  const labelText = document.createElement('span');
  labelText.className = 'radio-label';
  labelText.textContent = props.label;
  labelText.setAttribute('for', id);

  // Build component structure
  wrapper.appendChild(input);
  wrapper.appendChild(indicator);
  wrapper.appendChild(labelText);
  container.appendChild(wrapper);

  // Add validation container if needed
  if (props.validationMessage) {
    const validationContainer = createValidationContainer();
    container.appendChild(validationContainer);
    container.validationContainer = validationContainer;
  }

  // Store references for updates
  container._input = input;
  container._label = labelText;

  return container;
};

/**
 * Create a radio input element with appropriate attributes
 * @param {Object} props - Radio properties
 * @param {string} id - Element ID
 * @returns {HTMLInputElement} The created input element
 */
const createRadioInput = (props, id) => {
  const input = document.createElement('input');
  input.type = 'radio';
  input.className = 'radio-input';
  input.id = id;

  // Set attributes based on props
  if (props.name) input.name = props.name;
  if (props.value !== undefined) input.value = props.value;
  if (props.required) input.required = true;
  input.checked = props.checked || false;
  if (props.disabled) input.disabled = true;

  // Set ARIA attributes
  updateInputAccessibility(input, props);

  return input;
};

/**
 * Create a validation message container
 * @returns {HTMLDivElement} Validation container element
 */
const createValidationContainer = () => {
  const container = document.createElement('div');
  container.className = 'radio-validation-message';
  container.setAttribute('aria-live', 'polite');
  return container;
};

/**
 * Update input element accessibility attributes
 * @param {HTMLInputElement} input - The input element
 * @param {Object} props - Component properties
 */
const updateInputAccessibility = (input, props) => {
  input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
  if (props.disabled) input.setAttribute('aria-disabled', 'true');
  if (props.required) input.setAttribute('aria-required', 'true');
};

/**
 * Create a change event handler for the radio input
 * @param {HTMLInputElement} input - The input element
 * @param {HTMLElement} container - The container element
 * @param {Object} props - Component properties
 * @returns {Function} The event handler
 */
const createChangeHandler = (input, container, props) => {
  const handleChange = (event) => {
    // Update accessibility state
    input.setAttribute('aria-checked', event.target.checked ? 'true' : 'false');

    // Validate if required
    if (props.validationMessage && container.validationContainer) {
      validateInput(input, {
        container,
        messageElement: container.validationContainer,
        customMessage: props.validationMessage,
      });
    }

    // Call onChange callback if provided
    if (typeof props.onChange === 'function') {
      props.onChange(event, props.value);
    }
  };

  // Use appropriate handler based on environment
  return isTestEnvironment() ? handleChange : debounce(handleChange, 50);
};

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
 * @returns {Object} Radio component API
 */
const createRadio = createBaseComponent((props) => {
  // Normalize props
  const normalizedProps = migrateLegacyProps(props);

  // Validate required props
  validateRequiredProps(
    normalizedProps,
    {
      label: { required: true, type: 'string' },
      value: { required: true },
      id: { required: false, type: 'string' },
      name: { required: false, type: 'string' },
      checked: { required: false, type: 'boolean' },
      required: { required: false, type: 'boolean' },
      disabled: { required: false, type: 'boolean' },
      className: { required: false, type: 'string' },
      onChange: { required: false, type: 'function' },
      validationMessage: { required: false, type: 'string' },
    },
    'Radio'
  );

  // Create component DOM structure
  const container = createRadioDOM(normalizedProps);
  const inputElement = container._input;

  // Set up event handling
  const handler = createChangeHandler(inputElement, container, normalizedProps);
  inputElement.addEventListener('change', handler);
  inputElement._changeHandler = handler; // Store for cleanup

  return container;
});

/**
 * Radio component factory with extended API
 * @param {Object} props - Radio properties
 * @returns {Object} Radio component API
 */
const RadioFactory = (props) => {
  // Initialize performance benchmarking
  const benchmark = new PerformanceBenchmark('Radio');

  // Normalize props
  const normalizedProps = migrateLegacyProps(props);

  // Create base component
  const component = createRadio(normalizedProps);
  const element = component.getElement();
  const inputElement = element._input;

  // Determine when a full rerender is needed
  component.shouldRerender = (newProps) => {
    const normalizedNewProps = migrateLegacyProps(newProps);
    return (
      normalizedNewProps.label !== normalizedProps.label ||
      normalizedNewProps.className !== normalizedProps.className ||
      (normalizedNewProps.validationMessage !==
        normalizedProps.validationMessage &&
        (!normalizedNewProps.validationMessage ||
          !normalizedProps.validationMessage))
    );
  };

  // Partial update implementation
  component.partialUpdate = (element, newProps) => {
    const endBenchmark = benchmark.start('updates');

    // Normalize props
    const normalizedNewProps = migrateLegacyProps(newProps);

    // Update checked state
    if (
      normalizedNewProps.checked !== undefined &&
      inputElement.checked !== normalizedNewProps.checked
    ) {
      inputElement.checked = normalizedNewProps.checked;
      inputElement.setAttribute(
        'aria-checked',
        normalizedNewProps.checked ? 'true' : 'false'
      );
    }

    // Update disabled state
    if (
      normalizedNewProps.disabled !== undefined &&
      inputElement.disabled !== normalizedNewProps.disabled
    ) {
      inputElement.disabled = normalizedNewProps.disabled;
      inputElement.setAttribute(
        'aria-disabled',
        normalizedNewProps.disabled ? 'true' : 'false'
      );
    }

    // Update required state
    if (
      normalizedNewProps.required !== undefined &&
      inputElement.required !== normalizedNewProps.required
    ) {
      inputElement.required = normalizedNewProps.required;
      inputElement.setAttribute(
        'aria-required',
        normalizedNewProps.required ? 'true' : 'false'
      );
    }

    // Update name attribute
    if (
      normalizedNewProps.name !== undefined &&
      inputElement.name !== normalizedNewProps.name
    ) {
      inputElement.name = normalizedNewProps.name;
    }

    // Update value
    if (
      normalizedNewProps.value !== undefined &&
      inputElement.value !== normalizedNewProps.value
    ) {
      inputElement.value = normalizedNewProps.value;
    }

    // Update label text
    if (
      normalizedNewProps.label !== undefined &&
      element._label.textContent !== normalizedNewProps.label
    ) {
      element._label.textContent = normalizedNewProps.label;
    }

    // Update validation message
    if (
      normalizedNewProps.validationMessage !== undefined &&
      element.validationContainer &&
      normalizedProps.validationMessage !== normalizedNewProps.validationMessage
    ) {
      validateInput(inputElement, {
        container: element,
        messageElement: element.validationContainer,
        customMessage: normalizedNewProps.validationMessage,
      });
    }

    // Update props reference
    Object.assign(normalizedProps, normalizedNewProps);

    endBenchmark();
  };

  // Enhanced component API
  return {
    ...component,

    /**
     * Gets the radio value
     * @returns {string} The radio value
     */
    getValue: () => normalizedProps.value,

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
    setChecked(checked) {
      inputElement.checked = checked;
      inputElement.setAttribute('aria-checked', checked ? 'true' : 'false');
      return this;
    },

    /**
     * Validates the radio input
     * @returns {boolean} Whether the input is valid
     */
    validate() {
      if (element.validationContainer) {
        return validateInput(inputElement, {
          container: element,
          messageElement: element.validationContainer,
          customMessage: normalizedProps.validationMessage,
        });
      }
      return inputElement.checkValidity();
    },

    /**
     * Focuses the radio input
     * @returns {Object} Component instance for chaining
     */
    focus() {
      inputElement.focus();
      return this;
    },

    /**
     * Get performance metrics
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics() {
      return benchmark.getSummary();
    },

    /**
     * Custom destroy method to ensure event listener cleanup
     */
    destroy() {
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
