// src/components/ProductCard/ProductCard.js
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { productCardStyles } from './ProductCard.styles.js';
import Card from '../Card/Card.js';
import Button from '../Button/Button.js';
import Typography from '../Typography/Typography.js';
import Image from '../Image/Image.js';
import PriceDisplay from '../PriceDisplay/PriceDisplay.js';

// Create style injector for ProductCard component
const injectProductCardStyles = createStyleInjector('ProductCard');

/**
 * Creates the product image element
 * @private
 * @param {string} imageUrl - Product image URL
 * @param {string} title - Product title for alt text
 * @param {string} [fallbackImageUrl] - Fallback image URL
 * @returns {HTMLElement} The image element
 */
const createProductImageElement = (imageUrl, title, fallbackImageUrl) => {
  const imageComponent = Image({
    imageUrl,
    alt: title,
    fallbackImageUrl,
    className: 'product-card__image',
    responsive: true,
  });

  return imageComponent.getElement();
};

/**
 * Creates the product specifications section
 * @private
 * @param {Object} productData - Product specifications
 * @returns {HTMLElement} The product data element
 */
const createProductDataElement = (productData) => {
  const container = createElement('div', {
    classes: 'product-card__data',
  });

  const specsList = createElement('ul', {
    classes: 'product-card__specs',
  });

  Object.entries(productData).forEach(([key, value]) => {
    const specItem = createElement('li', {
      classes: 'product-card__spec-item',
    });

    const specLabel = Typography({
      children: `${key}:`,
      className: 'product-card__spec-label',
    }).getElement();

    const specValue = Typography({
      children: value,
      className: 'product-card__spec-value',
    }).getElement();

    specItem.appendChild(specLabel);
    specItem.appendChild(specValue);
    specsList.appendChild(specItem);
  });

  container.appendChild(specsList);
  return container;
};

/**
 * Creates the price and action section
 * @private
 * @param {string|number} price - Product price
 * @param {string} currency - Currency symbol
 * @param {string} buttonText - Text for the reserve button
 * @param {Function} onClick - Callback function when reserve button is clicked
 * @param {boolean} loading - Whether price is loading
 * @param {boolean} priceHighlighted - Whether price should be highlighted
 * @param {string} [priceInfo] - Additional price information (e.g., "inkl. Steuer")
 * @returns {Object} The actions element and component references
 */
const createActionsElement = (
  price,
  currency,
  buttonText,
  onClick,
  loading,
  priceHighlighted,
  priceInfo
) => {
  const container = createElement('div', {
    classes: 'product-card__actions',
  });

  const priceComponent = PriceDisplay({
    label: '', // No label for product card prices
    value: `${currency}${price}`,
    loading,
    isHighlighted: priceHighlighted,
    className: 'product-card__price-display',
  });

  const priceElement = priceComponent.getElement();
  container.appendChild(priceElement);

  // Add price info if provided
  if (priceInfo) {
    const priceInfoElement = Typography({
      children: priceInfo,
      className: 'product-card__price-info',
      variant: 'caption',
    }).getElement();
    container.appendChild(priceInfoElement);
  }

  const reserveButton = Button({
    text: buttonText,
    onClick,
    variant: 'default',
    className: 'product-card__reserve-button',
    disabled: loading,
  }).getElement();

  container.appendChild(reserveButton);

  return {
    element: container,
    priceComponent,
  };
};

/**
 * Migrates legacy props to standardized props
 * @private
 * @param {Object} props - Component props
 * @returns {Object} Migrated props
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  if ('onReserve' in props && !('onClick' in props)) {
    console.warn('[ProductCard] onReserve is deprecated, use onClick instead');
    migrated.onClick = props.onReserve;
    delete migrated.onReserve;
  }

  return migrated;
};

/**
 * Creates a ProductCard component
 * @param {Object} props - ProductCard properties
 * @param {string} props.imageUrl - URL to the product image
 * @param {string} [props.fallbackImageUrl] - Fallback image URL if primary fails
 * @param {string} props.title - Product title
 * @param {Object} props.productData - Product specifications
 * @param {string|number} props.price - Product price
 * @param {string} [props.currency='€'] - Currency symbol
 * @param {string} [props.buttonText='Reserve'] - Text for the reserve button
 * @param {Function} [props.onClick] - Callback function when reserve button is clicked
 * @param {Function} [props.onReserve] - DEPRECATED: Use onClick instead
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {boolean} [props.loading=false] - Whether price is loading
 * @param {boolean} [props.priceHighlighted=false] - Whether price should be highlighted
 * @param {string} [props.priceInfo] - Additional price information (e.g., "inkl. Steuer")
 * @returns {Object} ProductCard component API
 */
