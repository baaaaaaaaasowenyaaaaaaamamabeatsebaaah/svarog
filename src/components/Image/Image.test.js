// src/components/Image/Image.test.js
import { describe, it, expect, vi } from 'vitest';
import Image from './Image.js';

describe('Image component', () => {
  it('should create a image element', () => {
    const image = new Image({});
    
    const element = image.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('image');
  });
  
  // Add more tests here
});
