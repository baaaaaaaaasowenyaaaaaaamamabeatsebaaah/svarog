// src/components/Radio/Radio.test.js
import { describe, it, expect, vi } from 'vitest';
import Radio from './Radio.js';

describe('Radio component', () => {
  it('should create a radio element', () => {
    const radio = new Radio({
      label: 'Test radio',
      value: 'test',
    });

    const element = radio.getElement();
    const inputElement = element.querySelector('input[type="radio"]');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('radio-container');
    expect(inputElement).not.toBeNull();
    expect(inputElement.className).toBe('radio-input');
  });

  it('should throw error when label is not provided', () => {
    expect(() => {
      new Radio({ value: 'test' });
    }).toThrow('Radio: label is required');
  });

  it('should throw error when value is not provided', () => {
    expect(() => {
      new Radio({ label: 'Test radio' });
    }).toThrow('Radio: value is required');
  });

  it('should render label correctly', () => {
    const label = 'Test label';
    const radio = new Radio({
      label,
      value: 'test',
    });

    const labelElement = radio.getElement().querySelector('.radio-label');
    expect(labelElement).not.toBeNull();
    expect(labelElement.textContent).toBe(label);
  });

  it('should set initial checked state', () => {
    const radio = new Radio({
      label: 'Test radio',
      value: 'test',
      checked: true,
    });

    const inputElement = radio
      .getElement()
      .querySelector('input[type="radio"]');
    expect(inputElement.checked).toBe(true);
    expect(radio.isChecked()).toBe(true);
  });

  it('should update checked state with setChecked method', () => {
    const radio = new Radio({
      label: 'Test radio',
      value: 'test',
    });

    // Initially unchecked
    expect(radio.isChecked()).toBe(false);

    // Set to checked
    radio.setChecked(true);
    expect(radio.isChecked()).toBe(true);

    const inputElement = radio
      .getElement()
      .querySelector('input[type="radio"]');
    expect(inputElement.checked).toBe(true);

    // Set back to unchecked
    radio.setChecked(false);
    expect(radio.isChecked()).toBe(false);
    expect(inputElement.checked).toBe(false);
  });

  it('should call onChange when radio changes', () => {
    const mockOnChange = vi.fn();
    const radio = new Radio({
      label: 'Test radio',
      value: 'test',
      onChange: mockOnChange,
    });

    const inputElement = radio
      .getElement()
      .querySelector('input[type="radio"]');

    // Simulate radio change
    inputElement.checked = true;

    // Create and dispatch change event
    const changeEvent = new Event('change');
    inputElement.dispatchEvent(changeEvent);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Event), 'test');
    expect(radio.isChecked()).toBe(true);
  });

  it('should handle disabled state', () => {
    const radio = new Radio({
      label: 'Disabled radio',
      value: 'test',
      disabled: true,
    });

    const inputElement = radio
      .getElement()
      .querySelector('input[type="radio"]');
    expect(inputElement.disabled).toBe(true);
  });

  it('should apply custom class name', () => {
    const className = 'custom-radio';
    const radio = new Radio({
      label: 'Radio with custom class',
      value: 'test',
      className,
    });

    const containerElement = radio.getElement();
    expect(containerElement.className).toContain(className);
  });

  it('should set id and name attributes', () => {
    const id = 'my-radio';
    const name = 'options';
    const radio = new Radio({
      label: 'Radio with ID and name',
      value: 'test',
      id,
      name,
    });

    const inputElement = radio
      .getElement()
      .querySelector('input[type="radio"]');
    expect(inputElement.id).toBe(id);
    expect(inputElement.name).toBe(name);
  });

  it('should return the correct value', () => {
    const value = 'test-value';
    const radio = new Radio({
      label: 'Radio with value',
      value,
    });

    expect(radio.getValue()).toBe(value);
  });
});
