# ContactSection Component

The ContactSection component provides a complete contact solution with an integrated map and contact form. It combines the Section, Grid, Map, and Form components to create a professional contact experience. **This component uses automatic CSS injection - no separate CSS imports required.**

## Features

✅ **Zero Configuration** - Styles automatically inject when component is used
✅ **Complete Contact Solution** - Map, contact info, and form in one component
✅ **Google Maps Integration** - Interactive maps with automatic fallback
✅ **Responsive Design** - Adapts perfectly to mobile, tablet, and desktop
✅ **Form Validation** - Built-in validation with custom error messages
✅ **Accessibility** - Full keyboard navigation and screen reader support
✅ **Theme Support** - Uses CSS variables for easy customization

## Usage

```javascript
import { ContactSection } from '@svarog-ui/core';

// Create a basic contact section
const contactSection = ContactSection({
  title: 'Get in Touch',
  description: 'We would love to hear from you',

  // Map configuration
  apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  latitude: 48.1417262,
  longitude: 11.5609816,
  locationName: 'Our Munich Office',

  // Contact information
  contactInfo: {
    address: 'Marienplatz 1, 80331 München, Germany',
    phone: '+49 89 12345678',
    email: 'hello@company.com',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    website: 'https://company.com',
  },

  // Form submission
  onSubmit: (event, data, isValid, formFields) => {
    if (isValid) {
      console.log('Form submitted:', data);
      // Handle form submission
    }
  },
});

// Add to DOM
document.body.appendChild(contactSection.getElement());
```

## Props

| Prop             | Type     | Default                | Description                                       |
| ---------------- | -------- | ---------------------- | ------------------------------------------------- |
| title            | string   | 'Contact Us'           | Section title                                     |
| description      | string   | 'Get in touch with us' | Section description                               |
| variant          | string   | null                   | Section variant ('minor' for alternative styling) |
| backgroundColor  | string   | null                   | Custom background color                           |
| className        | string   | ''                     | Additional CSS classes                            |
| apiKey           | string   | null                   | Google Maps API key                               |
| latitude         | number   | 48.1417262             | Map center latitude                               |
| longitude        | number   | 11.5609816             | Map center longitude                              |
| locationName     | string   | 'Our Location'         | Display name for location                         |
| placeId          | string   | null                   | Google Places ID for automatic details            |
| googleMapsUrl    | string   | null                   | Google Maps URL to extract data from              |
| contactInfo      | object   | {}                     | Contact information object                        |
| formTitle        | string   | 'Send us a message'    | Contact form title                                |
| submitButtonText | string   | 'Send Message'         | Submit button text                                |
| showNameField    | boolean  | true                   | Whether to show name field                        |
| showEmailField   | boolean  | true                   | Whether to show email field                       |
| showPhoneField   | boolean  | false                  | Whether to show phone field                       |
| showSubjectField | boolean  | true                   | Whether to show subject field                     |
| showMessageField | boolean  | true                   | Whether to show message field                     |
| mapPosition      | string   | 'left'                 | Map position ('left' or 'right')                  |
| mobileLayout     | string   | 'stack'                | Mobile layout ('stack' or 'reverse')              |
| onSubmit         | function | null                   | Form submit handler                               |
| onChange         | function | null                   | Form change handler                               |

### Contact Info Object

```javascript
{
  address: string,   // Street address
  phone: string,     // Phone number
  email: string,     // Email address
  hours: string,     // Business hours
  website: string    // Website URL
}
```

## Methods

### getElement()

Returns the contact section DOM element.

```javascript
const element = contactSection.getElement();
```

### updateContactInfo(contactInfo)

Updates the contact information.

```javascript
contactSection.updateContactInfo({
  address: 'New Address',
  phone: '+49 89 87654321',
  email: 'new@company.com',
});
```

### getFormData()

Returns the current form data.

```javascript
const formData = contactSection.getFormData();
console.log('Current form data:', formData);
```

### validateForm()

Validates the contact form.

```javascript
const isValid = contactSection.validateForm();
if (isValid) {
  console.log('Form is valid');
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
  title: 'New Contact Title',
  latitude: 52.52,
  longitude: 13.405,
  contactInfo: {
    address: 'Berlin Office, Alexanderplatz 1',
  },
});
```

### destroy()

Cleans up resources and removes the component.

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

Returns all form field components.

```javascript
const fields = contactSection.getFormFields();
console.log('Name field value:', fields.name?.getValue());
```

## Examples

### Basic Contact Section

```javascript
const basicContact = ContactSection({
  title: 'Contact Our Munich Office',
  contactInfo: {
    address: 'Marienplatz 1, 80331 München',
    phone: '+49 89 12345678',
    email: 'munich@company.com',
    hours: 'Mon-Fri: 9:00-18:00',
  },
});
```

### With Google Maps Integration

```javascript
const mapsContact = ContactSection({
  title: 'Visit Our Store',
  apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  placeId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
  autoOpenInfo: true,

  onSubmit: async (event, data, isValid) => {
    if (isValid) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert('Message sent successfully!');
          contactSection.resetForm();
        }
      } catch (error) {
        alert('Error sending message. Please try again.');
      }
    }
  },
});
```

### Custom Layout and Fields

```javascript
const customContact = ContactSection({
  title: 'Get a Quote',
  formTitle: 'Request Information',
  submitButtonText: 'Get Quote',

  // Custom field configuration
  showNameField: true,
  showEmailField: true,
  showPhoneField: true,
  showSubjectField: false,
  showMessageField: true,

  // Right-side map
  mapPosition: 'right',
  mobileLayout: 'reverse',

  // Styling
  variant: 'minor',
  backgroundColor: '#f8f9fa',

  contactInfo: {
    address: 'Business Park 123, 80333 München',
    phone: '+49 89 98765432',
    email: 'quotes@company.com',
    hours: 'Available 24/7 for quotes',
  },
});
```

