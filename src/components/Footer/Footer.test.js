// src/components/Footer/Footer.test.js
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer.js';

describe('Footer component', () => {
  it('should create a footer element', () => {
    const footer = new Footer({});
    
    const element = footer.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('footer');
  });
  
  // Add more tests here
});
