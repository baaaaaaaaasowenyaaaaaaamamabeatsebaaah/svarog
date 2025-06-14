// src/components/ProductDetail/ProductDetail.js
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { productDetailStyles } from './ProductDetail.styles.js';

// Component dependencies
import ImageSlider from '../ImageSlider/index.js';
import Typography from '../Typography/index.js';
import PriceDisplay from '../PriceDisplay/index.js';
import Button from '../Button/index.js';
import Tag from '../Tag/index.js';
import Grid from '../Grid/index.js';

// Create style injector for ProductDetail component
const injectProductDetailStyles = createStyleInjector('ProductDetail');

/**
 * Migrates legacy props to standardized props
 * @private
 * @param {Object} props - Component props
 * @returns {Object} Migrated props
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  // Handle legacy onAddToCart vs onClick
  if ('onAddToCart' in props && !('onClick' in props)) {
    console.warn(
      '[ProductDetail] onAddToCart is deprecated, use onClick instead'
    );
    migrated.onClick = props.onAddToCart;
    delete migrated.onAddToCart;
  }

  // Handle legacy description vs content
  if ('description' in props && !('content' in props)) {
    migrated.content = props.description;
  }

  return migrated;
};

/**
 * Creates the product gallery section
 * @private
 * @param {Array} images - Product images
 * @param {Function} onImageChange - Image change callback
 * @returns {Object} Gallery element and component reference
 */
const createGallerySection = (images, onImageChange) => {
  if (!images || images.length === 0) {
    return {
      element: createElement('div', {
        classes: ['product-detail__gallery', 'product-detail__gallery--empty'],
        children: [
          createElement('div', {
            classes: ['product-detail__no-image'],
            text: 'No images available',
          }),
        ],
      }),
      component: null,
    };
  }

  const galleryComponent = ImageSlider({
    images,
    showThumbnails: images.length > 1,
    showDots: false,
    showArrows: images.length > 1,
    onChange: onImageChange,
    className: 'product-detail__image-slider',
  });

  const galleryContainer = createElement('div', {
    classes: ['product-detail__gallery'],
    children: [galleryComponent.getElement()],
  });

  return {
    element: galleryContainer,
    component: galleryComponent,
  };
};

/**
 * Creates the product information section (title, tags, description only)
 * @private
 * @param {Object} productInfo - Product information
 * @returns {HTMLElement} Info section element
 */
const createInfoSection = (productInfo) => {
  const { title, content, category, tags = [] } = productInfo;

  const infoContainer = createElement('div', {
    classes: ['product-detail__info'],
  });

  // Category and tags section
  if (category || tags.length > 0) {
    const metaSection = createElement('div', {
      classes: ['product-detail__meta'],
    });

    if (category) {
      const categoryTag = Tag({
        label: category,
        variant: 'secondary',
        size: 'sm',
        className: 'product-detail__category',
      });
      metaSection.appendChild(categoryTag.getElement());
    }

    if (tags.length > 0) {
      const tagsContainer = createElement('div', {
        classes: ['product-detail__tags'],
      });

      tags.forEach((tag) => {
        const tagComponent = Tag({
          label: typeof tag === 'string' ? tag : tag.label,
          variant:
            typeof tag === 'object' ? tag.variant || 'default' : 'default',
          size: 'sm',
          onClick: typeof tag === 'object' ? tag.onClick : null,
        });
        tagsContainer.appendChild(tagComponent.getElement());
      });

      metaSection.appendChild(tagsContainer);
    }

    infoContainer.appendChild(metaSection);
  }

  // Title
  const titleComponent = Typography({
    children: title,
    as: 'h1',
    className: 'product-detail__title',
  });
  infoContainer.appendChild(titleComponent.getElement());

  // Content/Description
  if (content) {
    const contentComponent = Typography({
      children: content,
      as: 'div',
      className: 'product-detail__content',
    });
    infoContainer.appendChild(contentComponent.getElement());
  }

  return infoContainer;
};

/**
 * Creates the specifications section separately for better layout control
 * @private
 * @param {Object} specifications - Product specifications
 * @returns {HTMLElement|null} Specifications section element or null
 */
const createSpecificationsSection = (specifications) => {
  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  const specsSection = createElement('div', {
    classes: ['product-detail__specifications'],
  });

  const specsTitle = Typography({
    children: 'Specifications',
    as: 'h3',
    className: 'product-detail__specs-title',
  });
  specsSection.appendChild(specsTitle.getElement());

  const specsList = createElement('dl', {
    classes: ['product-detail__specs-list'],
  });

  Object.entries(specifications).forEach(([key, value]) => {
    const term = createElement('dt', {
      classes: ['product-detail__spec-term'],
      text: key,
    });

    const definition = createElement('dd', {
      classes: ['product-detail__spec-definition'],
      text: value,
    });

    specsList.appendChild(term);
    specsList.appendChild(definition);
  });

  specsSection.appendChild(specsList);
  return specsSection;
};

