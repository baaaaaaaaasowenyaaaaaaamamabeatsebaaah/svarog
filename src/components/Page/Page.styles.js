// src/components/Page/Page.styles.js
import { css } from '../../utils/styleInjection.js';

export const pageStyles = css`
  /* Page Container - Clean wrapper with minimal structure */
  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Skip Link for Accessibility - Hidden by default, visible on focus */
  .page__skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px 12px;
    text-decoration: none;
    z-index: 9999;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    transition: top 0.3s;
  }

  .page__skip-link:focus {
    top: 6px;
  }

  /* Header Section - No spacing, just structure */
  .page__header {
    flex-shrink: 0;
  }

  /* Main Content Section - Flexible, no padding imposed */
  .page__main {
    flex: 1;
    min-height: 50vh;
  }

  /* Footer Section - No spacing, just structure */
  .page__footer {
    flex-shrink: 0;
    margin-top: auto;
  }

  /* Loading State - Centered with minimal styling */
  .page__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
  }

  .page__loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: page-spinner 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes page-spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .page__loading-text {
    color: #666;
    font-size: 1rem;
    margin: 0;
  }

  /* Error State - Self-contained with own spacing */
  .page__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    padding: 2rem;
    text-align: center;
    background: #fff5f5;
    border: 1px solid #fed7d7;
    border-radius: 8px;
    margin: 1rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .page__error-title {
    color: #e53e3e;
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    font-weight: bold;
  }

  .page__error-message {
    color: #666;
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
    line-height: 1.5;
  }

  .page__error-code {
    color: #a0a0a0;
    font-size: 0.875rem;
    margin: 0 0 1.5rem 0;
    font-family: monospace;
  }

  .page__error-retry {
    background: #e53e3e;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .page__error-retry:hover {
    background: #c53030;
  }

  .page__error-retry:focus {
    outline: 2px solid #e53e3e;
    outline-offset: 2px;
  }

  /* Responsive Design - Minimal adjustments */
  @media (max-width: 768px) {
    .page__loading,
    .page__error {
      min-height: 40vh;
      padding: 1rem;
      margin: 0.5rem;
    }

    .page__error-title {
      font-size: 1.25rem;
    }

    .page__skip-link {
      font-size: 12px;
      padding: 6px 10px;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .page__loading-spinner {
      border-color: currentColor;
      border-top-color: transparent;
    }

    .page__error {
      border-color: currentColor;
    }

    .page__skip-link {
      background: #000;
      color: #fff;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .page__loading-spinner {
      animation: none;
      border: 4px solid #007bff;
    }

    .page__error-retry,
    .page__skip-link {
      transition: none;
    }
  }

  /* Dark Mode Support */
  @media (prefers-color-scheme: dark) {
    .page__loading-text {
      color: #a0a0a0;
    }

    .page__loading-spinner {
      border-color: #333;
      border-top-color: #007bff;
    }

    .page__error {
      background: #2d1b1b;
      border-color: #744444;
      color: #e2e8f0;
    }

    .page__error-title {
      color: #f56565;
    }

    .page__error-message {
      color: #a0a0a0;
    }

    .page__error-code {
      color: #666;
    }

    .page__skip-link {
      background: #fff;
      color: #000;
    }
  }

  /* Print Styles */
  @media print {
    .page__skip-link,
    .page__loading,
    .page__error-retry {
      display: none;
    }

    .page {
      min-height: auto;
    }

    .page__header,
    .page__footer {
      position: static;
    }
  }
`;
