// src/components/CollapsibleHeader/CollapsibleHeader.js
import './CollapsibleHeader.css';
import { Component } from '../../utils/componentFactory.js';
import Navigation from '../Navigation/Navigation.js';
import ContactInfo from '../ContactInfo/ContactInfo.js';
import Logo from '../Logo/Logo.js';
import Link from '../Link/Link.js';

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
   * @param {string} props.className - Additional CSS class names
   * @param {Element} [props.scrollContainer=null] - Element to listen for scroll events
   */
  constructor({
    siteName = '',
    navigation = { items: [] },
    contactInfo = {},
    logo = '',
    compactLogo = '',
    collapseThreshold = 100,
    className = '',
    scrollContainer = null, // Will default to window
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
      className,
      scrollContainer,
    };

    this.state = {
      isCollapsed: false,
      lastScrollY: 0,
    };

    this.element = this.createCollapsibleHeaderElement();
  }

  /**
   * Create the collapsible header element
   * @returns {HTMLElement} The header element
   * @private
   */
  createCollapsibleHeaderElement() {
    const { siteName, navigation, contactInfo, logo, className } = this.props;

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

    // Create contact info container
    const contactContainer = this.createElement('div', {
      className: 'collapsible-header__contact-container',
    });

    const contactInfoComponent = new ContactInfo({
      location: contactInfo.location,
      phone: contactInfo.phone,
      email: contactInfo.email,
    });

    contactContainer.appendChild(contactInfoComponent.getElement());
    container.appendChild(contactContainer);

    // Create navigation section
    const navigationContainer = this.createElement('div', {
      className: 'collapsible-header__navigation',
    });

    // Create logo container (left-aligned)
    const logoContainer = this.createElement('div', {
      className: 'collapsible-header__logo',
    });

    // Add logo to logo container
    if (logo) {
      const logoComponent = new Logo({
        sources: [{ src: logo, theme: 'default' }],
        alt: siteName || 'Logo',
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

    // Create right container for navigation
    const rightContainer = this.createElement('div', {
      className: 'collapsible-header__right',
    });

    // Add navigation to right container
    if (navigation.items && navigation.items.length > 0) {
      const nav = new Navigation({
        items: navigation.items,
        responsive: true,
        burgerPosition: 'right',
      });
      rightContainer.appendChild(nav.getElement());
    }

    // Add logo and right containers to navigation container
    navigationContainer.appendChild(logoContainer);
    navigationContainer.appendChild(rightContainer);

    container.appendChild(navigationContainer);
    headerElement.appendChild(container);

    return headerElement;
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
    } else {
      this.element.classList.remove('collapsible-header--collapsed');

      // Switch back to full logo if needed
      if (this.props.compactLogo !== this.props.logo) {
        this.updateLogo(this.props.logo);
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
   * @param {Element} container - Optional scroll container
   * @public
   */
  componentDidMount(container) {
    this.setupScrollListener(container);
  }
}
