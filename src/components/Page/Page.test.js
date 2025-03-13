// src/components/Page/Page.test.js
import { describe, it, expect, vi } from 'vitest';
import Page from './Page.js';

describe('Page component', () => {
  it('should create a page element', () => {
    const page = new Page({});
    
    const element = page.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('page');
  });
  
  // Add more tests here
});
