// src/components/BlogCard/BlogCard.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import BlogCard from './BlogCard.js';

describe('BlogCard', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      excerpt: 'This is a test blog post excerpt.',
      featuredImage: 'https://via.placeholder.com/300x200',
      publishedDate: '2024-01-15T00:00:00Z',
      author: 'John Doe',
      categories: ['Technology', 'Programming'],
    };
  });

  it('should render correctly with all props', () => {
    const card = new BlogCard(defaultProps);
    const element = card.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('card')).toBe(true);
    expect(element.querySelector('.blog-card__title').textContent).toBe(
      defaultProps.title
    );
    expect(element.querySelector('.blog-card__author').textContent).toContain(
      defaultProps.author
    );
    expect(element.querySelector('.blog-card__excerpt').textContent).toBe(
      defaultProps.excerpt
    );
  });

  it('should render without optional props', () => {
    const minimalProps = {
      title: 'Test Blog Post',
      slug: 'test-blog-post',
    };
    const card = new BlogCard(minimalProps);
    const element = card.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('.blog-card__title').textContent).toBe(
      minimalProps.title
    );
    expect(element.querySelector('.blog-card__author')).toBeNull();
    expect(element.querySelector('.blog-card__image')).toBeNull();
  });

  it('should create correct links', () => {
    const card = new BlogCard(defaultProps);
    const element = card.getElement();
    const links = element.querySelectorAll('a[href="/blog/test-blog-post"]');

    expect(links.length).toBeGreaterThan(0);
  });

  it('should display categories correctly', () => {
    const card = new BlogCard(defaultProps);
    const element = card.getElement();
    const categories = element.querySelectorAll('.blog-card__category');

    expect(categories.length).toBe(2);
    expect(categories[0].textContent).toBe('Technology');
    expect(categories[1].textContent).toBe('Programming');
  });
});
