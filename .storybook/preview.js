// .storybook/preview.js
import { switchTheme } from '../src/utils/themeManager.js';
import { THEMES } from '../src/constants/themes.js';

// Get stored theme from localStorage or use default
const getStoredTheme = () => {
  try {
    const storedTheme = localStorage.getItem('svarog-storybook-theme');
    if (storedTheme && Object.values(THEMES).includes(storedTheme)) {
      return storedTheme;
    }
  } catch (error) {
    console.debug('Preview: Could not read theme from localStorage', error);
  }
  return THEMES.default;
};

// Initialize theme
const initialTheme = getStoredTheme();
switchTheme(initialTheme);
console.log('Preview: Theme initialized:', initialTheme);

// Listen for theme changes
window.addEventListener('themechange', (event) => {
  console.log('Preview: Theme changed to:', event.detail.theme);
});
