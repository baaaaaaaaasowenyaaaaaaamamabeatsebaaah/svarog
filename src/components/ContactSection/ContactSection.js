// src/components/ContactSection/ContactSection.js - Proper Svarog Form usage
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { createElement } from '../../utils/componentFactory.js';
import Section from '../Section/index.js';
import Map from '../Map/index.js';
import { Form, FormGroup, FormActions } from '../Form/index.js';
import Input from '../Input/index.js';
import Textarea from '../Textarea/index.js';
import Button from '../Button/index.js';
import Typography from '../Typography/index.js';
import { contactSectionStyles } from './ContactSection.styles.js';

const injectStyles = createStyleInjector('ContactSection');

/**
 * Creates contact info display element
 */
const createContactInfo = (contactInfo) => {
  const items = [];

  if (contactInfo.address) {
    items.push(
      createElement('div', {
        classes: 'contact-info__item',
        children: [
          createElement('span', { text: '📍 ', classes: 'contact-info__icon' }),
          createElement('span', {
            text: contactInfo.address,
            classes: 'contact-info__text',
          }),
        ],
      })
    );
  }

  if (contactInfo.phone) {
    items.push(
      createElement('div', {
        classes: 'contact-info__item',
        children: [
          createElement('span', { text: '📞 ', classes: 'contact-info__icon' }),
          createElement('a', {
            attributes: { href: `tel:${contactInfo.phone.replace(/\s/g, '')}` },
            classes: 'contact-info__link',
            text: contactInfo.phone,
          }),
        ],
      })
    );
  }

  if (contactInfo.email) {
    items.push(
      createElement('div', {
        classes: 'contact-info__item',
        children: [
          createElement('span', { text: '✉️ ', classes: 'contact-info__icon' }),
          createElement('a', {
            attributes: { href: `mailto:${contactInfo.email}` },
            classes: 'contact-info__link',
            text: contactInfo.email,
          }),
        ],
      })
    );
  }

  if (contactInfo.hours) {
    items.push(
      createElement('div', {
        classes: 'contact-info__item',
        children: [
          createElement('span', { text: '🕐 ', classes: 'contact-info__icon' }),
          createElement('span', {
            text: contactInfo.hours,
            classes: 'contact-info__text',
          }),
        ],
      })
    );
  }

  if (contactInfo.website) {
    items.push(
      createElement('div', {
        classes: 'contact-info__item',
        children: [
          createElement('span', { text: '🌐 ', classes: 'contact-info__icon' }),
          createElement('a', {
            attributes: {
              href: contactInfo.website,
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            classes: 'contact-info__link',
            text: contactInfo.website.replace(/^https?:\/\//, ''),
          }),
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
 * Creates a ContactSection component using baseComponent
 */
const createContactSection = (props = {}) => {
  // Normalize props
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

    // Contact info
    contactInfo: {
      address: '',
      phone: '',
      email: '',
      hours: '',
      website: '',
    },

    // Form configuration
    formTitle: 'Send us a message',
    submitButtonText: 'Send Message',
    showNameField: true,
    showEmailField: true,
    showPhoneField: false,
    showSubjectField: true,
    showMessageField: true,

    // Event handlers
    onSubmit: null,
    onChange: null,

    // Layout options
    mapPosition: 'left', // 'left' or 'right'
    mobileLayout: 'stack', // 'stack' or 'reverse'

    ...props,
  };

  // Keep our own state reference for getState()
  let currentState = { ...normalizedProps };

  // Component instances storage
  let mapComponent = null;
  let formComponent = null;
  let formFields = {};
  let sectionComponent = null;

  // Create base component with render function
  const baseComponent = createBaseComponent((state) => {
    // Update our state reference
    currentState = { ...state };

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

    // Create form elements array (Svarog Form components)
    const formElements = [];
    formFields = {};

    // Form title using Typography
    if (state.formTitle) {
      const formTitle = Typography({
        as: 'h3',
        children: state.formTitle,
        className: 'contact-form__title',
      });
      formElements.push(formTitle);
    }

    // Name field
    if (state.showNameField) {
      formFields.name = Input({
        id: 'contact-name',
        name: 'name',
        placeholder: 'Your Name',
        required: true,
      });

      formElements.push(
        FormGroup({
          label: 'Name',
          field: formFields.name,
          id: 'contact-name',
          required: true,
        })
      );
    }

    // Email field
    if (state.showEmailField) {
      formFields.email = Input({
        id: 'contact-email',
        name: 'email',
        type: 'email',
        placeholder: 'your@email.com',
        required: true,
      });

      formElements.push(
        FormGroup({
          label: 'Email',
          field: formFields.email,
          id: 'contact-email',
          required: true,
        })
      );
    }

    // Phone field
    if (state.showPhoneField) {
      formFields.phone = Input({
        id: 'contact-phone',
        name: 'phone',
        type: 'tel',
        placeholder: 'Your Phone Number',
      });

      formElements.push(
        FormGroup({
          label: 'Phone',
          field: formFields.phone,
          id: 'contact-phone',
        })
      );
    }

    // Subject field
    if (state.showSubjectField) {
      formFields.subject = Input({
        id: 'contact-subject',
        name: 'subject',
        placeholder: 'Message Subject',
        required: true,
      });

      formElements.push(
        FormGroup({
          label: 'Subject',
          field: formFields.subject,
          id: 'contact-subject',
          required: true,
        })
      );
    }

    // Message field
    if (state.showMessageField) {
      formFields.message = Textarea({
        id: 'contact-message',
        name: 'message',
        placeholder: 'Your message...',
        required: true,
        rows: 5,
        autoResize: true,
        showCharCount: true,
        maxLength: 1000,
      });

      formElements.push(
        FormGroup({
          label: 'Message',
          field: formFields.message,
          id: 'contact-message',
          required: true,
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
      })
    );

    // Create form using Svarog Form component
    formComponent = Form({
      children: formElements,
      onSubmit: (event, data, isValid) => {
        if (state.onSubmit) {
          state.onSubmit(event, data, isValid, formFields);
        }
      },
      onChange: (event, data) => {
        if (state.onChange) {
          state.onChange(event, data, formFields);
        }
      },
    });

    // Register form fields with the form for validation
    Object.values(formFields).forEach((field) => {
      if (field && formComponent.registerField) {
        formComponent.registerField(field);
      }
    });

    // Create form content container
    const formContentElements = [];

    // Contact info
    if (Object.values(state.contactInfo).some((value) => value)) {
      formContentElements.push(createContactInfo(state.contactInfo));
    }

    // Form (get the actual DOM element)
    formContentElements.push(formComponent.getElement());

    const formContent = createElement('div', {
      classes: 'contact-section__content',
      children: formContentElements,
    });

    // Create grid layout with CSS classes only
    const gridClasses = [
      'contact-section__grid',
      state.mobileLayout === 'stack' ? 'contact-section__grid--stack' : '',
      state.mobileLayout === 'reverse' ? 'contact-section__grid--reverse' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const gridElement = createElement('div', {
      classes: gridClasses,
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        alignItems: 'start',
      },
    });

    // Create columns as simple div elements
    const mapColumn = createElement('div', {
      classes: 'contact-section__map-column',
      children: [mapComponent.getElement()],
    });

    const formColumn = createElement('div', {
      classes: 'contact-section__form-column',
      children: [formContent],
    });

    // Add columns to grid based on layout
    if (state.mapPosition === 'left') {
      gridElement.appendChild(mapColumn);
      gridElement.appendChild(formColumn);
    } else {
      gridElement.appendChild(formColumn);
      gridElement.appendChild(mapColumn);
    }

    // Create main container (try Section component, fallback to div)
    try {
      if (Section) {
        sectionComponent = Section({
          title: state.title,
          description: state.description,
          variant: state.variant,
          backgroundColor: state.backgroundColor,
          className: `contact-section ${state.className}`,
          children: gridElement,
        });

        return sectionComponent.getElement();
      }
    } catch (error) {
      console.warn('Section component failed, using fallback:', error);
    }

    // Fallback to simple structure
    return createElement('div', {
      classes: `contact-section ${state.className}`,
      style: state.backgroundColor
        ? { backgroundColor: state.backgroundColor }
        : {},
      children: [
        state.title
          ? createElement('h2', {
              text: state.title,
              classes: 'contact-section__title',
            })
          : null,
        state.description
          ? createElement('p', {
              text: state.description,
              classes: 'contact-section__description',
            })
          : null,
        gridElement,
      ].filter(Boolean),
    });
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
      if (formComponent && formComponent.getFormData) {
        return formComponent.getFormData();
      }

      // Fallback: collect data from form fields directly
      const data = {};
      Object.entries(formFields).forEach(([key, field]) => {
        if (field && field.getValue) {
          data[key] = field.getValue();
        }
      });
      return data;
    },

    validateForm() {
      if (formComponent && formComponent.validate) {
        return formComponent.validate();
      }
      return true;
    },

    resetForm() {
      if (formComponent && formComponent.reset) {
        formComponent.reset();
      }
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

    // Enhanced destroy method that actually removes from DOM
    destroy() {
      // Get the element before destroying
      const element = baseComponent.getElement();

      // Remove from DOM if it has a parent
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      // Destroy child components
      [mapComponent, formComponent, sectionComponent]
        .filter(Boolean)
        .forEach((component) => {
          if (component.destroy && typeof component.destroy === 'function') {
            component.destroy();
          }
        });

      // Destroy form fields
      Object.values(formFields).forEach((field) => {
        if (field && field.destroy && typeof field.destroy === 'function') {
          field.destroy();
        }
      });

      // Clear references
      mapComponent = null;
      formComponent = null;
      sectionComponent = null;
      formFields = {};

      // Call base destroy
      baseComponent.destroy();
    },
  };
};

export default createContactSection;
