// src/utils/theme.js
import { THEMES } from '../constants/themes.js';

/**
 * Theme manager for handling theme switching and management
 */
class ThemeManager {
  /**
   * Creates a new ThemeManager instance
   */
  constructor() {
    this.currentTheme = null;
    this.defaultTheme = THEMES.default;
    this.observers = [];

    // Ensure themes are initialized when DOM is ready
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.initializeTheme();
        });
      } else {
        this.initializeTheme();
      }
    }
  }

  /**
   * Initialize the default theme
   * @private
   */
  initializeTheme() {
    // Try to load theme from localStorage if available
    let initialTheme = this.defaultTheme;

    try {
      const savedTheme = localStorage.getItem('svarog-theme');
      if (savedTheme && this.isValidTheme(savedTheme)) {
        initialTheme = savedTheme;
      }
    } catch (e) {
      console.warn('Could not access localStorage for theme preference');
    }

    this.switchTheme(initialTheme);
  }

  /**
   * Check if a theme name is valid
   * @param {string} theme - Theme name to check
   * @returns {boolean} Whether the theme is valid
   */
  isValidTheme(theme) {
    return Object.values(THEMES).includes(theme);
  }

  /**
   * Get the list of available theme names
   * @returns {Array<string>} An array of theme names
   */
  getThemeNames() {
    return Object.values(THEMES);
  }

  /**
   * Switch to a specified theme
   * @param {string} theme - The name of the theme to switch to
   * @returns {boolean} Whether the theme switch was successful
   */
  switchTheme(theme) {
    // Validate theme
    if (!theme || !this.isValidTheme(theme)) {
      console.warn(`Theme "${theme}" not found. Switching to default theme.`);
      theme = this.defaultTheme;
    }

    // Skip if already using this theme
    if (this.currentTheme === theme) {
      return false;
    }

    const previousTheme = this.currentTheme;

    // Remove current theme if exists
    if (previousTheme) {
      document.documentElement.classList.remove(`${previousTheme}-theme`);
      document.body.classList.remove(`${previousTheme}-theme`);
    }

    // Add new theme
    const themeClass = `${theme}-theme`;
    document.documentElement.classList.add(themeClass);
    document.body.classList.add(themeClass);

    // Update current theme reference
    this.currentTheme = theme;

    // Save to localStorage if available
    try {
      localStorage.setItem('svarog-theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference to localStorage');
    }

    // Notify observers
    this.notifyObservers({
      previousTheme,
      currentTheme: theme,
    });

    // Dispatch custom event for external listeners
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('themechange', {
        detail: {
          theme,
          previousTheme,
        },
      });
      window.dispatchEvent(event);
    }

    return true;
  }

  /**
   * Add an observer for theme changes
   * @param {Function} callback - Function to call when theme changes
   * @returns {Function} Function to remove the observer
   */
  addObserver(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Observer callback must be a function');
    }

    this.observers.push(callback);

    // Return function to remove this observer
    return () => {
      this.observers = this.observers.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify all observers of a theme change
   * @private
   * @param {Object} data - Theme change data
   */
  notifyObservers(data) {
    this.observers.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in theme change observer:', error);
      }
    });
  }

  /**
   * Get current active theme name
   * @returns {string} Current theme name
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Get computed theme value for a CSS variable
   * @param {string} cssVariable - The CSS variable name
   * @returns {string} The computed value
   */
  getThemeValue(cssVariable) {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return '';
    }

    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(cssVariable)
      .trim();
  }

  /**
   * Set a theme-specific CSS variable
   * @param {string} name - CSS variable name (without -- prefix)
   * @param {string} value - CSS variable value
   */
  setThemeVariable(name, value) {
    if (typeof document === 'undefined') return;

    const cssVarName = name.startsWith('--') ? name : `--${name}`;
    document.documentElement.style.setProperty(cssVarName, value);
  }
}

// Create singleton instance
export const themeManager = new ThemeManager();

// Export functions for convenience
export const getThemeNames = () => themeManager.getThemeNames();
export const switchTheme = (theme) => themeManager.switchTheme(theme);
export const getCurrentTheme = () => themeManager.getCurrentTheme();
export const setThemeVariable = (name, value) =>
  themeManager.setThemeVariable(name, value);
