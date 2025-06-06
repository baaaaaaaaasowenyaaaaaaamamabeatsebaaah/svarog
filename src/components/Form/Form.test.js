// src/components/Form/Form.test.js
import { describe, it, expect, vi } from 'vitest';
import Form from './Form.js';
import Input from '../Input/Input.js';

describe('Form component', () => {
  it('should create a form element', () => {
    const form = Form({
      children: document.createElement('div'),
    });

    const element = form.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('form');
    expect(element.className).toContain('form');
  });

  it('should throw error when children are not provided', () => {
    expect(() => {
      Form({});
    }).toThrow('Form: children is required');
  });

  it('should throw error for invalid layout', () => {
    expect(() => {
      Form({
        children: document.createElement('div'),
        layout: 'invalid',
      });
    }).toThrow('Form: layout must be either "vertical" or "horizontal"');
  });

  it('should apply layout class', () => {
    const form = Form({
      children: document.createElement('div'),
      layout: 'horizontal',
    });

    const element = form.getElement();
    expect(element.className).toContain('form--horizontal');
  });

  it('should handle form submission', () => {
    const mockOnSubmit = vi.fn();
    const form = Form({
      children: document.createElement('div'),
      onSubmit: mockOnSubmit,
    });

    const element = form.getElement();

    // Create and dispatch submit event
    const submitEvent = new Event('submit');
    element.dispatchEvent(submitEvent);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should handle form change', () => {
    const mockOnChange = vi.fn();
    const form = Form({
      children: document.createElement('div'),
      onChange: mockOnChange,
    });

    const element = form.getElement();

    // Create and dispatch change event
    const changeEvent = new Event('change');
    element.dispatchEvent(changeEvent);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should register form fields', () => {
    const form = Form({
      children: document.createElement('div'),
    });

    const input = Input({
      name: 'test',
    });

    form.registerField(input);

    // Check that the method returns the form instance for chaining
    const result = form.registerField(input);
    expect(result).toBe(form);
  });

  it('should reset the form', () => {
    const form = Form({
      children: document.createElement('div'),
    });

    // Mock the form reset method
    const formElement = form.getElement();
    formElement.reset = vi.fn();

    form.reset();

    expect(formElement.reset).toHaveBeenCalledTimes(1);
  });

  it('should validate the form', () => {
    const form = Form({
      children: document.createElement('div'),
    });

    const mockField = {
      validate: vi.fn().mockReturnValue(true),
    };

    form.registerField(mockField);

    const isValid = form.validate();

    expect(mockField.validate).toHaveBeenCalledTimes(1);
    expect(isValid).toBe(true);
  });

  it('should get form data', () => {
    // This would require a more complex setup with actual form elements
    // For a basic test, we just ensure the method exists and returns an object
    const form = Form({
      children: document.createElement('div'),
    });

    const formData = form.getFormData();

    expect(typeof formData).toBe('object');
  });
});
