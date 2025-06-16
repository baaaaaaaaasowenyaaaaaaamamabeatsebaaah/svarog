// src/components/RatingSection/RatingSection.styles.js
import { css } from '../../utils/styleInjection.js';

export const ratingSectionStyles = css`
  /* RatingSection Component Styles - Using Grid System */
  .rating-section {
    background-color: var(--section-bg, #ffffff);
    overflow: hidden;
  }

  /* Grid columns for ratings */
  .rating-section .grid .column {
    display: flex;
    align-items: center;
    padding: var(--space-4, 16px);
    transition: all 0.3s ease;
    min-height: 200px; /* Ensure consistent column height */
  }

  .rating-section .grid .column:hover {
    transform: translateY(-2px);
  }

  /* Loading states */
  .rating-section__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3, 12px);
    padding: var(--space-4, 16px);
    color: var(--color-text-muted, #6c757d);
    text-align: center;
  }

  .rating-section__spinner {
    width: 24px;
    height: 24px;
    border: 3px solid var(--color-border-light, #e9ecef);
    border-top: 3px solid var(--color-primary, #007bff);
    border-radius: 50%;
    animation: rating-section-spin 1s linear infinite;
  }

  @keyframes rating-section-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .rating-section__loading-text {
    font-size: var(--font-size-sm, 14px);
    font-weight: var(--font-weight-medium, 500);
  }

  /* Error states */
  .rating-section__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2, 8px);
    padding: var(--space-4, 16px);
    text-align: center;
    color: var(--color-error, #dc3545);
    background-color: var(--color-error-bg, #f8d7da);
    border: 1px solid var(--color-error-border, #f1aeb5);
    border-radius: var(--border-radius-md, 8px);
    min-height: 120px;
    justify-content: center;
  }

  .rating-section__error-icon {
    font-size: var(--font-size-xl, 20px);
  }

  .rating-section__error-text {
    font-size: var(--font-size-sm, 14px);
    font-weight: var(--font-weight-medium, 500);
    margin: 0;
  }

  /* Wertgarantie logo styling */
  .rating-section__wertgarantie-logo {
    max-width: 200px;
    height: auto;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    transition: all 0.3s ease;
  }

  .rating-section .column:hover .rating-section__wertgarantie-logo {
    transform: scale(1.05);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .rating-section .grid {
      gap: var(--space-3, 12px);
    }

    .rating-section .grid .column {
      padding: var(--space-3, 12px);
      min-height: 150px;
    }

    .rating-section__wertgarantie-logo {
      max-width: 150px;
    }

    .rating-section__loading {
      padding: var(--space-3, 12px);
    }
  }

  @media (max-width: 480px) {
    .rating-section .grid .column {
      padding: var(--space-2, 8px);
      min-height: 120px;
    }

    .rating-section__wertgarantie-logo {
      max-width: 120px;
    }

    .rating-section__loading-text,
    .rating-section__error-text {
      font-size: var(--font-size-xs, 12px);
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .rating-section .grid .column {
      border: 2px solid var(--color-border-strong, #495057);
    }

    .rating-section__error {
      border-width: 2px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .rating-section__spinner {
      animation: none;
    }

    .rating-section .grid .column {
      transition: none;
    }

    .rating-section .grid .column:hover {
      transform: none;
    }

    .rating-section__wertgarantie-logo {
      transition: none;
    }

    .rating-section .column:hover .rating-section__wertgarantie-logo {
      transform: none;
    }
  }

  /* Print styles */
  @media print {
    .rating-section {
      box-shadow: none;
      border: 1px solid #000;
    }

    .rating-section__loading,
    .rating-section__error {
      display: none;
    }

    .rating-section .grid .column {
      break-inside: avoid;
      box-shadow: none;
      border: 1px solid #ccc;
    }
  }
`;
