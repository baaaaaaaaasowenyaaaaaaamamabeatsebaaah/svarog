// src/components/Form/FormContainer.js
import { Container } from '../../utils/containerFactory.js';
import Form from './Form.js';
import { eventBus } from '../../utils/eventBus.js';
import {
  registerForm,
  unregisterForm,
  validateForm,
  getFormData,
  resetForm,
} from '../../utils/formManager.js';

/**
 * Container for Form component
 * @extends Container
 */
export class FormContainer extends Container {
  /**
   * Create a Form container
   * @param {Object} props - Form props
   */
  constructor({
    id,
    children,
    className = '',
    onSubmit,
    onChange,
    autoValidate = true,
    layout = 'vertical',
  }) {
    super({
      PresentationalComponent: Form,
      initialState: {
        isValid: null,
        isSubmitting: false,
        formData: {},
      },
      props: {
        id,
        children,
        className,
        onSubmit,
        onChange,
        autoValidate,
        layout,
      },
    });

    // Create form ID if not provided
    this.formId = id || `form-${Math.random().toString(36).substr(2, 9)}`;

    // Bind methods
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Transform container state to presentational props
   * @override
   * @private
   * @returns {Object} Props for presentational component
   */
  _getPresentationalPropsFromState() {
    return {
      isValid: this.getState('isValid'),
      isSubmitting: this.getState('isSubmitting'),
      onSubmit: this.handleSubmit,
      onChange: this.handleChange,
    };
  }

  /**
   * Initialize component
   * @override
   */
  initialize() {
    super.initialize();

    // Register form with form manager
    registerForm(this.formId, this);

    // Subscribe to form validation events
    this.validationSubscription = eventBus.on(
      'form:validationChanged',
      (data) => {
        if (data.formId === this.formId) {
          this.setState({ isValid: data.isValid });
        }
      }
    );
  }

  /**
   * Handle form submission
   * @param {Event} event - Submit event
   */
  handleSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    // Set submitting state
    this.setState({ isSubmitting: true });

    // Validate all fields
    const isValid = validateForm(this.formId);

    // Get form data
    const formData = getFormData(this.formId);
    this.setState({ formData });

    // Call onSubmit callback if provided
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(event, formData, isValid);
    }

    // Reset submitting state
    this.setState({ isSubmitting: false });

    // Emit form submission event
    eventBus.emit('form:submitted', {
      formId: this.formId,
      isValid,
      formData,
    });
  }

  /**
   * Handle form change
   * @param {Event} event - Change event
   */
  handleChange(event) {
    // Get updated form data
    const formData = getFormData(this.formId);
    this.setState({ formData });

    // Call onChange callback if provided
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, formData);
    }

    // Emit form change event
    eventBus.emit('form:changed', {
      formId: this.formId,
      formData,
    });
  }

  /**
   * Set form validity state
   * @param {boolean} isValid - Whether the form is valid
   */
  setValid(isValid) {
    this.setState({ isValid });
  }

  /**
   * Validate the form
   * @returns {boolean} Whether the form is valid
   */
  validate() {
    return validateForm(this.formId);
  }

  /**
   * Get form data
   * @returns {Object} Form data
   */
  getFormData() {
    return getFormData(this.formId);
  }

  /**
   * Reset the form
   */
  reset() {
    resetForm(this.formId);
    this.setState({ formData: {} });
  }

  /**
   * Clean up resources
   * @override
   */
  destroy() {
    // Unregister form
    unregisterForm(this.formId);

    // Clean up event subscriptions
    if (this.validationSubscription) {
      this.validationSubscription();
    }

    super.destroy();
  }
}

// For backward compatibility
export default FormContainer;
