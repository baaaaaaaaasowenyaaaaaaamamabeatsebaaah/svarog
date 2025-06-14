# ImageSlider Component

A smooth, responsive image slider component optimized for product galleries and image carousels. Features touch support, keyboard navigation, and multiple display options.

## Features

✅ **Touch/Swipe Support** - Natural gesture navigation on mobile devices
✅ **Keyboard Navigation** - Arrow keys for accessibility
✅ **Multiple Navigation Options** - Arrows, dots, and thumbnails
✅ **Responsive Design** - Adapts to all screen sizes
✅ **Smooth Transitions** - Hardware-accelerated animations
✅ **Lazy Loading** - Uses Image component with lazy loading
✅ **Loop Mode** - Optional infinite scrolling
✅ **Accessible** - ARIA labels and keyboard support
✅ **Lightweight** - No external dependencies

## Usage

```javascript
import { ImageSlider } from 'svarog-ui';

// Basic slider
const slider = ImageSlider({
  images: [
    { imageUrl: '/product1.jpg', alt: 'Product front view' },
    { imageUrl: '/product2.jpg', alt: 'Product side view' },
    { imageUrl: '/product3.jpg', alt: 'Product back view' },
  ],
});

document.body.appendChild(slider.getElement());
```

## Props

| Prop             | Type     | Default      | Description                                      |
| ---------------- | -------- | ------------ | ------------------------------------------------ |
| `images`         | Array    | **Required** | Array of image objects with `imageUrl` and `alt` |
| `currentIndex`   | number   | 0            | Initial slide index                              |
| `showArrows`     | boolean  | true         | Show navigation arrows                           |
| `showDots`       | boolean  | true         | Show dot indicators                              |
| `showThumbnails` | boolean  | false        | Show thumbnail navigation                        |
| `enableKeyboard` | boolean  | true         | Enable keyboard navigation                       |
| `enableTouch`    | boolean  | true         | Enable touch/swipe navigation                    |
| `loop`           | boolean  | true         | Enable infinite loop                             |
| `className`      | string   | ''           | Additional CSS classes                           |
| `onChange`       | Function | null         | Callback when slide changes                      |

## Image Object Structure

```javascript
{
  imageUrl: string,        // Required: Main image URL
  alt: string,            // Required: Alt text for accessibility
  thumbnailUrl?: string,  // Optional: Thumbnail URL (defaults to imageUrl)
  fallbackImageUrl?: string // Optional: Fallback if image fails
}
```

## Methods

| Method              | Description                |
| ------------------- | -------------------------- |
| `goToSlide(index)`  | Navigate to specific slide |
| `goToNext()`        | Go to next slide           |
| `goToPrevious()`    | Go to previous slide       |
| `getCurrentIndex()` | Get current slide index    |
| `getTotalSlides()`  | Get total number of slides |
| `update(props)`     | Update slider properties   |
| `destroy()`         | Clean up and remove slider |

## Examples

### Product Detail Gallery

```javascript
const productGallery = ImageSlider({
  images: [
    {
      imageUrl: '/product/front-large.jpg',
      thumbnailUrl: '/product/front-thumb.jpg',
      alt: 'Product front view',
    },
    {
      imageUrl: '/product/side-large.jpg',
      thumbnailUrl: '/product/side-thumb.jpg',
      alt: 'Product side view',
    },
    {
      imageUrl: '/product/back-large.jpg',
      thumbnailUrl: '/product/back-thumb.jpg',
      alt: 'Product back view',
    },
  ],
  showThumbnails: true,
  showDots: false,
});
```

### Simple Image Carousel

```javascript
const carousel = ImageSlider({
  images: heroImages,
  showArrows: true,
  showDots: true,
  showThumbnails: false,
  onChange: (current, previous) => {
    console.log(`Slide changed from ${previous} to ${current}`);
  },
});
```

### Gallery Mode

```javascript
const gallery = ImageSlider({
  images: galleryImages,
  showArrows: true,
  showDots: false,
  showThumbnails: false,
  className: 'fullscreen-gallery',
});
```

### Mobile-Optimized Slider

```javascript
const mobileSlider = ImageSlider({
  images: productImages,
  showArrows: false, // Use swipe gestures
  showDots: true,
  enableTouch: true,
  enableKeyboard: false,
});
```

## Styling

### CSS Variables

```css
:root {
  /* Container */
  --image-slider-max-width: 100%;
  --image-slider-height: 400px;
  --image-slider-bg: #f5f5f5;
  --image-slider-radius: 8px;
  --image-slider-transition: 0.3s ease;

  /* Arrows */
  --image-slider-arrow-bg: rgba(0, 0, 0, 0.5);
  --image-slider-arrow-color: white;
  --image-slider-arrow-size: 40px;
  --image-slider-arrow-radius: 50%;
  --image-slider-arrow-spacing: 16px;
  --image-slider-arrow-hover-bg: rgba(0, 0, 0, 0.7);

  /* Dots */
  --image-slider-dot-size: 8px;
  --image-slider-dot-gap: 8px;
  --image-slider-dot-padding: 16px 0;
  --image-slider-dot-bg: rgba(0, 0, 0, 0.3);
  --image-slider-dot-hover-bg: rgba(0, 0, 0, 0.5);
  --image-slider-dot-active-bg: var(--color-primary);
  --image-slider-dot-active-size: 24px;

  /* Thumbnails */
  --image-slider-thumbnail-size: 80px;
  --image-slider-thumbnail-gap: 8px;
  --image-slider-thumbnail-padding: 16px 0;
  --image-slider-thumbnail-radius: 4px;
  --image-slider-thumbnail-bg: #f5f5f5;
  --image-slider-thumbnail-hover-border: rgba(0, 0, 0, 0.3);
  --image-slider-thumbnail-active-border: var(--color-primary);

  /* Mobile */
  --image-slider-mobile-height: 300px;
  --image-slider-arrow-mobile-size: 36px;
  --image-slider-arrow-mobile-spacing: 8px;
  --image-slider-thumbnail-mobile-size: 60px;
}
```

### Custom Styling Example

```css
.product-gallery {
  --image-slider-height: 500px;
  --image-slider-bg: white;
  --image-slider-radius: 0;
  --image-slider-arrow-bg: white;
  --image-slider-arrow-color: #333;
  --image-slider-thumbnail-active-border: #ff6b6b;
}
```

## Keyboard Navigation

- **Arrow Left**: Previous slide
- **Arrow Right**: Next slide
- **Tab**: Focus navigation elements

## Touch Gestures

- **Swipe Left**: Next slide
- **Swipe Right**: Previous slide
- **Tap**: Click on thumbnails or dots

## Accessibility

The ImageSlider is built with accessibility in mind:

- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements for slide changes
- Focus management
- Reduced motion support

## Performance

- Uses CSS transforms for smooth animations
- Hardware acceleration for transitions
- Lazy loading of images via Image component
- Efficient event delegation
- Minimal reflows and repaints

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers with touch support

## Related Components

- [Image](../Image/README.md) - Used for rendering individual images
- [Gallery](../Gallery/README.md) - Full-featured image gallery
- [Carousel](../Carousel/README.md) - Generic carousel for any content
