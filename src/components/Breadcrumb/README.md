# Breadcrumb Component

The Breadcrumb component provides accessible navigation showing the user's current location within a hierarchical structure. It automatically injects its own styles using the CSS injection system, eliminating the need for separate CSS imports.

## Features

✅ **Zero CSS Import Errors** - Styles are automatically injected when the component is used
✅ **SSR Compatible** - Works safely in both browser and server environments
✅ **Tree Shakeable** - Only loads styles when the component is actually used
✅ **Performance Optimized** - Styles are cached and deduplicated automatically
✅ **Accessibility First** - Full ARIA support and semantic HTML
✅ **Smart Truncation** - Automatically handles long breadcrumb paths
✅ **Keyboard Navigation** - Full keyboard support with focus management
✅ **Responsive Design** - Adapts to different screen sizes

## Usage

```javascript
import { Breadcrumb } from '@svarog-ui/core';

// Create a basic breadcrumb (styles inject automatically)
const breadcrumb = Breadcrumb({
  items: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Laptops', href: '/products/laptops' },
    { label: 'MacBook Pro 16"' }, // Current page (no href)
  ],
});

// Add to DOM
document.body.appendChild(breadcrumb.getElement());
```

## Props

| Prop      | Type     | Default                 | Description                                   |
| --------- | -------- | ----------------------- | --------------------------------------------- |
| items     | Array    | (Required)              | Array of breadcrumb items                     |
| separator | string   | '/'                     | Character used to separate breadcrumb items   |
| maxItems  | number   | undefined               | Maximum items to show before truncation       |
| className | string   | ''                      | Additional CSS classes                        |
| ariaLabel | string   | 'Breadcrumb navigation' | ARIA label for the navigation element         |
| onClick   | function | null                    | Global click handler for all breadcrumb items |

### Item Object Properties

Each item in the `items` array should have the following structure:

| Property | Type     | Required | Description                         |
| -------- | -------- | -------- | ----------------------------------- |
| label    | string   | Yes      | Text to display for the breadcrumb  |
| href     | string   | No\*     | URL to navigate to when clicked     |
| onClick  | function | No       | Click handler specific to this item |

\*Note: `href` is required for all items except the last one (current page)

### Standardized Props

This component follows the company-wide Props Standardization Guide:

- Uses `items` for collection of breadcrumb data (standard)
- Uses `onClick` for click event handling (standard)
- Uses `className` for CSS classes (standard)
- Migrates legacy props (`links` → `items`, `divider` → `separator`)

## Methods

### getElement()

Returns the breadcrumb DOM element.

```javascript
const breadcrumbElement = breadcrumb.getElement();
```

### addItem(item)

Adds a new breadcrumb item to the end of the path.

```javascript
breadcrumb.addItem({
  label: 'New Page',
  href: '/new-page',
});
```

### popItem()

