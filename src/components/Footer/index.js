// src/components/Footer/index.js
import { createComponent } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import createFooter from './Footer.js';

// Create component with factory function
const Footer = createComponent('Footer', createFooter);

// Create theme-aware version
const ThemeAwareFooter = withThemeAwareness(Footer);

export default ThemeAwareFooter;
export { ThemeAwareFooter as Footer };
