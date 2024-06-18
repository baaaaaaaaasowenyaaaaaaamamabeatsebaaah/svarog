import './Button.css';

export default class Button {
  constructor({ text, onClick, className = '' }) {
    this.text = text;
    this.onClick = onClick;
    this.className = className;

    this.button = document.createElement('button');
    this.button.textContent = this.text;
    this.button.className = `btn ${this.className}`;
    this.button.addEventListener('click', this.onClick);
  }

  getElement() {
    return this.button;
  }
}
