// src/components/UsedPhonePriceForm/UsedPhonePriceForm.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UsedPhonePriceFormFactory from '../../factories/UsedPhonePriceFormFactory.js';
import {
  mockPhoneBuybackData,
  setupPhoneBuybackMocks,
} from '../../../__mocks__/phoneBuybackData.js';

describe('UsedPhonePriceForm component', () => {
  beforeEach(() => {
    // Set up mock data for each test
    setupPhoneBuybackMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.restoreAllMocks();
  });

  it('should create a phone price form element', () => {
    // Create form with mock data
    const form = UsedPhonePriceFormFactory.createWithMockData({
      mockData: mockPhoneBuybackData,
    });

    const element = form.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('used-phone-price-form');

    // Check for select elements
    const manufacturerSelect = element.querySelector('#manufacturer');
    const deviceSelect = element.querySelector('#device');

    expect(manufacturerSelect).not.toBeNull();
    expect(deviceSelect).not.toBeNull();
  });

  it('should initialize with a placeholder price text', () => {
    const form = UsedPhonePriceFormFactory.createWithMockData({
      mockData: mockPhoneBuybackData,
    });

    const element = form.getElement();
    const priceElement = element.querySelector('.price-display__value');

    expect(priceElement).not.toBeNull();
    expect(priceElement.textContent).toContain(
      'Bitte wählen Sie Hersteller, Modell und Zustand'
    );
  });

  it('should load manufacturers on initialization', async () => {
    const form = UsedPhonePriceFormFactory.createWithMockData({
      mockData: mockPhoneBuybackData,
    });

    // Wait for the manufacturers to load
    await vi.waitFor(() => {
      const manufacturerSelect = form
        .getElement()
        .querySelector('#manufacturer select');
      return (
        manufacturerSelect &&
        !manufacturerSelect.disabled &&
        manufacturerSelect.options.length > 1
      );
    });

    // Check if manufacturers are loaded in the select
    const manufacturerSelect = form
      .getElement()
      .querySelector('#manufacturer select');
    expect(manufacturerSelect.disabled).toBe(false);
    expect(manufacturerSelect.options.length).toBeGreaterThan(1); // Include placeholder

    // Check the first manufacturer option after placeholder
    expect(manufacturerSelect.options[1].textContent).toBe('Apple');
  });

  it('should enable device select when manufacturer is selected', async () => {
    // Create mock service with controlled responses
    const mockService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneBuybackData.manufacturers),
      fetchDevices: vi.fn().mockImplementation((manufacturerId) => {
        const manufacturer = mockPhoneBuybackData.manufacturers.find(
          (m) => m.id.toString() === manufacturerId.toString()
        );
        return Promise.resolve(manufacturer ? manufacturer.devices : []);
      }),
      fetchConditions: vi.fn().mockResolvedValue([]),
      fetchPrice: vi.fn().mockResolvedValue({ price: 100 }),
    };

    const form = UsedPhonePriceFormFactory.createWithMockService({
      service: mockService,
    });

    // Wait for manufacturers to load
    await vi.waitFor(() => {
      const manufacturerSelect = form
        .getElement()
        .querySelector('#manufacturer select');
      return manufacturerSelect && !manufacturerSelect.disabled;
    });

    const manufacturerSelect = form
      .getElement()
      .querySelector('#manufacturer select');
    const deviceSelect = form.getElement().querySelector('#device select');

    // Initially device select should be disabled
    expect(deviceSelect.disabled).toBe(true);

    // Select a manufacturer
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change', { bubbles: true }));

    // Wait for devices to load
    await vi.waitFor(() => {
      return !form.getElement().querySelector('#device select').disabled;
    });

    // Device select should now be enabled and populated
    const updatedDeviceSelect = form
      .getElement()
      .querySelector('#device select');
    expect(updatedDeviceSelect.disabled).toBe(false);
    expect(updatedDeviceSelect.options.length).toBeGreaterThan(1);
  });

  it('should format price correctly', () => {
    // Create the form with mock data
    const form = UsedPhonePriceFormFactory.createWithMockData({
      mockData: mockPhoneBuybackData,
    });

    // Get the form instance
    const formInstance = form.form;

    // Test different price formats - be more flexible with space characters
    const price100 = formInstance.formatPrice(100);
    const price1000 = formInstance.formatPrice(1000);
    const price42_5 = formInstance.formatPrice(42.5);

    // Check that the formatted strings contain the expected numbers and euro symbol
    expect(price100).toMatch(/100,00\s*€/);
    expect(price1000).toMatch(/1\.000,00\s*€/);
    expect(price42_5).toMatch(/42,50\s*€/);

    // Test null/undefined handling
    expect(formInstance.formatPrice(null)).toBe('Preis nicht verfügbar');
    expect(formInstance.formatPrice(undefined)).toBe('Preis nicht verfügbar');
  });

  it('should display error state when loading devices fails', async () => {
    // Create mock service that simulates device fetch error
    const mockService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneBuybackData.manufacturers),
      fetchDevices: vi.fn().mockRejectedValue(new Error('API error')),
      fetchConditions: vi.fn().mockResolvedValue([]),
      fetchPrice: vi.fn().mockResolvedValue({ price: 100 }),
    };

    const form = UsedPhonePriceFormFactory.createWithMockService({
      service: mockService,
    });

    // Wait for manufacturers to load
    await vi.waitFor(() => {
      const manufacturerSelect = form
        .getElement()
        .querySelector('#manufacturer select');
      return manufacturerSelect && !manufacturerSelect.disabled;
    });

    // Select a manufacturer to trigger device fetch (which will fail)
    const manufacturerSelect = form
      .getElement()
      .querySelector('#manufacturer select');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change', { bubbles: true }));

    // Wait for the error to be processed
    await vi.waitFor(() => {
      const priceDisplay = form
        .getElement()
        .querySelector('.price-display__value');
      return priceDisplay.textContent.includes('Fehler beim Laden der Geräte');
    });

    // Check error state
    const priceDisplay = form
      .getElement()
      .querySelector('.price-display__value');
    expect(priceDisplay.textContent).toContain('Fehler beim Laden der Geräte');
  });

  it('should submit form data when all fields are selected', async () => {
    const mockOnSubmit = vi.fn();

    // Create a mock service that returns controlled data
    const mockService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue([{ id: 1, name: 'TestBrand', devices: [] }]),
      fetchDevices: vi
        .fn()
        .mockResolvedValue([{ id: 1, name: 'TestPhone', conditions: [] }]),
      fetchConditions: vi.fn().mockResolvedValue([{ id: 1, name: 'Perfect' }]),
      fetchPrice: vi.fn().mockResolvedValue({
        price: 500,
        deviceName: 'TestPhone',
        conditionName: 'Perfect',
        manufacturerName: 'TestBrand',
      }),
    };

    const form = UsedPhonePriceFormFactory.createWithMockService({
      service: mockService,
      onSubmit: mockOnSubmit,
    });

    // Wait for manufacturers to load
    await vi.waitFor(() => {
      const manufacturerSelect = form
        .getElement()
        .querySelector('#manufacturer select');
      return manufacturerSelect && !manufacturerSelect.disabled;
    });

    // Manually set form state to have all required data
    form.form.setState({
      manufacturers: [{ id: 1, name: 'TestBrand' }],
      devices: [{ id: 1, name: 'TestPhone' }],
      conditions: [{ id: 1, name: 'Perfect' }],
      selectedManufacturer: '1',
      selectedDevice: '1',
      selectedCondition: '1',
      currentPrice: { price: 500 },
    });
    form.form.updateFormState();

    // Submit the form
    const formElement = form.getElement();
    formElement.dispatchEvent(new Event('submit', { bubbles: true }));

    // Check that onSubmit was called
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    // Check the form data structure
    const formData = mockOnSubmit.mock.calls[0][0];
    expect(formData).toHaveProperty('manufacturerId', '1');
    expect(formData).toHaveProperty('deviceId', '1');
    expect(formData).toHaveProperty('conditionId', '1');
    expect(formData).toHaveProperty('price', 500);
  });
});