Removes the last breadcrumb item (except if it's the only item).

```javascript
breadcrumb.popItem(); // Removes the last item
```

### setItems(items)

Replaces the entire breadcrumb path.

```javascript
breadcrumb.setItems([
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings' },
]);
```

### setMaxItems(maxItems)

Sets the maximum number of items to display before truncation.

```javascript
breadcrumb.setMaxItems(4); // Show max 4 items with ... truncation
```

### setSeparator(separator)

Changes the separator character between items.

```javascript
breadcrumb.setSeparator('>'); // Use > instead of /
breadcrumb.setSeparator('•'); // Use bullet point
breadcrumb.setSeparator('→'); // Use arrow
```

### getPath()

Returns an array of all breadcrumb labels in order.

```javascript
const path = breadcrumb.getPath();
// Returns: ['Home', 'Products', 'Laptops', 'MacBook Pro 16"']
```

### navigateTo(index)

Programmatically navigates to a breadcrumb item by index.

```javascript
breadcrumb.navigateTo(1); // Navigate to second breadcrumb item
```

### update(props)

Updates multiple breadcrumb properties at once.

```javascript
breadcrumb.update({
  separator: '>',
  maxItems: 3,
  className: 'custom-breadcrumb',
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the breadcrumb.

```javascript
breadcrumb.destroy();
```

## CSS Customization

Breadcrumb styles can be customized using CSS variables:

```css
:root {
  /* General styling */
  --breadcrumb-font-size: 0.875rem;
  --breadcrumb-font-family: inherit;
  --breadcrumb-margin: 0;
  --breadcrumb-padding: 0;
  --breadcrumb-gap: 0;
  --breadcrumb-line-height: 1.5;

  /* Colors */
  --breadcrumb-color: #6b7280;
  --breadcrumb-active-color: #374151;
  --breadcrumb-link-color: #3b82f6;
  --breadcrumb-link-hover-color: #1d4ed8;
  --breadcrumb-separator-color: #9ca3af;
  --breadcrumb-truncation-color: #9ca3af;

  /* Link styling */
  --breadcrumb-link-decoration: none;
  --breadcrumb-link-hover-decoration: underline;
  --breadcrumb-link-hover-bg: rgba(59, 130, 246, 0.1);
  --breadcrumb-link-padding: 0.125rem 0.25rem;
  --breadcrumb-link-margin: -0.125rem -0.25rem;
  --breadcrumb-link-radius: 0.25rem;

  /* Focus styling */
  --breadcrumb-link-focus-outline: 2px solid #3b82f6;
  --breadcrumb-link-focus-offset: 2px;

  /* Separator styling */
  --breadcrumb-separator-margin: 0 0.5rem;
  --breadcrumb-separator-size: 0.875rem;

  /* Active item styling */
  --breadcrumb-active-font-weight: 500;

  /* Truncation styling */
  --breadcrumb-truncation-font-weight: bold;
  --breadcrumb-truncation-padding: 0.125rem 0.25rem;
  --breadcrumb-truncation-radius: 0.25rem;
  --breadcrumb-truncation-hover-bg: rgba(156, 163, 175, 0.1);

  /* Responsive design */
  --breadcrumb-mobile-font-size: 0.8125rem;
  --breadcrumb-mobile-separator-margin: 0 0.375rem;
  --breadcrumb-mobile-padding: 0.25rem;
  --breadcrumb-mobile-margin: -0.25rem;

  /* Animation */
  --breadcrumb-transition: color 0.15s ease-in-out;
}
```

## Examples

### Basic Breadcrumb

```javascript
const basicBreadcrumb = Breadcrumb({
  items: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Team' },
  ],
});
```

### With Custom Separator

```javascript
const customSeparator = Breadcrumb({
  items: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Users', href: '/dashboard/users' },
    { label: 'Profile' },
  ],
  separator: '>',
});
```

### With Click Handlers

```javascript
const clickableBreadcrumb = Breadcrumb({
  items: [
    {
      label: 'Home',
      href: '/',
      onClick: (e, item, index) => {
        e.preventDefault();
        console.log(`Clicked ${item.label} at index ${index}`);
      },
    },
    { label: 'Current Page' },
  ],
  onClick: (e, item, index) => {
    // Global click handler for all items
    console.log(`Global: Clicked ${item.label}`);
  },
});
```

### Truncated Long Path

```javascript
const longBreadcrumb = Breadcrumb({
  items: [
    { label: 'Home', href: '/' },
    { label: 'Level 1', href: '/level1' },
    { label: 'Level 2', href: '/level1/level2' },
    { label: 'Level 3', href: '/level1/level2/level3' },
    { label: 'Level 4', href: '/level1/level2/level3/level4' },
    { label: 'Current Page' },
  ],
  maxItems: 4, // Will show: Home > ... > Level 4 > Current Page
});
```

### Dynamic Breadcrumb

```javascript
// Start with basic breadcrumb
const dynamicBreadcrumb = Breadcrumb({
  items: [{ label: 'Home', href: '/' }],
});

// Add items dynamically
function navigateToCategory(category) {
  dynamicBreadcrumb.addItem({
    label: category,
    href: `/category/${category.toLowerCase()}`,
  });
}

function navigateToProduct(product) {
  dynamicBreadcrumb.addItem({
    label: product,
  });
}

