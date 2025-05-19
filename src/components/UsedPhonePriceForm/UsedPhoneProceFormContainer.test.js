// src/components/UsedPhonePriceForm/UsedPhonePriceFormContainer.test.js
import { describe, it, expect, vi } from 'vitest';
import UsedPhonePriceFormContainer from './UsedPhonePriceFormContainer.js';
import { mockPhoneBuybackData } from '../../../__mocks__/phoneBuybackData.js';

describe('UsedPhonePriceFormContainer', () => {
  it('should create a form container with a form element', () => {
    // Create a mock service
    const mockService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneBuybackData.manufacturers),
      fetchDevices: vi.fn().mockResolvedValue([]),
      fetchConditions: vi.fn().mockResolvedValue([]),
      fetchPrice: vi.fn().mockResolvedValue({ price: 100 }),
    };

    // Create the container directly
    const container = new UsedPhonePriceFormContainer({
      service: mockService,
    });

    // Get the form element
    const element = container.getElement();

    // Check basic properties
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('used-phone-price-form');
  });

  it('should load manufacturers on initialization', async () => {
    // Create a mock service that returns data
    const mockService = {
      fetchManufacturers: vi
        .fn()
        .mockResolvedValue(mockPhoneBuybackData.manufacturers),
      fetchDevices: vi.fn().mockResolvedValue([]),
      fetchConditions: vi.fn().mockResolvedValue([]),
      fetchPrice: vi.fn().mockResolvedValue({ price: 100 }),
    };

    // Check that fetchManufacturers was called
    expect(mockService.fetchManufacturers).toHaveBeenCalled();
  });
});
