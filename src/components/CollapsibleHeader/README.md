# CollapsibleHeader Component

The CollapsibleHeader component provides a responsive, collapsible header with navigation, contact information, and optional sticky contact icons that appear when scrolling.

## Usage

```javascript
import { CollapsibleHeaderContainer } from '@svarog-ui/core';

// Create a header container with all features
const header = CollapsibleHeaderContainer({
  siteName: 'Company Name',
  navigation: {
    items: [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'about', label: 'About', href: '#' },
      { id: 'contact', label: 'Contact', href: '#' },
    ],
  },
  contactInfo: {
    location: 'Main Street 123',
    phone: '123-456-7890',
    email: 'info@example.com',
  },
  logo: '/path/to/logo.svg',
  compactLogo: '/path/to/compact-logo.svg',
  collapseThreshold: 100,
  showStickyIcons: true,
});

// Add to DOM
document.body.appendChild(header.getElement());
```

## Components

### CollapsibleHeaderContainer

Manages the CollapsibleHeader state based on scroll position and window size.

#### Props

| Prop                | Type     | Default    | Description                                          |
| ------------------- | -------- | ---------- | ---------------------------------------------------- |
| siteName            | string   | ""         | Site name to display (if no logo provided)           |
| navigation          | object   | _required_ | Navigation configuration with items array            |
| contactInfo         | object   | _required_ | Contact information with location, phone, and email  |
| logo                | string   | ""         | URL to logo image                                    |
| compactLogo         | string   | logo value | URL to compact logo for collapsed state              |
| callButtonText      | string   | "Anrufen"  | Text for the call button                             |
| onCallClick         | function | null       | Callback for call button click                       |
| className           | string   | ""         | Additional CSS classes                               |
| collapseThreshold   | number   | 100        | Scroll position threshold to collapse header (in px) |
| showStickyIcons     | boolean  | true       | Whether to show sticky contact icons when collapsed  |
| stickyIconsPosition | string   | "right"    | Position of sticky icons ("right", "left")           |

### CollapsibleHeader

Presentational component that renders the header UI.

#### Props

| Prop           | Type     | Default    | Description                                     |
| -------------- | -------- | ---------- | ----------------------------------------------- |
| siteName       | string   | ""         | Site name to display                            |
| navigation     | object   | _required_ | Navigation configuration with items array       |
| contactInfo    | object   | _required_ | Contact information with location, phone, email |
| logo           | string   | ""         | URL to logo image                               |
| compactLogo    | string   | logo value | URL to compact logo for collapsed state         |
| callButtonText | string   | "Anrufen"  | Text for the call button                        |
| onCallClick    | function | null       | Callback for call button click                  |
| className      | string   | ""         | Additional CSS classes                          |
| isCollapsed    | boolean  | false      | Whether the header is in collapsed state        |
| isMobile       | boolean  | false      | Whether the header is in mobile view            |

## Methods

### getElement()

Returns the header DOM element.

```javascript
const headerElement = header.getElement();
```

### update(props)

Updates the header with new properties.

