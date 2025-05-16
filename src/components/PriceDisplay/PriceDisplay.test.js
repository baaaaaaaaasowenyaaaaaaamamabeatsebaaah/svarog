// src/components/PriceDisplay/PriceDisplay.test.js
import { describe, it, expect } from 'vitest';
import PriceDisplay from './PriceDisplay.js';

describe('PriceDisplay component', () => {
  // Existing tests...

  // Add these new tests for error state
  it('should display error state', () => {
    const priceDisplay = new PriceDisplay({
      label: 'Price:',
      value: 'Error loading price',
      isError: true,
    });

    const element = priceDisplay.getElement();
    expect(element.className).toContain('price-display--error');

    // Check value
    const valueElement = element.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Error loading price');
  });

  it('should update to error state with setError method', () => {
    const priceDisplay = new PriceDisplay({
      label: 'Price:',
      value: '€29.99',
      isHighlighted: true,
    });

    const element = priceDisplay.getElement();
    const valueElement = element.querySelector('.price-display__value');

    // Initial state
    expect(element.classList.contains('price-display--highlighted')).toBe(true);
    expect(element.classList.contains('price-display--error')).toBe(false);
    expect(valueElement.textContent).toBe('€29.99');

    // Set error state
    priceDisplay.setError('Fehler beim Laden des Preises');

    // Check updated state
    expect(element.classList.contains('price-display--highlighted')).toBe(
      false
    );
    expect(element.classList.contains('price-display--error')).toBe(true);
    expect(valueElement.textContent).toBe('Fehler beim Laden des Preises');
  });

  it('should clear error state when setting a new value', () => {
    const priceDisplay = new PriceDisplay({
      label: 'Price:',
      value: 'Error message',
      isError: true,
    });

    const element = priceDisplay.getElement();

    // Initial error state
    expect(element.classList.contains('price-display--error')).toBe(true);

    // Set a new value
    priceDisplay.setValue('€29.99');

    // Error state should be cleared
    expect(element.classList.contains('price-display--error')).toBe(false);

    // Value should be updated
    const valueElement = element.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('€29.99');
  });

  it('should handle transition from loading to error state', () => {
    const priceDisplay = new PriceDisplay({
      label: 'Price:',
      value: 'Loading...',
      isLoading: true,
    });

    const element = priceDisplay.getElement();

    // Initial loading state
    expect(element.classList.contains('price-display--loading')).toBe(true);

    // Set error state
    priceDisplay.setError('Error loading price');

    // Loading state should be cleared, error state should be active
    expect(element.classList.contains('price-display--loading')).toBe(false);
    expect(element.classList.contains('price-display--error')).toBe(true);

    // Loading indicator should be removed
    const loadingIndicator = element.querySelector(
      '.price-display__loading-indicator'
    );
    expect(loadingIndicator).toBeNull();
  });
});
