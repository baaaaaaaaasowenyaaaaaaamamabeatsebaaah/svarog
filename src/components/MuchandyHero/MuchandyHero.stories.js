// src/components/MuchandyHero/MuchandyHero.stories.js
import MuchandyHero from './MuchandyHero.js';
import { PhoneRepairFormContainer } from '../PhoneRepairForm/index.js';
import { UsedPhonePriceFormContainer } from '../UsedPhonePriceForm/index.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';
import { mockPhoneBuybackData } from '../../../__mocks__/phoneBuybackData.js';
import { switchTheme } from '../../utils/themeManager.js';

// Import the container - try both ways to ensure it works
import createMuchandyHeroContainer from './MuchandyHeroContainer.js';
// Also import from index to ensure proper module registration
import { MuchandyHeroContainer } from './index.js';

import muchandyHeroBg from '../../../.storybook/assets/muchandy-hero-bg.png';

// Use the imported function
const MuchandyHeroContainerFactory =
  createMuchandyHeroContainer || MuchandyHeroContainer;

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
    backgroundImageUrl: { control: 'text' },
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
 * Creates services with configurable delays to simulate real API behavior
 */
const createDelayedServices = (repairDelay = 2000, buybackDelay = 1500) => {
  return {
    repairService: {
      fetchManufacturers: () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve(mockPhoneRepairData.manufacturers),
            repairDelay
          )
        ),
      fetchDevices: (manufacturerId) =>
        new Promise((resolve) => {
          const manufacturer = mockPhoneRepairData.manufacturers.find(
            (m) => m.id.toString() === manufacturerId.toString()
          );
          setTimeout(() => resolve(manufacturer?.devices || []), 300);
        }),
      fetchActions: (deviceId) =>
        new Promise((resolve) => {
          let actions = [];
          for (const manufacturer of mockPhoneRepairData.manufacturers) {
            for (const device of manufacturer.devices) {
              if (device.id.toString() === deviceId.toString()) {
                actions = device.actions || [];
                break;
              }
            }
          }
          setTimeout(() => resolve(actions), 300);
        }),
      fetchPrice: (actionId) =>
        new Promise((resolve) => {
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
          setTimeout(() => resolve(price || { price: 199 }), 300);
        }),
    },
    buybackService: {
      fetchManufacturers: () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve(mockPhoneBuybackData.manufacturers),
            buybackDelay
          )
        ),
      fetchDevices: (manufacturerId) =>
        new Promise((resolve) => {
          const manufacturer = mockPhoneBuybackData.manufacturers.find(
            (m) => m.id.toString() === manufacturerId.toString()
          );
          setTimeout(() => resolve(manufacturer?.devices || []), 300);
        }),
      fetchConditions: (deviceId) =>
        new Promise((resolve) => {
          let conditions = [];
          for (const manufacturer of mockPhoneBuybackData.manufacturers) {
            for (const device of manufacturer.devices) {
              if (device.id.toString() === deviceId.toString()) {
                conditions = device.conditions || [];
                break;
              }
            }
          }
          setTimeout(() => resolve(conditions), 300);
        }),
      fetchPrice: (conditionId) =>
        new Promise((resolve) => {
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
          setTimeout(() => resolve(price || { price: 299 }), 300);
        }),
    },
  };
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
    backgroundImageUrl: muchandyHeroBg,
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
    backgroundImageUrl: '', // No background image
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
    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;">
      <button id="update-title" style="padding: 8px 12px; border: 1px solid #ccc; background: white; cursor: pointer;">Update Title</button>
      <button id="update-subtitle" style="padding: 8px 12px; border: 1px solid #ccc; background: white; cursor: pointer;">Update Subtitle</button>
      <button id="toggle-bg" style="padding: 8px 12px; border: 1px solid #ccc; background: white; cursor: pointer;">Toggle Background</button>
      <button id="switch-tab" style="padding: 8px 12px; border: 1px solid #ccc; background: white; cursor: pointer;">Switch Default Tab</button>
    </div>
    <div id="status-display" style="padding: 10px; background: #e8f4f8; border: 1px solid #bee5eb; border-radius: 4px; font-size: 14px;">
      Status: Ready for updates
    </div>
  `;
  container.appendChild(controlsDiv);

  // Create status update function
  const updateStatus = (message) => {
    const statusEl = controlsDiv.querySelector('#status-display');
    if (statusEl) {
      const timestamp = new Date().toLocaleTimeString();
      statusEl.innerHTML = `Status [${timestamp}]: ${message}`;
    }
  };

  const hero = createHero({
    ...args,
    title: 'Dynamic<br>Updates Demo',
    subtitle: 'Click buttons above to see updates.',
  });

  container.appendChild(hero.getElement());

  // Add event listeners with immediate setup (not in setTimeout)
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

  // Update Title Button
  const updateTitleBtn = controlsDiv.querySelector('#update-title');
  if (updateTitleBtn) {
    updateTitleBtn.addEventListener('click', () => {
      console.log('Update title clicked');
      titleIndex = (titleIndex + 1) % titles.length;
      hero.setTitle(titles[titleIndex]);
      updateStatus(
        `Title updated to: "${titles[titleIndex].replace('<br>', ' ')}" (using setState/partialUpdate)`
      );
    });
  }

  // Update Subtitle Button
  const updateSubtitleBtn = controlsDiv.querySelector('#update-subtitle');
  if (updateSubtitleBtn) {
    updateSubtitleBtn.addEventListener('click', () => {
      console.log('Update subtitle clicked');
      subtitleIndex = (subtitleIndex + 1) % subtitles.length;
      hero.setSubtitle(subtitles[subtitleIndex]);
      updateStatus(
        `Subtitle updated to: "${subtitles[subtitleIndex]}" (using setState/partialUpdate)`
      );
    });
  }

  // Toggle Background Button
  const toggleBgBtn = controlsDiv.querySelector('#toggle-bg');
  if (toggleBgBtn) {
    toggleBgBtn.addEventListener('click', () => {
      console.log('Toggle background clicked, current hasBg:', hasBg);
      hasBg = !hasBg;
      const newBg = hasBg ? muchandyHeroBg : '';
      hero.setBackgroundImageUrl(newBg);
      updateStatus(
        `Background ${hasBg ? 'enabled' : 'disabled'} (using setState/partialUpdate)`
      );
      console.log('Background toggled to:', newBg);

      // Update button text to show current state
      toggleBgBtn.textContent = hasBg ? 'Remove Background' : 'Add Background';
    });
  }

  // Switch Tab Button
  const switchTabBtn = controlsDiv.querySelector('#switch-tab');
  if (switchTabBtn) {
    switchTabBtn.addEventListener('click', () => {
      console.log('Switch tab clicked, current tab:', currentTab);
      currentTab = currentTab === 'repair' ? 'sell' : 'repair';
      hero.update({ defaultTab: currentTab });
      updateStatus(
        `Default tab switched to: "${currentTab}" (using full rerender)`
      );
      console.log('Tab switched to:', currentTab);

      // Update button text to show current state
      switchTabBtn.textContent = `Switch to ${currentTab === 'repair' ? 'Sell' : 'Repair'}`;
    });
  }

  // Initial button text updates
  if (toggleBgBtn) toggleBgBtn.textContent = 'Remove Background';
  if (switchTabBtn) switchTabBtn.textContent = 'Switch to Sell';

  // Log initial state for debugging
  console.log('Dynamic story initialized with:', {
    hasBg,
    currentTab,
    muchandyHeroBg: muchandyHeroBg ? 'loaded' : 'not loaded',
  });

  return container;
};

// Legacy example for backward compatibility
export const WithLegacyBackgroundImageProp = (args) => {
  const { repairForm, buybackForm } = createOptimizedForms();

  const hero = MuchandyHero({
    backgroundImage: muchandyHeroBg, // Using deprecated prop
    title: 'Legacy<br>Props Demo',
    subtitle: 'Using deprecated backgroundImage prop',
    repairForm,
    buybackForm,
    ...args,
  });

  return hero.getElement();
};

export const WithAPIDelay = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '1200px';

  // Add description
  const description = document.createElement('div');
  description.style.cssText = `
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 4px;
  `;
  description.innerHTML = `
    <h3 style="margin-top: 0;">API Delay Simulation</h3>
    <p>This story simulates real API behavior with a 2-second delay for loading initial data.</p>
    <p>You should see a loading state first, then the hero component appears when data is ready.</p>
  `;
  container.appendChild(description);

  // Create hero container with delayed services
  const { repairService, buybackService } = createDelayedServices(2000, 2000);

  const heroContainer = MuchandyHeroContainerFactory({
    repairService,
    buybackService,
    backgroundImageUrl: muchandyHeroBg,
    title: 'API Delay<br>Demo',
    subtitle: 'Loading data from simulated API...',
    onScheduleClick: (repairInfo) => {
      console.log('Repair scheduled:', repairInfo);
      alert('Repair appointment scheduled!');
    },
    onSubmit: (formData) => {
      console.log('Buyback submitted:', formData);
      alert('Device sale submitted!');
    },
  });

  container.appendChild(heroContainer.getElement());
  return container;
};

export const WithDifferentLoadingTimes = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '1200px';

  // Add description
  const description = document.createElement('div');
  description.style.cssText = `
    background: #fef3c7;
    border: 1px solid #f59e0b;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 4px;
  `;
  description.innerHTML = `
    <h3 style="margin-top: 0;">Different Loading Times</h3>
    <p>Repair service: 3 seconds delay | Buyback service: 1 second delay</p>
    <p>The component waits for both services to load before displaying.</p>
  `;
  container.appendChild(description);

  // Create services with different delays
  const { repairService, buybackService } = createDelayedServices(3000, 1000);

  const heroContainer = MuchandyHeroContainerFactory({
    repairService,
    buybackService,
    backgroundImageUrl: muchandyHeroBg,
    title: 'Async Loading<br>Demo',
    subtitle: 'Different services, different speeds.',
  });

  container.appendChild(heroContainer.getElement());
  return container;
};

export const WithCustomLoadingComponent = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '1200px';

  // Custom loading component with animation
  const customLoadingComponent = () => {
    const loadingEl = document.createElement('div');
    loadingEl.innerHTML = `
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .custom-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          color: white;
        }
        .custom-loader__spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .custom-loader__text {
          margin-top: 20px;
          font-size: 18px;
          font-weight: 500;
        }
        .custom-loader__subtext {
          margin-top: 8px;
          font-size: 14px;
          opacity: 0.8;
        }
      </style>
      <div class="custom-loader">
        <div class="custom-loader__spinner"></div>
        <div class="custom-loader__text">Loading your forms...</div>
        <div class="custom-loader__subtext">This usually takes 2-3 seconds</div>
      </div>
    `;
    return loadingEl;
  };

  // Create services with delay
  const { repairService, buybackService } = createDelayedServices(2500, 2500);

  const heroContainer = MuchandyHeroContainerFactory({
    repairService,
    buybackService,
    backgroundImageUrl: muchandyHeroBg,
    title: 'Custom Loading<br>Component',
    subtitle: 'With a beautiful loading state.',
    loadingComponent: customLoadingComponent,
  });

  container.appendChild(heroContainer.getElement());
  return container;
};

export const WithAPIError = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '1200px';

  // Add description
  const description = document.createElement('div');
  description.style.cssText = `
    background: #fee;
    border: 1px solid #fcc;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 4px;
  `;
  description.innerHTML = `
    <h3 style="margin-top: 0;">API Error Simulation</h3>
    <p>This story simulates an API error during initialization.</p>
    <p>You should see an error state with a retry button.</p>
  `;
  container.appendChild(description);

  // Create service that fails
  const errorService = {
    fetchManufacturers: () =>
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('API is currently unavailable')),
          1000
        )
      ),
    fetchDevices: () => Promise.reject(new Error('Not implemented')),
    fetchActions: () => Promise.reject(new Error('Not implemented')),
    fetchPrice: () => Promise.reject(new Error('Not implemented')),
  };

  const { buybackService } = createDelayedServices(1000, 1000);

  const heroContainer = MuchandyHeroContainerFactory({
    repairService: errorService,
    buybackService,
    backgroundImageUrl: muchandyHeroBg,
    title: 'Error<br>Handling',
    subtitle: 'Graceful error states.',
  });

  container.appendChild(heroContainer.getElement());
  return container;
};

export const WithCustomErrorComponent = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '1200px';

  // Custom error component
  const customErrorComponent = (error) => {
    const errorEl = document.createElement('div');
    errorEl.innerHTML = `
      <style>
        .custom-error {
          background: #1a1a1a;
          color: white;
          padding: 40px;
          border-radius: 8px;
          text-align: center;
          border: 2px solid #ef4444;
        }
        .custom-error__icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .custom-error__title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .custom-error__message {
          font-size: 16px;
          opacity: 0.8;
          margin-bottom: 24px;
        }
        .custom-error__button {
          background: #ef4444;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .custom-error__button:hover {
          background: #dc2626;
        }
      </style>
      <div class="custom-error">
        <div class="custom-error__icon">⚠️</div>
        <div class="custom-error__title">Oops! Something went wrong</div>
        <div class="custom-error__message">${error.message}</div>
        <button class="custom-error__button" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    `;
    return errorEl;
  };

  // Create service that fails
  const errorService = {
    fetchManufacturers: () =>
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Unable to connect to the server')),
          1500
        )
      ),
    fetchDevices: () => Promise.reject(new Error('Not implemented')),
    fetchActions: () => Promise.reject(new Error('Not implemented')),
    fetchPrice: () => Promise.reject(new Error('Not implemented')),
  };

  const { buybackService } = createDelayedServices(1000, 1000);

  const heroContainer = MuchandyHeroContainerFactory({
    repairService: errorService,
    buybackService,
    backgroundImageUrl: muchandyHeroBg,
    title: 'Custom Error<br>Component',
    subtitle: 'Beautiful error handling.',
    errorComponent: customErrorComponent,
  });

  container.appendChild(heroContainer.getElement());
  return container;
};

export const WithRetryableError = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '1200px';

  // Add controls
  const controls = document.createElement('div');
  controls.style.cssText = `
    background: #f3f4f6;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 4px;
  `;
  controls.innerHTML = `
    <h3 style="margin-top: 0;">Retryable Error Demo</h3>
    <p>The API will fail on the first attempt but succeed on retry.</p>
    <button id="retry-btn" style="padding: 8px 16px; cursor: pointer;">
      Trigger Retry
    </button>
  `;
  container.appendChild(controls);

  // Create flaky service
  let attemptCount = 0;
  const flakyService = {
    fetchManufacturers: () =>
      new Promise((resolve, reject) => {
        attemptCount++;
        setTimeout(() => {
          if (attemptCount === 1) {
            reject(new Error('Temporary network error - please retry'));
          } else {
            resolve(mockPhoneRepairData.manufacturers);
          }
        }, 1500);
      }),
    fetchDevices: (id) => {
      const manufacturer = mockPhoneRepairData.manufacturers.find(
        (m) => m.id.toString() === id.toString()
      );
      return Promise.resolve(manufacturer?.devices || []);
    },
    fetchActions: (id) => {
      let actions = [];
      for (const manufacturer of mockPhoneRepairData.manufacturers) {
        for (const device of manufacturer.devices) {
          if (device.id.toString() === id.toString()) {
            actions = device.actions || [];
            break;
          }
        }
      }
      return Promise.resolve(actions);
    },
    fetchPrice: () => Promise.resolve({ price: 19900 }),
  };

  const { buybackService } = createDelayedServices(1000, 1000);

  const heroContainer = MuchandyHeroContainerFactory({
    repairService: flakyService,
    buybackService,
    backgroundImageUrl: muchandyHeroBg,
    title: 'Retry<br>Demo',
    subtitle: 'Demonstrating error recovery.',
  });

  container.appendChild(heroContainer.getElement());

  // Add retry button handler
  const retryBtn = controls.querySelector('#retry-btn');
  retryBtn.addEventListener('click', async () => {
    retryBtn.disabled = true;
    retryBtn.textContent = 'Retrying...';

    await heroContainer.retry();

    retryBtn.textContent = 'Success!';
    setTimeout(() => {
      retryBtn.textContent = 'Trigger Retry';
      retryBtn.disabled = false;
    }, 2000);
  });

  return container;
};

export const RealisticProductionScenario = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '1200px';

  // Status display
  const statusBar = document.createElement('div');
  statusBar.style.cssText = `
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    padding: 10px 15px;
    margin-bottom: 20px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  statusBar.innerHTML = `
    <div>
      <strong>Production Scenario</strong> - Simulating real API behavior
    </div>
    <div id="status-text" style="color: #6b7280;">
      Initializing services...
    </div>
  `;
  container.appendChild(statusBar);

  const updateStatus = (text, color = '#6b7280') => {
    const statusText = statusBar.querySelector('#status-text');
    statusText.textContent = text;
    statusText.style.color = color;
  };

  // Create realistic services with varied response times
  const realisticServices = {
    repairService: {
      fetchManufacturers: () => {
        updateStatus('Loading repair manufacturers...');
        return new Promise((resolve) =>
          setTimeout(() => {
            updateStatus('Repair manufacturers loaded');
            resolve(mockPhoneRepairData.manufacturers);
          }, 1200)
        );
      },
      fetchDevices: (id) =>
        new Promise((resolve) =>
          setTimeout(() => {
            const manufacturer = mockPhoneRepairData.manufacturers.find(
              (m) => m.id.toString() === id.toString()
            );
            resolve(manufacturer?.devices || []);
          }, 400)
        ),
      fetchActions: (id) =>
        new Promise((resolve) =>
          setTimeout(() => {
            let actions = [];
            for (const manufacturer of mockPhoneRepairData.manufacturers) {
              for (const device of manufacturer.devices) {
                if (device.id.toString() === id.toString()) {
                  actions = device.actions || [];
                  break;
                }
              }
            }
            resolve(actions);
          }, 350)
        ),
      fetchPrice: (id) =>
        new Promise((resolve) =>
          setTimeout(() => {
            let price = null;
            outerLoop: for (const manufacturer of mockPhoneRepairData.manufacturers) {
              for (const device of manufacturer.devices) {
                for (const action of device.actions || []) {
                  if (action.id.toString() === id.toString()) {
                    price = { price: action.prices[0].price };
                    break outerLoop;
                  }
                }
              }
            }
            resolve(price || { price: 19900 });
          }, 600)
        ),
    },
    buybackService: {
      fetchManufacturers: () => {
        updateStatus('Loading buyback manufacturers...');
        return new Promise((resolve) =>
          setTimeout(() => {
            updateStatus('All data loaded successfully!', '#10b981');
            resolve(mockPhoneBuybackData.manufacturers);
          }, 1800)
        );
      },
      fetchDevices: (id) =>
        new Promise((resolve) =>
          setTimeout(() => {
            const manufacturer = mockPhoneBuybackData.manufacturers.find(
              (m) => m.id.toString() === id.toString()
            );
            resolve(manufacturer?.devices || []);
          }, 300)
        ),
      fetchConditions: (id) =>
        new Promise((resolve) =>
          setTimeout(() => {
            let conditions = [];
            for (const manufacturer of mockPhoneBuybackData.manufacturers) {
              for (const device of manufacturer.devices) {
                if (device.id.toString() === id.toString()) {
                  conditions = device.conditions || [];
                  break;
                }
              }
            }
            resolve(conditions);
          }, 250)
        ),
      fetchPrice: (id) =>
        new Promise((resolve) =>
          setTimeout(() => {
            let price = null;
            outerLoop: for (const manufacturer of mockPhoneBuybackData.manufacturers) {
              for (const device of manufacturer.devices) {
                for (const condition of device.conditions || []) {
                  if (condition.id.toString() === id.toString()) {
                    price = {
                      price: condition.prices[0].price,
                      deviceName: device.name,
                      conditionName: condition.name,
                    };
                    break outerLoop;
                  }
                }
              }
            }
            resolve(price || { price: 29900 });
          }, 500)
        ),
    },
  };

  const heroContainer = MuchandyHeroContainerFactory({
    ...realisticServices,
    backgroundImageUrl: muchandyHeroBg,
    title: 'Production<br>Ready',
    subtitle: 'Real-world API integration example.',
    onScheduleClick: (repairInfo) => {
      updateStatus('Processing repair appointment...', '#f59e0b');
      setTimeout(() => {
        updateStatus('Repair appointment confirmed!', '#10b981');
        console.log('Repair scheduled:', repairInfo);
      }, 1000);
    },
    onSubmit: (formData) => {
      updateStatus('Processing device sale...', '#f59e0b');
      setTimeout(() => {
        updateStatus('Device sale submitted!', '#10b981');
        console.log('Sale submitted:', formData);
      }, 1000);
    },
  });

  container.appendChild(heroContainer.getElement());
  return container;
};
