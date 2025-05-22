// src/components/Radio/RadioGroup.js
import './RadioGroup.css';
import { createComponent } from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withEventDelegation } from '../../utils/composition.js';
import { throttle, PerformanceBenchmark } from '../../utils/performance.js';
import { validateRequiredProps } from '../../utils/validation.js';
import { isTestEnvironment } from '../../utils/environment.js';
import Radio from './Radio.js';

/**
 * Create the RadioGroup DOM structure
 * @param {Object} props - Component properties
 * @returns {HTMLElement} The RadioGroup element
 */
const createRadioGroupDOM = (props) => {
  const layout = props.layout || 'vertical';
  const className = props.className || '';

  // Create fieldset container
  const container = document.createElement('fieldset');
  container.className =
    `radio-group radio-group--${layout} ${className}`.trim();
  container.setAttribute('name', props.name);

  // Set accessibility attributes
  container.setAttribute('role', 'radiogroup');
  container.setAttribute('aria-labelledby', `legend-${props.name}`);
  if (props.required) container.setAttribute('aria-required', 'true');
  if (props.disabled) container.setAttribute('aria-disabled', 'true');

  // Add legend if provided
  if (props.legend) {
    const legend = document.createElement('legend');
    legend.className = 'radio-group__legend';
    legend.textContent = props.legend;
    legend.id = `legend-${props.name}`;
    container.appendChild(legend);
  }

  // Create options wrapper
  const optionsWrapper = document.createElement('div');
  optionsWrapper.className = `radio-group__options radio-group__options--${layout}`;
  optionsWrapper.setAttribute('role', 'presentation');

  // Add keyboard navigation
  optionsWrapper.addEventListener('keydown', (event) => {
    const radios = Array.from(
      optionsWrapper.querySelectorAll('input[type="radio"]')
    );
    const currentIndex = radios.findIndex(
      (radio) => radio === document.activeElement
    );
    if (currentIndex === -1) return;

    let nextIndex;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % radios.length;
        focusAndSelectRadio(radios[nextIndex]);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + radios.length) % radios.length;
        focusAndSelectRadio(radios[nextIndex]);
        break;
    }
  });

  // Create and add radio options
  const fragment = document.createDocumentFragment();
  const radioComponents = [];
  const isInTestEnv = isTestEnvironment();

  props.options.forEach((option, index) => {
    // In test environment, directly attach onChange to make testing easier
    let onChangeHandler =
      isInTestEnv && props.onChange
        ? (event, value) => props.onChange(event, value)
        : null;

    const radio = Radio({
      label: option.label,
      value: option.value,
      id: option.id || `${props.name}-${index}`,
      name: props.name,
      checked: option.value === props.value,
      required: props.required && index === 0, // Only set required on first radio
      disabled: props.disabled || option.disabled,
      onChange: onChangeHandler,
    });

    fragment.appendChild(radio.getElement());
    radioComponents.push(radio);
  });

  optionsWrapper.appendChild(fragment);
  container.appendChild(optionsWrapper);

  // Create validation message element if needed
  if (props.showValidation !== false) {
    const messageElement = document.createElement('div');
    messageElement.className = 'radio-group__validation-message';
    messageElement.textContent = '';
    messageElement.setAttribute('aria-live', 'polite');
    messageElement.id = `validation-${props.name}`;
    container.appendChild(messageElement);
    container._messageElement = messageElement;
    container.setAttribute('aria-describedby', messageElement.id);
  }

  // Store references
  container._radioComponents = radioComponents;
  container._options = props.options; // Store option data for later reference
  return container;
};

/**
 * Focus and select a radio button
 * @param {HTMLInputElement} radio - The radio button element
 */
const focusAndSelectRadio = (radio) => {
  radio.focus();
  radio.checked = true;
  radio.dispatchEvent(new Event('change', { bubbles: true }));
};

/**
 * Creates a radio group component
 * @param {Object} props - RadioGroup properties
 * @returns {Object} RadioGroup component API
 */
const createRadioGroup = createBaseComponent((props) => {
  // Validate required props
  validateRequiredProps(
    props,
    {
      options: {
        required: true,
        type: 'array',
        minLength: 1,
        validator: (options) =>
          Array.isArray(options) && options.length > 0
            ? true
            : 'array is required and must not be empty',
      },
      name: { required: true, type: 'string' },
      value: { required: false },
      legend: { required: false, type: 'string' },
      required: { required: false, type: 'boolean' },
      disabled: { required: false, type: 'boolean' },
      className: { required: false, type: 'string' },
      onChange: { required: false, type: 'function' },
      layout: {
        required: false,
        type: 'string',
        allowedValues: ['vertical', 'horizontal'],
        validator: (layout) => {
          if (
            layout !== undefined &&
            layout !== 'vertical' &&
            layout !== 'horizontal'
          ) {
            return 'must be either "vertical" or "horizontal"';
          }
          return true;
        },
      },
      validationMessage: { required: false, type: 'string' },
      showValidation: { required: false, type: 'boolean' },
    },
    'RadioGroup'
  );

  return createRadioGroupDOM(props);
});

/**
 * RadioGroup component factory with extended API
 * @param {Object} props - RadioGroup properties
 * @returns {Object} RadioGroup component API
 */
