// src/components/Accordion/Accordion.styles.js
import { css } from '../../utils/styleInjection.js';

export const accordionStyles = css`
  .accordion {
    /* Base styles */
    width: 100%;
    border: var(--accordion-border, 1px solid var(--color-border-light));
    border-radius: var(--accordion-radius, 0);
    background: var(--accordion-bg, var(--color-transparent));
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

  /* Icon Container - Enhanced for flexible designs */
  .accordion__icon {
    flex-shrink: 0;
    width: var(--accordion-icon-size, 1.5rem);
    height: var(--accordion-icon-size, 1.5rem);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    color: var(--accordion-icon-color, var(--color-text-light));
  }

  /* Content-based icons (default - backward compatible) */
  .accordion__icon::before {
    content: var(--accordion-icon-content, '▼');
    font-size: var(--accordion-icon-font-size, 0.75rem);
    color: inherit;
    transition: var(--accordion-icon-transition, transform 0.3s ease);
    display: var(--accordion-icon-display, block);
    transform-origin: center;
  }

  .accordion__item--expanded .accordion__icon::before {
    transform: var(--accordion-icon-expanded-transform, rotate(180deg));
  }

  /* CSS Arrow Design (exact match with Select component) */
  .accordion__icon-arrow {
    position: absolute;
    top: 50%;
    right: var(--accordion-arrow-right, 0);
    left: auto;
    width: var(--accordion-arrow-size, 12px);
    height: var(--accordion-arrow-size, 12px);
    border-right: var(--accordion-arrow-border, 2px solid currentColor);
    border-bottom: var(--accordion-arrow-border, 2px solid currentColor);
    transform: var(--accordion-arrow-transform, translateY(-75%) rotate(45deg));
    transform-origin: center;
    transition: var(--accordion-arrow-transition, transform 0.2s ease);
    display: var(--accordion-arrow-display, none);
    pointer-events: none;
  }

  .accordion__item--expanded .accordion__icon-arrow {
    transform: var(
      --accordion-arrow-expanded-transform,
      translateY(-25%) rotate(-135deg)
    );
  }

  /* Icon type variants for easy switching */

  /* Arrow variant - shows CSS arrow, hides content icon */
  .accordion--arrow .accordion__icon::before {
    display: none;
  }

  .accordion--arrow .accordion__icon-arrow {
    display: block;
  }

  /* Content variant - explicit content icon (default behavior) */
  .accordion--content .accordion__icon::before {
    display: block;
  }

  .accordion--content .accordion__icon-arrow {
    display: none;
  }

  /* None variant - no icon */
  .accordion--no-icon .accordion__icon {
    display: none;
  }

  /* Chevron variant - right-pointing chevron that rotates down */
  .accordion--chevron .accordion__icon::before {
    content: var(--accordion-chevron-content, '›');
    font-size: var(--accordion-chevron-font-size, 1rem);
    display: block;
    transform: var(--accordion-chevron-transform, rotate(0deg));
  }

  .accordion--chevron .accordion__icon-arrow {
    display: none;
  }

  .accordion--chevron .accordion__item--expanded .accordion__icon::before {
    transform: var(--accordion-chevron-expanded-transform, rotate(90deg));
  }

  /* Plus/Minus variant */
  .accordion--plus-minus .accordion__icon::before {
    content: var(--accordion-plus-content, '+');
    font-size: var(--accordion-plus-font-size, 1.25rem);
    font-weight: var(--accordion-plus-font-weight, 300);
    display: block;
    transform: none;
  }

  .accordion--plus-minus .accordion__icon-arrow {
    display: none;
  }

  .accordion--plus-minus .accordion__item--expanded .accordion__icon::before {
    content: var(--accordion-minus-content, '−');
    transform: none;
  }

  /* Caret variant - small triangular caret */
  .accordion--caret .accordion__icon::before {
    content: var(--accordion-caret-content, '▸');
    font-size: var(--accordion-caret-font-size, 0.875rem);
    display: block;
    transform: var(--accordion-caret-transform, rotate(0deg));
  }

  .accordion--caret .accordion__icon-arrow {
    display: none;
  }

  .accordion--caret .accordion__item--expanded .accordion__icon::before {
    transform: var(--accordion-caret-expanded-transform, rotate(90deg));
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

  /* Layout Variants */

  /* Bordered variant */
  .accordion--bordered {
    border: none;
  }

  .accordion--bordered .accordion__item {
    border: var(
      --accordion-bordered-item-border,
      1px solid var(--color-border-light)
    );
    border-radius: var(--accordion-bordered-radius, 0);
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
    .accordion__icon::before,
    .accordion__icon-arrow,
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

    .accordion__icon {
      width: var(--accordion-icon-size-mobile, 1.25rem);
      height: var(--accordion-icon-size-mobile, 1.25rem);
    }
  }
`;
