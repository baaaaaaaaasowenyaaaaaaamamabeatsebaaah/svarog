// src/components/ContactSection/ContactSection.js
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { createElement } from '../../utils/componentFactory.js';
import Section from '../Section/index.js';
import Map from '../Map/index.js';
import Grid from '../Grid/index.js';
import { Form, FormGroup, FormActions } from '../Form/index.js';
import Input from '../Input/index.js';
import Textarea from '../Textarea/index.js';
import Button from '../Button/index.js';
import Checkbox from '../Checkbox/index.js';
import Typography from '../Typography/index.js';
import Link from '../Link/index.js';
import { contactSectionStyles } from './ContactSection.styles.js';

const injectStyles = createStyleInjector('ContactSection');

/**
 * Creates contact info display element using Link components
 */
const createContactInfo = (contactInfo) => {
  const items = [];

  // Company name
  if (contactInfo.companyName) {
    items.push(
      createElement('div', {
        classes: 'contact-info__item',
        children: [
          createElement('span', {
            text: contactInfo.companyName,
            classes: 'contact-info__value',
          }),
        ],
      })
    );
  }

  // Address (street, zipcode, city)
  if (contactInfo.street || contactInfo.zipcode || contactInfo.city) {
    const addressParts = [];
    if (contactInfo.street) addressParts.push(contactInfo.street);
    if (contactInfo.zipcode && contactInfo.city) {
      addressParts.push(`${contactInfo.zipcode} ${contactInfo.city}`);
    } else if (contactInfo.zipcode) {
      addressParts.push(contactInfo.zipcode);
    } else if (contactInfo.city) {
      addressParts.push(contactInfo.city);
    }

    if (addressParts.length > 0) {
      items.push(
        createElement('div', {
          classes: 'contact-info__item',
          children: [
            createElement('span', {
              text: 'Adresse:',
              classes: 'contact-info__label',
            }),
            createElement('div', {
              classes: 'contact-info__value contact-info__address',
              children: addressParts.map((part) =>
                createElement('div', { text: part })
              ),
            }),
          ],
        })
      );
    }
  }

  // Phone with Link component
  if (contactInfo.phone) {
    const phoneLink = Link({
      children: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
    });

    items.push(
      createElement('div', {
        classes: 'contact-info__item',
        children: [
          createElement('span', {
            text: 'Telefon und E-Mail:',
            classes: 'contact-info__label',
          }),
          phoneLink.getElement(),
        ],
      })
    );
  }

  // Email with Link component
  if (contactInfo.email) {
    const emailLink = Link({
      children: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    });

    items.push(
      createElement('div', {
        classes: 'contact-info__item',
        children: [emailLink.getElement()],
      })
    );
  }

  // Hours - Enhanced to handle multiple formats
  if (contactInfo.hours) {
    const hoursElement = createHoursElement(contactInfo.hours);

    items.push(
      createElement('div', {
        classes: 'contact-info__item contact-info__item--hours',
        children: [
          createElement('span', {
            text: 'Öffnungszeiten:',
            classes: 'contact-info__label',
          }),
          hoursElement,
        ],
      })
    );
  }

  return createElement('div', {
    classes: 'contact-info',
    children: items,
  });
};

/**
 * Creates a flexible hours display element
 * @param {string|Array|Object} hours - Hours in various formats
 * @returns {HTMLElement} Hours display element
 */
