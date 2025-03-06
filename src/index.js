// src/index.js
import Button from './components/Button/Button.js';
import Grid from './components/Grid/Grid.js';
import Navigation from './components/Navigation/Navigation.js';
import Link from './components/Link/Link.js';
import { Section } from './components/Section/Section.js';
import Typography from './components/Typography/Typography.js';
import Logo from './components/Logo/Logo.js';
import Card from './components/Card/Card.js';
import {
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
} from './utils/theme.js';

// Import base styles
import './styles/index.js';

// Export components
const Svarog = {
  Button,
  Grid,
  Navigation,
  Link,
  Section,
  Typography,
  Logo,
  Card,
  // Utilities
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
};

// Individual named exports
export {
  Button,
  Grid,
  Navigation,
  Link,
  Section,
  Typography,
  Logo,
  Card,
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
};

// Default export of the whole library
export default Svarog;
