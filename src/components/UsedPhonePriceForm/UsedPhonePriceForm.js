// src/components/UsedPhonePriceForm/UsedPhonePriceForm.js
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

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { usedPhonePriceFormStyles } from './UsedPhonePriceForm.styles.js';

// Create style injector for UsedPhonePriceForm component
const injectUsedPhonePriceFormStyles =
  createStyleInjector('UsedPhonePriceForm');

/**
 * ALGORITHMIC OPTIMIZATION: O(1) Lookup Maps
 * Creates lookup maps for O(1) name resolution instead of O(n) searches
 * @private
 */
const createLookupMaps = (state) => {
  const maps = {
    manufacturers: new Map(),
    devices: new Map(),
    conditions: new Map(),
  };

  // Build manufacturer lookup map
  state.manufacturers.forEach((item) => {
    const id = (item.id || item.value)?.toString();
    if (id) maps.manufacturers.set(id, item.name || item.label || '');
  });

  // Build device lookup map
  state.devices.forEach((item) => {
    const id = (item.id || item.value)?.toString();
    if (id) maps.devices.set(id, item.name || item.label || '');
  });

  // Build condition lookup map
  state.conditions.forEach((item) => {
    const id = (item.id || item.value)?.toString();
    if (id) maps.conditions.set(id, item.name || item.label || '');
  });

  return maps;
};

/**
 * ALGORITHMIC OPTIMIZATION: Mathematical Step Progression
 * Uses mathematical calculation instead of imperative step logic
 * @private
 */
const calculateStepProgression = (state) => {
  // Mathematical approach: count valid selections to determine progress
  const selections = [
    state.selectedManufacturer,
    state.selectedDevice,
    state.selectedCondition,
  ];

  // Count completed selections
  const completedCount = selections.filter(Boolean).length;

  // Mathematical formulas for step states
  const activeStepIndex = Math.min(completedCount, 2);
  const stepStates = selections.map((selection, index) => ({
    ...state.steps[index],
    completed: Boolean(selection) && index < completedCount,
  }));

  return { activeStepIndex, steps: stepStates };
};

/**
 * ALGORITHMIC OPTIMIZATION: Memoized Transform
 * Caches transformation results to avoid redundant O(n) operations
 * @private
 */
const transformToSelectOptions = (() => {
  const cache = new WeakMap();

  return (items) => {
    if (!Array.isArray(items)) return [];

    // Check cache first - O(1) lookup
    if (cache.has(items)) {
      return cache.get(items);
    }

    // Transform and cache - O(n) only when needed
    const options = items.map((item) => ({
      value: (item.id || item.value)?.toString() || '',
      label: item.name || item.label || item.value || '',
    }));

    cache.set(items, options);
    return options;
  };
})();

/**
 * ALGORITHMIC OPTIMIZATION: O(1) Name Resolution
 * Uses lookup maps for constant-time name resolution
 * @private
 */
const resolveNames = (state, lookupMaps) => {
  return {
    manufacturerName:
      lookupMaps.manufacturers.get(state.selectedManufacturer) || '',
    deviceName: lookupMaps.devices.get(state.selectedDevice) || '',
    conditionName: lookupMaps.conditions.get(state.selectedCondition) || '',
  };
};

/**
 * ALGORITHMIC OPTIMIZATION: Enhanced Submission Logic
 * Uses bitwise operations for ultra-fast validation checks
 * @private
 */
const canSubmit = (state) => {
  // Convert boolean conditions to bits for fast evaluation
  const hasManufacturer = state.selectedManufacturer ? 1 : 0;
  const hasDevice = state.selectedDevice ? 1 : 0;
  const hasCondition = state.selectedCondition ? 1 : 0;
  const hasPrice =
    state.currentPrice && state.currentPrice.price != null ? 1 : 0;
  const notLoading = !Object.values(state.loadingStates).some(Boolean) ? 1 : 0;

  // Bitwise AND: all conditions must be true (all bits set)
  const allConditions =
    hasManufacturer & hasDevice & hasCondition & hasPrice & notLoading;
  return Boolean(allConditions);
};

/**
 * ALGORITHMIC OPTIMIZATION: Mathematical Price Formatting
 * Uses mathematical operations instead of conditional logic
 * @private
 */
const formatPrice = (price) => {
  if (price == null) return 'Preis nicht verfügbar';

  // Mathematical conversion: automatically handle cents vs euros
  const priceInEuros = price > 1000 ? price / 100 : price;

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceInEuros);
};

/**
 * ALGORITHMIC OPTIMIZATION: Animation Trigger with Mathematical Timing
 * @private
 */
