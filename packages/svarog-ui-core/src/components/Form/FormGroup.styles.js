import { css } from '../../utils/styleInjection.js';

export const formGroupStyles = css`
  /**
   * FormGroup component styles
   */

  .form-group {
    display: flex;
    margin-bottom: var(--form-group-margin-bottom, var(--space-4, 16px));
    position: relative;
  }

  /* Label styling */
  .form-group__label {
    display: block;
    font-size: var(--form-group-label-font-size, var(--font-size-base, 16px));
    color: var(--form-group-label-color, var(--color-text, #212529));
    font-family: var(
      --form-group-font-family,
      var(--font-family-primary, sans-serif)
    );
    font-weight: var(
      --form-group-label-font-weight,
      var(--font-weight-medium, 500)
    );
    margin-bottom: var(--form-group-label-margin-bottom, var(--space-1, 4px));
    line-height: 1.5;
  }

  /* Required label indicator */
  .form-group__label--required::after {
    content: '*';
    color: var(--form-group-required-color, var(--color-danger, #dc3545));
    margin-left: var(--space-1, 4px);
  }

  /* Field container */
  .form-group__field {
    flex: 1;
    min-width: 0; /* Prevents flex item from overflowing */
  }

  /* Help text styling */
  .form-group__help-text {
    font-size: var(--form-group-help-font-size, var(--font-size-sm, 14px));
    color: var(--form-group-help-color, var(--color-text-light, #6c757d));
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition:
      max-height 0.3s ease,
      opacity 0.2s ease,
      margin-top 0.3s ease;
    margin-top: 0;
  }

  /* Show help text when parent has .has-help-text class */
  .form-group.has-help-text .form-group__help-text {
    max-height: 3em; /* Enough room for most help texts */
    opacity: 1;
    margin-top: var(--space-1, 4px);
  }

  /* Label position variants */

  /* Top label (default) */
  .form-group--top {
    flex-direction: column;
  }

  /* Bottom label */
  .form-group--bottom {
    flex-direction: column-reverse;
  }

  .form-group--bottom .form-group__label {
    margin-bottom: 0;
    margin-top: var(--form-group-label-margin-bottom, var(--space-1, 4px));
  }

  /* Left label */
  .form-group--left {
    flex-direction: row;
    align-items: center;
  }

  .form-group--left .form-group__label {
    margin-bottom: 0;
    margin-right: var(--form-group-label-margin-right, var(--space-3, 12px));
    width: var(--form-group-label-width, 30%);
    text-align: right;
    padding-right: var(--space-2, 8px);
  }

  .form-group--left .form-group__help-text {
    margin-left: calc(
      var(--form-group-label-width, 30%) +
        var(--form-group-label-margin-right, var(--space-3, 12px))
    );
  }

  /* Right label */
  .form-group--right {
    flex-direction: row-reverse;
    align-items: center;
  }

  .form-group--right .form-group__label {
    margin-bottom: 0;
    margin-left: var(--form-group-label-margin-left, var(--space-3, 12px));
    width: auto;
  }

  .form-group--right .form-group__help-text {
    margin-right: auto;
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    /* Stack labels on small screens */
    .form-group--left,
    .form-group--right {
      flex-direction: column;
      align-items: flex-start;
    }

    .form-group--left .form-group__label,
    .form-group--right .form-group__label {
      width: 100%;
      text-align: left;
      margin: 0 0 var(--form-group-label-margin-bottom, var(--space-1, 4px)) 0;
    }

    .form-group--left .form-group__help-text {
      margin-left: 0;
    }
  }
`;
