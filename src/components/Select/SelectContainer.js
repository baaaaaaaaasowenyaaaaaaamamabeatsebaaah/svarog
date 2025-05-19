// src/components/Select/SelectContainer.js
import { Container } from '../../utils/containerFactory.js';
import { Select } from './Select.js';
import { eventBus } from '../../utils/eventBus.js';

/**
 * Container for Select component
 * @extends Container
 */
export class SelectContainer extends Container {
  /**
   * Create a Select container
   * @param {Object} props - Select props
   * @param {Array} props.options - Select options
   * @param {string} [props.id] - Select ID attribute
   * @param {string} [props.name] - Select name attribute
   * @param {string|Array} [props.value=''] - Selected value(s)
   * @param {string} [props.placeholder='Select an option'] - Placeholder text
   * @param {boolean} [props.required=false] - Whether selection is required
   * @param {boolean} [props.disabled=false] - Whether select is disabled
   * @param {boolean} [props.multiple=false] - Whether multiple selection is allowed
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {Function} [props.onChange] - Change event handler
   * @param {Function} [props.onFocus] - Focus event handler
   * @param {Function} [props.onBlur] - Blur event handler
   * @param {string} [props.validationMessage] - Custom validation message
   * @param {boolean} [props.showValidation=true] - Whether to show validation messages
   */
  constructor({
    options = [],
    id,
    name,
    value = '',
    placeholder = 'Select an option',
    required = false,
    disabled = false,
    multiple = false,
    className = '',
    onChange,
    onFocus,
    onBlur,
    validationMessage = '',
    showValidation = true,
  }) {
    super({
      PresentationalComponent: Select,
      initialState: {
        value,
        isOpen: false,
        isValid: null,
      },
      props: {
        options,
        id,
        name,
        placeholder,
        required,
        disabled,
        multiple,
        className,
        onChange,
        onFocus,
        onBlur,
        validationMessage,
        showValidation,
      },
    });

    // Bind methods
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  /**
   * Transform container state to presentational props
   * @override
   * @private
   * @returns {Object} Props for presentational component
   */
  _getPresentationalPropsFromState() {
    return {
      value: this.getState('value'),
      isOpen: this.getState('isOpen'),
      isValid: this.getState('isValid'),
      onToggleDropdown: this.toggleDropdown,
      onSelectOption: this.selectOption,
    };
  }

  /**
   * Bind event handlers
   * @override
   * @private
   */
  _bindEventHandlers() {
    // Add document click handler for closing dropdown
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this.handleDocumentClick);
      this._trackEventListener(document, 'click', this.handleDocumentClick);
    }
  }

  /**
   * Initialize component
   * @override
   */
  initialize() {
    super.initialize();

    // Set up event handlers
    this._bindEventHandlers();

    // If there's an initial value, validate it
    if (this.props.required && this.props.showValidation) {
      this.validate();
    }
  }

  /**
   * Toggle dropdown open/closed state
   * @param {boolean} [force] - Force specific state
   */
  toggleDropdown(force) {
    const newIsOpen = force !== undefined ? force : !this.getState('isOpen');

    this.setState({ isOpen: newIsOpen });

    // Emit dropdown state change
    if (newIsOpen) {
      eventBus.emit('select:opened', {
        id: this.props.id,
        name: this.props.name,
        value: this.getState('value'),
      });
    } else {
      eventBus.emit('select:closed', {
        id: this.props.id,
        name: this.props.name,
        value: this.getState('value'),
      });
    }
  }

  /**
   * Select an option
   * @param {string} value - Option value
   */
  selectOption(value) {
    const { multiple } = this.props;
    let newValue;

    if (multiple) {
      // For multiple select, toggle the value
      const currentValues = Array.isArray(this.getState('value'))
        ? this.getState('value')
        : [];

      newValue = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
    } else {
      // For single select, set the value and close dropdown
      newValue = value;
      this.toggleDropdown(false);
    }

    this.setValue(newValue);
  }

  /**
   * Handle document click to close dropdown
   * @param {Event} event - Click event
   */
  handleDocumentClick(event) {
    if (
      this.getState('isOpen') &&
      this.presentational &&
      this.presentational.customSelect &&
      !this.presentational.customSelect.contains(event.target)
    ) {
      this.toggleDropdown(false);
    }
  }

  /**
   * Set selected value
   * @param {string|Array} value - New value
   * @returns {SelectContainer} This instance
   */
  setValue(value) {
    this.setState({ value }, () => {
      // Update native select to match
      this.updateNativeSelect();

      // Validate if appropriate
      if (this.props.required && this.props.showValidation) {
        this.validate();
      }

      // Call onChange if provided
      if (typeof this.props.onChange === 'function') {
        // Create a synthetic event
        const event = new Event('change', { bubbles: true });
        this.props.onChange(event, value);
      }

      // Emit value change
      eventBus.emit('select:valueChanged', {
        id: this.props.id,
        name: this.props.name,
        value,
      });
    });

    return this;
  }

  /**
   * Update native select to match state
   * @private
   */
  updateNativeSelect() {
    if (!this.presentational || !this.presentational.select) return;

    const select = this.presentational.select;
    const value = this.getState('value');

    if (this.props.multiple && Array.isArray(value)) {
      Array.from(select.options).forEach((option) => {
        option.selected = value.includes(option.value);
      });
    } else {
      select.value = value;
    }
  }

  /**
   * Get current value
   * @returns {string|Array} Current value
   */
  getValue() {
    return this.getState('value');
  }

  /**
   * Validate the select
   * @returns {boolean} Whether the select is valid
   */
  validate() {
    let isValid = true;

    if (this.props.required) {
      const value = this.getState('value');

      if (this.props.multiple) {
        isValid = Array.isArray(value) && value.length > 0;
      } else {
        isValid = !!value && value !== '';
      }
    }

    this.setState({ isValid });

    return isValid;
  }

  /**
   * Clean up resources
   * @override
   */
  destroy() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.handleDocumentClick);
    }

    super.destroy();
  }
}

// For backward compatibility
export default SelectContainer;
