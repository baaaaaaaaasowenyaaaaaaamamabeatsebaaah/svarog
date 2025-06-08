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
  box.style.fontSize = '14px';
  box.style.textAlign = 'center';
  box.style.borderRadius = '8px';
  box.textContent = text || color;
  return box;
};

// Helper to create responsive info box
const createResponsiveInfo = () => {
  const info = document.createElement('div');
  info.style.padding = '15px';
  info.style.marginBottom = '20px';
  info.style.backgroundColor = '#f0f9ff';
  info.style.border = '2px solid #0284c7';
  info.style.borderRadius = '8px';
  info.style.fontSize = '14px';

  const updateInfo = () => {
    const width = window.innerWidth;
    let breakpoint = 'Desktop (≥1024px)';
    let color = '#059669';

    if (width < 768) {
      breakpoint = 'Mobile (<768px)';
      color = '#dc2626';
    } else if (width < 1024) {
      breakpoint = 'Tablet (768px-1023px)';
      color = '#d97706';
    }

    info.innerHTML = `
      <strong>Current Breakpoint:</strong> <span style="color: ${color}">${breakpoint}</span><br>
      <strong>Window Width:</strong> ${width}px<br>
      <strong>Tip:</strong> Resize your browser to see columns respond!
    `;
  };

  updateInfo();
  window.addEventListener('resize', updateInfo);

  return info;
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
  const container = document.createElement('div');

  // Add responsive info
  container.appendChild(createResponsiveInfo());

  const grid = Grid({
    rowGap: '1rem',
    columnGap: '0.5rem',
  });

  const column1 = Grid.Column({
    width: 6,
    mobileWidth: 12, // Full width on mobile
    children: createColoredBox('#e91e63', 'Desktop: 6/12 | Mobile: 12/12'),
  });

  const column2 = Grid.Column({
    width: 6,
    mobileWidth: 12, // Full width on mobile
    children: createColoredBox('#009688', 'Desktop: 6/12 | Mobile: 12/12'),
  });

  grid.appendChild(column1.getElement());
  grid.appendChild(column2.getElement());

  container.appendChild(grid.getElement());
  return container;
};

// Comprehensive responsive example with all breakpoints
export const FullyResponsive = () => {
  const container = document.createElement('div');

  // Add responsive info
  container.appendChild(createResponsiveInfo());

  const grid = Grid({ gap: '1rem' });

  // Sidebar - responsive across all breakpoints
  const sidebar = Grid.Column({
    width: 3, // Default: 3/12 (25%)
    mobileWidth: 12, // Mobile: 12/12 (100%)
    tabletWidth: 4, // Tablet: 4/12 (33%)
    desktopWidth: 3, // Desktop: 3/12 (25%)
    children: createColoredBox(
      '#6366f1',
      'Sidebar\nMobile: 12/12\nTablet: 4/12\nDesktop: 3/12'
    ),
  });

  // Main content - responsive across all breakpoints
  const mainContent = Grid.Column({
    width: 9, // Default: 9/12 (75%)
    mobileWidth: 12, // Mobile: 12/12 (100%)
    tabletWidth: 8, // Tablet: 8/12 (67%)
    desktopWidth: 9, // Desktop: 9/12 (75%)
    children: createColoredBox(
      '#10b981',
      'Main Content\nMobile: 12/12\nTablet: 8/12\nDesktop: 9/12'
    ),
  });

  grid.appendChild(sidebar.getElement());
  grid.appendChild(mainContent.getElement());

  container.appendChild(grid.getElement());
  return container;
};

// Complex layout with multiple responsive columns
export const ComplexResponsiveLayout = () => {
  const container = document.createElement('div');

  // Add responsive info
  container.appendChild(createResponsiveInfo());

  const grid = Grid({ gap: '1rem' });

  // Card 1
  const card1 = Grid.Column({
    width: 3,
    mobileWidth: 12, // Full width on mobile
    tabletWidth: 6, // Half width on tablet
    desktopWidth: 3, // Quarter width on desktop
    children: createColoredBox('#ef4444', 'Card 1\n12→6→3'),
  });

  // Card 2
  const card2 = Grid.Column({
    width: 3,
    mobileWidth: 12, // Full width on mobile
    tabletWidth: 6, // Half width on tablet
    desktopWidth: 3, // Quarter width on desktop
    children: createColoredBox('#f59e0b', 'Card 2\n12→6→3'),
  });

  // Card 3
  const card3 = Grid.Column({
    width: 3,
    mobileWidth: 12, // Full width on mobile
    tabletWidth: 6, // Half width on tablet
    desktopWidth: 3, // Quarter width on desktop
    children: createColoredBox('#10b981', 'Card 3\n12→6→3'),
  });

  // Card 4
  const card4 = Grid.Column({
    width: 3,
    mobileWidth: 12, // Full width on mobile
    tabletWidth: 6, // Half width on tablet
    desktopWidth: 3, // Quarter width on desktop
    children: createColoredBox('#3b82f6', 'Card 4\n12→6→3'),
  });

  grid.appendChild(card1.getElement());
  grid.appendChild(card2.getElement());
  grid.appendChild(card3.getElement());
  grid.appendChild(card4.getElement());

  container.appendChild(grid.getElement());
  return container;
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

// Desktop offset example
export const DesktopOffset = () => {
  const container = document.createElement('div');

  // Add responsive info
  container.appendChild(createResponsiveInfo());

  const grid = Grid({ gap: '1rem' });

  const column = Grid.Column({
    width: 8,
    mobileWidth: 12, // Full width on mobile
    desktopWidth: 8, // 8/12 on desktop
    desktopOffset: 2, // Centered on desktop (offset by 2)
    children: createColoredBox(
      '#8b5cf6',
      'Centered Content\nMobile: Full Width\nDesktop: 8/12 with 2 column offset'
    ),
  });

  grid.appendChild(column.getElement());

  container.appendChild(grid.getElement());
  return container;
};
