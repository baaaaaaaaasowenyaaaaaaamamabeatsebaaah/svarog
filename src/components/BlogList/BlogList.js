// src/components/BlogList/BlogList.js
import './BlogList.css';
import { Component } from '../../utils/componentFactory.js';
import BlogCard from '../BlogCard/BlogCard.js';
import Grid from '../Grid/Grid.js';

export default class BlogList extends Component {
  constructor(props) {
    super();
    this.props = {
      posts: [],
      title: '',
      columns: 3,
      className: '',
      ...props,
    };
    this.element = this.createComponentElement();
  }

  createComponentElement() {
    const { posts = [], title = '', columns = 3, className = '' } = this.props;

    const container = this.createElement('div', {
      className: this.createClassNames('blog-list', className),
    });

    // Add title if provided and not empty
    if (title) {
      const titleElement = this.createElement('h2', {
        className: 'blog-list__title',
        textContent: title,
      });
      container.appendChild(titleElement);
    }

    // Create grid for blog cards
    const grid = new Grid({
      columns: columns,
      gap: 'medium',
      className: 'blog-list__grid',
    });

    // Add blog cards to grid
    if (posts.length > 0) {
      posts.forEach((post) => {
        const blogCard = new BlogCard({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage,
          publishedDate: post.publishedDate,
          author: post.author,
          categories: post.categories,
        });

        grid.addItem(blogCard.getElement());
      });
    } else {
      // Show no posts message
      const noPostsElement = this.createElement('p', {
        className: 'blog-list__no-posts',
        textContent: 'No posts found.',
      });

      grid.addItem(noPostsElement);
    }

    container.appendChild(grid.getElement());
    return container;
  }
}
