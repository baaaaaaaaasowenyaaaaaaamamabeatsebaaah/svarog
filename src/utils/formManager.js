// src/utils/formManager.js
import { componentRegistry } from './componentRegistry.js';
import { eventBus } from './eventBus.js';

/**
 * Form manager to coordinate form components
 */
class FormManager {
  constructor() {
    this.forms = new Map();

    // Listen for field events
    eventBus.on('form:fieldRegistered', this.handleFieldRegistered.bind(this));
    eventBus.on(
      'form:fieldUnregistered',
      this.handleFieldUnregistered.bind(this)
    );
    eventBus.on('form:fieldChanged', this.handleFieldChanged.bind(this));
    eventBus.on('form:fieldValidated', this.handleFieldValidated.bind(this));
  }

  /**
   * Register a form instance
   * @param {string} formId - Form ID
   * @param {Object} form - Form instance
   */
  registerForm(formId, form) {
    this.forms.set(formId, {
      instance: form,
      fields: new Map(),
      validFields: new Set(),
      invalidFields: new Set(),
    });

    // Register in component registry
    componentRegistry.register(formId, form, 'form');

    // Emit form registration event
    eventBus.emit('form:registered', { formId });
  }

  /**
   * Unregister a form instance
   * @param {string} formId - Form ID
   */
  unregisterForm(formId) {
    if (!this.forms.has(formId)) return;

    // Unregister from component registry
    componentRegistry.unregister(formId);

    // Remove form from storage
    this.forms.delete(formId);

    // Emit form unregistration event
    eventBus.emit('form:unregistered', { formId });
  }

  /**
   * Register a field with a form
   * @param {string} formId - Form ID
   * @param {string} fieldId - Field ID
   * @param {Object} field - Field instance
   */
  registerField(formId, fieldId, field) {
    if (!this.forms.has(formId)) {
      console.warn(
        `Form ${formId} not found, cannot register field ${fieldId}`
      );
      return;
    }

    const form = this.forms.get(formId);
    form.fields.set(fieldId, field);

    // Emit field registration event
    eventBus.emit('form:fieldRegistered', { formId, fieldId });
  }

  /**
   * Unregister a field from a form
   * @param {string} formId - Form ID
   * @param {string} fieldId - Field ID
   */
  unregisterField(formId, fieldId) {
    if (!this.forms.has(formId)) return;

    const form = this.forms.get(formId);
    form.fields.delete(fieldId);
    form.validFields.delete(fieldId);
    form.invalidFields.delete(fieldId);

    // Emit field unregistration event
    eventBus.emit('form:fieldUnregistered', { formId, fieldId });
  }

  /**
   * Handle field registration event
   * @private
   * @param {Object} data - Event data
   */
  handleFieldRegistered({ formId }) {
    // Update form validation status
    this.updateFormValidation(formId);
  }

  /**
   * Handle field unregistration event
   * @private
   * @param {Object} data - Event data
   */
  handleFieldUnregistered({ formId }) {
    // Update form validation status
    this.updateFormValidation(formId);
  }

  /**
   * Handle field change event
   * @private
   * @param {Object} data - Event data
   */
  handleFieldChanged({ formId, fieldId }) {
    if (!this.forms.has(formId)) return;

    // Get form
    const form = this.forms.get(formId);

    // Get field and validate if it has a validate method
    const field = form.fields.get(fieldId);
    if (field && typeof field.validate === 'function') {
      const isValid = field.validate();

      // Update validation sets
      if (isValid) {
        form.validFields.add(fieldId);
        form.invalidFields.delete(fieldId);
      } else {
        form.invalidFields.add(fieldId);
        form.validFields.delete(fieldId);
      }
    }

    // Update form validation
    this.updateFormValidation(formId);
  }

  /**
   * Handle field validation event
   * @private
   * @param {Object} data - Event data
   */
  handleFieldValidated({ formId, fieldId, isValid }) {
    if (!this.forms.has(formId)) return;

    // Update validation sets
    const form = this.forms.get(formId);

    if (isValid) {
      form.validFields.add(fieldId);
      form.invalidFields.delete(fieldId);
    } else {
      form.invalidFields.add(fieldId);
      form.validFields.delete(fieldId);
    }

    // Update form validation
    this.updateFormValidation(formId);
  }

  /**
   * Update form validation state
   * @private
   * @param {string} formId - Form ID
   */
  updateFormValidation(formId) {
    if (!this.forms.has(formId)) return;

    const form = this.forms.get(formId);
    const formInstance = form.instance;

    // Calculate form validity
    const isValid = form.invalidFields.size === 0;

    // Update form state if it has a setValid method
    if (formInstance && typeof formInstance.setValid === 'function') {
      formInstance.setValid(isValid);
    }

    // Emit form validation event
    eventBus.emit('form:validationChanged', {
      formId,
      isValid,
      validFields: Array.from(form.validFields),
      invalidFields: Array.from(form.invalidFields),
    });
  }

  /**
   * Validate all fields in a form
   * @param {string} formId - Form ID
   * @returns {boolean} Whether the form is valid
   */
  validateForm(formId) {
    if (!this.forms.has(formId)) return false;

    const form = this.forms.get(formId);
    let isFormValid = true;

    // Validate each field
    form.fields.forEach((field, fieldId) => {
      if (typeof field.validate === 'function') {
        const isValid = field.validate();

        // Update validation sets
        if (isValid) {
          form.validFields.add(fieldId);
          form.invalidFields.delete(fieldId);
        } else {
          form.invalidFields.add(fieldId);
          form.validFields.delete(fieldId);
          isFormValid = false;
        }
      }
    });

    // Update form validation
    this.updateFormValidation(formId);

    return isFormValid;
  }

  /**
   * Get form data
   * @param {string} formId - Form ID
   * @returns {Object|null} Form data or null if form not found
   */
  getFormData(formId) {
    if (!this.forms.has(formId)) return null;

    const form = this.forms.get(formId);
    const data = {};

    // Collect values from fields
    form.fields.forEach((field, fieldId) => {
      if (typeof field.getValue === 'function') {
        const name = field.props?.name || fieldId;
        data[name] = field.getValue();
      }
    });

    return data;
  }

  /**
   * Get form instance
   * @param {string} formId - Form ID
   * @returns {Object|null} Form instance or null if not found
   */
  getForm(formId) {
    if (!this.forms.has(formId)) return null;
    return this.forms.get(formId).instance;
  }

  /**
   * Reset all fields in a form
   * @param {string} formId - Form ID
   */
  resetForm(formId) {
    if (!this.forms.has(formId)) return;

    const form = this.forms.get(formId);

    // Reset each field
    form.fields.forEach((field) => {
      if (typeof field.reset === 'function') {
        field.reset();
      }
    });

    // Clear validation sets
    form.validFields.clear();
    form.invalidFields.clear();

    // Update form validation
    this.updateFormValidation(formId);
  }
}

// Export singleton instance
export const formManager = new FormManager();

// Named exports for convenience
export const registerForm = formManager.registerForm.bind(formManager);
export const unregisterForm = formManager.unregisterForm.bind(formManager);
export const registerField = formManager.registerField.bind(formManager);
export const unregisterField = formManager.unregisterField.bind(formManager);
export const validateForm = formManager.validateForm.bind(formManager);
export const getFormData = formManager.getFormData.bind(formManager);
export const resetForm = formManager.resetForm.bind(formManager);
