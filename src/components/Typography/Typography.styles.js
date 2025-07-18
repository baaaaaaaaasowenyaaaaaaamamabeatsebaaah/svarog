// src/components/Typography/Typography.styles.js
import { css } from '../../utils/styleInjection.js';

export const typographyStyles = css`
  .typography {
    font-family: var(--font-family-primary);
    line-height: var(--line-height-normal);
    margin: 0;
    padding: 0;
  }

  /* Headings - Use base typography font sizes */
  .typography--h1 {
    font-size: var(--font-size-6xl);
    line-height: var(--line-height-tight);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-4);
  }

  .typography--h2 {
    font-size: var(--font-size-4xl);
    line-height: var(--line-height-tight);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-4);
  }

  .typography--h3 {
    font-size: var(--font-size-3xl);
    line-height: var(--line-height-snug);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-3);
  }

  .typography--h4 {
    font-size: var(--font-size-2xl);
    line-height: var(--line-height-snug);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-3);
  }

  .typography--h5 {
    font-size: var(--font-size-xl);
    line-height: var(--line-height-normal);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-2);
  }

  .typography--h6 {
    font-size: var(--font-size-lg);
    line-height: var(--line-height-normal);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-2);
  }

  /* Body text */
  .typography--p {
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--space-4);
  }

  .typography--span,
  .typography--div {
    line-height: var(--line-height-normal);
  }

  /* Text alignment */
  .typography--align-left {
    text-align: left;
  }

  .typography--align-center {
    text-align: center;
  }

  .typography--align-right {
    text-align: right;
  }

  .typography--align-justify {
    text-align: justify;
  }

  /* Font weights - Both named and numeric */
  .typography--weight-light,
  .typography--weight-300 {
    font-weight: var(--font-weight-light);
  }

  .typography--weight-regular,
  .typography--weight-normal,
  .typography--weight-400 {
    font-weight: var(--font-weight-regular);
  }

  .typography--weight-medium,
  .typography--weight-500 {
    font-weight: var(--font-weight-medium);
  }

  .typography--weight-semibold,
  .typography--weight-600 {
    font-weight: var(--font-weight-semibold);
  }

  .typography--weight-bold,
  .typography--weight-700 {
    font-weight: var(--font-weight-bold);
  }

  /* Additional numeric weights */
  .typography--weight-100 {
    font-weight: 100;
  }

  .typography--weight-200 {
    font-weight: 200;
  }

  .typography--weight-800 {
    font-weight: 800;
  }

  .typography--weight-900 {
    font-weight: 900;
  }

  /* Font styles */
  .typography--italic {
    font-style: italic;
  }

  /* Display types */
  .typography--block {
    display: block;
  }

  .typography--inline {
    display: inline;
  }

  /* Responsive typography */
  @media (max-width: 768px) {
    .typography[data-tablet-size] {
      font-size: attr(data-tablet-size) !important;
    }
  }

  @media (max-width: 480px) {
    .typography[data-mobile-size] {
      font-size: attr(data-mobile-size) !important;
    }
  }
`;
