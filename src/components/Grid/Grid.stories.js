// src/components/Grid/Grid.stories.js
import Grid from './Grid.js';

export default {
  title: 'Components/Grid',
  component: Grid,
};

// Helper function to create colored boxes for our examples
const createColoredBox = (color, text = '') => {
  const box = document.createElement('div');
  box.style.backgroundColor = color;
  box.style.padding = '20px';
  box.style.color = 'white';
  box.style.display = 'flex';
  box.style.alignItems = 'center';
  box.style.justifyContent = 'center';
  box.style.minHeight = '100px';
  box.textContent = text || color;
  return box;
};

// Basic two-column grid with equal widths (6-6)
export const TwoColumns = () => {
  const grid = Grid({ gap: '1rem' });

  const column1 = Grid.Column({
    width: 6,
    children: createColoredBox('#3182ce', 'Column 1 (width: 6)'),
  });

  const column2 = Grid.Column({
    width: 6,
    children: createColoredBox('#4caf50', 'Column 2 (width: 6)'),
  });

  grid.appendChild(column1.getElement());
  grid.appendChild(column2.getElement());

  return grid.getElement();
};

// Three-column grid with different widths (3-6-3)
export const ThreeColumns = () => {
  const grid = Grid({ gap: '0.75rem' });

  const column1 = Grid.Column({
    width: 3,
    children: createColoredBox('#f44336', 'Width: 3'),
  });

  const column2 = Grid.Column({
    width: 6,
    children: createColoredBox('#ff9800', 'Width: 6'),
  });

  const column3 = Grid.Column({
    width: 3,
    children: createColoredBox('#9c27b0', 'Width: 3'),
  });

  grid.appendChild(column1.getElement());
  grid.appendChild(column2.getElement());
  grid.appendChild(column3.getElement());

  return grid.getElement();
};

// Responsive grid with different widths on mobile/desktop
export const ResponsiveGrid = () => {
  const grid = Grid({
    rowGap: '1rem',
    columnGap: '0.5rem',
  });

  const column1 = Grid.Column({
    width: 6,
    mobileWidth: 12, // Full width on mobile
    children: createColoredBox('#e91e63', '6 cols (12 on mobile)'),
  });

  const column2 = Grid.Column({
    width: 6,
    mobileWidth: 12, // Full width on mobile
    children: createColoredBox('#009688', '6 cols (12 on mobile)'),
  });

  grid.appendChild(column1.getElement());
  grid.appendChild(column2.getElement());

  return grid.getElement();
};

// Grid with alignment options
export const AlignmentOptions = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '2rem';

  // Center-aligned grid
  const centerGrid = Grid({
    gap: '1rem',
    alignItems: 'center',
    justifyItems: 'center',
  });

  const centerTitle = document.createElement('h3');
  centerTitle.textContent = 'Center Aligned Grid';
  container.appendChild(centerTitle);

  const centerColumn1 = Grid.Column({
    width: 6,
    children: createColoredBox('#3f51b5', 'Centered Content'),
  });

  const centerColumn2 = Grid.Column({
    width: 6,
    children: createColoredBox('#673ab7', 'Centered Content'),
  });

  centerGrid.appendChild(centerColumn1.getElement());
  centerGrid.appendChild(centerColumn2.getElement());
  container.appendChild(centerGrid.getElement());

  // Start-aligned grid
  const startGrid = Grid({
    gap: '1rem',
    alignItems: 'start',
    justifyItems: 'start',
  });

  const startTitle = document.createElement('h3');
  startTitle.textContent = 'Start Aligned Grid';
  container.appendChild(startTitle);

  const startColumn1 = Grid.Column({
    width: 6,
    children: createColoredBox('#2196f3', 'Start Aligned'),
  });

  const startColumn2 = Grid.Column({
    width: 6,
    children: createColoredBox('#03a9f4', 'Start Aligned'),
  });

  startGrid.appendChild(startColumn1.getElement());
  startGrid.appendChild(startColumn2.getElement());
  container.appendChild(startGrid.getElement());

  return container;
};

// Grid with column offsets
export const ColumnOffsets = () => {
  const grid = Grid({ gap: '1rem' });

  const column1 = Grid.Column({
    width: 4,
    children: createColoredBox('#f44336', 'Width: 4'),
  });

  const column2 = Grid.Column({
    width: 4,
    offset: 4, // Skip 4 columns
    children: createColoredBox('#ff9800', 'Width: 4, Offset: 4'),
  });

  grid.appendChild(column1.getElement());
  grid.appendChild(column2.getElement());

  return grid.getElement();
};
