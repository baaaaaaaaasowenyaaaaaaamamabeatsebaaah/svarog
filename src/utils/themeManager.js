// src/utils/themeManager.js

/**
 * Environment detection with test-friendly checks
 */
const isTestEnvironment = () => {
  return (
    typeof vi !== 'undefined' ||
    (typeof process !== 'undefined' &&
      process.env &&
      (process.env.NODE_ENV === 'test' || process.env.VITEST === 'true'))
  );
};

const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';
const isNode = typeof process !== 'undefined' && process.versions?.node;

/**
 * Enhanced safe localStorage wrapper with test support
 */
const safeStorage = {
  getItem: (key) => {
    try {
      if (!isBrowser) return null;

      // Check if localStorage exists and is accessible
      if (!window.localStorage) return null;

      // Test access with a simple operation
      const testKey = '__svarog_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);

      return window.localStorage.getItem(key);
    } catch (error) {
      // In test environment, warn at debug level only
      if (isTestEnvironment()) {
        console.debug(
          '[Svarog UI] localStorage not available in test environment'
        );
      } else {
        console.warn('[Svarog UI] localStorage access failed:', error.message);
      }
      return null;
    }
  },

  setItem: (key, value) => {
    try {
      if (!isBrowser) return false;

      if (!window.localStorage) return false;

      // Test access
      const testKey = '__svarog_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);

      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (isTestEnvironment()) {
        console.debug(
          '[Svarog UI] localStorage setItem failed in test environment'
        );
      } else {
        console.warn(
          '[Svarog UI] Could not save to localStorage:',
          error.message
        );
      }
      return false;
    }
  },

  removeItem: (key) => {
    try {
      if (!isBrowser || !window.localStorage) return false;
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      if (!isTestEnvironment()) {
        console.warn(
          '[Svarog UI] Could not remove from localStorage:',
          error.message
        );
      }
      return false;
    }
  },
};

/**
 * Safe event dispatcher with error handling
 */
const safeDispatch = (eventName, detail) => {
  try {
    if (isBrowser && window.dispatchEvent && window.CustomEvent) {
      const event = new window.CustomEvent(eventName, { detail });
      window.dispatchEvent(event);
      return true;
    }
  } catch (error) {
    if (!isTestEnvironment()) {
      console.warn(
        `[Svarog UI] Could not dispatch ${eventName}:`,
        error.message
      );
    }
  }
  return false;
};

/**
 * Theme Manager Class with enhanced test support
 */
class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.loadedThemes = new Map();
    this.listeners = new Set();
    this.initialized = false;

    // Initialize based on environment
    if (isBrowser) {
      this.initializeTheme();
    } else if (isTestEnvironment()) {
      console.debug('[Svarog UI] Running in test environment - using defaults');
      this.currentTheme = 'default';
      this.initialized = true;
    } else {
      console.log(
        '[Svarog UI] Running in Node.js environment - theme features limited'
      );
      this.currentTheme = 'default';
      this.initialized = true;
    }
  }

  /**
   * Initialize theme system with better error handling
   */
  initializeTheme() {
    try {
      if (this.initialized) return;

      // Try to load saved theme
      const savedTheme = safeStorage.getItem('svarog-theme');

      if (savedTheme && typeof savedTheme === 'string') {
        if (!isTestEnvironment()) {
          console.log(`[Svarog UI] Initializing theme: ${savedTheme}`);
        }
        this.currentTheme = savedTheme;
      } else {
        if (!isTestEnvironment()) {
          console.log(
            '[Svarog UI] Using default theme due to no saved preference'
          );
        }
        this.currentTheme = 'default';
      }

      // Save current theme
      const saved = safeStorage.setItem('svarog-theme', this.currentTheme);
      if (saved && !isTestEnvironment()) {
        console.log(
          `[Svarog UI] Saved theme "${this.currentTheme}" to svarog-theme`
        );
      }

      this.initialized = true;
    } catch (error) {
      if (!isTestEnvironment()) {
        console.warn('[Svarog UI] Theme initialization error:', error.message);
      }
      this.currentTheme = 'default';
      this.initialized = true;
    }
  }

  /**
   * Switch to a theme with enhanced error handling
   */
  switchTheme(themeName) {
    if (!themeName || typeof themeName !== 'string') {
      console.warn('[Svarog UI] Invalid theme name provided to switchTheme');
      return false;
    }

    if (!isBrowser && !isTestEnvironment()) {
      console.warn(
        '[Svarog UI] Theme switching not available in Node.js environment'
      );
      return false;
    }

    try {
      const previousTheme = this.currentTheme;
      this.currentTheme = themeName;

      // Save to storage (if available)
      safeStorage.setItem('svarog-theme', themeName);

      // Dispatch event (if possible)
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
   * Get current theme with fallback
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
   * Get CSS variable value with safe fallback
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
    } catch (error) {
      if (!isTestEnvironment()) {
        console.warn(
          `[Svarog UI] Could not get theme value for ${variableName}:`,
          error.message
        );
      }
      return null;
    }
  }

  /**
   * Set CSS variable with safe fallback
   */
  setThemeVariable(variableName, value) {
    if (!isBrowser || !document.documentElement) {
      return false;
    }

    try {
      document.documentElement.style.setProperty(variableName, value);
      return true;
    } catch (error) {
      if (!isTestEnvironment()) {
        console.warn(
          `[Svarog UI] Could not set theme variable ${variableName}:`,
          error.message
        );
      }
      return false;
    }
  }

  /**
   * Load theme dynamically with better error handling
   */
  async loadTheme(themeName) {
    if (!isBrowser && !isTestEnvironment()) {
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
   * Load custom theme with validation
   */
  loadCustomTheme(name, themeObject) {
    if (!isBrowser && !isTestEnvironment()) {
      return false;
    }

    try {
      if (themeObject && typeof themeObject.apply === 'function') {
        this.loadedThemes.set(name, themeObject);
        themeObject.apply();
        this.switchTheme(name);
        return true;
      }
      console.warn(`[Svarog UI] Invalid theme object for "${name}"`);
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

  /**
   * Reset theme manager for testing
   */
  reset() {
    this.currentTheme = 'default';
    this.loadedThemes.clear();
    this.listeners.clear();
    this.initialized = false;
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
  isTestEnvironment: isTestEnvironment(),
  hasLocalStorage: isBrowser && !!window.localStorage,
  hasDocument: isBrowser && !!document,
  hasWindow: isBrowser && !!window,
};
