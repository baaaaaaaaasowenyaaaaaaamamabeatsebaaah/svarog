// src/components/RichText/index.js
import { createComponent } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import createRichText from './RichText.js';

// Create component with factory function (follows Svarog patterns)
const RichText = createComponent('RichText', createRichText);

// Create theme-aware version (follows Svarog patterns)
const ThemeAwareRichText = withThemeAwareness(RichText);

export default ThemeAwareRichText;
export { ThemeAwareRichText as RichText };
