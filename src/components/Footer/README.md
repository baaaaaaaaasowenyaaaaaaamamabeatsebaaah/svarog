# Footer Component

The Footer component provides a customizable, responsive footer section with links, social media links, and copyright information.

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

Footer styles can be customized using CSS variables:

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
