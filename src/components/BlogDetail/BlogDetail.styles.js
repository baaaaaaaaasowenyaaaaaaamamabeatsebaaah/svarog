import { css } from '../../utils/styleInjection.js';

export const blogDetailStyles = css`
  .blog-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-6) var(--space-4);
  }

  .blog-detail__header {
    margin-bottom: var(--space-6);
    text-align: center;
  }

  .blog-detail__title {
    margin-bottom: var(--space-4);
    font-size: var(--font-size-4xl);
    line-height: 1.2;
  }

  .blog-detail__meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--space-3);
    color: var(--color-text-light);
    font-size: var(--font-size-sm);
  }

  .blog-detail__author::after {
    content: '•';
    margin-left: var(--space-3);
  }

  .blog-detail__categories {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .blog-detail__category {
    color: var(--color-primary);
  }

  .blog-detail__image-container {
    margin: var(--space-6) 0;
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  .blog-detail__image {
    width: 100%;
    height: auto;
    display: block;
  }

  .blog-detail__content {
    font-size: var(--font-size-lg);
    line-height: 1.7;
    color: var(--color-text);
  }

  /* Content typography */
  .blog-detail__content h2 {
    margin-top: var(--space-8);
    margin-bottom: var(--space-4);
    font-size: var(--font-size-2xl);
  }

  .blog-detail__content h3 {
    margin-top: var(--space-6);
    margin-bottom: var(--space-3);
    font-size: var(--font-size-xl);
  }

  .blog-detail__content p {
    margin-bottom: var(--space-4);
  }

  .blog-detail__content a {
    color: var(--color-primary);
    text-decoration: underline;
  }

  .blog-detail__content a:hover {
    color: var(--color-primary-dark);
  }

  .blog-detail__content img {
    max-width: 100%;
    height: auto;
    margin: var(--space-6) 0;
    border-radius: var(--border-radius);
  }

  .blog-detail__content blockquote {
    border-left: 4px solid var(--color-primary);
    padding-left: var(--space-4);
    margin: var(--space-6) 0;
    font-style: italic;
    color: var(--color-text-light);
  }

  .blog-detail__content ul,
  .blog-detail__content ol {
    margin: var(--space-4) 0;
    padding-left: var(--space-6);
  }

  .blog-detail__content li {
    margin-bottom: var(--space-2);
  }

  .blog-detail__content code {
    background-color: var(--color-bg-secondary);
    padding: var(--space-1);
    border-radius: var(--border-radius-sm);
    font-family: var(--font-family-mono);
    font-size: 0.9em;
  }

  .blog-detail__content pre {
    background-color: var(--color-bg-secondary);
    padding: var(--space-4);
    border-radius: var(--border-radius);
    overflow-x: auto;
    margin: var(--space-6) 0;
  }

  .blog-detail__content pre code {
    background-color: transparent;
    padding: 0;
  }

  /* Error state */
  .blog-detail--error {
    padding: var(--space-4);
    text-align: center;
    color: var(--color-text-light);
    border: 1px solid var(--color-error, #ff6b6b);
    border-radius: var(--border-radius);
    background-color: var(--color-error-bg, #fff5f5);
  }

  .blog-detail__content--error {
    color: var(--color-error, #ff6b6b);
    font-style: italic;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .blog-detail {
      padding: var(--space-4) var(--space-3);
    }

    .blog-detail__title {
      font-size: var(--font-size-3xl);
    }

    .blog-detail__content {
      font-size: var(--font-size-base);
    }
  }
`;
