// src/components/Button/Button.js
import './Button.css';

export default class Button {
  constructor({ text, onClick, className = '', disabled = false }) {
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

    this.button = document.createElement('button');
    this.button.textContent = this.text;
    this.button.className = `btn ${this.className}`.trim();
    this.button.disabled = this.disabled;
    if (!this.disabled) {
      this.button.addEventListener('click', this.onClick);
    }
  }

  getElement() {
    return this.button;
  }
}
