import Typography from './Typography';

describe('Typography component', () => {
  it('should create a typography element', () => {
    const typography = new Typography({
      children: 'Test Typography',
      textAlign: 'left',
    });
    const element = typography.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('typography')).toBe(true);
  });

  it('should apply correct styles', () => {
    const typography = new Typography({
      children: 'Styled Typography',
      textAlign: 'center',
      italic: true,
    });
    const element = typography.getElement();
    expect(element.style.textAlign).toBe('center');
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
