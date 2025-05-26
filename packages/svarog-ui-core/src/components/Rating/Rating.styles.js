// src/components/Rating/Rating.styles.js
import { css } from '../../utils/styleInjection.js';

export const ratingStyles = css`
  /* Rating Component Styles */
  .rating {
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 12px);
    max-width: 400px;
    font-family: var(--font-family-base, sans-serif);
  }

  .rating__score-section {
    display: flex;
    align-items: center;
    gap: var(--space-4, 16px);
  }

  .rating__logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rating__logo-svg {
    width: 64px;
    height: 64px;
  }

  .rating__score-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 8px);
  }

  .rating__score-number {
    font-size: var(--font-size-3xl, 2.5rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text, #333);
  }

  .rating__stars {
    display: flex;
    gap: 2px;
  }

  .rating__star {
    font-size: var(--font-size-xl, 1.5rem);
  }

  .rating__star--full {
    color: var(--color-yellow, #ffc107);
  }

  .rating__star--half {
    background: linear-gradient(
      90deg,
      var(--color-yellow, #ffc107) 50%,
      var(--color-gray-300, #e0e0e0) 50%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .rating__star--empty {
    color: var(--color-gray-300, #e0e0e0);
  }

  .rating__total-ratings {
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text-light, #6c757d);
  }

  .rating__reviewer-images {
    display: flex;
    gap: var(--space-1, 4px);
    margin-top: var(--space-2, 8px);
  }

  .rating__reviewer-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--color-bg, white);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Source-specific variations */
  .rating--google .rating__logo-svg {
    background-color: #fff;
    border-radius: 50%;
  }

  .rating--facebook .rating__logo-svg {
    border-radius: 50%;
  }

  .rating--trustpilot .rating__logo-svg {
    background-color: #fff;
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .rating {
      max-width: 100%;
    }

    .rating__score-section {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3, 12px);
    }

    .rating__logo-svg {
      width: 48px;
      height: 48px;
    }
  }
`;
