// src/components/Typography/Typography.js
import './Typography.css';
import { Component } from '../../utils/componentFactory.js';

export default class Typography extends Component {
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
    super();

    // Validate required props
    this.validateRequiredProps({ children }, ['children'], 'Typography');

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

    // Weight validation - accept both numeric and named weights
    if (weight) {
      const validWeights = [
        'light',
        'regular',
        'medium',
        'semibold',
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
        'normal', // Allow 'normal' as well
      ];
      if (!validWeights.includes(String(weight))) {
        throw new Error(
          `Invalid font weight value: ${weight}. Must be one of: ${validWeights.join(', ')}`
        );
      }
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

    this.element = this.createTypographyElement();
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

  createTypographyElement() {
    const classNames = this.createClassNames(
      'typography',
      `typography--${this.as}`,
      this.block ? 'typography--block' : 'typography--inline',
      this.textAlign ? `typography--align-${this.textAlign}` : '',
      this.italic ? 'typography--italic' : '',
      this.weight ? `typography--weight-${this.weight}` : '',
      this.className
    );

    const element = this.createElement(this.as, {
      className: classNames,
      id: this.id || '',
    });

    // Add custom data attributes for responsive sizes
    if (this.tabletSize) {
      element.setAttribute('data-tablet-size', this.tabletSize);
    }
    if (this.mobileSize) {
      element.setAttribute('data-mobile-size', this.mobileSize);
    }

    // Apply inline styles for testing and direct manipulation
    if (this.textAlign) {
      element.style.textAlign = this.textAlign;
    }

    if (this.block) {
      element.style.display = 'block';
    } else {
      element.style.display = 'inline';
    }

    if (this.italic) {
      element.style.fontStyle = 'italic';
    }

    // Apply inline styles that don't have CSS classes
    if (this.color) {
      element.style.color = this.color;
    }

    if (typeof this.children === 'string') {
      element.innerHTML = this.children;
    } else if (this.children instanceof HTMLElement) {
      element.appendChild(this.children);
    } else {
      throw new Error('children must be string or HTMLElement');
    }

    return element;
  }

  getElement() {
    return this.element;
  }
}
