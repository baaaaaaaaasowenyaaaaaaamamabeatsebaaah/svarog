import { css } from '../../utils/styleInjection.js';

export const blogListStyles = css`
  .blog-list {
    padding: var(--space-6) 0;
  }

  .blog-list__title {
    margin-bottom: var(--space-6);
    text-align: center;
  }

  .blog-list__grid {
    margin: 0 auto;
  }

  .blog-list__no-posts {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-8) var(--space-4);
    background-color: var(--color-bg-secondary);
    border-radius: var(--border-radius);
    color: var(--color-text-light);
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .blog-list__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .blog-list__grid {
      grid-template-columns: 1fr;
    }

    .blog-list {
      padding: var(--space-4) 0;
    }

    .blog-list__title {
      margin-bottom: var(--space-4);
    }
  }
`;
