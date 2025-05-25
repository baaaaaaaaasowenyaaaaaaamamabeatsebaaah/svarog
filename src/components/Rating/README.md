# Rating Component

The Rating component displays user ratings from various sources (Google, Facebook, Trustpilot) with star visualization and optional reviewer profile images. **This component uses CSS injection for styling - no separate CSS imports are required.**

## Key Features

✅ **Zero Configuration** - Just import and use, styles are injected automatically  
✅ **SSR Compatible** - Styles inject safely in browser only  
✅ **Tree Shakeable** - Only loads styles when component is used  
✅ **Performance Optimized** - Styles are cached and deduped automatically

## Usage

```javascript
import { Rating } from '@svarog-ui/core';

// Create a basic rating
const googleRating = Rating({
  source: 'google',
  score: 4.7,
  totalRatings: 1234,
});

// Add to DOM
document.body.appendChild(googleRating.getElement());
```

## Props

| Prop                       | Type     | Default    | Description                                          |
| -------------------------- | -------- | ---------- | ---------------------------------------------------- |
| source                     | string   | (Required) | Rating source ('google', 'facebook', 'trustpilot')   |
| score                      | number   | (Required) | Rating score (0-5)                                   |
| totalRatings               | number   | (Required) | Total number of ratings                              |
| reviewerImages             | string[] | []         | Array of reviewer profile image URLs                 |
| options                    | object   | {}         | Additional configuration options                     |
| options.showReviewerImages | boolean  | true       | Whether to show reviewer images                      |
| options.maxReviewerImages  | number   | 5          | Maximum number of reviewer images to display         |
| options.fallbackImageUrl   | string   | ''         | Fallback image to use if profile images fail to load |

## Methods

### getElement()

Returns the rating DOM element.

```javascript
const ratingElement = myRating.getElement();
```

### update(props)

Updates the rating with new properties.

```javascript
myRating.update({
  score: 4.9,
  totalRatings: 1500,
});
```

### setScore(score)

Updates only the rating score.

```javascript
myRating.setScore(4.9);
```

### setTotalRatings(totalRatings)

Updates only the total ratings count.

```javascript
myRating.setTotalRatings(5000);
```

### destroy()

Cleans up resources and event listeners. Call when removing the rating.

```javascript
myRating.destroy();
```

## CSS Customization

Rating styles can be customized using CSS variables:

```css
:root {
  --color-yellow: #ffc107; /* Star color */
  --color-gray-300: #e0e0e0; /* Empty star color */
  --color-text: #333; /* Rating text color */
  --color-text-light: #6c757d; /* Secondary text color */
  --font-size-3xl: 2.5rem; /* Score size */
  --font-size-xl: 1.5rem; /* Star size */
  --font-size-sm: 0.875rem; /* Total ratings size */
  --space-1: 4px; /* Small spacing */
  --space-2: 8px; /* Medium spacing */
  --space-3: 12px; /* Default spacing */
  --space-4: 16px; /* Large spacing */
}
```

## Architecture

### CSS Injection System

The component uses a modern CSS injection approach:

- **No CSS imports required** - Styles are automatically injected when the component is used
- **SSR safe** - Style injection only happens in the browser
- **Performance optimized** - Styles are cached and deduplicated
- **Tree shakeable** - Only loads styles for components actually used

### File Structure

```
src/components/Rating/
├── Rating.js           # Main component with CSS injection
├── Rating.styles.js    # Component-specific styles
├── Rating.test.js      # Test suite
├── Rating.stories.js   # Storybook stories
├── README.md          # This documentation
└── index.js           # Export with theme awareness
```

### Style Injection Implementation

```javascript
// Rating.js
import { createStyleInjector } from '../../utils/styleInjection.js';
import { ratingStyles } from './Rating.styles.js';

// Create style injector for Rating component
const injectRatingStyles = createStyleInjector('Rating');

const renderRating = (state) => {
  // Inject styles on first render (automatically cached)
  injectRatingStyles(ratingStyles);

  // ... component logic unchanged ...
};
```

## Examples

### Google Rating

