// src/components/Select/Select.styles.js
import { css } from '../../utils/styleInjection.js';

export const selectStyles = css`
  /* src/components/Select/Select.css */
  /**
   * Select component styles with enhanced loading states and optimized selectors
   */

  .select-container {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--select-margin-bottom, 1rem);
    position: relative;
    width: 100%;
    z-index: 1;
  }

  .select-container.select-open {
    z-index: 2;
  }

  /* Loading state prevents interaction */
  .select-container[data-loading='true'] {
    pointer-events: none;
  }

  /* Accessibility-compliant hidden native select */
  .select-native {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Custom select with enhanced styling */
  .select-custom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--select-padding, 0.5rem 1rem);
    font-size: var(--select-font-size, 1rem);
    font-family: var(--select-font-family, sans-serif);
    color: var(--select-color, #333);
    background-color: var(--select-bg, #fff);
    border: var(--select-border, 1px solid #ccc);
    border-radius: var(--select-radius, 4px);
    box-shadow: var(--select-shadow, none);
    transition: var(--select-transition, all 0.2s ease);
    line-height: var(--select-line-height, 1.5);
    cursor: pointer;
    outline: none;
    position: relative;
    box-sizing: border-box;
    z-index: 2;
  }

  .select-custom:hover {
    border-color: var(--select-hover-border-color, #999);
  }

  .select-custom--loading {
    cursor: wait;
    opacity: 0.8;
  }

  .select-custom--loading .select-custom__arrow {
    display: none;
  }

  /* Selected value display with state variants */
  .select-custom__selected {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    pointer-events: none;
  }

  .select-custom__selected--placeholder {
    color: var(--select-placeholder-color, #999);
    font-style: normal;
  }

  .select-custom__selected--loading {
    color: var(--select-loading-color, var(--select-placeholder-color, #666));
    font-style: italic;
  }

  .select-custom__selected--empty {
    color: var(--select-empty-color, var(--select-placeholder-color, #999));
    font-style: italic;
  }

  /* Dropdown arrow with smooth animation */
  .select-custom__arrow {
    position: absolute;
    top: 50%;
    right: var(--select-arrow-right, 12px);
    width: var(--select-arrow-size, 6px);
    height: var(--select-arrow-size, 6px);
    margin-left: var(--select-arrow-margin, 8px);
    border-right: var(--select-arrow-border, 2px solid currentColor);
    border-bottom: var(--select-arrow-border, 2px solid currentColor);
    transform: translateY(-75%) rotate(45deg);
    transform-origin: center;
    transition: var(--select-arrow-transition, transform 0.2s ease);
    pointer-events: none;
  }

  .select-custom--open .select-custom__arrow {
    transform: translateY(-25%) rotate(-135deg);
  }

  /* Enhanced loading indicator */
  .select-custom__loading-indicator {
    position: absolute;
    top: 50%;
    right: var(--select-arrow-right, 12px);
    width: var(--select-loading-size, 16px);
    height: var(--select-loading-size, 16px);
    margin-left: var(--select-arrow-margin, 8px);
    transform: translateY(-50%);
    pointer-events: none;
  }

  .select-custom__loading-indicator::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    border: 2px solid var(--select-loading-border-color, #e0e0e0);
    border-top-color: var(
      --select-loading-active-color,
      var(--select-focus-border-color, #0066ff)
    );
    border-radius: 50%;
    animation: select-loading-spin 1s linear infinite;
  }

  @keyframes select-loading-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Optimized dropdown with portal support */
  .select-custom__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 0;
    overflow: hidden;
    background-color: var(--select-dropdown-bg, #fff);
    border: 0 solid var(--select-dropdown-border-color, #ccc);
    border-top: none;
    border-radius: var(--select-dropdown-radius, 0 0 4px 4px);
    z-index: var(--z-index-dropdown, 1000);
    transition: var(--select-dropdown-transition, max-height 0.2s ease);
    margin-top: -1px;
    box-shadow: var(--select-dropdown-shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
    visibility: hidden;
  }

  /* Portal positioning for body-mounted dropdowns */
  body > .select-custom__dropdown {
    margin-top: 0;
    box-shadow: var(--shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.1));
  }

  .select-custom__dropdown--open {
    max-height: var(--select-dropdown-max-height, 300px);
    overflow-y: auto;
    border-width: 1px;
    visibility: visible;
  }

  /* Loading dropdown should remain hidden */
  .select-custom--loading .select-custom__dropdown {
    display: none !important;
  }

  /* Enhanced option styling */
  .select-custom__option {
    font-family: var(--select-font-family, sans-serif);
    font-size: var(--select-font-size, 1rem);
    padding: var(--select-option-padding, 0.5rem 1rem);
    cursor: pointer;
    transition: var(--select-option-transition, background-color 0.15s ease);
    display: flex;
    align-items: center;
    user-select: none;
  }

  .select-custom__option:hover,
  .select-custom__option:focus {
    background-color: var(--select-option-hover-bg, #f5f5f5);
    outline: none;
  }

  .select-custom__option--selected {
    background-color: var(--select-option-selected-bg, #e6f7ff);
    color: var(--select-option-selected-color, inherit);
  }

  .select-custom__option--disabled {
    color: var(--select-option-disabled-color, #ccc);
    cursor: not-allowed;
    background-color: var(--select-option-disabled-bg, transparent);
  }

  /* Group header styling */
  .select-custom__group-header {
    padding: var(--select-group-header-padding, 0.25rem 1rem);
    font-weight: var(--select-group-header-font-weight, 600);
    color: var(--select-group-header-color, #666);
    background-color: var(--select-group-header-bg, #f8f9fa);
    font-size: var(--select-group-header-font-size, 0.875rem);
    border-bottom: var(--select-group-header-border-bottom, 1px solid #eee);
    border-top: var(--select-group-header-border-top, 1px solid #eee);
    margin-top: -1px;
    pointer-events: none;
    user-select: none;
  }

  /* Multiple selection checkbox */
  .select-custom__checkbox {
    display: inline-block;
    width: var(--select-checkbox-size, 16px);
    height: var(--select-checkbox-size, 16px);
    border: var(--select-checkbox-border, 1px solid #ccc);
    border-radius: var(--select-checkbox-radius, 2px);
    margin-right: var(--select-checkbox-margin, 8px);
    position: relative;
    pointer-events: none;
  }

  .select-custom__checkbox--checked::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 6px;
    width: 4px;
    height: 8px;
    border-right: var(--select-checkbox-check-border, 2px solid #0066ff);
    border-bottom: var(--select-checkbox-check-border, 2px solid #0066ff);
    transform: rotate(45deg);
  }

  /* State styling with enhanced specificity */
  .select-custom--focused,
  .select-custom:focus {
    border-color: var(--select-focus-border-color, #0066ff);
    box-shadow: var(--select-focus-shadow, 0 0 0 2px rgba(0, 102, 255, 0.2));
  }

  .select-custom--disabled {
    background-color: var(--select-disabled-bg, #f5f5f5);
    opacity: var(--select-disabled-opacity, 0.6);
    cursor: not-allowed;
  }

  .select-custom--valid {
    border-color: var(--select-valid-border-color, #4caf50);
  }

  .select-custom--invalid {
    border-color: var(--select-invalid-border-color, #f44336);
  }

  /* Validation message with enhanced styling */
  .select-validation-message {
    font-size: var(--select-validation-font-size, 0.875rem);
    margin-top: var(--select-validation-margin-top, 0.25rem);
    color: var(--select-validation-color, #f44336);
    min-height: var(--select-validation-min-height, 1.25rem);
  }

  .select-container--valid .select-validation-message {
    color: var(--select-valid-color, #4caf50);
  }

  /* Responsive optimizations */
  @media (max-width: 480px) {
    .select-custom {
      font-size: var(
        --select-mobile-font-size,
        16px
      ); /* Prevents zoom on iOS */
      padding: var(--select-mobile-padding, 0.75rem 1rem);
    }

    .select-custom__dropdown {
      max-height: var(--select-dropdown-mobile-max-height, 250px);
    }

    .select-custom__loading-indicator {
      width: var(--select-loading-size-mobile, 14px);
      height: var(--select-loading-size-mobile, 14px);
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .select-custom {
      border-width: 2px;
    }

    .select-custom__option:hover {
      background-color: Highlight;
      color: HighlightText;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .select-custom,
    .select-custom__arrow,
    .select-custom__dropdown,
    .select-custom__option {
      transition: none;
    }

    .select-custom__loading-indicator::after {
      animation: none;
    }
  }
`;
