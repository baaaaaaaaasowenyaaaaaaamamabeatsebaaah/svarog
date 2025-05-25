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

// Create style injector for ProductCard component
const injectProductCardStyles = createStyleInjector('ProductCard');

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
      weight: 'medium',
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
 * @returns {HTMLElement} The actions element
 */
const createActionsElement = (price, currency, buttonText, onClick) => {
  const container = createElement('div', {
    classes: 'product-card__actions',
  });

  const priceElement = Typography({
    children: `${currency}${price}`,
    className: 'product-card__price',
    weight: 'bold',
    as: 'div',
  }).getElement();

  const reserveButton = Button({
    text: buttonText,
    onClick,
    variant: 'primary',
    className: 'product-card__reserve-button',
  }).getElement();

  container.appendChild(priceElement);
  container.appendChild(reserveButton);
  return container;
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
 * @param {string} props.title - Product title
 * @param {Object} props.productData - Product specifications
 * @param {string|number} props.price - Product price
 * @param {string} [props.currency='€'] - Currency symbol
 * @param {string} [props.buttonText='Reserve'] - Text for the reserve button
 * @param {Function} [props.onClick] - Callback function when reserve button is clicked
 * @param {Function} [props.onReserve] - DEPRECATED: Use onClick instead
 * @param {string} [props.className=''] - Additional CSS class names
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
    title,
    productData,
    price,
    currency = '€',
    buttonText = 'Reserve',
    onClick = () => {},
    className = '',
  } = normalizedProps;

  const classNames = ['product-card'];
  if (className) {
    classNames.push(className);
  }

  // Create content container for product data and actions
  const contentContainer = createElement('div', {
    classes: 'product-card__content-container',
  });

  const productDataElement = createProductDataElement(productData);
  contentContainer.appendChild(productDataElement);

  const actionsElement = createActionsElement(
    price,
    currency,
    buttonText,
    onClick
  );
  contentContainer.appendChild(actionsElement);

  // Create the card using the base Card component
  const card = Card({
    title,
    image: imageUrl,
    children: contentContainer,
    className: classNames.join(' '),
  });

  const components = {
    card,
  };

  return {
    /**
     * Gets the product card element
     * @returns {HTMLElement} The product card element
     */
    getElement() {
      return components.card.getElement();
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

      const element = this.getElement();
      if (element.parentNode) {
        element.parentNode.replaceChild(updatedComponent.getElement(), element);
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