```javascript
const googleRating = Rating({
  source: 'google',
  score: 4.7,
  totalRatings: 1234,
  reviewerImages: [
    '/images/reviewer1.jpg',
    '/images/reviewer2.jpg',
    '/images/reviewer3.jpg',
  ],
});
```

### Facebook Rating

```javascript
const facebookRating = Rating({
  source: 'facebook',
  score: 4.5,
  totalRatings: 5678,
});
```

### Trustpilot Rating with Fallback Images

```javascript
const trustpilotRating = Rating({
  source: 'trustpilot',
  score: 4.9,
  totalRatings: 9012,
  reviewerImages: [
    '/images/reviewer1.jpg',
    '/images/reviewer2.jpg',
    '/images/reviewer3.jpg',
  ],
  options: {
    fallbackImageUrl: '/images/default-profile.jpg',
  },
});
```

### Rating with Custom Options

```javascript
const customRating = Rating({
  source: 'google',
  score: 4.2,
  totalRatings: 3456,
  options: {
    showReviewerImages: false,
    maxReviewerImages: 3,
  },
});
```

### Updating Rating Dynamically

```javascript
const rating = Rating({
  source: 'google',
  score: 4.0,
  totalRatings: 2500,
});

// Later in the code, update the rating
rating.setScore(4.5);
rating.setTotalRatings(3000);

// Or update multiple properties at once
rating.update({
  score: 4.8,
  source: 'trustpilot',
  reviewerImages: ['/images/new-reviewer.jpg'],
});
```

## Component Composition

The Rating component uses the Image component internally to handle reviewer profile images, providing:

- Error handling for broken image URLs
- Fallback image support
- Consistent image behavior across the application

## Legacy Props Migration

The component automatically handles legacy prop migration:

```javascript
// Deprecated (still works with warning)
const rating = Rating({
  source: 'google',
  score: 4.5,
  totalRatings: 1000,
  options: {
    fallbackImageSrc: '/fallback.jpg', // Deprecated
  },
});

// Recommended
const rating = Rating({
  source: 'google',
  score: 4.5,
  totalRatings: 1000,
  options: {
    fallbackImageUrl: '/fallback.jpg', // Current standard
  },
});
```

## Accessibility

The Rating component follows best practices for accessibility:

- Uses semantic HTML elements
- Provides appropriate text contrast
- Includes alt text for reviewer images
- Uses proper ARIA attributes for screen readers
- Scales properly at different viewport sizes
- Responds to theme changes

## Browser Support

The component is compatible with all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Performance Considerations

- Efficiently creates and updates DOM elements
- Minimizes unnecessary re-renders
- Only updates changed portions of the UI
- Properly cleans up resources when destroyed
- Uses component composition for better code organization
- **Automatic style caching** - Styles are injected once and reused
- **Tree-shakeable** - Only loads when component is actually used

## Development Notes

### Following Modern JavaScript Principles

This implementation follows the Unified Vanilla JavaScript Development Principles:

1. **Algorithmic Elegance** - Efficient DOM manipulation and state management
2. **Code Organization** - Clear separation of concerns with CSS injection
3. **Performance** - Styles cached and injected only once per component type
4. **Modern JavaScript** - Uses ES modules, template literals, modern APIs
5. **Clean Architecture** - Maintains component API consistency
6. **Developer Experience** - Zero configuration, works everywhere

### Testing with CSS Injection

The component's test suite validates both functionality and style injection:

```javascript
// Tests verify style injection works correctly
it('should inject styles on first render', () => {
  const rating = Rating({ source: 'google', score: 4.5, totalRatings: 100 });
  rating.getElement();

  // Check if styles were injected
  const injectedStyle = document.querySelector('[data-svarog="rating"]');
  expect(injectedStyle).toBeTruthy();
});
```

## Migration from CSS Imports

If migrating from a version that used CSS imports:

### Before (CSS Import)

```javascript
import './Rating.css'; // Remove this line
import createRating from './Rating.js';
```

### After (CSS Injection)

```javascript
// No CSS import needed!
import createRating from './Rating.js';
```

The component now handles all styling automatically through CSS injection.
