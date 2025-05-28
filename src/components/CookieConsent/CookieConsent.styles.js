// src/components/CookieConsent/CookieConsent.styles.js
import { css } from '../../utils/styleInjection.js';

export const cookieConsentStyles = css`
  /* Base cookie consent styles */
  .cookie-consent {
    position: fixed;
    z-index: var(--z-index-modal, 10000);
    font-family: var(
      --font-family-primary,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif
    );
    font-size: var(--font-size-sm, 14px);
    line-height: 1.5;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .cookie-consent--visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  /* Banner mode */
  .cookie-consent--banner {
    left: 0;
    right: 0;
  }

  .cookie-consent--banner.cookie-consent--visible .cookie-consent__banner {
    transform: translateY(0);
  }

  /* Modal mode */
  .cookie-consent--modal {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4, 16px);
  }

  /* Backdrop */
  .cookie-consent__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  /* Banner */
  .cookie-consent__banner {
    position: relative;
    background: var(--color-bg, #ffffff);
    border: 1px solid var(--color-border-light, #e2e8f0);
    box-shadow: var(--shadow-xl, 0 20px 25px rgba(0, 0, 0, 0.1));
    max-width: 100%;
    width: 100%;
    transition: transform 0.3s ease;
  }

  /* Banner positions */
  .cookie-consent__banner--bottom {
    bottom: 0;
    border-radius: var(--border-radius-lg, 6px) var(--border-radius-lg, 6px) 0 0;
    transform: translateY(100%);
  }

  .cookie-consent__banner--top {
    top: 0;
    border-radius: 0 0 var(--border-radius-lg, 6px) var(--border-radius-lg, 6px);
    transform: translateY(-100%);
  }

  .cookie-consent__banner--center {
    position: static;
    max-width: 600px;
    border-radius: var(--border-radius-lg, 6px);
    transform: scale(0.9);
  }

  .cookie-consent--modal.cookie-consent--visible
    .cookie-consent__banner--center {
    transform: scale(1);
  }

  /* Detailed mode adjustments */
  .cookie-consent__banner--detailed {
    max-width: 800px;
  }

  /* Content */
  .cookie-consent__content {
    padding: var(--space-6, 24px);
  }

  /* Header */
  .cookie-consent__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: var(--space-4, 16px);
  }

  .cookie-consent__title {
    margin: 0;
    font-size: var(--font-size-xl, 20px);
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text, #1a202c);
    line-height: 1.2;
  }

  .cookie-consent__close {
    background: none;
    border: none;
    padding: var(--space-1, 4px);
    margin-left: var(--space-3, 12px);
    cursor: pointer;
    font-size: var(--font-size-2xl, 24px);
    line-height: 1;
    color: var(--color-text-light, #4a5568);
    border-radius: var(--border-radius-md, 4px);
    transition: var(--transition-fast, all 0.1s ease);
    flex-shrink: 0;
  }

  .cookie-consent__close:hover {
    background: var(--color-gray-100, #f7fafc);
    color: var(--color-text, #1a202c);
  }

  .cookie-consent__close:focus {
    outline: none;
    box-shadow: var(--focus-ring, 0 0 0 2px rgba(25, 118, 210, 0.25));
  }

  /* Description */
  .cookie-consent__description {
    margin-bottom: var(--space-5, 20px);
    color: var(--color-text, #1a202c);
  }

  .cookie-consent__description p {
    margin: 0 0 var(--space-3, 12px) 0;
  }

  .cookie-consent__description p:last-child {
    margin-bottom: 0;
  }

  /* Categories */
  .cookie-consent__categories {
    margin-bottom: var(--space-5, 20px);
    border: 1px solid var(--color-border-light, #e2e8f0);
    border-radius: var(--border-radius-md, 4px);
    overflow: hidden;
  }

  .cookie-consent__category {
    border-bottom: 1px solid var(--color-border-light, #e2e8f0);
  }

  .cookie-consent__category:last-child {
    border-bottom: none;
  }

  .cookie-consent__category--required {
    background: var(--color-gray-50, #f9fafb);
  }

  .cookie-consent__category-header {
    padding: var(--space-4, 16px);
  }

  .cookie-consent__category-label {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3, 12px);
    cursor: pointer;
    font-weight: var(--font-weight-medium, 500);
  }

  .cookie-consent__category-checkbox {
    margin: 0;
    flex-shrink: 0;
    margin-top: 2px; /* Align with text baseline */
  }

  .cookie-consent__category-checkbox:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .cookie-consent__category-name {
    flex: 1;
    color: var(--color-text, #1a202c);
  }

  .cookie-consent__required-badge {
    background: var(--color-info, #00bcd4);
    color: white;
    padding: var(--space-1, 4px) var(--space-2, 8px);
    border-radius: var(--border-radius-sm, 2px);
    font-size: var(--font-size-xs, 12px);
    font-weight: var(--font-weight-medium, 500);
    flex-shrink: 0;
  }

  .cookie-consent__category-description {
    padding: 0 var(--space-4, 16px) var(--space-4, 16px) var(--space-4, 16px);
    margin-left: calc(
      var(--space-3, 12px) + 16px
    ); /* Align with checkbox + gap */
    color: var(--color-text-light, #4a5568);
    font-size: var(--font-size-sm, 14px);
    line-height: 1.4;
  }

  /* Actions */
  .cookie-consent__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3, 12px);
    margin-bottom: var(--space-4, 16px);
  }

  .cookie-consent__button {
    padding: var(--space-3, 12px) var(--space-4, 16px);
    border: 1px solid transparent;
    border-radius: var(--border-radius-md, 4px);
    font-size: var(--font-size-sm, 14px);
    font-weight: var(--font-weight-medium, 500);
    cursor: pointer;
    transition: var(--transition-fast, all 0.1s ease);
    white-space: nowrap;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
  }

  .cookie-consent__button:focus {
    outline: none;
    box-shadow: var(--focus-ring, 0 0 0 2px rgba(25, 118, 210, 0.25));
  }

  .cookie-consent__button--reject {
    background: var(--color-gray-100, #f7fafc);
    color: var(--color-text, #1a202c);
    border-color: var(--color-border-medium, #cbd5e0);
  }

  .cookie-consent__button--reject:hover {
    background: var(--color-gray-200, #edf2f7);
    border-color: var(--color-border-dark, #a0aec0);
  }

  .cookie-consent__button--details {
    background: transparent;
    color: var(--color-primary, #3182ce);
    border-color: var(--color-primary, #3182ce);
  }

  .cookie-consent__button--details:hover {
    background: var(--color-primary, #3182ce);
    color: white;
  }

  .cookie-consent__button--accept-selected {
    background: var(--color-info, #00bcd4);
    color: white;
    border-color: var(--color-info, #00bcd4);
  }

  .cookie-consent__button--accept-selected:hover {
    background: var(--color-info-dark, #0097a7);
    border-color: var(--color-info-dark, #0097a7);
  }

  .cookie-consent__button--accept-all {
    background: var(--color-success, #4caf50);
    color: white;
    border-color: var(--color-success, #4caf50);
  }

  .cookie-consent__button--accept-all:hover {
    background: var(--color-success-dark, #3d8b40);
    border-color: var(--color-success-dark, #3d8b40);
  }

  /* Legal links */
  .cookie-consent__legal {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4, 16px);
    padding-top: var(--space-4, 16px);
    border-top: 1px solid var(--color-border-light, #e2e8f0);
  }

  .cookie-consent__legal-link {
    color: var(--color-primary, #3182ce);
    text-decoration: underline;
    font-size: var(--font-size-sm, 14px);
    transition: var(--transition-fast, all 0.1s ease);
  }

  .cookie-consent__legal-link:hover {
    color: var(--color-primary, #3182ce);
    text-decoration: none;
  }

  .cookie-consent__legal-link:focus {
    outline: none;
    box-shadow: var(--focus-ring, 0 0 0 2px rgba(25, 118, 210, 0.25));
    border-radius: var(--border-radius-sm, 2px);
  }

  /* Body lock for modal */
  body.cookie-consent-open {
    overflow: hidden;
  }

  /* Mobile responsiveness */
  @media (max-width: 576px) {
    .cookie-consent__content {
      padding: var(--space-4, 16px);
    }

    .cookie-consent__actions {
      flex-direction: column;
    }

    .cookie-consent__button {
      width: 100%;
      justify-content: center;
    }

    .cookie-consent__legal {
      flex-direction: column;
      gap: var(--space-2, 8px);
    }

    .cookie-consent__category-description {
      margin-left: 0;
      padding-left: var(--space-4, 16px);
    }

    .cookie-consent__banner--center {
      margin: var(--space-2, 8px);
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .cookie-consent,
    .cookie-consent__banner {
      transition: none;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .cookie-consent__banner {
      background: var(--color-bg-dark, #1a202c);
      border-color: var(--color-border-dark, #4a5568);
    }

    .cookie-consent__title {
      color: var(--color-text-white, #ffffff);
    }

    .cookie-consent__description {
      color: var(--color-text-white, #ffffff);
    }

    .cookie-consent__category-name {
      color: var(--color-text-white, #ffffff);
    }

    .cookie-consent__category--required {
      background: var(--color-gray-800, #2d3748);
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .cookie-consent__banner {
      border-width: 2px;
    }

    .cookie-consent__button {
      border-width: 2px;
    }

    .cookie-consent__categories {
      border-width: 2px;
    }
  }
`;
