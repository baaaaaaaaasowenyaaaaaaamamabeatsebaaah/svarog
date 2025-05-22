// src/components/Form/Form.js
import './Form.css';
import './FormValidation.css';
import {
  createComponent,
  createElement,
  appendChildren,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { validateRequiredProps } from '../../utils/validation.js';
import { debounce } from '../../utils/performance.js';

/**
 * Creates a Form component for handling form functionality
 * @param {Object} props - Form properties
 * @returns {Object} Form component API
 */
const createForm = (props) => {
  // Validate required props
  validateRequiredProps(
    props,
    {
      children: { required: true },
      layout: {
        required: false,
        type: 'string',
        allowedValues: ['vertical', 'horizontal'],
        validator: (layout) => {
          if (layout && layout !== 'vertical' && layout !== 'horizontal') {
            return 'must be either "vertical" or "horizontal"';
          }
          return true;
        },
      },
    },
    'Form'
  );

  // Initialize state from props with defaults
  const state = {
    children: props.children,
    id: props.id,
    className: props.className || '',
    onSubmit: props.onSubmit,
    onChange: props.onChange,
    autoValidate: props.autoValidate !== undefined ? props.autoValidate : true,
    layout: props.layout || 'vertical',
  };

  // Store registered form fields
  const fields = [];

  // Define event handlers before using them in createFormElement

  /**
   * Handles form submission
   * @private
   * @param {Event} event - The submit event
   */
  function handleSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    // Validate form if autoValidate is true
    let isValid = true;
    if (state.autoValidate) {
      isValid = validate();
    }

    // Get form data
    const formData = getFormData();

    // Call onSubmit callback if provided
    if (typeof state.onSubmit === 'function') {
      state.onSubmit(event, formData, isValid);
    }
  }

  /**
   * Handles form change events
   * @private
   * @param {Event} event - The change event
   */
  function handleChange(event) {
    // Call onChange callback if provided
    if (typeof state.onChange === 'function') {
      const formData = getFormData();
      state.onChange(event, formData);
    }
  }

  /**
   * Handles input events
   * @private
   * @param {Event} event - The input event
   */
  const handleInput = debounce(() => {
    // This is mainly for real-time validation if needed
    // Currently a stub but can be expanded for real-time validation
    // Using _event prefix to indicate intentionally unused parameter
  }, 100);

  /**
   * Creates the form element
   * @private
   * @param {Object} state - Current state
   * @returns {HTMLFormElement} The form element
   */
  function createFormElement(state) {
    const { id, className, layout, children, autoValidate } = state;

    // Create form element
    const form = createElement('form', {
      classes: ['form', `form--${layout}`, className],
      attributes: {
        id,
        novalidate: autoValidate ? 'novalidate' : null,
      },
      events: {
        submit: handleSubmit,
        change: handleChange,
        input: handleInput,
      },
    });

    // Add content
    appendChildren(form, children);

    return form;
  }

  // Create base component with render function
  const component = createBaseComponent((componentState) => {
    return createFormElement(componentState);
  })(state);

  // Get the form element
  const formElement = component.getElement();

  /**
   * Validates all registered form fields
   * @returns {boolean} Whether the form is valid
   */
  function validate() {
    // Validate all registered fields
    const fieldResults = fields.map((field) => {
      // Skip fields that don't have a validate method
      if (typeof field.validate !== 'function') {
        return true;
      }
      return field.validate();
    });

    // Form is valid if all fields are valid
    return fieldResults.every((isValid) => isValid);
  }

  /**
   * Gets the form data
   * @returns {Object} Form data as key-value pairs
   */
  function getFormData() {
    const formData = new FormData(formElement);
    const data = {};

    // Convert FormData to plain object
    for (const [key, value] of formData.entries()) {
      // Handle multiple values for the same key (e.g., checkboxes)
      if (data[key] !== undefined) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }

    return data;
  }

  // Public API
  return {
    /**
     * Gets the form element
     * @returns {HTMLFormElement} The form element
     */
    getElement() {
      return formElement;
    },

    /**
     * Registers a form field component
     * @param {Object} field - The field component to register
     * @returns {Object} Form component for chaining
     */
    registerField(field) {
      if (field && !fields.includes(field)) {
        fields.push(field);
      }
      return this;
    },

    /**
     * Validates all registered form fields
     * @returns {boolean} Whether the form is valid
     */
    validate,

    /**
     * Gets the form data
     * @returns {Object} Form data as key-value pairs
     */
    getFormData,

    /**
     * Resets the form
     * @returns {Object} Form component for chaining
     */
    reset() {
      formElement.reset();

      // Reset all registered fields with reset method
      fields.forEach((field) => {
        if (typeof field.reset === 'function') {
          field.reset();
        }
      });

      return this;
    },

    /**
     * Sets form values
     * @param {Object} values - Object containing form values
     * @returns {Object} Form component for chaining
     */
    setValues(values) {
      if (!values || typeof values !== 'object') {
        return this;
      }

      // Set values for form elements
      Object.entries(values).forEach(([name, value]) => {
        const elements = formElement.elements[name];

        if (!elements) {
          return;
        }

        // Handle radio groups and multiple elements with the same name
        if (elements instanceof RadioNodeList) {
          Array.from(elements).forEach((element) => {
            // Handle checkboxes and radio buttons
            if (element.type === 'checkbox' || element.type === 'radio') {
              if (Array.isArray(value)) {
                element.checked = value.includes(element.value);
              } else {
                element.checked = element.value === value;
              }
            } else {
              element.value = value;
            }
          });
        } else {
          // Handle single elements
          if (elements.type === 'checkbox') {
            elements.checked = Boolean(value);
          } else {
            elements.value = value;
          }
        }
      });

      // Update registered field components
      fields.forEach((field) => {
        const name = field.props?.name;
        if (
          name &&
          values[name] !== undefined &&
          typeof field.setValue === 'function'
        ) {
          field.setValue(values[name]);
        }
      });

      return this;
    },

    /**
     * Updates component with new props
     * @param {Object} newProps - New properties
     * @returns {Object} Form component for chaining
     */
    update(newProps) {
      // Update state
      Object.assign(state, newProps);

      // Update component
      component.update(state);

      return this;
    },

    /**
     * Clean up resources
     */
    destroy() {
      // Clean up event listeners
      formElement.removeEventListener('submit', handleSubmit);
      formElement.removeEventListener('change', handleChange);
      formElement.removeEventListener('input', handleInput);

      // Clear field references
      fields.length = 0;

      // Call base component's destroy
      component.destroy();
    },
  };
};

// Define required props for validation
createForm.requiredProps = ['children'];

// Export as a component factory
export default createComponent('Form', createForm);
