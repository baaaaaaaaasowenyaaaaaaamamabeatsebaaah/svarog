// src/mocks/phoneRepairData.js
/**
 * Mock data for the PhoneRepairForm component
 * Use this for Storybook and testing environments
 */

export const mockPhoneRepairData = {
  manufacturers: [
    {
      id: 1,
      name: 'Apple',
      devices: [
        {
          id: 1,
          name: 'iPhone 4',
          manufacturerId: 1,
          actions: [
            {
              id: 1,
              name: 'Annaeherungssensor defekt',
              deviceId: 1,
              prices: [
                {
                  id: 1,
                  price: 49,
                  actionId: 1,
                },
              ],
            },
            {
              id: 2,
              name: 'Akku Austausch',
              deviceId: 1,
              prices: [
                {
                  id: 2,
                  price: 39,
                  actionId: 2,
                },
              ],
            },
            {
              id: 3,
              name: 'Display Reparatur',
              deviceId: 1,
              prices: [
                {
                  id: 3,
                  price: 79,
                  actionId: 3,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'iPhone 5',
          manufacturerId: 1,
          actions: [
            {
              id: 4,
              name: 'Akku Austausch',
              deviceId: 2,
              prices: [
                {
                  id: 4,
                  price: 45,
                  actionId: 4,
                },
              ],
            },
            {
              id: 5,
              name: 'Display Reparatur',
              deviceId: 2,
              prices: [
                {
                  id: 5,
                  price: 89,
                  actionId: 5,
                },
              ],
            },
          ],
        },
        {
          id: 3,
          name: 'iPhone 13',
          manufacturerId: 1,
          actions: [
            {
              id: 6,
              name: 'Akku Austausch',
              deviceId: 3,
              prices: [
                {
                  id: 6,
                  price: 79,
                  actionId: 6,
                },
              ],
            },
            {
              id: 7,
              name: 'Display Reparatur',
              deviceId: 3,
              prices: [
                {
                  id: 7,
                  price: 269,
                  actionId: 7,
                },
              ],
            },
            {
              id: 8,
              name: 'Kamera Austausch',
              deviceId: 3,
              prices: [
                {
                  id: 8,
                  price: 189,
                  actionId: 8,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Samsung',
      devices: [
        {
          id: 4,
          name: 'Galaxy S10',
          manufacturerId: 2,
          actions: [
            {
              id: 9,
              name: 'Akku Austausch',
              deviceId: 4,
              prices: [
                {
                  id: 9,
                  price: 69,
                  actionId: 9,
                },
              ],
            },
            {
              id: 10,
              name: 'Display Reparatur',
              deviceId: 4,
              prices: [
                {
                  id: 10,
                  price: 179,
                  actionId: 10,
                },
              ],
            },
          ],
        },
        {
          id: 5,
          name: 'Galaxy S21',
          manufacturerId: 2,
          actions: [
            {
              id: 11,
              name: 'Akku Austausch',
              deviceId: 5,
              prices: [
                {
                  id: 11,
                  price: 89,
                  actionId: 11,
                },
              ],
            },
            {
              id: 12,
              name: 'Display Reparatur',
              deviceId: 5,
              prices: [
                {
                  id: 12,
                  price: 249,
                  actionId: 12,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'Huawei',
      devices: [
        {
          id: 6,
          name: 'P30 Pro',
          manufacturerId: 3,
          actions: [
            {
              id: 13,
              name: 'Akku Austausch',
              deviceId: 6,
              prices: [
                {
                  id: 13,
                  price: 59,
                  actionId: 13,
                },
              ],
            },
            {
              id: 14,
              name: 'Display Reparatur',
              deviceId: 6,
              prices: [
                {
                  id: 14,
                  price: 159,
                  actionId: 14,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'Google',
      devices: [
        {
          id: 7,
          name: 'Pixel 6',
          manufacturerId: 4,
          actions: [
            {
              id: 15,
              name: 'Akku Austausch',
              deviceId: 7,
              prices: [
                {
                  id: 15,
                  price: 79,
                  actionId: 15,
                },
              ],
            },
            {
              id: 16,
              name: 'Display Reparatur',
              deviceId: 7,
              prices: [
                {
                  id: 16,
                  price: 189,
                  actionId: 16,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 5,
      name: 'Xiaomi',
      devices: [
        {
          id: 8,
          name: 'Redmi Note 10',
          manufacturerId: 5,
          actions: [
            {
              id: 17,
              name: 'Akku Austausch',
              deviceId: 8,
              prices: [
                {
                  id: 17,
                  price: 49,
                  actionId: 17,
                },
              ],
            },
            {
              id: 18,
              name: 'Display Reparatur',
              deviceId: 8,
              prices: [
                {
                  id: 18,
                  price: 129,
                  actionId: 18,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Mock API functions for the PhoneRepairForm component
 * These functions simulate the behavior of real API calls
 */
export const mockPhoneRepairApi = {
  fetchManufacturers: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPhoneRepairData.manufacturers);
      }, 300);
    });
  },

  fetchDevices: (manufacturerId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const manufacturer = mockPhoneRepairData.manufacturers.find(
          (m) => m.id.toString() === manufacturerId.toString()
        );

        if (!manufacturer) {
          reject(new Error(`Manufacturer with ID ${manufacturerId} not found`));
          return;
        }

        resolve(manufacturer.devices);
      }, 300);
    });
  },

  fetchActions: (deviceId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let foundDevice = null;

        // Search through all manufacturers and their devices
        for (const manufacturer of mockPhoneRepairData.manufacturers) {
          foundDevice = manufacturer.devices.find(
            (d) => d.id.toString() === deviceId.toString()
          );

          if (foundDevice) {
            break;
          }
        }

        if (!foundDevice) {
          reject(new Error(`Device with ID ${deviceId} not found`));
          return;
        }

        resolve(foundDevice.actions);
      }, 300);
    });
  },

  fetchPrice: (actionId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let foundPrice = null;

        // Search through all manufacturers, devices, and actions
        searchLoop: for (const manufacturer of mockPhoneRepairData.manufacturers) {
          for (const device of manufacturer.devices) {
            for (const action of device.actions) {
              if (
                action.id.toString() === actionId.toString() &&
                action.prices &&
                action.prices.length > 0
              ) {
                foundPrice = { price: action.prices[0].price };
                break searchLoop;
              }
            }
          }
        }

        if (!foundPrice) {
          reject(new Error(`Price for action ID ${actionId} not found`));
          return;
        }

        resolve(foundPrice);
      }, 300);
    });
  },
};

// Export a function to setup fetch mocks for tests
export const setupPhoneRepairMocks = () => {
  // Mock fetch for tests - using window instead of global in browser environments
  const mockFetch = (url) => {
    if (url === '/api/manufacturers') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPhoneRepairData.manufacturers),
      });
    }

    // Match manufacturers/{id}/devices
    const deviceMatch = url.match(/\/api\/manufacturers\/(\d+)\/devices/);
    if (deviceMatch) {
      const manufacturerId = deviceMatch[1];
      return mockPhoneRepairApi
        .fetchDevices(manufacturerId)
        .then((data) => ({
          ok: true,
          json: () => Promise.resolve(data),
        }))
        .catch((error) => ({
          ok: false,
          json: () => Promise.reject(error),
        }));
    }

    // Match devices/{id}/actions
    const actionMatch = url.match(/\/api\/devices\/(\d+)\/actions/);
    if (actionMatch) {
      const deviceId = actionMatch[1];
      return mockPhoneRepairApi
        .fetchActions(deviceId)
        .then((data) => ({
          ok: true,
          json: () => Promise.resolve(data),
        }))
        .catch((error) => ({
          ok: false,
          json: () => Promise.reject(error),
        }));
    }

    // Match actions/{id}/price
    const priceMatch = url.match(/\/api\/actions\/(\d+)\/price/);
    if (priceMatch) {
      const actionId = priceMatch[1];
      return mockPhoneRepairApi
        .fetchPrice(actionId)
        .then((data) => ({
          ok: true,
          json: () => Promise.resolve(data),
        }))
        .catch((error) => ({
          ok: false,
          json: () => Promise.reject(error),
        }));
    }

    // Default: not found
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
    });
  };

  // Use window.fetch in browser, fallback to global in Node environment
  if (typeof window !== 'undefined') {
    window.fetch = mockFetch;
  } else if (typeof global !== 'undefined') {
    global.fetch = mockFetch;
  }
};
