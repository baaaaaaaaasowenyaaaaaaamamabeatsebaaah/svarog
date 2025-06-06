// src/components/ConditionSelector/ConditionSelector.styles.js
import { css } from '../../utils/styleInjection.js';

export const conditionSelectorStyles = css`
  .condition-selector {
    width: 100%;
  }

  /* Condition options styling */
  .condition-options {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    width: 100%;
  }

  .condition-option {
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .condition-option:hover .condition-option__label {
    border-color: var(--color-brand-secondary);
  }

  .condition-option input[type='radio'] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .condition-option__label {
    display: flex;
    padding: var(--space-3);
    background-color: var(--color-bg);
    border: 1px solid var(--color-gray-300);
    border-radius: 0; /* Remove border radius */
    transition: all 0.2s ease;
    width: 100%;
  }

  .condition-option--selected .condition-option__label {
    border-color: var(--color-brand-secondary);
    background-color: var(--color-gray-200);
  }

  .condition-option__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: var(--space-3);
    font-size: var(--font-size-xl);
    min-width: 28px;
  }

  .condition-option__content {
    flex: 1;
  }

  .condition-option__title {
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-base);
    margin-bottom: var(--space-1);
  }

  .condition-option__description {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
  }

  /* Loading state */
  .condition-selector--loading .condition-option {
    opacity: 0.7;
    pointer-events: none;
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .condition-option__label {
      padding: var(--space-2);
    }

    .condition-option__icon {
      margin-right: var(--space-2);
    }
  }
`;
