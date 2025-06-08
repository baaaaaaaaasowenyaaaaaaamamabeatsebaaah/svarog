// src/components/Map/Map.styles.js
import { css } from '../../utils/styleInjection.js';

export const mapStyles = css`
  /* ===== EXISTING WORKING STYLES ===== */
  .map-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
    background-color: #f8f9fa;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--color-border-medium);
    /* Ensure the container can grow to fill parent */
    flex: 1;
    /* For cases where parent uses CSS Grid */
    align-self: stretch;
    justify-self: stretch;
  }

  .map-container--mock {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border: 2px dashed #dee2e6;
  }

  .map-container--live {
    background-color: #e9ecef;
  }

  /* Ensure Google Maps gets full size */
  .map-container--live > div {
    width: 100% !important;
    height: 100% !important;
  }

  /* ===== OPTIONAL CSS CLASSES FOR FUTURE USE ===== */
  /* These can be used to replace inline styles gradually */

  /* Loading state classes */
  .map-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.9);
    padding: 16px 24px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .map-loading__icon {
    font-size: 24px;
    margin-bottom: 8px;
    animation: map-pulse 2s ease-in-out infinite;
  }

  .map-loading__text {
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  @keyframes map-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Mock map classes */
  .map-mock {
    text-align: center;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .map-mock__icon {
    font-size: 32px;
    margin-bottom: 16px;
    display: block;
  }

  .map-mock__title {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 500;
    color: #1a1a1a;
  }

  .map-mock__coordinates {
    margin: 4px 0;
    color: #666;
    font-size: 12px;
    font-family: monospace;
  }

  .map-mock__info {
    margin: 8px 0;
    font-size: 14px;
    color: #333;
  }

  .map-mock__notice {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #eee;
    font-size: 12px;
  }

  .map-mock__notice-title {
    margin: 0;
    font-weight: 500;
    color: #666;
  }

  .map-mock__notice-subtitle {
    color: #999;
    margin-top: 4px;
  }

  /* Info window classes */
  .map-info {
    font-family: Arial, sans-serif;
    max-width: 300px;
    line-height: 1.4;
  }

  .map-info__title {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
  }

  .map-info__item {
    margin: 4px 0;
    font-size: 14px;
    color: #333;
  }

  .map-info__link {
    color: #1976d2;
    text-decoration: none;
  }

  .map-info__link:hover {
    text-decoration: underline;
  }

  /* ===== RESPONSIVE DESIGN ===== */
  @media (max-width: 768px) {
    .map-container {
      height: 300px;
    }

    .map-mock {
      max-width: 95%;
      padding: 16px;
    }

    .map-info {
      max-width: 280px;
    }

    .map-loading {
      padding: 12px 16px;
    }
  }

  @media (max-width: 480px) {
    .map-container {
      height: 250px;
      border-radius: 4px;
    }

    .map-mock__title {
      font-size: 16px;
    }

    .map-info {
      max-width: 260px;
    }
  }

  /* ===== ACCESSIBILITY ===== */

  /* Focus states */
  .map-container:focus-within {
    outline: 2px solid #4285f4;
    outline-offset: 2px;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .map-loading__icon {
      animation: none;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .map-container {
      border-width: 2px;
    }

    .map-info__link {
      text-decoration: underline;
    }
  }

  /* Print styles */
  @media print {
    .map-container {
      border: 2px solid #000;
      background: #fff;
    }

    .map-container--live::after {
      content: 'Interactive map - visit online version';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border: 1px solid #000;
      font-size: 14px;
    }
  }
`;
