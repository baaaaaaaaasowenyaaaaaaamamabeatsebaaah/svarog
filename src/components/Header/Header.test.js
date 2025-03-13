// src/components/Header/Header.test.js
import { describe, it, expect, vi } from 'vitest';
import Header from './Header.js';

describe('Header component', () => {
  it('should create a header element', () => {
    const header = new Header({});
    
    const element = header.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('header');
  });
  
  // Add more tests here
});
