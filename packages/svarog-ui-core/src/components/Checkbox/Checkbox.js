// src/components/Checkbox/Checkbox.js
import { createComponent } from '../../utils/componentFactory.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { checkboxStyles } from './Checkbox.styles.js';

// Create style injector for Checkbox component
const injectCheckboxStyles = createStyleInjector('Checkbox');

/**
 * Factory for creating change event handlers
 * @param {Object} state - Component state
 * @param {Function} updateCallback - Function to call to update component state
 * @returns {Function} Change event handler
 * @private
 */
const createChangeHandler = (state, updateCallback) => {
  return function handleChange(event) {
    if (typeof state.onChange === 'function') {
      state.onChange(event, event.target.checked);
    }

    updateCallback({
      checked: event.target.checked,
      value: event.target.checked,
    });
  };
};

/**
 * Migrates legacy props to standardized ones
 * @param {Object} props - Input props
 * @returns {Object} Normalized props
 * @private
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  if ('value' in props && !('checked' in props)) {
    console.warn(
      '[Checkbox] value is an alias for checked, prefer using checked directly'
    );
    migrated.checked = Boolean(props.value);
    migrated.value = migrated.checked;
  }

  if ('defaultValue' in props && !('checked' in props) && !('value' in props)) {
    console.warn(
      '[Checkbox] defaultValue is an alias for checked, prefer using checked directly'
    );
    migrated.checked = Boolean(props.defaultValue);
    migrated.value = migrated.checked;
  }

  if ('isLoading' in props && !('loading' in props)) {
    console.warn('[Checkbox] isLoading is deprecated, use loading instead');
    migrated.loading = props.isLoading;
  }

  return migrated;
};

/**
 * Creates label element from string or HTMLElement
 * @param {string|HTMLElement} label - Label content
 * @returns {HTMLElement} Label element
 * @private
 */
const createLabelContent = (label) => {
  const labelEl = document.createElement('span');
  labelEl.className = 'checkbox-label';

  if (typeof label === 'string') {
    labelEl.textContent = label;
  } else if (label instanceof HTMLElement) {
    labelEl.appendChild(label.cloneNode(true));
  } else if (label && typeof label === 'object' && label.nodeType) {
    // Handle other DOM nodes (text nodes, fragments, etc.)
    labelEl.appendChild(label.cloneNode(true));
  }

  return labelEl;
};

/**
 * Creates a Checkbox component
 * @param {Object} props - Checkbox properties
 * @param {string|HTMLElement} props.label - Label text or HTML element
 * @returns {Object} Checkbox component
 */
