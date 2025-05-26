// src/components/Select/Select.js
import { createElement, appendChildren } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import {
  validateInput,
  validateRequiredProps,
} from '../../utils/validation.js';
import { debounce } from '../../utils/performance.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { selectStyles } from './Select.styles.js';

// Create style injector for Select component
const injectSelectStyles = createStyleInjector('Select');

// Debug helper
const debugLog = (message, data = null) => {
  if (
    typeof window !== 'undefined' &&
    window.localStorage?.getItem('svarog-debug') === 'true'
  ) {
    if (data) {
      console.log(`[Select] ${message}`, data);
    } else {
      console.log(`[Select] ${message}`);
    }
  }
};

/**
 * Creates a Select component with enhanced loading state and async data support
 * @param {Object} props - Component configuration
 * @returns {Object} Select component API
 */
const createSelect = (props = {}) => {
  // Inject styles on first render
  injectSelectStyles(selectStyles);

  debugLog('createSelect called', {
    propsKeys: Object.keys(props),
    disabled: props.disabled,
    loading: props.loading,
    optionsCount: props.options?.length,
  });

  // Migrate legacy props
  const migratedProps = migrateLegacyProps(props);

  // Initialize state
  const state = {
    options: [],
    loading: false,
    loadingText: 'Loading options...',
    emptyText: 'No options available',
    onLoadOptions: null,
    value: migratedProps?.multiple ? [] : '',
    placeholder: 'Select an option',
    required: false,
    disabled: false,
    multiple: false,
    className: '',
    onChange: null,
    onFocus: null,
    onBlur: null,
    validationMessage: '',
    showValidation: true,
    destroyed: false,
    isOpen: false,
    isValid: null,
    ...migratedProps,
  };

  debugLog('Initial state', {
    disabled: state.disabled,
    loading: state.loading,
    optionsCount: state.options.length,
  });

  validateSelectProps(state);

  // Handle multiple select value conversion
  if (
    state.multiple &&
    state.value !== undefined &&
    !Array.isArray(state.value)
  ) {
    state.value = [];
  }

  // Create DOM structure - this happens once
  const container = createContainer();
  const nativeSelect = container.querySelector('.select-native');
  const customSelect = container.querySelector('.select-custom');
  const dropdown = container.querySelector('.select-custom__dropdown');
  const selectedDisplay = container.querySelector('.select-custom__selected');
  const messageElement = container.querySelector('.select-validation-message');

  // Initialize with current state
  updateNativeOptions();
  updateDropdownOptions();
  updateDisplayText();
  updateValidationState();
  updateDisabledState();

  // Event handlers
  setupEventListeners();

  // Document click handler for closing dropdown
  const documentClickHandler = debounce((event) => {
    if (!state.destroyed && !container.contains(event.target) && state.isOpen) {
      toggleDropdown(false);
    }
  }, 10);

  document.addEventListener('click', documentClickHandler, { passive: true });

  // DOM CREATION (called once)
  function createContainer() {
    debugLog('Creating container DOM structure');

    const containerEl = createElement('div', {
      classes: ['select-container', state.className],
      attributes: {
        'data-component': 'select',
        'data-loading': state.loading ? 'true' : 'false',
        'data-disabled': state.disabled ? 'true' : 'false',
      },
    });

    const nativeSelectEl = createElement('select', {
      classes: ['select-native'],
      attributes: {
        id: state.id,
        name: state.name,
        'data-element': 'native-select',
      },
    });

    // Determine custom select classes based on initial state
    const customSelectClasses = ['select-custom'];
    if (state.disabled) customSelectClasses.push('select-custom--disabled');
    if (state.loading) customSelectClasses.push('select-custom--loading');
    if (state.multiple) customSelectClasses.push('select-custom--multiple');

    const customSelectEl = createElement('div', {
      classes: customSelectClasses,
      attributes: {
        tabindex: state.disabled || state.loading ? '-1' : '0',
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-expanded': 'false',
        'aria-busy': state.loading ? 'true' : 'false',
        'aria-disabled': state.disabled ? 'true' : 'false',
        'data-element': 'custom-select',
      },
    });

    const selectedDisplayEl = createElement('div', {
      classes: ['select-custom__selected'],
      attributes: { 'data-element': 'selected-display' },
    });

    // Create arrow or loading indicator based on initial state
    const indicatorEl = state.loading
      ? createElement('div', {
          classes: ['select-custom__loading-indicator'],
          attributes: { 'aria-hidden': 'true' },
        })
      : createElement('div', {
          classes: ['select-custom__arrow'],
        });

    const dropdownEl = createElement('div', {
      classes: ['select-custom__dropdown'],
      attributes: {
        role: 'listbox',
        'aria-multiselectable': state.multiple ? 'true' : 'false',
        'data-element': 'dropdown',
      },
    });

    const messageEl = createElement('div', {
      classes: ['select-validation-message'],
      attributes: { 'aria-live': 'polite' },
      style: { display: state.showValidation ? 'block' : 'none' },
    });

    appendChildren(customSelectEl, [
      selectedDisplayEl,
      indicatorEl,
      dropdownEl,
    ]);
    appendChildren(containerEl, [nativeSelectEl, customSelectEl, messageEl]);

    return containerEl;
  }

  // STATE UPDATE METHODS (efficient, targeted updates)
  function updateNativeOptions() {
    debugLog('updateNativeOptions called', {
      optionsCount: state.options.length,
      loading: state.loading,
      disabled: state.disabled,
    });

    nativeSelect.innerHTML = '';

    // Add placeholder for single select
    if (!state.multiple && state.placeholder) {
      const placeholderOption = createElement('option', {
        attributes: { value: '', disabled: true, selected: state.value === '' },
        text: state.placeholder,
      });
      nativeSelect.appendChild(placeholderOption);
    }

    // Add options (only if not loading)
    if (!state.loading) {
      state.options.forEach((option) => {
        const isSelected = state.multiple
          ? Array.isArray(state.value) && state.value.includes(option.value)
          : state.value === option.value;

        const optionEl = createElement('option', {
          attributes: {
            value: option.value,
            disabled: !!option.disabled,
            selected: isSelected,
          },
          text: option.label || option.value,
        });
        nativeSelect.appendChild(optionEl);
      });
    }

    // Update native select attributes
    nativeSelect.disabled = state.disabled || state.loading;
    nativeSelect.required = state.required;
    if (state.multiple) nativeSelect.multiple = true;
  }

  function updateDropdownOptions() {
    debugLog('updateDropdownOptions called', {
      optionsCount: state.options.length,
      loading: state.loading,
    });

    dropdown.innerHTML = '';

    if (state.loading || state.options.length === 0) return;

    state.options.forEach((option) => {
      if (isGroupHeader(option)) {
        const groupHeader = createElement('div', {
          classes: ['select-custom__group-header'],
          text: option.label,
        });
        dropdown.appendChild(groupHeader);
        return;
      }

      const isSelected = state.multiple
        ? Array.isArray(state.value) && state.value.includes(option.value)
        : state.value === option.value;

      const optionClasses = ['select-custom__option'];
      if (option.disabled)
        optionClasses.push('select-custom__option--disabled');
      if (isSelected) optionClasses.push('select-custom__option--selected');

      const optionEl = createElement('div', {
        classes: optionClasses,
        attributes: {
          'data-value': option.value,
          role: 'option',
          'aria-selected': isSelected ? 'true' : 'false',
          tabindex: option.disabled ? '-1' : '0',
        },
        text: option.label || option.value,
      });

      // Add checkbox for multiple
      if (state.multiple) {
        const checkbox = createElement('span', {
          classes: [
            'select-custom__checkbox',
            isSelected ? 'select-custom__checkbox--checked' : '',
          ].filter(Boolean),
        });
        optionEl.insertBefore(checkbox, optionEl.firstChild);
      }

      // Click handler
      optionEl.addEventListener('click', (e) => {
        if (option.disabled || state.disabled) return;
        e.preventDefault();
        e.stopPropagation();

        if (state.multiple) {
          toggleOptionSelection(option.value);
        } else {
          selectOption(option.value);
          toggleDropdown(false);
        }
      });

      dropdown.appendChild(optionEl);
    });
  }

  function updateDisplayText() {
    const { displayText, classes } = getDisplayTextAndClasses();
    selectedDisplay.textContent = displayText;
    selectedDisplay.className = classes.join(' ');
  }

  function updateLoadingState() {
    debugLog('updateLoadingState called', { loading: state.loading });

    container.setAttribute('data-loading', state.loading ? 'true' : 'false');

    // Toggle loading indicator
    const arrow = customSelect.querySelector('.select-custom__arrow');
    const loadingIndicator = customSelect.querySelector(
      '.select-custom__loading-indicator'
    );

    if (state.loading) {
      if (arrow) arrow.style.display = 'none';
      if (!loadingIndicator) {
        const indicator = createElement('div', {
          classes: ['select-custom__loading-indicator'],
          attributes: { 'aria-hidden': 'true' },
        });
        customSelect.appendChild(indicator);
      }
    } else {
      if (arrow) arrow.style.display = '';
      if (loadingIndicator) loadingIndicator.remove();
    }

    // Update custom select classes
    customSelect.classList.toggle('select-custom--loading', state.loading);
    customSelect.setAttribute('aria-busy', state.loading ? 'true' : 'false');
    customSelect.tabIndex = state.disabled || state.loading ? -1 : 0;
  }

  function updateValidationState() {
    const isValid = state.isValid;

    container.setAttribute(
      'data-valid',
      isValid === true ? 'true' : isValid === false ? 'false' : ''
    );

    customSelect.classList.toggle('select-custom--valid', isValid === true);
    customSelect.classList.toggle('select-custom--invalid', isValid === false);

    messageElement.textContent =
      isValid === false ? state.validationMessage : '';
    messageElement.style.display = state.showValidation ? 'block' : 'none';
  }

  function updateDisabledState() {
    debugLog('updateDisabledState called', { disabled: state.disabled });

    // Update container data attribute
    container.setAttribute('data-disabled', state.disabled ? 'true' : 'false');

    // Update custom select classes and attributes
    customSelect.classList.toggle('select-custom--disabled', state.disabled);
    customSelect.setAttribute(
      'aria-disabled',
      state.disabled ? 'true' : 'false'
    );
    customSelect.tabIndex = state.disabled || state.loading ? -1 : 0;
  }

  // HELPER FUNCTIONS
  function getDisplayTextAndClasses() {
    const classes = ['select-custom__selected'];

    if (state.loading) {
      classes.push('select-custom__selected--loading');
      return { displayText: state.loadingText, classes };
    }

    if (state.options.length === 0) {
      classes.push('select-custom__selected--empty');
      return { displayText: state.emptyText, classes };
    }

    if (state.multiple && Array.isArray(state.value) && state.value.length) {
      const selectedLabels = state.value.map((val) => {
        const option = state.options.find((opt) => opt.value === val);
        return option ? option.label || option.value : val;
      });

      const displayText =
        selectedLabels.length <= 2
          ? selectedLabels.join(', ')
          : `${selectedLabels.length} items selected`;

      return { displayText, classes };
    }

    if (state.value) {
      const selectedOption = state.options.find(
        (opt) => opt.value === state.value
      );
      const displayText = selectedOption
        ? selectedOption.label || selectedOption.value
        : state.value;
      return { displayText, classes };
    }

    classes.push('select-custom__selected--placeholder');
    return { displayText: state.placeholder, classes };
  }

  function isGroupHeader(option) {
    return (
      !!option.disabled &&
      option.label &&
      (!option.value || option.value === option.label)
    );
  }

  function toggleDropdown(force) {
    if (state.disabled || state.loading || state.destroyed) return false;

    const newState = typeof force === 'boolean' ? force : !state.isOpen;
    state.isOpen = newState;

    customSelect.classList.toggle('select-custom--open', newState);
    customSelect.setAttribute('aria-expanded', newState ? 'true' : 'false');
    dropdown.classList.toggle('select-custom__dropdown--open', newState);
    container.classList.toggle('select-open', newState);

    return newState;
  }

  function selectOption(value) {
    if (state.disabled || state.loading || state.destroyed) return;

    state.value = value;
    nativeSelect.value = value;

    updateDropdownOptions(); // Update selected states
    updateDisplayText();

    const changeEvent = new Event('change', { bubbles: true });
    nativeSelect.dispatchEvent(changeEvent);
  }

  function toggleOptionSelection(value) {
    if (state.disabled || state.loading || state.destroyed) return;
    if (!state.multiple) return;

    const currentValues = Array.isArray(state.value) ? [...state.value] : [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    state.value = newValues;

    // Update native select
    Array.from(nativeSelect.options).forEach((option) => {
      option.selected = newValues.includes(option.value);
    });

    updateDropdownOptions(); // Update selected states
    updateDisplayText();

    const changeEvent = new Event('change', { bubbles: true });
    nativeSelect.dispatchEvent(changeEvent);
  }

  function setupEventListeners() {
    // Custom select click
    customSelect.addEventListener('click', (e) => {
      if (state.disabled || state.loading) return;
      e.stopPropagation();
      toggleDropdown();
    });

    // Native select events
    nativeSelect.addEventListener('change', (e) => {
      if (state.disabled || state.loading || state.destroyed) return;

      if (state.multiple) {
        const selectedOptions = Array.from(e.target.selectedOptions);
        state.value = selectedOptions.map((opt) => opt.value);
      } else {
        state.value = e.target.value;
      }

      updateDropdownOptions();
      updateDisplayText();

      if (state.showValidation && state.isValid !== null) {
        validate();
      }

      if (typeof state.onChange === 'function') {
        state.onChange(e, getValue());
      }
    });

    nativeSelect.addEventListener('focus', (e) => {
      if (state.disabled || state.loading || state.destroyed) return;

      container.classList.add('select-container--focused');
      customSelect.classList.add('select-custom--focused');

      if (typeof state.onFocus === 'function') {
        state.onFocus(e);
      }
    });

    nativeSelect.addEventListener('blur', (e) => {
      if (state.disabled || state.loading || state.destroyed) return;

      if (!customSelect.contains(e.relatedTarget)) {
        container.classList.remove('select-container--focused');
        customSelect.classList.remove('select-custom--focused');

        if (state.showValidation && state.isValid !== null) {
          validate();
        }

        if (typeof state.onBlur === 'function') {
          state.onBlur(e);
        }
      }
    });
  }

  function validateSelectProps(props) {
    const requirements = {
      options: {
        required: false,
        type: 'array',
        validator: (options) => {
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
      onChange: { required: false, type: 'function' },
      onFocus: { required: false, type: 'function' },
      onBlur: { required: false, type: 'function' },
      onLoadOptions: { required: false, type: 'function' },
    };

    return validateRequiredProps(props, requirements, 'Select');
  }

  async function safeAsyncOperation(operation, errorContext) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Select ${errorContext}:`, error);
      if (state.loading) {
        api.setLoading(false);
      }
      throw error;
    }
  }

  function validate() {
    if (state.destroyed) return true;

    let isValid = true;
    if (state.required) {
      isValid = state.multiple
        ? Array.isArray(state.value) && state.value.length > 0
        : !!state.value;
    }

    state.isValid = isValid;

    validateInput(nativeSelect, {
      container,
      customElement: customSelect,
      messageElement,
      customMessage: state.validationMessage,
    });

    updateValidationState();
    return isValid;
  }

  function getValue() {
    return state.value;
  }

  /**
   * Migrate legacy props to standardized prop names
   * @param {Object} props - Original props
   * @returns {Object} - Migrated props object
   */
  function migrateLegacyProps(props) {
    const migrated = { ...props };

    // Support defaultValue as alias for value (when value is not specified)
    if ('defaultValue' in migrated && !('value' in migrated)) {
      migrated.value = migrated.defaultValue;
    }

    // Add other prop migrations as needed based on standardization guide

    return migrated;
  }

  // API
  const api = {
    getElement: () => container,
    getValue,

    setValue(value) {
      if (state.disabled || state.loading || state.destroyed) {
        console.warn(
          'Cannot set value on disabled, loading, or destroyed select'
        );
        return api;
      }

      if (state.multiple) {
        state.value = Array.isArray(value) ? value : [];
      } else {
        state.value = Array.isArray(value) ? value[0] || '' : value || '';
      }

      // Update native select
      if (state.multiple) {
        Array.from(nativeSelect.options).forEach((option) => {
          option.selected = state.value.includes(option.value);
        });
      } else {
        nativeSelect.value = state.value;
      }

      updateDropdownOptions();
      updateDisplayText();

      if (state.showValidation && state.isValid !== null) {
        validate();
      }

      return api;
    },

    setLoading(loading, loadingText) {
      if (state.destroyed) return api;

      state.loading = !!loading;
      if (loadingText) state.loadingText = loadingText;

      if (loading) toggleDropdown(false);

      updateLoadingState();
      updateNativeOptions();
      updateDropdownOptions();
      updateDisplayText();

      return api;
    },

    async loadOptions(optionsFn = state.onLoadOptions) {
      if (!optionsFn || typeof optionsFn !== 'function') {
        console.warn('loadOptions requires a function');
        return api;
      }

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

        if (!Array.isArray(newOptions)) {
          throw new Error('loadOptions function must return an array');
        }

        api.updateOptions(newOptions);
        api.setLoading(false);
        return api;
      }, 'loadOptions');
    },

    update(newProps) {
      if (state.destroyed) return api;

      debugLog('update called', {
        propsKeys: Object.keys(newProps),
        disabled: newProps.disabled,
        loading: newProps.loading,
      });

      // Migrate legacy props
      const migratedProps = migrateLegacyProps(newProps);

      validateSelectProps(migratedProps);

      // Handle multiple select value conversion
      if (
        migratedProps.multiple &&
        migratedProps.value !== undefined &&
        !Array.isArray(migratedProps.value)
      ) {
        migratedProps.value = [];
      }

      Object.assign(state, migratedProps);

      // Update all relevant UI
      updateNativeOptions();
      updateDropdownOptions();
      updateDisplayText();
      updateLoadingState();
      updateValidationState();
      updateDisabledState();

      return api;
    },

    updateOptions(options, keepValue = true) {
      if (state.destroyed) return api;
      if (!Array.isArray(options)) {
        throw new Error('Select: options must be an array');
      }

      const oldValue = state.value;
      state.options = options;
      state.loading = false;

      if (keepValue) {
        if (state.multiple && Array.isArray(oldValue)) {
          state.value = oldValue.filter((val) =>
            options.some((opt) => opt.value === val)
          );
        } else if (!state.multiple && oldValue) {
          if (!options.some((opt) => opt.value === oldValue)) {
            state.value = '';
          }
        }
      } else {
        state.value = state.multiple ? [] : '';
      }

      updateNativeOptions();
      updateDropdownOptions();
      updateDisplayText();
      updateLoadingState();

      return api;
    },

    validate,

    onThemeChange(theme, previousTheme) {
      console.log(
        `Select component theme changed: ${previousTheme} -> ${theme}`
      );
    },

    destroy() {
      state.destroyed = true;
      document.removeEventListener('click', documentClickHandler);

      // Clean up event listeners
      if (container && container._listeners) {
        Object.entries(container._listeners).forEach(([event, handler]) => {
          container.removeEventListener(event, handler);
        });
      }
    },
  };

  // Auto-load options if onLoadOptions is provided and no initial options
  if (
    state.onLoadOptions &&
    typeof state.onLoadOptions === 'function' &&
    (!state.options || state.options.length === 0)
  ) {
    api.loadOptions(state.onLoadOptions).catch(console.error);
  }

  debugLog('Select component created successfully');
  return api;
};

export default withThemeAwareness(createSelect);
