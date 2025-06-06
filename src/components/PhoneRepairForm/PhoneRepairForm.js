// src/components/PhoneRepairForm/PhoneRepairForm.js
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { phoneRepairFormStyles } from './PhoneRepairForm.styles.js';
import Button from '../Button/Button.js';
import Select from '../Select/Select.js';
import StepsIndicator from '../StepsIndicator/StepsIndicator.js';
import PriceDisplay from '../PriceDisplay/PriceDisplay.js';

// Create style injector for PhoneRepairForm component
const injectPhoneRepairFormStyles = createStyleInjector('PhoneRepairForm');

/**
 * ALGORITHMIC OPTIMIZATION: O(1) Lookup Maps
 * Creates lookup maps for O(1) name resolution instead of O(n) searches
 * @private
 */
const createLookupMaps = (state) => {
  const maps = {
    manufacturers: new Map(),
    devices: new Map(),
    actions: new Map(),
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

  // Build action lookup map
  state.actions.forEach((item) => {
    const id = (item.id || item.value)?.toString();
    if (id) maps.actions.set(id, item.name || item.label || '');
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
    state.selectedAction,
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
    actionName: lookupMaps.actions.get(state.selectedAction) || '',
  };
};

/**
 * ALGORITHMIC OPTIMIZATION: Enhanced Scheduling Logic
 * Uses bitwise operations with comprehensive validation for ultra-fast validation checks
 * @private
 */
const canSchedule = (state) => {
  // Convert boolean conditions to bits for fast evaluation
  const hasManufacturer = state.selectedManufacturer ? 1 : 0;
  const hasDevice = state.selectedDevice ? 1 : 0;
  const hasAction = state.selectedAction ? 1 : 0;
  const hasPrice =
    state.currentPrice && state.currentPrice.price != null ? 1 : 0;
  const notLoading = !Object.values(state.loadingStates).some(Boolean) ? 1 : 0;

  // Bitwise AND: all conditions must be true (all bits set)
  const allConditions =
    hasManufacturer & hasDevice & hasAction & hasPrice & notLoading;
  return Boolean(allConditions);
};

/**
 * Creates the phone repair form DOM element
 * @param {Object} state - Component state
 * @returns {HTMLElement} - Phone repair form element
 */
const renderPhoneRepairForm = (state) => {
  // Inject styles on render (automatically cached)
  injectPhoneRepairFormStyles(phoneRepairFormStyles);

  const classNames = [
    'phone-repair-form',
    state.className,
    state.hasError ? 'phone-repair-form--error' : '',
  ].filter(Boolean);

  const form = createElement('form', {
    classes: classNames,
    events: {
      submit: (e) => e.preventDefault(),
    },
  });

  const components = {};

  // Create lookup maps for O(1) name resolution
  const lookupMaps = createLookupMaps(state);

  // Add steps indicator if we have steps
  if (Array.isArray(state.steps) && state.steps.length > 0) {
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
    loadingText: 'Loading manufacturers...',
    emptyText: 'No manufacturers available',
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
    loadingText: 'Loading devices...',
    emptyText: state.selectedManufacturer
      ? 'No devices available for this manufacturer'
      : 'Please select a manufacturer first',
    onChange: (event, value) => {
      if (typeof state.onDeviceChange === 'function') {
        setTimeout(() => state.onDeviceChange(value), 0);
      }
    },
    showValidation: false,
  });
  form.appendChild(components.deviceSelect.getElement());

  // Create action select with memoized options
  const actionOptions = transformToSelectOptions(state.actions);
  components.actionSelect = Select({
    id: 'action',
    name: 'action',
    placeholder: state.labels.servicePlaceholder,
    options: actionOptions,
    value: state.selectedAction,
    disabled: !state.selectedDevice,
    loading: state.loadingStates.actions,
    loadingText: 'Loading services...',
    emptyText: state.selectedDevice
      ? 'No services available for this device'
      : 'Please select a device first',
    onChange: (event, value) => {
      if (typeof state.onActionChange === 'function') {
        setTimeout(() => state.onActionChange(value), 0);
      }
    },
    showValidation: false,
  });
  form.appendChild(components.actionSelect.getElement());

  // Add price display
  components.priceDisplay = PriceDisplay({
    label: state.labels.priceLabel,
    value: state.priceDisplayText,
    isPlaceholder: !state.currentPrice,
    isLoading: state.loadingStates.price,
    isError: !!state.error.price,
    isHighlighted: true,
  });
  form.appendChild(components.priceDisplay.getElement());

  // Create actions container
  const actionsContainer = createElement('div', {
    classes: 'phone-repair-form__actions',
  });

  // Create link to used phones
  if (state.usedPhoneHref) {
    const usedPhoneLink = createElement('a', {
      classes: 'phone-repair-form__link',
      text: state.labels.usedPhoneText,
      attributes: {
        href: state.usedPhoneHref,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    });
    actionsContainer.appendChild(usedPhoneLink);
  }

  // Create schedule button with algorithmic validation
  const canScheduleNow = canSchedule(state);
  components.scheduleButton = Button({
    text: state.labels.scheduleButtonText,
    onClick: () => {
      if (typeof state.onScheduleClick === 'function') {
        // Use the same validation logic as canSchedule for consistency
        if (!canSchedule(state)) {
          console.warn('PhoneRepairForm: Cannot schedule - validation failed');
          return;
        }

        // Use O(1) lookup maps for name resolution
        const names = resolveNames(state, lookupMaps);

        const repairInfo = {
          manufacturer: {
            id: state.selectedManufacturer,
            name: names.manufacturerName,
          },
          device: {
            id: state.selectedDevice,
            name: names.deviceName,
          },
          service: {
            id: state.selectedAction,
            name: names.actionName,
          },
          price: state.currentPrice,
          timestamp: new Date().toISOString(),
        };

        try {
          state.onScheduleClick(repairInfo);
        } catch (error) {
          console.error(
            'PhoneRepairForm: Error in onScheduleClick callback:',
            error
          );
        }
      }
    },
    disabled: !canScheduleNow,
  });
  actionsContainer.appendChild(components.scheduleButton.getElement());

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
    serviceStep: 'Service',
    manufacturerPlaceholder: 'Hersteller auswählen',
    devicePlaceholder: 'Zuerst Hersteller auswählen',
    servicePlaceholder: 'Zuerst Modell auswählen',
    initialPriceText: 'Bitte zuerst Hersteller, Modell und Service auswählen',
    loadingPriceText: 'Preis wird geladen...',
    priceLabel: 'Ihr unverbindlicher Preisvorschlag:',
    usedPhoneText: 'Zu teuer? Finde hier ein günstiges Gebrauchtes!',
    scheduleButtonText: 'Jetzt Termin vereinbaren',
  };
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
 * Create a PhoneRepairForm component
 * @param {Object} props - PhoneRepairForm properties
 * @returns {Object} PhoneRepairForm component API
 */
const createPhoneRepairForm = (props) => {
  validateProps(props, createPhoneRepairForm.requiredProps);

  // Migrate legacy props
  const migratedProps = migrateLegacyProps(props);

  const defaultLabels = createDefaultLabels();
  const labels = { ...defaultLabels, ...(migratedProps.labels || {}) };

  // Enhanced initial state with better defaults
  const initialState = {
    manufacturers: migratedProps.manufacturers || [],
    devices: migratedProps.devices || [],
    actions: migratedProps.actions || [],
    selectedManufacturer: migratedProps.selectedManufacturer || '',
    selectedDevice: migratedProps.selectedDevice || '',
    selectedAction: migratedProps.selectedAction || '',
    currentPrice: migratedProps.currentPrice || null,
    priceDisplayText: migratedProps.currentPrice
      ? formatPrice(migratedProps.currentPrice.price)
      : labels.initialPriceText,
    loadingStates: {
      manufacturers: false,
      devices: false,
      actions: false,
      price: false,
      ...(migratedProps.loadingStates || {}),
    },
    error: migratedProps.error || {},
    steps: [
      { name: labels.manufacturerStep, completed: false },
      { name: labels.deviceStep, completed: false },
      { name: labels.serviceStep, completed: false },
    ],
    activeStepIndex: 0,
    labels,
    className: migratedProps.className || '',
    usedPhoneHref: migratedProps.usedPhoneHref || null,
    onManufacturerChange: migratedProps.onManufacturerChange,
    onDeviceChange: migratedProps.onDeviceChange,
    onActionChange: migratedProps.onActionChange,
    onScheduleClick: migratedProps.onScheduleClick,
    hasError: Object.values(migratedProps.error || {}).some(Boolean),
  };

  // Apply mathematical step progression
  const stepProgression = calculateStepProgression(initialState);
  initialState.activeStepIndex = stepProgression.activeStepIndex;
  initialState.steps = stepProgression.steps;

  const phoneRepairForm = createBaseComponent(renderPhoneRepairForm)(
    initialState
  );

  // Maintain component state reference
  let currentState = { ...initialState };

  // Enhanced state update method with algorithmic optimization
  phoneRepairForm.setState = function (newState) {
    // Update state
    currentState = { ...currentState, ...newState };

    // Apply mathematical step progression
    const stepProgression = calculateStepProgression(currentState);
    currentState.activeStepIndex = stepProgression.activeStepIndex;
    currentState.steps = stepProgression.steps;

    currentState.hasError = Object.values(currentState.error || {}).some(
      Boolean
    );

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

  phoneRepairForm.shouldRerender = (newProps) => {
    return [
      'manufacturers',
      'devices',
      'actions',
      'selectedManufacturer',
      'selectedDevice',
      'selectedAction',
      'className',
    ].some(
      (prop) =>
        newProps[prop] !== undefined && newProps[prop] !== currentState[prop]
    );
  };

  phoneRepairForm.partialUpdate = (element, newProps) => {
    if (!element?._components) return;

    const components = element._components;

    // Check if steps need updating with mathematical approach
    const needsStepsUpdate = [
      'selectedManufacturer',
      'selectedDevice',
      'selectedAction',
    ].some((key) => newProps[key] !== undefined);

    // Update manufacturer select with memoized transformation
    if (
      newProps.manufacturers !== undefined ||
      newProps.loadingStates?.manufacturers !== undefined ||
      newProps.selectedManufacturer !== undefined
    ) {
      const manufacturerOptions = transformToSelectOptions(
        newProps.manufacturers || currentState.manufacturers
      );
      components.manufacturerSelect?.update({
        options: manufacturerOptions,
        loading:
          newProps.loadingStates?.manufacturers ??
          currentState.loadingStates.manufacturers,
        value:
          newProps.selectedManufacturer ?? currentState.selectedManufacturer,
      });
    }

    // Update device select with memoized transformation
    if (
      newProps.devices !== undefined ||
      newProps.loadingStates?.devices !== undefined ||
      newProps.selectedManufacturer !== undefined ||
      newProps.selectedDevice !== undefined
    ) {
      const deviceOptions = transformToSelectOptions(
        newProps.devices || currentState.devices
      );
      const deviceLoading =
        newProps.loadingStates?.devices ?? currentState.loadingStates.devices;
      const manufacturerSelected =
        newProps.selectedManufacturer ?? currentState.selectedManufacturer;

      components.deviceSelect?.update({
        options: deviceOptions,
        loading: deviceLoading,
        disabled: !manufacturerSelected,
        value: newProps.selectedDevice ?? currentState.selectedDevice,
        emptyText: manufacturerSelected
          ? 'No devices available for this manufacturer'
          : 'Please select a manufacturer first',
      });
    }

    // Update action select with memoized transformation
    if (
      newProps.actions !== undefined ||
      newProps.loadingStates?.actions !== undefined ||
      newProps.selectedDevice !== undefined ||
      newProps.selectedAction !== undefined
    ) {
      const actionOptions = transformToSelectOptions(
        newProps.actions || currentState.actions
      );
      const actionLoading =
        newProps.loadingStates?.actions ?? currentState.loadingStates.actions;
      const deviceSelected =
        newProps.selectedDevice ?? currentState.selectedDevice;

      components.actionSelect?.update({
        options: actionOptions,
        loading: actionLoading,
        disabled: !deviceSelected,
        value: newProps.selectedAction ?? currentState.selectedAction,
        emptyText: deviceSelected
          ? 'No services available for this device'
          : 'Please select a device first',
      });
    }

    // Update price display
    if (
      newProps.currentPrice !== undefined ||
      newProps.priceDisplayText !== undefined ||
      newProps.loadingStates?.price !== undefined ||
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
        isLoading:
          newProps.loadingStates?.price ?? currentState.loadingStates.price,
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

    // Update schedule button with algorithmic validation
    if (
      [
        'selectedManufacturer',
        'selectedDevice',
        'selectedAction',
        'currentPrice',
        'loadingStates',
      ].some((key) => newProps[key] !== undefined)
    ) {
      const canScheduleNow = canSchedule({ ...currentState, ...newProps });
      components.scheduleButton?.setDisabled(!canScheduleNow);
    }

    // Update form error styling
    if (newProps.hasError !== undefined) {
      element.classList.toggle('phone-repair-form--error', newProps.hasError);
    }
  };

  // Convenience methods
  phoneRepairForm.setLoading = function (loadingState) {
    const mergedLoading = { ...currentState.loadingStates, ...loadingState };
    return this.setState({ loadingStates: mergedLoading });
  };

  phoneRepairForm.setErrors = function (errorState) {
    return this.setState({
      error: errorState,
      hasError: Object.values(errorState).some(Boolean),
    });
  };

  phoneRepairForm.setManufacturers = function (manufacturers) {
    return this.setState({ manufacturers });
  };

  phoneRepairForm.setDevices = function (devices) {
    return this.setState({ devices });
  };

  phoneRepairForm.setActions = function (actions) {
    return this.setState({ actions });
  };

  phoneRepairForm.setPrice = function (price) {
    const priceDisplayText = price
      ? formatPrice(price.price)
      : currentState.labels.initialPriceText;
    return this.setState({ currentPrice: price, priceDisplayText });
  };

  phoneRepairForm.getCurrentState = function () {
    return { ...currentState };
  };

  // Enhanced update method with validation
  phoneRepairForm.update = function (newProps) {
    try {
      // Migrate legacy props first
      const migratedProps = migrateLegacyProps(newProps);
      validateProps(migratedProps, createPhoneRepairForm.requiredProps);

      if (this.shouldRerender(migratedProps)) {
        return createBaseComponent.prototype.update.call(this, {
          ...currentState,
          ...migratedProps,
        });
      } else {
        return this.setState(migratedProps);
      }
    } catch (error) {
      console.error('PhoneRepairForm update error:', error);
      return this;
    }
  };

  phoneRepairForm.onThemeChange = (theme, previousTheme) => {
    // Component can react to theme changes if needed
    console.log(
      `PhoneRepairForm component theme changed: ${previousTheme} -> ${theme}`
    );
  };

  // Initialize element state reference
  const element = phoneRepairForm.getElement();
  if (element) {
    element._state = currentState;
    element._currentState = currentState;
  }

  return phoneRepairForm;
};

/**
 * Migrates legacy props to the new standardized prop names
 * @private
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  // Handle usedPhoneUrl → usedPhoneHref migration
  if ('usedPhoneUrl' in props && !('usedPhoneHref' in props)) {
    console.warn(
      '[PhoneRepairForm] usedPhoneUrl is deprecated, use usedPhoneHref instead'
    );
    migrated.usedPhoneHref = props.usedPhoneUrl;
    delete migrated.usedPhoneUrl;
  }

  // Handle loading → loadingStates migration
  if ('loading' in props && !('loadingStates' in props)) {
    console.warn(
      '[PhoneRepairForm] loading is deprecated, use loadingStates instead'
    );
    migrated.loadingStates = props.loading;
    delete migrated.loading;
  }

  return migrated;
};

createPhoneRepairForm.requiredProps = [];

const PhoneRepairForm = withThemeAwareness(
  createComponent('PhoneRepairForm', createPhoneRepairForm)
);

export default PhoneRepairForm;
