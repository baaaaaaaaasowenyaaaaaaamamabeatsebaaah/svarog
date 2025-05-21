// src/components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js
import UsedPhonePriceForm from './UsedPhonePriceForm.js';
import { createUsedPhonePriceFormContainer } from './index.js';
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
          'Formular-Komponente zur Wertermittlung eines gebrauchten Handys für den Verkauf.',
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
    console.warn('Fehler beim Einrichten der Mocks:', error.message);
    // Provide fallback mock directly
    window.fetch = (url) => {
      if (url === '/api/manufacturers') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPhoneBuybackData.manufacturers),
        });
      }
      // Add other mocks as needed
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Nicht gefunden' }),
      });
    };
  }
};

// Helper to create a mock service for our form
const createMockService = (delay = 500) => {
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
    onManufacturerChange: props.onManufacturerChange || (() => {}),
    onDeviceChange: props.onDeviceChange || (() => {}),
    onConditionChange: props.onConditionChange || (() => {}),
    onSubmit: props.onSubmit || (() => {}),
    ...props,
  });
};

export const Default = (args) => {
  setupMocks();
  return createForm(args).getElement();
};

export const WithoutSteps = (args) => {
  setupMocks();
  return createForm({
    ...args,
    showStepsIndicator: false,
  }).getElement();
};

export const WithPreselectedData = (args) => {
  setupMocks();

  // Create container with instructions
  const container = document.createElement('div');
  container.style.maxWidth = '600px';

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
      price: 399,
      deviceName: 'iPhone 13',
      conditionName: 'Gut',
      manufacturerName: 'Apple',
    },
    onPriceChange: (priceData) => {
      console.log('Preis ausgewählt:', priceData);
    },
    onSubmit: (formData) => {
      alert(
        `Verkauf eingereicht: ${formData.deviceName} (${formData.conditionName}) für €${formData.price}`
      );
    },
  });

  container.appendChild(form.getElement());

  // Add summary display
  const summaryDisplay = document.createElement('div');
  summaryDisplay.innerHTML = `
    <div style="margin-top: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8f9fa;">
      <h3 style="margin-top: 0; font-size: 18px;">Verkaufszusammenfassung</h3>
      <p><strong>Marke:</strong> Apple</p>
      <p><strong>Modell:</strong> iPhone 13</p>
      <p><strong>Zustand:</strong> Gut</p>
      <p><strong>Angebotspreis:</strong> €399</p>
      <button id="confirmSale" style="background-color: #48bb78; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Verkauf bestätigen</button>
    </div>
  `;
  container.appendChild(summaryDisplay);

  // Add event listener to confirm button
  setTimeout(() => {
    const confirmButton = document.getElementById('confirmSale');
    if (confirmButton) {
      confirmButton.addEventListener('click', () => {
        alert(
          'Vielen Dank für den Verkauf deines Handys! Wir werden dich in Kürze mit Versanddetails kontaktieren.'
        );
      });
    }
  }, 0);

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
    
    .custom-theme .form-group__label {
      color: #3b82f6;
      font-weight: bold;
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
    
    .custom-theme .condition-option__description {
      color: #4b5563;
      font-style: italic;
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
      <p><strong>Testanleitung:</strong></p>
      <p>Diese Story demonstriert die Fehlerbehandlung der Komponente.</p>
    </div>
  `;

  container.appendChild(instructions);

  // Create form with error states
  const form = createForm({
    ...args,
    manufacturers: mockPhoneBuybackData.manufacturers,
    devices: [],
    error: { devices: 'Fehler beim Laden der Geräte' },
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
    labels: {
      title: 'Verkaufe dein Gerät',
      manufacturerStep: 'Marke',
      deviceStep: 'Gerät',
      conditionStep: 'Zustand',
      manufacturerPlaceholder: 'Marke auswählen',
      devicePlaceholder: 'Gerät auswählen',
      initialPriceText: 'Fülle alle Auswahlfelder aus, um ein Angebot zu sehen',
      priceLabel: 'Unser Angebot:',
      submitButtonText: 'Verkaufen',
      conditionNewLabel: 'Wie neu',
      conditionGoodLabel: 'Gut',
      conditionFairLabel: 'Normal',
      conditionPoorLabel: 'Mit Mängeln',
    },
  });

  return form.getElement();
};

export const Interactive = () => {
  // Create container for demonstration
  const container = document.createElement('div');
  container.style.maxWidth = '600px';

  // Add description
  const description = document.createElement('p');
  description.textContent =
    'Interaktives Formular - Auswahl lädt jeweils die nächste Ebene';
  container.appendChild(description);

  // Create mock service
  const mockService = createMockService(300);

  // Create the UsedPhonePriceFormContainer
  const formContainer = createUsedPhonePriceFormContainer({
    service: mockService,
    onPriceChange: (priceData) => {
      console.log('Preis aktualisiert:', priceData);

      // Update summary if it exists
      const summary = document.getElementById('price-summary');
      if (summary) {
        summary.innerHTML = `
          <div style="margin-top: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8f9fa;">
            <h3 style="margin-top: 0; font-size: 18px;">Angebot</h3>
            <p><strong>Gerät:</strong> ${priceData.deviceName}</p>
            <p><strong>Zustand:</strong> ${priceData.conditionName}</p>
            <p><strong>Preis:</strong> €${priceData.price}</p>
          </div>
        `;
      }
    },
    onSubmit: (formData) => {
      alert(
        `Verkauf eingereicht: ${formData.deviceName} (${formData.conditionName}) für €${formData.price}`
      );
    },
  });

  container.appendChild(formContainer.getElement());

  // Add div for price summary
  const summary = document.createElement('div');
  summary.id = 'price-summary';
  container.appendChild(summary);

  return container;
};
