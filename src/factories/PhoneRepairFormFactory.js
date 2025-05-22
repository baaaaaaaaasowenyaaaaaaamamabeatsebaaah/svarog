// src/factories/PhoneRepairFormFactory.js
import PhoneRepairFormContainer from '../components/PhoneRepairForm/PhoneRepairFormContainer.js';
import PhoneRepairService from '../services/PhoneRepairService.js';
import MockPhoneRepairService from '../services/MockPhoneRepairService.js';
import {
  defaultLabels,
  defaultApiConfig,
} from '../config/PhoneRepairFormConfig.js';

/**
 * Enhanced factory class for creating PhoneRepairForm instances with improved error handling and API integration
 */
export default class PhoneRepairFormFactory {
  /**
   * Create a standard PhoneRepairForm with real API and enhanced error handling
   * @param {Object} options - Configuration options
   * @returns {Object} A new PhoneRepairFormContainer instance
   */
  static createStandard({
    onPriceChange,
    onScheduleClick,
    usedPhoneUrl,
    labels = {},
    apiOptions = {},
    className = '',
    retryOptions = {},
  } = {}) {
    // Create service with enhanced configuration
    const serviceConfig = {
      ...defaultApiConfig,
      ...apiOptions,
      retryConfig: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
        ...retryOptions,
      },
    };

    const service = new PhoneRepairService(serviceConfig);

    // Enhance service with retry wrapper
    const enhancedService = createRetryWrapper(
      service,
      serviceConfig.retryConfig
    );

    // Create container with enhanced service
    return PhoneRepairFormContainer({
      service: enhancedService,
      onPriceChange: createSafeCallback(onPriceChange, 'onPriceChange'),
      onScheduleClick: createSafeCallback(onScheduleClick, 'onScheduleClick'),
      usedPhoneUrl,
      labels: { ...defaultLabels, ...labels },
      className,
    });
  }

  /**
   * Create a PhoneRepairForm with mock data for testing/development
   * @param {Object} options - Configuration options
   * @returns {Object} A new PhoneRepairFormContainer instance with mock service
   */
  static createWithMockData({
    mockData,
    onPriceChange,
    onScheduleClick,
    usedPhoneUrl,
    labels = {},
    mockDelay = 300,
    className = '',
    errorSimulation = {},
  }) {
    if (!mockData || !mockData.manufacturers) {
      throw new Error(
        'MockData is required for creating a form with mock data'
      );
    }

    // Create enhanced mock service with error simulation
    const mockServiceConfig = {
      mockData,
      delay: mockDelay,
      errorSimulation: {
        manufacturersFailureRate: 0,
        devicesFailureRate: 0,
        actionsFailureRate: 0,
        priceFailureRate: 0,
        networkErrorRate: 0,
        ...errorSimulation,
      },
    };

    const service = new MockPhoneRepairService(mockData, mockDelay);
    const enhancedService = createErrorSimulationWrapper(
      service,
      mockServiceConfig.errorSimulation
    );

    return PhoneRepairFormContainer({
      service: enhancedService,
      onPriceChange: createSafeCallback(onPriceChange, 'onPriceChange'),
      onScheduleClick: createSafeCallback(onScheduleClick, 'onScheduleClick'),
      usedPhoneUrl,
      labels: { ...defaultLabels, ...labels },
      className,
    });
  }

  /**
   * Create a PhoneRepairForm with a custom service for advanced use cases
   * @param {Object} options - Configuration options
   * @returns {Object} A new PhoneRepairFormContainer instance with custom service
   */
  static createWithCustomService({
    service,
    onPriceChange,
    onScheduleClick,
    usedPhoneUrl,
    labels = {},
    className = '',
    enableRetries = true,
    retryOptions = {},
  }) {
    if (!service) {
      throw new Error('Custom service is required for createWithCustomService');
    }

    // Validate service interface
    const requiredMethods = [
      'fetchManufacturers',
      'fetchDevices',
      'fetchActions',
      'fetchPrice',
    ];
    for (const method of requiredMethods) {
      if (typeof service[method] !== 'function') {
        throw new Error(`Service must implement ${method} method`);
      }
    }

    // Optionally wrap with retry logic
    const finalService = enableRetries
      ? createRetryWrapper(service, retryOptions)
      : service;

    return PhoneRepairFormContainer({
      service: finalService,
      onPriceChange: createSafeCallback(onPriceChange, 'onPriceChange'),
      onScheduleClick: createSafeCallback(onScheduleClick, 'onScheduleClick'),
      usedPhoneUrl,
      labels: { ...defaultLabels, ...labels },
      className,
    });
  }

  /**
   * Create a PhoneRepairForm optimized for production use with advanced features
   * @param {Object} options - Configuration options
   * @returns {Object} A new PhoneRepairFormContainer instance optimized for production
   */
  static createProduction({
    apiBaseUrl,
    onPriceChange,
    onScheduleClick,
    usedPhoneUrl,
    labels = {},
    className = '',
    analytics = null,
    caching = true,
    retryOptions = {},
  } = {}) {
    const serviceConfig = {
      baseUrl: apiBaseUrl || defaultApiConfig.baseUrl,
      enableCaching: caching,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      retryConfig: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
        ...retryOptions,
      },
    };

    const service = new PhoneRepairService(serviceConfig);
    const enhancedService = createRetryWrapper(
      service,
      serviceConfig.retryConfig
    );

    // Add analytics wrapper if provided
    const finalService = analytics
      ? createAnalyticsWrapper(enhancedService, analytics)
      : enhancedService;

    return PhoneRepairFormContainer({
      service: finalService,
      onPriceChange: createSafeCallback(onPriceChange, 'onPriceChange'),
      onScheduleClick: createSafeCallback(onScheduleClick, 'onScheduleClick'),
      usedPhoneUrl,
      labels: { ...defaultLabels, ...labels },
      className,
    });
  }
}

