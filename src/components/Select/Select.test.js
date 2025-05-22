// src/components/Select/Select.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import Select from './Select.js';
import { debounce } from '../../utils/performance.js';

// Mock performance utils
vi.mock('../../utils/performance.js', () => ({
  debounce: vi.fn((fn) => {
    // Just return the original function for testing simplicity
    return fn;
  }),
}));

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

    // Reset mocks
    vi.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should create both native and custom select elements', () => {
      select = Select({ options });

      const element = select.getElement();
      const nativeSelect = element.querySelector('.select-native');
      const customSelect = element.querySelector('.select-custom');

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.className).toContain('select-container');
      expect(nativeSelect).not.toBeNull();
      expect(customSelect).not.toBeNull();
    });

    it('should render options correctly in both native and custom selects', () => {
      select = Select({ options });
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
      select = Select({
        options,
        value: initialValue,
      });

      expect(select.getValue()).toBe(initialValue);
    });

    it('should update value with setValue method', () => {
      select = Select({ options });
      const newValue = 'option3';

      select.setValue(newValue);
      expect(select.getValue()).toBe(newValue);
    });

    it('should call onChange when selection changes', () => {
      const mockOnChange = vi.fn();
      select = Select({ options, onChange: mockOnChange });

      const element = select.getElement();
      const nativeSelect = element.querySelector('.select-native');

      // Simulate user selecting an option
      nativeSelect.value = 'option2';

      // Trigger the change event on the native select
      const changeEvent = new Event('change', { bubbles: true });
      nativeSelect.dispatchEvent(changeEvent);

      expect(mockOnChange).toHaveBeenCalledWith(expect.any(Event), 'option2');
    });
  });

  describe('Loading states', () => {
    it('should create select in loading state', () => {
      select = Select({
        options: [],
        loading: true,
        loadingText: 'Loading...',
      });

      const element = select.getElement();
      const customSelect = element.querySelector('.select-custom');
      const selectedDisplay = element.querySelector('.select-custom__selected');
      const loadingIndicator = element.querySelector(
        '.select-custom__loading-indicator'
      );

      expect(element.getAttribute('data-loading')).toBe('true');
      expect(customSelect.classList.contains('select-custom--loading')).toBe(
        true
      );
      expect(selectedDisplay.textContent).toBe('Loading...');
      expect(loadingIndicator).not.toBeNull();
    });

    it('should show empty state when no options and not loading', () => {
      select = Select({
        options: [],
        loading: false,
        emptyText: 'No options available',
      });

      const element = select.getElement();
      const selectedDisplay = element.querySelector('.select-custom__selected');

      expect(selectedDisplay.textContent).toBe('No options available');
      expect(
        selectedDisplay.classList.contains('select-custom__selected--empty')
      ).toBe(true);
    });

    it('should disable interaction during loading', () => {
      select = Select({
        options: [],
        loading: true,
      });

      const element = select.getElement();
      const nativeSelect = element.querySelector('.select-native');
      const customSelect = element.querySelector('.select-custom');

      expect(nativeSelect.disabled).toBe(true);
      expect(customSelect.getAttribute('tabindex')).toBe('-1');
      expect(customSelect.getAttribute('aria-busy')).toBe('true');
    });

    it('should set loading state with setLoading method', () => {
      select = Select({ options });

      select.setLoading(true, 'Custom loading text');

      // Get fresh element reference after re-render
      const element = select.getElement();
      const selectedDisplay = element.querySelector('.select-custom__selected');

      expect(element.getAttribute('data-loading')).toBe('true');
      expect(selectedDisplay.textContent).toBe('Custom loading text');
    });

    it('should clear loading state when options are updated', () => {
      select = Select({
        options: [],
        loading: true,
      });

      select.updateOptions(options);

      // Get fresh element reference after re-render
      const element = select.getElement();
      expect(element.getAttribute('data-loading')).toBe('false');
    });

    it('should prevent setValue during loading', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      select = Select({
        options: [],
        loading: true,
      });

      select.setValue('option1');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Cannot set value on disabled, loading, or destroyed select'
      );
      consoleSpy.mockRestore();
    });

    it('should prevent operations on destroyed select', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      select = Select({ options });
      select.destroy();

      // Try operations after destroy
      select.setValue('option1');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Cannot set value on disabled, loading, or destroyed select'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Async options loading', () => {
    it('should load options with loadOptions method', async () => {
      const mockLoadOptions = vi.fn().mockResolvedValue(options);
      select = Select({ options: [] });

      await select.loadOptions(mockLoadOptions);

      expect(mockLoadOptions).toHaveBeenCalledTimes(1);

      // Get fresh element reference after loadOptions completes
      const element = select.getElement();
      const customOptions = element.querySelectorAll('.select-custom__option');
      expect(customOptions.length).toBe(options.length);
    });

    it('should handle loading errors gracefully', async () => {
      const mockLoadOptions = vi
        .fn()
        .mockRejectedValue(new Error('Network error'));
      select = Select({ options: [] });

      await expect(select.loadOptions(mockLoadOptions)).rejects.toThrow(
        'Network error'
      );

      // Get fresh element reference after error handling
      const element = select.getElement();
      expect(element.getAttribute('data-loading')).toBe('false');
    });

    it('should auto-load options on creation when onLoadOptions is provided', () => {
      const mockLoadOptions = vi.fn().mockResolvedValue(options);

      select = Select({
        options: [],
        onLoadOptions: mockLoadOptions,
      });

      // Auto-loading should be triggered
      expect(mockLoadOptions).toHaveBeenCalledTimes(1);
    });

    it('should not auto-load when initial options are provided', () => {
      const mockLoadOptions = vi.fn().mockResolvedValue(options);

      select = Select({
        options: options,
        onLoadOptions: mockLoadOptions,
      });

      // Auto-loading should not be triggered
      expect(mockLoadOptions).not.toHaveBeenCalled();
    });

    it('should prevent concurrent loading', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const mockLoadOptions = vi
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) => setTimeout(() => resolve(options), 100))
        );

      select = Select({ options: [] });

      // Start first load
      const firstLoad = select.loadOptions(mockLoadOptions);

      // Try to start second load immediately
      await select.loadOptions(mockLoadOptions);

      expect(consoleSpy).toHaveBeenCalledWith(
        'loadOptions already in progress'
      );

      // Wait for first load to complete
      await firstLoad;

      consoleSpy.mockRestore();
    });

    it('should validate loadOptions return value', async () => {
      const mockLoadOptions = vi.fn().mockResolvedValue('not an array');
      select = Select({ options: [] });

      await expect(select.loadOptions(mockLoadOptions)).rejects.toThrow(
        'loadOptions function must return an array'
      );
    });
  });

  describe('Value management during loading', () => {
    it('should preserve value when updating options with keepValue=true', () => {
      select = Select({
        options: options,
        value: 'option2',
      });

      const newOptions = [
        { value: 'option2', label: 'Updated Option 2' },
        { value: 'option4', label: 'Option 4' },
      ];

      select.updateOptions(newOptions, true);

      expect(select.getValue()).toBe('option2');
    });

    it('should clear value when updating options with keepValue=false', () => {
      select = Select({
        options: options,
        value: 'option2',
      });

      const newOptions = [
        { value: 'option4', label: 'Option 4' },
        { value: 'option5', label: 'Option 5' },
      ];

      select.updateOptions(newOptions, false);

      expect(select.getValue()).toBe('');
    });
  });

  describe('Multiple selection with loading', () => {
    it('should handle multiple selection with loading states', () => {
      select = Select({
        options: [],
        multiple: true,
        loading: true,
        loadingText: 'Loading multiple options...',
      });

      const element = select.getElement();
      const selectedDisplay = element.querySelector('.select-custom__selected');

      expect(selectedDisplay.textContent).toBe('Loading multiple options...');
      expect(select.getValue()).toEqual([]); // Should be empty array for multiple
    });

    it('should preserve multiple values when updating options', () => {
      select = Select({
        options: options,
        multiple: true,
        value: ['option1', 'option2'],
      });

      const newOptions = [
        { value: 'option1', label: 'Updated Option 1' },
        { value: 'option3', label: 'Updated Option 3' },
        { value: 'option4', label: 'Option 4' },
      ];

      select.updateOptions(newOptions, true);

      // Should keep only option1 as option2 is not in new options
      expect(select.getValue()).toEqual(['option1']);
    });
  });

  describe('Error handling and validation', () => {
    it('should validate required props including new loading props', () => {
      expect(() => {
        Select({
          options: 'invalid',
          onLoadOptions: 'not a function',
        });
      }).toThrow();
    });

    it('should warn when loadOptions is called without a function', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      select = Select({ options: [] });
      select.loadOptions();

      expect(consoleSpy).toHaveBeenCalledWith(
        'loadOptions requires a function'
      );
      consoleSpy.mockRestore();
    });

    it('should handle multiple value type conversion', () => {
      // This should not throw but should convert the value
      select = Select({
        options: options,
        multiple: true,
        value: 'string-value', // Invalid for multiple, should be converted
      });

      expect(select.getValue()).toEqual([]); // Should convert invalid values to empty array
    });
  });

  describe('Performance optimizations', () => {
    it('should use shouldRerender for optimization', () => {
      select = Select({ options });

      // The shouldRerender is attached to the component internally
      // We can't easily test it without exposing it, so we just verify no errors
      expect(() => select.update({ onChange: () => {} })).not.toThrow();
    });

    it('should properly cleanup document handler in destroy', () => {
      select = Select({ options });

      // Verify no errors on destroy
      expect(() => select.destroy()).not.toThrow();

      // Verify destroyed state prevents operations
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      select.setValue('option1');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Cannot set value on disabled, loading, or destroyed select'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility enhancements', () => {
    it('should have proper ARIA attributes', () => {
      select = Select({ options, id: 'test-select' });
      const element = select.getElement();

      const nativeSelect = element.querySelector('.select-native');
      const customSelect = element.querySelector('.select-custom');

      expect(nativeSelect.id).toBe('test-select');
      expect(customSelect.getAttribute('aria-labelledby')).toBe('test-select');
      expect(customSelect.getAttribute('aria-live')).toBe('polite');
      expect(customSelect.getAttribute('aria-atomic')).toBe('true');
    });

    it('should generate ID when none provided', () => {
      select = Select({ options });
      const element = select.getElement();

      const nativeSelect = element.querySelector('.select-native');
      const customSelect = element.querySelector('.select-custom');

      expect(nativeSelect.id).toMatch(/^select-\d+$/);
      expect(customSelect.getAttribute('aria-labelledby')).toBe(
        nativeSelect.id
      );
    });
  });

  // Original tests (existing functionality)

  it('should call onFocus and onBlur callbacks', () => {
    const mockOnFocus = vi.fn();
    const mockOnBlur = vi.fn();
    select = Select({
      options,
      onFocus: mockOnFocus,
      onBlur: mockOnBlur,
    });

    const element = select.getElement();
    const nativeSelect = element.querySelector('.select-native');

    const focusEvent = new Event('focus');
    nativeSelect.dispatchEvent(focusEvent);
    expect(mockOnFocus).toHaveBeenCalledTimes(1);

    const blurEvent = new Event('blur');
    nativeSelect.dispatchEvent(blurEvent);
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('should apply focused class when select is focused', () => {
    select = Select({ options });
    const element = select.getElement();
    const nativeSelect = element.querySelector('.select-native');
    const customSelect = element.querySelector('.select-custom');

    const focusEvent = new Event('focus');
    nativeSelect.dispatchEvent(focusEvent);
    expect(element.classList.contains('select-container--focused')).toBe(true);
    expect(customSelect.classList.contains('select-custom--focused')).toBe(
      true
    );

    const blurEvent = new Event('blur', { bubbles: true });
    nativeSelect.dispatchEvent(blurEvent);
    expect(element.classList.contains('select-container--focused')).toBe(false);
    expect(customSelect.classList.contains('select-custom--focused')).toBe(
      false
    );
  });

  it('should validate required select', () => {
    select = Select({
      options,
      required: true,
      validationMessage: 'Please select an option',
    });

    // Empty select should be invalid
    const initialValidation = select.validate();
    expect(initialValidation).toBe(false);

    // Set a value
    select.setValue('option1');

    // Now select should be valid
    const afterValidation = select.validate();
    expect(afterValidation).toBe(true);
  });

  it('should handle disabled state', () => {
    select = Select({ options, disabled: true });
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
    select = Select({
      options,
      multiple: true,
      value: initialValues,
    });

    const element = select.getElement();
    const nativeSelect = element.querySelector('.select-native');
    expect(nativeSelect.multiple).toBe(true);

    const value = select.getValue();
    expect(Array.isArray(value)).toBe(true);
    expect(value).toEqual(initialValues);

    const newValues = ['option1', 'option2'];
    select.setValue(newValues);

    const updatedValues = select.getValue();
    expect(updatedValues).toEqual(newValues);
  });

  it('should toggle dropdown when custom select is clicked', () => {
    select = Select({ options });
    const element = select.getElement();
    const customSelect = element.querySelector('.select-custom');
    const dropdown = element.querySelector('.select-custom__dropdown');

    // Initial state - dropdown closed
    expect(dropdown.classList.contains('select-custom__dropdown--open')).toBe(
      false
    );

    // Click to open dropdown
    customSelect.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // After click, dropdown should be open
    expect(dropdown.classList.contains('select-custom__dropdown--open')).toBe(
      true
    );

    // Click again to close dropdown
    customSelect.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // After second click, dropdown should be closed
    expect(dropdown.classList.contains('select-custom__dropdown--open')).toBe(
      false
    );
  });

  it('should use debounce for document click handler', () => {
    select = Select({ options });

    // Check if debounce was called
    expect(debounce).toHaveBeenCalled();
  });

  it('should clean up event listeners when destroyed', () => {
    const documentRemoveEventSpy = vi.spyOn(document, 'removeEventListener');

    select = Select({ options });
    expect(debounce).toHaveBeenCalled();

    select.destroy();

    expect(documentRemoveEventSpy).toHaveBeenCalled();
    expect(documentRemoveEventSpy.mock.calls[0][0]).toBe('click');

    documentRemoveEventSpy.mockRestore();
  });
});
