// src/components/PhoneRepairForm/PhoneRepairFormContainer.js
import FormContainer from '../../utils/FormContainer.js';
import PhoneRepairForm from './PhoneRepairForm.js';

/**
 * Container component for PhoneRepairForm
 * Handles state management and API interactions
 */
const createPhoneRepairFormContainer = (options) => {
  const {
    service,
    onPriceChange,
    onScheduleClick,
    usedPhoneUrl,
    labels = {},
    className = '',
  } = options;

  // Create state container
  const formContainer = new FormContainer(service, handleStateChange);

  // Create presentational component
  const form = PhoneRepairForm({
    labels,
    className,
    usedPhoneUrl,
    onManufacturerChange: handleManufacturerChange,
    onDeviceChange: handleDeviceChange,
    onActionChange: handleActionChange,
    onScheduleClick: handleScheduleClick,
  });

  // Store callbacks
  const callbacks = {
    onPriceChange,
    onScheduleClick,
  };

  // Load initial data
  loadManufacturers();

  /**
   * Handle state changes and update form
   * @param {Object} newState - New state
   * @param {Object} prevState - Previous state
   * @private
   */
  function handleStateChange(newState, prevState) {
    // Update form loading state
    form.setLoading(newState.loading);

    // Update form error state
    form.setErrors(newState.error);

    // Update manufacturers if they changed
    if (newState.data.manufacturers !== prevState.data.manufacturers) {
      form.setManufacturers(newState.data.manufacturers || []);
    }

    // Update devices if they changed
    if (newState.data.devices !== prevState.data.devices) {
      form.setDevices(newState.data.devices || []);
    }

    // Update actions if they changed
    if (newState.data.actions !== prevState.data.actions) {
      form.setActions(newState.data.actions || []);
    }

    // Update price if it changed
    if (newState.data.price !== prevState.data.price) {
      form.setPrice(newState.data.price);

      // Call external callback if provided
      if (callbacks.onPriceChange && newState.data.price) {
        callbacks.onPriceChange(newState.data.price);
      }
    }

    // Update selection state
    if (newState.selection.manufacturer !== prevState.selection.manufacturer) {
      form.update({ selectedManufacturer: newState.selection.manufacturer });
    }

    if (newState.selection.device !== prevState.selection.device) {
      form.update({ selectedDevice: newState.selection.device });
    }

    if (newState.selection.action !== prevState.selection.action) {
      form.update({ selectedAction: newState.selection.action });
    }
  }

  /**
   * Load manufacturers from API
   * @private
   */
  async function loadManufacturers() {
    try {
      await formContainer.fetchResource('manufacturers', () =>
        formContainer.service.fetchManufacturers()
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
  async function loadDevices(manufacturerId) {
    // Clear dependent selections
    formContainer.setSelection('device', '');
    formContainer.setSelection('action', '');
    formContainer.setData('devices', []);
    formContainer.setData('actions', []);
    formContainer.setData('price', null);

    try {
      await formContainer.fetchResource('devices', () =>
        formContainer.service.fetchDevices(manufacturerId)
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
  async function loadActions(deviceId) {
    // Clear dependent selections
    formContainer.setSelection('action', '');
    formContainer.setData('actions', []);
    formContainer.setData('price', null);

    try {
      await formContainer.fetchResource('actions', () =>
        formContainer.service.fetchActions(deviceId)
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
  async function loadPrice(actionId) {
    formContainer.setData('price', null);

    try {
      await formContainer.fetchResource('price', () =>
        formContainer.service.fetchPrice(actionId)
      );
    } catch (error) {
      console.error('Error loading price:', error);
    }
  }

  /**
   * Handle manufacturer selection change
   * @param {string} manufacturerId - Selected manufacturer ID
   */
  function handleManufacturerChange(manufacturerId) {
    formContainer.setSelection('manufacturer', manufacturerId);
    if (manufacturerId) {
      loadDevices(manufacturerId);
    }
  }

  /**
   * Handle device selection change
   * @param {string} deviceId - Selected device ID
   */
  function handleDeviceChange(deviceId) {
    formContainer.setSelection('device', deviceId);
    if (deviceId) {
      loadActions(deviceId);
    }
  }

  /**
   * Handle action selection change
   * @param {string} actionId - Selected action ID
   */
  function handleActionChange(actionId) {
    formContainer.setSelection('action', actionId);
    if (actionId) {
      loadPrice(actionId);
    }
  }

  /**
   * Handle schedule button click
   * @param {Object} formData - Form data
   */
  function handleScheduleClick(formData) {
    if (callbacks.onScheduleClick) {
      callbacks.onScheduleClick(formData);
    }
  }

  // Public API
  return {
    /**
     * Get the form element
     * @returns {HTMLElement} Form element
     */
    getElement() {
      return form.getElement();
    },

    /**
     * Destroy the container and form
     */
    destroy() {
      if (form && typeof form.destroy === 'function') {
        form.destroy();
      }
    },
  };
};

export default createPhoneRepairFormContainer;
