// src/components/Radio/RadioGroup.js
import './RadioGroup.css';
import { createComponent } from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withEventDelegation } from '../../utils/composition.js';
import { measurePerformance, throttle } from '../../utils/performance.js';
import Radio from './Radio.js';

/**
 * Creates a radio group component
 * @param {Object} props - RadioGroup properties
 * @param {Array<Object>} props.options - Radio options
 * @param {string} [props.name] - Group name
 * @param {string} [props.value] - Selected value
 * @param {string} [props.legend] - Group legend/title
 * @param {boolean} [props.required=false] - Whether a selection is required
 * @param {boolean} [props.disabled=false] - Whether the group is disabled
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {Function} [props.onChange] - Change event handler
 * @param {string} [props.layout='vertical'] - Layout direction ('vertical' or 'horizontal')
 * @param {string} [props.validationMessage] - Custom validation message
 * @param {boolean} [props.showValidation=true] - Whether to show validation messages
 * @returns {Object} RadioGroup component API
 */
const createRadioGroup = createBaseComponent((props) => {
  // Validation
  if (!Array.isArray(props.options) || props.options.length === 0) {
    throw new Error(
      'RadioGroup: options array is required and must not be empty'
    );
  }

  if (!props.name) {
    throw new Error('RadioGroup: name is required');
  }

  if (
    props.layout !== undefined &&
    props.layout !== 'vertical' &&
    props.layout !== 'horizontal'
  ) {
    throw new Error(
      'RadioGroup: layout must be either "vertical" or "horizontal"'
    );
  }

  // Get default props
  const layout = props.layout || 'vertical';
  const className = props.className || '';

  // Create fieldset container
  const container = document.createElement('fieldset');
  container.className =
    `radio-group radio-group--${layout} ${className}`.trim();
  container.setAttribute('name', props.name);

  // Enhanced accessibility attributes
  container.setAttribute('role', 'radiogroup');
  container.setAttribute('aria-labelledby', `legend-${props.name}`);
  if (props.required) container.setAttribute('aria-required', 'true');
  if (props.disabled) container.setAttribute('aria-disabled', 'true');

  // Add legend if provided
  if (props.legend) {
    const legend = document.createElement('legend');
    legend.className = 'radio-group__legend';
    legend.textContent = props.legend;
    legend.id = `legend-${props.name}`; // For aria-labelledby
    container.appendChild(legend);
  }

  // Create options wrapper
  const optionsWrapper = document.createElement('div');
  optionsWrapper.className = `radio-group__options radio-group__options--${layout}`;

  // Keyboard navigation enhancement
  optionsWrapper.setAttribute('role', 'presentation');
  optionsWrapper.addEventListener('keydown', (event) => {
    // Handle keyboard navigation
    const radios = Array.from(
      container.querySelectorAll('input[type="radio"]')
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
        radios[nextIndex].focus();
        radios[nextIndex].checked = true;
        radios[nextIndex].dispatchEvent(new Event('change', { bubbles: true }));
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + radios.length) % radios.length;
        radios[nextIndex].focus();
        radios[nextIndex].checked = true;
        radios[nextIndex].dispatchEvent(new Event('change', { bubbles: true }));
        break;
      default:
        break;
    }
  });

  // Store radio components and validation message for easy access
  container._radioComponents = [];
  container._messageElement = null;

  // For large numbers of options, use a DocumentFragment for better performance
  const fragment = document.createDocumentFragment();

  // Create radio buttons for each option - but only actually create DOM for visible options
  // to improve performance with large option sets
  props.options.forEach((option, index) => {
    const radio = Radio({
      label: option.label,
      value: option.value,
      id: option.id || `${props.name}-${index}`,
      name: props.name,
      checked: option.value === props.value,
      required: props.required && index === 0, // Only set required on first radio
      disabled: props.disabled || option.disabled,
      // Use a custom onChange handler that will bubble up to our event delegation handler
      onChange: null,
    });

    // Add to fragment
    fragment.appendChild(radio.getElement());

    // Store reference
    container._radioComponents.push(radio);
  });

  // Add all radios at once for better performance
  optionsWrapper.appendChild(fragment);
  container.appendChild(optionsWrapper);

  // Create validation message element if needed
  if (props.showValidation !== false) {
    const validationMessage = document.createElement('div');
    validationMessage.className = 'radio-group__validation-message';
    validationMessage.textContent = '';
    validationMessage.setAttribute('aria-live', 'polite');
    validationMessage.id = `validation-${props.name}`;

    container.appendChild(validationMessage);
    container._messageElement = validationMessage;

    // Link validation message to group for accessibility
    container.setAttribute('aria-describedby', validationMessage.id);
  }

  return container;
});

