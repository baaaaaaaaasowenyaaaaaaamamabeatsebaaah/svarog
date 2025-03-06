// src/components/Navigation/NavigationList.js
import NavigationItem from './NavigationItem.js';

export default class NavigationList {
  constructor({ items = [], depth = 0, onSelect }) {
    if (!Array.isArray(items)) {
      throw new Error('NavigationList: items must be an array');
    }

    this.items = items;
    this.depth = depth;
    this.onSelect = onSelect;
    this.element = this.createElement();
  }

  createElement() {
    const list = document.createElement('ul');
    list.className = this.getListClassNames();

    this.items.forEach((itemConfig) => {
      const item = new NavigationItem({
        ...itemConfig,
        depth: this.depth,
        onClick: () => {
          if (this.onSelect) {
            this.onSelect(itemConfig);
          }
        },
      });
      list.appendChild(item.getElement());
    });

    return list;
  }

  getListClassNames() {
    const classNames = ['nav-list'];
    if (this.depth > 0) {
      classNames.push(`nav-list--depth-${this.depth}`);
    }
    return classNames.join(' ');
  }

  getElement() {
    return this.element;
  }
}
