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
    const container = PhoneRepairFormContainer({
      service: mockService,
    });

    const element = container.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('phone-repair-form')).toBe(true);
  });

  it('should load manufacturers on initialization', async () => {
    // Create the container
    PhoneRepairFormContainer({
      service: mockService,
    });

    // Verify that fetchManufacturers was called
    expect(mockService.fetchManufacturers).toHaveBeenCalled();
  });

  it('should handle manufacturer selection and load devices', async () => {
    // Create a spy for the fetchDevices method
    vi.spyOn(mockService, 'fetchDevices');

    // Create container and get the form element
    const container = PhoneRepairFormContainer({
      service: mockService,
    });

    const element = container.getElement();

    // Find manufacturer select and simulate a change
    const manufacturerSelect = element.querySelector('#manufacturer');
    manufacturerSelect.value = '1';
    manufacturerSelect.dispatchEvent(new Event('change', { bubbles: true }));

    // Verify fetchDevices was called with the right parameter
    expect(mockService.fetchDevices).toHaveBeenCalledWith('1');
  });

  it('should handle device selection and load actions', async () => {
    // Create a spy for the fetchActions method
    vi.spyOn(mockService, 'fetchActions');

    // Create container and get the form element
    const container = PhoneRepairFormContainer({
      service: mockService,
    });

    const element = container.getElement();

    // Find device select and simulate a change
    const deviceSelect = element.querySelector('#device');
    deviceSelect.value = '2';
    deviceSelect.dispatchEvent(new Event('change', { bubbles: true }));

    // Verify fetchActions was called with the right parameter
    expect(mockService.fetchActions).toHaveBeenCalledWith('2');
  });

  it('should handle action selection and load price', async () => {
    // Create a spy for the fetchPrice method
    vi.spyOn(mockService, 'fetchPrice');

    // Create container and get the form element
    const container = PhoneRepairFormContainer({
      service: mockService,
    });

    const element = container.getElement();

    // Find action select and simulate a change
    const actionSelect = element.querySelector('#action');
    actionSelect.value = '3';
    actionSelect.dispatchEvent(new Event('change', { bubbles: true }));

    // Verify fetchPrice was called with the right parameter
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
    const container = PhoneRepairFormContainer({
      service: errorService,
    });

    // Get the form element
    const element = container.getElement();

    // Find manufacturer select and simulate a change to trigger device loading
    const manufacturerSelect = element.querySelector('#manufacturer');
    manufacturerSelect.value = '1';
    manufacturerSelect.dispatchEvent(new Event('change', { bubbles: true }));

    // Wait for the promise to resolve/reject
    await vi.waitFor(() => {
      // Error state should be visible in the form
      expect(element.classList.contains('phone-repair-form--error')).toBe(true);
    });
  });

  it('should handle submission when form is submitted', async () => {
    // Create a callback spy
    const onSubmitSpy = vi.fn();

    // Create the container
    const container = PhoneRepairFormContainer({
      service: mockService,
      onScheduleClick: onSubmitSpy,
    });

    // Get the form element
    const element = container.getElement();

    // Setup form with all required selections
    // First select manufacturer
    const manufacturerSelect = element.querySelector('#manufacturer');
    manufacturerSelect.value = '1';
    manufacturerSelect.dispatchEvent(new Event('change', { bubbles: true }));

    // Wait for devices to load and select a device
    await vi.waitFor(() => {
      const deviceSelect = element.querySelector('#device');
      deviceSelect.value = '2';
      deviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Wait for actions to load and select an action
    await vi.waitFor(() => {
      const actionSelect = element.querySelector('#action');
      actionSelect.value = '3';
      actionSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Wait for price to load and button to be enabled
    await vi.waitFor(() => {
      const button = element.querySelector('.btn');
      expect(button.disabled).toBe(false);

      // Click the button
      button.click();
    });

    // Verify that the callback was called
    expect(onSubmitSpy).toHaveBeenCalled();

    // Verify the structure of the data
    const submittedData = onSubmitSpy.mock.calls[0][0];
    expect(submittedData).toHaveProperty('manufacturer');
    expect(submittedData).toHaveProperty('device');
    expect(submittedData).toHaveProperty('service');
    expect(submittedData).toHaveProperty('price');
  });

  it('should call onPriceChange callback when price changes', async () => {
    // Create a callback spy
    const onPriceChangeSpy = vi.fn();

    // Create the container
    const container = PhoneRepairFormContainer({
      service: mockService,
      onPriceChange: onPriceChangeSpy,
    });

    // Get the form element
    const element = container.getElement();

    // Setup form with all required selections to trigger price load
    // First select manufacturer
    const manufacturerSelect = element.querySelector('#manufacturer');
    manufacturerSelect.value = '1';
    manufacturerSelect.dispatchEvent(new Event('change', { bubbles: true }));

    // Wait for devices to load and select a device
    await vi.waitFor(() => {
      const deviceSelect = element.querySelector('#device');
      deviceSelect.value = '2';
      deviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Wait for actions to load and select an action
    await vi.waitFor(() => {
      const actionSelect = element.querySelector('#action');
      actionSelect.value = '3';
      actionSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Wait for price to load
    await vi.waitFor(() => {
      // Verify that the callback was called with price data
      expect(onPriceChangeSpy).toHaveBeenCalled();
      expect(onPriceChangeSpy.mock.calls[0][0]).toHaveProperty('price');
    });
  });

  it('should clean up resources when destroyed', () => {
    // Create container
    const container = PhoneRepairFormContainer({
      service: mockService,
    });

    // Mock the form's destroy method
    const element = container.getElement();
    const originalRemove = element.remove;
    element.remove = vi.fn();

    // Call destroy
    container.destroy();

    // Verify element was cleaned up
    expect(element.remove).toHaveBeenCalled();

    // Restore original method
    element.remove = originalRemove;
  });
});
