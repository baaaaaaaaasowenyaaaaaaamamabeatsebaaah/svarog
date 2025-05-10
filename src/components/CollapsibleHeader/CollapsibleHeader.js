// src/components/CollapsibleHeader/CollapsibleHeader.js
import './CollapsibleHeader.css';
import { Component } from '../../utils/componentFactory.js';
import Navigation from '../Navigation/Navigation.js';
import ContactInfo from '../ContactInfo/ContactInfo.js';
import Logo from '../Logo/Logo.js';
import Link from '../Link/Link.js';
import Button from '../Button/Button.js';
import StickyContactIcons from '../StickyContactIcons/StickyContactIcons.js';

/**
 * CollapsibleHeader component that combines Header and ContactInfo with scroll animation
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
   * @param {number} props.collapseThreshold - Scroll threshold in pixels to trigger collapse
   * @param {string} props.callButtonText - Text for the call button (default: "Anrufen")
   * @param {Function} props.onCallButtonClick - Callback for call button click
   * @param {string} props.className - Additional CSS class names
   * @param {Element} [props.scrollContainer=null] - Element to listen for scroll events
   * @param {boolean} [props.showStickyIcons=true] - Whether to show sticky icons when collapsed
   * @param {string} [props.stickyIconsPosition='right'] - Position of sticky icons ('right' or 'bottom')
   */
  constructor({
    siteName = '',
    navigation = { items: [] },
    contactInfo = {},
    logo = '',
    compactLogo = '',
    collapseThreshold = 100,
    callButtonText = 'Anrufen',
    onCallButtonClick = null,
    className = '',
    scrollContainer = null, // Will default to window
    showStickyIcons = true,
    stickyIconsPosition = 'right',
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
      compactLogo: compactLogo || logo, // Use the regular logo if no compact logo is provided
      collapseThreshold,
      callButtonText,
      onCallButtonClick,
      className,
      scrollContainer,
      showStickyIcons,
      stickyIconsPosition,
    };

    this.state = {
      isCollapsed: false,
      lastScrollY: 0,
      isMobile: this.checkIsMobile(),
    };

    this.element = this.createCollapsibleHeaderElement();

    // Create the sticky contact icons but don't append it yet
    if (this.props.showStickyIcons) {
      this.createStickyContactIcons();
    }

    // Initialize scroll listener in constructor to fix tests
    this.setupScrollListener(scrollContainer);

    // Set up resize listener for mobile detection
    this.setupResizeListener();
  }

  /**
   * Check if currently in mobile view
   * @private
   * @returns {boolean} true if in mobile view
   */
  checkIsMobile() {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
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
      logo,
      callButtonText,
      onCallButtonClick,
      className,
    } = this.props;

    const headerClasses = this.createClassNames(
      'collapsible-header',
      {
        'collapsible-header--collapsed': this.state.isCollapsed,
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

    // Determine which logo to use based on mobile state and collapsed state
    const shouldUseCompactLogo = this.state.isMobile || this.state.isCollapsed;
    let logoToUse =
      shouldUseCompactLogo && this.props.compactLogo
        ? this.props.compactLogo
        : logo;

    // Add logo to logo container
    if (logoToUse) {
      const logoComponent = new Logo({
        sources: [{ src: logoToUse, theme: 'default' }],
        alt: siteName || 'Logo',
        responsive: true,
        width: this.state.isMobile ? 100 : 120, // Different width based on mobile state
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
        mobileMenuStyle: 'fullscreen', // Configure for fullscreen mobile menu
      });
      navigationContainer.appendChild(nav.getElement());

      // Only add call button if not on mobile
      if (!this.state.isMobile) {
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
   * Create the sticky contact icons component
   * @private
   */
  createStickyContactIcons() {
    const { contactInfo, stickyIconsPosition } = this.props;

    this.stickyIcons = new StickyContactIcons({
      location: contactInfo.location,
      phone: contactInfo.phone,
      email: contactInfo.email,
      position: stickyIconsPosition,
      className: 'collapsible-header__sticky-icons',
    });

    // Add custom styles to position the sticky icons correctly
    const stickyIconsElement = this.stickyIcons.getElement();

    // Hide initially - only show when header is collapsed
    stickyIconsElement.style.display = 'none';

    // Apply custom styles to maintain space from header
    stickyIconsElement.style.top = 'var(--sticky-icons-top-offset, 80px)';

    // Add to body element to avoid z-index issues
    document.body.appendChild(stickyIconsElement);
  }

  /**
   * Set up resize listener to handle mobile state changes
   * @private
   */
  setupResizeListener() {
    if (typeof window === 'undefined') return;

    this.handleResize = () => {
      const wasMobile = this.state.isMobile;
      const isMobile = this.checkIsMobile();

      // Only update if mobile state changed
      if (wasMobile !== isMobile) {
        this.state.isMobile = isMobile;

        // When mobile state changes, we may need to recreate the element
        // This is necessary because some mobile-specific config needs to be applied
        // to components at creation time
        this.resetHeader();
      }
    };

    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Reset the header by recreating it
   * This ensures all components are configured properly for current state
   * @private
   */
  resetHeader() {
    const oldElement = this.element;
    this.element = this.createCollapsibleHeaderElement();

    if (oldElement && oldElement.parentNode) {
      oldElement.parentNode.replaceChild(this.element, oldElement);
    }

    // Re-apply collapsed state if necessary
    if (this.state.isCollapsed) {
      this.element.classList.add('collapsible-header--collapsed');
    }
  }

  /**
   * Set up scroll event listener for header collapse/expand
   * @param {Element} container - Element to listen for scroll events
   * @private
   */
  setupScrollListener(container) {
    // Use the provided container or default to window
    this.scrollContainer = container || window;

    // Keep track of the reference to remove the listener later
    this.handleScroll = () => {
      const scrollY =
        this.scrollContainer === window
          ? window.scrollY
          : this.scrollContainer.scrollTop;

      const { collapseThreshold } = this.props;

      // Determine if header should be collapsed
      const shouldCollapse = scrollY > collapseThreshold;

      // Only update the DOM if the state has changed
      if (shouldCollapse !== this.state.isCollapsed) {
        this.state.isCollapsed = shouldCollapse;
        this.updateCollapseState();
      }

      // Store current scroll position for next comparison
      this.state.lastScrollY = scrollY;
    };

    // Add scroll event listener
    this.scrollContainer.addEventListener('scroll', this.handleScroll, {
      passive: true,
    });
  }

  /**
   * Update the header collapse state based on current state
   * @private
   */
  updateCollapseState() {
    if (this.state.isCollapsed) {
      this.element.classList.add('collapsible-header--collapsed');

      // Optionally switch to compact logo if provided
      if (this.props.compactLogo !== this.props.logo) {
        this.updateLogo(this.props.compactLogo);
      }

      // Show sticky contact icons when collapsed
      if (this.props.showStickyIcons && this.stickyIcons) {
        const iconElement = this.stickyIcons.getElement();
        if (iconElement) {
          iconElement.style.display = 'flex';

          // Calculate the header height and add offset for spacing
          const headerHeight = this.element.offsetHeight;
          iconElement.style.setProperty(
            '--sticky-icons-top-offset',
            `${headerHeight + 20}px`
          );
        }
      }
    } else {
      this.element.classList.remove('collapsible-header--collapsed');

      // Switch back to full logo if needed and not in mobile
      if (this.props.compactLogo !== this.props.logo) {
        if (this.state.isMobile) {
          // Keep compact logo on mobile
          this.updateLogo(this.props.compactLogo);
        } else {
          this.updateLogo(this.props.logo);
        }
      }

      // Hide sticky contact icons when expanded
      if (this.props.showStickyIcons && this.stickyIcons) {
        const iconElement = this.stickyIcons.getElement();
        if (iconElement) {
          iconElement.style.display = 'none';
        }
      }
    }
  }

  /**
   * Update the logo source
   * @param {string} logoSrc - New logo source URL
   * @private
   */
  updateLogo(logoSrc) {
    const logoElement = this.element.querySelector('.logo-img');
    if (logoElement) {
      logoElement.src = logoSrc;
    }
  }

  /**
   * Clean up event listeners when the component is removed
   */
  destroy() {
    if (this.scrollContainer && this.handleScroll) {
      this.scrollContainer.removeEventListener('scroll', this.handleScroll);
    }

    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
    }

    // Remove sticky icons if they exist
    if (this.props.showStickyIcons && this.stickyIcons) {
      const iconElement = this.stickyIcons.getElement();
      if (iconElement && iconElement.parentNode) {
        iconElement.parentNode.removeChild(iconElement);
      }
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

  /**
   * Called after the component is mounted to the DOM
   * This method is already called in the constructor, but
   * can be called again if needed for a different container
   * @param {Element} container - Optional scroll container
   * @public
   */
  componentDidMount(container) {
    if (container && container !== this.scrollContainer) {
      // Clean up old listener if exists
      if (this.scrollContainer && this.handleScroll) {
        this.scrollContainer.removeEventListener('scroll', this.handleScroll);
      }

      // Set up new listener
      this.setupScrollListener(container);
    }
  }
}
