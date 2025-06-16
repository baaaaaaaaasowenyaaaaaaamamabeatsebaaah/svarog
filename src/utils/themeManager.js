// src/utils/themeManager.js

/**
 * Environment detection
 */
const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';
const isNode = typeof process !== 'undefined' && process.versions?.node;

/**
 * Safe localStorage wrapper
 */
const safeStorage = {
  getItem: (key) => {
    try {
      return isBrowser && window.localStorage
        ? window.localStorage.getItem(key)
        : null;
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (isBrowser && window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
    } catch (error) {
      console.warn(
        '[Svarog UI] Could not save to localStorage:',
        error.message
      );
    }
    return false;
  },
};

/**
 * Safe event dispatcher
 */
const safeDispatch = (eventName, detail) => {
  try {
    if (isBrowser && window.dispatchEvent && window.CustomEvent) {
      const event = new window.CustomEvent(eventName, { detail });
      window.dispatchEvent(event);
      return true;
    }
  } catch (error) {
    console.warn(`[Svarog UI] Could not dispatch ${eventName}:`, error.message);
  }
  return false;
};

/**
 * Theme Manager Class
 */
class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.loadedThemes = new Map();
    this.listeners = new Set();

    // Only initialize in browser environment
    if (isBrowser) {
      this.initializeTheme();
    } else {
      console.log(
        '[Svarog UI] Running in Node.js environment - theme features limited'
      );
    }
  }

  /**
   * Initialize theme system
   */
  initializeTheme() {
    try {
      // Try to load saved theme
      const savedTheme = safeStorage.getItem('svarog-theme');

      if (savedTheme) {
        console.log(`[Svarog UI] Initializing theme: ${savedTheme}`);
        this.currentTheme = savedTheme;
      } else {
        console.log(
          '[Svarog UI] Using default theme due to no saved preference'
        );
        this.currentTheme = 'default';
      }

      // Save current theme
      safeStorage.setItem('svarog-theme', this.currentTheme);
      console.log(
        `[Svarog UI] Saved theme "${this.currentTheme}" to svarog-theme`
      );
    } catch (error) {
      console.warn('[Svarog UI] Theme initialization error:', error.message);
      this.currentTheme = 'default';
    }
  }

  /**
   * Switch to a theme
   */
  switchTheme(themeName) {
    if (!isBrowser) {
      console.warn(
        '[Svarog UI] Theme switching not available in Node.js environment'
      );
      return false;
    }

    try {
      const previousTheme = this.currentTheme;
      this.currentTheme = themeName;

      // Save to storage
      safeStorage.setItem('svarog-theme', themeName);

      // Dispatch event
      safeDispatch('themechange', {
        theme: themeName,
        previousTheme,
      });

      // Notify listeners
      this.listeners.forEach((callback) => {
        try {
          callback(themeName, previousTheme);
        } catch (error) {
          console.warn('[Svarog UI] Theme listener error:', error);
        }
      });

      return true;
    } catch (error) {
      console.warn('[Svarog UI] Theme switch failed:', error.message);
      return false;
    }
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.currentTheme || 'default';
  }

  /**
   * Get available theme names
   */
  getThemeNames() {
    return ['default', 'cabalou', 'muchandy', 'dark', 'light', 'red'];
  }

  /**
   * Add theme change listener
   */
  onThemeChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);

      // Return unsubscribe function
      return () => this.listeners.delete(callback);
    }
  }

  /**
   * Get CSS variable value
   */
  getThemeValue(variableName) {
    if (!isBrowser || !document.documentElement) {
      return null;
    }

    try {
      const value = getComputedStyle(document.documentElement).getPropertyValue(
        variableName
      );
      return value ? value.trim() : null;
    } catch {
      return null;
    }
  }

  /**
   * Set CSS variable
   */
  setThemeVariable(variableName, value) {
    if (!isBrowser || !document.documentElement) {
      return false;
    }

    try {
      document.documentElement.style.setProperty(variableName, value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Load theme dynamically
   */
  async loadTheme(themeName) {
    if (!isBrowser) {
      console.warn(
        '[Svarog UI] Dynamic theme loading not available in Node.js'
      );
      return false;
    }

    try {
      // Check if already loaded
      if (this.loadedThemes.has(themeName)) {
        this.switchTheme(themeName);
        return true;
      }

      // Try to load theme package
      const themeModule = await import(`@svarog-ui/theme-${themeName}`);
      const theme = themeModule.default;

      if (theme && typeof theme.apply === 'function') {
        this.loadedThemes.set(themeName, theme);
        theme.apply();
        this.switchTheme(themeName);
        return true;
      }

      throw new Error(`Invalid theme module: ${themeName}`);
    } catch (error) {
      console.warn(
        `[Svarog UI] Failed to load theme "${themeName}":`,
        error.message
      );
      return false;
    }
  }

  /**
   * Load custom theme
   */
  loadCustomTheme(name, themeObject) {
    if (!isBrowser) {
      return false;
    }

    try {
      if (themeObject && typeof themeObject.apply === 'function') {
        this.loadedThemes.set(name, themeObject);
        themeObject.apply();
        this.switchTheme(name);
        return true;
      }
      return false;
    } catch (error) {
      console.warn(`[Svarog UI] Failed to load custom theme "${name}":`, error);
      return false;
    }
  }

  /**
   * Check if required variables are available
   */
  checkRequiredVariables(variables = []) {
    if (!isBrowser) {
      return { available: [], missing: variables };
    }

    const available = [];
    const missing = [];

    variables.forEach((varName) => {
      const value = this.getThemeValue(varName);
      if (value && value !== 'initial' && value !== '') {
        available.push(varName);
      } else {
        missing.push(varName);
      }
    });

    return { available, missing };
  }
}

// Create singleton instance
const themeManager = new ThemeManager();

// Export convenience functions
export const getThemeNames = () => themeManager.getThemeNames();
export const switchTheme = (theme) => themeManager.switchTheme(theme);
export const getCurrentTheme = () => themeManager.getCurrentTheme();
export const setThemeVariable = (name, value) =>
  themeManager.setThemeVariable(name, value);
export const loadTheme = (theme) => themeManager.loadTheme(theme);
export const loadCustomTheme = (name, theme) =>
  themeManager.loadCustomTheme(name, theme);
export const checkRequiredVariables = (vars) =>
  themeManager.checkRequiredVariables(vars);
export const onThemeChange = (callback) => themeManager.onThemeChange(callback);

// Export the manager instance
export { themeManager };

// Environment info for debugging
export const themeEnvironment = {
  isBrowser,
  isNode,
  hasLocalStorage: isBrowser && !!window.localStorage,
  hasDocument: isBrowser && !!document,
  hasWindow: isBrowser && !!window,
};
