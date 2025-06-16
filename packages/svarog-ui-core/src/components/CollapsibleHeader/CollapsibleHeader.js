// src/components/CollapsibleHeader/CollapsibleHeader.js
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { collapsibleHeaderStyles } from './CollapsibleHeader.styles.js';
import Navigation from '../Navigation/Navigation.js';
import ContactInfo from '../ContactInfo/ContactInfo.js';
import Logo from '../Logo/Logo.js';
import Link from '../Link/Link.js';
import Button from '../Button/Button.js';

// Create style injector for CollapsibleHeader component
const injectStyles = createStyleInjector('CollapsibleHeader');

/**
 * Migrates legacy props to standardized prop names
 * @param {Object} props - Component properties
 * @returns {Object} - Migrated properties
 * @private
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  // Migrate onCallButtonClick → onCallClick
  if ('onCallButtonClick' in props && !('onCallClick' in props)) {
    console.warn(
      '[CollapsibleHeader] onCallButtonClick is deprecated, use onCallClick instead'
    );
    migrated.onCallClick = props.onCallButtonClick;
    delete migrated.onCallButtonClick;
  }

  return migrated;
};

/**
 * Validates collapsible header specific props
 * @param {Object} props - CollapsibleHeader properties
 */
const validateCollapsibleHeaderProps = (props) => {
  const missingProps = [];

  if (!props.siteName && !props.logo) {
    missingProps.push('siteName or logo');
  }
  if (!props.navigation.items || props.navigation.items.length === 0) {
    missingProps.push('navigation.items');
  }
  if (!props.contactInfo.location) {
    missingProps.push('contactInfo.location');
  }
  if (!props.contactInfo.phone) {
    missingProps.push('contactInfo.phone');
  }
  if (!props.contactInfo.email) {
    missingProps.push('contactInfo.email');
  }

  if (missingProps.length > 0) {
    throw new Error(`Missing required props: ${missingProps.join(', ')}`);
  }
};

/**
 * Gets logo configuration based on current state - KISS approach
 * @param {Object} state - Current component state
 * @returns {Object} Logo configuration
 * @private
 */
const getLogoConfig = (state) => {
  const shouldUseCompactLogo = state.isMobile || state.isCollapsed;
  const logoSrc = shouldUseCompactLogo ? state.compactLogo : state.logo;

  // Use CSS variables for size control - more flexible than props
  const logoClass = shouldUseCompactLogo
    ? 'header-logo header-logo--compact'
    : 'header-logo header-logo--full';

  return {
    imageUrl: logoSrc, // ✅ Use correct prop name
    alt: state.siteName || 'Logo',
    responsive: true,
    className: logoClass,
  };
};

/**
 * Creates CollapsibleHeader DOM element
 * @param {Object} state - CollapsibleHeader state
 * @returns {HTMLElement} - CollapsibleHeader element
 */
