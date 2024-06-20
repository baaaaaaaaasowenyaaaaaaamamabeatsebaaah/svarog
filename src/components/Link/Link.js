import './Link.css';

export default class Link {
  constructor({ children, href, target, underline, block }) {
    this.href = href;
    this.target = target;
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
    this.link.style.textDecoration = this.underline ? 'underline' : 'none';
    this.link.style.display = this.block ? 'block' : 'inline-flex';
  }

  getElement() {
    return this.link;
  }
}
