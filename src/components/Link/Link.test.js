// src/components/Link/Link.test.js
import { describe, it, expect, vi } from 'vitest';
import Link from './Link.js';

describe('Link component', () => {
  it('should create a link element', () => {
    const link = Link({
      children: 'Click me',
      href: '#',
      target: '_blank',
      underline: true,
      block: false,
    });

    const element = link.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('link');
    expect(element.textContent).toBe('Click me');
  });

  it('should apply correct styles', () => {
    const link = Link({
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
    const link = Link({
      children: 'Link with href',
      href: 'https://example.com',
    });

    const element = link.getElement();
    expect(element.href).toContain('https://example.com');
  });

  it('should add rel attribute for external links', () => {
    const link = Link({
      children: 'External link',
      href: 'https://example.com',
      target: '_blank',
    });

    const element = link.getElement();
    expect(element.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should not add rel attribute for internal links', () => {
    const link = Link({
      children: 'Internal link',
      href: '/internal-page',
      target: '_self',
    });

    const element = link.getElement();
    expect(element.getAttribute('rel')).toBeNull();
  });

  it('should update href with setHref method', () => {
    const link = Link({
      children: 'Update href',
      href: '#',
    });

    link.setHref('https://updated.com');

    // Get the element AFTER the update
    const updatedElement = link.getElement();
    expect(updatedElement.href).toContain('https://updated.com');
  });

  it('should update target with update method', () => {
    const link = Link({
      children: 'Update target',
      href: '#',
      target: '_self',
    });

    link.update({ target: '_blank' });

    // Get the element AFTER the update
    const updatedElement = link.getElement();
    expect(updatedElement.target).toBe('_blank');
    expect(updatedElement.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should handle click events', () => {
    const mockOnClick = vi.fn();
    const link = Link({
      children: 'Clickable',
      href: '#',
      onClick: mockOnClick,
    });

    const element = link.getElement();
    element.click();

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should clean up event listeners when destroyed', () => {
    const mockOnClick = vi.fn();
    const link = Link({
      children: 'Destroy test',
      href: '#',
      onClick: mockOnClick,
    });

    const element = link.getElement();

    // Mock removeEventListener to verify it's called
    const originalRemoveEventListener = element.removeEventListener;
    element.removeEventListener = vi.fn();

    link.destroy();

    expect(element.removeEventListener).toHaveBeenCalled();

    // Restore original method
    element.removeEventListener = originalRemoveEventListener;
  });
});
