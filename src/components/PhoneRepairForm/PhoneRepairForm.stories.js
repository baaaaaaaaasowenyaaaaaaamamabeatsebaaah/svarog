// src/components/PhoneRepairForm/PhoneRepairForm.stories.js
import PhoneRepairFormFactory from '../../factories/PhoneRepairFormFactory.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

export default {
  title: 'Components/PhoneRepairForm',
  component: 'PhoneRepairForm',
  parameters: {
    docs: {
      description: {
        component:
          'Form component for selecting a phone repair service and viewing the price.',
      },
    },
  },
};

export const Default = () => {
  // Use factory to create form with mock data directly
  return PhoneRepairFormFactory.createWithMockData({
    mockData: mockPhoneRepairData,
    onPriceChange: (priceData) => console.log('Price selected:', priceData),
  });
};

export const WithoutSteps = () => {
  return PhoneRepairFormFactory.createWithMockData({
    mockData: mockPhoneRepairData,
    showStepsIndicator: false,
    onPriceChange: (priceData) => console.log('Price selected:', priceData),
  });
};

export const WithPreselectedData = () => {
  // Create component container
  const container = document.createElement('div');
  container.style.maxWidth = '600px';

  // Create form component with factory
  const repairForm = PhoneRepairFormFactory.createWithMockData({
    mockData: mockPhoneRepairData,
    onPriceChange: (priceData) => {
      console.log('Price selected:', priceData);

      // Update summary display
      if (summaryDisplay) {
        const manufacturer = priceData.manufacturerName || 'Not selected';
        const device = priceData.deviceName || 'Not selected';
        const service = priceData.actionName || 'Not selected';

        summaryDisplay.innerHTML = `
          <div style="margin-top: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8f9fa;">
            <h3 style="margin-top: 0; font-size: 18px;">Repair Summary</h3>
            <p><strong>Manufacturer:</strong> ${manufacturer}</p>
            <p><strong>Device:</strong> ${device}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Price:</strong> €${priceData.price}</p>
          </div>
        `;
      }
    },
    // Use a very short mock delay to make the preselection work more reliably
    mockDelay: 50,
  });

  // Add form to container
  container.appendChild(repairForm.getElement());

  // Add summary display area
  const summaryDisplay = document.createElement('div');
  container.appendChild(summaryDisplay);

  // Preselect data after a short delay
  setTimeout(() => {
    // Find and select the first manufacturer (Apple)
    const manufacturerSelect = document.getElementById('manufacturer');
    if (manufacturerSelect) {
      manufacturerSelect.value = '1'; // Apple
      manufacturerSelect.dispatchEvent(new Event('change', { bubbles: true }));

      // Then select iPhone 13 after devices load
      setTimeout(() => {
        const deviceSelect = document.getElementById('device');
        if (deviceSelect) {
          deviceSelect.value = '3'; // iPhone 13
          deviceSelect.dispatchEvent(new Event('change', { bubbles: true }));

          // Then select Display Reparatur
          setTimeout(() => {
            const actionSelect = document.getElementById('action');
            if (actionSelect) {
              actionSelect.value = '7'; // Display Reparatur
              actionSelect.dispatchEvent(
                new Event('change', { bubbles: true })
              );
            }
          }, 200);
        }
      }, 200);
    }
  }, 100);

  return container;
};

export const WithCustomTheme = () => {
  // Create container with custom styles
  const container = document.createElement('div');

  // Add custom styles
  const style = document.createElement('style');
  style.textContent = `
    .custom-theme .phone-repair-form {
      background-color: #f8f9fa;
      border: 2px solid #007bff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .custom-theme .form-group__label {
      color: #007bff;
      font-weight: bold;
    }
    
    .custom-theme .price-display {
      background-color: #e6f3ff;
      border: 1px solid #007bff;
    }
    
    .custom-theme .price-display__value {
      color: #007bff;
      font-weight: bold;
      font-size: 18px;
    }
  `;

  container.appendChild(style);

  // Add theme container
  const themeContainer = document.createElement('div');
  themeContainer.className = 'custom-theme';
  container.appendChild(themeContainer);

  // Create form component with factory
  const repairForm = PhoneRepairFormFactory.createWithMockData({
    mockData: mockPhoneRepairData,
    onPriceChange: (priceData) => console.log('Price selected:', priceData),
  });

  themeContainer.appendChild(repairForm.getElement());

  return container;
};

export const WithErrorHandling = () => {
  // Create a custom mock service that simulates errors
  const errorMockService = {
    fetchManufacturers: () => {
      return Promise.resolve(mockPhoneRepairData.manufacturers);
    },
    fetchDevices: (manufacturerId) => {
      // Simulate error for Huawei (id: 3)
      if (manufacturerId === '3') {
        return Promise.reject(new Error('Server error when fetching devices'));
      }

      const manufacturer = mockPhoneRepairData.manufacturers.find(
        (m) => m.id.toString() === manufacturerId.toString()
      );
      return Promise.resolve(manufacturer?.devices || []);
    },
    fetchActions: (deviceId) => {
      let foundDevice = null;
      for (const manufacturer of mockPhoneRepairData.manufacturers) {
        foundDevice = manufacturer.devices.find(
          (d) => d.id.toString() === deviceId.toString()
        );
        if (foundDevice) break;
      }
      return Promise.resolve(foundDevice?.actions || []);
    },
    fetchPrice: (actionId) => {
      let foundPrice = null;

      searchLoop: for (const manufacturer of mockPhoneRepairData.manufacturers) {
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
              break searchLoop;
            }
          }
        }
      }

      return Promise.resolve(foundPrice || { price: 0 });
    },
  };

  // Create container with instructions
  const container = document.createElement('div');

  const instructions = document.createElement('div');
  instructions.innerHTML = `
    <div style="margin-bottom: 20px; padding: 10px; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px;">
      <p><strong>Test Instructions:</strong></p>
      <p>Select "Huawei" as manufacturer to see error handling in action.</p>
    </div>
  `;

  container.appendChild(instructions);

  // Create form component using the custom mock service
  const repairForm = PhoneRepairFormFactory.createWithMockService({
    service: errorMockService,
    onPriceChange: (priceData) => console.log('Price selected:', priceData),
  });

  container.appendChild(repairForm.getElement());

  return container;
};

export const WithCustomLabels = () => {
  return PhoneRepairFormFactory.createWithMockData({
    mockData: mockPhoneRepairData,
    labels: {
      title: 'Request a Repair',
      manufacturerStep: 'Brand',
      deviceStep: 'Device',
      serviceStep: 'Repair Type',
      manufacturerLabel: 'Select Brand:',
      deviceLabel: 'Select Device:',
      serviceLabel: 'Select Repair:',
      priceLabel: 'Your estimated price:',
      initialPriceText: 'Please complete all selections to see price',
      loadingPriceText: 'Loading price...',
      usedPhoneText: 'Looking for a better deal? Try our used phones!',
      scheduleButtonText: 'Schedule Repair Now',
    },
    onPriceChange: (priceData) => console.log('Price selected:', priceData),
  });
};
