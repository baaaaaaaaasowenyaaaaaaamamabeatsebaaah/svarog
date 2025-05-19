import BaseService from './BaseService.js';

/**
 * Service class for handling used phone price API requests
 * @extends BaseService
 */
export default class UsedPhonePriceService extends BaseService {
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
}
