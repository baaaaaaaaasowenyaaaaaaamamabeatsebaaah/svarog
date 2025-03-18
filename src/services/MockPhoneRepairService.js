// src/services/MockPhoneRepairService.js

/**
 * Mock service class for handling phone repair API requests in testing/development
 */
export default class MockPhoneRepairService {
  /**
   * Creates a new MockPhoneRepairService instance
   *
   * @param {Object} mockData - Mock data for the service
   */
  constructor(mockData) {
    this.mockData = mockData;

    if (!mockData || !mockData.manufacturers) {
      console.warn(
        'MockPhoneRepairService initialized without valid mock data'
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
   * Fetch actions for a device from mock data
   * @param {string|number} deviceId - Device ID
   * @returns {Promise<Array>} Array of action objects
   */
  async fetchActions(deviceId) {
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

      return foundDevice.actions || [];
    });
  }

  /**
   * Fetch price for an action from mock data
   * @param {string|number} actionId - Action ID
   * @returns {Promise<Object>} Price data object
   */
  async fetchPrice(actionId) {
    return this.simulateApiCall(() => {
      let foundPrice = null;

      // Search through all manufacturers, devices, and actions
      for (const manufacturer of this.mockData.manufacturers) {
        for (const device of manufacturer.devices) {
          for (const action of device.actions) {
            if (
              action.id.toString() === actionId.toString() &&
              action.prices &&
              action.prices.length > 0
            ) {
              foundPrice = {
                price: action.prices[0].price,
                deviceName: device.name,
                actionName: action.name,
                manufacturerName: manufacturer.name,
              };
              break;
            }
          }
          if (foundPrice) break;
        }
        if (foundPrice) break;
      }

      if (!foundPrice) {
        throw new Error(`Price for action ID ${actionId} not found`);
      }

      return foundPrice;
    });
  }

  /**
   * Helper to simulate API delay and async behavior
   * @private
   * @param {Function} dataCallback - Function that returns data or throws an error
   * @param {number} [delay=300] - Simulated API delay in milliseconds
   * @returns {Promise<any>} Promise that resolves with the data or rejects with an error
   */
  simulateApiCall(dataCallback, delay = 300) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = dataCallback();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }
}
