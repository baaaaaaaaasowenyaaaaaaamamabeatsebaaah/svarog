# Image Component

The Image component provides a flexible, reusable image display with fallback handling and responsive options.

## Usage

```javascript
import { Image } from '@svarog-ui/core';

// Create a simple image
const myImage = Image({
  imageUrl: '/path/to/image.jpg',
});

// Add to DOM
document.body.appendChild(myImage.getElement());
```

## Props

| Prop             | Type     | Default    | Description                                            |
| ---------------- | -------- | ---------- | ------------------------------------------------------ |
| imageUrl         | string   | (Required) | Path to the image                                      |
| alt              | string   | 'Image'    | Alt text for the image                                 |
| fallbackImageUrl | string   | ''         | Fallback image path if the primary image fails to load |
| className        | string   | ''         | Additional CSS classes                                 |
| onClick          | function | null       | Click event handler                                    |
| responsive       | boolean  | true       | Whether image should be responsive                     |
| ~~src~~          | string   | -          | **DEPRECATED**: Use `imageUrl` instead                 |
| ~~fallbackSrc~~  | string   | -          | **DEPRECATED**: Use `fallbackImageUrl` instead         |

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
  imageUrl: '/path/to/new-image.jpg',
  className: 'custom-class',
});
```

### setImageUrl(imageUrl)

Updates the image source.

```javascript
myImage.setImageUrl('/path/to/new-image.jpg');
```

### ~~setSrc(src)~~ (DEPRECATED)

**DEPRECATED**: Use `setImageUrl()` instead.

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
  imageUrl: '/path/to/image.jpg',
  alt: 'Description of image',
});
```

### Responsive Image

```javascript
const responsiveImage = Image({
  imageUrl: '/path/to/image.jpg',
  responsive: true,
});
```

### Image with Fallback

```javascript
const imageWithFallback = Image({
  imageUrl: '/path/to/primary-image.jpg',
  fallbackImageUrl: '/path/to/fallback-image.jpg',
  alt: 'Image with fallback',
});
```

### Interactive Image

```javascript
const clickableImage = Image({
  imageUrl: '/path/to/image.jpg',
  onClick: () => {
    console.log('Image clicked!');
    // Perform action like showing a modal, etc.
  },
});
```

### Image with Custom Styling

```javascript
const styledImage = Image({
  imageUrl: '/path/to/image.jpg',
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

## Migration from v1.x

### Prop Name Changes

| Old Prop      | New Prop           | Notes                                                    |
| ------------- | ------------------ | -------------------------------------------------------- |
| `src`         | `imageUrl`         | Old prop still works but will show a deprecation warning |
| `fallbackSrc` | `fallbackImageUrl` | Old prop still works but will show a deprecation warning |

### Method Name Changes

| Old Method | New Method      | Notes                                                      |
| ---------- | --------------- | ---------------------------------------------------------- |
| `setSrc()` | `setImageUrl()` | Old method still works but will show a deprecation warning |
