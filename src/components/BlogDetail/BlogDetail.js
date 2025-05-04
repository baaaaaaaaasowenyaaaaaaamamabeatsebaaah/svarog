// src/components/BlogDetail/BlogDetail.js
import './BlogDetail.css';
import { Component } from '../../utils/componentFactory.js';

export default class BlogDetail extends Component {
  constructor(props) {
    super();
    this.props = {
      title: '',
      content: '',
      featuredImage: '',
      publishedDate: '',
      author: '',
      categories: [],
      className: '',
      ...props,
    };
    this.element = this.createComponentElement();
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  createComponentElement() {
    const {
      title,
      content,
      featuredImage,
      publishedDate,
      author,
      categories = [],
      className = '',
    } = this.props;

    const article = this.createElement('article', {
      className: this.createClassNames('blog-detail', className),
    });

    const header = this.createElement('header', {
      className: 'blog-detail__header',
    });

    // Add title (check if not empty)
    if (title) {
      const titleElement = this.createElement('h1', {
        className: 'blog-detail__title',
        textContent: title,
      });
      header.appendChild(titleElement);
    }

    // Add meta information
    const metaContainer = this.createElement('div', {
      className: 'blog-detail__meta',
    });

    if (author) {
      const authorElement = this.createElement('span', {
        className: 'blog-detail__author',
        textContent: `By ${author}`,
      });
      metaContainer.appendChild(authorElement);
    }

    if (publishedDate) {
      const dateElement = this.createElement('span', {
        className: 'blog-detail__date',
        textContent: this.formatDate(publishedDate),
      });
      metaContainer.appendChild(dateElement);
    }

    if (categories.length > 0) {
      const categoriesContainer = this.createElement('div', {
        className: 'blog-detail__categories',
      });

      categories.forEach((category, index) => {
        const categoryElement = this.createElement('span', {
          className: 'blog-detail__category',
          textContent: category,
        });

        categoriesContainer.appendChild(categoryElement);

        if (index < categories.length - 1) {
          const separator = document.createTextNode(', ');
          categoriesContainer.appendChild(separator);
        }
      });

      metaContainer.appendChild(categoriesContainer);
    }

    if (metaContainer.children.length > 0) {
      header.appendChild(metaContainer);
    }

    article.appendChild(header);

    // Add featured image if available
    if (featuredImage) {
      const imageContainer = this.createElement('div', {
        className: 'blog-detail__image-container',
      });

      const imageElement = this.createElement('img', {
        className: 'blog-detail__image',
        src: featuredImage,
        alt: title || '',
        loading: 'lazy',
      });

      imageContainer.appendChild(imageElement);
      article.appendChild(imageContainer);
    }

    // Add content
    const contentElement = this.createElement('div', {
      className: 'blog-detail__content',
    });

    // Set content HTML (check if not empty)
    if (content) {
      contentElement.innerHTML = content;
    }

    article.appendChild(contentElement);
    return article;
  }
}