const renderCollapsibleHeader = (state) => {
  // Inject styles on first render
  injectStyles(collapsibleHeaderStyles);

  const {
    siteName,
    navigation,
    contactInfo,
    callButtonText,
    onCallClick,
    className,
    isCollapsed,
    isMobile,
  } = state;

  // Create header element with proper classes
  const headerElement = createElement('header', {
    classes: [
      'collapsible-header',
      isCollapsed ? 'collapsible-header--collapsed' : '',
      isMobile ? 'collapsible-header--mobile' : '',
      className,
    ].filter(Boolean),
  });

  // Create container
  const container = createElement('div', {
    classes: ['collapsible-header__container'],
  });

  // Create logo container
  const logoContainer = createElement('div', {
    classes: ['collapsible-header__logo'],
  });

  // Add logo with proper configuration - KISS approach
  if (state.logo) {
    const logoConfig = getLogoConfig(state);
    const logoComponent = Logo(logoConfig);

    const logoLink = Link({
      children: logoComponent.getElement(),
      href: '/',
      block: true,
    });

    logoContainer.appendChild(logoLink.getElement());
  } else if (siteName) {
    const siteNameLink = Link({
      children: siteName,
      href: '/',
      block: true,
      className: 'header__site-name',
    });

    logoContainer.appendChild(siteNameLink.getElement());
  }

  // Create content container for contact and navigation
  const contentContainer = createElement('div', {
    classes: ['collapsible-header__content'],
  });

  // Create contact info container
  const contactContainer = createElement('div', {
    classes: ['collapsible-header__contact-container'],
  });

  const contactInfoComponent = ContactInfo({
    location: contactInfo.location,
    phone: contactInfo.phone,
    email: contactInfo.email,
  });

  contactContainer.appendChild(contactInfoComponent.getElement());

  // Create navigation container
  const navigationContainer = createElement('div', {
    classes: ['collapsible-header__navigation'],
  });

  // Add navigation with proper mobile configuration
  if (navigation.items && navigation.items.length > 0) {
    const nav = Navigation({
      items: navigation.items,
      responsive: true,
      burgerPosition: 'right',
      mobileMenuStyle: 'fullscreen',
    });
    navigationContainer.appendChild(nav.getElement());

    // Only add call button if not on mobile
    if (!isMobile) {
      // Create call button
      const callButtonContainer = createElement('div', {
        classes: ['collapsible-header__call-button'],
      });

      // Default click handler that uses the phone number if no custom handler provided
      const handleCallClick =
        onCallClick ||
        (() => {
          window.location.href = `tel:${contactInfo.phone.replace(/[\s()/-]/g, '')}`;
        });

      const callButton = Button({
        text: callButtonText,
        variant: 'default',
        onClick: handleCallClick,
      });

      callButtonContainer.appendChild(callButton.getElement());
      navigationContainer.appendChild(callButtonContainer);
    }
  }

  // Assemble the header
  contentContainer.appendChild(contactContainer);
  contentContainer.appendChild(navigationContainer);

  container.appendChild(logoContainer);
  container.appendChild(contentContainer);

  headerElement.appendChild(container);

  return headerElement;
};

/**
 * Creates a CollapsibleHeader component
 * @param {Object} props - CollapsibleHeader properties
 * @returns {Object} CollapsibleHeader component API
 */
const createCollapsibleHeader = (props) => {
  // Standardize props
  const standardizedProps = migrateLegacyProps(props);

  // Validate props
  validateProps(standardizedProps, createCollapsibleHeader.requiredProps);

  // Custom validation
  try {
    validateCollapsibleHeaderProps(standardizedProps);
  } catch (error) {
    throw new Error(`CollapsibleHeader: ${error.message}`);
  }

  // Initial state with defaults
  const initialState = {
    siteName: standardizedProps.siteName || '',
    navigation: standardizedProps.navigation || { items: [] },
    contactInfo: standardizedProps.contactInfo || {},
    logo: standardizedProps.logo || '',
    compactLogo: standardizedProps.compactLogo || standardizedProps.logo || '',
    callButtonText: standardizedProps.callButtonText || 'Anrufen',
    onCallClick: standardizedProps.onCallClick || null,
    className: standardizedProps.className || '',
    isCollapsed: standardizedProps.isCollapsed || false,
    isMobile: standardizedProps.isMobile || false,
  };

  // Create the base component
  const component = createBaseComponent(renderCollapsibleHeader)(initialState);

  /**
   * Component state for tracking
   * @type {Object}
   * @private
   */
  let componentState = { ...initialState };

  // Create extended component with additional properties
  const headerComponent = {
    ...component,

    /**
     * Get the current component state
     * @returns {Object} Current component state
     * @public
     */
    getState() {
      return componentState;
    },

    /**
     * Update component with new props - KISS approach
     * @param {Object} newProps - New properties to update
     * @returns {Object} Component instance for chaining
     * @public
     */
    update(newProps) {
      // Standardize any new props
      const standardizedNewProps = migrateLegacyProps(newProps);

      // Update our stored state
      componentState = { ...componentState, ...standardizedNewProps };

      // For logo switching, always do full re-render - KISS principle
      // This ensures the correct logo is always used
      return component.update(standardizedNewProps);
    },

    /**
     * Determines if component should fully re-render
     * Always return true for logo-related changes - KISS approach
     * @param {Object} newProps - New properties
     * @returns {boolean} Whether a full re-render is required
     * @public
     */
    shouldRerender(newProps) {
      // Always re-render when any significant prop changes - KISS
      return Object.keys(newProps).length > 0;
    },
  };

  return headerComponent;
};

// Define required props for validation
createCollapsibleHeader.requiredProps = ['navigation', 'contactInfo'];

// Create the component with theme awareness
const CollapsibleHeader = withThemeAwareness(
  createComponent('CollapsibleHeader', createCollapsibleHeader)
);

// Export as a factory function
export default CollapsibleHeader;
