// src/components/Badge/Badge.test.js
import { describe, it, expect, vi } from 'vitest';
import Badge from './Badge.js';

describe('Badge component', () => {
  it('should create a badge element', () => {
    const badge = new Badge({});
    
    const element = badge.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('badge');
  });
  
  // Add more tests here
});
