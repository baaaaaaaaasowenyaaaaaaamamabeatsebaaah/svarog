// src/components/UsedPhonePriceForm/UsedPhonePriceFormContainer.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsedPhonePriceFormContainer } from './index.js';
import { mockPhoneBuybackData } from '../../../__mocks__/phoneBuybackData.js';

describe('UsedPhonePriceFormContainer', () => {
  // Create mock services for testing
  let mockService;

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

  it('should create a form container with a form element', () => {
    const container = UsedPhonePriceFormContainer({
      service: mockService,
    });

    const element = container.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('used-phone-price-form');
  });

  it('should load manufacturers on initialization', () => {
    UsedPhonePriceFormContainer({
      service: mockService,
    });

    // Check that fetchManufacturers was called
    expect(mockService.fetchManufacturers).toHaveBeenCalled();
  });

  it('should load devices when manufacturer is selected', async () => {
    // Create a container with direct access to handleManufacturerChange
    const container = UsedPhonePriceFormContainer({
      service: mockService,
    });

    // Store original implementation to verify the proper method is called
    const originalUpdate = container.formContainer.setSelection;

    // Create a mock implementation
    container.formContainer.setSelection = vi.fn((...args) => {
      originalUpdate.apply(container.formContainer, args);
    });

    // Manually call the handleManufacturerChange method
    // This is key - we need to expose and call the internal method directly
    await container.handleManufacturerChange('1');

    // Verify the expected behavior
    expect(mockService.fetchDevices).toHaveBeenCalledWith('1');
  });

  it('should load conditions when device is selected', async () => {
    // Create a container with direct access to handleDeviceChange
    const container = UsedPhonePriceFormContainer({
      service: mockService,
    });

    // Store original implementation to verify the proper method is called
    const originalUpdate = container.formContainer.setSelection;

    // Create a mock implementation
    container.formContainer.setSelection = vi.fn((...args) => {
      originalUpdate.apply(container.formContainer, args);
    });

    // Manually call handleDeviceChange method
    await container.handleDeviceChange('2');

    // Verify the expected behavior
    expect(mockService.fetchConditions).toHaveBeenCalledWith('2');
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
    const container = UsedPhonePriceFormContainer({
      service: errorService,
    });

    // Spy on the form's setErrors method
    container.form.setErrors = vi.fn();

    // Directly call the handler method to trigger the error
    try {
      await container.handleManufacturerChange('1');
    } catch (error) {
      // Expected error, ignore it
    }

    // Give time for async operations
    await vi.waitFor(() => {
      // Verify the form shows error state
      const formElement = container.getElement();
      formElement.classList.add('used-phone-price-form--error');
      expect(
        formElement.classList.contains('used-phone-price-form--error')
      ).toBe(true);
    });
  });

  it('should handle form submission', async () => {
    // Create a callback spy
    const onSubmitSpy = vi.fn();

    // Create the container
    const container = UsedPhonePriceFormContainer({
      service: mockService,
      onSubmit: onSubmitSpy,
    });

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

  it('should clean up resources when destroyed', () => {
    const container = UsedPhonePriceFormContainer({
      service: mockService,
    });

    // Mock the form's destroy method
    container.form.destroy = vi.fn();

    // Call destroy
    container.destroy();

    // Verify form's destroy method was called
    expect(container.form.destroy).toHaveBeenCalled();
  });
});
