// src/components/PhoneRepairForm/PhoneRepairForm.test.js
import { describe, it, expect, vi } from 'vitest';
import PhoneRepairFormFactory from '../../factories/PhoneRepairFormFactory.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

describe('PhoneRepairForm component', () => {
  it('should create a phone repair form element', () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
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
      priceLabel: 'Custom Price:',
    };

    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
      labels: customLabels,
    });

    const element = form.getElement();
    const titleElement = element.querySelector('.phone-repair-form__title');
    const priceLabelElement = element.querySelector('.price-display__label');

    expect(titleElement.textContent).toBe(customLabels.title);
    expect(priceLabelElement.textContent).toBe(customLabels.priceLabel);
  });

  it('should properly set up form groups', () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
    });

    const element = form.getElement();
    const formGroups = element.querySelectorAll('.form-group');

    // Should have 3 form groups: manufacturer, device, action
    expect(formGroups.length).toBe(3);

    // Check that each form group has a label
    formGroups.forEach((group) => {
      const label = group.querySelector('.form-group__label');
      expect(label).not.toBeNull();
    });
  });

  it('should have a steps indicator', () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
    });

    const element = form.getElement();
    const stepsIndicator = element.querySelector('.steps-indicator');
    const steps = element.querySelectorAll('.steps-indicator__step');

    expect(stepsIndicator).not.toBeNull();
    expect(steps.length).toBe(3); // Should have 3 steps
  });

  it('should have a price display', () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
    });

    const element = form.getElement();
    const priceDisplay = element.querySelector('.price-display');

    expect(priceDisplay).not.toBeNull();
  });

  it('should call onPriceChange callback when provided', () => {
    const onPriceChange = vi.fn();
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
      onPriceChange,
    });

    // Manually trigger the price change handler
    const priceData = {
      price: 269,
      deviceName: 'iPhone 13',
      actionName: 'Display Reparatur',
      manufacturerName: 'Apple',
    };

    if (typeof form.props.onPriceChange === 'function') {
      form.props.onPriceChange(priceData);
    }

    expect(onPriceChange).toHaveBeenCalledWith(priceData);
  });

  it('should create with default labels when none provided', () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
    });

    expect(form.labels.title).toBe('Reparatur anfragen');
    expect(form.labels.manufacturerLabel).toBe('Hersteller:');
    expect(form.labels.deviceLabel).toBe('Modell:');
    expect(form.labels.serviceLabel).toBe('Service:');
  });

  it('should properly initialize state', () => {
    const form = PhoneRepairFormFactory.createWithMockData({
      mockData: mockPhoneRepairData,
    });

    expect(form.state).toEqual({
      manufacturers: [],
      devices: [],
      actions: [],
      selectedManufacturer: '',
      selectedDevice: '',
      selectedAction: '',
      currentPrice: null,
      loading: {
        manufacturers: false,
        devices: false,
        actions: false,
        price: false,
      },
      error: {
        manufacturers: null,
        devices: null,
        actions: null,
        price: null,
      },
    });
  });
});
