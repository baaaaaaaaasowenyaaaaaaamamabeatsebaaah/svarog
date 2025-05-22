// src/components/Map/index.js
import { createComponent } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import createMap from './Map.js';

// Create component with factory function
const Map = createComponent('Map', createMap);

// Create theme-aware version
const ThemeAwareMap = withThemeAwareness(Map);

export default ThemeAwareMap;
export { ThemeAwareMap as Map };
