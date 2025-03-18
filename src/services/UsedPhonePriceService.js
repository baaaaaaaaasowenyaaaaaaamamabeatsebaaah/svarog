// src/services/UsedPhonePriceService.js

/**
 * Service class for handling used phone price API requests
 */
export default class UsedPhonePriceService {
  /**
   * Creates a new UsedPhonePriceService instance
   *
   * @param {Object} options - Configuration options
   * @param {string} [options.baseUrl='/api'] - Base URL for API requests
   */
  constructor({ baseUrl = '/api' } = {}) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch manufacturers from API
   * @returns {Promise<Array>} Array of manufacturer objects
   */
  async fetchManufacturers() {
    return this.fetchData(`${this.baseUrl}/manufacturers`);
  }

  /**
   * Fetch devices for a manufacturer from API
   * @param {string|number} manufacturerId - Manufacturer ID
   * @returns {Promise<Array>} Array of device objects
   */
  async fetchDevices(manufacturerId) {
    return this.fetchData(
      `${this.baseUrl}/manufacturers/${manufacturerId}/devices`
    );
  }

  /**
   * Fetch conditions for a device from API
   * @param {string|number} deviceId - Device ID
   * @returns {Promise<Array>} Array of condition objects
   */
  async fetchConditions(deviceId) {
    return this.fetchData(`${this.baseUrl}/devices/${deviceId}/conditions`);
  }

  /**
   * Fetch price for a device with specific condition from API
   * @param {string|number} conditionId - Condition ID
   * @returns {Promise<Object>} Price data object
   */
  async fetchPrice(conditionId) {
    return this.fetchData(`${this.baseUrl}/conditions/${conditionId}/price`);
  }

  /**
   * Generic fetch method with error handling
   * @private
   * @param {string} url - URL to fetch
   * @returns {Promise<any>} Response data
   */
  async fetchData(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API fetch error (${url}):`, error);
      throw error;
    }
  }
}
