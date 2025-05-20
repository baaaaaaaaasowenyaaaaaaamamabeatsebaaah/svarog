// src/components/Select/Select.js
import './Select.css';
import { createElement } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { validateInput } from '../../utils/validation.js';

/**
 * Creates a Select component with enhanced custom UI and accessibility features
 *
 * The Select component provides a customizable, accessible dropdown selection with
 * support for single and multiple selections, option groups, and validation.
 *
 * @param {Object} props - Configuration properties for the Select component
 * @param {Array<Object>} [props.options=[]] - Array of option objects with value and label properties
 * @param {string} [props.id] - ID attribute for the select element
 * @param {string} [props.name] - Name attribute for form submission
 * @param {string|Array<string>} [props.value=''] - Current value(s) (array for multiple selects)
 * @param {string} [props.placeholder='Select an option'] - Placeholder text when no option selected
 * @param {boolean} [props.required=false] - Whether selection is required
 * @param {boolean} [props.disabled=false] - Whether select is disabled
 * @param {boolean} [props.multiple=false] - Allow multiple selections
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Function} [props.onChange] - Change event handler (params: event, value)
 * @param {Function} [props.onFocus] - Focus event handler
 * @param {Function} [props.onBlur] - Blur event handler
 * @param {string} [props.validationMessage=''] - Message shown for invalid selections
 * @param {boolean} [props.showValidation=true] - Whether to show validation styling
 * @returns {Object} Select component API
 * @example
 * // Create a basic select
 * const mySelect = Select({
 *   options: [
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2' },
 *   ],
 *   onChange: (event, value) => console.log('Selected value:', value),
 * });
 *
 * // Add to DOM
 * document.body.appendChild(mySelect.getElement());
 */
