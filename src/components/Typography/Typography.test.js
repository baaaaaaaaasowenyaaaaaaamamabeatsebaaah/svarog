import Typography from './Typography';

describe('Typography component', () => {
  it('should create a typography element', () => {
    const typography = new Typography({
      children: 'Test Typography',
      size: '16px',
      color: 'black',
      textAlign: 'left',
    });
    const element = typography.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('typography ');
  });

  it('should apply correct styles', () => {
    const typography = new Typography({
      children: 'Styled Typography',
      size: '18px',
      color: 'red',
      textAlign: 'center',
      weight: 'bold',
      italic: true,
    });
    const element = typography.getElement();
    expect(element.style.fontSize).toBe('18px');
    expect(element.style.color).toBe('red');
    expect(element.style.textAlign).toBe('center');
    expect(element.style.fontWeight).toBe('bold');
    expect(element.style.fontStyle).toBe('italic');
  });

  it('should create a block element', () => {
    const typography = new Typography({
      children: 'Block Typography',
      block: true,
    });
    const element = typography.getElement();
    expect(element.style.display).toBe('block');
  });
});
