// src/components/Select/Select.js
import './Select.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Presentational Select component
 * @extends Component
 */
export class Select extends Component {
  /**
   * Create a Select component
   * @param {Object} props - Select properties
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
   * @param {boolean} [props.isOpen=false] - Whether dropdown is open
   * @param {boolean} [props.isValid=null] - Validation state
   * @param {Function} [props.onToggleDropdown] - Dropdown toggle handler
   * @param {Function} [props.onSelectOption] - Option selection handler
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
    isOpen = false,
    isValid = null,
    onToggleDropdown,
    onSelectOption,
  }) {
    super();

    if (!Array.isArray(options)) {
      throw new Error('Select: options must be an array');
    }

    this.props = {
      options,
      id,
      name,
      value,
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
      isOpen,
      isValid,
      onToggleDropdown,
      onSelectOption,
    };

    // UI elements references
    this.container = null;
    this.select = null;
    this.customSelect = null;
    this.dropdown = null;
    this.selectedDisplay = null;
    this.validationMessageElement = null;
  }

  /**
   * Initialize component
   * @override
   */
  initialize() {
    // Create DOM elements
    this.container = this.createSelectContainer();

    super.initialize();
  }

  /**
   * Create select container with all elements
   * @private
   * @returns {HTMLElement} Select container element
   */
  createSelectContainer() {
    const container = this.createElement('div', {
      className: this.createClassNames(
        'select-container',
        this.props.className,
        {
          'select-container--invalid': this.props.isValid === false,
          'select-container--valid': this.props.isValid === true,
          'has-error': this.props.isValid === false,
          'has-success': this.props.isValid === true,
        }
      ),
    });

    // Create both the native select and custom UI
    const nativeSelect = this.createSelectElement();
    container.appendChild(nativeSelect);
    this.select = nativeSelect;

    // Create custom UI elements
    const customSelect = this.createCustomUI();
    container.appendChild(customSelect);
    this.customSelect = customSelect;

    // Add validation message if needed
    if (this.props.showValidation) {
      this.validationMessageElement = this.createValidationMessage();
      container.appendChild(this.validationMessageElement);
    }

    return container;
  }

  /**
   * Create the native select element
   * @private
   * @returns {HTMLElement} Select element
   */
  createSelectElement() {
    const {
      options,
      id,
      name,
      value,
      required,
      disabled,
      multiple,
      placeholder,
    } = this.props;

    const attributes = {};
    if (id) attributes.id = id;
    if (name) attributes.name = name;
    if (required) attributes.required = required;
    if (multiple) attributes.multiple = true;

    const select = this.createElement('select', {
      className: 'select-native',
      attributes,
      events: {
        change: this.handleNativeChange.bind(this),
        focus: this.handleNativeFocus.bind(this),
        blur: this.handleNativeBlur.bind(this),
      },
      disabled,
    });

    // Placeholder for single select only
    if (!multiple && placeholder) {
      const placeholderOption = this.createElement('option', {
        attributes: {
          value: '',
          disabled: true,
          selected: !value,
        },
        textContent: placeholder,
      });
      select.appendChild(placeholderOption);
    }

    // Add options
    options.forEach((option) => {
      const optionElement = this.createElement('option', {
        attributes: {
          value: option.value,
          disabled: option.disabled,
        },
        textContent: option.label || option.value,
      });

      // Set selected state
      if (multiple && Array.isArray(value)) {
        optionElement.selected = value.includes(option.value);
      } else {
        optionElement.selected = option.value === value;
      }

      select.appendChild(optionElement);
    });

    return select;
  }