const createCheckbox = (props) => {
  injectCheckboxStyles(checkboxStyles);

  const normalizedProps = migrateLegacyProps(props);

  const {
    label,
    id,
    name,
    checked = false,
    required = false,
    disabled = false,
    loading = false,
    className = '',
    onChange,
    validationMessage = '',
    showValidation = true,
    indeterminate = false,
  } = normalizedProps;

  const state = {
    label,
    id,
    name,
    checked,
    required,
    disabled,
    loading,
    className,
    onChange,
    validationMessage,
    showValidation,
    indeterminate,
    isValid: true,
    hasBeenValidated: false, // Track if validation has been triggered
  };

  let handleChangeRef = null;

  const validateCheckbox = () => {
    const isValid = !state.required || state.checked;
    state.isValid = isValid;
    return isValid;
  };

  const partialUpdate = (element, newProps) => {
    const input = element.querySelector('.checkbox-input');
    if (!input) return;

    if ('checked' in newProps || 'value' in newProps) {
      const newChecked =
        'checked' in newProps ? newProps.checked : newProps.value;
      input.checked = newChecked;
    }

    if ('disabled' in newProps) {
      input.disabled = newProps.disabled;
    }

    if ('loading' in newProps) {
      element.classList.toggle('checkbox-container--loading', newProps.loading);
      input.disabled = newProps.loading || state.disabled;
    }

    if ('indeterminate' in newProps) {
      setIndeterminateState(input, newProps.indeterminate);
    }

    // Update label content
    if ('label' in newProps) {
      const labelEl = element.querySelector('.checkbox-label');
      if (labelEl) {
        // Clear existing content
        labelEl.innerHTML = '';
        // Add new content
        const newLabelContent = createLabelContent(newProps.label);
        labelEl.className = newLabelContent.className;
        while (newLabelContent.firstChild) {
          labelEl.appendChild(newLabelContent.firstChild);
        }
      }
    }

    // Update validation state
    const isValid = validateCheckbox();
    element.classList.toggle(
      'checkbox-container--valid',
      state.required && isValid
    );
    element.classList.toggle(
      'checkbox-container--invalid',
      !isValid && state.hasBeenValidated
    );

    // Handle validation message visibility
    if (state.showValidation) {
      let messageEl = element.querySelector('.checkbox-validation-message');

      if (!isValid && state.required && state.hasBeenValidated) {
        // Create message element if it doesn't exist and we need to show an error
        if (!messageEl) {
          messageEl = document.createElement('div');
          messageEl.className = 'checkbox-validation-message';
          messageEl.setAttribute('aria-live', 'polite');
          element.appendChild(messageEl);
        }
        messageEl.textContent =
          state.validationMessage || 'This field is required';
      } else if (messageEl) {
        // Remove message element when valid or not yet validated
        messageEl.remove();
      }
    }

    if ('className' in newProps && state.className !== newProps.className) {
      if (state.className) {
        element.classList.remove(state.className);
      }
      if (newProps.className) {
        element.classList.add(newProps.className);
      }
    }
  };

  const setIndeterminateState = (input, isIndeterminate) => {
    setTimeout(() => {
      input.indeterminate = isIndeterminate;
    }, 0);
  };

  const buildCheckboxElement = () => {
    const isValid = validateCheckbox();

    const containerClasses = ['checkbox-container'];
    if (state.className) containerClasses.push(state.className);
    if (state.required && isValid)
      containerClasses.push('checkbox-container--valid');
    if (!isValid && state.hasBeenValidated)
      containerClasses.push('checkbox-container--invalid');
    if (state.loading) containerClasses.push('checkbox-container--loading');

    const container = document.createElement('div');
    container.className = containerClasses.join(' ');

    const wrapper = document.createElement('label');
    wrapper.className = 'checkbox-wrapper';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'checkbox-input';

    if (state.id) input.id = state.id;
    if (state.name) input.name = state.name;
    if (state.required) input.required = true;

    input.checked = state.checked;
    input.disabled = state.disabled || state.loading;

    if (!handleChangeRef) {
      handleChangeRef = createChangeHandler(state, (newProps) =>
        componentApi.update(newProps)
      );
    }

    input.addEventListener('change', handleChangeRef);
    input._listeners = { change: handleChangeRef };

    const indicator = document.createElement('span');
    indicator.className = 'checkbox-indicator';

    if (state.loading) {
      const spinner = document.createElement('span');
      spinner.className = 'checkbox-loading-spinner';
      indicator.appendChild(spinner);
    }

    // Create label element with HTML support
    const labelEl = createLabelContent(state.label);

    wrapper.appendChild(input);
    wrapper.appendChild(indicator);
    wrapper.appendChild(labelEl);
    container.appendChild(wrapper);

    // Only add validation message if currently invalid and has been validated
    if (
      state.showValidation &&
      !isValid &&
      state.required &&
      state.hasBeenValidated
    ) {
      const validationMessage = document.createElement('div');
      validationMessage.className = 'checkbox-validation-message';
      validationMessage.textContent =
        state.validationMessage || 'This field is required';
      validationMessage.setAttribute('aria-live', 'polite');
      container.appendChild(validationMessage);
    }

    if (state.indeterminate) {
      setIndeterminateState(input, true);
    }

    return container;
  };

  let element = buildCheckboxElement();

  const componentApi = {
    getElement() {
      return element;
    },

    update(newProps) {
      const normalizedProps = migrateLegacyProps(newProps);

      if ('checked' in normalizedProps && !('value' in normalizedProps)) {
        normalizedProps.value = normalizedProps.checked;
      } else if (
        'value' in normalizedProps &&
        !('checked' in normalizedProps)
      ) {
        normalizedProps.checked = normalizedProps.value;
      }

      const needsFullRebuild =
        'id' in normalizedProps ||
        'name' in normalizedProps ||
        'showValidation' in normalizedProps;

      Object.assign(state, normalizedProps);

      if (needsFullRebuild) {
        const oldElement = element;
        element = buildCheckboxElement();

        if (oldElement.parentNode) {
          oldElement.parentNode.replaceChild(element, oldElement);
        }
      } else {
        partialUpdate(element, normalizedProps);
      }

      return this;
    },

    setChecked(isChecked) {
      return this.update({ checked: isChecked, value: isChecked });
    },

    setValue(isChecked) {
      return this.setChecked(isChecked);
    },

    setIndeterminate(isIndeterminate) {
      return this.update({ indeterminate: isIndeterminate });
    },

    isChecked() {
      return state.checked;
    },

    getValue() {
      return state.checked;
    },

    validate() {
      // Mark as validated so error message can appear
      state.hasBeenValidated = true;
      const isValid = validateCheckbox();

      // Trigger visual update
      this.update({});

      return isValid;
    },

    isValid() {
      return validateCheckbox();
    },

    destroy() {
      const input = element?.querySelector('input');
      if (input && input._listeners) {
        Object.entries(input._listeners).forEach(([event, handler]) => {
          input.removeEventListener(event, handler);
        });
        input._listeners = {};
      }

      handleChangeRef = null;
      element = null;
    },
  };

  return componentApi;
};

createCheckbox.requiredProps = ['label'];

export default createComponent('Checkbox', createCheckbox);
