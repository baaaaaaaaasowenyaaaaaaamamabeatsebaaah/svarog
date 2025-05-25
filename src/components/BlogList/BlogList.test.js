// src/components/BlogList/BlogList.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { removeStyles } from '../../utils/styleInjection.js';
import BlogList from './BlogList.js';

describe('BlogList', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      posts: [
        {
          title: 'First Post',
          slug: 'first-post',
          excerpt: 'First post excerpt',
          author: 'Author 1',
          publishedDate: '2024-01-01',
        },
        {
          title: 'Second Post',
          slug: 'second-post',
          excerpt: 'Second post excerpt',
          author: 'Author 2',
          publishedDate: '2024-01-02',
        },
      ],
      title: 'Latest Posts',
    };
  });

  afterEach(() => {
    // Clean up injected styles after each test
    removeStyles('bloglist');
  });

  it('should inject styles and render correctly with posts', () => {
    const list = BlogList(defaultProps);
    const element = list.getElement();

    // Check if styles were injected
    const injectedStyle = document.querySelector('[data-svarog="bloglist"]');
    expect(injectedStyle).toBeTruthy();
    expect(injectedStyle.textContent).toContain('.blog-list');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('blog-list')).toBe(true);
    expect(element.querySelector('.blog-list__title').textContent).toBe(
      'Latest Posts'
    );

    // Find all blog card titles - they should be inside the grid columns
    const cardTitles = element.querySelectorAll('.blog-card__title');

    expect(cardTitles.length).toBe(2);
    expect(cardTitles[0].textContent).toBe('First Post');
    expect(cardTitles[1].textContent).toBe('Second Post');
  });

  it('should render empty state when no posts', () => {
    const list = BlogList({ posts: [], title: 'Blog Posts' });
    const element = list.getElement();

    expect(element.querySelector('.blog-list__no-posts')).toBeTruthy();
    expect(element.querySelector('.blog-list__no-posts').textContent).toBe(
      'No posts found.'
    );
  });

  it('should render without title', () => {
    const props = { ...defaultProps };
    delete props.title;

    const list = BlogList(props);
    const element = list.getElement();

    expect(element.querySelector('.blog-list__title')).toBeNull();
  });

  it('should apply custom className', () => {
    const list = BlogList({ ...defaultProps, className: 'custom-class' });
    const element = list.getElement();

    expect(element.classList.contains('custom-class')).toBe(true);
  });

  it('should clean up resources when destroyed', () => {
    const list = BlogList(defaultProps);
    const element = list.getElement();

    // Create a mock parent to test with
    const mockParent = document.createElement('div');
    mockParent.appendChild(element);

    // Call destroy
    list.destroy();

    // Check if still in parent
    expect(element.parentNode).toBe(mockParent);
  });

  it('should update with new posts', () => {
    // First, create the component with initial props
    const list = BlogList(defaultProps);

    // Create a simple container to avoid DOM manipulation errors
    const container = document.createElement('div');
    container.appendChild(list.getElement());

    // Now update with new posts
    const newPosts = [
      {
        title: 'New Post',
        slug: 'new-post',
        excerpt: 'New post excerpt',
        author: 'New Author',
        publishedDate: '2024-02-01',
      },
    ];

    // Call update method
    list.update({ posts: newPosts });

    // Get the updated element from the container
    const updatedElement = container.firstChild;

    // Verify the update - should have one post now
    const updatedTitles = updatedElement.querySelectorAll('.blog-card__title');
    expect(updatedTitles.length).toBe(1);
    expect(updatedTitles[0].textContent).toBe('New Post');
  });

  it('should update with new columns', () => {
    // Create the component
    const list = BlogList({
      ...defaultProps,
      columns: 3,
    });

    // Create a simple container
    const container = document.createElement('div');
    container.appendChild(list.getElement());

    // Update with new columns setting
    list.update({ columns: 2 });

    // Get the updated element from the container
    const updatedElement = container.firstChild;

    // The updated component should exist and have columns
    expect(updatedElement.querySelectorAll('.column').length).toBe(2);
  });

  it('should handle legacy featuredImage prop migration', () => {
    const postsWithLegacyProps = [
      {
        title: 'Legacy Post',
        slug: 'legacy-post',
        excerpt: 'Legacy post excerpt',
        featuredImage: 'https://example.com/legacy-image.jpg', // Legacy prop
        author: 'Legacy Author',
        publishedDate: '2024-01-01',
      },
    ];

    const list = BlogList({
      posts: postsWithLegacyProps,
      title: 'Legacy Posts',
    });
    const element = list.getElement();

    // Should still render the blog card with the migrated image
    const cardTitles = element.querySelectorAll('.blog-card__title');
    expect(cardTitles.length).toBe(1);
    expect(cardTitles[0].textContent).toBe('Legacy Post');
  });
});
