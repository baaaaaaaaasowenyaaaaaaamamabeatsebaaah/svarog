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
      if (typeof state.onManufacturerChange === 'function') {
        state.onManufacturerChange(value);
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
      if (typeof state.onDeviceChange === 'function') {
        state.onDeviceChange(value);
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
      if (typeof state.onActionChange === 'function') {
        state.onActionChange(value);
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
  form._components = components;

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

  const phoneRepairForm = createBaseComponent(renderPhoneRepairForm)(
    initialState
  );

  let state = { ...initialState };

  // Enhanced state update method
  phoneRepairForm.setState = function (newState) {
    state = { ...state, ...newState };

    updateStepCompletion(state);
    state.hasError = Object.values(state.error || {}).some(Boolean);

    // Efficient partial updates
    this.partialUpdate(this.getElement(), newState);
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
      (prop) => newProps[prop] !== undefined && newProps[prop] !== state[prop]
    );
  };

  phoneRepairForm.partialUpdate = (element, newProps) => {
    if (!element?._components) return;

    const components = element._components;

    // Update manufacturer select
    if (
      newProps.manufacturers !== undefined ||
      newProps.loading?.manufacturers !== undefined
    ) {
      const manufacturerOptions = transformToSelectOptions(
        newProps.manufacturers || state.manufacturers
      );
      components.manufacturerSelect?.update({
        options: manufacturerOptions,
        loading: newProps.loading?.manufacturers ?? state.loading.manufacturers,
      });
    }

    // Update device select
    if (
      newProps.devices !== undefined ||
      newProps.loading?.devices !== undefined ||
      newProps.selectedManufacturer !== undefined
    ) {
      const deviceOptions = transformToSelectOptions(
        newProps.devices || state.devices
      );
      const deviceLoading = newProps.loading?.devices ?? state.loading.devices;
      const manufacturerSelected =
        newProps.selectedManufacturer ?? state.selectedManufacturer;

      components.deviceSelect?.update({
        options: deviceOptions,
        loading: deviceLoading,
        disabled: !manufacturerSelected,
        emptyText: manufacturerSelected
          ? 'No devices available for this manufacturer'
          : 'Please select a manufacturer first',
      });
    }

    // Update action select
    if (
      newProps.actions !== undefined ||
      newProps.loading?.actions !== undefined ||
      newProps.selectedDevice !== undefined
    ) {
      const actionOptions = transformToSelectOptions(
        newProps.actions || state.actions
      );
      const actionLoading = newProps.loading?.actions ?? state.loading.actions;
      const deviceSelected = newProps.selectedDevice ?? state.selectedDevice;

      components.actionSelect?.update({
        options: actionOptions,
        loading: actionLoading,
        disabled: !deviceSelected,
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
          : state.priceDisplayText);

      components.priceDisplay?.update({
        value: displayText,
        isPlaceholder: !newProps.currentPrice && !state.currentPrice,
        isLoading: newProps.loading?.price ?? state.loading.price,
        isError: !!(newProps.error?.price || state.error.price),
      });
    }

    // Update steps indicator
    if (newProps.steps || newProps.activeStepIndex !== undefined) {
      components.stepsIndicator?.update({
        steps: newProps.steps || state.steps,
        activeIndex: newProps.activeStepIndex ?? state.activeStepIndex,
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
      const canScheduleNow = canSchedule({ ...state, ...newProps });
      components.scheduleButton?.setDisabled(!canScheduleNow);
    }

    // Update form error styling
    if (newProps.hasError !== undefined) {
      element.classList.toggle('phone-repair-form--error', newProps.hasError);
    }
  };

  // Convenience methods with improved error handling
  phoneRepairForm.setLoading = function (loadingState) {
    const mergedLoading = { ...state.loading, ...loadingState };
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
      : state.labels.initialPriceText;
    return this.setState({ currentPrice: price, priceDisplayText });
  };

  // Enhanced update method with validation
  phoneRepairForm.update = function (newProps) {
    try {
      validateProps(newProps, createPhoneRepairForm.requiredProps);

      if (this.shouldRerender(newProps)) {
        return createBaseComponent.prototype.update.call(this, {
          ...state,
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

  return phoneRepairForm;
};

createPhoneRepairForm.requiredProps = [];

const PhoneRepairForm = withThemeAwareness(
  createComponent('PhoneRepairForm', createPhoneRepairForm)
);

export default PhoneRepairForm;
