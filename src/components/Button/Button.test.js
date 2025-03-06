// src/components/Button/Button.test.js
import { describe, it, expect, vi } from 'vitest';
import Button from './Button.js';

describe('Button', () => {
  it('should render correctly', () => {
    const mockOnClick = vi.fn();
    const button = new Button({ text: 'Click Me', onClick: mockOnClick });
    document.body.appendChild(button.getElement());

    const btnElement = document.querySelector('button');
    expect(btnElement).not.toBeNull();
    expect(btnElement.textContent).toBe('Click Me');

    document.body.removeChild(button.getElement());
  });

  it('should call onClick when clicked', () => {
    const mockOnClick = vi.fn();
    const button = new Button({ text: 'Click Me', onClick: mockOnClick });
    document.body.appendChild(button.getElement());

    const btnElement = document.querySelector('button');
    btnElement.click();
    expect(mockOnClick).toHaveBeenCalled();

    document.body.removeChild(button.getElement());
  });

  it('should be disabled when the disabled property is true', () => {
    const mockOnClick = vi.fn();
    const button = new Button({
      text: 'Click Me',
      onClick: mockOnClick,
      disabled: true,
    });
    document.body.appendChild(button.getElement());

    const btnElement = document.querySelector('button');
    expect(btnElement.disabled).toBe(true);

    document.body.removeChild(button.getElement());
  });
});
