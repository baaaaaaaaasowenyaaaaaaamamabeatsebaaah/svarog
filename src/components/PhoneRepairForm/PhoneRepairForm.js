// src/components/PhoneRepairForm/PhoneRepairForm.js
import './PhoneRepairForm.css';
import { Component } from '../../utils/componentFactory.js';
import Select from '../Select/Select.js';
import StepsIndicator from '../StepsIndicator/StepsIndicator.js';
import PriceDisplay from '../PriceDisplay/PriceDisplay.js';
import PhoneRepairService from '../../services/PhoneRepairService.js';
import { Form, FormGroup, FormActions } from '../Form/index.js';
import Button from '../Button/Button.js';

/**
 * PhoneRepairForm component for selecting phone repair options and viewing prices
 * @extends Component
 */
export default class PhoneRepairForm extends Component {
  /**
   * Creates a new PhoneRepairForm instance
   *
   * @param {Object} props - PhoneRepairForm properties
   * @param {Function} [props.onPriceChange] - Callback when a price is selected
   * @param {Object} [props.labels] - Custom labels for form elements
   * @param {Object} [props.apiOptions] - API service configuration options
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({ onPriceChange, labels = {}, apiOptions = {}, className = '' }) {
    super();

    // Set default labels
    this.labels = {
      title: 'Reparatur anfragen',
      manufacturerStep: 'Hersteller',
      deviceStep: 'Modell',
      serviceStep: 'Service',
      manufacturerLabel: 'Hersteller:',
      deviceLabel: 'Modell:',
      serviceLabel: 'Service:',
      priceLabel: 'Preis:',
      manufacturerPlaceholder: 'Hersteller auswählen',
      devicePlaceholder: 'Zuerst Hersteller auswählen',
      servicePlaceholder: 'Zuerst Modell auswählen',
      initialPriceText: 'Bitte zuerst Hersteller, Modell und Service auswählen',
      loadingPriceText: 'Preis wird geladen...',
      submitButton: 'Anfrage absenden',
      ...labels,
    };

    // Store props
    this.props = {
      onPriceChange,
      className,
    };

    // Initialize service
    this.service = new PhoneRepairService(apiOptions);

    // Component state
    this.state = {
      manufacturers: [],
      devices: [],
      actions: [],
      selectedManufacturer: '',
      selectedDevice: '',
      selectedAction: '',
      currentPrice: null,
      loading: {
        manufacturers: false,
        devices: false,
        actions: false,
        price: false,
      },
      error: {
        manufacturers: null,
        devices: null,
        actions: null,
        price: null,
      },
    };

    // Create child components
    this.createChildComponents();

    // Create form element
    this.form = this.createFormElement();

    // Initialize form
    this.loadManufacturers();
  }

  /**
   * Create the child components needed for the form
   * @private
   */
  createChildComponents() {
    // Create StepsIndicator
    this.stepsIndicator = new StepsIndicator({
      steps: [
        { name: this.labels.manufacturerStep, completed: false },
        { name: this.labels.deviceStep, completed: false },
        { name: this.labels.serviceStep, completed: false },
      ],
      activeIndex: 0,
    });

    // Create manufacturer select
    this.manufacturerSelect = new Select({
      id: 'manufacturer',
      name: 'manufacturer',
      placeholder: this.labels.manufacturerPlaceholder,
      onChange: (event, value) => this.handleManufacturerChange(value),
    });

    // Create device select
    this.deviceSelect = new Select({
      id: 'device',
      name: 'device',
      placeholder: this.labels.devicePlaceholder,
      disabled: true,
      onChange: (event, value) => this.handleDeviceChange(value),
    });

    // Create action select
    this.actionSelect = new Select({
      id: 'action',
      name: 'action',
      placeholder: this.labels.servicePlaceholder,
      disabled: true,
      onChange: (event, value) => this.handleActionChange(value),
    });

    // Create price display
    this.priceDisplay = new PriceDisplay({
      label: this.labels.priceLabel,
      value: this.labels.initialPriceText,
    });

    // Create submit button
    this.submitButton = new Button({
      text: this.labels.submitButton,
      type: 'submit',
      variant: 'primary',
      disabled: true, // Initially disabled until a price is selected
    });
  }

  /**
   * Creates the form element using Form component
   * @private
   * @returns {HTMLElement} The form element
   */
  createFormElement() {
    // Create form groups
    const manufacturerGroup = new FormGroup({
      label: this.labels.manufacturerLabel,
      field: this.manufacturerSelect,
      id: 'manufacturer',
    });

    const deviceGroup = new FormGroup({
      label: this.labels.deviceLabel,
      field: this.deviceSelect,
      id: 'device',
    });

    const actionGroup = new FormGroup({
      label: this.labels.serviceLabel,
      field: this.actionSelect,
      id: 'action',
    });

    // Create form actions with submit button
    const formActions = new FormActions({
      children: this.submitButton,
    });

    // Build class names
    const className = this.createClassNames(
      'phone-repair-form',
      this.props.className
    );

    // Create the main form component
    const formContainer = document.createElement('div');
    formContainer.className = className;

    // Add title
    const title = this.createElement('h2', {
      className: 'phone-repair-form__title',
      textContent: this.labels.title,
    });
    formContainer.appendChild(title);

    // Add steps indicator
    formContainer.appendChild(this.stepsIndicator.getElement());

    // Create main form using Form component
    this.mainForm = new Form({
      className: 'phone-repair-form__main-form',
      children: [
        manufacturerGroup,
        deviceGroup,
        actionGroup,
        this.priceDisplay,
        formActions,
      ],
      onSubmit: (event, formData, isValid) =>
        this.handleSubmit(event, formData, isValid),
    });

    formContainer.appendChild(this.mainForm.getElement());

    // Add loading/error class handlers
    this.updateFormState(formContainer);

    return formContainer;
  }

