// src/components/UsedPhonePriceForm/UsedPhonePriceFormContainer.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import createUsedPhonePriceFormContainer from './UsedPhonePriceFormContainer.js';
import { mockPhoneBuybackData } from '../../../__mocks__/phoneBuybackData.js';

describe('UsedPhonePriceFormContainer', () => {
  // Create mock services for testing
  let mockService;
  let container;

  beforeEach(() => {
    // Create a standard mock service with immediate responses
    mockService = {
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
    };
  });

  afterEach(() => {
    if (container && typeof container.destroy === 'function') {
      container.destroy();
    }
    container = null;
    vi.clearAllMocks();
  });

  it('should create a container with form element', async () => {
    container = createUsedPhonePriceFormContainer({
      service: mockService,
    });

    const element = container.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('used-phone-price-form')).toBe(true);

    // Wait a bit for async initialization
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  it('should load manufacturers on initialization', async () => {
    container = createUsedPhonePriceFormContainer({
      service: mockService,
    });

    // Wait for initialization to complete
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Verify that fetchManufacturers was called
    expect(mockService.fetchManufacturers).toHaveBeenCalled();
  });

  it('should handle manufacturer selection and load devices', async () => {
    // Mock the service method to track calls
    mockService.fetchDevices.mockClear();

    container = createUsedPhonePriceFormContainer({
      service: mockService,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Directly call the handleManufacturerChange method
    await container.handleManufacturerChange('1');

    // Verify fetchDevices was called
    expect(mockService.fetchDevices).toHaveBeenCalledWith('1');
  });

  it('should handle device selection and load conditions', async () => {
    // Clear any previous calls
    mockService.fetchConditions.mockClear();

    container = createUsedPhonePriceFormContainer({
      service: mockService,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // First, select a manufacturer
    await container.handleManufacturerChange('1');

    // Now test device selection
    await container.handleDeviceChange('2');

    // Verify fetchConditions was called
    expect(mockService.fetchConditions).toHaveBeenCalledWith('2');
  });

  it('should handle condition selection and load price', async () => {
    // Clear any previous calls
    mockService.fetchPrice.mockClear();

    container = createUsedPhonePriceFormContainer({
      service: mockService,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Go through the full flow: manufacturer -> device -> condition
    await container.handleManufacturerChange('1');
    await container.handleDeviceChange('2');
    await container.handleConditionChange('3');

    // Verify fetchPrice was called
    expect(mockService.fetchPrice).toHaveBeenCalledWith('3');
  });

  it('should handle errors when loading devices fails', async () => {
    // Create mock service that will fail on fetchDevices
    const errorService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneBuybackData.manufacturers),
      fetchDevices: vi.fn().mockRejectedValue(new Error('Device fetch error')),
      fetchConditions: vi.fn().mockResolvedValue([]),
      fetchPrice: vi.fn().mockResolvedValue(null),
    };

    container = createUsedPhonePriceFormContainer({
      service: errorService,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Spy on the form's setErrors method
    container.form.setErrors = vi.fn();

    // Directly call the handler method to trigger the error
    try {
      await container.handleManufacturerChange('1');
    } catch (error) {
      // Expected error, ignore it
    }

    // Give time for async operations
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Verify the form shows error state
    expect(container.form.setErrors).toHaveBeenCalledWith({
      devices: 'Device fetch error',
    });
  });

  it('should handle form submission', async () => {
    // Create a callback spy
    const onSubmitSpy = vi.fn();

    container = createUsedPhonePriceFormContainer({
      service: mockService,
      onSubmit: onSubmitSpy,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Get formData for the test
    const testFormData = {
      manufacturerId: '1',
      deviceId: '2',
      conditionId: '3',
      price: 399,
      manufacturerName: 'Apple',
      deviceName: 'iPhone 13',
      conditionName: 'Good',
    };

    // Directly call the submission handler
    container.handleSubmit(testFormData);

    // Verify callback was called
    expect(onSubmitSpy).toHaveBeenCalledWith(testFormData);
  });

  it('should call onPriceChange callback when price changes', async () => {
    // Create a callback spy
    const onPriceChangeSpy = vi.fn();

    container = createUsedPhonePriceFormContainer({
      service: mockService,
      onPriceChange: onPriceChangeSpy,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Go through the full flow to trigger price change
    await container.handleManufacturerChange('1');
    await container.handleDeviceChange('2');
    await container.handleConditionChange('1');

    // Wait for async price loading
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify the callback was called
    expect(onPriceChangeSpy).toHaveBeenCalled();
  });

  it('should clean up resources when destroyed', () => {
    container = createUsedPhonePriceFormContainer({
      service: mockService,
    });

    // Verify destroy method exists and can be called without error
    expect(typeof container.destroy).toBe('function');
    expect(() => container.destroy()).not.toThrow();
  });

  it('should provide container state access', async () => {
    container = createUsedPhonePriceFormContainer({
      service: mockService,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    const containerState = container.getContainerState();

    expect(containerState).toHaveProperty('currentManufacturer');
    expect(containerState).toHaveProperty('currentDevice');
    expect(containerState).toHaveProperty('currentCondition');
    expect(containerState).toHaveProperty('lastSuccessfulState');
    expect(containerState).toHaveProperty('formContainerState');
    expect(containerState).toHaveProperty('isLoading');
    expect(containerState).toHaveProperty('hasErrors');
  });

  it('should support manual refresh functionality', async () => {
    container = createUsedPhonePriceFormContainer({
      service: mockService,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Clear previous calls
    mockService.fetchManufacturers.mockClear();

    // Trigger manual refresh
    await container.refresh('manufacturers');

    // Verify refresh triggered a new API call
    expect(mockService.fetchManufacturers).toHaveBeenCalled();
  });

  it('should throw error when service is missing', () => {
    expect(() => {
      createUsedPhonePriceFormContainer({});
    }).toThrow('UsedPhonePriceFormContainer: service is required');
  });

  it('should throw error when service methods are missing', () => {
    const incompleteService = {
      fetchManufacturers: vi.fn(),
      // Missing other methods
    };

    expect(() => {
      createUsedPhonePriceFormContainer({
        service: incompleteService,
      });
    }).toThrow('UsedPhonePriceFormContainer: service missing methods');
  });

  it('should expose form methods for convenience', async () => {
    container = createUsedPhonePriceFormContainer({
      service: mockService,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Check that convenience methods exist
    expect(typeof container.updateForm).toBe('function');
    expect(typeof container.getFormState).toBe('function');

    // Test convenience methods
    const formState = container.getFormState();
    expect(formState).toHaveProperty('manufacturers');
    expect(formState).toHaveProperty('devices');
    expect(formState).toHaveProperty('conditions');
  });
});
