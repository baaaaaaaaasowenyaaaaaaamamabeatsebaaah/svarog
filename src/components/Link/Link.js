// src/components/Link/Link.js
import './Link.css';

export default class Link {
  constructor({
    children,
    href,
    target = '_self',
    underline = false,
    block = false,
  }) {
    // Required props validation
    if (!children) {
      throw new Error('Link children content is required');
    }
    if (!href) {
      throw new Error('Link href is required');
    }

    // Target validation
    const validTargets = ['_self', '_blank', '_parent', '_top'];
    if (!validTargets.includes(target)) {
      throw new Error(
        `Invalid target: ${target}. Must be one of: ${validTargets.join(', ')}`
      );
    }

    // Type validation
    if (typeof underline !== 'boolean') {
      throw new Error('underline must be a boolean');
    }
    if (typeof block !== 'boolean') {
      throw new Error('block must be a boolean');
    }

    this.href = href;
    this.target = target;
    this.underline = underline;
    this.block = block;

    this.link = document.createElement('a');
    this.link.href = this.href;
    this.link.className = 'link';
    this.link.target = this.target;
    this.setStyle();

    // Handle different types of children content
    if (typeof children === 'string') {
      this.link.textContent = children;
    } else if (children instanceof HTMLElement) {
      this.link.appendChild(children);
    } else {
      throw new Error('Link children must be either string or HTMLElement');
    }
  }

  setStyle() {
    this.link.style.textDecoration = this.underline ? 'underline' : 'none';
    this.link.style.display = this.block ? 'block' : 'inline-flex';
  }

  getElement() {
    return this.link;
  }
}
