// src/components/UsedPhonePriceForm/UsedPhonePriceForm.js
import './UsedPhonePriceForm.css';
import { Component } from '../../utils/componentFactory.js';
import Select from '../Select/Select.js';

/**
 * UsedPhonePriceForm component for selecting used phone options and viewing prices
 * @extends Component
 */
export default class UsedPhonePriceForm extends Component {
  /**
   * Creates a new UsedPhonePriceForm instance
   *
   * @param {Object} props - UsedPhonePriceForm properties
   * @param {Function} [props.onPriceChange] - Callback when a price is selected
   * @param {Object} [props.mockData] - Optional mock data for testing/storybook
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {boolean} [props.useMockData=false] - Whether to use mock data instead of API
   * @param {boolean} [props.showStepsIndicator=true] - Whether to show the steps indicator
   */
  constructor({
    onPriceChange,
    mockData,
    className = '',
    useMockData = false,
    showStepsIndicator = true,
  }) {
    super();

    // Store props
    this.props = {
      onPriceChange,
      mockData,
      className,
      useMockData,
      showStepsIndicator,
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
      },
      error: {
        manufacturers: null,
        devices: null,
        conditions: null,
        price: null,
      },
    };

    // Create references to child components
    this.manufacturerSelect = null;
    this.deviceSelect = null;
    this.conditionSelect = null;
    this.priceDisplay = null;

    // Create form element
    this.form = this.createFormElement();

