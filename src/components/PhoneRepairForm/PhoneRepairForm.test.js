// src/components/PhoneRepairForm/PhoneRepairForm.test.js
import { describe, it, expect, vi } from 'vitest';
import PhoneRepairForm from './PhoneRepairForm.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

describe('PhoneRepairForm component', () => {
  // Sample test data - transformed to match expected format
  const manufacturers = mockPhoneRepairData.manufacturers;
  const devices = manufacturers[0].devices;
  const actions = devices[0].actions;

  // Helper function to create a PhoneRepairForm instance with common props
  const createPhoneRepairForm = (props = {}) => {
    return PhoneRepairForm({
      manufacturers: [],
      devices: [],
      actions: [],
      onManufacturerChange: vi.fn(),
      onDeviceChange: vi.fn(),
      onActionChange: vi.fn(),
      onScheduleClick: vi.fn(),
      ...props,
    });
  };

  it('should create a form with link and schedule button', () => {
    const form = createPhoneRepairForm({
      usedPhoneHref: 'https://example.com/used-phones',
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

  it('should display error state in price display when loading devices fails', () => {
    const form = createPhoneRepairForm({
      error: {
        devices: 'Device fetch error',
      },
    });

    const element = form.getElement();

    // Check that the form has error class
    expect(element.classList.contains('phone-repair-form--error')).toBe(true);

    // Check that price display shows error state
    const priceDisplay = element.querySelector('.price-display');
    expect(priceDisplay).not.toBeNull();
  });

  it('should display error state in price display when loading actions fails', () => {
    const form = createPhoneRepairForm({
      error: {
        actions: 'Actions fetch error',
      },
    });

    const element = form.getElement();

    expect(element.classList.contains('phone-repair-form--error')).toBe(true);

    const priceDisplay = element.querySelector('.price-display');
    expect(priceDisplay).not.toBeNull();
  });

  it('should display error state in price display when loading price fails', () => {
    const form = createPhoneRepairForm({
      error: {
        price: 'Price fetch error',
      },
    });

    const element = form.getElement();

    expect(element.classList.contains('phone-repair-form--error')).toBe(true);

    const priceDisplay = element.querySelector('.price-display');
    expect(priceDisplay).not.toBeNull();
  });

  it('should clear error state when updating with no errors', () => {
    const form = createPhoneRepairForm({
      error: {
        devices: 'Device fetch error',
      },
    });

    const element = form.getElement();

    // Check initial error state
    expect(element.classList.contains('phone-repair-form--error')).toBe(true);

    // Update with no errors - use setState method instead of update
    form.setState({
      error: {},
      hasError: false,
    });

    // Get the updated element
    const updatedElement = form.getElement();

    // Error class should be removed
    expect(updatedElement.classList.contains('phone-repair-form--error')).toBe(
      false
    );
  });

  it('should enable the schedule button when all selections are made', () => {
    const form = createPhoneRepairForm({
      manufacturers,
      devices,
      actions,
    });

    // Initial state - button should be disabled
    const initialElement = form.getElement();
    const initialButton = initialElement.querySelector('.btn');
    expect(initialButton.disabled).toBe(true);

    // Update with all required selections using setState
    form.setState({
      selectedManufacturer: '1',
      selectedDevice: '1',
      selectedAction: '1',
      currentPrice: { price: 199 },
    });

    // Get the updated element with our changes
    const updatedElement = form.getElement();
    const updatedButton = updatedElement.querySelector('.btn');

    // Now button should be enabled
    expect(updatedButton.disabled).toBe(false);
  });

  it('should collect and submit form data when schedule button is clicked', () => {
    const onScheduleClick = vi.fn();

    // Set up form with all the required data and the mock callback
    const form = createPhoneRepairForm({
      manufacturers,
      devices,
      actions,
      selectedManufacturer: '1',
      selectedDevice: '2',
      selectedAction: '3',
      currentPrice: { price: 299 },
      onScheduleClick,
    });

    // Get the button and click it
    const element = form.getElement();
    const button = element.querySelector('.btn');
    button.click();

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

  it('should update the steps indicator based on selections', () => {
    const form = createPhoneRepairForm({
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
      serviceStep: 'Repair Type',
      manufacturerPlaceholder: 'Select Brand',
      devicePlaceholder: 'First select a brand',
      servicePlaceholder: 'First select a model',
      initialPriceText: 'Complete all selections to see price',
      usedPhoneText: 'Find a used phone instead',
      scheduleButtonText: 'Book Now',
    };

    const form = createPhoneRepairForm({
      labels: customLabels,
      usedPhoneHref: 'https://example.com/used-phones',
      showStepsIndicator: true,
    });

    const element = form.getElement();

    // Check custom button text
    const button = element.querySelector('.btn');
    expect(button.textContent).toBe('Book Now');

    // Check custom link text
    const link = element.querySelector('.phone-repair-form__link');
    expect(link).not.toBeNull();
    expect(link.textContent).toBe('Find a used phone instead');

    // Check steps have custom labels
    const steps = element.querySelectorAll('.steps-indicator__step');
    const labels = Array.from(steps).map(
      (step) => step.querySelector('.steps-indicator__label').textContent
    );

    expect(labels).toEqual(['Brand', 'Model', 'Repair Type']);
  });

  it('should show manufacturers in select when provided', () => {
    const form = createPhoneRepairForm({
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

  it('should disable device select when no devices available', () => {
    const form = createPhoneRepairForm({
      manufacturers,
      devices: [], // No devices
    });

    const element = form.getElement();
    const deviceSelect = element.querySelector('select[name="device"]');
    expect(deviceSelect).not.toBeNull();
    expect(deviceSelect.disabled).toBe(true);
  });

  it('should enable device select when devices are available', () => {
    const form = createPhoneRepairForm({
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
    const form = createPhoneRepairForm({
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
    const form = createPhoneRepairForm({
      loadingStates: {
        manufacturers: true,
        devices: false,
        actions: false,
        price: false,
      },
    });

    const element = form.getElement();

    // Check that manufacturer select shows loading state
    const manufacturerContainer = element.querySelector('.select-container');
    expect(manufacturerContainer.getAttribute('data-loading')).toBe('true');
  });

  it('should handle price formatting', () => {
    const form = createPhoneRepairForm({
      currentPrice: { price: 12900 }, // Price in cents
    });

    const element = form.getElement();
    const priceDisplay = element.querySelector('.price-display__value');

    // Should format as euros
    expect(priceDisplay.textContent).toContain('129,00');
    expect(priceDisplay.textContent).toContain('€');
  });

  it('should provide convenient state management methods', () => {
    const form = createPhoneRepairForm();

    // Test all convenience methods exist
    expect(typeof form.setLoading).toBe('function');
    expect(typeof form.setErrors).toBe('function');
    expect(typeof form.setManufacturers).toBe('function');
    expect(typeof form.setDevices).toBe('function');
    expect(typeof form.setActions).toBe('function');
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
    const form = createPhoneRepairForm();

    // Verify destroy method exists
    expect(typeof form.destroy).toBe('function');

    // Should not throw when called
    expect(() => form.destroy()).not.toThrow();
  });
});
