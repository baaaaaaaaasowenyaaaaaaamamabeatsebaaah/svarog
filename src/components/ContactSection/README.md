# ContactSection Component

## Architecture

The ContactSection component is built using modern Svarog UI principles:

- **Grid Component Integration**: Uses the Svarog Grid component for responsive layouts instead of manual CSS Grid
- **Component Composition**: Leverages existing Svarog components (Section, Map, Form, Link, etc.)
- **Automatic Style Injection**: No CSS imports needed - styles are injected automatically
- **Responsive by Design**: Grid component handles mobile (12/12), tablet, and desktop (6/6) layouts seamlessly
- **Proper Lifecycle Management**: All child components (Grid, Columns, Links) are properly cleaned up

### Layout Structure

```
ContactSection
├── Section (container)
└── Grid (responsive layout)
    ├── Grid.Column (map - 6/12 desktop, 12/12 mobile)
    │   └── Map component
    └── Grid.Column (form - 6/12 desktop, 12/12 mobile)
        ├── Contact Info (with Link components)
        └── Form (with FormGroups and Checkboxes)
```

## Features

✅ **Zero Configuration** - Styles automatically inject when component is used
✅ **Complete Contact Solution** - Map, contact info, and form in one component
✅ **Google Maps Integration** - Interactive maps with automatic fallback
✅ **Responsive Design** - Uses Grid component for perfect mobile, tablet, and desktop layouts
✅ **Form Validation** - Built-in validation with custom error messages
✅ **Link Component Integration** - Uses Svarog Link components for contact links
✅ **German Localization** - Optimized for German business usage
✅ **Privacy Compliance** - Built-in privacy policy and newsletter checkboxes
✅ **Accessibility** - Full keyboard navigation and screen reader support
✅ **Theme Support** - Uses CSS variables for easy customization

## Usage

```javascript
import { ContactSection } from '@svarog-ui/core';

// Create a complete contact section with German localization
const contactSection = ContactSection({
  title: 'Kontakt',
  description: 'Wir freuen uns auf Ihre Nachricht',

  // Map configuration
  apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  latitude: 48.1417262,
  longitude: 11.5609816,
  locationName: 'Unser Münchner Büro',

  // Updated contact information structure
  contactInfo: {
    companyName: 'Svarog Solutions GmbH',
    street: 'Marienplatz 1',
    zipcode: '80331',
    city: 'München',
    phone: '+49 89 12345678',
    email: 'kontakt@svarog-solutions.de',
    hours: 'Montag - Freitag: 9:00 - 18:00 Uhr',
  },

  // Privacy and newsletter settings
  privacyPolicyUrl: '/datenschutz',
  privacyText: 'Ich stimme der Datenschutzerklärung zu',
  newsletterText: 'Ich möchte den Newsletter erhalten',

  // Form submission with checkbox data
  onSubmit: (event, data, isValid, formFields) => {
    if (isValid) {
      console.log('Form submitted:', data);
      console.log('Privacy accepted:', data.privacy);
      console.log('Newsletter subscription:', data.newsletter);
      // Handle form submission
    }
  },
});

// Add to DOM
document.body.appendChild(contactSection.getElement());
```

## Props

| Prop                   | Type     | Default                                  | Description                                       |
| ---------------------- | -------- | ---------------------------------------- | ------------------------------------------------- |
| title                  | string   | 'Contact Us'                             | Section title                                     |
| description            | string   | 'Get in touch with us'                   | Section description                               |
| variant                | string   | null                                     | Section variant ('minor' for alternative styling) |
| backgroundColor        | string   | null                                     | Custom background color                           |
| className              | string   | ''                                       | Additional CSS classes                            |
| apiKey                 | string   | null                                     | Google Maps API key                               |
| latitude               | number   | 48.1417262                               | Map center latitude                               |
| longitude              | number   | 11.5609816                               | Map center longitude                              |
| locationName           | string   | 'Our Location'                           | Display name for location                         |
| placeId                | string   | null                                     | Google Places ID for automatic details            |
| googleMapsUrl          | string   | null                                     | Google Maps URL to extract data from              |
| contactInfo            | object   | {}                                       | Contact information object (new structure)        |
| formTitle              | string   | 'Send us a message'                      | Contact form title                                |
| submitButtonText       | string   | 'Send Message'                           | Submit button text                                |
| showNameField          | boolean  | true                                     | Whether to show name field                        |
| showEmailField         | boolean  | true                                     | Whether to show email field                       |
| showPhoneField         | boolean  | false                                    | Whether to show phone field                       |
| showSubjectField       | boolean  | true                                     | Whether to show subject field                     |
| showMessageField       | boolean  | true                                     | Whether to show message field                     |
| showPrivacyCheckbox    | boolean  | true                                     | Whether to show privacy policy checkbox           |
| showNewsletterCheckbox | boolean  | true                                     | Whether to show newsletter checkbox               |
| privacyPolicyUrl       | string   | '/datenschutz'                           | URL to privacy policy page                        |
| privacyText            | string   | 'Ich stimme der Datenschutzerklärung zu' | Privacy checkbox label text                       |
| newsletterText         | string   | 'Ich möchte den Newsletter erhalten'     | Newsletter checkbox label text                    |
| mapPosition            | string   | 'left'                                   | Map position ('left' or 'right')                  |
| mobileLayout           | string   | 'stack'                                  | Mobile layout ('stack' or 'reverse')              |
| onSubmit               | function | null                                     | Form submit handler                               |
| onChange               | function | null                                     | Form change handler                               |

