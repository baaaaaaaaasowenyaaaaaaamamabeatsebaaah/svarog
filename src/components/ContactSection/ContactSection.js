// src/components/ContactSection/ContactSection.js
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { createElement } from '../../utils/componentFactory.js';
import Section from '../Section/index.js';
import Grid from '../Grid/index.js';
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

  // Component instances storage
  let mapComponent = null;
  let formComponent = null;
  let formFields = {};

  // Create base component with render function
  const baseComponent = createBaseComponent((state) => {
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

    // Create form elements
    const formElements = [];
    formFields = {};

    // Form title
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
        label: 'Name',
        placeholder: 'Your Name',
        required: true,
      });

      formElements.push(
        FormGroup({
          label: 'Name',
          field: formFields.name,
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
        label: 'Email',
        placeholder: 'your@email.com',
        required: true,
      });

      formElements.push(
        FormGroup({
          label: 'Email',
          field: formFields.email,
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
        label: 'Phone',
        placeholder: 'Your Phone Number',
      });

      formElements.push(
        FormGroup({
          label: 'Phone',
          field: formFields.phone,
        })
      );
    }

    // Subject field
    if (state.showSubjectField) {
      formFields.subject = Input({
        id: 'contact-subject',
        name: 'subject',
        label: 'Subject',
        placeholder: 'Message Subject',
        required: true,
      });

      formElements.push(
        FormGroup({
          label: 'Subject',
          field: formFields.subject,
          required: true,
        })
      );
    }

    // Message field
    if (state.showMessageField) {
      formFields.message = Textarea({
        id: 'contact-message',
        name: 'message',
        label: 'Message',
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

    // Create form
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

    // Create form content container
    const formContentElements = [];

    // Contact info
    if (Object.values(state.contactInfo).some((value) => value)) {
      formContentElements.push(createContactInfo(state.contactInfo));
    }

    // Form
    formContentElements.push(formComponent.getElement());

    const formContent = createElement('div', {
      classes: 'contact-section__content',
      children: formContentElements,
    });

    // Create grid layout
    const gridComponent = Grid({
      gap: '32px',
      rowGap: '24px',
      className: `contact-section__grid ${state.mobileLayout === 'stack' ? 'contact-section__grid--stack' : ''} ${state.mobileLayout === 'reverse' ? 'contact-section__grid--reverse' : ''}`,
    });

    // Create columns
    let mapColumn, formColumn;

    if (Grid.Column) {
      mapColumn = Grid.Column({
        width: 6,
        mobileWidth: 12,
        children: mapComponent.getElement(),
      });

      formColumn = Grid.Column({
        width: 6,
        mobileWidth: 12,
        children: formContent,
      });
    } else {
      // Fallback to regular div elements
      mapColumn = createElement('div', {
        classes: 'contact-section__map-column',
        children: [mapComponent.getElement()],
      });

      formColumn = createElement('div', {
        classes: 'contact-section__form-column',
        children: [formContent],
      });
    }

    // Add columns to grid based on layout
    if (state.mapPosition === 'left') {
      if (Grid.Column) {
        gridComponent.appendChild(mapColumn.getElement());
        gridComponent.appendChild(formColumn.getElement());
      } else {
        gridComponent.getElement().appendChild(mapColumn);
        gridComponent.getElement().appendChild(formColumn);
      }
    } else {
      if (Grid.Column) {
        gridComponent.appendChild(formColumn.getElement());
        gridComponent.appendChild(mapColumn.getElement());
      } else {
        gridComponent.getElement().appendChild(formColumn);
        gridComponent.getElement().appendChild(mapColumn);
      }
    }

    // Create section
    const sectionComponent = Section({
      title: state.title,
      description: state.description,
      variant: state.variant,
      backgroundColor: state.backgroundColor,
      className: `contact-section ${state.className}`,
      children: gridComponent.getElement(),
    });

    return sectionComponent.getElement();
  })(normalizedProps);

  // Add extended API methods
  return {
    ...baseComponent,

    // Contact-specific methods
    updateContactInfo(newContactInfo) {
      const updatedContactInfo = {
        ...baseComponent.getState().contactInfo,
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

    // State access
    getState() {
      return baseComponent.getState();
    },

    // Enhanced destroy method
    destroy() {
      // Destroy child components
      [mapComponent, formComponent].filter(Boolean).forEach((component) => {
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
      formFields = {};

      // Call base destroy
      baseComponent.destroy();
    },
  };
};

export default createContactSection;