  /**
   * Handle form submission
   * @private
   * @param {Event} event - The submit event
   * @param {Object} formData - The form data
   * @param {boolean} isValid - Whether the form is valid
   */
  handleSubmit(event, formData, isValid) {
    if (!isValid || !this.state.currentPrice) {
      return;
    }

    // Create full submission data with all relevant information
    const submissionData = {
      ...formData,
      manufacturerId: this.state.selectedManufacturer,
      deviceId: this.state.selectedDevice,
      actionId: this.state.selectedAction,
      price: this.state.currentPrice.price,
      // Include any additional data from the form that might be useful
    };

    // Call onSubmit callback if provided
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(event, submissionData);
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
   * Update form state based on loading and error conditions
   * @private
   * @param {HTMLElement} container - The form container element to update classes on
   */
  updateFormState(container = this.form) {
    // Apply loading and error classes
    container.classList.toggle(
      'phone-repair-form--loading',
      this.isAnyLoading()
    );
    container.classList.toggle('phone-repair-form--error', this.hasAnyError());

    // Update step indicator
    const steps = [
      {
        name: this.labels.manufacturerStep,
        completed: !!this.state.selectedManufacturer,
      },
      { name: this.labels.deviceStep, completed: !!this.state.selectedDevice },
      { name: this.labels.serviceStep, completed: !!this.state.selectedAction },
    ];

    // Determine active step
    let activeIndex = 0;
    if (this.state.selectedManufacturer) activeIndex = 1;
    if (this.state.selectedDevice) activeIndex = 2;

    // Update steps indicator
    this.stepsIndicator.update({ steps, activeIndex });

    // Update submit button state - only enable if we have a price
    if (this.submitButton) {
      this.submitButton.setDisabled(!this.state.currentPrice);
    }
  }

  /**
   * Load manufacturers from API
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
      // Fetch manufacturers from API
      const manufacturers = await this.service.fetchManufacturers();

      this.setState({
        manufacturers,
        loading: { ...this.state.loading, manufacturers: false },
      });

      // Update manufacturer select options
      const options = manufacturers.map((m) => ({
        value: m.id.toString(),
        label: m.name,
      }));

      this.manufacturerSelect.setValue('');
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
   * Load devices for a manufacturer from API
   * @private
   * @param {string} manufacturerId - Manufacturer ID
   */
  async loadDevices(manufacturerId) {
    this.setState({
      devices: [],
      actions: [],
      selectedDevice: '',
      selectedAction: '',
      currentPrice: null,
      loading: { ...this.state.loading, devices: true },
      error: { ...this.state.error, devices: null },
    });

    // Update form state to reflect loading
    this.updateFormState();

    // Reset dependent fields
    this.deviceSelect.setValue('');
    this.actionSelect.setValue('');
    this.actionSelect.getElement().querySelector('select').disabled = true;
    this.priceDisplay.setValue(this.labels.initialPriceText);

    try {
      // Fetch devices from API
      const devices = await this.service.fetchDevices(manufacturerId);

      this.setState({
        devices,
        loading: { ...this.state.loading, devices: false },
      });

      // Update device select options
      const options = devices.map((d) => ({
        value: d.id.toString(),
        label: d.name,
      }));

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
      this.priceDisplay.setValue('Fehler beim Laden der Geräte');

      // Update form state to reflect error
      this.updateFormState();
    }
  }

  /**
   * Load actions for a device from API
   * @private
   * @param {string} deviceId - Device ID
   */
  async loadActions(deviceId) {
    this.setState({
      actions: [],
      selectedAction: '',
      currentPrice: null,
      loading: { ...this.state.loading, actions: true },
      error: { ...this.state.error, actions: null },
    });

    // Update form state to reflect loading
    this.updateFormState();

    // Reset action field
    this.actionSelect.setValue('');
    this.priceDisplay.setValue('Bitte Service auswählen');

    try {
      // Fetch actions from API
      const actions = await this.service.fetchActions(deviceId);

      this.setState({
        actions,
        loading: { ...this.state.loading, actions: false },
      });

      // Update action select options
      const options = actions.map((a) => ({
        value: a.id.toString(),
        label: a.name,
      }));

      this.actionSelect.getElement().querySelector('select').disabled = false;
      this.updateSelectOptions(this.actionSelect, options);

      // Update form state after loading completes
      this.updateFormState();
    } catch (error) {
      console.error('Error loading actions:', error);
      this.setState({
        loading: { ...this.state.loading, actions: false },
        error: { ...this.state.error, actions: error.message },
      });
      this.priceDisplay.setValue('Fehler beim Laden der Services');

      // Update form state to reflect error
      this.updateFormState();
    }
  }

  /**
   * Load price for an action from API
   * @private
   * @param {string} actionId - Action ID
   */
  async loadPrice(actionId) {
    this.setState({
      currentPrice: null,
      loading: { ...this.state.loading, price: true },
      error: { ...this.state.error, price: null },
    });

    // Update form state to reflect loading
    this.updateFormState();

    this.priceDisplay.setValue(this.labels.loadingPriceText);
    this.priceDisplay.setLoading(true);

    try {
      // Fetch price from API
      const priceData = await this.service.fetchPrice(actionId);

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
      this.priceDisplay.setValue('Fehler beim Laden des Preises');
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

    // Load actions for selected device
    this.loadActions(deviceId);
  }

  /**
   * Handle action selection change
   * @private
   * @param {string} actionId - Selected action ID
   */
  handleActionChange(actionId) {
    if (!actionId) return;

    this.setState({ selectedAction: actionId });

    // Update form state for step indicator
    this.updateFormState();

    // Load price for selected action
    this.loadPrice(actionId);
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
