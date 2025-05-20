// src/components/Tabs/index.js
import { createComponent } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import createTabs from './Tabs.js';

// Create component with factory function
const Tabs = createComponent('Tabs', createTabs);

// Create theme-aware version
const ThemeAwareTabs = withThemeAwareness(Tabs);

export default ThemeAwareTabs;
export { ThemeAwareTabs as Tabs };
