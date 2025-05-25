// src/components/ContactInfo/ContactInfo.js
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { contactInfoStyles } from './ContactInfo.styles.js';

// Create style injector for ContactInfo component
const injectContactInfoStyles = createStyleInjector('ContactInfo');

/**
 * Migrates legacy prop names to standardized prop names.
 * @param {Object} props - The component props
 * @returns {Object} - The normalized props
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  // Add migration handlers if needed in the future

  return migrated;
};

/**
 * Creates ContactInfo DOM element
 * @param {Object} state - ContactInfo state
 * @returns {HTMLElement} - ContactInfo element
 */
const renderContactInfo = (state) => {
  console.log('renderContactInfo called - injecting styles');

  // Inject styles on render
  injectContactInfoStyles(contactInfoStyles);

  console.log('Styles injected in render, checking DOM...');
  const injectedStyle = document.querySelector('[data-svarog="contactinfo"]');
  console.log('Style found in DOM:', !!injectedStyle);
  // Inject styles on render
  injectContactInfoStyles(contactInfoStyles);

  // Create the contact info container
  const contactInfoClasses = ['contact-info'];
  if (state.className) contactInfoClasses.push(state.className);

  const contactInfoElement = createElement('div', {
    classes: contactInfoClasses,
  });

  // Create location element
  const locationHref = `#${state.locationId}`;
  const locationLink = createElement('a', {
    classes: ['contact-info__item', 'contact-info__item--location'],
    attributes: {
      href: locationHref,
      title: `Go to ${state.location} location`,
      'data-href': locationHref,
    },
    events: state.onLocationClick
      ? {
          click: (event) => {
            if (state.onLocationClick(event) === false) {
              event.preventDefault();
            }
          },
        }
      : {},
    children: [
      createElement('span', {
        classes: ['contact-info__icon', 'contact-info__icon--location'],
      }),
      createElement('span', {
        classes: ['contact-info__text'],
        text: state.location,
      }),
    ],
  });

  // Create phone element
  const cleanPhone = state.phone.replace(/[\s()/-]/g, '');
  const phoneHref = `tel:${cleanPhone}`;
  const phoneLink = createElement('a', {
    classes: ['contact-info__item', 'contact-info__item--phone'],
    attributes: {
      href: phoneHref,
      title: `Call ${state.phone}`,
      'data-href': phoneHref,
    },
    events: state.onPhoneClick
      ? {
          click: (event) => {
            if (state.onPhoneClick(event) === false) {
              event.preventDefault();
            }
          },
        }
      : {},
    children: [
      createElement('span', {
        classes: ['contact-info__icon', 'contact-info__icon--phone'],
      }),
      createElement('span', {
        classes: ['contact-info__text'],
        text: state.phone,
      }),
    ],
  });

  // Create email element
  const emailHref = `mailto:${state.email}`;
  const emailLink = createElement('a', {
    classes: ['contact-info__item', 'contact-info__item--email'],
    attributes: {
      href: emailHref,
      title: `Email ${state.email}`,
      'data-href': emailHref,
    },
    events: state.onEmailClick
      ? {
          click: (event) => {
            if (state.onEmailClick(event) === false) {
              event.preventDefault();
            }
          },
        }
      : {},
    children: [
      createElement('span', {
        classes: ['contact-info__icon', 'contact-info__icon--email'],
      }),
      createElement('span', {
        classes: ['contact-info__text'],
        text: state.email,
      }),
    ],
  });

  // Append all elements to the container
  contactInfoElement.appendChild(locationLink);
  contactInfoElement.appendChild(phoneLink);
  contactInfoElement.appendChild(emailLink);

  return contactInfoElement;
};

/**
 * Creates a ContactInfo component
 * @param {Object} props - ContactInfo properties
 * @param {string} props.location - Location address text
 * @param {string} props.phone - Phone number
 * @param {string} props.email - Email address
 * @param {string} [props.locationId="location"] - ID of the location section to scroll to
 * @param {Function} [props.onLocationClick] - Click handler for location link
 * @param {Function} [props.onPhoneClick] - Click handler for phone link
 * @param {Function} [props.onEmailClick] - Click handler for email link
 * @param {string} [props.className=""] - Additional CSS classes for the container element
 * @returns {Object} ContactInfo component API
 */
const createContactInfo = (props) => {
  console.log('createContactInfo called - NOT injecting styles here');

  // Migrate any legacy props to standardized props
  const normalizedProps = migrateLegacyProps(props);

  // Validate required props
  validateProps(normalizedProps, createContactInfo.requiredProps);

  // Initial state with defaults
  const initialState = {
    location: normalizedProps.location,
    phone: normalizedProps.phone,
    email: normalizedProps.email,
    locationId: normalizedProps.locationId || 'location',
    onLocationClick: normalizedProps.onLocationClick || null,
    onPhoneClick: normalizedProps.onPhoneClick || null,
    onEmailClick: normalizedProps.onEmailClick || null,
    className: normalizedProps.className || '',
  };

  // Create the base component
  const contactInfoComponent =
    createBaseComponent(renderContactInfo)(initialState);

  // Define the shouldRerender method to ensure DOM updates on state changes
  contactInfoComponent.shouldRerender = () => true;

  // Add convenience methods
  contactInfoComponent.setLocation = function (location) {
    return this.update({ location });
  };

  contactInfoComponent.setPhone = function (phone) {
    return this.update({ phone });
  };

  contactInfoComponent.setEmail = function (email) {
    return this.update({ email });
  };

  return contactInfoComponent;
};

// Define required props for validation
createContactInfo.requiredProps = ['location', 'phone', 'email'];

// Create the component
const ContactInfo = createComponent('ContactInfo', createContactInfo);

// Export as a factory function
export default ContactInfo;
