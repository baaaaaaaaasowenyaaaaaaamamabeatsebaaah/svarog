// src/components/List/List.test.js
import { describe, it, expect, vi } from 'vitest';
import List from './List.js';

describe('List component', () => {
  it('should create a list element', () => {
    const list = new List({});
    
    const element = list.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('list');
  });
  
  // Add more tests here
});
