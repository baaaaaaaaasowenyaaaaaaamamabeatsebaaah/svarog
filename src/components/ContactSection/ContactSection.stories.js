// src/components/ContactSection/ContactSection.stories.js
import ContactSection from './ContactSection.js';
import { mapsConfig } from '../../config/maps.config.js';

// Use the config object
const getApiKey = () => mapsConfig.apiKey;

// Helper to check API key status
const getApiKeyStatus = () => {
  const key = mapsConfig.apiKey;
  if (
    !key ||
    key === 'YOUR_GOOGLE_MAPS_API_KEY' ||
    key === 'YOUR_ACTUAL_API_KEY_HERE'
  ) {
    return { valid: false, message: 'No valid API key configured' };
  }
  return { valid: true, message: 'API key configured' };
};

// Status banner component
const createStatusBanner = () => {
  const status = getApiKeyStatus();
  const banner = document.createElement('div');

  banner.style.cssText = `
    padding: 12px 16px;
    margin-bottom: 20px;
    border-radius: 4px;
    font-size: 14px;
    ${
      status.valid
        ? 'background: #d4edda; border: 1px solid #c3e6cb; color: #155724;'
        : 'background: #fff3cd; border: 1px solid #ffeaa7; color: #856404;'
    }
  `;

  banner.innerHTML = `
    <strong>${status.valid ? '✅' : '⚠️'} ${status.message}</strong><br>
    <small>${
      status.valid
        ? 'Maps will display with full Google Maps functionality'
        : 'Maps will display in preview mode. Add API key to src/config/MapsConfig.js for full functionality'
    }</small>
  `;

  return banner;
};

/**
 * Helper to create contact section with standardized props
 * @private
 */
const createContactSection = (props = {}) => {
  return ContactSection({
    title: 'Contact Us',
    description: 'We would love to hear from you',
    latitude: 48.1417262,
    longitude: 11.5609816,
    locationName: 'Our Munich Office',
    contactInfo: {
      address: 'Marienplatz 1, 80331 München, Germany',
      phone: '+49 89 12345678',
      email: 'hello@company.com',
      hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
      website: 'https://company.com',
    },
    onSubmit: (event, data, isValid) => {
      if (isValid) {
        console.log('Contact form submitted:', data);
        alert('Thank you for your message!');
      }
    },
    ...props,
  });
};

export const Default = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection(args);
  return contactSection.getElement();
};

export const WithGoogleMaps = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Visit Our Store',
    description: 'Experience Google Maps integration',
    apiKey: getApiKey(),
    placeId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
  });
  return contactSection.getElement();
};

export const MapOnRight = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Contact with Right Map',
    description: 'Map positioned on the right side',
    mapPosition: 'right',
  });
  return contactSection.getElement();
};

export const WithCustomFields = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Get a Quote',
    formTitle: 'Request Information',
    submitButtonText: 'Get Quote',
    showPhoneField: true,
    showSubjectField: false,
  });
  return contactSection.getElement();
};

export const WithMinorVariant = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Contact Support',
    variant: 'minor',
    backgroundColor: '#f8f9fa',
  });
  return contactSection.getElement();
};

export const MobileReversedLayout = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Mobile Optimized',
    description: 'Form appears first on mobile',
    mobileLayout: 'reverse',
  });
  return contactSection.getElement();
};

export const MinimalConfiguration = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = ContactSection({
    contactInfo: {
      email: 'hello@company.com',
    },
    onSubmit: (event, data, isValid) => {
      if (isValid) {
        alert('Message sent with minimal config!');
      }
    },
    ...args,
  });
  return contactSection.getElement();
};

export const WithCallbacks = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Interactive Demo',
    description: 'Fill out the form to see callbacks',
    onSubmit: (event, data, isValid) => {
      if (isValid) {
        console.log('Form submitted:', data);
        alert(`Message sent!\nName: ${data.name}\nEmail: ${data.email}`);
      }
    },
    onChange: (event, data) => {
      console.log('Form changed:', data);
    },
  });
  return contactSection.getElement();
};