    // Initialize form
    this.initializeForm();
  }

  /**
   * Creates the form element with step indicators
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
        submit: (e) => e.preventDefault(),
      },
    });

    // Add title
    const title = this.createElement('h2', {
      className: 'used-phone-price-form__title',
      textContent: 'Telefon verkaufen',
    });
    form.appendChild(title);

    // Add step indicator if enabled
    if (this.props.showStepsIndicator) {
      const stepsContainer = this.createStepIndicator();
      form.appendChild(stepsContainer);
    }

    // Create form fields
    // Manufacturer select
    const manufacturerContainer = this.createFormGroup({
      labelText: 'Hersteller:',
      id: 'manufacturer',
    });

    this.manufacturerSelect = new Select({
      id: 'manufacturer',
      name: 'manufacturer',
      placeholder: 'Hersteller auswählen',
      onChange: (event, value) => this.handleManufacturerChange(value),
    });
    manufacturerContainer
      .querySelector('.form-group__field')
      .appendChild(this.manufacturerSelect.getElement());

    // Device select
    const deviceContainer = this.createFormGroup({
      labelText: 'Modell:',
      id: 'device',
    });

    this.deviceSelect = new Select({
      id: 'device',
      name: 'device',
      placeholder: 'Zuerst Hersteller auswählen',
      disabled: true,
      onChange: (event, value) => this.handleDeviceChange(value),
    });
    deviceContainer
      .querySelector('.form-group__field')
      .appendChild(this.deviceSelect.getElement());

    // Condition select
    const conditionContainer = this.createFormGroup({
      labelText: 'Zustand:',
      id: 'condition',
    });

    this.conditionSelect = new Select({
      id: 'condition',
      name: 'condition',
      placeholder: 'Zuerst Modell auswählen',
      disabled: true,
      onChange: (event, value) => this.handleConditionChange(value),
    });
    conditionContainer
      .querySelector('.form-group__field')
      .appendChild(this.conditionSelect.getElement());

    // Price display
    const priceContainer = this.createElement('div', {
      className: 'used-phone-price-form__price-container',
    });

    const priceLabel = this.createElement('span', {
      className: 'used-phone-price-form__price-label',
      textContent: 'Auszahlungspreis:',
    });

    this.priceDisplay = this.createElement('span', {
      className: 'used-phone-price-form__price-value',
      textContent: 'Bitte wählen Sie Hersteller, Modell und Zustand',
    });

    priceContainer.appendChild(priceLabel);
    priceContainer.appendChild(this.priceDisplay);

    // Add form groups to form
    form.appendChild(manufacturerContainer);
    form.appendChild(deviceContainer);
    form.appendChild(conditionContainer);
    form.appendChild(priceContainer);

    return form;
  }

  /**
   * Creates step indicator component
   * @private
   * @returns {HTMLElement} Step indicator element
   */
  createStepIndicator() {
    const stepsContainer = this.createElement('div', {
      className: 'used-phone-form__steps',
    });
    // Using the exact same German names as in PhoneRepairForm
    const steps = [
      { name: 'Hersteller', completed: !!this.state.selectedManufacturer },
      { name: 'Modell', completed: !!this.state.selectedDevice },
      { name: 'Zustand', completed: !!this.state.selectedCondition }, // "Zustand" is German for "Condition"
    ];
    let activeIndex = 0;
    if (this.state.selectedManufacturer) activeIndex = 1;
    if (this.state.selectedDevice) activeIndex = 2;
    steps.forEach((step, index) => {
      const stepElement = this.createElement('div', {
        className: this.createClassNames('used-phone-form__step', {
          'used-phone-form__step--active': index === activeIndex,
          'used-phone-form__step--completed': step.completed,
        }),
      });
      const stepNumber = this.createElement('div', {
        className: 'used-phone-form__step-number',
        textContent: (index + 1).toString(),
      });
      const stepName = this.createElement('div', {
        className: 'used-phone-form__step-name',
        textContent: step.name,
      });
      stepElement.appendChild(stepNumber);
      stepElement.appendChild(stepName);
      stepsContainer.appendChild(stepElement);
    });
    return stepsContainer;
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
   * Creates a form group container with label and field container
   * @private
   * @param {Object} options - Form group options
   * @param {string} options.labelText - Label text
   * @param {string} options.id - Element ID
   * @returns {HTMLElement} The form group container
   */
  createFormGroup({ labelText, id }) {
    const container = this.createElement('div', {
      className: 'form-group',
    });

    const label = this.createElement('label', {
      className: 'form-group__label',
      attributes: { for: id },
      textContent: labelText,
    });

    const fieldContainer = this.createElement('div', {
      className: 'form-group__field',
    });

    container.appendChild(label);
    container.appendChild(fieldContainer);

    return container;
  }

  /**
   * Initialize form data
   * @private
   */
  async initializeForm() {
    if (this.props.useMockData) {
      // Initialize with mock data
      this.loadMockManufacturers();
    } else {
      // Load real data from API
      this.loadManufacturers();
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
      const manufacturers = await this.fetchFromApi('manufacturers');

      this.setState({
        manufacturers,
        loading: { ...this.state.loading, manufacturers: false },
      });

      // Update manufacturer select options
      const options = manufacturers.map((m) => ({
        value: m.id.toString(),
        label: m.name,
      }));

      this.manufacturerSelect.getElement().querySelector('select').disabled =
        false;
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
    this.conditionSelect.setValue('');
    this.conditionSelect.getElement().querySelector('select').disabled = true;
    this.updatePriceDisplay('Bitte Modell und Zustand auswählen');

    try {
      // Fetch devices from API
      const devices = await this.fetchFromApi('devices', manufacturerId);

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
      this.updatePriceDisplay('Fehler beim Laden der Geräte');

      // Update form state to reflect error
      this.updateFormState();
    }
  }

  /**
   * Load conditions for a device from API
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

    // Reset condition field
    this.conditionSelect.setValue('');
    this.updatePriceDisplay('Bitte Zustand auswählen');

    try {
      // Fetch conditions from API - for a used phone form, these would be condition options
      const conditions = await this.fetchFromApi('conditions', deviceId);

      this.setState({
        conditions,
        loading: { ...this.state.loading, conditions: false },
      });

      // Update condition select options
      const options = conditions.map((c) => ({
        value: c.id.toString(),
        label: c.name,
      }));

      this.conditionSelect.getElement().querySelector('select').disabled =
        false;
      this.updateSelectOptions(this.conditionSelect, options);

      // Update form state after loading completes
      this.updateFormState();
    } catch (error) {
      console.error('Error loading conditions:', error);
      this.setState({
        loading: { ...this.state.loading, conditions: false },
        error: { ...this.state.error, conditions: error.message },
      });
      this.updatePriceDisplay('Fehler beim Laden der Zustandsoptionen');

      // Update form state to reflect error
      this.updateFormState();
    }
  }

  /**
   * Load price for a device with specific condition from API
   * @private
   * @param {string} deviceId - Device ID
   * @param {string} conditionId - Condition ID
   */
  async loadPrice(deviceId, conditionId) {
    this.setState({
      currentPrice: null,
      loading: { ...this.state.loading, price: true },
      error: { ...this.state.error, price: null },
    });

    // Update form state to reflect loading
    this.updateFormState();

    this.updatePriceDisplay('Preis wird geladen...');

    try {
      // Fetch price from API
      const priceData = await this.fetchFromApi('price', deviceId, conditionId);

      this.setState({
        currentPrice: priceData,
        loading: { ...this.state.loading, price: false },
      });

      // Format and display price
      const formattedPrice = this.formatPrice(priceData.price);
      this.updatePriceDisplay(formattedPrice);

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
      this.updatePriceDisplay('Fehler beim Laden des Preises');

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
      } else if (selectComponent === this.conditionSelect) {
        this.conditionSelect = newSelect;
      }
    }
  }

  /**
   * Update price display
   * @private
   * @param {string} text - Text to display
   */
  updatePriceDisplay(text) {
    if (this.priceDisplay) {
      this.priceDisplay.textContent = text;

      // Add price highlight class if it's an actual price
      const priceContainer = this.priceDisplay.parentElement;
      if (priceContainer) {
        if (text.includes('€') || text.includes('EUR')) {
          priceContainer.classList.add(
            'used-phone-price-form__price-container--has-price'
          );
        } else {
          priceContainer.classList.remove(
            'used-phone-price-form__price-container--has-price'
          );
        }
      }
    }
  }

  /**
   * Update form state based on selection changes
   * @private
   */
  updateFormState() {
    // Update loading states
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
    if (this.props.showStepsIndicator) {
      const oldSteps = formElement.querySelector('.used-phone-form__steps');
      if (oldSteps) {
        const newSteps = this.createStepIndicator();
        formElement.replaceChild(newSteps, oldSteps);
      } else {
        // If using old class name
        const oldStyleSteps = formElement.querySelector(
          '.used-phone-price-form__steps'
        );
        if (oldStyleSteps) {
          const newSteps = this.createStepIndicator();
          formElement.replaceChild(newSteps, oldStyleSteps);
        }
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

    if (this.props.useMockData) {
      this.loadMockDevices(manufacturerId);
    } else {
      this.loadDevices(manufacturerId);
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

    if (this.props.useMockData) {
      this.loadMockConditions(deviceId);
    } else {
      this.loadConditions(deviceId);
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

    if (this.props.useMockData) {
      this.loadMockPrice(this.state.selectedDevice, conditionId);
    } else {
      this.loadPrice(this.state.selectedDevice, conditionId);
    }
  }

  /**
   * Fetch data from API with error handling
   * @private
   * @param {string} endpoint - API endpoint
   * @param {string} [id] - Optional ID for endpoints that require it
   * @param {string} [secondId] - Optional second ID for endpoints that require it
   * @returns {Promise<Object>} API response
   */
  async fetchFromApi(endpoint, id, secondId) {
    try {
      let response;

      // Updated API endpoints to match the structure used in PhoneRepairForm
      switch (endpoint) {
        case 'manufacturers':
          response = await fetch('/api/manufacturers');
          break;
        case 'devices':
          response = await fetch(`/api/manufacturers/${id}/devices`);
          break;
        case 'conditions':
          response = await fetch(`/api/devices/${id}/conditions`);
          break;
        case 'price':
          // Updated to match the pattern in phoneRepairData.js
          response = await fetch(`/api/conditions/${secondId}/price`);
          break;
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API fetch error (${endpoint}):`, error);
      throw error;
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
   * Load mock manufacturers
   * @private
   */
  loadMockManufacturers() {
    // Example mock manufacturers data
    const mockManufacturers = [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Samsung' },
      { id: 3, name: 'Google' },
      { id: 4, name: 'Huawei' },
      { id: 5, name: 'Xiaomi' },
    ];

    this.setState({
      manufacturers: mockManufacturers,
      loading: { ...this.state.loading, manufacturers: false },
    });

    // Update form state
    this.updateFormState();

    // Update manufacturer select options
    const options = mockManufacturers.map((m) => ({
      value: m.id.toString(),
      label: m.name,
    }));

    this.manufacturerSelect.getElement().querySelector('select').disabled =
      false;
    this.updateSelectOptions(this.manufacturerSelect, options);
  }

  /**
   * Load mock devices
   * @private
   * @param {string} manufacturerId - Manufacturer ID
   */
  loadMockDevices(manufacturerId) {
    // Reset states
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
    this.conditionSelect.setValue('');
    this.conditionSelect.getElement().querySelector('select').disabled = true;
    this.updatePriceDisplay('Bitte Modell und Zustand auswählen');

    // Example mock devices data
    let devices = [];

    switch (manufacturerId) {
      case '1': // Apple
        devices = [
          { id: 1, name: 'iPhone 13', manufacturerId: 1 },
          { id: 2, name: 'iPhone 12', manufacturerId: 1 },
          { id: 3, name: 'iPhone 11', manufacturerId: 1 },
          { id: 4, name: 'iPhone XS', manufacturerId: 1 },
        ];
        break;
      case '2': // Samsung
        devices = [
          { id: 5, name: 'Galaxy S22', manufacturerId: 2 },
          { id: 6, name: 'Galaxy S21', manufacturerId: 2 },
          { id: 7, name: 'Galaxy Note 20', manufacturerId: 2 },
        ];
        break;
      case '3': // Google
        devices = [
          { id: 8, name: 'Pixel 6', manufacturerId: 3 },
          { id: 9, name: 'Pixel 5', manufacturerId: 3 },
        ];
        break;
      case '4': // Huawei
        devices = [
          { id: 10, name: 'P40 Pro', manufacturerId: 4 },
          { id: 11, name: 'P30 Pro', manufacturerId: 4 },
        ];
        break;
      case '5': // Xiaomi
        devices = [
          { id: 12, name: 'Mi 11', manufacturerId: 5 },
          { id: 13, name: 'Redmi Note 10', manufacturerId: 5 },
        ];
        break;
      default:
        devices = [];
    }

    this.setState({
      devices,
      loading: { ...this.state.loading, devices: false },
    });

    // Update form state after loading completes
    this.updateFormState();

    // Update device select options
    const options = devices.map((d) => ({
      value: d.id.toString(),
      label: d.name,
    }));

    this.deviceSelect.getElement().querySelector('select').disabled = false;
    this.updateSelectOptions(this.deviceSelect, options);
    this.updatePriceDisplay('Bitte Modell und Zustand auswählen');
  }

  /**
   * Load mock conditions
   * @private
   * @param {string} deviceId - Device ID
   */
  loadMockConditions(deviceId) {
    this.setState({
      conditions: [],
      selectedCondition: '',
      currentPrice: null,
      loading: { ...this.state.loading, conditions: true },
      error: { ...this.state.error, conditions: null },
    });

    // Update form state to reflect loading
    this.updateFormState();

    // Reset condition field
    this.conditionSelect.setValue('');
    this.updatePriceDisplay('Bitte Zustand auswählen');

    // Example mock conditions data - standardized across devices for simplicity
    const conditions = [
      { id: 1, name: 'Neuwertig', deviceId: parseInt(deviceId) },
      { id: 2, name: 'Sehr gut', deviceId: parseInt(deviceId) },
      { id: 3, name: 'Gut', deviceId: parseInt(deviceId) },
      { id: 4, name: 'Akzeptabel', deviceId: parseInt(deviceId) },
    ];

    this.setState({
      conditions,
      loading: { ...this.state.loading, conditions: false },
    });

    // Update form state after loading completes
    this.updateFormState();

    // Update condition select options
    const options = conditions.map((c) => ({
      value: c.id.toString(),
      label: c.name,
    }));

    this.conditionSelect.getElement().querySelector('select').disabled = false;
    this.updateSelectOptions(this.conditionSelect, options);
    this.updatePriceDisplay('Bitte Zustand auswählen');
  }

  /**
   * Load mock price
   * @private
   * @param {string} deviceId - Device ID
   * @param {string} conditionId - Condition ID
   */
  loadMockPrice(deviceId, conditionId) {
    this.setState({
      currentPrice: null,
      loading: { ...this.state.loading, price: true },
      error: { ...this.state.error, price: null },
    });

    // Update form state to reflect loading
    this.updateFormState();
    this.updatePriceDisplay('Preis wird geladen...');

    // Simulate API delay
    setTimeout(() => {
      // Generate a price based on device ID and condition
      // Higher device ID = newer = more expensive
      // Lower condition ID = better condition = more expensive
      const basePrice = parseInt(deviceId) * 50;
      const conditionMultiplier = 1 - (parseInt(conditionId) - 1) * 0.2;
      const calculatedPrice = Math.round(basePrice * conditionMultiplier);

      const priceData = { price: calculatedPrice };

      this.setState({
        currentPrice: priceData,
        loading: { ...this.state.loading, price: false },
      });

      // Update form state after loading completes
      this.updateFormState();

      // Format and display price
      const formattedPrice = this.formatPrice(priceData.price);
      this.updatePriceDisplay(formattedPrice);

      // Call onPriceChange callback if provided
      if (typeof this.props.onPriceChange === 'function') {
        this.props.onPriceChange(priceData);
      }
    }, 500); // Simulate network delay
  }

  /**
   * Gets the form element
   * @returns {HTMLElement} The form element
   */
  getElement() {
    return this.form;
  }
}
