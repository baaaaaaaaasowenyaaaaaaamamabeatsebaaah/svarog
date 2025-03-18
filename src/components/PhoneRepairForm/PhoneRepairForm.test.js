// src/components/PhoneRepairForm/PhoneRepairForm.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PhoneRepairFormFactory from '../../factories/PhoneRepairFormFactory.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

describe('PhoneRepairForm component', () => {
  beforeEach(() => {
    // Reset DOM between tests
    document.body.innerHTML = '';
  });

  it('should create a phone repair form element', () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData
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

  it('should initialize with custom labels', () => {
    const customLabels = {
      title: 'Custom Title',
      priceLabel: 'Custom Price:'
    };
    
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
      labels: customLabels
    });

    const element = form.getElement();
    const titleElement = element.querySelector('.phone-repair-form__title');
    const priceLabelElement = element.querySelector('.price-display__label');

    expect(titleElement.textContent).toBe(customLabels.title);
    expect(priceLabelElement.textContent).toBe(customLabels.priceLabel);
  });

  it('should load manufacturers on initialization', async () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData
    });

    document.body.appendChild(form.getElement());
    
    // Wait for manufacturers to load
    await vi.runAllTimersAsync();

    // Check if manufacturers are loaded in the select
    const manufacturerSelect = document.querySelector('#manufacturer');
    expect(manufacturerSelect.options.length).toBeGreaterThan(1); // Include placeholder

    // Check the first manufacturer option after placeholder
    expect(manufacturerSelect.options[1].textContent).toBe('Apple');
  });

  it('should enable device select when manufacturer is selected', async () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData
    });

    document.body.appendChild(form.getElement());
    
    // Wait for manufacturers to load
    await vi.runAllTimersAsync();

    const manufacturerSelect = document.querySelector('#manufacturer');
    const deviceSelect = document.querySelector('#device');

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
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData
    });

    document.body.appendChild(form.getElement());
    
    // Wait for manufacturers to load
    await vi.runAllTimersAsync();

    // Set up manufacturer first
    const manufacturerSelect = document.querySelector('#manufacturer');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Then select a device
    const deviceSelect = document.querySelector('#device');
    deviceSelect.value = '3'; // iPhone 13
    deviceSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Action select should now be enabled and populated
    const actionSelect = document.querySelector('#action');
    expect(actionSelect.disabled).toBe(false);
    expect(actionSelect.options.length).toBeGreaterThan(1);
  });

  it('should display price when action is selected', async () => {
    const mockOnPriceChange = vi.fn();
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
      onPriceChange: mockOnPriceChange
    });

    document.body.appendChild(form.getElement());
    
    // Wait for manufacturers to load
    await vi.runAllTimersAsync();

    // Set up selection chain
    const manufacturerSelect = document.querySelector('#manufacturer');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    const deviceSelect = document.querySelector('#device');
    deviceSelect.value = '3'; // iPhone 13
    deviceSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    const actionSelect = document.querySelector('#action');
    actionSelect.value = '7'; // Display Reparatur
    actionSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Price should now be displayed
    const priceElement = document.querySelector('.price-display__value');
    expect(priceElement.textContent).not.toContain('Bitte');
    expect(priceElement.textContent).toContain('269');

    // Callback should be called with price data
    expect(mockOnPriceChange).toHaveBeenCalledTimes(1);
    expect(mockOnPriceChange).toHaveBeenCalledWith(
      expect.objectContaining({
        price: 269
      })
    );
  });

  it('should update step indicator as selections change', async () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData
    });

    document.body.appendChild(form.getElement());
    
    // Initial state: first step active, none completed
    let steps = document.querySelectorAll('.steps-indicator__step');
    expect(steps[0].classList.contains('steps-indicator__step--active')).toBe(true);
    expect(steps[0].classList.contains('steps-indicator__step--completed')).toBe(false);
    
    // Select manufacturer
    const manufacturerSelect = document.querySelector('#manufacturer');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));
    
    await vi.runAllTimersAsync();
    
    // After manufacturer selection: first step completed, second step active
    steps = document.querySelectorAll('.steps-indicator__step');
    expect(steps[0].classList.contains('steps-indicator__step--completed')).toBe(true);
    expect(steps[1].classList.contains('steps-indicator__step--active')).toBe(true);
    
    // Select device
    const deviceSelect = document.querySelector('#device');
    deviceSelect.value = '3'; // iPhone 13
    deviceSelect.dispatchEvent(new Event('change'));
    
    await vi.runAllTimersAsync();
    
    // After device selection: first two steps completed, third step active
    steps = document.querySelectorAll('.steps-indicator__step');
    expect(steps[0].classList.contains('steps-indicator__step--completed')).toBe(true);
    expect(steps[1].classList.contains('steps-indicator__step--completed')).toBe(true);
    expect(steps[2].classList.contains('steps-indicator__step--active')).toBe(true);
  });

  it('should handle error states', async () => {
    // Mock service with deliberate error
    const errorMockData = { ...mockPhoneRepairData };
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: errorMockData
    });
    
    // Override service to simulate error
    form.service.fetchDevices = vi.fn().mockRejectedValue(new Error('Failed to fetch devices'));
    
    document.body.appendChild(form.getElement());
    
    // Wait for manufacturers to load
    await vi.runAllTimersAsync();
    
    // Select a manufacturer to trigger device fetch (which will fail)
    const manufacturerSelect = document.querySelector('#manufacturer');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));
    
    await vi.runAllTimersAsync();
    
    // Form should have error class
    expect(form.getElement().classList.contains('phone-repair-form--error')).toBe(true);
    
    // Price display should show error message
    const priceElement = document.querySelector('.price-display__value');
    expect(priceElement.textContent).toContain('Fehler');
  });
  // src/components/PhoneRepairForm/PhoneRepairForm.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PhoneRepairFormFactory from '../../factories/PhoneRepairFormFactory.js';
