// .storybook/preview.js
import { switchTheme } from '../src/utils/theme.js';
import { THEMES } from '../src/constants/themes.js';

// Get stored theme from localStorage or use default
const getStoredTheme = () => {
  try {
    const storedTheme = localStorage.getItem('svarog-storybook-theme');
    if (storedTheme && Object.values(THEMES).includes(storedTheme)) {
      console.log(
        'Preview: Using stored theme from localStorage:',
        storedTheme
      );
      return storedTheme;
    }
  } catch (error) {
    console.debug('Preview: Could not read theme from localStorage', error);
  }
  console.log('Preview: Using default theme');
  return THEMES.default;
};

const renderStories = (currentTheme) => {
  console.log(`Preview: Rendering stories for theme: ${currentTheme}`);
  switchTheme(currentTheme);
};

// Initial render with saved theme or default
const initialTheme = getStoredTheme();
renderStories(initialTheme);

// Listen for theme changes from main.js
window.addEventListener('themechange', (event) => {
  console.log('Preview: Theme change event received:', event.detail);
  renderStories(event.detail.theme);
});
