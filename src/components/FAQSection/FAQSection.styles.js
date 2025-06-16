// src/components/FAQSection/FAQSection.styles.js
import { css } from '../../utils/styleInjection.js';

export const faqSectionStyles = css`
  .faq-section {
    /* FAQ-specific section styling */
    --section-gap: var(--faq-section-gap, 1.5rem);
  }

  .faq-section .section__title {
    /* FAQ section title styling */
    font-size: var(--faq-title-font-size, 2rem);
    font-weight: var(--faq-title-font-weight, 600);
    color: var(--faq-title-color, var(--color-text));
    margin-bottom: var(--faq-title-margin-bottom, 0.75rem);
    text-align: var(--faq-title-align, left);
  }

  .faq-section .section__description {
    /* FAQ section description styling */
    font-size: var(--faq-description-font-size, 1.125rem);
    color: var(--faq-description-color, var(--color-text-light));
    margin-bottom: var(--faq-description-margin-bottom, 2rem);
    max-width: var(--faq-description-max-width, 600px);
  }

  .faq-section__accordion {
    /* FAQ accordion specific styles */
    width: 100%;
  }

  /* FAQ-specific accordion enhancements */
  .faq-section .accordion__header {
    /* FAQ question styling */
    font-size: var(--faq-question-font-size, 1.125rem);
    font-weight: var(--faq-question-font-weight, 500);
    padding: var(--faq-question-padding, 1.25rem 1rem);
  }

  .faq-section .accordion__content {
    /* FAQ answer styling */
    font-size: var(--faq-answer-font-size, 1rem);
    line-height: var(--faq-answer-line-height, 1.6);
    color: var(--faq-answer-color, var(--color-text));
    padding: var(--faq-answer-padding, 1rem);
  }

  /* FAQ answer content enhancements */
  .faq-section .accordion__content p {
    margin-bottom: var(--faq-answer-paragraph-spacing, 1rem);
  }

  .faq-section .accordion__content p:last-child {
    margin-bottom: 0;
  }

  .faq-section .accordion__content ul,
  .faq-section .accordion__content ol {
    margin: var(--faq-answer-list-margin, 0.75rem 0);
    padding-left: var(--faq-answer-list-padding, 1.5rem);
  }

  .faq-section .accordion__content li {
    margin-bottom: var(--faq-answer-list-item-spacing, 0.5rem);
  }

  .faq-section .accordion__content a {
    color: var(--faq-answer-link-color, var(--color-primary));
    text-decoration: var(--faq-answer-link-decoration, underline);
  }

  .faq-section .accordion__content a:hover {
    color: var(--faq-answer-link-hover-color, var(--color-primary-dark));
  }

  /* Enhanced bordered variant for FAQs */
  .faq-section .accordion--bordered .accordion__item {
    margin-bottom: var(--faq-item-spacing, 1rem);
    transition: var(--faq-item-transition, box-shadow 0.2s ease);
  }

  .faq-section .accordion--bordered .accordion__item:hover {
    background-color: var(--color-gray-50, #f7fafc);
  }

  /* Plus/minus icon enhancements for FAQs */
  .faq-section .accordion--plus-minus .accordion__icon {
    color: var(--faq-icon-color, var(--color-primary));
    font-weight: var(--faq-icon-font-weight, 300);
  }

  /* Mobile optimizations for FAQs */
  @media (max-width: 768px) {
    .faq-section .section__title {
      font-size: var(--faq-title-font-size-mobile, 1.75rem);
      text-align: var(--faq-title-align-mobile, center);
    }

    .faq-section .section__description {
      font-size: var(--faq-description-font-size-mobile, 1rem);
      text-align: var(--faq-description-align-mobile, center);
      margin-bottom: var(--faq-description-margin-bottom-mobile, 1.5rem);
    }

    .faq-section .accordion__header {
      font-size: var(--faq-question-font-size-mobile, 1rem);
      padding: var(--faq-question-padding-mobile, 1rem 0.75rem);
    }

    .faq-section .accordion__content {
      padding: var(--faq-answer-padding-mobile, 0.75rem);
      font-size: var(--faq-answer-font-size-mobile, 0.875rem);
    }

    .faq-section .accordion--bordered .accordion__item {
      margin-bottom: var(--faq-item-spacing-mobile, 0.75rem);
    }
  }

  /* Dark theme adjustments */
  @media (prefers-color-scheme: dark) {
    .faq-section .accordion--bordered .accordion__item {
      box-shadow: var(
        --faq-item-shadow-dark,
        0 2px 4px rgba(255, 255, 255, 0.1)
      );
    }

    .faq-section .accordion--bordered .accordion__item:hover {
      box-shadow: var(
        --faq-item-hover-shadow-dark,
        0 4px 8px rgba(255, 255, 255, 0.15)
      );
    }

    .faq-section .accordion--bordered .accordion__item--expanded {
      box-shadow: var(
        --faq-item-expanded-shadow-dark,
        0 4px 12px rgba(255, 255, 255, 0.2)
      );
    }
  }

  /* Search highlighting support */
  .faq-section .faq-highlight {
    background-color: var(--faq-highlight-bg, #fff3cd);
    color: var(--faq-highlight-color, #856404);
    padding: var(--faq-highlight-padding, 0.125rem 0.25rem);
    border-radius: var(--faq-highlight-radius, 3px);
  }

  /* Loading states */
  .faq-section--loading {
    opacity: var(--faq-loading-opacity, 0.6);
    pointer-events: none;
  }

  .faq-section--loading .accordion__item {
    animation: var(--faq-loading-animation, pulse 1.5s ease-in-out infinite);
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;
