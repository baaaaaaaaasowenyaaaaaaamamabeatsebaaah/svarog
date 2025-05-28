// src/components/Modal/Modal.styles.js
import { css } from '../../utils/styleInjection.js';

export const modalStyles = css`
  /* Backdrop */
  .modal__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity var(--transition-normal, 0.2s ease);
    z-index: var(--z-index-modal-backdrop, 1040);
  }

  .modal__backdrop--visible {
    opacity: 1;
  }

  /* Container */
  .modal__container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
    z-index: var(--z-index-modal, 1050);
    pointer-events: none;
  }

  .modal__container--open {
    pointer-events: auto;
  }

  /* Dialog */
  .modal__dialog {
    position: relative;
    width: 100%;
    max-width: var(--modal-max-width, 500px);
    max-height: calc(100vh - var(--space-8));
    background: var(--modal-bg, var(--color-bg));
    border-radius: var(--modal-radius, 0);
    box-shadow: var(--modal-shadow, var(--shadow-2xl));
    transform: scale(0.9) translateY(20px);
    opacity: 0;
    transition: all var(--transition-normal, 0.2s ease);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .modal__dialog--visible {
    transform: scale(1) translateY(0);
    opacity: 1;
  }

  /* Size variants */
  .modal__dialog--small {
    max-width: 400px;
  }

  .modal__dialog--medium {
    max-width: 600px;
  }

  .modal__dialog--large {
    max-width: 900px;
  }

  .modal__dialog--fullscreen {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  /* Header */
  .modal__header {
    position: relative;
    padding: var(--modal-header-padding, var(--space-4));
    border-bottom: var(
      --modal-header-border,
      1px solid var(--color-border-light)
    );
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .modal__title {
    margin: 0;
    font-size: var(--modal-title-size, var(--font-size-xl));
    font-weight: var(--modal-title-weight, var(--font-weight-semibold));
    color: var(--modal-title-color, var(--color-text));
    line-height: 1.2;
  }

  /* Close button - Fixed styling */
  .modal__close {
    position: relative;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-normal, 0.2s ease);
    color: var(--color-text, #333);
    font-size: 0; /* Hide the &times; character */
    flex-shrink: 0;
  }

  .modal__close:hover {
    color: var(--color-text-light, #666);
  }

  .modal__close:focus {
    outline: 2px solid var(--color-primary, #007bff);
    outline-offset: 2px;
  }

  /* Create X using pseudo-elements */
  .modal__close::before,
  .modal__close::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 2px;
    background-color: currentColor;
    transition: background-color var(--transition-normal, 0.2s ease);
  }

  .modal__close::before {
    transform: rotate(45deg);
  }

  .modal__close::after {
    transform: rotate(-45deg);
  }

  /* Content */
  .modal__content {
    flex: 1;
    overflow-y: auto;
    padding: var(--modal-content-padding, var(--space-4));
    color: var(--modal-content-color, var(--color-text));
  }

  /* Footer */
  .modal__footer {
    padding: var(--modal-footer-padding, var(--space-4));
    border-top: var(--modal-footer-border, 1px solid var(--color-border-light));
    flex-shrink: 0;
  }

  .modal__actions {
    display: flex;
    gap: var(--modal-actions-gap, var(--space-2));
    justify-content: var(--modal-actions-justify, flex-end);
    flex-wrap: wrap;
  }

  /* Variant styles */
  .modal--info .modal__header {
    background: var(--color-info-light);
    color: var(--color-info-dark);
  }

  .modal--success .modal__header {
    background: var(--color-success-light);
    color: var(--color-success-dark);
  }

  .modal--warning .modal__header {
    background: var(--color-warning-light);
    color: var(--color-warning-dark);
  }

  .modal--danger .modal__header {
    background: var(--color-danger-light);
    color: var(--color-danger-dark);
  }

  .modal--minimal .modal__header {
    border-bottom: none;
    padding-bottom: 0;
  }

  .modal--minimal .modal__footer {
    border-top: none;
    padding-top: 0;
  }

  /* Toast notification styles */
  .toast-notification .modal__container {
    align-items: flex-start;
    padding-top: var(--space-8);
  }

  .toast-notification .modal__dialog {
    box-shadow: var(--shadow-lg);
  }

  /* No backdrop styles */
  .modal--no-backdrop .modal__backdrop {
    display: none;
  }

  /* Body scroll lock */
  body.modal-open {
    overflow: hidden;
  }

  /* Mobile styles */
  @media (max-width: 576px) {
    .modal__container {
      padding: var(--space-2);
    }

    .modal__dialog--large {
      max-width: 100%;
    }

    .modal__header {
      padding: var(--space-3);
    }

    .modal__content {
      padding: var(--space-3);
    }

    .modal__footer {
      padding: var(--space-3);
    }

    .modal__close {
      width: 28px;
      height: 28px;
    }

    .modal__close::before,
    .modal__close::after {
      width: 14px;
    }
  }

  /* Focus visible */
  .modal__dialog:focus {
    outline: none;
  }

  /* Animation classes */
  @media (prefers-reduced-motion: reduce) {
    .modal__backdrop,
    .modal__dialog {
      transition: none;
    }

    .modal__close {
      transition: none;
    }
  }

  /* Dark theme support */
  @media (prefers-color-scheme: dark) {
    .modal__close:hover {
      background-color: var(--color-bg-hover, rgba(255, 255, 255, 0.1));
    }
  }
`;
