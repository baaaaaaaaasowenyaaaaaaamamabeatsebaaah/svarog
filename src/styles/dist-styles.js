// Base styles
import './base/00-reset.css';
import './base/01-colors.css';
import './base/02-spacing.css';
import './base/03-typography.css';
import './base/04-layout.css';
import './base/05-states.css';

// Theme styles - ONLY DEFAULT THEME for distribution
import './themes/default-theme.css';

// DO NOT import other themes here
// This file is used for the production bundle only

// Export theme utilities
export * from '../utils/theme.js';
