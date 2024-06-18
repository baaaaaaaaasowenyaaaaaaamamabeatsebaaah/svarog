import './Button.css';

export default class Button {
  constructor({ text, onClick, className = '', disabled = false }) {
    this.text = text;
    this.onClick = onClick;
    this.className = className;
    this.disabled = disabled;

    this.button = document.createElement('button');
    this.button.textContent = this.text;
    this.button.className = `btn ${this.className}`;
    this.button.disabled = this.disabled;
    if (!this.disabled) {
      this.button.addEventListener('click', this.onClick);
    }
  }

  getElement() {
    return this.button;
  }
}
