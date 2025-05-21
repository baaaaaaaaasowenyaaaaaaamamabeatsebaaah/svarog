/**
 * Helper function to trigger animations
 * @private
 * @param {HTMLElement} element - Form element
 * @param {string} animationType - Type of animation to trigger
 */
const triggerAnimation = (element, animationType) => {
  if (!element) return;

  // Remove any existing animation classes
  element.classList.remove('used-phone-price-form--animate-step');
  element.classList.remove('used-phone-price-form--animate-submit');
  element.classList.remove('used-phone-price-form--animate-error');

  // Add the animation class
  element.classList.add('used-phone-price-form--animating');
  element.classList.add(`used-phone-price-form--animate-${animationType}`);

  // Force a reflow
  void element.offsetWidth;
}; // src/components/UsedPhonePriceForm/UsedPhonePriceForm.js
import './UsedPhonePriceForm.css';
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import Button from '../Button/Button.js';
import Select from '../Select/Select.js';
import StepsIndicator from '../StepsIndicator/StepsIndicator.js';
import PriceDisplay from '../PriceDisplay/PriceDisplay.js';
import ConditionSelector from '../ConditionSelector/ConditionSelector.js';

/**
 * Creates the phone price form DOM element
 * @private
 * @param {Object} state - Component state
 * @returns {HTMLElement} - Phone price form element
 */
