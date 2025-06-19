// src/components/UsedPhonePriceForm/UsedPhonePriceFormContainer.js
import UsedPhonePriceForm from './UsedPhonePriceForm.js';
import FormContainer from '../../utils/FormContainer.js';

/**
 * Creates a container for UsedPhonePriceForm that manages API calls and form state
 * @param {Object} props - Container properties
 * @returns {Object} Container component API
 */
const createUsedPhonePriceFormContainer = (props) => {
  const {
    service,
    onPriceChange,
    onSubmit,
    labels,
    className,
    showStepsIndicator,
    ...otherProps
  } = props;

  if (!service) {
    throw new Error('UsedPhonePriceFormContainer: service is required');
  }

  // Validate service methods
  const requiredMethods = [
    'fetchManufacturers',
    'fetchDevices',
    'fetchConditions',
    'fetchPrice',
  ];
  const missingMethods = requiredMethods.filter(
    (method) => typeof service[method] !== 'function'
  );

  if (missingMethods.length > 0) {
    throw new Error(
      `UsedPhonePriceFormContainer: service missing methods: ${missingMethods.join(', ')}`
    );
  }

  // Initialize container state using FormContainer utility
  const container = new FormContainer(service);

  // Container-specific state
  const containerState = {
    currentManufacturer: null,
    currentDevice: null,
    currentCondition: null,
    lastSuccessfulState: null,
    isInitialized: false,
  };

  // Create the form component
  const form = UsedPhonePriceForm({
    manufacturers: [],
    devices: [],
    conditions: [],
    onManufacturerChange: handleManufacturerChange,
    onDeviceChange: handleDeviceChange,
    onConditionChange: handleConditionChange,
    onSubmit: handleSubmit,
    labels,
    className,
    showStepsIndicator,
    // Use loadingStates instead of loading per standardization
    loadingStates: props.loadingStates || props.loading || {},
    ...otherProps,
  });

  // Event handlers
  async function handleManufacturerChange(manufacturerId) {
    try {
      // Reset dependent selections
      containerState.currentDevice = null;
      containerState.currentCondition = null;

      form.setState({
        selectedDevice: '',
        selectedCondition: '',
        devices: [],
        conditions: [],
        currentPrice: null,
      });

      if (!manufacturerId) {
        containerState.currentManufacturer = null;
        return;
      }

      containerState.currentManufacturer = manufacturerId;

      // Fetch devices
      const devices = await container.fetchResource('devices', () =>
        service.fetchDevices(manufacturerId)
      );

      // Update form with new devices
      form.setState({
        devices,
        selectedManufacturer: manufacturerId,
      });

      containerState.lastSuccessfulState = { ...containerState };
    } catch (error) {
      // Reset to last successful state
      if (containerState.lastSuccessfulState) {
        Object.assign(containerState, containerState.lastSuccessfulState);
      }
      form.setErrors({ devices: error.message });
    }
  }

  async function handleDeviceChange(deviceId) {
    try {
      // Reset dependent selections
      containerState.currentCondition = null;

      form.setState({
        selectedCondition: '',
        conditions: [],
        currentPrice: null,
      });

      if (!deviceId) {
        containerState.currentDevice = null;
        return;
      }

      containerState.currentDevice = deviceId;

      // Fetch conditions
      const conditions = await container.fetchResource('conditions', () =>
        service.fetchConditions(deviceId)
      );

      // Update form with new conditions
      form.setState({
        conditions,
        selectedDevice: deviceId,
      });

      containerState.lastSuccessfulState = { ...containerState };
    } catch (error) {
      // Reset to last successful state
      if (containerState.lastSuccessfulState) {
        Object.assign(containerState, containerState.lastSuccessfulState);
      }
      form.setErrors({ conditions: error.message });
    }
  }

  async function handleConditionChange(conditionId) {
    try {
      // Clear current price
      form.setState({
        currentPrice: null,
      });

      if (!conditionId) {
        containerState.currentCondition = null;
        return;
      }

      containerState.currentCondition = conditionId;

      // Fetch price
      const price = await container.fetchResource('price', () =>
        service.fetchPrice(conditionId)
      );

      // Update form with new price
      form.setState({
        currentPrice: price,
        selectedCondition: conditionId,
      });

      // Call onPriceChange callback if provided
      if (typeof onPriceChange === 'function') {
        try {
          onPriceChange(price);
        } catch (callbackError) {
          console.error('Error in onPriceChange callback:', callbackError);
        }
      }

      containerState.lastSuccessfulState = { ...containerState };
    } catch (error) {
      // Reset to last successful state
      if (containerState.lastSuccessfulState) {
        Object.assign(containerState, containerState.lastSuccessfulState);
      }
      form.setErrors({ price: error.message });
    }
  }

  function handleSubmit(formData) {
    if (typeof onSubmit === 'function') {
      try {
        onSubmit(formData);
      } catch (error) {
        console.error('Error in onSubmit callback:', error);
      }
    }
  }

  // Initialize the container
  async function initialize() {
    try {
      // Load initial manufacturers
      const manufacturers = await container.fetchResource('manufacturers', () =>
        service.fetchManufacturers()
      );

      // Update form with manufacturers
      form.setManufacturers(manufacturers);

      containerState.isInitialized = true;
      containerState.lastSuccessfulState = { ...containerState };
    } catch (error) {
      form.setErrors({ manufacturers: error.message });
    }
  }

  // Start initialization
  initialize();

  // Container API
  const containerAPI = {
    /**
     * Get the form element
     * @returns {HTMLElement} Form element
     */
    getElement() {
      return form.getElement();
    },

    /**
     * Get container state for debugging
     * @returns {Object} Container state
     */
    getContainerState() {
      return {
        ...containerState,
        formContainerState: container.state,
        loading: container.loading(),
        hasErrors: container.hasErrors(),
      };
    },

    /**
     * Manually refresh a specific resource
     * @param {string} resource - Resource to refresh
     * @returns {Promise} Refresh promise
     */
    async refresh(resource) {
      switch (resource) {
        case 'manufacturers':
          return this.refreshManufacturers();
        default:
          throw new Error(`Unknown resource: ${resource}`);
      }
    },

    /**
     * Refresh manufacturers
     * @returns {Promise} Refresh promise
     */
    async refreshManufacturers() {
      const manufacturers = await container.fetchResource('manufacturers', () =>
        service.fetchManufacturers()
      );
      form.setManufacturers(manufacturers);
      return manufacturers;
    },

    /**
     * Clean up resources
     */
    destroy() {
      if (form && typeof form.destroy === 'function') {
        form.destroy();
      }
    },

    // Expose form methods for convenience
    updateForm: (props) => form.update(props),
    getFormState: () => form.getCurrentState(),

    // Expose internal methods for testing
    handleManufacturerChange,
    handleDeviceChange,
    handleConditionChange,
    handleSubmit,
    form,
    formContainer: container,
  };

  return containerAPI;
};

export default createUsedPhonePriceFormContainer;
