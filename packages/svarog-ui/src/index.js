// Re-export everything from core
export * from 'svarog-ui-core';

// Import and auto-apply default theme
import defaultTheme from '@svarog-ui/theme-default';

// Auto-apply default theme when this package is imported
if (typeof document !== 'undefined') {
  defaultTheme.apply();
}

// Export theme for manual control if needed
export { defaultTheme };

export const switchTheme = (themeName) => {
  console.warn('switchTheme is deprecated. Use ThemeManager.switch() instead.');
  // For backward compat, only support 'default' from this package
  if (themeName === 'default') {
    defaultTheme.apply();
  } else {
    console.error(
      `Theme "${themeName}" not included in svarog-ui. Install @svarog-ui/theme-${themeName} separately.`
    );
  }
};