const triggerAnimation = (element, animationType) => {
  if (!element) return;

  // Remove any existing animation classes efficiently
  const animationClasses = [
    'used-phone-price-form--animate-step',
    'used-phone-price-form--animate-submit',
    'used-phone-price-form--animate-error',
  ];

  animationClasses.forEach((cls) => element.classList.remove(cls));

  // Add the animation class
  element.classList.add('used-phone-price-form--animating');
  element.classList.add(`used-phone-price-form--animate-${animationType}`);

  // Force a reflow for smooth animation
  void element.offsetWidth;
};

/**
 * Creates the used phone price form DOM element
 * @param {Object} state - Component state
 * @returns {HTMLElement} - Used phone price form element
 */
const renderUsedPhonePriceForm = (state) => {
  // Inject styles on render (automatically cached)
  injectUsedPhonePriceFormStyles(usedPhonePriceFormStyles);

  const classNames = [
    'used-phone-price-form',
    state.className,
    state.hasError ? 'used-phone-price-form--error' : '',
    state.isLoading ? 'used-phone-price-form--loading' : '',
  ].filter(Boolean);

  const form = createElement('form', {
    classes: classNames,
    attributes: {
      role: 'form',
      'aria-live': 'polite',
      'aria-busy': state.isLoading ? 'true' : 'false',
    },
    events: {
      submit: (e) => e.preventDefault(),
    },
  });

  const components = {};

  // Create lookup maps for O(1) name resolution
  const lookupMaps = createLookupMaps(state);

  // Add steps indicator if enabled
  if (
    state.showStepsIndicator &&
    Array.isArray(state.steps) &&
    state.steps.length > 0
  ) {
    components.stepsIndicator = StepsIndicator({
      steps: state.steps,
      activeIndex: state.activeStepIndex,
    });
    form.appendChild(components.stepsIndicator.getElement());
  }

  // Create manufacturer select with memoized options
  const manufacturerOptions = transformToSelectOptions(state.manufacturers);
  components.manufacturerSelect = Select({
    id: 'manufacturer',
    name: 'manufacturer',
    placeholder: state.labels.manufacturerPlaceholder,
    options: manufacturerOptions,
    value: state.selectedManufacturer,
    loading: state.loadingStates.manufacturers,
    loadingText: state.labels.manufacturerLoadingText,
    emptyText: state.labels.manufacturerEmptyText,
    onChange: (event, value) => {
      if (typeof state.onManufacturerChange === 'function') {
        setTimeout(() => state.onManufacturerChange(value), 0);
      }
    },
    showValidation: false,
  });
  form.appendChild(components.manufacturerSelect.getElement());

  // Create device select with memoized options
  const deviceOptions = transformToSelectOptions(state.devices);
  components.deviceSelect = Select({
    id: 'device',
    name: 'device',
    placeholder: state.labels.devicePlaceholder,
    options: deviceOptions,
    value: state.selectedDevice,
    disabled: !state.selectedManufacturer,
    loading: state.loadingStates.devices,
    loadingText: state.labels.deviceLoadingText,
    emptyText: state.selectedManufacturer
      ? state.labels.deviceEmptyText
      : state.labels.deviceWaitingText,
    onChange: (event, value) => {
      if (typeof state.onDeviceChange === 'function') {
        setTimeout(() => state.onDeviceChange(value), 0);
      }
    },
    showValidation: false,
  });
  form.appendChild(components.deviceSelect.getElement());

  // Create condition selector with improved UX logic
  // Show appropriate waiting text based on selection state
  let conditionDisabled = true;
  let conditionWaitingText = '';

  if (!state.selectedManufacturer) {
    // If no manufacturer selected, show same message as device
    conditionWaitingText = state.labels.deviceWaitingText;
  } else if (!state.selectedDevice) {
    // If manufacturer selected but no device, show condition waiting text
    conditionWaitingText = state.labels.conditionWaitingText;
  } else {
    // If device selected, enable condition selector
    conditionDisabled = false;
  }

  components.conditionSelector = ConditionSelector({
    conditions: state.conditions,
    selectedId: state.selectedCondition,
    loading: state.loadingStates.conditions || false,
    disabled: conditionDisabled,
    waitingText: conditionWaitingText,
    onChange: (conditionId) => {
      if (typeof state.onConditionChange === 'function') {
        setTimeout(() => state.onConditionChange(conditionId), 0);
      }
    },
  });
  form.appendChild(components.conditionSelector.getElement());

  // Add price display
  components.priceDisplay = PriceDisplay({
    label: state.labels.priceLabel,
    value: state.priceDisplayText,
    isPlaceholder: !state.currentPrice,
    loading: state.loadingStates.price || false,
    isError: !!state.error.price,
    isHighlighted: true,
  });
  form.appendChild(components.priceDisplay.getElement());

  // Create actions container
  const actionsContainer = createElement('div', {
    classes: 'used-phone-price-form__actions',
  });

  // Create submit button with algorithmic validation
  const canSubmitNow = canSubmit(state);
  components.submitButton = Button({
    text: state.loadingStates.submit
      ? state.labels.submitButtonLoadingText
      : state.labels.submitButtonText,
    type: 'submit',
    onClick: () => {
      if (typeof state.onSubmit === 'function' && canSubmit(state)) {
        // Start the submit animation
        if (state.animationEnabled) {
          triggerAnimation(form, 'submit');
        }

        // Use O(1) lookup maps for name resolution
        const names = resolveNames(state, lookupMaps);

        const formData = {
          manufacturerId: state.selectedManufacturer,
          deviceId: state.selectedDevice,
          conditionId: state.selectedCondition,
          price: state.currentPrice?.price,
          manufacturerName: names.manufacturerName,
          deviceName: names.deviceName,
          conditionName: names.conditionName,
          timestamp: new Date().toISOString(),
        };

        try {
          state.onSubmit(formData);
        } catch (error) {
          console.error(
            'UsedPhonePriceForm: Error in onSubmit callback:',
            error
          );
        }
      }
    },
    disabled: !canSubmitNow,
    attributes: {
      'aria-busy': state.loadingStates.submit ? 'true' : 'false',
    },
  });
  actionsContainer.appendChild(components.submitButton.getElement());

  form.appendChild(actionsContainer);

  // Store components and current state for updates
  form._components = components;
  form._currentState = { ...state };
  form._lookupMaps = lookupMaps; // Cache lookup maps

  return form;
};

