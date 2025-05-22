// src/components/Grid/Grid.test.js
import { describe, it, expect } from 'vitest';
import Grid from './Grid.js';

describe('Grid component', () => {
  it('should create a grid element', () => {
    const grid = Grid({ rowGap: '1rem' });
    const element = grid.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('grid');
    expect(element.style.display).toBe('grid');
    expect(element.style.gridTemplateColumns).toBe('repeat(12, 1fr)');
    expect(element.style.rowGap).toBe('1rem');
  });

  it('should apply the correct gap styles', () => {
    // Test with unified gap
    const gridWithGap = Grid({ gap: '2rem' });
    const elementWithGap = gridWithGap.getElement();
    expect(elementWithGap.style.gap).toBe('2rem');

    // Test with separate row and column gaps
    const gridWithSeparateGaps = Grid({
      rowGap: '1rem',
      columnGap: '0.5rem',
    });
    const elementWithSeparateGaps = gridWithSeparateGaps.getElement();
    expect(elementWithSeparateGaps.style.rowGap).toBe('1rem');
    expect(elementWithSeparateGaps.style.columnGap).toBe('0.5rem');
  });

  it('should apply correct alignment styles', () => {
    const grid = Grid({
      alignItems: 'center',
      justifyItems: 'end',
    });
    const element = grid.getElement();

    expect(element.style.alignItems).toBe('center');
    expect(element.style.justifyItems).toBe('end');
  });

  it('should add direction modifiers for reverse', () => {
    const grid = Grid({ reverse: true });
    const element = grid.getElement();

    expect(element.classList.contains('grid--reverse')).toBe(true);
  });

  it('should add direction modifiers for mobile reverse', () => {
    const grid = Grid({ mobileReverse: true });
    const element = grid.getElement();

    expect(element.classList.contains('grid--mobile-reverse')).toBe(true);
  });

  it('should append children correctly', () => {
    const grid = Grid();

    const child1 = document.createElement('div');
    child1.textContent = 'Child 1';

    const child2 = document.createElement('div');
    child2.textContent = 'Child 2';

    grid.appendChild(child1);
    grid.appendChild(child2);

    const element = grid.getElement();
    expect(element.children).toHaveLength(2);
    expect(element.children[0].textContent).toBe('Child 1');
    expect(element.children[1].textContent).toBe('Child 2');
  });

  it('should update properties correctly', () => {
    const grid = Grid({ gap: '1rem' });

    grid.update({
      gap: '2rem',
      alignItems: 'center',
    });

    const element = grid.getElement();
    expect(element.style.gap).toBe('2rem');
    expect(element.style.alignItems).toBe('center');
  });

  it('should throw error for invalid gap values', () => {
    expect(() => {
      Grid({ gap: 'invalid' });
    }).toThrow('Invalid gap value');

    expect(() => {
      Grid({ rowGap: 123 });
    }).toThrow('Invalid rowGap value');

    expect(() => {
      Grid({ columnGap: {} });
    }).toThrow('Invalid columnGap value');
  });

  it('should throw error for invalid alignment values', () => {
    expect(() => {
      Grid({ alignItems: 'invalid' });
    }).toThrow('alignItems must be one of: start, end, center, stretch');

    expect(() => {
      Grid({ justifyItems: 'wrong' });
    }).toThrow('justifyItems must be one of: start, end, center, stretch');
  });
});

describe('Column component', () => {
  it('should create a column element', () => {
    const column = Grid.Column({
      width: 6,
      children: document.createElement('div'),
    });

    const element = column.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('column');
    expect(element.style.gridColumnEnd).toBe('span 6');
  });

  it('should throw error when children are missing', () => {
    expect(() => {
      Grid.Column({ width: 6 });
    }).toThrow('Column: children is required');
  });

  it('should throw error for invalid width values', () => {
    const div = document.createElement('div');

    expect(() => {
      Grid.Column({ width: 13, children: div });
    }).toThrow('width must be an integer between 1 and 12');

    expect(() => {
      Grid.Column({ width: 0, children: div });
    }).toThrow('width must be an integer between 1 and 12');

    expect(() => {
      Grid.Column({ width: 6, mobileWidth: 13, children: div });
    }).toThrow('mobileWidth must be an integer between 1 and 12');
  });

  it('should apply offset correctly', () => {
    const column = Grid.Column({
      width: 6,
      offset: 2,
      children: document.createElement('div'),
    });

    const element = column.getElement();
    expect(element.style.gridColumnStart).toBe('3'); // offset + 1
  });

  it('should apply responsive classes correctly', () => {
    const column = Grid.Column({
      width: 6,
      mobileWidth: 12,
      tabletWidth: 8,
      desktopWidth: 4,
      children: document.createElement('div'),
    });

    const element = column.getElement();
    expect(element.classList.contains('column--mobile-12')).toBe(true);
    expect(element.classList.contains('column--tablet-8')).toBe(true);
    expect(element.classList.contains('column--desktop-4')).toBe(true);
  });
});

describe('Grid and Column integration', () => {
  it('should work together correctly', () => {
    const grid = Grid({ gap: '1rem' });

    const column1 = Grid.Column({
      width: 6,
      children: document.createElement('div'),
    });

    const column2 = Grid.Column({
      width: 6,
      children: document.createElement('div'),
    });

    grid.appendChild(column1.getElement());
    grid.appendChild(column2.getElement());

    const element = grid.getElement();
    expect(element.children).toHaveLength(2);
    expect(element.children[0].style.gridColumnEnd).toBe('span 6');
    expect(element.children[1].style.gridColumnEnd).toBe('span 6');
  });
});