/**
 * Creates the purchase section with price and actions
 * @private
 * @param {Object} purchaseInfo - Purchase information
 * @returns {Object} Purchase section element and components
 */
const createPurchaseSection = (purchaseInfo) => {
  const {
    price,
    currency = '€',
    priceInfo,
    loading = false,
    priceHighlighted = false,
    buttonText = 'Add to Cart',
    onClick,
    disabled = false,
    additionalButtons = [],
  } = purchaseInfo;

  const purchaseContainer = createElement('div', {
    classes: ['product-detail__purchase'],
  });

  // Price display
  const priceComponent = PriceDisplay({
    value: `${currency}${price}`,
    loading,
    isHighlighted: priceHighlighted,
    className: 'product-detail__price',
  });
  purchaseContainer.appendChild(priceComponent.getElement());

  // Price info
  if (priceInfo) {
    const priceInfoComponent = Typography({
      children: priceInfo,
      as: 'p',
      className: 'product-detail__price-info',
    });
    purchaseContainer.appendChild(priceInfoComponent.getElement());
  }

  // Action buttons
  const actionsContainer = createElement('div', {
    classes: ['product-detail__actions'],
  });

  // Primary action button
  const primaryButton = Button({
    text: buttonText,
    variant: 'primary',
    size: 'lg',
    onClick,
    disabled: disabled || loading,
    loading,
    className: 'product-detail__primary-button',
  });
  actionsContainer.appendChild(primaryButton.getElement());

  // Additional buttons
  const additionalButtonComponents = [];
  additionalButtons.forEach((buttonConfig) => {
    const button = Button({
      text: buttonConfig.text,
      variant: buttonConfig.variant || 'secondary',
      size: buttonConfig.size || 'lg',
      onClick: buttonConfig.onClick,
      disabled: buttonConfig.disabled || loading,
      className: `product-detail__additional-button ${buttonConfig.className || ''}`,
    });
    actionsContainer.appendChild(button.getElement());
    additionalButtonComponents.push(button);
  });

  purchaseContainer.appendChild(actionsContainer);

  return {
    element: purchaseContainer,
    components: {
      priceComponent,
      primaryButton,
      additionalButtons: additionalButtonComponents,
    },
  };
};

/**
 * Creates a ProductDetail component
 * @param {Object} props - ProductDetail properties
 * @param {Array} props.images - Array of product images
 * @param {string} props.title - Product title
 * @param {string} [props.content] - Product description/content
 * @param {string} [props.description] - DEPRECATED: Use content instead
 * @param {string} [props.category] - Product category
 * @param {Array} [props.tags] - Array of tags
 * @param {Object} [props.specifications] - Product specifications
 * @param {string|number} props.price - Product price
 * @param {string} [props.currency='€'] - Currency symbol
 * @param {string} [props.priceInfo] - Additional price information
 * @param {boolean} [props.loading=false] - Loading state
 * @param {boolean} [props.priceHighlighted=false] - Highlight price
 * @param {string} [props.buttonText='Add to Cart'] - Primary button text
 * @param {Function} [props.onClick] - Primary action callback
 * @param {Function} [props.onAddToCart] - DEPRECATED: Use onClick instead
 * @param {boolean} [props.disabled=false] - Disable actions
 * @param {Array} [props.additionalButtons] - Additional action buttons
 * @param {Function} [props.onImageChange] - Image change callback
 * @param {string} [props.className] - Additional CSS classes
 * @returns {Object} ProductDetail component API
 */
