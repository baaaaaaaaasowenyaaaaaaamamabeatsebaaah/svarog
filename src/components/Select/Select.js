// src/components/Select/Select.js
import './Select.css';
import { Component } from '../../utils/componentFactory.js';

export default class Select extends Component {
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
    validationMessage,
    showValidation = true,
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
    };

    this.container = this.createSelectContainer();
    this.isValid = null; // Start with no validation state
    this.validationMessageElement = null;
    this.isOpen = false;

    if (this.props.showValidation) {
      this.validationMessageElement = this.createValidationMessage();
      this.container.appendChild(this.validationMessageElement);
    }

    // Set initial value correctly
    this.setValue(this.props.value);

    // Add document click listener to close dropdown when clicking outside
    this.documentClickHandler = this.handleDocumentClick.bind(this);
    document.addEventListener('click', this.documentClickHandler);
  }

  createSelectContainer() {
    const container = this.createElement('div', {
      className: this.createClassNames(
        'select-container',
        this.props.className
      ),
    });

    // Create both the native select and custom UI
    const nativeSelect = this.createSelectElement();
    container.appendChild(nativeSelect);
    this.select = nativeSelect; // Maintain backward compatibility

    // Create custom UI elements
    const customSelect = this.createCustomUI();
    container.appendChild(customSelect);
    this.customSelect = customSelect;

    return container;
  }

  createSelectElement() {
    const { options, id, name, required, disabled, multiple } = this.props;

    const attributes = {};
    if (id) attributes.id = id;
    if (name) attributes.name = name;
    if (required) attributes.required = required;
    if (multiple) attributes.multiple = true;

    const select = this.createElement('select', {
      className: 'select-native',
      attributes,
      events: {
        change: this.handleChange.bind(this),
        focus: this.handleFocus.bind(this),
        blur: this.handleBlur.bind(this),
      },
    });

    if (disabled) select.disabled = true;

    // Placeholder for single select only
    if (!multiple && this.props.placeholder) {
      const placeholderOption = this.createElement('option', {
        attributes: {
          value: '',
          disabled: true,
          selected: true,
        },
        textContent: this.props.placeholder,
      });
      select.appendChild(placeholderOption);
    }

    options.forEach((option) => {
      const optionElement = this.createElement('option', {
        attributes: {
          value: option.value,
          disabled: option.disabled,
        },
        textContent: option.label || option.value,
      });
      select.appendChild(optionElement);
    });

    return select;
  }

  createCustomUI() {
    const { disabled, placeholder, multiple } = this.props;

    // Create custom select container
    const customSelect = this.createElement('div', {
      className: 'select-custom',
      attributes: {
        tabindex: disabled ? '-1' : '0',
        'aria-haspopup': 'listbox',
        role: 'combobox',
      },
      events: {
        click: this.handleCustomSelectClick.bind(this),
        keydown: this.handleCustomSelectKeydown.bind(this),
      },
    });

    if (disabled) {
      customSelect.classList.add('select-custom--disabled');
    }

    // Create selected value display
    const selectedDisplay = this.createElement('div', {
      className: 'select-custom__selected select-custom__selected--placeholder',
      textContent: placeholder,
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
      className: 'select-custom__dropdown',
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

  createCustomOptions(dropdown) {
    const { options, multiple } = this.props;

    options.forEach((option) => {
      const isDisabled = !!option.disabled;

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
        className: this.createClassNames(
          'select-custom__option',
          isDisabled ? 'select-custom__option--disabled' : ''
        ),
        textContent: option.label || option.value,
        attributes: {
          'data-value': option.value,
          role: 'option',
          'aria-disabled': isDisabled ? 'true' : 'false',
          'aria-selected': 'false',
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
          className: 'select-custom__checkbox',
        });
        optionElement.insertBefore(checkbox, optionElement.firstChild);
      }

      dropdown.appendChild(optionElement);
    });
  }

  createValidationMessage() {
    return this.createElement('div', {
      className: 'select-validation-message',
      // Only set text content if there's an initial validation message
      textContent: this.props.validationMessage || '',
      attributes: { 'aria-live': 'polite' },
    });
  }

  handleChange(event) {
    if (this.props.multiple) {
      const selectedOptions = Array.from(event.target.selectedOptions);
      this.props.value = selectedOptions.map((option) => option.value);
    } else {
      this.props.value = event.target.value;
    }

    this.updateCustomSelectedDisplay();

    if (this.props.showValidation && this.isValid !== null) {
      this.validate();
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, this.getValue());
    }
  }

  handleFocus(event) {
    this.container.classList.add('select-container--focused');
    this.customSelect.classList.add('select-custom--focused');
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus(event);
    }
  }

  handleBlur(event) {
    // Don't remove focused class if clicking on dropdown or options
    if (!this.customSelect.contains(event.relatedTarget)) {
      this.container.classList.remove('select-container--focused');
      this.customSelect.classList.remove('select-custom--focused');

      if (this.props.showValidation && this.isValid !== null) {
        this.validate();
      }

      if (typeof this.props.onBlur === 'function') {
        this.props.onBlur(event);
      }
    }
  }

  handleCustomSelectClick(event) {
    event.stopPropagation();

    if (this.props.disabled) return;

    this.toggleDropdown();
    this.select.focus();
  }

  handleCustomSelectKeydown(event) {
    if (this.props.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.openDropdown();
        this.focusNextOption();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.openDropdown();
        this.focusPreviousOption();
        break;
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  handleOptionClick(value, event) {
    event.stopPropagation();

    if (this.props.multiple) {
      this.toggleOptionSelection(value);
    } else {
      this.selectOption(value);
      this.closeDropdown();
    }
  }

  handleOptionKeydown(event) {
    const value = event.currentTarget.getAttribute('data-value');

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.props.multiple) {
          this.toggleOptionSelection(value);
        } else {
          this.selectOption(value);
          this.closeDropdown();
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
        this.closeDropdown();
        this.customSelect.focus();
        break;
      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  handleDocumentClick(event) {
    if (this.isOpen && !this.container.contains(event.target)) {
      this.closeDropdown();
    }
  }

  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    if (!this.isOpen && !this.props.disabled) {
      this.isOpen = true;
      this.customSelect.classList.add('select-custom--open');
      this.dropdown.classList.add('select-custom__dropdown--open');

      // Set aria-expanded
      this.customSelect.setAttribute('aria-expanded', 'true');
    }
  }

  closeDropdown() {
    if (this.isOpen) {
      this.isOpen = false;
      this.customSelect.classList.remove('select-custom--open');
      this.dropdown.classList.remove('select-custom__dropdown--open');

      // Set aria-expanded
      this.customSelect.setAttribute('aria-expanded', 'false');
    }
  }

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

  getSelectableOptions() {
    return this.dropdown.querySelectorAll(
      '.select-custom__option:not(.select-custom__option--disabled)'
    );
  }

  selectOption(value) {
    // Update native select
    this.select.value = value;

    // Create and dispatch change event to trigger the handleChange
    const changeEvent = new Event('change');
    this.select.dispatchEvent(changeEvent);
  }

  toggleOptionSelection(value) {
    // Get current values
    const currentValues = Array.from(this.select.selectedOptions).map(
      (option) => option.value
    );

    // Toggle the value
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    // Update native select
    Array.from(this.select.options).forEach((option) => {
      option.selected = newValues.includes(option.value);
    });

    // Create and dispatch change event to trigger the handleChange
    const changeEvent = new Event('change');
    this.select.dispatchEvent(changeEvent);

    // Update custom UI
    this.updateCustomOptionStates();
  }

  updateCustomOptionStates() {
    const selectedValues = this.getValue();
    const values = Array.isArray(selectedValues)
      ? selectedValues
      : [selectedValues];

    // Update all options
    const options = this.dropdown.querySelectorAll('.select-custom__option');
    options.forEach((option) => {
      const value = option.getAttribute('data-value');
      const isSelected = values.includes(value);

      option.classList.toggle('select-custom__option--selected', isSelected);
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');

      if (this.props.multiple) {
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

  updateCustomSelectedDisplay() {
    const value = this.getValue();

    if (this.props.multiple) {
      if (Array.isArray(value) && value.length) {
        // Find corresponding labels for selected values
        const selectedLabels = value.map((val) => {
          const option = this.props.options.find((opt) => opt.value === val);
          return option ? option.label || option.value : val;
        });

        if (selectedLabels.length <= 2) {
          this.selectedDisplay.textContent = selectedLabels.join(', ');
        } else {
          this.selectedDisplay.textContent = `${selectedLabels.length} items selected`;
        }
      } else {
        this.selectedDisplay.textContent = this.props.placeholder;
      }
    } else {
      if (value) {
        const selectedOption = this.props.options.find(
          (opt) => opt.value === value
        );
        this.selectedDisplay.textContent = selectedOption
          ? selectedOption.label || selectedOption.value
          : value;
      } else {
        this.selectedDisplay.textContent = this.props.placeholder;
      }
    }
  }

  validate() {
    let isValid = true;

    if (this.props.required) {
      if (this.props.multiple) {
        isValid =
          Array.isArray(this.props.value) && this.props.value.length > 0;
      } else {
        isValid = !!this.props.value && this.props.value !== '';
      }
    }

    this.isValid = isValid;
    this.updateValidationStyles(isValid);
    return isValid;
  }

  updateValidationStyles(isValid) {
    // Update container classes
    this.container.classList.toggle('select-container--invalid', !isValid);
    this.container.classList.toggle('select-container--valid', isValid);
    this.container.classList.toggle('has-error', !isValid);
    this.container.classList.toggle('has-success', isValid);

    // Update custom select classes
    this.customSelect.classList.toggle('select-custom--invalid', !isValid);
    this.customSelect.classList.toggle('select-custom--valid', isValid);

    // Update validation message
    if (this.validationMessageElement) {
      if (!isValid) {
        // Only set validation message text if invalid
        this.validationMessageElement.textContent =
          this.props.validationMessage || 'Please select an option';
      } else {
        // Clear validation message when valid
        this.validationMessageElement.textContent = '';
      }
    }
  }

  getValue() {
    return this.props.value;
  }

  setValue(value) {
    this.props.value = value;

    if (this.props.multiple && Array.isArray(value)) {
      Array.from(this.select.options).forEach((option) => {
        option.selected = value.includes(option.value);
      });
    } else {
      this.select.value = value;
    }

    // Update custom UI
    this.updateCustomSelectedDisplay();
    this.updateCustomOptionStates();

    // Only validate if validation has already been performed once
    if (this.props.showValidation && this.isValid !== null) {
      this.validate();
    }

    return this;
  }

  getElement() {
    return this.container;
  }

  // Clean up event listeners to prevent memory leaks
  destroy() {
    document.removeEventListener('click', this.documentClickHandler);
  }
}
