// src/components/Navigation/NavigationItem.js
import './NavigationItem.css';
import Link from '../Link/Link.js';

export default class NavigationItem {
  constructor({
    label,
    href,
    items = [],
    active = false,
    icon = null,
    disabled = false,
    onClick,
    depth = 0,
  }) {
    // Validation
    if (!label) {
      throw new Error('NavigationItem: label is required');
    }
    if (!href) {
      throw new Error('NavigationItem: href is required');
    }

    this.config = {
      label,
      href,
      items,
      active,
      icon,
      disabled,
      onClick,
      depth,
    };

    this.isExpanded = false;
    this.item = this.createElement();
  }

  createElement() {
    const item = document.createElement('li');
    item.className = this.getItemClassNames();

    const link = new Link({
      children: this.config.label,
      href: this.config.href,
      className: 'nav-item__link',
    }).getElement();

    if (this.config.disabled) {
      link.setAttribute('aria-disabled', 'true');
      link.classList.add('nav-item__link--disabled');
    }

    // Create link content wrapper
    const contentWrapper = document.createElement('span');
    contentWrapper.className = 'nav-item__content';

    // Add icon if present
    if (this.config.icon) {
      const icon = document.createElement('span');
      icon.className = `nav-item__icon nav-item__icon--${this.config.icon}`;
      contentWrapper.appendChild(icon);
    }

    // Add label
    const label = document.createElement('span');
    label.className = 'nav-item__label';
    label.textContent = this.config.label;
    contentWrapper.appendChild(label);

    // Add expand arrow if has items
    if (this.hasSubItems()) {
      const expandIcon = document.createElement('span');
      expandIcon.className = 'nav-item__expand-icon';
      contentWrapper.appendChild(expandIcon);
    }

    link.appendChild(contentWrapper);
    item.appendChild(link);

    // Add nested items if present
    if (this.hasSubItems()) {
      this.addSubItems(item);
    }

    this.setupEventListeners(link);
    return item;
  }

  hasSubItems() {
    return Array.isArray(this.config.items) && this.config.items.length > 0;
  }

  addSubItems(itemElement) {
    const subList = document.createElement('ul');
    subList.className = 'nav-item__sub-list';
    subList.setAttribute('aria-hidden', 'true');

    this.config.items.forEach((subItem) => {
      const nestedItem = new NavigationItem({
        ...subItem,
        depth: this.config.depth + 1,
      });
      subList.appendChild(nestedItem.getElement());
    });

    itemElement.appendChild(subList);
  }

  setupEventListeners(linkElement) {
    if (!this.config.disabled) {
      linkElement.addEventListener('click', (event) => {
        event.preventDefault();

        if (this.hasSubItems()) {
          this.toggleExpand();
        }

        if (this.config.onClick) {
          this.config.onClick();
        }
      });
    }

    // Keyboard navigation
    linkElement.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (!this.config.disabled) {
            if (this.hasSubItems()) {
              this.toggleExpand();
            }
            if (this.config.onClick) {
              this.config.onClick();
            }
          }
          break;
        case 'ArrowRight':
          if (this.hasSubItems() && !this.isExpanded) {
            event.preventDefault();
            this.expand();
          }
          break;
        case 'ArrowLeft':
          if (this.hasSubItems() && this.isExpanded) {
            event.preventDefault();
            this.collapse();
          }
          break;
      }
    });
  }

  toggleExpand() {
    this.isExpanded ? this.collapse() : this.expand();
  }

  expand() {
    const subList = this.item.querySelector('.nav-item__sub-list');
    if (subList) {
      this.isExpanded = true;
      this.item.classList.add('nav-item--expanded');
      subList.setAttribute('aria-hidden', 'false');
    }
  }

  collapse() {
    const subList = this.item.querySelector('.nav-item__sub-list');
    if (subList) {
      this.isExpanded = false;
      this.item.classList.remove('nav-item--expanded');
      subList.setAttribute('aria-hidden', 'true');
    }
  }

  getItemClassNames() {
    const classNames = ['nav-item'];

    if (this.config.active) classNames.push('nav-item--active');
    if (this.config.disabled) classNames.push('nav-item--disabled');
    if (this.hasSubItems()) classNames.push('nav-item--has-children');
    if (this.config.depth > 0)
      classNames.push(`nav-item--depth-${this.config.depth}`);

    return classNames.join(' ');
  }

  getElement() {
    return this.item;
  }
}
