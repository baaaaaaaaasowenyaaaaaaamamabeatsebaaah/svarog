// src/components/UsedPhonePriceForm/UsedPhonePriceForm.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsedPhonePriceForm from './UsedPhonePriceForm.js';
import {
  mockPhoneBuybackData,
  setupPhoneBuybackMocks,
} from '../../mocks/phoneBuybackData.js';

describe('UsedPhonePriceForm component', () => {
  beforeEach(() => {
    // Set up mock data for each test
    setupPhoneBuybackMocks();
  });

  it('should create a phone price form element', () => {
    const form = new UsedPhonePriceForm({
      useMockData: true,
    });

    const element = form.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('used-phone-form');

    // Check for select elements
    const manufacturerSelect = element.querySelector('#manufacturer');
    const deviceSelect = element.querySelector('#device');

    expect(manufacturerSelect).not.toBeNull();
    expect(deviceSelect).not.toBeNull();
  });

  it('should initialize with a placeholder price text', () => {
    const form = new UsedPhonePriceForm({
      useMockData: true,
    });

    const element = form.getElement();
    const priceElement = element.querySelector('.used-phone-form__price-value');

    expect(priceElement).not.toBeNull();
    expect(priceElement.textContent).toContain('Please select');
  });

  it('should load manufacturers on initialization', () => {
    const form = new UsedPhonePriceForm({
      useMockData: true,
    });

    // Check if manufacturers are loaded in the select
    const manufacturerSelect = form.manufacturerSelect
      .getElement()
      .querySelector('select');
    expect(manufacturerSelect.options.length).toBeGreaterThan(1); // Include placeholder

    // Check the first manufacturer option after placeholder
    expect(manufacturerSelect.options[1].textContent).toBe('Apple');
  });

  it('should enable device select when manufacturer is selected', async () => {
    const form = new UsedPhonePriceForm({
      useMockData: true,
    });

    const manufacturerSelect = form.manufacturerSelect
      .getElement()
      .querySelector('select');
    const deviceSelect = form.deviceSelect.getElement().querySelector('select');

    // Initially device select should be disabled
    expect(deviceSelect.disabled).toBe(true);

    // Select a manufacturer
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));

    // Wait for async operations
    await vi.runAllTimersAsync();

    // Device select should now be enabled and populated
    expect(deviceSelect.disabled).toBe(false);
    expect(deviceSelect.options.length).toBeGreaterThan(1);
  });

  it('should render condition cards when device is selected', async () => {
    const form = new UsedPhonePriceForm({
      useMockData: true,
    });

    // Set up manufacturer first
    const manufacturerSelect = form.manufacturerSelect
      .getElement()
      .querySelector('select');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Then select a device
    const deviceSelect = form.deviceSelect.getElement().querySelector('select');
    deviceSelect.value = '1'; // iPhone 15 Pro Max
    deviceSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Condition cards should now be rendered
    const conditionCards = form
      .getElement()
      .querySelectorAll('.condition-card');
    expect(conditionCards.length).toBeGreaterThan(0);
  });

  it('should display price when condition is selected', async () => {
    const mockOnPriceCalculated = vi.fn();
    const form = new UsedPhonePriceForm({
      useMockData: true,
      onPriceCalculated: mockOnPriceCalculated,
    });

    // Set up selection chain
    const manufacturerSelect = form.manufacturerSelect
      .getElement()
      .querySelector('select');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    const deviceSelect = form.deviceSelect.getElement().querySelector('select');
    deviceSelect.value = '1'; // iPhone 15 Pro Max
    deviceSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Now find and click a condition card
    const conditionCards = form
      .getElement()
      .querySelectorAll('.condition-card');
    const goodConditionCard = Array.from(conditionCards).find(
      (card) => card.getAttribute('data-condition-id') === '2'
    ); // Good condition

    if (goodConditionCard) {
      goodConditionCard.click();
    }

    await vi.runAllTimersAsync();

    // Price should now be displayed
    const priceElement = form
      .getElement()
      .querySelector('.used-phone-form__price-value');
    expect(priceElement.textContent).not.toContain('Please select');
    expect(priceElement.textContent).toContain('850');

    // Callback should be called with price data
    expect(mockOnPriceCalculated).toHaveBeenCalledTimes(1);
    expect(mockOnPriceCalculated).toHaveBeenCalledWith(
      expect.objectContaining({
        price: 850,
        deviceName: 'iPhone 15 Pro Max',
        conditionName: 'Good',
      })
    );

    // Submit button should be enabled
    const submitButton = form.submitButton.getElement();
    expect(submitButton.disabled).toBe(false);
  });

  it('should format price correctly', () => {
    const form = new UsedPhonePriceForm({
      useMockData: true,
    });

    // Test different price formats
    expect(form.formatPrice(100)).toContain('100');
    expect(form.formatPrice(1000)).toContain('1.000'); // Using German locale
    expect(form.formatPrice(42.5)).toContain('42,5'); // Using German locale

    // Test null/undefined handling
    expect(form.formatPrice(null)).toBe('Price not available');
    expect(form.formatPrice(undefined)).toBe('Price not available');
  });

  it('should call onSubmit when submitted with valid data', async () => {
    const mockOnSubmit = vi.fn();
    const form = new UsedPhonePriceForm({
      useMockData: true,
      onSubmit: mockOnSubmit,
    });

    // Set up selection chain
    const manufacturerSelect = form.manufacturerSelect
      .getElement()
      .querySelector('select');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    const deviceSelect = form.deviceSelect.getElement().querySelector('select');
    deviceSelect.value = '1'; // iPhone 15 Pro Max
    deviceSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Find and click a condition card
    const conditionCards = form
      .getElement()
      .querySelectorAll('.condition-card');
    const goodConditionCard = Array.from(conditionCards).find(
      (card) => card.getAttribute('data-condition-id') === '2'
    ); // Good condition

    if (goodConditionCard) {
      goodConditionCard.click();
    }

    await vi.runAllTimersAsync();

    // Now submit the form
    const formElement = form.getElement();
    formElement.dispatchEvent(new Event('submit'));

    // onSubmit should have been called with correct data
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        manufacturerId: '1',
        deviceId: '1',
        conditionId: '2',
        price: 850,
        manufacturerName: 'Apple',
        deviceName: 'iPhone 15 Pro Max',
        conditionName: 'Good',
      })
    );
  });

  it('should handle error states', async () => {
    // Mock fetch to simulate an error
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('manufacturers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPhoneBuybackData.manufacturers),
        });
      }

      // Simulate error for other requests
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      });
    });

    const form = new UsedPhonePriceForm({
      useMockData: false, // Use the mocked fetch
    });

    // Select a manufacturer to trigger a device fetch (which will fail)
    const manufacturerSelect = form.manufacturerSelect
      .getElement()
      .querySelector('select');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Check if error state is reflected in UI
    const formElement = form.getElement();
    expect(formElement.classList.contains('used-phone-form--error')).toBe(true);
  });
});