const createProductCard = (props) => {
  // Inject styles on first render (automatically cached)
  injectProductCardStyles(productCardStyles);

  // Migrate legacy props
  const normalizedProps = migrateLegacyProps(props);

  // Validate required props
  validateProps(
    normalizedProps,
    createProductCard.requiredProps,
    'ProductCard'
  );

  // Extract props with defaults
  const {
    imageUrl,
    fallbackImageUrl,
    title,
    productData,
    price,
    currency = '€',
    buttonText = 'Reserve',
    onClick = () => {},
    className = '',
    loading = false,
    priceHighlighted = false,
    priceInfo,
  } = normalizedProps;

  const classNames = ['product-card'];
  if (className) {
    classNames.push(className);
  }

  // Create the product image using Image component
  const imageElement = createProductImageElement(
    imageUrl,
    title,
    fallbackImageUrl
  );

  // Create content container for product data and actions
  const contentContainer = createElement('div', {
    classes: 'product-card__content-container',
  });

  const productDataElement = createProductDataElement(productData);
  contentContainer.appendChild(productDataElement);

  const { element: actionsElement, priceComponent } = createActionsElement(
    price,
    currency,
    buttonText,
    onClick,
    loading,
    priceHighlighted,
    priceInfo
  );
  contentContainer.appendChild(actionsElement);

  // Create the card using the base Card component without image
  const card = Card({
    title,
    children: contentContainer,
    className: classNames.join(' '),
  });

  // Get the card element and add the image
  const cardElement = card.getElement();

  // Insert image before the title
  const titleElement = cardElement.querySelector('.card__title');
  if (titleElement && titleElement.parentNode) {
    titleElement.parentNode.insertBefore(imageElement, titleElement);
  }

  const components = {
    card,
    priceComponent,
  };

  return {
    /**
     * Gets the product card element
     * @returns {HTMLElement} The product card element
     */
    getElement() {
      return cardElement;
    },

    /**
     * Updates the product card with new props
     * @param {Object} newProps - New properties
     * @returns {Object} Updated component
     */
    update(newProps) {
      const updatedComponent = createProductCard({
        ...normalizedProps,
        ...newProps,
      });

      if (cardElement.parentNode) {
        cardElement.parentNode.replaceChild(
          updatedComponent.getElement(),
          cardElement
        );
      }

      return updatedComponent;
    },

    /**
     * Clean up resources
     */
    destroy() {
      if (components.card) {
        components.card.destroy();
      }
      if (components.priceComponent) {
        components.priceComponent.destroy();
      }
    },

    /**
     * Set price loading state
     * @param {boolean} isLoading - Whether price is loading
     * @returns {Object} Component for chaining
     */
    setPriceLoading(isLoading) {
      if (components.priceComponent) {
        components.priceComponent.setLoading(isLoading);
      }
      return this;
    },

    /**
     * Update price value
     * @param {string|number} newPrice - New price value
     * @param {boolean} [isHighlighted=false] - Whether to highlight the price
     * @returns {Object} Component for chaining
     */
    setPrice(newPrice, isHighlighted = false) {
      if (components.priceComponent) {
        components.priceComponent.setValue(
          `${currency}${newPrice}`,
          isHighlighted
        );
      }
      return this;
    },

    /**
     * Update price info text
     * @param {string} newPriceInfo - New price info text
     * @returns {Object} Component for chaining
     */
    setPriceInfo(newPriceInfo) {
      return this.update({ ...normalizedProps, priceInfo: newPriceInfo });
    },

    /**
     * Handle theme changes
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      console.debug(
        `ProductCard: theme changed from ${previousTheme} to ${theme}`
      );
    },
  };
};

// Define required props for validation
createProductCard.requiredProps = ['imageUrl', 'title', 'productData', 'price'];

// Create the component with theme awareness
const ProductCard = withThemeAwareness(
  createComponent('ProductCard', createProductCard)
);

export default ProductCard;
