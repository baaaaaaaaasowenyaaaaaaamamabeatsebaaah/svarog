import { THEMES } from '../constants/themes.js';

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.defaultTheme = THEMES.default;
  }

  /**
   * Get the list of available theme names.
   * @returns {Array<string>} An array of theme names.
   */
  getThemeNames() {
    return Object.values(THEMES);
  }

  /**
   * Switch to a specified theme.
   * @param {string} theme - The name of the theme to switch to.
   */
  switchTheme(theme) {
    const themeNames = this.getThemeNames();

    // Validate theme
    if (!theme || !themeNames.includes(theme)) {
      console.warn(`Theme "${theme}" not found. Switching to default theme.`);
      theme = this.defaultTheme;
    }

    // Remove current theme if exists
    if (this.currentTheme) {
      document.body.classList.remove(`${this.currentTheme}-theme`);
    }

    // Add new theme
    const themeClass = `${theme}-theme`;
    document.body.classList.add(themeClass);
    this.currentTheme = theme;

    // Log theme change for debugging
    console.log('Theme switched:', {
      previousTheme: this.currentTheme,
      newTheme: theme,
      appliedClass: themeClass,
      bodyClasses: document.body.className,
    });
  }

  /**
   * Get current active theme name.
   * @returns {string} Current theme name
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Get computed theme value for a CSS variable.
   * @param {string} cssVariable - The CSS variable name
   * @returns {string} The computed value
   */
  getThemeValue(cssVariable) {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(cssVariable)
      .trim();
  }
}

// Create singleton instance
export const themeManager = new ThemeManager();

// Initialize default theme
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    themeManager.switchTheme(themeManager.defaultTheme);
  });
}

// Export functions
export const getThemeNames = () => themeManager.getThemeNames();
export const switchTheme = (theme) => themeManager.switchTheme(theme);
