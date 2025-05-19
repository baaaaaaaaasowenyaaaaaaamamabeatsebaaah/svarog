// src/components/Grid/Grid.js
import './Grid.css';
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';

/**
 * Creates a Column component for use within a Grid
 * @param {Object} props - Column properties
 * @returns {Object} Column component
 */
const createColumn = (props) => {
  const {
    children,
    width = 12,
    mobileWidth,
    tabletWidth,
    desktopWidth,
    desktopOffset,
    offset,
  } = props;

  // Validation for children is handled by requiredProps now
  // so we don't need an explicit check here

  // State
  let columnState = {
    children,
    width,
    mobileWidth,
    tabletWidth,
    desktopWidth,
    desktopOffset,
    offset,
  };

  // Validate column width
  const validateColumnWidth = (prop, value) => {
    if (!Number.isInteger(value) || value < 1 || value > 12) {
      throw new Error(`${prop} must be an integer between 1 and 12`);
    }
  };

  // Validate all widths
  validateColumnWidth('width', width);
  if (mobileWidth) validateColumnWidth('mobileWidth', mobileWidth);
  if (tabletWidth) validateColumnWidth('tabletWidth', tabletWidth);
  if (desktopWidth) validateColumnWidth('desktopWidth', desktopWidth);
  if (desktopOffset) validateColumnWidth('desktopOffset', desktopOffset);
  if (offset) validateColumnWidth('offset', offset);

  // Create the column element
  const buildColumnElement = () => {
    const column = createElement('div', {
      classes: ['column'],
      style: {
        gridColumnEnd: `span ${columnState.width}`,
      },
    });

    // Handle offset
    if (columnState.offset) {
      column.style.gridColumnStart = columnState.offset + 1;
    }

    // Add responsive classes
    if (columnState.mobileWidth) {
      column.classList.add(`column--mobile-${columnState.mobileWidth}`);
    }
    if (columnState.tabletWidth) {
      column.classList.add(`column--tablet-${columnState.tabletWidth}`);
    }
    if (columnState.desktopWidth) {
      column.classList.add(`column--desktop-${columnState.desktopWidth}`);
    }
    if (columnState.desktopOffset) {
      column.classList.add(
        `column--desktop-offset-${columnState.desktopOffset}`
      );
    }

    // Append children
    appendChildren(column, columnState.children);

    return column;
  };

  // Helper to append children
  const appendChildren = (parent, children) => {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (child instanceof HTMLElement) {
          parent.appendChild(child);
        } else {
          throw new Error('Each child must be an HTMLElement');
        }
      });
    } else if (children instanceof HTMLElement) {
      parent.appendChild(children);
    } else {
      throw new Error('Children must be HTMLElement or array of HTMLElements');
    }
  };

  // Initial column element
  let columnElement = buildColumnElement();

  // Public API
  return {
    /**
     * Get the column element
     * @returns {HTMLElement} Column element
     */
    getElement() {
      return columnElement;
    },

    /**
     * Update column properties
     * @param {Object} newProps - New properties
     * @returns {Object} Column component (for chaining)
     */
    update(newProps) {
      // Update state
      Object.assign(columnState, newProps);

      // Rebuild element (for simplicity)
      const oldElement = columnElement;
      columnElement = buildColumnElement();

      // Replace in DOM if the old element was inserted
      if (oldElement.parentNode) {
        oldElement.parentNode.replaceChild(columnElement, oldElement);
      }

      return this;
    },

    /**
     * Clean up resources
     */
    destroy() {
      columnElement = null;
    },
  };
};

/**
 * Creates a Grid component
 * @param {Object} props - Grid properties
 * @returns {Object} Grid component
 */
const createGrid = (props = {}) => {
  const {
    rowGap,
    columnGap,
    gap,
    alignItems,
    justifyItems,
    mobileReverse = false,
    reverse = false,
  } = props;

  // State
  let gridState = {
    rowGap,
    columnGap,
    gap,
    alignItems,
    justifyItems,
    mobileReverse,
    reverse,
  };

  // Validation
  const isValidCSSValue = (value) => {
    return (
      typeof value === 'string' &&
      (value.endsWith('px') ||
        value.endsWith('rem') ||
        value.endsWith('em') ||
        value.endsWith('%') ||
        value === 'auto')
    );
  };

  if (gap && !isValidCSSValue(gap)) {
    throw new Error('Invalid gap value');
  }
  if (rowGap && !isValidCSSValue(rowGap)) {
    throw new Error('Invalid rowGap value');
  }
  if (columnGap && !isValidCSSValue(columnGap)) {
    throw new Error('Invalid columnGap value');
  }

  const validAlignments = ['start', 'end', 'center', 'stretch'];
  if (alignItems && !validAlignments.includes(alignItems)) {
    throw new Error(`alignItems must be one of: ${validAlignments.join(', ')}`);
  }
  if (justifyItems && !validAlignments.includes(justifyItems)) {
    throw new Error(
      `justifyItems must be one of: ${validAlignments.join(', ')}`
    );
  }

  // Create the grid element
  const buildGridElement = () => {
    const classNames = ['grid'];
    if (gridState.reverse) classNames.push('grid--reverse');
    if (gridState.mobileReverse) classNames.push('grid--mobile-reverse');

    const grid = createElement('div', {
      classes: classNames,
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
      },
    });

    // Gap handling
    if (gridState.gap) {
      grid.style.gap = gridState.gap;
    } else {
      if (gridState.rowGap) grid.style.rowGap = gridState.rowGap;
      if (gridState.columnGap) grid.style.columnGap = gridState.columnGap;
    }

    // Alignment
    if (gridState.alignItems) {
      grid.style.alignItems = gridState.alignItems;
    }
    if (gridState.justifyItems) {
      grid.style.justifyItems = gridState.justifyItems;
    }

    return grid;
  };

  // Initial grid element
  let gridElement = buildGridElement();

  // Public API
  return {
    /**
     * Get the grid element
     * @returns {HTMLElement} Grid element
     */
    getElement() {
      return gridElement;
    },

    /**
     * Append a child to the grid
     * @param {HTMLElement} child - Child element
     * @returns {Object} Grid component (for chaining)
     */
    appendChild(child) {
      if (!(child instanceof HTMLElement)) {
        throw new Error('Child must be an HTMLElement');
      }
      gridElement.appendChild(child);
      return this;
    },

    /**
     * Update grid properties
     * @param {Object} newProps - New properties
     * @returns {Object} Grid component (for chaining)
     */
    update(newProps) {
      // Update state
      Object.assign(gridState, newProps);

      // Rebuild element (for simplicity)
      const oldElement = gridElement;
      gridElement = buildGridElement();

      // Move all children to the new element
      while (oldElement.firstChild) {
        gridElement.appendChild(oldElement.firstChild);
      }

      // Replace in DOM if the old element was inserted
      if (oldElement.parentNode) {
        oldElement.parentNode.replaceChild(gridElement, oldElement);
      }

      return this;
    },

    /**
     * Clean up resources
     */
    destroy() {
      gridElement = null;
    },
  };
};

// Define required props for validation
createColumn.requiredProps = ['children'];
createGrid.requiredProps = [];

// Create component factories
const Column = createComponent('Column', createColumn);
const Grid = createComponent('Grid', createGrid);

// Add Column as a static property of Grid
Grid.Column = Column;

// Export
export default Grid;