const renderUsedPhonePriceForm = (state) => {
  // Build CSS class list
  const classNames = [
    'used-phone-price-form',
    state.className,
    state.isLoading ? 'used-phone-price-form--loading' : '',
    state.hasError ? 'used-phone-price-form--error' : '',
    state.isAnimating ? 'used-phone-price-form--animating' : '',
  ].filter(Boolean);

  // Create the main form element
  const form = createElement('form', {
    classes: classNames,
    attributes: {
      role: 'form',
      'aria-live': 'polite',
      'aria-busy': state.isLoading ? 'true' : 'false',
      'aria-invalid': state.hasError ? 'true' : 'false',
    },
    events: {
      submit: (e) => e.preventDefault(),
    },
  });

  // Track child components for easy access in updates
  const components = {};

  // Add steps indicator if enabled
  if (state.showStepsIndicator) {
    components.stepsIndicator = StepsIndicator({
      steps: state.steps,
      activeIndex: state.activeStepIndex,
    });
    form.appendChild(components.stepsIndicator.getElement());
  }

  // Create manufacturer section with label
  const manufacturerSection = createElement('div', {
    classes: 'form-group',
    attributes: {
      role: 'group',
      'aria-labelledby': 'manufacturer-label',
    },
  });

  const manufacturerLabel = createElement('label', {
    classes: 'form-group__label',
    attributes: {
      id: 'manufacturer-label',
      for: 'manufacturer',
    },
    text: state.labels.manufacturerLabel || state.labels.manufacturerStep,
  });
  manufacturerSection.appendChild(manufacturerLabel);

  // Create manufacturer select
  components.manufacturerSelect = Select({
    id: 'manufacturer',
    name: 'manufacturer',
    placeholder: state.labels.manufacturerPlaceholder,
    options: state.manufacturers.map((m) => ({
      value: m.id.toString(),
      label: m.name,
    })),
    value: state.selectedManufacturer,
    onChange: (event, value) => {
      if (typeof state.onManufacturerChange === 'function') {
        state.onManufacturerChange(value);
      }
    },
  });
  manufacturerSection.appendChild(components.manufacturerSelect.getElement());
  form.appendChild(manufacturerSection);

  // Create device section with label
  const deviceSection = createElement('div', {
    classes: 'form-group',
    attributes: {
      role: 'group',
      'aria-labelledby': 'device-label',
    },
  });

  const deviceLabel = createElement('label', {
    classes: 'form-group__label',
    attributes: {
      id: 'device-label',
      for: 'device',
    },
    text: state.labels.deviceLabel || state.labels.deviceStep,
  });
  deviceSection.appendChild(deviceLabel);

  // Create device select
  components.deviceSelect = Select({
    id: 'device',
    name: 'device',
    placeholder: state.labels.devicePlaceholder,
    options: state.devices.map((d) => ({
      value: d.id.toString(),
      label: d.name,
    })),
    value: state.selectedDevice,
    disabled: state.devices.length === 0,
    onChange: (event, value) => {
      if (typeof state.onDeviceChange === 'function') {
        state.onDeviceChange(value);
      }
    },
  });
  deviceSection.appendChild(components.deviceSelect.getElement());
  form.appendChild(deviceSection);

  // Create condition section with label
  const conditionSection = createElement('div', {
    classes: 'form-group',
    attributes: {
      role: 'group',
      'aria-labelledby': 'condition-label',
    },
  });

  const conditionLabel = createElement('label', {
    classes: 'form-group__label',
    attributes: {
      id: 'condition-label',
    },
    text: state.labels.conditionLabel || state.labels.conditionStep,
  });
  conditionSection.appendChild(conditionLabel);

  // Create condition selector
  components.conditionSelector = ConditionSelector({
    conditions: state.conditions,
    selectedId: state.selectedCondition,
    isLoading: state.loading.conditions || false,
    onSelect: (conditionId) => {
      if (typeof state.onConditionChange === 'function') {
        state.onConditionChange(conditionId);
      }
    },
  });
  conditionSection.appendChild(components.conditionSelector.getElement());
  form.appendChild(conditionSection);

  // Add price display
  components.priceDisplay = PriceDisplay({
    label: state.labels.priceLabel,
    value: state.priceDisplayText,
    isPlaceholder: !state.currentPrice,
    isLoading: state.loading.price || false,
    isError: state.error.price || false,
  });
  form.appendChild(components.priceDisplay.getElement());

  // Create actions container
  const actionsContainer = createElement('div', {
    classes: 'used-phone-price-form__actions',
  });

  // Create submit button
  components.submitButton = Button({
    text: state.loading.submit
      ? state.labels.submitButtonLoadingText
      : state.labels.submitButtonText,
    type: 'submit',
    onClick: () => {
      if (typeof state.onSubmit === 'function' && canSubmit(state)) {
        // Start the submit animation
        if (state.animationEnabled) {
          triggerAnimation(form, 'submit');
        }

        const formData = {
          manufacturerId: state.selectedManufacturer,
          deviceId: state.selectedDevice,
          conditionId: state.selectedCondition,
          price: state.currentPrice?.price,
          manufacturerName: getSelectedName(
            state.manufacturers,
            state.selectedManufacturer
          ),
          deviceName: getSelectedName(state.devices, state.selectedDevice),
          conditionName: getSelectedName(
            state.conditions,
            state.selectedCondition
          ),
        };

        try {
          state.onSubmit(formData);
        } catch (error) {
          // Graceful error recovery - at least log the error and show user feedback
          console.error('Error during form submission:', error);

          // Attempt to show an error message to the user
          if (components.priceDisplay) {
            components.priceDisplay.setError(
              state.labels.submitError ||
                'Error during submission. Please try again.'
            );
          }
        }
      }
    },
    disabled: !canSubmit(state) || state.loading.submit,
    attributes: {
      'aria-busy': state.loading.submit ? 'true' : 'false',
      'aria-disabled':
        !canSubmit(state) || state.loading.submit ? 'true' : 'false',
    },
  });
  actionsContainer.appendChild(components.submitButton.getElement());

  // Add actions container to form
  form.appendChild(actionsContainer);

  // Create announcement element for screen readers
  const srAnnouncement = createElement('div', {
    classes: 'sr-only',
    attributes: {
      'aria-live': 'assertive',
      role: 'status',
      id: 'form-status-announcer',
    },
  });

  if (state.statusMessage) {
    srAnnouncement.textContent = state.statusMessage;
  }

  form.appendChild(srAnnouncement);

  // Store components for easier access in updates
  form._components = components;

  // Add animation end listener for cleanup
  if (state.animationEnabled) {
    form.addEventListener('animationend', () => {
      form.classList.remove('used-phone-price-form--animating');
      form.classList.remove('used-phone-price-form--animate-step');
      form.classList.remove('used-phone-price-form--animate-submit');
      form.classList.remove('used-phone-price-form--animate-error');

      // Update state to reflect animation completion
      state.isAnimating = false;
    });
  }

  return form;
};