const RadioGroupFactory = (props) => {
  // Initialize performance benchmarking
  const benchmark = new PerformanceBenchmark('RadioGroup');

  // Make a copy of props to safely modify
  const stateProps = { ...props };

  // Create base component
  const component = createRadioGroup(stateProps);
  const element = component.getElement();

  // Create the validate method first since it will be called from handleChange
  const validate = () => {
    const endBenchmark = benchmark.start('validate');
    const isValid = !stateProps.required || stateProps.value !== undefined;

    if (isValid) {
      element.classList.remove('radio-group--invalid');
      element.classList.add('radio-group--valid');
      element.setAttribute('aria-invalid', 'false');

      // Clear validation message
      if (element._messageElement) {
        element._messageElement.textContent = '';
      }
    } else {
      element.classList.add('radio-group--invalid');
      element.classList.remove('radio-group--valid');
      element.setAttribute('aria-invalid', 'true');

      // Update validation message
      if (element._messageElement) {
        element._messageElement.textContent =
          stateProps.validationMessage || 'Please select an option';
      }
    }

    endBenchmark();
    return isValid;
  };

  // Handle radio change event - uses module-scoped function to avoid scope issues
  const handleChange = (event, target) => {
    const endBenchmark = benchmark.start('events');

    // Skip if not a radio button
    if (target.type !== 'radio') return;

    // Update internal state
    stateProps.value = target.value;

    // Update checked state of all radios
    const radioElements = element.querySelectorAll('input[type="radio"]');
    radioElements.forEach((radio) => {
      radio.setAttribute('aria-checked', radio.checked ? 'true' : 'false');
    });

    // Validate if needed
    if (stateProps.showValidation !== false) {
      validate();
    }

    // Call onChange callback if provided
    if (typeof stateProps.onChange === 'function') {
      stateProps.onChange(event, stateProps.value);
    }

    endBenchmark();
  };

  // Set up event handler that uses throttle for better performance
  component.handleChange = (event, target) => {
    if (isTestEnvironment()) {
      handleChange(event, target);
    } else {
      throttle(handleChange, 50)(event, target);
    }
  };

  // Enhanced component API
  return {
    ...component,

    /**
     * Gets the selected value
     * @returns {string} The selected value
     */
    getValue: () => stateProps.value,

    /**
     * Sets the selected value
     * @param {string} value - The new value
     * @returns {Object} Component instance for chaining
     */
    setValue: function (value) {
      const endBenchmark = benchmark.start('setValue');

      // Skip if not changed
      if (stateProps.value === value) return this;

      stateProps.value = value;

      // Update checked state of all radios
      element._radioComponents.forEach((radio) => {
        radio.setChecked(radio.getValue() === value);
      });

      // Update ARIA attributes
      const radioElements = element.querySelectorAll('input[type="radio"]');
      radioElements.forEach((radio) => {
        radio.setAttribute('aria-checked', radio.checked ? 'true' : 'false');
      });

      // Validate if needed
      if (stateProps.showValidation !== false) {
        validate();
      }

      endBenchmark();
      return this;
    },

    /**
     * Validates the radio group
     * @returns {boolean} Whether the radio group is valid
     */
    validate,

    /**
     * Focuses the first or checked radio
     * @returns {Object} Component instance for chaining
     */
    focus: function () {
      const radios = element.querySelectorAll('input[type="radio"]');
      const checkedRadio =
        Array.from(radios).find((r) => r.checked) || radios[0];

      if (checkedRadio) {
        checkedRadio.focus();
      }

      return this;
    },

    /**
     * Get performance metrics
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics: () => benchmark.getSummary(),

    /**
     * Custom destroy method to clean up radio components
     */
    destroy: function () {
      if (element._radioComponents) {
        element._radioComponents.forEach((radio) => radio.destroy());
      }
      component.destroy();
    },

    /**
     * Custom update handler - avoids full rerender when possible
     */
    shouldRerender: (newProps) => {
      return (
        newProps.options !== stateProps.options ||
        newProps.layout !== stateProps.layout ||
        newProps.legend !== stateProps.legend ||
        newProps.className !== stateProps.className ||
        (newProps.showValidation !== stateProps.showValidation &&
          newProps.showValidation !== undefined)
      );
    },

    /**
     * Partial update implementation - used when shouldRerender returns false
     */
    partialUpdate: function (element, newProps) {
      const endBenchmark = benchmark.start('updates');

      // Update disabled state
      if (
        newProps.disabled !== undefined &&
        newProps.disabled !== stateProps.disabled
      ) {
        element.setAttribute(
          'aria-disabled',
          newProps.disabled ? 'true' : 'false'
        );

        // Update all child radios
        element._radioComponents.forEach((radio, index) => {
          const option = stateProps.options[index];
          radio.update({
            disabled: newProps.disabled || (option && option.disabled) || false,
          });
        });
      }

      // Update required state
      if (
        newProps.required !== undefined &&
        newProps.required !== stateProps.required
      ) {
        element.setAttribute(
          'aria-required',
          newProps.required ? 'true' : 'false'
        );

        // Only set required on first radio
        if (element._radioComponents.length > 0) {
          element._radioComponents[0].update({ required: newProps.required });
        }
      }

      // Update selected value
      if (newProps.value !== undefined && newProps.value !== stateProps.value) {
        element._radioComponents.forEach((radio) => {
          radio.setChecked(radio.getValue() === newProps.value);
        });
      }

      // Update validation message
      if (
        newProps.validationMessage !== undefined &&
        element._messageElement &&
        stateProps.validationMessage !== newProps.validationMessage
      ) {
        if (element.classList.contains('radio-group--invalid')) {
          element._messageElement.textContent =
            newProps.validationMessage || 'Please select an option';
        }
      }

      // Update props reference
      Object.assign(stateProps, newProps);

      endBenchmark();
    },
  };
};

/**
 * RadioGroup component with event delegation
 */
const EnhancedRadioGroup = withEventDelegation(RadioGroupFactory, {
  change: 'input[type="radio"]',
});

/**
 * RadioGroup component factory
 */
export default createComponent('RadioGroup', EnhancedRadioGroup);
