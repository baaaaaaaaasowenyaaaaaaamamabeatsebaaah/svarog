// src/services/PhoneRepairService.js

/**
 * Service class for handling phone repair API requests
 */
export default class PhoneRepairService {
  /**
   * Creates a new PhoneRepairService instance
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
   * Fetch actions for a device from API
   * @param {string|number} deviceId - Device ID
   * @returns {Promise<Array>} Array of action objects
   */
  async fetchActions(deviceId) {
    return this.fetchData(`${this.baseUrl}/devices/${deviceId}/actions`);
  }

  /**
   * Fetch price for an action from API
   * @param {string|number} actionId - Action ID
   * @returns {Promise<Object>} Price data object
   */
  async fetchPrice(actionId) {
    return this.fetchData(`${this.baseUrl}/actions/${actionId}/price`);
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