/**
 * Handle radio change with event delegation
 * @param {Event} event - The change event
 * @param {HTMLElement} target - The radio input that changed
 * @param {Object} component - The component instance
 * @param {Object} props - The component props
 */
const handleRadioChange = (event, target, component, props) => {
  // Skip if not a radio button
  if (target.type !== 'radio') return;

  // Get the selected value
  const value = target.value;

  // Update internal state
  props.value = value;

  // Update checked state of all radios (not needed with native radio behavior)
  // but ensures our component state is sync'd
  const radioElements = component
    .getElement()
    .querySelectorAll('input[type="radio"]');
  radioElements.forEach((radio) => {
    radio.setAttribute('aria-checked', radio.checked ? 'true' : 'false');
  });

  // Validate if needed
  if (props.showValidation !== false) {
    component.validate();
  }

  // Call onChange callback if provided (throttled for performance with many radios)
  if (typeof props.onChange === 'function') {
    props.onChange(event, value);
  }
};

/**
 * RadioGroup component factory with extended API
 * @param {Object} props - RadioGroup properties
 * @returns {Object} RadioGroup component API
 */
const RadioGroupFactory = (props) => {
  // Make a copy of props to safely modify
  const stateProps = { ...props };

  // Create base component
  const component = createRadioGroup(stateProps);
  const element = component.getElement();

  // Create throttled change handler for performance with many options
  const throttledChangeHandler = throttle((event, target) => {
    handleRadioChange(event, target, component, stateProps);
  }, 50);

  // Set up event delegation for all radio changes
  element.addEventListener('change', (event) => {
    const target = event.target;
    throttledChangeHandler(event, target);
  });

  // Add partial update implementation for efficient updates
  component.shouldRerender = (newProps) => {
    // Full rerender needed if structure changes significantly
    return (
      newProps.options !== stateProps.options ||
      newProps.layout !== stateProps.layout ||
      newProps.legend !== stateProps.legend ||
      newProps.className !== stateProps.className ||
      (newProps.showValidation !== stateProps.showValidation &&
        newProps.showValidation !== undefined)
    );
  };

  // Partial update implementation for performance
  component.partialUpdate = (element, newProps) => {
    // Measure performance of update operation
    return measurePerformance(() => {
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
        element._radioComponents.forEach((radio) => {
          radio.update({
            disabled: newProps.disabled || radio.getValue().disabled || false,
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
        // Only update if validation is showing
        if (element.classList.contains('radio-group--invalid')) {
          element._messageElement.textContent =
            newProps.validationMessage || 'Please select an option';
        }
      }

      // Update props reference
      Object.assign(stateProps, newProps);
    }, 'RadioGroup.partialUpdate');
  };

  // Add additional methods to the component API
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
        this.validate();
      }

      return this;
    },

    /**
     * Validates the radio group
     * @returns {boolean} Whether the radio group is valid
     */
    validate: function () {
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

      return isValid;
    },

    /**
     * Focuses the first or checked radio
     * @returns {Object} Component instance for chaining
     */
    focus: function () {
      // Find the checked radio, or first radio if none checked
      const radios = element.querySelectorAll('input[type="radio"]');
      const checkedRadio =
        Array.from(radios).find((r) => r.checked) || radios[0];

      if (checkedRadio) {
        checkedRadio.focus();
      }

      return this;
    },

    /**
     * Custom destroy method to clean up radio components
     */
    destroy: function () {
      // Clean up all radio components
      if (element._radioComponents) {
        element._radioComponents.forEach((radio) => radio.destroy());
      }

      // Clean up event listeners
      element.removeEventListener('change', throttledChangeHandler);

      // Call the original destroy method
      component.destroy();
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
