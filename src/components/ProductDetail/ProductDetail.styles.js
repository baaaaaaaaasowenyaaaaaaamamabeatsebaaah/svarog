// src/components/ProductDetail/ProductDetail.styles.js
import { css } from '../../utils/styleInjection.js';

export const productDetailStyles = css`
  .product-detail {
    max-width: var(--product-detail-max-width, 1200px);
    margin: 0 auto;
    padding: var(--product-detail-padding, 1rem);
    background: var(--product-detail-bg, transparent);
    border-radius: var(--product-detail-radius, 0);
  }

  /* Grid wrapper */
  .product-detail__grid {
    /* Grid gap is handled by the Grid component directly */
  }

  /* Right column content wrapper */
  .product-detail__right-column {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* Gallery Section */
  .product-detail__gallery {
    position: relative;
    width: 100%;
  }

  .product-detail__gallery--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: var(--product-detail-gallery-height, 400px);
    background: var(--color-gray-50, #f9fafb);
    border-radius: var(--radius-lg, 0.5rem);
    border: 2px dashed var(--color-gray-300, #d1d5db);
  }

  .product-detail__no-image {
    color: var(--color-text-light, #6b7280);
    font-size: var(--font-size-lg, 1.125rem);
    text-align: center;
  }

  .product-detail__image-slider {
    width: 100%;
    --image-slider-height: var(--product-detail-gallery-height, 400px);
    --image-slider-bg: var(--color-gray-50, #f9fafb);
    --image-slider-radius: var(--radius-lg, 0.5rem);
  }

  /* Info Section */
  .product-detail__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-4, 1rem);
    margin-bottom: var(--space-6, 1.5rem);
  }

  /* Meta Section (Category and Tags) */
  .product-detail__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2, 0.5rem);
    align-items: center;
    margin-bottom: var(--space-2, 0.5rem);
  }

  .product-detail__category {
    margin-right: var(--space-3, 0.75rem);
  }

  .product-detail__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1, 0.25rem);
  }

  /* Title */
  .product-detail__title {
    margin: 0 0 var(--space-3, 0.75rem) 0;
    color: var(--product-detail-title-color, var(--color-text, #1f2937));
    font-size: var(--product-detail-title-size, var(--font-size-3xl, 1.875rem));
    font-weight: var(
      --product-detail-title-weight,
      var(--font-weight-bold, 700)
    );
    line-height: var(--product-detail-title-line-height, 1.2);
  }

  /* Content */
  .product-detail__content {
    color: var(
      --product-detail-content-color,
      var(--color-text-secondary, #4b5563)
    );
    font-size: var(--product-detail-content-size, var(--font-size-base, 1rem));
    line-height: var(--product-detail-content-line-height, 1.6);
    margin-bottom: var(--space-4, 1rem);
  }

  .product-detail__content p {
    margin-bottom: var(--space-3, 0.75rem);
  }

  .product-detail__content p:last-child {
    margin-bottom: 0;
  }

  /* Purchase Section - improved positioning */
  .product-detail__purchase {
    background: var(--product-detail-purchase-bg, white);
    border: 1px solid
      var(--product-detail-purchase-border, var(--color-gray-200, #e5e7eb));
    border-radius: var(
      --product-detail-purchase-radius,
      var(--radius-lg, 0.5rem)
    );
    padding: var(--space-6, 1.5rem);
    margin-bottom: var(--space-6, 1.5rem);
    box-shadow: var(
      --product-detail-purchase-shadow,
      0 1px 3px rgba(0, 0, 0, 0.1)
    );
  }

  /* Price */
  .product-detail__price {
    margin-bottom: var(--space-3, 0.75rem);
    text-align: left;
  }

  .product-detail__price .price-display__value {
    font-size: var(--product-detail-price-size, var(--font-size-3xl, 1.875rem));
    font-weight: var(
      --product-detail-price-weight,
      var(--font-weight-bold, 700)
    );
    color: var(--product-detail-price-color, var(--color-text, #1f2937));
  }

  .product-detail__price-info {
    margin: var(--space-1, 0.25rem) 0 var(--space-4, 1rem) 0;
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text-light, #6b7280);
  }

  /* Actions */
  .product-detail__actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 0.75rem);
  }

  .product-detail__primary-button {
    width: 100%;
    justify-content: center;
    font-size: var(--font-size-lg, 1.125rem);
    font-weight: var(--font-weight-semibold, 600);
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
  }

  .product-detail__additional-button {
    width: 100%;
    justify-content: center;
  }

  /* Specifications - moved to bottom */
  .product-detail__specifications {
    background: var(--product-detail-specs-bg, var(--color-gray-50, #f9fafb));
    border: 1px solid
      var(--product-detail-specs-border, var(--color-gray-200, #e5e7eb));
    border-radius: var(
      --product-detail-specs-radius,
      var(--radius-md, 0.375rem)
    );
    padding: var(--space-4, 1rem);
    margin-top: auto; /* Push to bottom of flex container */
  }

  .product-detail__specs-title {
    margin: 0 0 var(--space-3, 0.75rem) 0;
    color: var(--color-text, #1f2937);
    font-size: var(--font-size-lg, 1.125rem);
    font-weight: var(--font-weight-semibold, 600);
  }

  .product-detail__specs-list {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-2, 0.5rem) var(--space-4, 1rem);
    margin: 0;
  }

  .product-detail__spec-term {
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #1f2937);
    margin: 0;
    padding: var(--space-1, 0.25rem) 0;
  }

  .product-detail__spec-definition {
    color: var(--color-text-secondary, #4b5563);
    margin: 0;
    padding: var(--space-1, 0.25rem) 0;
  }

  /* Loading State */
  .product-detail--loading {
    opacity: 0.7;
    pointer-events: none;
  }

  .product-detail--loading .product-detail__gallery::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  /* Disabled State */
  .product-detail--disabled {
    opacity: 0.6;
  }

  .product-detail--disabled .product-detail__actions {
    pointer-events: none;
  }

  /* Mobile Responsive */
  @media (max-width: 767px) {
    .product-detail {
      padding: var(--space-3, 0.75rem);
    }

    /* Override grid gap for mobile */
    .product-detail__grid .grid {
      gap: 1rem !important;
    }

    .product-detail__title {
      font-size: var(--font-size-2xl, 1.5rem);
    }

    .product-detail__price .price-display__value {
      font-size: var(--font-size-2xl, 1.5rem);
    }

    .product-detail__purchase {
      padding: var(--space-4, 1rem);
      margin-bottom: var(--space-4, 1rem);
    }

    .product-detail__specs-list {
      grid-template-columns: 1fr;
      gap: var(--space-1, 0.25rem);
    }

    .product-detail__spec-term {
      font-weight: var(--font-weight-semibold, 600);
      border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
      padding-bottom: var(--space-1, 0.25rem);
    }

    .product-detail__spec-definition {
      padding-bottom: var(--space-2, 0.5rem);
      margin-bottom: var(--space-2, 0.5rem);
    }
  }

  /* Tablet Responsive */
  @media (min-width: 768px) and (max-width: 1023px) {
    /* Override grid gap for tablet */
    .product-detail__grid .grid {
      gap: 1.5rem !important;
    }

    .product-detail__purchase {
      padding: var(--space-5, 1.25rem);
    }
  }

  /* Desktop Responsive */
  @media (min-width: 1024px) {
    .product-detail {
      padding: var(--space-6, 1.5rem);
    }

    .product-detail__image-slider {
      --image-slider-height: 500px;
    }

    /* Sticky purchase section on desktop for better UX */
    .product-detail__purchase {
      position: sticky;
      top: var(--product-detail-sticky-top, 2rem);
    }
  }

  /* Print Styles */
  @media print {
    .product-detail__purchase {
      position: static;
      box-shadow: none;
      border: 1px solid #ccc;
    }

    .product-detail__actions {
      display: none;
    }
  }

  /* High Contrast Mode */
  @media (prefers-contrast: high) {
    .product-detail__purchase {
      border: 2px solid;
    }

    .product-detail__specifications {
      border: 2px solid;
    }
  }

  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .product-detail__purchase {
      position: static;
    }

    * {
      transition: none !important;
      animation: none !important;
    }
  }

  /* Focus Management */
  .product-detail:focus-within .product-detail__purchase {
    border-color: var(--color-primary, #3b82f6);
  }

  /* Theme Variants */
  .product-detail--compact {
    --product-detail-gap: 1rem;
    --product-detail-padding: 0.5rem;
    --space-6: 1rem;
  }

  .product-detail--spacious {
    --product-detail-gap: 3rem;
    --product-detail-padding: 2rem;
    --space-6: 2rem;
  }
`;
