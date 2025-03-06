// src/components/Logo/Logo.js
import './Logo.css';

export default class Logo {
  constructor({ svgPath }) {
    // Required props validation
    if (!svgPath) {
      throw new Error('Logo svgPath is required');
    }

    // SVG path validation
    if (typeof svgPath !== 'string' || !svgPath.trim()) {
      throw new Error('svgPath must be a non-empty string');
    }

    if (!svgPath.toLowerCase().endsWith('.svg')) {
      throw new Error('svgPath must point to an SVG file');
    }

    this.svgPath = svgPath;
    this.logoContainer = document.createElement('div');
    this.logoContainer.className = 'logo-container';

    const img = document.createElement('img');
    img.src = this.svgPath;
    img.alt = 'Logo';

    // Handle image loading errors
    img.onerror = () => {
      console.error(`Failed to load logo from path: ${this.svgPath}`);
      // Add fallback or error state handling
      this.logoContainer.innerHTML = '<span class="logo-error">Logo</span>';
    };

    this.logoContainer.appendChild(img);
  }

  getElement() {
    return this.logoContainer;
  }
}
