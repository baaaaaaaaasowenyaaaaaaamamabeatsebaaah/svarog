import { css } from '../../utils/styleInjection.js';

export const paginationStyles = css`
  .pagination {
    display: flex;
    justify-content: center;
    margin: var(--space-8) 0;
  }

  .pagination__list {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .pagination__item {
    display: flex;
  }

  .pagination__button {
    min-width: 40px;
    height: 40px;
    padding: var(--space-2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination__button--active {
    pointer-events: none;
  }

  .pagination__button--prev,
  .pagination__button--next {
    min-width: auto;
    padding: var(--space-2) var(--space-3);
  }

  .pagination__dots {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    color: var(--color-text-light);
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .pagination__button--prev span,
    .pagination__button--next span {
      display: none;
    }

    .pagination__button--prev::after {
      content: '←';
    }

    .pagination__button--next::after {
      content: '→';
    }
  }
`;
