/**
 * Utility functions for managing themes in the application.
 * This module provides functions to get available theme names and switch themes.
 */

// Import the generated theme names from the JSON file
const themeNames = require('../../themeNames.json');

/**
 * Get the list of available theme names.
 *
 * @returns {Array<string>} An array of theme names.
 */
export const getThemeNames = () => {
  return themeNames;
};

/**
 * Switch the current theme.
 *
 * This function removes any existing theme classes from the document's body
 * and adds the new theme class based on the specified theme name.
 *
 * @param {string} theme - The name of the theme to switch to.
 */
export const switchTheme = (theme) => {
  // Remove all existing theme classes
  document.body.classList.remove(...themeNames.map((name) => `${name}-theme`));

  // Add the new theme class
  document.body.classList.add(`${theme}-theme`);
};
