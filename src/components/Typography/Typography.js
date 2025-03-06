// src/components/Typography/Typography.js
import './Typography.css';

export default class Typography {
  constructor({
    children,
    textAlign,
    tabletSize,
    mobileSize,
    color,
    as = 'span',
    id,
    italic = false,
    className = '',
    weight,
    block = false,
  }) {
    // Required props validation
    if (!children) {
      throw new Error('Typography must have content');
    }

    // Type validation
    const validElements = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'span',
      'div',
    ];
    if (!validElements.includes(as)) {
      throw new Error(
        `Invalid element type: ${as}. Must be one of: ${validElements.join(', ')}`
      );
    }

    if (
      textAlign &&
      !['left', 'center', 'right', 'justify'].includes(textAlign)
    ) {
      throw new Error('textAlign must be one of: left, center, right, justify');
    }

    if (id && typeof id !== 'string') {
      throw new Error('id must be a string');
    }

    if (typeof italic !== 'boolean') {
      throw new Error('italic must be a boolean');
    }

    if (typeof block !== 'boolean') {
      throw new Error('block must be a boolean');
    }

    if (
      weight &&
      ![
        'normal',
        'bold',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
      ].includes(String(weight))
    ) {
      throw new Error('Invalid font weight value');
    }

    // Size validation
    this.validateSize(tabletSize, 'tabletSize');
    this.validateSize(mobileSize, 'mobileSize');

    // Color validation
    if (color && !this.isValidColor(color)) {
      throw new Error('Invalid color value');
    }

    this.children = children;
    this.textAlign = textAlign;
    this.tabletSize = tabletSize;
    this.mobileSize = mobileSize;
    this.color = color;
    this.as = as;
    this.id = id;
    this.italic = italic;
    this.className = className;
    this.weight = weight;
    this.block = block;

    try {
      this.typography = document.createElement(this.as);
      this.typography.className = `typography ${this.className}`.trim();
      this.typography.id = this.id || '';

      if (typeof this.children === 'string') {
        this.typography.innerHTML = this.children;
      } else if (this.children instanceof HTMLElement) {
        this.typography.appendChild(this.children);
      } else {
        throw new Error('children must be string or HTMLElement');
      }

      this.setStyle();
    } catch (error) {
      throw new Error(`Failed to create Typography: ${error.message}`);
    }
  }

  validateSize(size, propertyName) {
    if (size && typeof size !== 'string') {
      throw new Error(`${propertyName} must be a string value`);
    }
    if (size && !size.match(/^(\d+(\.\d+)?)(px|rem|em|%)$/)) {
      throw new Error(
        `Invalid ${propertyName} format. Must be a valid CSS size value`
      );
    }
  }

  isValidColor(color) {
    // Check if it's a valid CSS color
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
  }

  setStyle() {
    if (this.textAlign) this.typography.style.textAlign = this.textAlign;
    if (this.color) this.typography.style.color = this.color;
    if (this.weight) this.typography.style.fontWeight = this.weight;
    this.typography.style.fontStyle = this.italic ? 'italic' : 'normal';
    this.typography.style.display = this.block ? 'block' : 'inline';
  }

  getElement() {
    return this.typography;
  }
}
