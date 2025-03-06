import { switchTheme } from '../src/utils/theme.js';
import { THEMES } from '../src/constants/themes.js';

const renderStories = (currentTheme) => {
  console.log(`Rendering stories for theme: ${currentTheme}`);
  switchTheme(currentTheme);
};

// Initial render with default theme
renderStories(THEMES.default);
