import { css } from '../../utils/styleInjection.js';

export const formStyles = css`
  /**
   * Form component styles
   */

  .form {
    display: block;
    margin: 0;
    padding: 0;
    width: 100%;
  }

  /* Vertical layout (default) */
  .form--vertical {
    /* Default form layout */
  }

  /* Horizontal layout */
  .form--horizontal .form-group {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .form--horizontal .form-group__label {
    width: var(--form-label-width, 30%);
    text-align: right;
    padding-right: var(--space-3, 12px);
    margin-bottom: 0;
  }

  .form--horizontal .form-group__field {
    flex: 1;
  }

  .form--horizontal .form-group__help-text {
    margin-left: calc(var(--form-label-width, 30%) + var(--space-3, 12px));
  }

  /* Form Section */
  .form-section {
    margin-bottom: var(--form-section-margin-bottom, var(--space-6, 24px));
  }

  .form-section__title {
    font-size: var(--form-section-title-font-size, var(--font-size-lg, 18px));
    color: var(--form-section-title-color, var(--color-text, #212529));
    font-weight: var(
      --form-section-title-font-weight,
      var(--font-weight-semibold, 600)
    );
    margin-bottom: var(
      --form-section-title-margin-bottom,
      var(--space-3, 12px)
    );
    padding-bottom: var(--space-2, 8px);
    border-bottom: var(
      --form-section-title-border,
      1px solid var(--color-gray-200, #e9ecef)
    );
  }

  .form-section__description {
    font-size: var(
      --form-section-description-font-size,
      var(--font-size-base, 16px)
    );
    color: var(
      --form-section-description-color,
      var(--color-text-light, #6c757d)
    );
    margin-bottom: var(
      --form-section-description-margin-bottom,
      var(--space-3, 12px)
    );
  }

  /* Form Actions */
  .form-actions {
    display: flex;
    gap: var(--form-actions-gap, var(--space-3, 12px));
    margin-top: var(--form-actions-margin-top, var(--space-5, 20px));
    justify-content: var(--form-actions-justify, flex-end);
  }

  .form-actions--left {
    justify-content: flex-start;
  }

  .form-actions--center {
    justify-content: center;
  }

  .form-actions--stretched {
    justify-content: space-between;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .form--horizontal .form-group {
      flex-direction: column;
    }

    .form--horizontal .form-group__label {
      width: 100%;
      text-align: left;
      padding-right: 0;
      margin-bottom: var(--space-1, 4px);
    }

    .form--horizontal .form-group__help-text {
      margin-left: 0;
    }

    .form-actions {
      flex-direction: column;
    }

    .form-actions--stretched {
      flex-direction: row;
    }
  }
`;
