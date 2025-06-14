// src/components/ProductGrid/ProductGrid.js
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { productGridStyles } from './ProductGrid.styles.js';
import Grid from '../Grid/Grid.js';
import ProductCard from '../ProductCard/ProductCard.js';
import Tag from '../Tag/Tag.js';

// Create style injector
const injectProductGridStyles = createStyleInjector('ProductGrid');

/**
 * Creates a skeleton card element for loading state
 * @private
 * @returns {HTMLElement} Skeleton element
 */
const createSkeletonCard = () => {
  const skeleton = createElement('div', {
    classes: 'product-grid__skeleton',
  });

  // Skeleton structure
  skeleton.innerHTML = `
    <div class="skeleton__image"></div>
    <div class="skeleton__content">
      <div class="skeleton__title"></div>
      <div class="skeleton__specs">
        <div class="skeleton__spec-line"></div>
        <div class="skeleton__spec-line"></div>
        <div class="skeleton__spec-line skeleton__spec-line--short"></div>
      </div>
      <div class="skeleton__footer">
        <div class="skeleton__price"></div>
        <div class="skeleton__button"></div>
      </div>
    </div>
  `;

  return skeleton;
};

/**
 * Creates tag filter elements
 * @private
 * @param {Array<string>} tags - Available tags
 * @param {Set<string>} activeTags - Currently active tags
 * @param {Function} onTagClick - Tag click handler
 * @returns {HTMLElement} Filter container
 */
const createFilterContainer = (tags, activeTags, onTagClick) => {
  const container = createElement('div', {
    classes: 'product-grid__filters',
  });

  // Store tag components for updates
  const tagComponents = new Map();

  // Create "All" tag
  const allTag = Tag({
    label: 'All',
    selected: activeTags.size === 0,
    onClick: () => {
      // Clear all selections
      tagComponents.forEach((tagComp, tagName) => {
        if (tagName !== 'All') {
          tagComp.setSelected(false);
        }
      });
      allTag.setSelected(true);
      onTagClick(null);
    },
  });
  tagComponents.set('All', allTag);
  container.appendChild(allTag.getElement());

  // Create individual tags
  tags.forEach((tag) => {
    const tagComponent = Tag({
      label: tag,
      selected: activeTags.has(tag),
      onClick: () => {
        const isCurrentlySelected = tagComponent.isSelected();

        if (isCurrentlySelected) {
          // Deselect this tag
          tagComponent.setSelected(false);
          onTagClick(tag); // This will remove it from activeTags

          // Check if no tags are selected after this deselection
          const anyOtherSelected = Array.from(tagComponents.entries()).some(
            ([name, comp]) =>
              name !== 'All' && name !== tag && comp.isSelected()
          );

          if (!anyOtherSelected) {
            // No other tags selected, select "All"
            allTag.setSelected(true);
          }
        } else {
          // Select this tag
          allTag.setSelected(false); // Deselect "All"
          tagComponent.setSelected(true);
          onTagClick(tag); // This will add it to activeTags
        }
      },
    });

    tagComponents.set(tag, tagComponent);
    container.appendChild(tagComponent.getElement());
  });

  // Store references for external updates
  container._tagComponents = tagComponents;

  return container;
};

/**
 * Creates ProductGrid component
 * @param {Object} props - ProductGrid properties
 * @param {Array} props.products - Array of product data
 * @param {number} [props.columnsDesktop=4] - Columns on desktop
 * @param {number} [props.columnsTablet=2] - Columns on tablet
 * @param {number} [props.columnsMobile=1] - Columns on mobile
 * @param {Function} [props.onProductClick] - Product click handler
 * @param {boolean} [props.enableFiltering=true] - Enable tag filtering
 * @param {boolean} [props.enableLazyLoad=true] - Enable lazy loading
 * @param {number} [props.initialLoadCount=8] - Initial products to load
 * @param {number} [props.loadMoreCount=8] - Products to load on scroll
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.gap='1.5rem'] - Grid gap
 * @param {boolean} [props.showLoadingSkeletons=true] - Show skeleton loaders
 * @param {number} [props.skeletonCount=8] - Number of skeletons to show
 * @returns {Object} ProductGrid component API
 */