/**
 * Helper function to get selected item name
 * @private
 * @param {Array} items - Array of items
 * @param {string} selectedId - Selected ID
 * @returns {string} Name of the selected item
 */
const getSelectedName = (items, selectedId) => {
  const item = items.find((i) => i.id.toString() === selectedId);
  return item ? item.name : '';
};

/**
 * Check if form can be submitted
 * @private
 * @param {Object} state - Component state
 * @returns {boolean} Whether the form can be submitted
 */
const canSubmit = (state) => {
  return (
    !!state.selectedManufacturer &&
    !!state.selectedDevice &&
    !!state.selectedCondition &&
    !!state.currentPrice
  );
};

/**
 * Create default labels object with all required text
 * @private
 * @returns {Object} Default labels
 */
const createDefaultLabels = () => {
  return {
    manufacturerStep: 'Hersteller',
    deviceStep: 'Modell',
    conditionStep: 'Zustand',
    manufacturerLabel: 'Hersteller',
    deviceLabel: 'Modell',
    conditionLabel: 'Zustand',
    manufacturerPlaceholder: 'Hersteller auswählen',
    devicePlaceholder: 'Zuerst Hersteller auswählen',
    initialPriceText: 'Bitte wählen Sie Hersteller, Modell und Zustand',
    loadingPriceText: 'Preis wird geladen...',
    priceLabel: 'Unser Angebot:',
    priceNotAvailable: 'Preis nicht verfügbar',
    deviceLoadError: 'Fehler beim Laden der Geräte',
    actionLoadError: 'Fehler beim Laden der Services',
    priceLoadError: 'Fehler beim Laden des Preises',
    submitError: 'Fehler beim Senden. Bitte versuchen Sie es erneut.',
    submitButtonText: 'Verkaufen',
    submitButtonLoadingText: 'Wird verarbeitet...',
    conditionNewLabel: 'Neu',
    conditionGoodLabel: 'Gut',
    conditionFairLabel: 'Akzeptabel',
    conditionPoorLabel: 'Beschädigt',
    // Screen reader announcements
    manufacturerSelected:
      'Hersteller ausgewählt. Bitte wählen Sie nun das Modell.',
    deviceSelected: 'Modell ausgewählt. Bitte wählen Sie nun den Zustand.',
    conditionSelected: 'Zustand ausgewählt. Preis wird geladen.',
    priceLoaded: 'Preis geladen. Sie können jetzt verkaufen.',
    formComplete: 'Alle Felder ausgefüllt. Formular kann abgesendet werden.',
    formSubmitting: 'Formular wird gesendet...',
    formSubmitted: 'Formular erfolgreich gesendet!',
    formError:
      'Fehler beim Senden des Formulars. Bitte versuchen Sie es erneut.',
  };
};

/**
 * Format price for display
 * @private
 * @param {number} price - Price in cents or as a decimal
 * @returns {string} Formatted price
 */
const formatPrice = (price) => {
  // Check if price is valid
  if (price === undefined || price === null) {
    return 'Preis nicht verfügbar';
  }

  // Determine if price is in cents or euros
  let priceInEuros = price;
  if (price > 1000) {
    // Assuming price is in cents if it's a large number
    priceInEuros = price / 100;
  }

  // Format price with euro sign
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceInEuros);
};