const createProductDetail = (props) => {
  // Inject styles on first render
  injectProductDetailStyles(productDetailStyles);

  // Migrate legacy props
  const normalizedProps = migrateLegacyProps(props);

  // Validate required props
  validateProps(
    normalizedProps,
    createProductDetail.requiredProps,
    'ProductDetail'
  );

  // Extract and structure props
  const {
    images = [],
    title,
    content,
    category,
    tags = [],
    specifications = {},
    price,
    currency = '€',
    priceInfo,
    loading = false,
    priceHighlighted = false,
    buttonText = 'Add to Cart',
    onClick = () => {},
    disabled = false,
    additionalButtons = [],
    onImageChange,
    className = '',
  } = normalizedProps;

  // Component state
  const state = { ...normalizedProps };
  const components = {};

  // Build main container classes
  const containerClasses = [
    'product-detail',
    loading && 'product-detail--loading',
    disabled && 'product-detail--disabled',
    className,
  ].filter(Boolean);

  /**
   * Renders the complete product detail
   * @returns {HTMLElement} Product detail element
   */
  const renderProductDetail = () => {
    const container = createElement('div', {
      classes: containerClasses,
    });

    // Create Grid for responsive layout with responsive gap
    const getResponsiveGap = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < 768) return '1rem'; // Mobile
        if (width < 1024) return '1.5rem'; // Tablet
        return '2rem'; // Desktop
      }
      return '2rem'; // Default for SSR
    };

    const mainGrid = Grid({
      gap: getResponsiveGap(),
      className: 'product-detail__grid',
    });

    // Gallery section (left on desktop, top on mobile)
    const gallery = createGallerySection(images, onImageChange);
    components.gallery = gallery.component;

    const galleryColumn = Grid.Column({
      width: 12,
      tabletWidth: 6,
      desktopWidth: 6,
      children: gallery.element,
    });

    // Right column content (right on desktop, below image on mobile)
    const rightColumnContent = createElement('div', {
      classes: ['product-detail__right-column'],
    });

    // 1. Info section (title, tags, description)
    const productInfo = { title, content, category, tags };
    const infoElement = createInfoSection(productInfo);
    rightColumnContent.appendChild(infoElement);

    // 2. Purchase section (price and actions) - moved up for better UX
    const purchaseInfo = {
      price,
      currency,
      priceInfo,
      loading,
      priceHighlighted,
      buttonText,
      onClick,
      disabled,
      additionalButtons,
    };
    const purchase = createPurchaseSection(purchaseInfo);
    components.purchase = purchase.components;
    rightColumnContent.appendChild(purchase.element);

    // 3. Specifications section (moved to bottom)
    const specsElement = createSpecificationsSection(specifications);
    if (specsElement) {
      rightColumnContent.appendChild(specsElement);
    }

    const rightColumn = Grid.Column({
      width: 12,
      tabletWidth: 6,
      desktopWidth: 6,
      children: rightColumnContent,
    });

    // Add columns to grid
    mainGrid.appendChild(galleryColumn.getElement());
    mainGrid.appendChild(rightColumn.getElement());

    // Add grid to container
    container.appendChild(mainGrid.getElement());

    return container;
  };

  // Create base component
  const baseComponent = createBaseComponent(renderProductDetail)(state);

  // Enhanced update method
  const originalUpdate = baseComponent.update;
  baseComponent.update = function (newProps) {
    const migratedProps = migrateLegacyProps(newProps);
    Object.assign(state, migratedProps);
    return originalUpdate.call(this, migratedProps);
  };

  // Enhanced destroy method
  const originalDestroy = baseComponent.destroy;
  baseComponent.destroy = function () {
    // Destroy child components
    if (components.gallery) {
      components.gallery.destroy();
    }
    if (components.purchase) {
      Object.values(components.purchase).forEach((comp) => {
        if (Array.isArray(comp)) {
          comp.forEach((c) => c?.destroy?.());
        } else {
          comp?.destroy?.();
        }
      });
    }

    return originalDestroy.call(this);
  };

  return {
    ...baseComponent,

    /**
     * Update price information
     * @param {string|number} newPrice - New price
     * @param {boolean} [isHighlighted=false] - Highlight price
     * @param {string} [newPriceInfo] - New price info
     * @returns {Object} Component for chaining
     */
    setPrice(newPrice, isHighlighted = false, newPriceInfo) {
      if (components.purchase?.priceComponent) {
        components.purchase.priceComponent.setValue(
          `${state.currency}${newPrice}`,
          isHighlighted
        );
      }
      state.price = newPrice;
      state.priceHighlighted = isHighlighted;
      if (newPriceInfo !== undefined) {
        state.priceInfo = newPriceInfo;
      }
      return this;
    },

    /**
     * Set loading state for price and actions
     * @param {boolean} isLoading - Loading state
     * @returns {Object} Component for chaining
     */
    setLoading(isLoading) {
      if (components.purchase?.priceComponent) {
        components.purchase.priceComponent.setLoading(isLoading);
      }
      if (components.purchase?.primaryButton) {
        components.purchase.primaryButton.update({ loading: isLoading });
      }
      state.loading = isLoading;
      return this;
    },

    /**
     * Navigate to specific product image
     * @param {number} index - Image index
     * @returns {Object} Component for chaining
     */
    goToImage(index) {
      if (components.gallery) {
        components.gallery.goToSlide(index);
      }
      return this;
    },

    /**
     * Get current image index
     * @returns {number} Current image index
     */
    getCurrentImageIndex() {
      return components.gallery ? components.gallery.getCurrentIndex() : 0;
    },

    /**
     * Update product content
     * @param {string} newContent - New content
     * @returns {Object} Component for chaining
     */
    setContent(newContent) {
      return this.update({ content: newContent });
    },

    /**
     * Get current component state
     * @returns {Object} Current state
     */
    getState() {
      return { ...state };
    },

    /**
     * Handle theme changes
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      console.debug(
        `ProductDetail: theme changed from ${previousTheme} to ${theme}`
      );
    },
  };
};

// Define required props for validation
createProductDetail.requiredProps = ['title', 'price'];

// Create the component with theme awareness
const ProductDetail = withThemeAwareness(
  createComponent('ProductDetail', createProductDetail)
);

export default ProductDetail;
