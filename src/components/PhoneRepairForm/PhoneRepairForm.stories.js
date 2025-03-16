// src/components/PhoneRepairForm/PhoneRepairForm.stories.js
import PhoneRepairForm from './PhoneRepairForm.js';
import {
  mockPhoneRepairData,
  setupPhoneRepairMocks,
} from '../../../__mocks__/phoneRepairData.js';

export default {
  title: 'Components/PhoneRepairForm',
  component: PhoneRepairForm,
  parameters: {
    docs: {
      description: {
        component:
          'Form component for selecting a phone repair service and viewing the price.',
      },
    },
  },
};

// Helper function to setup mock data for all stories
const setupMocks = () => {
  setupPhoneRepairMocks();
};

export const Default = () => {
  setupMocks();

  return new PhoneRepairForm({
    useMockData: true,
    onPriceChange: (priceData) => console.log('Price selected:', priceData),
  });
};

export const WithPreselectedData = () => {
  setupMocks();

  // Create component container
  const container = document.createElement('div');
  container.style.maxWidth = '600px';

  // Create form component
  const repairForm = new PhoneRepairForm({
    useMockData: true,
    onPriceChange: (priceData) => {
      console.log('Price selected:', priceData);

      // Update summary display
      if (summaryDisplay) {
        const manufacturer =
          document.getElementById('manufacturer')?.options[
            document.getElementById('manufacturer')?.selectedIndex
          ]?.text;
        const device =
          document.getElementById('device')?.options[
            document.getElementById('device')?.selectedIndex
          ]?.text;
        const action =
          document.getElementById('action')?.options[
            document.getElementById('action')?.selectedIndex
          ]?.text;

        summaryDisplay.innerHTML = `
          <div style="margin-top: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8f9fa;">
            <h3 style="margin-top: 0; font-size: 18px;">Repair Summary</h3>
            <p><strong>Manufacturer:</strong> ${manufacturer || 'Not selected'}</p>
            <p><strong>Device:</strong> ${device || 'Not selected'}</p>
            <p><strong>Service:</strong> ${action || 'Not selected'}</p>
            <p><strong>Price:</strong> €${priceData.price}</p>
          </div>
        `;
      }
    },
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
          }, 400);
        }
      }, 400);
    }
  }, 300);

  return container;
};

export const WithCustomTheme = () => {
  setupMocks();

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
    
    .custom-theme .phone-repair-form__price-container {
      background-color: #e6f3ff;
      border: 1px solid #007bff;
    }
    
    .custom-theme .phone-repair-form__price-value {
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

  // Create form component
  const repairForm = new PhoneRepairForm({
    useMockData: true,
    onPriceChange: (priceData) => console.log('Price selected:', priceData),
  });

  themeContainer.appendChild(repairForm.getElement());

  return container;
};

export const WithErrorHandling = () => {
  // Setup mock with deliberate errors
  global.fetch = (url) => {
    if (url === '/api/manufacturers') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPhoneRepairData.manufacturers),
      });
    }

    // Simulate error for any device fetch
    const deviceMatch = url.match(/\/api\/manufacturers\/(\d+)\/devices/);
    if (deviceMatch && deviceMatch[1] === '3') {
      // Error only for Huawei
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      });
    } else if (deviceMatch) {
      const manufacturerId = deviceMatch[1];
      const manufacturer = mockPhoneRepairData.manufacturers.find(
        (m) => m.id.toString() === manufacturerId
      );
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(manufacturer ? manufacturer.devices : []),
      });
    }

    // Default response
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
    });
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

  // Create form component
  const repairForm = new PhoneRepairForm({
    useMockData: false, // Use our custom fetch mock above
    onPriceChange: (priceData) => console.log('Price selected:', priceData),
  });

  container.appendChild(repairForm.getElement());

  return container;
};