  /**
   * Create custom UI for select
   * @private
   * @returns {HTMLElement} Custom select UI
   */
  createCustomUI() {
    const { disabled, placeholder, multiple, isOpen } = this.props;

    // Create custom select container
    const customSelect = this.createElement('div', {
      className: this.createClassNames('select-custom', {
        'select-custom--disabled': disabled,
        'select-custom--open': isOpen,
        'select-custom--valid': this.props.isValid === true,
        'select-custom--invalid': this.props.isValid === false,
      }),
      attributes: {
        tabindex: disabled ? '-1' : '0',
        'aria-haspopup': 'listbox',
        role: 'combobox',
        'aria-expanded': isOpen ? 'true' : 'false',
      },
      events: {
        click: this.handleCustomSelectClick.bind(this),
        keydown: this.handleCustomSelectKeydown.bind(this),
      },
    });

    // Create selected value display
    const selectedText = this.getSelectedText();
    const selectedDisplay = this.createElement('div', {
      className: this.createClassNames('select-custom__selected', {
        'select-custom__selected--placeholder': !selectedText,
      }),
      textContent: selectedText || placeholder,
    });
    this.selectedDisplay = selectedDisplay;
    customSelect.appendChild(selectedDisplay);

    // Create arrow indicator
    const arrow = this.createElement('div', {
      className: 'select-custom__arrow',
    });
    customSelect.appendChild(arrow);

    // Create dropdown with options
    const dropdown = this.createElement('div', {
      className: this.createClassNames('select-custom__dropdown', {
        'select-custom__dropdown--open': isOpen,
      }),
      attributes: {
        role: 'listbox',
        'aria-multiselectable': multiple ? 'true' : 'false',
      },
    });
    this.dropdown = dropdown;

    this.createCustomOptions(dropdown);
    customSelect.appendChild(dropdown);

    return customSelect;
  }

  /**
   * Create custom options for dropdown
   * @private
   * @param {HTMLElement} dropdown - Dropdown container
   */
  createCustomOptions(dropdown) {
    const { options, multiple, value } = this.props;

    options.forEach((option) => {
      const isDisabled = !!option.disabled;
      const isSelected =
        multiple && Array.isArray(value)
          ? value.includes(option.value)
          : option.value === value;

      // For disabled headers, create a group header instead of an option
      if (
        isDisabled &&
        option.label &&
        (!option.value || option.value === option.label)
      ) {
        const groupHeader = this.createElement('div', {
          className: 'select-custom__group-header',
          textContent: option.label,
        });
        dropdown.appendChild(groupHeader);
        return;
      }

      const optionElement = this.createElement('div', {
        className: this.createClassNames('select-custom__option', {
          'select-custom__option--disabled': isDisabled,
          'select-custom__option--selected': isSelected,
        }),
        textContent: option.label || option.value,
        attributes: {
          'data-value': option.value,
          role: 'option',
          'aria-disabled': isDisabled ? 'true' : 'false',
          'aria-selected': isSelected ? 'true' : 'false',
          tabindex: isDisabled ? '-1' : '0',
        },
        events: {
          click: isDisabled
            ? null
            : this.handleOptionClick.bind(this, option.value),
          keydown: isDisabled ? null : this.handleOptionKeydown.bind(this),
        },
      });

      if (multiple) {
        const checkbox = this.createElement('span', {
          className: this.createClassNames('select-custom__checkbox', {
            'select-custom__checkbox--checked': isSelected,
          }),
        });
        optionElement.insertBefore(checkbox, optionElement.firstChild);
      }

      dropdown.appendChild(optionElement);
    });
  }

  /**
   * Create validation message element
   * @private
   * @returns {HTMLElement} Validation message element
   */
  createValidationMessage() {
    const isInvalid = this.props.isValid === false;

    return this.createElement('div', {
      className: 'select-validation-message',
      textContent: isInvalid ? this.props.validationMessage : '',
      attributes: { 'aria-live': 'polite' },
    });
  }

  /**
   * Get display text for selected option(s)
   * @private
   * @returns {string} Selected text
   */
  getSelectedText() {
    const { value, options, multiple } = this.props;

    if (multiple && Array.isArray(value) && value.length > 0) {
      // Find corresponding labels for selected values
      const selectedLabels = value.map((val) => {
        const option = options.find((opt) => opt.value === val);
        return option ? option.label || option.value : val;
      });

      if (selectedLabels.length <= 2) {
        return selectedLabels.join(', ');
      } else {
        return `${selectedLabels.length} items selected`;
      }
    } else if (!multiple && value) {
      const selectedOption = options.find((opt) => opt.value === value);
      return selectedOption
        ? selectedOption.label || selectedOption.value
        : value;
    }

    return '';
  }

