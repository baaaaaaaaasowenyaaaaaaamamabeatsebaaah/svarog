// src/components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js
import UsedPhonePriceForm from './UsedPhonePriceForm.js';
import createUsedPhonePriceFormContainer from './UsedPhonePriceFormContainer.js';
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
          'Enhanced form component for getting a price estimate for selling a used phone with async loading, error handling, and optimized user experience.',
      },
    },
  },
  argTypes: {
    onManufacturerChange: { action: 'manufacturerChanged' },
    onDeviceChange: { action: 'deviceChanged' },
    onConditionChange: { action: 'conditionChanged' },
    onSubmit: { action: 'formSubmitted' },
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
      if (url === '/api/manufacturers') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPhoneBuybackData.manufacturers),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      });
    };
  }
};

// Helper to create a mock service for our form
const createMockService = (delay = 300) => {
  return {
    fetchManufacturers: () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockPhoneBuybackData.manufacturers), delay);
      });
    },
    fetchDevices: (manufacturerId) => {
      return new Promise((resolve) => {
        const manufacturer = mockPhoneBuybackData.manufacturers.find(
          (m) => m.id.toString() === manufacturerId.toString()
        );
        setTimeout(() => resolve(manufacturer?.devices || []), delay);
      });
    },
    fetchConditions: (deviceId) => {
      let foundDevice = null;
      for (const manufacturer of mockPhoneBuybackData.manufacturers) {
        foundDevice = manufacturer.devices.find(
          (d) => d.id.toString() === deviceId.toString()
        );
        if (foundDevice) break;
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(foundDevice?.conditions || []), delay);
      });
    },
    fetchPrice: (conditionId) => {
      let foundPrice = null;

      searchLoop: for (const manufacturer of mockPhoneBuybackData.manufacturers) {
        for (const device of manufacturer.devices) {
          for (const condition of device.conditions || []) {
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

      return new Promise((resolve) => {
        setTimeout(() => resolve(foundPrice || { price: 0 }), delay);
      });
    },
  };
};

// Helper to create a form with standardized props
const createForm = (props = {}) => {
  return UsedPhonePriceForm({
    manufacturers: [],
    devices: [],
    conditions: [],
    onManufacturerChange: props.onManufacturerChange || (() => {}),
    onDeviceChange: props.onDeviceChange || (() => {}),
    onConditionChange: props.onConditionChange || (() => {}),
    onSubmit: props.onSubmit || (() => {}),
    ...props,
  });
};

export const Default = (args) => {
  setupMocks();
  return createForm({
    manufacturers: mockPhoneBuybackData.manufacturers,
    ...args,
  }).getElement();
};

export const WithoutSteps = (args) => {
  setupMocks();
  return createForm({
    manufacturers: mockPhoneBuybackData.manufacturers,
    showStepsIndicator: false,
    ...args,
  }).getElement();
};

export const WithPreselectedData = (args) => {
  setupMocks();

  // Create container with instructions
  const container = document.createElement('div');
  container.style.maxWidth = '800px';

  // Add description
  const description = document.createElement('p');
  description.textContent = 'Form with complete selection and price estimate';
  container.appendChild(description);

  // Create form component
  const form = createForm({
    ...args,
    manufacturers: mockPhoneBuybackData.manufacturers,
    selectedManufacturer: '1', // Apple
    devices: mockPhoneBuybackData.manufacturers[0].devices,
    selectedDevice: '1', // iPhone 13
    conditions: mockPhoneBuybackData.manufacturers[0].devices[0].conditions,
    selectedCondition: '2', // Good condition
    currentPrice: {
      price: 39900,
      deviceName: 'iPhone 13',
      conditionName: 'Good',
      manufacturerName: 'Apple',
    },
    onSubmit: (formData) => {
      const priceFormatted = (formData.price / 100).toFixed(2);
      alert(
        `Sale submitted: ${formData.deviceName} (${formData.conditionName}) for €${priceFormatted}`
      );
    },
  });

  container.appendChild(form.getElement());

  return container;
};

export const WithCustomTheme = (args) => {
  setupMocks();

  // Create container with custom styles
  const container = document.createElement('div');

  // Add custom styles
  const style = document.createElement('style');
  style.textContent = `
    .custom-theme .used-phone-price-form {
      background-color: #f1f5f9;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .custom-theme .price-display {
      background-color: #dbeafe;
      border: 1px solid #3b82f6;
    }
    
    .custom-theme .price-display__value {
      color: #1e40af;
      font-weight: bold;
      font-size: 24px;
    }
    
    .custom-theme .condition-option__label {
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
    }
    
    .custom-theme .condition-option__label:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
    }
    
    .custom-theme .condition-option--selected .condition-option__label {
      border-color: #3b82f6;
      background-color: #dbeafe;
    }
    
    .custom-theme .btn {
      background-color: #3b82f6;
      border-radius: 4px;
      padding: 8px 16px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .custom-theme .btn:hover:not(:disabled) {
      background-color: #1d4ed8;
      transform: translateY(-1px);
    }
  `;

  container.appendChild(style);

  // Add theme container
  const themeContainer = document.createElement('div');
  themeContainer.className = 'custom-theme';
  container.appendChild(themeContainer);

  // Create form
  const form = createForm({
    ...args,
    manufacturers: mockPhoneBuybackData.manufacturers,
  });

  themeContainer.appendChild(form.getElement());

  return container;
};

export const WithErrorHandling = (args) => {
  // Create container with instructions
  const container = document.createElement('div');

  const instructions = document.createElement('div');
  instructions.innerHTML = `
    <div style="margin-bottom: 20px; padding: 10px; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px;">
      <p><strong>Error Handling Demo:</strong></p>
      <p>This story demonstrates error handling capabilities of the component.</p>
    </div>
  `;

  container.appendChild(instructions);

  // Create form with error states
  const form = createForm({
    ...args,
    manufacturers: mockPhoneBuybackData.manufacturers,
    devices: [],
    error: {
      devices: 'Failed to load devices for this manufacturer',
      price: 'Unable to calculate price for this selection',
    },
    hasError: true,
  });

  container.appendChild(form.getElement());

  return container;
};

export const WithCustomLabels = (args) => {
  setupMocks();

  // Create form with custom labels
  const form = createForm({
    ...args,
    manufacturers: mockPhoneBuybackData.manufacturers,
    labels: {
      manufacturerStep: 'Brand',
      deviceStep: 'Device',
      conditionStep: 'Condition',
      manufacturerPlaceholder: 'Select brand',
      devicePlaceholder: 'Select device',
      initialPriceText: 'Complete all selections to see your buyback offer',
      priceLabel: 'Our Buyback Offer:',
      submitButtonText: 'Sell Device',
      conditionNewLabel: 'Like New',
      conditionGoodLabel: 'Good',
      conditionFairLabel: 'Fair',
      conditionPoorLabel: 'Damaged',
    },
  });

  return form.getElement();
};

export const WithLoading = (args) => {
  // Create container
  const container = document.createElement('div');
  container.style.maxWidth = '800px';

  // Add description
  const description = document.createElement('p');
  description.textContent = 'Form in loading state';
  container.appendChild(description);

  // Create the form with loading state
  const form = createForm({
    ...args,
    manufacturers: mockPhoneBuybackData.manufacturers,
    selectedManufacturer: '1',
    devices: mockPhoneBuybackData.manufacturers[0].devices,
    selectedDevice: '2',
    conditions: mockPhoneBuybackData.manufacturers[0].devices[1].conditions,
    loading: {
      price: true,
      conditions: true,
    },
    priceDisplayText: 'Loading price...',
  });

  container.appendChild(form.getElement());
  return container;
};

export const Interactive = () => {
  // Create container for demonstration
  const container = document.createElement('div');
  container.style.maxWidth = '800px';

  // Add description
  const description = document.createElement('p');
  description.textContent =
    'Interactive form using UsedPhonePriceFormContainer - selections will automatically load options for the next step';
  container.appendChild(description);

  // Create status display
  const statusDiv = document.createElement('div');
  statusDiv.id = 'interactive-status';
  statusDiv.style.cssText = `
    background: #e8f4f8;
    border: 1px solid #bee5eb;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 4px;
  `;
  statusDiv.innerHTML =
    '<strong>Status:</strong> Ready - Select a manufacturer to begin';
  container.appendChild(statusDiv);

  const updateStatus = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    statusDiv.innerHTML = `<strong>Status [${timestamp}]:</strong> ${message}`;
  };

  // Create mock service with enhanced logging
  const mockService = createMockService(300);

  try {
    // Create the container which will handle all the logic
    const formContainer = createUsedPhonePriceFormContainer({
      service: mockService,
      onPriceChange: (priceData) => {
        const priceFormatted = priceData
          ? `€${(priceData.price / 100).toFixed(2)}`
          : 'No price';
        updateStatus(`Price updated: ${priceFormatted}`);
      },
      onSubmit: (formData) => {
        updateStatus('Form submitted successfully!');

        // Show confirmation with null safety
        if (formData.price) {
          const priceFormatted = (formData.price / 100).toFixed(2);
          alert(
            `Sale submitted!\nDevice: ${formData.deviceName}\nCondition: ${formData.conditionName}\nPrice: €${priceFormatted}`
          );
        } else {
          alert(
            `Sale submitted!\nDevice: ${formData.deviceName}\nCondition: ${formData.conditionName}\nPrice: Not available`
          );
        }
      },
    });

    container.appendChild(formContainer.getElement());

    updateStatus(
      'Container ready - manufacturer list should load automatically'
    );
  } catch (error) {
    updateStatus(`Error: Failed to create container - ${error.message}`);

    // Show error in the container
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
    `;
    errorDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
    container.appendChild(errorDiv);
  }

  return container;
};