const createHoursElement = (hours) => {
  // Case 1: Array of strings
  if (Array.isArray(hours)) {
    return createElement('ul', {
      classes: 'contact-info__hours-list',
      children: hours.map((hour) =>
        createElement('li', {
          text: hour,
          classes: 'contact-info__hours-item',
        })
      ),
    });
  }

  // Case 2: Object with day/time pairs
  if (typeof hours === 'object' && !Array.isArray(hours)) {
    const hoursList = [];

    Object.entries(hours).forEach(([day, time]) => {
      hoursList.push(
        createElement('li', {
          classes: 'contact-info__hours-item',
          children: [
            createElement('span', {
              text: `${day}:`,
              classes: 'contact-info__hours-day',
            }),
            createElement('span', {
              text: time,
              classes: 'contact-info__hours-time',
            }),
          ],
        })
      );
    });

    return createElement('ul', {
      classes: 'contact-info__hours-list',
      children: hoursList,
    });
  }

  // Case 3: String with line breaks
  if (typeof hours === 'string' && hours.includes('\n')) {
    const lines = hours.split('\n').filter((line) => line.trim());
    return createHoursElement(lines); // Recursively handle as array
  }

  // Case 4: String with <br> tags
  if (typeof hours === 'string' && hours.includes('<br')) {
    const lines = hours.split(/<br\s*\/?>/i).filter((line) => line.trim());
    return createHoursElement(lines); // Recursively handle as array
  }

  // Case 5: Simple string (fallback)
  return createElement('span', {
    text: hours,
    classes: 'contact-info__value',
  });
};

/**
 * Creates a ContactSection component using Svarog components
 */
