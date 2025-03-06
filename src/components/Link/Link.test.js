import { describe, it, expect } from 'vitest';
import Link from './Link';

describe('Link component', () => {
  it('should create a link element', () => {
    const link = new Link({
      children: 'Click me',
      href: '#',
      target: '_blank',
      underline: true,
      block: false,
    });
    const element = link.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('link');
  });

  it('should apply correct styles', () => {
    const link = new Link({
      children: 'Styled link',
      href: '#',
      target: '_self',
      underline: false,
      block: true,
    });
    const element = link.getElement();
    expect(element.style.textDecoration).toBe('none');
    expect(element.style.display).toBe('block');
  });

  it('should have correct href attribute', () => {
    const link = new Link({
      children: 'Link with href',
      href: 'https://example.com',
    });
    const element = link.getElement();
    expect(element.href).toBe('https://example.com/');
  });
});