/**
 * Create a UsedPhonePriceForm component
 * @param {Object} props - UsedPhonePriceForm properties
 * @returns {Object} UsedPhonePriceForm component API
 */
const createUsedPhonePriceForm = (props) => {
  // Validate props
  validateProps(props, createUsedPhonePriceForm.requiredProps);

  // Set default labels and merge with provided labels
  const defaultLabels = createDefaultLabels();
  const labels = { ...defaultLabels, ...(props.labels || {}) };

  // Initial state
  const initialState = {
    manufacturers: props.manufacturers || [],
    devices: props.devices || [],
    conditions: props.conditions || [],
    selectedManufacturer: props.selectedManufacturer || '',
    selectedDevice: props.selectedDevice || '',
    selectedCondition: props.selectedCondition || '',
    currentPrice: props.currentPrice || null,
    priceDisplayText: props.currentPrice
      ? formatPrice(props.currentPrice.price)
      : labels.initialPriceText,
    loading: props.loading || {},
    error: props.error || {},
    steps: [
      { name: labels.manufacturerStep, completed: false },
      { name: labels.deviceStep, completed: false },
      { name: labels.conditionStep, completed: false },
    ],
    activeStepIndex: 0,
    labels,
    className: props.className || '',
    showStepsIndicator: props.showStepsIndicator !== false,
    onManufacturerChange: props.onManufacturerChange,
    onDeviceChange: props.onDeviceChange,
    onConditionChange: props.onConditionChange,
    onSubmit: props.onSubmit,
    isLoading: Object.values(props.loading || {}).some(Boolean),
    hasError: Object.values(props.error || {}).some(Boolean),
    // New properties for animation and accessibility
    animationEnabled: props.animationEnabled !== false,
    isAnimating: false,
    animationTimeout: null,
    statusMessage: '',
    recoveryAttempts: 0, // Track error recovery attempts
  };

  // Update active step based on selections
  if (initialState.selectedManufacturer) {
    initialState.steps[0].completed = true;
    initialState.activeStepIndex = 1;

    if (initialState.selectedDevice) {
      initialState.steps[1].completed = true;
      initialState.activeStepIndex = 2;

      if (initialState.selectedCondition) {
        initialState.steps[2].completed = true;
      }
    }
  }

  // Create base component
  const usedPhonePriceForm = createBaseComponent(renderUsedPhonePriceForm)(
    initialState
  );

  // Track component state
  let state = { ...initialState };

  // Add state update method
  usedPhonePriceForm.setState = function (newState) {
    // Update state
    state = { ...state, ...newState };

    // Update active step and completion state based on selections
    const updatedSteps = [...state.steps];
    let activeIndex = 0;

    if (state.selectedManufacturer) {
      updatedSteps[0].completed = true;
      activeIndex = 1;

      // Set status message for screen readers
      if (newState.selectedManufacturer && !state.statusMessage) {
        state.statusMessage = state.labels.manufacturerSelected;
      }

      if (state.selectedDevice) {
        updatedSteps[1].completed = true;
        activeIndex = 2;

        // Set status message for screen readers
        if (newState.selectedDevice && !state.statusMessage) {
          state.statusMessage = state.labels.deviceSelected;
        }

        if (state.selectedCondition) {
          updatedSteps[2].completed = true;

          // Set status message for screen readers
          if (newState.selectedCondition && !state.statusMessage) {
            state.statusMessage = state.labels.conditionSelected;
          }
        }
      }
    }

    // Check if steps or activeIndex changed using more efficient comparison
    const stepsChanged = updatedSteps.some(
      (step, index) =>
        step.completed !== state.steps[index]?.completed ||
        step.name !== state.steps[index]?.name
    );

    if (stepsChanged || activeIndex !== state.activeStepIndex) {
      state.steps = updatedSteps;
      state.activeStepIndex = activeIndex;

      // If animation is enabled and it's a step transition, start animation
      if (state.animationEnabled && stepsChanged) {
        // Trigger step animation on the element
        const element = this.getElement();
        if (element) {
          triggerAnimation(element, 'step');
          state.isAnimating = true;
        }
      }
    }

    // Update loading and error flags
    state.isLoading = Object.values(state.loading || {}).some(Boolean);
    state.hasError = Object.values(state.error || {}).some(Boolean);

    // Update component with new state
    this.update(state);

    return this;
  };

  /**
   * Define the shouldRerender method to control when full re-renders happen
   */
  usedPhonePriceForm.shouldRerender = (newProps) => {
    // These props require a full re-render if they've actually changed
    return [
      'manufacturers',
      'devices',
      'conditions',
      'selectedManufacturer',
      'selectedDevice',
      'selectedCondition',
      'steps',
      'className',
      'showStepsIndicator',
    ].some(
      (prop) => newProps[prop] !== undefined && newProps[prop] !== state[prop]
    );
  };

  /**
   * Define the partialUpdate method for more efficient updates
   */
  usedPhonePriceForm.partialUpdate = (element, newProps) => {
    if (!element || !element._components) {
      console.debug(
        'UsedPhonePriceForm: Cannot perform partial update, invalid element'
      );
      return;
    }

    const components = element._components;

    // Update price display if price changed
    if (
      newProps.currentPrice !== undefined ||
      newProps.priceDisplayText !== undefined
    ) {
      if (components.priceDisplay) {
        const displayText =
          newProps.priceDisplayText ||
          (newProps.currentPrice
            ? formatPrice(newProps.currentPrice.price)
            : state.priceDisplayText);

        components.priceDisplay.setValue(
          displayText,
          !!newProps.currentPrice,
          !newProps.currentPrice
        );
      }
    }

    // Update price display loading state
    if (newProps.loading && components.priceDisplay) {
      components.priceDisplay.setLoading(newProps.loading.price || false);
    }

    // Update price display error state
    if (newProps.error && components.priceDisplay) {
      if (newProps.error.price) {
        components.priceDisplay.setError(newProps.error.price);
      } else {
        // Clear error if the error was resolved
        if (state.error && state.error.price) {
          components.priceDisplay.setValue(
            state.priceDisplayText,
            !!state.currentPrice,
            !state.currentPrice
          );
        }
      }
    }

    // Update condition selector loading state
    if (newProps.loading && components.conditionSelector) {
      components.conditionSelector.setLoading(
        newProps.loading.conditions || false
      );
    }

    // Update steps indicator if steps or activeIndex changed
    if (
      (newProps.steps || newProps.activeStepIndex !== undefined) &&
      components.stepsIndicator
    ) {
      // If step change, potentially animate the transition
      if (
        state.animationEnabled &&
        newProps.activeStepIndex !== undefined &&
        newProps.activeStepIndex !== state.activeStepIndex
      ) {
        // Animate step transition
        triggerAnimation(element, 'step');
      }

      components.stepsIndicator.update({
        steps: newProps.steps || state.steps,
        activeIndex:
          newProps.activeStepIndex !== undefined
            ? newProps.activeStepIndex
            : state.activeStepIndex,
      });
    }

    // Update submit button state
    if (
      newProps.selectedManufacturer !== undefined ||
      newProps.selectedDevice !== undefined ||
      newProps.selectedCondition !== undefined ||
      newProps.currentPrice !== undefined ||
      newProps.loading?.submit !== undefined
    ) {
      if (components.submitButton) {
        const updatedState = { ...state, ...newProps };
        const canSubmitNow = canSubmit(updatedState);
        const isSubmitting = newProps.loading?.submit || state.loading.submit;

        components.submitButton.setDisabled(!canSubmitNow || isSubmitting);

        if (isSubmitting !== state.loading.submit) {
          components.submitButton.setText(
            isSubmitting
              ? state.labels.submitButtonLoadingText
              : state.labels.submitButtonText
          );
        }

        // Update ARIA attributes
        const buttonElement = components.submitButton.getElement();
        if (buttonElement) {
          buttonElement.setAttribute(
            'aria-busy',
            isSubmitting ? 'true' : 'false'
          );
          buttonElement.setAttribute(
            'aria-disabled',
            !canSubmitNow || isSubmitting ? 'true' : 'false'
          );
        }
      }
    }

    // Update form styling classes
    if (newProps.isLoading !== undefined) {
      element.classList.toggle(
        'used-phone-price-form--loading',
        newProps.isLoading
      );
      element.setAttribute('aria-busy', newProps.isLoading ? 'true' : 'false');
    }

    if (newProps.hasError !== undefined) {
      element.classList.toggle(
        'used-phone-price-form--error',
        newProps.hasError
      );
      element.setAttribute(
        'aria-invalid',
        newProps.hasError ? 'true' : 'false'
      );
    }

    // Update status message for screen readers
    if (
      newProps.statusMessage !== undefined &&
      newProps.statusMessage !== state.statusMessage
    ) {
      const statusEl = element.querySelector('#form-status-announcer');
      if (statusEl) {
        statusEl.textContent = newProps.statusMessage;
      }
    }
  };

  // Add convenience methods to match the previous API

  /**
   * Set form loading state
   * @param {Object} loading - Loading state object
   * @returns {Object} Component instance for chaining
   */
  usedPhonePriceForm.setLoading = function (loading) {
    // Update status message for screen readers
    let statusMessage = '';

    if (loading.manufacturers) {
      statusMessage = 'Lade Hersteller...';
    } else if (loading.devices) {
      statusMessage = 'Lade Geräte...';
    } else if (loading.conditions) {
      statusMessage = 'Lade Zustände...';
    } else if (loading.price) {
      statusMessage = this.state?.labels?.loadingPriceText || 'Lade Preis...';
    } else if (loading.submit) {
      statusMessage = this.state?.labels?.formSubmitting || 'Sende Formular...';
    }

    return this.setState({
      loading,
      isLoading: Object.values(loading).some(Boolean),
      statusMessage,
    });
  };

  /**
   * Set form error state
   * @param {Object} error - Error state object
   * @returns {Object} Component instance for chaining
   */
  usedPhonePriceForm.setErrors = function (error) {
    // Update price display error state if needed
    const element = this.getElement();
    if (element && element._components && element._components.priceDisplay) {
      const priceDisplay = element._components.priceDisplay;

      if (error.price) {
        // Set error state on price display
        priceDisplay.setError(error.price);
      } else if (error.devices) {
        // Set error for device loading
        priceDisplay.setError(
          state.labels.deviceLoadError || 'Error loading devices'
        );
      } else if (error.conditions) {
        // Set error for condition loading
        priceDisplay.setError(
          state.labels.actionLoadError || 'Error loading conditions'
        );
      } else if (
        Object.keys(error).length === 0 &&
        state.error &&
        (state.error.price || state.error.devices || state.error.conditions)
      ) {
        // Clear error state if errors were removed
        priceDisplay.setValue(
          state.priceDisplayText || state.labels.initialPriceText,
          !!state.currentPrice,
          !state.currentPrice
        );
      }
    }

    return this.setState({
      error,
      hasError: Object.values(error).some(Boolean),
    });
  };

  /**
   * Set manufacturers data
   * @param {Array} manufacturers - Manufacturers array
   * @returns {Object} Component instance for chaining
   */
  usedPhonePriceForm.setManufacturers = function (manufacturers) {
    // Get the component element and update the manufacturer select
    const element = this.getElement();
    if (
      element &&
      element._components &&
      element._components.manufacturerSelect
    ) {
      element._components.manufacturerSelect.updateOptions(
        manufacturers.map((m) => ({ value: m.id.toString(), label: m.name }))
      );
    }

    return this.setState({
      manufacturers,
      statusMessage:
        manufacturers.length > 0
          ? `${manufacturers.length} Hersteller geladen.`
          : 'Keine Hersteller verfügbar.',
    });
  };

  /**
   * Set devices data
   * @param {Array} devices - Devices array
   * @returns {Object} Component instance for chaining
   */
  usedPhonePriceForm.setDevices = function (devices) {
    // Get the component element and update the device select
    const element = this.getElement();
    if (element && element._components && element._components.deviceSelect) {
      element._components.deviceSelect.updateOptions(
        devices.map((d) => ({ value: d.id.toString(), label: d.name }))
      );

      // Enable/disable the select based on available devices
      element._components.deviceSelect.update({
        disabled: devices.length === 0,
      });
    }

    return this.setState({
      devices,
      statusMessage:
        devices.length > 0
          ? `${devices.length} Geräte geladen.`
          : 'Keine Geräte verfügbar.',
    });
  };

  /**
   * Set conditions data
   * @param {Array} conditions - Conditions array
   * @returns {Object} Component instance for chaining
   */
  usedPhonePriceForm.setConditions = function (conditions) {
    // Get the component element and update the condition selector directly
    const element = this.getElement();
    if (
      element &&
      element._components &&
      element._components.conditionSelector
    ) {
      element._components.conditionSelector.updateConditions(conditions);
      element._components.conditionSelector.setLoading(false);
    }

    return this.setState({ conditions });
  };

  /**
   * Set price data
   * @param {Object} price - Price data object
   * @returns {Object} Component instance for chaining
   */
  usedPhonePriceForm.setPrice = function (price) {
    let priceDisplayText = state.labels.initialPriceText;
    let statusMessage = '';

    if (price) {
      priceDisplayText = formatPrice(price.price);
      statusMessage = `Preis: ${formatPrice(price.price)}. ${state.labels.formComplete}`;

      // Animate price update if animations are enabled
      const element = this.getElement();
      if (
        state.animationEnabled &&
        element &&
        element._components?.priceDisplay
      ) {
        const priceElement = element._components.priceDisplay.getElement();

        // Add animation class
        priceElement.classList.add('price-display--highlight');

        // Remove animation class after animation completes
        setTimeout(() => {
          priceElement.classList.remove('price-display--highlight');
        }, 1000);
      }
    }

    return this.setState({
      currentPrice: price,
      priceDisplayText,
      statusMessage,
    });
  };

  // Add theme change handler with visual feedback
  usedPhonePriceForm.onThemeChange = (newTheme, previousTheme) => {
    console.debug(
      `UsedPhonePriceForm: theme changed from ${previousTheme} to ${newTheme}`
    );

    // Apply visual feedback for theme change
    const element = usedPhonePriceForm.getElement();
    if (element && state.animationEnabled) {
      // Add a theme transition class
      element.classList.add('used-phone-price-form--theme-transition');

      // Remove the class after animation completes
      setTimeout(() => {
        element.classList.remove('used-phone-price-form--theme-transition');
      }, 1000);
    }
  };

  // Enhanced destroy method with proper cleanup
  const originalDestroy = usedPhonePriceForm.destroy;
  usedPhonePriceForm.destroy = function () {
    // Clear any pending animation timeouts
    if (state.animationTimeout) {
      clearTimeout(state.animationTimeout);
      state.animationTimeout = null;
    }

    // Call the original destroy method
    if (originalDestroy) {
      originalDestroy.call(this);
    }
  };

  return usedPhonePriceForm;
};

// Define required props for validation
createUsedPhonePriceForm.requiredProps = [];

// Create the component with theme awareness
const UsedPhonePriceForm = withThemeAwareness(
  createComponent('UsedPhonePriceForm', createUsedPhonePriceForm)
);

// Export as a factory function
export default UsedPhonePriceForm;
