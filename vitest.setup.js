// vitest.setup.js
// Global setup for vitest tests

import { vi, beforeEach, expect } from 'vitest';

// Store the original vitest expect to prevent infinite recursion
const originalExpect = expect;

// Match some Jest globals with Vitest equivalents
global.expect.stringContaining = (value) =>
  expect.stringMatching(
    new RegExp(String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  );

// FIXED: Prevent infinite recursion by using original expect reference
// The problem was that global.expect.objectContaining was calling itself
global.expect.objectContaining = (expected) =>
  originalExpect.objectContaining(expected);
global.expect.arrayContaining = (expected) =>
  originalExpect.arrayContaining(expected);

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
