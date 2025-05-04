// src/components/BlogList/BlogList.test.js
import { describe, it, expect, beforeEach } from 'vitest';
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

  it('should render correctly with posts', () => {
    const list = new BlogList(defaultProps);
    const element = list.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('blog-list')).toBe(true);
    expect(element.querySelector('.blog-list__title').textContent).toBe(
      'Latest Posts'
    );

    const cards = element.querySelectorAll('.blog-card');
    expect(cards.length).toBe(2);
  });

  it('should render empty state when no posts', () => {
    const list = new BlogList({ posts: [], title: 'Blog Posts' });
    const element = list.getElement();

    expect(element.querySelector('.blog-list__no-posts')).toBeTruthy();
    expect(element.querySelector('.blog-list__no-posts').textContent).toBe(
      'No posts found.'
    );
  });

  it('should render without title', () => {
    const props = { ...defaultProps };
    delete props.title;

    const list = new BlogList(props);
    const element = list.getElement();

    expect(element.querySelector('.blog-list__title')).toBeNull();
  });

  it('should apply custom className', () => {
    const list = new BlogList({ ...defaultProps, className: 'custom-class' });
    const element = list.getElement();

    expect(element.classList.contains('custom-class')).toBe(true);
  });
});
