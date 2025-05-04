// src/components/BlogDetail/BlogDetail.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import BlogDetail from './BlogDetail.js';

describe('BlogDetail', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      title: 'Test Blog Post',
      content: '<p>This is the blog post content.</p>',
      featuredImage: 'https://via.placeholder.com/800x400',
      publishedDate: '2024-01-15T00:00:00Z',
      author: 'John Doe',
      categories: ['Technology', 'Programming'],
    };
  });

  it('should render correctly with all props', () => {
    const detail = new BlogDetail(defaultProps);
    const element = detail.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('blog-detail')).toBe(true);
    expect(element.querySelector('.blog-detail__title').textContent).toBe(
      defaultProps.title
    );
    expect(element.querySelector('.blog-detail__author').textContent).toContain(
      defaultProps.author
    );
    expect(element.querySelector('.blog-detail__content').innerHTML).toBe(
      defaultProps.content
    );
  });

  it('should render without optional props', () => {
    const minimalProps = {
      title: 'Test Blog Post',
      content: '<p>Content</p>',
    };
    const detail = new BlogDetail(minimalProps);
    const element = detail.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('.blog-detail__title').textContent).toBe(
      minimalProps.title
    );
    expect(element.querySelector('.blog-detail__author')).toBeNull();
    expect(element.querySelector('.blog-detail__image')).toBeNull();
  });

  it('should display categories correctly', () => {
    const detail = new BlogDetail(defaultProps);
    const element = detail.getElement();
    const categories = element.querySelectorAll('.blog-detail__category');

    expect(categories.length).toBe(2);
    expect(categories[0].textContent).toBe('Technology');
    expect(categories[1].textContent).toBe('Programming');
  });

  it('should format date correctly', () => {
    const detail = new BlogDetail(defaultProps);
    const element = detail.getElement();
    const dateElement = element.querySelector('.blog-detail__date');

    expect(dateElement).toBeTruthy();
    expect(dateElement.textContent).toMatch(/January 15, 2024/);
  });
});
