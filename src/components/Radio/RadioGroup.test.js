// src/components/Radio/RadioGroup.test.js
import { describe, it, expect, vi } from 'vitest';
import RadioGroup from './RadioGroup.js';

describe('RadioGroup component', () => {
  // Sample options for tests
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const name = 'test-group';

  it('should create a radio group element', () => {
    const radioGroup = new RadioGroup({ options, name });

    const element = radioGroup.getElement();
    const radioInputs = element.querySelectorAll('input[type="radio"]');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('fieldset');
    expect(element.className).toContain('radio-group');
    expect(radioInputs.length).toBe(options.length);
  });

  it('should throw error when options are not provided', () => {
    expect(() => {
      new RadioGroup({ name });
    }).toThrow('RadioGroup: options array is required and must not be empty');
  });

  it('should throw error when name is not provided', () => {
    expect(() => {
      new RadioGroup({ options });
    }).toThrow('RadioGroup: name is required');
  });

  it('should throw error for invalid layout', () => {
    expect(() => {
      new RadioGroup({
        options,
        name,
        layout: 'invalid',
      });
    }).toThrow('RadioGroup: layout must be either "vertical" or "horizontal"');
  });

  it('should render legend correctly', () => {
    const legend = 'Test legend';
    const radioGroup = new RadioGroup({
      options,
      name,
      legend,
    });

    const legendElement = radioGroup.getElement().querySelector('legend');
    expect(legendElement).not.toBeNull();
    expect(legendElement.textContent).toBe(legend);
  });

  it('should set initial value', () => {
    const initialValue = 'option2';
    const radioGroup = new RadioGroup({
      options,
      name,
      value: initialValue,
    });

    expect(radioGroup.getValue()).toBe(initialValue);

    // Check that the correct radio is checked
    const radioInputs = radioGroup
      .getElement()
      .querySelectorAll('input[type="radio"]');
    const checkedRadio = Array.from(radioInputs).find((input) => input.checked);
    expect(checkedRadio).not.toBeUndefined();
    expect(checkedRadio.value).toBe(initialValue);
  });

  it('should update value with setValue method', () => {
    const radioGroup = new RadioGroup({ options, name });
    const newValue = 'option3';

    // Initially no selection
    expect(radioGroup.getValue()).toBeUndefined();

    // Set a value
    radioGroup.setValue(newValue);
    expect(radioGroup.getValue()).toBe(newValue);

    // Check that the correct radio is checked
    const radioInputs = radioGroup
      .getElement()
      .querySelectorAll('input[type="radio"]');
    const checkedRadio = Array.from(radioInputs).find((input) => input.checked);
    expect(checkedRadio).not.toBeUndefined();
    expect(checkedRadio.value).toBe(newValue);
  });

  it('should call onChange when selection changes', () => {
    const mockOnChange = vi.fn();
    const radioGroup = new RadioGroup({
      options,
      name,
      onChange: mockOnChange,
    });

    // Find the first radio input
    const radioInputs = radioGroup
      .getElement()
      .querySelectorAll('input[type="radio"]');
    const firstRadio = radioInputs[0];

    // Simulate radio change
    firstRadio.checked = true;

    // Create and dispatch change event
    const changeEvent = new Event('change');
    firstRadio.dispatchEvent(changeEvent);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.any(Event),
      options[0].value
    );
    expect(radioGroup.getValue()).toBe(options[0].value);
  });

  it('should validate required radio group', () => {
    const radioGroup = new RadioGroup({
      options,
      name,
      required: true,
    });

    const containerElement = radioGroup.getElement();

    // Empty selection should be invalid
    expect(radioGroup.validate()).toBe(false);
    expect(containerElement.classList.contains('radio-group--invalid')).toBe(
      true
    );

    // Set a value
    radioGroup.setValue('option1');

    // Now radio group should be valid
    expect(radioGroup.validate()).toBe(true);
    expect(containerElement.classList.contains('radio-group--valid')).toBe(
      true
    );
  });

  it('should show validation message', () => {
    const customMessage = 'Please select an option';
    const radioGroup = new RadioGroup({
      options,
      name,
      required: true,
      validationMessage: customMessage,
    });

    const containerElement = radioGroup.getElement();
    const messageElement = containerElement.querySelector(
      '.radio-group__validation-message'
    );

    // Validate the empty radio group
    radioGroup.validate();

    expect(messageElement).not.toBeNull();
    expect(messageElement.textContent).toBe(customMessage);
  });

  it('should apply layout class', () => {
    const radioGroup = new RadioGroup({
      options,
      name,
      layout: 'horizontal',
    });

    const containerElement = radioGroup.getElement();
    const optionsContainer = containerElement.querySelector(
      '.radio-group__options'
    );

    expect(containerElement.className).toContain('radio-group--horizontal');
    expect(optionsContainer.className).toContain(
      'radio-group__options--horizontal'
    );
  });
});
