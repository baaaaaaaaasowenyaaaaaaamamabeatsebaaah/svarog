// Core components - using relative paths that will be resolved by build
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

// ... rest of component exports ...

// Utility exports
export * from './utils/componentFactory.js';
export * from './utils/baseComponent.js';
export * from './utils/composition.js';
export * from './utils/validation.js';
export * from './utils/performance.js';
export * from './utils/styleInjection.js';

// Theme manager
export {
  ThemeManager,
  registerTheme,
  switchTheme,
  getCurrentTheme,
} from './utils/theme.js';
