// src/components/ContactSection/ContactSection.styles.js
import { css } from '../../utils/styleInjection.js';

export const contactSectionStyles = css`
  .contact-section {
    --contact-section-gap: var(--space-1);
    --contact-section-content-gap: var(--space-2);
    --contact-info-gap: var(--space-1);
    --contact-info-item-gap: var(--space-1);
    --contact-form-title-margin: 0 0 var(--space-1) 0;
    --contact-info-padding: var(--space-2);
    --checkbox-gap: var(--space-1);
  }

  /* Content area styling */
  .contact-section__content {
    display: flex;
    flex-direction: column;
    gap: var(--contact-section-content-gap);
    height: 100%;
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

  .contact-info__item:first-child {
    font-weight: var(--font-weight-semibold, 600);
  }

  .contact-info__item:last-child {
    margin-bottom: 0;
  }

  .contact-info__label {
    font-weight: var(--font-weight-semibold, 600);
    margin-bottom: var(--cspace-1);
    margin-top: var(--space-4);
  }

  .contact-info__address {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  /* Required field notice */
  .contact-form__required-notice {
    margin-top: var(--space-2);
    margin-bottom: var(--space-1);
    text-align: left;
  }

  .contact-form__required-text {
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text-muted, #666);
    font-style: italic;
  }

  /* Enhanced hours display */
  .contact-info__item--hours {
    align-items: flex-start;
  }

  .contact-info__hours-list {
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--color-text-muted, #666);
    line-height: 1.6;
  }

  .contact-info__hours-item {
    display: flex;
    gap: 0.5rem;
    padding: 0.125rem 0;
  }

  .contact-info__hours-item:first-child {
    padding-top: 0;
  }

  .contact-info__hours-item:last-child {
    padding-bottom: 0;
  }

  .contact-info__hours-day {
    font-weight: var(--font-weight-medium, 500);
    min-width: 7rem;
    flex-shrink: 0;
  }

  .contact-info__hours-time {
    color: var(--color-text-muted, #666);
  }

  /* Responsive hours display */
  @media (max-width: 767px) {
    .contact-info__hours-list {
      font-size: var(--font-size-sm, 0.875rem);
    }

    .contact-info__hours-day {
      min-width: 5rem;
    }
  }

  /* Mobile layout adjustments using Grid component */
  @media (max-width: 767px) {
    .contact-section {
      --contact-section-content-gap: 1rem;
      --contact-info-padding: 1rem;
    }

    /* Stack layout for mobile - handled by Grid component responsive behavior */
    .contact-section__grid--stack .column:first-child {
      order: 1;
    }

    .contact-section__grid--stack .column:last-child {
      order: 2;
    }

    .contact-section__grid--reverse .column:first-child {
      order: 2;
    }

    .contact-section__grid--reverse .column:last-child {
      order: 1;
    }

    /* Adjust contact info layout on mobile */
    .contact-info__item {
      flex-direction: row;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .contact-info__label {
      min-width: 90px;
      flex-shrink: 0;
    }

    .contact-info__value,
    .contact-info__address {
      flex: 1;
    }
  }

  /* Tablet adjustments */
  @media (min-width: 768px) and (max-width: 1023px) {
    .contact-section {
      --contact-info-padding: 1.25rem;
    }
  }

  /* Large screen optimizations */
  @media (min-width: 1200px) {
    .contact-section {
      --contact-section-content-gap: 2rem;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .contact-info {
      border-width: 2px;
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

    /* Hide form in print */
    .contact-section__content > form {
      display: none;
    }
  }
`;
