# Footer Component

The Footer component provides a customizable, responsive footer section with links, social media links, and copyright information. The component uses CSS injection for styling, ensuring it works seamlessly in all environments including Node.js.

## Features

✅ **Zero Configuration** - Styles inject automatically when component renders  
✅ **SSR Compatible** - Works in Node.js environments without CSS import errors  
✅ **Performance Optimized** - Styles cached and deduped automatically  
✅ **Theme Aware** - Integrates with Svarog UI theme system  
✅ **Responsive Design** - Adapts to mobile and desktop layouts  
✅ **Backward Compatible** - Supports legacy `url` prop with deprecation warnings

## Usage

```javascript
import { Footer } from '@svarog-ui/core';

// Create a basic footer
const myFooter = Footer({
  siteName: 'My Website',
  footer: {
    copyright: '© 2024 My Website. All rights reserved.',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    social: [
      { platform: 'Twitter', href: 'https://twitter.com' },
      { platform: 'GitHub', href: 'https://github.com' },
    ],
  },
});

// Add to DOM
document.body.appendChild(myFooter.getElement());
```

## Props

| Prop      | Type   | Default | Description                 |
| --------- | ------ | ------- | --------------------------- |
| siteName  | string | ''      | Site name for copyright     |
| footer    | object | {}      | Footer configuration object |
| className | string | ''      | Additional CSS classes      |

### Footer Configuration Object

| Property  | Type   | Default | Description                              |
| --------- | ------ | ------- | ---------------------------------------- |
| copyright | string | ''      | Copyright text (auto-generated if empty) |
| links     | array  | []      | Array of link objects                    |
| social    | array  | []      | Array of social media link objects       |

### Link Object Structure

```javascript
{
  label: 'Privacy Policy', // Link text
  href: '/privacy'         // Link URL
}
```

### Social Link Object Structure

```javascript
{
  platform: 'Twitter',           // Platform name
  href: 'https://twitter.com'    // Platform URL
}
```

## Methods

### getElement()

Returns the footer DOM element.

```javascript
const footerElement = myFooter.getElement();
```

### setCopyright(copyright)

Updates the footer copyright text.

```javascript
myFooter.setCopyright('© 2024 Updated Copyright');
```

### setLinks(links)

Updates the footer links.

```javascript
myFooter.setLinks([
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]);
```

### setSocial(social)

Updates the social media links.

```javascript
myFooter.setSocial([
  { platform: 'Facebook', href: 'https://facebook.com' },
  { platform: 'Instagram', href: 'https://instagram.com' },
]);
```

### update(props)

Updates multiple footer properties at once.

```javascript
myFooter.update({
  siteName: 'Updated Site Name',
  footer: {
    copyright: 'New copyright text',
    links: [{ label: 'New Link', href: '/new' }],
  },
  className: 'custom-footer',
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the footer.

```javascript
myFooter.destroy();
```

## CSS Customization

Footer styles are automatically injected and can be customized using CSS variables:

```css
:root {
  --footer-bg: #f5f5f5;
  --footer-text: #333333;
  --footer-link-hover: #0066cc;
  --color-border: #e5e5e5;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --container-max-width: 1200px;
  --font-size-sm: 0.875rem;
}
```

### CSS Class Structure

The Footer component uses the following CSS classes:

- `.footer` - Root footer element
- `.footer__container` - Content container with max-width
- `.footer__links` - Links section container
- `.footer__link` - Individual footer link
- `.footer__social` - Social links section container
- `.footer__social-link` - Individual social link
- `.footer__copyright` - Copyright section container
- `.footer__copyright-text` - Copyright text element

## Examples

### Standard Footer

```javascript
const standardFooter = Footer({
  siteName: 'My Website',
  footer: {
    copyright: '© 2024 My Website. All rights reserved.',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    social: [
      { platform: 'Twitter', href: 'https://twitter.com' },
      { platform: 'GitHub', href: 'https://github.com' },
    ],
  },
});
```

### Minimal Footer

```javascript
const minimalFooter = Footer({
  siteName: 'Minimal Site',
  footer: {
    copyright: '© 2024 Minimal Site',
  },
});
```

### Links Only Footer

```javascript
const linksFooter = Footer({
  siteName: 'Links Site',
  footer: {
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
});
```

### Social Links Only Footer

```javascript
const socialFooter = Footer({
  siteName: 'Social Site',
  footer: {
    social: [
      { platform: 'Facebook', href: 'https://facebook.com' },
      { platform: 'Instagram', href: 'https://instagram.com' },
      { platform: 'YouTube', href: 'https://youtube.com' },
    ],
  },
});
```

### Extensive Footer

```javascript
const extensiveFooter = Footer({
  siteName: 'Large Website',
  footer: {
    copyright: '© 2024 Large Website. All rights reserved.',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    social: [
      { platform: 'Facebook', href: 'https://facebook.com' },
      { platform: 'Twitter', href: 'https://twitter.com' },
      { platform: 'Instagram', href: 'https://instagram.com' },
      { platform: 'LinkedIn', href: 'https://linkedin.com' },
      { platform: 'YouTube', href: 'https://youtube.com' },
      { platform: 'GitHub', href: 'https://github.com' },
    ],
  },
});
```

## Accessibility

The Footer component follows best practices for accessibility:

- Uses semantic HTML elements
- Provides proper link attributes for social media links
- Maintains proper color contrast ratios when using theme variables
- Works seamlessly with screen readers

## Migration Notes

### v2.0 Changes

The Footer component has standardized its link properties:

- Changed `url` to `href` in both `links` and `social` arrays
- Legacy `url` property is still supported but deprecated and will show a warning
- Update your code to use `href` instead of `url` for future compatibility

### CSS Injection Migration

Starting with v2.1, the Footer component uses CSS injection instead of traditional CSS imports:

- **No CSS imports required** - Component styles inject automatically
- **Works in Node.js** - No more CSS import errors in server environments
- **Better performance** - Styles cached and deduped automatically
- **Zero configuration** - Just import and use the component

#### Before (v2.0 and earlier)

```javascript
// CSS import was required
import './Footer.css';
import createFooter from './Footer.js';
```

#### After (v2.1+)

```javascript
// No CSS import needed - styles inject automatically
import createFooter from './Footer.js';
```

## Browser Support

The Footer component supports all modern browsers:

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Legacy browser support can be achieved with appropriate polyfills for:

- CSS Custom Properties
- ES6 Modules

## Performance

The Footer component is optimized for performance:

- **Automatic style injection** - Styles load only when component is used
- **Style deduplication** - Multiple Footer instances share the same styles
- **Minimal DOM updates** - Only changed content is re-rendered
- **Memory management** - Proper cleanup on component destruction

The component uses efficient algorithms for:

- O(1) style caching and deduplication
- O(n) link rendering where n is the number of links
- Minimal DOM operations for updates
