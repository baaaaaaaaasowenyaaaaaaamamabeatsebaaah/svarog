// src/components/UsedPhonePriceForm/UsedPhonePriceFormContainer.js

import FormContainer from '../../utils/FormContainer.js';
import UsedPhonePriceForm from './UsedPhonePriceForm.js';

/**
 * Container component for UsedPhonePriceForm
 * Handles state management and API interactions
 */
export default class UsedPhonePriceFormContainer {
  /**
   * Create a new UsedPhonePriceFormContainer
   * @param {Object} options - Container options
   * @param {Object} options.service - UsedPhonePriceService instance
   * @param {Function} [options.onPriceChange] - Callback for price changes
   * @param {Function} [options.onSubmit] - Callback for form submission
   */
  constructor(options) {
    const {
      service,
      onPriceChange,
      onSubmit,
      labels = {},
      showStepsIndicator = true,
      className = '',
    } = options;

    // Create state container
    this.formContainer = new FormContainer(
      service,
      this.handleStateChange.bind(this)
    );

    // Create presentational component
    this.form = new UsedPhonePriceForm({
      labels,
      className,
      showStepsIndicator,
      onManufacturerChange: this.handleManufacturerChange.bind(this),
      onDeviceChange: this.handleDeviceChange.bind(this),
      onConditionChange: this.handleConditionChange.bind(this),
      onSubmit: this.handleSubmit.bind(this),
    });

    // Store callbacks
    this.onPriceChange = onPriceChange;
    this.onSubmit = onSubmit;

    // Load initial data
    this.loadManufacturers();
  }

  /**
   * Handle state changes and update form
   * @param {Object} newState - New state
   * @param {Object} prevState - Previous state
   * @private
   */
  handleStateChange(newState, prevState) {
    // Update form loading state
    this.form.setLoading(newState.loading);

    // Update form error state
    this.form.setErrors(newState.error);

    // Update manufacturers if they changed
    if (newState.data.manufacturers !== prevState.data.manufacturers) {
      this.form.setManufacturers(newState.data.manufacturers || []);
    }

    // Update devices if they changed
    if (newState.data.devices !== prevState.data.devices) {
      this.form.setDevices(newState.data.devices || []);
    }

    // Update conditions if they changed
    if (newState.data.conditions !== prevState.data.conditions) {
      this.form.setConditions(newState.data.conditions || []);
    }

    // Update price if it changed
    if (newState.data.price !== prevState.data.price) {
      this.form.setPrice(newState.data.price);

      // Call external callback if provided
      if (this.onPriceChange && newState.data.price) {
        this.onPriceChange(newState.data.price);
      }
    }
  }

  /**
   * Load manufacturers from API
   * @private
   */
  async loadManufacturers() {
    try {
      await this.formContainer.fetchResource('manufacturers', () =>
        this.formContainer.service.fetchManufacturers()
      );
    } catch (error) {
      console.error('Error loading manufacturers:', error);
    }
  }

  /**
   * Load devices for a manufacturer
   * @param {string} manufacturerId - Manufacturer ID
   * @private
   */
  async loadDevices(manufacturerId) {
    // Clear dependent selections
    this.formContainer.setSelection('device', '');
    this.formContainer.setSelection('condition', '');
    this.formContainer.setData('devices', []);
    this.formContainer.setData('conditions', []);
    this.formContainer.setData('price', null);

    try {
      await this.formContainer.fetchResource('devices', () =>
        this.formContainer.service.fetchDevices(manufacturerId)
      );
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  }

  /**
   * Load conditions for a device
   * @param {string} deviceId - Device ID
   * @private
   */
  async loadConditions(deviceId) {
    // Clear dependent selections
    this.formContainer.setSelection('condition', '');
    this.formContainer.setData('conditions', []);
    this.formContainer.setData('price', null);

    try {
      await this.formContainer.fetchResource('conditions', () =>
        this.formContainer.service.fetchConditions(deviceId)
      );
    } catch (error) {
      console.error('Error loading conditions:', error);
    }
  }

  /**
   * Load price for a condition
   * @param {string} conditionId - Condition ID
   * @private
   */
  async loadPrice(conditionId) {
    this.formContainer.setData('price', null);

    try {
      await this.formContainer.fetchResource('price', () =>
        this.formContainer.service.fetchPrice(conditionId)
      );
    } catch (error) {
      console.error('Error loading price:', error);
    }
  }

  /**
   * Handle manufacturer selection change
   * @param {string} manufacturerId - Selected manufacturer ID
   */
  handleManufacturerChange(manufacturerId) {
    this.formContainer.setSelection('manufacturer', manufacturerId);
    this.loadDevices(manufacturerId);
  }

  /**
   * Handle device selection change
   * @param {string} deviceId - Selected device ID
   */
  handleDeviceChange(deviceId) {
    this.formContainer.setSelection('device', deviceId);
    this.loadConditions(deviceId);
  }

  /**
   * Handle condition selection change
   * @param {string} conditionId - Selected condition ID
   */
  handleConditionChange(conditionId) {
    this.formContainer.setSelection('condition', conditionId);
    this.loadPrice(conditionId);
  }

  /**
   * Handle form submission
   * @param {Object} formData - Form data
   */
  handleSubmit(formData) {
    if (this.onSubmit) {
      this.onSubmit(formData);
    }
  }

  /**
   * Get the form element
   * @returns {HTMLElement} Form element
   */
  getElement() {
    return this.form.getElement();
  }
}
