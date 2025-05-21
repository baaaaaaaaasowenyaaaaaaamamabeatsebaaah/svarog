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
 * Creates the phone repair form DOM element
 * @param {Object} state - Component state
 * @returns {HTMLElement} - Phone repair form element
 */
const renderPhoneRepairForm = (state) => {
  // Build CSS class list
  const classNames = [
    'phone-repair-form',
    state.className,
    state.isLoading ? 'phone-repair-form--loading' : '',
    state.hasError ? 'phone-repair-form--error' : '',
  ].filter(Boolean);

  // Create the main form element
  const form = createElement('form', {
    classes: classNames,
    events: {
      submit: (e) => e.preventDefault(),
    },
  });

  // Track child components for easy access in updates
  const components = {};

  // Add steps indicator if we have steps
  if (Array.isArray(state.steps) && state.steps.length > 0) {
    components.stepsIndicator = StepsIndicator({
      steps: state.steps,
      activeIndex: state.activeStepIndex,
    });
    form.appendChild(components.stepsIndicator.getElement());
  }

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
  form.appendChild(components.manufacturerSelect.getElement());

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
  form.appendChild(components.deviceSelect.getElement());

  // Create action select
  components.actionSelect = Select({
    id: 'action',
    name: 'action',
    placeholder: state.labels.servicePlaceholder,
    options: state.actions.map((a) => ({
      value: a.id.toString(),
      label: a.name,
    })),
    value: state.selectedAction,
    disabled: state.actions.length === 0,
    onChange: (event, value) => {
      if (typeof state.onActionChange === 'function') {
        state.onActionChange(value);
      }
    },
  });
  form.appendChild(components.actionSelect.getElement());

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
    classes: 'phone-repair-form__actions',
  });

  // Create link to used phones
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

  // Add actions container to form
  form.appendChild(actionsContainer);

  // Store components for easier access in updates
  form._components = components;

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
 * Check if scheduling is possible (all selections made)
 * @private
 * @param {Object} state - Component state
 * @returns {boolean} Whether all selections are made
 */
