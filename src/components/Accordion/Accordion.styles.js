// src/components/Accordion/Accordion.styles.js
import { css } from '../../utils/styleInjection.js';

export const accordionStyles = css`
  .accordion {
    /* Base styles */
    width: 100%;
    border: var(--accordion-border, 1px solid var(--color-border-light));
    border-radius: var(--accordion-radius, var(--border-radius-md));
    background: var(--accordion-bg, var(--color-bg));
    overflow: hidden;
  }

  /* Accordion Item */
  .accordion__item {
    border-bottom: var(
      --accordion-item-border,
      1px solid var(--color-border-light)
    );
    transition: var(--accordion-transition, var(--transition-normal));
  }

  .accordion__item:last-child {
    border-bottom: none;
  }

  .accordion__item--expanded {
    background: var(--accordion-expanded-bg, var(--color-bg-light));
  }

  /* Header/Trigger */
  .accordion__header {
    width: 100%;
    padding: var(--accordion-header-padding, var(--space-4));
    background: var(--accordion-header-bg, transparent);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--accordion-header-gap, var(--space-3));
    text-align: left;
    font-family: var(--accordion-font-family, var(--font-family-primary));
    font-size: var(--accordion-font-size, var(--font-size-base));
    font-weight: var(--accordion-font-weight, var(--font-weight-medium));
    color: var(--accordion-header-color, var(--color-text));
    transition: var(--accordion-transition, var(--transition-normal));
    position: relative;
  }

  .accordion__header:hover {
    background: var(--accordion-header-hover-bg, var(--color-bg-light));
    color: var(--accordion-header-hover-color, var(--color-text));
  }

  .accordion__header:focus {
    outline: none;
    box-shadow: var(--accordion-focus-shadow, var(--focus-ring));
    z-index: 1;
  }

  .accordion__header:focus-visible {
    outline: 2px solid
      var(--accordion-focus-outline-color, var(--color-primary));
    outline-offset: -2px;
  }

  /* Title */
  .accordion__title {
    flex: 1;
    text-align: inherit;
  }

  /* Icon Container */
  .accordion__icon {
    flex-shrink: 0;
    width: var(--accordion-icon-size, 1.5rem);
    height: var(--accordion-icon-size, 1.5rem);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  /* Default icon using ::before (for backward compatibility) */
  .accordion__icon::before {
    content: var(--accordion-icon-content, '▼');
    font-size: var(--accordion-icon-font-size, 0.75rem);
    color: var(--accordion-icon-color, var(--color-text-light));
    transition: var(--accordion-icon-transition, transform 0.3s ease);
    display: var(--accordion-icon-display, block);
  }

  .accordion__item--expanded .accordion__icon::before {
    transform: var(--accordion-icon-expanded-transform, rotate(180deg));
  }

  /* Arrow-based icon (new flexible approach) */
  .accordion__icon-arrow {
    position: absolute;
    width: var(--accordion-arrow-width, 8px);
    height: var(--accordion-arrow-height, 8px);
    border-right: var(--accordion-arrow-border, 2px solid currentColor);
    border-bottom: var(--accordion-arrow-border, 2px solid currentColor);
    transform: var(--accordion-arrow-transform, rotate(45deg));
    transform-origin: center;
    transition: var(--accordion-arrow-transition, transform 0.3s ease);
    color: var(--accordion-icon-color, var(--color-text-light));
    display: var(--accordion-arrow-display, none);
  }

  .accordion__item--expanded .accordion__icon-arrow {
    transform: var(--accordion-arrow-expanded-transform, rotate(-135deg));
  }

  /* Panel/Content */
  .accordion__panel {
    overflow: hidden;
    transition: var(--accordion-panel-transition, max-height 0.3s ease);
    max-height: 0;
  }

  .accordion__item--expanded .accordion__panel {
    max-height: var(--accordion-panel-max-height, 2000px);
  }

  .accordion__content {
    padding: var(--accordion-content-padding, var(--space-4));
    color: var(--accordion-content-color, var(--color-text));
    font-size: var(--accordion-content-font-size, var(--font-size-sm));
    line-height: var(
      --accordion-content-line-height,
      var(--line-height-relaxed)
    );
  }

  /* Variants */

  /* Bordered variant */
  .accordion--bordered {
    border: none;
  }

  .accordion--bordered .accordion__item {
    border: var(
      --accordion-bordered-item-border,
      1px solid var(--color-border-light)
    );
    border-radius: var(--accordion-bordered-radius, var(--border-radius-md));
    margin-bottom: var(--accordion-bordered-gap, var(--space-2));
  }

  .accordion--bordered .accordion__item:last-child {
    margin-bottom: 0;
  }

  /* Minimal variant */
  .accordion--minimal {
    border: none;
    background: transparent;
  }

  .accordion--minimal .accordion__item {
    border-bottom: var(
      --accordion-minimal-border,
      1px solid var(--color-border-light)
    );
  }

  .accordion--minimal .accordion__header {
    padding-left: 0;
    padding-right: 0;
  }

  .accordion--minimal .accordion__content {
    padding-left: 0;
    padding-right: 0;
  }

  /* Flush variant */
  .accordion--flush {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  /* Accessibility */
  .accordion__panel[aria-hidden='true'] {
    visibility: hidden;
  }

  .accordion__panel[aria-hidden='false'] {
    visibility: visible;
  }

  /* Animation optimization */
  @media (prefers-reduced-motion: reduce) {
    .accordion__icon,
    .accordion__panel,
    .accordion__header,
    .accordion__item {
      transition: none;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    .accordion__header {
      padding: var(--accordion-header-padding-mobile, var(--space-3));
      font-size: var(--accordion-font-size-mobile, var(--font-size-sm));
    }

    .accordion__content {
      padding: var(--accordion-content-padding-mobile, var(--space-3));
    }
  }
`;
