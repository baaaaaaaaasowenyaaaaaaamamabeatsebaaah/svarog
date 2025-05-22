// src/components/MuchandyHero/MuchandyHero.stories.js
import MuchandyHero from './MuchandyHero.js';
import { PhoneRepairFormContainer } from '../PhoneRepairForm/index.js';
import { UsedPhonePriceFormContainer } from '../UsedPhonePriceForm/index.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';
import { mockPhoneBuybackData } from '../../../__mocks__/phoneBuybackData.js';
import { switchTheme } from '../../utils/theme.js';

import muchandyHeroBg from '../../../.storybook/assets/muchandy-hero-bg.png';

export default {
  title: 'Components/MuchandyHero',
  component: MuchandyHero,
  parameters: {
    docs: {
      description: {
        component:
          'Specialized hero section for phone repair and buyback services with tabbed interface and optimized performance.',
      },
    },
  },
  argTypes: {
    backgroundImage: { control: 'text' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    defaultTab: {
      control: 'select',
      options: ['repair', 'sell'],
    },
    className: { control: 'text' },
  },
};

/**
 * ALGORITHMIC OPTIMIZATION: Memoized Service Creation
 * Creates services once and reuses them across stories
 * @private
 */
const createOptimizedServices = (() => {
  let servicesCache = null;

  return () => {
    if (servicesCache) return servicesCache;

    // Create repair service
    const repairService = {
      fetchManufacturers: () =>
        Promise.resolve(mockPhoneRepairData.manufacturers),
      fetchDevices: (manufacturerId) => {
        const manufacturer = mockPhoneRepairData.manufacturers.find(
          (m) => m.id.toString() === manufacturerId.toString()
        );
        return Promise.resolve(manufacturer?.devices || []);
      },
      fetchActions: (deviceId) => {
        let actions = [];
        for (const manufacturer of mockPhoneRepairData.manufacturers) {
          for (const device of manufacturer.devices) {
            if (device.id.toString() === deviceId.toString()) {
              actions = device.actions || [];
              break;
            }
          }
        }
        return Promise.resolve(actions);
      },
      fetchPrice: (actionId) => {
        let price = null;
        outerLoop: for (const manufacturer of mockPhoneRepairData.manufacturers) {
          for (const device of manufacturer.devices) {
            for (const action of device.actions || []) {
              if (
                action.id.toString() === actionId.toString() &&
                action.prices &&
                action.prices.length > 0
              ) {
                price = { price: action.prices[0].price };
                break outerLoop;
              }
            }
          }
        }
        return Promise.resolve(price || { price: 199 });
      },
    };

    // Create buyback service
    const buybackService = {
      fetchManufacturers: () =>
        Promise.resolve(mockPhoneBuybackData.manufacturers),
      fetchDevices: (manufacturerId) => {
        const manufacturer = mockPhoneBuybackData.manufacturers.find(
          (m) => m.id.toString() === manufacturerId.toString()
        );
        return Promise.resolve(manufacturer?.devices || []);
      },
      fetchConditions: (deviceId) => {
        let conditions = [];
        for (const manufacturer of mockPhoneBuybackData.manufacturers) {
          for (const device of manufacturer.devices) {
            if (device.id.toString() === deviceId.toString()) {
              conditions = device.conditions || [];
              break;
            }
          }
        }
        return Promise.resolve(conditions);
      },
      fetchPrice: (conditionId) => {
        let price = null;
        outerLoop: for (const manufacturer of mockPhoneBuybackData.manufacturers) {
          for (const device of manufacturer.devices) {
            for (const condition of device.conditions || []) {
              if (
                condition.id.toString() === conditionId.toString() &&
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
        return Promise.resolve(price || { price: 299 });
      },
    };

    servicesCache = { repairService, buybackService };
    return servicesCache;
  };
})();

/**
 * ALGORITHMIC OPTIMIZATION: Efficient Form Creation
 * Creates form containers with optimized configuration
 * @private
 */
const createOptimizedForms = (options = {}) => {
  const { repairService, buybackService } = createOptimizedServices();

  const repairForm = PhoneRepairFormContainer({
    service: repairService,
    onPriceChange:
      options.onRepairPriceChange ||
      ((price) => console.log('Repair price updated:', price)),
    onScheduleClick:
      options.onScheduleClick ||
      ((repairInfo) => console.log('Repair scheduled:', repairInfo)),
  });

  const buybackForm = UsedPhonePriceFormContainer({
    service: buybackService,
    onPriceChange:
      options.onBuybackPriceChange ||
      ((price) => console.log('Buyback price updated:', price)),
    onSubmit:
      options.onSubmit ||
      ((formData) => console.log('Buyback submitted:', formData)),
  });

  return { repairForm, buybackForm };
};

/**
 * Helper to create hero with standardized props
 * @private
 */
const createHero = (props = {}) => {
  const { repairForm, buybackForm } = createOptimizedForms(props.formOptions);

  return MuchandyHero({
    backgroundImage: muchandyHeroBg,
    title: 'Finden Sie<br>Ihren Preis',
    subtitle: 'Jetzt Preis berechnen.',
    repairForm,
    buybackForm,
    ...props,
  });
};

export const Default = (args) => {
  const hero = createHero(args);
  return hero.getElement();
};

export const WithSellTabDefault = (args) => {
  const hero = createHero({
    ...args,
    defaultTab: 'sell',
    title: 'Verkaufen Sie<br>Ihr Gerät',
    subtitle: 'Schnell und einfach zum besten Preis.',
  });
  return hero.getElement();
};

export const WithoutBackgroundImage = (args) => {
  const hero = createHero({
    ...args,
    backgroundImage: '', // No background image
    title: 'Finden Sie<br>Ihren Preis',
    subtitle: 'Ohne Hintergrundbild.',
  });
  return hero.getElement();
};

export const WithCustomText = (args) => {
  const hero = createHero({
    ...args,
    title: 'Custom<br>Title Text',
    subtitle: 'This is a custom subtitle for demonstration.',
  });
  return hero.getElement();
};

export const WithMuchandyTheme = (args) => {
  // Switch to Muchandy theme
  switchTheme('muchandy');

  const hero = createHero({
    ...args,
    title: 'Muchandy<br>Theme Example',
    subtitle: 'Using the Muchandy theme styling.',
  });
  return hero.getElement();
};

export const WithCallbacks = (args) => {
  // Create container for demonstration
  const container = document.createElement('div');
  container.style.maxWidth = '1200px';

  // Add status display
  const statusDiv = document.createElement('div');
  statusDiv.id = 'hero-status';
  statusDiv.style.cssText = `
    background: #e8f4f8;
    border: 1px solid #bee5eb;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 4px;
  `;
  statusDiv.innerHTML =
    '<strong>Status:</strong> Select options to see callbacks in action';
  container.appendChild(statusDiv);

  const updateStatus = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    statusDiv.innerHTML = `<strong>Status [${timestamp}]:</strong> ${message}`;
  };

  const hero = createHero({
    ...args,
    title: 'Interactive<br>Demo',
    subtitle: 'Select options to see callback actions.',
    formOptions: {
      onRepairPriceChange: (price) => {
        const priceFormatted = price
          ? `€${(price.price / 100).toFixed(2)}`
          : 'No price';
        updateStatus(`Repair price selected: ${priceFormatted}`);
      },
      onBuybackPriceChange: (price) => {
        const priceFormatted = price
          ? `€${(price.price / 100).toFixed(2)}`
          : 'No price';
        updateStatus(`Buyback price selected: ${priceFormatted}`);
      },
      onScheduleClick: (repairInfo) => {
        updateStatus('Repair appointment scheduled successfully!');
        if (repairInfo.price) {
          const priceFormatted = (repairInfo.price.price / 100).toFixed(2);
          setTimeout(() => {
            alert(
              `Repair scheduled!\nDevice: ${repairInfo.device.name}\nService: ${repairInfo.service.name}\nPrice: €${priceFormatted}`
            );
          }, 100);
        }
      },
      onSubmit: (formData) => {
        updateStatus('Device sale submitted successfully!');
        if (formData.price) {
          const priceFormatted = (formData.price / 100).toFixed(2);
          setTimeout(() => {
            alert(
              `Sale submitted!\nDevice: ${formData.deviceName}\nCondition: ${formData.conditionName}\nPrice: €${priceFormatted}`
            );
          }, 100);
        }
      },
    },
  });

  container.appendChild(hero.getElement());
  return container;
};

export const MinimalConfiguration = (args) => {
  // Only provide required props
  const { repairForm, buybackForm } = createOptimizedForms();

  const hero = MuchandyHero({
    repairForm,
    buybackForm,
    ...args,
    // All other props will use defaults
  });

  return hero.getElement();
};

export const WithDynamicUpdates = (args) => {
  // Create container for demonstration
  const container = document.createElement('div');
  container.style.maxWidth = '1200px';

  // Add controls
  const controlsDiv = document.createElement('div');
  controlsDiv.style.cssText = `
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 4px;
  `;
  controlsDiv.innerHTML = `
    <h3 style="margin-top: 0;">Dynamic Updates Demo</h3>
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <button id="update-title" style="padding: 8px 12px; border: 1px solid #ccc; background: white; cursor: pointer;">Update Title</button>
      <button id="update-subtitle" style="padding: 8px 12px; border: 1px solid #ccc; background: white; cursor: pointer;">Update Subtitle</button>
      <button id="toggle-bg" style="padding: 8px 12px; border: 1px solid #ccc; background: white; cursor: pointer;">Toggle Background</button>
      <button id="switch-tab" style="padding: 8px 12px; border: 1px solid #ccc; background: white; cursor: pointer;">Switch Default Tab</button>
    </div>
  `;
  container.appendChild(controlsDiv);

  const hero = createHero({
    ...args,
    title: 'Dynamic<br>Updates Demo',
    subtitle: 'Click buttons above to see updates.',
  });

  container.appendChild(hero.getElement());

  // Add event listeners for dynamic updates
  setTimeout(() => {
    let hasBg = true;
    let currentTab = 'repair';
    let titleIndex = 0;
    let subtitleIndex = 0;

    const titles = [
      'Dynamic<br>Updates Demo',
      'Updated<br>Title',
      'Another<br>Title Change',
      'Back to<br>Original',
    ];

    const subtitles = [
      'Click buttons above to see updates.',
      'Title has been updated!',
      'Subtitle changed dynamically.',
      'Everything is working perfectly.',
    ];

    document.getElementById('update-title')?.addEventListener('click', () => {
      titleIndex = (titleIndex + 1) % titles.length;
      hero.setTitle(titles[titleIndex]);
    });

    document
      .getElementById('update-subtitle')
      ?.addEventListener('click', () => {
        subtitleIndex = (subtitleIndex + 1) % subtitles.length;
        hero.setSubtitle(subtitles[subtitleIndex]);
      });

    document.getElementById('toggle-bg')?.addEventListener('click', () => {
      hasBg = !hasBg;
      hero.setBackgroundImage(hasBg ? muchandyHeroBg : '');
    });

    document.getElementById('switch-tab')?.addEventListener('click', () => {
      currentTab = currentTab === 'repair' ? 'sell' : 'repair';
      hero.update({ defaultTab: currentTab });
    });
  }, 100);

  return container;
};
