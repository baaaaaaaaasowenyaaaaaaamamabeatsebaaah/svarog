import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The theme manager content from the documents
const themeManagerContent = `/**
 * Core Theme Manager - handles theme registration and switching
 * Works with external theme packages
 */

class CoreThemeManager {
  constructor() {
    this.themes = new Map();
    this.currentTheme = null;
    this.observers = new Set();
  }

  /**
   * Register a theme from an external package
   * @param {string} name - Theme name
   * @param {Object} theme - Theme object with apply() method
   */
  register(name, theme) {
    if (!theme || typeof theme.apply !== 'function') {
      throw new Error(\`Theme "\${name}" must have an apply() method\`);
    }

    this.themes.set(name, theme);

    // If this is the first theme, apply it
    if (this.themes.size === 1 && !this.currentTheme) {
      this.switch(name);
    }
  }

  /**
   * Register multiple themes at once
   * @param {Object} themes - Object with theme names as keys
   */
  registerAll(themes) {
    Object.entries(themes).forEach(([name, theme]) => {
      this.register(name, theme);
    });
  }

  /**
   * Switch to a registered theme
   * @param {string} name - Theme name
   */
  switch(name) {
    const theme = this.themes.get(name);

    if (!theme) {
      throw new Error(
        \`Theme "\${name}" is not registered. Register it first with ThemeManager.register()\`
      );
    }

    // Remove current theme classes
    if (this.currentTheme) {
      document.documentElement.classList.remove(\`\${this.currentTheme}-theme\`);
      document.body.classList.remove(\`\${this.currentTheme}-theme\`);
    }

    // Apply new theme
    theme.apply();

    const previousTheme = this.currentTheme;
    this.currentTheme = name;

    // Notify observers
    this.notifyObservers({ previousTheme, currentTheme: name });

    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('themechange', {
          detail: { theme: name, previousTheme },
        })
      );
    }

    // Save preference
    try {
      localStorage.setItem('svarog-theme', name);
    } catch (_e) {
      // Silent fail
    }
  }

  /**
   * Get current theme name
   */
  getCurrent() {
    return this.currentTheme;
  }

  /**
   * Get all registered theme names
   */
  getRegistered() {
    return Array.from(this.themes.keys());
  }

  /**
   * Add observer for theme changes
   */
  observe(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  notifyObservers(data) {
    this.observers.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error('Theme observer error:', error);
      }
    });
  }

  /**
   * Initialize theme from localStorage or default
   */
  init() {
    try {
      const savedTheme = localStorage.getItem('svarog-theme');
      if (savedTheme && this.themes.has(savedTheme)) {
        this.switch(savedTheme);
      }
    } catch (_e) {
      // Silent fail
    }
  }
}

// Export singleton instance
export const ThemeManager = new CoreThemeManager();

// Export convenience functions
export const registerTheme = (name, theme) =>
  ThemeManager.register(name, theme);
export const switchTheme = (name) => ThemeManager.switch(name);
export const getCurrentTheme = () => ThemeManager.getCurrent();
`;

// Ensure the directory exists
const utilsDir = resolve(__dirname, '../packages/svarog-ui-core/src/utils');
mkdirSync(utilsDir, { recursive: true });

// Write the file
const filePath = resolve(utilsDir, 'themeManager.js');
writeFileSync(filePath, themeManagerContent);

console.log('✅ Created themeManager.js at:', filePath);
