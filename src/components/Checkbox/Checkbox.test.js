// src/components/Checkbox/Checkbox.test.js
import { describe, it, expect, vi } from 'vitest';
import Checkbox from './Checkbox.js';

describe('Checkbox component', () => {
  it('should create a checkbox element', () => {
    const checkbox = Checkbox({ label: 'Test checkbox' });

    const element = checkbox.getElement();
    const inputElement = element.querySelector('input[type="checkbox"]');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('checkbox-container');
    expect(inputElement).not.toBeNull();
    expect(inputElement.className).toBe('checkbox-input');
  });

  it('should throw error when label is not provided', () => {
    expect(() => {
      Checkbox({});
    }).toThrow(/label is required/);
  });

  it('should render label correctly', () => {
    const label = 'Test label';
    const checkbox = Checkbox({ label });

    const element = checkbox.getElement();
    const labelElement = element.querySelector('.checkbox-label');

    expect(labelElement).not.toBeNull();
    expect(labelElement.textContent).toBe(label);
  });

  it('should set initial checked state', () => {
    const checkbox = Checkbox({
      label: 'Test checkbox',
      checked: true,
    });

    const element = checkbox.getElement();
    const inputElement = element.querySelector('input[type="checkbox"]');

    expect(inputElement.checked).toBe(true);
    expect(checkbox.isChecked()).toBe(true);
  });

  // Test new standardized props
  it('should handle value prop as alias for checked', () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const checkbox = Checkbox({
      label: 'Test checkbox',
      value: true,
    });

    const element = checkbox.getElement();
    const inputElement = element.querySelector('input[type="checkbox"]');

    expect(inputElement.checked).toBe(true);
    expect(checkbox.isChecked()).toBe(true);
    expect(checkbox.getValue()).toBe(true);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('value is an alias for checked')
    );

    consoleWarnSpy.mockRestore();
  });

  it('should handle defaultValue prop as alias for initial checked state', () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const checkbox = Checkbox({
      label: 'Test checkbox',
      defaultValue: true,
    });

    const element = checkbox.getElement();
    const inputElement = element.querySelector('input[type="checkbox"]');

    expect(inputElement.checked).toBe(true);
    expect(checkbox.isChecked()).toBe(true);
    expect(checkbox.getValue()).toBe(true);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('defaultValue is an alias for checked')
    );

    consoleWarnSpy.mockRestore();
  });

  it('should handle loading state', () => {
    const checkbox = Checkbox({
      label: 'Test checkbox',
      loading: true,
    });

    const element = checkbox.getElement();
    const inputElement = element.querySelector('input[type="checkbox"]');
    const spinnerElement = element.querySelector('.checkbox-loading-spinner');

    expect(element.classList.contains('checkbox-container--loading')).toBe(
      true
    );
    expect(inputElement.disabled).toBe(true);
    expect(spinnerElement).not.toBeNull();
  });

  it('should handle isLoading as alias for loading', () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const checkbox = Checkbox({
      label: 'Test checkbox',
      isLoading: true,
    });

    const element = checkbox.getElement();

    expect(element.classList.contains('checkbox-container--loading')).toBe(
      true
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('isLoading is deprecated')
    );

    consoleWarnSpy.mockRestore();
  });

  it('should update checked state with setChecked method', () => {
    const checkbox = Checkbox({ label: 'Test checkbox' });

    // Initially unchecked
    expect(checkbox.isChecked()).toBe(false);

    // Set to checked
    checkbox.setChecked(true);

    // Get the UPDATED element after setChecked
    const updatedElement = checkbox.getElement();
    const inputElement = updatedElement.querySelector('input[type="checkbox"]');

    expect(checkbox.isChecked()).toBe(true);
    expect(inputElement.checked).toBe(true);

    // Set back to unchecked
    checkbox.setChecked(false);

    // Get the UPDATED element again after setChecked(false)
    const reUpdatedElement = checkbox.getElement();
    const updatedInputElement = reUpdatedElement.querySelector(
      'input[type="checkbox"]'
    );

    expect(checkbox.isChecked()).toBe(false);
    expect(updatedInputElement.checked).toBe(false);
  });

  it('should update checked state with setValue method', () => {
    const checkbox = Checkbox({ label: 'Test checkbox' });

    // Initially unchecked
    expect(checkbox.getValue()).toBe(false);

    // Set to checked using setValue
    checkbox.setValue(true);

    // Get the UPDATED element after setValue
    const updatedElement = checkbox.getElement();
    const inputElement = updatedElement.querySelector('input[type="checkbox"]');

    expect(checkbox.isChecked()).toBe(true);
    expect(checkbox.getValue()).toBe(true);
    expect(inputElement.checked).toBe(true);
  });

  it('should call onChange when checkbox changes', () => {
    const mockOnChange = vi.fn();
    const checkbox = Checkbox({
      label: 'Test checkbox',
      onChange: mockOnChange,
    });

    const element = checkbox.getElement();
    const inputElement = element.querySelector('input[type="checkbox"]');

    // Simulate checkbox change
    inputElement.checked = true;

    // Create and dispatch change event
    const changeEvent = new Event('change');
    inputElement.dispatchEvent(changeEvent);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Event), true);

    // Get updated state after the change event
    expect(checkbox.isChecked()).toBe(true);
    expect(checkbox.getValue()).toBe(true);
  });

  it('should validate required checkbox', () => {
    const checkbox = Checkbox({
      label: 'Required checkbox',
      required: true,
    });

    // Unchecked required checkbox should be invalid
    expect(checkbox.validate()).toBe(false);

    // Get the UPDATED element after validate()
    const elementAfterValidate = checkbox.getElement();
    expect(
      elementAfterValidate.classList.contains('checkbox-container--invalid')
    ).toBe(true);

    // Check the checkbox
    checkbox.setChecked(true);

    // Now checkbox should be valid
    expect(checkbox.validate()).toBe(true);

    // Get the UPDATED element after setChecked() and validate()
    const updatedElement = checkbox.getElement();
    expect(updatedElement.classList.contains('checkbox-container--valid')).toBe(
      true
    );
  });

  it('should show validation message', () => {
    const customMessage = 'This checkbox is required';
    const checkbox = Checkbox({
      label: 'Test checkbox',
      required: true,
      validationMessage: customMessage,
    });

    // Validate the unchecked required checkbox
    checkbox.validate();

    // Get the UPDATED element after validate()
    const updatedElement = checkbox.getElement();
    const messageElement = updatedElement.querySelector(
      '.checkbox-validation-message'
    );

    expect(messageElement).not.toBeNull();
    expect(messageElement.textContent).toBe(customMessage);
  });

  it('should handle disabled state', () => {
    const checkbox = Checkbox({
      label: 'Disabled checkbox',
      disabled: true,
    });

    const element = checkbox.getElement();
    const inputElement = element.querySelector('input[type="checkbox"]');
    expect(inputElement.disabled).toBe(true);
  });

  it('should apply custom class name', () => {
    const className = 'custom-checkbox';
    const checkbox = Checkbox({
      label: 'Checkbox with custom class',
      className,
    });

    const element = checkbox.getElement();
    expect(element.className).toContain(className);
  });

  it('should set id and name attributes', () => {
    const id = 'my-checkbox';
    const name = 'agreement';
    const checkbox = Checkbox({
      label: 'Checkbox with ID and name',
      id,
      name,
    });

    const element = checkbox.getElement();
    const inputElement = element.querySelector('input[type="checkbox"]');
    expect(inputElement.id).toBe(id);
    expect(inputElement.name).toBe(name);
  });

  it('should clean up resources when destroyed', () => {
    const checkbox = Checkbox({ label: 'Test checkbox' });

    // Spy on the getElement method to ensure it's not called after destroy
    const getElementSpy = vi.spyOn(checkbox, 'getElement');

    checkbox.destroy();

    // After destroy, the element should be null, so trying to getElement should return null
    expect(getElementSpy).not.toHaveBeenCalled();

    // Restore the spy
    getElementSpy.mockRestore();
  });
});
