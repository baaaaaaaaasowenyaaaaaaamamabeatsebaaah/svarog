// src/components/BlogDetail/BlogDetail.js
import './BlogDetail.css';
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { validateRequiredProps } from '../../utils/validation.js';

/**
 * Creates a BlogDetail component for displaying full blog post content
 *
 * @param {Object} props - BlogDetail properties
 * @param {string} [props.title=''] - Blog post title
 * @param {string} [props.content=''] - Blog post HTML content
 * @param {string} [props.imageUrl=''] - URL of featured image
 * @param {string} [props.featuredImage=''] - DEPRECATED: Use imageUrl instead
 * @param {string} [props.publishedDate=''] - Published date string
 * @param {string} [props.author=''] - Author name
 * @param {Array} [props.categories=[]] - Post categories
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {Object} BlogDetail component API
 */
const createBlogDetail = (props) => {
  // Migrate legacy props
  const migrateLegacyProps = (originalProps) => {
    const migratedProps = { ...originalProps };

    if ('featuredImage' in originalProps && !('imageUrl' in originalProps)) {
      console.warn(
        '[BlogDetail] featuredImage is deprecated, use imageUrl instead'
      );
      migratedProps.imageUrl = originalProps.featuredImage;
    }

    return migratedProps;
  };

  // Apply prop migration
  const normalizedProps = migrateLegacyProps(props);

  // Define prop requirements
  const propRequirements = {
    title: { required: false, type: 'string' },
    content: { required: false, type: 'string' },
    imageUrl: { required: false, type: 'string' },
    publishedDate: { required: false, type: 'string' },
    author: { required: false, type: 'string' },
    categories: { required: false, type: 'array' },
    className: { required: false, type: 'string' },
  };

  try {
    // Validate required props
    validateRequiredProps(normalizedProps, propRequirements, 'BlogDetail');

    // Set default props and merge with provided props
    const {
      title = '',
      content = '',
      imageUrl = '',
      publishedDate = '',
      author = '',
      categories = [],
      className = '',
    } = normalizedProps;

    /**
     * Helper function to format date
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date string
     * @private
     */
    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch (error) {
        console.error('BlogDetail: Error formatting date', error);
        return '';
      }
    };

    /**
     * Creates the blog detail element using DocumentFragment for performance
     * @returns {HTMLElement} Article element
     * @private
     */
    const createArticleElement = () => {
      // Use DocumentFragment for better performance
      const fragment = document.createDocumentFragment();
      const article = createElement('article', {
        classes: `blog-detail ${className}`.trim(),
      });

      try {
        // Create header section
        const header = createElement('header', {
          classes: 'blog-detail__header',
        });

        // Add title (check if not empty)
        if (title) {
          const titleElement = createElement('h1', {
            classes: 'blog-detail__title',
            text: title,
          });
          header.appendChild(titleElement);
        }

        // Create metadata section
        const metaContainer = createMetaSection();
        if (metaContainer.children.length > 0) {
          header.appendChild(metaContainer);
        }

        article.appendChild(header);

        // Add featured image if available
        if (imageUrl) {
          article.appendChild(createImageSection());
        }

        // Add content section
        article.appendChild(createContentSection());

        // Add complete article to fragment
        fragment.appendChild(article);

        // Return the article element from the fragment
        return fragment.firstChild;
      } catch (error) {
        console.error('BlogDetail: Error creating article element', error);
        // Return a minimal valid element if there's an error
        return createElement('article', {
          classes: 'blog-detail blog-detail--error',
          text: 'Error rendering blog content',
        });
      }
    };

    /**
     * Creates the metadata section with author, date, and categories
     * @returns {HTMLElement} Metadata container element
     * @private
     */
    const createMetaSection = () => {
      const metaContainer = createElement('div', {
        classes: 'blog-detail__meta',
      });

      if (author) {
        const authorElement = createElement('span', {
          classes: 'blog-detail__author',
          text: `By ${author}`,
        });
        metaContainer.appendChild(authorElement);
      }

      if (publishedDate) {
        const dateElement = createElement('span', {
          classes: 'blog-detail__date',
          text: formatDate(publishedDate),
        });
        metaContainer.appendChild(dateElement);
      }

      if (categories.length > 0) {
        const categoriesContainer = createElement('div', {
          classes: 'blog-detail__categories',
        });

        categories.forEach((category, index) => {
          const categoryElement = createElement('span', {
            classes: 'blog-detail__category',
            text: category,
          });

          categoriesContainer.appendChild(categoryElement);

          if (index < categories.length - 1) {
            const separator = document.createTextNode(', ');
            categoriesContainer.appendChild(separator);
          }
        });

        metaContainer.appendChild(categoriesContainer);
      }

      return metaContainer;
    };

    /**
     * Creates the featured image section
     * @returns {HTMLElement} Image container element
     * @private
     */
    const createImageSection = () => {
      const imageContainer = createElement('div', {
        classes: 'blog-detail__image-container',
      });

      const imageElement = createElement('img', {
        classes: 'blog-detail__image',
        attributes: {
          src: imageUrl,
          alt: title || 'Blog featured image',
          loading: 'lazy',
        },
      });

      imageContainer.appendChild(imageElement);
      return imageContainer;
    };

    /**
     * Creates the content section with blog post content
     * @returns {HTMLElement} Content container element
     * @private
     */
    const createContentSection = () => {
      try {
        return createElement('div', {
          classes: 'blog-detail__content',
          html: content, // Use HTML content
        });
      } catch (error) {
        console.error('BlogDetail: Error rendering HTML content', error);
        return createElement('div', {
          classes: 'blog-detail__content blog-detail__content--error',
          text: 'Error rendering blog content',
        });
      }
    };

    // Create the article element
    const element = createArticleElement();

    // Return the public API
    return {
      /**
       * Gets the blog detail element
       * @returns {HTMLElement} The blog detail element
       */
      getElement() {
        return element;
      },

      /**
       * Updates the blog detail with new props
       * @param {Object} newProps - New properties to update
       * @returns {Object} Updated component
       */
      update(newProps) {
        try {
          const updatedProps = { ...normalizedProps, ...newProps };
          const newBlogDetail = createBlogDetail(updatedProps);

          // Replace the old element if it's in the DOM
          if (element.parentNode) {
            element.parentNode.replaceChild(
              newBlogDetail.getElement(),
              element
            );
          }

          return newBlogDetail;
        } catch (error) {
          console.error('BlogDetail: Error updating component', error);
          return this; // Return current instance if update fails
        }
      },

      /**
       * Clean up resources
       */
      destroy() {
        // No event listeners to clean up in this component
        // But we include the method for API consistency
      },

      /**
       * Handle theme changes
       * @param {string} theme - New theme
       * @param {string} previousTheme - Previous theme
       */
      onThemeChange(theme, previousTheme) {
        // Theme changes are handled through CSS variables
        console.debug(
          `BlogDetail: theme changed from ${previousTheme} to ${theme}`
        );
      },
    };
  } catch (error) {
    console.error('BlogDetail: Error creating component', error);
    // Return a minimal valid component in case of errors
    const errorElement = createElement('div', {
      classes: 'blog-detail blog-detail--error',
      text: `Error creating BlogDetail: ${error.message}`,
    });

    return {
      getElement: () => errorElement,
      update: () => this,
      destroy: () => {},
      onThemeChange: () => {},
    };
  }
};

// Create the component factory with theme awareness
export default createComponent(
  'BlogDetail',
  withThemeAwareness(createBlogDetail)
);
