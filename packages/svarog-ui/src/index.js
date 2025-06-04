// packages/svarog-ui/src/index.js
// Re-export everything from core
export * from 'svarog-ui-core';

// Import and auto-apply default theme
import defaultTheme from '@svarog-ui/theme-default';

// Import theme manager from core
import { ThemeManager } from 'svarog-ui-core';

// Register and apply default theme when this package is imported
if (typeof document !== 'undefined') {
  ThemeManager.register('default', defaultTheme);
  defaultTheme.apply();
}

// Export theme for manual control if needed
export { defaultTheme };

// For backward compatibility - redirect old theme functions
export const switchTheme = (themeName) => {
  console.warn(
    'switchTheme() is deprecated. Use ThemeManager.switch() instead.'
  );

  // For backward compatibility, only support 'default' from this package
  if (themeName === 'default') {
    defaultTheme.apply();
  } else {
    console.error(
      `Theme "${themeName}" not included in svarog-ui. Install @svarog-ui/theme-${themeName} separately.`
    );
  }
};

export const getCurrentTheme = () => {
  console.warn(
    'getCurrentTheme() is deprecated. Use ThemeManager.getCurrent() instead.'
  );
  return ThemeManager.getCurrent();
};
