// src/components/Breadcrumb/Breadcrumb.js
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { breadcrumbStyles } from './Breadcrumb.styles.js';

// Create style injector for Breadcrumb component
const injectBreadcrumbStyles = createStyleInjector('Breadcrumb');

/**
 * Creates a Breadcrumb component
 * @param {Object} props - Breadcrumb properties
 * @returns {Object} Breadcrumb component
 */
const createBreadcrumb = (props) => {
  // Inject styles on first render
  injectBreadcrumbStyles(breadcrumbStyles);

  // Migrate legacy props according to standardization guide
  const migrateLegacyProps = (props) => {
    // Handle case where props might be undefined
    if (!props || typeof props !== 'object') {
      return {};
    }

    const migrated = { ...props };

    // Handle legacy prop names
    if ('links' in props && !('items' in props)) {
      console.warn('[Breadcrumb] "links" is deprecated, use "items" instead');
      migrated.items = props.links;
    }

    if ('divider' in props && !('separator' in props)) {
      console.warn(
        '[Breadcrumb] "divider" is deprecated, use "separator" instead'
      );
      migrated.separator = props.divider;
    }

    return migrated;
  };

  // Apply prop migration
  props = migrateLegacyProps(props);

  // Validate props
  if (!props.items || !Array.isArray(props.items)) {
    throw new Error('items must be an array');
  }

  if (props.items.length === 0) {
    throw new Error('items array cannot be empty');
  }

  // Validate each item
  props.items.forEach((item, index) => {
    if (!item.label) {
      throw new Error(`Item at index ${index} must have a label`);
    }
    if (index < props.items.length - 1 && !item.href) {
      throw new Error(`Non-terminal item at index ${index} must have href`);
    }
  });

  if (
    props.maxItems !== undefined &&
    (typeof props.maxItems !== 'number' || props.maxItems < 2)
  ) {
    throw new Error('maxItems must be a number >= 2');
  }

  // Track component state separately
  let componentState = { ...props };

  /**
   * Truncates items array if needed
   * @param {Array} items - Breadcrumb items
   * @param {number} maxItems - Maximum items to show
   * @returns {Array} Processed items array
   */
  const processItems = (items, maxItems) => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    // Always show first and last items, truncate middle
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 2));

    return [firstItem, { label: '...', truncated: true }, ...lastItems];
  };

  /**
   * Renders the breadcrumb navigation
   * @param {Object} state - Current component state
   * @returns {HTMLElement} Breadcrumb nav element
   */
  const renderBreadcrumb = (state) => {
    // Update our tracked state when render is called
    componentState = { ...state };

    const processedItems = processItems(state.items, state.maxItems);

    // Build class names
    const classNames = ['breadcrumb', state.className].filter(Boolean);

    // Create breadcrumb items
    const breadcrumbItems = processedItems.map((item, index) => {
      const isLast = index === processedItems.length - 1;
      const isTruncated = item.truncated;

      // Create list item
      const listItem = createElement('li', {
        classes: ['breadcrumb-item', isLast ? 'breadcrumb-item--active' : ''],
        attributes: {
          'aria-current': isLast ? 'page' : null,
        },
      });

      if (isTruncated) {
        // Truncation indicator
        const span = createElement('span', {
          classes: ['breadcrumb-truncation'],
          attributes: {
            'aria-label': 'More items',
            title: 'Additional breadcrumb items',
          },
          text: item.label,
        });
        listItem.appendChild(span);
      } else if (item.href && !isLast) {
        // Clickable link
        const link = createElement('a', {
          classes: ['breadcrumb-link'],
          attributes: {
            href: item.href,
            'aria-label': `Navigate to ${item.label}`,
          },
          text: item.label,
          events: {
            click: (e) => {
              if (state.onClick) {
                state.onClick(e, item, index);
              }
              if (item.onClick) {
                item.onClick(e, item, index);
              }
            },
          },
        });
        listItem.appendChild(link);
      } else {
        // Current page or non-clickable item
        const span = createElement('span', {
          classes: ['breadcrumb-text'],
          text: item.label,
        });
        listItem.appendChild(span);
      }

      // Add separator (except for last item)
      if (!isLast) {
        const separator = createElement('span', {
          classes: ['breadcrumb-separator'],
          attributes: {
            'aria-hidden': 'true',
            role: 'presentation',
          },
          text: state.separator || '/',
        });
        listItem.appendChild(separator);
      }

      return listItem;
    });

    // Create the main navigation element
    const nav = createElement('nav', {
      classes: classNames,
      attributes: {
        'aria-label': state.ariaLabel || 'Breadcrumb navigation',
        role: 'navigation',
      },
    });

    // Create ordered list
    const ol = createElement('ol', {
      classes: ['breadcrumb-list'],
      attributes: {
        role: 'list',
      },
    });

    // Append all items to the list
    breadcrumbItems.forEach((item) => ol.appendChild(item));
    nav.appendChild(ol);

    return nav;
  };

  // Create component using baseComponent
  const component = createBaseComponent(renderBreadcrumb)(props);

  // Add optimization methods
  component.shouldRerender = (newProps) => {
    // Always rerender for these critical changes
    const criticalProps = ['items', 'maxItems', 'separator'];
    return Object.keys(newProps).some((key) => criticalProps.includes(key));
  };

  component.partialUpdate = (element, newProps, _oldState) => {
    // Update className
    if (newProps.className !== undefined) {
      const baseClass = 'breadcrumb';
      const newClasses = newProps.className
        ? [baseClass, newProps.className]
        : [baseClass];
      element.className = newClasses.join(' ');
    }

    // Update aria-label
    if (newProps.ariaLabel !== undefined) {
      element.setAttribute('aria-label', newProps.ariaLabel);
    }
  };

  // Override update to track state
  const originalUpdate = component.update;
  component.update = function (newProps) {
    componentState = { ...componentState, ...newProps };
    return originalUpdate.call(this, newProps);
  };

  // Add getState method
  component.getState = () => ({ ...componentState });

  // Extended component with custom methods
  const breadcrumbComponent = {
    ...component,

    /**
     * Add a new breadcrumb item
     * @param {Object} item - New breadcrumb item
     * @returns {Object} Breadcrumb component (for chaining)
     */
    addItem(item) {
      const currentState = this.getState();
      const newItems = [...currentState.items, item];
      return this.update({ items: newItems });
    },

    /**
     * Remove last breadcrumb item
     * @returns {Object} Breadcrumb component (for chaining)
     */
    popItem() {
      const currentState = this.getState();
      if (currentState.items.length <= 1) {
        throw new Error('Cannot remove the last breadcrumb item');
      }
      const newItems = currentState.items.slice(0, -1);
      return this.update({ items: newItems });
    },

    /**
     * Set new items array
     * @param {Array} items - New items array
     * @returns {Object} Breadcrumb component (for chaining)
     */
    setItems(items) {
      return this.update({ items });
    },

    /**
     * Set maximum items to display
     * @param {number} maxItems - Maximum items
     * @returns {Object} Breadcrumb component (for chaining)
     */
    setMaxItems(maxItems) {
      return this.update({ maxItems });
    },

    /**
     * Set separator character
     * @param {string} separator - New separator
     * @returns {Object} Breadcrumb component (for chaining)
     */
    setSeparator(separator) {
      return this.update({ separator });
    },

    /**
     * Get current breadcrumb path as array of labels
     * @returns {Array} Array of breadcrumb labels
     */
    getPath() {
      const currentState = this.getState();
      return currentState.items.map((item) => item.label);
    },

    /**
     * Navigate to a specific breadcrumb level
     * @param {number} index - Index to navigate to
     * @returns {Object} Breadcrumb component (for chaining)
     */
    navigateTo(index) {
      const currentState = this.getState();
      const item = currentState.items[index];

      if (!item) {
        throw new Error(`No breadcrumb item at index ${index}`);
      }

      if (item.href) {
        window.location.href = item.href;
      }

      return this;
    },
  };

  // Add theme change handler
  breadcrumbComponent.onThemeChange = (newTheme, previousTheme) => {
    console.debug(
      `Breadcrumb: theme changed from ${previousTheme} to ${newTheme}`
    );
  };

  return breadcrumbComponent;
};

// Define required props for validation
createBreadcrumb.requiredProps = ['items'];

// Export as a factory function
export default createBreadcrumb;
