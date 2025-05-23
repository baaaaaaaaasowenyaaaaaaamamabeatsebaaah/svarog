// src/components/BlogCard/BlogCard.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import BlogCard from './BlogCard.js';

describe('BlogCard', () => {
  let defaultProps;
  let consoleWarnSpy;

  beforeEach(() => {
    defaultProps = {
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      excerpt: 'This is a test blog post excerpt.',
      imageUrl: 'https://via.placeholder.com/300x200',
      publishedDate: '2024-01-15T00:00:00Z',
      author: 'John Doe',
      categories: ['Technology', 'Programming'],
    };

    // Spy on console.warn to test deprecation warnings
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should render correctly with all props', () => {
    const card = BlogCard(defaultProps);
    const element = card.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('blog-card')).toBe(true);
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

  it('should throw an error when required props are missing', () => {
    expect(() => BlogCard({})).toThrow('BlogCard: title is required');
    expect(() => BlogCard({ title: 'Title Only' })).toThrow(
      'BlogCard: slug is required'
    );
    expect(() => BlogCard({ slug: 'slug-only' })).toThrow(
      'BlogCard: title is required'
    );
  });

  it('should throw an error when props have incorrect types', () => {
    expect(() =>
      BlogCard({
        title: 42,
        slug: 'test-slug',
      })
    ).toThrow('BlogCard: title must be a string');

    expect(() =>
      BlogCard({
        title: 'Test Title',
        slug: 'test-slug',
        categories: 'not an array',
      })
    ).toThrow('BlogCard: categories must be an array');
  });

  it('should render with minimal required props', () => {
    const minimalProps = {
      title: 'Test Blog Post',
      slug: 'test-blog-post',
    };
    const card = BlogCard(minimalProps);
    const element = card.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('.blog-card__title').textContent).toBe(
      minimalProps.title
    );
    expect(element.querySelector('.blog-card__author')).toBeNull();
    expect(element.querySelector('.blog-card__image')).toBeNull();
  });

  it('should create correct links', () => {
    const card = BlogCard(defaultProps);
    const element = card.getElement();
    const links = element.querySelectorAll('a[href="/blog/test-blog-post"]');

    expect(links.length).toBeGreaterThan(0);
  });

  it('should display categories correctly', () => {
    const card = BlogCard(defaultProps);
    const element = card.getElement();
    const categories = element.querySelectorAll('.blog-card__category');

    expect(categories.length).toBe(2);
    expect(categories[0].textContent).toBe('Technology');
    expect(categories[1].textContent).toBe('Programming');
  });

  it('should update the card with new props', () => {
    const card = BlogCard(defaultProps);
    const element = card.getElement();

    // Create a parent node for testing replacement
    const parent = document.createElement('div');
    parent.appendChild(element);

    const updatedCard = card.update({
      title: 'Updated Title',
      author: 'Jane Smith',
    });

    const updatedElement = updatedCard.getElement();
    expect(updatedElement.querySelector('.blog-card__title').textContent).toBe(
      'Updated Title'
    );
    expect(
      updatedElement.querySelector('.blog-card__author').textContent
    ).toContain('Jane Smith');
  });

  // Test for props standardization
  describe('Props Standardization', () => {
    it('should work with new imageUrl prop', () => {
      const card = BlogCard(defaultProps);
      const element = card.getElement();
      const image = element.querySelector('.blog-card__image');

      expect(image).toBeTruthy();
      expect(image.src).toBe(defaultProps.imageUrl);
    });

    it('should migrate featuredImage to imageUrl with deprecation warning', () => {
      const legacyProps = {
        ...defaultProps,
        featuredImage: 'https://via.placeholder.com/400x300',
      };
      delete legacyProps.imageUrl;

      const card = BlogCard(legacyProps);
      const element = card.getElement();
      const image = element.querySelector('.blog-card__image');

      // Should use the featuredImage value
      expect(image).toBeTruthy();
      expect(image.src).toBe(legacyProps.featuredImage);

      // Should show deprecation warning
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[BlogCard] featuredImage is deprecated, use imageUrl instead'
      );
    });

    it('should prefer imageUrl over featuredImage when both are provided', () => {
      const mixedProps = {
        ...defaultProps,
        imageUrl: 'https://via.placeholder.com/300x200',
        featuredImage: 'https://via.placeholder.com/400x300',
      };

      const card = BlogCard(mixedProps);
      const element = card.getElement();
      const image = element.querySelector('.blog-card__image');

      // Should use imageUrl and not show warning
      expect(image.src).toBe(mixedProps.imageUrl);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should validate imageUrl prop type correctly', () => {
      expect(() =>
        BlogCard({
          title: 'Test Title',
          slug: 'test-slug',
          imageUrl: 42,
        })
      ).toThrow('BlogCard: imageUrl must be a string');
    });
  });
});
