import { css } from '../../utils/styleInjection.js';

export const productCardStyles = css`
  /* Base product card */
  .product-card {
    border: none;
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .product-card:hover {
    transform: translateY(var(--space-1, -4px));
  }

  /* Override card content padding */
  .product-card .card__content {
    padding: 0;
  }

  /* Product image using Image component */
  .product-card__image {
    width: 100%;
    height: 200px;
    margin-bottom: var(--space-3, 12px);
  }

  .product-card__image .image-element {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: var(--color-gray-50, #f9fafb);
    padding: var(--space-2, 8px);
  }

  /* Content container */
  .product-card__content-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 12px);
  }

  /* Product specifications */
  .product-card__specs {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 4px);
  }

  .product-card__spec-item {
    font-size: var(--font-size-base, 16px);
    display: flex;
    justify-content: space-between;
  }

  .product-card__spec-label {
    color: var(--color-text-light, #6c757d);
    flex-shrink: 0;
    margin-right: var(--space-2, 8px);
  }

  .product-card__spec-value {
    text-align: right;
    font-weight: var(--font-weight-medium, 500);
  }

  /* Actions section */
  .product-card__actions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2, 8px);
  }

  /* Price display integration */
  .product-card__price-display {
    align-self: end;
    background-color: transparent;
    border: none;
    padding: 0;
    margin-top: 0;
  }

  .product-card__price-display .price-display__label {
    display: none; /* Hide label in product card context */
  }

  .product-card__price-display .price-display__value {
    font-size: var(--font-size-4xl, 24px);
  }

  .price-display--loading {
    font-size: var(--font-size-base, 16px);
  }

  /* Price info styling */
  .product-card__price-info {
    font-size: var(--font-size-sm, 14px);
    color: var(--color-text-secondary, #6b7280);
    text-align: right;
    margin-top: calc(var(--space-1) * -1); /* Pull closer to price */
    margin-bottom: var(--space-1, 4px);
  }

  /* Grid display for product cards */
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-10, 40px);
    width: 100%;
  }

  /* Product card wrapper */
  .product-card-wrapper {
    display: flex;
    flex-direction: column;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .product-card__actions {
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-2, 8px);
    }

    .product-card__price-display {
      width: 100%;
      text-align: center;
      margin-bottom: var(--space-2, 8px);
    }

    .product-card__price-info {
      text-align: center;
    }
  }

  @media (max-width: 992px) {
    .product-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
  }

  @media (max-width: 576px) {
    .product-grid {
      grid-template-columns: 1fr;
    }
  }
`;
