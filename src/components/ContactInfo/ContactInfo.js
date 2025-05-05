// src/components/ContactInfo/ContactInfo.js
import './ContactInfo.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * ContactInfo component for displaying location, phone and email with interactive functionality
 * @class ContactInfo
 * @extends Component
 */
export default class ContactInfo extends Component {
  /**
   * Create a new ContactInfo component
   * @param {Object} props - Component properties
   * @param {string} props.location - Shop location address
   * @param {string} props.phone - Contact phone number
   * @param {string} props.email - Contact email address
   * @param {string} [props.locationId='location'] - ID of the location section to scroll to
   * @param {Function} [props.onLocationClick=null] - Optional callback for location click
   * @param {Function} [props.onPhoneClick=null] - Optional callback for phone click
   * @param {Function} [props.onEmailClick=null] - Optional callback for email click
   * @param {string} [props.className=''] - Additional CSS class names
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
  }) {
    super();

    // Validate required props
    const missingProps = [];
    if (!location) missingProps.push('location');
    if (!phone) missingProps.push('phone');
    if (!email) missingProps.push('email');

    if (missingProps.length > 0) {
      throw new Error(
        `ContactInfo: Missing required props: ${missingProps.join(', ')}`
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
    };

    this.element = this.createContactInfoElement();
  }

  /**
   * Create the contact info element with all contact information
   * @returns {HTMLElement} The contact info element
   * @private
   */
  createContactInfoElement() {
    const contactInfoClasses = this.createClassNames(
      'contact-info',
      this.props.className
    );

    const contactInfoElement = this.createElement('div', {
      className: contactInfoClasses,
    });

    // Create and append location element
    const locationElement = this.createLocationElement();

    // Create and append phone element
    const phoneElement = this.createPhoneElement();

    // Create and append email element
    const emailElement = this.createEmailElement();

    // Append all elements to the contact info container
    this.appendChildren(contactInfoElement, [
      locationElement,
      phoneElement,
      emailElement,
    ]);

    return contactInfoElement;
  }

  /**
   * Create the location element as a link to the location section
   * @returns {HTMLElement} The location element
   * @private
   */
  createLocationElement() {
    const locationHref = `#${this.props.locationId}`;

    const locationLink = this.createElement('a', {
      className: 'contact-info__item contact-info__item--location',
      href: locationHref,
      title: `Go to ${this.props.location} location`,
    });

    // Set data attribute for testing
    locationLink.setAttribute('data-href', locationHref);

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
      className: 'contact-info__icon contact-info__icon--location',
    });

    const locationText = this.createElement('span', {
      className: 'contact-info__text',
      textContent: this.props.location,
    });

    this.appendChildren(locationLink, [locationIcon, locationText]);

    return locationLink;
  }

  /**
   * Create the phone element with click-to-call functionality
   * @returns {HTMLElement} The phone element
   * @private
   */
  createPhoneElement() {
    // Remove any non-numeric characters from phone for the href
    const cleanPhone = this.props.phone.replace(/[\s()/-]/g, '');
    const phoneHref = `tel:${cleanPhone}`;

    const phoneLink = this.createElement('a', {
      className: 'contact-info__item contact-info__item--phone',
      href: phoneHref,
      title: `Call ${this.props.phone}`,
    });

    // Set data attribute for testing
    phoneLink.setAttribute('data-href', phoneHref);

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
      className: 'contact-info__icon contact-info__icon--phone',
    });

    const phoneText = this.createElement('span', {
      className: 'contact-info__text',
      textContent: this.props.phone,
    });

    this.appendChildren(phoneLink, [phoneIcon, phoneText]);

    return phoneLink;
  }

  /**
   * Create the email element with mailto functionality
   * @returns {HTMLElement} The email element
   * @private
   */
  createEmailElement() {
    const emailHref = `mailto:${this.props.email}`;

    const emailLink = this.createElement('a', {
      className: 'contact-info__item contact-info__item--email',
      href: emailHref,
      title: `Email ${this.props.email}`,
    });

    // Set data attribute for testing
    emailLink.setAttribute('data-href', emailHref);

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
      className: 'contact-info__icon contact-info__icon--email',
    });

    const emailText = this.createElement('span', {
      className: 'contact-info__text',
      textContent: this.props.email,
    });

    this.appendChildren(emailLink, [emailIcon, emailText]);

    return emailLink;
  }

  /**
   * Get the contact info element
   * @returns {HTMLElement} The contact info element
   * @public
   */
  getElement() {
    return this.element;
  }
}
