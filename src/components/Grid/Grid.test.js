import { describe, it, expect } from 'vitest';
import Grid from './Grid.js';

describe('Grid component', () => {
  it('should create a grid element', () => {
    const grid = new Grid({ rowGap: '1rem' });
    const element = grid.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('grid');
  });

  it('should apply correct row gap', () => {
    const grid = new Grid({ rowGap: '2rem' });
    const element = grid.getElement();
    expect(element.style.rowGap).toBe('2rem'); // Korrekte Property prüfen
  });

  it('should append children correctly', () => {
    const grid = new Grid({ rowGap: '1rem' });

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

  it('should apply styles to children correctly', () => {
    const grid = new Grid({ rowGap: '1rem' });

    const column = new Grid.Column({
      width: 6,
      children: [
        (() => {
          const div = document.createElement('div');
          div.textContent = 'Child';
          return div;
        })(),
      ],
    });

    grid.appendChild(column.getElement());

    const element = grid.getElement();
    expect(element.children).toHaveLength(1);
    expect(element.children[0].style.gridColumnEnd).toBe('span 6');
  });
});
