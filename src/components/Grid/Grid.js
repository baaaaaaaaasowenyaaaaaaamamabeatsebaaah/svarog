// src/components/Grid/Grid.js
import {
  createComponent,
  createElement,
  appendChildren,
} from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { gridStyles } from './Grid.styles.js';

// Create style injector for Grid component
const injectGridStyles = createStyleInjector('Grid');

/**
 * Creates a Column component for use within a Grid
 * @param {Object} props - Column properties
 * @returns {Object} Column component
 */
const createColumn = (props) => {
  const {
    width = 12,
    mobileWidth,
    tabletWidth,
    desktopWidth,
    desktopOffset,
    offset,
  } = props;

  // Inject styles on component creation
  injectGridStyles(gridStyles);

  // State
  const columnState = { ...props };

  // Validate column width
  const validateWidth = (prop, value) => {
    if (!Number.isInteger(value) || value < 1 || value > 12) {
      throw new Error(`${prop} must be an integer between 1 and 12`);
    }
  };

  // Validate all widths
  validateWidth('width', width);
  if (mobileWidth !== undefined) validateWidth('mobileWidth', mobileWidth);
  if (tabletWidth !== undefined) validateWidth('tabletWidth', tabletWidth);
  if (desktopWidth !== undefined) validateWidth('desktopWidth', desktopWidth);
  if (desktopOffset !== undefined)
    validateWidth('desktopOffset', desktopOffset);
  if (offset !== undefined) validateWidth('offset', offset);

  // Create the column element
  const buildColumnElement = () => {
    const classes = ['column'];

    // Regular styles only (no CSS custom properties)
    const style = {};

    // Handle offsets as regular styles
    if (columnState.offset !== undefined) {
      style.gridColumnStart = columnState.offset + 1;
    }

    const column = createElement('div', {
      classes,
      style,
    });

    // Apply CSS custom properties after element creation
    column.style.setProperty('--col-width', columnState.width);

    if (columnState.mobileWidth !== undefined) {
      column.style.setProperty('--col-width-mobile', columnState.mobileWidth);
    }
    if (columnState.tabletWidth !== undefined) {
      column.style.setProperty('--col-width-tablet', columnState.tabletWidth);
    }
    if (columnState.desktopWidth !== undefined) {
      column.style.setProperty('--col-width-desktop', columnState.desktopWidth);
    }
    if (columnState.desktopOffset !== undefined) {
      column.style.setProperty(
        '--col-offset-desktop',
        columnState.desktopOffset + 1
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

      // Rebuild element
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
};

/**
 * Creates a Grid component
 * @param {Object} props - Grid properties
 * @returns {Object} Grid component
 */
const createGrid = (props = {}) => {
  const { rowGap, columnGap, gap, alignItems, justifyItems } = props;

  // Inject styles on component creation
  injectGridStyles(gridStyles);

  // State
  const gridState = { ...props };

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
    if (gridState.reverse) {
      classNames.push('grid--reverse');
    }
    if (gridState.mobileReverse) {
      classNames.push('grid--mobile-reverse');
    }

    const style = {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
    };

    // Gap handling
    if (gridState.gap) {
      style.gap = gridState.gap;
    } else {
      if (gridState.rowGap) {
        style.rowGap = gridState.rowGap;
      }
      if (gridState.columnGap) {
        style.columnGap = gridState.columnGap;
      }
    }

    // Alignment
    if (gridState.alignItems) {
      style.alignItems = gridState.alignItems;
    }
    if (gridState.justifyItems) {
      style.justifyItems = gridState.justifyItems;
    }

    return createElement('div', {
      classes: classNames,
      style,
    });
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

      // Rebuild element
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
