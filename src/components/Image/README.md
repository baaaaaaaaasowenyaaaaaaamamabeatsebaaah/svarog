# Image Component

The Image component provides a flexible, reusable image display with fallback handling and responsive options.

## Usage

```javascript
import { Image } from '@svarog-ui/core';

// Create a simple image
const myImage = Image({
  src: '/path/to/image.jpg',
});

// Add to DOM
document.body.appendChild(myImage.getElement());
```

## Props

| Prop        | Type     | Default    | Description                                            |
| ----------- | -------- | ---------- | ------------------------------------------------------ |
| src         | string   | (Required) | Path to the image                                      |
| alt         | string   | 'Image'    | Alt text for the image                                 |
| fallbackSrc | string   | ''         | Fallback image path if the primary image fails to load |
| className   | string   | ''         | Additional CSS classes                                 |
| onClick     | function | null       | Click event handler                                    |
| responsive  | boolean  | true       | Whether image should be responsive                     |

## Methods

### getElement()

Returns the image DOM element.

```javascript
const imageElement = myImage.getElement();
```

### update(props)

Updates the image properties.

```javascript
myImage.update({
  src: '/path/to/new-image.jpg',
  className: 'custom-class',
});
```

### setSrc(src)

Updates the image source.

```javascript
myImage.setSrc('/path/to/new-image.jpg');
```

### setAlt(alt)

Updates the image alt text.

```javascript
myImage.setAlt('New alt text');
```

### destroy()

Cleans up event listeners and resources. Call when removing the image.

```javascript
myImage.destroy();
```

## CSS Customization

Image styles can be customized using CSS variables:

```css
:root {
  --image-max-width: 100%;
  --image-max-height: auto;
}
```

## Examples

### Basic Image

```javascript
const image = Image({
  src: '/path/to/image.jpg',
  alt: 'Description of image',
});
```

### Responsive Image

```javascript
const responsiveImage = Image({
  src: '/path/to/image.jpg',
  responsive: true,
});
```

### Image with Fallback

```javascript
const imageWithFallback = Image({
  src: '/path/to/primary-image.jpg',
  fallbackSrc: '/path/to/fallback-image.jpg',
  alt: 'Image with fallback',
});
```

### Interactive Image

```javascript
const clickableImage = Image({
  src: '/path/to/image.jpg',
  onClick: () => {
    console.log('Image clicked!');
    // Perform action like showing a modal, etc.
  },
});
```

### Image with Custom Styling

```javascript
const styledImage = Image({
  src: '/path/to/image.jpg',
  className: 'rounded-corners',
});

// In CSS:
// .rounded-corners {
//   border-radius: 8px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// }
```

## Accessibility

The Image component follows best practices for accessibility:

- Requires alt text for screen readers (defaults to "Image" if not provided)
- Provides fallback content if the image fails to load
- Supports keyboard navigation when interactive (with onClick handler)