### Multiple Locations

```javascript
// Headquarters
const headquarters = ContactSection({
  title: 'Headquarters',
  latitude: 48.1417262,
  longitude: 11.5609816,
  contactInfo: {
    address: 'Munich HQ, Marienplatz 1',
    phone: '+49 89 12345678',
  },
});

// Branch Office
const branch = ContactSection({
  title: 'Berlin Branch',
  latitude: 52.52,
  longitude: 13.405,
  contactInfo: {
    address: 'Berlin Office, Alexanderplatz 1',
    phone: '+49 30 87654321',
  },
});
```

### Dynamic Contact Updates

```javascript
const dynamicContact = ContactSection({
  title: 'Contact Us',
  onSubmit: (event, data, isValid, formFields) => {
    if (isValid) {
      // Show loading state
      formFields.message.update({ loading: true });

      // Submit form
      submitContactForm(data)
        .then(() => {
          alert('Message sent!');
          dynamicContact.resetForm();
        })
        .catch(() => {
          alert('Error sending message');
        })
        .finally(() => {
          formFields.message.update({ loading: false });
        });
    }
  },
});

// Update location dynamically
const updateLocation = (newLocation) => {
  dynamicContact.update({
    latitude: newLocation.lat,
    longitude: newLocation.lng,
    locationName: newLocation.name,
  });

  dynamicContact.updateContactInfo({
    address: newLocation.address,
    phone: newLocation.phone,
  });
};
```

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

  /* Links */
  --contact-link-color: #007bff;
  --contact-link-hover-color: #0056b3;

  /* Form */
  --contact-form-title-margin: 0 0 1.5rem 0;

  /* Colors */
  --color-text: #333;
  --color-text-muted: #666;
}
```

### Custom Styling Example

```css
/* Custom contact section styling */
.my-contact-section {
  --contact-info-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --contact-link-color: #ffffff;
  --contact-link-hover-color: #f0f0f0;
}

.my-contact-section .contact-info__label {
  color: rgba(255, 255, 255, 0.9);
}

.my-contact-section .contact-info__value {
  color: rgba(255, 255, 255, 0.8);
}
```

## Responsive Behavior

### Desktop (≥1024px)

- Side-by-side layout with map and form
- Full-width contact information display
- Enhanced spacing and typography

### Tablet (768px - 1023px)

- Maintained side-by-side layout
- Adjusted spacing for optimal use of space
- Touch-friendly form controls

### Mobile (<768px)

- Stacked layout (map above/below form based on `mobileLayout`)
- Condensed contact information display
- Optimized form layout for thumb navigation
- Larger touch targets

## Form Integration

The ContactSection automatically creates and manages a form with the following features:

### Field Configuration

- **Name Field**: Text input, required by default
- **Email Field**: Email input with validation, required by default
- **Phone Field**: Tel input, optional by default
- **Subject Field**: Text input, required by default
- **Message Field**: Textarea with auto-resize and character count, required by default

### Validation

- Built-in HTML5 validation
- Custom error messages
- Visual validation feedback
- Form-level validation check

### Submission Handling

```javascript
onSubmit: (event, data, isValid, formFields) => {
  // event: Form submit event
  // data: Object with all form field values
  // isValid: Boolean indicating form validity
  // formFields: Object with access to individual field components
};
```

## Map Integration

The component integrates seamlessly with the Map component:

### Features

- Google Maps with interactive features (when API key provided)
- Automatic fallback to static preview (when no API key)
- Place details integration via Place ID
- Custom location markers
- Contact information display in map info window

### Google Maps Setup

1. Get API key from Google Cloud Console
2. Enable Maps JavaScript API and Places API
3. Add domain restrictions
4. Pass API key to component

## Accessibility

The ContactSection component follows accessibility best practices:

- **Semantic HTML**: Proper heading hierarchy and form structure
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: ARIA labels and live regions for form validation
- **Focus Management**: Proper focus handling and visible focus indicators
- **Color Contrast**: Sufficient contrast ratios for all text elements
- **Touch Targets**: Appropriately sized touch targets for mobile devices

## Performance

- **CSS Injection**: Styles loaded only when component is used
- **Component Composition**: Leverages existing optimized components
- **Lazy Loading**: Map loads only when component is rendered
- **Form Optimization**: Efficient form validation and state management
- **Memory Management**: Proper cleanup of all child components

## Browser Support

- **Modern Browsers**: Full support for all features
- **Legacy Browsers**: Graceful degradation with fallback styling
- **Mobile Browsers**: Optimized for touch interaction
- **SSR**: Complete server-side rendering compatibility

## Migration Notes

This component is designed to replace custom contact page implementations:

### Benefits over Custom Implementation

- **Consistent Styling**: Follows design system patterns
- **Built-in Responsiveness**: No media query management needed
- **Form Validation**: Comprehensive validation built-in
- **Map Integration**: Google Maps integration handled automatically
- **Accessibility**: WCAG compliance built-in

## Related Components

- [Section](../Section/README.md) - Used as the container
- [Grid](../Grid/README.md) - Provides the layout structure
- [Map](../Map/README.md) - Handles location display
- [Form](../Form/README.md) - Manages the contact form
- [Input](../Input/README.md) - Form input fields
- [Textarea](../Textarea/README.md) - Message field
- [Button](../Button/README.md) - Form submission
- [Typography](../Typography/README.md) - Text content
