// src/components/PhoneRepairForm/PhoneRepairFormContainer.js - New file

import FormContainer from '../../utils/FormContainer.js';
import PhoneRepairForm from './PhoneRepairForm.js';

/**
 * Container component for PhoneRepairForm
 * Handles state management and API interactions
 */
export default class PhoneRepairFormContainer {
  /**
   * Create a new PhoneRepairFormContainer
   * @param {Object} options - Container options
   * @param {Object} options.service - PhoneRepairService instance
   * @param {Function} [options.onPriceChange] - Callback for price changes
   */
  constructor(options) {
    const {
      service,
      onPriceChange,
      onScheduleClick,
      usedPhoneUrl,
      labels = {},
      className = '',
    } = options;

    // Create state container
    this.formContainer = new FormContainer(
      service,
      this.handleStateChange.bind(this)
    );

    // Create presentational component
    this.form = new PhoneRepairForm({
      labels,
      className,
      usedPhoneUrl,
      onManufacturerChange: this.handleManufacturerChange.bind(this),
      onDeviceChange: this.handleDeviceChange.bind(this),
      onActionChange: this.handleActionChange.bind(this),
      onScheduleClick: this.handleScheduleClick.bind(this),
    });

    // Store callbacks
    this.onPriceChange = onPriceChange;
    this.onScheduleClick = onScheduleClick;

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

    // Update actions if they changed
    if (newState.data.actions !== prevState.data.actions) {
      this.form.setActions(newState.data.actions || []);
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
    this.formContainer.setSelection('action', '');
    this.formContainer.setData('devices', []);
    this.formContainer.setData('actions', []);
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
   * Load actions for a device
   * @param {string} deviceId - Device ID
   * @private
   */
  async loadActions(deviceId) {
    // Clear dependent selections
    this.formContainer.setSelection('action', '');
    this.formContainer.setData('actions', []);
    this.formContainer.setData('price', null);

    try {
      await this.formContainer.fetchResource('actions', () =>
        this.formContainer.service.fetchActions(deviceId)
      );
    } catch (error) {
      console.error('Error loading actions:', error);
    }
  }

  /**
   * Load price for an action
   * @param {string} actionId - Action ID
   * @private
   */
  async loadPrice(actionId) {
    this.formContainer.setData('price', null);

    try {
      await this.formContainer.fetchResource('price', () =>
        this.formContainer.service.fetchPrice(actionId)
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
    this.loadActions(deviceId);
  }

  /**
   * Handle action selection change
   * @param {string} actionId - Selected action ID
   */
  handleActionChange(actionId) {
    this.formContainer.setSelection('action', actionId);
    this.loadPrice(actionId);
  }

  /**
   * Handle schedule button click
   * @param {Object} formData - Form data
   */
  handleScheduleClick(formData) {
    if (this.onScheduleClick) {
      this.onScheduleClick(formData);
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