const createSelect = (props) => {
  // Use base component for standardized lifecycle
  const baseComponent = createBaseComponent((state) => {
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
      validationMessage = '',
      showValidation = true,
      isValid = null,
      isOpen = false,
    } = state;

    // Create container with data attribute for delegation
    const container = createElement('div', {
      classes: ['select-container', className],
      attributes: {
        'data-component': 'select',
        'data-valid':
          isValid === true ? 'true' : isValid === false ? 'false' : null,
      },
    });

    // Create native select element with options
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
      selectOptions.push(
        createElement('option', {
          attributes: {
            value: option.value,
            disabled: !!option.disabled,
            selected: multiple
              ? Array.isArray(value) && value.includes(option.value)
              : value === option.value,
          },
          text: option.label || option.value,
        })
      );
    });

    const nativeSelect = createElement('select', {
      classes: ['select-native'],
      attributes: {
        id,
        name,
        required: required ? 'required' : null,
        multiple: multiple ? 'multiple' : null,
        disabled: disabled ? 'disabled' : null,
        'aria-required': required ? 'true' : null,
        'aria-invalid': isValid === false ? 'true' : null,
        'data-element': 'native-select',
      },
      children: selectOptions,
      events: {
        change: handleNativeSelectChange,
        focus: handleNativeSelectFocus,
        blur: handleNativeSelectBlur,
      },
    });

    // Determine display text for selected value
    let displayText = placeholder;
    const isPlaceholderVisible = multiple
      ? !Array.isArray(value) || value.length === 0
      : !value;

    if (multiple) {
      if (Array.isArray(value) && value.length) {
        const selectedLabels = value.map((val) => {
          const option = options.find((opt) => opt.value === val);
          return option ? option.label || option.value : val;
        });

        if (selectedLabels.length <= 2) {
          displayText = selectedLabels.join(', ');
        } else {
          displayText = `${selectedLabels.length} items selected`;
        }
      }
    } else if (value) {
      const selectedOption = options.find((opt) => opt.value === value);
      displayText = selectedOption
        ? selectedOption.label || selectedOption.value
        : value;
    }

    // Create custom select UI
    const customSelectClasses = ['select-custom'];
    if (disabled) customSelectClasses.push('select-custom--disabled');
    if (isValid === true) customSelectClasses.push('select-custom--valid');
    if (isValid === false) customSelectClasses.push('select-custom--invalid');
    if (isOpen) customSelectClasses.push('select-custom--open');

    const customSelect = createElement('div', {
      classes: customSelectClasses,
      attributes: {
        tabindex: disabled ? '-1' : '0',
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-expanded': isOpen ? 'true' : 'false',
        'data-element': 'custom-select',
      },
      events: {
        click: handleCustomSelectClick,
        keydown: handleCustomSelectKeydown,
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

    // Dropdown with options
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
        events: !isDisabled
          ? {
              click: (e) => handleOptionClick(option.value, e),
              keydown: handleOptionKeydown,
            }
          : {},
      });

      dropdownOptions.push(optionElement);
    });

    const dropdown = createElement('div', {
      classes: dropdownClasses,
      attributes: {
        role: 'listbox',
        'aria-multiselectable': multiple ? 'true' : 'false',
        'data-element': 'dropdown',
      },
      children: dropdownOptions,
    });

    // Validation message
    const validationElement = createElement('div', {
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

    // Assemble the component
    customSelect.appendChild(selectedDisplay);
    customSelect.appendChild(arrow);
    customSelect.appendChild(dropdown);

    container.appendChild(nativeSelect);
    container.appendChild(customSelect);
    container.appendChild(validationElement);

    return container;
  });

  // Initialize component with props and validate props
  validateProps(props);
  const component = baseComponent(props);
  const element = component.getElement();

  // Organized state management
  const stateManager = createStateManager(props);

  // Set up document click handler
  const documentClickHandler = createDocumentClickHandler();
  document.addEventListener('click', documentClickHandler);

  /**
   * Creates a state manager with organized state structure
   * @param {Object} initialProps - Initial component properties
   * @returns {Object} State manager object
   * @private
   */
  function createStateManager(initialProps) {
    // Organize state into logical groups
    const state = {
      // Data state - core data that drives the component
      data: {
        options: Array.isArray(initialProps.options)
          ? initialProps.options
          : [],
        value: initialProps.value ?? '',
        required: !!initialProps.required,
        multiple: !!initialProps.multiple,
      },

      // UI state - visual representation state
      ui: {
        isOpen: false,
        isValid: null,
        isFocused: false,
      },

      // Configuration state - settings that control behavior
      config: {
        id: initialProps.id,
        name: initialProps.name,
        placeholder: initialProps.placeholder || 'Select an option',
        disabled: !!initialProps.disabled,
        className: initialProps.className || '',
        showValidation: initialProps.showValidation !== false,
        validationMessage: initialProps.validationMessage || '',
      },

      // Callbacks
      callbacks: {
        onChange:
          typeof initialProps.onChange === 'function'
            ? initialProps.onChange
            : null,
        onFocus:
          typeof initialProps.onFocus === 'function'
            ? initialProps.onFocus
            : null,
        onBlur:
          typeof initialProps.onBlur === 'function'
            ? initialProps.onBlur
            : null,
      },
    };

    return {
      getState: () => ({ ...state }),

      getValue: () => state.data.value,

      setValue: (newValue) => {
        // Validate value type based on multiple setting
        if (state.data.multiple) {
          state.data.value = Array.isArray(newValue)
            ? newValue
            : newValue
              ? [newValue]
              : [];
        } else {
          state.data.value = Array.isArray(newValue)
            ? newValue[0] || ''
            : newValue || '';
        }
        return state.data.value;
      },

      setValidState: (isValid) => {
        state.ui.isValid = isValid;
        return isValid;
      },

      setOptions: (newOptions, keepValue = true) => {
        if (!Array.isArray(newOptions)) {
          throw new Error('Select: options must be an array');
        }

        // Store old value to check if it exists in new options
        const oldValue = state.data.value;

        // Update options
        state.data.options = newOptions;

        // Update value if keeping and it exists in new options
        if (keepValue) {
          if (state.data.multiple && Array.isArray(oldValue)) {
            // For multiple, keep only values that exist in new options
            state.data.value = oldValue.filter((val) =>
              newOptions.some((opt) => opt.value === val)
            );
          } else if (!state.data.multiple && oldValue) {
            // For single, check if value exists in new options
            if (!newOptions.some((opt) => opt.value === oldValue)) {
              state.data.value = '';
            }
          }
        } else {
          // Reset value if not keeping
          state.data.value = state.data.multiple ? [] : '';
        }

        return newOptions;
      },

      updateState: (newState) => {
        // Update each section of state with new values
        if (newState.data) {
          Object.assign(state.data, newState.data);
        }

        if (newState.ui) {
          Object.assign(state.ui, newState.ui);
        }

        if (newState.config) {
          Object.assign(state.config, newState.config);
        }

        if (newState.callbacks) {
          Object.assign(state.callbacks, newState.callbacks);
        }

        return { ...state };
      },

      // Helper to get flat state for rendering
      getFlatState: () => {
        return {
          ...state.data,
          ...state.ui,
          ...state.config,
          onChange: state.callbacks.onChange,
          onFocus: state.callbacks.onFocus,
          onBlur: state.callbacks.onBlur,
        };
      },
    };
  }

  /**
   * Validates component props
   * @param {Object} props - Component properties to validate
   * @throws {Error} If props are invalid
   * @private
   */
  function validateProps(props) {
    // Skip validation for empty props
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

  /**
   * Creates a document click handler to close dropdown when clicking outside
   * @returns {Function} Click handler function
   * @private
   */
  function createDocumentClickHandler() {
    return (event) => {
      if (
        !element.contains(event.target) &&
        stateManager.getState().ui.isOpen
      ) {
        closeDropdown();
      }
    };
  }

  // EVENT HANDLERS

  /**
   * Handle native select change
   * @param {Event} event - Change event
   * @private
   */
  function handleNativeSelectChange(event) {
    // Update value based on selection type
    if (stateManager.getState().data.multiple) {
      const selectedOptions = Array.from(event.target.selectedOptions);
      stateManager.setValue(selectedOptions.map((opt) => opt.value));
    } else {
      stateManager.setValue(event.target.value);
    }

    // Update component
    component.update(stateManager.getFlatState());

    // Validate if needed
    const state = stateManager.getState();
    if (state.config.showValidation && state.ui.isValid !== null) {
      validate();
    }

    // Call onChange callback
    const callback = state.callbacks.onChange;
    if (callback) {
      callback(event, stateManager.getValue());
    }
  }

  /**
   * Handle native select focus
   * @param {Event} event - Focus event
   * @private
   */
  function handleNativeSelectFocus(event) {
    const state = stateManager.getState();
    stateManager.updateState({
      ui: { isFocused: true },
    });

    // Add focused classes
    element.classList.add('select-container--focused');
    element
      .querySelector('.select-custom')
      .classList.add('select-custom--focused');

    // Call onFocus callback
    const callback = state.callbacks.onFocus;
    if (callback) {
      callback(event);
    }
  }

  /**
   * Handle native select blur
   * @param {Event} event - Blur event
   * @private
   */
  function handleNativeSelectBlur(event) {
    const customSelect = element.querySelector('.select-custom');

    // Don't remove focus if clicking within custom select
    if (!customSelect.contains(event.relatedTarget)) {
      const state = stateManager.getState();
      stateManager.updateState({
        ui: { isFocused: false },
      });

      // Remove focused classes
      element.classList.remove('select-container--focused');
      customSelect.classList.remove('select-custom--focused');

      // Validate if needed
      if (state.config.showValidation && state.ui.isValid !== null) {
        validate();
      }

      // Call onBlur callback
      const callback = state.callbacks.onBlur;
      if (callback) {
        callback(event);
      }
    }
  }

  /**
   * Handle custom select click
   * @param {Event} event - Click event
   * @private
   */
  function handleCustomSelectClick(event) {
    event.stopPropagation();

    // Don't do anything if disabled
    if (stateManager.getState().config.disabled) return;

    toggleDropdown();

    // Focus the native select for keyboard interaction
    element.querySelector('.select-native').focus();
  }

  /**
   * Handle custom select keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   * @private
   */
  function handleCustomSelectKeydown(event) {
    if (stateManager.getState().config.disabled) return;

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
   * Handle option click
   * @param {string} value - Option value
   * @param {MouseEvent} event - Click event
   * @private
   */
  function handleOptionClick(value, event) {
    event.stopPropagation();

    if (stateManager.getState().data.multiple) {
      toggleOptionSelection(value);
    } else {
      selectOption(value);
      closeDropdown();
    }
  }

  /**
   * Handle option keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   * @private
   */
  function handleOptionKeydown(event) {
    const value = event.currentTarget.getAttribute('data-value');

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (stateManager.getState().data.multiple) {
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
        element.querySelector('.select-custom').focus();
        break;
      case 'Tab':
        closeDropdown();
        break;
    }
  }

  // DROPDOWN MANAGEMENT

  /**
   * Toggle dropdown open/closed
   * @private
   */
  function toggleDropdown() {
    const state = stateManager.getState();
    if (state.ui.isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  /**
   * Open the dropdown
   * @private
   */
  function openDropdown() {
    const state = stateManager.getState();
    if (!state.ui.isOpen && !state.config.disabled) {
      stateManager.updateState({
        ui: { isOpen: true },
      });

      component.update(stateManager.getFlatState());
    }
  }

  /**
   * Close the dropdown
   * @private
   */
  function closeDropdown() {
    if (stateManager.getState().ui.isOpen) {
      stateManager.updateState({
        ui: { isOpen: false },
      });

      component.update(stateManager.getFlatState());
    }
  }

  /**
   * Focus the next option in the dropdown
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
  }

  /**
   * Focus the previous option in the dropdown
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
  }

  /**
   * Get selectable (non-disabled) options
   * @returns {NodeList} Selectable options
   * @private
   */
  function getSelectableOptions() {
    return element.querySelectorAll(
      '.select-custom__option:not(.select-custom__option--disabled)'
    );
  }

  // VALUE MANAGEMENT

  /**
   * Select an option (for single select)
   * @param {string} value - Option value to select
   * @throws {Error} If value is not found in options
   * @private
   */
  function selectOption(value) {
    const state = stateManager.getState();

    // Validate value exists in options
    if (!state.data.options.some((opt) => opt.value === value)) {
      console.warn(`Select: value "${value}" not found in options`);
    }

    // Update native select and internal state
    const nativeSelect = element.querySelector('.select-native');
    nativeSelect.value = value;
    stateManager.setValue(value);

    // Dispatch change event to trigger handlers
    const changeEvent = new Event('change');
    nativeSelect.dispatchEvent(changeEvent);
  }

  /**
   * Toggle an option selection (for multiple select)
   * @param {string} value - Option value to toggle
   * @throws {Error} If called on a non-multiple select
   * @private
   */
  function toggleOptionSelection(value) {
    const state = stateManager.getState();

    // Validate multiple mode
    if (!state.data.multiple) {
      throw new Error(
        'toggleOptionSelection can only be used with multiple selects'
      );
    }

    // Get current values
    const currentValues = Array.isArray(state.data.value)
      ? [...state.data.value]
      : [];

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
    stateManager.setValue(newValues);

    // Dispatch change event to trigger handlers
    const changeEvent = new Event('change');
    nativeSelect.dispatchEvent(changeEvent);
  }

  /**
   * Validate the current selection
   * @returns {boolean} Whether the selection is valid
   * @private
   */
  function validate() {
    const state = stateManager.getState();
    let isValid = true;

    if (state.data.required) {
      if (state.data.multiple) {
        isValid =
          Array.isArray(state.data.value) && state.data.value.length > 0;
      } else {
        isValid = !!state.data.value;
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
      customMessage: state.config.validationMessage,
    });

    // Update internal state
    stateManager.setValidState(isValid);

    return isValid;
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
    getValue() {
      return stateManager.getValue();
    },

    /**
     * Set the value of the select
     * @param {string|string[]} value - New value (or array of values for multiple select)
     * @returns {Object} Select component (for chaining)
     */
    setValue(value) {
      // Update state
      stateManager.setValue(value);

      // Update native select to match
      const nativeSelect = element.querySelector('.select-native');
      const state = stateManager.getState();

      if (state.data.multiple && Array.isArray(value)) {
        Array.from(nativeSelect.options).forEach((option) => {
          option.selected = value.includes(option.value);
        });
      } else {
        nativeSelect.value = value;
      }

      // Update component
      component.update(stateManager.getFlatState());

      // Validate if needed
      if (state.config.showValidation && state.ui.isValid !== null) {
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
      validateProps(newProps);

      // Organize props into state structure
      const stateUpdate = {
        data: {},
        ui: {},
        config: {},
        callbacks: {},
      };

      // Map props to state structure
      Object.entries(newProps).forEach(([key, value]) => {
        if (['options', 'value', 'required', 'multiple'].includes(key)) {
          stateUpdate.data[key] = value;
        } else if (['isOpen', 'isValid', 'isFocused'].includes(key)) {
          stateUpdate.ui[key] = value;
        } else if (['onChange', 'onFocus', 'onBlur'].includes(key)) {
          stateUpdate.callbacks[key] = value;
        } else {
          stateUpdate.config[key] = value;
        }
      });

      // Update state
      stateManager.updateState(stateUpdate);

      // Update component with flat state
      component.update(stateManager.getFlatState());

      return api;
    },

    /**
     * Update the options of the select
     * @param {Array} options - New options array
     * @param {boolean} [keepValue=true] - Whether to try to keep the current value if it exists in new options
     * @returns {Object} Select component (for chaining)
     */
    updateOptions(options, keepValue = true) {
      if (!Array.isArray(options)) {
        throw new Error('Select: options must be an array');
      }

      // Update state
      stateManager.setOptions(options, keepValue);

      // Update component
      component.update(stateManager.getFlatState());

      return api;
    },

    /**
     * Validate the selection
     * @returns {boolean} Whether the selection is valid
     */
    validate() {
      return validate();
    },

    /**
     * Theme change handler (for withThemeAwareness HOC)
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      // Handle theme changes
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

      // Call base component's destroy
      component.destroy();
    },
  };

  return api;
};

// Enhance component with theme awareness
export default withThemeAwareness(createSelect);
