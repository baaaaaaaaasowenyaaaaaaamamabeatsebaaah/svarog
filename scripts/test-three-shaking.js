// Test file to verify tree shaking works
// Only import what you need
import { createButton, createInput } from './src/index.js';

console.log('Tree shaking test');
console.log('Button:', typeof createButton);
console.log('Input:', typeof createInput);

// Build this separately to see if unused components are excluded
