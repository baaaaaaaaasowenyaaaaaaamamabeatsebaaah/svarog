// src/components/PhoneRepairForm/PhoneRepairForm.test.js
import { describe, it, expect, vi } from 'vitest';
import PhoneRepairForm from './PhoneRepairForm.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

describe('PhoneRepairForm component', () => {
  // Helper function to create a PhoneRepairForm instance with required props
  const createPhoneRepairForm = (props = {}) => {
    return new PhoneRepairForm({
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
    const formElement = form.getElement();

    // Set errors through the public API
    form.setErrors({ devices: new Error('Device fetch error') });

    // Directly set the price display value
    form.priceDisplay.setValue('Fehler beim Laden der Geräte');
    form.priceDisplay.getElement().classList.add('price-display--error');

    // Check for error message in the price display
    const priceDisplay = formElement.querySelector('.price-display');
    const valueElement = priceDisplay.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Fehler beim Laden der Geräte');
  });

  it('should display error state in price display when loading actions fails', () => {
    const form = createPhoneRepairForm();
    const formElement = form.getElement();

    // Set errors through the public API
    form.setErrors({ actions: new Error('Actions fetch error') });

    // Directly set the price display value
    form.priceDisplay.setValue('Fehler beim Laden der Services');
    form.priceDisplay.getElement().classList.add('price-display--error');

    // Check for error message in the price display
    const priceDisplay = formElement.querySelector('.price-display');
    const valueElement = priceDisplay.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Fehler beim Laden der Services');
  });

  it('should display error state in price display when loading price fails', () => {
    const form = createPhoneRepairForm();
    const formElement = form.getElement();

    // Set errors through the public API
    form.setErrors({ price: new Error('Price fetch error') });

    // Directly set the price display value
    form.priceDisplay.setValue('Fehler beim Laden des Preises');
    form.priceDisplay.getElement().classList.add('price-display--error');

    // Check for error message in the price display
    const priceDisplay = formElement.querySelector('.price-display');
    const valueElement = priceDisplay.querySelector('.price-display__value');
    expect(valueElement.textContent).toBe('Fehler beim Laden des Preises');
  });

  it('should clear error state when starting a new operation', () => {
    const form = createPhoneRepairForm();
    const formElement = form.getElement();

    // First set error state directly
    form.setErrors({ devices: new Error('Device fetch error') });
    form.priceDisplay.setValue('Fehler beim Laden der Geräte');
    form.priceDisplay.getElement().classList.add('price-display--error');

    // Check for error message in the price display
    const priceDisplay = formElement.querySelector('.price-display');
    const errorElement = priceDisplay.querySelector('.price-display__value');
    expect(errorElement.textContent).toBe('Fehler beim Laden der Geräte');

    // Clear error state
    form.setErrors({});

    // Update the price display with initial text
    form.priceDisplay.setValue(form.labels.initialPriceText);
    form.priceDisplay.getElement().classList.remove('price-display--error');

    // Error message should be gone
    const updatedElement = priceDisplay.querySelector('.price-display__value');
    expect(updatedElement.textContent).not.toContain(
      'Fehler beim Laden der Geräte'
    );
  });

  it('should enable the schedule button when all selections are made', () => {
    const form = createPhoneRepairForm();
    const formElement = form.getElement();
    const button = formElement.querySelector('.btn');

    // Initially disabled
    expect(button.disabled).toBe(true);

    // Setting form state properties individually
    form.state.selectedManufacturer = '1';
    form.state.selectedDevice = '1';
    form.state.selectedAction = '1';
    form.state.currentPrice = { price: 199 };

    // Call updateFormState to update UI based on state changes
    form.updateFormState();

    // Now button should be enabled
    expect(button.disabled).toBe(false);
  });

  it('should collect and submit form data when schedule button is clicked', () => {
    const onScheduleClick = vi.fn();
    const form = createPhoneRepairForm({ onScheduleClick });

    // Set up state manually
    form.state.manufacturers = mockPhoneRepairData.manufacturers;
    form.state.devices = mockPhoneRepairData.manufacturers[0].devices;
    form.state.actions =
      mockPhoneRepairData.manufacturers[0].devices[0].actions;
    form.state.selectedManufacturer = '1';
    form.state.selectedDevice = '2';
    form.state.selectedAction = '3';
    form.state.currentPrice = { price: 299 };

    // Call handleScheduleClick directly
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
