# Rating Component

The Rating component displays user ratings from various sources (Google, Facebook, Trustpilot) with star visualization and optional reviewer profile images.

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
| options.fallbackImageSrc   | string   | ''         | Fallback image to use if profile images fail to load |

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
    fallbackImageSrc: '/images/default-profile.jpg',
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
