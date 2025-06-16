# CollapsibleHeader Component

The CollapsibleHeader component provides a responsive, collapsible header with navigation, contact information, and **automatic logo switching** that appears when scrolling. **Now featuring CSS injection for zero-configuration usage across all environments.**

## ✨ Key Features

- **Zero CSS Import Errors** - Works in Node.js, bundlers, everywhere
- **Automatic Style Injection** - No separate CSS imports needed
- **Intelligent Logo Switching** - Automatically switches between full and compact logos
- **SSR Compatible** - Styles inject safely in browser only
- **Tree Shakeable** - Only loads styles for used components
- **Performance Optimized** - Styles are cached and deduped

## Usage

```javascript
import { CollapsibleHeaderContainer } from '@svarog-ui/core';

// Create a header container with logo switching - styles inject automatically!
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
  logo: '/path/to/full-logo.svg', // ✅ Full logo for expanded state
  compactLogo: '/path/to/compact-logo.svg', // ✅ Compact logo for collapsed/mobile
  collapseThreshold: 100,
  showStickyIcons: true,
});

// Add to DOM - styles and logo switching work automatically
document.body.appendChild(header.getElement());
```

## Logo Switching Behavior

The header **automatically switches logos** based on state:

- **Expanded Desktop**: Uses `logo` prop (full logo)
- **Collapsed Desktop**: Uses `compactLogo` prop
- **Mobile**: Uses `compactLogo` prop
- **No Logo Provided**: Falls back to `siteName` text

```javascript
// Logo switching example
const header = CollapsibleHeaderContainer({
  logo: '/assets/full-brand-logo.svg', // Shown when expanded
  compactLogo: '/assets/icon-only.svg', // Shown when collapsed/mobile
  // ... other props
});

// Logo switches automatically on scroll/resize - no manual intervention needed!
```

## Migration from CSS Imports

**Before (with CSS imports):**

```javascript
import './CollapsibleHeader.css'; // ❌ Causes Node.js errors
import CollapsibleHeader from './CollapsibleHeader.js';
```

**After (with CSS injection):**

