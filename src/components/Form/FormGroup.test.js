// src/components/Form/FormGroup.test.js
import { describe, it, expect, vi } from 'vitest';
import FormGroup from './FormGroup.js';
import Input from '../Input/Input.js';

describe('FormGroup component', () => {
  it('should create a form group element', () => {
    const field = Input({
      name: 'test',
    });

    const formGroup = FormGroup({
      label: 'Test Label',
      field,
    });

    const element = formGroup.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('form-group');

    // Check label
    const labelElement = element.querySelector('.form-group__label');
    expect(labelElement).not.toBeNull();
    expect(labelElement.textContent).toBe('Test Label');

    // Check field container
    const fieldContainer = element.querySelector('.form-group__field');
    expect(fieldContainer).not.toBeNull();
    expect(fieldContainer.children.length).toBe(1);
  });

  it('should throw error when label is not provided', () => {
    const field = Input({
      name: 'test',
    });

    expect(() => {
      FormGroup({
        field,
      });
    }).toThrow('FormGroup: label is required');
  });

  it('should throw error when field is not provided', () => {
    expect(() => {
      FormGroup({
        label: 'Test Label',
      });
    }).toThrow('FormGroup: field is required');
  });

  it('should throw error for invalid label position', () => {
    const field = Input({
      name: 'test',
    });

    expect(() => {
      FormGroup({
        label: 'Test Label',
        field,
        labelPosition: 'invalid',
      });
    }).toThrow(
      'FormGroup: labelPosition must be either "top" or "left" or "right" or "bottom"'
    );
  });

  it('should handle validation message updates', () => {
    // Create a mock field component with validation
    const mockField = {
      getElement: () => document.createElement('input'),
      validate: vi.fn().mockReturnValue(false),
      validationMessageElement: {
        textContent: 'Field is invalid',
      },
    };

    const formGroup = FormGroup({
      label: 'Test Field',
      field: mockField,
    });

    const element = formGroup.getElement();

    // Validate should call the field's validate method
    const isValid = formGroup.validate();
    expect(isValid).toBe(false);
    expect(mockField.validate).toHaveBeenCalled();

    // FormGroup should have created a validation message element
    const validationMessage = element.querySelector(
      '.form-group__validation-message'
    );
    expect(validationMessage).not.toBeNull();

    // It should have updated the validation message from the field
    expect(validationMessage.textContent).toBe('Field is invalid');

    // The container should have has-error class
    expect(element.classList.contains('has-error')).toBe(true);

    // Now mock a valid field
    mockField.validate.mockReturnValue(true);
    mockField.validationMessageElement.textContent = '';

    // Validate again
    formGroup.validate();

    // The validation message should be cleared
    expect(validationMessage.textContent).toBe('');

    // The container should have has-success class instead
    expect(element.classList.contains('has-error')).toBe(false);
    expect(element.classList.contains('has-success')).toBe(true);
  });

  it('should apply label position class', () => {
    const field = Input({
      name: 'test',
    });

    const formGroup = FormGroup({
      label: 'Test Label',
      field,
      labelPosition: 'left',
    });

    const element = formGroup.getElement();
    expect(element.className).toContain('form-group--left');
  });

  it('should show required indicator when required is true', () => {
    const field = Input({
      name: 'test',
    });

    const formGroup = FormGroup({
      label: 'Test Label',
      field,
      required: true,
    });

    const element = formGroup.getElement();
    const labelElement = element.querySelector('.form-group__label');

    expect(labelElement.className).toContain('form-group__label--required');
  });

  it('should show help text when provided', () => {
    const field = Input({
      name: 'test',
    });

    const helpText = 'This is help text';
    const formGroup = FormGroup({
      label: 'Test Label',
      field,
      helpText,
    });

    const element = formGroup.getElement();
    const helpTextElement = element.querySelector('.form-group__help-text');

    expect(helpTextElement).not.toBeNull();
    expect(helpTextElement.textContent).toBe(helpText);
  });

  it('should set ID attributes correctly', () => {
    const id = 'test-field';
    const field = Input({
      name: 'test',
      id,
    });

    const formGroup = FormGroup({
      label: 'Test Label',
      field,
      id,
    });

    const element = formGroup.getElement();
    const labelElement = element.querySelector('.form-group__label');

    expect(labelElement.getAttribute('for')).toBe(id);
    expect(labelElement.id).toBe(`${id}-label`);
  });

  it('should accept HTMLElement as field', () => {
    const field = document.createElement('input');
    field.type = 'text';
    field.name = 'test';

    const formGroup = FormGroup({
      label: 'Test Label',
      field,
    });

    const element = formGroup.getElement();
    const fieldContainer = element.querySelector('.form-group__field');

    expect(fieldContainer.children[0]).toBe(field);
  });

  it('should get field component', () => {
    const field = Input({
      name: 'test',
    });

    const formGroup = FormGroup({
      label: 'Test Label',
      field,
    });

    expect(formGroup.getField()).toBe(field);
  });
});
