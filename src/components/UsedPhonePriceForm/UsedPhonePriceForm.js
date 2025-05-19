// src/components/UsedPhonePriceForm/UsedPhonePriceForm.js
import './UsedPhonePriceForm.css';
import { Component } from '../../utils/componentFactory.js';
import Select from '../Select/Select.js';
import StepsIndicator from '../StepsIndicator/StepsIndicator.js';
import PriceDisplay from '../PriceDisplay/PriceDisplay.js';
import ConditionSelector from '../ConditionSelector/ConditionSelector.js';
import Button from '../Button/Button.js';
import { defaultLabels } from '../../config/UsedPhonePriceFormConfig.js';

/**
 * UsedPhonePriceForm component for selecting used phone options and viewing prices
 * This is a presentational component with no API calls or state management
 * @extends Component
 */
export default class UsedPhonePriceForm extends Component {
  /**
   * Creates a new UsedPhonePriceForm instance
   *
   * @param {Object} props - UsedPhonePriceForm properties
   * @param {Function} [props.onManufacturerChange] - Callback when manufacturer changes
   * @param {Function} [props.onDeviceChange] - Callback when device changes
   * @param {Function} [props.onConditionChange] - Callback when condition changes
   * @param {Function} [props.onSubmit] - Callback when form is submitted
   * @param {Object} [props.labels={}] - Custom labels for form elements
   * @param {boolean} [props.showStepsIndicator=true] - Whether to show steps indicator
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({
    onManufacturerChange,
    onDeviceChange,
    onConditionChange,
    onSubmit,
    labels = {},
    showStepsIndicator = true,
    className = '',
  }) {
    super();

    // Set labels with defaults
    this.labels = { ...defaultLabels, ...labels };

    // Store callbacks
    this.callbacks = {
      onManufacturerChange,
      onDeviceChange,
      onConditionChange,
      onSubmit,
    };

    // Store props
    this.props = {
      showStepsIndicator,
      className,
    };

    // Component state
    this.state = {
      manufacturers: [],
      devices: [],
      conditions: [],
      selectedManufacturer: '',
      selectedDevice: '',
      selectedCondition: '',
      currentPrice: null,
      loading: {
        manufacturers: false,
        devices: false,
        conditions: false,
        price: false,
        submit: false,
      },
      error: {
        manufacturers: null,
        devices: null,
        conditions: null,
        price: null,
        submit: null,
      },
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
      'used-phone-price-form',
      this.props.className,
      {
        'used-phone-price-form--loading': this.isAnyLoading(),
        'used-phone-price-form--error': this.hasAnyError(),
      }
    );

    // Create the main form element
    const form = this.createElement('form', {
      className: classNames,
      events: {
        submit: (e) => this.handleSubmit(e),
      },
    });

    // Add step indicator if enabled
    if (this.props.showStepsIndicator) {
      const steps = [
        { name: this.labels.manufacturerStep, completed: false },
        { name: this.labels.deviceStep, completed: false },
        { name: this.labels.conditionStep, completed: false },
      ];

      this.stepsIndicator = new StepsIndicator({
        steps,
        activeIndex: 0,
      });
      form.appendChild(this.stepsIndicator.getElement());
    }

    // Create manufacturer select - directly without form group
    this.manufacturerSelect = new Select({
      id: 'manufacturer',
      name: 'manufacturer',
      placeholder: this.labels.manufacturerPlaceholder,
      onChange: (event, value) => this.handleManufacturerChange(value),
    });
    form.appendChild(this.manufacturerSelect.getElement());

    // Create device select - directly without form group
    this.deviceSelect = new Select({
      id: 'device',
      name: 'device',
      placeholder: this.labels.devicePlaceholder,
      disabled: true,
      onChange: (event, value) => this.handleDeviceChange(value),
    });
    form.appendChild(this.deviceSelect.getElement());

    // Create condition section
    const conditionField = this.createElement('div', {
      className: 'form-group__field',
    });

    // Create condition selector with empty initial state
    this.conditionSelector = new ConditionSelector({
      conditions: [],
      onSelect: (conditionId) => this.handleConditionChange(conditionId),
    });
    conditionField.appendChild(this.conditionSelector.getElement());
    form.appendChild(conditionField);

    // Create price display
    this.priceDisplay = new PriceDisplay({
      label: this.labels.priceLabel,
      value: this.labels.initialPriceText,
      isPlaceholder: true,
    });
    form.appendChild(this.priceDisplay.getElement());

    // Create submit button container
    const buttonContainer = this.createElement('div', {
      className: 'used-phone-price-form__actions',
    });

    // Create submit button
    this.submitButton = new Button({
      text: this.labels.submitButtonText,
      type: 'submit',
      variant: 'default',
      disabled: !this.canSubmit(),
    });
    buttonContainer.appendChild(this.submitButton.getElement());
    form.appendChild(buttonContainer);

    return form;
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
   * Set conditions data
   * @param {Array} conditions - Conditions array
   */
  setConditions(conditions) {
    this.state.conditions = conditions;

    // Update condition selector
    this.conditionSelector.updateConditions(conditions);
    this.conditionSelector.setLoading(false);
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
   * Set form loading state
   * @param {Object} loading - Loading state object
   */
  setLoading(loading) {
    this.state.loading = loading;
    this.updateFormState();

    // Update condition selector loading state
    if (loading.conditions) {
      this.conditionSelector.setLoading(true);
    }

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

    // Display specific error messages
    if (error.devices) {
      this.priceDisplay.setError('Fehler beim Laden der Geräte');
    } else if (error.conditions) {
      this.priceDisplay.setError('Fehler beim Laden der Gerätezustände');
    } else if (error.price) {
      this.priceDisplay.setError('Fehler beim Laden des Preises');
    }
  }

  /**
   * Handle form submission
   * @private
   * @param {Event} event - The submit event
   */
  handleSubmit(event) {
    event.preventDefault();

    // Don't submit if any data is missing
    if (!this.canSubmit()) {
      return;
    }

    // Don't submit if already loading
    if (this.state.loading.submit) {
      return;
    }

    // Update loading state
    this.setState({
      loading: { ...this.state.loading, submit: true },
      error: { ...this.state.error, submit: null },
    });

    // Update UI to reflect loading
    this.updateFormState();
    this.submitButton.setText(this.labels.submitButtonLoadingText);
    this.submitButton.setDisabled(true);

    // Prepare form data
    const formData = {
      manufacturerId: this.state.selectedManufacturer,
      deviceId: this.state.selectedDevice,
      conditionId: this.state.selectedCondition,
      price: this.state.currentPrice?.price,
      // Include additional identifying information
      manufacturerName: this.getSelectedManufacturerName(),
      deviceName: this.getSelectedDeviceName(),
      conditionName: this.getSelectedConditionName(),
    };

    // Call onSubmit callback if provided
    if (this.callbacks.onSubmit) {
      try {
        this.callbacks.onSubmit(formData);
      } catch (error) {
        console.error('Error in onSubmit callback:', error);
        this.setState({
          error: { ...this.state.error, submit: error.message },
        });
      }
    }

    // Reset loading state after a short delay (even if there was an error)
    setTimeout(() => {
      this.setState({
        loading: { ...this.state.loading, submit: false },
      });
      this.updateFormState();
      this.submitButton.setText(this.labels.submitButtonText);
      this.submitButton.setDisabled(!this.canSubmit());
    }, 1000);
  }

  /**
   * Check if form can be submitted
   * @private
   * @returns {boolean} Whether the form can be submitted
   */
  canSubmit() {
    return (
      !!this.state.selectedManufacturer &&
      !!this.state.selectedDevice &&
      !!this.state.selectedCondition &&
      !!this.state.currentPrice
    );
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
      'used-phone-price-form--loading',
      this.isAnyLoading()
    );
    formElement.classList.toggle(
      'used-phone-price-form--error',
      this.hasAnyError()
    );

    // Update step indicator if enabled
    if (this.props.showStepsIndicator && this.stepsIndicator) {
      const steps = [
        {
          name: this.labels.manufacturerStep,
          completed: !!this.state.selectedManufacturer,
        },
        {
          name: this.labels.deviceStep,
          completed: !!this.state.selectedDevice,
        },
        {
          name: this.labels.conditionStep,
          completed: !!this.state.selectedCondition,
        },
      ];

      // Determine active step
      let activeIndex = 0;
      if (this.state.selectedManufacturer) activeIndex = 1;
      if (this.state.selectedDevice) activeIndex = 2;

      this.stepsIndicator.update({ steps, activeIndex });
    }

    // Update submit button state
    if (this.submitButton) {
      this.submitButton.setDisabled(!this.canSubmit());
    }
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
      return this.labels.priceNotAvailable;
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
      }
    }
  }

  /**
   * Handle manufacturer selection change
   * @private
   * @param {string} manufacturerId - Selected manufacturer ID
   */
  handleManufacturerChange(manufacturerId) {
    if (!manufacturerId) return;

    this.setState({ selectedManufacturer: manufacturerId });

    // Update form state for step indicator
    this.updateFormState();

    // Call callback instead of loading devices directly
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

    // Update form state for step indicator
    this.updateFormState();

    // Call callback instead of loading conditions directly
    if (this.callbacks.onDeviceChange) {
      this.callbacks.onDeviceChange(deviceId);
    }
  }

  /**
   * Handle condition selection change
   * @private
   * @param {string} conditionId - Selected condition ID
   */
  handleConditionChange(conditionId) {
    if (!conditionId) return;

    this.setState({ selectedCondition: conditionId });

    // Update form state for step indicator
    this.updateFormState();

    // Call callback instead of loading price directly
    if (this.callbacks.onConditionChange) {
      this.callbacks.onConditionChange(conditionId);
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
   * Update the submit button state
   * @private
   */
  updateScheduleButton() {
    if (this.submitButton) {
      const canSubmit = this.canSubmit();
      this.submitButton.setDisabled(!canSubmit);
    }
  }

  /**
   * Get name of selected manufacturer
   * @private
   * @returns {string} Manufacturer name
   */
  getSelectedManufacturerName() {
    const manufacturer = this.state.manufacturers.find(
      (m) => m.id.toString() === this.state.selectedManufacturer
    );
    return manufacturer ? manufacturer.name : '';
  }

  /**
   * Get name of selected device
   * @private
   * @returns {string} Device name
   */
  getSelectedDeviceName() {
    const device = this.state.devices.find(
      (d) => d.id.toString() === this.state.selectedDevice
    );
    return device ? device.name : '';
  }

  /**
   * Get name of selected condition
   * @private
   * @returns {string} Condition name
   */
  getSelectedConditionName() {
    const condition = this.state.conditions.find(
      (c) => c.id.toString() === this.state.selectedCondition
    );
    return condition ? condition.name : '';
  }

  /**
   * Gets the form element
   * @returns {HTMLElement} The form element
   */
  getElement() {
    return this.form;
  }
}