/**
 * Create default labels object
 * @private
 */
const createDefaultLabels = () => {
  return {
    manufacturerStep: 'Hersteller',
    deviceStep: 'Modell',
    conditionStep: 'Zustand',
    manufacturerPlaceholder: 'Hersteller auswählen',
    devicePlaceholder: 'Modell auswählen',
    manufacturerLoadingText: 'Hersteller werden geladen...',
    deviceLoadingText: 'Modelle werden geladen...',
    manufacturerEmptyText: 'Keine Hersteller verfügbar',
    deviceEmptyText: 'Keine Modelle für diesen Hersteller verfügbar',
    deviceWaitingText: 'Bitte zuerst Hersteller auswählen',
    conditionWaitingText: 'Bitte zuerst Modell auswählen',
    initialPriceText: 'Bitte wählen Sie Hersteller, Modell und Zustand',
    loadingPriceText: 'Preis wird geladen...',
    priceLabel: 'Unser Angebot:',
    priceNotAvailable: 'Preis nicht verfügbar',
    submitButtonText: 'Verkaufen',
    submitButtonLoadingText: 'Wird verarbeitet...',
    conditionNewLabel: 'Neu',
    conditionGoodLabel: 'Gut',
    conditionFairLabel: 'Akzeptabel',
    conditionPoorLabel: 'Beschädigt',
  };
};

/**
 * Create a UsedPhonePriceForm component
 * @param {Object} props - UsedPhonePriceForm properties
 * @returns {Object} UsedPhonePriceForm component API
 */
