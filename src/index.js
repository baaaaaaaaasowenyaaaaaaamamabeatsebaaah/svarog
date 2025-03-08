// src/index.js
import Button from './components/Button/Button.js';
import Grid from './components/Grid/Grid.js';
import Navigation from './components/Navigation/Navigation.js';
import Link from './components/Link/Link.js';
import { Section } from './components/Section/Section.js';
import Typography from './components/Typography/Typography.js';
import Logo from './components/Logo/Logo.js';
import Card from './components/Card/Card.js';
import Input from './components/Input/Input.js';
import Select from './components/Select/Select.js';
import Checkbox from './components/Checkbox/Checkbox.js';
import Radio from './components/Radio/Radio.js';
import RadioGroup from './components/Radio/RadioGroup.js';
import Rating from './components/Rating/Rating.js';
import {
  Form,
  FormGroup,
  FormSection,
  FormActions,
} from './components/Form/index.js';
import {
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
} from './utils/theme.js';

// Import base styles
import './styles/index.js';
import Map from './components/Map/Map.js';
import Head from './components/Head/Head.js';

// Export components
const Svarog = {
  Head,
  Map,
  Rating,
  Button,
  Grid,
  Navigation,
  Link,
  Section,
  Typography,
  Logo,
  Card,
  Input,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Rating,
  Form,
  FormGroup,
  FormSection,
  FormActions,
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
  Input,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Rating,
  Form,
  FormGroup,
  FormSection,
  FormActions,
  themeManager,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
};

// Default export of the whole library
export default Svarog;