### Contact Info Object (Updated Structure)

The contact info object now uses a more structured approach suitable for German businesses:

```javascript
{
  companyName: string,  // Company name
  street: string,       // Street address with house number
  zipcode: string,      // Postal code (PLZ)
  city: string,         // City name
  phone: string,        // Phone number
  email: string,        // Email address
  hours: string         // Business hours
}
```

**Previous structure** (deprecated):

```javascript
{
  address: string,      // ❌ Replaced by street, zipcode, city
  phone: string,        // ✅ Still supported
  email: string,        // ✅ Still supported
  hours: string,        // ✅ Still supported
  website: string       // ❌ Removed
}
```

## Methods

### getElement()

Returns the contact section DOM element.

```javascript
const element = contactSection.getElement();
```

### updateContactInfo(contactInfo)

Updates the contact information using the new structure.

```javascript
contactSection.updateContactInfo({
  companyName: 'New Company GmbH',
  street: 'Neue Straße 456',
  zipcode: '80335',
  city: 'München',
  phone: '+49 89 87654321',
  email: 'neu@company.de',
});
```

### getFormData()

Returns the current form data including checkbox values.

```javascript
const formData = contactSection.getFormData();
console.log('Privacy accepted:', formData.privacy);
console.log('Newsletter subscription:', formData.newsletter);
```

### validateForm()

Validates the contact form including required checkboxes.

```javascript
const isValid = contactSection.validateForm();
if (isValid) {
  console.log('Form is valid, including privacy policy acceptance');
}
```

### resetForm()

Resets the contact form to its initial state.

```javascript
contactSection.resetForm();
```

### update(props)

Updates multiple component properties at once.

```javascript
contactSection.update({
  title: 'Neuer Kontakt Titel',
  contactInfo: {
    companyName: 'Neue Firma GmbH',
    zipcode: '80331',
    city: 'München',
  },
  showNewsletterCheckbox: false,
});
```

### destroy()

Cleans up resources including Link components and removes the component.

```javascript
contactSection.destroy();
```

## Component Access Methods

### getMapComponent()

Returns the Map component instance.

```javascript
const mapComponent = contactSection.getMapComponent();
mapComponent.setCoordinates(48.8566, 2.3522);
```

### getFormComponent()

Returns the Form component instance.

```javascript
const formComponent = contactSection.getFormComponent();
formComponent.reset();
```

### getFormFields()

Returns all form field components including checkboxes.

```javascript
const fields = contactSection.getFormFields();
console.log('Privacy checkbox:', fields.privacy?.getValue());
console.log('Newsletter checkbox:', fields.newsletter?.getValue());
```

## Examples

### German Business Contact Section

```javascript
const germanContact = ContactSection({
  title: 'Kontakt aufnehmen',
  description: 'Wir sind für Sie da',

  contactInfo: {
    companyName: 'Mustermann Solutions GmbH',
    street: 'Hauptstraße 123',
    zipcode: '80331',
    city: 'München',
    phone: '+49 89 12345678',
    email: 'info@mustermann-solutions.de',
    hours: 'Montag - Freitag: 9:00 - 18:00 Uhr',
  },

  formTitle: 'Nachricht senden',
  submitButtonText: 'Nachricht absenden',

  privacyPolicyUrl: '/datenschutz',
  privacyText: 'Ich stimme der Datenschutzerklärung zu',
  newsletterText: 'Ich möchte über Neuigkeiten informiert werden',
});
```

### With Google Maps Integration