  /**
   * Handle native select change
   * @private
   * @param {Event} event - Change event
   */
  handleNativeChange(event) {
    const { onChange, multiple } = this.props;

    // Call onChange callback
    if (typeof onChange === 'function') {
      if (multiple) {
        const selectedOptions = Array.from(event.target.selectedOptions);
        const selectedValues = selectedOptions.map((option) => option.value);
        onChange(event, selectedValues);
      } else {
        onChange(event, event.target.value);
      }
    }
  }

  /**
   * Handle native select focus
   * @private
   * @param {Event} event - Focus event
   */
  handleNativeFocus(event) {
    this.container.classList.add('select-container--focused');
    this.customSelect.classList.add('select-custom--focused');

    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus(event);
    }
  }

  /**
   * Handle native select blur
   * @private
   * @param {Event} event - Blur event
   */
  handleNativeBlur(event) {
    // Don't remove focused class if clicking on dropdown or options
    if (!this.customSelect.contains(event.relatedTarget)) {
      this.container.classList.remove('select-container--focused');
      this.customSelect.classList.remove('select-custom--focused');

      if (typeof this.props.onBlur === 'function') {
        this.props.onBlur(event);
      }
    }
  }

  /**
   * Handle custom select click
   * @private
   * @param {Event} event - Click event
   */
  handleCustomSelectClick(event) {
    event.stopPropagation();

    if (this.props.disabled) return;

    if (typeof this.props.onToggleDropdown === 'function') {
      this.props.onToggleDropdown();
    }

    this.select.focus();
  }

  /**
   * Handle custom select keydown
   * @private
   * @param {Event} event - Keydown event
   */
  handleCustomSelectKeydown(event) {
    if (this.props.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (typeof this.props.onToggleDropdown === 'function') {
          this.props.onToggleDropdown();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (
          !this.props.isOpen &&
          typeof this.props.onToggleDropdown === 'function'
        ) {
          this.props.onToggleDropdown(true); // Force open
        }
        this.focusNextOption();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (
          !this.props.isOpen &&
          typeof this.props.onToggleDropdown === 'function'
        ) {
          this.props.onToggleDropdown(true); // Force open
        }
        this.focusPreviousOption();
        break;
      case 'Escape':
        event.preventDefault();
        if (
          this.props.isOpen &&
          typeof this.props.onToggleDropdown === 'function'
        ) {
          this.props.onToggleDropdown(false); // Force close
        }
        break;
      case 'Tab':
        if (
          this.props.isOpen &&
          typeof this.props.onToggleDropdown === 'function'
        ) {
          this.props.onToggleDropdown(false); // Force close
        }
        break;
    }
  }

  /**
   * Handle option click
   * @private
   * @param {string} value - Option value
   * @param {Event} event - Click event
   */
  handleOptionClick(value, event) {
    event.stopPropagation();

    if (typeof this.props.onSelectOption === 'function') {
      this.props.onSelectOption(value);
    }
  }

  /**
   * Handle option keydown
   * @private
   * @param {Event} event - Keydown event
   */
  handleOptionKeydown(event) {
    const value = event.currentTarget.getAttribute('data-value');

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (typeof this.props.onSelectOption === 'function') {
          this.props.onSelectOption(value);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextOption();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousOption();
        break;
      case 'Escape':
        event.preventDefault();
        if (typeof this.props.onToggleDropdown === 'function') {
          this.props.onToggleDropdown(false); // Force close
        }
        this.customSelect.focus();
        break;
      case 'Tab':
        if (typeof this.props.onToggleDropdown === 'function') {
          this.props.onToggleDropdown(false); // Force close
        }
        break;
    }
  }

  /**
   * Focus the next option in the dropdown
   * @private
   */
  focusNextOption() {
    const options = this.getSelectableOptions();
    if (!options.length) return;

    const currentFocused = this.dropdown.querySelector(
      '.select-custom__option:focus'
    );
    let nextIndex = 0;

    if (currentFocused) {
      const currentIndex = Array.from(options).indexOf(currentFocused);
      nextIndex = (currentIndex + 1) % options.length;
    }

    options[nextIndex].focus();
  }

  /**
   * Focus the previous option in the dropdown
   * @private
   */
  focusPreviousOption() {
    const options = this.getSelectableOptions();
    if (!options.length) return;

    const currentFocused = this.dropdown.querySelector(
      '.select-custom__option:focus'
    );
    let prevIndex = options.length - 1;

    if (currentFocused) {
      const currentIndex = Array.from(options).indexOf(currentFocused);
      prevIndex = (currentIndex - 1 + options.length) % options.length;
    }

    options[prevIndex].focus();
  }

  /**
   * Get selectable options in the dropdown
   * @private
   * @returns {NodeList} Selectable options
   */
  getSelectableOptions() {
    return this.dropdown.querySelectorAll(
      '.select-custom__option:not(.select-custom__option--disabled)'
    );
  }

  /**
   * Get the select container element
   * @override
   * @returns {HTMLElement} Select container element
   */
  getElement() {
    return this.container;
  }

  /**
   * Update the component with new props
   * @param {Object} props - New props
   */
  update(props) {
    // Merge new props
    this.props = { ...this.props, ...props };

    // Update native select value
    if (this.props.multiple && Array.isArray(this.props.value)) {
      Array.from(this.select.options).forEach((option) => {
        option.selected = this.props.value.includes(option.value);
      });
    } else {
      this.select.value = this.props.value;
    }

    // Update custom UI
    this.updateCustomUI();

    // Update validation message if applicable
    if (this.validationMessageElement) {
      if (this.props.isValid === false && this.props.validationMessage) {
        this.validationMessageElement.textContent =
          this.props.validationMessage;
      } else {
        this.validationMessageElement.textContent = '';
      }
    }

    // Update container classes
    this.container.classList.toggle(
      'select-container--invalid',
      this.props.isValid === false
    );
    this.container.classList.toggle(
      'select-container--valid',
      this.props.isValid === true
    );
    this.container.classList.toggle('has-error', this.props.isValid === false);
    this.container.classList.toggle('has-success', this.props.isValid === true);
  }

  /**
   * Update custom UI elements
   * @private
   */
  updateCustomUI() {
    // Update selected display
    const selectedText = this.getSelectedText();
    this.selectedDisplay.textContent = selectedText || this.props.placeholder;
    this.selectedDisplay.classList.toggle(
      'select-custom__selected--placeholder',
      !selectedText
    );

    // Update dropdown open state
    this.customSelect.classList.toggle(
      'select-custom--open',
      this.props.isOpen
    );
    this.dropdown.classList.toggle(
      'select-custom__dropdown--open',
      this.props.isOpen
    );
    this.customSelect.setAttribute(
      'aria-expanded',
      this.props.isOpen ? 'true' : 'false'
    );

    // Update validation classes
    this.customSelect.classList.toggle(
      'select-custom--invalid',
      this.props.isValid === false
    );
    this.customSelect.classList.toggle(
      'select-custom--valid',
      this.props.isValid === true
    );

    // Update selected options
    this.updateSelectedOptions();
  }

  /**
   * Update selected state of custom options
   * @private
   */
  updateSelectedOptions() {
    const { multiple, value } = this.props;
    const options = this.dropdown.querySelectorAll('.select-custom__option');

    options.forEach((option) => {
      const optionValue = option.getAttribute('data-value');
      const isSelected =
        multiple && Array.isArray(value)
          ? value.includes(optionValue)
          : optionValue === value;

      option.classList.toggle('select-custom__option--selected', isSelected);
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');

      if (multiple) {
        const checkbox = option.querySelector('.select-custom__checkbox');
        if (checkbox) {
          checkbox.classList.toggle(
            'select-custom__checkbox--checked',
            isSelected
          );
        }
      }
    });
  }
}

// For backward compatibility
export default Select;

/**
 * Create a Select component (backward compatibility)
 * @param {Object} props - Select props
 * @returns {SelectContainer} Select container instance
 */
export function createSelect(props) {
  // Import dynamically to avoid circular dependencies
  const { SelectContainer } = require('./SelectContainer.js');
  return new SelectContainer(props);
}
