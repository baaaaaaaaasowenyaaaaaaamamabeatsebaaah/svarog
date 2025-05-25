// src/components/Radio/RadioGroup.styles.js
import { css } from '../../utils/styleInjection.js';

export const radioGroupStyles = css`
  .radio-group {
    display: block;
    margin: 0;
    margin-bottom: var(--radio-group-margin-bottom, var(--space-4, 16px));
    padding: var(--radio-group-padding, var(--space-2, 8px));
    border: var(--radio-group-border, 1px solid var(--color-gray-300, #dee2e6));
    border-radius: var(--radio-group-radius, var(--border-radius-md, 4px));
    min-width: 0;
  }

  /* Legend styles */
  .radio-group__legend {
    font-size: var(--radio-group-legend-font-size, var(--font-size-base, 16px));
    color: var(--radio-group-legend-color, var(--color-text, #212529));
    font-family: var(
      --radio-group-font-family,
      var(--font-family-primary, sans-serif)
    );
    font-weight: var(
      --radio-group-legend-font-weight,
      var(--font-weight-medium, 500)
    );
    padding: var(--radio-group-legend-padding, 0 var(--space-2, 8px));
    margin-bottom: var(--radio-group-legend-margin-bottom, var(--space-2, 8px));
  }

  /* Required legend */
  .radio-group[required] .radio-group__legend:after {
    content: '*';
    color: var(--radio-group-required-color, var(--color-danger, #dc3545));
    margin-left: var(--space-1, 4px);
  }

  /* Options container */
  .radio-group__options {
    display: flex;
    gap: var(--radio-group-gap, var(--space-2, 8px));
  }

  /* Vertical layout (default) */
  .radio-group__options--vertical {
    flex-direction: column;
  }

  /* Horizontal layout */
  .radio-group__options--horizontal {
    flex-direction: row;
    flex-wrap: wrap;
  }

  /* Validation states */
  .radio-group--valid {
    border-color: var(
      --radio-group-valid-border-color,
      var(--color-success, #28a745)
    );
  }

  .radio-group--invalid {
    border-color: var(
      --radio-group-invalid-border-color,
      var(--color-danger, #dc3545)
    );
  }

  .radio-group__validation-message {
    font-size: var(
      --radio-group-validation-font-size,
      var(--font-size-sm, 14px)
    );
    margin-top: var(--space-1, 4px);
    color: var(--radio-group-validation-color, var(--color-danger, #dc3545));
    min-height: 20px; /* Reserve space for validation messages */
  }

  .radio-group--valid .radio-group__validation-message {
    color: var(--radio-group-valid-color, var(--color-success, #28a745));
  }

  /* Disabled state */
  .radio-group[disabled] {
    opacity: var(--radio-group-disabled-opacity, 0.7);
    background-color: var(
      --radio-group-disabled-bg,
      var(--color-gray-100, #f8f9fa)
    );
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .radio-group__options--horizontal {
      flex-direction: column;
    }
  }
`;
