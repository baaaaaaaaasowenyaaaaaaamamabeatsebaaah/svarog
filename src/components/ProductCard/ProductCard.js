// src/components/ProductCard/ProductCard.js
import './ProductCard.css';
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import Card from '../Card/Card.js';
import Button from '../Button/Button.js';
import Typography from '../Typography/Typography.js';

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

  // Create a list of product specifications
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
 * @param {Function} onReserve - Callback function when reserve button is clicked
 * @returns {HTMLElement} The actions element
 */
const createActionsElement = (price, currency, buttonText, onReserve) => {
  const container = createElement('div', {
    classes: 'product-card__actions',
  });

  // Create price element
  const priceElement = Typography({
    children: `${currency}${price}`,
    className: 'product-card__price',
    weight: 'bold',
    as: 'div',
  }).getElement();

  // Create reserve button
  const reserveButton = Button({
    text: buttonText,
    onClick: onReserve,
    variant: 'primary',
    className: 'product-card__reserve-button',
  }).getElement();

  container.appendChild(priceElement);
  container.appendChild(reserveButton);
  return container;
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
 * @param {Function} [props.onReserve] - Callback function when reserve button is clicked
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {Object} ProductCard component API
 */
const createProductCard = (props) => {
  // Validate required props
  validateProps(props, createProductCard.requiredProps, 'ProductCard');

  // Extract props with defaults
  const {
    imageUrl,
    title,
    productData,
    price,
    currency = '€',
    buttonText = 'Reserve',
    onReserve = () => {},
    className = '',
  } = props;

  // Combine class names
  const classNames = ['product-card'];
  if (className) {
    classNames.push(className);
  }

  // Create content container for product data and actions
  const contentContainer = createElement('div', {
    classes: 'product-card__content-container',
  });

  // Add product data section
  const productDataElement = createProductDataElement(productData);
  contentContainer.appendChild(productDataElement);

  // Add price and actions section
  const actionsElement = createActionsElement(
    price,
    currency,
    buttonText,
    onReserve
  );
  contentContainer.appendChild(actionsElement);

  // Create the card using the base Card component
  const card = Card({
    title,
    image: imageUrl,
    children: contentContainer,
    className: classNames.join(' '),
  });

  // Keep reference to child components for later cleanup
  const components = {
    card,
  };

  // Return the component API
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
      // Create a new component with merged props
      const updatedComponent = createProductCard({
        ...props,
        ...newProps,
      });

      // Replace the old element if it's in the DOM
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
      // Clean up nested components
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

// Export as a factory function
export default ProductCard;
