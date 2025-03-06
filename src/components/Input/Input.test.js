// src/components/Input/Input.test.js
import { describe, it, expect, vi } from 'vitest';
import Input from './Input.js';

describe('Input component', () => {
  it('should create an input element', () => {
    const input = new Input({});

    const element = input.getElement();
    const inputElement = element.querySelector('input');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('input-container');
    expect(inputElement).not.toBeNull();
    expect(inputElement.className).toBe('input');
  });

  it('should set initial value', () => {
    const initialValue = 'Initial value';
    const input = new Input({ value: initialValue });

    const inputElement = input.getElement().querySelector('input');
    expect(inputElement.value).toBe(initialValue);
    expect(input.getValue()).toBe(initialValue);
  });

  it('should update value with setValue method', () => {
    const input = new Input({});
    const newValue = 'New value';

    input.setValue(newValue);

    const inputElement = input.getElement().querySelector('input');
    expect(inputElement.value).toBe(newValue);
    expect(input.getValue()).toBe(newValue);
  });

  it('should call onChange when input changes', () => {
    const mockOnChange = vi.fn();
    const input = new Input({ onChange: mockOnChange });

    const inputElement = input.getElement().querySelector('input');
    inputElement.value = 'Test';

    // Create and dispatch input event
    const inputEvent = new Event('input');
    inputElement.dispatchEvent(inputEvent);

    // Create and dispatch change event
    const changeEvent = new Event('change');
    inputElement.dispatchEvent(changeEvent);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(input.getValue()).toBe('Test');
  });

  it('should call onFocus and onBlur callbacks', () => {
    const mockOnFocus = vi.fn();
    const mockOnBlur = vi.fn();
    const input = new Input({ onFocus: mockOnFocus, onBlur: mockOnBlur });

    const inputElement = input.getElement().querySelector('input');

    // Create and dispatch focus event
    const focusEvent = new Event('focus');
    inputElement.dispatchEvent(focusEvent);
    expect(mockOnFocus).toHaveBeenCalledTimes(1);

    // Create and dispatch blur event
    const blurEvent = new Event('blur');
    inputElement.dispatchEvent(blurEvent);
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('should apply focused class when input is focused', () => {
    const input = new Input({});
    const containerElement = input.getElement();
    const inputElement = containerElement.querySelector('input');

    // Create and dispatch focus event
    const focusEvent = new Event('focus');
    inputElement.dispatchEvent(focusEvent);
    expect(
      containerElement.classList.contains('input-container--focused')
    ).toBe(true);

    // Create and dispatch blur event
    const blurEvent = new Event('blur');
    inputElement.dispatchEvent(blurEvent);
    expect(
      containerElement.classList.contains('input-container--focused')
    ).toBe(false);
  });

  it('should validate required input', () => {
    const input = new Input({ required: true });
    const containerElement = input.getElement();

    // Empty input should be invalid
    expect(input.validate()).toBe(false);
    expect(
      containerElement.classList.contains('input-container--invalid')
    ).toBe(true);

    // Set a value
    input.setValue('Test value');

    // Now input should be valid
    expect(input.validate()).toBe(true);
    expect(containerElement.classList.contains('input-container--valid')).toBe(
      true
    );
  });

  it('should validate against pattern', () => {
    const input = new Input({ pattern: '[0-9]{3}' });

    // Invalid input
    input.setValue('abc');
    expect(input.validate()).toBe(false);

    // Valid input
    input.setValue('123');
    expect(input.validate()).toBe(true);
  });

  it('should show validation message', () => {
    const customMessage = 'This field is required';
    const input = new Input({
      required: true,
      validationMessage: customMessage,
    });

    const containerElement = input.getElement();
    const messageElement = containerElement.querySelector(
      '.input-validation-message'
    );

    // Validate the empty input
    input.validate();

    expect(messageElement).not.toBeNull();
    expect(messageElement.textContent).toBe(customMessage);
  });

  it('should handle disabled state', () => {
    const input = new Input({ disabled: true });
    const inputElement = input.getElement().querySelector('input');

    expect(inputElement.disabled).toBe(true);
  });

  it('should handle readonly state', () => {
    const input = new Input({ readonly: true });
    const inputElement = input.getElement().querySelector('input');

    expect(inputElement.readOnly).toBe(true);
  });
});