```javascript
header.update({
  isCollapsed: true,
  logo: '/path/to/new-logo.svg',
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the header.

```javascript
header.destroy();
```

### updateStickyIconsVisibility()

Manually updates the visibility of sticky icons.

```javascript
header.updateStickyIconsVisibility();
```

### getState()

Returns the current state of the component. Useful for testing or debugging.

```javascript
const currentState = header.getState();
console.log(currentState.isCollapsed); // Check if header is currently collapsed
```

## Accessibility Features

The CollapsibleHeader component implements these accessibility features:

- Proper semantic HTML structure with header element
- Screen reader support for navigation and contact info
- Keyboard navigation for all interactive elements
- Proper ARIA attributes for mobile menu toggle
- Phone and email links with correct protocols for assistive technology
- Semantic structure in navigation menus
- Appropriate focus management during state transitions
- Visible focus indicators for keyboard users
- ARIA attributes to indicate expanded/collapsed states
- Support for reduced motion preferences via CSS transitions that respect user settings
- Compatible with high contrast mode and custom color schemes

## Performance Optimizations

The component includes several performance optimizations:

- Debounced scroll and resize event handlers to prevent excessive DOM operations
- Partial updates that avoid full re-renders when changing simple properties
- Efficient DOM manipulation with minimal changes
- Lazy creation of sticky icons only when they're needed
- Smart state tracking to prevent unnecessary updates

## Responsive Behavior

The header automatically adapts to different screen sizes:

- On desktop: Full header with contact info that collapses on scroll
- On mobile (< 768px): Compact header with mobile menu toggle
- Sticky contact icons appear when header is collapsed or on mobile

## Examples

### Basic Header with Logo

```javascript
const basicHeader = CollapsibleHeaderContainer({
  siteName: 'Company Name',
  logo: '/path/to/logo.svg',
  navigation: {
    items: [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'about', label: 'About', href: '#' },
      { id: 'contact', label: 'Contact', href: '#' },
    ],
  },
  contactInfo: {
    location: 'Main Street 123',
    phone: '123-456-7890',
    email: 'info@example.com',
  },
});
```

### Header with Different Logos

```javascript
const headerWithDifferentLogos = CollapsibleHeaderContainer({
  siteName: 'Company Name',
  logo: '/path/to/full-logo.svg',
  compactLogo: '/path/to/icon-logo.svg',
  navigation: {
    items: [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'about', label: 'About', href: '#' },
    ],
  },
  contactInfo: {
    location: 'Main Street 123',
    phone: '123-456-7890',
    email: 'info@example.com',
  },
});
```

### Header without Sticky Icons

```javascript
const headerWithoutIcons = CollapsibleHeaderContainer({
  siteName: 'Company Name',
  navigation: {
    items: [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'about', label: 'About', href: '#' },
    ],
  },
  contactInfo: {
    location: 'Main Street 123',
    phone: '123-456-7890',
    email: 'info@example.com',
  },
  showStickyIcons: false,
});
```

### Header with Custom Call Button

```javascript
const headerWithCustomCall = CollapsibleHeaderContainer({
  siteName: 'Company Name',
  navigation: {
    items: [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'about', label: 'About', href: '#' },
    ],
  },
  contactInfo: {
    location: 'Main Street 123',
    phone: '123-456-7890',
    email: 'info@example.com',
  },
  callButtonText: 'Call Now',
  onCallClick: () => {
    console.log('Custom call action');
    // Open modal or perform other action
  },
});
```

## CSS Customization

CollapsibleHeader styles can be customized using CSS variables:

```css
:root {
  /* Header dimensions */
  --collapsible-header-height: 160px;
  --collapsible-header-collapsed-height: 120px;
  --collapsible-header-mobile-height: 80px;

  /* Animation */
  --collapsible-header-transition: transform 0.3s ease, height 0.3s ease;
  --collapsible-header-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --collapsible-header-logo-transition: transform 0.3s ease;

  /* Contact area */
  --collapsible-header-contact-bg: var(--color-bg);
  --collapsible-header-contact-transition: height 0.3s ease, opacity 0.3s ease;
}
```

## Accessibility Customization

You can further enhance accessibility by styling focus indicators with CSS variables:

```css
:root {
  /* Focus styles */
  --focus-outline-color: #4299e1;
  --focus-outline-width: 2px;
  --focus-outline-offset: 3px;
}

/* Apply to focused elements */
.collapsible-header a:focus-visible,
.collapsible-header button:focus-visible {
  outline: var(--focus-outline-width) solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
}
```

## Deprecated Props

The following props are deprecated and will be removed in a future version:

| Deprecated Prop     | Replacement Prop |
| ------------------- | ---------------- |
| `onCallButtonClick` | `onCallClick`    |

Please update your code to use the new standardized prop names.
