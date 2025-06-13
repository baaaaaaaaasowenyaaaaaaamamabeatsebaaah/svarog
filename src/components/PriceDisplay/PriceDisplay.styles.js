// src/components/PriceDisplay/PriceDisplay.styles.js
import { css } from '../../utils/styleInjection.js';

export const priceDisplayStyles = css`
  .price-display {
    display: flex;
    align-items: center;
    padding: 0;
    background-color: var(--price-display-bg);
    border: 1px solid var(--price-display-border);
    border-radius: 0; /* Remove border radius */
    transition: all 0.3s ease;
  }

  /* When no label is present, the value takes full space */
  .price-display--no-label .price-display__value {
    margin-left: 0;
  }

  .price-display__label {
    font-weight: var(--font-weight-bold);
    margin-right: var(--space-3);
    color: var(--color-text);
    font-size: var(--font-size-xs);
  }

  .price-display__value {
    color: var(--color-text);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-2xl);
    display: flex;
    align-items: center;
  }

  /* Highlighted state */
  .price-display--highlighted .price-display__value {
    color: var(--price-display-color);
  }

  /* Loading state */
  .price-display--loading .price-display__value,
  .price-display--placeholder .price-display__value {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-light);
    font-style: italic;
  }

  /* Loading indicator */
  .price-display__loading-indicator {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(--color-brand-secondary-light);
    border-radius: 50%;
    animation: price-display-spin 1s linear infinite;
    margin-left: var(--space-2);
  }

  @keyframes price-display-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Error state */
  .price-display--error .price-display__value {
    color: var(--color-danger, #dc3545);
  }
`;
