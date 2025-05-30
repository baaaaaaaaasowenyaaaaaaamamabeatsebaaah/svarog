// src/components/Button/Button.styles.js
import { css } from '../../utils/styleInjection.js';

export const buttonStyles = css`
  .btn {
    /* Reset browser defaults */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: var(--button-border, 1px solid #ccc);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    /* Base styles with fallbacks */
    padding: var(--button-padding, 8px 16px);
    font-size: var(--button-font-size, 16px);
    font-family: var(--button-font-family, inherit);
    font-weight: var(--button-font-weight, 500);
    color: var(--button-color, #333);
    background-color: var(--button-bg, #e0e0e0);
    border-radius: var(--button-radius, 4px);
    transition: var(--button-transition, all 0.2s ease);
    line-height: 1.5;
    text-align: center;
    text-decoration: none;
    box-shadow: var(--button-shadow, none);
  }

  /* States with fallbacks */
  .btn:hover:not(:disabled) {
    background-color: var(--button-hover-bg, #d0d0d0);
    border-color: var(--button-hover-border-color, transparent);
    box-shadow: var(--button-hover-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
    color: var(--button-hover-color, #333);
    transform: translateY(var(--button-hover-transform, 0));
  }

  .btn:active:not(:disabled) {
    background-color: var(--button-active-bg, #c0c0c0);
    border-color: var(--button-active-border-color, transparent);
    box-shadow: var(--button-active-shadow, inset 0 2px 4px rgba(0, 0, 0, 0.1));
    transform: var(--button-active-transform, translateY(1px));
  }

  .btn:focus {
    outline: none;
    box-shadow: var(--button-focus-shadow, 0 0 0 3px rgba(66, 153, 225, 0.5));
  }

  .btn:disabled {
    background-color: var(--button-disabled-bg, #f5f5f5);
    border-color: var(--button-disabled-border-color, transparent);
    cursor: not-allowed;
    opacity: var(--button-disabled-opacity, 0.6);
    color: var(--button-disabled-color, #999);
    box-shadow: none;
  }

  /* Size variants with fallbacks */
  .btn--sm {
    padding: var(--button-padding-sm, 4px 8px);
    font-size: var(--button-font-size-sm, 14px);
    border-radius: var(--button-radius-sm, 4px);
  }

  .btn--lg {
    padding: var(--button-padding-lg, 12px 24px);
    font-size: var(--button-font-size-lg, 18px);
    border-radius: var(--button-radius-lg, 6px);
  }

  /* Variants with fallbacks */
  .btn--primary {
    background-color: var(--button-primary-bg, #007bff);
    color: var(--button-primary-color, white);
    border-color: var(--button-primary-border-color, transparent);
  }

  .btn--primary:hover:not(:disabled) {
    background-color: var(--button-primary-hover-bg, #0056b3);
    border-color: var(--button-primary-hover-border-color, transparent);
    color: var(--button-primary-hover-color, white);
  }

  .btn--primary:active:not(:disabled) {
    background-color: var(--button-primary-active-bg, #004085);
    border-color: var(--button-primary-active-border-color, transparent);
  }

  .btn--secondary {
    background-color: var(--button-secondary-bg, #6c757d);
    color: var(--button-secondary-color, white);
    border-color: var(--button-secondary-border-color, transparent);
  }

  .btn--secondary:hover:not(:disabled) {
    background-color: var(--button-secondary-hover-bg, #545b62);
    border-color: var(--button-secondary-hover-border-color, transparent);
    color: var(--button-secondary-hover-color, white);
  }

  .btn--secondary:active:not(:disabled) {
    background-color: var(--button-secondary-active-bg, #3d4349);
    border-color: var(--button-secondary-active-border-color, transparent);
  }

  .btn--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--button-text-color, #007bff);
    padding: var(--button-text-padding, 4px 8px);
    box-shadow: none;
  }

  .btn--text:hover:not(:disabled) {
    background-color: transparent;
    border-color: transparent;
    text-decoration: underline;
    color: var(--button-text-hover-color, #0056b3);
    box-shadow: none;
  }

  .btn--text:active:not(:disabled) {
    transform: none;
  }

  /* Additional variants with fallbacks */
  .btn--success {
    background-color: var(--button-success-bg, #28a745);
    color: var(--button-success-color, white);
    border-color: var(--button-success-border-color, transparent);
  }

  .btn--success:hover:not(:disabled) {
    background-color: var(--button-success-hover-bg, #218838);
    border-color: var(--button-success-hover-border-color, transparent);
    color: var(--button-success-hover-color, white);
  }

  .btn--danger {
    background-color: var(--button-danger-bg, #dc3545);
    color: var(--button-danger-color, white);
    border-color: var(--button-danger-border-color, transparent);
  }

  .btn--danger:hover:not(:disabled) {
    background-color: var(--button-danger-hover-bg, #c82333);
    border-color: var(--button-danger-hover-border-color, transparent);
    color: var(--button-danger-hover-color, white);
  }

  .btn--outlined {
    background-color: transparent;
    color: var(--button-outlined-color, #007bff);
    border-color: var(--button-outlined-border-color, currentColor);
  }

  .btn--outlined:hover:not(:disabled) {
    background-color: var(--button-outlined-hover-bg, rgba(0, 123, 255, 0.1));
    color: var(--button-outlined-hover-color, #0056b3);
    border-color: var(--button-outlined-hover-border-color, currentColor);
  }

  /* Icon buttons with fallbacks */
  .btn--icon {
    font-size: var(--button-icon-size, 19px);
    padding: var(--button-icon-padding, 8px);
    border-radius: var(--button-icon-radius, 50%);
  }

  .btn--icon.btn--sm {
    font-size: var(--button-icon-size-sm, 16px);
    padding: var(--button-icon-padding, 4px);
  }

  .btn--icon.btn--lg {
    padding: var(--button-icon-padding, 12px);
  }

  /* Button with icon */
  .btn__icon {
    margin-right: var(--button-icon-margin, 8px);
  }

  .btn--icon .btn__icon {
    margin-right: 0;
  }

  .btn__icon--right {
    margin-right: 0;
    margin-left: var(--button-icon-margin, 8px);
  }

  /* Button with icon positioning improvements */
  .btn--icon-right {
    flex-direction: row-reverse;
  }

  .btn--icon-right .btn__icon {
    margin-right: 0;
    margin-left: var(--button-icon-margin, 8px);
  }

  /* Accessibility focus styles with fallback */
  .btn:focus-visible {
    outline: 2px solid var(--button-focus-outline-color, #4299e1);
    outline-offset: 2px;
  }

  /* Loading state styling */
  .btn[aria-busy='true'] {
    position: relative;
    pointer-events: none;
    color: transparent !important;
  }

  .btn[aria-busy='true']::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: button-loading-spinner 0.75s infinite linear;
  }

  @keyframes button-loading-spinner {
    to {
      transform: rotate(360deg);
    }
  }

  /* Pressed state */
  .btn[aria-pressed='true'] {
    background-color: var(--button-active-bg, #c0c0c0);
    border-color: var(--button-active-border-color, transparent);
    box-shadow: var(--button-active-shadow, inset 0 2px 4px rgba(0, 0, 0, 0.1));
    transform: var(--button-active-transform, translateY(1px));
  }
`;
