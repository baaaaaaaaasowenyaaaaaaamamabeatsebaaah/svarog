# Header Component

The Header component provides a consistent page header with support for site name, logo, and navigation.

## Usage

```javascript
import { Header } from '@svarog-ui/core';

// Create a header with navigation
const header = Header({
  siteName: 'My Website',
  logo: '/path/to/logo.svg',
  navigation: {
    items: [
      { id: 'home', label: 'Home', url: '/' },
      { id: 'about', label: 'About', url: '/about' },
      { id: 'contact', label: 'Contact', url: '/contact' },
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
  href: '/page-url',      // Optional - Link destination (recommended)
  url: '/page-url',       // Optional - Alternative to href (for backward compatibility)
  items: [...]            // Optional - Array of child items for submenus
}
```

Note: The component supports both `href` and `url` properties for backward compatibility. The `href` property is recommended as it aligns with the Navigation component's API.

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
      { id: 'home', label: 'Home', url: '/' },
      { id: 'about', label: 'About', url: '/about' },
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

### Header with Custom Styling

```javascript
const customHeader = Header({
  siteName: 'Styled Website',
  logo: '/path/to/logo.svg',
  className: 'dark-theme-header',
  navigation: {
    items: [
      { id: 'home', label: 'Home', url: '/' },
      { id: 'about', label: 'About', url: '/about' },
    ],
  },
});

// In CSS:
// .dark-theme-header {
//   --header-bg: #222222;
//   --color-text: #ffffff;
//   --color-border: #444444;
// }
```

## Accessibility

The Header component follows best practices for accessibility:

- Uses semantic HTML5 elements
- Provides proper navigation structure
- Supports keyboard navigation through the Navigation component
- Maintains appropriate color contrast ratios using theme variables
