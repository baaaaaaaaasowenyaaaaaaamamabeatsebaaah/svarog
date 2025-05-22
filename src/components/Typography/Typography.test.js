// src/components/Typography/Typography.test.js
import { describe, it, expect } from 'vitest';
import Typography from './Typography';

describe('Typography component', () => {
  it('should create a typography element', () => {
    const typography = Typography({
      children: 'Test Typography',
      textAlign: 'left',
    });

    const element = typography.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('typography')).toBe(true);
  });

  it('should apply correct styles', () => {
    const typography = Typography({
      children: 'Styled Typography',
      textAlign: 'center',
      italic: true,
    });

    const element = typography.getElement();
    expect(element.style.textAlign).toBe('center');
    expect(element.style.fontStyle).toBe('italic');
  });

  it('should create a block element when block=true is specified', () => {
    const typography = Typography({
      children: 'Block Typography',
      block: true,
    });

    const element = typography.getElement();
    expect(element.style.display).toBe('block');
  });

  it('should create headlines as block elements by default', () => {
    const h1Typography = Typography({
      children: 'Headline Typography',
      as: 'h1',
    });

    const element = h1Typography.getElement();
    expect(element.style.display).toBe('block');
  });

  it('should respect explicit block=false for headlines', () => {
    const h2Typography = Typography({
      children: 'Inline Headline',
      as: 'h2',
      block: false,
    });

    const element = h2Typography.getElement();
    expect(element.style.display).toBe('inline');
  });

  it('should keep non-headline elements as their default display', () => {
    const spanTypography = Typography({
      children: 'Span Typography',
      as: 'span',
    });

    const element = spanTypography.getElement();
    // No display style should be explicitly set when it's a default non-headline element
    expect(element.style.display).toBe('');
  });

  it('should throw error for invalid element type', () => {
    expect(() => {
      Typography({
        children: 'Invalid',
        as: 'invalid-tag',
      });
    }).toThrow(/Invalid element type/);
  });

  it('should throw error for invalid text alignment', () => {
    expect(() => {
      Typography({
        children: 'Invalid alignment',
        textAlign: 'invalid',
      });
    }).toThrow(/textAlign must be one of/);
  });

  it('should throw error for invalid weight', () => {
    expect(() => {
      Typography({
        children: 'Invalid weight',
        weight: 'invalid-weight',
      });
    }).toThrow(/Invalid font weight value/);
  });

  it('should update content with setContent method', () => {
    const typography = Typography({
      children: 'Original content',
    });

    typography.setContent('Updated content');

    // Get the element AFTER the update
    const element = typography.getElement();

    expect(element.textContent).toBe('Updated content');
  });

  it('should update color with setColor method', () => {
    const typography = Typography({
      children: 'Color test',
    });

    typography.setColor('red');

    // Get the element AFTER the update
    const element = typography.getElement();

    expect(element.style.color).toBe('red');
  });

  it('should update weight with setWeight method', () => {
    const typography = Typography({
      children: 'Weight test',
    });

    typography.setWeight('bold');

    // Get the element AFTER the update
    const element = typography.getElement();

    expect(element.classList.contains('typography--weight-bold')).toBe(true);
  });
});
