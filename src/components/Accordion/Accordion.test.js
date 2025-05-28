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

  it('should clean up on destroy', () => {
    const accordion = Accordion({ items: mockItems });
    const element = accordion.getElement();

    // Add to DOM
    document.body.appendChild(element);

    accordion.destroy();

    expect(document.body.contains(element)).toBe(false);
  });
});
