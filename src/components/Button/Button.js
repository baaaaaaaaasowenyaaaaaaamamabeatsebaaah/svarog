// src/components/Button/Button.js
import './Button.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Button component
 * @extends Component
 */
export default class Button extends Component {
  /**
   * Create a Button component
   * @param {Object} props - Button properties
   * @param {string} props.text - Button text
   * @param {Function} props.onClick - Click event handler
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {boolean} [props.disabled=false] - Whether the button is disabled
   * @param {string} [props.type='button'] - Button type attribute
   * @param {string} [props.size=''] - Button size variant
   * @param {string} [props.variant=''] - Button style variant
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
    super();

    this.validateRequiredProps({ text, onClick }, ['text'], 'Button');

    // Initialize state
    this.setState({
      text,
      disabled,
    });

    // Store props
    this.props = { onClick, className, type, size, variant };

    // Create button element
    this.button = null;
  }

  /**
   * Initialize component
   * @override
   */
  initialize() {
    // Create button element
    this.button = this.createButtonElement();

    // Setup event listeners
    if (!this.getState('disabled') && this.props.onClick) {
      this._trackEventListener(this.button, 'click', this.props.onClick);
      this.button.addEventListener('click', this.props.onClick);
    }

    // Add state change subscriptions
    this.subscribe('text', this.handleTextChange.bind(this));
    this.subscribe('disabled', this.handleDisabledChange.bind(this));

    super.initialize();
  }

  /**
   * Create the button element
   * @private
   * @returns {HTMLElement} Button element
   */
  createButtonElement() {
    const { type, size, variant, className } = this.props;
    const { text, disabled } = this.getState();

    const classNames = this.createClassNames(
      'btn',
      {
        [`btn--${size}`]: size,
        [`btn--${variant}`]: variant,
      },
      className
    );

    return this.createElement('button', {
      className: classNames,
      textContent: text,
      attributes: { type },
      disabled,
    });
  }

  /**
   * Handle text state changes
   * @private
   * @param {string} newText - New button text
   */
  handleTextChange(newText) {
    if (this.button) {
      this.button.textContent = newText;
    }
  }

  /**
   * Handle disabled state changes
   * @private
   * @param {boolean} isDisabled - New disabled state
   */
  handleDisabledChange(isDisabled) {
    if (this.button) {
      this.button.disabled = isDisabled;

      // Update click event listener
      if (isDisabled) {
        this.button.removeEventListener('click', this.props.onClick);
      } else if (this.props.onClick) {
        this.button.addEventListener('click', this.props.onClick);
        // Track for cleanup
        this._trackEventListener(this.button, 'click', this.props.onClick);
      }
    }
  }

  /**
   * Set button text
   * @param {string} text - New button text
   * @returns {Button} This button instance
   */
  setText(text) {
    this.setState({ text });
    return this;
  }

  /**
   * Set button disabled state
   * @param {boolean} disabled - New disabled state
   * @returns {Button} This button instance
   */
  setDisabled(disabled) {
    this.setState({ disabled });
    return this;
  }

  /**
   * Get the button element
   * @override
   * @returns {HTMLElement} Button element
   */
  getElement() {
    return this.button;
  }

  /**
   * Clean up resources
   * @override
   */
  destroy() {
    super.destroy();
  }
}
