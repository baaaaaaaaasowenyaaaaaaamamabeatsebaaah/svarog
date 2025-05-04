// src/components/BlogCard/BlogCard.js
import './BlogCard.css';
import { Component } from '../../utils/componentFactory.js';
import Card from '../Card/Card.js';
import Link from '../Link/Link.js';

export default class BlogCard extends Component {
  constructor(props) {
    super();
    this.props = {
      title: '',
      slug: '',
      excerpt: '',
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
      slug,
      excerpt,
      featuredImage,
      publishedDate,
      author,
      categories = [],
      className = '',
    } = this.props;

    const cardContent = this.createElement('div', {
      className: 'blog-card__content',
    });

    // Add featured image if available
    if (featuredImage) {
      const imageContainer = this.createElement('div', {
        className: 'blog-card__image-container',
      });

      const imageElement = this.createElement('img', {
        className: 'blog-card__image',
        src: featuredImage,
        alt: title || '',
        loading: 'lazy',
      });

      imageContainer.appendChild(imageElement);
      cardContent.appendChild(imageContainer);
    }

    // Create title with link
    const titleElement = this.createElement('h3', {
      className: 'blog-card__title',
      textContent: title || 'Untitled Post',
    });

    const titleLink = new Link({
      children: titleElement,
      href: `/blog/${slug}`,
      block: true,
    });

    cardContent.appendChild(titleLink.getElement());

    // Meta information
    const metaContainer = this.createElement('div', {
      className: 'blog-card__meta',
    });

    if (author) {
      const authorElement = this.createElement('span', {
        className: 'blog-card__author',
        textContent: `By ${author}`,
      });
      metaContainer.appendChild(authorElement);
    }

    if (publishedDate) {
      const dateElement = this.createElement('span', {
        className: 'blog-card__date',
        textContent: this.formatDate(publishedDate),
      });
      metaContainer.appendChild(dateElement);
    }

    if (metaContainer.children.length > 0) {
      cardContent.appendChild(metaContainer);
    }

    // Add excerpt
    if (excerpt) {
      const excerptElement = this.createElement('p', {
        className: 'blog-card__excerpt',
        textContent: excerpt,
      });
      cardContent.appendChild(excerptElement);
    }

    // Add categories
    if (categories.length > 0) {
      const categoriesContainer = this.createElement('div', {
        className: 'blog-card__categories',
      });

      categories.forEach((category) => {
        const categoryElement = this.createElement('span', {
          className: 'blog-card__category',
          textContent: category,
        });
        categoriesContainer.appendChild(categoryElement);
      });

      cardContent.appendChild(categoriesContainer);
    }

    // Add read more link
    const readMoreLink = new Link({
      children: 'Read more →',
      href: `/blog/${slug}`,
      underline: false,
    });
    readMoreLink.getElement().className = 'blog-card__read-more';
    cardContent.appendChild(readMoreLink.getElement());

    // Create card with the content as children
    const card = new Card({
      children: cardContent,
      className: this.createClassNames('blog-card', className),
    });

    return card.getElement();
  }
}
