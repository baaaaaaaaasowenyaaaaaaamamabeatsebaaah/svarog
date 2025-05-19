// src/components/Button/Button.test.js
import { describe, it, expect, vi } from 'vitest';
import Button from './Button.js';

describe('Button component', () => {
  it('should render correctly with basic props', () => {
    const mockOnClick = vi.fn();
    const button = Button({
      text: 'Click Me',
      onClick: mockOnClick,
    });

    const element = button.getElement();

    expect(element).toBeInstanceOf(HTMLButtonElement);
    expect(element.textContent).toBe('Click Me');
    expect(element.className).toBe('btn');
    expect(element.disabled).toBe(false);
    expect(element.type).toBe('button');
  });

  it('should call onClick when clicked', () => {
    const mockOnClick = vi.fn();
    const button = Button({
      text: 'Click Me',
      onClick: mockOnClick,
    });

    const element = button.getElement();
    element.click();

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const mockOnClick = vi.fn();
    const button = Button({
      text: 'Disabled Button',
      onClick: mockOnClick,
      disabled: true,
    });

    const element = button.getElement();
    element.click();

    expect(element.disabled).toBe(true);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should update text with setText method', () => {
    const button = Button({ text: 'Original Text' });
    const element = button.getElement();

    expect(element.textContent).toBe('Original Text');

    button.setText('New Text');
    expect(element.textContent).toBe('New Text');
  });

  it('should update disabled state with setDisabled method', () => {
    const mockOnClick = vi.fn();
    const button = Button({
      text: 'Click Me',
      onClick: mockOnClick,
    });

    const element = button.getElement();
    expect(element.disabled).toBe(false);

    button.setDisabled(true);
    expect(element.disabled).toBe(true);

    // Click should not trigger onClick when disabled
    element.click();
    expect(mockOnClick).not.toHaveBeenCalled();

    // Re-enable and test click works
    button.setDisabled(false);
    expect(element.disabled).toBe(false);

    element.click();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should update multiple props with update method', () => {
    const button = Button({ text: 'Original Text' });

    button.update({
      text: 'Updated Text',
      className: 'custom-class',
      disabled: true,
    });

    // Get the element AFTER the update since a new element was created
    const element = button.getElement();

    expect(element.textContent).toBe('Updated Text');
    expect(element.className).toContain('custom-class');
    expect(element.disabled).toBe(true);
  });

  it('should apply size and variant classes correctly', () => {
    const button = Button({
      text: 'Styled Button',
      size: 'lg',
      variant: 'primary',
    });

    const element = button.getElement();
    expect(element.className).toContain('btn--lg');
    expect(element.className).toContain('btn--primary');
  });

  it('should clean up event listeners when destroyed', () => {
    const mockOnClick = vi.fn();
    const button = Button({
      text: 'Click Me',
      onClick: mockOnClick,
    });

    const element = button.getElement();

    // Mock removeEventListener to verify it's called
    const originalRemoveEventListener = element.removeEventListener;
    element.removeEventListener = vi.fn();

    button.destroy();

    expect(element.removeEventListener).toHaveBeenCalled();

    // Restore original method
    element.removeEventListener = originalRemoveEventListener;
  });
});
