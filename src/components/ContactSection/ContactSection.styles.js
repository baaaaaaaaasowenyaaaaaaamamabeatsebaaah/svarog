// src/components/ContactSection/ContactSection.styles.js
import { css } from '../../utils/styleInjection.js';

export const contactSectionStyles = css`
  .contact-section {
    --contact-section-gap: 2rem;
    --contact-section-content-gap: 1.5rem;
    --contact-info-gap: 1rem;
    --contact-info-item-gap: 0.5rem;
    --contact-form-title-margin: 0 0 1.5rem 0;
    --contact-link-color: var(--color-primary, #007bff);
    --contact-link-hover-color: var(--color-primary-dark, #0056b3);
    --contact-info-bg: var(--color-gray-50, #f8f9fa);
    --contact-info-padding: 1.5rem;
    --contact-info-radius: var(--border-radius-default, 8px);
    --contact-info-border: 1px solid var(--color-gray-200, #e9ecef);
  }

  /* Main grid layout */
  .contact-section__grid {
    align-items: stretch;
  }

  /* Content area styling */
  .contact-section__content {
    display: flex;
    flex-direction: column;
    gap: var(--contact-section-content-gap);
    height: 100%;
  }

  /* Contact form title */
  .contact-form__title {
    margin: var(--contact-form-title-margin);
    color: var(--color-text, #333);
    font-size: var(--font-size-xl, 1.25rem);
    font-weight: var(--font-weight-semibold, 600);
  }

  /* Contact info container */
  .contact-info {
    background: var(--contact-info-bg);
    padding: var(--contact-info-padding);
    border-radius: var(--contact-info-radius);
    border: var(--contact-info-border);
    margin-bottom: var(--contact-section-content-gap);
  }

  .contact-info:last-child {
    margin-bottom: 0;
  }

  /* Contact info items */
  .contact-info__item {
    display: flex;
    flex-direction: column;
    gap: var(--contact-info-item-gap);
    margin-bottom: var(--contact-info-gap);
  }

  .contact-info__item:last-child {
    margin-bottom: 0;
  }

  .contact-info__label {
    color: var(--color-text, #333);
    font-size: var(--font-size-sm, 0.875rem);
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .contact-info__value {
    color: var(--color-text-muted, #666);
    line-height: 1.5;
  }

  .contact-info__link {
    color: var(--contact-link-color);
    text-decoration: none;
    transition: color 0.2s ease;
    line-height: 1.5;
  }

  .contact-info__link:hover {
    color: var(--contact-link-hover-color);
    text-decoration: underline;
  }

  .contact-info__link:focus {
    outline: 2px solid var(--contact-link-color);
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* Mobile layout adjustments */
  @media (max-width: 767px) {
    .contact-section {
      --contact-section-gap: 1.5rem;
      --contact-section-content-gap: 1rem;
      --contact-info-padding: 1rem;
    }

    .contact-form__title {
      font-size: var(--font-size-lg, 1.125rem);
      margin-bottom: 1rem;
    }

    /* Stack layout for mobile */
    .contact-section__grid--stack .contact-section__content {
      order: 2;
    }

    .contact-section__grid--reverse .contact-section__content {
      order: 1;
    }

    /* Adjust contact info layout on mobile */
    .contact-info__item {
      flex-direction: row;
      align-items: baseline;
      gap: 0.75rem;
    }

    .contact-info__label {
      min-width: 70px;
      flex-shrink: 0;
    }
  }

  /* Tablet adjustments */
  @media (min-width: 768px) and (max-width: 1023px) {
    .contact-section {
      --contact-section-gap: 1.75rem;
      --contact-info-padding: 1.25rem;
    }
  }

  /* Large screen optimizations */
  @media (min-width: 1200px) {
    .contact-section {
      --contact-section-gap: 2.5rem;
      --contact-section-content-gap: 2rem;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .contact-info {
      border-width: 2px;
    }

    .contact-info__link {
      text-decoration: underline;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .contact-info__link {
      transition: none;
    }
  }

  /* Print styles */
  @media print {
    .contact-section {
      --contact-section-gap: 1rem;
    }

    .contact-info {
      background: white;
      border: 1px solid #ccc;
    }

    .contact-info__link {
      color: #000;
      text-decoration: none;
    }

    .contact-info__link::after {
      content: ' (' attr(href) ')';
      font-size: 0.8em;
      color: #666;
    }
  }
`;
