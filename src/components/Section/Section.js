// src/components/Section/Section.js
import './Section.css';

export class Section {
  constructor({ children, id, variant, backgroundImage, noPaddingBottom }) {
    // Type validation
    if (id && typeof id !== 'string') {
      throw new Error('Section id must be a string');
    }

    if (variant && variant !== 'minor') {
      throw new Error('Section variant must be "minor" or undefined');
    }

    if (noPaddingBottom && typeof noPaddingBottom !== 'boolean') {
      throw new Error('noPaddingBottom must be a boolean');
    }

    if (backgroundImage && !(backgroundImage instanceof HTMLElement)) {
      throw new Error('backgroundImage must be an HTMLElement');
    }

    // Children validation
    if (!children) {
      throw new Error('Section must have children content');
    }

    this.children = children;
    this.id = id;
    this.variant = variant;
    this.backgroundImage = backgroundImage;
    this.noPaddingBottom = noPaddingBottom;

    try {
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
    } catch (error) {
      throw new Error(`Failed to create Section: ${error.message}`);
    }
  }

  appendChildren(container, children) {
    try {
      if (Array.isArray(children)) {
        children.forEach((child, index) => {
          if (typeof child === 'string') {
            container.appendChild(document.createTextNode(child));
          } else if (child instanceof HTMLElement) {
            container.appendChild(child);
          } else {
            throw new Error(
              `Invalid child at index ${index}: must be string or HTMLElement`
            );
          }
        });
      } else {
        if (typeof children === 'string') {
          container.appendChild(document.createTextNode(children));
        } else if (children instanceof HTMLElement) {
          container.appendChild(children);
        } else {
          throw new Error(
            'Children must be string, HTMLElement, or array of these types'
          );
        }
      }
    } catch (error) {
      throw new Error(`Failed to append children: ${error.message}`);
    }
  }

  getElement() {
    return this.section;
  }
}
