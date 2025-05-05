// src/components/StickyContactIcons/StickyContactIcons.js
import './StickyContactIcons.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * StickyContactIcons component for displaying fixed-position contact icons on the side of the page
 * @class StickyContactIcons
 * @extends Component
 */
export default class StickyContactIcons extends Component {
  /**
   * Create a new StickyContactIcons component
   * @param {Object} props - Component properties
   * @param {string} props.location - Shop location address
   * @param {string} props.phone - Contact phone number
   * @param {string} props.email - Contact email address
   * @param {string} [props.locationId='location'] - ID of the location section to scroll to
   * @param {Function} [props.onLocationClick=null] - Optional callback for location click
   * @param {Function} [props.onPhoneClick=null] - Optional callback for phone click
   * @param {Function} [props.onEmailClick=null] - Optional callback for email click
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {string} [props.position='right'] - Position of the icons ('right' or 'bottom')
   * @param {boolean} [props.showTooltips=true] - Whether to show tooltips on hover
   */
  constructor({
    location,
    phone,
    email,
    locationId = 'location',
    onLocationClick = null,
    onPhoneClick = null,
    onEmailClick = null,
    className = '',
    position = 'right',
    showTooltips = true,
  }) {
    super();

    // Validate required props
    const missingProps = [];
    if (!location) missingProps.push('location');
    if (!phone) missingProps.push('phone');
    if (!email) missingProps.push('email');

    if (missingProps.length > 0) {
      throw new Error(
        `StickyContactIcons: Missing required props: ${missingProps.join(', ')}`
      );
    }

    this.props = {
      location,
      phone,
      email,
      locationId,
      onLocationClick,
      onPhoneClick,
      onEmailClick,
      className,
      position,
      showTooltips,
    };

    this.element = this.createStickyContactIconsElement();
  }

  /**
   * Create the sticky contact icons container
   * @returns {HTMLElement} The sticky contact icons element
   * @private
   */
  createStickyContactIconsElement() {
    const stickyContactIconsClasses = this.createClassNames(
      'sticky-contact-icons',
      {
        [`sticky-contact-icons--${this.props.position}`]:
          this.props.position !== 'right',
      },
      this.props.className
    );

    const stickyContactIconsElement = this.createElement('div', {
      className: stickyContactIconsClasses,
    });

    // Create and append location icon
    const locationElement = this.createLocationIconElement();

    // Create and append phone icon
    const phoneElement = this.createPhoneIconElement();

    // Create and append email icon
    const emailElement = this.createEmailIconElement();

    // Append all elements to the container
    this.appendChildren(stickyContactIconsElement, [
      locationElement,
      phoneElement,
      emailElement,
    ]);

    return stickyContactIconsElement;
  }

  /**
   * Create the location icon element
   * @returns {HTMLElement} The location icon element
   * @private
   */
  createLocationIconElement() {
    const locationHref = `#${this.props.locationId}`;

    const locationLink = this.createElement('a', {
      className: 'sticky-contact-icons__item',
      href: locationHref,
    });

    // Set title directly on the element
    if (this.props.showTooltips) {
      locationLink.title = this.props.location;
    } else {
      locationLink.title = '';
    }

    // Set data attribute for testing and accessibility
    locationLink.setAttribute('data-href', locationHref);
    locationLink.setAttribute(
      'aria-label',
      `Go to ${this.props.location} location`
    );

    // Add click handler with callback for testing
    locationLink.addEventListener('click', (event) => {
      // Call the custom click handler if provided
      if (this.props.onLocationClick) {
        if (this.props.onLocationClick(event) === false) {
          event.preventDefault();
        }
      }
    });

    const locationIcon = this.createElement('span', {
      className:
        'sticky-contact-icons__icon sticky-contact-icons__icon--location',
    });

    this.appendChildren(locationLink, [locationIcon]);

    return locationLink;
  }

  /**
   * Create the phone icon element
   * @returns {HTMLElement} The phone icon element
   * @private
   */
  createPhoneIconElement() {
    // Remove any non-numeric characters from phone for the href
    const cleanPhone = this.props.phone.replace(/[\s()/-]/g, '');
    const phoneHref = `tel:${cleanPhone}`;

    const phoneLink = this.createElement('a', {
      className: 'sticky-contact-icons__item',
      href: phoneHref,
    });

    // Set title directly on the element
    if (this.props.showTooltips) {
      phoneLink.title = this.props.phone;
    } else {
      phoneLink.title = '';
    }

    // Set data attribute for testing and accessibility
    phoneLink.setAttribute('data-href', phoneHref);
    phoneLink.setAttribute('aria-label', `Call ${this.props.phone}`);

    // Add click handler if provided
    if (this.props.onPhoneClick) {
      phoneLink.addEventListener('click', (event) => {
        // Allow for custom handling
        if (this.props.onPhoneClick(event) === false) {
          event.preventDefault();
        }
      });
    }

    const phoneIcon = this.createElement('span', {
      className: 'sticky-contact-icons__icon sticky-contact-icons__icon--phone',
    });

    this.appendChildren(phoneLink, [phoneIcon]);

    return phoneLink;
  }

  /**
   * Create the email icon element
   * @returns {HTMLElement} The email icon element
   * @private
   */
  createEmailIconElement() {
    const emailHref = `mailto:${this.props.email}`;

    const emailLink = this.createElement('a', {
      className: 'sticky-contact-icons__item',
      href: emailHref,
    });

    // Set title directly on the element
    if (this.props.showTooltips) {
      emailLink.title = this.props.email;
    } else {
      emailLink.title = '';
    }

    // Set data attribute for testing and accessibility
    emailLink.setAttribute('data-href', emailHref);
    emailLink.setAttribute('aria-label', `Email ${this.props.email}`);

    // Add click handler if provided
    if (this.props.onEmailClick) {
      emailLink.addEventListener('click', (event) => {
        // Allow for custom handling
        if (this.props.onEmailClick(event) === false) {
          event.preventDefault();
        }
      });
    }

    const emailIcon = this.createElement('span', {
      className: 'sticky-contact-icons__icon sticky-contact-icons__icon--email',
    });

    this.appendChildren(emailLink, [emailIcon]);

    return emailLink;
  }

  /**
   * Get the sticky contact icons element
   * @returns {HTMLElement} The sticky contact icons element
   * @public
   */
  getElement() {
    return this.element;
  }
}
