// src/components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js
import UsedPhonePriceForm from './UsedPhonePriceForm.js';
import {
  mockPhoneBuybackData,
  setupPhoneBuybackMocks,
} from '../../../__mocks__/phoneBuybackData.js';

export default {
  title: 'Components/UsedPhonePriceForm',
  component: UsedPhonePriceForm,
  parameters: {
    docs: {
      description: {
        component:
          'Form component for estimating the value of a used phone for selling.',
      },
    },
  },
};

// Helper function to setup mock data for all stories
const setupMocks = () => {
  try {
    setupPhoneBuybackMocks();
  } catch (error) {
    console.warn('Error setting up mocks:', error.message);
    // Provide fallback mock directly
    window.fetch = (url) => {
      if (url === '/api/buyback/manufacturers') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPhoneBuybackData.manufacturers),
        });
      }
      // Add other mocks as needed
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      });
    };
  }
};

export const Default = () => {
  setupMocks();

  return new UsedPhonePriceForm({
    useMockData: true,
    onPriceCalculated: (priceData) =>
      console.log('Price calculated:', priceData),
    onSubmit: (submissionData) =>
      console.log('Form submitted with data:', submissionData),
  });
};

export const WithPreselectedData = () => {
  setupMocks();

  // Create component container
  const container = document.createElement('div');
  container.style.maxWidth = '600px';

  // Create form component
  const buybackForm = new UsedPhonePriceForm({
    useMockData: true,
    onPriceCalculated: (priceData) => {
      console.log('Price calculated:', priceData);

      // Update summary display
      if (summaryDisplay) {
        summaryDisplay.innerHTML = `
          <div style="margin-top: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8f9fa;">
            <h3 style="margin-top: 0; font-size: 18px;">Sell Summary</h3>
            <p><strong>Brand:</strong> ${priceData.manufacturerName}</p>
            <p><strong>Model:</strong> ${priceData.deviceName}</p>
            <p><strong>Condition:</strong> ${priceData.conditionName}</p>
            <p><strong>Offer Price:</strong> €${priceData.price}</p>
            <button id="confirmSale" style="background-color: #48bb78; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Confirm Sale</button>
          </div>
        `;

        // Add event listener to the confirm button
        setTimeout(() => {
          const confirmButton = document.getElementById('confirmSale');
          if (confirmButton) {
            confirmButton.addEventListener('click', () => {
              alert(
                'Thank you for selling your phone to us! We will contact you soon with shipping details.'
              );
            });
          }
        }, 0);
      }
    },
    onSubmit: (submissionData) => {
      console.log('Form submitted with data:', submissionData);
    },
  });

  // Add form to container
  container.appendChild(buybackForm.getElement());

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

      // Then select iPhone 15 Pro Max after devices load
      setTimeout(() => {
        const deviceSelect = document.getElementById('device');
        if (deviceSelect) {
          deviceSelect.value = '1'; // iPhone 15 Pro Max
          deviceSelect.dispatchEvent(new Event('change', { bubbles: true }));

          // Then select Good condition
          setTimeout(() => {
            const conditionCards = document.querySelectorAll('.condition-card');
            conditionCards.forEach((card) => {
              if (card.getAttribute('data-condition-id') === '2') {
                // Good condition
                card.click();
              }
            });
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
    .custom-theme .used-phone-form {
      background-color: #f1f5f9;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .custom-theme .form-group__label {
      color: #3b82f6;
      font-weight: bold;
    }
    
    .custom-theme .used-phone-form__price-container {
      background-color: #dbeafe;
      border: 1px solid #3b82f6;
    }
    
    .custom-theme .used-phone-form__price-value {
      color: #1e40af;
      font-weight: bold;
      font-size: 24px;
    }
    
    .custom-theme .condition-card {
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
    }
    
    .custom-theme .condition-card:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
    }
    
    .custom-theme .condition-card.selected {
      border-color: #3b82f6;
      background-color: #dbeafe;
    }
    
    .custom-theme .used-phone-form__submit-button {
      background-color: #3b82f6;
      border-radius: 4px;
      padding: 8px 16px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .custom-theme .used-phone-form__submit-button:hover {
      background-color: #1d4ed8;
      transform: translateY(-1px);
    }
  `;

  container.appendChild(style);

  // Add theme container
  const themeContainer = document.createElement('div');
  themeContainer.className = 'custom-theme';
  container.appendChild(themeContainer);

  // Create form component
  const buybackForm = new UsedPhonePriceForm({
    useMockData: true,
    onPriceCalculated: (priceData) =>
      console.log('Price calculated:', priceData),
    onSubmit: (submissionData) =>
      console.log('Form submitted with data:', submissionData),
  });

  themeContainer.appendChild(buybackForm.getElement());

  return container;
};

export const WithErrorHandling = () => {
  // Setup mock with deliberate errors
  window.fetch = (url) => {
    if (url === '/api/buyback/manufacturers') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPhoneBuybackData.manufacturers),
      });
    }

    // Simulate error for any device fetch for Google
    const deviceMatch = url.match(
      /\/api\/buyback\/manufacturers\/(\d+)\/devices/
    );
    if (deviceMatch && deviceMatch[1] === '3') {
      // Error only for Google
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      });
    } else if (deviceMatch) {
      const manufacturerId = deviceMatch[1];
      const manufacturer = mockPhoneBuybackData.manufacturers.find(
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
      <p>Select "Google" as brand to see error handling in action.</p>
    </div>
  `;

  container.appendChild(instructions);

  // Create form component
  const buybackForm = new UsedPhonePriceForm({
    useMockData: false, // Use our custom fetch mock above
    onPriceCalculated: (priceData) =>
      console.log('Price calculated:', priceData),
    onSubmit: (submissionData) =>
      console.log('Form submitted with data:', submissionData),
  });

  container.appendChild(buybackForm.getElement());

  return container;
};