import { mockPhoneRepairData } from '../../mocks/phoneRepairData.js';

describe('PhoneRepairForm component', () => {
  beforeEach(() => {
    // Reset DOM between tests
    document.body.innerHTML = '';
  });

  it('should create a phone repair form element', () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData
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

  it('should initialize with custom labels', () => {
    const customLabels = {
      title: 'Custom Title',
      priceLabel: 'Custom Price:'
    };
    
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
      labels: customLabels
    });

    const element = form.getElement();
    const titleElement = element.querySelector('.phone-repair-form__title');
    const priceLabelElement = element.querySelector('.price-display__label');

    expect(titleElement.textContent).toBe(customLabels.title);
    expect(priceLabelElement.textContent).toBe(customLabels.priceLabel);
  });

  it('should load manufacturers on initialization', async () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData
    });

    document.body.appendChild(form.getElement());
    
    // Wait for manufacturers to load
    await vi.runAllTimersAsync();

    // Check if manufacturers are loaded in the select
    const manufacturerSelect = document.querySelector('#manufacturer');
    expect(manufacturerSelect.options.length).toBeGreaterThan(1); // Include placeholder

    // Check the first manufacturer option after placeholder
    expect(manufacturerSelect.options[1].textContent).toBe('Apple');
  });

  it('should enable device select when manufacturer is selected', async () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData
    });

    document.body.appendChild(form.getElement());
    
    // Wait for manufacturers to load
    await vi.runAllTimersAsync();

    const manufacturerSelect = document.querySelector('#manufacturer');
    const deviceSelect = document.querySelector('#device');

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
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData
    });

    document.body.appendChild(form.getElement());
    
    // Wait for manufacturers to load
    await vi.runAllTimersAsync();

    // Set up manufacturer first
    const manufacturerSelect = document.querySelector('#manufacturer');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Then select a device
    const deviceSelect = document.querySelector('#device');
    deviceSelect.value = '3'; // iPhone 13
    deviceSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Action select should now be enabled and populated
    const actionSelect = document.querySelector('#action');
    expect(actionSelect.disabled).toBe(false);
    expect(actionSelect.options.length).toBeGreaterThan(1);
  });

  it('should display price when action is selected', async () => {
    const mockOnPriceChange = vi.fn();
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
      onPriceChange: mockOnPriceChange
    });

    document.body.appendChild(form.getElement());
    
    // Wait for manufacturers to load
    await vi.runAllTimersAsync();

    // Set up selection chain
    const manufacturerSelect = document.querySelector('#manufacturer');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    const deviceSelect = document.querySelector('#device');
    deviceSelect.value = '3'; // iPhone 13
    deviceSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    const actionSelect = document.querySelector('#action');
    actionSelect.value = '7'; // Display Reparatur
    actionSelect.dispatchEvent(new Event('change'));

    await vi.runAllTimersAsync();

    // Price should now be displayed
    const priceElement = document.querySelector('.price-display__value');
    expect(priceElement.textContent).not.toContain('Bitte');
    expect(priceElement.textContent).toContain('269');

    // Callback should be called with price data
    expect(mockOnPriceChange).toHaveBeenCalledTimes(1);
    expect(mockOnPriceChange).toHaveBeenCalledWith(
      expect.objectContaining({
        price: 269
      })
    );
  });

  it('should update step indicator as selections change', async () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData
    });

    document.body.appendChild(form.getElement());
    
    // Initial state: first step active, none completed
    let steps = document.querySelectorAll('.steps-indicator__step');
    expect(steps[0].classList.contains('steps-indicator__step--active')).toBe(true);
    expect(steps[0].classList.contains('steps-indicator__step--completed')).toBe(false);
    
    // Select manufacturer
    const manufacturerSelect = document.querySelector('#manufacturer');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));
    
    await vi.runAllTimersAsync();
    
    // After manufacturer selection: first step completed, second step active
    steps = document.querySelectorAll('.steps-indicator__step');
    expect(steps[0].classList.contains('steps-indicator__step--completed')).toBe(true);
    expect(steps[1].classList.contains('steps-indicator__step--active')).toBe(true);
    
    // Select device
    const deviceSelect = document.querySelector('#device');
    deviceSelect.value = '3'; // iPhone 13
    deviceSelect.dispatchEvent(new Event('change'));
    
    await vi.runAllTimersAsync();
    
    // After device selection: first two steps completed, third step active
    steps = document.querySelectorAll('.steps-indicator__step');
    expect(steps[0].classList.contains('steps-indicator__step--completed')).toBe(true);
    expect(steps[1].classList.contains('steps-indicator__step--completed')).toBe(true);
    expect(steps[2].classList.contains('steps-indicator__step--active')).toBe(true);
  });

  it('should handle error states', async () => {
    // Mock service with deliberate error
    const errorMockData = { ...mockPhoneRepairData };
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: errorMockData
    });
    
    // Override service to simulate error
    form.service.fetchDevices = vi.fn().mockRejectedValue(new Error('Failed to fetch devices'));
    
    document.body.appendChild(form.getElement());
    
    // Wait for manufacturers to load
    await vi.runAllTimersAsync();
    
    // Select a manufacturer to trigger device fetch (which will fail)
    const manufacturerSelect = document.querySelector('#manufacturer');
    manufacturerSelect.value = '1'; // Apple
    manufacturerSelect.dispatchEvent(new Event('change'));
    
    await vi.runAllTimersAsync();
    
    // Form should have error class
    expect(form.getElement().classList.contains('phone-repair-form--error')).toBe(true);
    
    // Price display should show error message
    const priceElement = document.querySelector('.price-display__value');
    expect(priceElement.textContent).toContain('Fehler');
  });
}
// src/components/PriceDisplay/PriceDisplay.js