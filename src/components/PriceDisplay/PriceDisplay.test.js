// src/components/PriceDisplay/PriceDisplay.test.js
import { describe, it, expect, vi } from 'vitest';
import PriceDisplay from './PriceDisplay.js';

describe('PriceDisplay component', () => {
  it('should create a price display element', () => {
    const priceDisplay = new PriceDisplay({
      label: 'Price:',
      value: '€29.99',
    });

    const element = priceDisplay.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('price-display');

    // Check label
    const labelElement = element.querySelector('.price-display__label');
    expect(labelElement).not.toBeNull();
    expect(labelElement.textContent).toBe('Price:');

    // Check value
    const valueElement = element.querySelector('.price-display__value');
    expect(valueElement).not.toBeNull();
    expect(valueElement.textContent).toBe('€29.99');
  });

  it('should throw error when label is not provided', () => {
    expect(() => {
      new PriceDisplay({
        value: '€29.99',
      });
    }).toThrow('PriceDisplay: label is required');
  });

  it('should display loading state', () => {
    const priceDisplay = new PriceDisplay({
      label: 'Price:',
      value: 'Loading...',
      isLoading: true,
    });

    const element = priceDisplay.getElement();
    expect(element.className).toContain('price-display--loading');

    // Check for loading indicator
    const loadingIndicator = element.querySelector(
      '.price-display__loading-indicator'
    );
    expect(loadingIndicator).not.toBeNull();
  });

  it('should display highlighted state', () => {
    const priceDisplay = new PriceDisplay({
      label: 'Price:',
      value: '€29.99',
      isHighlighted: true,
    });

    const element = priceDisplay.getElement();
    expect(element.className).toContain('price-display--highlighted');
  });

  it('should update value with setValue method', () => {
    const priceDisplay = new PriceDisplay({
      label: 'Price:',
      value: 'Select options',
    });

    const element = priceDisplay.getElement();
    const valueElement = element.querySelector('.price-display__value');

    // Initial value
    expect(valueElement.textContent).toBe('Select options');

    // Update value
    priceDisplay.setValue('€49.99');
    expect(valueElement.textContent).toBe('€49.99');

    // Update with highlighting
    priceDisplay.setValue('€39.99', true);
    expect(valueElement.textContent).toBe('€39.99');
    expect(element.classList.contains('price-display--highlighted')).toBe(true);
  });

  it('should update loading state with setLoading method', () => {
    const priceDisplay = new PriceDisplay({
      label: 'Price:',
      value: 'Select options',
    });

    const element = priceDisplay.getElement();

    // Initially not loading
    expect(element.classList.contains('price-display--loading')).toBe(false);

    // Set to loading
    priceDisplay.setLoading(true);
    expect(element.classList.contains('price-display--loading')).toBe(true);

    // Check for loading indicator
    const loadingIndicator = element.querySelector(
      '.price-display__loading-indicator'
    );
    expect(loadingIndicator).not.toBeNull();

    // Set back to not loading
    priceDisplay.setLoading(false);
    expect(element.classList.contains('price-display--loading')).toBe(false);

    // Loading indicator should be removed
    const loadingIndicatorAfter = element.querySelector(
      '.price-display__loading-indicator'
    );
    expect(loadingIndicatorAfter).toBeNull();
  });

  it('should apply custom class names', () => {
    const priceDisplay = new PriceDisplay({
      label: 'Price:',
      value: '€29.99',
      className: 'custom-price',
    });

    const element = priceDisplay.getElement();
    expect(element.className).toContain('custom-price');
  });

  it('should chain methods for fluent API', () => {
    const priceDisplay = new PriceDisplay({
      label: 'Price:',
      value: 'Select options',
    });

    // Method chaining should work
    const result = priceDisplay.setValue('€29.99').setLoading(false);

    expect(result).toBe(priceDisplay);
  });
});
