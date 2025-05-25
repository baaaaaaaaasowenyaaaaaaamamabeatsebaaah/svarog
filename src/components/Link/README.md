# Link Component

The Link component provides a customizable, accessible anchor element with various styles and behaviors. It automatically injects its own styles using the CSS injection system, eliminating the need for separate CSS imports.

## Features

✅ **Zero CSS Import Errors** - Styles are automatically injected when the component is used  
✅ **SSR Compatible** - Works safely in both browser and server environments  
✅ **Tree Shakeable** - Only loads styles when the component is actually used  
✅ **Performance Optimized** - Styles are cached and deduplicated automatically

## Usage

```javascript
import { Link } from '@svarog-ui/core';

// Create a basic link (styles inject automatically)
const myLink = Link({
  children: 'Click me',
  href: 'https://example.com',
});

// Add to DOM
document.body.appendChild(myLink.getElement());
```

## Props

| Prop      | Type                           | Default    | Description                                            |
| --------- | ------------------------------ | ---------- | ------------------------------------------------------ |
| children  | string\|HTMLElement\|Component | (Required) | Link text or element content                           |
| href      | string                         | (Required) | Link destination URL                                   |
| target    | string                         | '\_self'   | Link target ('\_self', '\_blank', '\_parent', '\_top') |
| underline | boolean                        | false      | Whether to underline the link                          |
| block     | boolean                        | false      | Whether link should display as a block element         |
| className | string                         | ''         | Additional CSS classes                                 |
| id        | string                         | null       | HTML ID attribute                                      |
| onClick   | function                       | null       | Click event handler                                    |

### Standardized Props

This component follows the company-wide Props Standardization Guide:

- Uses `href` for navigation links (standard)
- Uses `onClick` for click event handling (standard)
- Uses standard naming conventions for all props

## Methods

### getElement()

Returns the link DOM element.

```javascript
const linkElement = myLink.getElement();
```

### setHref(href)

Updates the link destination URL.

```javascript
myLink.setHref('https://new-destination.com');
```

### setTarget(target)

Updates the link target.

```javascript
myLink.setTarget('_blank');
```

### setUnderline(underline)

Toggles the link underline.

```javascript
myLink.setUnderline(true); // Add underline
myLink.setUnderline(false); // Remove underline
```

### update(props)

Updates multiple link properties at once.

```javascript
myLink.update({
  children: 'Updated text',
  className: 'custom-class',
  underline: true,
  block: true,
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the link.

```javascript
myLink.destroy();
```

## CSS Customization

Link styles can be customized using CSS variables:

```css
:root {
  --link-color: #3182ce;
  --link-hover-color: #2c5282;
  --link-margin-left: 0;
  --link-margin-right: 0.25rem;
  --link-transition: all 0.2s ease;
}
```

The component automatically injects these base styles:

```css
.link {
  align-items: baseline;
  margin-left: var(--link-margin-left);
  margin-right: var(--link-margin-right);
  color: var(--link-color);
  flex-shrink: 0;
  transition: var(--link-transition);
  cursor: pointer;
}

.link:hover {
  color: var(--link-hover-color);
}
```

## Examples

### Standard Link

```javascript
const standardLink = Link({
  children: 'Visit our website',
  href: 'https://example.com',
});
```

### External Link

```javascript
const externalLink = Link({
  children: 'External resource',
  href: 'https://external-site.com',
  target: '_blank',
  underline: true,
});
```

### Block Link

```javascript
const blockLink = Link({
  children: 'Full width link',
  href: '#section',
  block: true,
});
```

### Link with Icon

```javascript
// Create a container with icon and text
const container = document.createElement('span');
const icon = document.createElement('span');
icon.textContent = '🔗 ';
container.appendChild(icon);
container.appendChild(document.createTextNode('Link with icon'));

const iconLink = Link({
  children: container,
  href: '#',
});
```

### Link with Click Handler

```javascript
const clickableLink = Link({
  children: 'Click me',
  href: '#',
  onClick: (e) => {
    e.preventDefault();
    console.log('Link clicked!');
  },
});
```

## CSS Injection Architecture

The Link component uses the modern CSS injection pattern:

- **Automatic Style Loading**: Styles inject automatically when the component is first used
- **Deduplication**: Multiple Link components share the same injected styles
- **SSR Safe**: No styles are injected on the server side
- **Performance Optimized**: Styles are cached and only injected once per page
- **Zero Configuration**: No CSS imports needed in consuming applications

### File Structure

```
src/components/Link/
├── Link.js          # Component implementation with style injection
├── Link.styles.js   # Component-specific styles
├── Link.test.js     # Tests
├── Link.stories.js  # Storybook stories
├── README.md        # This documentation
└── index.js         # Component export
```

## Migration from CSS Imports

If you're migrating from the old CSS import system:

**Before (Old Way):**

```javascript
import './Link.css'; // ❌ Remove this line
import { Link } from '@svarog-ui/core';
```

**After (New Way):**

```javascript
import { Link } from '@svarog-ui/core'; // ✅ Styles inject automatically
```

## Browser Compatibility

The CSS injection system works in all modern browsers and gracefully degrades in older environments. The component uses:

- Native CSS custom properties (CSS variables)
- Standard DOM manipulation APIs
- Modern JavaScript features with appropriate fallbacks

## Performance Considerations

- **First Render**: Styles inject during first component creation (~1ms overhead)
- **Subsequent Renders**: No style injection overhead (cached)
- **Bundle Size**: No impact on CSS bundle size (styles are in JS)
- **Runtime**: Minimal memory footprint with automatic deduplication

## Accessibility

The Link component follows best practices for accessibility:

- Uses semantic HTML anchor elements
- Supports keyboard navigation
- Maintains proper color contrast ratios when using theme variables
- Works seamlessly with screen readers
- Automatically adds `rel="noopener noreferrer"` for external links (`target="_blank"`)

## Testing

The component includes comprehensive tests covering:

- Component creation and rendering
- Style injection functionality
- Prop validation and updates
- Event handling
- Accessibility compliance
- Performance characteristics

Run tests with:

```bash
npm test src/components/Link/
```