const createUsedPhonePriceForm = (props) => {
  validateProps(props, createUsedPhonePriceForm.requiredProps);

  const defaultLabels = createDefaultLabels();
  const labels = { ...defaultLabels, ...(props.labels || {}) };

  // Standardize props - migrate from loading to loadingStates
  const loadingStates = props.loadingStates || props.loading || {};

  // Enhanced initial state with better defaults
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
    loadingStates: {
      manufacturers: false,
      devices: false,
      conditions: false,
      price: false,
      submit: false,
      ...loadingStates,
    },
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
    hasError: Object.values(props.error || {}).some(Boolean),
    isLoading: Object.values(loadingStates).some(Boolean),
    animationEnabled: props.animationEnabled !== false,
  };

  // Apply mathematical step progression
  const stepProgression = calculateStepProgression(initialState);
  initialState.activeStepIndex = stepProgression.activeStepIndex;
  initialState.steps = stepProgression.steps;

  const usedPhonePriceForm = createBaseComponent(renderUsedPhonePriceForm)(
    initialState
  );

  // Maintain component state reference
  let currentState = { ...initialState };

  // Enhanced state update method with algorithmic optimization
  usedPhonePriceForm.setState = function (newState) {
    // Handle prop standardization when updating
    if (newState.loading && !newState.loadingStates) {
      newState.loadingStates = newState.loading;
      delete newState.loading;
    }

    // Update state
    currentState = { ...currentState, ...newState };

    // Apply mathematical step progression
    const stepProgression = calculateStepProgression(currentState);
    currentState.activeStepIndex = stepProgression.activeStepIndex;
    currentState.steps = stepProgression.steps;

    currentState.hasError = Object.values(currentState.error || {}).some(
      Boolean
    );
    currentState.isLoading = Object.values(
      currentState.loadingStates || {}
    ).some(Boolean);

    // Store state on element for container access
    const element = this.getElement();
    if (element) {
      element._state = currentState;
      element._currentState = currentState;
    }

    // Efficient partial updates
    this.partialUpdate(element, newState);
    return this;
  };

  usedPhonePriceForm.shouldRerender = (newProps) => {
    return [
      'manufacturers',
      'devices',
      'conditions',
      'selectedManufacturer',
      'selectedDevice',
      'selectedCondition',
      'className',
    ].some(
      (prop) =>
        newProps[prop] !== undefined && newProps[prop] !== currentState[prop]
    );
  };

  usedPhonePriceForm.partialUpdate = (element, newProps) => {
    if (!element?._components) return;

    const components = element._components;

    // Standardize props for update
    const loadingStates = newProps.loadingStates || newProps.loading || {};
    if (newProps.loading && !newProps.loadingStates) {
      newProps.loadingStates = newProps.loading;
    }

    // Check if steps need updating with mathematical approach
    const needsStepsUpdate = [
      'selectedManufacturer',
      'selectedDevice',
      'selectedCondition',
    ].some((key) => newProps[key] !== undefined);

    // Update manufacturer select with memoized transformation
    if (
      newProps.manufacturers !== undefined ||
      loadingStates.manufacturers !== undefined ||
      newProps.selectedManufacturer !== undefined
    ) {
      const manufacturerOptions = transformToSelectOptions(
        newProps.manufacturers || currentState.manufacturers
      );
      components.manufacturerSelect?.update({
        options: manufacturerOptions,
        loading:
          loadingStates.manufacturers ??
          currentState.loadingStates.manufacturers,
        value:
          newProps.selectedManufacturer ?? currentState.selectedManufacturer,
      });
    }

    // Update device select with memoized transformation
    if (
      newProps.devices !== undefined ||
      loadingStates.devices !== undefined ||
      newProps.selectedManufacturer !== undefined ||
      newProps.selectedDevice !== undefined
    ) {
      const deviceOptions = transformToSelectOptions(
        newProps.devices || currentState.devices
      );
      const deviceLoading =
        loadingStates.devices ?? currentState.loadingStates.devices;
      const manufacturerSelected =
        newProps.selectedManufacturer ?? currentState.selectedManufacturer;

      components.deviceSelect?.update({
        options: deviceOptions,
        loading: deviceLoading,
        disabled: !manufacturerSelected,
        value: newProps.selectedDevice ?? currentState.selectedDevice,
        emptyText: manufacturerSelected
          ? currentState.labels.deviceEmptyText
          : currentState.labels.deviceWaitingText,
      });
    }

    // Update condition selector with improved UX logic
    if (
      newProps.conditions !== undefined ||
      loadingStates.conditions !== undefined ||
      newProps.selectedDevice !== undefined ||
      newProps.selectedCondition !== undefined ||
      newProps.selectedManufacturer !== undefined
    ) {
      const conditionLoading =
        loadingStates.conditions ?? currentState.loadingStates.conditions;
      const deviceSelected =
        newProps.selectedDevice ?? currentState.selectedDevice;
      const manufacturerSelected =
        newProps.selectedManufacturer ?? currentState.selectedManufacturer;

      // Improved UX: determine appropriate waiting text
      let conditionDisabled = true;
      let conditionWaitingText = '';

      if (!manufacturerSelected) {
        conditionWaitingText = currentState.labels.deviceWaitingText;
      } else if (!deviceSelected) {
        conditionWaitingText = currentState.labels.conditionWaitingText;
      } else {
        conditionDisabled = false;
      }

      components.conditionSelector?.update({
        conditions: newProps.conditions || currentState.conditions,
        loading: conditionLoading,
        disabled: conditionDisabled,
        waitingText: conditionWaitingText,
        selectedId:
          newProps.selectedCondition ?? currentState.selectedCondition,
      });
    }

    // Update price display
    if (
      newProps.currentPrice !== undefined ||
      newProps.priceDisplayText !== undefined ||
      loadingStates.price !== undefined ||
      newProps.error?.price !== undefined
    ) {
      const displayText =
        newProps.priceDisplayText ||
        (newProps.currentPrice
          ? formatPrice(newProps.currentPrice.price)
          : currentState.priceDisplayText);

      components.priceDisplay?.update({
        value: displayText,
        isPlaceholder: !newProps.currentPrice && !currentState.currentPrice,
        loading: loadingStates.price ?? currentState.loadingStates.price,
        isError: !!(newProps.error?.price || currentState.error.price),
      });
    }

    // Update steps indicator with mathematical approach
    if (needsStepsUpdate && components.stepsIndicator) {
      components.stepsIndicator.update({
        steps: currentState.steps,
        activeIndex: currentState.activeStepIndex,
      });
    }

    // Update submit button with algorithmic validation
    if (
      [
        'selectedManufacturer',
        'selectedDevice',
        'selectedCondition',
        'currentPrice',
        'loadingStates',
        'loading',
      ].some((key) => newProps[key] !== undefined)
    ) {
      const canSubmitNow = canSubmit({
        ...currentState,
        ...newProps,
        loadingStates:
          newProps.loadingStates ||
          newProps.loading ||
          currentState.loadingStates,
      });
      const isSubmitting =
        loadingStates.submit ?? currentState.loadingStates.submit;

      components.submitButton?.setDisabled(!canSubmitNow || isSubmitting);

      if (loadingStates.submit !== undefined) {
        components.submitButton?.setText(
          isSubmitting
            ? currentState.labels.submitButtonLoadingText
            : currentState.labels.submitButtonText
        );
      }
    }

    // Update form error styling
    if (newProps.hasError !== undefined) {
      element.classList.toggle(
        'used-phone-price-form--error',
        newProps.hasError
      );
    }

    // Update form loading styling
    if (newProps.isLoading !== undefined) {
      element.classList.toggle(
        'used-phone-price-form--loading',
        newProps.isLoading
      );
    }
  };

  // Convenience methods
  usedPhonePriceForm.setLoading = function (loadingState) {
    const mergedLoading = { ...currentState.loadingStates, ...loadingState };
    return this.setState({
      loadingStates: mergedLoading,
      isLoading: Object.values(mergedLoading).some(Boolean),
    });
  };

  usedPhonePriceForm.setErrors = function (errorState) {
    return this.setState({
      error: errorState,
      hasError: Object.values(errorState).some(Boolean),
    });
  };

  usedPhonePriceForm.setManufacturers = function (manufacturers) {
    return this.setState({ manufacturers });
  };

  usedPhonePriceForm.setDevices = function (devices) {
    return this.setState({ devices });
  };

  usedPhonePriceForm.setConditions = function (conditions) {
    return this.setState({ conditions });
  };

  usedPhonePriceForm.setPrice = function (price) {
    const priceDisplayText = price
      ? formatPrice(price.price)
      : currentState.labels.initialPriceText;
    return this.setState({ currentPrice: price, priceDisplayText });
  };

  usedPhonePriceForm.getCurrentState = function () {
    return { ...currentState };
  };

  // Enhanced update method with validation
  usedPhonePriceForm.update = function (newProps) {
    try {
      validateProps(newProps, createUsedPhonePriceForm.requiredProps);

      // Standardize props
      if (newProps.loading && !newProps.loadingStates) {
        newProps.loadingStates = newProps.loading;
        delete newProps.loading;
      }

      if (this.shouldRerender(newProps)) {
        return createBaseComponent.prototype.update.call(this, {
          ...currentState,
          ...newProps,
        });
      } else {
        return this.setState(newProps);
      }
    } catch (error) {
      console.error('UsedPhonePriceForm update error:', error);
      return this;
    }
  };

  usedPhonePriceForm.onThemeChange = (theme, previousTheme) => {
    // Component can react to theme changes if needed
    console.log(
      `UsedPhonePriceForm theme changed: ${previousTheme} -> ${theme}`
    );
  };

  // Initialize element state reference
  const element = usedPhonePriceForm.getElement();
  if (element) {
    element._state = currentState;
    element._currentState = currentState;
  }

  return usedPhonePriceForm;
};

createUsedPhonePriceForm.requiredProps = [];

const UsedPhonePriceForm = withThemeAwareness(
  createComponent('UsedPhonePriceForm', createUsedPhonePriceForm)
);

export default UsedPhonePriceForm;
