// src/components/PhoneRepairForm/PhoneRepairFormContainer.js
import PhoneRepairForm from './PhoneRepairForm.js';
import FormContainer from '../../utils/FormContainer.js';

// Simple debug logging without external dependency
const DEBUG_PREFIX = '[PhoneRepairFormContainer]';
const isDebugEnabled = () => {
  return (
    typeof window !== 'undefined' &&
    (window.localStorage?.getItem('svarog-debug') === 'true' ||
      window.location?.search?.includes('debug=true'))
  );
};

const debug = {
  info: (message, data) => {
    if (isDebugEnabled()) {
      console.log(`${DEBUG_PREFIX} ${message}`, data || '');
    }
  },
  error: (message, data) => {
    console.error(`${DEBUG_PREFIX} ${message}`, data || '');
  },
  warn: (message, data) => {
    if (isDebugEnabled()) {
      console.warn(`${DEBUG_PREFIX} ${message}`, data || '');
    }
  },
  event: (eventType, data) => {
    if (isDebugEnabled()) {
      console.log(`${DEBUG_PREFIX} Event: ${eventType}`, data || '');
    }
  },
  state: (stateName, newState) => {
    if (isDebugEnabled()) {
      console.log(
        `${DEBUG_PREFIX} State changed: ${stateName}`,
        newState || ''
      );
    }
  },
  api: (method, params, response, error) => {
    if (isDebugEnabled()) {
      if (error) {
        console.error(`${DEBUG_PREFIX} API Error: ${method}`, {
          params,
          error: error.message,
        });
      } else {
        console.log(`${DEBUG_PREFIX} API Call: ${method}`, {
          params,
          response,
        });
      }
    }
  },
  performance: (operation) => {
    if (!isDebugEnabled()) return () => {};
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(
        `${DEBUG_PREFIX} Performance: ${operation} took ${(end - start).toFixed(2)}ms`
      );
    };
  },
};

/**
 * Creates a container for PhoneRepairForm that manages API calls and form state
 * @param {Object} props - Container properties
 * @returns {Object} Container component API
 */
