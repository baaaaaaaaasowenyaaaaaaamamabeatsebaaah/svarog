// src/components/CookieConsent/CookieConsent.styles.js
import { css } from '../../utils/styleInjection.js';

export const cookieConsentStyles = css`
  /* Cookie consent specific styles that extend Modal styles */

  /* Banner mode - override modal positioning */
  .cookie-consent--banner .modal__container {
    position: fixed;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    height: auto;
    align-items: flex-end;
    justify-content: stretch;
    padding: 0;
  }

  .cookie-consent--banner.cookie-consent--top .modal__container {
    top: 0;
    bottom: auto;
    align-items: flex-start;
  }

  .cookie-consent--banner .modal__dialog {
    max-width: 100%;
    width: 100%;
    margin: 0;
    border-radius: 0;
    transform: translateY(100%);
    opacity: 1;
  }

  .cookie-consent--banner.cookie-consent--top .modal__dialog {
    transform: translateY(-100%);
    border-radius: 0 0 var(--border-radius-lg, 6px) var(--border-radius-lg, 6px);
  }

  .cookie-consent--banner.cookie-consent--bottom .modal__dialog {
    border-radius: var(--border-radius-lg, 6px) var(--border-radius-lg, 6px) 0 0;
  }

  .cookie-consent--banner .modal__dialog--visible {
    transform: translateY(0);
  }

  /* Modal mode uses default modal styles */
  .cookie-consent--modal .modal__dialog {
    max-width: 800px;
  }

  /* Content specific styles */
  .cookie-consent__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4, 16px);
  }

  .cookie-consent__description {
    color: var(--color-text, #1a202c);
    line-height: 1.5;
  }

  .cookie-consent__description p {
    margin: 0 0 var(--space-3, 12px) 0;
  }

  .cookie-consent__description p:last-child {
    margin-bottom: 0;
  }

  /* Categories */
  .cookie-consent__categories {
    border: 1px solid var(--color-border-light, #e2e8f0);
    border-radius: var(--border-radius-md, 4px);
    overflow: hidden;
  }

  .cookie-consent__category {
    border-bottom: 1px solid var(--color-border-light, #e2e8f0);
    padding: var(--space-4, 16px);
  }

  .cookie-consent__category:last-child {
    border-bottom: none;
  }

  .cookie-consent__category--required {
    background: var(--color-gray-50, #f9fafb);
  }

  .cookie-consent__category-header {
    margin-bottom: var(--space-2, 8px);
  }

  /* Checkbox integration - use full Checkbox component */
  .cookie-consent__category .checkbox-container {
    margin-bottom: 0; /* Override default Checkbox margin */
  }

  .cookie-consent__category .checkbox-wrapper {
    align-items: flex-start; /* Align to top for better layout */
  }

  .cookie-consent__category .checkbox-label {
    font-weight: var(--font-weight-medium, 500);
    line-height: 1.4;
  }

  /* Required badge styling */
  .cookie-consent__required-badge {
    background: var(--color-info, #00bcd4);
    color: white;
    padding: var(--space-1, 4px) var(--space-2, 8px);
    border-radius: var(--border-radius-sm, 2px);
    font-size: var(--font-size-xs, 12px);
    font-weight: var(--font-weight-medium, 500);
    margin-left: var(--space-2, 8px);
    flex-shrink: 0;
  }

  .cookie-consent__category-description {
    color: var(--color-text-light, #4a5568);
    font-size: var(--font-size-sm, 14px);
    line-height: 1.4;
    margin-left: calc(
      var(--checkbox-size, 20px) + var(--checkbox-indicator-margin, 8px)
    );
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
    color: var(--color-primary-dark, #2c5aa0);
    text-decoration: none;
  }

  .cookie-consent__legal-link:focus {
    outline: none;
    box-shadow: var(--focus-ring, 0 0 0 2px rgba(25, 118, 210, 0.25));
    border-radius: var(--border-radius-sm, 2px);
  }

  /* Action buttons customization */
  .cookie-consent .modal__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3, 12px);
    justify-content: flex-end;
  }

  /* Mobile responsiveness */
  @media (max-width: 576px) {
    .cookie-consent .modal__actions {
      flex-direction: column;
    }

    .cookie-consent .modal__actions button {
      width: 100%;
      justify-content: center;
    }

    .cookie-consent__legal {
      flex-direction: column;
      gap: var(--space-2, 8px);
    }

    .cookie-consent__category-description {
      margin-left: 0;
      margin-top: var(--space-2, 8px);
    }

    /* Banner mode mobile adjustments */
    .cookie-consent--banner .modal__container {
      padding: var(--space-2, 8px);
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .cookie-consent--banner .modal__dialog {
      transition: none;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .cookie-consent__categories {
      border-width: 2px;
    }

    .cookie-consent .modal__actions button {
      border-width: 2px;
    }
  }
`;
