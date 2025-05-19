import BaseService from './BaseService.js';

/**
 * Mock service class for handling used phone price API requests in testing/development
 * @extends BaseService
 */
export default class MockUsedPhonePriceService extends BaseService {
  /**
   * Creates a new MockUsedPhonePriceService instance
   *
   * @param {Object} mockData - Mock data for the service
   * @param {number} [delay=300] - Simulated API delay in milliseconds
   */
  constructor(mockData, delay = 300) {
    super();
    this.mockData = mockData;
    this.delay = delay;

    if (!mockData || !mockData.manufacturers) {
      console.warn(
        'MockUsedPhonePriceService initialized without valid mock data'
      );
    }
  }

  /**
   * Fetch manufacturers from mock data
   * @returns {Promise<Array>} Array of manufacturer objects
   */
  async fetchManufacturers() {
    return this.simulateApiCall(() => {
      return this.mockData.manufacturers || [];
    });
  }

  /**
   * Fetch devices for a manufacturer from mock data
   * @param {string|number} manufacturerId - Manufacturer ID
   * @returns {Promise<Array>} Array of device objects
   */
  async fetchDevices(manufacturerId) {
    return this.simulateApiCall(() => {
      const manufacturer = this.mockData.manufacturers.find(
        (m) => m.id.toString() === manufacturerId.toString()
      );

      if (!manufacturer) {
        throw new Error(`Manufacturer with ID ${manufacturerId} not found`);
      }

      return manufacturer.devices || [];
    });
  }

  /**
   * Fetch conditions for a device from mock data
   * @param {string|number} deviceId - Device ID
   * @returns {Promise<Array>} Array of condition objects
   */
  async fetchConditions(deviceId) {
    return this.simulateApiCall(() => {
      let foundDevice = null;

      // Search through all manufacturers and their devices
      for (const manufacturer of this.mockData.manufacturers) {
        foundDevice = manufacturer.devices.find(
          (d) => d.id.toString() === deviceId.toString()
        );

        if (foundDevice) {
          break;
        }
      }

      if (!foundDevice) {
        throw new Error(`Device with ID ${deviceId} not found`);
      }

      return foundDevice.conditions || [];
    });
  }

  /**
   * Fetch price for a condition from mock data
   * @param {string|number} conditionId - Condition ID
   * @returns {Promise<Object>} Price data object
   */
  async fetchPrice(conditionId) {
    return this.simulateApiCall(() => {
      let foundPrice = null;

      // Search through all manufacturers, devices, and conditions
      searchLoop: for (const manufacturer of this.mockData.manufacturers) {
        for (const device of manufacturer.devices) {
          for (const condition of device.conditions) {
            if (
              condition.id.toString() === conditionId.toString() &&
              condition.prices &&
              condition.prices.length > 0
            ) {
              foundPrice = {
                price: condition.prices[0].price,
                deviceName: device.name,
                conditionName: condition.name,
                manufacturerName: manufacturer.name,
              };
              break searchLoop;
            }
          }
        }
      }

      if (!foundPrice) {
        throw new Error(`Price for condition ID ${conditionId} not found`);
      }

      return foundPrice;
    });
  }

  /**
   * Helper to simulate API delay and async behavior
   * @private
   * @param {Function} dataCallback - Function that returns data or throws an error
   * @returns {Promise<any>} Promise that resolves with the data or rejects with an error
   */
  simulateApiCall(dataCallback) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = dataCallback();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }, this.delay);
    });
  }
}
