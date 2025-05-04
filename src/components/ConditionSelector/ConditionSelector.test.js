// src/components/ConditionSelector/ConditionSelector.test.js
import { describe, it, expect, vi } from 'vitest';
import ConditionSelector from './ConditionSelector.js';

describe('ConditionSelector component', () => {
  it('should create a condition-selector element', () => {
    const conditionSelector = new ConditionSelector({});

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

    const conditionSelector = new ConditionSelector({ conditions });
    const element = conditionSelector.getElement();

    const options = element.querySelectorAll('.condition-option');
    expect(options.length).toBe(3);
  });

  it('should mark selected condition', () => {
    const conditions = [
      { id: 1, name: 'New', description: 'Brand new, unused item' },
      { id: 2, name: 'Good', description: 'Used but in good condition' },
    ];

    const conditionSelector = new ConditionSelector({
      conditions,
      selectedId: '1',
    });
    const element = conditionSelector.getElement();

    const selectedOption = element.querySelector('.condition-option--selected');
    expect(selectedOption).toBeTruthy();
    expect(selectedOption.getAttribute('data-condition-id')).toBe('1');
  });

  it('should call onSelect callback when condition is selected', () => {
    const onSelect = vi.fn();
    const conditions = [
      { id: 1, name: 'New', description: 'Brand new, unused item' },
      { id: 2, name: 'Good', description: 'Used but in good condition' },
    ];

    const conditionSelector = new ConditionSelector({
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
    const conditionSelector = new ConditionSelector({});
    const element = conditionSelector.getElement();

    // Initial state
    expect(element.classList.contains('condition-selector--loading')).toBe(
      false
    );

    // Set loading
    conditionSelector.setLoading(true);
    expect(element.classList.contains('condition-selector--loading')).toBe(
      true
    );

    // Unset loading
    conditionSelector.setLoading(false);
    expect(element.classList.contains('condition-selector--loading')).toBe(
      false
    );
  });

  it('should update conditions', () => {
    const initialConditions = [
      { id: 1, name: 'New', description: 'Brand new' },
    ];
    const updatedConditions = [
      { id: 2, name: 'Good', description: 'Good condition' },
      { id: 3, name: 'Fair', description: 'Fair condition' },
    ];

    const conditionSelector = new ConditionSelector({
      conditions: initialConditions,
    });
    const element = conditionSelector.getElement();

    // Initially should have 1 option
    expect(element.querySelectorAll('.condition-option').length).toBe(1);

    // Update conditions
    conditionSelector.updateConditions(updatedConditions);
    const updatedElement = conditionSelector.getElement();

    // Should now have 2 options
    expect(updatedElement.querySelectorAll('.condition-option').length).toBe(2);
  });

  it('should set selected condition', () => {
    const conditions = [
      { id: 1, name: 'New', description: 'Brand new' },
      { id: 2, name: 'Good', description: 'Good condition' },
    ];

    const conditionSelector = new ConditionSelector({
      conditions,
      selectedId: '1',
    });
    const element = conditionSelector.getElement();

    // Initially condition 1 is selected
    expect(
      element
        .querySelector('.condition-option--selected')
        .getAttribute('data-condition-id')
    ).toBe('1');

    // Change selection to condition 2
    conditionSelector.setSelectedCondition(2);

    // Now condition 2 should be selected
    expect(
      element
        .querySelector('.condition-option--selected')
        .getAttribute('data-condition-id')
    ).toBe('2');
  });

  it('should apply custom className', () => {
    const conditionSelector = new ConditionSelector({
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

    const conditionSelector = new ConditionSelector({ conditions });
    const element = conditionSelector.getElement();

    const icons = element.querySelectorAll('.condition-option__icon');

    expect(icons[0].textContent).toBe('✨'); // New
    expect(icons[1].textContent).toBe('👍'); // Good
    expect(icons[2].textContent).toBe('👌'); // Fair
    expect(icons[3].textContent).toBe('🔧'); // Poor
    expect(icons[4].textContent).toBe('📱'); // Unknown/default
  });

  it('should handle empty conditions array', () => {
    const conditionSelector = new ConditionSelector({
      conditions: [],
    });
    const element = conditionSelector.getElement();

    expect(element.querySelector('.condition-options')).toBeFalsy();
    expect(element.querySelectorAll('.condition-option').length).toBe(0);
  });

  it('should not call onSelect when in loading state', () => {
    const onSelect = vi.fn();
    const conditions = [{ id: 1, name: 'New', description: 'Brand new' }];

    const conditionSelector = new ConditionSelector({
      conditions,
      onSelect,
      isLoading: true,
    });
    const element = conditionSelector.getElement();

    // Try to click on a condition
    const optionLabel = element.querySelector('.condition-option__label');
    optionLabel.click();

    expect(onSelect).not.toHaveBeenCalled();
  });
});
