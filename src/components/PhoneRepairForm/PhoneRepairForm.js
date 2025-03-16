// src/components/PhoneRepairForm/PhoneRepairForm.js
import './PhoneRepairForm.css';
import { Component } from '../../utils/componentFactory.js';
import Select from '../Select/Select.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

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
   * @param {Object} [props.mockData] - Optional mock data for testing/storybook
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {boolean} [props.useMockData=false] - Whether to use mock data instead of API
   */
  constructor({
    onPriceChange,
    mockData,
    className = '',
    useMockData = false,
  }) {
    super();

    // Store props
    this.props = {
      onPriceChange,
      mockData,
      className,
      useMockData,
    };

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

    // Create references to child components
    this.manufacturerSelect = null;
    this.deviceSelect = null;
    this.actionSelect = null;
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

    // Add title
    const title = this.createElement('h2', {
      className: 'phone-repair-form__title',
      textContent: 'Reparatur anfragen',
    });
    form.appendChild(title);

    // Add step indicator
    const stepsContainer = this.createStepIndicator();
    form.appendChild(stepsContainer);

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

    // Action select
    const actionContainer = this.createFormGroup({
      labelText: 'Service:',
      id: 'action',
    });

    this.actionSelect = new Select({
      id: 'action',
      name: 'action',
      placeholder: 'Zuerst Modell auswählen',
      disabled: true,
      onChange: (event, value) => this.handleActionChange(value),
    });
    actionContainer
      .querySelector('.form-group__field')
      .appendChild(this.actionSelect.getElement());

    // Price display
    const priceContainer = this.createElement('div', {
      className: 'phone-repair-form__price-container',
    });

    const priceLabel = this.createElement('span', {
      className: 'phone-repair-form__price-label',
      textContent: 'Preis:',
    });

    this.priceDisplay = this.createElement('span', {
      className: 'phone-repair-form__price-value',
      textContent: 'Bitte zuerst Hersteller, Modell und Service auswählen',
    });

    priceContainer.appendChild(priceLabel);
    priceContainer.appendChild(this.priceDisplay);

    // Add form groups to form
    form.appendChild(manufacturerContainer);
    form.appendChild(deviceContainer);
    form.appendChild(actionContainer);
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
      className: 'phone-repair-form__steps',
    });

    const steps = [
      { name: 'Hersteller', completed: !!this.state.selectedManufacturer },
      { name: 'Modell', completed: !!this.state.selectedDevice },
      { name: 'Service', completed: !!this.state.selectedAction },
    ];

    let activeIndex = 0;
    if (this.state.selectedManufacturer) activeIndex = 1;
    if (this.state.selectedDevice) activeIndex = 2;

    steps.forEach((step, index) => {
      const stepElement = this.createElement('div', {
        className: this.createClassNames('phone-repair-form__step', {
          'phone-repair-form__step--active': index === activeIndex,
          'phone-repair-form__step--completed': step.completed,
        }),
      });

      const stepNumber = this.createElement('div', {
        className: 'phone-repair-form__step-number',
        textContent: (index + 1).toString(),
      });

      const stepName = this.createElement('div', {
        className: 'phone-repair-form__step-name',
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
    this.updatePriceDisplay('Bitte Modell und Service auswählen');

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
    this.updatePriceDisplay('Bitte Service auswählen');

    try {
      // Fetch actions from API
      const actions = await this.fetchFromApi('actions', deviceId);

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
      this.updatePriceDisplay('Fehler beim Laden der Services');

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

    this.updatePriceDisplay('Preis wird geladen...');

    try {
      // Fetch price from API
      const priceData = await this.fetchFromApi('price', actionId);

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
      } else if (selectComponent === this.actionSelect) {
        this.actionSelect = newSelect;
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
            'phone-repair-form__price-container--has-price'
          );
        } else {
          priceContainer.classList.remove(
            'phone-repair-form__price-container--has-price'
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
      'phone-repair-form--loading',
      this.isAnyLoading()
    );
    formElement.classList.toggle(
      'phone-repair-form--error',
      this.hasAnyError()
    );

    // Update step indicator
    const oldSteps = formElement.querySelector('.phone-repair-form__steps');
    if (oldSteps) {
      const newSteps = this.createStepIndicator();
      formElement.replaceChild(newSteps, oldSteps);
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
      this.loadMockActions(deviceId);
    } else {
      this.loadActions(deviceId);
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

    // Update form state for step indicator
    this.updateFormState();

    if (this.props.useMockData) {
      this.loadMockPrice(actionId);
    } else {
      this.loadPrice(actionId);
    }
  }

  /**
   * Fetch data from API with error handling
   * @private
   * @param {string} endpoint - API endpoint
   * @param {string} [id] - Optional ID for endpoints that require it
   * @returns {Promise<Object>} API response
   */
  async fetchFromApi(endpoint, id) {
    try {
      let response;

      switch (endpoint) {
        case 'manufacturers':
          response = await fetch('/api/manufacturers');
          break;
        case 'devices':
          response = await fetch(`/api/manufacturers/${id}/devices`);
          break;
        case 'actions':
          response = await fetch(`/api/devices/${id}/actions`);
          break;
        case 'price':
          response = await fetch(`/api/actions/${id}/price`);
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
    const mockManufacturers =
      this.props.mockData?.manufacturers ||
      PhoneRepairForm.defaultMockData.manufacturers;

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
    this.updatePriceDisplay('Bitte Modell und Service auswählen');

    // Find manufacturer in mock data
    const mockData = this.props.mockData || PhoneRepairForm.defaultMockData;
    const manufacturer = mockData.manufacturers.find(
      (m) => m.id.toString() === manufacturerId.toString()
    );

    if (!manufacturer) {
      console.error(
        `Manufacturer with ID ${manufacturerId} not found in mock data`
      );
      this.setState({
        devices: [],
        error: { ...this.state.error, devices: 'Manufacturer not found' },
      });

      // Update form state to reflect error
      this.updateFormState();
      return;
    }

    // Get devices for this manufacturer
    const devices = manufacturer.devices || [];

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

    // IMPORTANT FIX: Make sure to not only update the props but also the DOM element
    this.deviceSelect.getElement().querySelector('select').disabled = false;
    this.updateSelectOptions(this.deviceSelect, options);
    this.updatePriceDisplay('Bitte Modell und Service auswählen');
  }

  /**
   * Load mock actions
   * @private
   * @param {string} deviceId - Device ID
   */
  loadMockActions(deviceId) {
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
    this.updatePriceDisplay('Bitte Service auswählen');

    // Find device in mock data
    const mockData = this.props.mockData || PhoneRepairForm.defaultMockData;
    let foundDevice = null;
    let actions = [];

    // Search through all manufacturers and their devices
    for (const manufacturer of mockData.manufacturers) {
      foundDevice = manufacturer.devices.find(
        (d) => d.id.toString() === deviceId.toString()
      );
      if (foundDevice) {
        actions = foundDevice.actions || [];
        break;
      }
    }

    if (!foundDevice) {
      console.error(`Device with ID ${deviceId} not found in mock data`);
      this.setState({
        actions: [],
        error: { ...this.state.error, actions: 'Device not found' },
      });

      // Update form state to reflect error
      this.updateFormState();
      return;
    }

    this.setState({
      actions,
      loading: { ...this.state.loading, actions: false },
    });

    // Update form state after loading completes
    this.updateFormState();

    // Update action select options
    const options = actions.map((a) => ({
      value: a.id.toString(),
      label: a.name,
    }));

    this.actionSelect.getElement().querySelector('select').disabled = false;
    this.updateSelectOptions(this.actionSelect, options);
    this.updatePriceDisplay('Bitte Service auswählen');
  }

  /**
   * Load mock price
   * @private
   * @param {string} actionId - Action ID
   */
  loadMockPrice(actionId) {
    this.setState({
      currentPrice: null,
      loading: { ...this.state.loading, price: true },
      error: { ...this.state.error, price: null },
    });

    // Update form state to reflect loading
    this.updateFormState();
    this.updatePriceDisplay('Preis wird geladen...');

    // Find action in mock data
    const mockData = this.props.mockData || PhoneRepairForm.defaultMockData;
    let foundAction = null;
    let priceData = null;

    // Search through all manufacturers, their devices and actions
    for (const manufacturer of mockData.manufacturers) {
      for (const device of manufacturer.devices) {
        foundAction = device.actions.find(
          (a) => a.id.toString() === actionId.toString()
        );
        if (
          foundAction &&
          foundAction.prices &&
          foundAction.prices.length > 0
        ) {
          priceData = { price: foundAction.prices[0].price };
          break;
        }
      }
      if (priceData) break;
    }

    if (!priceData) {
      console.error(
        `Action with ID ${actionId} not found in mock data or has no prices`
      );
      this.setState({
        currentPrice: null,
        error: { ...this.state.error, price: 'Price not found' },
      });
      this.updatePriceDisplay('Preis nicht verfügbar');

      // Update form state to reflect error
      this.updateFormState();
      return;
    }

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
  }

  /**
   * Gets the form element
   * @returns {HTMLElement} The form element
   */
  getElement() {
    return this.form;
  }

  /**
   * Default mock data for Storybook and testing
   * @static
   */
  static defaultMockData = mockPhoneRepairData;
}
