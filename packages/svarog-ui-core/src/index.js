// Core components - now using local paths
export { default as BlogCard } from './components/BlogCard/BlogCard.js';
export { default as BlogDetail } from './components/BlogDetail/BlogDetail.js';
export { default as BlogList } from './components/BlogList/BlogList.js';
export { default as Button } from './components/Button/Button.js';
export { default as Card } from './components/Card/Card.js';
export { default as Checkbox } from './components/Checkbox/Checkbox.js';
export { default as CollapsibleHeader } from './components/CollapsibleHeader/CollapsibleHeader.js';
export { default as ConditionSelector } from './components/ConditionSelector/ConditionSelector.js';
export { default as ContactInfo } from './components/ContactInfo/ContactInfo.js';
export { default as Footer } from './components/Footer/Footer.js';

// Form and its subcomponents
export { default as Form } from './components/Form/Form.js';
export { default as FormGroup } from './components/Form/FormGroup.js';
export { default as FormSection } from './components/Form/FormSection.js';
export { default as FormActions } from './components/Form/FormActions.js';

export { default as Grid } from './components/Grid/Grid.js';
export { default as Head } from './components/Head/Head.js';
export { default as Header } from './components/Header/Header.js';
export { default as Hero } from './components/Hero/Hero.js';
export { default as Image } from './components/Image/Image.js';
export { default as Input } from './components/Input/Input.js';
export { default as Link } from './components/Link/Link.js';
export { default as Logo } from './components/Logo/Logo.js';
export { default as Map } from './components/Map/Map.js';
export { default as MuchandyHero } from './components/MuchandyHero/MuchandyHero.js';
export { default as Navigation } from './components/Navigation/Navigation.js';
export { default as Page } from './components/Page/Page.js';
export { default as Pagination } from './components/Pagination/Pagination.js';
export { default as PhoneRepairForm } from './components/PhoneRepairForm/PhoneRepairForm.js';
export { default as PriceDisplay } from './components/PriceDisplay/PriceDisplay.js';
export { default as ProductCard } from './components/ProductCard/ProductCard.js';

// Radio and RadioGroup
export { default as Radio } from './components/Radio/Radio.js';
export { default as RadioGroup } from './components/Radio/RadioGroup.js';

export { default as Rating } from './components/Rating/Rating.js';
export { default as Section } from './components/Section/Section.js';
export { default as Select } from './components/Select/Select.js';
export { default as StepsIndicator } from './components/StepsIndicator/StepsIndicator.js';
export { default as StickyContactIcons } from './components/StickyContactIcons/StickyContactIcons.js';
export { default as Tabs } from './components/Tabs/Tabs.js';
export { default as Typography } from './components/Typography/Typography.js';
export { default as UsedPhonePriceForm } from './components/UsedPhonePriceForm/UsedPhonePriceForm.js';

// Utility exports
export * from './utils/componentFactory.js';
export * from './utils/baseComponent.js';
export * from './utils/composition.js';
export * from './utils/validation.js';
export * from './utils/performance.js';
export * from './utils/styleInjection.js';

// Export theme manager
export {
  ThemeManager,
  registerTheme,
  switchTheme,
  getCurrentTheme,
} from './utils/themeManager.js';

// Re-export style injection utilities
export {
  injectStyles,
  css,
  createStyleInjector,
} from './utils/styleInjection.js';