const createProductGrid = (props = {}) => {
  // Inject styles
  injectProductGridStyles(productGridStyles);

  // Validate props
  validateProps(props, createProductGrid.requiredProps, 'ProductGrid');

  // Extract props with defaults
  const {
    products = [],
    columnsDesktop = 4,
    columnsTablet = 2,
    columnsMobile = 1,
    onProductClick,
    enableFiltering = true,
    enableLazyLoad = true,
    initialLoadCount = 8,
    loadMoreCount = 8,
    className = '',
    gap = '1.5rem',
    showLoadingSkeletons = true,
    skeletonCount = 8,
  } = props;

  // State
  const state = {
    products: [...products],
    displayedProducts: [],
    activeTags: new Set(),
    isLoading: false,
    currentIndex: 0,
    hasMore: true,
    observer: null,
    productComponents: new Map(),
  };

  // Calculate desktop column width (12 / columnsDesktop)
  const desktopColumnWidth = Math.floor(12 / columnsDesktop);
  const tabletColumnWidth = Math.floor(12 / columnsTablet);
  const mobileColumnWidth = Math.floor(12 / columnsMobile);

  // Extract unique tags from products
  const extractTags = () => {
    const tagSet = new Set();
    state.products.forEach((product) => {
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  };

  // Filter products by active tags
  const getFilteredProducts = () => {
    if (state.activeTags.size === 0) {
      return state.products;
    }

    return state.products.filter((product) => {
      if (!product.tags || !Array.isArray(product.tags)) return false;
      return product.tags.some((tag) => state.activeTags.has(tag));
    });
  };

  // Create the main container
  const container = createElement('div', {
    classes: ['product-grid', className].filter(Boolean),
  });

  // Create filter container if filtering is enabled
  let filterContainer = null;
  if (enableFiltering) {
    const tags = extractTags();
    if (tags.length > 0) {
      filterContainer = createFilterContainer(
        tags,
        state.activeTags,
        handleTagClick
      );
      container.appendChild(filterContainer);
    }
  }

  // Create grid using Grid component
  const grid = Grid({ gap });
  const gridElement = grid.getElement();
  gridElement.classList.add('product-grid__grid');
  container.appendChild(gridElement);

  // Create sentinel element for infinite scroll
  const sentinel = createElement('div', {
    classes: 'product-grid__sentinel',
    attributes: { 'aria-hidden': 'true' },
  });

  // Handle tag click
  function handleTagClick(tag) {
    if (tag === null) {
      // Clear all filters
      state.activeTags.clear();
    } else {
      // Toggle tag
      if (state.activeTags.has(tag)) {
        state.activeTags.delete(tag);
      } else {
        state.activeTags.add(tag);
      }
    }

    // Reset and reload products
    resetGrid();
    loadInitialProducts();
  }

  // Reset grid
  function resetGrid() {
    // Clear existing products
    state.displayedProducts = [];
    state.currentIndex = 0;
    state.hasMore = true;

    // Clear grid
    while (gridElement.firstChild) {
      gridElement.removeChild(gridElement.firstChild);
    }

    // Destroy existing product components
    state.productComponents.forEach((component) => component.destroy());
    state.productComponents.clear();
  }

  // Load initial products
  function loadInitialProducts() {
    const filtered = getFilteredProducts();
    const toLoad = filtered.slice(0, initialLoadCount);

    if (showLoadingSkeletons && toLoad.length === 0) {
      // Show skeletons if no products yet
      showSkeletons(Math.min(skeletonCount, filtered.length || skeletonCount));
    }

    // Use setTimeout to simulate smooth loading
    setTimeout(
      () => {
        removeSkeletons();
        toLoad.forEach((product, index) => {
          addProductToGrid(product, index);
        });

        state.currentIndex = toLoad.length;
        state.hasMore = state.currentIndex < filtered.length;

        // Add sentinel if there are more products
        if (state.hasMore && enableLazyLoad) {
          gridElement.appendChild(sentinel);
          observeSentinel();
        }
      },
      showLoadingSkeletons ? 300 : 0
    );
  }

  // Show skeleton loaders
  function showSkeletons(count) {
    for (let i = 0; i < count; i++) {
      const skeleton = createSkeletonCard();
      const column = Grid.Column({
        width: desktopColumnWidth,
        mobileWidth: mobileColumnWidth,
        tabletWidth: tabletColumnWidth,
        desktopWidth: desktopColumnWidth,
        children: skeleton,
      });

      grid.appendChild(column.getElement());
    }
  }

  // Remove skeleton loaders
  function removeSkeletons() {
    const skeletons = gridElement.querySelectorAll('.product-grid__skeleton');
    skeletons.forEach((skeleton) => {
      const column = skeleton.closest('.column');
      if (column) column.remove();
    });
  }

  // Add product to grid
  function addProductToGrid(product, index) {
    const productCard = ProductCard({
      imageUrl: product.imageUrl,
      fallbackImageUrl: product.fallbackImageUrl,
      title: product.title,
      productData: product.productData,
      price: product.price,
      currency: product.currency,
      priceInfo: product.priceInfo,
      buttonText: product.buttonText || 'Reserve',
      onClick: () => {
        if (onProductClick) {
          onProductClick(product, index);
        }
      },
      loading: product.loading,
      priceHighlighted: product.priceHighlighted,
      className: 'product-grid__card',
    });

    // Store component reference
    state.productComponents.set(product.id || index, productCard);

    const column = Grid.Column({
      width: desktopColumnWidth,
      mobileWidth: mobileColumnWidth,
      tabletWidth: tabletColumnWidth,
      desktopWidth: desktopColumnWidth,
      children: productCard.getElement(),
    });

    // Add with animation
    const columnElement = column.getElement();
    columnElement.classList.add(
      'product-grid__column',
      'product-grid__column--entering'
    );

    // Insert before sentinel
    if (sentinel.parentNode === gridElement) {
      gridElement.insertBefore(columnElement, sentinel);
    } else {
      grid.appendChild(columnElement);
    }

    // Trigger animation
    requestAnimationFrame(() => {
      columnElement.classList.remove('product-grid__column--entering');
    });

    state.displayedProducts.push(product);
  }

  // Load more products
  function loadMoreProducts() {
    if (state.isLoading || !state.hasMore) return;

    state.isLoading = true;
    const filtered = getFilteredProducts();
    const nextProducts = filtered.slice(
      state.currentIndex,
      state.currentIndex + loadMoreCount
    );

    // Show loading indicator
    sentinel.classList.add('product-grid__sentinel--loading');

    // Simulate loading delay for smooth experience
    setTimeout(() => {
      nextProducts.forEach((product, index) => {
        addProductToGrid(product, state.currentIndex + index);
      });

      state.currentIndex += nextProducts.length;
      state.hasMore = state.currentIndex < filtered.length;
      state.isLoading = false;

      sentinel.classList.remove('product-grid__sentinel--loading');

      if (!state.hasMore) {
        sentinel.remove();
        if (state.observer) {
          state.observer.disconnect();
        }
      }
    }, 300);
  }

  // Setup Intersection Observer for infinite scroll
  function observeSentinel() {
    if (!enableLazyLoad || !window.IntersectionObserver) return;

    state.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMoreProducts();
          }
        });
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    state.observer.observe(sentinel);
  }

  // Initialize
  loadInitialProducts();

  // Public API
  return {
    /**
     * Get the container element
     * @returns {HTMLElement} Container element
     */
    getElement() {
      return container;
    },

    /**
     * Update products
     * @param {Array} newProducts - New products array
     * @returns {Object} Component for chaining
     */
    updateProducts(newProducts) {
      state.products = [...newProducts];
      resetGrid();

      // Update filter tags if needed
      if (filterContainer) {
        const newTags = extractTags();
        const newFilterContainer = createFilterContainer(
          newTags,
          state.activeTags,
          handleTagClick
        );
        filterContainer.replaceWith(newFilterContainer);
        filterContainer = newFilterContainer;
      }

      loadInitialProducts();
      return this;
    },

    /**
     * Add products to existing list
     * @param {Array} newProducts - Products to add
     * @returns {Object} Component for chaining
     */
    addProducts(newProducts) {
      state.products.push(...newProducts);

      // Update filter tags if needed
      if (filterContainer) {
        const newTags = extractTags();
        const newFilterContainer = createFilterContainer(
          newTags,
          state.activeTags,
          handleTagClick
        );
        filterContainer.replaceWith(newFilterContainer);
        filterContainer = newFilterContainer;
      }

      // If we're at the end, load the new products
      const filtered = getFilteredProducts();
      if (state.currentIndex >= filtered.length - newProducts.length) {
        state.hasMore = true;
        if (!sentinel.parentNode) {
          gridElement.appendChild(sentinel);
          observeSentinel();
        }
        loadMoreProducts();
      }

      return this;
    },

    /**
     * Update a specific product
     * @param {string|number} productId - Product ID or index
     * @param {Object} updates - Updates to apply
     * @returns {Object} Component for chaining
     */
    updateProduct(productId, updates) {
      const component = state.productComponents.get(productId);
      if (component) {
        component.update(updates);
      }
      return this;
    },

    /**
     * Get active filters
     * @returns {Array<string>} Active tag filters
     */
    getActiveFilters() {
      return Array.from(state.activeTags);
    },

    /**
     * Set active filters
     * @param {Array<string>} tags - Tags to activate
     * @returns {Object} Component for chaining
     */
    setActiveFilters(tags) {
      state.activeTags = new Set(tags);

      // Update filter UI
      if (filterContainer && filterContainer._tagComponents) {
        filterContainer._tagComponents.forEach((tagComp, tagName) => {
          if (tagName === 'All') {
            tagComp.setSelected(tags.length === 0);
          } else {
            tagComp.setSelected(tags.includes(tagName));
          }
        });
      }

      resetGrid();
      loadInitialProducts();
      return this;
    },

    /**
     * Clean up resources
     */
    destroy() {
      if (state.observer) {
        state.observer.disconnect();
      }
      state.productComponents.forEach((component) => component.destroy());
      state.productComponents.clear();
      grid.destroy();
    },

    /**
     * Handle theme changes
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      console.debug(
        `ProductGrid: theme changed from ${previousTheme} to ${theme}`
      );
    },
  };
};

// Define required props
createProductGrid.requiredProps = ['products'];

// Create theme-aware component
const ProductGrid = withThemeAwareness(
  createComponent('ProductGrid', createProductGrid)
);

export default ProductGrid;
