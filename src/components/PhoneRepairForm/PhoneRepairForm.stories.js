// src/components/PhoneRepairForm/PhoneRepairForm.stories.js
import PhoneRepairForm from './PhoneRepairForm.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

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
  argTypes: {
    onManufacturerChange: { action: 'manufacturerChanged' },
    onDeviceChange: { action: 'deviceChanged' },
    onActionChange: { action: 'actionChanged' },
    onScheduleClick: { action: 'scheduleClicked' },
  },
};

// Helper to create a mock service for our form
const createMockService = (delay = 500) => {
  return {
    fetchManufacturers: () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockPhoneRepairData.manufacturers), delay);
      });
    },
    fetchDevices: (manufacturerId) => {
      return new Promise((resolve) => {
        const manufacturer = mockPhoneRepairData.manufacturers.find(
          (m) => m.id.toString() === manufacturerId.toString()
        );
        setTimeout(() => resolve(manufacturer?.devices || []), delay);
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
      return new Promise((resolve) => {
        setTimeout(() => resolve(foundDevice?.actions || []), delay);
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
        setTimeout(() => resolve(foundPrice || { price: 0 }), delay);
      });
    },
  };
};

// Helper to create a PhoneRepairForm with mock data
const createForm = (props = {}) => {
  const form = PhoneRepairForm({
    manufacturers: mockPhoneRepairData.manufacturers,
    devices: [],
    actions: [],
    onManufacturerChange: props.onManufacturerChange || (() => {}),
    onDeviceChange: props.onDeviceChange || (() => {}),
    onActionChange: props.onActionChange || (() => {}),
    onScheduleClick: props.onScheduleClick || (() => {}),
    ...props,
  });

  return form;
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
    selectedDevice: '2', // iPhone 13
    actions: mockPhoneRepairData.manufacturers[0].devices[0].actions,
    selectedAction: '5', // Display Repair
    currentPrice: {
      price: 14900,
      deviceName: 'iPhone 13',
      actionName: 'Display Repair',
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
    actions: mockPhoneRepairData.manufacturers[0].devices[0].actions,
    loading: {
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
    actions: mockPhoneRepairData.manufacturers[0].devices[0].actions,
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
    'Interactive form - selections will load options for the next step';
  container.appendChild(description);

  // Create mock service
  const mockService = createMockService(300);

  // Create the form
  const form = createForm({
    ...args,
    onManufacturerChange: async (manufacturerId) => {
      // Show loading state
      form.setLoading({ devices: true });

      try {
        // Fetch devices for this manufacturer
        const devices = await mockService.fetchDevices(manufacturerId);
        form.setDevices(devices);
      } catch (error) {
        form.setErrors({ devices: error.message });
      }
    },
    onDeviceChange: async (deviceId) => {
      // Show loading state
      form.setLoading({ actions: true });

      try {
        // Fetch actions for this device
        const actions = await mockService.fetchActions(deviceId);
        form.setActions(actions);
      } catch (error) {
        form.setErrors({ actions: error.message });
      }
    },
    onActionChange: async (actionId) => {
      // Show loading state
      form.setLoading({ price: true });
      form.setState({ priceDisplayText: 'Loading price...' });

      try {
        // Fetch price for this action
        const price = await mockService.fetchPrice(actionId);
        form.setPrice(price);
      } catch (error) {
        form.setErrors({ price: error.message });
        form.setState({ priceDisplayText: 'Error loading price.' });
      }
    },
    onScheduleClick: (repairInfo) => {
      // Show confirmation
      alert(
        `Repair scheduled!\nDevice: ${repairInfo.device.name}\nService: ${repairInfo.service.name}\nPrice: €${(repairInfo.price.price / 100).toFixed(2)}`
      );
    },
  });

  container.appendChild(form.getElement());
  return container;
};
