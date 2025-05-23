// src/components/ConditionSelector/ConditionSelector.test.js
import { describe, it, expect, vi } from 'vitest';
import ConditionSelector from './ConditionSelector.js';

describe('ConditionSelector component', () => {
  it('should create a condition-selector element', () => {
    const conditionSelector = ConditionSelector({});

    const element = conditionSelector.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('condition-selector');
  });

  it('should render condition options when provided', () => {
    const conditions = [
      { id: 1, name: 'New', description: 'Brand new, unused item' },
      { id: 2, name: 'Good', description: 'Used but in good condition' },
      { id: 3, name: 'Fair', description: 'Shows signs of wear' },
    ];

    const conditionSelector = ConditionSelector({ conditions });
    const element = conditionSelector.getElement();

    const options = element.querySelectorAll('.condition-option');
    expect(options.length).toBe(3);
  });

  it('should mark selected condition', () => {
    const conditions = [
      { id: 1, name: 'New', description: 'Brand new, unused item' },
      { id: 2, name: 'Good', description: 'Used but in good condition' },
    ];

    const conditionSelector = ConditionSelector({
      conditions,
      selectedId: '1',
    });
    const element = conditionSelector.getElement();

    const selectedOption = element.querySelector('.condition-option--selected');
    expect(selectedOption).toBeTruthy();
    expect(selectedOption.getAttribute('data-condition-id')).toBe('1');
  });

  it('should call onChange callback when condition is selected', () => {
    const onChange = vi.fn();
    const conditions = [
      { id: 1, name: 'New', description: 'Brand new, unused item' },
      { id: 2, name: 'Good', description: 'Used but in good condition' },
    ];

    const conditionSelector = ConditionSelector({
      conditions,
      onChange,
    });
    const element = conditionSelector.getElement();

    // Click on the second condition
    const optionLabel = element.querySelectorAll('.condition-option__label')[1];
    optionLabel.click();

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('should still work with legacy onSelect prop for backward compatibility', () => {
    const onSelect = vi.fn();
    const conditions = [
      { id: 1, name: 'New', description: 'Brand new, unused item' },
      { id: 2, name: 'Good', description: 'Used but in good condition' },
    ];

    const conditionSelector = ConditionSelector({
      conditions,
      onSelect,
    });
    const element = conditionSelector.getElement();

    // Click on the second condition
    const optionLabel = element.querySelectorAll('.condition-option__label')[1];
    optionLabel.click();

    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('should toggle loading state', () => {
    // Create component with initially not loading
    const conditionSelector = ConditionSelector({
      loading: false,
    });

    // Verify initial state
    let element = conditionSelector.getElement();
    expect(element.classList.contains('condition-selector--loading')).toBe(
      false
    );

    // Set to loading state
    conditionSelector.setLoading(true);

    // Force re-render by getting a fresh element
    element = conditionSelector.getElement();

    // Verify loading state was applied
    expect(element.classList.contains('condition-selector--loading')).toBe(
      true
    );
    expect(element.getAttribute('aria-busy')).toBe('true');

    // Set back to not loading
    conditionSelector.setLoading(false);

    // Force re-render again
    element = conditionSelector.getElement();

    // Verify loading state was removed
    expect(element.classList.contains('condition-selector--loading')).toBe(
      false
    );
    expect(element.getAttribute('aria-busy')).toBe('false');
  });

  it('should still work with legacy isLoading prop for backward compatibility', () => {
    const conditionSelector = ConditionSelector({
      isLoading: true,
    });

    const element = conditionSelector.getElement();
    expect(element.classList.contains('condition-selector--loading')).toBe(
      true
    );
    expect(element.getAttribute('aria-busy')).toBe('true');
  });

  it('should update conditions', () => {
    const initialConditions = [
      { id: 1, name: 'New', description: 'Brand new' },
    ];
    const updatedConditions = [
      { id: 2, name: 'Good', description: 'Good condition' },
      { id: 3, name: 'Fair', description: 'Fair condition' },
    ];

    const conditionSelector = ConditionSelector({
      conditions: initialConditions,
    });

    // Initially should have 1 option
    let element = conditionSelector.getElement();
    expect(element.querySelectorAll('.condition-option').length).toBe(1);

    // Update conditions
    conditionSelector.updateConditions(updatedConditions);

    // Get the updated element after conditions change
    element = conditionSelector.getElement();

    // Should now have 2 options
    expect(element.querySelectorAll('.condition-option').length).toBe(2);
  });

  it('should set selected condition', () => {
    const conditions = [
      { id: 1, name: 'New', description: 'Brand new' },
      { id: 2, name: 'Good', description: 'Good condition' },
    ];

    const conditionSelector = ConditionSelector({
      conditions,
      selectedId: '1',
    });

    // Initially condition 1 is selected
    let element = conditionSelector.getElement();
    expect(
      element
        .querySelector('.condition-option--selected')
        .getAttribute('data-condition-id')
    ).toBe('1');

    // Change selection to condition 2
    conditionSelector.setSelectedCondition(2);

    // Get a fresh element reference after update
    element = conditionSelector.getElement();

    // Now condition 2 should be selected
    expect(
      element
        .querySelector('.condition-option--selected')
        .getAttribute('data-condition-id')
    ).toBe('2');
  });

  it('should apply custom className', () => {
    const conditionSelector = ConditionSelector({
      className: 'custom-class',
    });
    const element = conditionSelector.getElement();

    expect(element.classList.contains('condition-selector')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
  });

  it('should render appropriate icons based on condition name', () => {
    const conditions = [
      { id: 1, name: 'New', description: 'Brand new' },
      { id: 2, name: 'Good', description: 'Good condition' },
      { id: 3, name: 'Fair', description: 'Fair condition' },
      { id: 4, name: 'Poor', description: 'Poor condition' },
      { id: 5, name: 'Unknown', description: 'Unknown condition' },
    ];

    const conditionSelector = ConditionSelector({ conditions });
    const element = conditionSelector.getElement();

    const icons = element.querySelectorAll('.condition-option__icon');

    expect(icons[0].textContent).toBe('✨'); // New
    expect(icons[1].textContent).toBe('👍'); // Good
    expect(icons[2].textContent).toBe('👌'); // Fair
    expect(icons[3].textContent).toBe('🔧'); // Poor
    expect(icons[4].textContent).toBe('📱'); // Unknown/default
  });

  it('should handle empty conditions array', () => {
    const conditionSelector = ConditionSelector({
      conditions: [],
    });
    const element = conditionSelector.getElement();

    expect(element.querySelector('.condition-options')).toBeFalsy();
    expect(element.querySelectorAll('.condition-option').length).toBe(0);
  });

  it('should not call onChange when in loading state', () => {
    const onChange = vi.fn();
    const conditions = [{ id: 1, name: 'New', description: 'Brand new' }];

    const conditionSelector = ConditionSelector({
      conditions,
      onChange,
      loading: true,
    });
    const element = conditionSelector.getElement();

    // Try to click on a condition
    const optionLabel = element.querySelector('.condition-option__label');
    optionLabel.click();

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should clean up event listeners when destroyed', () => {
    const onChange = vi.fn();
    const conditions = [{ id: 1, name: 'New', description: 'Brand new' }];

    const conditionSelector = ConditionSelector({
      conditions,
      onChange,
    });

    // Get the element and find labels with click handlers
    const element = conditionSelector.getElement();
    const label = element.querySelector('.condition-option__label');

    // Mock the removeEventListener specifically for this label
    const originalRemoveEventListener = label.removeEventListener;
    label.removeEventListener = vi.fn();

    // Destroy the component
    conditionSelector.destroy();

    // Check if removeEventListener was called on the label
    expect(label.removeEventListener).toHaveBeenCalled();

    // Restore original method
    label.removeEventListener = originalRemoveEventListener;
  });
});
