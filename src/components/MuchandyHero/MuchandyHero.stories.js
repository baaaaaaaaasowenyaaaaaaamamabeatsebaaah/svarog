// src/components/MuchandyHero/MuchandyHero.stories.js
import MuchandyHero from './MuchandyHero.js';
import PhoneRepairForm from '../PhoneRepairForm/PhoneRepairForm.js';
import UsedPhonePriceForm from '../UsedPhonePriceForm/UsedPhonePriceForm.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';
import { mockPhoneBuybackData } from '../../../__mocks__/phoneBuybackData.js';
import MockUsedPhonePriceService from '../../services/MockUsedPhonePriceService.js';

import muchandyHeroBg from '../../../.storybook/assets/muchandy-hero-bg.png';

export default {
  title: 'Components/MuchandyHero',
  component: MuchandyHero,
  // This ensures the mocks are set up before any stories run
  parameters: {
    docs: {
      beforeScreenshot: () => {
        setupMocks();
      },
    },
  },
};

// Setup mocks for all API endpoints
function setupMocks() {
  // We need to mock the global fetch function
  const originalFetch = window.fetch;

  window.fetch = (url) => {
    // Mock manufacturers endpoint
    if (url === '/api/manufacturers') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPhoneRepairData.manufacturers),
      });
    }

    // Mock manufacturers/{id}/devices endpoint
    const deviceMatch = url.match(/\/api\/manufacturers\/(\d+)\/devices/);
    if (deviceMatch) {
      const manufacturerId = deviceMatch[1];
      const manufacturer = mockPhoneRepairData.manufacturers.find(
        (m) => m.id.toString() === manufacturerId
      );
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(manufacturer ? manufacturer.devices : []),
      });
    }

    // Mock devices/{id}/actions endpoint
    const actionMatch = url.match(/\/api\/devices\/(\d+)\/actions/);
    if (actionMatch) {
      const deviceId = actionMatch[1];
      let actions = [];
      for (const manufacturer of mockPhoneRepairData.manufacturers) {
        for (const device of manufacturer.devices) {
          if (device.id.toString() === deviceId) {
            actions = device.actions || [];
            break;
          }
        }
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(actions),
      });
    }

    // Mock actions/{id}/price endpoint
    const repairPriceMatch = url.match(/\/api\/actions\/(\d+)\/price/);
    if (repairPriceMatch) {
      const actionId = repairPriceMatch[1];
      let price = null;
      outerLoop: for (const manufacturer of mockPhoneRepairData.manufacturers) {
        for (const device of manufacturer.devices) {
          for (const action of device.actions || []) {
            if (
              action.id.toString() === actionId &&
              action.prices &&
              action.prices.length > 0
            ) {
              price = { price: action.prices[0].price };
              break outerLoop;
            }
          }
        }
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(price || { price: 199 }),
      });
    }

    // Mock devices/{id}/conditions endpoint for buyback
    const conditionMatch = url.match(/\/api\/devices\/(\d+)\/conditions/);
    if (conditionMatch) {
      const deviceId = conditionMatch[1];
      let conditions = [];
      for (const manufacturer of mockPhoneBuybackData.manufacturers) {
        for (const device of manufacturer.devices) {
          if (device.id.toString() === deviceId) {
            conditions = device.conditions || [];
            break;
          }
        }
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(conditions),
      });
    }

    // Mock conditions/{id}/price endpoint for buyback
    const buybackPriceMatch = url.match(/\/api\/conditions\/(\d+)\/price/);
    if (buybackPriceMatch) {
      const conditionId = buybackPriceMatch[1];
      let price = null;
      outerLoop: for (const manufacturer of mockPhoneBuybackData.manufacturers) {
        for (const device of manufacturer.devices) {
          for (const condition of device.conditions || []) {
            if (
              condition.id.toString() === conditionId &&
              condition.prices &&
              condition.prices.length > 0
            ) {
              price = {
                price: condition.prices[0].price,
                deviceName: device.name,
                conditionName: condition.name,
                manufacturerName: manufacturer.name,
              };
              break outerLoop;
            }
          }
        }
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(price || { price: 299 }),
      });
    }

    // If no mocks match, return a mock not found response
    console.warn(`No mock found for URL: ${url}`);
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
    });
  };

  return () => {
    window.fetch = originalFetch; // Restore original fetch when done
  };
}

// Call setupMocks immediately to ensure it's ready before stories render
setupMocks();

// Create forms directly without injecting services
const createForms = () => {
  // Create forms (they will use the mocked fetch API)
  const repairForm = new PhoneRepairForm({
    onPriceChange: (price) => console.log('Repair price:', price),
  });

  // Create a proper mock service for UsedPhonePriceForm
  const mockBuybackService = new MockUsedPhonePriceService(
    mockPhoneBuybackData
  );

  const buybackForm = new UsedPhonePriceForm({
    service: mockBuybackService,
    onPriceChange: (price) => console.log('Used phone price:', price),
  });

  return { repairForm, buybackForm };
};

// Simple story with default options
export const Default = () => {
  const { repairForm, buybackForm } = createForms();

  const hero = new MuchandyHero({
    backgroundImage: muchandyHeroBg,
    title: 'Finden Sie<br>Ihren Preis:',
    subtitle: 'Jetzt Preis berechnen.',
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};

// Story with sell tab active by default
export const WithSellTabDefault = () => {
  const { repairForm, buybackForm } = createForms();

  const hero = new MuchandyHero({
    backgroundImage: muchandyHeroBg,
    defaultTab: 'sell',
    title: 'Verkaufen Sie<br>Ihr Gerät:',
    subtitle: 'Schnell und einfach zum besten Preis.',
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};

// Story with custom background
export const WithCustomBackground = () => {
  const { repairForm, buybackForm } = createForms();

  const hero = new MuchandyHero({
    backgroundImage: muchandyHeroBg,
    title: 'Ihr Smartphone-<br>Service',
    subtitle: 'Reparatur oder Verkauf - Sie entscheiden!',
    repairForm,
    buybackForm,
  });

  return hero.getElement();
};
