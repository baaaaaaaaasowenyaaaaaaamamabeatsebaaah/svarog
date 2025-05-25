// src/components/BlogList/BlogList.js
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { validateRequiredProps } from '../../utils/validation.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { blogListStyles } from './BlogList.styles.js';
import BlogCard from '../BlogCard/BlogCard.js';
import Grid from '../Grid/Grid.js';

// Create style injector for BlogList component
const injectBlogListStyles = createStyleInjector('BlogList');

/**
 * Creates a BlogList component for displaying multiple blog post cards in a grid layout
 *
 * @param {Object} props - BlogList properties
 * @param {Array} [props.posts=[]] - Array of blog post objects
 * @param {string} [props.title=''] - Optional heading for the blog list section
 * @param {number} [props.columns=3] - Number of grid columns (1-12)
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {Object} BlogList component API
 */
const createBlogList = (props) => {
  // Inject styles on first render
  injectBlogListStyles(blogListStyles);

  // Define prop requirements
  const propRequirements = {
    posts: { required: false, type: 'array' },
    title: { required: false, type: 'string' },
    columns: { required: false, type: 'number' },
    className: { required: false, type: 'string' },
  };

  // Validate props
  validateRequiredProps(props, propRequirements, 'BlogList');

  // Set default props and merge with provided props
  const { posts = [], title = '', columns = 3, className = '' } = props;

  // Initialize state to track component resources
  const state = {
    element: null,
    grid: null,
    blogCards: [],
  };

  /**
   * Migrate legacy post data structure to the standardized format
   * @param {Object} post - Blog post data
   * @returns {Object} Post with standardized props
   */
  const migratePostData = (post) => {
    const migrated = { ...post };

    // Handle migration from featuredImage to imageUrl
    if ('featuredImage' in post && !('imageUrl' in post)) {
      migrated.imageUrl = post.featuredImage;
    }

    return migrated;
  };

  /**
   * Creates a blog card component from post data
   * @param {Object} post - Blog post data
   * @returns {Object} BlogCard component
   */
  const createBlogCard = (post) => {
    const migratedPost = migratePostData(post);

    return BlogCard({
      title: migratedPost.title,
      slug: migratedPost.slug,
      excerpt: migratedPost.excerpt,
      imageUrl: migratedPost.imageUrl, // Use standardized imageUrl prop
      publishedDate: migratedPost.publishedDate,
      author: migratedPost.author,
      categories: migratedPost.categories || [],
    });
  };

  /**
   * Creates the empty state message element
   * @returns {HTMLElement} Empty state message element
   */
  const createEmptyState = () => {
    return createElement('p', {
      classes: 'blog-list__no-posts',
      text: 'No posts found.',
    });
  };

  /**
   * Creates the component element
   * @returns {HTMLElement} The component element
   */
  const createComponentElement = () => {
    // Create container element
    const container = createElement('div', {
      classes: ['blog-list', className].filter(Boolean).join(' '),
    });

    // Add title if provided
    if (title) {
      const titleElement = createElement('h2', {
        classes: 'blog-list__title',
        text: title,
      });
      container.appendChild(titleElement);
    }

    // Create grid for blog cards
    const grid = Grid({
      gap: '1rem',
      className: 'blog-list__grid',
    });

    // Add blog cards to grid
    if (posts.length > 0) {
      state.blogCards = posts.map((post) => {
        const blogCard = createBlogCard(post);
        const column = Grid.Column({
          width: Math.floor(12 / columns),
          mobileWidth: 12, // Full width on mobile
          children: blogCard.getElement(),
        });
        grid.appendChild(column.getElement());
        return blogCard;
      });
    } else {
      // Show no posts message
      const noPostsElement = createEmptyState();
      grid.appendChild(noPostsElement);
    }

    // Store grid reference for later cleanup
    state.grid = grid;

    // Add grid to container
    container.appendChild(grid.getElement());

    return container;
  };

  // Initialize component element
  state.element = createComponentElement();

  // Return public API
  return {
    /**
     * Gets the blog list element
     * @returns {HTMLElement} The blog list element
     */
    getElement() {
      return state.element;
    },

    /**
     * Updates the blog list with new props
     * @param {Object} newProps - New properties to update
     * @returns {Object} Updated component
     */
    update(newProps) {
      // Merge the new props with existing props
      const updatedProps = { ...props, ...newProps };

      // Create a new component with the updated props
      const newComponent = createBlogList(updatedProps);
      const newElement = newComponent.getElement();

      // Replace the element in the DOM if it's attached
      const element = state.element;
      if (element && element.parentNode) {
        element.parentNode.replaceChild(newElement, element);
      }

      // Clean up the old component resources
      this.destroy();

      // Update our state
      state.element = newElement;
      state.grid = newComponent.getElement().querySelector('.blog-list__grid')
        ? newComponent.getElement().querySelector('.blog-list__grid')._component
        : null;
      state.blogCards = newComponent.getBlogCards
        ? newComponent.getBlogCards()
        : [];

      return this;
    },

    /**
     * Clean up resources
     */
    destroy() {
      // Clean up grid component
      if (state.grid && typeof state.grid.destroy === 'function') {
        state.grid.destroy();
      }

      // Clean up all blog card components
      state.blogCards.forEach((card) => {
        if (card && typeof card.destroy === 'function') {
          card.destroy();
        }
      });

      // Clear references but keep element reference for potential DOM operations
      state.grid = null;
      state.blogCards = [];
    },

    /**
     * Handle theme changes
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      console.debug(
        `BlogList: theme changed from ${previousTheme} to ${theme}`
      );
    },
  };
};

// Create the component factory with theme awareness
export default createComponent('BlogList', withThemeAwareness(createBlogList));
