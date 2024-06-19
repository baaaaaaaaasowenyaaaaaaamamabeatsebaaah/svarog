import './Section.css';

export class Section {
  constructor({ children, id, variant, backgroundImage, noPaddingBottom }) {
    this.children = children;
    this.id = id;
    this.variant = variant;
    this.backgroundImage = backgroundImage;
    this.noPaddingBottom = noPaddingBottom;

    this.section = document.createElement('div');
    this.section.className = 'section';
    if (variant === 'minor') {
      this.section.classList.add('section--minor');
    }
    if (noPaddingBottom) {
      this.section.classList.add('section--no-padding-bottom');
    }
    if (id) {
      const anchor = document.createElement('div');
      anchor.id = id;
      this.section.appendChild(anchor);
    }
    if (backgroundImage) {
      const bgImage = document.createElement('div');
      bgImage.className = 'section__background-image';
      bgImage.appendChild(backgroundImage);
      this.section.appendChild(bgImage);
    }
    const content = document.createElement('div');
    content.className = 'section__content';
    this.appendChildren(content, children);
    this.section.appendChild(content);
  }

  appendChildren(container, children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (typeof child === 'string') {
          const textNode = document.createTextNode(child);
          container.appendChild(textNode);
        } else {
          container.appendChild(child);
        }
      });
    } else {
      if (typeof children === 'string') {
        const textNode = document.createTextNode(children);
        container.appendChild(textNode);
      } else {
        container.appendChild(children);
      }
    }
  }

  getElement() {
    return this.section;
  }
}
