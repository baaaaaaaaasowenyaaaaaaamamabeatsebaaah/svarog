// src/components/PhoneRepairForm/PhoneRepairFormContainer.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PhoneRepairFormContainer from './PhoneRepairFormContainer.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

describe('PhoneRepairFormContainer', () => {
  // Create mock services for testing
  let mockService;

  beforeEach(() => {
    // Create a standard mock service
    mockService = {
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
  });

  it('should create a container with form element', () => {
    const container = new PhoneRepairFormContainer({
      service: mockService,
    });

    const element = container.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('phone-repair-form')).toBe(true);
  });

  it('should load manufacturers on initialization', async () => {
    // Create the container
    new PhoneRepairFormContainer({
      service: mockService,
    });

    // Verify that fetchManufacturers was called
    expect(mockService.fetchManufacturers).toHaveBeenCalled();
  });

  it('should load devices when manufacturer is selected', async () => {
    // Create the container
    const container = new PhoneRepairFormContainer({
      service: mockService,
    });

    // Call the manufacturer change handler
    await container.handleManufacturerChange('1');

    // Verify that fetchDevices was called with the right parameter
    expect(mockService.fetchDevices).toHaveBeenCalledWith('1');
  });

  it('should load actions when device is selected', async () => {
    // Create the container
    const container = new PhoneRepairFormContainer({
      service: mockService,
    });

    // Call the device change handler
    await container.handleDeviceChange('2');

    // Verify that fetchActions was called with the right parameter
    expect(mockService.fetchActions).toHaveBeenCalledWith('2');
  });

  it('should load price when action is selected', async () => {
    // Create the container
    const container = new PhoneRepairFormContainer({
      service: mockService,
    });

    // Call the action change handler
    await container.handleActionChange('3');

    // Verify that fetchPrice was called with the right parameter
    expect(mockService.fetchPrice).toHaveBeenCalledWith('3');
  });

  it('should handle errors when loading devices fails', async () => {
    // Create mock service that will fail on fetchDevices
    const errorService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneRepairData.manufacturers),
      fetchDevices: vi.fn().mockRejectedValue(new Error('Device fetch error')),
      fetchActions: vi.fn().mockResolvedValue([]),
      fetchPrice: vi.fn().mockResolvedValue(null),
    };

    // Create the container
    const container = new PhoneRepairFormContainer({
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

  it('should handle submission when form is submitted', async () => {
    // Create a callback spy
    const onSubmitSpy = vi.fn();

    // Create the container
    const container = new PhoneRepairFormContainer({
      service: mockService,
      onScheduleClick: onSubmitSpy,
    });

    // Create form data
    const formData = {
      manufacturer: { id: '1', name: 'Apple' },
      device: { id: '2', name: 'iPhone 13' },
      service: { id: '3', name: 'Display Repair' },
      price: { price: 299 },
      timestamp: expect.any(String),
    };

    // Call the handleScheduleClick method directly
    container.handleScheduleClick(formData);

    // Verify that the callback was called with the form data
    expect(onSubmitSpy).toHaveBeenCalledWith(formData);
  });

  it('should update price callback when price changes', async () => {
    // Create a callback spy
    const onPriceChangeSpy = vi.fn();

    // Create the container
    const container = new PhoneRepairFormContainer({
      service: mockService,
      onPriceChange: onPriceChangeSpy,
    });

    // Set the form container data to include price
    const newState = {
      data: { price: { price: 299 } },
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
    expect(onPriceChangeSpy).toHaveBeenCalledWith({ price: 299 });
  });

  it('should update presentational component when state changes', async () => {
    // Create the container
    const container = new PhoneRepairFormContainer({
      service: mockService,
    });

    // Spy on the form's methods
    const setLoadingSpy = vi.spyOn(container.form, 'setLoading');
    const setManufacturersSpy = vi.spyOn(container.form, 'setManufacturers');
    const setDevicesSpy = vi.spyOn(container.form, 'setDevices');
    const setActionsSpy = vi.spyOn(container.form, 'setActions');
    const setPriceSpy = vi.spyOn(container.form, 'setPrice');

    // Create new state with all data elements
    const newState = {
      data: {
        manufacturers: mockPhoneRepairData.manufacturers,
        devices: mockPhoneRepairData.manufacturers[0].devices,
        actions: mockPhoneRepairData.manufacturers[0].devices[0].actions,
        price: { price: 299 },
      },
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

    // Verify that all form update methods were called
    expect(setLoadingSpy).toHaveBeenCalled();
    expect(setManufacturersSpy).toHaveBeenCalledWith(
      mockPhoneRepairData.manufacturers
    );
    expect(setDevicesSpy).toHaveBeenCalledWith(
      mockPhoneRepairData.manufacturers[0].devices
    );
    expect(setActionsSpy).toHaveBeenCalledWith(
      mockPhoneRepairData.manufacturers[0].devices[0].actions
    );
    expect(setPriceSpy).toHaveBeenCalledWith({ price: 299 });
  });
});
