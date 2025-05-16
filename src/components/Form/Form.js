// src/components/Form/Form.js
import './Form.css';
import './FormValidation.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Form component
 * @extends Component
 */
export default class Form extends Component {
  /**
   * Creates a new Form instance
   *
   * @param {Object} props - Form properties
   * @param {Array|Object} props.children - Form content
   * @param {string} [props.id] - Form id
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {Function} [props.onSubmit] - Submit event handler
   * @param {Function} [props.onChange] - Change event handler
   * @param {boolean} [props.autoValidate=true] - Whether to validate on submit
   * @param {string} [props.layout='vertical'] - Form layout ('vertical' or 'horizontal')
   */
  constructor({
    children,
    id,
    className = '',
    onSubmit,
    onChange,
    autoValidate = true,
    layout = 'vertical',
  }) {
    super();

    // Validation
    if (!children) {
      throw new Error('Form: children are required');
    }

    if (layout !== 'vertical' && layout !== 'horizontal') {
      throw new Error('Form: layout must be either "vertical" or "horizontal"');
    }

    // Store props
    this.props = {
      children,
      id,
      className,
      onSubmit,
      onChange,
      autoValidate,
      layout,
    };

    // Store fields
    this.fields = [];

    // Create element
    this.form = this.createFormElement();
  }

  /**
   * Creates the form element
   * @private
   * @returns {HTMLFormElement} The form element
   */
  createFormElement() {
    const { id, className, layout, children } = this.props;

    // Create form element
    const form = this.createElement('form', {
      className: this.createClassNames('form', `form--${layout}`, className),
      attributes: {
        id,
        novalidate: this.props.autoValidate ? 'novalidate' : null,
      },
      events: {
        submit: this.handleSubmit.bind(this),
        change: this.handleChange.bind(this),
        input: this.handleInput.bind(this),
      },
    });

    // Add content
    this.appendChildren(form, children);

    return form;
  }

  /**
   * Handles form submission
   * @private
   * @param {Event} event - The submit event
   */
  handleSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    // Validate form if autoValidate is true
    let isValid = true;
    if (this.props.autoValidate) {
      isValid = this.validate();
    }

    // Get form data
    const formData = this.getFormData();

    // Call onSubmit callback if provided
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(event, formData, isValid);
    }
  }

  /**
   * Handles form change events
   * @private
   * @param {Event} event - The change event
   */
  handleChange(event) {
    // Call onChange callback if provided
    if (typeof this.props.onChange === 'function') {
      const formData = this.getFormData();
      this.props.onChange(event, formData);
    }
  }

  /**
   * Handles input events
   * @private
   */
  handleInput() {
    // This is mainly for real-time validation if needed
  }

  /**
   * Registers a form field component
   * @param {Object} field - The field component to register
   */
  registerField(field) {
    if (field && !this.fields.includes(field)) {
      this.fields.push(field);
    }

    return this;
  }

  /**
   * Validates all registered form fields
   * @returns {boolean} Whether the form is valid
   */
  validate() {
    // Validate all registered fields
    const fieldResults = this.fields.map((field) => {
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
  getFormData() {
    const formData = new FormData(this.form);
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

  /**
   * Resets the form
   */
  reset() {
    this.form.reset();

    // Reset all registered fields with reset method
    this.fields.forEach((field) => {
      if (typeof field.reset === 'function') {
        field.reset();
      }
    });

    return this;
  }

  /**
   * Sets form values
   * @param {Object} values - Object containing form values
   */
  setValues(values) {
    if (!values || typeof values !== 'object') {
      return this;
    }

    // Set values for form elements
    Object.entries(values).forEach(([name, value]) => {
      const elements = this.form.elements[name];

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
    this.fields.forEach((field) => {
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
  }

  /**
   * Gets the form element
   * @returns {HTMLFormElement} The form element
   */
  getElement() {
    return this.form;
  }
}
