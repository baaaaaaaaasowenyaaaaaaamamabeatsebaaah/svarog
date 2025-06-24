// src/components/UsedPhonePriceForm/UsedPhonePriceForm.styles.js
import { css } from '../../utils/styleInjection.js';

export const usedPhonePriceFormStyles = css`
  .used-phone-price-form {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    width: 100%;
    padding: var(--space-5);
    border-radius: 0;
    background-color: var(--color-bg-transparent);
    font-family: var(--font-family-base);
    transition: all 0.3s ease;
  }

  .used-phone-price-form .steps-indicator {
    padding-bottom: var(--space-12);
  }

  .used-phone-price-form .price-display {
    min-height: 36px;
    justify-content: flex-end;
    padding: 0;
    transition: all 0.3s ease;
  }

  /* Form groups for inputs */
  .used-phone-price-form .form-group {
    margin-bottom: var(--space-4);
  }

  .used-phone-price-form .form-group__label {
    display: block;
    margin-bottom: var(--space-2);
    font-weight: 500;
    color: var(--color-text);
  }

  /* Actions container - now holds multiple buttons */
  .used-phone-price-form__actions {
    display: flex;
    gap: var(--space-3);
    margin-top: var(--space-6);
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  /* Button responsiveness */
  .used-phone-price-form__actions .btn {
    flex: 1;
    min-width: 160px;
  }

  /* Error state */
  .price-display--error .price-display__value {
    color: var(--color-danger-light);
    font-size: var(--font-size-base);
  }

  /* Loading and error states */
  .used-phone-price-form--loading select,
  .used-phone-price-form--loading button {
    opacity: 0.7;
    pointer-events: none;
  }

  .used-phone-price-form--error {
    border-color: var(--color-danger-light, #f56565);
  }

  /* Animation for price highlight */
  .price-display--highlight {
    animation: price-highlight 1s ease;
  }

  @keyframes price-highlight {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
      background-color: rgba(66, 153, 225, 0.2);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Animations for entire form */
  .used-phone-price-form--animating {
    transition: all 0.5s ease;
  }

  .used-phone-price-form--animate-step {
    animation: step-transition 0.5s ease;
  }

  .used-phone-price-form--animate-submit {
    animation: submit-pulse 0.5s ease;
  }

  .used-phone-price-form--animate-error {
    animation: error-shake 0.5s ease;
  }

  .used-phone-price-form--theme-transition {
    animation: theme-change 1s ease;
  }

  @keyframes step-transition {
    0% {
      opacity: 0.8;
      transform: translateY(-5px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes submit-pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes error-shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes theme-change {
    0% {
      filter: brightness(0.8);
    }
    50% {
      filter: brightness(1.1);
    }
    100% {
      filter: brightness(1);
    }
  }

  /* Screen reader only content */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Responsive adjustments */
  @media (min-width: 768px) {
    .used-phone-price-form {
      padding: var(--space-6);
    }
  }

  @media (max-width: 480px) {
    .used-phone-price-form {
      padding: var(--space-3);
    }

    /* Stack buttons on mobile */
    .used-phone-price-form__actions {
      flex-direction: column;
    }

    .used-phone-price-form__actions .btn {
      width: 100%;
    }
  }
`;
