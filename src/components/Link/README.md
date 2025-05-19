# Link Component

The Link component provides a customizable, accessible anchor element with various styles and behaviors.

## Usage

```javascript
import { Link } from '@svarog-ui/core';

// Create a basic link
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

## Accessibility

The Link component follows best practices for accessibility:

- Uses semantic HTML anchor elements
- Supports keyboard navigation
- Maintains proper color contrast ratios when using theme variables
- Works seamlessly with screen readers
