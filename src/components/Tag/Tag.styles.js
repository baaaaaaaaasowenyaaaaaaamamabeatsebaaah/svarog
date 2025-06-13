// src/components/Tag/Tag.styles.js
import { css } from '../../utils/styleInjection.js';

export const tagStyles = css`
  .tag {
    /* Base styles with fallbacks */
    display: inline-flex;
    align-items: center;
    gap: var(--tag-gap, 0.375rem);
    padding: var(--tag-padding, 0.25rem 0.75rem);
    font-size: var(--tag-font-size, 0.875rem);
    font-family: var(--tag-font-family, inherit);
    font-weight: var(--tag-font-weight, 500);
    line-height: 1.5;
    color: var(--tag-color, #374151);
    background-color: var(--tag-bg, #f3f4f6);
    border: var(--tag-border, 1px solid transparent);
    border-radius: var(--tag-radius, 9999px);
    cursor: pointer;
    user-select: none;
    transition: var(--tag-transition, all 0.2s ease);
    position: relative;
    white-space: nowrap;
    text-decoration: none;
  }

  /* Hover state */
  .tag:hover:not(.tag--disabled) {
    background-color: var(--tag-hover-bg, #e5e7eb);
    color: var(--tag-hover-color, #111827);
    transform: var(--tag-hover-transform, translateY(-1px));
    box-shadow: var(--tag-hover-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
  }

  /* Focus state */
  .tag:focus {
    outline: none;
    box-shadow: var(--tag-focus-shadow, 0 0 0 3px rgba(59, 130, 246, 0.5));
  }

  .tag:focus-visible {
    outline: 2px solid var(--tag-focus-outline-color, #3b82f6);
    outline-offset: 2px;
  }

  /* Active/pressed state */
  .tag:active:not(.tag--disabled) {
    transform: var(--tag-active-transform, translateY(0));
    box-shadow: var(--tag-active-shadow, none);
  }

  /* Selected state */
  .tag--selected {
    background-color: var(--color-brand-primary);
    color: var(--tag-selected-color, #ffffff);
    border-color: var(--tag-selected-border-color, transparent);
  }

  .tag--selected:hover:not(.tag--disabled) {
    background-color: var(--color-brand-primary-light);
    color: var(--tag-selected-hover-color, #ffffff);
  }

  /* Disabled state */
  .tag--disabled {
    opacity: var(--tag-disabled-opacity, 0.5);
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Size variants */
  .tag--sm {
    padding: var(--tag-padding-sm, 0.125rem 0.5rem);
    font-size: var(--tag-font-size-sm, 0.75rem);
    gap: var(--tag-gap-sm, 0.25rem);
  }

  .tag--lg {
    padding: var(--tag-padding-lg, 0.375rem 1rem);
    font-size: var(--tag-font-size-lg, 1rem);
    gap: var(--tag-gap-lg, 0.5rem);
  }

  /* Variant styles */
  .tag--primary {
    background-color: var(--tag-primary-bg, #3b82f6);
    color: var(--tag-primary-color, #ffffff);
    border-color: var(--tag-primary-border-color, transparent);
  }

  .tag--primary:hover:not(.tag--disabled) {
    background-color: var(--tag-primary-hover-bg, #2563eb);
    color: var(--tag-primary-hover-color, #ffffff);
  }

  .tag--primary.tag--selected {
    background-color: var(--tag-primary-selected-bg, #1d4ed8);
    color: var(--tag-primary-selected-color, #ffffff);
  }

  .tag--secondary {
    background-color: var(--tag-secondary-bg, #6b7280);
    color: var(--tag-secondary-color, #ffffff);
    border-color: var(--tag-secondary-border-color, transparent);
  }

  .tag--secondary:hover:not(.tag--disabled) {
    background-color: var(--tag-secondary-hover-bg, #4b5563);
    color: var(--tag-secondary-hover-color, #ffffff);
  }

  .tag--success {
    background-color: var(--tag-success-bg, #10b981);
    color: var(--tag-success-color, #ffffff);
    border-color: var(--tag-success-border-color, transparent);
  }

  .tag--success:hover:not(.tag--disabled) {
    background-color: var(--tag-success-hover-bg, #059669);
    color: var(--tag-success-hover-color, #ffffff);
  }

  .tag--warning {
    background-color: var(--tag-warning-bg, #f59e0b);
    color: var(--tag-warning-color, #ffffff);
    border-color: var(--tag-warning-border-color, transparent);
  }

  .tag--warning:hover:not(.tag--disabled) {
    background-color: var(--tag-warning-hover-bg, #d97706);
    color: var(--tag-warning-hover-color, #ffffff);
  }

  .tag--danger {
    background-color: var(--tag-danger-bg, #ef4444);
    color: var(--tag-danger-color, #ffffff);
    border-color: var(--tag-danger-border-color, transparent);
  }

  .tag--danger:hover:not(.tag--disabled) {
    background-color: var(--tag-danger-hover-bg, #dc2626);
    color: var(--tag-danger-hover-color, #ffffff);
  }

  .tag--info {
    background-color: var(--tag-info-bg, #06b6d4);
    color: var(--tag-info-color, #ffffff);
    border-color: var(--tag-info-border-color, transparent);
  }

  .tag--info:hover:not(.tag--disabled) {
    background-color: var(--tag-info-hover-bg, #0891b2);
    color: var(--tag-info-hover-color, #ffffff);
  }

  /* Tag elements */
  .tag__icon {
    display: inline-flex;
    align-items: center;
    font-size: var(--tag-icon-size, 1em);
  }

  .tag__label {
    display: inline-block;
  }

  .tag__count {
    display: inline-block;
    font-size: var(--tag-count-font-size, 0.875em);
    opacity: var(--tag-count-opacity, 0.8);
    font-weight: var(--tag-count-font-weight, 400);
  }

  /* Remove button */
  .tag__remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--tag-remove-size, 1.25em);
    height: var(--tag-remove-size, 1.25em);
    margin-left: var(--tag-remove-margin, 0.25rem);
    margin-right: var(--tag-remove-margin-right, -0.25rem);
    padding: 0;
    font-size: var(--tag-remove-font-size, 1.25em);
    line-height: 1;
    color: inherit;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: var(--tag-remove-opacity, 0.7);
    transition: var(--tag-remove-transition, all 0.15s ease);
  }

  .tag__remove:hover {
    opacity: 1;
    background-color: var(--tag-remove-hover-bg, rgba(0, 0, 0, 0.1));
  }

  .tag__remove:focus {
    outline: none;
    box-shadow: var(
      --tag-remove-focus-shadow,
      0 0 0 2px rgba(59, 130, 246, 0.5)
    );
  }

  /* Removable tag adjustments */
  .tag--removable {
    padding-right: var(--tag-removable-padding-right, 0.5rem);
  }

  /* Animation for tag removal */
  @keyframes tag-fade-out {
    to {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  .tag--removing {
    animation: tag-fade-out 0.2s ease forwards;
  }
`;