/**
 * Create a retry wrapper for service methods
 * @private
 */
function createRetryWrapper(service, retryConfig = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
  } = retryConfig;

  const retryMethod = async (methodName, ...args) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await service[methodName](...args);
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          throw new Error(
            `${methodName} failed after ${maxRetries} attempts: ${error.message}`
          );
        }

        // Wait before retry with exponential backoff
        const delay = retryDelay * Math.pow(backoffMultiplier, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));

        console.warn(
          `${methodName} attempt ${attempt} failed, retrying in ${delay}ms:`,
          error.message
        );
      }
    }

    throw lastError;
  };

  return {
    fetchManufacturers: (...args) => retryMethod('fetchManufacturers', ...args),
    fetchDevices: (...args) => retryMethod('fetchDevices', ...args),
    fetchActions: (...args) => retryMethod('fetchActions', ...args),
    fetchPrice: (...args) => retryMethod('fetchPrice', ...args),
    // Preserve any additional methods
    ...service,
  };
}

/**
 * Create an error simulation wrapper for testing
 * @private
 */
function createErrorSimulationWrapper(service, errorConfig = {}) {
  const simulateError = (methodName, failureRate) => {
    if (Math.random() < failureRate) {
      throw new Error(`Simulated ${methodName} error for testing`);
    }
  };

  return {
    async fetchManufacturers(...args) {
      simulateError('fetchManufacturers', errorConfig.manufacturersFailureRate);
      return service.fetchManufacturers(...args);
    },
    async fetchDevices(...args) {
      simulateError('fetchDevices', errorConfig.devicesFailureRate);
      return service.fetchDevices(...args);
    },
    async fetchActions(...args) {
      simulateError('fetchActions', errorConfig.actionsFailureRate);
      return service.fetchActions(...args);
    },
    async fetchPrice(...args) {
      simulateError('fetchPrice', errorConfig.priceFailureRate);
      return service.fetchPrice(...args);
    },
    ...service,
  };
}

/**
 * Create an analytics wrapper for production monitoring
 * @private
 */
function createAnalyticsWrapper(service, analytics) {
  const trackApiCall = (methodName, startTime, success, error = null) => {
    const duration = Date.now() - startTime;

    if (typeof analytics.trackApiCall === 'function') {
      analytics.trackApiCall({
        method: methodName,
        duration,
        success,
        error: error?.message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const wrapMethod = (methodName) => {
    return async (...args) => {
      const startTime = Date.now();

      try {
        const result = await service[methodName](...args);
        trackApiCall(methodName, startTime, true);
        return result;
      } catch (error) {
        trackApiCall(methodName, startTime, false, error);
        throw error;
      }
    };
  };

  return {
    fetchManufacturers: wrapMethod('fetchManufacturers'),
    fetchDevices: wrapMethod('fetchDevices'),
    fetchActions: wrapMethod('fetchActions'),
    fetchPrice: wrapMethod('fetchPrice'),
    ...service,
  };
}

/**
 * Create a safe callback wrapper that handles errors gracefully
 * @private
 */
function createSafeCallback(callback, callbackName) {
  if (!callback || typeof callback !== 'function') {
    return null;
  }

  return (...args) => {
    try {
      return callback(...args);
    } catch (error) {
      console.error(`Error in ${callbackName} callback:`, error);
    }
  };
}
