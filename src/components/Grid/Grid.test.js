import Grid, { Column } from './Grid';

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
    expect(element.style.gap).toBe('2rem');
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
    const child = new Column({
      width: 6,
      children: [document.createTextNode('Child')],
    });
    grid.appendChild(child.getElement());

    const element = grid.getElement();
    expect(element.children[0].style.gridColumnEnd).toBe('span 6');
  });
});