```javascript
const mapsContact = ContactSection({
  title: 'Besuchen Sie uns',
  description: 'Unser Büro in München',

  apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  placeId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',

  contactInfo: {
    companyName: 'Tech Solutions München GmbH',
    street: 'Marienplatz 8',
    zipcode: '80331',
    city: 'München',
    phone: '+49 89 98765432',
    email: 'muenchen@tech-solutions.de',
    hours: 'Mo-Fr: 8:00-19:00, Sa: 10:00-14:00',
  },

  onSubmit: async (event, data, isValid) => {
    if (isValid && data.privacy) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            gdprConsent: data.privacy,
            marketingConsent: data.newsletter,
          }),
        });

        if (response.ok) {
          alert('Nachricht erfolgreich gesendet!');
          contactSection.resetForm();
        }
      } catch (error) {
        alert('Fehler beim Senden. Bitte versuchen Sie es erneut.');
      }
    } else if (!data.privacy) {
      alert('Bitte stimmen Sie der Datenschutzerklärung zu.');
    }
  },
});

// Note: The component automatically handles:
// - Responsive layout using Grid component (6/6 desktop, 12/12 mobile)
// - Link components for phone/email (automatic tel: and mailto: links)
// - Form validation including required privacy checkbox
// - Proper cleanup of all child components
```

### Minimal Configuration

```javascript
const minimalContact = ContactSection({
  contactInfo: {
    companyName: 'Kleine Firma',
    email: 'kontakt@kleine-firma.de',
    phone: '+49 30 12345678',
  },

  showPrivacyCheckbox: false,
  showNewsletterCheckbox: false,
  showSubjectField: false,
});
```

### Multi-Location Setup

```javascript
// Munich Office
const munichOffice = ContactSection({
  title: 'Hauptsitz München',
  contactInfo: {
    companyName: 'Hauptverwaltung',
    street: 'Maximilianstraße 1',
    zipcode: '80539',
    city: 'München',
    phone: '+49 89 12345678',
    email: 'muenchen@company.de',
  },
  latitude: 48.1417262,
  longitude: 11.5609816,
});

// Berlin Branch
const berlinBranch = ContactSection({
  title: 'Niederlassung Berlin',
  contactInfo: {
    companyName: 'Zweigstelle Nord',
    street: 'Unter den Linden 1',
    zipcode: '10117',
    city: 'Berlin',
    phone: '+49 30 87654321',
    email: 'berlin@company.de',
  },
  latitude: 52.52,
  longitude: 13.405,
});
```

## Link Component Integration

The ContactSection now uses the Svarog Link component for all contact links, providing:

- **Consistent Styling**: All links follow the design system
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Performance**: Optimized rendering and memory management
- **Maintainability**: Centralized link behavior

### Automatic Link Creation

Phone and email contacts are automatically converted to clickable links:

```javascript
const contactSection = ContactSection({
  contactInfo: {
    phone: '+49 89 12345678', // Becomes tel: link
    email: 'info@company.de', // Becomes mailto: link
  },
});
```

### Enhanced Privacy Policy Links

The privacy policy checkbox automatically creates a clickable link within the checkbox label:

```javascript
const contactSection = ContactSection({
  privacyPolicyUrl: '/datenschutz',
  privacyText: 'Ich stimme der Datenschutzerklärung zu',
});
// Results in: "☐ Ich stimme der [Datenschutzerklärung] zu" (with clickable link)
```

**Implementation Details:**

- Creates a custom checkbox structure with proper accessibility
- Link opens in new tab with `target="_blank"`
- Clicking the text toggles the checkbox (except when clicking the link)
- Proper focus handling and keyboard navigation
- Required field validation integrated

The component automatically:

- Creates `tel:` links for phone numbers
- Creates `mailto:` links for email addresses
- Creates clickable privacy policy links within checkbox labels
- Handles proper checkbox state management
- Adds proper accessibility attributes
- Handles Link component lifecycle and cleanup

## Form Validation with Checkboxes

The enhanced form includes validation for privacy policy acceptance:

### Required Fields

- **Name** (if `showNameField: true`)
- **Email** (if `showEmailField: true`)
- **Subject** (if `showSubjectField: true`)
- **Message** (if `showMessageField: true`)
- **Privacy Policy** (if `showPrivacyCheckbox: true`)

_Note: Required field indicators (asterisks) are automatically handled by the FormGroup component - don't add them manually to labels._

### Optional Fields

- **Phone** (if `showPhoneField: true`)
- **Newsletter** (always optional)

### Form Data Structure

```javascript
{
  name: "Hans Müller",
  email: "hans@example.de",
  phone: "+49 89 12345678",      // if phone field enabled
  subject: "Anfrage",
  message: "Ihre Nachricht...",
  privacy: true,                 // Required for submission
  newsletter: false              // Optional
}
```

### Checkbox Behavior

**Privacy Policy Checkbox:**

- Required field that must be checked before form submission
- Contains clickable link to privacy policy (opens in new tab)
- Clicking the text toggles the checkbox (except when clicking the link)
- Proper validation error display if not checked

**Newsletter Checkbox:**

- Optional field for marketing consent
- Simple checkbox with clickable text label
- Default state is unchecked

## CSS Customization

ContactSection styles can be customized using CSS variables:

