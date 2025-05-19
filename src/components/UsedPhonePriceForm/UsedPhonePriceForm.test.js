// src/components/UsedPhonePriceForm/UsedPhonePriceForm.test.js
import { describe, it, expect, vi } from 'vitest';
import UsedPhonePriceForm from './UsedPhonePriceForm.js';

describe('UsedPhonePriceForm component', () => {
  // Helper function to create a UsedPhonePriceForm instance with required props
  const createUsedPhonePriceForm = (props = {}) => {
    return new UsedPhonePriceForm({
      onManufacturerChange: vi.fn(),
      onDeviceChange: vi.fn(),
      onConditionChange: vi.fn(),
      onSubmit: vi.fn(),
      ...props,
    });
  };

  it('should create a phone price form element', () => {
    const form = createUsedPhonePriceForm();

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
    const form = createUsedPhonePriceForm();

    const element = form.getElement();
    const priceElement = element.querySelector('.price-display__value');

    expect(priceElement).not.toBeNull();
    expect(priceElement.textContent).toContain(
      'Bitte wählen Sie Hersteller, Modell und Zustand'
    );
  });

  it('should format price correctly', () => {
    const form = createUsedPhonePriceForm();

    // Test different price formats
    const price100 = form.formatPrice(100);
    const price1000 = form.formatPrice(1000);
    const price42_5 = form.formatPrice(42.5);

    // Check that the formatted strings contain the expected numbers and euro symbol
    expect(price100).toMatch(/100,00\s*€/);
    expect(price1000).toMatch(/1\.000,00\s*€/);
    expect(price42_5).toMatch(/42,50\s*€/);

    // Test null/undefined handling
    expect(form.formatPrice(null)).toBe('Preis nicht verfügbar');
    expect(form.formatPrice(undefined)).toBe('Preis nicht verfügbar');
  });

  it('should display error state when loading devices fails', () => {
    const form = createUsedPhonePriceForm();

    // Set errors through the setErrors method
    form.setErrors({ devices: new Error('Device fetch error') });

    // Check error state in price display
    const priceDisplay = form.priceDisplay.getElement();
    expect(priceDisplay.classList.contains('price-display--error')).toBe(true);

    // Check the error message
    const valueElement = priceDisplay.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Fehler beim Laden der Geräte');
  });

  it('should submit form data when all fields are selected', () => {
    const onSubmit = vi.fn();
    const form = createUsedPhonePriceForm({ onSubmit });

    // Setup the form state manually
    form.state.selectedManufacturer = '1';
    form.state.selectedDevice = '1';
    form.state.selectedCondition = '1';
    form.state.currentPrice = { price: 500 };
    form.state.manufacturers = [{ id: 1, name: 'TestBrand' }];
    form.state.devices = [{ id: 1, name: 'TestPhone' }];
    form.state.conditions = [{ id: 1, name: 'Perfect' }];

    // Update form state to enable submit button
    form.updateFormState();

    // Manually call the submit handler
    form.handleSubmit(new Event('submit'));

    // Check that onSubmit was called with the right data
    expect(onSubmit).toHaveBeenCalledTimes(1);

    // Check the form data structure
    const formData = onSubmit.mock.calls[0][0];
    expect(formData).toHaveProperty('manufacturerId', '1');
    expect(formData).toHaveProperty('deviceId', '1');
    expect(formData).toHaveProperty('conditionId', '1');
    expect(formData).toHaveProperty('price', 500);
  });

  it('should update condition selector when new conditions are set', () => {
    const form = createUsedPhonePriceForm();

    // Spy on the condition selector updateConditions method
    const updateConditionsSpy = vi.spyOn(
      form.conditionSelector,
      'updateConditions'
    );

    // Set conditions with test data
    const testConditions = [
      { id: 1, name: 'New', description: 'Brand new device' },
      { id: 2, name: 'Good', description: 'Minor scratches' },
    ];

    form.setConditions(testConditions);

    // Verify updateConditions was called with the test data
    expect(updateConditionsSpy).toHaveBeenCalledWith(testConditions);
  });

  it('should show/hide steps indicator based on props', () => {
    // Create form with steps indicator enabled (default)
    const formWithSteps = createUsedPhonePriceForm();

    // Create form with steps indicator disabled
    const formWithoutSteps = createUsedPhonePriceForm({
      showStepsIndicator: false,
    });

    // Check presence/absence of steps indicator
    const stepsWithSteps = formWithSteps
      .getElement()
      .querySelector('.steps-indicator');
    const stepsWithoutSteps = formWithoutSteps
      .getElement()
      .querySelector('.steps-indicator');

    expect(stepsWithSteps).not.toBeNull();
    expect(stepsWithoutSteps).toBeNull();
  });
});
