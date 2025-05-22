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

/**
 * Transform raw data items to select options format
 * @private
 */
const transformToSelectOptions = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    value: item.id?.toString() || item.value?.toString() || '',
    label: item.name || item.label || item.value || '',
  }));
};

/**
 * Creates the phone repair form DOM element
 * @param {Object} state - Component state
 * @returns {HTMLElement} - Phone repair form element
 */
const renderPhoneRepairForm = (state) => {
  console.debug('PhoneRepairForm: renderPhoneRepairForm called with state:', {
    manufacturers: state.manufacturers?.length,
    devices: state.devices?.length,
    actions: state.actions?.length,
    selectedManufacturer: state.selectedManufacturer,
    selectedDevice: state.selectedDevice,
    selectedAction: state.selectedAction,
    loading: state.loading,
  });

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

  // Add steps indicator if we have steps
  if (Array.isArray(state.steps) && state.steps.length > 0) {
    components.stepsIndicator = StepsIndicator({
      steps: state.steps,
      activeIndex: state.activeStepIndex,
    });
    form.appendChild(components.stepsIndicator.getElement());
  }

  // Transform manufacturer options
  const manufacturerOptions = transformToSelectOptions(state.manufacturers);

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
      console.debug(
        'PhoneRepairForm: Manufacturer onChange called with value:',
        value
      );
      if (typeof state.onManufacturerChange === 'function') {
        // Use setTimeout to ensure event propagation completes first
        setTimeout(() => {
          console.debug(
            'PhoneRepairForm: Calling onManufacturerChange with:',
            value
          );
          state.onManufacturerChange(value);
        }, 0);
      } else {
        console.warn('PhoneRepairForm: onManufacturerChange is not a function');
      }
    },
    showValidation: false,
  });
  form.appendChild(components.manufacturerSelect.getElement());

  // Transform device options
  const deviceOptions = transformToSelectOptions(state.devices);

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
      console.debug(
        'PhoneRepairForm: Device onChange called with value:',
        value
      );
      if (typeof state.onDeviceChange === 'function') {
        setTimeout(() => {
          console.debug('PhoneRepairForm: Calling onDeviceChange with:', value);
          state.onDeviceChange(value);
        }, 0);
      } else {
        console.warn('PhoneRepairForm: onDeviceChange is not a function');
      }
    },
    showValidation: false,
  });
  form.appendChild(components.deviceSelect.getElement());

  // Transform action options
  const actionOptions = transformToSelectOptions(state.actions);

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
      console.debug(
        'PhoneRepairForm: Action onChange called with value:',
        value
      );
      if (typeof state.onActionChange === 'function') {
        setTimeout(() => {
          console.debug('PhoneRepairForm: Calling onActionChange with:', value);
          state.onActionChange(value);
        }, 0);
      } else {
        console.warn('PhoneRepairForm: onActionChange is not a function');
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
  components.scheduleButton = Button({
    text: state.labels.scheduleButtonText,
    onClick: () => {
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

        state.onScheduleClick(repairInfo);
      }
    },
    disabled: !canSchedule(state),
  });
  actionsContainer.appendChild(components.scheduleButton.getElement());

  form.appendChild(actionsContainer);

  // Store components and current state for updates
  form._components = components;
  form._currentState = { ...state };

  console.debug(
    'PhoneRepairForm: render complete, stored components:',
    Object.keys(components)
  );

  return form;
};

/**
 * Helper function to get selected item name
 * @private
 */
const getSelectedName = (items, selectedId) => {
  const item = items.find((i) => (i.id || i.value).toString() === selectedId);
  return item ? item.name || item.label : '';
};

/**
 * Check if scheduling is possible
 * @private
 */
const canSchedule = (state) => {
  return (
    !!state.selectedManufacturer &&
    !!state.selectedDevice &&
    !!state.selectedAction &&
    !!state.currentPrice &&
    !Object.values(state.loading).some(Boolean)
  );
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
  if (price === undefined || price === null) {
    return 'Preis nicht verfügbar';
  }

  let priceInEuros = price;
  if (price > 1000) {
    priceInEuros = price / 100;
  }

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceInEuros);
};

