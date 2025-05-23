// src/components/BlogDetail/BlogDetail.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import BlogDetail from './BlogDetail.js';

describe('BlogDetail', () => {
  let defaultProps;
  let consoleSpy;

  beforeEach(() => {
    defaultProps = {
      title: 'Test Blog Post',
      content: '<p>This is the blog post content.</p>',
      imageUrl: 'https://via.placeholder.com/800x400',
      publishedDate: '2024-01-15T00:00:00Z',
      author: 'John Doe',
      categories: ['Technology', 'Programming'],
    };

    // Spy on console.warn for deprecated props
    consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should render correctly with all props', () => {
    const detail = BlogDetail(defaultProps);
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
    expect(
      element.querySelector('.blog-detail__image').getAttribute('src')
    ).toBe(defaultProps.imageUrl);
  });

  it('should render without optional props', () => {
    const minimalProps = {
      title: 'Test Blog Post',
      content: '<p>Content</p>',
    };
    const detail = BlogDetail(minimalProps);
    const element = detail.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('.blog-detail__title').textContent).toBe(
      minimalProps.title
    );
    expect(element.querySelector('.blog-detail__author')).toBeNull();
    expect(element.querySelector('.blog-detail__image')).toBeNull();
  });

  it('should support legacy featuredImage prop', () => {
    const legacyProps = {
      title: 'Legacy Post',
      content: '<p>Content</p>',
      featuredImage: 'https://via.placeholder.com/800x400',
    };

    const detail = BlogDetail(legacyProps);
    const element = detail.getElement();

    expect(element.querySelector('.blog-detail__image')).not.toBeNull();
    expect(
      element.querySelector('.blog-detail__image').getAttribute('src')
    ).toBe(legacyProps.featuredImage);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[BlogDetail] featuredImage is deprecated, use imageUrl instead'
    );
  });

  it('should prioritize imageUrl over featuredImage when both are provided', () => {
    const bothProps = {
      title: 'Test Post',
      content: '<p>Content</p>',
      imageUrl: 'https://via.placeholder.com/new-image',
      featuredImage: 'https://via.placeholder.com/old-image',
    };

    const detail = BlogDetail(bothProps);
    const element = detail.getElement();

    expect(
      element.querySelector('.blog-detail__image').getAttribute('src')
    ).toBe(bothProps.imageUrl);
  });

  it('should display categories correctly', () => {
    const detail = BlogDetail(defaultProps);
    const element = detail.getElement();
    const categories = element.querySelectorAll('.blog-detail__category');

    expect(categories.length).toBe(2);
    expect(categories[0].textContent).toBe('Technology');
    expect(categories[1].textContent).toBe('Programming');
  });

  it('should format date correctly', () => {
    const detail = BlogDetail(defaultProps);
    const element = detail.getElement();
    const dateElement = element.querySelector('.blog-detail__date');

    expect(dateElement).toBeTruthy();
    expect(dateElement.textContent).toMatch(/January 15, 2024/);
  });

  it('should update the blog detail with new props', () => {
    const detail = BlogDetail(defaultProps);
    const element = detail.getElement();

    // Create a parent node for testing replacement
    const parent = document.createElement('div');
    parent.appendChild(element);

    const updatedDetail = detail.update({
      title: 'Updated Title',
      author: 'Jane Smith',
    });

    const updatedElement = updatedDetail.getElement();
    expect(
      updatedElement.querySelector('.blog-detail__title').textContent
    ).toBe('Updated Title');
    expect(
      updatedElement.querySelector('.blog-detail__author').textContent
    ).toContain('Jane Smith');
  });

  it('should handle invalid props gracefully', () => {
    const invalidProps = {
      title: 42, // Should be string
      categories: 'not an array',
    };

    expect(() => {
      BlogDetail(invalidProps);
    }).not.toThrow(); // Should recover gracefully with error element

    const detail = BlogDetail(invalidProps);
    const element = detail.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('blog-detail--error')).toBe(true);
  });
});
