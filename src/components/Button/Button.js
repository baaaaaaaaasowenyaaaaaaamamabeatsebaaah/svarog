// src/components/Button/Button.js
import './Button.css';

/**
 * Button component
 * @class
 */
export default class Button {
  /**
   * Creates a new Button instance
   * @param {Object} props - Button properties
   * @param {string} props.text - Text content of the button
   * @param {Function} props.onClick - Click event handler
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {boolean} [props.disabled=false] - Whether the button is disabled
   * @param {string} [props.type='button'] - Button type (button, submit, reset)
   * @param {string} [props.size=''] - Button size (small, medium, large)
   * @param {string} [props.variant=''] - Button variant (primary, secondary, text)
   * @throws {Error} If text is not provided or onClick is not a function when button is not disabled
   */
  constructor({
    text,
    onClick,
    className = '',
    disabled = false,
    type = 'button',
    size = '',
    variant = '',
  }) {
    // Required props validation
    if (!text) {
      throw new Error('Button text is required');
    }
    if (typeof onClick !== 'function' && !disabled) {
      throw new Error('onClick must be a function when button is not disabled');
    }

    this.text = text;
    this.onClick = onClick;
    this.className = className;
    this.disabled = disabled;
    this.type = type;
    this.size = size;
    this.variant = variant;

    this.button = this.createElement();
  }

  /**
   * Creates the button element
   * @private
   * @returns {HTMLButtonElement} The button element
   */
  createElement() {
    const button = document.createElement('button');

    // Set content
    button.textContent = this.text;

    // Set attributes
    button.type = this.type;
    button.disabled = this.disabled;

    // Set classes
    const classes = ['btn'];
    if (this.className) classes.push(this.className);
    if (this.size) classes.push(`btn--${this.size}`);
    if (this.variant) classes.push(`btn--${this.variant}`);

    button.className = classes.join(' ');

    // Add event handlers
    if (!this.disabled && this.onClick) {
      button.addEventListener('click', this.onClick);
    }

    return button;
  }

  /**
   * Updates the button text
   * @param {string} text - New button text
   * @returns {Button} The button instance for chaining
   */
  setText(text) {
    this.text = text;
    this.button.textContent = text;
    return this;
  }

  /**
   * Updates the disabled state
   * @param {boolean} disabled - New disabled state
   * @returns {Button} The button instance for chaining
   */
  setDisabled(disabled) {
    this.disabled = disabled;
    this.button.disabled = disabled;

    // Handle click event listener based on disabled state
    if (disabled) {
      this.button.removeEventListener('click', this.onClick);
    } else if (this.onClick) {
      this.button.addEventListener('click', this.onClick);
    }

    return this;
  }

  /**
   * Gets the button element
   * @returns {HTMLButtonElement} The button element
   */
  getElement() {
    return this.button;
  }
}