// Usage
navigateToCategory('Electronics');
navigateToProduct('iPhone 15 Pro');
// Result: Home > Electronics > iPhone 15 Pro
```

## CSS Injection Architecture

The Breadcrumb component uses the modern CSS injection pattern:

- **Automatic Style Loading**: Styles inject automatically when the component is first used
- **Deduplication**: Multiple Breadcrumb components share the same injected styles
- **SSR Safe**: No styles are injected on the server side
- **Performance Optimized**: Styles are cached and only injected once per page
- **Zero Configuration**: No CSS imports needed in consuming applications

### File Structure

```
src/components/Breadcrumb/
├── Breadcrumb.js          # Component implementation with style injection
├── Breadcrumb.styles.js   # Component-specific styles
├── Breadcrumb.test.js     # Comprehensive tests
├── Breadcrumb.stories.js  # Storybook stories
├── README.md              # This documentation
└── index.js               # Component export with theme awareness
```

## Accessibility

The Breadcrumb component follows WCAG 2.1 AA guidelines:

### Semantic HTML

- Uses `<nav>` element with proper ARIA attributes
- Uses `<ol>` (ordered list) for breadcrumb structure
- Each breadcrumb item is a `<li>` element

### ARIA Support

- `role="navigation"` on the container
- `aria-label` for navigation context
- `aria-current="page"` on the current page item
- `aria-hidden="true"` on separators (decorative)
- `aria-label` on links describing their purpose

### Keyboard Navigation

- Full keyboard accessibility
- Focus indicators on interactive elements
- Logical tab order through breadcrumb items

### Screen Reader Support

- Proper semantic structure
- Descriptive labels for navigation context
- Current page indication

### High Contrast Support

- Respects `prefers-contrast: high` media query
- Ensures sufficient color contrast ratios
- Underlines links in high contrast mode

### Reduced Motion Support

- Respects `prefers-reduced-motion: reduce` media query
- Disables transitions when motion is reduced

## Performance Considerations

- **First Render**: Styles inject during first component creation (~1ms overhead)
- **Subsequent Renders**: No style injection overhead (cached)
- **Bundle Size**: No impact on CSS bundle size (styles are in JS)
- **Runtime**: Minimal memory footprint with automatic deduplication
- **DOM Updates**: Efficient partial updates for non-structural changes
- **Event Delegation**: Optimized event handling for multiple items

## Testing

The component includes comprehensive tests covering:

- Component creation and rendering
- Style injection functionality
- Prop validation and edge cases
- Click event handling
- Accessibility compliance
- Dynamic item management
- Truncation behavior
- Keyboard navigation
- Performance characteristics

Run tests with:

```bash
npm test src/components/Breadcrumb/
```

## Migration from CSS Imports

If you're migrating from the old CSS import system:

**Before (Old Way):**

```javascript
import './Breadcrumb.css'; // ❌ Remove this line
import { Breadcrumb } from '@svarog-ui/core';
```

**After (New Way):**

```javascript
import { Breadcrumb } from '@svarog-ui/core'; // ✅ Styles inject automatically
```

## Legacy Prop Migration

The component automatically handles legacy props with deprecation warnings:

```javascript
// Legacy props (still work but show warnings)
const breadcrumb = Breadcrumb({
  links: items, // ⚠️  Use 'items' instead
  divider: '>', // ⚠️  Use 'separator' instead
});

// Modern props (recommended)
const breadcrumb = Breadcrumb({
  items: items, // ✅ Standard prop name
  separator: '>', // ✅ Standard prop name
});
```

## Browser Compatibility

The CSS injection system works in all modern browsers:

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **IE11**: Graceful degradation (limited CSS variable support)

The component uses:

- Native CSS custom properties (CSS variables)
- Standard DOM manipulation APIs
- Modern JavaScript features with appropriate fallbacks
- Progressive enhancement for advanced features

## RTL Support

The breadcrumb component includes RTL (right-to-left) language support:

```css
/* Automatic separator flip for RTL languages */
[dir='rtl'] .breadcrumb-separator {
  transform: scaleX(-1);
}
```

## Best Practices

### SEO Considerations

- Include structured data for breadcrumbs
- Use descriptive, keyword-rich labels
- Ensure proper URL hierarchy matches breadcrumb structure

### UX Guidelines

- Keep breadcrumb labels concise but descriptive
- Use consistent separator characters across your application
- Consider truncation for deep navigation hierarchies
- Ensure breadcrumbs reflect the actual site structure

### Performance Tips

- Use `maxItems` for very deep navigation structures
- Implement lazy loading for dynamic breadcrumb data
- Cache breadcrumb structures when possible

### Integration Examples

#### With React Router

```javascript
import { useLocation } from 'react-router-dom';

function BreadcrumbContainer() {
  const location = useLocation();

  const generateBreadcrumbs = (pathname) => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      href: '/' + paths.slice(0, index + 1).join('/'),
    }));
  };

  const breadcrumb = Breadcrumb({
    items: [
      { label: 'Home', href: '/' },
      ...generateBreadcrumbs(location.pathname),
    ],
  });

  return breadcrumb.getElement();
}
```

#### With Vue Router

```javascript
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();

    const breadcrumbItems = computed(() => {
      return route.matched.map((match) => ({
        label: match.meta.title || match.name,
        href: match.path,
      }));
    });

    const breadcrumb = Breadcrumb({
      items: breadcrumbItems.value,
    });

    return { breadcrumb };
  },
};
```

---

_This component is part of the Svarog UI library, designed to provide enterprise-quality components to small and medium businesses with zero complexity overhead._
