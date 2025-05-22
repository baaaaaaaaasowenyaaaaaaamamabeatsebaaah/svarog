// src/components/PhoneRepairForm/PhoneRepairFormContainer.js
import PhoneRepairForm from './PhoneRepairForm.js';

/**
 * Enhanced container component for PhoneRepairForm with improved API handling
 * Handles state management and API interactions with better error recovery
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

  // Container state - simplified to focus on coordination
  const containerState = {
    currentManufacturer: null,
    currentDevice: null,
    currentAction: null,
    lastSuccessfulState: {
      manufacturers: [],
      devices: [],
      actions: [],
    },
    retryAttempts: {
      manufacturers: 0,
      devices: 0,
      actions: 0,
      price: 0,
    },
  };

  // Initialize form first, without async loading callbacks to avoid circular reference
  const form = PhoneRepairForm({
    labels,
    className,
    usedPhoneUrl,
    manufacturers: [],
    devices: [],
    actions: [],
    onManufacturerChange: handleManufacturerChange,
    onDeviceChange: handleDeviceChange,
    onActionChange: handleActionChange,
    onScheduleClick: handleScheduleClick,
  });

  // Initialize by loading manufacturers after form is created
  initializeForm();

  /**
   * Initialize the form by loading manufacturers
   * @private
   */
  async function initializeForm() {
    try {
      await loadManufacturers();
    } catch (error) {
      console.error('Failed to initialize form:', error);
      form.setErrors({
        manufacturers: 'Failed to load manufacturers. Please refresh the page.',
      });
    }
  }

  /**
   * Load manufacturers with retry logic
   * @private
   */
  async function loadManufacturers() {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        form.setLoading({ manufacturers: true });
        containerState.retryAttempts.manufacturers = attempt;

        const manufacturers = await service.fetchManufacturers();

        // Validate response
        if (!Array.isArray(manufacturers) || manufacturers.length === 0) {
          throw new Error('No manufacturers available');
        }

        // Update form and cache successful result
        containerState.lastSuccessfulState.manufacturers = manufacturers;

        form.setState({
          manufacturers: manufacturers,
          loading: {
            ...form.getElement()._state?.loading,
            manufacturers: false,
          },
          error: { ...form.getElement()._state?.error, manufacturers: null },
        });

        // Call external callback
        notifyStateChange('manufacturers', manufacturers);
        return manufacturers;
      } catch (error) {
        console.error(`Manufacturer fetch attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          form.setState({
            loading: {
              ...form.getElement()._state?.loading,
              manufacturers: false,
            },
            error: {
              ...form.getElement()._state?.error,
              manufacturers: `Failed to load manufacturers after ${maxRetries} attempts. Please try again.`,
            },
          });
          throw error;
        }

        // Wait before retry with exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  /**
   * Load devices for selected manufacturer
   * @private
   */
  async function loadDevices(manufacturerId) {
    if (!manufacturerId) {
      clearDependentSelections('devices');
      return;
    }

    try {
      form.setLoading({ devices: true });

      const devices = await service.fetchDevices(manufacturerId);

      if (!Array.isArray(devices)) {
        throw new Error('Invalid devices response');
      }

      containerState.lastSuccessfulState.devices = devices;
      containerState.currentManufacturer = manufacturerId;

      form.setState({
        devices: devices,
        loading: { ...form.getElement()._state?.loading, devices: false },
        error: { ...form.getElement()._state?.error, devices: null },
        // Clear dependent selections
        selectedDevice: '',
        selectedAction: '',
        actions: [],
        currentPrice: null,
      });

      notifyStateChange('devices', devices);
    } catch (error) {
      console.error('Device fetch failed:', error);

      form.setState({
        loading: { ...form.getElement()._state?.loading, devices: false },
        error: {
          ...form.getElement()._state?.error,
          devices:
            'Failed to load devices for this manufacturer. Please try selecting another manufacturer.',
        },
        devices: [],
      });

      // Try to recover by keeping the manufacturer selection
      // but clearing dependent data
      clearDependentSelections('devices');
    }
  }

  /**
   * Load actions for selected device
   * @private
   */
  async function loadActions(deviceId) {
    if (!deviceId) {
      clearDependentSelections('actions');
      return;
    }

    try {
      form.setLoading({ actions: true });

      const actions = await service.fetchActions(deviceId);

      if (!Array.isArray(actions)) {
        throw new Error('Invalid actions response');
      }

      containerState.lastSuccessfulState.actions = actions;
      containerState.currentDevice = deviceId;

      form.setState({
        actions: actions,
        loading: { ...form.getElement()._state?.loading, actions: false },
        error: { ...form.getElement()._state?.error, actions: null },
        // Clear dependent selections
        selectedAction: '',
        currentPrice: null,
      });

      notifyStateChange('actions', actions);
    } catch (error) {
      console.error('Actions fetch failed:', error);

      form.setState({
        loading: { ...form.getElement()._state?.loading, actions: false },
        error: {
          ...form.getElement()._state?.error,
          actions:
            'Failed to load services for this device. Please try selecting another device.',
        },
        actions: [],
      });

      clearDependentSelections('actions');
    }
  }

  /**
   * Load price for selected action
   * @private
   */
  async function loadPrice(actionId) {
    if (!actionId) {
      form.setPrice(null);
      return;
    }

    try {
      form.setLoading({ price: true });

      const priceData = await service.fetchPrice(actionId);

      if (!priceData || typeof priceData.price === 'undefined') {
        throw new Error('Invalid price response');
      }

      containerState.currentAction = actionId;

      form.setState({
        currentPrice: priceData,
        loading: { ...form.getElement()._state?.loading, price: false },
        error: { ...form.getElement()._state?.error, price: null },
      });

      // Call external callback
      if (onPriceChange) {
        onPriceChange(priceData);
      }
    } catch (error) {
      console.error('Price fetch failed:', error);

      form.setState({
        loading: { ...form.getElement()._state?.loading, price: false },
        error: {
          ...form.getElement()._state?.error,
          price:
            'Failed to load price for this service. Please try selecting another service.',
        },
        currentPrice: null,
      });
    }
  }

  /**
   * Clear dependent selections when parent selection changes
   * @private
   */
  function clearDependentSelections(level) {
    const currentState = form.getElement()._state || {};
    const updates = {};

    if (level === 'devices' || level === 'all') {
      updates.devices = [];
      updates.selectedDevice = '';
      updates.loading = { ...currentState.loading, devices: false };
      updates.error = { ...currentState.error, devices: null };
    }

    if (level === 'actions' || level === 'devices' || level === 'all') {
      updates.actions = [];
      updates.selectedAction = '';
      updates.loading = { ...updates.loading, actions: false };
      updates.error = { ...updates.error, actions: null };
    }

    if (
      level === 'price' ||
      level === 'actions' ||
      level === 'devices' ||
      level === 'all'
    ) {
      updates.currentPrice = null;
      updates.loading = { ...updates.loading, price: false };
      updates.error = { ...updates.error, price: null };
    }

    form.setState(updates);
  }

  /**
   * Handle manufacturer selection change
   * @private
   */
  function handleManufacturerChange(manufacturerId) {
    form.setState({ selectedManufacturer: manufacturerId });
    loadDevices(manufacturerId);
  }

  /**
   * Handle device selection change
   * @private
   */
  function handleDeviceChange(deviceId) {
    form.setState({ selectedDevice: deviceId });
    loadActions(deviceId);
  }

  /**
   * Handle action selection change
   * @private
   */
  function handleActionChange(actionId) {
    form.setState({ selectedAction: actionId });
    loadPrice(actionId);
  }

  /**
   * Handle schedule button click with enhanced data
   * @private
   */
  function handleScheduleClick(formData) {
    if (!onScheduleClick) return;

    // Enhance form data with additional context
    const enhancedData = {
      ...formData,
      metadata: {
        containerState: {
          manufacturerId: containerState.currentManufacturer,
          deviceId: containerState.currentDevice,
          actionId: containerState.currentAction,
        },
        formState: {
          hasErrors: Object.values(form.getElement()._state?.error || {}).some(
            Boolean
          ),
          isLoading: Object.values(
            form.getElement()._state?.loading || {}
          ).some(Boolean),
        },
        timestamp: new Date().toISOString(),
      },
    };

    try {
      onScheduleClick(enhancedData);
    } catch (error) {
      console.error('Schedule click handler error:', error);
    }
  }

  /**
   * Notify external systems of state changes
   * @private
   */
  function notifyStateChange(type, data) {
    // This allows for future expansion of state change notifications
    // e.g., analytics, logging, external state management
    console.debug(
      `PhoneRepairFormContainer: ${type} loaded`,
      data.length,
      'items'
    );
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
     * Get current container state for debugging
     * @returns {Object} Container state
     */
    getContainerState() {
      return {
        ...containerState,
        formState: form.getElement()._state,
      };
    },

    /**
     * Manually trigger data refresh
     * @param {string} level - Which level to refresh ('manufacturers', 'devices', 'actions', 'price')
     */
    async refresh(level = 'manufacturers') {
      try {
        switch (level) {
          case 'manufacturers':
            await loadManufacturers();
            break;
          case 'devices':
            if (containerState.currentManufacturer) {
              await loadDevices(containerState.currentManufacturer);
            }
            break;
          case 'actions':
            if (containerState.currentDevice) {
              await loadActions(containerState.currentDevice);
            }
            break;
          case 'price':
            if (containerState.currentAction) {
              await loadPrice(containerState.currentAction);
            }
            break;
          default:
            console.warn('Unknown refresh level:', level);
        }
      } catch (error) {
        console.error(`Refresh failed for level ${level}:`, error);
      }
    },

    /**
     * Reset form to initial state
     */
    reset() {
      clearDependentSelections('all');
      form.setState({
        selectedManufacturer: '',
        selectedDevice: '',
        selectedAction: '',
        currentPrice: null,
        manufacturers: containerState.lastSuccessfulState.manufacturers,
      });

      // Reset container state
      containerState.currentManufacturer = null;
      containerState.currentDevice = null;
      containerState.currentAction = null;
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
