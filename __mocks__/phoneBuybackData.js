// src/mocks/phoneBuybackData.js
/**
 * Mock data for the UsedPhonePriceForm component
 * Use this for Storybook and testing environments
 */

export const mockPhoneBuybackData = {
  manufacturers: [
    {
      id: 1,
      name: 'Apple',
      devices: [
        {
          id: 1,
          name: 'iPhone 15 Pro Max',
          manufacturerId: 1,
          conditions: [
            {
              id: 1,
              name: 'Like New',
              description:
                'No scratches, 100% functional, all accessories included',
              deviceId: 1,
              prices: [
                {
                  id: 1,
                  price: 950,
                  conditionId: 1,
                },
              ],
            },
            {
              id: 2,
              name: 'Good',
              description: 'Minor scratches, 100% functional',
              deviceId: 1,
              prices: [
                {
                  id: 2,
                  price: 850,
                  conditionId: 2,
                },
              ],
            },
            {
              id: 3,
              name: 'Fair',
              description:
                'Visible scratches and signs of use, fully functional',
              deviceId: 1,
              prices: [
                {
                  id: 3,
                  price: 750,
                  conditionId: 3,
                },
              ],
            },
            {
              id: 4,
              name: 'Poor',
              description: 'Heavy scratches and damages, still functional',
              deviceId: 1,
              prices: [
                {
                  id: 4,
                  price: 600,
                  conditionId: 4,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'iPhone 14 Pro',
          manufacturerId: 1,
          conditions: [
            {
              id: 5,
              name: 'Like New',
              description:
                'No scratches, 100% functional, all accessories included',
              deviceId: 2,
              prices: [
                {
                  id: 5,
                  price: 750,
                  conditionId: 5,
                },
              ],
            },
            {
              id: 6,
              name: 'Good',
              description: 'Minor scratches, 100% functional',
              deviceId: 2,
              prices: [
                {
                  id: 6,
                  price: 650,
                  conditionId: 6,
                },
              ],
            },
            {
              id: 7,
              name: 'Fair',
              description:
                'Visible scratches and signs of use, fully functional',
              deviceId: 2,
              prices: [
                {
                  id: 7,
                  price: 550,
                  conditionId: 7,
                },
              ],
            },
            {
              id: 8,
              name: 'Poor',
              description: 'Heavy scratches and damages, still functional',
              deviceId: 2,
              prices: [
                {
                  id: 8,
                  price: 450,
                  conditionId: 8,
                },
              ],
            },
          ],
        },
        {
          id: 3,
          name: 'iPhone 13',
          manufacturerId: 1,
          conditions: [
            {
              id: 9,
              name: 'Like New',
              description:
                'No scratches, 100% functional, all accessories included',
              deviceId: 3,
              prices: [
                {
                  id: 9,
                  price: 550,
                  conditionId: 9,
                },
              ],
            },
            {
              id: 10,
              name: 'Good',
              description: 'Minor scratches, 100% functional',
              deviceId: 3,
              prices: [
                {
                  id: 10,
                  price: 450,
                  conditionId: 10,
                },
              ],
            },
            {
              id: 11,
              name: 'Fair',
              description:
                'Visible scratches and signs of use, fully functional',
              deviceId: 3,
              prices: [
                {
                  id: 11,
                  price: 350,
                  conditionId: 11,
                },
              ],
            },
            {
              id: 12,
              name: 'Poor',
              description: 'Heavy scratches and damages, still functional',
              deviceId: 3,
              prices: [
                {
                  id: 12,
                  price: 250,
                  conditionId: 12,
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
          name: 'Galaxy S23 Ultra',
          manufacturerId: 2,
          conditions: [
            {
              id: 13,
              name: 'Like New',
              description:
                'No scratches, 100% functional, all accessories included',
              deviceId: 4,
              prices: [
                {
                  id: 13,
                  price: 800,
                  conditionId: 13,
                },
              ],
            },
            {
              id: 14,
              name: 'Good',
              description: 'Minor scratches, 100% functional',
              deviceId: 4,
              prices: [
                {
                  id: 14,
                  price: 700,
                  conditionId: 14,
                },
              ],
            },
            {
              id: 15,
              name: 'Fair',
              description:
                'Visible scratches and signs of use, fully functional',
              deviceId: 4,
              prices: [
                {
                  id: 15,
                  price: 600,
                  conditionId: 15,
                },
              ],
            },
            {
              id: 16,
              name: 'Poor',
              description: 'Heavy scratches and damages, still functional',
              deviceId: 4,
              prices: [
                {
                  id: 16,
                  price: 450,
                  conditionId: 16,
                },
              ],
            },
          ],
        },
        {
          id: 5,
          name: 'Galaxy S22',
          manufacturerId: 2,
          conditions: [
            {
              id: 17,
              name: 'Like New',
              description:
                'No scratches, 100% functional, all accessories included',
              deviceId: 5,
              prices: [
                {
                  id: 17,
                  price: 550,
                  conditionId: 17,
                },
              ],
            },
            {
              id: 18,
              name: 'Good',
              description: 'Minor scratches, 100% functional',
              deviceId: 5,
              prices: [
                {
                  id: 18,
                  price: 450,
                  conditionId: 18,
                },
              ],
            },
            {
              id: 19,
              name: 'Fair',
              description:
                'Visible scratches and signs of use, fully functional',
              deviceId: 5,
              prices: [
                {
                  id: 19,
                  price: 350,
                  conditionId: 19,
                },
              ],
            },
            {
              id: 20,
              name: 'Poor',
              description: 'Heavy scratches and damages, still functional',
              deviceId: 5,
              prices: [
                {
                  id: 20,
                  price: 250,
                  conditionId: 20,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'Google',
      devices: [
        {
          id: 6,
          name: 'Pixel 7 Pro',
          manufacturerId: 3,
          conditions: [
            {
              id: 21,
              name: 'Like New',
              description:
                'No scratches, 100% functional, all accessories included',
              deviceId: 6,
              prices: [
                {
                  id: 21,
                  price: 600,
                  conditionId: 21,
                },
              ],
            },
            {
              id: 22,
              name: 'Good',
              description: 'Minor scratches, 100% functional',
              deviceId: 6,
              prices: [
                {
                  id: 22,
                  price: 500,
                  conditionId: 22,
                },
              ],
            },
            {
              id: 23,
              name: 'Fair',
              description:
                'Visible scratches and signs of use, fully functional',
              deviceId: 6,
              prices: [
                {
                  id: 23,
                  price: 400,
                  conditionId: 23,
                },
              ],
            },
            {
              id: 24,
              name: 'Poor',
              description: 'Heavy scratches and damages, still functional',
              deviceId: 6,
              prices: [
                {
                  id: 24,
                  price: 300,
                  conditionId: 24,
                },
              ],
            },
          ],
        },
        {
          id: 7,
          name: 'Pixel 6',
          manufacturerId: 3,
          conditions: [
            {
              id: 25,
              name: 'Like New',
              description:
                'No scratches, 100% functional, all accessories included',
              deviceId: 7,
              prices: [
                {
                  id: 25,
                  price: 450,
                  conditionId: 25,
                },
              ],
            },
            {
              id: 26,
              name: 'Good',
              description: 'Minor scratches, 100% functional',
              deviceId: 7,
              prices: [
                {
                  id: 26,
                  price: 350,
                  conditionId: 26,
                },
              ],
            },
            {
              id: 27,
              name: 'Fair',
              description:
                'Visible scratches and signs of use, fully functional',
              deviceId: 7,
              prices: [
                {
                  id: 27,
                  price: 250,
                  conditionId: 27,
                },
              ],
            },
            {
              id: 28,
              name: 'Poor',
              description: 'Heavy scratches and damages, still functional',
              deviceId: 7,
              prices: [
                {
                  id: 28,
                  price: 150,
                  conditionId: 28,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'Xiaomi',
      devices: [
        {
          id: 8,
          name: 'Mi 12',
          manufacturerId: 4,
          conditions: [
            {
              id: 29,
              name: 'Like New',
              description:
                'No scratches, 100% functional, all accessories included',
              deviceId: 8,
              prices: [
                {
                  id: 29,
                  price: 450,
                  conditionId: 29,
                },
              ],
            },
            {
              id: 30,
              name: 'Good',
              description: 'Minor scratches, 100% functional',
              deviceId: 8,
              prices: [
                {
                  id: 30,
                  price: 350,
                  conditionId: 30,
                },
              ],
            },
            {
              id: 31,
              name: 'Fair',
              description:
                'Visible scratches and signs of use, fully functional',
              deviceId: 8,
              prices: [
                {
                  id: 31,
                  price: 250,
                  conditionId: 31,
                },
              ],
            },
            {
              id: 32,
              name: 'Poor',
              description: 'Heavy scratches and damages, still functional',
              deviceId: 8,
              prices: [
                {
                  id: 32,
                  price: 150,
                  conditionId: 32,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 5,
      name: 'OnePlus',
      devices: [
        {
          id: 9,
          name: 'OnePlus 10 Pro',
          manufacturerId: 5,
          conditions: [
            {
              id: 33,
              name: 'Like New',
              description:
                'No scratches, 100% functional, all accessories included',
              deviceId: 9,
              prices: [
                {
                  id: 33,
                  price: 500,
                  conditionId: 33,
                },
              ],
            },
            {
              id: 34,
              name: 'Good',
              description: 'Minor scratches, 100% functional',
              deviceId: 9,
              prices: [
                {
                  id: 34,
                  price: 400,
                  conditionId: 34,
                },
              ],
            },
            {
              id: 35,
              name: 'Fair',
              description:
                'Visible scratches and signs of use, fully functional',
              deviceId: 9,
              prices: [
                {
                  id: 35,
                  price: 300,
                  conditionId: 35,
                },
              ],
            },
            {
              id: 36,
              name: 'Poor',
              description: 'Heavy scratches and damages, still functional',
              deviceId: 9,
              prices: [
                {
                  id: 36,
                  price: 200,
                  conditionId: 36,
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
 * Mock API functions for the UsedPhonePriceForm component
 * These functions simulate the behavior of real API calls
 */
export const mockPhoneBuybackApi = {
  fetchManufacturers: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPhoneBuybackData.manufacturers);
      }, 300);
    });
  },

  fetchDevices: (manufacturerId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const manufacturer = mockPhoneBuybackData.manufacturers.find(
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

  fetchConditions: (deviceId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let foundDevice = null;

        // Search through all manufacturers and their devices
        for (const manufacturer of mockPhoneBuybackData.manufacturers) {
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

        resolve(foundDevice.conditions);
      }, 300);
    });
  },

  fetchPrice: (conditionId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let foundPrice = null;

        // Search through all manufacturers, devices, and conditions
        searchLoop: for (const manufacturer of mockPhoneBuybackData.manufacturers) {
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
          reject(new Error(`Price for condition ID ${conditionId} not found`));
          return;
        }

        resolve(foundPrice);
      }, 300);
    });
  },
};

// Export a function to setup fetch mocks for tests
export const setupPhoneBuybackMocks = () => {
  // Mock fetch for tests - using window instead of global in browser environments
  const mockFetch = (url) => {
    // Changed API endpoints to match the pattern used in phoneRepairData.js
    if (url === '/api/manufacturers') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPhoneBuybackData.manufacturers),
      });
    }

    // Match manufacturers/{id}/devices
    const deviceMatch = url.match(/\/api\/manufacturers\/(\d+)\/devices/);
    if (deviceMatch) {
      const manufacturerId = deviceMatch[1];
      return mockPhoneBuybackApi
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

    // Match devices/{id}/conditions
    const conditionMatch = url.match(/\/api\/devices\/(\d+)\/conditions/);
    if (conditionMatch) {
      const deviceId = conditionMatch[1];
      return mockPhoneBuybackApi
        .fetchConditions(deviceId)
        .then((data) => ({
          ok: true,
          json: () => Promise.resolve(data),
        }))
        .catch((error) => ({
          ok: false,
          json: () => Promise.reject(error),
        }));
    }

    // Match conditions/{id}/price - changed to match the pattern in phoneRepairData.js
    const priceMatch = url.match(/\/api\/conditions\/(\d+)\/price/);
    if (priceMatch) {
      const conditionId = priceMatch[1];
      return mockPhoneBuybackApi
        .fetchPrice(conditionId)
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
