// src/components/PhoneRepairForm/PhoneRepairForm.js - Simplified version

import './PhoneRepairForm.css';
import { Component } from '../../utils/componentFactory.js';
import Select from '../Select/Select.js';
import StepsIndicator from '../StepsIndicator/StepsIndicator.js';
import PriceDisplay from '../PriceDisplay/PriceDisplay.js';
import Button from '../Button/Button.js';

/**
 * PhoneRepairForm component for selecting phone repair options and viewing prices
 * This is a presentational component with no API calls or state management
 * @extends Component
 */
export default class PhoneRepairForm extends Component {
  /**
   * Creates a new PhoneRepairForm instance
   *
   * @param {Object} props - PhoneRepairForm properties
   * @param {Function} [props.onManufacturerChange] - Callback when manufacturer changes
   * @param {Function} [props.onDeviceChange] - Callback when device changes
   * @param {Function} [props.onActionChange] - Callback when action changes
   * @param {Function} [props.onScheduleClick] - Callback when schedule button is clicked
   * @param {Object} [props.labels={}] - Custom labels for form elements
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({
    onManufacturerChange,
    onDeviceChange,
    onActionChange,
    onScheduleClick,
    usedPhoneUrl = '#',
    labels = {},
    className = '',
  }) {
    super();

    // Set default labels
    this.labels = {
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
      ...labels,
    };

    // Store callbacks
    this.callbacks = {
      onManufacturerChange,
      onDeviceChange,
      onActionChange,
      onScheduleClick,
    };

    // Store props
    this.props = {
      usedPhoneUrl,
      className,
    };

    // UI state (visual state only, not including data)
    this.state = {
      loading: {},
      error: {},
      manufacturers: [],
      devices: [],
      actions: [],
      selectedManufacturer: '',
      selectedDevice: '',
      selectedAction: '',
      currentPrice: null,
    };

    // Create form element
    this.form = this.createFormElement();
  }

  /**
   * Creates the form element with all components
   * @private
   * @returns {HTMLElement} The form element
   */
  createFormElement() {
    // Build class names
    const classNames = this.createClassNames(
      'phone-repair-form',
      this.props.className,
      {
        'phone-repair-form--loading': this.isAnyLoading(),
        'phone-repair-form--error': this.hasAnyError(),
      }
    );

    // Create the main form element
    const form = this.createElement('form', {
      className: classNames,
      events: {
        submit: (e) => e.preventDefault(),
      },
    });

    // Add step indicator
    this.stepsIndicator = new StepsIndicator({
      steps: [
        { name: this.labels.manufacturerStep, completed: false },
        { name: this.labels.deviceStep, completed: false },
        { name: this.labels.serviceStep, completed: false },
      ],
      activeIndex: 0,
    });
    form.appendChild(this.stepsIndicator.getElement());

    // Create manufacturer select
    this.manufacturerSelect = new Select({
      id: 'manufacturer',
      name: 'manufacturer',
      placeholder: this.labels.manufacturerPlaceholder,
      onChange: (event, value) => this.handleManufacturerChange(value),
    });
    form.appendChild(this.manufacturerSelect.getElement());

    // Create device select
    this.deviceSelect = new Select({
      id: 'device',
      name: 'device',
      placeholder: this.labels.devicePlaceholder,
      disabled: true,
      onChange: (event, value) => this.handleDeviceChange(value),
    });
    form.appendChild(this.deviceSelect.getElement());

    // Create action select
    this.actionSelect = new Select({
      id: 'action',
      name: 'action',
      placeholder: this.labels.servicePlaceholder,
      disabled: true,
      onChange: (event, value) => this.handleActionChange(value),
    });
    form.appendChild(this.actionSelect.getElement());

    // Add price display
    this.priceDisplay = new PriceDisplay({
      label: this.labels.priceLabel,
      value: this.labels.initialPriceText,
      isPlaceholder: true,
    });
    form.appendChild(this.priceDisplay.getElement());

    // Create actions container
    const actionsContainer = this.createElement('div', {
      className: 'phone-repair-form__actions',
    });

    // Create link to used phones
    const usedPhoneLink = this.createElement('a', {
      className: 'phone-repair-form__link',
      textContent: this.labels.usedPhoneText,
      attributes: {
        href: this.props.usedPhoneUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    });
    actionsContainer.appendChild(usedPhoneLink);

    // Create schedule button
    this.scheduleButton = new Button({
      text: this.labels.scheduleButtonText,
      onClick: () => this.handleScheduleClick(),
      disabled: !this.canSchedule(),
    });
    actionsContainer.appendChild(this.scheduleButton.getElement());

    // Add actions container to form
    form.appendChild(actionsContainer);

    return form;
  }

  /**
   * Set form loading state
   * @param {Object} loading - Loading state object
   */
  setLoading(loading) {
    this.state.loading = loading;
    this.updateFormState();

    // Update price display loading state
    if (loading.price) {
      this.priceDisplay.setValue(this.labels.loadingPriceText);
      this.priceDisplay.setLoading(true);
    }
  }

  /**
   * Set form error state
   * @param {Object} error - Error state object
   */
  setErrors(error) {
    this.state.error = error;
    this.updateFormState();

    // Update price display error state if needed
    if (error.price) {
      this.priceDisplay.setError(error.price);
    }
  }

  /**
   * Set manufacturers data
   * @param {Array} manufacturers - Manufacturers array
   */
  setManufacturers(manufacturers) {
    this.state.manufacturers = manufacturers;

    // Update manufacturer select options
    const options = manufacturers.map((m) => ({
      value: m.id.toString(),
      label: m.name,
    }));

    // Update select with options
    this.manufacturerSelect.setValue('');
    this.updateSelectOptions(this.manufacturerSelect, options);
  }

  /**
   * Set devices data
   * @param {Array} devices - Devices array
   */
  setDevices(devices) {
    this.state.devices = devices;

    // Update device select options
    const options = devices.map((d) => ({
      value: d.id.toString(),
      label: d.name,
    }));

    // Enable select and set options
    this.deviceSelect.setValue('');
    this.updateSelectOptions(this.deviceSelect, options);
    this.deviceSelect.getElement().querySelector('select').disabled =
      !devices.length;
  }

  /**
   * Set actions data
   * @param {Array} actions - Actions array
   */
  setActions(actions) {
    this.state.actions = actions;

    // Update action select options
    const options = actions.map((a) => ({
      value: a.id.toString(),
      label: a.name,
    }));

    // Enable select and set options
    this.actionSelect.setValue('');
    this.updateSelectOptions(this.actionSelect, options);
    this.actionSelect.getElement().querySelector('select').disabled =
      !actions.length;
  }

  /**
   * Set price data
   * @param {Object} price - Price data object
   */
  setPrice(price) {
    this.state.currentPrice = price;

    if (price) {
      // Format and display price
      const formattedPrice = this.formatPrice(price.price);
      this.priceDisplay.setValue(formattedPrice, true, false);
    } else {
      this.priceDisplay.setValue(this.labels.initialPriceText, false, true);
    }

    this.priceDisplay.setLoading(false);
    this.updateScheduleButton();
  }

  /**
   * Format price for display
   * @private
   * @param {number} price - Price in cents or as a decimal
   * @returns {string} Formatted price
   */
  formatPrice(price) {
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
  }

  /**
   * Update select options
   * @private
   * @param {Object} selectComponent - Select component
   * @param {Array} options - Options array with value and label properties
   */
  updateSelectOptions(selectComponent, options) {
    // Update select component with new options
    selectComponent.props.options = options;

    // Re-render the select component
    const selectElement = selectComponent.getElement();
    const parentNode = selectElement.parentNode;

    if (parentNode) {
      // Create a new select component with updated options
      const newSelect = new Select({
        ...selectComponent.props,
        options,
        disabled: false, // Explicitly set disabled to false
      });

      // Replace the old select with the new one
      parentNode.replaceChild(newSelect.getElement(), selectElement);

      // Update the reference
      if (selectComponent === this.manufacturerSelect) {
        this.manufacturerSelect = newSelect;
      } else if (selectComponent === this.deviceSelect) {
        this.deviceSelect = newSelect;
      } else if (selectComponent === this.actionSelect) {
        this.actionSelect = newSelect;
      }
    }
  }

  /**
   * Update component state
   * @private
   * @param {Object} newState - New state object to merge with current state
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  /**
   * Handle manufacturer selection change
   * @private
   * @param {string} manufacturerId - Selected manufacturer ID
   */
  handleManufacturerChange(manufacturerId) {
    if (!manufacturerId) return;

    this.setState({ selectedManufacturer: manufacturerId });
    this.updateFormState();

    // Call callback if provided
    if (this.callbacks.onManufacturerChange) {
      this.callbacks.onManufacturerChange(manufacturerId);
    }
  }

  /**
   * Handle device selection change
   * @private
   * @param {string} deviceId - Selected device ID
   */
  handleDeviceChange(deviceId) {
    if (!deviceId) return;

    this.setState({ selectedDevice: deviceId });
    this.updateFormState();

    // Call callback if provided
    if (this.callbacks.onDeviceChange) {
      this.callbacks.onDeviceChange(deviceId);
    }
  }

  /**
   * Handle action selection change
   * @private
   * @param {string} actionId - Selected action ID
   */
  handleActionChange(actionId) {
    if (!actionId) return;

    this.setState({ selectedAction: actionId });
    this.updateFormState();

    // Call callback if provided
    if (this.callbacks.onActionChange) {
      this.callbacks.onActionChange(actionId);
    }
  }

  /**
   * Check if scheduling is possible (all selections made)
   * @private
   * @returns {boolean} Whether all selections are made
   */
  canSchedule() {
    return (
      !!this.state.selectedManufacturer &&
      !!this.state.selectedDevice &&
      !!this.state.selectedAction &&
      !!this.state.currentPrice
    );
  }

  /**
   * Handle schedule button click
   * @private
   */
  handleScheduleClick() {
    // Build repair info object with all selections
    const repairInfo = {
      manufacturer: {
        id: this.state.selectedManufacturer,
        name: this.getSelectedManufacturerName(),
      },
      device: {
        id: this.state.selectedDevice,
        name: this.getSelectedDeviceName(),
      },
      service: {
        id: this.state.selectedAction,
        name: this.getSelectedActionName(),
      },
      price: this.state.currentPrice,
      timestamp: new Date().toISOString(),
    };

    // Call onScheduleClick callback if provided
    if (this.callbacks.onScheduleClick) {
      this.callbacks.onScheduleClick(repairInfo);
    }
  }

  /**
   * Get the name of the selected manufacturer
   * @private
   * @returns {string} Name of the selected manufacturer
   */
  getSelectedManufacturerName() {
    const manufacturer = this.state.manufacturers.find(
      (m) => m.id.toString() === this.state.selectedManufacturer
    );
    return manufacturer ? manufacturer.name : '';
  }

  /**
   * Get the name of the selected device
   * @private
   * @returns {string} Name of the selected device
   */
  getSelectedDeviceName() {
    const device = this.state.devices.find(
      (d) => d.id.toString() === this.state.selectedDevice
    );
    return device ? device.name : '';
  }

  /**
   * Get the name of the selected action
   * @private
   * @returns {string} Name of the selected action
   */
  getSelectedActionName() {
    const action = this.state.actions.find(
      (a) => a.id.toString() === this.state.selectedAction
    );
    return action ? action.name : '';
  }

  /**
   * Update the schedule button state
   * @private
   */
  updateScheduleButton() {
    if (this.scheduleButton) {
      const canSchedule = this.canSchedule();
      this.scheduleButton.setDisabled(!canSchedule);
    }
  }

  /**
   * Check if any state is loading
   * @private
   * @returns {boolean} Whether any state is loading
   */
  isAnyLoading() {
    return Object.values(this.state.loading).some(Boolean);
  }

  /**
   * Check if any state has error
   * @private
   * @returns {boolean} Whether any state has error
   */
  hasAnyError() {
    return Object.values(this.state.error).some(Boolean);
  }

  /**
   * Update form state based on selection changes
   * @private
   */
  updateFormState() {
    // Update loading/error classes
    const formElement = this.getElement();
    formElement.classList.toggle(
      'phone-repair-form--loading',
      this.isAnyLoading()
    );
    formElement.classList.toggle(
      'phone-repair-form--error',
      this.hasAnyError()
    );

    // Update steps indicator
    const steps = [
      {
        name: this.labels.manufacturerStep,
        completed: !!this.state.selectedManufacturer,
      },
      { name: this.labels.deviceStep, completed: !!this.state.selectedDevice },
      {
        name: this.labels.serviceStep,
        completed: !!this.state.selectedAction,
      },
    ];

    // Determine active step
    let activeIndex = 0;
    if (this.state.selectedManufacturer) activeIndex = 1;
    if (this.state.selectedDevice) activeIndex = 2;

    // Update steps indicator
    this.stepsIndicator.update({ steps, activeIndex });

    // Update schedule button state
    this.updateScheduleButton();
  }

  /**
   * Gets the form element
   * @returns {HTMLElement} The form element
   */
  getElement() {
    return this.form;
  }
}
