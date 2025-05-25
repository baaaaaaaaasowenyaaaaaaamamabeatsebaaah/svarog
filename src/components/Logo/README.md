# Logo Component

The Logo component provides a customizable image display specifically designed for company or brand logos. It automatically injects its styles when used, requiring no CSS imports.

## Usage

```javascript
import { Logo } from '@svarog-ui/core';

// Create a simple logo
const myLogo = Logo({
  imageUrl: '/path/to/logo.svg',
});

// Add to DOM
document.body.appendChild(myLogo.getElement());
```

## Features

✅ **Zero Configuration** - Styles are automatically injected  
✅ **SSR Compatible** - Works in server-side rendering environments  
✅ **Tree Shakeable** - Only loads styles when the component is used  
✅ **Responsive Design** - Adapts to different screen sizes automatically  
✅ **Fallback Support** - Graceful handling of failed image loads  
✅ **Legacy Compatibility** - Backward compatibility with deprecated props

## Props

| Prop             | Type     | Default    | Description                                            |
| ---------------- | -------- | ---------- | ------------------------------------------------------ |
| imageUrl         | string   | (Required) | Path to logo image                                     |
| alt              | string   | 'Logo'     | Alt text for the logo image                            |
| fallbackImageUrl | string   | ''         | Fallback image path if the primary image fails to load |
| className        | string   | ''         | Additional CSS classes                                 |
| onClick          | function | null       | Click event handler                                    |
| responsive       | boolean  | true       | Whether logo should be responsive                      |
| src              | string   | -          | **Deprecated**: Use `imageUrl` instead                 |
| fallbackSrc      | string   | -          | **Deprecated**: Use `fallbackImageUrl` instead         |

## Methods

### getElement()

Returns the logo DOM element.

```javascript
const logoElement = myLogo.getElement();
```

### update(props)

Updates the logo properties.

```javascript
myLogo.update({
  imageUrl: '/path/to/new-logo.svg',
  className: 'custom-class',
});
```

### setImageUrl(imageUrl)

Updates the logo image source.

```javascript
myLogo.setImageUrl('/path/to/new-logo.svg');
```

### setSrc(src) [Deprecated]

**Deprecated**: Use `setImageUrl()` instead.

```javascript
// Prefer this:
myLogo.setImageUrl('/path/to/new-logo.svg');

// Instead of:
myLogo.setSrc('/path/to/new-logo.svg');
```

### destroy()

Cleans up event listeners and resources. Call when removing the logo.

```javascript
myLogo.destroy();
```

## CSS Customization

Logo styles are automatically injected and can be customized using CSS variables:

```css
:root {
  --logo-width: 120px;
  --logo-height: 40px;
  --logo-max-width: 200px;
  --logo-max-height: 80px;

  /* Responsive breakpoints */
  --logo-width-tablet: 100px;
  --logo-height-tablet: 34px;
  --logo-width-mobile: 80px;
  --logo-height-mobile: 28px;
}
```

## Responsive Behavior

The Logo component includes responsive sizing by default:

- When `responsive: true` (default), the logo will adapt to its container size
- It respects `--logo-width` and `--logo-height` as maximum dimensions
- Media queries automatically scale the logo on different screen sizes:
  - **Tablet (≤768px)**: Uses `--logo-width-tablet` and `--logo-height-tablet`
  - **Mobile (≤480px)**: Uses `--logo-width-mobile` and `--logo-height-mobile`

## Examples

### Basic Logo

```javascript
const logo = Logo({
  imageUrl: '/path/to/logo.svg',
  alt: 'Company Logo',
});
```

### Responsive Logo with Custom Size

```javascript
const responsiveLogo = Logo({
  imageUrl: '/path/to/logo.svg',
  responsive: true,
  className: 'custom-size-logo',
});

// Custom CSS variables can be applied via stylesheet or inline:
document.documentElement.style.setProperty('--logo-width', '200px');
document.documentElement.style.setProperty('--logo-height', '60px');
```

### Logo with Fallback

```javascript
const logoWithFallback = Logo({
  imageUrl: '/path/to/primary-logo.svg',
  fallbackImageUrl: '/path/to/fallback-logo.png',
  alt: 'Logo with fallback',
});
```

### Logo with Click Handler

```javascript
const clickableLogo = Logo({
  imageUrl: '/path/to/logo.svg',
  onClick: () => {
    console.log('Logo clicked!');
    // Navigate or perform other actions
  },
});
```

## Accessibility

The Logo component follows best practices for accessibility:

- Requires alt text for screen readers (defaults to "Logo" if not provided)
- Maintains proper color contrast ratios when using theme variables
- Supports keyboard navigation when interactive (with onClick handler)
- Uses semantic HTML structure

## Performance

The Logo component is optimized for performance:

- **Automatic Style Injection**: CSS is injected only once per page load
- **Style Deduplication**: Multiple Logo instances share the same injected styles
- **Minimal DOM Updates**: Uses efficient partial update strategies
- **Memory Management**: Proper cleanup of event listeners and resources

## Node.js Compatibility

The Logo component works seamlessly in Node.js environments:

```javascript
// This works without any CSS import errors
const { Logo } = require('@svarog-ui/core');

const logo = Logo({
  imageUrl: '/path/to/logo.svg',
});

// Safe to use in SSR applications
console.log('Logo created successfully');
```

## Migration from CSS Import Version

If you're upgrading from a version that required CSS imports:

### What Changed

- **No CSS imports needed** - Remove any `import './Logo.css'` statements
- **Automatic styling** - Styles are injected automatically when component is used
- **Same API** - All props and methods remain unchanged

### Before (Old Version)

```javascript
import { Logo } from '@svarog-ui/core';
import './Logo.css'; // ❌ No longer needed

const logo = Logo({ imageUrl: '/logo.svg' });
```

### After (New Version)

```javascript
import { Logo } from '@svarog-ui/core';
// CSS is automatically injected ✅

const logo = Logo({ imageUrl: '/logo.svg' });
```

### Legacy Prop Support

The component maintains backward compatibility:

```javascript
// Legacy props still work but show deprecation warnings
const logo = Logo({
  src: '/logo.svg', // Shows warning, use imageUrl instead
  fallbackSrc: '/fallback.svg', // Shows warning, use fallbackImageUrl instead
});

// Modern props (recommended)
const logo = Logo({
  imageUrl: '/logo.svg',
  fallbackImageUrl: '/fallback.svg',
});
```

## Browser Support

The Logo component supports all modern browsers:

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

For older browsers, ensure you have appropriate polyfills for ES6+ features.

## Troubleshooting

### Styles Not Appearing

- Check browser dev tools for injected `<style>` tags with `data-svarog="logo"`
- Ensure the component is actually rendered to the DOM
- Verify CSS variables are properly defined

### Legacy Warnings

- Update deprecated props: `src` → `imageUrl`, `fallbackSrc` → `fallbackImageUrl`
- Update deprecated methods: `setSrc()` → `setImageUrl()`

### Performance Issues

- Styles are automatically cached and deduped - each Logo type gets one `<style>` tag
- Use the `destroy()` method when removing components to prevent memory leaks

## Technical Architecture

The Logo component follows the CSS Injection Implementation pattern:

1. **Style Injection**: CSS is injected into the document head on first use
2. **Deduplication**: Styles are cached and only injected once per page
3. **SSR Safety**: Style injection is safely skipped on the server
4. **Performance**: Uses efficient DOM manipulation and event delegation
