/**
 * @file Main library entry point for Svarog UI Core
 * @description Self-contained package with all copied components and utilities
 * Auto-injects base styles when imported
 */

// Auto-inject base styles when core is imported
import './styles/baseVariables.js'; // ← FIRST: CSS variables
import './styles/baseStyles.js'; // ← SECOND: Base styles that use variables

// =========================================
// COMPONENT EXPORTS (50 components found)
// =========================================
export { default as Accordion } from './components/Accordion/index.js';
export { default as BackToTop } from './components/BackToTop/index.js';
export { default as BlogCard } from './components/BlogCard/index.js';
export { default as BlogDetail } from './components/BlogDetail/index.js';
export { default as BlogList } from './components/BlogList/index.js';
export { default as Breadcrumb } from './components/Breadcrumb/index.js';
export { default as Button } from './components/Button/index.js';
export { default as Card } from './components/Card/index.js';
export { default as Checkbox } from './components/Checkbox/index.js';
export { default as CollapsibleHeader } from './components/CollapsibleHeader/index.js';
export { default as ConditionSelector } from './components/ConditionSelector/index.js';
export { default as ContactInfo } from './components/ContactInfo/index.js';
export { default as ContactSection } from './components/ContactSection/index.js';
export { default as CookieConsent } from './components/CookieConsent/index.js';
export { default as FAQSection } from './components/FAQSection/index.js';
export { default as Footer } from './components/Footer/index.js';
export { default as Form } from './components/Form/index.js';
export { default as Grid } from './components/Grid/index.js';
export { default as Head } from './components/Head/index.js';
export { default as Header } from './components/Header/index.js';
export { default as Hero } from './components/Hero/index.js';
export { default as Image } from './components/Image/index.js';
export { default as ImageSlider } from './components/ImageSlider/index.js';
export { default as Input } from './components/Input/index.js';
export { default as Link } from './components/Link/index.js';
export { default as Logo } from './components/Logo/index.js';
export { default as Map } from './components/Map/index.js';
export { default as Modal } from './components/Modal/index.js';
export { default as MuchandyHero } from './components/MuchandyHero/index.js';
export { default as Navigation } from './components/Navigation/index.js';
export { default as Page } from './components/Page/index.js';
export { default as Pagination } from './components/Pagination/index.js';
export { default as PhoneRepairForm } from './components/PhoneRepairForm/index.js';
export { default as PriceDisplay } from './components/PriceDisplay/index.js';
export { default as ProductCard } from './components/ProductCard/index.js';
export { default as ProductDetail } from './components/ProductDetail/index.js';
export { default as ProductGrid } from './components/ProductGrid/index.js';
export { default as Radio } from './components/Radio/index.js';
export { default as Rating } from './components/Rating/index.js';
export { default as RatingSection } from './components/RatingSection/index.js';
export { default as RichText } from './components/RichText/index.js';
export { default as Section } from './components/Section/index.js';
export { default as Select } from './components/Select/index.js';
export { default as StepsIndicator } from './components/StepsIndicator/index.js';
export { default as StickyContactIcons } from './components/StickyContactIcons/index.js';
export { default as Tabs } from './components/Tabs/index.js';
export { default as Tag } from './components/Tag/index.js';
export { default as Textarea } from './components/Textarea/index.js';
export { default as Typography } from './components/Typography/index.js';
export { default as UsedPhonePriceForm } from './components/UsedPhonePriceForm/index.js';

// =========================================
// UTILITY EXPORTS
// =========================================

// Style injection utilities
export {
  injectStyles,
  css,
  createStyleInjector,
  removeStyles,
} from './utils/styleInjection.js';

// Theme management (using copied themeManager with all functions)
export {
  themeManager,
  getThemeNames,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
  loadTheme,
  loadCustomTheme,
  checkRequiredVariables,
  onThemeChange,
} from './utils/themeManager.js';

// Component factory utilities
export {
  createElement,
  appendChildren,
  createComponent,
  validateProps,
} from './utils/componentFactory.js';

// Base utilities
export { createBaseComponent } from './utils/baseComponent.js';

// Performance utilities
export {
  debounce,
  throttle,
  rafThrottle,
  memoize,
  batchDomUpdates,
  runWhenIdle,
  PerformanceBenchmark,
} from './utils/performance.js';

// Validation utilities
export { validateInput, validateRequiredProps } from './utils/validation.js';

// SEO utilities
export {
  validateSEO,
  generateSlug,
  optimizeSEO,
  generateStructuredData,
  extractSEOFromCMS,
} from './utils/seoManager.js';

// Form utilities
export { default as FormContainer } from './utils/FormContainer.js';

// Higher-order component utilities
export {
  withBehavior,
  withThemeAwareness,
  withEventDelegation,
} from './utils/composition.js';

// Environment utilities
export { isTestEnvironment } from './utils/environment.js';

// Logger
export { logger } from './utils/logger.js';

// =========================================
// CONSTANTS
// =========================================
export { THEMES } from './constants/themes.js';

// Note: Development utilities like getComponents and getPrototypes are not included
// in the core package to avoid .stories.js dependencies. Use them from the main
// source for development purposes.
