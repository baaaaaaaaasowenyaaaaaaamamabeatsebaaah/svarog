import './Logo.css';

export default class Logo {
  constructor({ svgPath }) {
    this.svgPath = svgPath;
    this.logoContainer = document.createElement('div');
    this.logoContainer.className = 'logo-container';

    const img = document.createElement('img');
    img.src = this.svgPath;
    img.alt = 'Logo';
    this.logoContainer.appendChild(img);
  }

  getElement() {
    return this.logoContainer;
  }
}
