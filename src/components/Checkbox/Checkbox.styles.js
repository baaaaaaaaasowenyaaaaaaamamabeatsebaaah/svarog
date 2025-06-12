// src/components/Checkbox/Checkbox.styles.js
import { css } from '../../utils/styleInjection.js';

export const checkboxStyles = css`
  .checkbox-container {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--checkbox-margin-bottom);
    position: relative;
  }

  .checkbox-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    user-select: none;
    padding: var(--checkbox-padding);
  }

  /* Hide the browser's default checkbox */
  .checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    cursor: pointer;
  }

  /* Create a custom checkbox */
  .checkbox-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    margin-right: var(--checkbox-indicator-margin);
    background-color: var(--checkbox-bg);
    border: var(--checkbox-border);
    border-radius: var(--checkbox-radius);
    transition: var(--checkbox-transition);
    position: relative;
  }

  /* On checkbox hover, darken border */
  .checkbox-wrapper:hover .checkbox-indicator {
    border-color: var(--checkbox-hover-border-color);
  }

  /* When the checkbox is checked, add a checkmark */
  .checkbox-input:checked ~ .checkbox-indicator {
    background-color: var(--checkbox-checked-bg);
    border-color: var(--checkbox-checked-border-color);
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkbox-indicator:after {
    content: '';
    display: none;
    width: var(--checkbox-indicator-width);
    height: var(--checkbox-indicator-height);
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    position: relative;
    top: -1px;
  }

  /* Show the checkmark when checked */
  .checkbox-input:checked ~ .checkbox-indicator:after {
    display: block;
  }

  /* On focus, add a focus ring */
  .checkbox-input:focus ~ .checkbox-indicator {
    box-shadow: var(--checkbox-focus-shadow);
  }

  /* Disabled state */
  .checkbox-input:disabled ~ .checkbox-indicator {
    background-color: var(--checkbox-disabled-bg);
    border-color: var(--checkbox-disabled-border-color);
    cursor: not-allowed;
  }

  .checkbox-input:disabled ~ .checkbox-label {
    color: var(--checkbox-disabled-color);
    cursor: not-allowed;
  }

  /* Disabled AND checked state - should show checkmark */
  .checkbox-input:disabled:checked ~ .checkbox-indicator {
    background-color: var(
      --checkbox-disabled-checked-bg,
      var(--checkbox-checked-bg)
    );
    border-color: var(
      --checkbox-disabled-checked-border-color,
      var(--checkbox-checked-border-color)
    );
    opacity: 0.6; /* Makes it look disabled while still showing it's checked */
  }

  /* Ensure checkmark shows for disabled checked state */
  .checkbox-input:disabled:checked ~ .checkbox-indicator:after {
    display: block;
    opacity: 0.8; /* Slightly faded checkmark for disabled state */
  }

  /* Loading state */
  .checkbox-container--loading .checkbox-wrapper {
    cursor: wait;
  }

  .checkbox-container--loading .checkbox-indicator {
    background-color: var(--checkbox-loading-bg, var(--checkbox-disabled-bg));
    border-color: var(
      --checkbox-loading-border-color,
      var(--checkbox-disabled-border-color)
    );
  }

  .checkbox-container--loading .checkbox-label {
    color: var(--checkbox-loading-color, var(--checkbox-disabled-color));
  }

  /* Loading spinner */
  .checkbox-loading-spinner {
    width: 60%;
    height: 60%;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(
      --checkbox-loading-spinner-color,
      var(--checkbox-checked-bg)
    );
    border-radius: 50%;
    animation: checkbox-spinner 0.8s linear infinite;
    position: absolute;
  }

  @keyframes checkbox-spinner {
    to {
      transform: rotate(360deg);
    }
  }

  /* Label styling */
  .checkbox-label {
    font-size: var(--checkbox-font-size);
    color: var(--checkbox-color);
    font-family: var(--checkbox-font-family);
    line-height: 1.5;
  }

  /* Links within labels */
  .checkbox-label a {
    color: inherit;
    text-decoration: underline;
  }

  .checkbox-label a:hover {
    opacity: 0.8;
  }

  /* Validation states */
  .checkbox-container--valid .checkbox-indicator {
    border-color: var(--checkbox-valid-border-color);
  }

  .checkbox-container--invalid .checkbox-indicator {
    border-color: var(--checkbox-invalid-border-color);
  }

  /* Validation message with slide-in animation */
  .checkbox-validation-message {
    font-size: var(--checkbox-validation-font-size);
    margin-top: var(--space-1);
    color: var(--checkbox-validation-color);
    animation: checkbox-error-slide-in 0.2s ease-out;
  }

  @keyframes checkbox-error-slide-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .checkbox-container--valid .checkbox-validation-message {
    color: var(--checkbox-valid-color);
  }

  /* Required indicator */
  .checkbox-input[required] ~ .checkbox-label:after {
    content: '*';
    color: var(--checkbox-required-color);
    margin-left: var(--space-1);
  }

  /* Indeterminate state (set via JavaScript) */
  .checkbox-input:indeterminate ~ .checkbox-indicator {
    background-color: var(--checkbox-indeterminate-bg);
    border-color: var(--checkbox-indeterminate-border-color);
  }

  .checkbox-input:indeterminate ~ .checkbox-indicator:after {
    display: block;
    width: var(--checkbox-indeterminate-width);
    height: var(--checkbox-indeterminate-height);
    border: none;
    background-color: white;
    transform: none;
    position: relative;
    top: 0;
  }

  /* When both loading and disabled */
  .checkbox-container--loading .checkbox-input:disabled ~ .checkbox-indicator {
    opacity: 0.7;
  }

  /* Loading AND checked state */
  .checkbox-container--loading .checkbox-input:checked ~ .checkbox-indicator {
    background-color: var(
      --checkbox-loading-checked-bg,
      var(--checkbox-checked-bg)
    );
    border-color: var(
      --checkbox-loading-checked-border-color,
      var(--checkbox-checked-border-color)
    );
  }

  /* Hide checkmark when loading to show spinner instead */
  .checkbox-container--loading
    .checkbox-input:checked
    ~ .checkbox-indicator:after {
    display: none;
  }

  /* Show spinner when loading and checked */
  .checkbox-container--loading
    .checkbox-input:checked
    ~ .checkbox-indicator
    .checkbox-loading-spinner {
    display: block;
  }
`;
