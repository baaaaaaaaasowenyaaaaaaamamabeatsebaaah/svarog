// src/components/ContactSection/ContactSection.js
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
 * Creates a ContactSection component with map and contact form
 * @param {Object} props - Component props
 * @returns {Object} Component API
 */
const createContactSection = (props = {}) => {
  let state = {
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

    // Layout
    mapPosition: 'left', // 'left' or 'right'
    mobileLayout: 'stack', // 'stack' or 'reverse'

    ...props,
  };

  let element = null;
  let destroyed = false;

  // Component instances
  let sectionComponent = null;
  let gridComponent = null;
  let mapComponent = null;
  let formComponent = null;

  // Form fields
  let formFields = {};

  const createContactInfo = () => {
    const { contactInfo } = state;
    const items = [];

    if (contactInfo.address) {
      const addressItem = createElement('div', {
        className: 'contact-info__item',
      });

      const addressLabel = Typography({
        as: 'span',
        children: 'Address:',
        weight: 'semibold',
        className: 'contact-info__label',
      });

      const addressValue = Typography({
        as: 'span',
        children: contactInfo.address,
        className: 'contact-info__value',
      });

      addressItem.appendChild(addressLabel.getElement());
      addressItem.appendChild(addressValue.getElement());
      items.push(addressItem);
    }

    if (contactInfo.phone) {
      const phoneItem = createElement('div', {
        className: 'contact-info__item',
      });

      const phoneLabel = Typography({
        as: 'span',
        children: 'Phone:',
        weight: 'semibold',
        className: 'contact-info__label',
      });

      const phoneLink = createElement('a', {
        href: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
        textContent: contactInfo.phone,
        className: 'contact-info__link',
      });

      phoneItem.appendChild(phoneLabel.getElement());
      phoneItem.appendChild(phoneLink);
      items.push(phoneItem);
    }

    if (contactInfo.email) {
      const emailItem = createElement('div', {
        className: 'contact-info__item',
      });

      const emailLabel = Typography({
        as: 'span',
        children: 'Email:',
        weight: 'semibold',
        className: 'contact-info__label',
      });

      const emailLink = createElement('a', {
        href: `mailto:${contactInfo.email}`,
        textContent: contactInfo.email,
        className: 'contact-info__link',
      });

      emailItem.appendChild(emailLabel.getElement());
      emailItem.appendChild(emailLink);
      items.push(emailItem);
    }

    if (contactInfo.hours) {
      const hoursItem = createElement('div', {
        className: 'contact-info__item',
      });

      const hoursLabel = Typography({
        as: 'span',
        children: 'Hours:',
        weight: 'semibold',
        className: 'contact-info__label',
      });

      const hoursValue = Typography({
        as: 'span',
        children: contactInfo.hours,
        className: 'contact-info__value',
      });

      hoursItem.appendChild(hoursLabel.getElement());
      hoursItem.appendChild(hoursValue.getElement());
      items.push(hoursItem);
    }

    if (contactInfo.website) {
      const websiteItem = createElement('div', {
        className: 'contact-info__item',
      });

      const websiteLabel = Typography({
        as: 'span',
        children: 'Website:',
        weight: 'semibold',
        className: 'contact-info__label',
      });

      const websiteLink = createElement('a', {
        href: contactInfo.website,
        textContent: contactInfo.website.replace(/^https?:\/\//, ''),
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'contact-info__link',
      });

      websiteItem.appendChild(websiteLabel.getElement());
      websiteItem.appendChild(websiteLink);
      items.push(websiteItem);
    }

    return createElement('div', {
      className: 'contact-info',
      children: items,
    });
  };

  const createContactForm = () => {
    const formElements = [];
    formFields = {};

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
    const form = Form({
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

    // Register fields with form
    Object.values(formFields).forEach((field) => {
      form.registerField(field);
    });

    return form;
  };

  const createRightColumn = () => {
    const elements = [];

    // Form title
    if (state.formTitle) {
      const formTitle = Typography({
        as: 'h3',
        children: state.formTitle,
        className: 'contact-form__title',
      });
      elements.push(formTitle.getElement());
    }

    // Contact info
    if (Object.values(state.contactInfo).some((value) => value)) {
      elements.push(createContactInfo());
    }

    // Contact form
    formComponent = createContactForm();
    elements.push(formComponent.getElement());

    return createElement('div', {
      className: 'contact-section__content',
      children: elements,
    });
  };

  const render = () => {
    if (destroyed) return null;

    // Inject styles
    injectStyles(contactSectionStyles);

    // Create map component
    mapComponent = Map({
      apiKey: state.apiKey,
      latitude: state.latitude,
      longitude: state.longitude,
      locationName: state.locationName,
      placeId: state.placeId,
      googleMapsUrl: state.googleMapsUrl,
      shopInfo: state.contactInfo,
    });

    // Create grid
    gridComponent = Grid({
      gap: '2rem',
      className: `contact-section__grid contact-section__grid--${state.mobileLayout}`,
    });

    // Create columns based on layout
    const leftColumn = Grid.Column({
      width: 6,
      mobileWidth: 12,
      children:
        state.mapPosition === 'left'
          ? mapComponent.getElement()
          : createRightColumn(),
    });

    const rightColumn = Grid.Column({
      width: 6,
      mobileWidth: 12,
      children:
        state.mapPosition === 'left'
          ? createRightColumn()
          : mapComponent.getElement(),
    });

    // Add columns to grid
    gridComponent.appendChild(leftColumn.getElement());
    gridComponent.appendChild(rightColumn.getElement());

    // Create section
    sectionComponent = Section({
      title: state.title,
      description: state.description,
      variant: state.variant,
      backgroundColor: state.backgroundColor,
      className: `contact-section ${state.className}`,
      children: gridComponent.getElement(),
    });

    element = sectionComponent.getElement();
    return element;
  };

  const updateContactInfo = (newContactInfo) => {
    state.contactInfo = { ...state.contactInfo, ...newContactInfo };

    if (mapComponent) {
      mapComponent.update({ shopInfo: state.contactInfo });
    }

    if (element) {
      // Re-render contact info section
      const contactInfoEl = element.querySelector('.contact-info');
      if (contactInfoEl) {
        const newContactInfoEl = createContactInfo();
        contactInfoEl.parentNode.replaceChild(newContactInfoEl, contactInfoEl);
      }
    }
  };

  const getFormData = () => {
    if (!formComponent) return {};
    return formComponent.getFormData();
  };

  const validateForm = () => {
    if (!formComponent) return true;
    return formComponent.validate();
  };

  const resetForm = () => {
    if (formComponent) {
      formComponent.reset();
    }
  };

  const update = (newProps) => {
    if (destroyed) return;

    const oldState = { ...state };
    state = { ...state, ...newProps };

    // Update section if properties changed
    if (
      sectionComponent &&
      (oldState.title !== state.title ||
        oldState.description !== state.description ||
        oldState.variant !== state.variant ||
        oldState.backgroundColor !== state.backgroundColor)
    ) {
      sectionComponent.update({
        title: state.title,
        description: state.description,
        variant: state.variant,
        backgroundColor: state.backgroundColor,
      });
    }

    // Update map if properties changed
    if (
      mapComponent &&
      (oldState.latitude !== state.latitude ||
        oldState.longitude !== state.longitude ||
        oldState.locationName !== state.locationName ||
        oldState.apiKey !== state.apiKey ||
        oldState.placeId !== state.placeId ||
        oldState.googleMapsUrl !== state.googleMapsUrl)
    ) {
      mapComponent.update({
        latitude: state.latitude,
        longitude: state.longitude,
        locationName: state.locationName,
        apiKey: state.apiKey,
        placeId: state.placeId,
        googleMapsUrl: state.googleMapsUrl,
      });
    }

    // Update contact info if changed
    if (
      JSON.stringify(oldState.contactInfo) !== JSON.stringify(state.contactInfo)
    ) {
      updateContactInfo(state.contactInfo);
    }
  };

  const destroy = () => {
    if (destroyed) return;

    destroyed = true;

    // Destroy child components
    [sectionComponent, gridComponent, mapComponent, formComponent]
      .filter(Boolean)
      .forEach((component) => component.destroy());

    // Destroy form fields
    Object.values(formFields).forEach((field) => field.destroy());

    // Clean up references
    element = null;
    sectionComponent = null;
    gridComponent = null;
    mapComponent = null;
    formComponent = null;
    formFields = {};
  };

  // Public API
  return {
    getElement: () => element || render(),
    update,
    destroy,

    // Contact-specific methods
    updateContactInfo,
    getFormData,
    validateForm,
    resetForm,

    // State access
    getState: () => ({ ...state }),

    // Component access
    getMapComponent: () => mapComponent,
    getFormComponent: () => formComponent,
    getFormFields: () => ({ ...formFields }),
  };
};

export default createContactSection;
