// src/components/PhoneRepairForm/PhoneRepairForm.styles.js
import { css } from '../../utils/styleInjection.js';

export const phoneRepairFormStyles = css`
  .phone-repair-form {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    width: 100%;
    padding: var(--space-5);
    border-radius: 0;
    background-color: var(--color-bg-transparent);
    font-family: var(--font-family-base);
  }

  .phone-repair-form .steps-indicator {
    padding-bottom: var(--space-12);
  }

  .phone-repair-form .price-display {
    min-height: 36px;
    justify-content: flex-end;
    padding: 0;
  }

  /* Actions container (link and button) */
  .phone-repair-form__actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    margin-top: var(--space-6);
    align-items: flex-end;
  }

  /* Used phone link */
  .phone-repair-form__link {
    color: var(--color-brand-primary);
    text-decoration: none;
    font-size: var(--font-size-sm, 14px);
    align-self: flex-end;
    transition: color 0.2s ease;
  }

  .phone-repair-form__link:hover {
    color: var(--color-brand-primary-light);
    text-decoration: underline;
  }

  /* Error state */
  .price-display--error .price-display__value {
    color: var(--color-danger-light);
    font-size: var(--font-size-base);
  }

  /* Loading and error states */
  .phone-repair-form--loading select {
    opacity: 0.7;
    pointer-events: none;
  }

  .phone-repair-form--error {
    /* Add any error state styles here */
  }

  /* Responsive adjustments */
  @media (min-width: 768px) {
    .phone-repair-form {
      padding: var(--space-6);
    }
  }

  @media (max-width: 480px) {
    .phone-repair-form {
      padding: var(--space-3);
    }
  }
`;
