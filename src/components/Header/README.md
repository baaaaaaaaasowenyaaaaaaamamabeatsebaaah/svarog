# Header Component

The Header component provides a consistent page header with support for site name, logo, and navigation. Styles are automatically injected when the component is used.

## Features

✅ **Zero Configuration** - Styles inject automatically, no CSS imports needed  
✅ **SSR Safe** - Works in server-side rendering environments  
✅ **Performance Optimized** - Styles are cached and deduped  
✅ **Responsive Design** - Adapts to different screen sizes  
✅ **Theme Support** - Uses CSS variables for theming

## Usage

```javascript
import { Header } from '@svarog-ui/core';

// Create a header with navigation
const header = Header({
  siteName: 'My Website',
  logo: '/path/to/logo.svg',
  navigation: {
    items: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'about', label: 'About', href: '/about' },
      { id: 'contact', label: 'Contact', href: '/contact' },
    ],
  },
});

// Add to DOM
document.body.appendChild(header.getElement());
```

## Props

| Prop       | Type   | Default       | Description                         |
| ---------- | ------ | ------------- | ----------------------------------- |
| siteName   | string | ''            | Website name (used when no logo)    |
| logo       | string | ''            | Path to logo image                  |
| navigation | object | { items: [] } | Navigation configuration with items |
| className  | string | ''            | Additional CSS classes              |

### Navigation Items Structure

Each navigation item should follow the structure expected by the Navigation component:

```javascript
{
  id: 'unique-id',        // Required - Used for tracking active state
  label: 'Item Label',    // Required - Text to display
  href: '/page-url',      // Required - Link destination
  items: [...]            // Optional - Array of child items for submenus
}
```

## Methods

### getElement()

Returns the header DOM element.

```javascript
const headerElement = header.getElement();
```

### update(props)

Updates header properties.

```javascript
header.update({
  siteName: 'New Website Name',
  className: 'custom-header',
});
```

### setSiteName(siteName)

Updates the site name.

```javascript
header.setSiteName('Updated Website Name');
```

### setLogo(logo)

Updates the logo image source.

```javascript
header.setLogo('/path/to/new-logo.svg');
```

### destroy()

Cleans up event listeners and resources. Call when removing the header.

```javascript
header.destroy();
```

## CSS Customization

Header styles can be customized using CSS variables:

```css
:root {
  --header-bg: var(--color-bg);
  --color-border: #e1e1e1;
  --container-max-width: 1200px;
  --space-4: 1rem;
  --font-size-xl: 1.5rem;
  --font-weight-bold: 700;
  --color-text: #333333;
  --color-primary: #0066cc;
}
```

### Custom Styling

Apply custom styles by adding a className:

```javascript
const customHeader = Header({
  siteName: 'Styled Website',
  className: 'dark-theme-header',
});
```

Then define your custom CSS:

```css
.dark-theme-header {
  --header-bg: #222222;
  --color-text: #ffffff;
  --color-border: #444444;
}
```

## Responsive Behavior

The Header component includes responsive behavior:

- Automatically adapts to different screen sizes
- Uses the Navigation component's responsive features
- Maintains brand identity at different widths

## Examples

### Standard Header with Logo and Navigation

```javascript
const standardHeader = Header({
  siteName: 'My Website',
  logo: '/path/to/logo.svg',
  navigation: {
    items: [
      { id: 'home', label: 'Home', href: '/' },
      {
        id: 'products',
        label: 'Products',
        items: [
          { id: 'product1', label: 'Product 1', href: '/products/1' },
          { id: 'product2', label: 'Product 2', href: '/products/2' },
        ],
      },
      { id: 'about', label: 'About', href: '/about' },
      { id: 'contact', label: 'Contact', href: '/contact' },
    ],
  },
});
```

### Text-Only Header

```javascript
const textHeader = Header({
  siteName: 'Simple Website',
  navigation: {
    items: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'about', label: 'About', href: '/about' },
    ],
  },
});
```

### Logo-Only Header

```javascript
const logoHeader = Header({
  logo: '/path/to/logo.svg',
});
```

### Minimal Header

```javascript
const minimalHeader = Header({
  siteName: 'Minimal Site',
});
```

## Accessibility

The Header component follows best practices for accessibility:

- Uses semantic HTML5 elements
- Provides proper navigation structure
- Supports keyboard navigation through the Navigation component
- Maintains appropriate color contrast ratios using theme variables

## Migration from CSS Import

If you were previously importing CSS files, no changes are needed in your component usage. Simply:

1. Remove any `import './Header.css'` statements if present
2. Update to the latest version of the component
3. Styles will automatically inject when the component is used

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11+ (with polyfills)
- Server-side rendering environments
- Node.js environments (styles skip injection safely)

## Performance Notes

- Styles are injected only once per page load
- Multiple Header instances share the same style injection
- No performance impact from unused styles
- Automatic cleanup prevents memory leaks
