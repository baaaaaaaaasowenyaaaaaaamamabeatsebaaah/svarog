// src/components/HeroSection/HeroSection.test.js
import { describe, it, expect, vi } from 'vitest';
import HeroSection from './HeroSection.js';

describe('HeroSection component', () => {
  it('should create a herosection element', () => {
    const herosection = new HeroSection({});

    const element = herosection.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('herosection');
  });

  // Add more tests here
});
