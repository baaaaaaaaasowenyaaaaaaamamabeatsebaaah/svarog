import './Link.css';

export default class Link {
  constructor({
    children,
    href,
    color,
    hoverColor,
    size,
    target,
    weight,
    underline,
    block,
  }) {
    this.href = href;
    this.color = color;
    this.hoverColor = hoverColor;
    this.size = size;
    this.target = target;
    this.weight = weight;
    this.underline = underline;
    this.block = block;

    this.link = document.createElement('a');
    this.link.href = this.href;
    this.link.className = 'link';
    this.link.target = this.target || '_self';
    this.setStyle();
    this.link.innerHTML = children;
  }

  setStyle() {
    this.link.style.color = this.color || '';
    this.link.style.fontSize = this.size || '';
    this.link.style.fontWeight = this.weight || '';
    this.link.style.textDecoration = this.underline ? 'underline' : 'none';
    this.link.style.display = this.block ? 'block' : 'inline-flex';
  }

  getElement() {
    return this.link;
  }
}
