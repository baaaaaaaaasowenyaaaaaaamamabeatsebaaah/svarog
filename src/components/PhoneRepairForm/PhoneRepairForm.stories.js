// src/components/PhoneRepairForm/PhoneRepairForm.stories.js
import PhoneRepairForm from './PhoneRepairForm.js';
import PhoneRepairFormContainer from './PhoneRepairFormContainer.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

export default {
  title: 'Components/PhoneRepairForm',
  parameters: {
    docs: {
      description: {
        component:
          'Enhanced form component for selecting a phone repair service with async loading, error handling, and optimized user experience.',
      },
    },
  },
};

// Helper to create a mock service for our form
const createMockService = (delay = 500) => {
  return {
    fetchManufacturers: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockPhoneRepairData.manufacturers);
        }, delay);
      });
    },
    fetchDevices: (manufacturerId) => {
      return new Promise((resolve) => {
        const manufacturer = mockPhoneRepairData.manufacturers.find(
          (m) => m.id.toString() === manufacturerId.toString()
        );
        const devices = manufacturer?.devices || [];
        setTimeout(() => {
          resolve(devices);
        }, delay);
      });
    },
    fetchActions: (deviceId) => {
      let foundDevice = null;
      for (const manufacturer of mockPhoneRepairData.manufacturers) {
        foundDevice = manufacturer.devices.find(
          (d) => d.id.toString() === deviceId.toString()
        );
        if (foundDevice) break;
      }
      const actions = foundDevice?.actions || [];
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(actions);
        }, delay);
      });
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

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(foundPrice || { price: 0 });
        }, delay);
      });
    },
  };
};

// Helper to create a PhoneRepairForm with mock data
const createForm = (props = {}) => {
  // Handle legacy props for backwards compatibility in stories
  const standardizedProps = { ...props };

  if (props.usedPhoneUrl && !props.usedPhoneHref) {
    standardizedProps.usedPhoneHref = props.usedPhoneUrl;
    delete standardizedProps.usedPhoneUrl;
  }

  if (props.loading && !props.loadingStates) {
    standardizedProps.loadingStates = props.loading;
    delete standardizedProps.loading;
  }

  return PhoneRepairForm({
    manufacturers: mockPhoneRepairData.manufacturers,
    devices: [],
    actions: [],
    onManufacturerChange: standardizedProps.onManufacturerChange || (() => {}),
    onDeviceChange: standardizedProps.onDeviceChange || (() => {}),
    onActionChange: standardizedProps.onActionChange || (() => {}),
    onScheduleClick: standardizedProps.onScheduleClick || (() => {}),
    ...standardizedProps,
  });
};

export const Default = (args) => {
  return createForm(args).getElement();
};

export const WithPreselectedManufacturer = (args) => {
  // Create container with instructions
  const container = document.createElement('div');
  container.style.maxWidth = '800px';

  // Add description
  const description = document.createElement('p');
  description.textContent = 'Form with pre-selected manufacturer (Apple)';
  container.appendChild(description);

  // Create the form
  const form = createForm({
    ...args,
    selectedManufacturer: '1', // Apple
    devices: mockPhoneRepairData.manufacturers[0].devices,
  });

  container.appendChild(form.getElement());
  return container;
};

export const WithFullSelection = (args) => {
  // Create container with instructions
  const container = document.createElement('div');
  container.style.maxWidth = '800px';

  // Add description
  const description = document.createElement('p');
  description.textContent = 'Form with complete selection and price';
  container.appendChild(description);

  // Create the form with all selections made
  const form = createForm({
    ...args,
    selectedManufacturer: '1', // Apple
    devices: mockPhoneRepairData.manufacturers[0].devices,
    selectedDevice: '3', // iPhone 13
    actions: mockPhoneRepairData.manufacturers[0].devices[2].actions, // iPhone 13 actions
    selectedAction: '7', // Display Repair
    currentPrice: {
      price: 26900,
      deviceName: 'iPhone 13',
      actionName: 'Display Reparatur',
      manufacturerName: 'Apple',
    },
  });

  container.appendChild(form.getElement());
  return container;
};

export const WithCustomLabels = (args) => {
  // Create container
  const container = document.createElement('div');
  container.style.maxWidth = '800px';

  // Add description
  const description = document.createElement('p');
  description.textContent = 'Form with custom labels in English';
  container.appendChild(description);

  // Custom labels
  const customLabels = {
    manufacturerStep: 'Brand',
    deviceStep: 'Device',
    serviceStep: 'Repair Type',
    manufacturerPlaceholder: 'Select Brand:',
    devicePlaceholder: 'First select a brand',
    servicePlaceholder: 'First select a device',
    priceLabel: 'Your estimated price:',
    initialPriceText: 'Please complete all selections to see price',
    loadingPriceText: 'Loading price...',
    usedPhoneText: 'Looking for a better deal? Try our used phones!',
    scheduleButtonText: 'Schedule Repair Now',
  };

  // Create the form with custom labels
  const form = createForm({
    ...args,
    labels: customLabels,
  });

  container.appendChild(form.getElement());
  return container;
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
    manufacturers: mockPhoneRepairData.manufacturers,
    selectedManufacturer: '1',
    devices: mockPhoneRepairData.manufacturers[0].devices,
    selectedDevice: '2',
    actions: mockPhoneRepairData.manufacturers[0].devices[1].actions,
    loadingStates: {
      price: true,
    },
    priceDisplayText: 'Loading price...',
  });

  container.appendChild(form.getElement());
  return container;
};

export const WithError = (args) => {
  // Create container
  const container = document.createElement('div');
  container.style.maxWidth = '800px';

  // Add description
  const description = document.createElement('p');
  description.textContent = 'Form with error state';
  container.appendChild(description);

  // Create the form with error state
  const form = createForm({
    ...args,
    manufacturers: mockPhoneRepairData.manufacturers,
    selectedManufacturer: '1',
    devices: mockPhoneRepairData.manufacturers[0].devices,
    selectedDevice: '2',
    actions: mockPhoneRepairData.manufacturers[0].devices[1].actions,
    error: {
      price: 'Failed to load price. Please try again.',
    },
    priceDisplayText: 'Failed to load price. Please try again.',
  });

  container.appendChild(form.getElement());
  return container;
};

export const Interactive = (args) => {
  // Create container for demonstration
  const container = document.createElement('div');
  container.style.maxWidth = '800px';

  // Add description
  const description = document.createElement('p');
  description.textContent =
    'Interactive form using PhoneRepairFormContainer - selections will automatically load options for the next step';
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
    const formContainer = PhoneRepairFormContainer({
      service: mockService,
      onPriceChange: (priceData) => {
        const priceFormatted = priceData
          ? `€${(priceData.price / 100).toFixed(2)}`
          : 'No price';
        updateStatus(`Price updated: ${priceFormatted}`);
      },
      onScheduleClick: (repairInfo) => {
        updateStatus('Repair scheduled successfully!');

        // Show confirmation with null safety
        if (repairInfo.price && repairInfo.price.price) {
          const priceFormatted = (repairInfo.price.price / 100).toFixed(2);
          alert(
            `Repair scheduled!\nDevice: ${repairInfo.device.name}\nService: ${repairInfo.service.name}\nPrice: €${priceFormatted}`
          );
        } else {
          alert(
            `Repair scheduled!\nDevice: ${repairInfo.device.name}\nService: ${repairInfo.service.name}\nPrice: Not available`
          );
        }
      },
      ...args,
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