```javascript
import CollapsibleHeader from './CollapsibleHeader.js'; // ✅ Works everywhere!
// Styles are automatically injected when component is used
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
| **logo**            | string   | ""         | **URL to full logo image (expanded state)**          |
| **compactLogo**     | string   | logo value | **URL to compact logo (collapsed/mobile state)**     |
| callButtonText      | string   | "Anrufen"  | Text for the call button                             |
| onCallClick         | function | null       | Callback for call button click                       |
| className           | string   | ""         | Additional CSS classes                               |
| collapseThreshold   | number   | 100        | Scroll position threshold to collapse header (in px) |
| showStickyIcons     | boolean  | true       | Whether to show sticky contact icons when collapsed  |
| stickyIconsPosition | string   | "right"    | Position of sticky icons ("right", "left")           |

### CollapsibleHeader

Presentational component that renders the header UI.

#### Props

| Prop            | Type     | Default    | Description                                     |
| --------------- | -------- | ---------- | ----------------------------------------------- |
| siteName        | string   | ""         | Site name to display                            |
| navigation      | object   | _required_ | Navigation configuration with items array       |
| contactInfo     | object   | _required_ | Contact information with location, phone, email |
| **logo**        | string   | ""         | **URL to full logo image**                      |
| **compactLogo** | string   | logo value | **URL to compact logo for collapsed state**     |
| callButtonText  | string   | "Anrufen"  | Text for the call button                        |
| onCallClick     | function | null       | Callback for call button click                  |
| className       | string   | ""         | Additional CSS classes                          |
| isCollapsed     | boolean  | false      | Whether the header is in collapsed state        |
| isMobile        | boolean  | false      | Whether the header is in mobile view            |

## Methods

### getElement()

Returns the header DOM element.

```javascript
const headerElement = header.getElement();
```

### update(props)

Updates the header with new properties. **Logo switching happens automatically.**

```javascript
header.update({
  isCollapsed: true, // ✅ Automatically switches to compactLogo
  logo: '/new-full-logo.svg', // ✅ Updates full logo
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
console.log(currentState.isMobile); // Check if in mobile mode
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

### Logo Sizing Customization

**Logo sizes are controlled via CSS variables** (automatically applied):

```css
/* Full logo sizing (expanded state) */
.collapsible-header .header-logo--full {
  --logo-width: 120px;
  --logo-height: auto;
}

/* Compact logo sizing (collapsed/mobile state) */
.collapsible-header .header-logo--compact {
  --logo-width: 100px;
  --logo-height: auto;
}

/* Mobile overrides */
@media (max-width: 768px) {
  .collapsible-header .header-logo--full,
  .collapsible-header .header-logo--compact {
    --logo-width: 100px; /* Both logos smaller on mobile */
  }
}

@media (max-width: 480px) {
  .collapsible-header .header-logo--full,
  .collapsible-header .header-logo--compact {
    --logo-width: 90px; /* Even smaller on tiny screens */
  }
}
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

- **Automatic Style Injection**: Styles are injected once and cached automatically
- **Zero Duplication**: Multiple instances share the same injected styles
- **SSR Safe**: Style injection is safely skipped on server-side
- **Smart Logo Switching**: Full re-render ensures correct logo is always displayed
- Debounced scroll and resize event handlers to prevent excessive DOM operations
- Efficient DOM manipulation with minimal changes
- Lazy creation of sticky icons only when they're needed
- Smart state tracking to prevent unnecessary updates

## Responsive Behavior

The header automatically adapts to different screen sizes:

- **Desktop Expanded**: Full header with full logo and contact info
- **Desktop Collapsed**: Compact header with compact logo, no contact info
- **Mobile**: Compact header with compact logo and mobile menu toggle
- **Logo Switching**: Automatic based on state (expanded/collapsed/mobile)
- Sticky contact icons appear when header is collapsed or on mobile

## Examples

### Basic Header with Logo Switching

```javascript
const basicHeader = CollapsibleHeaderContainer({
  siteName: 'Company Name',
  logo: '/assets/full-company-logo.svg', // ✅ Full logo
  compactLogo: '/assets/company-icon.svg', // ✅ Compact logo
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

// Logo switches automatically:
// - Shows full-company-logo.svg when expanded
// - Shows company-icon.svg when collapsed or mobile
```

### Header with Same Logo (No Switching)

```javascript
const singleLogoHeader = CollapsibleHeaderContainer({
  siteName: 'Company Name',
  logo: '/assets/logo.svg',
  // compactLogo not provided - uses same logo for all states
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

// Uses same logo for all states, only size changes via CSS
```

### Header without Sticky Icons

```javascript
const headerWithoutIcons = CollapsibleHeaderContainer({
  siteName: 'Company Name',
  logo: '/assets/full-logo.svg',
  compactLogo: '/assets/compact-logo.svg',
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
  showStickyIcons: false, // ✅ Disable sticky icons
});
```

### Header with Custom Call Button

```javascript
const headerWithCustomCall = CollapsibleHeaderContainer({
  siteName: 'Company Name',
  logo: '/assets/full-logo.svg',
  compactLogo: '/assets/icon-logo.svg',
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

## Debugging Logo Switching

If logo switching isn't working:

### 1. Verify Different Logo URLs

```javascript
const header = CollapsibleHeaderContainer({
  logo: '/path/to/FULL-logo.svg', // ✅ Must be different
  compactLogo: '/path/to/ICON-logo.svg', // ✅ Must be different
  // ...
});
```

### 2. Check Browser DevTools

- **Network tab**: Verify both logo files load successfully
- **Elements tab**: Look for `.header-logo--full` and `.header-logo--compact` classes
- **Console**: Check for any JavaScript errors

### 3. Test Manual State Changes

```javascript
// Force collapse to test logo switching
header.update({ isCollapsed: true });

// Check current state
console.log(header.getState());
```

### 4. Verify CSS Variables

```javascript
// Check computed logo width
const logoContainer = document.querySelector('.logo-container');
const width = getComputedStyle(logoContainer).getPropertyValue('--logo-width');
console.log('Logo width:', width);
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

## Architecture & Implementation

### CSS Injection System

The component uses a modern CSS injection system that:

1. **Automatically injects styles** when the component is first rendered
2. **Prevents duplicate styles** using intelligent caching
3. **Works across all environments** (Node.js, browsers, bundlers)
4. **Optimizes performance** by sharing styles between component instances

### Logo Switching Implementation

Logo switching uses the **KISS principle**:

1. **Simple State Logic**: `shouldUseCompactLogo = isMobile || isCollapsed`
2. **CSS Variable Sizing**: Logos sized via `--logo-width` and `--logo-height`
3. **Full Re-render**: Always rebuilds when logo state changes (reliable)
4. **Class-Based**: Uses `.header-logo--full` and `.header-logo--compact` classes

### File Structure

```
src/components/CollapsibleHeader/
├── CollapsibleHeader.js           # Main component with logo switching
├── CollapsibleHeader.styles.js    # Component-specific styles + logo sizing
├── CollapsibleHeaderContainer.js  # Container with scroll/resize logic
├── CollapsibleHeader.test.js      # Comprehensive tests
├── CollapsibleHeader.stories.js   # Storybook stories
├── README.md                      # This documentation
└── index.js                       # Exports
```

### Modern JavaScript Features Used

- **ES Module imports/exports** for better tree-shaking
- **Template literals** for clean CSS-in-JS
- **Destructuring assignments** for cleaner prop handling
- **Optional chaining** for safe property access
- **Spread operators** for efficient object merging
- **Arrow functions** for concise event handlers

## Deprecated Props

The following props are deprecated and will be removed in a future version:

| Deprecated Prop     | Replacement Prop | Migration              |
| ------------------- | ---------------- | ---------------------- |
| `onCallButtonClick` | `onCallClick`    | Simply rename the prop |

Please update your code to use the new standardized prop names. The component will show console warnings when deprecated props are detected.

## Testing

The component includes comprehensive tests that verify:

- Component rendering with various prop combinations
- **Logo switching behavior** in different states
- State management and updates
- Event handling and user interactions
- Accessibility compliance
- Performance characteristics
- Error handling and edge cases

## Browser Support

- **Modern browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **CSS features**: CSS Variables, Flexbox, CSS Grid, Media Queries
- **JavaScript features**: ES2020+ syntax, Module imports
- **Mobile support**: iOS Safari 14+, Android Chrome 88+

## Migration Guide

### From Traditional CSS Imports

1. **Remove CSS imports** from your component files
2. **Update component usage** - no changes needed, styles inject automatically
3. **Remove CSS build configuration** if no longer needed
4. **Test logo switching** to ensure both logos load correctly

### From Manual Logo Management

1. **Use `logo` and `compactLogo` props** instead of manual switching
2. **Remove custom logo switching logic** - now handled automatically
3. **Update CSS** to use new logo sizing variables if needed
4. **Test responsive behavior** across different screen sizes

## Contributing

When contributing to this component:

1. **Follow the CSS injection pattern** for any new styles
2. **Maintain logo switching simplicity** - avoid over-engineering
3. **Add comprehensive tests** for new features
4. **Update documentation** for any API changes
5. **Ensure accessibility compliance** for all modifications
6. **Test across environments** (Node.js, browsers, SSR)
7. **Use modern JavaScript features** appropriately
8. **Maintain performance optimizations** and add new ones where beneficial

## Support

For issues, questions, or contributions:

- Check the existing tests for usage examples
- Review the Storybook stories for interactive demos
- Consult the main Svarog UI documentation
- Open an issue with detailed reproduction steps

**Logo switching not working?** Check that your `logo` and `compactLogo` props point to **different image files** and verify both load successfully in the browser Network tab.
