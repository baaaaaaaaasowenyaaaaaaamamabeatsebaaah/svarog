// src/components/CollapsibleHeader/CollapsibleHeader.js
import './CollapsibleHeader.css';
import { Component } from '../../utils/componentFactory.js';
import Navigation from '../Navigation/Navigation.js';
import ContactInfo from '../ContactInfo/ContactInfo.js';
import Logo from '../Logo/Logo.js';
import Link from '../Link/Link.js';
import Button from '../Button/Button.js';

/**
 * CollapsibleHeader component that combines Header and ContactInfo
 *
 * This is a presentational component that renders UI based on props.
 * It does NOT manage its own state or listen to scroll events.
 *
 * @class CollapsibleHeader
 * @extends Component
 */
export default class CollapsibleHeader extends Component {
  /**
   * Create a new CollapsibleHeader component
   * @param {Object} props - Component properties
   * @param {string} props.siteName - Site name to display
   * @param {Object} props.navigation - Navigation configuration object
   * @param {Array} props.navigation.items - Navigation items array
   * @param {Object} props.contactInfo - Contact information
   * @param {string} props.contactInfo.location - Location address
   * @param {string} props.contactInfo.phone - Phone number
   * @param {string} props.contactInfo.email - Email address
   * @param {string} props.logo - URL to logo image
   * @param {string} props.compactLogo - URL to compact logo image for collapsed state
   * @param {string} props.callButtonText - Text for the call button (default: "Anrufen")
   * @param {Function} props.onCallButtonClick - Callback for call button click
   * @param {string} props.className - Additional CSS class names
   * @param {boolean} props.isCollapsed - Whether the header is collapsed
   * @param {boolean} props.isMobile - Whether the component is in mobile view
   */
  constructor({
    siteName = '',
    navigation = { items: [] },
    contactInfo = {},
    logo = '',
    compactLogo = '',
    callButtonText = 'Anrufen',
    onCallButtonClick = null,
    className = '',
    isCollapsed = false,
    isMobile = false,
  }) {
    super();

    // Validate required properties
    const missingProps = [];
    if (!siteName && !logo) missingProps.push('siteName or logo');
    if (!navigation.items || navigation.items.length === 0)
      missingProps.push('navigation.items');
    if (!contactInfo.location) missingProps.push('contactInfo.location');
    if (!contactInfo.phone) missingProps.push('contactInfo.phone');
    if (!contactInfo.email) missingProps.push('contactInfo.email');

    if (missingProps.length > 0) {
      throw new Error(
        `CollapsibleHeader: Missing required props: ${missingProps.join(', ')}`
      );
    }

    this.props = {
      siteName,
      navigation,
      contactInfo,
      logo,
      compactLogo: compactLogo || logo,
      callButtonText,
      onCallButtonClick,
      className,
      isCollapsed,
      isMobile,
    };

    // Create main element
    this.element = this.createCollapsibleHeaderElement();
  }

