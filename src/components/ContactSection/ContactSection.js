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
            text: 'Unternehmen:',
            classes: 'contact-info__label',
          }),
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
      className: 'contact-info__link',
    });

    items.push(
      createElement('div', {
        classes: 'contact-info__item',
        children: [
          createElement('span', {
            text: 'Telefon:',
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
      className: 'contact-info__link',
    });

    items.push(
      createElement('div', {
        classes: 'contact-info__item',
        children: [
          createElement('span', {
            text: 'E-Mail:',
            classes: 'contact-info__label',
          }),
          emailLink.getElement(),
        ],
      })
    );
  }

  // Hours
  if (contactInfo.hours) {
    items.push(
      createElement('div', {
        classes: 'contact-info__item',
        children: [
          createElement('span', {
            text: 'Öffnungszeiten:',
            classes: 'contact-info__label',
          }),
          createElement('span', {
            text: contactInfo.hours,
            classes: 'contact-info__value',
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
  let mapColumn = null;
  let formColumn = null;
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
          className: 'contact-form__title',
        })
      );
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
          label: 'E-Mail',
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
          label: 'Telefon',
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
          label: 'Betreff',
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
          label: 'Nachricht',
          field: formFields.message,
          id: 'contact-message',
          required: true,
        })
      );
    }

    // Privacy policy checkbox
    if (state.showPrivacyCheckbox) {
      const privacyLink = Link({
        children: 'Datenschutzerklärung',
        href: state.privacyPolicyUrl,
        target: '_blank',
        underline: true,
      });
      linkComponents.push(privacyLink);

      // Create checkbox with text label first
      formFields.privacy = Checkbox({
        id: 'contact-privacy',
        name: 'privacy',
        label: 'Ich stimme der Datenschutzerklärung zu',
        required: true,
      });

      // Get the checkbox element and modify its label to include the link
      const checkboxElement = formFields.privacy.getElement();
      const labelElement = checkboxElement.querySelector('label');
      if (labelElement) {
        // Clear the label and rebuild it with the link
        labelElement.innerHTML = '';
        labelElement.appendChild(document.createTextNode('Ich stimme der '));
        labelElement.appendChild(privacyLink.getElement());
        labelElement.appendChild(document.createTextNode(' zu'));
      }

      formElements.push(
        FormGroup({
          label: '', // Empty label since checkbox has its own label
          field: formFields.privacy,
          id: 'contact-privacy',
          required: true,
        })
      );
    }

    // Newsletter checkbox
    if (state.showNewsletterCheckbox) {
      formFields.newsletter = Checkbox({
        id: 'contact-newsletter',
        name: 'newsletter',
        label: state.newsletterText,
        required: false,
      });

      formElements.push(
        FormGroup({
          label: '', // Empty label since checkbox has its own label
          field: formFields.newsletter,
          id: 'contact-newsletter',
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
    try {
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

      // Verify form was created successfully
      if (!formComponent || !formComponent.getElement) {
        throw new Error('Form component creation failed');
      }
    } catch (error) {
      console.warn(
        'Svarog Form component failed, creating fallback form:',
        error
      );

      // Create a simple fallback form structure with checkboxes
      const fallbackFormElements = [];

      // Add form title
      if (state.formTitle) {
        fallbackFormElements.push(
          createElement('h3', {
            text: state.formTitle,
            classes: 'contact-form__title',
          })
        );
      }

      // Add form fields as simple HTML
      if (state.showNameField) {
        fallbackFormElements.push(
          createElement('div', {
            classes: 'form-group',
            children: [
              createElement('label', {
                text: 'Name',
                attributes: { for: 'contact-name' },
              }),
              createElement('input', {
                attributes: {
                  type: 'text',
                  id: 'contact-name',
                  name: 'name',
                  placeholder: 'Your Name',
                  required: true,
                },
              }),
            ],
          })
        );
      }

      if (state.showEmailField) {
        fallbackFormElements.push(
          createElement('div', {
            classes: 'form-group',
            children: [
              createElement('label', {
                text: 'E-Mail',
                attributes: { for: 'contact-email' },
              }),
              createElement('input', {
                attributes: {
                  type: 'email',
                  id: 'contact-email',
                  name: 'email',
                  placeholder: 'your@email.com',
                  required: true,
                },
              }),
            ],
          })
        );
      }

      if (state.showSubjectField) {
        fallbackFormElements.push(
          createElement('div', {
            classes: 'form-group',
            children: [
              createElement('label', {
                text: 'Betreff',
                attributes: { for: 'contact-subject' },
              }),
              createElement('input', {
                attributes: {
                  type: 'text',
                  id: 'contact-subject',
                  name: 'subject',
                  placeholder: 'Message Subject',
                  required: true,
                },
              }),
            ],
          })
        );
      }

      if (state.showMessageField) {
        fallbackFormElements.push(
          createElement('div', {
            classes: 'form-group',
            children: [
              createElement('label', {
                text: 'Nachricht',
                attributes: { for: 'contact-message' },
              }),
              createElement('textarea', {
                attributes: {
                  id: 'contact-message',
                  name: 'message',
                  placeholder: 'Your message...',
                  required: true,
                  rows: 5,
                },
              }),
            ],
          })
        );
      }

      // Privacy checkbox
      if (state.showPrivacyCheckbox) {
        fallbackFormElements.push(
          createElement('div', {
            classes: 'form-group form-group--checkbox',
            children: [
              createElement('label', {
                classes: 'checkbox-label',
                children: [
                  createElement('input', {
                    attributes: {
                      type: 'checkbox',
                      id: 'contact-privacy',
                      name: 'privacy',
                      required: true,
                    },
                  }),
                  document.createTextNode(' Ich stimme der '),
                  createElement('a', {
                    text: 'Datenschutzerklärung',
                    attributes: {
                      href: state.privacyPolicyUrl,
                      target: '_blank',
                    },
                  }),
                  document.createTextNode(' zu'),
                ],
              }),
            ],
          })
        );
      }

      // Newsletter checkbox
      if (state.showNewsletterCheckbox) {
        fallbackFormElements.push(
          createElement('div', {
            classes: 'form-group form-group--checkbox',
            children: [
              createElement('label', {
                classes: 'checkbox-label',
                children: [
                  createElement('input', {
                    attributes: {
                      type: 'checkbox',
                      id: 'contact-newsletter',
                      name: 'newsletter',
                    },
                  }),
                  document.createTextNode(` ${state.newsletterText}`),
                ],
              }),
            ],
          })
        );
      }

      // Add submit button
      fallbackFormElements.push(
        createElement('button', {
          text: state.submitButtonText,
          attributes: { type: 'submit' },
          classes: 'btn btn--primary',
        })
      );

      // Create fallback form component
      const fallbackFormElement = createElement('form', {
        classes: 'contact-form',
        children: fallbackFormElements,
      });

      formComponent = {
        getElement: () => fallbackFormElement,
        getFormData: () => ({}),
        validate: () => true,
        reset: () => {},
        destroy: () => {},
      };
    }

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

    // Form (use the Svarog Form component directly)
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

    // Create map column
    mapColumn = Grid.Column({
      width: 6,
      mobileWidth: 12,
      children: mapComponent.getElement(),
    });

    // Create form column
    formColumn = Grid.Column({
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
    let finalElement;

    try {
      sectionComponent = Section({
        title: state.title,
        description: state.description,
        variant: state.variant,
        backgroundColor: state.backgroundColor,
        className: `contact-section ${state.className}`,
        children: gridElement,
      });

      finalElement = sectionComponent.getElement();

      // Verify the content was added
      if (!finalElement.contains(gridElement)) {
        console.warn(
          'Section component did not include grid element, appending manually'
        );
        finalElement.appendChild(gridElement);
      }
    } catch (error) {
      console.warn('Section component failed, using fallback:', error);

      // Fallback to simple structure
      finalElement = createElement('div', {
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
    }

    return finalElement;
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
        mapColumn,
        formColumn,
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
      mapColumn = null;
      formColumn = null;
      formFields = {};

      // Call base destroy
      baseComponent.destroy();
    },
  };
};

export default createContactSection;
