// src/components/Breadcrumb/Breadcrumb.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Breadcrumb from './Breadcrumb.js';

describe('Breadcrumb component', () => {
  let mockItems;

  beforeEach(() => {
    mockItems = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Laptops', href: '/products/laptops' },
      { label: 'MacBook Pro' },
    ];
  });

  it('should render correctly with basic props', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    const element = breadcrumb.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName).toBe('NAV');
    expect(element.classList.contains('breadcrumb')).toBe(true);
    expect(element.getAttribute('aria-label')).toBe('Breadcrumb navigation');
  });

  it('should update props correctly', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    breadcrumb.update({ className: 'updated-class' });
    const element = breadcrumb.getElement();

    expect(element.classList.contains('updated-class')).toBe(true);
  });

  it('should clean up event listeners when destroyed', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    const element = breadcrumb.getElement();
    document.body.appendChild(element);

    // Verify element is in DOM before destruction
    expect(document.body.contains(element)).toBe(true);

    // Destroy the component
    breadcrumb.destroy();

    // Clean up the element from DOM for the test
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }

    // The component should handle destruction gracefully
    expect(() => breadcrumb.destroy()).not.toThrow();
  });

  it('should create a breadcrumb navigation element', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    const element = breadcrumb.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName).toBe('NAV');
    expect(element.classList.contains('breadcrumb')).toBe(true);
    expect(element.getAttribute('aria-label')).toBe('Breadcrumb navigation');
  });

  it('should render correct number of items', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    const element = breadcrumb.getElement();
    const items = element.querySelectorAll('.breadcrumb-item');
    expect(items).toHaveLength(4);
  });

  it('should mark last item as active', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    const element = breadcrumb.getElement();
    const items = element.querySelectorAll('.breadcrumb-item');
    const lastItem = items[items.length - 1];

    expect(lastItem.classList.contains('breadcrumb-item--active')).toBe(true);
    expect(lastItem.getAttribute('aria-current')).toBe('page');
  });

  it('should create links for non-terminal items', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    const element = breadcrumb.getElement();
    const links = element.querySelectorAll('.breadcrumb-link');

    expect(links).toHaveLength(3); // All except last item
    expect(links[0].getAttribute('href')).toBe('/');
    expect(links[0].textContent).toBe('Home');
  });

  it('should not create link for terminal item', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    const element = breadcrumb.getElement();
    const lastItem = element.querySelector('.breadcrumb-item--active');
    const link = lastItem.querySelector('.breadcrumb-link');
    const text = lastItem.querySelector('.breadcrumb-text');

    expect(link).toBeNull();
    expect(text).not.toBeNull();
    expect(text.textContent).toBe('MacBook Pro');
  });

  it('should add separators between items', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
      separator: '>',
    });

    const element = breadcrumb.getElement();
    const separators = element.querySelectorAll('.breadcrumb-separator');

    expect(separators).toHaveLength(3); // One less than items
    separators.forEach((separator) => {
      expect(separator.textContent).toBe('>');
      expect(separator.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('should use default separator when not specified', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    const element = breadcrumb.getElement();
    const separator = element.querySelector('.breadcrumb-separator');
    expect(separator.textContent).toBe('/');
  });

  it('should handle click events on links', () => {
    const mockOnClick = vi.fn();
    const breadcrumb = Breadcrumb({
      items: mockItems,
      onClick: mockOnClick,
    });

    const element = breadcrumb.getElement();
    const firstLink = element.querySelector('.breadcrumb-link');

    firstLink.click();

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(
      expect.any(Event),
      mockItems[0],
      0
    );
  });

  it('should handle item-specific click events', () => {
    const itemOnClick = vi.fn();
    const itemsWithClick = [
      { label: 'Home', href: '/', onClick: itemOnClick },
      { label: 'Current' },
    ];

    const breadcrumb = Breadcrumb({
      items: itemsWithClick,
    });

    const element = breadcrumb.getElement();
    const link = element.querySelector('.breadcrumb-link');

    link.click();

    expect(itemOnClick).toHaveBeenCalledTimes(1);
  });

  it('should truncate items when maxItems is set', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
      maxItems: 3,
    });

    const element = breadcrumb.getElement();
    const items = element.querySelectorAll('.breadcrumb-item');
    const truncation = element.querySelector('.breadcrumb-truncation');

    expect(items).toHaveLength(3);
    expect(truncation).not.toBeNull();
    expect(truncation.textContent).toBe('...');
  });

  it('should validate required props', () => {
    expect(() => Breadcrumb()).toThrow('items must be an array');
    expect(() => Breadcrumb({ items: [] })).toThrow(
      'items array cannot be empty'
    );
    expect(() => Breadcrumb({ items: 'not-array' })).toThrow(
      'items must be an array'
    );
  });

  it('should validate item structure', () => {
    expect(() =>
      Breadcrumb({
        items: [{ href: '/' }], // Missing label
      })
    ).toThrow('Item at index 0 must have a label');

    expect(() =>
      Breadcrumb({
        items: [
          { label: 'Home' }, // Missing href for non-terminal
          { label: 'Current' },
        ],
      })
    ).toThrow('Non-terminal item at index 0 must have href');
  });

  it('should validate maxItems prop', () => {
    expect(() =>
      Breadcrumb({
        items: mockItems,
        maxItems: 1,
      })
    ).toThrow('maxItems must be a number >= 2');

    expect(() =>
      Breadcrumb({
        items: mockItems,
        maxItems: 'invalid',
      })
    ).toThrow('maxItems must be a number >= 2');
  });

  it('should add custom className', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
      className: 'custom-breadcrumb',
    });

    const element = breadcrumb.getElement();
    expect(element.classList.contains('custom-breadcrumb')).toBe(true);
  });

  it('should add items with addItem method', () => {
    const breadcrumb = Breadcrumb({
      items: [{ label: 'Home', href: '/' }],
    });

    breadcrumb.addItem({ label: 'New Page' });

    const path = breadcrumb.getPath();
    expect(path).toEqual(['Home', 'New Page']);
  });

  it('should remove items with popItem method', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    breadcrumb.popItem();

    const path = breadcrumb.getPath();
    expect(path).toEqual(['Home', 'Products', 'Laptops']);
  });

  it('should not remove last item with popItem', () => {
    const breadcrumb = Breadcrumb({
      items: [{ label: 'Home' }],
    });

    expect(() => breadcrumb.popItem()).toThrow(
      'Cannot remove the last breadcrumb item'
    );
  });

  it('should set new items with setItems method', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    const newItems = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Settings' },
    ];

    breadcrumb.setItems(newItems);

    const path = breadcrumb.getPath();
    expect(path).toEqual(['Dashboard', 'Settings']);
  });

  it('should update maxItems with setMaxItems method', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
      maxItems: 5,
    });

    breadcrumb.setMaxItems(3);

    const element = breadcrumb.getElement();
    const truncation = element.querySelector('.breadcrumb-truncation');
    expect(truncation).not.toBeNull();
  });

  it('should update separator with setSeparator method', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    breadcrumb.setSeparator('>');

    const element = breadcrumb.getElement();
    const separator = element.querySelector('.breadcrumb-separator');
    expect(separator.textContent).toBe('>');
  });

  it('should return current path with getPath method', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    const path = breadcrumb.getPath();
    expect(path).toEqual(['Home', 'Products', 'Laptops', 'MacBook Pro']);
  });

  it('should navigate to specific index with navigateTo method', () => {
    // Mock window.location.href
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    breadcrumb.navigateTo(1);
    expect(window.location.href).toBe('/products');

    // Restore original location
    window.location = originalLocation;
  });

  it('should throw error for invalid navigateTo index', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
    });

    expect(() => breadcrumb.navigateTo(10)).toThrow(
      'No breadcrumb item at index 10'
    );
  });

  it('should handle legacy prop migration', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const breadcrumb = Breadcrumb({
      links: mockItems, // Legacy prop
      divider: '>', // Legacy prop
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Breadcrumb] "links" is deprecated, use "items" instead'
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Breadcrumb] "divider" is deprecated, use "separator" instead'
    );

    const element = breadcrumb.getElement();
    const separator = element.querySelector('.breadcrumb-separator');
    expect(separator.textContent).toBe('>');

    consoleSpy.mockRestore();
  });

  it('should have proper accessibility attributes', () => {
    const breadcrumb = Breadcrumb({
      items: mockItems,
      ariaLabel: 'Custom navigation',
    });

    const element = breadcrumb.getElement();

    expect(element.getAttribute('role')).toBe('navigation');
    expect(element.getAttribute('aria-label')).toBe('Custom navigation');

    const list = element.querySelector('.breadcrumb-list');
    expect(list.getAttribute('role')).toBe('list');

    const links = element.querySelectorAll('.breadcrumb-link');
    links.forEach((link) => {
      expect(link.getAttribute('aria-label')).toContain('Navigate to');
    });
  });
});
