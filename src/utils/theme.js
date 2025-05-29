// src/utils/theme.js
import { THEMES } from '../constants/themes.js';

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.defaultTheme = THEMES.default;
    this.observers = [];

    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () =>
          this.initializeTheme()
        );
      } else {
        this.initializeTheme();
      }
    }
  }

  initializeTheme() {
    try {
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

      console.log(`Theme.js: Initializing theme, using ${themeToUse}`);

      this.switchTheme(themeToUse);
    } catch (_e) {
      // If we can't access localStorage, just use the default theme
      // But don't overwrite a potentially set theme from elsewhere
      if (!this.currentTheme) {
        console.log('Theme.js: Using default theme due to localStorage error');
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
      console.log(`Theme.js: Saved theme "${theme}" to ${storageKey}`);
    } catch (e) {
      // Silent fail - can't access localStorage
      console.debug('Theme.js: Could not save theme to localStorage', e);
    }

    // Notify observers
    this.notifyObservers({ previousTheme, currentTheme: theme });

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

// Export convenience functions
export const getThemeNames = () => themeManager.getThemeNames();
export const switchTheme = (theme) => themeManager.switchTheme(theme);
export const getCurrentTheme = () => themeManager.getCurrentTheme();
export const setThemeVariable = (name, value) =>
  themeManager.setThemeVariable(name, value);
