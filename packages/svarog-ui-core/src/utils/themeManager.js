/**
 * Core Theme Manager - handles theme registration and switching
 * @module themeManager
 */

class CoreThemeManager {
  constructor() {
    this.themes = new Map();
    this.currentTheme = null;
    this.observers = new Set();
  }

  /**
   * Register a theme
   * @param {string} name - Theme name
   * @param {Object} theme - Theme object with apply() method
   */
  register(name, theme) {
    if (!theme || typeof theme.apply !== 'function') {
      throw new Error(`Theme "${name}" must have an apply() method`);
    }
    this.themes.set(name, theme);
    
    // Auto-apply first theme
    if (this.themes.size === 1 && !this.currentTheme) {
      this.switch(name);
    }
  }

  /**
   * Switch to a registered theme
   * @param {string} name - Theme name
   */
  switch(name) {
    const theme = this.themes.get(name);
    if (!theme) {
      throw new Error(`Theme "${name}" is not registered`);
    }
    
    // Remove current theme if exists
    if (this.currentTheme && this.currentTheme !== name) {
      const currentThemeObj = this.themes.get(this.currentTheme);
      if (currentThemeObj && typeof currentThemeObj.remove === 'function') {
        currentThemeObj.remove();
      }
    }
    
    theme.apply();
    this.currentTheme = name;
    
    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themechange', {
        detail: { theme: name }
      }));
    }
  }

  /**
   * Get current theme name
   * @returns {string|null}
   */
  getCurrent() {
    return this.currentTheme;
  }

  /**
   * Get all registered theme names
   * @returns {string[]}
   */
  getRegistered() {
    return Array.from(this.themes.keys());
  }
}

// Export singleton instance
export const ThemeManager = new CoreThemeManager();

// Export convenience functions
export const registerTheme = (name, theme) => ThemeManager.register(name, theme);
export const switchTheme = (name) => ThemeManager.switch(name);
export const getCurrentTheme = () => ThemeManager.getCurrent();
