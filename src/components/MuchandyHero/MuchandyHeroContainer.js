// src/components/MuchandyHero/MuchandyHeroContainer.js
import MuchandyHero from './MuchandyHero.js';
import { PhoneRepairFormContainer } from '../PhoneRepairForm/index.js';
import { UsedPhonePriceFormContainer } from '../UsedPhonePriceForm/index.js';
import { createElement } from '../../utils/componentFactory.js';

/**
 * Container for MuchandyHero that handles async form initialization
 * @param {Object} props - Container properties
 * @returns {Object} Container component API
 */
const createMuchandyHeroContainer = (props) => {
  const {
    repairService,
    buybackService,
    onRepairPriceChange,
    onScheduleClick,
    onBuybackPriceChange,
    onSubmit,
    backgroundImageUrl,
    title,
    subtitle,
    defaultTab,
    className,
    blurIntensity,
    overlayOpacity,
    usedPhoneHref,
    repairFormLabels,
    buybackFormLabels,
    loadingComponent,
    errorComponent,
    ...otherProps
  } = props;

  // Validate required services
  if (!repairService) {
    throw new Error('MuchandyHeroContainer: repairService is required');
  }
  if (!buybackService) {
    throw new Error('MuchandyHeroContainer: buybackService is required');
  }

  // Container state
  let hero = null;
  let repairForm = null;
  let buybackForm = null;
  let containerElement = null;
  let isInitialized = false;
  let initializationError = null;
  let destroyed = false;
  let initializationPromise = null;

  // Create loading state element
  const createLoadingElement = () => {
    if (loadingComponent) {
      return typeof loadingComponent === 'function'
        ? loadingComponent()
        : loadingComponent;
    }

    const loadingEl = createElement('div', {
      classes: ['muchandy-hero-container__loading'],
      attributes: { 'aria-busy': 'true' },
    });

    loadingEl.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 18px; color: #666;">Loading...</div>
      </div>
    `;

    return loadingEl;
  };

  // Create error state element
  const createErrorElement = (error) => {
    if (errorComponent) {
      return typeof errorComponent === 'function'
        ? errorComponent(error)
        : errorComponent;
    }

    const errorEl = createElement('div', {
      classes: ['muchandy-hero-container__error'],
      attributes: { role: 'alert' },
    });

    errorEl.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #dc3545;">
        <div style="font-size: 18px; margin-bottom: 10px;">Failed to load forms</div>
        <div style="font-size: 14px;">${error.message}</div>
        <button onclick="window.location.reload()" style="margin-top: 15px; padding: 8px 16px; cursor: pointer;">
          Retry
        </button>
      </div>
    `;

    return errorEl;
  };

  // Update container element content
  const updateContainerContent = () => {
    if (!containerElement) return;

    containerElement.innerHTML = '';

    if (isInitialized && hero) {
      containerElement.appendChild(hero.getElement());
    } else if (initializationError) {
      containerElement.appendChild(createErrorElement(initializationError));
    } else {
      containerElement.appendChild(createLoadingElement());
    }
  };

  // Initialize forms asynchronously
  const initializeForms = async () => {
    try {
      // Create both form containers
      repairForm = PhoneRepairFormContainer({
        service: repairService,
        onPriceChange: onRepairPriceChange,
        onScheduleClick,
        usedPhoneHref,
        labels: repairFormLabels,
      });

      buybackForm = UsedPhonePriceFormContainer({
        service: buybackService,
        onPriceChange: onBuybackPriceChange,
        onSubmit,
        labels: buybackFormLabels,
      });

      // Wait for both forms to load initial data
      await Promise.all([
        waitForFormReady(repairForm, 'repair'),
        waitForFormReady(buybackForm, 'buyback'),
      ]);

      if (destroyed) {
        // Clean up if destroyed during initialization
        if (repairForm) repairForm.destroy();
        if (buybackForm) buybackForm.destroy();
        return;
      }

      // Create MuchandyHero with initialized forms
      hero = MuchandyHero({
        repairForm,
        buybackForm,
        backgroundImageUrl,
        title,
        subtitle,
        defaultTab,
        className,
        blurIntensity,
        overlayOpacity,
        ...otherProps,
      });

      isInitialized = true;
      updateContainerContent();
    } catch (error) {
      if (destroyed) return; // Ignore errors if destroyed

      console.error('MuchandyHeroContainer initialization error:', error);
      initializationError = error;

      // Clean up forms on error
      if (repairForm) repairForm.destroy();
      if (buybackForm) buybackForm.destroy();
      repairForm = null;
      buybackForm = null;

      updateContainerContent();
      throw error; // Re-throw to let waitForInitialization catch it
    }
  };

  // Wait for form to have data or error
  const waitForFormReady = async (formContainer, formType, timeout = 2000) => {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      let checkInterval;

      const cleanup = () => {
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
      };

      const checkReady = () => {
        if (destroyed) {
          cleanup();
          reject(new Error('Container destroyed'));
          return;
        }

        try {
          const state = formContainer.getFormState();

          // Check if form has error
          if (state.error && Object.keys(state.error).length > 0) {
            cleanup();
            reject(new Error(`${formType} form initialization failed`));
            return;
          }

          // Check if manufacturers are loaded (minimum requirement)
          if (state.manufacturers && state.manufacturers.length > 0) {
            cleanup();
            resolve();
            return;
          }

          // Check for timeout
          if (Date.now() - startTime > timeout) {
            cleanup();
            reject(new Error(`${formType} form initialization timeout`));
            return;
          }
        } catch (error) {
          cleanup();
          reject(error);
        }
      };

      // Check immediately
      checkReady();

      // Then check every 50ms
      checkInterval = setInterval(checkReady, 50);
    });
  };

  // Start initialization
  initializationPromise = initializeForms().catch((error) => {
    // Error is already handled in initializeForms
    initializationError = error;
  });

  // Container API
  return {
    /**
     * Get the container element
     * @returns {HTMLElement}
     */
    getElement() {
      if (!containerElement) {
        containerElement = createElement('div', {
          classes: ['muchandy-hero-container'],
        });
        updateContainerContent();
      }
      return containerElement;
    },

    /**
     * Update hero props (only works after initialization)
     * @param {Object} newProps
     */
    update(newProps) {
      if (!isInitialized || !hero) {
        console.warn(
          'MuchandyHeroContainer: Cannot update before initialization'
        );
        return this;
      }

      // Filter out container-specific props
      const {
        repairService: _rs,
        buybackService: _bs,
        onRepairPriceChange: _rpc,
        onScheduleClick: _sc,
        onBuybackPriceChange: _bpc,
        onSubmit: _os,
        repairFormLabels: _rfl,
        buybackFormLabels: _bfl,
        loadingComponent: _lc,
        errorComponent: _ec,
        ...heroProps
      } = newProps;

      hero.update(heroProps);
      return this;
    },

    /**
     * Get initialization state
     * @returns {Object}
     */
    getState() {
      return {
        isInitialized,
        hasError: !!initializationError,
        error: initializationError,
      };
    },

    /**
     * Get the hero instance (if initialized)
     * @returns {Object|null}
     */
    getHero() {
      return hero;
    },

    /**
     * Get form containers
     * @returns {Object}
     */
    getForms() {
      return { repairForm, buybackForm };
    },

    /**
     * Retry initialization after error
     */
    async retry() {
      if (destroyed) return;

      initializationError = null;
      isInitialized = false;
      hero = null;

      updateContainerContent();

      initializationPromise = initializeForms().catch((error) => {
        initializationError = error;
      });
      await initializationPromise;
    },

    /**
     * Wait for initialization to complete (for testing)
     */
    async waitForInitialization() {
      if (initializationPromise) {
        try {
          await initializationPromise;
        } catch (_error) {
          // Error is already handled
        }
      }
    },

    /**
     * Clean up resources
     */
    destroy() {
      destroyed = true;

      if (hero) {
        hero.destroy();
        hero = null;
      }

      if (repairForm) {
        repairForm.destroy();
        repairForm = null;
      }

      if (buybackForm) {
        buybackForm.destroy();
        buybackForm = null;
      }

      if (containerElement) {
        containerElement.remove();
        containerElement = null;
      }

      isInitialized = false;
      initializationError = null;
      initializationPromise = null;
    },
  };
};

// Export as default
export default createMuchandyHeroContainer;
