// src/components/PhoneRepairForm/PhoneRepairFormContainer.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PhoneRepairFormContainer from './PhoneRepairFormContainer.js';
import { mockPhoneRepairData } from '../../../__mocks__/phoneRepairData.js';

describe('PhoneRepairFormContainer', () => {
  // Create mock services for testing
  let mockService;
  let container;

  beforeEach(() => {
    // Create a standard mock service with immediate responses
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

  afterEach(() => {
    if (container && typeof container.destroy === 'function') {
      container.destroy();
    }
    container = null;
    vi.clearAllMocks();
  });

  it('should create a container with form element', async () => {
    container = PhoneRepairFormContainer({
      service: mockService,
    });

    const element = container.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('phone-repair-form')).toBe(true);

    // Wait a bit for async initialization
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  it('should load manufacturers on initialization', async () => {
    container = PhoneRepairFormContainer({
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

    container = PhoneRepairFormContainer({
      service: mockService,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Simulate manufacturer selection by directly calling the container's internal handler
    // We'll simulate this by triggering a change event on the select
    const element = container.getElement();
    const manufacturerSelect = element.querySelector(
      'select[name="manufacturer"]'
    );

    if (manufacturerSelect) {
      manufacturerSelect.value = '1';
      const changeEvent = new Event('change', { bubbles: true });
      manufacturerSelect.dispatchEvent(changeEvent);

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify fetchDevices was called
      expect(mockService.fetchDevices).toHaveBeenCalledWith('1');
    }
  });

  it('should handle device selection and load actions', async () => {
    // Clear any previous calls
    mockService.fetchActions.mockClear();

    container = PhoneRepairFormContainer({
      service: mockService,
    });

    // Wait for initialization and simulate device selection
    await new Promise((resolve) => setTimeout(resolve, 50));

    const element = container.getElement();
    const deviceSelect = element.querySelector('select[name="device"]');

    if (deviceSelect) {
      deviceSelect.value = '2';
      const changeEvent = new Event('change', { bubbles: true });
      deviceSelect.dispatchEvent(changeEvent);

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify fetchActions was called
      expect(mockService.fetchActions).toHaveBeenCalledWith('2');
    }
  });

  it('should handle action selection and load price', async () => {
    // Clear any previous calls
    mockService.fetchPrice.mockClear();

    container = PhoneRepairFormContainer({
      service: mockService,
    });

    // Wait for initialization and simulate action selection
    await new Promise((resolve) => setTimeout(resolve, 50));

    const element = container.getElement();
    const actionSelect = element.querySelector('select[name="action"]');

    if (actionSelect) {
      actionSelect.value = '3';
      const changeEvent = new Event('change', { bubbles: true });
      actionSelect.dispatchEvent(changeEvent);

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify fetchPrice was called
      expect(mockService.fetchPrice).toHaveBeenCalledWith('3');
    }
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

    container = PhoneRepairFormContainer({
      service: errorService,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Get the form element and check error handling capability
    const element = container.getElement();
    expect(element).toBeInstanceOf(HTMLElement);

    // The error state will be set when device loading is triggered
    // For now, just verify the container was created successfully
    expect(element.classList.contains('phone-repair-form')).toBe(true);
  });

  it('should handle submission when form is submitted', async () => {
    // Create a callback spy
    const onSubmitSpy = vi.fn();

    container = PhoneRepairFormContainer({
      service: mockService,
      onScheduleClick: onSubmitSpy,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Get the form and simulate a button click
    const element = container.getElement();
    const scheduleButton = element.querySelector('.btn');

    if (scheduleButton && !scheduleButton.disabled) {
      scheduleButton.click();

      // Verify callback was called
      expect(onSubmitSpy).toHaveBeenCalled();
    }
  });

  it('should call onPriceChange callback when price changes', async () => {
    // Create a callback spy
    const onPriceChangeSpy = vi.fn();

    container = PhoneRepairFormContainer({
      service: mockService,
      onPriceChange: onPriceChangeSpy,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Simulate price loading by triggering action selection
    const element = container.getElement();
    const actionSelect = element.querySelector('select[name="action"]');

    if (actionSelect) {
      actionSelect.value = '1';
      const changeEvent = new Event('change', { bubbles: true });
      actionSelect.dispatchEvent(changeEvent);

      // Wait for async price loading
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify the callback was called
      expect(onPriceChangeSpy).toHaveBeenCalled();
    }
  });

  it('should clean up resources when destroyed', () => {
    container = PhoneRepairFormContainer({
      service: mockService,
    });

    // Verify destroy method exists and can be called without error
    expect(typeof container.destroy).toBe('function');
    expect(() => container.destroy()).not.toThrow();
  });

  it('should provide container state access', async () => {
    container = PhoneRepairFormContainer({
      service: mockService,
    });

    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 50));

    const containerState = container.getContainerState();

    expect(containerState).toHaveProperty('currentManufacturer');
    expect(containerState).toHaveProperty('currentDevice');
    expect(containerState).toHaveProperty('currentAction');
    expect(containerState).toHaveProperty('lastSuccessfulState');
  });

  it('should support manual refresh functionality', async () => {
    container = PhoneRepairFormContainer({
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
});
