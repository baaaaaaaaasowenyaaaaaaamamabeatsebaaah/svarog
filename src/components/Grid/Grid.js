import './Grid.css';

export class Grid {
  constructor({
    rowGap,
    desktopRowGap,
    tabletRowGap,
    mobileRowGap,
    mobileReverse,
    reverse,
  }) {
    this.rowGap = rowGap;
    this.desktopRowGap = desktopRowGap;
    this.tabletRowGap = tabletRowGap;
    this.mobileRowGap = mobileRowGap;
    this.mobileReverse = mobileReverse;
    this.reverse = reverse;
    this.grid = document.createElement('div');
    this.grid.className = 'grid';
    this.setStyles();
  }

  setStyles() {
    this.grid.style.display = 'grid';
    this.grid.style.width = '100%';
    this.grid.style.gap = this.rowGap || '1rem';
    this.grid.style.gridTemplateColumns = 'repeat(12, 1fr)';

    if (this.reverse) {
      this.grid.style.flexDirection = 'row-reverse';
    }

    if (this.mobileReverse) {
      this.grid.classList.add('mobile-reverse');
    }
  }

  appendChild(child) {
    this.grid.appendChild(child);
  }

  getElement() {
    return this.grid;
  }
}

export class Column {
  constructor({
    children,
    width,
    mobileWidth,
    tabletWidth,
    desktopWidth,
    desktopOffset,
    offset,
  }) {
    this.width = width;
    this.mobileWidth = mobileWidth;
    this.tabletWidth = tabletWidth;
    this.desktopWidth = desktopWidth;
    this.desktopOffset = desktopOffset;
    this.offset = offset;
    this.column = document.createElement('div');
    this.column.className = 'column';
    this.setStyles();
    this.appendChildren(children);
  }

  setStyles() {
    this.column.style.gridColumnEnd = `span ${this.width}`;
    if (this.offset) {
      this.column.style.gridColumnStart = this.offset + 1;
    }
  }

  appendChildren(children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        this.column.appendChild(child);
      });
    } else {
      this.column.appendChild(children);
    }
  }

  getElement() {
    return this.column;
  }
}

Grid.Column = Column;
export default Grid;
