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
   * @param {boolean} [props.isPlaceholder=false] - Whether the value is a placeholder/hint
   * @param {boolean} [props.isError=false] - Whether displaying an error
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({
    label,
    value = '',
    isLoading = false,
    isHighlighted = false,
    isPlaceholder = false,
    isError = false,
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
      isPlaceholder,
      isError,
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
    const {
      label,
      value,
      isLoading,
      isHighlighted,
      isPlaceholder,
      isError,
      className,
    } = this.props;

    const container = this.createElement('div', {
      className: this.createClassNames('price-display', className, {
        'price-display--loading': isLoading,
        'price-display--highlighted': isHighlighted,
        'price-display--placeholder': isPlaceholder,
        'price-display--error': isError,
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
   * @param {boolean} [isPlaceholder=false] - Whether the value is a placeholder/hint
   * @returns {PriceDisplay} This instance for chaining
   */
  setValue(value, isHighlighted = false, isPlaceholder = false) {
    this.props.value = value;
    this.props.isHighlighted = isHighlighted;
    this.props.isPlaceholder = isPlaceholder;
    this.props.isError = false;

    // Update text content
    this.valueElement.textContent = value;

    // Update container classes
    this.element.classList.toggle('price-display--highlighted', isHighlighted);
    this.element.classList.toggle('price-display--placeholder', isPlaceholder);
    this.element.classList.remove('price-display--error');

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
   * Set placeholder state
   *
   * @param {boolean} isPlaceholder - Whether the value is a placeholder/hint
   * @returns {PriceDisplay} This instance for chaining
   */
  setPlaceholder(isPlaceholder) {
    this.props.isPlaceholder = isPlaceholder;
    this.element.classList.toggle('price-display--placeholder', isPlaceholder);
    return this;
  }

  /**
   * Set error state
   *
   * @param {string} errorMessage - The error message to display
   * @returns {PriceDisplay} This instance for chaining
   */
  setError(errorMessage) {
    this.props.value = errorMessage;
    this.props.isHighlighted = false;
    this.props.isPlaceholder = false;
    this.props.isError = true;

    // Update text content
    this.valueElement.textContent = errorMessage;

    // Update container classes
    this.element.classList.remove('price-display--highlighted');
    this.element.classList.remove('price-display--placeholder');
    this.element.classList.add('price-display--error');

    // Clear loading state if it's active
    this.setLoading(false);

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
