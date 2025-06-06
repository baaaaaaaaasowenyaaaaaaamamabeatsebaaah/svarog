import { css } from '../../utils/styleInjection.js';

export const mapStyles = css`
  /* Map Container */
  .map-container {
    width: 100%;
    height: 400px;
    background-color: var(--color-gray-100, #f8f9fa);
    position: relative;
    overflow: hidden;
    border-radius: var(--border-radius-default, 8px);
    box-shadow: var(--box-shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .map-container--mock {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-gray-100, #f8f9fa);
    border: 2px dashed var(--color-gray-300, #dee2e6);
  }

  /* Info Window Styles */
  .map-info-window {
    font-family: var(
      --font-family,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif
    );
    max-width: 400px;
  }

  .map-info-window--places {
    padding: 0;
  }

  .map-info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .map-info-title {
    font-size: 18px;
    font-weight: 500;
    color: #1a1a1a;
    margin: 0;
    flex: 1;
  }

  .map-info-status {
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
    margin-left: 8px;
  }

  .map-info-status--open {
    background-color: #d4edda;
    color: #155724;
  }

  .map-info-status--closed {
    background-color: #f8d7da;
    color: #721c24;
  }

  .map-info-rating {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }

  .map-info-photos {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
    overflow-x: auto;
  }

  .map-info-photo {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
  }

  .map-info-content {
    font-size: 14px;
  }

  .map-info-content p {
    margin: 4px 0;
    color: #333;
  }

  .map-info-content a {
    color: #1976d2;
    text-decoration: none;
  }

  .map-info-content a:hover {
    text-decoration: underline;
  }

  .map-info-hours-details {
    margin-top: 8px;
  }

  .map-info-hours-details summary {
    cursor: pointer;
    color: #666;
    font-size: 14px;
    padding: 4px 0;
  }

  .map-info-hours {
    margin-top: 8px;
    padding-left: 20px;
    font-size: 13px;
    line-height: 1.6;
    color: #666;
  }

  .map-info-directions {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #eee;
  }

  /* Mock Map Styles */
  .map-mock-overlay {
    text-align: center;
    padding: var(--space-4, 16px);
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: var(--border-radius-default, 8px);
    max-width: 90%;
    width: 400px;
    box-shadow: var(--box-shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
  }

  .map-mock-pin {
    width: 60px;
    height: 60px;
    background-color: var(--color-primary, #007bff);
    border-radius: 50%;
    margin: 0 auto var(--space-3, 12px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .map-mock-pin::after {
    content: '📍';
    font-size: 32px;
  }

  .map-place-id {
    font-family: monospace;
    font-size: 12px;
    color: #666;
    word-break: break-all;
  }

  .map-coords {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .map-container {
      height: 300px;
    }

    .map-info-window {
      max-width: 280px;
    }

    .map-info-photos {
      margin-bottom: 8px;
    }

    .map-info-photo {
      width: 100px;
      height: 70px;
    }
  }
`;
