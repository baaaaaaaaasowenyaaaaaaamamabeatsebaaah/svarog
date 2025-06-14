// src/components/Breadcrumb/Breadcrumb.styles.js
import { css } from '../../utils/styleInjection.js';

export const breadcrumbStyles = css`
  .breadcrumb {
    margin: var(--breadcrumb-margin, 0);
    padding: var(--breadcrumb-padding, 0);
    font-size: var(--breadcrumb-font-size, 0.875rem);
    font-family: var(--breadcrumb-font-family, inherit);
  }

  .breadcrumb-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: var(--breadcrumb-gap, 0);
  }

  .breadcrumb-item {
    display: flex;
    align-items: center;
    color: var(--breadcrumb-color, #6b7280);
    line-height: var(--breadcrumb-line-height, 1.5);
  }

  .breadcrumb-item--active {
    color: var(--breadcrumb-active-color, #374151);
    font-weight: var(--breadcrumb-active-font-weight, 500);
  }

  .breadcrumb-link {
    color: var(--breadcrumb-link-color, #3b82f6);
    text-decoration: var(--breadcrumb-link-decoration, none);
    transition: var(--breadcrumb-transition, color 0.15s ease-in-out);
    cursor: pointer;
    border-radius: var(--breadcrumb-link-radius, 0.25rem);
    padding: var(--breadcrumb-link-padding, 0.125rem 0.25rem);
    margin: var(--breadcrumb-link-margin, -0.125rem -0.25rem);
  }

  .breadcrumb-link:hover {
    color: var(--breadcrumb-link-hover-color, #1d4ed8);
    text-decoration: var(--breadcrumb-link-hover-decoration, underline);
    background-color: var(--breadcrumb-link-hover-bg, rgba(59, 130, 246, 0.1));
  }

  .breadcrumb-link:focus {
    outline: var(--breadcrumb-link-focus-outline, 2px solid #3b82f6);
    outline-offset: var(--breadcrumb-link-focus-offset, 2px);
  }

  .breadcrumb-text {
    color: inherit;
  }

  .breadcrumb-separator {
    margin: var(--breadcrumb-separator-margin, 0 0.5rem);
    color: var(--breadcrumb-separator-color, #9ca3af);
    font-size: var(--breadcrumb-separator-size, 0.875rem);
    user-select: none;
    flex-shrink: 0;
  }

  .breadcrumb-truncation {
    color: var(--breadcrumb-truncation-color, #9ca3af);
    cursor: default;
    font-weight: var(--breadcrumb-truncation-font-weight, bold);
    padding: var(--breadcrumb-truncation-padding, 0.125rem 0.25rem);
    border-radius: var(--breadcrumb-truncation-radius, 0.25rem);
  }

  .breadcrumb-truncation:hover {
    background-color: var(
      --breadcrumb-truncation-hover-bg,
      rgba(156, 163, 175, 0.1)
    );
  }

  /* Responsive design */
  @media (max-width: 640px) {
    .breadcrumb {
      font-size: var(--breadcrumb-mobile-font-size, 0.8125rem);
    }

    .breadcrumb-separator {
      margin: var(--breadcrumb-mobile-separator-margin, 0 0.375rem);
    }

    .breadcrumb-link,
    .breadcrumb-truncation {
      padding: var(--breadcrumb-mobile-padding, 0.25rem);
      margin: var(--breadcrumb-mobile-margin, -0.25rem);
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .breadcrumb-link {
      text-decoration: underline;
    }

    .breadcrumb-separator {
      font-weight: bold;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .breadcrumb-link {
      transition: none;
    }
  }

  /* RTL support */
  [dir='rtl'] .breadcrumb-separator {
    transform: scaleX(-1);
  }
`;
