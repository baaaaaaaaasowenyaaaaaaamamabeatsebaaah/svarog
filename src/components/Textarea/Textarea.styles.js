import { css } from '../../utils/styleInjection.js';

export const textareaStyles = css`
  /**
   * Textarea component styles - Enhanced with custom UI
   */

  /* Container styles */
  .textarea-container {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--textarea-margin-bottom, var(--space-4));
    position: relative;
    width: 100%;
  }

  /* Textarea wrapper */
  .textarea-wrapper {
    position: relative;
    width: 100%;
  }

  /* Native textarea - accessible but visually integrated */
  .textarea-native {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: var(--textarea-padding, var(--space-2) var(--space-3));
    font-size: var(--textarea-font-size, var(--font-size-base));
    font-family: var(--textarea-font-family, var(--font-family-primary));
    color: var(--textarea-color, var(--color-text));
    background-color: transparent;
    border: none;
    outline: none;
    resize: vertical;
    z-index: 1;
    line-height: var(--textarea-line-height, 1.5);
    min-height: calc(
      var(--textarea-line-height, 1.5) * var(--textarea-font-size, 1rem) * 3 +
        var(--space-4)
    );
  }

  /* Auto-resize textarea */
  .textarea-custom--auto-resize .textarea-native {
    overflow: hidden;
    resize: none;
  }

  /* No resize */
  .textarea-custom--no-resize .textarea-native {
    resize: none;
  }

  /* Custom textarea container */
  .textarea-custom {
    display: block;
    width: 100%;
    min-height: calc(
      var(--textarea-line-height, 1.5) * var(--textarea-font-size, 1rem) * 3 +
        var(--space-4)
    );
    padding: var(--textarea-padding, var(--space-2) var(--space-3));
    font-size: var(--textarea-font-size, var(--font-size-base));
    font-family: var(--textarea-font-family, var(--font-family-primary));
    background-color: var(--textarea-bg, var(--color-bg));
    border: var(--textarea-border, 1px solid var(--color-border-medium));
    border-radius: var(--textarea-radius, 0);
    box-shadow: var(--textarea-shadow, var(--shadow-sm));
    transition: var(--textarea-transition, var(--transition-normal));
    box-sizing: border-box;
    pointer-events: none;
  }

  /* Focus state */
  .textarea-container--focused .textarea-custom,
  .textarea-custom--focused {
    border-color: var(--textarea-focus-border-color, var(--color-primary));
    box-shadow: var(--textarea-focus-shadow, var(--focus-ring));
  }

  /* Disabled state */
  .textarea-custom--disabled {
    background-color: var(--textarea-disabled-bg, var(--disabled-background));
    opacity: var(--textarea-disabled-opacity, var(--disabled-opacity));
    cursor: not-allowed;
  }

  .textarea-custom--disabled .textarea-native {
    cursor: not-allowed;
  }

  /* Readonly state */
  .textarea-custom--readonly {
    background-color: var(--textarea-readonly-bg, var(--color-gray-100));
    cursor: default;
  }

  .textarea-custom--readonly .textarea-native {
    cursor: default;
  }

  /* Loading state */
  .textarea-custom--loading {
    position: relative;
  }

  .textarea-custom--loading::after {
    content: '';
    position: absolute;
    top: var(--space-2);
    right: var(--space-2);
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: textarea-loading-spinner 0.8s linear infinite;
  }

  @keyframes textarea-loading-spinner {
    to {
      transform: rotate(360deg);
    }
  }

  /* Validation states */
  .textarea-custom--valid {
    border-color: var(--textarea-valid-border-color, var(--color-success));
  }

  .textarea-custom--invalid {
    border-color: var(--textarea-invalid-border-color, var(--color-danger));
  }

  /* Validation message */
  .textarea-validation-message {
    font-size: var(--textarea-validation-font-size, var(--font-size-sm));
    margin-top: var(--space-1);
    color: var(--textarea-validation-color, var(--color-danger));
    min-height: 20px;
  }

  .textarea-container--valid .textarea-validation-message {
    color: var(--textarea-valid-color, var(--color-success));
  }

  /* Character count */
  .textarea-char-count {
    position: absolute;
    bottom: var(--space-2);
    right: var(--space-2);
    font-size: var(--textarea-char-count-font-size, var(--font-size-xs));
    color: var(--textarea-char-count-color, var(--color-text-lighter));
    background-color: var(--textarea-bg, var(--color-bg));
    padding: 0 var(--space-1);
    border-radius: var(--border-radius-sm);
    pointer-events: none;
    z-index: 2;
    transition: color 0.2s ease;
  }

  .textarea-char-count--warning {
    color: var(--color-warning);
    font-weight: var(--font-weight-medium);
  }

  .textarea-char-count--error {
    color: var(--color-danger);
    font-weight: var(--font-weight-bold);
  }

  /* Scrollbar styling */
  .textarea-native::-webkit-scrollbar {
    width: 8px;
  }

  .textarea-native::-webkit-scrollbar-track {
    background: var(--color-gray-100);
    border-radius: var(--border-radius-sm);
  }

  .textarea-native::-webkit-scrollbar-thumb {
    background: var(--color-gray-400);
    border-radius: var(--border-radius-sm);
  }

  .textarea-native::-webkit-scrollbar-thumb:hover {
    background: var(--color-gray-500);
  }

  /* Firefox scrollbar */
  .textarea-native {
    scrollbar-width: thin;
    scrollbar-color: var(--color-gray-400) var(--color-gray-100);
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .textarea-native,
    .textarea-custom {
      font-size: var(
        --textarea-mobile-font-size,
        16px
      ); /* Prevent zoom on iOS */
      padding: var(--textarea-mobile-padding, var(--space-2));
    }

    .textarea-char-count {
      font-size: var(--textarea-char-count-mobile-font-size, 10px);
    }
  }

  /* Print styles */
  @media print {
    .textarea-custom {
      box-shadow: none;
      border: 1px solid #000;
    }

    .textarea-native {
      position: static;
      background-color: transparent;
    }
  }
`;
