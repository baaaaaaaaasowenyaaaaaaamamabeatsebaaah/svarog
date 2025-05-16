import { describe, it, expect } from 'vitest';
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

  it('should create a block element when block=true is specified', () => {
    const typography = new Typography({
      children: 'Block Typography',
      block: true,
    });
    const element = typography.getElement();
    expect(element.style.display).toBe('block');
  });

  it('should create headlines as block elements by default', () => {
    const h1Typography = new Typography({
      children: 'Headline Typography',
      as: 'h1',
    });
    const element = h1Typography.getElement();
    expect(element.style.display).toBe('block');
  });

  it('should respect explicit block=false for headlines', () => {
    const h2Typography = new Typography({
      children: 'Inline Headline',
      as: 'h2',
      block: false,
    });
    const element = h2Typography.getElement();
    expect(element.style.display).toBe('inline');
  });

  it('should keep non-headline elements as their default display', () => {
    const spanTypography = new Typography({
      children: 'Span Typography',
      as: 'span',
    });
    const element = spanTypography.getElement();
    // No display style should be explicitly set when it's a default non-headline element
    expect(element.style.display).toBe('');
  });
});
