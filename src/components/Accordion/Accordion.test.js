// src/components/Accordion/Accordion.test.js
import { describe, it, expect, vi } from 'vitest';
import Accordion from './Accordion.js';

describe('Accordion component', () => {
  const mockItems = [
    {
      id: 'item-1',
      title: 'First Item',
      content: 'Content for first item',
    },
    {
      id: 'item-2',
      title: 'Second Item',
      content: 'Content for second item',
    },
    {
      id: 'item-3',
      title: 'Third Item',
      content: '<p>HTML content</p>',
    },
  ];

  it('should render with required props', () => {
    const accordion = Accordion({ items: mockItems });
    const element = accordion.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('accordion')).toBe(true);
    expect(element.querySelectorAll('.accordion__item')).toHaveLength(3);
  });

  it('should throw error without required items', () => {
    expect(() => Accordion({})).toThrow('Accordion: items is required');
  });

  it('should validate items have id and title', () => {
    const invalidItems = [{ title: 'No ID' }];
    expect(() => Accordion({ items: invalidItems })).toThrow(
      'Each item must have an id and title'
    );
  });

  // Icon Type Tests
  describe('Icon types', () => {
    it('should render with default content icon type', () => {
      const accordion = Accordion({ items: mockItems });
      const element = accordion.getElement();

      expect(element.classList.contains('accordion')).toBe(true);
      expect(element.classList.contains('accordion--content')).toBe(false); // Default doesn't add class
    });

    it('should render with arrow icon type', () => {
      const accordion = Accordion({
        items: mockItems,
        iconType: 'arrow',
      });
      const element = accordion.getElement();

      expect(element.classList.contains('accordion--arrow')).toBe(true);
    });

    it('should render with chevron icon type', () => {
      const accordion = Accordion({
        items: mockItems,
        iconType: 'chevron',
      });
      const element = accordion.getElement();

      expect(element.classList.contains('accordion--chevron')).toBe(true);
    });

    it('should render with plus-minus icon type', () => {
      const accordion = Accordion({
        items: mockItems,
        iconType: 'plus-minus',
      });
      const element = accordion.getElement();

      expect(element.classList.contains('accordion--plus-minus')).toBe(true);
    });

    it('should render with caret icon type', () => {
      const accordion = Accordion({
        items: mockItems,
        iconType: 'caret',
      });
      const element = accordion.getElement();

      expect(element.classList.contains('accordion--caret')).toBe(true);
    });

    it('should render with no-icon type', () => {
      const accordion = Accordion({
        items: mockItems,
        iconType: 'no-icon',
      });
      const element = accordion.getElement();

      expect(element.classList.contains('accordion--no-icon')).toBe(true);
    });

    it('should validate icon type', () => {
      expect(() =>
        Accordion({
          items: mockItems,
          iconType: 'invalid-type',
        })
      ).toThrow(
        'iconType must be one of: content, arrow, chevron, plus-minus, caret, no-icon'
      );
    });

    it('should change icon type with setIconType method', () => {
      const accordion = Accordion({
        items: mockItems,
        iconType: 'content',
      });

      accordion.setIconType('arrow');
      const element = accordion.getElement();

      expect(element.classList.contains('accordion--arrow')).toBe(true);
    });

    it('should warn on invalid icon type with setIconType', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const accordion = Accordion({ items: mockItems });
      accordion.setIconType('invalid');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid iconType: invalid. Valid types: content, arrow, chevron, plus-minus, caret, no-icon'
      );

      consoleSpy.mockRestore();
    });

    it('should update icon type through update method', () => {
      const accordion = Accordion({
        items: mockItems,
        iconType: 'content',
      });

      accordion.update({ iconType: 'plus-minus' });
      const element = accordion.getElement();

      expect(element.classList.contains('accordion--plus-minus')).toBe(true);
    });

    it('should have Select-compatible arrow transforms', () => {
      const accordion = Accordion({
        items: mockItems,
        iconType: 'arrow',
        defaultExpanded: ['item-1'],
      });
      const element = accordion.getElement();

      const expandedItem = element.querySelector('.accordion__item--expanded');
      const arrowElement = expandedItem.querySelector('.accordion__icon-arrow');

      expect(expandedItem).not.toBeNull();
      expect(arrowElement).not.toBeNull();

      // Should have the expanded state class
      expect(expandedItem.classList.contains('accordion__item--expanded')).toBe(
        true
      );
    });

    it('should create both icon elements with Select-style arrow positioning', () => {
      const accordion = Accordion({
        items: mockItems,
        iconType: 'arrow',
      });
      const element = accordion.getElement();

      // Both icon container and arrow element should exist
      const iconContainer = element.querySelector('.accordion__icon');
      const arrowElement = element.querySelector('.accordion__icon-arrow');

      expect(iconContainer).not.toBeNull();
      expect(arrowElement).not.toBeNull();

      // Arrow should be positioned like Select component
      const computedStyle = window.getComputedStyle(arrowElement);
      expect(arrowElement.style.position || computedStyle.position).toBe(
        'absolute'
      );
    });
  });

  // Variant and Icon Type Combination Tests
  describe('Variant and icon type combinations', () => {
    it('should apply both variant and icon type classes', () => {
      const accordion = Accordion({
        items: mockItems,
        variant: 'bordered',
        iconType: 'arrow',
      });
      const element = accordion.getElement();

      expect(element.classList.contains('accordion--bordered')).toBe(true);
      expect(element.classList.contains('accordion--arrow')).toBe(true);
    });

    it('should handle multiple class combinations', () => {
      const accordion = Accordion({
        items: mockItems,
        variant: 'minimal',
        iconType: 'chevron',
        className: 'custom-class',
      });
      const element = accordion.getElement();

      expect(element.classList.contains('accordion')).toBe(true);
      expect(element.classList.contains('accordion--minimal')).toBe(true);
      expect(element.classList.contains('accordion--chevron')).toBe(true);
      expect(element.classList.contains('custom-class')).toBe(true);
    });
  });

  // Existing functionality tests (updated)
  it('should expand item on click', () => {
    const accordion = Accordion({ items: mockItems });
    const element = accordion.getElement();
    const firstHeader = element.querySelector('.accordion__header');

    expect(firstHeader.getAttribute('aria-expanded')).toBe('false');

    firstHeader.click();

    const updatedElement = accordion.getElement();
    const updatedHeader = updatedElement.querySelector('.accordion__header');
    expect(updatedHeader.getAttribute('aria-expanded')).toBe('true');
  });

  it('should collapse expanded item on second click', () => {
    const accordion = Accordion({ items: mockItems });
    const element = accordion.getElement();
    const firstHeader = element.querySelector('.accordion__header');

    firstHeader.click(); // Expand
    firstHeader.click(); // Collapse

    const updatedElement = accordion.getElement();
    const updatedHeader = updatedElement.querySelector('.accordion__header');
    expect(updatedHeader.getAttribute('aria-expanded')).toBe('false');
  });

  it('should allow multiple items expanded by default', () => {
    const accordion = Accordion({ items: mockItems });
    const element = accordion.getElement();

    const headers = element.querySelectorAll('.accordion__header');
    headers[0].click();
    headers[1].click();

    const expandedItems = accordion.getExpandedItems();
    expect(expandedItems).toHaveLength(2);
    expect(expandedItems).toContain('item-1');
    expect(expandedItems).toContain('item-2');
  });

  it('should only allow single item when multiple is false', () => {
    const accordion = Accordion({
      items: mockItems,
      multiple: false,
    });
    const element = accordion.getElement();

    const headers = element.querySelectorAll('.accordion__header');
    headers[0].click();
    headers[1].click();

    const expandedItems = accordion.getExpandedItems();
    expect(expandedItems).toHaveLength(1);
    expect(expandedItems).toContain('item-2');
  });

  it('should respect defaultExpanded prop', () => {
    const accordion = Accordion({
      items: mockItems,
      defaultExpanded: ['item-1', 'item-3'],
    });

    const expandedItems = accordion.getExpandedItems();
    expect(expandedItems).toHaveLength(2);
    expect(expandedItems).toContain('item-1');
    expect(expandedItems).toContain('item-3');
  });

  it('should call onChange callback', () => {
    const onChange = vi.fn();
    const accordion = Accordion({
      items: mockItems,
      onChange,
    });
    const element = accordion.getElement();

    const firstHeader = element.querySelector('.accordion__header');
    firstHeader.click();

    expect(onChange).toHaveBeenCalledWith(['item-1']);
  });

  it('should expand item programmatically', () => {
    const accordion = Accordion({ items: mockItems });

    accordion.expand('item-2');

    const expandedItems = accordion.getExpandedItems();
    expect(expandedItems).toContain('item-2');
  });

  it('should collapse item programmatically', () => {
    const accordion = Accordion({
      items: mockItems,
      defaultExpanded: ['item-1'],
    });

    accordion.collapse('item-1');

    const expandedItems = accordion.getExpandedItems();
    expect(expandedItems).not.toContain('item-1');
  });

  it('should expand all items when multiple is true', () => {
    const accordion = Accordion({ items: mockItems });

    accordion.expandAll();

    const expandedItems = accordion.getExpandedItems();
    expect(expandedItems).toHaveLength(3);
  });

  it('should not expand all when multiple is false', () => {
    const accordion = Accordion({
      items: mockItems,
      multiple: false,
    });

    accordion.expandAll();

    const expandedItems = accordion.getExpandedItems();
    expect(expandedItems).toHaveLength(0);
  });

  it('should collapse all items', () => {
    const accordion = Accordion({
      items: mockItems,
      defaultExpanded: ['item-1', 'item-2'],
    });

    accordion.collapseAll();

    const expandedItems = accordion.getExpandedItems();
    expect(expandedItems).toHaveLength(0);
  });

  it('should toggle item state', () => {
    const accordion = Accordion({ items: mockItems });

    accordion.toggle('item-1');
    expect(accordion.getExpandedItems()).toContain('item-1');

    accordion.toggle('item-1');
    expect(accordion.getExpandedItems()).not.toContain('item-1');
  });

  it('should handle HTML content', () => {
    const accordion = Accordion({ items: mockItems });
    const element = accordion.getElement();

    const thirdContent = element.querySelectorAll('.accordion__content')[2];
    expect(thirdContent.innerHTML).toBe('<p>HTML content</p>');
  });

  it('should handle component content', () => {
    const mockComponent = {
      getElement: () => {
        const div = document.createElement('div');
        div.textContent = 'Component content';
        return div;
      },
    };

    const itemsWithComponent = [
      {
        id: 'comp-1',
        title: 'Component Item',
        content: mockComponent,
      },
    ];

    const accordion = Accordion({ items: itemsWithComponent });
    const element = accordion.getElement();

    const content = element.querySelector('.accordion__content');
    expect(content.textContent).toBe('Component content');
  });

  it('should apply variant class', () => {
    const accordion = Accordion({
      items: mockItems,
      variant: 'bordered',
    });
    const element = accordion.getElement();

    expect(element.classList.contains('accordion--bordered')).toBe(true);
  });

  it('should apply custom className', () => {
    const accordion = Accordion({
      items: mockItems,
      className: 'custom-accordion',
    });
    const element = accordion.getElement();

    expect(element.classList.contains('custom-accordion')).toBe(true);
  });

  it('should update items and filter invalid expanded items', () => {
    const accordion = Accordion({
      items: mockItems,
      defaultExpanded: ['item-1', 'item-2'],
    });

    const newItems = [
      { id: 'item-1', title: 'Updated First', content: 'New content' },
      { id: 'item-4', title: 'New Item', content: 'New item content' },
    ];

    accordion.update({ items: newItems });

    const expandedItems = accordion.getExpandedItems();
    expect(expandedItems).toHaveLength(1);
    expect(expandedItems).toContain('item-1');
    expect(expandedItems).not.toContain('item-2'); // Filtered out
  });

  it('should set proper ARIA attributes', () => {
    const accordion = Accordion({
      items: mockItems,
      ariaLabel: 'FAQ Accordion',
    });
    const element = accordion.getElement();

    expect(element.getAttribute('role')).toBe('region');
    expect(element.getAttribute('aria-label')).toBe('FAQ Accordion');

    const header = element.querySelector('.accordion__header');
    const panel = element.querySelector('.accordion__panel');

    expect(header.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(header.id);
  });

  it('should have proper ARIA attributes for icons', () => {
    const accordion = Accordion({
      items: mockItems,
      iconType: 'arrow',
    });
    const element = accordion.getElement();

    const icons = element.querySelectorAll('.accordion__icon');
    icons.forEach((icon) => {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('should clean up on destroy', () => {
    const accordion = Accordion({ items: mockItems });
    const element = accordion.getElement();

    // Add to DOM
    document.body.appendChild(element);

    accordion.destroy();

    expect(document.body.contains(element)).toBe(false);
  });
});
