// src/components/ProductGrid/ProductGrid.styles.js
import { css } from '../../utils/styleInjection.js';

export const productGridStyles = css`
  /* Container */
  .product-grid {
    width: 100%;
  }

  /* Filters - minimal styling, let tags handle their own appearance */
  .product-grid__filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2, 0.5rem);
    margin-bottom: var(--space-6, 1.5rem);
  }

  /* Grid */
  .product-grid__grid {
    position: relative;
    min-height: 200px;
  }

  /* Column animations */
  .product-grid__column {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .product-grid__column--entering {
    opacity: 0;
    transform: translateY(20px);
  }

  /* Product card in grid */
  .product-grid__card {
    height: 100%;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  /* Skeleton loader */
  .product-grid__skeleton {
    background: var(--color-white, #fff);
    border-radius: var(--radius-lg, 0.5rem);
    padding: var(--space-4, 1rem);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    height: 100%;
    min-height: 400px;
  }

  .skeleton__image {
    width: 100%;
    height: 200px;
    background: linear-gradient(
      90deg,
      var(--color-gray-200, #e5e7eb) 25%,
      var(--color-gray-100, #f3f4f6) 50%,
      var(--color-gray-200, #e5e7eb) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: var(--radius-md, 0.375rem);
    margin-bottom: var(--space-4, 1rem);
  }

  .skeleton__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 0.75rem);
  }

  .skeleton__title {
    height: 24px;
    background: linear-gradient(
      90deg,
      var(--color-gray-200, #e5e7eb) 25%,
      var(--color-gray-100, #f3f4f6) 50%,
      var(--color-gray-200, #e5e7eb) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: var(--radius-sm, 0.25rem);
    width: 80%;
  }

  .skeleton__specs {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 0.5rem);
    margin: var(--space-2, 0.5rem) 0;
  }

  .skeleton__spec-line {
    height: 16px;
    background: linear-gradient(
      90deg,
      var(--color-gray-200, #e5e7eb) 25%,
      var(--color-gray-100, #f3f4f6) 50%,
      var(--color-gray-200, #e5e7eb) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: var(--radius-sm, 0.25rem);
  }

  .skeleton__spec-line--short {
    width: 60%;
  }

  .skeleton__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: var(--space-3, 0.75rem);
  }

  .skeleton__price {
    width: 80px;
    height: 32px;
    background: linear-gradient(
      90deg,
      var(--color-gray-200, #e5e7eb) 25%,
      var(--color-gray-100, #f3f4f6) 50%,
      var(--color-gray-200, #e5e7eb) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: var(--radius-sm, 0.25rem);
  }

  .skeleton__button {
    width: 100px;
    height: 40px;
    background: linear-gradient(
      90deg,
      var(--color-gray-200, #e5e7eb) 25%,
      var(--color-gray-100, #f3f4f6) 50%,
      var(--color-gray-200, #e5e7eb) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: var(--radius-md, 0.375rem);
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* Sentinel for infinite scroll */
  .product-grid__sentinel {
    height: 1px;
    margin: var(--space-8, 2rem) 0;
  }

  .product-grid__sentinel--loading {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-grid__sentinel--loading::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-gray-200, #e5e7eb);
    border-top-color: var(--color-primary, #0066cc);
    border-radius: 50%;
    animation: sentinel-spin 0.8s linear infinite;
  }

  @keyframes sentinel-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .product-grid__filters {
      gap: var(--space-1, 0.25rem);
    }

    .skeleton__image {
      height: 150px;
    }

    .product-grid__skeleton {
      min-height: 350px;
    }
  }

  /* Dark theme support */
  @media (prefers-color-scheme: dark) {
    .product-grid__skeleton {
      background: var(--color-gray-800, #1f2937);
    }

    .skeleton__image,
    .skeleton__title,
    .skeleton__spec-line,
    .skeleton__price,
    .skeleton__button {
      background: linear-gradient(
        90deg,
        var(--color-gray-700, #374151) 25%,
        var(--color-gray-600, #4b5563) 50%,
        var(--color-gray-700, #374151) 75%
      );
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s ease-in-out infinite;
    }
  }
`;
