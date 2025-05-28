// src/components/BackToTop/BackToTop.styles.js
import { css } from '../../utils/styleInjection.js';

export const backToTopStyles = css`
  .back-to-top {
    position: fixed;
    bottom: var(--back-to-top-bottom, 2rem);
    right: var(--back-to-top-right, 2rem);
    z-index: var(--back-to-top-z-index, var(--z-index-fixed, 1030));

    width: var(--back-to-top-size, 3rem);
    height: var(--back-to-top-size, 3rem);

    background: var(--back-to-top-bg, var(--color-primary, #3182ce));
    color: var(--back-to-top-color, var(--color-text-white, #ffffff));
    border: var(--back-to-top-border, none);
    border-radius: var(--back-to-top-radius, 50%);

    cursor: pointer;
    opacity: 0;
    visibility: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: var(--back-to-top-transition, all 0.3s ease);
    box-shadow: var(
      --back-to-top-shadow,
      var(--shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.1))
    );

    font-size: var(--back-to-top-icon-size, 1.25rem);
    line-height: 1;

    outline: none;
    user-select: none;
  }

  .back-to-top--visible {
    opacity: var(--back-to-top-visible-opacity, 1);
    visibility: visible;
  }

  .back-to-top:hover {
    background: var(--back-to-top-hover-bg, var(--color-primary-dark, #2c5aa0));
    transform: var(--back-to-top-hover-transform, translateY(-2px));
    box-shadow: var(
      --back-to-top-hover-shadow,
      var(--shadow-xl, 0 20px 25px rgba(0, 0, 0, 0.1))
    );
  }

  .back-to-top:active {
    background: var(
      --back-to-top-active-bg,
      var(--color-primary-dark, #2c5aa0)
    );
    transform: var(--back-to-top-active-transform, translateY(0));
  }

  .back-to-top:focus {
    outline: var(
      --back-to-top-focus-outline,
      2px solid var(--focus-ring-color, rgba(25, 118, 210, 0.25))
    );
    outline-offset: var(--back-to-top-focus-outline-offset, 2px);
  }

  .back-to-top--disabled {
    opacity: var(--back-to-top-disabled-opacity, 0.6);
    cursor: not-allowed;
    pointer-events: none;
  }

  .back-to-top__icon {
    transition: var(--back-to-top-icon-transition, transform 0.2s ease);
  }

  .back-to-top:hover .back-to-top__icon {
    transform: var(--back-to-top-icon-hover-transform, scale(1.1));
  }

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    .back-to-top {
      bottom: var(--back-to-top-mobile-bottom, 1rem);
      right: var(--back-to-top-mobile-right, 1rem);
      width: var(--back-to-top-mobile-size, 2.5rem);
      height: var(--back-to-top-mobile-size, 2.5rem);
      font-size: var(--back-to-top-mobile-icon-size, 1rem);
    }
  }

  /* Animation optimization */
  @media (prefers-reduced-motion: reduce) {
    .back-to-top,
    .back-to-top__icon {
      transition: none;
    }
  }
`;
