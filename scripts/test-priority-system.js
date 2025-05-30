// test-priority-system.js
// Test file to verify the style priority system works correctly

import { Button } from 'svarog-ui-core';
import muchandyTheme from '@svarog-ui/theme-muchandy';
import { debugStyleOrder } from 'svarog-ui-core/utils/styleInjection';

console.log('Testing style priority system...');
console.log('================================\n');

// Create container for test
const container = document.createElement('div');
container.style.padding = '20px';
document.body.appendChild(container);

// Step 1: Create a button before theme (should use component defaults)
console.log('Step 1: Creating button BEFORE theme application');
const button1 = Button({ text: 'Before Theme', className: 'test-button-1' });
container.appendChild(button1.getElement());

// Check initial styles
const styles1 = window.getComputedStyle(button1.getElement());
console.log('Initial button border:', styles1.border);
console.log('Initial button border-width:', styles1.borderWidth);

// Step 2: Apply theme
console.log('\nStep 2: Applying muchandy theme');
muchandyTheme.apply();

// Step 3: Create another button after theme
console.log('\nStep 3: Creating button AFTER theme application');
const button2 = Button({ text: 'After Theme', className: 'test-button-2' });
container.appendChild(button2.getElement());

// Check styles after theme
const styles2 = window.getComputedStyle(button2.getElement());
console.log('Themed button border:', styles2.border);
console.log('Themed button border-width:', styles2.borderWidth);

// Step 4: Check that first button also got themed
console.log('\nStep 4: Checking if first button was updated');
const styles1Updated = window.getComputedStyle(button1.getElement());
console.log('First button border after theme:', styles1Updated.border);
console.log(
  'First button border-width after theme:',
  styles1Updated.borderWidth
);

// Step 5: Debug style order
console.log('\n');
debugStyleOrder();

// Step 6: Verify cascade order
console.log('\nStep 6: Verifying cascade order');
const allStyles = document.head.querySelectorAll('style[data-svarog]');
const styleInfo = Array.from(allStyles).map((style) => ({
  id: style.id,
  priority: style.getAttribute('data-priority'),
  priorityValue: parseInt(style.getAttribute('data-priority-value')),
}));

console.log('Style tags in order:');
styleInfo.forEach((info) => {
  console.log(`  ${info.id}: ${info.priority} (${info.priorityValue})`);
});

// Verify order is correct
const isOrderCorrect = styleInfo.every((style, index) => {
  if (index === 0) return true;
  return style.priorityValue >= styleInfo[index - 1].priorityValue;
});

console.log(`\nOrder verification: ${isOrderCorrect ? '✅ PASS' : '❌ FAIL'}`);

// Step 7: Summary
console.log('\n================================');
console.log('SUMMARY:');
console.log(
  `Base styles injected: ${document.querySelector('[data-svarog="svarog-base"]') ? '✅' : '❌'}`
);
console.log(
  `Component styles injected: ${document.querySelector('[data-svarog="button"]') ? '✅' : '❌'}`
);
console.log(
  `Theme styles injected: ${document.querySelector('[data-svarog="theme-muchandy"]') ? '✅' : '❌'}`
);
console.log(`Style cascade order correct: ${isOrderCorrect ? '✅' : '❌'}`);
console.log(
  `Theme overrides working: ${styles2.borderWidth === '0px' || styles2.border === '0' || styles2.border === 'none' ? '✅' : '❌'}`
);
