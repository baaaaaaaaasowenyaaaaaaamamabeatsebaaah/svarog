import { css } from '../../utils/styleInjection.js';

export const blogCardStyles = css`
  .blog-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    transition:
      transform 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
  }

  .blog-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .blog-card__image-container {
    width: 100%;
    padding-top: 56.25%; /* 16:9 aspect ratio */
    position: relative;
    overflow: hidden;
  }

  .blog-card__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
  }

  .blog-card:hover .blog-card__image {
    transform: scale(1.05);
  }

  .blog-card__title-link {
    text-decoration: none;
    color: inherit;
  }

  .blog-card__title-link:hover {
    text-decoration: none;
  }

  .blog-card__title {
    margin: 0 0 var(--space-2) 0;
    font-size: var(--font-size-xl);
    line-height: 1.3;
    color: var(--color-text);
  }

  .blog-card__meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
  }

  .blog-card__author::after {
    content: '•';
    margin-left: var(--space-3);
  }

  .blog-card__excerpt {
    margin: 0 0 var(--space-3) 0;
    color: var(--color-text-light);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-card__categories {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  .blog-card__category {
    display: inline-block;
    padding: var(--space-1) var(--space-2);
    background-color: var(--color-bg-secondary);
    color: var(--color-text-light);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
  }

  .blog-card__read-more {
    margin-top: auto;
  }
`;
