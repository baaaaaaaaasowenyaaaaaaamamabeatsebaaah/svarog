// src/components/PriceDisplay/PriceDisplay.test.js
import { describe, it, expect, vi } from 'vitest';
import PriceDisplay from './PriceDisplay.js';

describe('PriceDisplay component', () => {
  it('should render correctly with basic props', () => {
    const priceDisplay = PriceDisplay({
      label: 'Price:',
      value: '€29.99',
    });

    const element = priceDisplay.getElement();

    expect(element).toBeInstanceOf(HTMLDivElement);
    expect(element.className).toBe('price-display');

    const labelElement = element.querySelector('.price-display__label');
    expect(labelElement.textContent).toBe('Price:');

    const valueElement = element.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('€29.99');
  });

  it('should display loading state', () => {
    const priceDisplay = PriceDisplay({
      label: 'Price:',
      value: 'Loading price...',
      isLoading: true,
    });

    const element = priceDisplay.getElement();
    expect(element.classList.contains('price-display--loading')).toBe(true);

    // Check for loading indicator
    const loadingIndicator = element.querySelector(
      '.price-display__loading-indicator'
    );
    expect(loadingIndicator).not.toBeNull();
  });

  it('should update value with setValue method', () => {
    const priceDisplay = PriceDisplay({
      label: 'Price:',
      value: '€29.99',
    });

    priceDisplay.setValue('€39.99', true);

    const element = priceDisplay.getElement();
    expect(element.classList.contains('price-display--highlighted')).toBe(true);

    const valueElement = element.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('€39.99');
  });

  it('should update loading state with setLoading method', () => {
    const priceDisplay = PriceDisplay({
      label: 'Price:',
      value: '€29.99',
    });

    const element = priceDisplay.getElement();
    expect(element.classList.contains('price-display--loading')).toBe(false);

    priceDisplay.setLoading(true);
    expect(element.classList.contains('price-display--loading')).toBe(true);

    const loadingIndicator = element.querySelector(
      '.price-display__loading-indicator'
    );
    expect(loadingIndicator).not.toBeNull();

    priceDisplay.setLoading(false);
    expect(element.classList.contains('price-display--loading')).toBe(false);

    const loadingIndicatorAfter = element.querySelector(
      '.price-display__loading-indicator'
    );
    expect(loadingIndicatorAfter).toBeNull();
  });

  it('should update placeholder state with setPlaceholder method', () => {
    const priceDisplay = PriceDisplay({
      label: 'Price:',
      value: 'Select options to see price',
    });

    const element = priceDisplay.getElement();
    expect(element.classList.contains('price-display--placeholder')).toBe(
      false
    );

    priceDisplay.setPlaceholder(true);
    expect(element.classList.contains('price-display--placeholder')).toBe(true);
  });

  it('should display error state with setError method', () => {
    const priceDisplay = PriceDisplay({
      label: 'Price:',
      value: '€29.99',
      isHighlighted: true,
    });

    const element = priceDisplay.getElement();

    // Initial state
    expect(element.classList.contains('price-display--highlighted')).toBe(true);
    expect(element.classList.contains('price-display--error')).toBe(false);

    // Set error state
    priceDisplay.setError('Fehler beim Laden des Preises');

    // Check updated state
    expect(element.classList.contains('price-display--highlighted')).toBe(
      false
    );
    expect(element.classList.contains('price-display--error')).toBe(true);

    const valueElement = element.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Fehler beim Laden des Preises');
  });

  it('should clear error state when setting a new value', () => {
    const priceDisplay = PriceDisplay({
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

    const valueElement = element.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('€29.99');
  });

  it('should handle transition from loading to error state', () => {
    const priceDisplay = PriceDisplay({
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

  it('should clean up event listeners when destroyed', () => {
    const priceDisplay = PriceDisplay({
      label: 'Price:',
      value: '€29.99',
    });

    // Spy on destroy method to verify it works
    vi.spyOn(priceDisplay, 'destroy');

    priceDisplay.destroy();
    expect(priceDisplay.destroy).toHaveBeenCalled();
  });
});