```css
:root {
  /* Layout */
  --contact-section-gap: 2rem;
  --contact-section-content-gap: 1.5rem;

  /* Contact info styling */
  --contact-info-bg: #f8f9fa;
  --contact-info-padding: 1.5rem;
  --contact-info-radius: 8px;
  --contact-info-border: 1px solid #e9ecef;
  --contact-info-gap: 1rem;
  --contact-info-item-gap: 0.5rem;

  /* Links (uses Link component variables) */
  --contact-link-color: #007bff;
  --contact-link-hover-color: #0056b3;

  /* Form and checkboxes */
  --contact-form-title-margin: 0 0 1.5rem 0;
  --checkbox-gap: 0.5rem;

  /* Colors */
  --color-text: #333;
  --color-text-muted: #666;
}
```

### German-Specific Styling

```css
/* Adjust for longer German labels */
.contact-info__label {
  min-width: 120px; /* Accommodate "Öffnungszeiten:" */
}

.checkbox-label {
  line-height: 1.5; /* Better readability for German text */
}

/* Mobile adjustments for German text */
@media (max-width: 767px) {
  .contact-info__label {
    min-width: 100px;
    font-size: 0.875rem;
  }

  .checkbox-label {
    font-size: 0.8rem;
  }
}
```

## Responsive Behavior

### Desktop (≥1024px)

- Side-by-side layout with map and form
- Full contact information display with labels
- Enhanced spacing for comfortable reading
- Large clickable areas for links

### Tablet (768px - 1023px)

- Maintained side-by-side layout
- Adjusted spacing for optimal space usage
- Touch-friendly form controls and checkboxes
- Appropriately sized contact information

### Mobile (<768px)

- Stacked layout (configurable order)
- Condensed contact information in row format
- Optimized checkbox layout for touch interaction
- Larger touch targets for phone/email links
- Compressed German text without losing readability

## Accessibility

The ContactSection component follows WCAG 2.1 guidelines:

- **Semantic HTML**: Proper form structure and fieldsets
- **Keyboard Navigation**: Full keyboard support including checkboxes
- **Screen Reader Support**: ARIA labels and form validation announcements
- **Focus Management**: Proper focus handling and visible indicators
- **Color Contrast**: Sufficient contrast for all text and interactive elements
- **Touch Targets**: Appropriately sized for mobile interaction
- **Link Accessibility**: Uses Link component accessibility features

### German Accessibility Considerations

- Uses semantic German labels ("Pflichtfeld" indicators)
- Proper pronunciation guidance for screen readers
- Clear error messages in German
- Logical tab order for German form flow

## Performance

- **CSS Injection**: Styles loaded only when component is used
- **Component Composition**: Leverages optimized child components
- **Link Management**: Efficient Link component lifecycle handling
- **Form Optimization**: Streamlined validation and state management
- **Memory Management**: Proper cleanup of all child components including Links

## Browser Support

- **Modern Browsers**: Full support for all features
- **Legacy Browsers**: Graceful degradation with fallback styling
- **Mobile Browsers**: Optimized for touch interaction
- **SSR**: Complete server-side rendering compatibility

## Migration Guide

### From Old Contact Info Structure

**Before:**

```javascript
const oldContact = ContactSection({
  contactInfo: {
    address: 'Marienplatz 1, 80331 München', // ❌ Old format
    phone: '+49 89 12345678',
    email: 'info@company.de',
    website: 'https://company.de', // ❌ Removed
  },
});
```

**After:**

```javascript
const newContact = ContactSection({
  contactInfo: {
    companyName: 'Company GmbH', // ✅ New field
    street: 'Marienplatz 1', // ✅ Separate field
    zipcode: '80331', // ✅ Separate field
    city: 'München', // ✅ Separate field
    phone: '+49 89 12345678', // ✅ Same
    email: 'info@company.de', // ✅ Same
    hours: 'Mo-Fr: 9:00-18:00', // ✅ Same
  },
});
```

### Benefits of New Structure

- **Better SEO**: Structured contact data
- **Improved Accessibility**: Clearer address structure
- **Enhanced Styling**: Individual control over address components
- **German Standards**: Follows German address conventions
- **Data Export**: Easier integration with CRM systems

## Related Components

- [Section](../Section/README.md) - Used as the container
- [Grid](../Grid/README.md) - Provides the responsive layout structure (NEW!)
- [Map](../Map/README.md) - Handles location display
- [Form](../Form/README.md) - Manages the contact form
- [Input](../Input/README.md) - Form input fields
- [Textarea](../Textarea/README.md) - Message field
- [Checkbox](../Checkbox/README.md) - Privacy and newsletter checkboxes
- [Button](../Button/README.md) - Form submission
- [Link](../Link/README.md) - Contact information links
- [Typography](../Typography/README.md) - Text content
