// src/components/UsedPhonePriceForm/UsedPhonePriceForm.js
import './UsedPhonePriceForm.css';
import { Component } from '../../utils/componentFactory.js';
import Select from '../Select/Select.js';
import StepsIndicator from '../StepsIndicator/StepsIndicator.js';
import FormGroup from '../Form/FormGroup.js';
import PriceDisplay from '../PriceDisplay/PriceDisplay.js';
import ConditionSelector from '../ConditionSelector/ConditionSelector.js';
import Button from '../Button/Button.js';
import { defaultLabels } from '../../config/UsedPhonePriceFormConfig.js';

/**
 * UsedPhonePriceForm component for selecting used phone options and viewing prices
 * @extends Component
 */
export default class UsedPhonePriceForm extends Component {
  /**
   * Creates a new UsedPhonePriceForm instance
   *
   * @param {Object} props - UsedPhonePriceForm properties
   * @param {Object} props.service - Service for API interactions
   * @param {Function} [props.onPriceChange] - Callback when a price is selected
   * @param {Function} [props.onSubmit] - Callback when form is submitted
   * @param {Object} [props.labels={}] - Custom labels for form elements
   * @param {boolean} [props.showStepsIndicator=true] - Whether to show steps indicator
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({
    service,
    onPriceChange,
    onSubmit,
    labels = {},
    showStepsIndicator = true,
    className = '',
  }) {
    super();

    // Validate required props
    if (!service) {
      throw new Error('UsedPhonePriceForm: service is required');
    }

    // Set labels with defaults
    this.labels = { ...defaultLabels, ...labels };

    // Store props
    this.props = {
      service,
      onPriceChange,
      onSubmit,
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

    // Create component references (will be set in createFormElement)
    this.manufacturerSelect = null;
    this.deviceSelect = null;
    this.conditionSelector = null;
    this.priceDisplay = null;
    this.submitButton = null;
    this.stepsIndicator = null;

    // Create form element
    this.form = this.createFormElement();

    // Initialize form data
    this.loadManufacturers();
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

    // Add title
    const title = this.createElement('h2', {
      className: 'used-phone-price-form__title',
      textContent: this.labels.title,
    });
    form.appendChild(title);

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

    // Create manufacturer select
    this.manufacturerSelect = new Select({
      id: 'manufacturer',
      name: 'manufacturer',
      placeholder: this.labels.manufacturerPlaceholder,
      disabled: true,
      onChange: (event, value) => this.handleManufacturerChange(value),
    });

    const manufacturerGroup = new FormGroup({
      label: this.labels.manufacturerLabel,
      field: this.manufacturerSelect,
      id: 'manufacturer',
    });
    form.appendChild(manufacturerGroup.getElement());

    // Create device select
    this.deviceSelect = new Select({
      id: 'device',
      name: 'device',
      placeholder: this.labels.devicePlaceholder,
      disabled: true,
      onChange: (event, value) => this.handleDeviceChange(value),
    });

    const deviceGroup = new FormGroup({
      label: this.labels.deviceLabel,
      field: this.deviceSelect,
      id: 'device',
    });
    form.appendChild(deviceGroup.getElement());

    // Create condition section
    const conditionGroup = this.createElement('div', {
      className: 'form-group',
    });

    const conditionLabel = this.createElement('label', {
      className: 'form-group__label',
      textContent: this.labels.conditionLabel,
    });

    const conditionField = this.createElement('div', {
      className: 'form-group__field',
    });

    // Create condition selector with empty initial state
    this.conditionSelector = new ConditionSelector({
      conditions: [],
      onSelect: (conditionId) => this.handleConditionChange(conditionId),
    });
    conditionField.appendChild(this.conditionSelector.getElement());

    conditionGroup.appendChild(conditionLabel);
    conditionGroup.appendChild(conditionField);
    form.appendChild(conditionGroup);

    // Create price display
    this.priceDisplay = new PriceDisplay({
      label: this.labels.priceLabel,
      value: this.labels.initialPriceText,
    });
    form.appendChild(this.priceDisplay.getElement());

    // Create submit button container
    const buttonContainer = this.createElement('div', {
      className: 'used-phone-price-form__button-container',
    });

    // Create submit button
    this.submitButton = new Button({
      text: this.labels.submitButtonText,
      type: 'submit',
      variant: 'primary',
      disabled: true,
    });
    buttonContainer.appendChild(this.submitButton.getElement());
    form.appendChild(buttonContainer);

    return form;
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
    if (typeof this.props.onSubmit === 'function') {
      try {
        this.props.onSubmit(formData);
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
   * Load manufacturers from service
   * @private
   */
  async loadManufacturers() {
    this.setState({
      loading: { ...this.state.loading, manufacturers: true },
      error: { ...this.state.error, manufacturers: null },
    });

    // Update form state to reflect loading
    this.updateFormState();

    try {
      // Fetch manufacturers from service
      const manufacturers = await this.props.service.fetchManufacturers();

      this.setState({
        manufacturers,
        loading: { ...this.state.loading, manufacturers: false },
      });

      // Update manufacturer select options
      const options = manufacturers.map((m) => ({
        value: m.id.toString(),
        label: m.name,
      }));

      // Enable select and set options
      this.manufacturerSelect.getElement().querySelector('select').disabled =
        false;
      this.updateSelectOptions(this.manufacturerSelect, options);

      // Update form state after loading completes
      this.updateFormState();
    } catch (error) {
      console.error('Error loading manufacturers:', error);
      this.setState({
        loading: { ...this.state.loading, manufacturers: false },
        error: { ...this.state.error, manufacturers: error.message },
      });

      // Update form state to reflect error
      this.updateFormState();
    }
  }