const createPhoneRepairFormContainer = (props) => {
  debug.info('createPhoneRepairFormContainer called', {
    propsKeys: Object.keys(props),
    hasService: !!props.service,
    serviceMethodsAvailable: props.service ? Object.keys(props.service) : [],
  });

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
    const error = new Error('PhoneRepairFormContainer: service is required');
    debug.error('Service validation failed', error);
    throw error;
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
    const error = new Error(
      `PhoneRepairFormContainer: service missing methods: ${missingMethods.join(', ')}`
    );
    debug.error('Service method validation failed', {
      missingMethods,
      availableMethods: Object.keys(service),
    });
    throw error;
  }

  debug.info('Service validation passed', { requiredMethods });

  // Initialize container state using FormContainer utility
  const container = new FormContainer(service, (newState) => {
    debug.state('FormContainer state changed', newState);
  });

  // Container-specific state
  let containerState = {
    currentManufacturer: null,
    currentDevice: null,
    currentAction: null,
    lastSuccessfulState: null,
    isInitialized: false,
  };

  debug.state('Initial container state', containerState);

  // Create the form component
  debug.info('Creating PhoneRepairForm component');

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

  debug.info('PhoneRepairForm component created successfully');

  // Event handlers with comprehensive logging
  async function handleManufacturerChange(manufacturerId) {
    const performanceEnd = debug.performance('handleManufacturerChange');
    debug.event('manufacturerChange', {
      manufacturerId,
      previousSelection: containerState.currentManufacturer,
    });

    try {
      // Reset dependent selections
      debug.info('Resetting dependent selections');
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
        debug.info('Manufacturer deselected, clearing state');
        containerState.currentManufacturer = null;
        performanceEnd();
        return;
      }

      containerState.currentManufacturer = manufacturerId;
      debug.info('Fetching devices for manufacturer', { manufacturerId });

      // Fetch devices
      const devices = await container.fetchResource('devices', () => {
        debug.api('fetchDevices', { manufacturerId });
        return service.fetchDevices(manufacturerId);
      });

      debug.info('Devices fetched successfully', {
        manufacturerId,
        deviceCount: devices.length,
        devices: devices.map((d) => ({ id: d.id, name: d.name })),
      });

      // Update form with new devices
      form.setState({
        devices,
        selectedManufacturer: manufacturerId,
      });

      containerState.lastSuccessfulState = { ...containerState };
      debug.state('Manufacturer change completed', containerState);
    } catch (error) {
      debug.error('Error in handleManufacturerChange', {
        manufacturerId,
        error: error.message,
        stack: error.stack,
      });

      // Reset to last successful state
      if (containerState.lastSuccessfulState) {
        debug.info('Restoring last successful state');
        Object.assign(containerState, containerState.lastSuccessfulState);
      }

      form.setErrors({ devices: error.message });
    } finally {
      performanceEnd();
    }
  }

  async function handleDeviceChange(deviceId) {
    const performanceEnd = debug.performance('handleDeviceChange');
    debug.event('deviceChange', {
      deviceId,
      previousSelection: containerState.currentDevice,
    });

    try {
      // Reset dependent selections
      debug.info('Resetting dependent selections');
      containerState.currentAction = null;

      form.setState({
        selectedAction: '',
        actions: [],
        currentPrice: null,
      });

      if (!deviceId) {
        debug.info('Device deselected, clearing state');
        containerState.currentDevice = null;
        performanceEnd();
        return;
      }

      containerState.currentDevice = deviceId;
      debug.info('Fetching actions for device', { deviceId });

      // Fetch actions
      const actions = await container.fetchResource('actions', () => {
        debug.api('fetchActions', { deviceId });
        return service.fetchActions(deviceId);
      });

      debug.info('Actions fetched successfully', {
        deviceId,
        actionCount: actions.length,
        actions: actions.map((a) => ({ id: a.id, name: a.name })),
      });

      // Update form with new actions
      form.setState({
        actions,
        selectedDevice: deviceId,
      });

      containerState.lastSuccessfulState = { ...containerState };
      debug.state('Device change completed', containerState);
    } catch (error) {
      debug.error('Error in handleDeviceChange', {
        deviceId,
        error: error.message,
        stack: error.stack,
      });

      // Reset to last successful state
      if (containerState.lastSuccessfulState) {
        debug.info('Restoring last successful state');
        Object.assign(containerState, containerState.lastSuccessfulState);
      }

      form.setErrors({ actions: error.message });
    } finally {
      performanceEnd();
    }
  }

  async function handleActionChange(actionId) {
    const performanceEnd = debug.performance('handleActionChange');
    debug.event('actionChange', {
      actionId,
      previousSelection: containerState.currentAction,
    });

    try {
      // Clear current price
      debug.info('Clearing current price');
      form.setState({
        currentPrice: null,
      });

      if (!actionId) {
        debug.info('Action deselected, clearing state');
        containerState.currentAction = null;
        performanceEnd();
        return;
      }

      containerState.currentAction = actionId;
      debug.info('Fetching price for action', { actionId });

      // Fetch price
      const price = await container.fetchResource('price', () => {
        debug.api('fetchPrice', { actionId });
        return service.fetchPrice(actionId);
      });

      debug.info('Price fetched successfully', {
        actionId,
        price: price
          ? {
              price: price.price,
              deviceName: price.deviceName,
              actionName: price.actionName,
            }
          : null,
      });

      // Update form with new price
      form.setState({
        currentPrice: price,
        selectedAction: actionId,
      });

      // Call onPriceChange callback if provided
      if (typeof onPriceChange === 'function') {
        debug.info('Calling onPriceChange callback', { price });
        try {
          onPriceChange(price);
          debug.info('onPriceChange callback completed successfully');
        } catch (callbackError) {
          debug.error('Error in onPriceChange callback', callbackError);
        }
      }

      containerState.lastSuccessfulState = { ...containerState };
      debug.state('Action change completed', containerState);
    } catch (error) {
      debug.error('Error in handleActionChange', {
        actionId,
        error: error.message,
        stack: error.stack,
      });

      // Reset to last successful state
      if (containerState.lastSuccessfulState) {
        debug.info('Restoring last successful state');
        Object.assign(containerState, containerState.lastSuccessfulState);
      }

      form.setErrors({ price: error.message });
    } finally {
      performanceEnd();
    }
  }

  function handleScheduleClick(repairInfo) {
    debug.event('scheduleClick', { repairInfo });

    if (typeof onScheduleClick === 'function') {
      debug.info('Calling onScheduleClick callback', { repairInfo });
      try {
        onScheduleClick(repairInfo);
        debug.info('onScheduleClick callback completed successfully');
      } catch (error) {
        debug.error('Error in onScheduleClick callback', error);
      }
    } else {
      debug.warn('onScheduleClick callback not provided or not a function', {
        type: typeof onScheduleClick,
      });
    }
  }

  // Initialize the container
  async function initialize() {
    const performanceEnd = debug.performance('initialization');
    debug.info('Starting container initialization');

    try {
      // Load initial manufacturers
      debug.info('Loading initial manufacturers');
      const manufacturers = await container.fetchResource(
        'manufacturers',
        () => {
          debug.api('fetchManufacturers', {});
          return service.fetchManufacturers();
        }
      );

      debug.info('Initial manufacturers loaded', {
        count: manufacturers.length,
        manufacturers: manufacturers.map((m) => ({ id: m.id, name: m.name })),
      });

      // Update form with manufacturers
      form.setManufacturers(manufacturers);

      containerState.isInitialized = true;
      containerState.lastSuccessfulState = { ...containerState };
      debug.state('Initialization completed', containerState);
    } catch (error) {
      debug.error('Initialization failed', {
        error: error.message,
        stack: error.stack,
      });

      form.setErrors({ manufacturers: error.message });
    } finally {
      performanceEnd();
    }
  }

  // Start initialization
  debug.info('Triggering initialization');
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
      const state = {
        ...containerState,
        formContainerState: container.state,
        isLoading: container.isLoading(),
        hasErrors: container.hasErrors(),
      };
      debug.info('Container state requested', state);
      return state;
    },

    /**
     * Manually refresh a specific resource
     * @param {string} resource - Resource to refresh
     * @returns {Promise} Refresh promise
     */
    async refresh(resource) {
      debug.info('Manual refresh requested', { resource });

      switch (resource) {
        case 'manufacturers':
          return this.refreshManufacturers();
        default:
          debug.warn('Unknown resource for refresh', { resource });
          throw new Error(`Unknown resource: ${resource}`);
      }
    },

    /**
     * Refresh manufacturers
     * @returns {Promise} Refresh promise
     */
    async refreshManufacturers() {
      debug.info('Refreshing manufacturers');
      const manufacturers = await container.fetchResource(
        'manufacturers',
        () => {
          debug.api('fetchManufacturers (refresh)', {});
          return service.fetchManufacturers();
        }
      );
      form.setManufacturers(manufacturers);
      return manufacturers;
    },

    /**
     * Clean up resources
     */
    destroy() {
      debug.info('Destroying container');
      if (form && typeof form.destroy === 'function') {
        form.destroy();
      }
    },

    // Expose form methods for convenience
    updateForm: (props) => {
      debug.info('Updating form via container', {
        propsKeys: Object.keys(props),
      });
      return form.update(props);
    },

    getFormState: () => {
      const state = form.getCurrentState();
      debug.info('Form state requested via container', {
        stateKeys: Object.keys(state),
      });
      return state;
    },
  };

  debug.info('Container created successfully', {
    apiMethods: Object.keys(containerAPI),
    initialState: containerState,
  });

  return containerAPI;
};

export default createPhoneRepairFormContainer;