/**
 * Update step completion based on current selections
 * @private
 */
const updateStepCompletion = (state) => {
  state.activeStepIndex = 0;

  if (state.selectedManufacturer) {
    state.steps[0].completed = true;
    state.activeStepIndex = 1;

    if (state.selectedDevice) {
      state.steps[1].completed = true;
      state.activeStepIndex = 2;

      if (state.selectedAction) {
        state.steps[2].completed = true;
      }
    }
  }
};

/**
 * Create a PhoneRepairForm component
 * @param {Object} props - PhoneRepairForm properties
 * @returns {Object} PhoneRepairForm component API
 */
const createPhoneRepairForm = (props) => {
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

  console.debug('PhoneRepairForm: Creating component with initial state:', {
    manufacturers: initialState.manufacturers?.length,
    devices: initialState.devices?.length,
    actions: initialState.actions?.length,
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
    console.debug('PhoneRepairForm: setState called with:', newState);

    // Update state
    currentState = { ...currentState, ...newState };
    updateStepCompletion(currentState);
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

    console.debug('PhoneRepairForm: shouldRerender?', shouldRerender, newProps);
    return shouldRerender;
  };

  phoneRepairForm.partialUpdate = (element, newProps) => {
    if (!element?._components) {
      console.debug('PhoneRepairForm: partialUpdate - no components found');
      return;
    }

    const components = element._components;
    console.debug('PhoneRepairForm: partialUpdate called with:', newProps);

    // Update manufacturer select
    if (
      newProps.manufacturers !== undefined ||
      newProps.loading?.manufacturers !== undefined ||
      newProps.selectedManufacturer !== undefined
    ) {
      const manufacturerOptions = transformToSelectOptions(
        newProps.manufacturers || currentState.manufacturers
      );
      console.debug('PhoneRepairForm: Updating manufacturer select:', {
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

      console.debug('PhoneRepairForm: Updating device select:', {
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

      console.debug('PhoneRepairForm: Updating action select:', {
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

      components.priceDisplay?.update({
        value: displayText,
        isPlaceholder: !newProps.currentPrice && !currentState.currentPrice,
        isLoading: newProps.loading?.price ?? currentState.loading.price,
        isError: !!(newProps.error?.price || currentState.error.price),
      });
    }

    // Update steps indicator
    if (newProps.steps || newProps.activeStepIndex !== undefined) {
      components.stepsIndicator?.update({
        steps: newProps.steps || currentState.steps,
        activeIndex: newProps.activeStepIndex ?? currentState.activeStepIndex,
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
      components.scheduleButton?.setDisabled(!canScheduleNow);
    }

    // Update form error styling
    if (newProps.hasError !== undefined) {
      element.classList.toggle('phone-repair-form--error', newProps.hasError);
    }
  };

  // Convenience methods with improved error handling
  phoneRepairForm.setLoading = function (loadingState) {
    const mergedLoading = { ...currentState.loading, ...loadingState };
    return this.setState({ loading: mergedLoading });
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
      validateProps(newProps, createPhoneRepairForm.requiredProps);

      if (this.shouldRerender(newProps)) {
        return createBaseComponent.prototype.update.call(this, {
          ...currentState,
          ...newProps,
        });
      } else {
        return this.setState(newProps);
      }
    } catch (error) {
      console.error('PhoneRepairForm update error:', error);
      return this;
    }
  };

  phoneRepairForm.onThemeChange = (newTheme, previousTheme) => {
    console.debug(
      `PhoneRepairForm: theme changed from ${previousTheme} to ${newTheme}`
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

createPhoneRepairForm.requiredProps = [];

const PhoneRepairForm = withThemeAwareness(
  createComponent('PhoneRepairForm', createPhoneRepairForm)
);

export default PhoneRepairForm;
