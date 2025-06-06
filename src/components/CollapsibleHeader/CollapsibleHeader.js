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

  // Create logo container (left-aligned and vertically centered)
  const logoContainer = createElement('div', {
    classes: ['collapsible-header__logo'],
  });

  // Determine which logo to use based on state
  const shouldUseCompactLogo = isMobile || isCollapsed;
  const logoToUse = shouldUseCompactLogo ? state.compactLogo : state.logo;

  // Add logo to logo container
  if (logoToUse) {
    const logoComponent = Logo({
      src: logoToUse,
      alt: siteName || 'Logo',
      responsive: true,
      width: isMobile ? 100 : 120,
    });

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
   * We maintain a separate state object (componentState) for efficient partial updates.
   * While the baseComponent has its own internal state used for full re-renders,
   * this additional state allows us to:
   * 1. Track the current state for partial DOM updates without triggering full re-renders
   * 2. Provide a getState() method that clients can use to inspect component state
   * 3. Support complex state transitions that don't require complete DOM rebuilding
   * @type {Object}
   * @private
   */
  let componentState = { ...initialState };

  /**
   * Update logo based on current state
   * @param {HTMLElement} element - The header element
   * @param {Object} state - Current component state
   * @private
   */
  const updateLogo = (element, state) => {
    const shouldUseCompactLogo = state.isMobile || state.isCollapsed;
    const logoSrc = shouldUseCompactLogo ? state.compactLogo : state.logo;

    // Find and update logo image
    const logoImg = element.querySelector('.logo-image');
    if (logoImg && logoImg.src !== logoSrc) {
      logoImg.src = logoSrc;

      // Update width based on mobile state
      const logoContainer = element.querySelector('.logo-container');
      if (logoContainer) {
        logoContainer.style.width = state.isMobile ? '100px' : '120px';
      }
    }
  };

  /**
   * Update call button visibility based on mobile state
   * @param {HTMLElement} element - The header element
   * @param {Object} state - Current component state
   * @private
   */
  const updateCallButtonVisibility = (element, state) => {
    const callButtonContainer = element.querySelector(
      '.collapsible-header__call-button'
    );
    if (callButtonContainer) {
      callButtonContainer.style.display = state.isMobile ? 'none' : 'block';
    }
  };

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
     * Update component with new props
     * @param {Object} newProps - New properties to update
     * @returns {Object} Component instance for chaining
     * @public
     */
    update(newProps) {
      // Standardize any new props
      const standardizedNewProps = migrateLegacyProps(newProps);

      // Update our stored state
      componentState = { ...componentState, ...standardizedNewProps };

      // Check if we should do a full re-render
      if (this.shouldRerender(standardizedNewProps)) {
        // Let the base component handle the complete re-render
        return component.update(standardizedNewProps);
      }

      const element = this.getElement();

      // Handle partial updates
      if (standardizedNewProps.isCollapsed !== undefined) {
        element.classList.toggle(
          'collapsible-header--collapsed',
          standardizedNewProps.isCollapsed
        );

        // Update logo based on collapsed state
        if (element.querySelector('.logo-image')) {
          updateLogo(element, componentState);
        }
      }

      if (standardizedNewProps.isMobile !== undefined) {
        element.classList.toggle(
          'collapsible-header--mobile',
          standardizedNewProps.isMobile
        );

        // Update logo based on mobile state
        if (element.querySelector('.logo-image')) {
          updateLogo(element, componentState);
        }

        // Update call button visibility
        updateCallButtonVisibility(element, componentState);
      }

      // Update className if provided
      if (standardizedNewProps.className !== undefined) {
        // Remove old custom class if it exists
        if (componentState.className) {
          element.classList.remove(componentState.className);
        }

        // Add new custom class if provided
        if (standardizedNewProps.className) {
          element.classList.add(standardizedNewProps.className);
        }
      }

      return this;
    },

    /**
     * Determines if component should fully re-render
     * @param {Object} newProps - New properties
     * @returns {boolean} Whether a full re-render is required
     * @public
     */
    shouldRerender(newProps) {
      // These props require a full re-render
      return [
        'navigation',
        'contactInfo',
        'logo',
        'compactLogo',
        'siteName',
        'callButtonText',
        'onCallClick',
      ].some((prop) => newProps[prop] !== undefined);
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
