// src/components/Select/Select.test.js
import { describe, it, expect, vi } from 'vitest';
import Select from './Select.js';

describe('Select component', () => {
  // Sample options for tests
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should create a select element', () => {
    const select = new Select({ options });

    const element = select.getElement();
    const selectElement = element.querySelector('select');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('select-container');
    expect(selectElement).not.toBeNull();
    expect(selectElement.className).toBe('select');
  });

  it('should render options correctly', () => {
    const select = new Select({ options });

    const selectElement = select.getElement().querySelector('select');
    // Add +1 for placeholder option
    expect(selectElement.options.length).toBe(options.length + 1);

    // Check options content (skip placeholder)
    for (let i = 0; i < options.length; i++) {
      const optionElement = selectElement.options[i + 1];
      expect(optionElement.value).toBe(options[i].value);
      expect(optionElement.textContent).toBe(options[i].label);
    }
  });

  it('should set initial value', () => {
    const initialValue = 'option2';
    const select = new Select({
      options,
      value: initialValue,
    });

    const selectElement = select.getElement().querySelector('select');
    expect(selectElement.value).toBe(initialValue);
    expect(select.getValue()).toBe(initialValue);
  });

  it('should update value with setValue method', () => {
    const select = new Select({ options });
    const newValue = 'option3';

    select.setValue(newValue);

    const selectElement = select.getElement().querySelector('select');
    expect(selectElement.value).toBe(newValue);
    expect(select.getValue()).toBe(newValue);
  });

  it('should call onChange when selection changes', () => {
    const mockOnChange = vi.fn();
    const select = new Select({ options, onChange: mockOnChange });

    const selectElement = select.getElement().querySelector('select');
    selectElement.value = 'option2';

    // Create and dispatch change event
    const changeEvent = new Event('change');
    selectElement.dispatchEvent(changeEvent);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(select.getValue()).toBe('option2');
  });

  it('should call onFocus and onBlur callbacks', () => {
    const mockOnFocus = vi.fn();
    const mockOnBlur = vi.fn();
    const select = new Select({
      options,
      onFocus: mockOnFocus,
      onBlur: mockOnBlur,
    });

    const selectElement = select.getElement().querySelector('select');

    // Create and dispatch focus event
    const focusEvent = new Event('focus');
    selectElement.dispatchEvent(focusEvent);
    expect(mockOnFocus).toHaveBeenCalledTimes(1);

    // Create and dispatch blur event
    const blurEvent = new Event('blur');
    selectElement.dispatchEvent(blurEvent);
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('should apply focused class when select is focused', () => {
    const select = new Select({ options });
    const containerElement = select.getElement();
    const selectElement = containerElement.querySelector('select');

    // Create and dispatch focus event
    const focusEvent = new Event('focus');
    selectElement.dispatchEvent(focusEvent);
    expect(
      containerElement.classList.contains('select-container--focused')
    ).toBe(true);

    // Create and dispatch blur event
    const blurEvent = new Event('blur');
    selectElement.dispatchEvent(blurEvent);
    expect(
      containerElement.classList.contains('select-container--focused')
    ).toBe(false);
  });

  it('should validate required select', () => {
    const select = new Select({
      options,
      required: true,
      validationMessage: 'Please select an option',
    });
    const containerElement = select.getElement();

    // Empty select should be invalid
    const initialValidation = select.validate();
    expect(initialValidation).toBe(false);
    expect(
      containerElement.classList.contains('select-container--invalid')
    ).toBe(true);

    // Set a value
    select.setValue('option1');

    // Now select should be valid
    const afterValidation = select.validate();
    expect(afterValidation).toBe(true);
    expect(containerElement.classList.contains('select-container--valid')).toBe(
      true
    );
  });

  it('should show validation message', () => {
    const customMessage = 'Please select an option';
    const select = new Select({
      options,
      required: true,
      validationMessage: customMessage,
    });

    const containerElement = select.getElement();
    const messageElement = containerElement.querySelector(
      '.select-validation-message'
    );

    // Validate the empty select
    select.validate();

    expect(messageElement).not.toBeNull();
    expect(messageElement.textContent).toBe(customMessage);
  });

  it('should handle disabled state', () => {
    const select = new Select({ options, disabled: true });
    const selectElement = select.getElement().querySelector('select');

    expect(selectElement.disabled).toBe(true);
  });

  it('should handle multiple selection', () => {
    const initialValues = ['option1', 'option3'];
    const select = new Select({
      options,
      multiple: true,
      value: initialValues,
    });

    const selectElement = select.getElement().querySelector('select');
    expect(selectElement.multiple).toBe(true);

    // Check initial selection
    const selectedOptions = Array.from(selectElement.selectedOptions).map(
      (option) => option.value
    );
    expect(selectedOptions).toEqual(initialValues);

    // Set new values
    const newValues = ['option1', 'option2'];
    select.setValue(newValues);

    // Check updated selection
    const updatedOptions = Array.from(selectElement.selectedOptions).map(
      (option) => option.value
    );
    expect(updatedOptions).toEqual(newValues);
  });
});
