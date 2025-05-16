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
  const grid = new Grid({ gap: '1rem' });

  const column1 = new Grid.Column({
    width: 6,
    children: createColoredBox('#3182ce', 'Column 1 (width: 6)'),
  });

  const column2 = new Grid.Column({
    width: 6,
    children: createColoredBox('#4caf50', 'Column 2 (width: 6)'),
  });

  grid.appendChild(column1.getElement());
  grid.appendChild(column2.getElement());

  return grid.getElement();
};

// Three-column grid with different widths (3-6-3)
export const ThreeColumns = () => {
  const grid = new Grid({ gap: '0.75rem' });

  const column1 = new Grid.Column({
    width: 3,
    children: createColoredBox('#f44336', 'Width: 3'),
  });

  const column2 = new Grid.Column({
    width: 6,
    children: createColoredBox('#ff9800', 'Width: 6'),
  });

  const column3 = new Grid.Column({
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
  const grid = new Grid({
    rowGap: '1rem',
    columnGap: '0.5rem',
  });

  const column1 = new Grid.Column({
    width: 6,
    mobileWidth: 12, // Full width on mobile
    children: createColoredBox('#e91e63', '6 cols (12 on mobile)'),
  });

  const column2 = new Grid.Column({
    width: 6,
    mobileWidth: 12, // Full width on mobile
    children: createColoredBox('#009688', '6 cols (12 on mobile)'),
  });

  grid.appendChild(column1.getElement());
  grid.appendChild(column2.getElement());

  return grid.getElement();
};
