// src/components/PhoneRepairForm/PhoneRepairForm.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PhoneRepairForm from './PhoneRepairForm.js';

describe('PhoneRepairForm component', () => {
  let mockData;

  beforeEach(() => {
    // Setup mock data for each test
    mockData = {
      manufacturers: [
        {
          id: 1,
          name: 'Apple',
          devices: [
            {
              id: 1,
              name: 'iPhone 13',
              manufacturerId: 1,
              actions: [
                {
                  id: 1,
                  name: 'Display Reparatur',
                  deviceId: 1,
                  prices: [{ id: 1, price: 269, actionId: 1 }],
                },
              ],
            },
          ],
        },
      ],
    };

    // Mock fetch
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url === '/api/manufacturers') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData.manufacturers),
        });
      }

      const deviceMatch = url.match(/\/api\/manufacturers\/(\d+)\/devices/);
      if (deviceMatch) {
        const manufacturerId = deviceMatch[1];
        const manufacturer = mockData.manufacturers.find(
          (m) => m.id.toString() === manufacturerId
        );
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(manufacturer ? manufacturer.devices : []),
        });
      }

      const actionMatch = url.match(/\/api\/devices\/(\d+)\/actions/);
      if (actionMatch) {
        const deviceId = actionMatch[1];
        let actions = [];
        for (const manufacturer of mockData.manufacturers) {
          const device = manufacturer.devices.find(
            (d) => d.id.toString() === deviceId
          );
          if (device) {
            actions = device.actions;
            break;
          }
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(actions),
        });
      }

      const priceMatch = url.match(/\/api\/actions\/(\d+)\/price/);
      if (priceMatch) {
        const actionId = priceMatch[1];
        let price = null;
        outerLoop: for (const manufacturer of mockData.manufacturers) {
          for (const device of manufacturer.devices) {
            for (const action of device.actions) {
              if (
                action.id.toString() === actionId &&
                action.prices &&
                action.prices.length > 0
              ) {
                price = { price: action.prices[0].price };
                break outerLoop;
              }
            }
          }
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(price || { price: 0 }),
        });
      }

      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      });
    });
  });

  it('should create a phone repair form element', () => {
    const form = new PhoneRepairForm({});

    const element = form.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('phone-repair-form');
  });

  it('should initialize with custom labels', () => {
    const customLabels = {
      title: 'Custom Title',
      priceLabel: 'Custom Price:',
    };

    const form = new PhoneRepairForm({
      labels: customLabels,
    });

    const element = form.getElement();
    const titleElement = element.querySelector('.phone-repair-form__title');

    expect(titleElement.textContent).toBe(customLabels.title);
  });

  it('should load manufacturers on initialization', async () => {
    const form = new PhoneRepairForm({});
    document.body.appendChild(form.getElement());

    // Wait for manufacturers to load
    await vi.runAllTimersAsync();

    // Verify fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith('/api/manufacturers');
  });

  it('should enable device select when manufacturer is selected', async () => {
    const form = new PhoneRepairForm({});
    document.body.appendChild(form.getElement());

    // Wait for manufacturers to load
    await vi.runAllTimersAsync();

    // Select a manufacturer
    form.handleManufacturerChange('1'); // Apple

    // Wait for async operations
    await vi.runAllTimersAsync();

    // Verify fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith('/api/manufacturers/1/devices');
  });

  it('should enable action select when device is selected', async () => {
    const form = new PhoneRepairForm({});
    document.body.appendChild(form.getElement());

    // Set up manufacturer first
    form.handleManufacturerChange('1'); // Apple
    await vi.runAllTimersAsync();

    // Then select a device
    form.handleDeviceChange('1'); // iPhone 13
    await vi.runAllTimersAsync();

    // Verify fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith('/api/devices/1/actions');
  });

  it('should display price when action is selected', async () => {
    const mockOnPriceChange = vi.fn();
    const form = new PhoneRepairForm({
      onPriceChange: mockOnPriceChange,
    });
    document.body.appendChild(form.getElement());

    // Set up selection chain
    form.handleManufacturerChange('1'); // Apple
    await vi.runAllTimersAsync();

    form.handleDeviceChange('1'); // iPhone 13
    await vi.runAllTimersAsync();

    form.handleActionChange('1'); // Display Reparatur
    await vi.runAllTimersAsync();

    // Verify fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith('/api/actions/1/price');

    // Callback should be called with price data
    expect(mockOnPriceChange).toHaveBeenCalledTimes(1);
    expect(mockOnPriceChange).toHaveBeenCalledWith(
      expect.objectContaining({
        price: 269,
      })
    );
  });

  it('should update step indicator as selections change', async () => {
    const form = new PhoneRepairForm({});
    const element = form.getElement();
    document.body.appendChild(element);

    // Initial state: first step active, none completed
    expect(form.stepsIndicator.props.steps[0].completed).toBe(false);
    expect(form.stepsIndicator.props.activeIndex).toBe(0);

    // Select manufacturer
    form.handleManufacturerChange('1'); // Apple
    await vi.runAllTimersAsync();

    // After manufacturer selection: first step completed, second step active
    expect(form.stepsIndicator.props.steps[0].completed).toBe(true);
    expect(form.stepsIndicator.props.activeIndex).toBe(1);

    // Select device
    form.handleDeviceChange('1'); // iPhone 13
    await vi.runAllTimersAsync();

    // After device selection: first two steps completed, third step active
    expect(form.stepsIndicator.props.steps[1].completed).toBe(true);
    expect(form.stepsIndicator.props.activeIndex).toBe(2);
  });

  it('should handle error states', async () => {
    // Override service to simulate error
    const form = new PhoneRepairForm({});
    form.service.fetchDevices = vi
      .fn()
      .mockRejectedValue(new Error('Failed to fetch devices'));

    document.body.appendChild(form.getElement());

    // Select a manufacturer to trigger device fetch (which will fail)
    form.handleManufacturerChange('1'); // Apple
    await vi.runAllTimersAsync();

    // Form should have error state
    expect(form.hasAnyError()).toBe(true);
    expect(form.state.error.devices).toBe('Failed to fetch devices');
  });
});
