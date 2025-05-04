// src/factories/UsedPhonePriceFormFactory.js
import UsedPhonePriceForm from '../components/UsedPhonePriceForm/UsedPhonePriceForm.js';
import UsedPhonePriceService from '../services/UsedPhonePriceService.js';
import MockUsedPhonePriceService from '../services/MockUsedPhonePriceService.js';
import {
  defaultLabels,
  defaultApiConfig,
} from '../config/UsedPhonePriceFormConfig.js';

/**
 * Factory class for creating UsedPhonePriceForm instances with different configurations
 */
export default class UsedPhonePriceFormFactory {
  /**
   * Create a standard UsedPhonePriceForm with real API
   *
   * @param {Object} options - Configuration options
   * @param {Function} [options.onPriceChange] - Callback when a price is selected
   * @param {Function} [options.onSubmit] - Callback when form is submitted
   * @param {Object} [options.labels] - Custom labels to override defaults
   * @param {Object} [options.apiOptions] - API service configuration options
   * @param {boolean} [options.showStepsIndicator=true] - Whether to show steps indicator
   * @param {string} [options.className=''] - Additional CSS class names
   * @returns {UsedPhonePriceForm} A new UsedPhonePriceForm instance
   */
  static createStandard({
    onPriceChange,
    onSubmit,
    labels = {},
    apiOptions = {},
    showStepsIndicator = true,
    className = '',
  } = {}) {
    // Create service
    const service = new UsedPhonePriceService({
      ...defaultApiConfig,
      ...apiOptions,
    });

    // Create form
    return new UsedPhonePriceForm({
      service,
      onPriceChange,
      onSubmit,
      labels: { ...defaultLabels, ...labels },
      showStepsIndicator,
      className,
    });
  }

  /**
   * Create a UsedPhonePriceForm with mock data for testing/development
   *
   * @param {Object} options - Configuration options
   * @param {Object} options.mockData - Mock data for the form
   * @param {Function} [options.onPriceChange] - Callback when a price is selected
   * @param {Function} [options.onSubmit] - Callback when form is submitted
   * @param {Object} [options.labels] - Custom labels to override defaults
   * @param {number} [options.mockDelay=300] - Simulated API delay in milliseconds
   * @param {boolean} [options.showStepsIndicator=true] - Whether to show steps indicator
   * @param {string} [options.className=''] - Additional CSS class names
   * @returns {UsedPhonePriceForm} A new UsedPhonePriceForm instance with mock service
   */
  static createWithMockData({
    mockData,
    onPriceChange,
    onSubmit,
    labels = {},
    mockDelay = 300,
    showStepsIndicator = true,
    className = '',
  }) {
    if (!mockData || !mockData.manufacturers) {
      throw new Error(
        'MockData is required for creating a form with mock data'
      );
    }

    // Create mock service instance
    const service = new MockUsedPhonePriceService(mockData, mockDelay);

    // Create form with mock service
    return new UsedPhonePriceForm({
      service,
      onPriceChange,
      onSubmit,
      labels: { ...defaultLabels, ...labels },
      showStepsIndicator,
      className,
    });
  }
}
