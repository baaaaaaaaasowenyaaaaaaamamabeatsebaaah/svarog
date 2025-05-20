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
