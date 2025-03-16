// src/components/PhoneRepairForm/PhoneRepairForm.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PhoneRepairForm from './PhoneRepairForm.js';
import {
  mockPhoneRepairData,
  setupPhoneRepairMocks,
} from '../../mocks/phoneRepairData.js';

describe('PhoneRepairForm component', () => {
  beforeEach(() => {
    // Set up mock data for each test
    setupPhoneRepairMocks();
  });

  it('should create a phone repair form element', () => {
    const form = new PhoneRepairForm({
      useMockData: true,
    });

    const element = form.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('phone-repair-form');

    // Check for select elements
    const manufacturerSelect = element.querySelector('#manufacturer');
    const deviceSelect = element.querySelector('#device');
    const actionSelect = element.querySelector('#action');

    expect(manufacturerSelect).not.toBeNull();
    expect(deviceSelect).not.toBeNull();
    expect(actionSelect).not.toBeNull();
  });

  it('should initialize with a placeholder price text', () => {
    const form = new PhoneRepairForm({
      useMockData: true,
    });

    const element = form.getElement();
    const priceElement = element.querySelector(
      '.phone-repair-form__price-value'
    );

    expect(priceElement).not.toBeNull();
    expect(priceElement.textContent).toContain('Bitte zuerst Hersteller');
  });

  it('should load manufacturers on initialization', () => {
    const form = new PhoneRepairForm({
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
    const form = new PhoneRepairForm({
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

  it('should enable action select when device is selected', async () => {
    const form = new PhoneRepairForm({
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
    deviceSelect.value = '3'; // iPhone 13
    deviceSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Action select should now be enabled and populated
    const actionSelect = form.actionSelect.getElement().querySelector('select');
    expect(actionSelect.disabled).toBe(false);
    expect(actionSelect.options.length).toBeGreaterThan(1);
  });

  it('should display price when action is selected', async () => {
    const mockOnPriceChange = vi.fn();
    const form = new PhoneRepairForm({
      useMockData: true,
      onPriceChange: mockOnPriceChange,
    });

    // Set up selection chain
    const manufacturerSelect = form.manufacturerSelect
      .getElement()
      .querySelector('select');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    const deviceSelect = form.deviceSelect.getElement().querySelector('select');
    deviceSelect.value = '3'; // iPhone 13
    deviceSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    const actionSelect = form.actionSelect.getElement().querySelector('select');
    actionSelect.value = '7'; // Display Reparatur
    actionSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Price should now be displayed
    const priceElement = form
      .getElement()
      .querySelector('.phone-repair-form__price-value');
    expect(priceElement.textContent).not.toContain('Bitte');
    expect(priceElement.textContent).toContain('269');

    // Callback should be called with price data
    expect(mockOnPriceChange).toHaveBeenCalledTimes(1);
    expect(mockOnPriceChange).toHaveBeenCalledWith({ price: 269 });
  });

  it('should format price correctly', () => {
    const form = new PhoneRepairForm({
      useMockData: true,
    });

    // Test different price formats
    expect(form.formatPrice(100)).toContain('100');
    expect(form.formatPrice(1000)).toContain('1.000'); // Using German locale
    expect(form.formatPrice(42.5)).toContain('42,5'); // Using German locale

    // Test null/undefined handling
    expect(form.formatPrice(null)).toBe('Preis nicht verfügbar');
    expect(form.formatPrice(undefined)).toBe('Preis nicht verfügbar');
  });

  it('should handle error states', async () => {
    // Mock fetch to simulate an error
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('manufacturers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPhoneRepairData.manufacturers),
        });
      }

      // Simulate error for other requests
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      });
    });

    const form = new PhoneRepairForm({
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
    const priceElement = form
      .getElement()
      .querySelector('.phone-repair-form__price-value');
    expect(priceElement.textContent).toContain('Fehler');
  });
});
