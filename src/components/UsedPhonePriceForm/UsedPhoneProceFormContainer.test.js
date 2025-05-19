// src/components/UsedPhonePriceForm/UsedPhonePriceFormContainer.test.js
import { describe, it, expect, vi } from 'vitest';
import UsedPhonePriceFormContainer from './UsedPhonePriceFormContainer.js';
import { mockPhoneBuybackData } from '../../../__mocks__/phoneBuybackData.js';

describe('UsedPhonePriceFormContainer', () => {
  // Create mock services for testing
  const createMockService = () => ({
    fetchManufacturers: vi
      .fn()
      .mockResolvedValue(mockPhoneBuybackData.manufacturers),
    fetchDevices: vi
      .fn()
      .mockResolvedValue(mockPhoneBuybackData.manufacturers[0].devices),
    fetchConditions: vi
      .fn()
      .mockResolvedValue(
        mockPhoneBuybackData.manufacturers[0].devices[0].conditions
      ),
    fetchPrice: vi.fn().mockResolvedValue({ price: 399 }),
  });

  it('should create a form container with a form element', () => {
    const mockService = createMockService();

    // Create the container
    const container = new UsedPhonePriceFormContainer({
      service: mockService,
    });

    // Get the form element
    const element = container.getElement();

    // Check basic properties
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('used-phone-price-form');
  });

  it('should load manufacturers on initialization', () => {
    const mockService = createMockService();

    // Create the container
    new UsedPhonePriceFormContainer({
      service: mockService,
    });

    // Check that fetchManufacturers was called
    expect(mockService.fetchManufacturers).toHaveBeenCalled();
  });

  it('should load devices when manufacturer is selected', async () => {
    const mockService = createMockService();

    // Create the container
    const container = new UsedPhonePriceFormContainer({
      service: mockService,
    });

    // Call the manufacturer change handler
    await container.handleManufacturerChange('1');

    // Verify that fetchDevices was called with the right parameter
    expect(mockService.fetchDevices).toHaveBeenCalledWith('1');
  });

  it('should load conditions when device is selected', async () => {
    const mockService = createMockService();

    // Create the container
    const container = new UsedPhonePriceFormContainer({
      service: mockService,
    });

    // Call the device change handler
    await container.handleDeviceChange('2');

    // Verify that fetchConditions was called with the right parameter
    expect(mockService.fetchConditions).toHaveBeenCalledWith('2');
  });

  it('should load price when condition is selected', async () => {
    const mockService = createMockService();

    // Create the container
    const container = new UsedPhonePriceFormContainer({
      service: mockService,
    });

    // Call the condition change handler
    await container.handleConditionChange('3');

    // Verify that fetchPrice was called with the right parameter
    expect(mockService.fetchPrice).toHaveBeenCalledWith('3');
  });

  it('should handle errors when loading devices fails', async () => {
    // Create a mock service that will fail on fetchDevices
    const errorService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneBuybackData.manufacturers),
      fetchDevices: vi.fn().mockRejectedValue(new Error('Device fetch error')),
      fetchConditions: vi.fn().mockResolvedValue([]),
      fetchPrice: vi.fn().mockResolvedValue(null),
    };

    // Create the container
    const container = new UsedPhonePriceFormContainer({
      service: errorService,
    });

    // Spy on the form's setErrors method
    const setErrorsSpy = vi.spyOn(container.form, 'setErrors');

    // Call the manufacturer change handler which will trigger device loading
    await container.handleManufacturerChange('1');

    // Verify that setErrors was called at least once
    expect(setErrorsSpy).toHaveBeenCalled();

    // Verify that the error object matches the actual implementation structure
    const firstCallArg = setErrorsSpy.mock.calls[0][0];
    expect(firstCallArg).toHaveProperty('manufacturers');
    expect(firstCallArg.manufacturers).toBeNull();
  });

  it('should handle form submission', () => {
    // Create a callback spy
    const onSubmitSpy = vi.fn();
    const mockService = createMockService();

    // Create the container
    const container = new UsedPhonePriceFormContainer({
      service: mockService,
      onSubmit: onSubmitSpy,
    });

    // Create form data
    const formData = {
      manufacturerId: '1',
      deviceId: '2',
      conditionId: '3',
      price: 399,
      manufacturerName: 'Apple',
      deviceName: 'iPhone 13',
      conditionName: 'Good',
    };

    // Call the submit handler
    container.handleSubmit(formData);

    // Verify that the callback was called with the form data
    expect(onSubmitSpy).toHaveBeenCalledWith(formData);
  });

  it('should update price callback when price changes', () => {
    // Create a callback spy
    const onPriceChangeSpy = vi.fn();
    const mockService = createMockService();

    // Create the container
    const container = new UsedPhonePriceFormContainer({
      service: mockService,
      onPriceChange: onPriceChangeSpy,
    });

    // Set the form container data to include price
    const priceData = { price: 399 };
    const newState = {
      data: { price: priceData },
      loading: {},
      error: {},
    };
    const prevState = {
      data: {},
      loading: {},
      error: {},
    };

    // Call handleStateChange directly
    container.handleStateChange(newState, prevState);

    // Verify that the callback was called with the price data
    expect(onPriceChangeSpy).toHaveBeenCalledWith(priceData);
  });

  it('should update presentational component when state changes', () => {
    const mockService = createMockService();

    // Create the container
    const container = new UsedPhonePriceFormContainer({
      service: mockService,
    });

    // Spy on the form's methods
    const setLoadingSpy = vi.spyOn(container.form, 'setLoading');
    const setManufacturersSpy = vi.spyOn(container.form, 'setManufacturers');
    const setDevicesSpy = vi.spyOn(container.form, 'setDevices');
    const setConditionsSpy = vi.spyOn(container.form, 'setConditions');
    const setPriceSpy = vi.spyOn(container.form, 'setPrice');

    // Create new state with all data elements
    const testData = {
      manufacturers: mockPhoneBuybackData.manufacturers,
      devices: mockPhoneBuybackData.manufacturers[0].devices,
      conditions: mockPhoneBuybackData.manufacturers[0].devices[0].conditions,
      price: { price: 399 },
    };

    const newState = {
      data: testData,
      loading: { manufacturers: false },
      error: {},
    };

    const prevState = {
      data: {},
      loading: {},
      error: {},
    };

    // Call handleStateChange directly
    container.handleStateChange(newState, prevState);

    // Verify that all form update methods were called with correct data
    expect(setLoadingSpy).toHaveBeenCalled();
    expect(setManufacturersSpy).toHaveBeenCalledWith(testData.manufacturers);
    expect(setDevicesSpy).toHaveBeenCalledWith(testData.devices);
    expect(setConditionsSpy).toHaveBeenCalledWith(testData.conditions);
    expect(setPriceSpy).toHaveBeenCalledWith(testData.price);
  });
});
