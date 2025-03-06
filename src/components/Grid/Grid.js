// src/components/Grid/Grid.js
import './Grid.css';

class Column {
  constructor({
    children,
    width = 12,
    mobileWidth,
    tabletWidth,
    desktopWidth,
    desktopOffset,
    offset,
  }) {
    // Validation
    if (!children) {
      throw new Error('Column requires children content');
    }

    this.validateColumnWidth('width', width);
    if (mobileWidth) this.validateColumnWidth('mobileWidth', mobileWidth);
    if (tabletWidth) this.validateColumnWidth('tabletWidth', tabletWidth);
    if (desktopWidth) this.validateColumnWidth('desktopWidth', desktopWidth);
    if (desktopOffset) this.validateColumnWidth('desktopOffset', desktopOffset);
    if (offset) this.validateColumnWidth('offset', offset);

    this.width = width;
    this.mobileWidth = mobileWidth;
    this.tabletWidth = tabletWidth;
    this.desktopWidth = desktopWidth;
    this.desktopOffset = desktopOffset;
    this.offset = offset;

    this.column = document.createElement('div');
    this.setStyles();
    this.appendChildren(children);
  }

  validateColumnWidth(prop, value) {
    if (!Number.isInteger(value) || value < 1 || value > 12) {
      throw new Error(`${prop} must be an integer between 1 and 12`);
    }
  }

  setStyles() {
    this.column.className = 'column';
    this.column.style.gridColumnEnd = `span ${this.width}`;

    // Handle offset
    if (this.offset) {
      this.column.style.gridColumnStart = this.offset + 1;
    }

    // Add responsive classes
    if (this.mobileWidth) {
      this.column.classList.add(`column--mobile-${this.mobileWidth}`);
    }
    if (this.tabletWidth) {
      this.column.classList.add(`column--tablet-${this.tabletWidth}`);
    }
    if (this.desktopWidth) {
      this.column.classList.add(`column--desktop-${this.desktopWidth}`);
    }
    if (this.desktopOffset) {
      this.column.classList.add(`column--desktop-offset-${this.desktopOffset}`);
    }
  }

  appendChildren(children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (child instanceof HTMLElement) {
          this.column.appendChild(child);
        } else {
          throw new Error('Each child must be an HTMLElement');
        }
      });
    } else if (children instanceof HTMLElement) {
      this.column.appendChild(children);
    } else {
      throw new Error('Children must be HTMLElement or array of HTMLElements');
    }
  }

  getElement() {
    return this.column;
  }
}

class Grid {
  constructor({
    rowGap,
    columnGap,
    gap,
    alignItems,
    justifyItems,
    mobileReverse = false,
    reverse = false,
  } = {}) {
    // Validation
    if (gap && !this.isValidCSSValue(gap)) {
      throw new Error('Invalid gap value');
    }
    if (rowGap && !this.isValidCSSValue(rowGap)) {
      throw new Error('Invalid rowGap value');
    }
    if (columnGap && !this.isValidCSSValue(columnGap)) {
      throw new Error('Invalid columnGap value');
    }

    const validAlignments = ['start', 'end', 'center', 'stretch'];
    if (alignItems && !validAlignments.includes(alignItems)) {
      throw new Error(
        `alignItems must be one of: ${validAlignments.join(', ')}`
      );
    }
    if (justifyItems && !validAlignments.includes(justifyItems)) {
      throw new Error(
        `justifyItems must be one of: ${validAlignments.join(', ')}`
      );
    }

    this.config = {
      rowGap,
      columnGap,
      gap,
      alignItems,
      justifyItems,
      mobileReverse,
      reverse,
    };

    this.grid = document.createElement('div');
    this.setStyles();
  }

  isValidCSSValue(value) {
    return (
      typeof value === 'string' &&
      (value.endsWith('px') ||
        value.endsWith('rem') ||
        value.endsWith('em') ||
        value.endsWith('%') ||
        value === 'auto')
    );
  }

  setStyles() {
    this.grid.className = 'grid';

    // Base grid styles
    this.grid.style.display = 'grid';
    this.grid.style.gridTemplateColumns = 'repeat(12, 1fr)';

    // Gap handling
    if (this.config.gap) {
      this.grid.style.gap = this.config.gap;
    } else {
      if (this.config.rowGap) this.grid.style.rowGap = this.config.rowGap;
      if (this.config.columnGap)
        this.grid.style.columnGap = this.config.columnGap;
    }

    // Alignment
    if (this.config.alignItems) {
      this.grid.style.alignItems = this.config.alignItems;
    }
    if (this.config.justifyItems) {
      this.grid.style.justifyItems = this.config.justifyItems;
    }

    // Direction
    if (this.config.reverse) {
      this.grid.classList.add('grid--reverse');
    }
    if (this.config.mobileReverse) {
      this.grid.classList.add('grid--mobile-reverse');
    }
  }

  appendChild(child) {
    if (!(child instanceof HTMLElement)) {
      throw new Error('Child must be an HTMLElement');
    }
    this.grid.appendChild(child);
  }

  getElement() {
    return this.grid;
  }
}

// Add Column as a static property of Grid
Grid.Column = Column;

// Export only Grid as default
export default Grid;
