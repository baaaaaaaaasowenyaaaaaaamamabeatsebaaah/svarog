// src/components/Select/Select.js
import './Select.css';
import { createElement, appendChildren } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import {
  validateInput,
  validateRequiredProps,
} from '../../utils/validation.js';
import { debounce } from '../../utils/performance.js';

/**
 * Creates a Select component with enhanced loading state and async data support
 *
 * @param {Object} props - Component configuration
 * @param {Array<Object>} [props.options=[]] - Option objects with value and label
 * @param {boolean} [props.loading=false] - Whether select is in loading state
 * @param {string} [props.loadingText='Loading options...'] - Text shown during loading
 * @param {string} [props.emptyText='No options available'] - Text shown when no options
 * @param {Function} [props.onLoadOptions] - Async function to load options
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
  // Initialize component state with validated props and enhanced defaults
  const initialState = {
    loading: false,
    loadingText: 'Loading options...',
    emptyText: 'No options available',
    onLoadOptions: null,
    value: props?.multiple ? [] : '', // Proper default for multiple
    destroyed: false,
    ...props,
  };

  validateSelectProps(initialState);

  // Use base component for standardized lifecycle
  const baseComponent = createBaseComponent((state) => {
    const { className = '' } = state;

    // Create container with data attributes
    const container = createElement('div', {
      classes: ['select-container', className],
      attributes: {
        'data-component': 'select',
        'data-loading': state.loading ? 'true' : 'false',
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

  const component = baseComponent(initialState);
  let element = component.getElement();

  // Track component state for updates
  let state = { ...initialState };

  // Cached DOM elements for better performance
  const elements = {
    nativeSelect: null,
    customSelect: null,
    dropdown: null,
    selectedDisplay: null,
    messageElement: null,
  };

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
      loading = false,
    } = state;

    const selectOptions = [];

    // Add placeholder for single select
    if (!multiple && placeholder) {
      selectOptions.push(createPlaceholderOption(placeholder, value === ''));
    }

    // Add regular options (only if not loading)
    if (!loading) {
      options.forEach((option) => {
        const isSelected = multiple
          ? Array.isArray(value) && value.includes(option.value)
          : value === option.value;

        selectOptions.push(createNativeOption(option, isSelected));
      });
    }

    const selectElement = createElement('select', {
      classes: ['select-native'],
      attributes: {
        id,
        name,
        required: required ? 'required' : null,
        multiple: multiple ? 'multiple' : null,
        disabled: disabled || loading ? 'disabled' : null,
        'aria-required': required ? 'true' : null,
        'aria-invalid': state.isValid === false ? 'true' : null,
        'aria-busy': loading ? 'true' : null,
        'data-element': 'native-select',
      },
      children: selectOptions,
    });

    return selectElement;
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
   * Enhanced display text logic that handles loading states
   * @private
   */
  function getDisplayTextAndState(state) {
    const {
      options = [],
      value = '',
      placeholder = 'Select an option',
      loading = false,
      loadingText = 'Loading options...',
      emptyText = 'No options available',
      multiple = false,
    } = state;

    // Loading state takes priority
    if (loading) {
      return {
        displayText: loadingText,
        isPlaceholderVisible: true,
        isLoading: true,
      };
    }

    // Empty options but not loading
    if (!options.length) {
      return {
        displayText: emptyText,
        isPlaceholderVisible: true,
        isEmpty: true,
      };
    }

    // Normal logic for when we have options
    if (multiple && Array.isArray(value) && value.length) {
      return {
        displayText: formatMultipleSelection(options, value),
        isPlaceholderVisible: false,
      };
    }

    if (value) {
      return {
        displayText: formatSingleSelection(options, value),
        isPlaceholderVisible: false,
      };
    }

    return {
      displayText: placeholder,
      isPlaceholderVisible: multiple
        ? !Array.isArray(value) || value.length === 0
        : !value,
    };
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
   * Enhanced custom select with loading indicator
   * @private
   */
  function createCustomSelect(state, displayData) {
    const { isValid, disabled, isOpen, multiple, loading } = state;
    const { displayText, isPlaceholderVisible, isLoading, isEmpty } =
      displayData;

    const customSelectClasses = ['select-custom'];
    if (disabled) customSelectClasses.push('select-custom--disabled');
    if (loading) customSelectClasses.push('select-custom--loading');
    if (isValid === true) customSelectClasses.push('select-custom--valid');
    if (isValid === false) customSelectClasses.push('select-custom--invalid');
    if (isOpen && !loading) customSelectClasses.push('select-custom--open');
    if (multiple) customSelectClasses.push('select-custom--multiple');

    const customSelect = createElement('div', {
      classes: customSelectClasses,
      attributes: {
        tabindex: disabled || loading ? '-1' : '0',
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-expanded': isOpen && !loading ? 'true' : 'false',
        'aria-busy': loading ? 'true' : 'false',
        'aria-live': 'polite',
        'aria-atomic': 'true',
        'data-element': 'custom-select',
      },
    });

    // Click handler that respects loading state
    customSelect.addEventListener('click', function (e) {
      if (disabled || loading) return;
      e.stopPropagation();
      toggleDropdown();
    });

    // Selected value display with loading state styling
    const selectedDisplayClasses = ['select-custom__selected'];
    if (isPlaceholderVisible || isLoading) {
      selectedDisplayClasses.push('select-custom__selected--placeholder');
    }
    if (isLoading) {
      selectedDisplayClasses.push('select-custom__selected--loading');
    }
    if (isEmpty) {
      selectedDisplayClasses.push('select-custom__selected--empty');
    }

    const selectedDisplay = createElement('div', {
      classes: selectedDisplayClasses,
      attributes: { 'data-element': 'selected-display' },
      text: displayText,
    });

    // Arrow or loading indicator
    const indicator = loading
      ? createLoadingIndicator()
      : createElement('div', { classes: ['select-custom__arrow'] });

    // Options dropdown (not shown during loading)
    const dropdown = createDropdown(state);

    appendChildren(customSelect, [selectedDisplay, indicator, dropdown]);
    return customSelect;
  }

  /**
   * Creates a loading indicator
   * @private
   */
  function createLoadingIndicator() {
    return createElement('div', {
      classes: ['select-custom__loading-indicator'],
      attributes: { 'aria-hidden': 'true' },
    });
  }

  /**
   * Enhanced dropdown that handles loading/empty states
   * @private
   */
  function createDropdown(state) {
    const {
      options = [],
      value = '',
      multiple = false,
      isOpen = false,
      loading = false,
    } = state;

    const dropdownClasses = ['select-custom__dropdown'];
    if (isOpen && !loading)
      dropdownClasses.push('select-custom__dropdown--open');

    const dropdownOptions = [];

    // Don't show options during loading
    if (!loading && options.length > 0) {
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
    }

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
    if (state.disabled || state.loading || state.destroyed)
      return state.isOpen || false;

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

    // Add/remove a class to the container to manage stacking context
    element.classList.toggle('select-open', newState);

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

      // Update loading class
      elements.selectedDisplay.classList.toggle(
        'select-custom__selected--loading',
        displayData.isLoading
      );

      // Update empty class
      elements.selectedDisplay.classList.toggle(
        'select-custom__selected--empty',
        displayData.isEmpty
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
    if (state.disabled || state.loading || state.destroyed) {
      console.warn(
        'Cannot select option on disabled, loading, or destroyed select'
      );
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
    if (state.disabled || state.loading || state.destroyed) {
      console.warn(
        'Cannot toggle option on disabled, loading, or destroyed select'
      );
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
   * Enhanced prop validation with better error messages
   * @private
   */
  function validateSelectProps(props) {
    if (!props) return;

    const requiredValidation = {
      options: {
        required: false,
        type: 'array',
        validator: (options) => {
          if (!Array.isArray(options)) return 'must be an array';

          // Validate each option structure
          for (let i = 0; i < options.length; i++) {
            const option = options[i];
            if (!option || typeof option !== 'object') {
              return `option at index ${i} must be an object`;
            }
            if (option.value === undefined) {
              return `option at index ${i} must have a value property`;
            }
          }
          return true;
        },
      },
      value: {
        required: false,
        validator: (value) => {
          if (props.multiple && value !== undefined && !Array.isArray(value)) {
            // Convert non-array values to array for multiple selects
            return true; // We'll handle the conversion in the component
          }
          return true;
        },
      },
      onChange: { required: false, type: 'function' },
      onFocus: { required: false, type: 'function' },
      onBlur: { required: false, type: 'function' },
      onLoadOptions: { required: false, type: 'function' },
    };

    return validateRequiredProps(props, requiredValidation, 'Select');
  }

  /**
   * Safe async operation wrapper
   * @private
   */
  async function safeAsyncOperation(operation, errorContext) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Select ${errorContext}:`, error);

      // Reset loading state on error
      if (state.loading) {
        api.setLoading(false);
      }

      throw error;
    }
  }

  /**
   * Enhanced accessibility setup
   * @private
   */
  function enhanceAccessibility() {
    const nativeSelect = elements.nativeSelect;
    const customSelect = elements.customSelect;

    if (nativeSelect && customSelect) {
      // Ensure proper ARIA relationship
      const selectId = nativeSelect.id || `select-${Date.now()}`;
      nativeSelect.id = selectId;
      customSelect.setAttribute('aria-labelledby', selectId);
    }
  }

  /**
   * Helper function to set up event listeners with improved performance
   * @private
   */
  function setupEventListeners() {
    // Remove old listeners first
    if (element) {
      element.removeEventListener('change', handleNativeSelectChange);
      element.removeEventListener('focus', handleNativeSelectFocus, true);
      element.removeEventListener('blur', handleNativeSelectBlur, true);
    }

    // Add new listeners
    element.addEventListener('change', handleNativeSelectChange);
    element.addEventListener('focus', handleNativeSelectFocus, true);
    element.addEventListener('blur', handleNativeSelectBlur, true);

    // Enhance accessibility after setup
    enhanceAccessibility();
  }

  // Set up initial event listeners
  setupEventListeners();

  // Document click handler to close dropdown when clicking outside
  const documentClickHandler = debounce((event) => {
    if (!state.destroyed && !element.contains(event.target) && state.isOpen) {
      toggleDropdown(false);
    }
  }, 10);

  // Store the exact same reference for cleanup
  document.addEventListener('click', documentClickHandler, { passive: true });

  /**
   * Handle native select change events with improved performance
   * @private
   */
  function handleNativeSelectChange(event) {
    if (state.disabled || state.loading || state.destroyed) return;

    const selectElement = event.target;
    if (selectElement.getAttribute('data-element') !== 'native-select') return;

    // Batch state updates
    const newState = { ...state };

    // Update value based on selection type
    if (state.multiple) {
      const selectedOptions = Array.from(selectElement.selectedOptions);
      newState.value = selectedOptions.map((opt) => opt.value);
    } else {
      newState.value = selectElement.value;
    }

    // Apply all state changes at once
    state = newState;

    // Update display directly for better performance
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
    if (state.disabled || state.loading || state.destroyed) return;

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
    if (state.disabled || state.loading || state.destroyed) return;

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
    if (state.destroyed) return true;

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

  /**
   * Check if component should re-render (optimization)
   * @private
   */
  function shouldRerender(newProps) {
    // Don't re-render if only non-visual props changed
    const nonVisualProps = ['onChange', 'onFocus', 'onBlur', 'onLoadOptions'];
    const visualPropsChanged = Object.keys(newProps).some(
      (key) => !nonVisualProps.includes(key) && newProps[key] !== state[key]
    );

    return visualPropsChanged;
  }

  // Add shouldRerender to component for optimization
  component.shouldRerender = shouldRerender;

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
      if (state.disabled || state.loading || state.destroyed) {
        console.warn(
          'Cannot set value on disabled, loading, or destroyed select'
        );
        return api;
      }

      // Convert value type if needed
      if (state.multiple) {
        // For multiple selects, only accept arrays or convert to empty array
        state.value = Array.isArray(value) ? value : [];
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
     * Set loading state
     * @param {boolean} loading - Whether select is loading
     * @param {string} [loadingText] - Optional loading text
     * @returns {Object} Select component (for chaining)
     */
    setLoading(loading, loadingText) {
      if (state.destroyed) return api;

      state.loading = !!loading;
      if (loadingText) state.loadingText = loadingText;

      // Close dropdown if loading
      if (loading) {
        toggleDropdown(false);
      }

      // Update state and trigger re-render using baseComponent
      component.update(state);
      element = component.getElement(); // Get the updated element

      // Re-cache elements and set up event listeners
      cacheElements();
      setupEventListeners();

      return api;
    },

    /**
     * Load options asynchronously with enhanced validation
     * @param {Function} [optionsFn] - Function to load options (defaults to onLoadOptions)
     * @returns {Promise<Object>} Select component (for chaining)
     */
    async loadOptions(optionsFn = state.onLoadOptions) {
      if (!optionsFn || typeof optionsFn !== 'function') {
        console.warn('loadOptions requires a function');
        return api;
      }

      // Prevent multiple simultaneous loads
      if (state.loading) {
        console.warn('loadOptions already in progress');
        return api;
      }

      if (state.destroyed) {
        console.warn('Cannot load options on destroyed select');
        return api;
      }

      return safeAsyncOperation(async () => {
        api.setLoading(true);

        const newOptions = await optionsFn();

        // Validate that we received an array
        if (!Array.isArray(newOptions)) {
          throw new Error('loadOptions function must return an array');
        }

        api.updateOptions(newOptions);
        api.setLoading(false);

        return api;
      }, 'loadOptions');
    },

    /**
     * Update multiple properties at once
     * @param {Object} newProps - New properties
     * @returns {Object} Select component (for chaining)
     */
    update(newProps) {
      if (state.destroyed) return api;

      // Validate new props
      validateSelectProps(newProps);

      // Handle multiple select value conversion if needed
      if (
        newProps.multiple &&
        newProps.value !== undefined &&
        !Array.isArray(newProps.value)
      ) {
        // For multiple selects, non-array values become empty arrays
        newProps.value = [];
      }

      // Update state
      state = { ...state, ...newProps };

      // Update state and trigger re-render using baseComponent
      component.update(state);
      element = component.getElement(); // Get the updated element

      // Re-cache elements and set up event listeners
      cacheElements();
      setupEventListeners();

      return api;
    },

    /**
     * Update the options of the select
     * @param {Array} options - New options array
     * @param {boolean} [keepValue=true] - Whether to try to keep the current value
     * @returns {Object} Select component (for chaining)
     */
    updateOptions(options, keepValue = true) {
      if (state.destroyed) return api;

      if (!Array.isArray(options)) {
        throw new Error('Select: options must be an array');
      }

      // Store old value to check if it exists in new options
      const oldValue = state.value;

      // Update options
      state.options = options;
      state.loading = false; // Clear loading when options are set

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

      // Update state and trigger re-render using baseComponent
      component.update(state);
      element = component.getElement(); // Get the updated element

      // Re-cache elements and set up event listeners
      cacheElements();
      setupEventListeners();

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
     * Enhanced cleanup with proper memory management
     */
    destroy() {
      // Mark as destroyed to prevent further operations
      state.destroyed = true;

      // Remove document event listener with the exact same reference
      document.removeEventListener('click', documentClickHandler);

      // Remove element event listeners
      if (element) {
        element.removeEventListener('change', handleNativeSelectChange);
        element.removeEventListener('focus', handleNativeSelectFocus, true);
        element.removeEventListener('blur', handleNativeSelectBlur, true);
      }

      // Clear cached elements to prevent memory leaks
      Object.keys(elements).forEach((key) => {
        elements[key] = null;
      });

      // Call base component's destroy
      component.destroy();
    },
  };

  // Handle initial value conversion for multiple selects
  if (
    state.multiple &&
    state.value !== undefined &&
    !Array.isArray(state.value)
  ) {
    // For multiple selects, invalid string values should become empty arrays
    state.value = [];
  }

  // Auto-load options if onLoadOptions is provided and no initial options
  if (
    state.onLoadOptions &&
    typeof state.onLoadOptions === 'function' &&
    (!state.options || state.options.length === 0)
  ) {
    // Call loadOptions directly using the onLoadOptions function
    api.loadOptions(state.onLoadOptions).catch(console.error);
  }

  return api;
};

// Enhance component with theme awareness
export default withThemeAwareness(createSelect);
