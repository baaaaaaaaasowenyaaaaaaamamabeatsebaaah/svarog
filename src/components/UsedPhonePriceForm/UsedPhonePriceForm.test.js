// src/components/UsedPhonePriceForm/UsedPhonePriceForm.test.js
import { describe, it, expect, vi } from 'vitest';
import UsedPhonePriceForm from './UsedPhonePriceForm.js';
import { mockPhoneBuybackData } from '../../../__mocks__/phoneBuybackData.js';

describe('UsedPhonePriceForm component', () => {
  // Sample test data - transformed to match expected format
  const manufacturers = mockPhoneBuybackData.manufacturers;
  const devices = manufacturers[0].devices;
  const conditions = devices[0].conditions;

  // Helper function to create a UsedPhonePriceForm instance with common props
  const createUsedPhonePriceForm = (props = {}) => {
    return UsedPhonePriceForm({
      manufacturers: [],
      devices: [],
      conditions: [],
      onManufacturerChange: vi.fn(),
      onDeviceChange: vi.fn(),
      onConditionChange: vi.fn(),
      onSubmit: vi.fn(),
      ...props,
    });
  };

  it('should create a form with condition selector and submit button', () => {
    const form = createUsedPhonePriceForm();

    const element = form.getElement();

    // Check for manufacturer and device selects
    const manufacturerSelect = element.querySelector(
      'select[name="manufacturer"]'
    );
    const deviceSelect = element.querySelector('select[name="device"]');
    expect(manufacturerSelect).not.toBeNull();
    expect(deviceSelect).not.toBeNull();

    // Check for condition selector
    const conditionSelector = element.querySelector('.condition-selector');
    expect(conditionSelector).not.toBeNull();

    // Check for submit button
    const button = element.querySelector('.btn');
    expect(button).not.toBeNull();
    expect(button.textContent).toContain('Verkaufen');

    // Button should initially be disabled since no selections are made
    expect(button.disabled).toBe(true);
  });

  it('should display initial price text when no price is available', () => {
    const form = createUsedPhonePriceForm();

    const element = form.getElement();
    const priceElement = element.querySelector('.price-display__value');

    expect(priceElement).not.toBeNull();
    expect(priceElement.textContent).toContain(
      'Bitte wählen Sie Hersteller, Modell und Zustand'
    );
  });

  it('should display error state in price display when loading devices fails', () => {
    const form = createUsedPhonePriceForm({
      error: {
        devices: 'Device fetch error',
      },
    });

    const element = form.getElement();

    // Check that the form has error class
    expect(element.classList.contains('used-phone-price-form--error')).toBe(
      true
    );

    // Check that price display exists
    const priceDisplay = element.querySelector('.price-display');
    expect(priceDisplay).not.toBeNull();
  });

  it('should display error state in price display when loading conditions fails', () => {
    const form = createUsedPhonePriceForm({
      error: {
        conditions: 'Conditions fetch error',
      },
    });

    const element = form.getElement();

    expect(element.classList.contains('used-phone-price-form--error')).toBe(
      true
    );

    const priceDisplay = element.querySelector('.price-display');
    expect(priceDisplay).not.toBeNull();
  });

  it('should display error state in price display when loading price fails', () => {
    const form = createUsedPhonePriceForm({
      error: {
        price: 'Price fetch error',
      },
    });

    const element = form.getElement();

    expect(element.classList.contains('used-phone-price-form--error')).toBe(
      true
    );

    const priceDisplay = element.querySelector('.price-display');
    expect(priceDisplay).not.toBeNull();
  });

  it('should clear error state when updating with no errors', () => {
    const form = createUsedPhonePriceForm({
      error: {
        devices: 'Device fetch error',
      },
    });

    const element = form.getElement();

    // Check initial error state
    expect(element.classList.contains('used-phone-price-form--error')).toBe(
      true
    );

    // Update with no errors - use setState method instead of update
    form.setState({
      error: {},
      hasError: false,
    });

    // Get the updated element
    const updatedElement = form.getElement();

    // Error class should be removed
    expect(
      updatedElement.classList.contains('used-phone-price-form--error')
    ).toBe(false);
  });

  it('should enable the submit button when all selections are made', () => {
    const form = createUsedPhonePriceForm({
      manufacturers,
      devices,
      conditions,
    });

    // Initial state - button should be disabled
    const initialElement = form.getElement();
    const initialButton = initialElement.querySelector('.btn');
    expect(initialButton.disabled).toBe(true);

    // Update with all required selections using setState
    form.setState({
      selectedManufacturer: '1',
      selectedDevice: '1',
      selectedCondition: '1',
      currentPrice: { price: 399 },
    });

    // Get the updated element with our changes
    const updatedElement = form.getElement();
    const updatedButton = updatedElement.querySelector('.btn');

    // Now button should be enabled
    expect(updatedButton.disabled).toBe(false);
  });

  it('should collect and submit form data when submit button is clicked', () => {
    const onSubmit = vi.fn();

    // Set up form with all the required data and the mock callback
    const form = createUsedPhonePriceForm({
      manufacturers,
      devices,
      conditions,
      selectedManufacturer: '1',
      selectedDevice: '2',
      selectedCondition: '3',
      currentPrice: { price: 399 },
      onSubmit,
    });

    // Get the button and click it
    const element = form.getElement();
    const button = element.querySelector('.btn');
    button.click();

    // Check that callback was called with correct data
    expect(onSubmit).toHaveBeenCalledTimes(1);

    // Verify the structure of the data
    const submittedData = onSubmit.mock.calls[0][0];
    expect(submittedData).toHaveProperty('manufacturerId');
    expect(submittedData).toHaveProperty('deviceId');
    expect(submittedData).toHaveProperty('conditionId');
    expect(submittedData).toHaveProperty('price');
    expect(submittedData).toHaveProperty('timestamp');

    // Verify specific values
    expect(submittedData.manufacturerId).toBe('1');
    expect(submittedData.deviceId).toBe('2');
    expect(submittedData.conditionId).toBe('3');
    expect(submittedData.price).toBe(399);
  });

  it('should update the steps indicator based on selections', () => {
    const form = createUsedPhonePriceForm({
      selectedManufacturer: '1',
      showStepsIndicator: true,
    });

    const element = form.getElement();

    // Check that steps indicator exists
    const stepsIndicator = element.querySelector('.steps-indicator');
    expect(stepsIndicator).not.toBeNull();

    // Check that we have the expected number of steps
    const steps = element.querySelectorAll('.steps-indicator__step');
    expect(steps.length).toBe(3);

    // First step should be completed due to selectedManufacturer
    expect(
      steps[0].classList.contains('steps-indicator__step--completed')
    ).toBe(true);
  });

  it('should handle custom labels', () => {
    const customLabels = {
      manufacturerStep: 'Brand',
      deviceStep: 'Model',
      conditionStep: 'Condition',
      manufacturerPlaceholder: 'Select Brand',
      devicePlaceholder: 'First select a brand',
      initialPriceText: 'Complete all selections to see price',
      submitButtonText: 'Sell Now',
      conditionNewLabel: 'Like New',
      conditionGoodLabel: 'Good',
      conditionFairLabel: 'Fair',
      conditionPoorLabel: 'Damaged',
    };

    const form = createUsedPhonePriceForm({
      labels: customLabels,
      showStepsIndicator: true,
    });

    const element = form.getElement();

    // Check custom button text
    const button = element.querySelector('.btn');
    expect(button.textContent).toBe('Sell Now');

    // Check steps have custom labels
    const steps = element.querySelectorAll('.steps-indicator__step');
    const labels = Array.from(steps).map(
      (step) => step.querySelector('.steps-indicator__label').textContent
    );

    expect(labels).toEqual(['Brand', 'Model', 'Condition']);
  });

  it('should show manufacturers in select when provided', () => {
    const form = createUsedPhonePriceForm({
      manufacturers,
    });

    const element = form.getElement();
    const manufacturerSelect = element.querySelector(
      'select[name="manufacturer"]'
    );
    expect(manufacturerSelect).not.toBeNull();

    // Check that options are present (including placeholder)
    const options = manufacturerSelect.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(1); // At least placeholder + manufacturers
  });

  it('should disable device select when no manufacturer is selected', () => {
    const form = createUsedPhonePriceForm({
      manufacturers,
      devices: [], // No devices
    });

    const element = form.getElement();
    const deviceSelect = element.querySelector('select[name="device"]');
    expect(deviceSelect).not.toBeNull();
    expect(deviceSelect.disabled).toBe(true);
  });

  it('should enable device select when manufacturer is selected', () => {
    const form = createUsedPhonePriceForm({
      manufacturers,
      devices,
      selectedManufacturer: '1', // Required to enable device select
    });

    const element = form.getElement();
    const deviceSelect = element.querySelector('select[name="device"]');
    expect(deviceSelect).not.toBeNull();
    expect(deviceSelect.disabled).toBe(false);
  });

  it('should transform raw data to select options format', () => {
    const form = createUsedPhonePriceForm({
      manufacturers,
    });

    const element = form.getElement();
    const manufacturerSelect = element.querySelector(
      'select[name="manufacturer"]'
    );

    // Check that the first manufacturer option has the expected value and text
    const firstOption = manufacturerSelect.options[1]; // Skip placeholder
    expect(firstOption.value).toBe('1'); // Should be string ID
    expect(firstOption.textContent).toBe('Apple'); // Should be name
  });

  it('should handle loading states', () => {
    const form = createUsedPhonePriceForm({
      loadingStates: {
        manufacturers: true,
        devices: false,
        conditions: false,
        price: false,
      },
    });

    const element = form.getElement();

    // Check that manufacturer select shows loading state
    const manufacturerContainer = element.querySelector('.select-container');
    expect(manufacturerContainer.getAttribute('data-loading')).toBe('true');
  });

  it('should handle price formatting', () => {
    const form = createUsedPhonePriceForm({
      currentPrice: { price: 39900 }, // Price in cents
    });

    const element = form.getElement();
    const priceDisplay = element.querySelector('.price-display__value');

    // Should format as euros
    expect(priceDisplay.textContent).toContain('399,00');
    expect(priceDisplay.textContent).toContain('€');
  });

  it('should provide convenient state management methods', () => {
    const form = createUsedPhonePriceForm();

    // Test all convenience methods exist
    expect(typeof form.setLoading).toBe('function');
    expect(typeof form.setErrors).toBe('function');
    expect(typeof form.setManufacturers).toBe('function');
    expect(typeof form.setDevices).toBe('function');
    expect(typeof form.setConditions).toBe('function');
    expect(typeof form.setPrice).toBe('function');
    expect(typeof form.getCurrentState).toBe('function');

    // Test setLoading method
    form.setLoading({ manufacturers: true });
    const state = form.getCurrentState();
    expect(state.loadingStates.manufacturers).toBe(true);

    // Test setErrors method
    form.setErrors({ price: 'Error message' });
    const updatedState = form.getCurrentState();
    expect(updatedState.error.price).toBe('Error message');
    expect(updatedState.hasError).toBe(true);
  });

  it('should properly clean up resources when destroyed', () => {
    const form = createUsedPhonePriceForm();

    // Verify destroy method exists
    expect(typeof form.destroy).toBe('function');

    // Should not throw when called
    expect(() => form.destroy()).not.toThrow();
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

  it('should handle condition selector updates', () => {
    const form = createUsedPhonePriceForm();

    // Test setConditions method
    const testConditions = [
      { id: 1, name: 'New', description: 'Brand new device' },
      { id: 2, name: 'Good', description: 'Minor scratches' },
    ];

    form.setConditions(testConditions);
    const state = form.getCurrentState();
    expect(state.conditions).toEqual(testConditions);
  });
});
