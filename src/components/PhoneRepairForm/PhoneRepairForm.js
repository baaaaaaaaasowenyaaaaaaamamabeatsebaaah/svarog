// src/components/PhoneRepairForm/PhoneRepairForm.js
import './PhoneRepairForm.css';
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

// Debug helper
const DEBUG_PREFIX = '[PhoneRepairForm]';
const isDebugEnabled = () => {
  return (
    typeof window !== 'undefined' &&
    (window.localStorage?.getItem('svarog-debug') === 'true' ||
      window.location?.search?.includes('debug=true'))
  );
};

const debugLog = (message, data = null) => {
  if (isDebugEnabled()) {
    if (data) {
      console.log(`${DEBUG_PREFIX} ${message}`, data);
    } else {
      console.log(`${DEBUG_PREFIX} ${message}`);
    }
  }
};

const debugWarn = (message, data = null) => {
  if (isDebugEnabled()) {
    if (data) {
      console.warn(`${DEBUG_PREFIX} ${message}`, data);
    } else {
      console.warn(`${DEBUG_PREFIX} ${message}`);
    }
  }
};

const debugError = (message, error = null) => {
  console.error(`${DEBUG_PREFIX} ${message}`, error);
};

/**
 * Transform raw data items to select options format
 * @private
 */
const transformToSelectOptions = (items) => {
  debugLog('transformToSelectOptions called', {
    itemCount: items?.length,
    firstItem: items?.[0],
  });
  if (!Array.isArray(items)) {
    debugWarn('transformToSelectOptions: items is not an array', items);
    return [];
  }

  const options = items.map((item) => ({
    value: item.id?.toString() || item.value?.toString() || '',
    label: item.name || item.label || item.value || '',
  }));

  debugLog('transformToSelectOptions result', {
    optionCount: options.length,
    options,
  });
  return options;
};

/**
 * Creates the phone repair form DOM element
 * @param {Object} state - Component state
 * @returns {HTMLElement} - Phone repair form element
 */
