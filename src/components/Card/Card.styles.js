import { css } from '../../utils/styleInjection.js';

export const cardStyles = css`
  /**
   * Card component styles
   */

  .card {
    /* Base styling */
    display: flex;
    flex-direction: column;
    background-color: var(--card-bg, var(--color-bg));
    color: var(--card-color, var(--color-text));
    border-radius: var(--card-radius, var(--border-radius-md));
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
    padding: var(--card-padding);

    /* Default shadow/border state */
    border: var(--card-border);
  }

  /* Card with elevation */
  .card--elevated {
    box-shadow: var(--card-shadow);
    border-color: transparent;
  }

  /* Card with outline */
  .card--outlined {
    border-color: var(--card-border-color);
  }

  /* Card image */
  .card__image {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    margin-bottom: var(--card-image-margin-bottom);
  }

  /* Card title */
  h3.card__title {
    padding: var(--card-title-padding);
    font-size: var(--card-title-font-size);
    font-weight: var(--card-title-font-weight);
    border-bottom: var(--card-title-border);
    margin-bottom: var(--card-title-margin-bottom);
  }

  /* Card content */
  .card__content {
    flex-grow: 1;
    padding: var(--card-content-padding);
  }

  /* Card footer */
  .card__footer {
    padding: var(--card-footer-padding);
    margin-top: var(--card-footer-margin-top);
    background-color: var(--card-footer-bg);
    border-top: var(--card-footer-border);
    font-size: var(--card-footer-font-size);
  }

  /* Card hover state */
  .card:hover {
    border-color: var(--card-hover-border-color);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card__title {
      padding: var(--card-title-padding-mobile);
    }

    .card__content {
      padding: var(--card-content-padding-mobile);
    }

    .card__footer {
      padding: var(--card-footer-padding-mobile);
    }
  }
`;
