// src/components/Checkbox/Checkbox.test.js
import { describe, it, expect, vi } from 'vitest';
import Checkbox from './Checkbox.js';

describe('Checkbox component', () => {
  it('should create a checkbox element', () => {
    const checkbox = new Checkbox({ label: 'Test checkbox' });

    const element = checkbox.getElement();
    const inputElement = element.querySelector('input[type="checkbox"]');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('checkbox-container');
    expect(inputElement).not.toBeNull();
    expect(inputElement.className).toBe('checkbox-input');
  });

  it('should throw error when label is not provided', () => {
    expect(() => {
      new Checkbox({});
    }).toThrow('Checkbox: label is required');
  });

  it('should render label correctly', () => {
    const label = 'Test label';
    const checkbox = new Checkbox({ label });

    const labelElement = checkbox.getElement().querySelector('.checkbox-label');
    expect(labelElement).not.toBeNull();
    expect(labelElement.textContent).toBe(label);
  });

  it('should set initial checked state', () => {
    const checkbox = new Checkbox({
      label: 'Test checkbox',
      checked: true,
    });

    const inputElement = checkbox
      .getElement()
      .querySelector('input[type="checkbox"]');
    expect(inputElement.checked).toBe(true);
    expect(checkbox.isChecked()).toBe(true);
  });

  it('should update checked state with setChecked method', () => {
    const checkbox = new Checkbox({ label: 'Test checkbox' });

    // Initially unchecked
    expect(checkbox.isChecked()).toBe(false);

    // Set to checked
    checkbox.setChecked(true);
    expect(checkbox.isChecked()).toBe(true);

    const inputElement = checkbox
      .getElement()
      .querySelector('input[type="checkbox"]');
    expect(inputElement.checked).toBe(true);

    // Set back to unchecked
    checkbox.setChecked(false);
    expect(checkbox.isChecked()).toBe(false);
    expect(inputElement.checked).toBe(false);
  });

  it('should call onChange when checkbox changes', () => {
    const mockOnChange = vi.fn();
    const checkbox = new Checkbox({
      label: 'Test checkbox',
      onChange: mockOnChange,
    });

    const inputElement = checkbox
      .getElement()
      .querySelector('input[type="checkbox"]');

    // Simulate checkbox change
    inputElement.checked = true;

    // Create and dispatch change event
    const changeEvent = new Event('change');
    inputElement.dispatchEvent(changeEvent);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Event), true);
    expect(checkbox.isChecked()).toBe(true);
  });

  it('should validate required checkbox', () => {
    const checkbox = new Checkbox({
      label: 'Required checkbox',
      required: true,
    });

    const containerElement = checkbox.getElement();

    // Unchecked required checkbox should be invalid
    expect(checkbox.validate()).toBe(false);
    expect(
      containerElement.classList.contains('checkbox-container--invalid')
    ).toBe(true);

    // Check the checkbox
    checkbox.setChecked(true);

    // Now checkbox should be valid
    expect(checkbox.validate()).toBe(true);
    expect(
      containerElement.classList.contains('checkbox-container--valid')
    ).toBe(true);
  });

  it('should show validation message', () => {
    const customMessage = 'This checkbox is required';
    const checkbox = new Checkbox({
      label: 'Test checkbox',
      required: true,
      validationMessage: customMessage,
    });

    const containerElement = checkbox.getElement();
    const messageElement = containerElement.querySelector(
      '.checkbox-validation-message'
    );

    // Validate the unchecked required checkbox
    checkbox.validate();

    expect(messageElement).not.toBeNull();
    expect(messageElement.textContent).toBe(customMessage);
  });

  it('should handle disabled state', () => {
    const checkbox = new Checkbox({
      label: 'Disabled checkbox',
      disabled: true,
    });

    const inputElement = checkbox
      .getElement()
      .querySelector('input[type="checkbox"]');
    expect(inputElement.disabled).toBe(true);
  });

  it('should apply custom class name', () => {
    const className = 'custom-checkbox';
    const checkbox = new Checkbox({
      label: 'Checkbox with custom class',
      className,
    });

    const containerElement = checkbox.getElement();
    expect(containerElement.className).toContain(className);
  });

  it('should set id and name attributes', () => {
    const id = 'my-checkbox';
    const name = 'agreement';
    const checkbox = new Checkbox({
      label: 'Checkbox with ID and name',
      id,
      name,
    });

    const inputElement = checkbox
      .getElement()
      .querySelector('input[type="checkbox"]');
    expect(inputElement.id).toBe(id);
    expect(inputElement.name).toBe(name);
  });
});
