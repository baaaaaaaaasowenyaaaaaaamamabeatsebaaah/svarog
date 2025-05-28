// vitest.setup.js
import { expect } from 'vitest';

// Store the original expect methods BEFORE any global assignments
const originalObjectContaining = expect.objectContaining;
const originalArrayContaining = expect.arrayContaining;
const originalStringContaining = expect.stringContaining;
const originalAny = expect.any;

// Now set up global expect without causing recursion
global.expect = expect;

// Assign the original methods directly to avoid recursion
global.expect.objectContaining = originalObjectContaining;
global.expect.arrayContaining = originalArrayContaining;
global.expect.stringContaining = originalStringContaining;
global.expect.any = originalAny;

// Add other methods if needed
global.expect.anything = expect.anything;
global.expect.stringMatching = expect.stringMatching;