const renderPhoneRepairForm = (state) => {
  debugLog('renderPhoneRepairForm called', {
    manufacturers: state.manufacturers?.length,
    devices: state.devices?.length,
    actions: state.actions?.length,
    selectedManufacturer: state.selectedManufacturer,
    selectedDevice: state.selectedDevice,
    selectedAction: state.selectedAction,
    loading: state.loading,
    error: state.error,
    activeStepIndex: state.activeStepIndex,
    hasHandlers: {
      onManufacturerChange: typeof state.onManufacturerChange === 'function',
      onDeviceChange: typeof state.onDeviceChange === 'function',
      onActionChange: typeof state.onActionChange === 'function',
    },
  });

  const classNames = [
    'phone-repair-form',
    state.className,
    state.hasError ? 'phone-repair-form--error' : '',
  ].filter(Boolean);

  const form = createElement('form', {
    classes: classNames,
    events: {
      submit: (e) => {
        debugLog('Form submit event prevented');
        e.preventDefault();
      },
    },
  });

  const components = {};

  // Add steps indicator if we have steps
  if (Array.isArray(state.steps) && state.steps.length > 0) {
    debugLog('Creating steps indicator', {
      steps: state.steps,
      activeIndex: state.activeStepIndex,
      stepsCompletion: state.steps.map((step, i) => ({
        index: i,
        completed: step.completed,
      })),
    });
    components.stepsIndicator = StepsIndicator({
      steps: state.steps,
      activeIndex: state.activeStepIndex,
    });
    form.appendChild(components.stepsIndicator.getElement());
  }

  // Transform manufacturer options
  const manufacturerOptions = transformToSelectOptions(state.manufacturers);
  debugLog('Creating manufacturer select', {
    optionCount: manufacturerOptions.length,
    value: state.selectedManufacturer,
    loading: state.loading.manufacturers,
  });

  // Create manufacturer select
  components.manufacturerSelect = Select({
    id: 'manufacturer',
    name: 'manufacturer',
    placeholder: state.labels.manufacturerPlaceholder,
    options: manufacturerOptions,
    value: state.selectedManufacturer,
    loading: state.loading.manufacturers,
    loadingText: 'Loading manufacturers...',
    emptyText: 'No manufacturers available',
    onChange: (event, value) => {
      debugLog('Manufacturer onChange triggered', {
        event: event?.type,
        value,
        hasHandler: typeof state.onManufacturerChange === 'function',
        eventTarget: event?.target?.tagName,
        eventValue: event?.target?.value,
      });

      if (typeof state.onManufacturerChange === 'function') {
        debugLog('Calling onManufacturerChange handler');
        // Use setTimeout to ensure event propagation completes first
        setTimeout(() => {
          debugLog('Executing onManufacturerChange with value:', value);
          try {
            state.onManufacturerChange(value);
            debugLog('onManufacturerChange completed successfully');
          } catch (error) {
            debugError('Error in onManufacturerChange handler', error);
          }
        }, 0);
      } else {
        debugWarn(
          'onManufacturerChange is not a function',
          typeof state.onManufacturerChange
        );
      }
    },
    showValidation: false,
  });
  form.appendChild(components.manufacturerSelect.getElement());

  // Transform device options
  const deviceOptions = transformToSelectOptions(state.devices);
  debugLog('Creating device select', {
    optionCount: deviceOptions.length,
    value: state.selectedDevice,
    disabled: !state.selectedManufacturer,
    loading: state.loading.devices,
  });

  // Create device select
  components.deviceSelect = Select({
    id: 'device',
    name: 'device',
    placeholder: state.labels.devicePlaceholder,
    options: deviceOptions,
    value: state.selectedDevice,
    disabled: !state.selectedManufacturer,
    loading: state.loading.devices,
    loadingText: 'Loading devices...',
    emptyText: state.selectedManufacturer
      ? 'No devices available for this manufacturer'
      : 'Please select a manufacturer first',
    onChange: (event, value) => {
      debugLog('Device onChange triggered', {
        event: event?.type,
        value,
        hasHandler: typeof state.onDeviceChange === 'function',
      });

      if (typeof state.onDeviceChange === 'function') {
        debugLog('Calling onDeviceChange handler');
        setTimeout(() => {
          debugLog('Executing onDeviceChange with value:', value);
          try {
            state.onDeviceChange(value);
            debugLog('onDeviceChange completed successfully');
          } catch (error) {
            debugError('Error in onDeviceChange handler', error);
          }
        }, 0);
      } else {
        debugWarn(
          'onDeviceChange is not a function',
          typeof state.onDeviceChange
        );
      }
    },
    showValidation: false,
  });
  form.appendChild(components.deviceSelect.getElement());

  // Transform action options
  const actionOptions = transformToSelectOptions(state.actions);
  debugLog('Creating action select', {
    optionCount: actionOptions.length,
    value: state.selectedAction,
    disabled: !state.selectedDevice,
    loading: state.loading.actions,
  });

  // Create action select
  components.actionSelect = Select({
    id: 'action',
    name: 'action',
    placeholder: state.labels.servicePlaceholder,
    options: actionOptions,
    value: state.selectedAction,
    disabled: !state.selectedDevice,
    loading: state.loading.actions,
    loadingText: 'Loading services...',
    emptyText: state.selectedDevice
      ? 'No services available for this device'
      : 'Please select a device first',
    onChange: (event, value) => {
      debugLog('Action onChange triggered', {
        event: event?.type,
        value,
        hasHandler: typeof state.onActionChange === 'function',
      });

      if (typeof state.onActionChange === 'function') {
        debugLog('Calling onActionChange handler');
        setTimeout(() => {
          debugLog('Executing onActionChange with value:', value);
          try {
            state.onActionChange(value);
            debugLog('onActionChange completed successfully');
          } catch (error) {
            debugError('Error in onActionChange handler', error);
          }
        }, 0);
      } else {
        debugWarn(
          'onActionChange is not a function',
          typeof state.onActionChange
        );
      }
    },
    showValidation: false,
  });
  form.appendChild(components.actionSelect.getElement());

  // Add price display
  debugLog('Creating price display', {
    value: state.priceDisplayText,
    isPlaceholder: !state.currentPrice,
    isLoading: state.loading.price,
    isError: !!state.error.price,
  });

  components.priceDisplay = PriceDisplay({
    label: state.labels.priceLabel,
    value: state.priceDisplayText,
    isPlaceholder: !state.currentPrice,
    isLoading: state.loading.price,
    isError: !!state.error.price,
  });
  form.appendChild(components.priceDisplay.getElement());

  // Create actions container
  const actionsContainer = createElement('div', {
    classes: 'phone-repair-form__actions',
  });

  // Create link to used phones
  if (state.usedPhoneUrl) {
    debugLog('Creating used phone link', { url: state.usedPhoneUrl });
    const usedPhoneLink = createElement('a', {
      classes: 'phone-repair-form__link',
      text: state.labels.usedPhoneText,
      attributes: {
        href: state.usedPhoneUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    });
    actionsContainer.appendChild(usedPhoneLink);
  }

  // Create schedule button
  const canScheduleNow = canSchedule(state);
  debugLog('Creating schedule button', {
    canSchedule: canScheduleNow,
    hasScheduleHandler: typeof state.onScheduleClick === 'function',
  });

  components.scheduleButton = Button({
    text: state.labels.scheduleButtonText,
    onClick: () => {
      debugLog('Schedule button clicked');
      if (typeof state.onScheduleClick === 'function') {
        const repairInfo = {
          manufacturer: {
            id: state.selectedManufacturer,
            name: getSelectedName(
              state.manufacturers,
              state.selectedManufacturer
            ),
          },
          device: {
            id: state.selectedDevice,
            name: getSelectedName(state.devices, state.selectedDevice),
          },
          service: {
            id: state.selectedAction,
            name: getSelectedName(state.actions, state.selectedAction),
          },
          price: state.currentPrice,
          timestamp: new Date().toISOString(),
        };

        debugLog('Calling onScheduleClick with repair info', repairInfo);
        try {
          state.onScheduleClick(repairInfo);
          debugLog('onScheduleClick completed successfully');
        } catch (error) {
          debugError('Error in onScheduleClick handler', error);
        }
      } else {
        debugWarn(
          'onScheduleClick is not a function',
          typeof state.onScheduleClick
        );
      }
    },
    disabled: !canScheduleNow,
  });
  actionsContainer.appendChild(components.scheduleButton.getElement());

  form.appendChild(actionsContainer);

  // Store components and current state for updates
  form._components = components;
  form._currentState = { ...state };

  debugLog('Render complete, stored components:', Object.keys(components));

  return form;
};

/**
 * Helper function to get selected item name
 * @private
 */
const getSelectedName = (items, selectedId) => {
  debugLog('getSelectedName called', { itemCount: items?.length, selectedId });
  const item = items.find((i) => (i.id || i.value).toString() === selectedId);
  const name = item ? item.name || item.label : '';
  debugLog('getSelectedName result', { name, item });
  return name;
};

/**
 * Check if scheduling is possible
 * @private
 */
const canSchedule = (state) => {
  const result =
    !!state.selectedManufacturer &&
    !!state.selectedDevice &&
    !!state.selectedAction &&
    !!state.currentPrice &&
    !Object.values(state.loading).some(Boolean);

  debugLog('canSchedule check', {
    selectedManufacturer: !!state.selectedManufacturer,
    selectedDevice: !!state.selectedDevice,
    selectedAction: !!state.selectedAction,
    currentPrice: !!state.currentPrice,
    isLoading: Object.values(state.loading).some(Boolean),
    result,
  });

  return result;
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
 * Format price for display
 * @private
 */
const formatPrice = (price) => {
  debugLog('formatPrice called', { price, type: typeof price });

  if (price === undefined || price === null) {
    return 'Preis nicht verfügbar';
  }

  let priceInEuros = price;
  if (price > 1000) {
    priceInEuros = price / 100;
  }

  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceInEuros);

  debugLog('formatPrice result', { formatted, priceInEuros });
  return formatted;
};

/**
 * Update step completion based on current selections
 * @private
 */
const updateStepCompletion = (state) => {
  debugLog('updateStepCompletion called', {
    selectedManufacturer: state.selectedManufacturer,
    selectedDevice: state.selectedDevice,
    selectedAction: state.selectedAction,
    beforeUpdate: state.steps.map((step, i) => ({
      index: i,
      completed: step.completed,
    })),
  });

  state.activeStepIndex = 0;

  if (state.selectedManufacturer) {
    state.steps[0].completed = true;
    state.activeStepIndex = 1;

    if (state.selectedDevice) {
      state.steps[1].completed = true;
      state.activeStepIndex = 2;

      if (state.selectedAction) {
        state.steps[2].completed = true;
      } else {
        state.steps[2].completed = false;
      }
    } else {
      state.steps[1].completed = false;
      state.steps[2].completed = false;
    }
  } else {
    state.steps[0].completed = false;
    state.steps[1].completed = false;
    state.steps[2].completed = false;
  }

  debugLog('updateStepCompletion result', {
    activeStepIndex: state.activeStepIndex,
    afterUpdate: state.steps.map((step, i) => ({
      index: i,
      completed: step.completed,
    })),
  });
};

/**
 * Create a PhoneRepairForm component
 * @param {Object} props - PhoneRepairForm properties
 * @returns {Object} PhoneRepairForm component API
 */
const createPhoneRepairForm = (props) => {
  debugLog('createPhoneRepairForm called', {
    propsKeys: Object.keys(props),
    manufacturers: props.manufacturers?.length,
    devices: props.devices?.length,
    actions: props.actions?.length,
    hasHandlers: {
      onManufacturerChange: typeof props.onManufacturerChange === 'function',
      onDeviceChange: typeof props.onDeviceChange === 'function',
      onActionChange: typeof props.onActionChange === 'function',
      onScheduleClick: typeof props.onScheduleClick === 'function',
    },
  });

  validateProps(props, createPhoneRepairForm.requiredProps);

  const defaultLabels = createDefaultLabels();
  const labels = { ...defaultLabels, ...(props.labels || {}) };

  // Enhanced initial state with better defaults
  const initialState = {
    manufacturers: props.manufacturers || [],
    devices: props.devices || [],
    actions: props.actions || [],
    selectedManufacturer: props.selectedManufacturer || '',
    selectedDevice: props.selectedDevice || '',
    selectedAction: props.selectedAction || '',
    currentPrice: props.currentPrice || null,
    priceDisplayText: props.currentPrice
      ? formatPrice(props.currentPrice.price)
      : labels.initialPriceText,
    loading: {
      manufacturers: false,
      devices: false,
      actions: false,
      price: false,
      ...props.loading,
    },
    error: props.error || {},
    steps: [
      { name: labels.manufacturerStep, completed: false },
      { name: labels.deviceStep, completed: false },
      { name: labels.serviceStep, completed: false },
    ],
    activeStepIndex: 0,
    labels,
    className: props.className || '',
    usedPhoneUrl: props.usedPhoneUrl || null,
    onManufacturerChange: props.onManufacturerChange,
    onDeviceChange: props.onDeviceChange,
    onActionChange: props.onActionChange,
    onScheduleClick: props.onScheduleClick,
    hasError: Object.values(props.error || {}).some(Boolean),
  };

  // Update step completion based on selections
  updateStepCompletion(initialState);

  debugLog('Initial state created', {
    manufacturers: initialState.manufacturers?.length,
    devices: initialState.devices?.length,
    actions: initialState.actions?.length,
    loading: initialState.loading,
    activeStepIndex: initialState.activeStepIndex,
    hasHandlers: {
      onManufacturerChange:
        typeof initialState.onManufacturerChange === 'function',
      onDeviceChange: typeof initialState.onDeviceChange === 'function',
      onActionChange: typeof initialState.onActionChange === 'function',
    },
  });

  const phoneRepairForm = createBaseComponent(renderPhoneRepairForm)(
    initialState
  );

  // Maintain component state reference
  let currentState = { ...initialState };

  // Enhanced state update method with proper synchronization
  phoneRepairForm.setState = function (newState) {
    debugLog('setState called', {
      newStateKeys: Object.keys(newState),
      newState: JSON.stringify(newState, null, 2),
    });

    // Update state
    const previousState = { ...currentState };
    currentState = { ...currentState, ...newState };
    updateStepCompletion(currentState);
    currentState.hasError = Object.values(currentState.error || {}).some(
      Boolean
    );

    debugLog('State updated', {
      previousState: {
        selectedManufacturer: previousState.selectedManufacturer,
        selectedDevice: previousState.selectedDevice,
        selectedAction: previousState.selectedAction,
        activeStepIndex: previousState.activeStepIndex,
        loading: previousState.loading,
      },
      currentState: {
        selectedManufacturer: currentState.selectedManufacturer,
        selectedDevice: currentState.selectedDevice,
        selectedAction: currentState.selectedAction,
        activeStepIndex: currentState.activeStepIndex,
        loading: currentState.loading,
      },
    });

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
    const shouldRerender = [
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

    debugLog('shouldRerender check', { shouldRerender, newProps });
    return shouldRerender;
  };

  phoneRepairForm.partialUpdate = (element, newProps) => {
    debugLog('partialUpdate called', {
      hasElement: !!element,
      hasComponents: !!element?._components,
      newPropsKeys: Object.keys(newProps),
    });

    if (!element?._components) {
      debugWarn('partialUpdate - no components found');
      return;
    }

    const components = element._components;

    // Check if steps need updating - this is the key fix!
    const needsStepsUpdate =
      newProps.selectedManufacturer !== undefined ||
      newProps.selectedDevice !== undefined ||
      newProps.selectedAction !== undefined ||
      newProps.steps !== undefined ||
      newProps.activeStepIndex !== undefined;

    debugLog('Steps update check', {
      needsStepsUpdate,
      currentActiveIndex: currentState.activeStepIndex,
      currentSteps: currentState.steps.map((step, i) => ({
        index: i,
        completed: step.completed,
      })),
    });

    // Update manufacturer select
    if (
      newProps.manufacturers !== undefined ||
      newProps.loading?.manufacturers !== undefined ||
      newProps.selectedManufacturer !== undefined
    ) {
      const manufacturerOptions = transformToSelectOptions(
        newProps.manufacturers || currentState.manufacturers
      );
      debugLog('Updating manufacturer select', {
        optionsCount: manufacturerOptions.length,
        loading:
          newProps.loading?.manufacturers ?? currentState.loading.manufacturers,
        value:
          newProps.selectedManufacturer ?? currentState.selectedManufacturer,
      });

      components.manufacturerSelect?.update({
        options: manufacturerOptions,
        loading:
          newProps.loading?.manufacturers ?? currentState.loading.manufacturers,
        value:
          newProps.selectedManufacturer ?? currentState.selectedManufacturer,
      });
    }

    // Update device select
    if (
      newProps.devices !== undefined ||
      newProps.loading?.devices !== undefined ||
      newProps.selectedManufacturer !== undefined ||
      newProps.selectedDevice !== undefined
    ) {
      const deviceOptions = transformToSelectOptions(
        newProps.devices || currentState.devices
      );
      const deviceLoading =
        newProps.loading?.devices ?? currentState.loading.devices;
      const manufacturerSelected =
        newProps.selectedManufacturer ?? currentState.selectedManufacturer;

      debugLog('Updating device select', {
        optionsCount: deviceOptions.length,
        loading: deviceLoading,
        disabled: !manufacturerSelected,
        value: newProps.selectedDevice ?? currentState.selectedDevice,
      });

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

    // Update action select
    if (
      newProps.actions !== undefined ||
      newProps.loading?.actions !== undefined ||
      newProps.selectedDevice !== undefined ||
      newProps.selectedAction !== undefined
    ) {
      const actionOptions = transformToSelectOptions(
        newProps.actions || currentState.actions
      );
      const actionLoading =
        newProps.loading?.actions ?? currentState.loading.actions;
      const deviceSelected =
        newProps.selectedDevice ?? currentState.selectedDevice;

      debugLog('Updating action select', {
        optionsCount: actionOptions.length,
        loading: actionLoading,
        disabled: !deviceSelected,
        value: newProps.selectedAction ?? currentState.selectedAction,
      });

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
      newProps.loading?.price !== undefined ||
      newProps.error?.price !== undefined
    ) {
      const displayText =
        newProps.priceDisplayText ||
        (newProps.currentPrice
          ? formatPrice(newProps.currentPrice.price)
          : currentState.priceDisplayText);

      debugLog('Updating price display', {
        value: displayText,
        isPlaceholder: !newProps.currentPrice && !currentState.currentPrice,
        isLoading: newProps.loading?.price ?? currentState.loading.price,
        isError: !!(newProps.error?.price || currentState.error.price),
      });

      components.priceDisplay?.update({
        value: displayText,
        isPlaceholder: !newProps.currentPrice && !currentState.currentPrice,
        isLoading: newProps.loading?.price ?? currentState.loading.price,
        isError: !!(newProps.error?.price || currentState.error.price),
      });
    }

    // Update steps indicator - FIXED: Always check when selections change
    if (needsStepsUpdate && components.stepsIndicator) {
      debugLog('Updating steps indicator', {
        steps: currentState.steps,
        activeIndex: currentState.activeStepIndex,
        stepsCompletion: currentState.steps.map((step, i) => ({
          index: i,
          completed: step.completed,
        })),
      });

      components.stepsIndicator.update({
        steps: currentState.steps,
        activeIndex: currentState.activeStepIndex,
      });
    }

    // Update schedule button
    if (
      [
        'selectedManufacturer',
        'selectedDevice',
        'selectedAction',
        'currentPrice',
        'loading',
      ].some((key) => newProps[key] !== undefined)
    ) {
      const canScheduleNow = canSchedule({ ...currentState, ...newProps });
      debugLog('Updating schedule button', { canSchedule: canScheduleNow });
      components.scheduleButton?.setDisabled(!canScheduleNow);
    }

    // Update form error styling
    if (newProps.hasError !== undefined) {
      debugLog('Updating form error styling', { hasError: newProps.hasError });
      element.classList.toggle('phone-repair-form--error', newProps.hasError);
    }
  };

  // Convenience methods with improved error handling
  phoneRepairForm.setLoading = function (loadingState) {
    debugLog('setLoading called', loadingState);
    const mergedLoading = { ...currentState.loading, ...loadingState };
    return this.setState({ loading: mergedLoading });
  };

  phoneRepairForm.setErrors = function (errorState) {
    debugLog('setErrors called', errorState);
    return this.setState({
      error: errorState,
      hasError: Object.values(errorState).some(Boolean),
    });
  };

  phoneRepairForm.setManufacturers = function (manufacturers) {
    debugLog('setManufacturers called', { count: manufacturers?.length });
    return this.setState({ manufacturers });
  };

  phoneRepairForm.setDevices = function (devices) {
    debugLog('setDevices called', { count: devices?.length });
    return this.setState({ devices });
  };

  phoneRepairForm.setActions = function (actions) {
    debugLog('setActions called', { count: actions?.length });
    return this.setState({ actions });
  };

  phoneRepairForm.setPrice = function (price) {
    debugLog('setPrice called', price);
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
    debugLog('update method called', { newPropsKeys: Object.keys(newProps) });

    try {
      validateProps(newProps, createPhoneRepairForm.requiredProps);

      if (this.shouldRerender(newProps)) {
        debugLog('Full rerender triggered');
        return createBaseComponent.prototype.update.call(this, {
          ...currentState,
          ...newProps,
        });
      } else {
        debugLog('Partial update triggered');
        return this.setState(newProps);
      }
    } catch (error) {
      debugError('Update error', error);
      return this;
    }
  };

  phoneRepairForm.onThemeChange = (newTheme, previousTheme) => {
    debugLog(`Theme changed from ${previousTheme} to ${newTheme}`);
  };

  // Initialize element state reference
  const element = phoneRepairForm.getElement();
  if (element) {
    element._state = currentState;
    element._currentState = currentState;
  }

  debugLog('PhoneRepairForm component created successfully');
  return phoneRepairForm;
};

createPhoneRepairForm.requiredProps = [];

const PhoneRepairForm = withThemeAwareness(
  createComponent('PhoneRepairForm', createPhoneRepairForm)
);

export default PhoneRepairForm;
