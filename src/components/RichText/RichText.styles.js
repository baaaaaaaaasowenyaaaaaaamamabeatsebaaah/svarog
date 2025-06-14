// src/components/RichText/RichText.styles.js
import { css } from '../../utils/styleInjection.js';

export const richTextStyles = css`
  /**
   * RichText component styles using Svarog UI base variables
   * Provides comprehensive styling for HTML content with theme integration
   */

  .richtext {
    color: var(--color-text);
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
    line-height: var(--line-height-relaxed);
    font-size: var(--font-size-base);
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* Typography elements */
  .richtext h1,
  .richtext h2,
  .richtext h3,
  .richtext h4,
  .richtext h5,
  .richtext h6 {
    color: var(--color-text);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    margin-top: var(--space-6);
    margin-bottom: var(--space-4);
  }

  .richtext h1:first-child,
  .richtext h2:first-child,
  .richtext h3:first-child,
  .richtext h4:first-child,
  .richtext h5:first-child,
  .richtext h6:first-child {
    margin-top: 0;
  }

  .richtext h1 {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--space-6);
  }

  .richtext h2 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-5);
  }

  .richtext h3 {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-semibold);
  }

  .richtext h4 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
  }

  .richtext h5 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
  }

  .richtext h6 {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Paragraphs and text */
  .richtext p {
    margin-bottom: var(--space-4);
    line-height: var(--line-height-relaxed);
  }

  .richtext p:last-child {
    margin-bottom: 0;
  }

  /* Text formatting */
  .richtext strong,
  .richtext b {
    font-weight: var(--font-weight-bold);
  }

  .richtext em,
  .richtext i {
    font-style: italic;
  }

  .richtext u {
    text-decoration: underline;
  }

  .richtext sub,
  .richtext sup {
    font-size: 0.75em;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  .richtext sub {
    bottom: -0.25em;
  }

  .richtext sup {
    top: -0.5em;
  }

  /* Links */
  .richtext__link {
    color: var(--color-info);
    text-decoration: underline;
    transition: var(--transition-fast);
  }

  .richtext__link:hover {
    color: var(--color-info-dark);
    text-decoration: underline;
  }

  .richtext__link:focus {
    outline: 2px solid var(--color-info);
    outline-offset: 2px;
  }

  /* External link indicator */
  .richtext__link--external::after {
    content: '↗';
    font-size: 0.8em;
    margin-left: var(--space-1);
    opacity: 0.7;
  }

  /* Email and phone links */
  .richtext__link--email::before {
    content: '✉ ';
    opacity: 0.7;
  }

  .richtext__link--phone::before {
    content: '☎ ';
    opacity: 0.7;
  }

  /* Lists */
  .richtext ul,
  .richtext ol {
    margin-bottom: var(--space-4);
    padding-left: var(--space-6);
  }

  .richtext ul {
    list-style-type: disc;
  }

  .richtext ol {
    list-style-type: decimal;
  }

  .richtext li {
    margin-bottom: var(--space-2);
    line-height: var(--line-height-relaxed);
  }

  .richtext li:last-child {
    margin-bottom: 0;
  }

  /* Nested lists */
  .richtext ul ul,
  .richtext ol ol,
  .richtext ul ol,
  .richtext ol ul {
    margin-top: var(--space-2);
    margin-bottom: var(--space-2);
  }

  .richtext ul ul {
    list-style-type: circle;
  }

  .richtext ul ul ul {
    list-style-type: square;
  }

  /* Tables */
  .richtext table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: var(--space-4);
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
  }

  .richtext th,
  .richtext td {
    padding: var(--space-3);
    text-align: left;
    border: 1px solid var(--color-border);
    vertical-align: top;
  }

  .richtext th {
    background-color: var(--color-gray-50);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
  }

  .richtext tbody tr:nth-child(even) {
    background-color: var(--color-gray-50);
  }

  .richtext tbody tr:hover {
    background-color: var(--color-gray-100);
  }

  /* Blockquotes */
  .richtext blockquote {
    margin: var(--space-6) 0;
    padding: var(--space-4) var(--space-6);
    border-left: 4px solid var(--color-info);
    background-color: var(--color-gray-50);
    color: var(--color-text-light);
    font-style: italic;
  }

  .richtext blockquote p:last-child {
    margin-bottom: 0;
  }

  /* Code */
  .richtext code {
    padding: var(--space-1) var(--space-2);
    background-color: var(--color-gray-100);
    color: var(--color-danger);
    border-radius: var(--radius-sm);
    font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    font-size: var(--font-size-sm);
  }

  .richtext pre {
    padding: var(--space-4);
    background-color: var(--color-gray-100);
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin-bottom: var(--space-4);
  }

  .richtext pre code {
    padding: 0;
    background-color: var(--color-transparent);
    color: var(--color-text);
  }

  /* Horizontal rules */
  .richtext hr {
    margin: var(--space-8) 0;
    border: 0;
    border-top: 1px solid var(--color-border);
  }

  /* Images */
  .richtext img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    margin: var(--space-4) 0;
  }

  /* Responsive tables */
  @media (max-width: 768px) {
    .richtext table {
      font-size: var(--font-size-sm);
    }

    .richtext th,
    .richtext td {
      padding: var(--space-2);
    }
  }

  /* Size variants */
  .richtext--small {
    font-size: var(--font-size-sm);
  }

  .richtext--small h1 {
    font-size: var(--font-size-3xl);
  }
  .richtext--small h2 {
    font-size: var(--font-size-2xl);
  }
  .richtext--small h3 {
    font-size: var(--font-size-xl);
  }
  .richtext--small h4 {
    font-size: var(--font-size-lg);
  }
  .richtext--small h5 {
    font-size: var(--font-size-base);
  }
  .richtext--small h6 {
    font-size: var(--font-size-sm);
  }

  .richtext--large {
    font-size: var(--font-size-lg);
  }

  .richtext--large h1 {
    font-size: var(--font-size-6xl);
  }
  .richtext--large h2 {
    font-size: var(--font-size-4xl);
  }
  .richtext--large h3 {
    font-size: var(--font-size-3xl);
  }
  .richtext--large h4 {
    font-size: var(--font-size-2xl);
  }
  .richtext--large h5 {
    font-size: var(--font-size-xl);
  }
  .richtext--large h6 {
    font-size: var(--font-size-lg);
  }

  /* Variant styles */
  .richtext--legal {
    line-height: var(--line-height-relaxed);
  }

  .richtext--legal h1,
  .richtext--legal h2,
  .richtext--legal h3 {
    color: var(--color-info);
    border-bottom: 2px solid var(--color-border);
    padding-bottom: var(--space-2);
  }

  .richtext--legal p {
    text-align: justify;
  }

  .richtext--compact {
    line-height: var(--line-height-normal);
  }

  .richtext--compact h1,
  .richtext--compact h2,
  .richtext--compact h3,
  .richtext--compact h4,
  .richtext--compact h5,
  .richtext--compact h6 {
    margin-top: var(--space-4);
    margin-bottom: var(--space-2);
  }

  .richtext--compact p {
    margin-bottom: var(--space-3);
  }

  /* Print styles */
  @media print {
    .richtext {
      color: var(--color-black);
      background: var(--color-white);
    }

    .richtext__link--external::after {
      content: ' (' attr(href) ')';
      font-size: 0.8em;
      color: var(--color-gray-600);
    }

    .richtext table {
      border-collapse: collapse;
    }

    .richtext th,
    .richtext td {
      border: 1px solid var(--color-black);
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .richtext {
      color: var(--color-black);
    }

    .richtext__link {
      color: #0000ee;
      text-decoration: underline;
    }

    .richtext table,
    .richtext th,
    .richtext td {
      border-color: var(--color-black);
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .richtext__link {
      transition: none;
    }
  }
`;
