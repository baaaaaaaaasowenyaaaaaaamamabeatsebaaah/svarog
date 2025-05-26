// src/components/Header/index.js
import { createComponent } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import createHeader from './Header.js';

// Create component with factory function
const Header = createComponent('Header', createHeader);

// Create theme-aware version
const ThemeAwareHeader = withThemeAwareness(Header);

export default ThemeAwareHeader;
export { ThemeAwareHeader as Header };
