// src/utils/testUtils.js
/**
 * Utility functions for testing
 */
import { vi } from 'vitest';

/**
 * Creates a mock for fetch API that resolves with specified data
 * @param {Object} data - Data to return from mock fetch
 * @param {number} status - HTTP status code
 * @param {boolean} ok - Whether the response is ok
 * @returns {Function} - Mocked fetch function
 */
export function mockFetch(data, status = 200, ok = true) {
  const fetchMock = vi.fn();
  fetchMock.mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
  });

  return fetchMock;
}

/**
 * Wait for a specified time in tests
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Promise that resolves after the specified time
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock element methods for DOM testing
 * @param {Object} element - Element to mock methods on
 * @returns {Object} - The element with mocked methods
 */
export function mockElementMethods(element) {
  // Mock methods that might not exist in jsdom
  element.getBoundingClientRect = vi.fn().mockReturnValue({
    width: 120,
    height: 120,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
  });

  element.scrollIntoView = vi.fn();
  element.scrollTo = vi.fn();

  return element;
}

/**
 * Helper for working with form submission in tests
 * @param {HTMLFormElement} form - Form element
 * @param {Object} values - Form field values
 * @returns {Object} - Form submission result
 */
export function submitForm(form, values = {}) {
  // Set form field values
  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements[name];
    if (!field) {
      return;
    }

    if (field.type === 'checkbox') {
      field.checked = !!value;
    } else if (field.type === 'radio') {
      if (field instanceof RadioNodeList) {
        Array.from(field).forEach((radio) => {
          radio.checked = radio.value === value;
        });
      } else {
        field.checked = field.value === value;
      }
    } else {
      field.value = value;
    }

    // Dispatch input and change events
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Collect form data
  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    if (data[key] !== undefined) {
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(value);
    } else {
      data[key] = value;
    }
  }

  // Dispatch submit event
  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(submitEvent);

  return {
    data,
    defaultPrevented: submitEvent.defaultPrevented,
    event: submitEvent,
  };
}
