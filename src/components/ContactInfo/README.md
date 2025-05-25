# ContactInfo Component

The ContactInfo component provides a structured, interactive way to display contact information with location, phone, and email details. Styles are automatically injected when the component is used - no separate CSS imports needed.

## Usage

```javascript
import { ContactInfo } from '@svarog-ui/core';

// Create a contact info component
const contactInfo = ContactInfo({
  location: 'Main Street 123',
  phone: '555-123-4567',
  email: 'contact@example.com',
});

// Add to DOM
document.body.appendChild(contactInfo.getElement());
```

## Props

| Prop            | Type     | Default    | Description                                      |
| --------------- | -------- | ---------- | ------------------------------------------------ |
| location        | string   | _required_ | Location address text                            |
| phone           | string   | _required_ | Phone number                                     |
| email           | string   | _required_ | Email address                                    |
| locationId      | string   | "location" | ID of the location section to scroll to          |
| onLocationClick | function | null       | Click handler for location link                  |
| onPhoneClick    | function | null       | Click handler for phone link                     |
| onEmailClick    | function | null       | Click handler for email link                     |
| className       | string   | ""         | Additional CSS classes for the container element |

## Methods

### getElement()

Returns the contact info DOM element.

```javascript
const element = contactInfo.getElement();
```

### update(props)

Updates contact info properties.

```javascript
contactInfo.update({
  location: 'New Address',
  phone: '555-987-6543',
});
```

### setLocation(location)

Updates just the location text.

```javascript
contactInfo.setLocation('Updated Address');
```

### setPhone(phone)

Updates just the phone number.

```javascript
contactInfo.setPhone('555-987-6543');
```

### setEmail(email)

Updates just the email address.

```javascript
contactInfo.setEmail('new@example.com');
```

### destroy()

Cleans up event listeners and resources. Call when removing the component.

```javascript
contactInfo.destroy();
```

## Accessibility Features

The ContactInfo component implements these accessibility features:

- Proper link semantics for each contact method
- Descriptive title attributes on all links
- Screen reader support with appropriate text content
- Support for keyboard navigation

## Event Handlers

The component provides three event handlers for custom logic:

### onLocationClick

Called when the location link is clicked. Return `false` to prevent default navigation.

```javascript
const contactInfo = ContactInfo({
  // ...other props
  onLocationClick: (event) => {
    // Custom logic here
    return false; // Prevents navigation to the anchor
  },
});
```

### onPhoneClick

Called when the phone link is clicked. Return `false` to prevent default behavior.

```javascript
const contactInfo = ContactInfo({
  // ...other props
  onPhoneClick: (event) => {
    // Custom logic here
    return false; // Prevents opening the phone dialer
  },
});
```

### onEmailClick

Called when the email link is clicked. Return `false` to prevent default behavior.

```javascript
const contactInfo = ContactInfo({
  // ...other props
  onEmailClick: (event) => {
    // Custom logic here
    return false; // Prevents opening the email client
  },
});
```

## CSS Customization

ContactInfo styles are automatically injected when the component is used. You can customize the appearance using CSS variables:

```css
:root {
  /* Container */
  --contact-info-gap: 1rem;
  --contact-info-mobile-gap: 0.5rem;

  /* Contact items */
  --contact-info-font-size: 0.875rem;
  --contact-info-color: #333;
  --contact-info-hover-color: #4299e1;
  --contact-info-item-gap: 0.5rem;

  /* Icons */
  --contact-info-icon-size: 18px;
}
```

### Style Injection Benefits

- **Zero Configuration**: No need to import CSS files separately
- **Tree Shakeable**: Only loads styles when component is used
- **SSR Compatible**: Styles inject safely in browser environments
- **Automatic Deduplication**: Multiple instances share the same styles
- **Theme Integration**: Works seamlessly with theme CSS variables

## Examples

### Basic Contact Info

```javascript
const contactInfo = ContactInfo({
  location: 'Main Street 123, City',
  phone: '555-123-4567',
  email: 'contact@example.com',
});
```

### With Custom Link Target

```javascript
const contactInfo = ContactInfo({
  location: 'Main Street 123, City',
  phone: '555-123-4567',
  email: 'contact@example.com',
  locationId: 'contact-section',
});
```

### With Custom Event Handlers

```javascript
const contactInfo = ContactInfo({
  location: 'Main Street 123, City',
  phone: '555-123-4567',
  email: 'contact@example.com',
  onLocationClick: (event) => {
    console.log('Location clicked');
    // Custom map logic or analytics here
    return true; // Allow default navigation
  },
  onPhoneClick: (event) => {
    console.log('Phone clicked');
    // Custom phone handling or analytics here
    return true; // Allow default phone action
  },
  onEmailClick: (event) => {
    console.log('Email clicked');
    // Custom email handling or analytics here
    return true; // Allow default email action
  },
});
```

### In Header with Custom Class

```javascript
const headerContactInfo = ContactInfo({
  location: 'Main Street 123, City',
  phone: '555-123-4567',
  email: 'contact@example.com',
  className: 'header-contact-info small-text',
});

document.querySelector('header').appendChild(headerContactInfo.getElement());
```

### Working with Different Themes

The component automatically adapts to your theme system via CSS variables:

```javascript
// Component works with any theme
import { themeManager } from '@svarog-ui/core';

// Switch themes - component styles adapt automatically
themeManager.switchTheme('dark');
themeManager.switchTheme('light');
```

## Migration from CSS Imports

If migrating from a version that required CSS imports:

```javascript
// OLD - Required separate CSS import
import './ContactInfo.css';
import ContactInfo from './ContactInfo.js';

// NEW - Styles automatically injected
import ContactInfo from './ContactInfo.js';
```

No other changes are needed - the component API remains exactly the same.

## Performance Notes

- Styles are injected once per component type (not per instance)
- Style injection is cached and deduped automatically
- Minimal performance impact - styles are inserted during component creation
- Works efficiently with server-side rendering (browser-only injection)
