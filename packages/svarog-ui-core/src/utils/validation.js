// src/utils/validation.js
/**
 * Validates an input element and updates related UI
 * @param {HTMLInputElement} inputElement - Native input element to validate
 * @param {Object} options - Validation options
 * @param {HTMLElement} options.container - Container element to update classes on
 * @param {HTMLElement} options.customElement - Custom UI element to update classes on
 * @param {HTMLElement} options.messageElement - Element to display validation message
 * @param {string} options.customMessage - Custom validation message
 * @returns {boolean} Whether the input is valid
 */
export const validateInput = (inputElement, options) => {
  const {
    container,
    customElement,
    messageElement,
    customMessage = '',
  } = options;

  // Validate the input
  const isValid = inputElement.checkValidity();

  // Set data-valid attribute
  container.setAttribute('data-valid', isValid ? 'true' : 'false');

  // Update container classes
  container.classList.toggle('input-container--invalid', !isValid);
  container.classList.toggle('input-container--valid', isValid);
  container.classList.toggle('has-error', !isValid);
  container.classList.toggle('has-success', isValid);

  // Update custom element classes
  if (customElement) {
    customElement.classList.toggle('input-custom--invalid', !isValid);
    customElement.classList.toggle('input-custom--valid', isValid);
  }

  // Update validation message
  if (messageElement) {
    messageElement.textContent = !isValid
      ? customMessage || inputElement.validationMessage
      : '';
  }

  return isValid;
};

/**
 * Validates required props for a component
 * @param {Object} props - Component props
 * @param {Object} requirements - Validation requirements
 * @param {string} componentName - Component name for error messages
 * @returns {boolean} Whether the props are valid
 * @throws {Error} If a required prop is missing or invalid
 */
export const validateRequiredProps = (props, requirements, componentName) => {
  if (!componentName) {
    componentName = 'Component';
  }

  Object.entries(requirements).forEach(([propName, requirement]) => {
    // Check if prop exists
    if (
      requirement.required &&
      (props[propName] === undefined || props[propName] === null)
    ) {
      throw new Error(`${componentName}: ${propName} is required`);
    }

    // Skip type validation if prop is undefined or null and not required
    if (
      (props[propName] === undefined || props[propName] === null) &&
      !requirement.required
    ) {
      return; // Continue to next prop
    }

    // Check prop type if specified
    if (
      requirement.type &&
      props[propName] !== undefined &&
      props[propName] !== null
    ) {
      const propType = typeof props[propName];

      // Special handling for arrays
      if (requirement.type === 'array' && !Array.isArray(props[propName])) {
        throw new Error(`${componentName}: ${propName} must be an array`);
      } else if (
        requirement.type !== 'array' &&
        propType !== requirement.type
      ) {
        // Regular type checking
        throw new Error(
          `${componentName}: ${propName} must be a ${requirement.type}, got ${propType}`
        );
      }
    }

    // Skip further validation if prop is undefined/null
    if (props[propName] === undefined || props[propName] === null) {
      return;
    }

    // Check array length if specified
    if (
      requirement.type === 'array' &&
      requirement.minLength !== undefined &&
      Array.isArray(props[propName]) &&
      props[propName].length < requirement.minLength
    ) {
      throw new Error(
        `${componentName}: ${propName} array is required and must not be empty`
      );
    }

    // Check allowed values if specified
    if (
      requirement.allowedValues &&
      props[propName] !== undefined &&
      !requirement.allowedValues.includes(props[propName])
    ) {
      throw new Error(
        `${componentName}: ${propName} must be either "${requirement.allowedValues.join('" or "')}"`
      );
    }

    // Execute custom validator if specified
    if (
      requirement.validator &&
      props[propName] !== undefined &&
      typeof requirement.validator === 'function'
    ) {
      const validationResult = requirement.validator(props[propName]);
      if (validationResult !== true) {
        throw new Error(
          `${componentName}: ${propName} ${validationResult || 'is invalid'}`
        );
      }
    }
  });

  return true;
};
