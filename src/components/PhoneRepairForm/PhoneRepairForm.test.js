// src/components/PhoneRepairForm/PhoneRepairForm.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PhoneRepairFormFactory from '../../factories/PhoneRepairFormFactory.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

describe('PhoneRepairForm component', () => {
  // Create mock services for testing error states
  let mockServiceWithErrors;

  beforeEach(() => {
    // Create mock service that returns errors for specific methods
    mockServiceWithErrors = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneRepairData.manufacturers),
      fetchDevices: vi.fn().mockRejectedValue(new Error('Device fetch error')),
      fetchActions: vi.fn().mockRejectedValue(new Error('Actions fetch error')),
      fetchPrice: vi.fn().mockRejectedValue(new Error('Price fetch error')),
    };
  });

  // Existing tests...

  // New tests for error handling
  it('should display error state in price display when loading devices fails', async () => {
    // Create form with mock service that will fail on fetchDevices
    const form = PhoneRepairFormFactory.createWithMockService({
      service: mockServiceWithErrors,
    });

    const formElement = form.getElement();

    // Get the price display element
    const priceDisplay = formElement.querySelector('.price-display');
    expect(priceDisplay).not.toBeNull();

    // Attempt to load devices (which will fail)
    await form.loadDevices('1');

    // Check that price display shows error state
    expect(priceDisplay.classList.contains('price-display--error')).toBe(true);

    // Check the error message content
    const valueElement = priceDisplay.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Fehler beim Laden der Geräte');
  });

  it('should display error state in price display when loading actions fails', async () => {
    // Create form with custom mock service for this test
    const customMockService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneRepairData.manufacturers),
      fetchDevices: vi
        .fn()
        .mockResolvedValue(mockPhoneRepairData.manufacturers[0].devices),
      fetchActions: vi.fn().mockRejectedValue(new Error('Actions fetch error')),
      fetchPrice: vi.fn().mockResolvedValue({ price: 199 }),
    };

    const form = PhoneRepairFormFactory.createWithMockService({
      service: customMockService,
    });

    const formElement = form.getElement();
    const priceDisplay = formElement.querySelector('.price-display');

    // Try to load actions (which will fail)
    await form.loadActions('1');

    // Check that price display shows error state
    expect(priceDisplay.classList.contains('price-display--error')).toBe(true);

    // Check the error message content
    const valueElement = priceDisplay.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Fehler beim Laden der Services');
  });

  it('should display error state in price display when loading price fails', async () => {
    // Create form with custom mock service for this test
    const customMockService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneRepairData.manufacturers),
      fetchDevices: vi
        .fn()
        .mockResolvedValue(mockPhoneRepairData.manufacturers[0].devices),
      fetchActions: vi
        .fn()
        .mockResolvedValue(
          mockPhoneRepairData.manufacturers[0].devices[0].actions
        ),
      fetchPrice: vi.fn().mockRejectedValue(new Error('Price fetch error')),
    };

    const form = PhoneRepairFormFactory.createWithMockService({
      service: customMockService,
    });

    const formElement = form.getElement();
    const priceDisplay = formElement.querySelector('.price-display');

    // Try to load price (which will fail)
    await form.loadPrice('1');

    // Check that price display shows error state
    expect(priceDisplay.classList.contains('price-display--error')).toBe(true);

    // Check the error message content
    const valueElement = priceDisplay.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Fehler beim Laden des Preises');
  });

  it('should clear error state when starting a new operation', async () => {
    // Create a custom mock service that fails on first call but succeeds on second call
    const customMockService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneRepairData.manufacturers),
      fetchDevices: vi
        .fn()
        .mockRejectedValueOnce(new Error('Device fetch error'))
        .mockResolvedValueOnce(mockPhoneRepairData.manufacturers[0].devices),
      fetchActions: vi
        .fn()
        .mockResolvedValue(
          mockPhoneRepairData.manufacturers[0].devices[0].actions
        ),
      fetchPrice: vi.fn().mockResolvedValue({ price: 199 }),
    };

    const form = PhoneRepairFormFactory.createWithMockService({
      service: customMockService,
    });

    const formElement = form.getElement();
    const priceDisplay = formElement.querySelector('.price-display');

    // First attempt fails
    await form.loadDevices('1');
    expect(priceDisplay.classList.contains('price-display--error')).toBe(true);

    // Second attempt should clear error state
    await form.loadDevices('1');
    expect(priceDisplay.classList.contains('price-display--error')).toBe(false);
  });

  it('should create a form with link and schedule button', () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
      usedPhoneUrl: 'https://example.com/used-phones',
    });

    const element = form.getElement();

    // Check for link to used phones
    const link = element.querySelector('.phone-repair-form__link');
    expect(link).not.toBeNull();
    expect(link.href).toContain('example.com/used-phones');
    expect(link.textContent).toContain('Zu teuer?');

    // Check for schedule button
    const button = element.querySelector('.btn');
    expect(button).not.toBeNull();
    expect(button.textContent).toContain('Termin vereinbaren');

    // Button should initially be disabled since no selections are made
    expect(button.disabled).toBe(true);
  });

  it('should enable the schedule button when all selections are made', async () => {
    // Create a custom mock service that allows selections to complete
    const customMockService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneRepairData.manufacturers),
      fetchDevices: vi
        .fn()
        .mockResolvedValue(mockPhoneRepairData.manufacturers[0].devices),
      fetchActions: vi
        .fn()
        .mockResolvedValue(
          mockPhoneRepairData.manufacturers[0].devices[0].actions
        ),
      fetchPrice: vi.fn().mockResolvedValue({ price: 199 }),
    };

    const form = PhoneRepairFormFactory.createWithMockService({
      service: customMockService,
    });

    const formElement = form.getElement();
    const button = formElement.querySelector('.btn');

    // Initially disabled
    expect(button.disabled).toBe(true);

    // Set manufacturer, device, action, and fetch price
    form.setState({
      selectedManufacturer: '1',
      selectedDevice: '1',
      selectedAction: '1',
      currentPrice: { price: 199 },
    });
    form.updateFormState();

    // Now button should be enabled
    expect(button.disabled).toBe(false);
  });

  it('should collect and submit form data when schedule button is clicked', () => {
    const onScheduleClick = vi.fn();

    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
      onScheduleClick,
    });

    // Set up form state with selections
    form.setState({
      manufacturers: mockPhoneRepairData.manufacturers,
      devices: mockPhoneRepairData.manufacturers[0].devices,
      actions: mockPhoneRepairData.manufacturers[0].devices[0].actions,
      selectedManufacturer: '1',
      selectedDevice: '2',
      selectedAction: '3',
      currentPrice: { price: 299 },
    });

    // Call handleScheduleClick directly since we can't easily click the button in tests
    form.handleScheduleClick();

    // Check that callback was called with correct data
    expect(onScheduleClick).toHaveBeenCalledTimes(1);

    // Verify the structure of the data
    const submittedData = onScheduleClick.mock.calls[0][0];
    expect(submittedData).toHaveProperty('manufacturer');
    expect(submittedData).toHaveProperty('device');
    expect(submittedData).toHaveProperty('service');
    expect(submittedData).toHaveProperty('price');
    expect(submittedData).toHaveProperty('timestamp');

    // Verify specific values
    expect(submittedData.manufacturer.id).toBe('1');
    expect(submittedData.device.id).toBe('2');
    expect(submittedData.service.id).toBe('3');
    expect(submittedData.price.price).toBe(299);
  });
});
