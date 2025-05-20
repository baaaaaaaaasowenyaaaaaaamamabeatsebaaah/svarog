// src/components/StickyContactIcons/StickyContactIcons.js
import './StickyContactIcons.css';
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';

/**
 * Validates sticky contact icons specific props
 * @param {Object} props - StickyContactIcons properties
 */
const validateStickyContactIconsProps = (props) => {
  const validPositions = ['right', 'bottom'];

  if (props.position && !validPositions.includes(props.position)) {
    console.warn(
      `StickyContactIcons: Unknown position "${props.position}", defaulting to right`
    );
  }
};

/**
 * Creates the location icon element
 * @param {Object} state - Component state
 * @returns {HTMLElement} Location icon element
 */
const createLocationIconElement = (state) => {
  const locationHref = `#${state.locationId}`;

  const locationLink = createElement('a', {
    classes: ['sticky-contact-icons__item'], // Changed from className to classes with array
    attributes: {
      href: locationHref,
      title: state.showTooltips ? state.location : '',
      'data-href': locationHref,
      'aria-label': `Go to ${state.location} location`,
    },
    events: {
      click: (event) => {
        if (state.onLocationClick && state.onLocationClick(event) === false) {
          event.preventDefault();
        }
      },
    },
  });

  const locationIcon = createElement('span', {
    classes: [
      'sticky-contact-icons__icon',
      'sticky-contact-icons__icon--location',
    ], // Changed to classes array
  });

  locationLink.appendChild(locationIcon);
  return locationLink;
};

/**
 * Creates the phone icon element
 * @param {Object} state - Component state
 * @returns {HTMLElement} Phone icon element
 */
const createPhoneIconElement = (state) => {
  // Remove any non-numeric characters from phone for the href
  const cleanPhone = state.phone.replace(/[\s()/-]/g, '');
  const phoneHref = `tel:${cleanPhone}`;

  const phoneLink = createElement('a', {
    classes: ['sticky-contact-icons__item'], // Changed from className to classes with array
    attributes: {
      href: phoneHref,
      title: state.showTooltips ? state.phone : '',
      'data-href': phoneHref,
      'aria-label': `Call ${state.phone}`,
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
  });

  const phoneIcon = createElement('span', {
    classes: [
      'sticky-contact-icons__icon',
      'sticky-contact-icons__icon--phone',
    ], // Changed to classes array
  });

  phoneLink.appendChild(phoneIcon);
  return phoneLink;
};

/**
 * Creates the email icon element
 * @param {Object} state - Component state
 * @returns {HTMLElement} Email icon element
 */
const createEmailIconElement = (state) => {
  const emailHref = `mailto:${state.email}`;

  const emailLink = createElement('a', {
    classes: ['sticky-contact-icons__item'], // Changed from className to classes with array
    attributes: {
      href: emailHref,
      title: state.showTooltips ? state.email : '',
      'data-href': emailHref,
      'aria-label': `Email ${state.email}`,
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
  });

  const emailIcon = createElement('span', {
    classes: [
      'sticky-contact-icons__icon',
      'sticky-contact-icons__icon--email',
    ], // Changed to classes array
  });

  emailLink.appendChild(emailIcon);
  return emailLink;
};

/**
 * Renders the sticky contact icons element
 * @param {Object} state - Component state
 * @returns {HTMLElement} The component's DOM element
 */
const renderStickyContactIcons = (state) => {
  // Build CSS class list
  const classNames = [
    'sticky-contact-icons',
    state.position !== 'right' ? `sticky-contact-icons--${state.position}` : '',
    state.className,
  ].filter(Boolean);

  // Create container element
  const container = createElement('div', {
    classes: classNames, // This was already correct
  });

  // Create and append individual icons
  const locationElement = createLocationIconElement(state);
  const phoneElement = createPhoneIconElement(state);
  const emailElement = createEmailIconElement(state);

  // Append all elements to container
  container.appendChild(locationElement);
  container.appendChild(phoneElement);
  container.appendChild(emailElement);

  return container;
};

/**
 * Create a StickyContactIcons component
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
 * @returns {Object} StickyContactIcons component
 */
const createStickyContactIcons = (props) => {
  // Validate required props
  validateProps(props, createStickyContactIcons.requiredProps);

  // Validate component-specific props
  validateStickyContactIconsProps(props);

  // Initialize state with defaults
  const initialState = {
    location: props.location,
    phone: props.phone,
    email: props.email,
    locationId: props.locationId || 'location',
    onLocationClick: props.onLocationClick || null,
    onPhoneClick: props.onPhoneClick || null,
    onEmailClick: props.onEmailClick || null,
    className: props.className || '',
    position: props.position || 'right',
    showTooltips: props.showTooltips !== false,
  };

  // Create the base component
  const stickyContactIconsComponent = createBaseComponent(
    renderStickyContactIcons
  )(initialState);

  // Define the shouldRerender method - always return true to ensure updates work
  stickyContactIconsComponent.shouldRerender = () => true;

  // Add theme change handler
  stickyContactIconsComponent.onThemeChange = (newTheme, previousTheme) => {
    console.debug(
      `StickyContactIcons: theme changed from ${previousTheme} to ${newTheme}`
    );
  };

  return stickyContactIconsComponent;
};

// Define required props for validation
createStickyContactIcons.requiredProps = ['location', 'phone', 'email'];

// Create the component with theme awareness
const StickyContactIcons = withThemeAwareness(
  createComponent('StickyContactIcons', createStickyContactIcons)
);

// Export as a factory function
export default StickyContactIcons;
