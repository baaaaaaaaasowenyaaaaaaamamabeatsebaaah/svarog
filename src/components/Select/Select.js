/**
 * Creates a performance-optimized Select component with enhanced UI and accessibility
 * @param {Object} props - Component configuration
 * @returns {Object} Component API object
 */ // src/components/Select/Select.js
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

  // Track component state for updates
  let state = { ...props };

  // Set up document click handler for dropdown
  const documentClickHandler = debounce((event) => {
    if (!element.contains(event.target) && state.isOpen) {
      closeDropdown();
    }
  }, 50);

  document.addEventListener('click', documentClickHandler);

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
      selectOptions.push(
        createElement('option', {
          attributes: {
            value: '',
            disabled: true,
            selected: value === '',
          },
          text: placeholder,
        })
      );
    }

    // Add regular options
    options.forEach((option) => {
      const isSelected = multiple
        ? Array.isArray(value) && value.includes(option.value)
        : value === option.value;

      selectOptions.push(
        createElement('option', {
          attributes: {
            value: option.value,
            disabled: !!option.disabled,
            selected: isSelected,
          },
          text: option.label || option.value,
        })
      );
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
      const selectedLabels = value.map((val) => {
        const option = options.find((opt) => opt.value === val);
        return option ? option.label || option.value : val;
      });

      displayText =
        selectedLabels.length <= 2
          ? selectedLabels.join(', ')
          : `${selectedLabels.length} items selected`;
    } else if (value) {
      const selectedOption = options.find((opt) => opt.value === value);
      displayText = selectedOption
        ? selectedOption.label || selectedOption.value
        : value;
    }

    return { displayText, isPlaceholderVisible };
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
      const isDisabled = !!option.disabled;

      // For group headers
      if (
        isDisabled &&
        option.label &&
        (!option.value || option.value === option.label)
      ) {
        dropdownOptions.push(
          createElement('div', {
            classes: ['select-custom__group-header'],
            attributes: {
              'data-element': 'group-header',
            },
            text: option.label,
          })
        );
        return;
      }

      const isSelected = multiple
        ? Array.isArray(value) && value.includes(option.value)
        : value === option.value;

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

      dropdownOptions.push(optionElement);
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

  // EVENT HANDLERS

  /**
   * Global document click handler
   * @private
   */
  function handleDocumentClick(event) {
    if (!element.contains(event.target) && state.isOpen) {
      closeDropdown();
    }
  }

  /**
   * Handles all events with delegation
   * @private
   */
  function handleEvents(event) {
    // Early return if disabled
    if (state.disabled) return;

    const targetElement = event.target;
    const eventType = event.type;
    const elementType =
      targetElement.getAttribute('data-element') ||
      targetElement.closest('[data-element]')?.getAttribute('data-element');
    const targetValue =
      targetElement.getAttribute('data-value') ||
      targetElement.closest('[data-value]')?.getAttribute('data-value');

    // Handle events by element type
    switch (elementType) {
      case 'native-select':
        handleNativeSelectEvents(eventType, targetElement, event);
        break;

      case 'custom-select':
        if (eventType === 'click') {
          event.stopPropagation();
          toggleDropdown();
          element.querySelector('.select-native').focus();
        } else if (eventType === 'keydown') {
          handleSelectKeydown(event);
        }
        break;

      case 'option':
        if (
          (eventType === 'click' ||
            (eventType === 'keydown' &&
              (event.key === 'Enter' || event.key === ' '))) &&
          targetValue &&
          !targetElement.classList.contains('select-custom__option--disabled')
        ) {
          event.preventDefault();
          if (eventType === 'click') event.stopPropagation();

          if (state.multiple) {
            toggleOptionSelection(targetValue);
          } else {
            selectOption(targetValue);
            closeDropdown();
          }
        } else if (eventType === 'keydown') {
          handleOptionKeydown(event);
        }
        break;
    }
  }

  /**
   * Handles native select events
   * @private
   */
  function handleNativeSelectEvents(eventType, selectElement, event) {
    switch (eventType) {
      case 'change': {
        // Update value based on selection type
        if (state.multiple) {
          const selectedOptions = Array.from(selectElement.selectedOptions);
          state.value = selectedOptions.map((opt) => opt.value);
        } else {
          state.value = selectElement.value;
        }

        component.update(state);

        // Validate if needed
        if (state.showValidation && state.isValid !== null) {
          validate();
        }

        // Call onChange callback
        if (typeof state.onChange === 'function') {
          state.onChange(event, getValue());
        }
        break;
      }

      case 'focus': {
        element.classList.add('select-container--focused');
        element
          .querySelector('.select-custom')
          .classList.add('select-custom--focused');

        if (typeof state.onFocus === 'function') {
          state.onFocus(event);
        }
        break;
      }

      case 'blur': {
        const customSelect = element.querySelector('.select-custom');

        // Don't remove focus if clicking within custom select
        if (!customSelect.contains(event.relatedTarget)) {
          element.classList.remove('select-container--focused');
          customSelect.classList.remove('select-custom--focused');

          // Validate if needed
          if (state.showValidation && state.isValid !== null) {
            validate();
          }

          // Call onBlur callback
          if (typeof state.onBlur === 'function') {
            state.onBlur(event);
          }
        }
        break;
      }
    }
  }

  /**
   * Handles keyboard navigation
   * @private
   */
  function handleSelectKeydown(event) {
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
  }

  /**
   * Handles option keyboard navigation
   * @private
   */
  function handleOptionKeydown(event) {
    switch (event.key) {
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
        element.querySelector('.select-custom').focus();
        break;
      case 'Tab':
        closeDropdown();
        break;
    }
  }

  // DROPDOWN MANAGEMENT

  /**
   * Toggles dropdown open/closed
   * @private
   */
  function toggleDropdown() {
    if (state.isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  /**
   * Opens the dropdown
   * @private
   */
  function openDropdown() {
    if (!state.isOpen && !state.disabled) {
      state.isOpen = true;
      component.update(state);
    }
  }

  /**
   * Closes the dropdown
   * @private
   */
  function closeDropdown() {
    if (state.isOpen) {
      state.isOpen = false;
      component.update(state);
    }
  }

  /**
   * Focuses the next option
   * @private
   */
  function focusNextOption() {
    const options = getSelectableOptions();
    if (!options.length) return;

    const currentFocused = element.querySelector(
      '.select-custom__option:focus'
    );
    let nextIndex = 0;

    if (currentFocused) {
      const currentIndex = Array.from(options).indexOf(currentFocused);
      nextIndex = (currentIndex + 1) % options.length;
    }

    options[nextIndex].focus();
    scrollOptionIntoView(options[nextIndex]);
  }

  /**
   * Focuses the previous option
   * @private
   */
  function focusPreviousOption() {
    const options = getSelectableOptions();
    if (!options.length) return;

    const currentFocused = element.querySelector(
      '.select-custom__option:focus'
    );
    let prevIndex = options.length - 1;

    if (currentFocused) {
      const currentIndex = Array.from(options).indexOf(currentFocused);
      prevIndex = (currentIndex - 1 + options.length) % options.length;
    }

    options[prevIndex].focus();
    scrollOptionIntoView(options[prevIndex]);
  }

  /**
   * Scrolls option into view
   * @private
   */
  function scrollOptionIntoView(option) {
    const dropdown = element.querySelector('.select-custom__dropdown');
    const optionTop = option.offsetTop;
    const optionBottom = optionTop + option.offsetHeight;
    const dropdownScrollTop = dropdown.scrollTop;
    const dropdownHeight = dropdown.offsetHeight;

    if (optionTop < dropdownScrollTop) {
      dropdown.scrollTop = optionTop;
    } else if (optionBottom > dropdownScrollTop + dropdownHeight) {
      dropdown.scrollTop = optionBottom - dropdownHeight;
    }
  }

  /**
   * Gets selectable options
   * @private
   */
  function getSelectableOptions() {
    return element.querySelectorAll(
      '.select-custom__option:not(.select-custom__option--disabled)'
    );
  }

  // VALUE MANAGEMENT

  /**
   * Selects a single option
   * @private
   */
  function selectOption(value) {
    // Validate value exists in options
    if (!state.options?.some((opt) => opt.value === value)) {
      console.warn(`Select: value "${value}" not found in options`);
      return;
    }

    // Update native select and internal state
    const nativeSelect = element.querySelector('.select-native');
    nativeSelect.value = value;
    state.value = value;

    // Dispatch change event to trigger handlers
    const changeEvent = new Event('change');
    nativeSelect.dispatchEvent(changeEvent);
  }

  /**
   * Toggles option selection (for multiple)
   * @private
   */
  function toggleOptionSelection(value) {
    // Validate multiple mode
    if (!state.multiple) {
      throw new Error(
        'toggleOptionSelection can only be used with multiple selects'
      );
    }

    // Get current values
    const currentValues = Array.isArray(state.value) ? [...state.value] : [];

    // Toggle the value
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    // Update native select options
    const nativeSelect = element.querySelector('.select-native');
    Array.from(nativeSelect.options).forEach((option) => {
      option.selected = newValues.includes(option.value);
    });

    // Update internal state
    state.value = newValues;

    // Dispatch change event to trigger handlers
    const changeEvent = new Event('change');
    nativeSelect.dispatchEvent(changeEvent);
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

  // Set up delegated event listeners
  element.addEventListener('change', handleEvents);
  element.addEventListener('focus', handleEvents, true); // Use capture for focus/blur
  element.addEventListener('blur', handleEvents, true);
  element.addEventListener('keydown', handleEvents);
  element.addEventListener('click', handleEvents);

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
    const nativeSelect = element.querySelector('.select-native');
    const customSelect = element.querySelector('.select-custom');
    const messageElement = element.querySelector('.select-validation-message');

    validateInput(nativeSelect, {
      container: element,
      customElement: customSelect,
      messageElement,
      customMessage: state.validationMessage,
    });

    // Update internal state
    state.isValid = isValid;

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
      // Convert value type if needed
      if (state.multiple) {
        state.value = Array.isArray(value) ? value : value ? [value] : [];
      } else {
        state.value = Array.isArray(value) ? value[0] || '' : value || '';
      }

      // Update native select to match
      const nativeSelect = element.querySelector('.select-native');

      if (state.multiple && Array.isArray(state.value)) {
        Array.from(nativeSelect.options).forEach((option) => {
          option.selected = state.value.includes(option.value);
        });
      } else {
        nativeSelect.value = state.value;
      }

      // Update component
      component.update(state);

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
      document.removeEventListener('click', handleDocumentClick);

      // Remove element event listeners
      element.removeEventListener('change', handleEvents);
      element.removeEventListener('focus', handleEvents, true);
      element.removeEventListener('blur', handleEvents, true);
      element.removeEventListener('keydown', handleEvents);
      element.removeEventListener('click', handleEvents);

      // Call base component's destroy
      component.destroy();
    },
  };

  return api;
};

// Enhance component with theme awareness
export default withThemeAwareness(createSelect);