  /**
   * Create the collapsible header element
   * @returns {HTMLElement} The header element
   * @private
   */
  createCollapsibleHeaderElement() {
    const {
      siteName,
      navigation,
      contactInfo,
      callButtonText,
      onCallButtonClick,
      className,
      isCollapsed,
      isMobile,
    } = this.props;

    const headerClasses = this.createClassNames(
      'collapsible-header',
      {
        'collapsible-header--collapsed': isCollapsed,
        'collapsible-header--mobile': isMobile,
      },
      className
    );

    const headerElement = this.createElement('header', {
      className: headerClasses,
    });

    const container = this.createElement('div', {
      className: 'collapsible-header__container',
    });

    // Create logo container (left-aligned and vertically centered)
    const logoContainer = this.createElement('div', {
      className: 'collapsible-header__logo',
    });

    // Determine which logo to use based on props
    const shouldUseCompactLogo = isMobile || isCollapsed;
    const logoToUse = shouldUseCompactLogo
      ? this.props.compactLogo
      : this.props.logo;

    // Add logo to logo container
    if (logoToUse) {
      const logoComponent = new Logo({
        sources: logoToUse,
        alt: siteName || 'Logo',
        responsive: true,
        width: isMobile ? 100 : 120, // Different width based on mobile state
      });

      const logoLink = new Link({
        children: logoComponent.getElement(),
        href: '/',
        block: true,
      });

      logoContainer.appendChild(logoLink.getElement());
    } else if (siteName) {
      const siteNameLink = new Link({
        children: siteName,
        href: '/',
        block: true,
        className: 'header__site-name',
      });

      logoContainer.appendChild(siteNameLink.getElement());
    }

    // Create content container for contact and navigation
    const contentContainer = this.createElement('div', {
      className: 'collapsible-header__content',
    });

    // Create contact info container (top-right aligned)
    const contactContainer = this.createElement('div', {
      className: 'collapsible-header__contact-container',
    });

    const contactInfoComponent = new ContactInfo({
      location: contactInfo.location,
      phone: contactInfo.phone,
      email: contactInfo.email,
    });

    contactContainer.appendChild(contactInfoComponent.getElement());

    // Create navigation container (bottom-right aligned)
    const navigationContainer = this.createElement('div', {
      className: 'collapsible-header__navigation',
    });

    // Add navigation with proper mobile configuration
    if (navigation.items && navigation.items.length > 0) {
      const nav = new Navigation({
        items: navigation.items,
        responsive: true,
        burgerPosition: 'right',
        mobileMenuStyle: 'fullscreen',
      });
      navigationContainer.appendChild(nav.getElement());

      // Only add call button if not on mobile
      if (!isMobile) {
        // Create call button
        const callButtonContainer = this.createElement('div', {
          className: 'collapsible-header__call-button',
        });

        // Default click handler that uses the phone number if no custom handler provided
        const handleCallClick =
          onCallButtonClick ||
          (() => {
            window.location.href = `tel:${contactInfo.phone.replace(/[\s()/-]/g, '')}`;
          });

        const callButton = new Button({
          text: callButtonText,
          variant: 'primary',
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
  }

  /**
   * Update the component with new props
   * @param {Object} props - New props to update the component with
   * @public
   */
  update(props) {
    // Merge new props with existing props
    this.props = { ...this.props, ...props };

    // Update collapsed and mobile classes
    this.element.classList.toggle(
      'collapsible-header--collapsed',
      this.props.isCollapsed
    );
    this.element.classList.toggle(
      'collapsible-header--mobile',
      this.props.isMobile
    );

    // Update logo based on new state
    this.updateLogo();

    // Update call button visibility based on mobile state
    this.updateCallButtonVisibility();
  }

  /**
   * Update the logo based on current props
   * @private
   */
  updateLogo() {
    const shouldUseCompactLogo = this.props.isMobile || this.props.isCollapsed;
    const logoSrc = shouldUseCompactLogo
      ? this.props.compactLogo
      : this.props.logo;

    // Find and update logo image
    const logoImg = this.element.querySelector('.logo-image');
    if (logoImg && logoImg.src !== logoSrc) {
      logoImg.src = logoSrc;

      // Update width based on mobile state
      const logoContainer = this.element.querySelector('.logo-container');
      if (logoContainer) {
        logoContainer.style.width = this.props.isMobile ? '100px' : '120px';
      }
    }
  }

  /**
   * Update call button visibility based on mobile state
   * @private
   */
  updateCallButtonVisibility() {
    const callButtonContainer = this.element.querySelector(
      '.collapsible-header__call-button'
    );
    if (callButtonContainer) {
      callButtonContainer.style.display = this.props.isMobile
        ? 'none'
        : 'block';
    }
  }

  /**
   * Get the header element
   * @returns {HTMLElement} The header element
   * @public
   */
  getElement() {
    return this.element;
  }
}
