// src/components/Radio/Radio.styles.js
import { css } from '../../utils/styleInjection.js';

export const radioStyles = css`
  .radio-container {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--radio-margin-bottom, var(--space-2, 8px));
    position: relative;
  }

  .radio-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    user-select: none;
    padding: var(--radio-padding, var(--space-1, 4px));
  }

  /* Hide the browser's default radio */
  .radio-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    cursor: pointer;
  }

  /* Create a custom radio */
  .radio-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--radio-size, 20px);
    height: var(--radio-size, 20px);
    margin-right: var(--radio-indicator-margin, var(--space-2, 8px));
    background-color: var(--radio-bg, #ffffff);
    border: var(--radio-border, 1px solid var(--color-gray-400, #6c757d));
    border-radius: 50%;
    transition: var(--radio-transition, all 0.2s ease-in-out);
  }

  /* On radio hover, darken border */
  .radio-wrapper:hover .radio-indicator {
    border-color: var(
      --radio-hover-border-color,
      var(--color-gray-600, #495057)
    );
  }

  /* When the radio is checked, create inner circle */
  .radio-input:checked ~ .radio-indicator::after {
    content: '';
    display: block;
    width: var(--radio-inner-size, 12px);
    height: var(--radio-inner-size, 12px);
    border-radius: 50%;
    background-color: var(--radio-checked-color, var(--color-primary, #007bff));
  }

  /* When the radio is checked, style the indicator */
  .radio-input:checked ~ .radio-indicator {
    border-color: var(
      --radio-checked-border-color,
      var(--color-primary, #007bff)
    );
  }

  /* On focus, add a focus ring */
  .radio-input:focus ~ .radio-indicator {
    box-shadow: var(--radio-focus-shadow, 0 0 0 0.2rem rgba(0, 123, 255, 0.25));
  }

  /* Disabled state */
  .radio-input:disabled ~ .radio-indicator {
    background-color: var(--radio-disabled-bg, var(--color-gray-100, #e9ecef));
    border-color: var(
      --radio-disabled-border-color,
      var(--color-gray-300, #ced4da)
    );
    cursor: not-allowed;
  }

  .radio-input:disabled ~ .radio-label {
    color: var(--radio-disabled-color, var(--color-gray-400, #6c757d));
    cursor: not-allowed;
  }

  .radio-input:disabled:checked ~ .radio-indicator::after {
    background-color: var(
      --radio-disabled-checked-color,
      var(--color-gray-400, #adb5bd)
    );
  }

  /* Label styling */
  .radio-label {
    font-size: var(--radio-font-size, var(--font-size-base, 16px));
    color: var(--radio-color, var(--color-text, #212529));
    font-family: var(
      --radio-font-family,
      var(--font-family-primary, sans-serif)
    );
    line-height: 1.5;
  }

  /* Required indicator */
  .radio-input[required] ~ .radio-label:after {
    content: '*';
    color: var(--radio-required-color, var(--color-danger, #dc3545));
    margin-left: var(--space-1, 4px);
  }
`;
