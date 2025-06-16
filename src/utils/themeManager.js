// src/utils/themeManager.js
import { THEMES } from '../constants/themes.js';
import { injectStyles } from './styleInjection.js';
import { baseVariables } from '../styles/baseVariables.js';

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.defaultTheme = THEMES.default;
    this.observers = [];
    this.baseVariablesLoaded = false;
    this.loadedThemes = new Map();
    this.themeListeners = new Set();

    // Force legacy mode in development/storybook
    this.forceLegacyMode =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.pathname.includes('storybook'));

    // Check if auto-initialization should be disabled (for Storybook)
    if (
      typeof document !== 'undefined' &&
      !window.__STORYBOOK_DISABLE_THEME_INIT__
    ) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () =>
          this.initializeTheme()
        );
      } else {
        this.initializeTheme();
      }
    }
  }

  /**
   * Load base variables that all themes depend on
   */
  loadBaseVariables() {
    if (this.baseVariablesLoaded) return;

    injectStyles('svarog-base-vars', baseVariables, { priority: 'base' });
    this.baseVariablesLoaded = true;
    console.log('[Svarog UI] Base variables loaded');
  }

  initializeTheme() {
    try {
      // Always load base variables first
      this.loadBaseVariables();

      // First, check if there's a Storybook theme preference
      const storybookTheme = localStorage.getItem('svarog-storybook-theme');

      // Then check for regular app theme preference
      const appTheme = localStorage.getItem('svarog-theme');

      // Prioritize Storybook theme if we're in Storybook context
      const isInStorybook =
        typeof window !== 'undefined' &&
        window.location.pathname.includes('storybook');

      const themeToUse =
        isInStorybook && this.isValidTheme(storybookTheme)
          ? storybookTheme
          : this.isValidTheme(appTheme)
            ? appTheme
            : this.defaultTheme;

      console.log(`[Svarog UI] Initializing theme: ${themeToUse}`);

      this.switchTheme(themeToUse);
    } catch (_e) {
      // If we can't access localStorage, just use the default theme
      // But don't overwrite a potentially set theme from elsewhere
      if (!this.currentTheme) {
        console.log(
          '[Svarog UI] Using default theme due to localStorage error'
        );
        this.switchTheme(this.defaultTheme);
      }
    }
  }

  isValidTheme(theme) {
    return Object.values(THEMES).includes(theme);
  }

  getThemeNames() {
    return Object.values(THEMES);
  }

  /**
   * Load a theme package dynamically
   * @param {string} themeName - Name of the theme to load
   * @returns {Promise<void>}
   */
  async load(themeName) {
    // Always ensure base variables are loaded first
    this.loadBaseVariables();

    // Skip package loading in legacy mode
    if (this.forceLegacyMode) {
      console.log(`[Svarog UI] Using legacy theme mode for: ${themeName}`);
      this.switchTheme(themeName);
      return;
    }

    // Check if theme is already loaded
    if (this.loadedThemes.has(themeName)) {
      this.applyLoadedTheme(themeName);
      return;
    }

    try {
      // Try to load theme module
      const theme = await import(`@svarog-ui/theme-${themeName}`);

      // Store the loaded theme
      this.loadedThemes.set(themeName, theme);

      // Apply theme
      this.applyLoadedTheme(themeName);

      console.log(`[Svarog UI] Theme '${themeName}' loaded successfully`);
    } catch (error) {
      console.error(`[Svarog UI] Failed to load theme '${themeName}':`, error);

      // Try legacy switchTheme method
      if (this.isValidTheme(themeName)) {
        console.log(`[Svarog UI] Falling back to legacy theme: ${themeName}`);
        this.switchTheme(themeName);
      } else {
        throw error;
      }
    }
  }

  /**
   * Apply a loaded theme module
   * @private
   */
  applyLoadedTheme(themeName) {
    const theme = this.loadedThemes.get(themeName);
    if (!theme) return;

    // Remove current theme if exists
    if (this.currentTheme) {
      this.removeCurrentTheme();
    }

    // Apply theme based on its structure
    if (theme.default?.apply) {
      theme.default.apply();
    } else if (theme.apply) {
      theme.apply();
    } else if (theme.themeVariables) {
      // Handle raw variables export (like from your dist files)
      const themeCSS = `:root { ${theme.themeVariables} }`;
      injectStyles(`${themeName}-theme`, themeCSS, { priority: 'theme' });
    }

    this.currentTheme = themeName;
    this.notifyListeners(themeName);
  }

  /**
   * Load theme from a variables object or string
   * @param {string} name - Theme name
   * @param {Object|string} variables - Theme variables
   */
  loadCustom(name, variables) {
    this.loadBaseVariables();

    if (this.currentTheme) {
      this.removeCurrentTheme();
    }

    let themeCSS;
    if (typeof variables === 'string') {
      themeCSS = `:root { ${variables} }`;
    } else if (typeof variables === 'object') {
      const cssVars = Object.entries(variables)
        .map(([key, value]) => `--${key}: ${value};`)
        .join('\n  ');
      themeCSS = `:root {\n  ${cssVars}\n}`;
    } else {
      throw new Error('Invalid theme variables format');
    }

    injectStyles(`${name}-theme`, themeCSS, { priority: 'theme' });
    this.currentTheme = name;
    this.notifyListeners(name);
  }

  /**
   * Legacy method - switch theme using CSS classes
   */
  switchTheme(theme) {
    if (!this.isValidTheme(theme)) {
      theme = this.defaultTheme;
    }

    if (this.currentTheme === theme) {
      return false;
    }

    const previousTheme = this.currentTheme;

    // Remove old theme class
    if (previousTheme) {
      document.documentElement.classList.remove(`${previousTheme}-theme`);
      document.body.classList.remove(`${previousTheme}-theme`);
    }

    // Add new theme class
    const themeClass = `${theme}-theme`;
    document.documentElement.classList.add(themeClass);
    document.body.classList.add(themeClass);

    // Update state
    this.currentTheme = theme;

    // Determine which localStorage key to use based on context
    const isInStorybook =
      typeof window !== 'undefined' &&
      window.location.pathname.includes('storybook');

    const storageKey = isInStorybook
      ? 'svarog-storybook-theme'
      : 'svarog-theme';

    try {
      localStorage.setItem(storageKey, theme);
      console.log(`[Svarog UI] Saved theme "${theme}" to ${storageKey}`);
    } catch (e) {
      // Silent fail - can't access localStorage
      console.debug('[Svarog UI] Could not save theme to localStorage', e);
    }

    // Notify observers
    this.notifyObservers({ previousTheme, currentTheme: theme });
    this.notifyListeners(theme, previousTheme);

    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('themechange', {
          detail: { theme, previousTheme },
        })
      );
    }

    return true;
  }

  /**
   * Remove current theme
   */
  removeCurrentTheme() {
    if (!this.currentTheme) return;

    // Remove theme styles
    const themeStyles = document.querySelector(
      `[data-svarog="${this.currentTheme}-theme"]`
    );
    if (themeStyles) {
      themeStyles.remove();
    }

    // Remove theme classes
    document.documentElement.classList.remove(`${this.currentTheme}-theme`);
    document.body.classList.remove(`${this.currentTheme}-theme`);

    // If loaded theme has remove method, call it
    const loadedTheme = this.loadedThemes.get(this.currentTheme);
    if (loadedTheme?.default?.remove) {
      loadedTheme.default.remove();
    } else if (loadedTheme?.remove) {
      loadedTheme.remove();
    }

    const previousTheme = this.currentTheme;
    this.currentTheme = null;
    this.notifyListeners(null, previousTheme);
  }

  /**
   * Check if a CSS variable is defined
   * @param {string} varName - CSS variable name
   * @returns {boolean}
   */
  isVariableDefined(varName) {
    const value = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    return !!value;
  }

  /**
   * Check if required variables are defined and warn if not
   * @param {string[]} requiredVars - Array of required CSS variable names
   * @param {string} componentName - Name of the component checking
   * @returns {boolean}
   */
  checkRequiredVariables(requiredVars, componentName) {
    if (!this.baseVariablesLoaded && !this.currentTheme) {
      console.warn(
        `[Svarog UI] ${componentName} requires CSS variables. ` +
          `Did you forget to load a theme? Use ThemeManager.load('theme-name') or ThemeManager.switchTheme('theme-name')`
      );
      return false;
    }

    const missingVars = requiredVars.filter(
      (varName) => !this.isVariableDefined(varName)
    );

    if (missingVars.length > 0) {
      console.warn(
        `[Svarog UI] ${componentName} is missing CSS variables:`,
        missingVars.join(', ')
      );
      return false;
    }

    return true;
  }

  /**
   * Add theme change listener (new API)
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onThemeChange(callback) {
    this.themeListeners.add(callback);
    return () => this.themeListeners.delete(callback);
  }

  /**
   * Notify all listeners of theme change (new API)
   * @private
   */
  notifyListeners(newTheme, previousTheme = null) {
    this.themeListeners.forEach((callback) => {
      try {
        callback(newTheme, previousTheme);
      } catch (error) {
        console.error('[Svarog UI] Theme listener error:', error);
      }
    });
  }

  // Legacy observer methods
  addObserver(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Observer callback must be a function');
    }

    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter((cb) => cb !== callback);
    };
  }

  notifyObservers(data) {
    this.observers.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        // Log the error but continue with other observers
        console.debug('Error in theme observer callback', error);
      }
    });
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  getThemeValue(cssVariable) {
    if (typeof window === 'undefined' || !document) {
      return '';
    }
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(cssVariable)
      .trim();
  }

  setThemeVariable(name, value) {
    if (typeof document === 'undefined') {
      return;
    }
    const cssVarName = name.startsWith('--') ? name : `--${name}`;
    document.documentElement.style.setProperty(cssVarName, value);
  }
}

// Create singleton instance
export const themeManager = new ThemeManager();

// Export the class for direct usage
export { ThemeManager };

// Export convenience functions (legacy API)
export const getThemeNames = () => themeManager.getThemeNames();
export const switchTheme = (theme) => themeManager.switchTheme(theme);
export const getCurrentTheme = () => themeManager.getCurrentTheme();
export const setThemeVariable = (name, value) =>
  themeManager.setThemeVariable(name, value);

// Export new API methods
export const loadTheme = (themeName) => themeManager.load(themeName);
export const loadCustomTheme = (name, variables) =>
  themeManager.loadCustom(name, variables);
export const checkRequiredVariables = (vars, component) =>
  themeManager.checkRequiredVariables(vars, component);
export const onThemeChange = (callback) => themeManager.onThemeChange(callback);

// Default export
export default themeManager;
