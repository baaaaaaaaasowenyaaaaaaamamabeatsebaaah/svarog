import Button from './Button.js';

describe('Button', () => {
  test('should render correctly', () => {
    const mockOnClick = vi.fn();
    const button = new Button({ text: 'Click Me', onClick: mockOnClick });
    document.body.appendChild(button.getElement());

    const btnElement = document.querySelector('button');
    expect(btnElement).not.toBeNull();
    expect(btnElement.textContent).toBe('Click Me');

    document.body.removeChild(button.getElement());
  });

  test('should call onClick when clicked', () => {
    const mockOnClick = vi.fn();
    const button = new Button({ text: 'Click Me', onClick: mockOnClick });
    document.body.appendChild(button.getElement());

    const btnElement = document.querySelector('button');
    btnElement.click();
    expect(mockOnClick).toHaveBeenCalled();

    document.body.removeChild(button.getElement());
  });

  test('should be disabled when the disabled property is true', () => {
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
