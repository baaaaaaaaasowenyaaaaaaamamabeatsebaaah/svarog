// src/components/Select/Select.js
import './Select.css';
import { createElement, appendChildren } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { validateInput } from '../../utils/validation.js';
import { debounce } from '../../utils/performance.js';

/**
 * Creates a Select component with enhanced custom UI and accessibility features
 *
 * @param {Object} props - Component configuration
 * @param {Array<Object>} [props.options=[]] - Option objects with value and label
 * @param {string} [props.id] - ID attribute
 * @param {string} [props.name] - Name attribute
 * @param {string|Array<string>} [props.value=''] - Current value(s) (array for multiple)
 * @param {string} [props.placeholder='Select an option'] - Placeholder text
 * @param {boolean} [props.required=false] - Whether selection is required
 * @param {boolean} [props.disabled=false] - Whether select is disabled
 * @param {boolean} [props.multiple=false] - Allow multiple selections
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Function} [props.onChange] - Change event handler
 * @param {Function} [props.onFocus] - Focus event handler
 * @param {Function} [props.onBlur] - Blur event handler
 * @param {string} [props.validationMessage=''] - Message for invalid selections
 * @param {boolean} [props.showValidation=true] - Whether to show validation
 * @returns {Object} Select component API
 */
const createSelect = (props) => {
  // Use base component for standardized lifecycle
  const baseComponent = createBaseComponent((state) => {
    // Only destructure variables used directly in this function
    const { className = '' } = state;

    // Create container with data attributes
    const container = createElement('div', {
      classes: ['select-container', className],
      attributes: {
        'data-component': 'select',
        'data-valid':
          state.isValid === true
            ? 'true'
            : state.isValid === false
              ? 'false'
              : null,
      },
    });

    // Create native select element with options
    const nativeSelect = createNativeSelect(state);

    // Determine display text for selected value
    const displayData = getDisplayTextAndState(state);

    // Create custom select UI
    const customSelect = createCustomSelect(state, displayData);

    // Append all elements
    appendChildren(container, [
      nativeSelect,
      customSelect,
      createValidationMessage(state),
    ]);

    return container;
  });

  // Initialize component with validated props
  validateSelectProps(props);
  const component = baseComponent(props);
  const element = component.getElement();

  // Cached DOM elements for better performance
  const elements = {
    nativeSelect: null,
    customSelect: null,
    dropdown: null,
    selectedDisplay: null,
    messageElement: null,
  };

  // Track component state for updates
  let state = { ...props };

  // Cache DOM elements for better performance
  function cacheElements() {
    elements.nativeSelect = element.querySelector('.select-native');
    elements.customSelect = element.querySelector('.select-custom');
    elements.dropdown = element.querySelector('.select-custom__dropdown');
    elements.selectedDisplay = element.querySelector(
      '.select-custom__selected'
    );
    elements.messageElement = element.querySelector(
      '.select-validation-message'
    );
  }

  // Cache elements after initial render
  cacheElements();

  // CREATION HELPERS

  /**
   * Creates native select element
   * @private
   */
  function createNativeSelect(state) {
    const {
      options = [],
      id,
      name,
      value = '',
      placeholder = 'Select an option',
      required = false,
      multiple = false,
      disabled = false,
    } = state;

    const selectOptions = [];

    // Add placeholder for single select
    if (!multiple && placeholder) {
      selectOptions.push(createPlaceholderOption(placeholder, value === ''));
    }

    // Add regular options
    options.forEach((option) => {
      const isSelected = multiple
        ? Array.isArray(value) && value.includes(option.value)
        : value === option.value;

      selectOptions.push(createNativeOption(option, isSelected));
    });

    return createElement('select', {
      classes: ['select-native'],
      attributes: {
        id,
        name,
        required: required ? 'required' : null,
        multiple: multiple ? 'multiple' : null,
        disabled: disabled ? 'disabled' : null,
        'aria-required': required ? 'true' : null,
        'aria-invalid': state.isValid === false ? 'true' : null,
        'data-element': 'native-select',
      },
      children: selectOptions,
    });
  }

  /**
   * Creates a placeholder option element
   * @private
   */
  function createPlaceholderOption(text, isSelected) {
    return createElement('option', {
      attributes: {
        value: '',
        disabled: true,
        selected: isSelected,
      },
      text,
    });
  }

  /**
   * Creates a native option element
   * @private
   */
  function createNativeOption(option, isSelected) {
    return createElement('option', {
      attributes: {
        value: option.value,
        disabled: !!option.disabled,
        selected: isSelected,
      },
      text: option.label || option.value,
    });
  }

  /**
   * Gets display text and state for selection display
   * @private
   */
  function getDisplayTextAndState(state) {
    const {
      options = [],
      value = '',
      placeholder = 'Select an option',
      multiple = false,
    } = state;

    let displayText = placeholder;
    const isPlaceholderVisible = multiple
      ? !Array.isArray(value) || value.length === 0
      : !value;

    if (multiple && Array.isArray(value) && value.length) {
      displayText = formatMultipleSelection(options, value);
    } else if (value) {
      displayText = formatSingleSelection(options, value);
    }

    return { displayText, isPlaceholderVisible };
  }

  /**
   * Format display text for multiple selection
   * @private
   */
  function formatMultipleSelection(options, value) {
    const selectedLabels = value.map((val) => {
      const option = options.find((opt) => opt.value === val);
      return option ? option.label || option.value : val;
    });

    return selectedLabels.length <= 2
      ? selectedLabels.join(', ')
      : `${selectedLabels.length} items selected`;
  }

  /**
   * Format display text for single selection
   * @private
   */
  function formatSingleSelection(options, value) {
    const selectedOption = options.find((opt) => opt.value === value);
    return selectedOption
      ? selectedOption.label || selectedOption.value
      : value;
  }

  /**
   * Creates custom select UI
   * @private
   */
  function createCustomSelect(state, displayData) {
    const { isValid, disabled, isOpen, multiple } = state;
    const { displayText, isPlaceholderVisible } = displayData;

    // Custom select classes
    const customSelectClasses = ['select-custom'];
    if (disabled) customSelectClasses.push('select-custom--disabled');
    if (isValid === true) customSelectClasses.push('select-custom--valid');
    if (isValid === false) customSelectClasses.push('select-custom--invalid');
    if (isOpen) customSelectClasses.push('select-custom--open');
    if (multiple) customSelectClasses.push('select-custom--multiple');

    const customSelect = createElement('div', {
      classes: customSelectClasses,
      attributes: {
        tabindex: disabled ? '-1' : '0',
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-expanded': isOpen ? 'true' : 'false',
        'data-element': 'custom-select',
      },
    });

    // Direct DOM manipulation for the click handler that works in tests
    customSelect.addEventListener('click', function (e) {
      if (disabled) return;
      e.stopPropagation();

      // Use direct DOM inspection for reliable toggling
      toggleDropdown();
    });

    // Selected value display
    const selectedDisplay = createElement('div', {
      classes: [
        'select-custom__selected',
        isPlaceholderVisible ? 'select-custom__selected--placeholder' : '',
      ],
      attributes: {
        'data-element': 'selected-display',
      },
      text: displayText,
    });

    // Arrow indicator
    const arrow = createElement('div', {
      classes: ['select-custom__arrow'],
    });

    // Options dropdown
    const dropdown = createDropdown(state);

    // Assemble the component
    appendChildren(customSelect, [selectedDisplay, arrow, dropdown]);

    return customSelect;
  }

  /**
   * Creates dropdown with options
   * @private
   */
  function createDropdown(state) {
    const {
      options = [],
      value = '',
      multiple = false,
      isOpen = false,
    } = state;

    const dropdownClasses = ['select-custom__dropdown'];
    if (isOpen) dropdownClasses.push('select-custom__dropdown--open');

    const dropdownOptions = [];

    options.forEach((option) => {
      if (isGroupHeader(option)) {
        dropdownOptions.push(createGroupHeader(option));
        return;
      }

      const isDisabled = !!option.disabled;
      const isSelected = multiple
        ? Array.isArray(value) && value.includes(option.value)
        : value === option.value;

      dropdownOptions.push(
        createDropdownOption(option, isSelected, isDisabled, multiple)
      );
    });

    return createElement('div', {
      classes: dropdownClasses,
      attributes: {
        role: 'listbox',
        'aria-multiselectable': multiple ? 'true' : 'false',
        'data-element': 'dropdown',
      },
      children: dropdownOptions,
    });
  }

  /**
   * Check if an option is a group header
   * @private
   */
  function isGroupHeader(option) {
    return (
      !!option.disabled &&
      option.label &&
      (!option.value || option.value === option.label)
    );
  }

  /**
   * Create a group header element
   * @private
   */
  function createGroupHeader(option) {
    return createElement('div', {
      classes: ['select-custom__group-header'],
      attributes: {
        'data-element': 'group-header',
      },
      text: option.label,
    });
  }

  /**
   * Create a dropdown option element
   * @private
   */
  function createDropdownOption(option, isSelected, isDisabled, multiple) {
    const optionClasses = ['select-custom__option'];
    if (isDisabled) optionClasses.push('select-custom__option--disabled');
    if (isSelected) optionClasses.push('select-custom__option--selected');

    const optionChildren = [];

    // Create checkbox for multiple select
    if (multiple) {
      optionChildren.push(
        createElement('span', {
          classes: [
            'select-custom__checkbox',
            isSelected ? 'select-custom__checkbox--checked' : '',
          ],
        })
      );
    }

    const optionElement = createElement('div', {
      classes: optionClasses,
      attributes: {
        'data-value': option.value,
        role: 'option',
        'aria-disabled': isDisabled ? 'true' : 'false',
        'aria-selected': isSelected ? 'true' : 'false',
        tabindex: isDisabled ? '-1' : '0',
        'data-element': 'option',
      },
      text: option.label || option.value,
      children: optionChildren,
    });

    // Direct click handler on each option
    optionElement.addEventListener('click', function (e) {
      if (isDisabled) return;
      e.preventDefault();
      e.stopPropagation();

      if (multiple) {
        toggleOptionSelection(option.value);
      } else {
        selectOption(option.value);
        toggleDropdown(false);
      }
    });

    return optionElement;
  }

  /**
   * Creates validation message element
   * @private
   */
  function createValidationMessage(state) {
    const { validationMessage = '', showValidation = true, isValid } = state;

    return createElement('div', {
      classes: ['select-validation-message'],
      attributes: {
        'aria-live': 'polite',
        'data-element': 'validation-message',
      },
      text: isValid === false ? validationMessage : '',
      style: {
        display: showValidation ? 'block' : 'none',
      },
    });
  }

  // DROPDOWN MANAGEMENT

  /**
   * Toggles dropdown state
   * @param {boolean} [force] - Force specific state
   * @returns {boolean} New dropdown state
   * @private
   */
  function toggleDropdown(force) {
    if (state.disabled) return state.isOpen;

    // Determine new state
    const isCurrentlyOpen = elements.dropdown?.classList.contains(
      'select-custom__dropdown--open'
    );
    const newState = typeof force === 'boolean' ? force : !isCurrentlyOpen;

    // Update internal state
    state.isOpen = newState;

    // Update DOM directly
    elements.customSelect.classList.toggle('select-custom--open', newState);
    elements.customSelect.setAttribute(
      'aria-expanded',
      newState ? 'true' : 'false'
    );
    elements.dropdown.classList.toggle(
      'select-custom__dropdown--open',
      newState
    );

    return newState;
  }

  /**
   * Updates the display text directly after selection
   * @private
   */
  function updateDisplayTextDirectly() {
    const displayData = getDisplayTextAndState(state);

    if (elements.selectedDisplay) {
      // Update text
      elements.selectedDisplay.textContent = displayData.displayText;

      // Update placeholder class
      elements.selectedDisplay.classList.toggle(
        'select-custom__selected--placeholder',
        displayData.isPlaceholderVisible
      );
    }

    // Also update selected states on all options
    updateOptionsSelectedState();
  }

  /**
   * Updates the visual selected state of all options
   * @private
   */
  function updateOptionsSelectedState() {
    const options = element.querySelectorAll('.select-custom__option');
    const { value, multiple } = state;

    options.forEach((option) => {
      const optionValue = option.getAttribute('data-value');
      const isSelected = multiple
        ? Array.isArray(value) && value.includes(optionValue)
        : value === optionValue;

      // Update class
      option.classList.toggle('select-custom__option--selected', isSelected);

      // Update aria attribute
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');

      // Update checkbox if multiple
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

  // VALUE MANAGEMENT

  /**
   * Selects a single option
   * @private
   */
  function selectOption(value) {
    if (state.disabled) {
      console.warn('Cannot select option on disabled select');
      return;
    }

    // Validate value exists in options
    if (!state.options?.some((opt) => opt.value === value)) {
      console.warn(`Select: value "${value}" not found in options`);
      return;
    }

    // Update native select and internal state
    elements.nativeSelect.value = value;
    state.value = value;

    // Update display text directly
    updateDisplayTextDirectly();

    // Dispatch change event to trigger handlers
    const changeEvent = new Event('change');
    elements.nativeSelect.dispatchEvent(changeEvent);
  }

  /**
   * Toggles option selection (for multiple)
   * @private
   */
  function toggleOptionSelection(value) {
    if (state.disabled) {
      console.warn('Cannot toggle option on disabled select');
      return;
    }

    // Validate multiple mode
    if (!state.multiple) {
      console.warn(
        'toggleOptionSelection can only be used with multiple selects'
      );
      return;
    }

    // Get current values
    const currentValues = Array.isArray(state.value) ? [...state.value] : [];

    // Toggle the value
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    // Update native select options
    Array.from(elements.nativeSelect.options).forEach((option) => {
      option.selected = newValues.includes(option.value);
    });

    // Update internal state
    state.value = newValues;

    // Update display text directly
    updateDisplayTextDirectly();

    // Dispatch change event to trigger handlers
    const changeEvent = new Event('change');
    elements.nativeSelect.dispatchEvent(changeEvent);
  }

  /**
   * Validates props for select component
   * @private
   */
  function validateSelectProps(props) {
    if (!props) return;

    // Check options array
    if (props.options !== undefined && !Array.isArray(props.options)) {
      throw new TypeError('Select: options must be an array');
    }

    // Check options structure
    if (Array.isArray(props.options)) {
      props.options.forEach((option, index) => {
        if (!option || typeof option !== 'object') {
          throw new TypeError(
            `Select: option at index ${index} must be an object`
          );
        }
        if (option.value === undefined) {
          throw new TypeError(
            `Select: option at index ${index} must have a value property`
          );
        }
      });
    }

    // Check value type for multiple
    if (
      props.multiple &&
      props.value !== undefined &&
      !Array.isArray(props.value)
    ) {
      console.warn(
        'Select: multiple select received non-array value - converting to array'
      );
    }

    // Check callbacks
    ['onChange', 'onFocus', 'onBlur'].forEach((callback) => {
      if (
        props[callback] !== undefined &&
        typeof props[callback] !== 'function'
      ) {
        throw new TypeError(`Select: ${callback} must be a function`);
      }
    });
  }

  // Set up event listeners
  element.addEventListener('change', handleNativeSelectChange);
  element.addEventListener('focus', handleNativeSelectFocus, true);
  element.addEventListener('blur', handleNativeSelectBlur, true);

  // Document click handler to close dropdown when clicking outside
  const documentClickHandler = debounce((event) => {
    if (!element.contains(event.target) && state.isOpen) {
      toggleDropdown(false);
    }
  }, 10);

  document.addEventListener('click', documentClickHandler);

  /**
   * Handle native select change events
   * @private
   */
  function handleNativeSelectChange(event) {
    if (state.disabled) return;

    const selectElement = event.target;
    if (selectElement.getAttribute('data-element') !== 'native-select') return;

    // Update value based on selection type
    if (state.multiple) {
      const selectedOptions = Array.from(selectElement.selectedOptions);
      state.value = selectedOptions.map((opt) => opt.value);
    } else {
      state.value = selectElement.value;
    }

    // Update display directly
    updateDisplayTextDirectly();

    // Validate if needed
    if (state.showValidation && state.isValid !== null) {
      validate();
    }

    // Call onChange callback
    if (typeof state.onChange === 'function') {
      state.onChange(event, getValue());
    }
  }

  /**
   * Handle native select focus events
   * @private
   */
  function handleNativeSelectFocus(event) {
    if (state.disabled) return;

    const selectElement = event.target;
    if (selectElement.getAttribute('data-element') !== 'native-select') return;

    element.classList.add('select-container--focused');
    elements.customSelect.classList.add('select-custom--focused');

    if (typeof state.onFocus === 'function') {
      state.onFocus(event);
    }
  }

  /**
   * Handle native select blur events
   * @private
   */
  function handleNativeSelectBlur(event) {
    if (state.disabled) return;

    const selectElement = event.target;
    if (selectElement.getAttribute('data-element') !== 'native-select') return;

    // Don't remove focus if clicking within custom select
    if (!elements.customSelect.contains(event.relatedTarget)) {
      element.classList.remove('select-container--focused');
      elements.customSelect.classList.remove('select-custom--focused');

      // Validate if needed
      if (state.showValidation && state.isValid !== null) {
        validate();
      }

      // Call onBlur callback
      if (typeof state.onBlur === 'function') {
        state.onBlur(event);
      }
    }
  }

  /**
   * Validate the current selection
   * @returns {boolean} Whether the selection is valid
   */
  function validate() {
    let isValid = true;

    if (state.required) {
      if (state.multiple) {
        isValid = Array.isArray(state.value) && state.value.length > 0;
      } else {
        isValid = !!state.value;
      }
    }

    // Use validation utility to update UI
    validateInput(elements.nativeSelect, {
      container: element,
      customElement: elements.customSelect,
      messageElement: elements.messageElement,
      customMessage: state.validationMessage,
    });

    // Update internal state
    state.isValid = isValid;

    // Also update component DOM classes directly to ensure they're applied
    elements.customSelect.classList.toggle('select-custom--valid', isValid);
    elements.customSelect.classList.toggle('select-custom--invalid', !isValid);

    return isValid;
  }

  /**
   * Get the current value of the select
   * @returns {string|string[]} Current value
   */
  function getValue() {
    return state.value;
  }

  // PUBLIC API
  const api = {
    /**
     * Get the select element
     * @returns {HTMLElement} Select container element
     */
    getElement() {
      return element;
    },

    /**
     * Get the current value of the select
     * @returns {string|string[]} Current value (or array of values for multiple select)
     */
    getValue,

    /**
     * Set the value of the select
     * @param {string|string[]} value - New value
     * @returns {Object} Select component (for chaining)
     */
    setValue(value) {
      if (state.disabled) {
        console.warn('Cannot set value on disabled select');
        return api;
      }

      // Convert value type if needed
      if (state.multiple) {
        state.value = Array.isArray(value) ? value : value ? [value] : [];
      } else {
        state.value = Array.isArray(value) ? value[0] || '' : value || '';
      }

      // Update native select to match
      if (state.multiple && Array.isArray(state.value)) {
        Array.from(elements.nativeSelect.options).forEach((option) => {
          option.selected = state.value.includes(option.value);
        });
      } else {
        elements.nativeSelect.value = state.value;
      }

      // Update display directly
      updateDisplayTextDirectly();

      // Validate if needed
      if (state.showValidation && state.isValid !== null) {
        validate();
      }

      return api;
    },

    /**
     * Update multiple properties at once
     * @param {Object} newProps - New properties
     * @returns {Object} Select component (for chaining)
     */
    update(newProps) {
      // Validate new props
      validateSelectProps(newProps);

      // Update state
      state = { ...state, ...newProps };

      // Update component
      component.update(state);

      // Re-cache elements
      cacheElements();

      return api;
    },

    /**
     * Update the options of the select
     * @param {Array} options - New options array
     * @param {boolean} [keepValue=true] - Whether to try to keep the current value
     * @returns {Object} Select component (for chaining)
     */
    updateOptions(options, keepValue = true) {
      if (!Array.isArray(options)) {
        throw new Error('Select: options must be an array');
      }

      // Store old value to check if it exists in new options
      const oldValue = state.value;

      // Update options
      state.options = options;

      // Update value if needed
      if (keepValue) {
        if (state.multiple && Array.isArray(oldValue)) {
          // For multiple, keep only values that exist in new options
          state.value = oldValue.filter((val) =>
            options.some((opt) => opt.value === val)
          );
        } else if (!state.multiple && oldValue) {
          // For single, check if value exists in new options
          if (!options.some((opt) => opt.value === oldValue)) {
            state.value = '';
          }
        }
      } else {
        // Reset value if not keeping
        state.value = state.multiple ? [] : '';
      }

      // Update component
      component.update(state);

      // Re-cache elements
      cacheElements();

      return api;
    },

    /**
     * Validate the selection
     * @returns {boolean} Whether the selection is valid
     */
    validate,

    /**
     * Theme change handler (for withThemeAwareness HOC)
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      console.log(
        `Select component theme changed: ${previousTheme} -> ${theme}`
      );
    },

    /**
     * Clean up resources to prevent memory leaks
     */
    destroy() {
      // Remove document event listener
      document.removeEventListener('click', documentClickHandler);

      // Remove element event listeners
      element.removeEventListener('change', handleNativeSelectChange);
      element.removeEventListener('focus', handleNativeSelectFocus, true);
      element.removeEventListener('blur', handleNativeSelectBlur, true);

      // More comprehensive cleanup
      if (element) {
        // Use a more reliable approach to remove all listeners
        const newElement = element.cloneNode(true);
        if (element.parentNode) {
          element.parentNode.replaceChild(newElement, element);
        }
      }

      // Clear cached elements
      Object.keys(elements).forEach((key) => {
        elements[key] = null;
      });

      // Call base component's destroy
      component.destroy();
    },
  };

  return api;
};

// Enhance component with theme awareness
export default withThemeAwareness(createSelect);
