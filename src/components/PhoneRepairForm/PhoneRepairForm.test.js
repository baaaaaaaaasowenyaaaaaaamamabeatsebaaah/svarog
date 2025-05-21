// src/components/PhoneRepairForm/PhoneRepairForm.test.js
import { describe, it, expect, vi } from 'vitest';
import PhoneRepairForm from './PhoneRepairForm.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

describe('PhoneRepairForm component', () => {
  // Sample test data
  const manufacturers = mockPhoneRepairData.manufacturers;
  const devices = manufacturers[0].devices;
  const actions = devices[0].actions;

  // Helper function to create a PhoneRepairForm instance with common props
  const createPhoneRepairForm = (props = {}) => {
    return PhoneRepairForm({
      onManufacturerChange: vi.fn(),
      onDeviceChange: vi.fn(),
      onActionChange: vi.fn(),
      onScheduleClick: vi.fn(),
      ...props,
    });
  };

  it('should create a form with link and schedule button', () => {
    const form = createPhoneRepairForm({
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

  it('should display error state in price display when loading devices fails', () => {
    const form = createPhoneRepairForm();

    // Set errors through the public API
    form.setErrors({ devices: 'Device fetch error' });

    // Update price display with error message
    form.setState({
      priceDisplayText: 'Fehler beim Laden der Geräte',
    });

    const element = form.getElement();
    const priceDisplay = element.querySelector('.price-display');

    // Check for error styling
    expect(priceDisplay.classList.contains('price-display--error')).toBe(true);

    // Check for error message in the price display
    const valueElement = priceDisplay.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Fehler beim Laden der Geräte');
  });

  it('should display error state in price display when loading actions fails', () => {
    const form = createPhoneRepairForm();

    // Set errors through the public API
    form.setErrors({ actions: 'Actions fetch error' });

    // Update price display with error message
    form.setState({
      priceDisplayText: 'Fehler beim Laden der Services',
    });

    const element = form.getElement();
    const priceDisplay = element.querySelector('.price-display');

    // Check for error styling
    expect(priceDisplay.classList.contains('price-display--error')).toBe(true);

    // Check for error message in the price display
    const valueElement = priceDisplay.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Fehler beim Laden der Services');
  });

  it('should display error state in price display when loading price fails', () => {
    const form = createPhoneRepairForm();

    // Set errors through the public API
    form.setErrors({ price: 'Price fetch error' });

    // Update price display with error message
    form.setState({
      priceDisplayText: 'Fehler beim Laden des Preises',
    });

    const element = form.getElement();
    const priceDisplay = element.querySelector('.price-display');

    // Check for error styling
    expect(priceDisplay.classList.contains('price-display--error')).toBe(true);

    // Check for error message in the price display
    const valueElement = priceDisplay.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Fehler beim Laden des Preises');
  });

  it('should clear error state when starting a new operation', () => {
    const form = createPhoneRepairForm();

    // First set error state
    form.setErrors({ devices: 'Device fetch error' });

    // Update price display with error message
    form.setState({
      priceDisplayText: 'Fehler beim Laden der Geräte',
    });

    const element = form.getElement();
    let priceDisplay = element.querySelector('.price-display');

    // Check initial error state
    expect(priceDisplay.classList.contains('price-display--error')).toBe(true);

    // Clear error state
    form.setErrors({});

    // Update the price display with initial text
    form.setState({
      priceDisplayText: 'Bitte zuerst Hersteller, Modell und Service auswählen',
    });

    // Get the updated element since we may have re-rendered
    const updatedElement = form.getElement();
    priceDisplay = updatedElement.querySelector('.price-display');

    // Error message should be gone
    expect(priceDisplay.classList.contains('price-display--error')).toBe(false);
    const valueElement = priceDisplay.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe(
      'Bitte zuerst Hersteller, Modell und Service auswählen'
    );
  });

  it('should enable the schedule button when all selections are made', () => {
    const form = createPhoneRepairForm();

    // Initial state - button should be disabled
    const initialElement = form.getElement();
    const initialButton = initialElement.querySelector('.btn');
    expect(initialButton.disabled).toBe(true);

    // Update state with all required selections
    form.update({
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
      manufacturers: manufacturers,
      devices: devices,
      actions: actions,
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
    const form = createPhoneRepairForm();

    // Check initial step (manufacturer selection active)
    let element = form.getElement();
    let steps = element.querySelectorAll('.steps-indicator__step');

    // First step should be active initially
    expect(steps[0].classList.contains('steps-indicator__step--active')).toBe(
      true
    );
    expect(
      steps[0].classList.contains('steps-indicator__step--completed')
    ).toBe(false);

    // Select manufacturer
    form.update({
      selectedManufacturer: '1',
      manufacturers,
    });

    // Get updated element
    element = form.getElement();
    steps = element.querySelectorAll('.steps-indicator__step');

    // First step should now be completed, second step active
    expect(
      steps[0].classList.contains('steps-indicator__step--completed')
    ).toBe(true);
    expect(steps[1].classList.contains('steps-indicator__step--active')).toBe(
      true
    );

    // Select device
    form.update({
      selectedDevice: '2',
      devices,
    });

    // Get updated element
    element = form.getElement();
    steps = element.querySelectorAll('.steps-indicator__step');

    // First and second step should be completed, third step active
    expect(
      steps[0].classList.contains('steps-indicator__step--completed')
    ).toBe(true);
    expect(
      steps[1].classList.contains('steps-indicator__step--completed')
    ).toBe(true);
    expect(steps[2].classList.contains('steps-indicator__step--active')).toBe(
      true
    );

    // Select action
    form.update({
      selectedAction: '3',
      actions,
    });

    // Get updated element
    element = form.getElement();
    steps = element.querySelectorAll('.steps-indicator__step');

    // All steps should be completed
    expect(
      steps[0].classList.contains('steps-indicator__step--completed')
    ).toBe(true);
    expect(
      steps[1].classList.contains('steps-indicator__step--completed')
    ).toBe(true);
    expect(
      steps[2].classList.contains('steps-indicator__step--completed')
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
    });

    const element = form.getElement();

    // Check custom button text
    const button = element.querySelector('.btn');
    expect(button.textContent).toBe('Book Now');

    // Check custom link text
    const link = element.querySelector('.phone-repair-form__link');
    expect(link.textContent).toBe('Find a used phone instead');

    // Check steps have custom labels
    const steps = element.querySelectorAll('.steps-indicator__step');
    const labels = Array.from(steps).map(
      (step) => step.querySelector('.steps-indicator__label').textContent
    );

    expect(labels).toEqual(['Brand', 'Model', 'Repair Type']);
  });
});
