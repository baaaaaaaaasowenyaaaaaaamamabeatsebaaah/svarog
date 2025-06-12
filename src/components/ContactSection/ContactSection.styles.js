// src/components/ContactSection/ContactSection.styles.js
import { css } from '../../utils/styleInjection.js';

export const contactSectionStyles = css`
  .contact-section {
    --contact-section-gap: var(--space-1);
    --contact-section-content-gap: var(--space-2);
    --contact-info-gap: var(--space-1);
    --contact-info-item-gap: var(--space-1);
    --contact-form-title-margin: 0 0 var(--space-1) 0;
    --contact-link-color: var(--color-primary, #007bff);
    --contact-link-hover-color: var(--color-primary-dark, #0056b3);
    --contact-info-bg: var(--color-gray-50, #f8f9fa);
    --contact-info-padding: var(--space-2);
    --contact-info-radius: 0;
    --contact-info-border: 1px solid var(--color-gray-200, #e9ecef);
    --checkbox-gap: var(--space-1);
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
    font-weight: var(--font-weight-semibold, 600);
    margin-bottom: 0.25rem;
  }

  .contact-info__value {
    color: var(--color-text-muted, #666);
    line-height: 1.5;
  }

  .contact-info__address {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
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

  /* Checkbox form groups */
  .form-group--checkbox {
    margin-top: var(--space-2);
  }

  /* Custom checkbox styling */
  .form-group--checkbox > div {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    cursor: pointer;
  }

  .form-group--checkbox input[type='checkbox'] {
    margin-top: 0.125rem;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .form-group--checkbox span {
    line-height: 1.5;
    font-size: var(--font-size-sm, 0.875rem);
    cursor: pointer;
    color: var(--color-text, #333);
  }

  /* Style links within checkbox labels */
  .form-group--checkbox a {
    color: var(--contact-link-color);
    text-decoration: underline;
  }

  .form-group--checkbox a:hover {
    color: var(--contact-link-hover-color);
  }

  .form-group--checkbox a:focus {
    outline: 2px solid var(--contact-link-color);
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* Legacy checkbox label styles for fallback */
  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: var(--checkbox-gap);
    cursor: pointer;
    line-height: 1.5;
    font-size: var(--font-size-sm, 0.875rem);
  }

  .checkbox-label input[type='checkbox'] {
    margin-top: 0.125rem;
    flex-shrink: 0;
  }

  .checkbox-label a {
    color: var(--contact-link-color);
    text-decoration: underline;
  }

  .checkbox-label a:hover {
    color: var(--contact-link-hover-color);
  }

  /* Ensure proper spacing for checkbox content */
  label[for*='checkbox'] {
    display: flex;
    align-items: flex-start;
    gap: var(--checkbox-gap);
    cursor: pointer;
    line-height: 1.5;
    font-size: var(--font-size-sm, 0.875rem);
  }

  label[for*='checkbox'] input[type='checkbox'] {
    margin-top: 0.125rem;
    flex-shrink: 0;
  }

  label[for*='checkbox'] a {
    color: var(--contact-link-color);
    text-decoration: underline;
  }

  label[for*='checkbox'] a:hover {
    color: var(--contact-link-hover-color);
  }

  /* Form validation styling for checkboxes */
  .form-group--error .form-group--checkbox span {
    color: var(--color-danger, #dc3545);
  }

  .form-group--error .form-group--checkbox input[type='checkbox'] {
    outline: 2px solid var(--color-danger, #dc3545);
    outline-offset: 1px;
  }

  /* Legacy support for old checkbox structure */
  .form-group--checkbox.form-group--error .checkbox-label {
    color: var(--color-danger, #dc3545);
  }

  .form-group--checkbox.form-group--error input[type='checkbox'] {
    outline: 2px solid var(--color-danger, #dc3545);
    outline-offset: 1px;
  }

  /* Mobile layout adjustments using Grid component */
  @media (max-width: 767px) {
    .contact-section {
      --contact-section-content-gap: 1rem;
      --contact-info-padding: 1rem;
    }

    .contact-form__title {
      font-size: var(--font-size-lg, 1.125rem);
      margin-bottom: 1rem;
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

    /* Checkbox adjustments on mobile */
    .checkbox-label {
      font-size: var(--font-size-xs, 0.75rem);
      line-height: 1.4;
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

    .contact-info__link,
    .checkbox-label a {
      text-decoration: underline;
    }

    .checkbox-label input[type='checkbox'] {
      outline: 2px solid currentColor;
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

    .contact-info__link,
    .checkbox-label a {
      color: #000;
      text-decoration: none;
    }

    .contact-info__link::after,
    .checkbox-label a::after {
      content: ' (' attr(href) ')';
      font-size: 0.8em;
      color: #666;
    }

    /* Hide checkboxes in print */
    .form-group--checkbox {
      display: none;
    }
  }
`;
