// src/components/Tag/Tag.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Tag from './Tag.js';

describe('Tag component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render correctly with basic props', () => {
    const tag = Tag({
      label: 'JavaScript',
    });

    const element = tag.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.textContent).toContain('JavaScript');
    expect(element.className).toBe('tag tag--md tag--default');
    expect(element.getAttribute('role')).toBe('button');
    expect(element.getAttribute('aria-pressed')).toBe('false');
    expect(element.getAttribute('aria-disabled')).toBe('false');
  });

  it('should handle click events', () => {
    const mockOnClick = vi.fn();
    const tag = Tag({
      label: 'React',
      value: 'react-id',
      onClick: mockOnClick,
    });

    const element = tag.getElement();
    element.click();

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith('react-id', expect.any(Event));
  });

  it('should use label as value when value is not provided', () => {
    const mockOnClick = vi.fn();
    const tag = Tag({
      label: 'Vue',
      onClick: mockOnClick,
    });

    const element = tag.getElement();
    element.click();

    expect(mockOnClick).toHaveBeenCalledWith('Vue', expect.any(Event));
  });

  it('should handle keyboard events', () => {
    const mockOnClick = vi.fn();
    const tag = Tag({
      label: 'Angular',
      onClick: mockOnClick,
    });

    const element = tag.getElement();

    // Test Enter key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    element.dispatchEvent(enterEvent);
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    // Test Space key
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    element.dispatchEvent(spaceEvent);
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  it('should render with icon', () => {
    const tag = Tag({
      label: 'TypeScript',
      icon: '📘',
    });

    const element = tag.getElement();
    const iconElement = element.querySelector('.tag__icon');

    expect(iconElement).toBeTruthy();
    expect(iconElement.textContent).toBe('📘');
  });

  it('should render with count', () => {
    const tag = Tag({
      label: 'Posts',
      count: 42,
    });

    const element = tag.getElement();
    const countElement = element.querySelector('.tag__count');

    expect(countElement).toBeTruthy();
    expect(countElement.textContent).toBe('(42)');
  });

  it('should render remove button when removable', () => {
    const mockOnRemove = vi.fn();
    const tag = Tag({
      label: 'Node.js',
      value: 'nodejs',
      removable: true,
      onRemove: mockOnRemove,
    });

    const element = tag.getElement();
    const removeButton = element.querySelector('.tag__remove');

    expect(removeButton).toBeTruthy();
    expect(removeButton.getAttribute('aria-label')).toBe('Remove Node.js tag');

    removeButton.click();
    expect(mockOnRemove).toHaveBeenCalledWith('nodejs');
  });

  it('should handle Delete key when removable', () => {
    const mockOnRemove = vi.fn();
    const tag = Tag({
      label: 'Python',
      removable: true,
      onRemove: mockOnRemove,
    });

    const element = tag.getElement();
    const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
    element.dispatchEvent(deleteEvent);

    expect(mockOnRemove).toHaveBeenCalledWith('Python');
  });

  it('should apply selected state', () => {
    const tag = Tag({
      label: 'Selected Tag',
      selected: true,
    });

    const element = tag.getElement();

    expect(element.className).toContain('tag--selected');
    expect(element.getAttribute('aria-pressed')).toBe('true');
  });

  it('should apply disabled state', () => {
    const mockOnClick = vi.fn();
    const tag = Tag({
      label: 'Disabled Tag',
      disabled: true,
      onClick: mockOnClick,
    });

    const element = tag.getElement();

    expect(element.className).toContain('tag--disabled');
    expect(element.getAttribute('aria-disabled')).toBe('true');
    expect(element.getAttribute('tabindex')).toBe('-1');

    element.click();
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should not show remove button when disabled', () => {
    const tag = Tag({
      label: 'Disabled Removable',
      disabled: true,
      removable: true,
    });

    const element = tag.getElement();
    const removeButton = element.querySelector('.tag__remove');

    expect(removeButton).toBeFalsy();
  });

  it('should apply size variants', () => {
    const smallTag = Tag({ label: 'Small', size: 'sm' });
    const mediumTag = Tag({ label: 'Medium', size: 'md' });
    const largeTag = Tag({ label: 'Large', size: 'lg' });

    expect(smallTag.getElement().className).toContain('tag--sm');
    expect(mediumTag.getElement().className).toContain('tag--md');
    expect(largeTag.getElement().className).toContain('tag--lg');
  });

  it('should apply color variants', () => {
    const variants = [
      'primary',
      'secondary',
      'success',
      'warning',
      'danger',
      'info',
    ];

    variants.forEach((variant) => {
      const tag = Tag({ label: variant, variant });
      expect(tag.getElement().className).toContain(`tag--${variant}`);
    });
  });

  it('should update selected state', () => {
    const tag = Tag({
      label: 'Toggle Tag',
      selected: false,
    });

    const element = tag.getElement();
    expect(element.getAttribute('aria-pressed')).toBe('false');

    tag.setSelected(true);
    const updatedElement = tag.getElement();
    expect(updatedElement.getAttribute('aria-pressed')).toBe('true');
    expect(updatedElement.className).toContain('tag--selected');
  });

  it('should update disabled state', () => {
    const tag = Tag({
      label: 'Toggle Disabled',
      disabled: false,
    });

    const element = tag.getElement();
    expect(element.getAttribute('aria-disabled')).toBe('false');

    tag.setDisabled(true);
    const updatedElement = tag.getElement();
    expect(updatedElement.getAttribute('aria-disabled')).toBe('true');
    expect(updatedElement.className).toContain('tag--disabled');
  });

  it('should update count', () => {
    const tag = Tag({
      label: 'Dynamic Count',
      count: 10,
    });

    let element = tag.getElement();
    expect(element.querySelector('.tag__count').textContent).toBe('(10)');

    tag.setCount(25);
    element = tag.getElement();
    expect(element.querySelector('.tag__count').textContent).toBe('(25)');
  });

  it('should provide getter methods', () => {
    const tag = Tag({
      label: 'Test Tag',
      value: 'test-value',
      selected: true,
    });

    expect(tag.getValue()).toBe('test-value');
    expect(tag.getLabel()).toBe('Test Tag');
    expect(tag.isSelected()).toBe(true);
  });

  it('should handle custom aria-label', () => {
    const tag = Tag({
      label: 'Custom',
      ariaLabel: 'Custom accessibility label',
    });

    const element = tag.getElement();
    expect(element.getAttribute('aria-label')).toBe(
      'Custom accessibility label'
    );
  });

  it('should clean up when destroyed', () => {
    const mockOnClick = vi.fn();
    const tag = Tag({
      label: 'Destroy Me',
      onClick: mockOnClick,
    });

    const element = tag.getElement();
    const originalRemoveEventListener = element.removeEventListener;
    element.removeEventListener = vi.fn();

    tag.destroy();

    expect(element.removeEventListener).toHaveBeenCalled();
    element.removeEventListener = originalRemoveEventListener;
  });

  it('should stop event propagation on remove button click', () => {
    const mockOnClick = vi.fn();
    const mockOnRemove = vi.fn();

    const tag = Tag({
      label: 'Test',
      removable: true,
      onClick: mockOnClick,
      onRemove: mockOnRemove,
    });

    const element = tag.getElement();
    const removeButton = element.querySelector('.tag__remove');

    removeButton.click();

    expect(mockOnRemove).toHaveBeenCalled();
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
