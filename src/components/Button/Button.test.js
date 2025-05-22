// src/components/Button/Button.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Button from './Button.js';

describe('Button component', () => {
  // Setup and teardown for timer mocks
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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

    // Our implementation now checks 'partialUpdate', so we'll just use the full update
    button.setText('New Text');

    // Get the element again after setText as it might have been reconstructed
    const updatedElement = button.getElement();
    expect(updatedElement.textContent).toBe('New Text');
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

    // Get the element again after update
    const disabledElement = button.getElement();
    expect(disabledElement.disabled).toBe(true);

    // Click should not trigger onClick when disabled
    disabledElement.click();
    expect(mockOnClick).not.toHaveBeenCalled();

    // Re-enable and test click works
    button.setDisabled(false);

    // Get the element again after update
    const enabledElement = button.getElement();
    expect(enabledElement.disabled).toBe(false);

    enabledElement.click();
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

  it('should handle icon and text together', () => {
    const button = Button({
      text: 'Submit',
      icon: '→',
      onClick: vi.fn(),
    });

    const element = button.getElement();
    expect(element.textContent).toContain('Submit');
    expect(element.textContent).toContain('→');
  });

  it('should position icon correctly when iconPosition is right', () => {
    const button = Button({
      text: 'Next',
      icon: '→',
      iconPosition: 'right',
      onClick: vi.fn(),
    });

    const element = button.getElement();
    expect(element.className).toContain('btn--icon-right');
  });

  it('should handle loading state correctly', () => {
    const button = Button({
      text: 'Loading Button',
      loading: true,
    });

    const element = button.getElement();
    expect(element.getAttribute('aria-busy')).toBe('true');

    // Update to not loading
    button.setLoading(false);

    // Get the updated element
    const updatedElement = button.getElement();
    expect(updatedElement.getAttribute('aria-busy')).toBe('false');
  });

  it('should handle pressed state correctly', () => {
    const button = Button({
      text: 'Toggle Button',
      pressed: true,
    });

    const element = button.getElement();
    expect(element.getAttribute('aria-pressed')).toBe('true');

    // Update to not pressed
    button.setPressed(false);

    // Get the updated element
    const updatedElement = button.getElement();
    expect(updatedElement.getAttribute('aria-pressed')).toBe('false');
  });

  it('should debounce click handler when requested', () => {
    const mockClick = vi.fn();

    // Create button with debouncing
    const button = Button({
      text: 'Debounced Button',
      onClick: mockClick,
      debounce: true,
      debounceWait: 100,
    });

    const element = button.getElement();

    // First click
    element.click();

    // Second click immediately after should be ignored due to debounce
    element.click();

    // Verify no calls yet
    expect(mockClick).not.toHaveBeenCalled();

    // Fast-forward time to trigger the debounced function
    vi.advanceTimersByTime(150);

    // Now the click handler should have been called once
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('should apply proper ARIA attributes', () => {
    // Make sure we supply the required 'text' property
    const button = Button({
      text: 'Accessible Button',
      disabled: true,
    });

    const element = button.getElement();
    expect(element.getAttribute('aria-disabled')).toBe('true');

    // Icon-only button should have aria-label
    const iconButton = Button({
      text: '', // Empty text, but still providing it
      icon: '✓',
      variant: 'icon',
      ariaLabel: 'Confirm selection',
    });

    const iconElement = iconButton.getElement();
    expect(iconElement.getAttribute('aria-label')).toBe('Confirm selection');
  });
});
