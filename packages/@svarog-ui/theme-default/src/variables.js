// Export the theme variables (without the .default-theme wrapper)
export const themeVariables = `
  /* Typography - use base variables */
  --font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-family-heading: var(--font-family-primary);
  --font-family-base: var(--font-family-primary);
  --font-family-mono: 'Roboto Mono', monospace;

  /* Colors - Brand - Material UI Blue */
  --color-brand-primary: #2196f3;
  --color-brand-primary-light: #64b5f6;
  --color-brand-primary-dark: #1976d2;
  --color-brand-secondary: #ff5722;
  --color-brand-secondary-light: #ff8a65;
  --color-brand-secondary-dark: #e64a19;

  /* Colors - Background */
  --color-bg-secondary: #fafafa;
  --color-border: #e0e0e0;
  --color-gray-50: #fafafa;

  /* Component: Typography */
  --typography-color: var(--color-text);
  --typography-muted-color: var(--color-text-light);
  --typography-margin-bottom: var(--space-4);
  --typography-h1-size: var(--font-size-6xl);
  --typography-h2-size: var(--font-size-4xl);
  --typography-h3-size: var(--font-size-3xl);
  --typography-h4-size: var(--font-size-2xl);
  --typography-h5-size: var(--font-size-xl);
  --typography-h6-size: var(--font-size-lg);
  --typography-body-size: var(--font-size-base);
  --typography-small-size: var(--font-size-sm);

  /* Component: Button */
  --button-bg: var(--color-brand-primary);
  --button-color: var(--color-text-white);
  --button-border: none;
  --button-radius: 4px;
  --button-hover-bg: var(--color-brand-primary-dark);
  --button-hover-border-color: transparent;
  --button-hover-color: var(--color-text-white);
  --button-hover-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14);
  --button-hover-transform: translateY(-1px);
  --button-active-bg: var(--color-brand-primary-dark);
  --button-active-border-color: transparent;
  --button-active-transform: translateY(0);
  --button-active-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14);
  --button-disabled-bg: rgba(0, 0, 0, 0.12);
  --button-disabled-border-color: transparent;
  --button-disabled-color: rgba(0, 0, 0, 0.26);
  --button-disabled-opacity: 1;
  --button-padding: 6px 16px;
  --button-font-size: 0.875rem;
  --button-font-family: var(--font-family-primary);
  --button-font-weight: 500;
  --button-transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --button-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  --button-focus-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);

  /* Primary variant */
  --button-primary-bg: var(--color-brand-primary);
  --button-primary-color: var(--color-text-white);
  --button-primary-border-color: transparent;
  --button-primary-hover-bg: var(--color-brand-primary-dark);
  --button-primary-hover-border-color: transparent;
  --button-primary-hover-color: var(--color-text-white);
  --button-primary-active-bg: var(--color-brand-primary-dark);
  --button-primary-active-border-color: transparent;

  /* Secondary variant */
  --button-secondary-bg: var(--color-brand-secondary);
  --button-secondary-color: var(--color-text-white);
  --button-secondary-border-color: transparent;
  --button-secondary-hover-bg: var(--color-brand-secondary-dark);
  --button-secondary-hover-border-color: transparent;
  --button-secondary-hover-color: var(--color-text-white);
  --button-secondary-active-bg: var(--color-brand-secondary-dark);
  --button-secondary-active-border-color: transparent;

  /* Text variant */
  --button-text-color: var(--color-brand-primary);
  --button-text-hover-color: var(--color-brand-primary-dark);
  --button-text-padding: 6px 8px;

  /* All other button variants... */
  --button-padding-sm: 4px 10px;
  --button-font-size-sm: 0.8125rem;
  --button-radius-sm: 4px;
  --button-icon-size-sm: 18px;
  --button-padding-lg: 8px 22px;
  --button-font-size-lg: 0.9375rem;
  --button-radius-lg: 4px;
  --button-icon-size-lg: 22px;
  --button-icon-margin: 8px;
  --button-icon-padding: 12px;
  --button-icon-radius: 50%;
  --button-icon-size: 24px;
  --button-outlined-color: var(--color-brand-primary);
  --button-outlined-border-color: rgba(33, 150, 243, 0.5);
  --button-outlined-hover-bg: rgba(33, 150, 243, 0.08);
  --button-outlined-hover-color: var(--color-brand-primary);
  --button-outlined-hover-border-color: var(--color-brand-primary);
  --button-success-bg: #4caf50;
  --button-success-color: var(--color-text-white);
  --button-success-border-color: transparent;
  --button-success-hover-bg: #388e3c;
  --button-success-hover-border-color: transparent;
  --button-success-hover-color: var(--color-text-white);
  --button-danger-bg: #f44336;
  --button-danger-color: var(--color-text-white);
  --button-danger-border-color: transparent;
  --button-danger-hover-bg: #d32f2f;
  --button-danger-hover-border-color: transparent;
  --button-danger-hover-color: var(--color-text-white);

  /* Component: Link */
  --link-color: var(--color-brand-primary);
  --link-hover-color: var(--color-brand-primary-dark);
  --link-active-color: var(--color-brand-primary-dark);
  --link-margin-left: 0;
  --link-margin-right: var(--space-1);
  --link-font-family: var(--font-family-primary);
  --link-transition: color 200ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Component: Card */
  --card-bg: var(--color-white);
  --card-color: var(--color-text);
  --card-radius: 4px;
  --card-border: none;
  --card-border-color: transparent;
  --card-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  --card-hover-border-color: transparent;
  --card-hover-shadow: 0 4px 8px rgba(0, 0, 0, 0.14), 0 1px 3px rgba(0, 0, 0, 0.12);
  --card-title-padding: 16px;
  --card-title-font-size: 1.25rem;
  --card-title-font-weight: 500;
  --card-title-border: none;
  --card-content-padding: 16px;
  --card-footer-padding: 8px;
  --card-footer-bg: transparent;
  --card-footer-border: none;
  --card-footer-font-size: 0.875rem;
  --card-title-padding-mobile: 16px;
  --card-content-padding-mobile: 16px;
  --card-footer-padding-mobile: 8px;

  /* Component: Input */
  --input-bg: var(--color-bg);
  --input-color: var(--color-text);
  --input-border: none;
  --input-border-bottom: 1px solid rgba(0, 0, 0, 0.42);
  --input-radius: 4px 4px 0 0;
  --input-padding: 4px 0 5px;
  --input-font-size: 1rem;
  --input-font-family: var(--font-family-primary);
  --input-shadow: none;
  --input-transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --input-placeholder-color: rgba(0, 0, 0, 0.54);
  --input-focus-border-color: var(--color-brand-primary);
  --input-focus-shadow: none;
  --input-disabled-bg: transparent;
  --input-disabled-opacity: 0.38;
  --input-valid-border-color: #4caf50;
  --input-valid-color: #4caf50;
  --input-invalid-border-color: #f44336;
  --input-validation-color: #f44336;
  --input-validation-font-size: 0.75rem;
  --input-margin-bottom: 16px;
  --input-mobile-font-size: 16px;
  --input-mobile-padding: 4px 0 5px;

  /* Component: Select */
  --select-bg: var(--color-bg);
  --select-color: var(--color-text);
  --select-border: none;
  --select-border-bottom: 1px solid rgba(0, 0, 0, 0.42);
  --select-radius: 4px 4px 0 0;
  --select-padding: 4px 0 5px;
  --select-font-size: 1rem;
  --select-font-family: var(--font-family-primary);
  --select-shadow: none;
  --select-transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --select-option-color: var(--color-text);
  --select-option-bg: var(--color-bg);
  --select-option-disabled-color: rgba(0, 0, 0, 0.38);
  --select-focus-border-color: var(--color-brand-primary);
  --select-focus-shadow: none;
  --select-disabled-bg: transparent;
  --select-disabled-opacity: 0.38;
  --select-valid-border-color: #4caf50;
  --select-valid-color: #4caf50;
  --select-invalid-border-color: #f44336;
  --select-validation-color: #f44336;
  --select-validation-font-size: 0.75rem;
  --select-margin-bottom: 16px;
  --select-mobile-font-size: 16px;
  --select-mobile-padding: 4px 0 5px;
  --select-multiple-padding: 4px 0;
  --select-option-padding: 6px 16px;
  --select-option-margin: 0;

  /* Component: Checkbox */
  --checkbox-bg: transparent;
  --checkbox-border: 2px solid rgba(0, 0, 0, 0.54);
  --checkbox-radius: 2px;
  --checkbox-size: 18px;
  --checkbox-color: var(--color-text);
  --checkbox-indicator-margin: 8px;
  --checkbox-font-size: 1rem;
  --checkbox-font-family: var(--font-family-primary);
  --checkbox-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --checkbox-padding: 0;
  --checkbox-hover-border-color: rgba(0, 0, 0, 0.87);
  --checkbox-checked-bg: var(--color-brand-primary);
  --checkbox-checked-border-color: var(--color-brand-primary);
  --checkbox-focus-shadow: 0 0 0 8px rgba(33, 150, 243, 0.16);
  --checkbox-disabled-bg: transparent;
  --checkbox-disabled-border-color: rgba(0, 0, 0, 0.26);
  --checkbox-disabled-color: rgba(0, 0, 0, 0.26);
  --checkbox-valid-border-color: #4caf50;
  --checkbox-valid-color: #4caf50;
  --checkbox-invalid-border-color: #f44336;
  --checkbox-validation-color: #f44336;
  --checkbox-validation-font-size: 0.75rem;
  --checkbox-margin-bottom: 12px;
  --checkbox-indicator-width: 4px;
  --checkbox-indicator-height: 9px;
  --checkbox-required-color: #f44336;
  --checkbox-indeterminate-bg: var(--color-brand-primary);
  --checkbox-indeterminate-border-color: var(--color-brand-primary);
  --checkbox-indeterminate-width: 10px;
  --checkbox-indeterminate-height: 2px;

  /* Component: Radio */
  --radio-bg: transparent;
  --radio-border: 2px solid rgba(0, 0, 0, 0.54);
  --radio-size: 20px;
  --radio-inner-size: 10px;
  --radio-color: var(--color-text);
  --radio-indicator-margin: 8px;
  --radio-font-size: 1rem;
  --radio-font-family: var(--font-family-primary);
  --radio-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --radio-padding: 0;
  --radio-hover-border-color: rgba(0, 0, 0, 0.87);
  --radio-checked-color: var(--color-brand-primary);
  --radio-checked-border-color: var(--color-brand-primary);
  --radio-focus-shadow: 0 0 0 8px rgba(33, 150, 243, 0.16);
  --radio-disabled-bg: transparent;
  --radio-disabled-border-color: rgba(0, 0, 0, 0.26);
  --radio-disabled-color: rgba(0, 0, 0, 0.26);
  --radio-disabled-checked-color: rgba(0, 0, 0, 0.26);
  --radio-margin-bottom: 12px;
  --radio-required-color: #f44336;

  /* Component: Radio Group */
  --radio-group-margin-bottom: 16px;
  --radio-group-padding: 8px;
  --radio-group-border: none;
  --radio-group-radius: 4px;
  --radio-group-legend-font-size: 0.75rem;
  --radio-group-legend-color: rgba(0, 0, 0, 0.54);
  --radio-group-font-family: var(--font-family-primary);
  --radio-group-legend-font-weight: 400;
  --radio-group-legend-padding: 0;
  --radio-group-legend-margin-bottom: 8px;
  --radio-group-required-color: #f44336;
  --radio-group-gap: 8px;
  --radio-group-valid-border-color: #4caf50;
  --radio-group-invalid-border-color: #f44336;
  --radio-group-validation-color: #f44336;
  --radio-group-validation-font-size: 0.75rem;
  --radio-group-disabled-opacity: 0.38;
  --radio-group-disabled-bg: transparent;

  /* Component: Form Group */
  --form-group-margin-bottom: 16px;
  --form-group-label-font-size: 0.75rem;
  --form-group-label-color: rgba(0, 0, 0, 0.54);
  --form-group-font-family: var(--font-family-primary);
  --form-group-label-font-weight: 400;
  --form-group-label-margin-bottom: 8px;
  --form-group-required-color: #f44336;
  --form-group-help-font-size: 0.75rem;
  --form-group-help-color: rgba(0, 0, 0, 0.54);
  --form-group-label-margin-right: 16px;
  --form-group-label-margin-left: 16px;
  --form-group-label-width: 30%;

  /* Component: Form */
  --form-label-width: 30%;
  --form-section-margin-bottom: 24px;
  --form-section-title-font-size: 1.25rem;
  --form-section-title-color: var(--color-text);
  --form-section-title-font-weight: 500;
  --form-section-title-margin-bottom: 16px;
  --form-section-title-border: none;
  --form-section-description-font-size: 0.875rem;
  --form-section-description-color: rgba(0, 0, 0, 0.54);
  --form-section-description-margin-bottom: 16px;
  --form-actions-gap: 8px;
  --form-actions-margin-top: 24px;
  --form-actions-justify: flex-end;

  /* Component: Navigation */
  --nav-bg: var(--color-bg);
  --nav-border-bottom: none;
  --nav-dropdown-bg: var(--color-bg);
  --nav-dropdown-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
  --nav-padding: 0 16px;
  --nav-margin-right: 0;
  --nav-font-size: 0.875rem;
  --nav-line-height: 1.5;
  --nav-active-font-weight: 500;
  --nav-focus-shadow: none;
  --nav-item-spacing: 24px;
  --nav-item-spacing-vertical: 8px;
  --nav-submenu-indent: 16px;
  --nav-link-color: rgba(0, 0, 0, 0.87);
  --nav-link-hover-color: var(--color-brand-primary);
  --nav-link-active-color: var(--color-brand-primary);
  --nav-link-font-size: 0.875rem;
  --nav-link-padding: 8px 16px;
  --nav-link-radius: 4px;
  --nav-link-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --nav-burger-font-size: 24px;
  --nav-burger-color: rgba(0, 0, 0, 0.87);
  --nav-burger-size: 24px;
  --nav-burger-margin-bottom: 0;
  --nav-dropdown-border: none;
  --nav-dropdown-link-padding: 8px 16px;
  --nav-dropdown-padding: 8px 0;
  --nav-dropdown-radius: 4px;
  --nav-padding-mobile: 8px;
  --nav-mobile-bg: var(--color-bg);
  --nav-mobile-item-border: none;
  --nav-mobile-link-padding: 12px 16px;
  --nav-mobile-max-height: calc(100vh - 64px);
  --nav-mobile-padding: 0;
  --nav-mobile-radius: 0;
  --nav-mobile-shadow: none;
  --nav-mobile-submenu-bg: rgba(0, 0, 0, 0.04);
  --nav-mobile-active-bg: rgba(33, 150, 243, 0.12);
  --nav-mobile-hover-bg: rgba(0, 0, 0, 0.04);

  /* Component: Section */
  --section-bg: var(--color-bg);
  --section-color: var(--color-text);
  --section-padding: 48px 24px;
  --section-gap: 16px;
  --section-content-max-width: 1200px;
  --section-padding-tablet: 40px 16px;
  --section-gap-tablet: 16px;
  --section-padding-mobile: 32px 16px;
  --section-bg-minor: var(--color-bg-secondary);
  --section-color-minor: rgba(0, 0, 0, 0.54);

  /* Component: Logo */
  --logo-width: auto;
  --logo-height: 40px;
  --logo-height-tablet: 36px;
  --logo-hover-opacity: 0.8;
  --logo-max-height: 48px;
  --logo-max-width: 200px;
  --logo-width-tablet: auto;

  /* ContactInfo Component */
  --contact-info-gap: 16px;
  --contact-info-item-gap: 8px;
  --contact-info-mobile-gap: 8px;
  --contact-info-color: rgba(0, 0, 0, 0.87);
  --contact-info-hover-color: var(--color-brand-primary);
  --contact-info-font-size: 0.875rem;
  --contact-info-icon-size: 18px;

  /* StickyContactIcons Variables */
  --sticky-contact-icons-right: 24px;
  --sticky-contact-icons-gap: 12px;
  --sticky-contact-icons-padding: 12px;
  --sticky-contact-icons-bg: var(--color-white);
  --sticky-contact-icons-radius: 50%;
  --sticky-contact-icons-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  --sticky-contact-icons-size: 48px;
  --sticky-contact-icons-color: rgba(0, 0, 0, 0.54);
  --sticky-contact-icons-hover-color: var(--color-brand-primary);
  --sticky-contact-icons-icon-size: 24px;
  --sticky-contact-icons-mobile-right: 16px;
  --sticky-contact-icons-mobile-bottom: 16px;
  --sticky-contact-icons-mobile-size: 40px;
  --sticky-contact-icons-mobile-icon-size: 20px;

  /* Component: Header */
  --header-bg: var(--color-brand-primary);
  --header-bg-scrolled: var(--color-brand-primary);
  --header-branding-gap: 16px;
  --header-color: var(--color-white);
  --header-height: 64px;
  --header-height-mobile: 56px;
  --header-max-width: 100%;
  --header-padding: 0 24px;
  --header-padding-mobile: 0 16px;
  --header-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14);
  --header-shadow-scrolled: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14);
  --header-title-size: 1.25rem;
  --header-title-size-mobile: 1.125rem;
  --header-title-weight: 500;
  --header-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --header-transparent-color: var(--color-white);
  --header-z-index: 1100;

  /* Component: CollapsibleHeader */
  --collapsible-header-collapsed-height: 64px;
  --collapsible-header-contact-bg: rgba(0, 0, 0, 0.04);
  --collapsible-header-contact-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --collapsible-header-height: 100px;
  --collapsible-header-logo-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --collapsible-header-mobile-height: 56px;
  --collapsible-header-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  --collapsible-header-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Component: Footer */
  --footer-bg: #424242;
  --footer-text: rgba(255, 255, 255, 0.87);
  --footer-link-hover: var(--color-brand-primary-light);

  /* Component: PriceDisplay */
  --price-display-bg: rgba(33, 150, 243, 0.08);
  --price-display-border: 1px solid rgba(33, 150, 243, 0.24);
  --price-display-color: var(--color-brand-primary);

  /* Additional Variables */
  --color-yellow: #ffeb3b;
  --color-text-muted: rgba(0, 0, 0, 0.54);
  --transition-duration: 200ms;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  --border-radius: 4px;
  --border-radius-default: 4px;
  --box-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;
