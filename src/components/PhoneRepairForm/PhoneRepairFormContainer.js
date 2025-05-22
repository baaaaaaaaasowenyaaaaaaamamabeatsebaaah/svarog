// src/components/PhoneRepairForm/PhoneRepairFormContainer.js
import PhoneRepairForm from './PhoneRepairForm.js';
import FormContainer from '../../utils/FormContainer.js';

/**
 * Creates a container for PhoneRepairForm that manages API calls and form state
 * @param {Object} props - Container properties
 * @returns {Object} Container component API
 */
const createPhoneRepairFormContainer = (props) => {
  const {
    service,
    onPriceChange,
    onScheduleClick,
    usedPhoneUrl,
    labels,
    className,
    ...otherProps
  } = props;

  if (!service) {
    throw new Error('PhoneRepairFormContainer: service is required');
  }

  // Validate service methods
  const requiredMethods = [
    'fetchManufacturers',
    'fetchDevices',
    'fetchActions',
    'fetchPrice',
  ];
  const missingMethods = requiredMethods.filter(
    (method) => typeof service[method] !== 'function'
  );

  if (missingMethods.length > 0) {
    throw new Error(
      `PhoneRepairFormContainer: service missing methods: ${missingMethods.join(', ')}`
    );
  }

  // Initialize container state using FormContainer utility
  const container = new FormContainer(service);

  // Container-specific state
  let containerState = {
    currentManufacturer: null,
    currentDevice: null,
    currentAction: null,
    lastSuccessfulState: null,
    isInitialized: false,
  };

  // Create the form component
  const form = PhoneRepairForm({
    manufacturers: [],
    devices: [],
    actions: [],
    onManufacturerChange: handleManufacturerChange,
    onDeviceChange: handleDeviceChange,
    onActionChange: handleActionChange,
    onScheduleClick: handleScheduleClick,
    usedPhoneUrl,
    labels,
    className,
    ...otherProps,
  });

  // Event handlers
  async function handleManufacturerChange(manufacturerId) {
    try {
      // Reset dependent selections
      containerState.currentDevice = null;
      containerState.currentAction = null;

      form.setState({
        selectedDevice: '',
        selectedAction: '',
        devices: [],
        actions: [],
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
      containerState.currentAction = null;

      form.setState({
        selectedAction: '',
        actions: [],
        currentPrice: null,
      });

      if (!deviceId) {
        containerState.currentDevice = null;
        return;
      }

      containerState.currentDevice = deviceId;

      // Fetch actions
      const actions = await container.fetchResource('actions', () =>
        service.fetchActions(deviceId)
      );

      // Update form with new actions
      form.setState({
        actions,
        selectedDevice: deviceId,
      });

      containerState.lastSuccessfulState = { ...containerState };
    } catch (error) {
      // Reset to last successful state
      if (containerState.lastSuccessfulState) {
        Object.assign(containerState, containerState.lastSuccessfulState);
      }
      form.setErrors({ actions: error.message });
    }
  }

  async function handleActionChange(actionId) {
    try {
      // Clear current price
      form.setState({
        currentPrice: null,
      });

      if (!actionId) {
        containerState.currentAction = null;
        return;
      }

      containerState.currentAction = actionId;

      // Fetch price
      const price = await container.fetchResource('price', () =>
        service.fetchPrice(actionId)
      );

      // Update form with new price
      form.setState({
        currentPrice: price,
        selectedAction: actionId,
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

  function handleScheduleClick(repairInfo) {
    if (typeof onScheduleClick === 'function') {
      try {
        onScheduleClick(repairInfo);
      } catch (error) {
        console.error('Error in onScheduleClick callback:', error);
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
        isLoading: container.isLoading(),
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
  };

  return containerAPI;
};

export default createPhoneRepairFormContainer;
