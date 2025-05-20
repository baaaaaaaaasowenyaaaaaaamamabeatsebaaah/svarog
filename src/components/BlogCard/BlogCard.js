// src/components/BlogCard/BlogCard.js
import './BlogCard.css';
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { validateRequiredProps } from '../../utils/validation.js';
import Card from '../Card/Card.js';
import Link from '../Link/Link.js';

/**
 * Creates a BlogCard component for displaying blog post previews
 *
 * @param {Object} props - BlogCard properties
 * @param {string} [props.title=''] - Blog post title
 * @param {string} [props.slug=''] - Blog post URL slug
 * @param {string} [props.excerpt=''] - Blog post excerpt
 * @param {string} [props.featuredImage=''] - URL of featured image
 * @param {string} [props.publishedDate=''] - Published date string
 * @param {string} [props.author=''] - Author name
 * @param {Array} [props.categories=[]] - Post categories
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {Object} BlogCard component API
 */
const createBlogCard = (props) => {
  // Define prop requirements
  const propRequirements = {
    title: { required: true, type: 'string' },
    slug: { required: true, type: 'string' },
    excerpt: { required: false, type: 'string' },
    featuredImage: { required: false, type: 'string' },
    publishedDate: { required: false, type: 'string' },
    author: { required: false, type: 'string' },
    categories: { required: false, type: 'array' },
    className: { required: false, type: 'string' },
  };

  // Validate required props
  validateRequiredProps(props, propRequirements, 'BlogCard');

  // Set default props and merge with provided props
  const {
    title,
    slug,
    excerpt = '',
    featuredImage = '',
    publishedDate = '',
    author = '',
    categories = [],
    className = '',
  } = props;

  /**
   * Helper function to format date
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Creates the card content elements
   * @returns {HTMLElement} Card content container
   */
  const createCardContent = () => {
    const cardContent = createElement('div', {
      classes: 'blog-card__content',
    });

    // Add featured image if available
    if (featuredImage) {
      const imageContainer = createElement('div', {
        classes: 'blog-card__image-container',
      });

      const imageElement = createElement('img', {
        classes: 'blog-card__image',
        attributes: {
          src: featuredImage,
          alt: title || '',
          loading: 'lazy',
        },
      });

      imageContainer.appendChild(imageElement);
      cardContent.appendChild(imageContainer);
    }

    // Create title with link
    const titleElement = createElement('h3', {
      classes: 'blog-card__title',
      text: title,
    });

    const titleLink = Link({
      children: titleElement,
      href: `/blog/${slug}`,
      block: true,
      className: 'blog-card__title-link',
    });

    cardContent.appendChild(titleLink.getElement());

    // Meta information
    const metaContainer = createElement('div', {
      classes: 'blog-card__meta',
    });

    if (author) {
      const authorElement = createElement('span', {
        classes: 'blog-card__author',
        text: `By ${author}`,
      });
      metaContainer.appendChild(authorElement);
    }

    if (publishedDate) {
      const dateElement = createElement('span', {
        classes: 'blog-card__date',
        text: formatDate(publishedDate),
      });
      metaContainer.appendChild(dateElement);
    }

    if (metaContainer.children.length > 0) {
      cardContent.appendChild(metaContainer);
    }

    // Add excerpt
    if (excerpt) {
      const excerptElement = createElement('p', {
        classes: 'blog-card__excerpt',
        text: excerpt,
      });
      cardContent.appendChild(excerptElement);
    }

    // Add categories
    if (categories.length > 0) {
      const categoriesContainer = createElement('div', {
        classes: 'blog-card__categories',
      });

      categories.forEach((category) => {
        const categoryElement = createElement('span', {
          classes: 'blog-card__category',
          text: category,
        });
        categoriesContainer.appendChild(categoryElement);
      });

      cardContent.appendChild(categoriesContainer);
    }

    // Add read more link
    const readMoreLink = Link({
      children: 'Read more →',
      href: `/blog/${slug}`,
      underline: false,
      className: 'blog-card__read-more',
    });

    cardContent.appendChild(readMoreLink.getElement());

    return cardContent;
  };

  // Create the card component with blog card content
  const card = Card({
    children: createCardContent(),
    className: `blog-card ${className}`.trim(),
  });

  // Return the public API
  return {
    /**
     * Gets the blog card element
     * @returns {HTMLElement} The blog card element
     */
    getElement() {
      return card.getElement();
    },

    /**
     * Updates the blog card with new props
     * @param {Object} newProps - New properties to update
     * @returns {Object} Updated component
     */
    update(newProps) {
      const updatedProps = { ...props, ...newProps };
      const newCard = createBlogCard(updatedProps);

      // Replace the old element if it's in the DOM
      const element = card.getElement();
      if (element.parentNode) {
        element.parentNode.replaceChild(newCard.getElement(), element);
      }

      return newCard;
    },

    /**
     * Clean up resources
     */
    destroy() {
      card.destroy();
    },

    /**
     * Handle theme changes
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      // Theme changes are handled through CSS variables
      console.debug(
        `BlogCard: theme changed from ${previousTheme} to ${theme}`
      );
    },
  };
};

// Create the component factory with theme awareness
export default createComponent('BlogCard', withThemeAwareness(createBlogCard));
