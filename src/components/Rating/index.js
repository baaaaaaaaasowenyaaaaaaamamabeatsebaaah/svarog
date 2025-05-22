// src/components/Rating/index.js
import { createComponent } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import createRating from './Rating.js';

// Create component with factory function
const Rating = createComponent('Rating', createRating);

// Create theme-aware version
const ThemeAwareRating = withThemeAwareness(Rating);

export default ThemeAwareRating;
export { ThemeAwareRating as Rating };
