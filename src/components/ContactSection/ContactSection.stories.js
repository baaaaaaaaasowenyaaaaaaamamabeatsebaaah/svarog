// src/components/ContactSection/ContactSection.stories.js
import ContactSection from './ContactSection.js';

// Smart config loading: try local first, fallback to production
let mapsConfig;
try {
  // Try local config (development)
  mapsConfig = (await import('../../config/maps.config.local.js')).mapsConfig;
  console.log('🔑 ContactSection: Using local maps config');
} catch {
  // Fallback to production config (Railway)
  mapsConfig = (await import('../../config/maps.config.js')).mapsConfig;
  console.log('🌍 ContactSection: Using production maps config');
}

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
        : 'Maps will display in preview mode. Add API key to src/config/maps.config.local.js for full functionality'
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
    title: 'Kontakt',
    description: 'Wir freuen uns auf Ihre Nachricht',
    latitude: 48.1417262,
    longitude: 11.5609816,
    locationName: 'Unser Münchner Büro',
    contactInfo: {
      companyName: 'Svarog Solutions GmbH',
      street: 'Marienplatz 1',
      zipcode: '80331',
      city: 'München',
      phone: '+49 89 12345678',
      email: 'hallo@svarog-solutions.de',
      hours: 'Montag - Freitag: 9:00 - 18:00 Uhr',
    },
    privacyPolicyUrl: '/datenschutz',
    privacyText: 'Ich stimme der Datenschutzerklärung zu',
    newsletterText: 'Ich möchte den Newsletter erhalten',
    onSubmit: (event, data, isValid) => {
      if (isValid) {
        console.log('Contact form submitted:', data);
        alert('Vielen Dank für Ihre Nachricht!');
      } else {
        console.log('Form validation failed');
      }
    },
    ...props,
  });
};

export default {
  title: 'Components/ContactSection',
  tags: ['autodocs'],
};

export const Default = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection(args);
  container.appendChild(contactSection.getElement());
  return container;
};

export const WithGoogleMaps = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Besuchen Sie uns',
    description: 'Google Maps Integration Beispiel',
    apiKey: getApiKey(),
    placeId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
  });
  container.appendChild(contactSection.getElement());
  return container;
};

export const MapOnRight = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Kontakt mit Karte rechts',
    description: 'Karte auf der rechten Seite positioniert',
    mapPosition: 'right',
  });
  container.appendChild(contactSection.getElement());
  return container;
};

export const WithCustomFields = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Angebot anfordern',
    formTitle: 'Informationen anfordern',
    submitButtonText: 'Angebot erhalten',
    showPhoneField: true,
    showSubjectField: false,
    contactInfo: {
      companyName: 'Tech Solutions GmbH',
      street: 'Gewerbepark 123',
      zipcode: '80333',
      city: 'München',
      phone: '+49 89 98765432',
      email: 'angebote@tech-solutions.de',
      hours: '24/7 für Anfragen verfügbar',
    },
  });
  container.appendChild(contactSection.getElement());
  return container;
};

export const WithMinorVariant = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Support kontaktieren',
    variant: 'minor',
    backgroundColor: '#f8f9fa',
    contactInfo: {
      companyName: 'Support Team',
      street: 'Hauptstraße 42',
      zipcode: '10115',
      city: 'Berlin',
      phone: '+49 30 87654321',
      email: 'support@company.de',
      hours: 'Mo-Fr: 8:00-20:00 Uhr',
    },
  });
  container.appendChild(contactSection.getElement());
  return container;
};

export const MobileReversedLayout = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Mobile optimiert',
    description: 'Formular erscheint zuerst auf mobilen Geräten',
    mobileLayout: 'reverse',
  });
  container.appendChild(contactSection.getElement());
  return container;
};

export const MinimalConfiguration = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = ContactSection({
    contactInfo: {
      companyName: 'Minimal Setup',
      email: 'hallo@company.de',
    },
    showPrivacyCheckbox: false,
    showNewsletterCheckbox: false,
    onSubmit: (event, data, isValid) => {
      if (isValid) {
        alert('Nachricht mit minimaler Konfiguration gesendet!');
      }
    },
    ...args,
  });
  container.appendChild(contactSection.getElement());
  return container;
};

export const WithFullAddressInfo = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Vollständige Adressinformationen',
    description: 'Alle Kontaktfelder ausgefüllt',
    contactInfo: {
      companyName: 'Vollständige Firma GmbH & Co. KG',
      street: 'Lange Straße mit Hausnummer 123a',
      zipcode: '80331',
      city: 'München',
      phone: '+49 89 12345678',
      email: 'kontakt@vollstaendige-firma.de',
      hours: 'Montag bis Freitag: 9:00 - 18:00 Uhr\nSamstag: 10:00 - 14:00 Uhr',
    },
  });
  container.appendChild(contactSection.getElement());
  return container;
};

export const WithCallbacks = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Interaktive Demo',
    description: 'Füllen Sie das Formular aus, um Callbacks zu sehen',
    onSubmit: (event, data, isValid) => {
      console.log('=== Form Submission ===');
      console.log('Valid:', isValid);
      console.log('Data:', data);

      if (isValid) {
        // Check required fields
        const requiredFields = [
          'name',
          'email',
          'subject',
          'message',
          'privacy',
        ];
        const missingFields = requiredFields.filter((field) => !data[field]);

        if (missingFields.length === 0) {
          alert(
            `Nachricht gesendet!\n\nName: ${data.name}\nE-Mail: ${data.email}\nBetreff: ${data.subject}\nNewsletter: ${data.newsletter ? 'Ja' : 'Nein'}`
          );
        } else {
          alert(
            `Bitte füllen Sie alle Pflichtfelder aus: ${missingFields.join(', ')}`
          );
        }
      } else {
        alert('Bitte korrigieren Sie die Fehler im Formular.');
      }
    },
    onChange: (event, data) => {
      console.log('Form changed:', data);
    },
  });
  container.appendChild(contactSection.getElement());
  return container;
};

export const BerlinOffice = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Berliner Niederlassung',
    description: 'Besuchen Sie uns in der Hauptstadt',
    latitude: 52.52,
    longitude: 13.405,
    locationName: 'Berlin Office',
    contactInfo: {
      companyName: 'Svarog Solutions Berlin',
      street: 'Unter den Linden 1',
      zipcode: '10117',
      city: 'Berlin',
      phone: '+49 30 12345678',
      email: 'berlin@svarog-solutions.de',
      hours: 'Montag - Freitag: 8:00 - 19:00 Uhr',
    },
  });
  container.appendChild(contactSection.getElement());
  return container;
};

export const OnlyPhoneAndEmail = (args) => {
  const container = document.createElement('div');
  container.appendChild(createStatusBanner());
  const contactSection = createContactSection({
    ...args,
    title: 'Schnellkontakt',
    description: 'Nur die wichtigsten Kontaktdaten',
    contactInfo: {
      phone: '+49 89 12345678',
      email: 'schnell@contact.de',
    },
    showSubjectField: false,
    showPrivacyCheckbox: false,
    showNewsletterCheckbox: false,
  });
  container.appendChild(contactSection.getElement());
  return container;
};
