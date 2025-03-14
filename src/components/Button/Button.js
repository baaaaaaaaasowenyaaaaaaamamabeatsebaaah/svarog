// src/components/Button/Button.js - Improved Version
import './Button.css';
import { Component } from '../../utils/componentFactory.js';

export default class Button extends Component {
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

    this.props = { text, onClick, className, disabled, type, size, variant };
    this.element = this.createButtonElement();
  }

  createButtonElement() {
    const { text, type, disabled, size, variant } = this.props;

    const classNames = this.createClassNames(
      'btn',
      {
        [`btn--${size}`]: size,
        [`btn--${variant}`]: variant,
      },
      this.props.className
    );

    return this.createElement('button', {
      className: classNames,
      textContent: text,
      attributes: { type },
      disabled,
      events: {
        click: !disabled && this.props.onClick,
      },
    });
  }

  setText(text) {
    this.props.text = text;
    this.element.textContent = text;
    return this;
  }

  setDisabled(disabled) {
    this.props.disabled = disabled;
    this.element.disabled = disabled;

    // Update click handler
    if (disabled) {
      this.element.removeEventListener('click', this.props.onClick);
    } else if (this.props.onClick) {
      this.element.addEventListener('click', this.props.onClick);
    }

    return this;
  }

  getElement() {
    return this.element;
  }
}
