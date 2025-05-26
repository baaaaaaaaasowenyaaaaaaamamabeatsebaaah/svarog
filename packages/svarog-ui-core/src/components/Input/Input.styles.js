import { css } from '../../utils/styleInjection.js';

export const inputStyles = css`
  /**
   * Input component styles - Enhanced with custom UI
   */

  /* Container styles */
  .input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--input-margin-bottom);
    position: relative;
    width: 100%;
  }

  /* Input wrapper */
  .input-wrapper {
    position: relative;
    width: 100%;
  }

  /* Native input - accessible but visually hidden */
  .input-native {
    position: absolute;
    top: 0;
    /* Reduce width to not cover controls on right side */
    width: calc(100% - 30px);
    height: 100%;
    opacity: 0;
    z-index: 1;
    cursor: text;
    /* Important to still make it work with screen readers */
    font-size: 16px;
  }

  /* Make sure the native input gets focus outlines for keyboard navigation */
  .input-native:focus {
    outline: none;
  }

  /* Custom input container */
  .input-custom {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 38px;
    padding: var(--input-padding);
    font-size: var(--input-font-size);
    font-family: var(--input-font-family);
    color: var(--input-color);
    background-color: var(--input-bg);
    border: var(--input-border);
    border-radius: var(--input-radius);
    box-shadow: var(--input-shadow);
    transition: var(--input-transition);
    line-height: 1.5;
    outline: none;
    box-sizing: border-box;
  }

  /* Custom input value display */
  .input-custom__value {
    flex: 1;
    min-width: 0;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Display placeholder when empty */
  .input-custom__value:empty::before {
    content: attr(data-placeholder);
    color: var(--input-placeholder-color);
    pointer-events: none;
  }

  /* Focus state */
  .input-container--focused .input-custom {
    border-color: var(--input-focus-border-color);
    box-shadow: var(--input-focus-shadow);
  }

  .input-custom--focused {
    border-color: var(--input-focus-border-color);
    box-shadow: var(--input-focus-shadow);
  }

  /* Disabled state */
  .input-custom--disabled {
    background-color: var(--input-disabled-bg);
    opacity: var(--input-disabled-opacity);
    cursor: not-allowed;
    user-select: none;
  }

  .input-custom--readonly {
    background-color: var(--input-readonly-bg);
    cursor: default;
  }

  /* Loading state */
  .input-custom--loading {
    position: relative;
    pointer-events: none;
  }

  .input-custom--loading::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(--color-brand-primary, #3182ce);
    border-radius: 50%;
    animation: input-loading-spinner 0.8s linear infinite;
  }

  @keyframes input-loading-spinner {
    to {
      transform: translateY(-50%) rotate(360deg);
    }
  }

  /* Validation states */
  .input-custom--valid {
    border-color: var(--input-valid-border-color);
  }

  .input-custom--invalid {
    border-color: var(--input-invalid-border-color);
  }

  .input-validation-message {
    font-size: var(--input-validation-font-size);
    margin-top: var(--space-1);
    color: var(--input-validation-color);
    min-height: 20px; /* Reserve space for validation messages */
  }

  .input-container--valid .input-validation-message {
    color: var(--input-valid-color);
  }

  /* Type-specific styles */

  /* Search input */
  .input-custom--search {
    padding-right: 30px;
  }

  .input-custom__clear {
    display: none;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-gray-500);
    transition: color 0.2s ease;
  }

  .input-custom__clear::before,
  .input-custom__clear::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 2px;
    background-color: currentColor;
  }

  .input-custom__clear::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .input-custom__clear::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  .input-custom__clear:hover {
    color: var(--color-gray-700, #495057);
  }

  .input-custom--has-value .input-custom__clear {
    display: block;
  }

  /* Password input */
  .input-custom--password {
    padding-right: 30px;
  }

  .input-custom__toggle {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-gray-500);
    transition: color 0.2s ease;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  .input-custom__toggle--visible {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M17.5 6.5l-11 11'/%3E%3C/svg%3E");
  }

  .input-custom__toggle:hover {
    color: var(--color-gray-700);
  }

  /* Number input */
  .input-custom--number {
    padding-right: 36px;
  }

  .input-custom__number-controls {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 24px;
    display: flex;
    flex-direction: column;
    border-left: var(--input-border);
  }

  .input-custom__increment,
  .input-custom__decrement {
    flex: 1;
    padding: 0;
    background: var(--input-bg);
    border: none;
    cursor: pointer;
    position: relative;
    transition: background-color 0.2s ease;
  }

  .input-custom__increment {
    border-bottom: var(--input-border);
    border-top-right-radius: var(--input-radius);
  }

  .input-custom__decrement {
    border-bottom-right-radius: var(--input-radius);
  }

  .input-custom__increment::before,
  .input-custom__increment::after,
  .input-custom__decrement::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    background-color: var(--color-gray-500);
    transition: background-color 0.2s ease;
  }

  .input-custom__increment::before {
    width: 8px;
    height: 2px;
    transform: translate(-50%, -50%);
  }

  .input-custom__increment::after {
    width: 2px;
    height: 8px;
    transform: translate(-50%, -50%);
  }

  .input-custom__decrement::before {
    width: 8px;
    height: 2px;
    transform: translate(-50%, -50%);
  }

  .input-custom__increment:hover,
  .input-custom__decrement:hover {
    background-color: var(--color-gray-100);
  }

  .input-custom__increment:hover::before,
  .input-custom__increment:hover::after,
  .input-custom__decrement:hover::before {
    background-color: var(--color-gray-700);
  }

  /* Make all interactive elements show pointer cursor */
  .input-custom__toggle,
  .input-custom__increment,
  .input-custom__decrement,
  .input-custom__clear {
    cursor: pointer;
  }

  /* Selection highlighting styles */
  .input-custom__selection {
    background-color: var(
      --color-brand-secondary
    ); /* Light blue selection color */
    color: var(--color-white);
    padding: var(--space-1) 0;
  }

  /* For dark mode compatibility */
  @media (prefers-color-scheme: dark) {
    .input-custom__selection {
      background-color: var(
        --color-brand-secondary-light
      ); /* Darker blue for dark mode */
      color: var(--color-white);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .input-custom {
      font-size: var(--input-mobile-font-size); /* Prevent zoom on iOS */
      padding: var(--input-mobile-padding);
    }
  }
`;
