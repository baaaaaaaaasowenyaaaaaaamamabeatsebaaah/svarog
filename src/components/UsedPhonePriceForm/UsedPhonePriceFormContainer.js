// src/components/UsedPhonePriceForm/UsedPhonePriceFormContainer.js
import FormContainer from '../../utils/FormContainer.js';
import UsedPhonePriceForm from './UsedPhonePriceForm.js';

/**
 * Container component for UsedPhonePriceForm
 * Handles state management and API interactions
 */
const createUsedPhonePriceFormContainer = (options) => {
  const {
    service,
    onPriceChange,
    onSubmit,
    labels = {},
    showStepsIndicator = true,
    className = '',
  } = options;

  // Create state container
  const formContainer = new FormContainer(service, handleStateChange);

  // Create presentational component
  const form = UsedPhonePriceForm({
    labels,
    className,
    showStepsIndicator,
    onManufacturerChange: handleManufacturerChange,
    onDeviceChange: handleDeviceChange,
    onConditionChange: handleConditionChange,
    onSubmit: handleSubmit,
  });

  // Store callbacks
  const callbacks = {
    onPriceChange,
    onSubmit,
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

    // Update conditions if they changed
    if (newState.data.conditions !== prevState.data.conditions) {
      form.setConditions(newState.data.conditions || []);
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

    if (newState.selection.condition !== prevState.selection.condition) {
      form.update({ selectedCondition: newState.selection.condition });
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
    formContainer.setSelection('condition', '');
    formContainer.setData('devices', []);
    formContainer.setData('conditions', []);
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
   * Load conditions for a device
   * @param {string} deviceId - Device ID
   * @private
   */
  async function loadConditions(deviceId) {
    // Clear dependent selections
    formContainer.setSelection('condition', '');
    formContainer.setData('conditions', []);
    formContainer.setData('price', null);

    try {
      await formContainer.fetchResource('conditions', () =>
        formContainer.service.fetchConditions(deviceId)
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
  async function loadPrice(conditionId) {
    formContainer.setData('price', null);

    try {
      await formContainer.fetchResource('price', () =>
        formContainer.service.fetchPrice(conditionId)
      );
    } catch (error) {
      console.error('Error loading price:', error);
    }
  }

  /**
   * Handle manufacturer selection change
   * @param {string} manufacturerId - Selected manufacturer ID
   */
  async function handleManufacturerChange(manufacturerId) {
    formContainer.setSelection('manufacturer', manufacturerId);
    if (manufacturerId) {
      await loadDevices(manufacturerId);
    }
  }

  /**
   * Handle device selection change
   * @param {string} deviceId - Selected device ID
   */
  async function handleDeviceChange(deviceId) {
    formContainer.setSelection('device', deviceId);
    if (deviceId) {
      await loadConditions(deviceId);
    }
  }

  /**
   * Handle condition selection change
   * @param {string} conditionId - Selected condition ID
   */
  async function handleConditionChange(conditionId) {
    formContainer.setSelection('condition', conditionId);
    if (conditionId) {
      await loadPrice(conditionId);
    }
  }

  /**
   * Handle form submission
   * @param {Object} formData - Form data
   */
  function handleSubmit(formData) {
    formContainer.setState({
      loading: { ...formContainer.state.loading, submit: true },
    });

    if (callbacks.onSubmit) {
      try {
        callbacks.onSubmit(formData);
      } catch (error) {
        console.error('Error during form submission:', error);
        formContainer.setError('submit', error);
      }
    }

    setTimeout(() => {
      formContainer.setState({
        loading: { ...formContainer.state.loading, submit: false },
      });
    }, 1000);
  }

  // Return public API with exposed internal methods for testing
  const container = {
    // Expose internal properties for testing
    form,
    formContainer,

    // Expose internal methods for testing
    handleManufacturerChange,
    handleDeviceChange,
    handleConditionChange,
    handleSubmit,

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

  return container;
};

export default createUsedPhonePriceFormContainer;
