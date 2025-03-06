// src/components/Card/Card.js
import './Card.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Card component for displaying content in a card container
 * @extends Component
 */
export default class Card extends Component {
  /**
   * Creates a new Card instance
   *
   * @param {Object} props - Card properties
   * @param {string|HTMLElement|Array} props.children - Card content
   * @param {string} [props.title] - Card title
   * @param {string|HTMLElement} [props.image] - Card image (URL string or HTMLElement)
   * @param {string} [props.footer] - Card footer content
   * @param {boolean} [props.outlined=false] - Whether to use an outlined style
   * @param {boolean} [props.elevated=false] - Whether to add elevation shadow
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({
    children,
    title,
    image,
    footer,
    outlined = false,
    elevated = false,
    className = '',
  }) {
    super();

    this.validateRequiredProps({ children }, ['children'], 'Card');

    this.props = {
      children,
      title,
      image,
      footer,
      outlined,
      elevated,
      className,
    };

    this.card = this.createCardElement();
  }

  /**
   * Creates the card element with all its parts
   * @private
   * @returns {HTMLElement} The card element
   */
  createCardElement() {
    const { title, image, footer, outlined, elevated, className } = this.props;

    // Build class names
    const classNames = this.createClassNames('card', className, {
      'card--outlined': outlined,
      'card--elevated': elevated,
    });

    // Create the main card element
    const card = this.createElement('div', { className: classNames });

    // Add image if provided
    if (image) {
      const imageEl =
        typeof image === 'string'
          ? this.createElement('img', {
              className: 'card__image',
              attributes: { src: image, alt: title || 'Card image' },
            })
          : image;

      card.appendChild(imageEl);
    }

    // Add title if provided
    if (title) {
      const titleEl = this.createElement('div', {
        className: 'card__title',
        textContent: title,
      });
      card.appendChild(titleEl);
    }

    // Add content
    const content = this.createElement('div', {
      className: 'card__content',
      children: this.props.children,
    });
    card.appendChild(content);

    // Add footer if provided
    if (footer) {
      const footerEl = this.createElement('div', {
        className: 'card__footer',
        children: footer,
      });
      card.appendChild(footerEl);
    }

    return card;
  }

  /**
   * Gets the card element
   * @returns {HTMLElement} The card element
   */
  getElement() {
    return this.card;
  }
}
