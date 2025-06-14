// packages/svarog-ui/src/index.js
/**
 * Complete Svarog UI package with default theme
 * This package includes everything users need to get started quickly
 */

// Re-export everything from core
export * from 'svarog-ui-core';

// Static imports for better compatibility
import defaultTheme from '@svarog-ui/theme-default';
import { themeManager } from 'svarog-ui-core';

// Register and apply default theme when this package is imported
if (typeof document !== 'undefined') {
  try {
    // Your themeManager doesn't have a register method, so just apply the theme
    defaultTheme.apply();
    console.log('[Svarog UI] Default theme applied automatically');
  } catch (error) {
    console.warn(
      '[Svarog UI] Failed to auto-apply default theme:',
      error.message
    );
  }
}

// Export theme for manual control if needed
export { defaultTheme };

// Helper function to load theme (with better error handling)
export const loadTheme = async (themeName = 'default') => {
  try {
    if (themeName === 'default' && defaultTheme) {
      // For default theme, just apply it directly
      defaultTheme.apply();
      return true;
    }

    // For other themes, use the themeManager's load method
    return await themeManager.load(themeName);
  } catch (error) {
    console.error(`Failed to load theme "${themeName}":`, error);
    throw error;
  }
};

// For backward compatibility - redirect old theme functions
export const switchTheme = (themeName) => {
  console.warn(
    'switchTheme() from svarog-ui is deprecated. Use ThemeManager.switch() or loadTheme() instead.'
  );

  // For backward compatibility, only support 'default' from this package
  if (themeName === 'default' && defaultTheme) {
    defaultTheme.apply();
    return true;
  } else {
    console.error(
      `Theme "${themeName}" not included in svarog-ui. Install @svarog-ui/theme-${themeName} separately and use loadTheme().`
    );
    return false;
  }
};

export const getCurrentTheme = () => {
  console.warn(
    'getCurrentTheme() from svarog-ui is deprecated. Use themeManager.getCurrentTheme() instead.'
  );

  return themeManager.getCurrentTheme();
};
