// src/components/RatingSection/index.js
import { createComponent } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import createRatingSection from './RatingSection.js';

// Create component with factory function
const RatingSection = createComponent('RatingSection', createRatingSection);

// Create theme-aware version
const ThemeAwareRatingSection = withThemeAwareness(RatingSection);

export default ThemeAwareRatingSection;
export { ThemeAwareRatingSection as RatingSection };
