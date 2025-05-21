// vitest.setup.js
// Global setup for vitest tests

import { vi, beforeEach } from 'vitest';

// Match some Jest globals with Vitest equivalents
global.expect.stringContaining = (value) =>
  expect.stringMatching(
    new RegExp(String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  );

// Fix this line - was using objContaining instead of objectContaining
global.expect.objectContaining = (expected) =>
  expect.objectContaining(expected);
global.expect.arrayContaining = (expected) => expect.arrayContaining(expected);

// Add fetch mock helper functions to match jest functionality
global.mockFetch = (data, status = 200, ok = true) => {
  global.fetch = vi.fn();
  global.fetch.mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
  return global.fetch;
};

// Add reset for each test
beforeEach(() => {
  vi.resetAllMocks();
});
