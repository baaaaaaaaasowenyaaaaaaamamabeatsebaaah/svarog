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
    italic,
    className = '',
    weight,
    block,
  }) {
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

    this.typography = document.createElement(this.as);
    this.typography.className = `typography ${this.className}`;
    this.typography.id = this.id || '';
    this.typography.innerHTML = this.children;

    this.setStyle();
  }

  setStyle() {
    this.typography.style.textAlign = this.textAlign || '';
    this.typography.style.color = this.color || '';
    this.typography.style.fontWeight = this.weight || '400';
    this.typography.style.fontStyle = this.italic ? 'italic' : 'normal';
    this.typography.style.display = this.block ? 'block' : 'inline';
  }

  getElement() {
    return this.typography;
  }
}