const createContactSection = (props = {}) => {
  // Normalize props with updated contact info structure
  const normalizedProps = {
    // Section props
    title: 'Contact Us',
    description: 'Get in touch with us',
    variant: null,
    backgroundColor: null,
    className: '',

    // Map props
    apiKey: null,
    latitude: 48.1417262,
    longitude: 11.5609816,
    locationName: 'Our Location',
    placeId: null,
    googleMapsUrl: null,

    // Updated contact info structure
    contactInfo: {
      companyName: '',
      street: '',
      zipcode: '',
      city: '',
      phone: '',
      email: '',
      hours: '',
    },

    // Form configuration
    formTitle: 'Send us a message',
    submitButtonText: 'Send Message',
    showNameField: true,
    showEmailField: true,
    showPhoneField: false,
    showSubjectField: true,
    showMessageField: true,
    showPrivacyCheckbox: true,
    showNewsletterCheckbox: true,
    privacyPolicyUrl: '/datenschutz',
    privacyText: 'Ich stimme der Datenschutzerklärung zu',
    newsletterText: 'Ich möchte den Newsletter erhalten',

    // Event handlers
    onSubmit: null,
    onChange: null,

    // Layout options
    mapPosition: 'left', // 'left' or 'right'
    mobileLayout: 'stack', // 'stack' or 'reverse'

    ...props,
  };

  // Keep our own state reference
  let currentState = { ...normalizedProps };

  // Component instances storage
  let mapComponent = null;
  let formComponent = null;
  let formFields = {};
  let sectionComponent = null;
  let gridComponent = null;
  let linkComponents = []; // Track Link components for cleanup

  // Create base component with render function
  const baseComponent = createBaseComponent((state) => {
    // Update our state reference
    currentState = { ...state };

    // Clear previous link components
    linkComponents.forEach((link) => link.destroy());
    linkComponents = [];

    // Inject styles
    injectStyles(contactSectionStyles);

    // Create map component
    mapComponent = Map({
      apiKey: state.apiKey,
      latitude: state.latitude,
      longitude: state.longitude,
      title: state.locationName,
      placeId: state.placeId,
      googleMapsUrl: state.googleMapsUrl,
      shopInfo: state.contactInfo,
    });

    // Create form elements using Svarog components properly
    const formElements = [];
    formFields = {};

    // Form title using Typography
    if (state.formTitle) {
      formElements.push(
        Typography({
          as: 'h3',
          children: state.formTitle,
        }).getElement()
      );
    }

    // Name field
    if (state.showNameField) {
      formFields.name = Input({
        id: 'contact-name',
        name: 'name',
        placeholder: 'Ihr Name',
        required: true,
      });

      formElements.push(
        FormGroup({
          label: 'Name',
          field: formFields.name,
          id: 'contact-name',
          required: true,
        }).getElement()
      );
    }

    // Email field
    if (state.showEmailField) {
      formFields.email = Input({
        id: 'contact-email',
        name: 'email',
        type: 'email',
        placeholder: 'ihre@email.de',
        required: true,
      });

      formElements.push(
        FormGroup({
          label: 'E-Mail',
          field: formFields.email,
          id: 'contact-email',
          required: true,
        }).getElement()
      );
    }

    // Phone field
    if (state.showPhoneField) {
      formFields.phone = Input({
        id: 'contact-phone',
        name: 'phone',
        type: 'tel',
        placeholder: 'Ihre Telefonnummer',
      });

      formElements.push(
        FormGroup({
          label: 'Telefon',
          field: formFields.phone,
          id: 'contact-phone',
        }).getElement()
      );
    }

    // Subject field
    if (state.showSubjectField) {
      formFields.subject = Input({
        id: 'contact-subject',
        name: 'subject',
        placeholder: 'Betreff',
        required: true,
      });

      formElements.push(
        FormGroup({
          label: 'Betreff',
          field: formFields.subject,
          id: 'contact-subject',
          required: true,
        }).getElement()
      );
    }

    // Message field
    if (state.showMessageField) {
      formFields.message = Textarea({
        id: 'contact-message',
        name: 'message',
        placeholder: 'Ihre Nachricht...',
        required: true,
        rows: 5,
        autoResize: true,
        showCharCount: true,
        maxLength: 1000,
      });

      formElements.push(
        FormGroup({
          label: 'Nachricht',
          field: formFields.message,
          id: 'contact-message',
          required: true,
        }).getElement()
      );
    }

    // Privacy policy checkbox
    if (state.showPrivacyCheckbox) {
      // Create the privacy policy link
      const privacyLink = Link({
        children: 'Datenschutzerklärung',
        href: state.privacyPolicyUrl,
        target: '_blank',
        underline: true,
      });
      linkComponents.push(privacyLink);

      // Create label element with link
      const privacyLabel = document.createElement('span');
      privacyLabel.appendChild(document.createTextNode('Ich stimme der '));
      privacyLabel.appendChild(privacyLink.getElement());
      privacyLabel.appendChild(document.createTextNode(' zu'));

      // Create checkbox with HTML label
      formFields.privacy = Checkbox({
        id: 'contact-privacy',
        name: 'privacy',
        label: privacyLabel, // Now we can pass the HTML element directly!
        required: true,
        validationMessage: 'Sie müssen der Datenschutzerklärung zustimmen',
      });

      formElements.push(formFields.privacy.getElement());
    }

    // Newsletter checkbox
    if (state.showNewsletterCheckbox) {
      formFields.newsletter = Checkbox({
        id: 'contact-newsletter',
        name: 'newsletter',
        label: state.newsletterText,
        required: false,
      });

      formElements.push(formFields.newsletter.getElement());
    }

    // Add required fields notice
    const hasRequiredFields =
      state.showNameField ||
      state.showEmailField ||
      state.showSubjectField ||
      state.showMessageField ||
      state.showPrivacyCheckbox;

    if (hasRequiredFields) {
      formElements.push(
        createElement('div', {
          classes: 'contact-form__required-notice',
          children: [
            createElement('span', {
              text: '* Pflichtfelder',
              classes: 'contact-form__required-text',
            }),
          ],
        })
      );
    }

    // Submit button
    const submitButton = Button({
      text: state.submitButtonText,
      type: 'submit',
      variant: 'primary',
    });

    formElements.push(
      FormActions({
        children: submitButton,
        align: 'left',
      }).getElement()
    );

    // Create form using Svarog Form component
    formComponent = Form({
      children: formElements,
      onSubmit: async (event, data, _isValid) => {
        // Manually validate all required fields
        let allValid = true;
        const errors = [];

        // Validate each field
        Object.entries(formFields).forEach(([fieldName, field]) => {
          if (field.validate && !field.validate()) {
            allValid = false;
            errors.push(fieldName);
          }
        });

        // Pass validation result to handler
        if (state.onSubmit) {
          state.onSubmit(event, data, allValid, formFields);
        }
      },
      onChange: (event, data) => {
        if (state.onChange) {
          state.onChange(event, data, formFields);
        }
      },
    });

    // Register all form fields for validation
    Object.values(formFields).forEach((field) => {
      if (formComponent.registerField) {
        formComponent.registerField(field);
      }
    });

    // Create form content container
    const formContentElements = [];

    // Contact info - check if any contact info values are provided
    const hasContactInfo =
      state.contactInfo &&
      Object.values(state.contactInfo).some(
        (value) => value && value.toString().trim() !== ''
      );

    if (hasContactInfo) {
      formContentElements.push(createContactInfo(state.contactInfo));
    }

    // Form
    formContentElements.push(formComponent.getElement());

    const formContent = createElement('div', {
      classes: 'contact-section__content',
      children: formContentElements,
    });

    // Create layout using Grid component
    gridComponent = Grid({
      gap: '2rem',
      alignItems: 'start',
    });

    // Create columns based on layout preference
    const mapColumn = Grid.Column({
      width: 6,
      mobileWidth: 12,
      children: mapComponent.getElement(),
    });

    const formColumn = Grid.Column({
      width: 6,
      mobileWidth: 12,
      children: formContent,
    });

    // Add columns to grid based on layout preference
    if (state.mapPosition === 'left') {
      gridComponent.appendChild(mapColumn.getElement());
      gridComponent.appendChild(formColumn.getElement());
    } else {
      gridComponent.appendChild(formColumn.getElement());
      gridComponent.appendChild(mapColumn.getElement());
    }

    // Handle mobile layout ordering with CSS classes
    const gridElement = gridComponent.getElement();
    if (state.mobileLayout === 'stack') {
      gridElement.classList.add('contact-section__grid--stack');
    }
    if (state.mobileLayout === 'reverse') {
      gridElement.classList.add('contact-section__grid--reverse');
    }

    // Create main container using Section component
    sectionComponent = Section({
      title: state.title,
      description: state.description,
      variant: state.variant,
      backgroundColor: state.backgroundColor,
      className: `contact-section ${state.className}`,
      children: gridElement,
    });

    return sectionComponent.getElement();
  })(normalizedProps);

  // Add extended API methods
  return {
    ...baseComponent,

    // State access (required for tests)
    getState() {
      return { ...currentState };
    },

    // Override update to keep our state in sync
    update(newProps) {
      const result = baseComponent.update(newProps);
      currentState = { ...currentState, ...newProps };
      return result;
    },

    // Contact-specific methods
    updateContactInfo(newContactInfo) {
      const updatedContactInfo = {
        ...currentState.contactInfo,
        ...newContactInfo,
      };

      this.update({ contactInfo: updatedContactInfo });

      if (mapComponent) {
        mapComponent.update({ shopInfo: updatedContactInfo });
      }
    },

    getFormData() {
      const data = {};
      Object.entries(formFields).forEach(([key, field]) => {
        if (field && field.getValue) {
          data[key] = field.getValue();
        } else if (field && field.isChecked) {
          data[key] = field.isChecked();
        }
      });
      return data;
    },

    validateForm() {
      let isValid = true;
      Object.values(formFields).forEach((field) => {
        if (field && field.validate && !field.validate()) {
          isValid = false;
        }
      });
      return isValid;
    },

    resetForm() {
      if (formComponent && formComponent.reset) {
        formComponent.reset();
      }
      // Also reset individual fields
      Object.values(formFields).forEach((field) => {
        if (field && field.setValue) {
          field.setValue('');
        } else if (field && field.setChecked) {
          field.setChecked(false);
        }
      });
    },

    // Component access
    getMapComponent() {
      return mapComponent;
    },

    getFormComponent() {
      return formComponent;
    },

    getFormFields() {
      return { ...formFields };
    },

    // Enhanced destroy method
    destroy() {
      // Get the element before destroying
      const element = baseComponent.getElement();

      // Remove from DOM if it has a parent
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      // Destroy link components
      linkComponents.forEach((link) => {
        if (link.destroy && typeof link.destroy === 'function') {
          link.destroy();
        }
      });
      linkComponents = [];

      // Destroy child components
      [
        mapComponent,
        formComponent,
        sectionComponent,
        gridComponent,
        ...Object.values(formFields),
      ]
        .filter(Boolean)
        .forEach((component) => {
          if (component.destroy && typeof component.destroy === 'function') {
            component.destroy();
          }
        });

      // Clear references
      mapComponent = null;
      formComponent = null;
      sectionComponent = null;
      gridComponent = null;
      formFields = {};

      // Call base destroy
      baseComponent.destroy();
    },
  };
};

export default createContactSection;
