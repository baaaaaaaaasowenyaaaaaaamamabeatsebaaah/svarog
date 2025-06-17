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
const MuchandyHeroContainer = (props) => {
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

  // Create placeholder/loading forms immediately for better UX
  const createLoadingForm = (formType) => {
    const loadingElement = createElement('div', {
      classes: [`${formType}-form-loading`, 'form-loading-placeholder'],
      attributes: {
        'aria-busy': 'true',
        'aria-label': `Loading ${formType} form`,
      },
    });

    loadingElement.innerHTML = `
      <div style="padding: 20px; text-align: center; background: rgba(255,255,255,0.1); border-radius: 8px; min-height: 200px; display: flex; flex-direction: column; justify-content: center;">
        <div style="margin-bottom: 12px;">
          <div style="width: 24px; height: 24px; border: 2px solid #ffffff40; border-top: 2px solid #fff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
        <div style="color: #fff; font-size: 14px; opacity: 0.9;">Loading ${formType === 'repair' ? 'repair' : 'buyback'} options...</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    return {
      getElement: () => loadingElement,
      destroy: () => loadingElement.remove(),
      update: () => {},
      setState: () => {},
      getCurrentState: () => ({ loading: true }),
    };
  };

  // Create error form for when services fail
  const createErrorForm = (formType, error) => {
    console.log(`Creating error form for ${formType}:`, error.message);

    const errorElement = createElement('div', {
      classes: [`${formType}-form-error`, 'form-error-placeholder'],
      attributes: { role: 'alert' },
    });

    errorElement.innerHTML = `
      <div style="padding: 20px; text-align: center; background: rgba(220,53,69,0.1); border: 1px solid rgba(220,53,69,0.3); border-radius: 8px; min-height: 200px; display: flex; flex-direction: column; justify-content: center;">
        <div style="margin-bottom: 12px; font-size: 24px;">⚠️</div>
        <div style="color: #fff; font-size: 14px; margin-bottom: 12px;">Failed to load ${formType === 'repair' ? 'repair' : 'buyback'} options</div>
        <div style="color: #fff; font-size: 12px; opacity: 0.8; margin-bottom: 16px;">${error.message}</div>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background: rgba(220,53,69,0.8); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
          Retry
        </button>
      </div>
    `;

    const errorForm = {
      getElement: () => {
        console.log(`Error form getElement called for ${formType}`);
        return errorElement;
      },
      destroy: () => errorElement.remove(),
      update: () => {},
      setState: () => {},
      getCurrentState: () => ({ error }),
    };

    console.log(
      `Error form created for ${formType}, element classes:`,
      errorElement.className
    );
    return errorForm;
  };

  // Update container element content - simplified since we show hero immediately
  const updateContainerContent = () => {
    if (!containerElement) return;

    containerElement.innerHTML = '';

    if (hero) {
      // Always show the hero - it handles its own loading/error states via forms
      containerElement.appendChild(hero.getElement());
    } else {
      // Fallback loading if hero hasn't been created yet
      const fallbackLoading = createElement('div', {
        classes: ['muchandy-hero-container__loading'],
        attributes: { 'aria-busy': 'true' },
      });
      fallbackLoading.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <div style="font-size: 18px; color: #666;">Initializing...</div>
        </div>
      `;
      containerElement.appendChild(fallbackLoading);
    }
  };

  // Initialize forms asynchronously with progressive loading
  const initializeForms = async () => {
    try {
      // Create MuchandyHero immediately with loading forms for better UX
      createInitialHeroWithLoadingForms();

      // Simple parallel loading with individual error handling
      const repairPromise = repairService
        .fetchManufacturers()
        .then((data) => ({ success: true, data }))
        .catch((error) => ({ success: false, error }));

      const buybackPromise = buybackService
        .fetchManufacturers()
        .then((data) => ({ success: true, data }))
        .catch((error) => ({ success: false, error }));

      const [repairResult, buybackResult] = await Promise.all([
        repairPromise,
        buybackPromise,
      ]);

      if (destroyed) return;

      // Handle repair service result
      if (repairResult.success) {
        console.log('Repair service succeeded, creating real form');
        const cachedRepairService = createCachedService(
          repairService,
          repairResult.data
        );
        repairForm = PhoneRepairFormContainer({
          service: cachedRepairService,
          onPriceChange: onRepairPriceChange,
          onScheduleClick,
          usedPhoneHref,
          labels: repairFormLabels,
        });

        // Wait for real form to be ready
        await waitForFormReady(repairForm, 'repair');
      } else {
        console.log(
          'Repair service failed, creating error form:',
          repairResult.error.message
        );
        repairForm = createErrorForm('repair', repairResult.error);
      }

      // Handle buyback service result
      if (buybackResult.success) {
        console.log('Buyback service succeeded, creating real form');
        const cachedBuybackService = createCachedService(
          buybackService,
          buybackResult.data
        );
        buybackForm = UsedPhonePriceFormContainer({
          service: cachedBuybackService,
          onPriceChange: onBuybackPriceChange,
          onSubmit,
          labels: buybackFormLabels,
        });

        // Wait for real form to be ready
        await waitForFormReady(buybackForm, 'buyback');
      } else {
        console.log(
          'Buyback service failed, creating error form:',
          buybackResult.error.message
        );
        buybackForm = createErrorForm('buyback', buybackResult.error);
      }

      if (destroyed) return;

      // Update hero with final forms (real or error)
      updateHeroForms();

      // Container is initialized even if some services failed
      isInitialized = true;

      // Only set global error if ALL services failed
      if (!repairResult.success && !buybackResult.success) {
        initializationError = repairResult.error || buybackResult.error;
      }
    } catch (error) {
      if (destroyed) return;

      console.error('MuchandyHeroContainer initialization error:', error);
      initializationError = error;

      // Even with errors, we might still have a hero with error forms
      if (hero) {
        isInitialized = true;
      }
    }
  };

  // Create initial hero with loading forms for immediate display
  const createInitialHeroWithLoadingForms = () => {
    if (destroyed) return;

    // Create loading forms
    repairForm = createLoadingForm('repair');
    buybackForm = createLoadingForm('buyback');

    // Create MuchandyHero immediately
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

    updateContainerContent();
  };

  // Update hero component with new forms (loading -> real -> error)
  const updateHeroForms = () => {
    if (!hero || destroyed) return;

    console.log('Updating hero forms:', {
      repairForm: repairForm?.getElement?.()?.className || 'no repair form',
      buybackForm: buybackForm?.getElement?.()?.className || 'no buyback form',
    });

    // Use the hero's update method to replace forms
    hero.update({
      repairForm,
      buybackForm,
    });
  };

  // Create a service wrapper that caches the first fetchManufacturers call
  const createCachedService = (originalService, cachedManufacturers) => {
    let firstCall = true;
    return {
      ...originalService,
      fetchManufacturers: () => {
        if (firstCall) {
          firstCall = false;
          return Promise.resolve(cachedManufacturers);
        }
        return originalService.fetchManufacturers();
      },
    };
  };

  // Wait for form to have data or error (simplified since we pre-test services)
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

          // Check if manufacturers are loaded (minimum requirement)
          // Since we pre-tested the service and use cached data, this should be quick
          if (state.manufacturers && state.manufacturers.length > 0) {
            cleanup();
            resolve();
            return;
          }

          // Check if form has error (fallback error handling)
          if (state.error && Object.keys(state.error).length > 0) {
            cleanup();

            // Extract any available error message, but this is secondary
            // since service errors are handled at the service level now
            let errorMessage = `${formType} form initialization failed`;

            if (state.error instanceof Error) {
              errorMessage = state.error.message;
            } else if (state.error.message) {
              errorMessage = state.error.message;
            } else if (state.error.manufacturers instanceof Error) {
              errorMessage = state.error.manufacturers.message;
            } else if (typeof state.error === 'string') {
              errorMessage = state.error;
            }

            reject(new Error(errorMessage));
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

  // Start initialization immediately with progressive loading
  initializationPromise = initializeForms().catch((error) => {
    // Error is already handled in initializeForms with individual form error states
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
     * Update hero props (works immediately since hero is created right away)
     * @param {Object} newProps
     */
    update(newProps) {
      if (!hero) {
        console.warn('MuchandyHeroContainer: Hero not yet created');
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
      // Check if forms are real forms (not loading placeholders)
      const hasRealRepairForm =
        repairForm &&
        repairForm.getElement &&
        !repairForm
          .getElement()
          .classList?.contains('form-loading-placeholder');

      const hasRealBuybackForm =
        buybackForm &&
        buybackForm.getElement &&
        !buybackForm
          .getElement()
          .classList?.contains('form-loading-placeholder');

      // Forms are ready if we have moved past the loading state (even if some are errors)
      const formsReady =
        isInitialized && hasRealRepairForm && hasRealBuybackForm;

      return {
        isInitialized,
        hasError: !!initializationError,
        error: initializationError,
        hasHero: !!hero,
        formsReady,
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

      // Reset error state
      initializationError = null;
      isInitialized = false;

      // If hero doesn't exist, recreate with loading forms
      if (!hero) {
        createInitialHeroWithLoadingForms();
      } else {
        // Replace current forms with loading forms
        repairForm = createLoadingForm('repair');
        buybackForm = createLoadingForm('buyback');
        updateHeroForms();
      }

      // Restart initialization
      initializationPromise = initializeForms().catch((error) => {
        // Error handling is now done inside initializeForms
        console.warn('Retry completed with some errors:', error);
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
export default MuchandyHeroContainer;
