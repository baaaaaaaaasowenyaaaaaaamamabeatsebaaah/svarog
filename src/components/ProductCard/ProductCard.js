// src/components/ProductCard/ProductCard.js
import './ProductCard.css';
import { Component } from '../../utils/componentFactory.js';
import Card from '../Card/Card.js';
import Button from '../Button/Button.js';
import Typography from '../Typography/Typography.js';

/**
 * ProductCard component for displaying product information with reserve functionality
 * @extends Component
 */
export default class ProductCard extends Component {
  /**
   * Creates a new ProductCard instance
   *
   * @param {Object} props - ProductCard properties
   * @param {string} props.imageUrl - URL to the product image
   * @param {string} props.title - Product title
   * @param {Object} props.productData - Product specifications
   * @param {string|number} props.price - Product price
   * @param {string} [props.currency='€'] - Currency symbol
   * @param {string} [props.buttonText='Reserve'] - Text for the reserve button
   * @param {Function} [props.onReserve] - Callback function when reserve button is clicked
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({
    imageUrl,
    title,
    productData,
    price,
    currency = '€',
    buttonText = 'Reserve',
    onReserve = () => {},
    className = '',
  }) {
    super();

    this.validateRequiredProps(
      { imageUrl, title, productData, price },
      ['imageUrl', 'title', 'productData', 'price'],
      'ProductCard'
    );

    this.props = {
      imageUrl,
      title,
      productData,
      price,
      currency,
      buttonText,
      onReserve,
      className,
    };

    this.element = this.createProductCardElement();
  }

  /**
   * Creates the product data section with specifications
   * @private
   * @returns {HTMLElement} The product data element
   */
  createProductDataElement() {
    const { productData } = this.props;
    const container = this.createElement('div', {
      className: 'product-card__data',
    });

    // Create a list of product specifications
    const specsList = this.createElement('ul', {
      className: 'product-card__specs',
    });

    Object.entries(productData).forEach(([key, value]) => {
      const specItem = this.createElement('li', {
        className: 'product-card__spec-item',
      });

      const specLabel = new Typography({
        children: `${key}:`,
        className: 'product-card__spec-label',
        weight: 'medium',
      }).getElement();

      const specValue = new Typography({
        children: value,
        className: 'product-card__spec-value',
      }).getElement();

      specItem.appendChild(specLabel);
      specItem.appendChild(specValue);
      specsList.appendChild(specItem);
    });

    container.appendChild(specsList);
    return container;
  }

  /**
   * Creates the price and action section
   * @private
   * @returns {HTMLElement} The actions element
   */
  createActionsElement() {
    const { price, currency, buttonText, onReserve } = this.props;
    const container = this.createElement('div', {
      className: 'product-card__actions',
    });

    // Create price element
    const priceElement = new Typography({
      children: `${currency}${price}`,
      className: 'product-card__price',
      weight: 'bold',
      as: 'div',
    }).getElement();

    // Create reserve button
    const reserveButton = new Button({
      text: buttonText,
      onClick: onReserve,
      variant: 'primary',
      className: 'product-card__reserve-button',
    }).getElement();

    container.appendChild(priceElement);
    container.appendChild(reserveButton);
    return container;
  }

  /**
   * Creates the complete product card element
   * @private
   * @returns {HTMLElement} The product card element
   */
  createProductCardElement() {
    const { imageUrl, title, className } = this.props;

    // Create content container for product data and actions
    const contentContainer = this.createElement('div', {
      className: 'product-card__content-container',
    });

    // Add product data section
    const productDataElement = this.createProductDataElement();
    contentContainer.appendChild(productDataElement);

    // Add price and actions section
    const actionsElement = this.createActionsElement();
    contentContainer.appendChild(actionsElement);

    // Create the card using the base Card component
    const card = new Card({
      title,
      image: imageUrl,
      children: contentContainer,
      className: this.createClassNames('product-card', className),
      // No border or elevation as per requirements
    });

    return card.getElement();
  }

  /**
   * Gets the product card element
   * @returns {HTMLElement} The product card element
   */
  getElement() {
    return this.element;
  }
}
