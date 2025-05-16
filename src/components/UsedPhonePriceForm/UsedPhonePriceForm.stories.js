// src/components/UsedPhonePriceForm/UsedPhonePriceForm.stories.js
import UsedPhonePriceFormFactory from '../../factories/UsedPhonePriceFormFactory.js';
import {
  mockPhoneBuybackData,
  setupPhoneBuybackMocks,
} from '../../../__mocks__/phoneBuybackData.js';
import {
  defaultLabels,
  conditionDescriptions,
} from '../../config/UsedPhonePriceFormConfig.js';

export default {
  title: 'Components/UsedPhonePriceForm',
  component: 'UsedPhonePriceForm',
  parameters: {
    docs: {
      description: {
        component:
          'Formular-Komponente zur Wertermittlung eines gebrauchten Handys für den Verkauf.',
      },
    },
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

// Function to update mock conditions with config labels and descriptions
const updateMockConditionsWithConfig = (mockData) => {
  // Create a deep copy of the mock data
  const updatedMockData = JSON.parse(JSON.stringify(mockData));

  // Map condition IDs to config labels
  const conditionLabels = {
    1: defaultLabels.conditionNewLabel || 'Neu', // New
    2: defaultLabels.conditionGoodLabel || 'Gut', // Good
    3: defaultLabels.conditionFairLabel || 'Akzeptabel', // Fair
    4: defaultLabels.conditionPoorLabel || 'Beschädigt', // Poor
  };

  // Map condition IDs to config descriptions
  const conditionDescs = {
    1: conditionDescriptions.likeNew,
    2: conditionDescriptions.good,
    3: conditionDescriptions.fair,
    4: conditionDescriptions.poor,
  };

  // Update conditions in the mock data
  updatedMockData.manufacturers.forEach((manufacturer) => {
    manufacturer.devices.forEach((device) => {
      if (device.conditions) {
        device.conditions.forEach((condition) => {
          // Update name and description based on condition ID
          if (conditionLabels[condition.id]) {
            condition.name = conditionLabels[condition.id];
          }
          if (conditionDescs[condition.id]) {
            condition.description = conditionDescs[condition.id];
          }
        });
      }
    });
  });

  return updatedMockData;
};

export const Default = () => {
  setupMocks();

  // Update mock data with config labels and descriptions
  const updatedMockData = updateMockConditionsWithConfig(mockPhoneBuybackData);

  return UsedPhonePriceFormFactory.createWithMockData({
    mockData: updatedMockData,
    onPriceChange: (priceData) => console.log('Preis ausgewählt:', priceData),
  });
};

export const WithoutSteps = () => {
  setupMocks();

  // Update mock data with config labels and descriptions
  const updatedMockData = updateMockConditionsWithConfig(mockPhoneBuybackData);

  return UsedPhonePriceFormFactory.createWithMockData({
    mockData: updatedMockData,
    showStepsIndicator: false,
    onPriceChange: (priceData) => console.log('Preis ausgewählt:', priceData),
  });
};

export const WithPreselectedData = () => {
  setupMocks();

  // Update mock data with config labels and descriptions
  const updatedMockData = updateMockConditionsWithConfig(mockPhoneBuybackData);

  // Create component container
  const container = document.createElement('div');
  container.style.maxWidth = '600px';

  // Create form component
  const buybackForm = UsedPhonePriceFormFactory.createWithMockData({
    mockData: updatedMockData,
    onPriceChange: (priceData) => {
      console.log('Preis ausgewählt:', priceData);

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
        const condition = priceData.conditionName || 'Unbekannt';

        // Find the condition description
        let conditionDescription = '';
        for (const manufacturer of updatedMockData.manufacturers) {
          for (const device of manufacturer.devices) {
            for (const cond of device.conditions || []) {
              if (cond.name === condition) {
                conditionDescription = cond.description || '';
                break;
              }
            }
          }
        }

        summaryDisplay.innerHTML = `
          <div style="margin-top: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8f9fa;">
            <h3 style="margin-top: 0; font-size: 18px;">Verkaufszusammenfassung</h3>
            <p><strong>Marke:</strong> ${manufacturer || 'Nicht ausgewählt'}</p>
            <p><strong>Modell:</strong> ${device || 'Nicht ausgewählt'}</p>
            <p><strong>Zustand:</strong> ${condition}</p>
            ${conditionDescription ? `<p><small>${conditionDescription}</small></p>` : ''}
            <p><strong>Angebotspreis:</strong> €${priceData.price}</p>
            <button id="confirmSale" style="background-color: #48bb78; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Verkauf bestätigen</button>
          </div>
        `;

        // Add event listener to the confirm button
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
      }
    },
    onSubmit: (formData) => {
      console.log('Formular abgesendet:', formData);
      alert(
        `Dein ${formData.deviceName} (${formData.conditionName}) wurde zum Verkauf für €${formData.price} eingereicht!`
      );
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

      // Then select iPhone 13 after devices load
      setTimeout(() => {
        const deviceSelect = document.getElementById('device');
        if (deviceSelect) {
          deviceSelect.value = '1'; // First device
          deviceSelect.dispatchEvent(new Event('change', { bubbles: true }));

          // Then select a condition
          setTimeout(() => {
            const conditionElements =
              document.querySelectorAll('.condition-option');
            if (conditionElements.length > 0) {
              // Select the second condition ("Gut")
              const goodCondition = Array.from(conditionElements).find(
                (el) => el.getAttribute('data-condition-id') === '2'
              );

              if (goodCondition) {
                goodCondition.querySelector('.condition-option__label').click();
              }
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

  // Update mock data with config labels and descriptions
  const updatedMockData = updateMockConditionsWithConfig(mockPhoneBuybackData);

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
    
    .custom-theme .btn--primary {
      background-color: #3b82f6;
      border-radius: 4px;
      padding: 8px 16px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .custom-theme .btn--primary:hover:not(:disabled) {
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
  const buybackForm = UsedPhonePriceFormFactory.createWithMockData({
    mockData: updatedMockData,
    onPriceChange: (priceData) => console.log('Preis ausgewählt:', priceData),
  });

  themeContainer.appendChild(buybackForm.getElement());

  return container;
};

export const WithErrorHandling = () => {
  // Setup mock with deliberate errors
  window.fetch = (url) => {
    if (url === '/api/manufacturers') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPhoneBuybackData.manufacturers),
      });
    }

    // Simulate error for any device fetch for Google
    const deviceMatch = url.match(/\/api\/manufacturers\/(\d+)\/devices/);
    if (deviceMatch && deviceMatch[1] === '3') {
      // Error only for Google
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Serverfehler' }),
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

    // Match devices/{id}/conditions
    const conditionMatch = url.match(/\/api\/devices\/(\d+)\/conditions/);
    if (conditionMatch) {
      const deviceId = conditionMatch[1];
      // Find the device and its conditions
      let conditions = [];
      for (const manufacturer of mockPhoneBuybackData.manufacturers) {
        const device = manufacturer.devices.find(
          (d) => d.id.toString() === deviceId
        );
        if (device && device.conditions) {
          // Create a deep copy and update with config labels and descriptions
          conditions = JSON.parse(JSON.stringify(device.conditions));

          // Update labels and descriptions
          conditions.forEach((condition) => {
            if (condition.id === 1) {
              condition.name = defaultLabels.conditionNewLabel || 'Neu';
              condition.description = conditionDescriptions.likeNew;
            } else if (condition.id === 2) {
              condition.name = defaultLabels.conditionGoodLabel || 'Gut';
              condition.description = conditionDescriptions.good;
            } else if (condition.id === 3) {
              condition.name = defaultLabels.conditionFairLabel || 'Akzeptabel';
              condition.description = conditionDescriptions.fair;
            } else if (condition.id === 4) {
              condition.name = defaultLabels.conditionPoorLabel || 'Beschädigt';
              condition.description = conditionDescriptions.poor;
            }
          });

          break;
        }
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(conditions),
      });
    }

    // Match conditions/{id}/price
    const priceMatch = url.match(/\/api\/conditions\/(\d+)\/price/);
    if (priceMatch) {
      const conditionId = priceMatch[1];
      // Find the condition and its price
      let priceData = null;
      let conditionName = '';

      // Map condition IDs to names from config
      if (conditionId === '1')
        conditionName = defaultLabels.conditionNewLabel || 'Neu';
      else if (conditionId === '2')
        conditionName = defaultLabels.conditionGoodLabel || 'Gut';
      else if (conditionId === '3')
        conditionName = defaultLabels.conditionFairLabel || 'Akzeptabel';
      else if (conditionId === '4')
        conditionName = defaultLabels.conditionPoorLabel || 'Beschädigt';

      searchLoop: for (const manufacturer of mockPhoneBuybackData.manufacturers) {
        for (const device of manufacturer.devices) {
          for (const condition of device.conditions) {
            if (condition.id.toString() === conditionId) {
              if (condition.prices && condition.prices.length > 0) {
                priceData = {
                  price: condition.prices[0].price,
                  deviceName: device.name,
                  conditionName: conditionName || condition.name,
                  manufacturerName: manufacturer.name,
                };
                break searchLoop;
              }
            }
          }
        }
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(priceData || { price: 0 }),
      });
    }

    // Default response
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Nicht gefunden' }),
    });
  };

  // Create container with instructions
  const container = document.createElement('div');

  const instructions = document.createElement('div');
  instructions.innerHTML = `
    <div style="margin-bottom: 20px; padding: 10px; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px;">
      <p><strong>Testanleitung:</strong></p>
      <p>Wähle "Google" als Marke, um die Fehlerbehandlung in Aktion zu sehen.</p>
    </div>
  `;

  container.appendChild(instructions);

  // Create form component with UsedPhonePriceService (not MockService)
  const buybackForm = UsedPhonePriceFormFactory.createStandard({
    apiOptions: { baseUrl: '/api' },
    onPriceChange: (priceData) => console.log('Preis ausgewählt:', priceData),
  });

  container.appendChild(buybackForm.getElement());

  return container;
};

export const WithCustomLabels = () => {
  setupMocks();

  // Update mock data with config labels and descriptions
  const updatedMockData = updateMockConditionsWithConfig(mockPhoneBuybackData);

  // Create form with custom labels
  const buybackForm = UsedPhonePriceFormFactory.createWithMockData({
    mockData: updatedMockData,
    labels: {
      title: 'Verkaufe dein Gerät',
      manufacturerStep: 'Marke',
      deviceStep: 'Gerät',
      conditionStep: 'Zustand',
      manufacturerLabel: 'Marke auswählen:',
      deviceLabel: 'Gerät auswählen:',
      conditionLabel: 'Gerätezustand:',
      priceLabel: 'Unser Angebot:',
      initialPriceText: 'Fülle alle Auswahlfelder aus, um ein Angebot zu sehen',
      submitButtonText: 'Verkaufen',
      conditionNewLabel: 'Wie neu',
      conditionGoodLabel: 'Gut',
      conditionFairLabel: 'Normal',
      conditionPoorLabel: 'Mit Mängeln',
    },
    onPriceChange: (priceData) => console.log('Preis ausgewählt:', priceData),
  });

  return buybackForm;
};
