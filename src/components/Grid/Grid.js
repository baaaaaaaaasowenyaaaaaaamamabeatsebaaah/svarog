// src/components/Grid/Grid.js
import './Grid.css';
import {
  createComponent,
  createElement,
  appendChildren,
} from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';

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

    // Append children - properly handle both array and single child
    if (Array.isArray(columnState.children)) {
      appendChildren(column, columnState.children);
    } else if (columnState.children instanceof HTMLElement) {
      column.appendChild(columnState.children);
    } else if (columnState.children) {
      column.textContent = String(columnState.children);
    }

    return column;
  };

  // Initial column element
  let columnElement = buildColumnElement();

  // Public API
  const column = {
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
     * Efficient partial update for the column
     * @param {HTMLElement} element - Element to update
     * @param {Object} newProps - New properties
     */
    partialUpdate(element, newProps) {
      // Update state first
      Object.assign(columnState, newProps);

      // Update specific properties only if they changed
      if (newProps.width !== undefined) {
        element.style.gridColumnEnd = `span ${newProps.width}`;
      }

      if (newProps.offset !== undefined) {
        if (newProps.offset) {
          element.style.gridColumnStart = newProps.offset + 1;
        } else {
          element.style.removeProperty('grid-column-start');
        }
      }

      // Handle responsive classes
      if (newProps.mobileWidth !== undefined) {
        const mobileClasses = [...element.classList].filter((c) =>
          c.startsWith('column--mobile-')
        );
        mobileClasses.forEach((c) => element.classList.remove(c));
        if (newProps.mobileWidth) {
          element.classList.add(`column--mobile-${newProps.mobileWidth}`);
        }
      }

      if (newProps.tabletWidth !== undefined) {
        const tabletClasses = [...element.classList].filter((c) =>
          c.startsWith('column--tablet-')
        );
        tabletClasses.forEach((c) => element.classList.remove(c));
        if (newProps.tabletWidth) {
          element.classList.add(`column--tablet-${newProps.tabletWidth}`);
        }
      }

      if (newProps.desktopWidth !== undefined) {
        const desktopClasses = [...element.classList].filter(
          (c) =>
            c.startsWith('column--desktop-') &&
            !c.startsWith('column--desktop-offset-')
        );
        desktopClasses.forEach((c) => element.classList.remove(c));
        if (newProps.desktopWidth) {
          element.classList.add(`column--desktop-${newProps.desktopWidth}`);
        }
      }

      if (newProps.desktopOffset !== undefined) {
        const offsetClasses = [...element.classList].filter((c) =>
          c.startsWith('column--desktop-offset-')
        );
        offsetClasses.forEach((c) => element.classList.remove(c));
        if (newProps.desktopOffset) {
          element.classList.add(
            `column--desktop-offset-${newProps.desktopOffset}`
          );
        }
      }

      // Update children if needed
      if (newProps.children !== undefined) {
        // Clear existing children
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }

        // Add new children properly handling both array and single child
        if (Array.isArray(newProps.children)) {
          appendChildren(element, newProps.children);
        } else if (newProps.children instanceof HTMLElement) {
          element.appendChild(newProps.children);
        } else if (newProps.children) {
          element.textContent = String(newProps.children);
        }
      }
    },

    /**
     * Clean up resources
     */
    destroy() {
      columnElement = null;
    },

    /**
     * Handle theme changes
     * @param {string} newTheme - New theme name
     * @param {string} previousTheme - Previous theme name
     */
    onThemeChange(newTheme, previousTheme) {
      // Handle theme changes if needed
      console.debug(
        `Column: Theme changed from ${previousTheme} to ${newTheme}`
      );
    },
  };

  return column;
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
  const grid = {
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
     * Efficient partial update for the grid
     * @param {HTMLElement} element - Element to update
     * @param {Object} newProps - New properties
     */
    partialUpdate(element, newProps) {
      // Update state first
      Object.assign(gridState, newProps);

      // Update direction classes
      if (newProps.reverse !== undefined) {
        element.classList.toggle('grid--reverse', newProps.reverse);
      }

      if (newProps.mobileReverse !== undefined) {
        element.classList.toggle(
          'grid--mobile-reverse',
          newProps.mobileReverse
        );
      }

      // Handle gap styling
      if (newProps.gap !== undefined) {
        element.style.gap = newProps.gap;
        // When setting gap, remove individual gaps
        element.style.removeProperty('row-gap');
        element.style.removeProperty('column-gap');
      }

      // Update row gap if no unified gap is set
      if (newProps.rowGap !== undefined && !element.style.gap) {
        element.style.rowGap = newProps.rowGap;
      }

      // Update column gap if no unified gap is set
      if (newProps.columnGap !== undefined && !element.style.gap) {
        element.style.columnGap = newProps.columnGap;
      }

      // Update alignment properties
      if (newProps.alignItems !== undefined) {
        element.style.alignItems = newProps.alignItems;
      }

      if (newProps.justifyItems !== undefined) {
        element.style.justifyItems = newProps.justifyItems;
      }
    },

    /**
     * Clean up resources
     */
    destroy() {
      gridElement = null;
    },

    /**
     * Handle theme changes
     * @param {string} newTheme - New theme name
     * @param {string} previousTheme - Previous theme name
     */
    onThemeChange(newTheme, previousTheme) {
      // Handle theme changes if needed
      console.debug(`Grid: Theme changed from ${previousTheme} to ${newTheme}`);
    },
  };

  return grid;
};

// Define required props for validation
createColumn.requiredProps = ['children'];
createGrid.requiredProps = [];

// Create theme-aware components
const Column = withThemeAwareness(createComponent('Column', createColumn));
const Grid = withThemeAwareness(createComponent('Grid', createGrid));

// Add Column as a static property of Grid
Grid.Column = Column;

// Export
export default Grid;