  /**
   * Load devices for a manufacturer from service
   * @private
   * @param {string} manufacturerId - Manufacturer ID
   */
  async loadDevices(manufacturerId) {
    this.setState({
      devices: [],
      conditions: [],
      selectedDevice: '',
      selectedCondition: '',
      currentPrice: null,
      loading: { ...this.state.loading, devices: true },
      error: { ...this.state.error, devices: null },
    });

    // Update form state to reflect loading
    this.updateFormState();

    // Reset dependent fields
    this.deviceSelect.setValue('');
    this.deviceSelect.getElement().querySelector('select').disabled = true;

    // Reset condition selector
    this.conditionSelector.updateConditions([]);

    // Reset price display
    this.priceDisplay.setValue(this.labels.initialPriceText);
    this.priceDisplay.setLoading(false);

    try {
      // Fetch devices from service
      const devices = await this.props.service.fetchDevices(manufacturerId);

      this.setState({
        devices,
        loading: { ...this.state.loading, devices: false },
      });

      // Update device select options
      const options = devices.map((d) => ({
        value: d.id.toString(),
        label: d.name,
      }));

      // Enable select and set options
      this.deviceSelect.getElement().querySelector('select').disabled = false;
      this.updateSelectOptions(this.deviceSelect, options);

      // Update form state after loading completes
      this.updateFormState();
    } catch (error) {
      console.error('Error loading devices:', error);
      this.setState({
        loading: { ...this.state.loading, devices: false },
        error: { ...this.state.error, devices: error.message },
      });

      // Show error message in price display
      this.priceDisplay.setValue(this.labels.deviceLoadError);
      this.priceDisplay.setLoading(false);

      // Update form state to reflect error
      this.updateFormState();
    }
  }

  /**
   * Load conditions for a device from service
   * @private
   * @param {string} deviceId - Device ID
   */
  async loadConditions(deviceId) {
    this.setState({
      conditions: [],
      selectedCondition: '',
      currentPrice: null,
      loading: { ...this.state.loading, conditions: true },
      error: { ...this.state.error, conditions: null },
    });

    // Update form state to reflect loading
    this.updateFormState();

    // Update condition selector loading state
    this.conditionSelector.setLoading(true);

    // Reset price display
    this.priceDisplay.setValue(this.labels.initialPriceText);
    this.priceDisplay.setLoading(false);

    try {
      // Fetch conditions from service
      const conditions = await this.props.service.fetchConditions(deviceId);

      this.setState({
        conditions,
        loading: { ...this.state.loading, conditions: false },
      });

      // Update condition selector with new conditions
      this.conditionSelector.updateConditions(conditions);
      this.conditionSelector.setLoading(false);

      // Update form state after loading completes
      this.updateFormState();
    } catch (error) {
      console.error('Error loading conditions:', error);
      this.setState({
        loading: { ...this.state.loading, conditions: false },
        error: { ...this.state.error, conditions: error.message },
      });

      // Update condition selector to show error state
      this.conditionSelector.setLoading(false);

      // Show error message in price display
      this.priceDisplay.setValue(this.labels.conditionLoadError);
      this.priceDisplay.setLoading(false);

      // Update form state to reflect error
      this.updateFormState();
    }
  }

  /**
   * Load price for a condition from service
   * @private
   * @param {string} conditionId - Condition ID
   */
  async loadPrice(conditionId) {
    this.setState({
      currentPrice: null,
      loading: { ...this.state.loading, price: true },
      error: { ...this.state.error, price: null },
    });

    // Update form state to reflect loading
    this.updateFormState();

    // Update price display loading state
    this.priceDisplay.setValue(this.labels.loadingPriceText);
    this.priceDisplay.setLoading(true);

    try {
      // Fetch price from service
      const priceData = await this.props.service.fetchPrice(conditionId);

      this.setState({
        currentPrice: priceData,
        loading: { ...this.state.loading, price: false },
      });

      // Format and display price
      const formattedPrice = this.formatPrice(priceData.price);
      this.priceDisplay.setValue(formattedPrice, true);
      this.priceDisplay.setLoading(false);

      // Call onPriceChange callback if provided
      if (typeof this.props.onPriceChange === 'function') {
        this.props.onPriceChange(priceData);
      }

      // Update form state after loading completes
      this.updateFormState();
    } catch (error) {
      console.error('Error loading price:', error);
      this.setState({
        loading: { ...this.state.loading, price: false },
        error: { ...this.state.error, price: error.message },
      });

      // Show error message in price display
      this.priceDisplay.setValue(this.labels.priceLoadError);
      this.priceDisplay.setLoading(false);

      // Update form state to reflect error
      this.updateFormState();
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

    // Load devices for selected manufacturer
    this.loadDevices(manufacturerId);
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

    // Load conditions for selected device
    this.loadConditions(deviceId);
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

    // Load price for selected condition
    this.loadPrice(conditionId);
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
   * Update component state
   * @private
   * @param {Object} newState - New state object to merge with current state
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  /**
   * Gets the form element
   * @returns {HTMLElement} The form element
   */
  getElement() {
    return this.form;
  }
}
