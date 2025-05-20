// src/components/Link/index.js
import { createComponent } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import createLink from './Link.js';

// Create component with factory function
const Link = createComponent('Link', createLink);

// Create theme-aware version
const ThemeAwareLink = withThemeAwareness(Link);

export default ThemeAwareLink;
export { ThemeAwareLink as Link };
