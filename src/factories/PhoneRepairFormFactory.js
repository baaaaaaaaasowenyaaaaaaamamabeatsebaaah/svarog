// src/factories/PhoneRepairFormFactory.js
import PhoneRepairForm from '../components/PhoneRepairForm/PhoneRepairForm.js';
import MockPhoneRepairService from '../services/MockPhoneRepairService.js';
import {
  defaultLabels,
  defaultApiConfig,
} from '../config/PhoneRepairFormConfig.js';

/**
 * Factory class for creating PhoneRepairForm instances with different configurations
 */
export default class PhoneRepairFormFactory {
  /**
   * Create a standard PhoneRepairForm with real API
   *
   * @param {Object} options - Configuration options
   * @param {Function} [options.onPriceChange] - Callback when a price is selected
   * @param {Function} [options.onScheduleClick] - Callback when schedule button is clicked
   * @param {string} [options.usedPhoneUrl] - URL for used phone link
   * @param {Object} [options.labels] - Custom labels to override defaults
   * @param {Object} [options.apiOptions] - API service configuration options
   * @param {string} [options.className=''] - Additional CSS class names
   * @returns {PhoneRepairForm} A new PhoneRepairForm instance
   */
  static createStandard({
    onPriceChange,
    onScheduleClick,
    usedPhoneUrl,
    labels = {},
    apiOptions = {},
    className = '',
  } = {}) {
    return new PhoneRepairForm({
      onPriceChange,
      onScheduleClick,
      usedPhoneUrl,
      labels: { ...defaultLabels, ...labels },
      apiOptions: { ...defaultApiConfig, ...apiOptions },
      className,
    });
  }

  /**
   * Create a PhoneRepairForm with mock data for testing/development
   *
   * @param {Object} options - Configuration options
   * @param {Object} options.mockData - Mock data for the form
   * @param {Function} [options.onPriceChange] - Callback when a price is selected
   * @param {Function} [options.onScheduleClick] - Callback when schedule button is clicked
   * @param {string} [options.usedPhoneUrl] - URL for used phone link
   * @param {Object} [options.labels] - Custom labels to override defaults
   * @param {number} [options.mockDelay=300] - Simulated API delay in milliseconds
   * @param {string} [options.className=''] - Additional CSS class names
   * @returns {PhoneRepairForm} A new PhoneRepairForm instance with mock service
   */
  static createWithMockData({
    mockData,
    onPriceChange,
    onScheduleClick,
    usedPhoneUrl,
    labels = {},
    className = '',
  }) {
    if (!mockData || !mockData.manufacturers) {
      throw new Error(
        'MockData is required for creating a form with mock data'
      );
    }

    // Create mock service instance
    const mockService = new MockPhoneRepairService(mockData);

    // Create form with autoInitialize set to false for testing
    const form = new PhoneRepairForm({
      onPriceChange,
      onScheduleClick,
      usedPhoneUrl,
      labels: { ...defaultLabels, ...labels },
      className,
      autoInitialize: false, // Don't auto-load in tests
    });

    // Replace service with mock service
    form.service = mockService;

    return form;
  }

  /**
   * Create a PhoneRepairForm with a custom mock service that can simulate errors
   *
   * @param {Object} options - Configuration options
   * @param {Object} options.service - Custom mock service with methods to simulate errors
   * @param {Function} [options.onPriceChange] - Callback when a price is selected
   * @param {Function} [options.onScheduleClick] - Callback when schedule button is clicked
   * @param {string} [options.usedPhoneUrl] - URL for used phone link
   * @param {Object} [options.labels] - Custom labels to override defaults
   * @param {string} [options.className=''] - Additional CSS class names
   * @returns {PhoneRepairForm} A new PhoneRepairForm instance with custom mock service
   */
  static createWithMockService({
    service,
    onPriceChange,
    onScheduleClick,
    usedPhoneUrl,
    labels = {},
    className = '',
  }) {
    if (!service) {
      throw new Error('Custom service is required for createWithMockService');
    }

    // Create form with autoInitialize set to false for testing
    const form = new PhoneRepairForm({
      onPriceChange,
      onScheduleClick,
      usedPhoneUrl,
      labels: { ...defaultLabels, ...labels },
      className,
      autoInitialize: false, // Don't auto-load in tests
    });

    // Replace service with provided custom service
    form.service = service;

    return form;
  }
}
