// src/components/ContactInfo/ContactInfo.js
import './ContactInfo.css';
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';

/**
 * Creates ContactInfo DOM element
 * @param {Object} state - ContactInfo state
 * @returns {HTMLElement} - ContactInfo element
 */
const renderContactInfo = (state) => {
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
 * @returns {Object} ContactInfo component API
 */
const createContactInfo = (props) => {
  // Validate required props
  validateProps(props, createContactInfo.requiredProps);

  // Initial state with defaults
  const initialState = {
    location: props.location,
    phone: props.phone,
    email: props.email,
    locationId: props.locationId || 'location',
    onLocationClick: props.onLocationClick || null,
    onPhoneClick: props.onPhoneClick || null,
    onEmailClick: props.onEmailClick || null,
    className: props.className || '',
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
