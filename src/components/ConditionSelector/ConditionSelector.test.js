// src/components/ConditionSelector/ConditionSelector.test.js
import { describe, it, expect, vi } from 'vitest';
import ConditionSelector from './ConditionSelector.js';

describe('ConditionSelector component', () => {
  it('should create a conditionSelector element', () => {
    const conditionSelector = new ConditionSelector({});
    
    const element = conditionSelector.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('conditionSelector');
  });
  
  // Add more tests here
});