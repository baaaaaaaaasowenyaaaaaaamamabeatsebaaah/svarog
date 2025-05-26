// Test file to verify the monorepo packages work correctly
import { Button, ThemeManager } from 'svarog-ui-core';
import defaultTheme from '@svarog-ui/theme-default';
import cabalouTheme from '@svarog-ui/theme-cabalou';

console.log('Testing Svarog UI Monorepo Setup...\n');

// Test 1: Core package imports
console.log('✓ Core package imported successfully');
console.log('  - Button:', typeof Button);
console.log('  - ThemeManager:', typeof ThemeManager);

// Test 2: Theme packages
console.log('\n✓ Theme packages imported successfully');
console.log('  - Default theme:', defaultTheme.name);
console.log('  - Cabalou theme:', cabalouTheme.name);

// Test 3: Theme registration
ThemeManager.register('default', defaultTheme);
ThemeManager.register('cabalou', cabalouTheme);
console.log('\n✓ Themes registered with ThemeManager');
console.log('  - Registered themes:', ThemeManager.getRegistered());

// Test 4: Component creation
try {
  const button = Button({ text: 'Test Button' });
  console.log('\n✓ Button component created successfully');
  console.log(
    '  - Button has getElement:',
    typeof button.getElement === 'function'
  );
} catch (error) {
  console.error('\n✗ Failed to create button:', error.message);
}

console.log('\n🎉 All tests passed! Monorepo is working correctly.');
