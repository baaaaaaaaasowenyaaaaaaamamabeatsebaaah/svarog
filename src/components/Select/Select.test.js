// src/components/Select/Select.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import Select from './Select.js';

describe('Select component', () => {
  // Sample options for tests
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  // Test cleanup
  let select = null;

  afterEach(() => {
    // Clean up any event listeners
    if (select && typeof select.destroy === 'function') {
      select.destroy();
    }
    select = null;
  });

  it('should create both native and custom select elements', () => {
    select = new Select({ options });

    const element = select.getElement();
    const nativeSelect = element.querySelector('.select-native');
    const customSelect = element.querySelector('.select-custom');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('select-container');
    expect(nativeSelect).not.toBeNull();
    expect(customSelect).not.toBeNull();
  });

  it('should render options correctly in both native and custom selects', () => {
    select = new Select({ options });
    const element = select.getElement();

    // Check native select options
    const nativeSelect = element.querySelector('.select-native');
    // Add +1 for placeholder option
    expect(nativeSelect.options.length).toBe(options.length + 1);

    // Check custom select options
    const customOptions = element.querySelectorAll('.select-custom__option');
    expect(customOptions.length).toBe(options.length);

    // Check options content (skip placeholder for native)
    for (let i = 0; i < options.length; i++) {
      const nativeOption = nativeSelect.options[i + 1];
      const customOption = customOptions[i];

      expect(nativeOption.value).toBe(options[i].value);
      expect(nativeOption.textContent).toBe(options[i].label);

      expect(customOption.getAttribute('data-value')).toBe(options[i].value);
      expect(customOption.textContent).toBe(options[i].label);
    }
  });

  it('should set initial value', () => {
    const initialValue = 'option2';
    select = new Select({
      options,
      value: initialValue,
    });

    const element = select.getElement();
    const nativeSelect = element.querySelector('.select-native');
    const selectedDisplay = element.querySelector('.select-custom__selected');

    expect(nativeSelect.value).toBe(initialValue);
    expect(select.getValue()).toBe(initialValue);
    expect(selectedDisplay.textContent).toBe('Option 2');
  });

  it('should update value with setValue method', () => {
    select = new Select({ options });
    const newValue = 'option3';

    select.setValue(newValue);

    const element = select.getElement();
    const nativeSelect = element.querySelector('.select-native');
    const selectedDisplay = element.querySelector('.select-custom__selected');

    expect(nativeSelect.value).toBe(newValue);
    expect(select.getValue()).toBe(newValue);
    expect(selectedDisplay.textContent).toBe('Option 3');
  });

  it('should call onChange when selection changes', () => {
    const mockOnChange = vi.fn();
    select = new Select({ options, onChange: mockOnChange });

    const element = select.getElement();
    const nativeSelect = element.querySelector('.select-native');
    nativeSelect.value = 'option2';

    // Create and dispatch change event
    const changeEvent = new Event('change');
    nativeSelect.dispatchEvent(changeEvent);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(select.getValue()).toBe('option2');

    // Check if custom display is updated
    const selectedDisplay = element.querySelector('.select-custom__selected');
    expect(selectedDisplay.textContent).toBe('Option 2');
  });

  it('should call onFocus and onBlur callbacks', () => {
    const mockOnFocus = vi.fn();
    const mockOnBlur = vi.fn();
    select = new Select({
      options,
      onFocus: mockOnFocus,
      onBlur: mockOnBlur,
    });

    const element = select.getElement();
    const nativeSelect = element.querySelector('.select-native');

    // Create and dispatch focus event
    const focusEvent = new Event('focus');
    nativeSelect.dispatchEvent(focusEvent);
    expect(mockOnFocus).toHaveBeenCalledTimes(1);

    // Create and dispatch blur event
    const blurEvent = new Event('blur');
    nativeSelect.dispatchEvent(blurEvent);
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('should apply focused class when select is focused', () => {
    select = new Select({ options });
    const element = select.getElement();
    const nativeSelect = element.querySelector('.select-native');
    const customSelect = element.querySelector('.select-custom');

    // Create and dispatch focus event
    const focusEvent = new Event('focus');
    nativeSelect.dispatchEvent(focusEvent);
    expect(element.classList.contains('select-container--focused')).toBe(true);
    expect(customSelect.classList.contains('select-custom--focused')).toBe(
      true
    );

    // Create and dispatch blur event
    const blurEvent = new Event('blur', { bubbles: true });
    nativeSelect.dispatchEvent(blurEvent);
    expect(element.classList.contains('select-container--focused')).toBe(false);
    expect(customSelect.classList.contains('select-custom--focused')).toBe(
      false
    );
  });

  it('should validate required select', () => {
    select = new Select({
      options,
      required: true,
      validationMessage: 'Please select an option',
    });
    const element = select.getElement();
    const customSelect = element.querySelector('.select-custom');

    // Initial state should have no validation classes
    expect(element.classList.contains('select-container--invalid')).toBe(false);
    expect(element.classList.contains('select-container--valid')).toBe(false);
    expect(customSelect.classList.contains('select-custom--invalid')).toBe(
      false
    );
    expect(customSelect.classList.contains('select-custom--valid')).toBe(false);

    // Empty select should be invalid after validation
    const initialValidation = select.validate();
    expect(initialValidation).toBe(false);
    expect(element.classList.contains('select-container--invalid')).toBe(true);
    expect(customSelect.classList.contains('select-custom--invalid')).toBe(
      true
    );

    // Set a value
    select.setValue('option1');

    // Now select should be valid
    const afterValidation = select.validate();
    expect(afterValidation).toBe(true);
    expect(element.classList.contains('select-container--valid')).toBe(true);
    expect(customSelect.classList.contains('select-custom--valid')).toBe(true);
  });

  it('should show validation message', () => {
    const customMessage = 'Please select an option';
    select = new Select({
      options,
      required: true,
      validationMessage: customMessage,
    });

    const element = select.getElement();
    const messageElement = element.querySelector('.select-validation-message');

    // Validate the empty select
    select.validate();

    expect(messageElement).not.toBeNull();
    expect(messageElement.textContent).toBe(customMessage);
  });

  it('should handle disabled state', () => {
    select = new Select({ options, disabled: true });
    const element = select.getElement();
    const nativeSelect = element.querySelector('.select-native');
    const customSelect = element.querySelector('.select-custom');

    expect(nativeSelect.disabled).toBe(true);
    expect(customSelect.classList.contains('select-custom--disabled')).toBe(
      true
    );
  });

  it('should handle multiple selection', () => {
    const initialValues = ['option1', 'option3'];
    select = new Select({
      options,
      multiple: true,
      value: initialValues,
    });

    const element = select.getElement();
    const nativeSelect = element.querySelector('.select-native');
    expect(nativeSelect.multiple).toBe(true);

    // Check initial selection
    const selectedOptions = Array.from(nativeSelect.selectedOptions).map(
      (option) => option.value
    );
    expect(selectedOptions).toEqual(initialValues);

    // Check custom selected display shows multiple items
    const selectedDisplay = element.querySelector('.select-custom__selected');
    expect(selectedDisplay.textContent).toBe('Option 1, Option 3');

    // Set new values
    const newValues = ['option1', 'option2'];
    select.setValue(newValues);

    // Check updated selection
    const updatedOptions = Array.from(nativeSelect.selectedOptions).map(
      (option) => option.value
    );
    expect(updatedOptions).toEqual(newValues);

    // Check updated display
    expect(selectedDisplay.textContent).toBe('Option 1, Option 2');
  });

  it('should toggle dropdown when custom select is clicked', () => {
    select = new Select({ options });
    const element = select.getElement();
    const customSelect = element.querySelector('.select-custom');
    const dropdown = element.querySelector('.select-custom__dropdown');

    // Initial state - dropdown closed
    expect(dropdown.classList.contains('select-custom__dropdown--open')).toBe(
      false
    );

    // Click to open dropdown
    customSelect.click();
    expect(dropdown.classList.contains('select-custom__dropdown--open')).toBe(
      true
    );

    // Click again to close dropdown
    customSelect.click();
    expect(dropdown.classList.contains('select-custom__dropdown--open')).toBe(
      false
    );
  });

  it('should select option when custom option is clicked', () => {
    select = new Select({ options });
    const element = select.getElement();
    const customSelect = element.querySelector('.select-custom');
    const optionElements = element.querySelectorAll('.select-custom__option');

    // Open the dropdown
    customSelect.click();

    // Click the second option
    const mockClickEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(mockClickEvent, 'target', {
      value: optionElements[1],
    });
    optionElements[1].dispatchEvent(mockClickEvent);

    // Check that the value was updated
    expect(select.getValue()).toBe('option2');

    // Check that the dropdown was closed
    const dropdown = element.querySelector('.select-custom__dropdown');
    expect(dropdown.classList.contains('select-custom__dropdown--open')).toBe(
      false
    );
  });

  it('should clean up event listeners with destroy method', () => {
    const documentAddEventSpy = vi.spyOn(document, 'addEventListener');
    const documentRemoveEventSpy = vi.spyOn(document, 'removeEventListener');

    select = new Select({ options });

    // Check that event listener was added
    expect(documentAddEventSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );

    // Clean up
    select.destroy();

    // Check that event listener was removed
    expect(documentRemoveEventSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );

    // Restore spies
    documentAddEventSpy.mockRestore();
    documentRemoveEventSpy.mockRestore();
  });
});
