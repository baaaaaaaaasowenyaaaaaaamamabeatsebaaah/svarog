// src/components/Breadcrumb/index.js
import { createComponent } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import createBreadcrumb from './Breadcrumb.js';

// Create component with factory function
const Breadcrumb = createComponent('Breadcrumb', createBreadcrumb);

// Create theme-aware version
const ThemeAwareBreadcrumb = withThemeAwareness(Breadcrumb);

export default ThemeAwareBreadcrumb;
export { ThemeAwareBreadcrumb as Breadcrumb };
