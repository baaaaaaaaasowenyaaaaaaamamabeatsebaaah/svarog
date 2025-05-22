// src/components/Section/index.js
import { createComponent } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import createSection from './Section.js';

// Create component with factory function
const Section = createComponent('Section', createSection);

// Create theme-aware version
const ThemeAwareSection = withThemeAwareness(Section);

export default ThemeAwareSection;
export { ThemeAwareSection as Section };
