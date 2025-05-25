# StickyContactIcons Component

The StickyContactIcons component provides a fixed-position set of contact icons (location, phone, email) that stay visible while the user scrolls through the page.

## Features

✅ **Zero Configuration** - Styles are automatically injected, no CSS imports needed  
✅ **SSR Compatible** - Works in Node.js environments without errors  
✅ **Responsive Design** - Adapts to mobile and desktop viewports  
✅ **Accessibility** - Proper ARIA labels and keyboard navigation  
✅ **Theme Aware** - Responds to theme changes automatically  
✅ **Legacy Support** - Backward compatible with deprecated props

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

| Prop             | Type     | Default    | Description                                           |
| ---------------- | -------- | ---------- | ----------------------------------------------------- |
| location         | string   | -          | Shop location address (required)                      |
| phone            | string   | -          | Contact phone number (required)                       |
| email            | string   | -          | Contact email address (required)                      |
| locationId       | string   | "location" | ID of the page section to scroll to on location click |
| onClick          | object   | null       | Click handlers for each icon type                     |
| onClick.location | function | null       | Callback for location icon click                      |
| onClick.phone    | function | null       | Callback for phone icon click                         |
| onClick.email    | function | null       | Callback for email icon click                         |
| className        | string   | ""         | Additional CSS classes                                |
| position         | string   | "right"    | Position of icons ("right" or "bottom")               |
| showTooltips     | boolean  | true       | Whether to show tooltips on hover                     |

## Deprecated Props

The following props are deprecated and will be removed in a future version:

| Deprecated Prop | Use Instead      |
| --------------- | ---------------- |
| onLocationClick | onClick.location |
| onPhoneClick    | onClick.phone    |
| onEmailClick    | onClick.email    |

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
  onClick: {
    location: (event) => {
      console.log('Location clicked');
      // Return false to prevent default navigation
      return false;
    },
    phone: (event) => {
      console.log('Phone clicked');
      // Analytics tracking could go here
    },
    email: (event) => {
      console.log('Email clicked');
      // You could open a custom modal instead
      return false;
    },
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

## Style Injection

This component uses automatic CSS injection, which means:

- **No CSS imports needed** - Styles are automatically injected when the component is used
- **SSR Compatible** - Works in Node.js environments without browser APIs
- **Performance Optimized** - Styles are cached and only injected once per component type
- **Tree Shakeable** - Only used component styles are included in your bundle

The styles are injected into a `<style>` tag with the ID `svarog-stickycontacticons` in the document head. If you need to override styles, ensure your CSS has sufficient specificity or use `!important`.

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11+ (with polyfills for modern features)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Migration from CSS Imports

If you were previously importing CSS files:

```javascript
// OLD - Remove this line
import './StickyContactIcons.css';

// NEW - Nothing needed, styles are automatically injected
import { StickyContactIcons } from '@svarog-ui/core';
```

## Performance Notes

- Styles are injected only once per component type, regardless of how many instances you create
- Style injection is deferred until the component is actually used
- Minimal performance impact - injection takes less than 1ms on modern browsers
- No additional HTTP requests for CSS files
