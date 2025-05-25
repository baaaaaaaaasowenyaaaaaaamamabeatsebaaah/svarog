# Image Component

The Image component provides a flexible, reusable image display with fallback handling and responsive options. **Styles are automatically injected** - no CSS imports required!

## Features

✅ **Zero Configuration** - Styles inject automatically when component is used  
✅ **SSR Compatible** - Works in Node.js and browser environments  
✅ **Lazy Loading** - Native browser lazy loading support  
✅ **Fallback Handling** - Graceful degradation with fallback images  
✅ **Responsive Design** - Automatic responsive behavior  
✅ **Accessibility** - Proper alt text and ARIA support  
✅ **Error Handling** - Displays alt text when images fail to load

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
  --font-size-lg: 18px;
  --font-weight-bold: 700;
  --color-error: #e53e3e;
}
```

### Available CSS Classes

The component generates these CSS classes:

- `.image-container` - Main container element
- `.image-container--responsive` - Applied when responsive=true
- `.image-element` - The actual img element
- `.image-error` - Error message when image fails to load

### Custom Styling Example

```css
/* Custom rounded corners */
.my-custom-image .image-element {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Custom error styling */
.my-custom-image .image-error {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  font-style: italic;
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
  className: 'my-custom-image',
});
```

## Browser Compatibility

- **Modern Browsers**: Full support with native lazy loading
- **Legacy Browsers**: Graceful fallback without lazy loading
- **SSR/Node.js**: Compatible - styles inject only in browser

## Performance

- **Lazy Loading**: Uses native `loading="lazy"` attribute
- **Style Injection**: Styles cached and injected only once per page
- **Memory Efficient**: Proper cleanup of event listeners
- **Error Resilient**: Handles network failures gracefully

## Accessibility

The Image component follows best practices for accessibility:

- Requires alt text for screen readers (defaults to "Image" if not provided)
- Provides fallback content if the image fails to load
- Supports keyboard navigation when interactive (with onClick handler)
- Uses semantic HTML structure

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

### CSS Import Changes

**Before (v1.x):**

```javascript
import { Image } from '@svarog-ui/core';
import '@svarog-ui/core/dist/Image.css'; // ❌ No longer needed
```

**After (v2.x):**

```javascript
import { Image } from '@svarog-ui/core'; // ✅ Styles inject automatically
```

## File Structure

```
src/components/Image/
├── Image.js           # Component with CSS injection
├── Image.styles.js    # Component styles (auto-injected)
├── Image.test.js      # Tests
├── Image.stories.js   # Storybook stories
├── README.md          # This documentation
└── index.js           # Export file
```

## Implementation Details

This component uses the **CSS Injection Pattern** following our [Unified Vanilla JavaScript Development Principles](../../docs/principles.md):

1. **Algorithmic Elegance**: O(1) style injection with deduplication
2. **Zero Configuration**: No build setup or CSS imports required
3. **Performance Optimized**: Styles cached and injected once per component type
4. **SSR Safe**: Injection only occurs in browser environment
5. **Modern Architecture**: Factory function pattern with clean lifecycle management

The component automatically injects its styles when first used, ensuring they're available without any manual setup.
