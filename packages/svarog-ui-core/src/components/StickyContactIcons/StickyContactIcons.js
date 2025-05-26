// src/components/StickyContactIcons/StickyContactIcons.js
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { stickyContactIconsStyles } from './StickyContactIcons.styles.js';

// Create style injector for StickyContactIcons component
const injectStyles = createStyleInjector('StickyContactIcons');

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
 * Migrates legacy props to standardized props
 * @param {Object} props - Component properties
 * @returns {Object} Normalized props
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  // Migrate event handlers
  if ('onLocationClick' in props && !('onClick' in props)) {
    console.warn(
      '[StickyContactIcons] onLocationClick is deprecated, use onClick.location instead'
    );
    if (!migrated.onClick) migrated.onClick = {};
    migrated.onClick.location = props.onLocationClick;
    delete migrated.onLocationClick;
  }

  if ('onPhoneClick' in props && !('onClick' in props)) {
    console.warn(
      '[StickyContactIcons] onPhoneClick is deprecated, use onClick.phone instead'
    );
    if (!migrated.onClick) migrated.onClick = {};
    migrated.onClick.phone = props.onPhoneClick;
    delete migrated.onPhoneClick;
  }

  if ('onEmailClick' in props && !('onClick' in props)) {
    console.warn(
      '[StickyContactIcons] onEmailClick is deprecated, use onClick.email instead'
    );
    if (!migrated.onClick) migrated.onClick = {};
    migrated.onClick.email = props.onEmailClick;
    delete migrated.onEmailClick;
  }

  return migrated;
};

/**
 * Creates the location icon element
 * @param {Object} state - Component state
 * @returns {HTMLElement} Location icon element
 */
const createLocationIconElement = (state) => {
  const locationHref = `#${state.locationId}`;

  const locationLink = createElement('a', {
    classes: ['sticky-contact-icons__item'],
    attributes: {
      href: locationHref,
      title: state.showTooltips ? state.location : '',
      'data-href': locationHref,
      'aria-label': `Go to ${state.location} location`,
    },
    events: {
      click: (event) => {
        if (
          state.onClick?.location &&
          state.onClick.location(event) === false
        ) {
          event.preventDefault();
        }
      },
    },
  });

  const locationIcon = createElement('span', {
    classes: [
      'sticky-contact-icons__icon',
      'sticky-contact-icons__icon--location',
    ],
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
  const cleanPhone = state.phone.replace(/[\s()/-]/g, '');
  const phoneHref = `tel:${cleanPhone}`;

  const phoneLink = createElement('a', {
    classes: ['sticky-contact-icons__item'],
    attributes: {
      href: phoneHref,
      title: state.showTooltips ? state.phone : '',
      'data-href': phoneHref,
      'aria-label': `Call ${state.phone}`,
    },
    events: state.onClick?.phone
      ? {
          click: (event) => {
            if (state.onClick.phone(event) === false) {
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
    ],
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
    classes: ['sticky-contact-icons__item'],
    attributes: {
      href: emailHref,
      title: state.showTooltips ? state.email : '',
      'data-href': emailHref,
      'aria-label': `Email ${state.email}`,
    },
    events: state.onClick?.email
      ? {
          click: (event) => {
            if (state.onClick.email(event) === false) {
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
    ],
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
  // Inject styles on first render (automatically cached)
  injectStyles(stickyContactIconsStyles);

  const classNames = [
    'sticky-contact-icons',
    state.position !== 'right' ? `sticky-contact-icons--${state.position}` : '',
    state.className,
  ].filter(Boolean);

  const container = createElement('div', {
    classes: classNames,
  });

  const locationElement = createLocationIconElement(state);
  const phoneElement = createPhoneIconElement(state);
  const emailElement = createEmailIconElement(state);

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
 * @param {Object} [props.onClick] - Click handlers for icons
 * @param {Function} [props.onClick.location] - Callback for location icon click
 * @param {Function} [props.onClick.phone] - Callback for phone icon click
 * @param {Function} [props.onClick.email] - Callback for email icon click
 * @param {Function} [props.onLocationClick] - DEPRECATED: Use onClick.location instead
 * @param {Function} [props.onPhoneClick] - DEPRECATED: Use onClick.phone instead
 * @param {Function} [props.onEmailClick] - DEPRECATED: Use onClick.email instead
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {string} [props.position='right'] - Position of the icons ('right' or 'bottom')
 * @param {boolean} [props.showTooltips=true] - Whether to show tooltips on hover
 * @returns {Object} StickyContactIcons component
 */
const createStickyContactIcons = (props) => {
  // Migrate legacy props
  const normalizedProps = migrateLegacyProps(props);

  // Validate required props
  validateProps(normalizedProps, createStickyContactIcons.requiredProps);

  // Validate component-specific props
  validateStickyContactIconsProps(normalizedProps);

  // Support both legacy and new event handler patterns
  const onClick = {
    location:
      normalizedProps.onClick?.location ||
      normalizedProps.onLocationClick ||
      null,
    phone:
      normalizedProps.onClick?.phone || normalizedProps.onPhoneClick || null,
    email:
      normalizedProps.onClick?.email || normalizedProps.onEmailClick || null,
  };

  // Initialize state with defaults
  const initialState = {
    location: normalizedProps.location,
    phone: normalizedProps.phone,
    email: normalizedProps.email,
    locationId: normalizedProps.locationId || 'location',
    onClick,
    className: normalizedProps.className || '',
    position: normalizedProps.position || 'right',
    showTooltips: normalizedProps.showTooltips !== false,
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