const canSchedule = (state) => {
  return (
    !!state.selectedManufacturer &&
    !!state.selectedDevice &&
    !!state.selectedAction &&
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
 * Create a PhoneRepairForm component
 * @param {Object} props - PhoneRepairForm properties
 * @returns {Object} PhoneRepairForm component API
 */
const createPhoneRepairForm = (props) => {
  // Validate props
  validateProps(props, createPhoneRepairForm.requiredProps);

  // Set default labels and merge with provided labels
  const defaultLabels = createDefaultLabels();
  const labels = { ...defaultLabels, ...(props.labels || {}) };

  // Initial state
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
    loading: props.loading || {},
    error: props.error || {},
    steps: [
      { name: labels.manufacturerStep, completed: false },
      { name: labels.deviceStep, completed: false },
      { name: labels.serviceStep, completed: false },
    ],
    activeStepIndex: 0,
    labels,
    className: props.className || '',
    usedPhoneUrl: props.usedPhoneUrl || '#',
    onManufacturerChange: props.onManufacturerChange,
    onDeviceChange: props.onDeviceChange,
    onActionChange: props.onActionChange,
    onScheduleClick: props.onScheduleClick,
    isLoading: Object.values(props.loading || {}).some(Boolean),
    hasError: Object.values(props.error || {}).some(Boolean),
  };

  // Update active step based on selections
  if (initialState.selectedManufacturer) {
    initialState.steps[0].completed = true;
    initialState.activeStepIndex = 1;

    if (initialState.selectedDevice) {
      initialState.steps[1].completed = true;
      initialState.activeStepIndex = 2;

      if (initialState.selectedAction) {
        initialState.steps[2].completed = true;
      }
    }
  }

  // Create base component
  const phoneRepairForm = createBaseComponent(renderPhoneRepairForm)(
    initialState
  );

  // Track component state
  let state = { ...initialState };

  // Add state update method
  phoneRepairForm.setState = function (newState) {
    // Update state
    state = { ...state, ...newState };

    // Update active step and completion state based on selections
    const updatedSteps = [...state.steps];
    let activeIndex = 0;

    if (state.selectedManufacturer) {
      updatedSteps[0].completed = true;
      activeIndex = 1;

      if (state.selectedDevice) {
        updatedSteps[1].completed = true;
        activeIndex = 2;

        if (state.selectedAction) {
          updatedSteps[2].completed = true;
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
  phoneRepairForm.shouldRerender = (newProps) => {
    // These props require a full re-render if they've actually changed
    return [
      'manufacturers',
      'devices',
      'actions',
      'selectedManufacturer',
      'selectedDevice',
      'selectedAction',
      'steps',
      'className',
    ].some(
      (prop) => newProps[prop] !== undefined && newProps[prop] !== state[prop]
    );
  };

  /**
   * Define the partialUpdate method for more efficient updates
   */
  phoneRepairForm.partialUpdate = (element, newProps) => {
    if (!element || !element._components) {
      console.debug(
        'PhoneRepairForm: Cannot perform partial update, invalid element'
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

    // Update steps indicator if steps or activeIndex changed
    if (
      (newProps.steps || newProps.activeStepIndex !== undefined) &&
      components.stepsIndicator
    ) {
      components.stepsIndicator.update({
        steps: newProps.steps || state.steps,
        activeIndex:
          newProps.activeStepIndex !== undefined
            ? newProps.activeStepIndex
            : state.activeStepIndex,
      });
    }

    // Update schedule button state
    if (
      newProps.selectedManufacturer !== undefined ||
      newProps.selectedDevice !== undefined ||
      newProps.selectedAction !== undefined ||
      newProps.currentPrice !== undefined
    ) {
      if (components.scheduleButton) {
        const canScheduleNow = canSchedule({
          ...state,
          ...newProps,
        });
        components.scheduleButton.setDisabled(!canScheduleNow);
      }
    }

    // Update form styling classes
    if (newProps.isLoading !== undefined) {
      element.classList.toggle(
        'phone-repair-form--loading',
        newProps.isLoading
      );
    }

    if (newProps.hasError !== undefined) {
      element.classList.toggle('phone-repair-form--error', newProps.hasError);
    }
  };

  // Add convenience methods to match the previous API

  /**
   * Set form loading state
   * @param {Object} loading - Loading state object
   * @returns {Object} Component instance for chaining
   */
  phoneRepairForm.setLoading = function (loading) {
    return this.setState({
      loading,
      isLoading: Object.values(loading).some(Boolean),
    });
  };

  /**
   * Set form error state
   * @param {Object} error - Error state object
   * @returns {Object} Component instance for chaining
   */
  phoneRepairForm.setErrors = function (error) {
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
      } else if (error.actions) {
        // Set error for action loading
        priceDisplay.setError(
          state.labels.actionLoadError || 'Error loading services'
        );
      } else if (
        Object.keys(error).length === 0 &&
        state.error &&
        (state.error.price || state.error.devices || state.error.actions)
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
  phoneRepairForm.setManufacturers = function (manufacturers) {
    return this.setState({ manufacturers });
  };

  /**
   * Set devices data
   * @param {Array} devices - Devices array
   * @returns {Object} Component instance for chaining
   */
  phoneRepairForm.setDevices = function (devices) {
    return this.setState({ devices });
  };

  /**
   * Set actions data
   * @param {Array} actions - Actions array
   * @returns {Object} Component instance for chaining
   */
  phoneRepairForm.setActions = function (actions) {
    return this.setState({ actions });
  };

  /**
   * Set price data
   * @param {Object} price - Price data object
   * @returns {Object} Component instance for chaining
   */
  phoneRepairForm.setPrice = function (price) {
    let priceDisplayText = state.labels.initialPriceText;

    if (price) {
      priceDisplayText = formatPrice(price.price);
    }

    return this.setState({
      currentPrice: price,
      priceDisplayText,
    });
  };

  // Add theme change handler
  phoneRepairForm.onThemeChange = (newTheme, previousTheme) => {
    console.debug(
      `PhoneRepairForm: theme changed from ${previousTheme} to ${newTheme}`
    );
  };

  return phoneRepairForm;
};

// Define required props for validation
createPhoneRepairForm.requiredProps = [];

// Create the component with theme awareness
const PhoneRepairForm = withThemeAwareness(
  createComponent('PhoneRepairForm', createPhoneRepairForm)
);

// Export as a factory function
export default PhoneRepairForm;
