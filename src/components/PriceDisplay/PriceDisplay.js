// src/components/PriceDisplay/PriceDisplay.js
import './PriceDisplay.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * PriceDisplay component for showing price information
 * @extends Component
 */
export default class PriceDisplay extends Component {
  /**
   * Creates a new PriceDisplay instance
   *
   * @param {Object} props - PriceDisplay properties
   * @param {string} props.label - Label text for the price
   * @param {string} [props.value=''] - Initial price value text
   * @param {boolean} [props.isLoading=false] - Whether the price is loading
   * @param {boolean} [props.isHighlighted=false] - Whether to highlight the price display
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({
    label,
    value = '',
    isLoading = false,
    isHighlighted = false,
    className = '',
  }) {
    super();

    // Validate required props
    if (!label) {
      throw new Error('PriceDisplay: label is required');
    }

    this.props = {
      label,
      value,
      isLoading,
      isHighlighted,
      className,
    };

    this.element = this.createPriceDisplay();
    this.valueElement = this.element.querySelector('.price-display__value');
  }

  /**
   * Creates the price display element
   * @private
   * @returns {HTMLElement} The price display element
   */
  createPriceDisplay() {
    const { label, value, isLoading, isHighlighted, className } = this.props;

    const container = this.createElement('div', {
      className: this.createClassNames('price-display', className, {
        'price-display--loading': isLoading,
        'price-display--highlighted': isHighlighted,
      }),
    });

    const labelElement = this.createElement('span', {
      className: 'price-display__label',
      textContent: label,
    });

    const valueElement = this.createElement('span', {
      className: 'price-display__value',
      textContent: value,
    });

    // Add loading indicator if loading
    if (isLoading) {
      const loadingIndicator = this.createElement('span', {
        className: 'price-display__loading-indicator',
      });
      valueElement.appendChild(document.createTextNode(' '));
      valueElement.appendChild(loadingIndicator);
    }

    container.appendChild(labelElement);
    container.appendChild(valueElement);

    return container;
  }

  /**
   * Set the price value
   *
   * @param {string} value - New price value text
   * @param {boolean} [isHighlighted=false] - Whether to highlight the price
   * @returns {PriceDisplay} This instance for chaining
   */
  setValue(value, isHighlighted = false) {
    this.props.value = value;
    this.props.isHighlighted = isHighlighted;

    // Update text content
    this.valueElement.textContent = value;

    // Update container class
    this.element.classList.toggle('price-display--highlighted', isHighlighted);

    return this;
  }

  /**
   * Set loading state
   *
   * @param {boolean} isLoading - Whether the price is loading
   * @returns {PriceDisplay} This instance for chaining
   */
  setLoading(isLoading) {
    this.props.isLoading = isLoading;
    this.element.classList.toggle('price-display--loading', isLoading);

    // Remove existing loading indicator if any
    const existingIndicator = this.valueElement.querySelector(
      '.price-display__loading-indicator'
    );
    if (existingIndicator) {
      this.valueElement.removeChild(existingIndicator);
    }

    // Add new loading indicator if loading
    if (isLoading) {
      const loadingIndicator = this.createElement('span', {
        className: 'price-display__loading-indicator',
      });
      this.valueElement.appendChild(document.createTextNode(' '));
      this.valueElement.appendChild(loadingIndicator);
    }

    return this;
  }

  /**
   * Gets the price display element
   * @returns {HTMLElement} The price display element
   */
  getElement() {
    return this.element;
  }
}
