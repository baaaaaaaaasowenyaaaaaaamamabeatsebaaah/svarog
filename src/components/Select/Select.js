import './Select.css';

/**
 * Create a Select component
 * @param {Object} props - Select properties
 * @returns {Object} Select component
 */
const createSelect = (props) => {
  const {
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
  } = props;

  if (!Array.isArray(options)) {
    throw new Error('Select: options must be an array');
  }

  // State
  let selectState = {
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
    isValid: null,
    isOpen: false,
  };

  // References to DOM elements
  let containerElement;
  let nativeSelectElement;
  let customSelectElement;
  let selectedDisplayElement;
  let dropdownElement;
  let validationMessageElement;

  // Document click handler for dropdown
  const documentClickHandler = (event) => {
    if (selectState.isOpen && !containerElement.contains(event.target)) {
      closeDropdown();
    }
  };

  // Create a select container with both native and custom select elements
  const buildSelectContainer = () => {
    const container = document.createElement('div');
    container.className =
      `select-container ${selectState.className || ''}`.trim();

    // Create native select element
    nativeSelectElement = createNativeSelect();
    container.appendChild(nativeSelectElement);

    // Create custom UI elements
    customSelectElement = createCustomUI();
    container.appendChild(customSelectElement);

    // Create validation message element if needed
    if (selectState.showValidation) {
      validationMessageElement = document.createElement('div');
      validationMessageElement.className = 'select-validation-message';
      validationMessageElement.textContent =
        selectState.validationMessage || '';
      validationMessageElement.setAttribute('aria-live', 'polite');
      container.appendChild(validationMessageElement);
    }

    return container;
  };

  // Create the native select element
  const createNativeSelect = () => {
    const select = document.createElement('select');
    select.className = 'select-native';

    // Set attributes
    if (selectState.id) select.id = selectState.id;
    if (selectState.name) select.name = selectState.name;
    if (selectState.required) select.required = selectState.required;
    if (selectState.multiple) select.multiple = true;
    if (selectState.disabled) select.disabled = true;

    // Add event listeners
    select.addEventListener('change', handleChange);
    select.addEventListener('focus', handleFocus);
    select.addEventListener('blur', handleBlur);

    // Add placeholder for single select
    if (!selectState.multiple && selectState.placeholder) {
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.disabled = true;
      placeholderOption.selected = selectState.value === '';
      placeholderOption.textContent = selectState.placeholder;
      select.appendChild(placeholderOption);
    }

    // Add options
    selectState.options.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      if (option.disabled) optionElement.disabled = true;

      if (selectState.multiple) {
        optionElement.selected =
          Array.isArray(selectState.value) &&
          selectState.value.includes(option.value);
      } else {
        optionElement.selected = selectState.value === option.value;
      }

      optionElement.textContent = option.label || option.value;
      select.appendChild(optionElement);
    });

    return select;
  };

  // Create the custom select UI
  const createCustomUI = () => {
    const customSelect = document.createElement('div');
    customSelect.className = `select-custom${selectState.disabled ? ' select-custom--disabled' : ''}`;
    customSelect.setAttribute('tabindex', selectState.disabled ? '-1' : '0');
    customSelect.setAttribute('aria-haspopup', 'listbox');
    customSelect.setAttribute('role', 'combobox');
    customSelect.setAttribute('aria-expanded', 'false');

    customSelect.addEventListener('click', handleCustomSelectClick);
    customSelect.addEventListener('keydown', handleCustomSelectKeydown);

    // Create selected value display
    selectedDisplayElement = document.createElement('div');
    selectedDisplayElement.className = `select-custom__selected${isPlaceholderVisible() ? ' select-custom__selected--placeholder' : ''}`;
    selectedDisplayElement.textContent = getDisplayText();
    customSelect.appendChild(selectedDisplayElement);

    // Create arrow indicator
    const arrow = document.createElement('div');
    arrow.className = 'select-custom__arrow';
    customSelect.appendChild(arrow);

    // Create dropdown with options
    dropdownElement = document.createElement('div');
    dropdownElement.className = 'select-custom__dropdown';
    dropdownElement.setAttribute('role', 'listbox');
    dropdownElement.setAttribute(
      'aria-multiselectable',
      selectState.multiple ? 'true' : 'false'
    );

    createCustomOptions(dropdownElement);
    customSelect.appendChild(dropdownElement);

    return customSelect;
  };

  // Create custom option elements
  const createCustomOptions = (dropdown) => {
    selectState.options.forEach((option) => {
      const isDisabled = !!option.disabled;

      // For disabled headers, create a group header instead of an option
      if (
        isDisabled &&
        option.label &&
        (!option.value || option.value === option.label)
      ) {
        const groupHeader = document.createElement('div');
        groupHeader.className = 'select-custom__group-header';
        groupHeader.textContent = option.label;
        dropdown.appendChild(groupHeader);
        return;
      }

      const isSelected = selectState.multiple
        ? Array.isArray(selectState.value) &&
          selectState.value.includes(option.value)
        : selectState.value === option.value;

      const optionElement = document.createElement('div');
      optionElement.className = `select-custom__option${isDisabled ? ' select-custom__option--disabled' : ''}${isSelected ? ' select-custom__option--selected' : ''}`;
      optionElement.textContent = option.label || option.value;
      optionElement.setAttribute('data-value', option.value);
      optionElement.setAttribute('role', 'option');
      optionElement.setAttribute(
        'aria-disabled',
        isDisabled ? 'true' : 'false'
      );
      optionElement.setAttribute(
        'aria-selected',
        isSelected ? 'true' : 'false'
      );
      optionElement.setAttribute('tabindex', isDisabled ? '-1' : '0');

      if (!isDisabled) {
        optionElement.addEventListener('click', (e) =>
          handleOptionClick(option.value, e)
        );
        optionElement.addEventListener('keydown', handleOptionKeydown);
      }

      if (selectState.multiple) {
        const checkbox = document.createElement('span');
        checkbox.className = `select-custom__checkbox${isSelected ? ' select-custom__checkbox--checked' : ''}`;
        optionElement.insertBefore(checkbox, optionElement.firstChild);
      }

      dropdown.appendChild(optionElement);
    });
  };

  // Determine if placeholder should be visible
  const isPlaceholderVisible = () => {
    if (selectState.multiple) {
      return (
        !Array.isArray(selectState.value) || selectState.value.length === 0
      );
    }
    return !selectState.value;
  };

  // Get text to display in the select
  const getDisplayText = () => {
    if (selectState.multiple) {
      if (Array.isArray(selectState.value) && selectState.value.length) {
        const selectedLabels = selectState.value.map((val) => {
          const option = selectState.options.find((opt) => opt.value === val);
          return option ? option.label || option.value : val;
        });

        if (selectedLabels.length <= 2) {
          return selectedLabels.join(', ');
        }
        return `${selectedLabels.length} items selected`;
      }
    } else if (selectState.value) {
      const selectedOption = selectState.options.find(
        (opt) => opt.value === selectState.value
      );
      return selectedOption
        ? selectedOption.label || selectedOption.value
        : selectState.value;
    }

    return selectState.placeholder;
  };

  // Update the display of the selected value
  const updateSelectedDisplay = () => {
    selectedDisplayElement.textContent = getDisplayText();
    if (isPlaceholderVisible()) {
      selectedDisplayElement.classList.add(
        'select-custom__selected--placeholder'
      );
    } else {
      selectedDisplayElement.classList.remove(
        'select-custom__selected--placeholder'
      );
    }
  };

  // Update the selected state of custom options
  const updateCustomOptionStates = () => {
    const values = Array.isArray(selectState.value)
      ? selectState.value
      : [selectState.value];

    const options = dropdownElement.querySelectorAll('.select-custom__option');
    options.forEach((option) => {
      const value = option.getAttribute('data-value');
      const isSelected = values.includes(value);

      if (isSelected) {
        option.classList.add('select-custom__option--selected');
        option.setAttribute('aria-selected', 'true');
      } else {
        option.classList.remove('select-custom__option--selected');
        option.setAttribute('aria-selected', 'false');
      }

      if (selectState.multiple) {
        const checkbox = option.querySelector('.select-custom__checkbox');
        if (checkbox) {
          if (isSelected) {
            checkbox.classList.add('select-custom__checkbox--checked');
          } else {
            checkbox.classList.remove('select-custom__checkbox--checked');
          }
        }
      }
    });
  };

  // EVENT HANDLERS

  // Handle native select change
  const handleChange = (event) => {
    if (selectState.multiple) {
      const selectedOptions = Array.from(event.target.selectedOptions);
      selectState.value = selectedOptions.map((option) => option.value);
    } else {
      selectState.value = event.target.value;
    }

    updateSelectedDisplay();
    updateCustomOptionStates();

    if (selectState.showValidation && selectState.isValid !== null) {
      validate();
    }

    if (typeof selectState.onChange === 'function') {
      selectState.onChange(event, getValue());
    }
  };

  // Handle native select focus
  const handleFocus = (event) => {
    containerElement.classList.add('select-container--focused');
    customSelectElement.classList.add('select-custom--focused');

    if (typeof selectState.onFocus === 'function') {
      selectState.onFocus(event);
    }
  };

  // Handle native select blur
  const handleBlur = (event) => {
    // Don't remove focused class if clicking on dropdown or options
    if (!customSelectElement.contains(event.relatedTarget)) {
      containerElement.classList.remove('select-container--focused');
      customSelectElement.classList.remove('select-custom--focused');

      if (selectState.showValidation && selectState.isValid !== null) {
        validate();
      }

      if (typeof selectState.onBlur === 'function') {
        selectState.onBlur(event);
      }
    }
  };

  // Handle custom select click
  const handleCustomSelectClick = (event) => {
    event.stopPropagation();
    if (selectState.disabled) return;

    toggleDropdown();
    nativeSelectElement.focus();
  };

  // Handle custom select keyboard navigation
  const handleCustomSelectKeydown = (event) => {
    if (selectState.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        openDropdown();
        focusNextOption();
        break;
      case 'ArrowUp':
        event.preventDefault();
        openDropdown();
        focusPreviousOption();
        break;
      case 'Escape':
        event.preventDefault();
        closeDropdown();
        break;
      case 'Tab':
        closeDropdown();
        break;
    }
  };

  // Handle option click
  const handleOptionClick = (value, event) => {
    event.stopPropagation();

    if (selectState.multiple) {
      toggleOptionSelection(value);
    } else {
      selectOption(value);
      closeDropdown();
    }
  };

  // Handle option keyboard navigation
  const handleOptionKeydown = (event) => {
    const value = event.currentTarget.getAttribute('data-value');

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (selectState.multiple) {
          toggleOptionSelection(value);
        } else {
          selectOption(value);
          closeDropdown();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        focusNextOption();
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusPreviousOption();
        break;
      case 'Escape':
        event.preventDefault();
        closeDropdown();
        customSelectElement.focus();
        break;
      case 'Tab':
        closeDropdown();
        break;
    }
  };

  // Toggle dropdown open/closed
  const toggleDropdown = () => {
    if (selectState.isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  // Open the dropdown
  const openDropdown = () => {
    if (!selectState.isOpen && !selectState.disabled) {
      selectState.isOpen = true;
      customSelectElement.classList.add('select-custom--open');
      dropdownElement.classList.add('select-custom__dropdown--open');
      customSelectElement.setAttribute('aria-expanded', 'true');
    }
  };

  // Close the dropdown
  const closeDropdown = () => {
    if (selectState.isOpen) {
      selectState.isOpen = false;
      customSelectElement.classList.remove('select-custom--open');
      dropdownElement.classList.remove('select-custom__dropdown--open');
      customSelectElement.setAttribute('aria-expanded', 'false');
    }
  };

  // Focus the next option
  const focusNextOption = () => {
    const options = getSelectableOptions();
    if (!options.length) return;

    const currentFocused = dropdownElement.querySelector(
      '.select-custom__option:focus'
    );
    let nextIndex = 0;

    if (currentFocused) {
      const currentIndex = Array.from(options).indexOf(currentFocused);
      nextIndex = (currentIndex + 1) % options.length;
    }

    options[nextIndex].focus();
  };

  // Focus the previous option
  const focusPreviousOption = () => {
    const options = getSelectableOptions();
    if (!options.length) return;

    const currentFocused = dropdownElement.querySelector(
      '.select-custom__option:focus'
    );
    let prevIndex = options.length - 1;

    if (currentFocused) {
      const currentIndex = Array.from(options).indexOf(currentFocused);
      prevIndex = (currentIndex - 1 + options.length) % options.length;
    }

    options[prevIndex].focus();
  };

  // Get selectable options
  const getSelectableOptions = () => {
    return dropdownElement.querySelectorAll(
      '.select-custom__option:not(.select-custom__option--disabled)'
    );
  };

  // Select an option
  const selectOption = (value) => {
    // Update native select
    nativeSelectElement.value = value;
    selectState.value = value;

    // Create and dispatch change event to trigger the handleChange
    const changeEvent = new Event('change');
    nativeSelectElement.dispatchEvent(changeEvent);
  };

  // Toggle an option selection (for multiple select)
  const toggleOptionSelection = (value) => {
    // Get current values
    const currentValues = Array.isArray(selectState.value)
      ? [...selectState.value]
      : selectState.value
        ? [selectState.value]
        : [];

    // Toggle the value
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    // Update native select
    Array.from(nativeSelectElement.options).forEach((option) => {
      option.selected = newValues.includes(option.value);
    });

    // Update internal state
    selectState.value = newValues;

    // Create and dispatch change event to trigger the handleChange
    const changeEvent = new Event('change');
    nativeSelectElement.dispatchEvent(changeEvent);
  };

  // Validate the current value
  const validate = () => {
    let isValid = true;

    if (selectState.required) {
      if (selectState.multiple) {
        isValid =
          Array.isArray(selectState.value) && selectState.value.length > 0;
      } else {
        isValid = !!selectState.value && selectState.value !== '';
      }
    }

    selectState.isValid = isValid;
    updateValidationStyles(isValid);
    return isValid;
  };

  // Update validation styles
  const updateValidationStyles = (isValid) => {
    // Update container classes
    if (isValid) {
      containerElement.classList.add('select-container--valid');
      containerElement.classList.add('has-success');
      containerElement.classList.remove('select-container--invalid');
      containerElement.classList.remove('has-error');
    } else {
      containerElement.classList.add('select-container--invalid');
      containerElement.classList.add('has-error');
      containerElement.classList.remove('select-container--valid');
      containerElement.classList.remove('has-success');
    }

    // Update custom select classes
    if (isValid) {
      customSelectElement.classList.add('select-custom--valid');
      customSelectElement.classList.remove('select-custom--invalid');
    } else {
      customSelectElement.classList.add('select-custom--invalid');
      customSelectElement.classList.remove('select-custom--valid');
    }

    // Update validation message
    if (validationMessageElement) {
      if (!isValid) {
        // Only set validation message text if invalid
        validationMessageElement.textContent =
          selectState.validationMessage || 'Please select an option';
      } else {
        // Clear validation message when valid
        validationMessageElement.textContent = '';
      }
    }
  };

  // Get the current value
  const getValue = () => {
    return selectState.value;
  };

  // Update the component with new options
  const updateOptions = (options, keepValue = true) => {
    if (!Array.isArray(options)) {
      throw new Error('Select: options must be an array');
    }

    // Save current value if needed
    const currentValue = keepValue ? getValue() : null;

    // Update state
    selectState.options = options;

    // Rebuild native select options
    while (nativeSelectElement.firstChild) {
      nativeSelectElement.removeChild(nativeSelectElement.firstChild);
    }

    // Re-add placeholder if it existed
    if (!selectState.multiple && selectState.placeholder) {
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.disabled = true;
      placeholderOption.selected = !currentValue;
      placeholderOption.textContent = selectState.placeholder;
      nativeSelectElement.appendChild(placeholderOption);
    }

    // Add new options
    options.forEach((option) => {
      const optionEl = document.createElement('option');
      optionEl.value = option.value;
      if (option.disabled) optionEl.disabled = true;
      optionEl.textContent = option.label || option.value;
      nativeSelectElement.appendChild(optionEl);
    });

    // Restore previous value if it exists in new options
    if (currentValue !== null) {
      if (selectState.multiple && Array.isArray(currentValue)) {
        // For multiple select, set selected on matching options
        Array.from(nativeSelectElement.options).forEach((option) => {
          option.selected = currentValue.includes(option.value);
        });
        selectState.value = Array.from(nativeSelectElement.selectedOptions).map(
          (opt) => opt.value
        );
      } else if (!selectState.multiple) {
        // For single select, try to set the value directly
        if (options.some((opt) => opt.value === currentValue)) {
          nativeSelectElement.value = currentValue;
          selectState.value = currentValue;
        } else {
          // If value not found in new options, reset to placeholder or first option
          selectState.value = '';
        }
      }
    }

    // Rebuild dropdown options
    while (dropdownElement.firstChild) {
      dropdownElement.removeChild(dropdownElement.firstChild);
    }
    createCustomOptions(dropdownElement);

    // Update display
    updateSelectedDisplay();

    // Re-validate if necessary
    if (selectState.showValidation && selectState.isValid !== null) {
      validate();
    }

    return publicAPI;
  };

  // Create initial elements
  containerElement = buildSelectContainer();

  // Set initial value correctly
  if (selectState.value !== '') {
    updateSelectedDisplay();
    updateCustomOptionStates();
  }

  // Add document click listener to close dropdown when clicking outside
  document.addEventListener('click', documentClickHandler);

  // Public API
  const publicAPI = {
    /**
     * Get the select element
     * @returns {HTMLElement} Select container element
     */
    getElement() {
      return containerElement;
    },

    /**
     * Get the current value of the select
     * @returns {string|string[]} Current value (or array of values for multiple select)
     */
    getValue() {
      return getValue();
    },

    /**
     * Set the value of the select
     * @param {string|string[]} value - New value (or array of values for multiple select)
     * @returns {Object} Select component (for chaining)
     */
    setValue(value) {
      selectState.value = value;

      if (selectState.multiple && Array.isArray(value)) {
        Array.from(nativeSelectElement.options).forEach((option) => {
          option.selected = value.includes(option.value);
        });
      } else {
        nativeSelectElement.value = value;
      }

      // Update custom UI
      updateSelectedDisplay();
      updateCustomOptionStates();

      // Only validate if validation has already been performed once
      if (selectState.showValidation && selectState.isValid !== null) {
        validate();
      }

      return publicAPI;
    },

    /**
     * Update multiple props at once
     * @param {Object} newProps - New props
     * @returns {Object} Select component (for chaining)
     */
    update(newProps) {
      // Update state with new props
      Object.assign(selectState, newProps);

      // Check if we need a rebuild of internal elements
      const needsRebuild =
        newProps.options !== undefined ||
        newProps.multiple !== undefined ||
        newProps.placeholder !== undefined ||
        newProps.className !== undefined ||
        newProps.id !== undefined ||
        newProps.name !== undefined;

      if (needsRebuild) {
        // Update container class if needed
        if (newProps.className !== undefined) {
          containerElement.className =
            `select-container ${selectState.className || ''}`.trim();
        }

        // Clear existing elements so we can rebuild them
        while (containerElement.firstChild) {
          containerElement.removeChild(containerElement.firstChild);
        }

        // Rebuild internal elements while keeping the same container
        const nativeSelect = createNativeSelect();
        containerElement.appendChild(nativeSelect);
        nativeSelectElement = nativeSelect;

        const customSelect = createCustomUI();
        containerElement.appendChild(customSelect);
        customSelectElement = customSelect;
        selectedDisplayElement = customSelect.querySelector(
          '.select-custom__selected'
        );
        dropdownElement = customSelect.querySelector(
          '.select-custom__dropdown'
        );

        if (selectState.showValidation) {
          const validationMsg = document.createElement('div');
          validationMsg.className = 'select-validation-message';
          validationMsg.textContent = selectState.validationMessage || '';
          validationMsg.setAttribute('aria-live', 'polite');
          containerElement.appendChild(validationMsg);
          validationMessageElement = validationMsg;
        }
      } else {
        // Simple updates without rebuilding

        // Update disabled state
        if (newProps.disabled !== undefined) {
          nativeSelectElement.disabled = selectState.disabled;

          if (selectState.disabled) {
            customSelectElement.classList.add('select-custom--disabled');
          } else {
            customSelectElement.classList.remove('select-custom--disabled');
          }

          customSelectElement.setAttribute(
            'tabindex',
            selectState.disabled ? '-1' : '0'
          );
        }

        // Update value if provided
        if (newProps.value !== undefined) {
          publicAPI.setValue(selectState.value);
        }

        // Update validation message
        if (
          newProps.validationMessage !== undefined &&
          validationMessageElement
        ) {
          // Only update if already showing validation
          if (selectState.isValid === false) {
            validationMessageElement.textContent =
              selectState.validationMessage || 'Please select an option';
          }
        }

        // Revalidate if required state changed
        if (newProps.required !== undefined && selectState.isValid !== null) {
          validate();
        }
      }

      return publicAPI;
    },

    /**
     * Update the options of the select
     * @param {Array} options - New options array
     * @param {boolean} [keepValue=true] - Whether to try to keep the current value if it exists in new options
     * @returns {Object} Select component (for chaining)
     */
    updateOptions(options, keepValue = true) {
      return updateOptions(options, keepValue);
    },

    /**
     * Validate the selection
     * @returns {boolean} Whether the selection is valid
     */
    validate() {
      return validate();
    },

    /**
     * Clean up resources to prevent memory leaks
     */
    destroy() {
      document.removeEventListener('click', documentClickHandler);

      // Remove all event listeners
      if (nativeSelectElement) {
        nativeSelectElement.removeEventListener('change', handleChange);
        nativeSelectElement.removeEventListener('focus', handleFocus);
        nativeSelectElement.removeEventListener('blur', handleBlur);
      }

      if (customSelectElement) {
        customSelectElement.removeEventListener(
          'click',
          handleCustomSelectClick
        );
        customSelectElement.removeEventListener(
          'keydown',
          handleCustomSelectKeydown
        );
      }

      const options = dropdownElement
        ? dropdownElement.querySelectorAll('.select-custom__option')
        : [];
      options.forEach((option) => {
        if (
          option &&
          !option.classList.contains('select-custom__option--disabled')
        ) {
          const value = option.getAttribute('data-value');
          option.removeEventListener('click', (e) =>
            handleOptionClick(value, e)
          );
          option.removeEventListener('keydown', handleOptionKeydown);
        }
      });
    },
  };

  return publicAPI;
};

export default createSelect;
