import { THEMES } from '../constants/themes';

/**
 * Get the list of available theme names.
 *
 * @returns {Array<string>} An array of theme names.
 */
export const getThemeNames = () => {
  return Object.values(THEMES);
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
  const themeNames = getThemeNames();
  if (!theme || !themeNames.includes(theme)) {
    console.warn(`Theme "${theme}" not found. Switching to default theme.`);
    theme = THEMES.default;
  }

  // Remove all existing theme classes
  document.body.classList.remove(...themeNames.map((name) => `${name}-theme`));

  // Add the new theme class
  document.body.classList.add(`${theme}-theme`);
  console.log(`Applied theme: ${theme}`);
};
