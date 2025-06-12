import { css } from '../../utils/styleInjection.js';

export const formValidationStyles = css`
  /* Base validation message styles */
  .validation-message,
  .input-validation-message,
  .select-validation-message,
  .radio-group__validation-message,
  .form-group__validation-message {
    /* When empty, take up ZERO space */
    height: 0;
    padding: 0;
    margin: 0;
    border: none;
    font-size: var(--validation-font-size, var(--font-size-xs));
    color: var(--validation-color, var(--color-danger-light));
    line-height: 1.5;
    transition: all 0.2s ease;
    max-height: 0;
    opacity: 0;
    display: none;
    overflow: hidden;
    visibility: hidden; /* Hide it completely when empty */
  }

  /* When not empty, show the validation message */
  .validation-message:not(:empty),
  .input-validation-message:not(:empty),
  .select-validation-message:not(:empty),
  .radio-group__validation-message:not(:empty),
  .form-group__validation-message:not(:empty) {
    height: auto;
    max-height: 3rem;
    opacity: 1;
    margin-top: var(--validation-margin-top, var(--space-1));
    visibility: visible;
    padding-bottom: 2px; /* Small padding to prevent text clipping */
    display: block; /* Show the message */
  }

  /* Different validation states */
  .has-error .validation-message,
  .has-error .input-validation-message,
  .has-error .select-validation-message,
  .has-error .radio-group__validation-message,
  .has-error .form-group__validation-message,
  .input-container--invalid .input-validation-message,
  .select-container--invalid .select-validation-message,
  .radio-group--invalid .radio-group__validation-message {
    color: var(--validation-error-color, var(--color-danger-light));
  }

  .has-success .validation-message,
  .has-success .input-validation-message,
  .has-success .select-validation-message,
  .has-success .radio-group__validation-message,
  .has-success .form-group__validation-message,
  .input-container--valid .input-validation-message,
  .select-container--valid .select-validation-message,
  .radio-group--valid .radio-group__validation-message {
    color: var(--validation-success-color, var(--color-successlight));
  }
`;
