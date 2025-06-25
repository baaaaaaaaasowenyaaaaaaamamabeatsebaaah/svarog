// src/components/MuchandyHero/MuchandyHeroContainer.js
import MuchandyHero from './MuchandyHero.js';
import { PhoneRepairFormContainer } from '../PhoneRepairForm/index.js';
import { UsedPhonePriceFormContainer } from '../UsedPhonePriceForm/index.js';
import { createElement } from '../../utils/componentFactory.js';

/**
 * ALGORITHMIC OPTIMIZATION: Efficient container state management
 * Uses minimal state tracking and optimized initialization flow
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
  if (!repairService)
    throw new Error('MuchandyHeroContainer: repairService is required');
  if (!buybackService)
    throw new Error('MuchandyHeroContainer: buybackService is required');

  // Container state - minimal tracking
  let hero = null;
  let repairForm = null;
  let buybackForm = null;
  let containerElement = null;
  let destroyed = false;
  let isInitialized = false;

  // ALGORITHMIC OPTIMIZATION: Direct form creation
  // The new form containers handle their own loading states
  const createForms = () => {
    // Create repair form container
    repairForm = PhoneRepairFormContainer({
      service: repairService,
      onPriceChange: onRepairPriceChange,
      onScheduleClick,
      usedPhoneHref,
      labels: repairFormLabels,
    });

    // Create buyback form container
    buybackForm = UsedPhonePriceFormContainer({
      service: buybackService,
      onPriceChange: onBuybackPriceChange,
      onSubmit,
      labels: buybackFormLabels,
    });

    return { repairForm, buybackForm };
  };

  // Initialize hero with forms immediately
  const initializeHero = () => {
    if (destroyed) return;

    // Create forms
    const forms = createForms();

    // Create MuchandyHero with forms
    hero = MuchandyHero({
      repairForm: forms.repairForm,
      buybackForm: forms.buybackForm,
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
  };

  // Update container content
  const updateContainerContent = () => {
    if (!containerElement || destroyed) return;

    containerElement.innerHTML = '';

    if (hero) {
      containerElement.appendChild(hero.getElement());
    }
  };

  // Initialize immediately for better UX
  initializeHero();

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
     * Update hero props
     * @param {Object} newProps
     */
    update(newProps) {
      if (!hero || destroyed) return this;

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
        ...heroProps
      } = newProps;

      hero.update(heroProps);
      return this;
    },

    /**
     * Get current state
     * @returns {Object}
     */
    getState() {
      return {
        isInitialized,
        hasHero: !!hero,
        hasRepairForm: !!repairForm,
        hasBuybackForm: !!buybackForm,
        destroyed,
      };
    },

    /**
     * Get the hero instance
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
     * Refresh forms (recreate with same config)
     */
    refresh() {
      if (destroyed) return;

      // Destroy old forms
      if (repairForm) repairForm.destroy();
      if (buybackForm) buybackForm.destroy();

      // Create new forms
      const forms = createForms();
      repairForm = forms.repairForm;
      buybackForm = forms.buybackForm;

      // Update hero with new forms
      if (hero) {
        hero.update({
          repairForm,
          buybackForm,
        });
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
    },
  };
};

// Export as default
export default MuchandyHeroContainer;
