# Logo Component

The Logo component provides a customizable image display specifically designed for company or brand logos.

## Usage

```javascript
import { Logo } from '@svarog-ui/core';

// Create a simple logo
const myLogo = Logo({
  src: '/path/to/logo.svg',
});

// Add to DOM
document.body.appendChild(myLogo.getElement());
```

## Props

| Prop        | Type     | Default    | Description                                            |
| ----------- | -------- | ---------- | ------------------------------------------------------ |
| src         | string   | (Required) | Path to logo image                                     |
| alt         | string   | 'Logo'     | Alt text for the logo image                            |
| fallbackSrc | string   | ''         | Fallback image path if the primary image fails to load |
| className   | string   | ''         | Additional CSS classes                                 |
| onClick     | function | null       | Click event handler                                    |
| responsive  | boolean  | true       | Whether logo should be responsive                      |

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
  src: '/path/to/new-logo.svg',
  className: 'custom-class',
});
```

### setSrc(src)

Updates the logo image source.

```javascript
myLogo.setSrc('/path/to/new-logo.svg');
```

### destroy()

Cleans up event listeners and resources. Call when removing the logo.

```javascript
myLogo.destroy();
```

## CSS Customization

Logo styles can be customized using CSS variables:

```css
:root {
  --logo-width: 120px;
  --logo-height: 40px;
  --logo-max-width: 200px;
  --logo-max-height: 80px;
}
```

## Responsive Behavior

The Logo component includes responsive sizing by default:

- When `responsive: true` (default), the logo will adapt to its container size
- It respects `--logo-width` and `--logo-height` as maximum dimensions
- Media queries in the CSS automatically scale the logo on different screen sizes

## Examples

### Basic Logo

```javascript
const logo = Logo({
  src: '/path/to/logo.svg',
  alt: 'Company Logo',
});
```

### Responsive Logo with Custom Size

```javascript
const responsiveLogo = Logo({
  src: '/path/to/logo.svg',
  responsive: true,
  className: 'custom-size-logo',
});

// In CSS:
// .custom-size-logo {
//   --logo-width: 200px;
//   --logo-height: 60px;
// }
```

### Logo with Fallback

```javascript
const logoWithFallback = Logo({
  src: '/path/to/primary-logo.svg',
  fallbackSrc: '/path/to/fallback-logo.png',
  alt: 'Logo with fallback',
});
```

### Logo with Click Handler

```javascript
const clickableLogo = Logo({
  src: '/path/to/logo.svg',
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
