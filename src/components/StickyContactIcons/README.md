# StickyContactIcons Component

The StickyContactIcons component provides a fixed-position set of contact icons (location, phone, email) that stay visible while the user scrolls through the page.

## Usage

```javascript
import { StickyContactIcons } from '@svarog-ui/core';

// Create the component
const contactIcons = StickyContactIcons({
  location: 'Luisenstr. 1',
  phone: '0176/88778877',
  email: 'info@muchandy.de',
});

// Add to DOM
document.body.appendChild(contactIcons.getElement());

// Clean up when no longer needed
contactIcons.destroy();
```

## Props

| Prop            | Type     | Default    | Description                                           |
| --------------- | -------- | ---------- | ----------------------------------------------------- |
| location        | string   | -          | Shop location address (required)                      |
| phone           | string   | -          | Contact phone number (required)                       |
| email           | string   | -          | Contact email address (required)                      |
| locationId      | string   | "location" | ID of the page section to scroll to on location click |
| onLocationClick | function | null       | Callback for location icon click                      |
| onPhoneClick    | function | null       | Callback for phone icon click                         |
| onEmailClick    | function | null       | Callback for email icon click                         |
| className       | string   | ""         | Additional CSS classes                                |
| position        | string   | "right"    | Position of icons ("right" or "bottom")               |
| showTooltips    | boolean  | true       | Whether to show tooltips on hover                     |

## Methods

### getElement()

Returns the component's DOM element.

```javascript
const iconsElement = contactIcons.getElement();
```

### update(props)

Updates the component with new properties.

```javascript
contactIcons.update({
  phone: '0176/99889988',
  showTooltips: false,
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the component.

```javascript
contactIcons.destroy();
```

## Accessibility Features

The StickyContactIcons component implements these accessibility features:

- Proper `aria-label` attributes for each icon
- Tooltips for additional context (can be disabled)
- Standard link elements for native browser interaction
- Screen reader support with descriptive labels

## Examples

### Basic Usage

```javascript
const contactIcons = StickyContactIcons({
  location: 'Luisenstr. 1',
  phone: '0176/88778877',
  email: 'info@muchandy.de',
});
```

### With Custom Position

```javascript
const contactIcons = StickyContactIcons({
  location: 'Luisenstr. 1',
  phone: '0176/88778877',
  email: 'info@muchandy.de',
  position: 'bottom', // Position at the bottom of the screen
});
```

### With Click Handlers

```javascript
const contactIcons = StickyContactIcons({
  location: 'Luisenstr. 1',
  phone: '0176/88778877',
  email: 'info@muchandy.de',
  onLocationClick: (event) => {
    console.log('Location clicked');
    // Return false to prevent default navigation
    return false;
  },
  onPhoneClick: (event) => {
    console.log('Phone clicked');
    // Analytics tracking could go here
  },
  onEmailClick: (event) => {
    console.log('Email clicked');
    // You could open a custom modal instead
    return false;
  },
});
```

### Without Tooltips

```javascript
const contactIcons = StickyContactIcons({
  location: 'Luisenstr. 1',
  phone: '0176/88778877',
  email: 'info@muchandy.de',
  showTooltips: false, // Disable tooltips
});
```

## CSS Customization

StickyContactIcons can be customized using CSS variables:

```css
:root {
  /* Base variables */
  --sticky-contact-icons-right: 1rem;
  --sticky-contact-icons-gap: 0.75rem;
  --sticky-contact-icons-padding: 0.75rem;
  --sticky-contact-icons-bg: white;
  --sticky-contact-icons-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --sticky-contact-icons-color: #333;
  --sticky-contact-icons-hover-color: #4299e1;
  --sticky-contact-icons-size: 40px;
  --sticky-contact-icons-icon-size: 20px;

  /* Mobile variables */
  --sticky-contact-icons-mobile-right: 0.5rem;
  --sticky-contact-icons-mobile-bottom: 1rem;
  --sticky-contact-icons-mobile-size: 36px;
  --sticky-contact-icons-mobile-icon-size: 18px;
}
```
