// src/styles/index.js

// Import and auto-inject base styles and variables
import './baseStyles.js'; // This auto-injects base styles when imported

// Export base styles for use in other modules if needed
export { baseStyles, baseVariables } from './baseStyles.js';

// Export theme utilities
export * from '../utils/themeManager.js';

import './themes/default-theme.css';
import './themes/dark-theme.css';
import './themes/light-theme.css';
import './themes/cabalou-theme.css';
import './themes/muchandy-theme.css';
