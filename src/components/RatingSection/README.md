# RatingSection Component

The RatingSection component displays business ratings from Google Places and Facebook Graph APIs in a structured, three-row layout with an optional Wertgarantie certificate display. **Styles are automatically injected** - no CSS imports required!

## Features

✅ **Zero Configuration** - Styles inject automatically when component is used
✅ **Real API Integration** - Fetches live data from Google Places and Facebook Graph APIs
✅ **Smart Caching** - 5-minute cache to optimize API usage and performance
✅ **Error Handling** - Graceful fallback for API failures with user-friendly error messages
✅ **Loading States** - Animated loading indicators while fetching data
✅ **SSR Compatible** - Works in Node.js environments without errors
✅ **Responsive Design** - Mobile-first responsive layout
✅ **Theme Support** - Integrates with Svarog UI theme system

## Structure

The RatingSection component creates a three-row layout:

1. **Row 1**: Google Places rating (if `googlePlaceId` provided)
2. **Row 2**: Facebook business rating (if `facebookPageId` provided)
3. **Row 3**: Wertgarantie certificate image (if `showWertgarantie` is true)

## Usage

```javascript
import { RatingSection } from '@svarog-ui/core';

// Complete rating section with both platforms
const ratingSection = RatingSection({
  title: 'Kundenbewertungen',
  googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
  facebookPageId: '1234567890',
  showWertgarantie: true,
  wertgarantieImageUrl: '/assets/wertgarantie-logo.png',
});

// Add to DOM
document.body.appendChild(ratingSection.getElement());
```

## Props

| Prop                 | Type     | Default                                | Description                                    |
| -------------------- | -------- | -------------------------------------- | ---------------------------------------------- |
| googlePlaceId        | string   | null                                   | Google Place ID for fetching business ratings  |
| facebookPageId       | string   | null                                   | Facebook Page ID for fetching page ratings     |
| title                | string   | 'Bewertungen'                          | Section title                                  |
| showWertgarantie     | boolean  | true                                   | Whether to display Wertgarantie logo           |
| wertgarantieImageUrl | string   | '/assets/images/wertgarantie-logo.png' | URL for Wertgarantie certificate image         |
| onLoadComplete       | function | null                                   | Callback when platform data loads successfully |
| onError              | function | null                                   | Callback when API errors occur                 |

**Note**: Either `googlePlaceId` or `facebookPageId` (or both) must be provided.

## API Setup

### Google Places API

1. **Get API Key**:

   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Places API"
   - Create API key with domain restrictions

2. **Configure API Key**:

   ```javascript
   // src/config/api.config.local.js (development)
   export const apiConfig = {
     googleMaps: {
       apiKey: 'YOUR_GOOGLE_PLACES_API_KEY',
     },
   };
   ```

3. **Required API Permissions**:
   - Places API (for business details)
   - Places API (for photos - optional)

### Facebook Graph API

1. **Create Facebook App**:

   - Visit [Facebook Developers](https://developers.facebook.com/)
   - Create new app
   - Add "Pages" permission

2. **Get Access Token**:

   - Generate long-lived page access token
   - Grant `pages_read_engagement` permission

3. **Configure Access Token**:
   ```javascript
   // src/config/api.config.local.js (development)
   export const apiConfig = {
     facebook: {
       accessToken: 'YOUR_FACEBOOK_ACCESS_TOKEN',
       appId: 'YOUR_FACEBOOK_APP_ID',
     },
   };
   ```

## Methods

### getElement()

Returns the rating section DOM element.

```javascript
const element = ratingSection.getElement();
```

### update(props)

Updates multiple component properties.

```javascript
ratingSection.update({
  title: 'Neue Bewertungen',
  showWertgarantie: false,
});
```

### setGooglePlaceId(placeId)

Updates Google Place ID and refreshes data.

```javascript
ratingSection.setGooglePlaceId('ChIJNewPlaceId123');
```

### setFacebookPageId(pageId)

Updates Facebook Page ID and refreshes data.

```javascript
ratingSection.setFacebookPageId('987654321');
```

### setShowWertgarantie(show)

Toggles Wertgarantie logo visibility.

```javascript
ratingSection.setShowWertgarantie(false); // Hide logo
ratingSection.setShowWertgarantie(true); // Show logo
```

### refresh()

Clears cache and reloads all API data.

```javascript
await ratingSection.refresh();
```

### getCacheStatus()

Returns information about cached API responses.

```javascript
const cacheStatus = ratingSection.getCacheStatus();
console.log(cacheStatus);
// {
//   google: { cached: true, age: 120000 },
//   facebook: { cached: false, age: null }
// }
```

### destroy()

Cleans up resources and event listeners.

```javascript
ratingSection.destroy();
```

## Examples

### Basic Google Rating Only

```javascript
const googleRating = RatingSection({
  title: 'Google Bewertungen',
  googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
});
```

### Facebook Rating Only

```javascript
const facebookRating = RatingSection({
  title: 'Facebook Bewertungen',
  facebookPageId: '1234567890',
});
```

### Complete Setup with Callbacks

```javascript
const ratingSection = RatingSection({
  title: 'Alle Bewertungen',
  googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
  facebookPageId: '1234567890',
  showWertgarantie: true,

  onLoadComplete: (platform, data) => {
    console.log(`${platform} loaded:`, data);
    // data contains: source, score, totalRatings, name, address, reviewerImages
  },

  onError: (platform, error) => {
    console.error(`${platform} error:`, error.message);
    // Handle API errors gracefully
  },
});
```

### Without Wertgarantie Logo

```javascript
const ratingsOnly = RatingSection({
  googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
  facebookPageId: '1234567890',
  showWertgarantie: false, // No certificate logo
});
```

### Custom Wertgarantie Image

```javascript
const customCertificate = RatingSection({
  googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
  showWertgarantie: true,
  wertgarantieImageUrl: '/custom/certificate-logo.png',
});
```

### Dynamic Updates

```javascript
const dynamicSection = RatingSection({
  googlePlaceId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
});

// Later, add Facebook ratings
dynamicSection.setFacebookPageId('1234567890');

// Change Google location
dynamicSection.setGooglePlaceId('ChIJNewLocation456');

// Refresh all data
await dynamicSection.refresh();
```

## Performance & Caching

### Automatic Caching

- **Cache Duration**: 5 minutes per API response
- **Cache Key**: Platform + ID (e.g., `google_ChIJ123`, `facebook_456`)
- **Memory Efficient**: LRU cache with 100 entry limit
- **Error Resilience**: Falls back to cached data during API failures

### API Rate Limiting

- **Google Places**: 1000 requests/minute (configurable)
- **Facebook Graph**: 600 requests/minute (configurable)
- **Smart Batching**: Multiple instances share cache

### Performance Tips

```javascript
// Good: Reuse same Place IDs across components
const placeId = 'ChIJ9ZsAL_p1nkcRaVYZabonLbg';
const section1 = RatingSection({ googlePlaceId: placeId });
const section2 = RatingSection({ googlePlaceId: placeId }); // Uses cache

// Good: Check cache before creating new instances
const cacheStatus = section1.getCacheStatus();
if (cacheStatus.google.cached) {
  console.log('Data is cached, fast loading expected');
}
```

## Error Handling

The component handles various error scenarios gracefully:

### API Key Missing

```javascript
// Shows user-friendly error message
// Component still displays other working platforms
```

### Network Failures

```javascript
// Displays retry-friendly error state
// Falls back to cached data if available
```

### Invalid IDs

```javascript
// Shows specific error for invalid Place/Page IDs
// Provides debugging information in console
```

### Rate Limiting

```javascript
// Automatically retries with exponential backoff
// Uses cached data during rate limit periods
```

## CSS Customization

The component uses CSS variables for easy theming:

```css
:root {
  /* Colors */
  --color-google: #4285f4;
  --color-facebook: #1877f2;
  --color-wertgarantie: #00a651;
  --section-bg: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-bg-hover: #f1f3f4;

  /* Spacing */
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;

  /* Borders & Effects */
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --box-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --box-shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

### Platform-Specific Styling

```css
/* Google row styling */
.rating-section__row--google {
  border-left: 4px solid var(--color-google);
}

/* Facebook row styling */
.rating-section__row--facebook {
  border-left: 4px solid var(--color-facebook);
}

/* Wertgarantie row styling */
.rating-section__row--wertgarantie {
  border-left: 4px solid var(--color-wertgarantie);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
```

### Custom Theme Example

```css
.my-custom-rating-section {
  --color-google: #ea4335;
  --color-facebook: #4267b2;
  --section-bg: #fafafa;
  --border-radius-lg: 16px;
}
```

## Accessibility

The RatingSection component follows accessibility best practices:

- **Semantic HTML**: Uses proper section and heading structure
- **Screen Reader Support**: All content accessible to assistive technologies
- **Loading States**: Screen readers announce loading status
- **Error Messages**: Clear, descriptive error messages
- **Keyboard Navigation**: Full keyboard accessibility support
- **High Contrast**: Supports high contrast display modes

## Browser Support

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+)
- **API Support**: Fetch API required (widely supported)
- **CSS Features**: CSS Grid, Custom Properties, Flexbox
- **JavaScript**: ES2020+ features (optional chaining, nullish coalescing)

## Troubleshooting

### Common Issues

**"Either googlePlaceId or facebookPageId is required" Error**

```javascript
// ❌ Neither ID provided
RatingSection({});

// ✅ At least one ID provided
RatingSection({ googlePlaceId: 'ChIJ123' });
```

**API data not loading**

1. Check API keys in console
2. Verify network connectivity
3. Check browser's Network tab for API calls
4. Ensure Place/Page IDs are valid

**Wertgarantie image not displaying**

```javascript
// Check image URL is accessible
RatingSection({
  googlePlaceId: 'ChIJ123',
  wertgarantieImageUrl: '/correct/path/to/image.png', // Verify path
});
```

### Debug Mode

```javascript
// Enable debug logging
import { apiConfig } from './config/api.config.js';
apiConfig.debug.logRequests = true;
apiConfig.debug.logResponses = true;

// Check cache status
const cacheStatus = ratingSection.getCacheStatus();
console.log('Cache status:', cacheStatus);
```

## Migration Notes

### From Previous Rating Components

The RatingSection component combines and enhances previous rating functionality:

```javascript
// OLD: Multiple separate rating components
const googleRating = Rating({ source: 'google', score: 4.5 });
const facebookRating = Rating({ source: 'facebook', score: 4.2 });

// NEW: Unified section with real API data
const ratingSection = RatingSection({
  googlePlaceId: 'ChIJ123',
  facebookPageId: '456',
});
```

### API Configuration Migration

```javascript
// OLD: Hardcoded API keys (insecure)
const API_KEY = 'your-key-here';

// NEW: Environment-based configuration (secure)
// Set in src/config/api.config.local.js
export const apiConfig = {
  googleMaps: { apiKey: process.env.GOOGLE_MAPS_API_KEY },
};
```

## File Structure

```
src/components/RatingSection/
├── RatingSection.js          # Main component with API integration
├── RatingSection.styles.js   # CSS-in-JS styles (auto-injected)
├── RatingSection.test.js     # Comprehensive test suite
├── RatingSection.stories.js  # Storybook stories & examples
├── README.md                 # This documentation
└── index.js                  # Export file
```

## Contributing

When contributing to the RatingSection component:

1. **API Integration**: Test with both real and mock API responses
2. **Error Handling**: Ensure graceful degradation for all failure modes
3. **Performance**: Monitor API usage and caching effectiveness
4. **Accessibility**: Test with screen readers and keyboard navigation
5. **Documentation**: Update README for any new features or breaking changes

## Implementation Details

This component follows the **Unified Vanilla JavaScript Development Principles**:

- **Algorithmic Elegance**: Smart caching and efficient API usage
- **Code Conciseness**: Maximum functionality with minimal code complexity
- **Performance First**: 5-minute cache, request deduplication, efficient DOM updates
- **Universal Compatibility**: Works in all modern browsers and Node.js
- **Developer Experience**: Zero configuration, automatic style injection
- **SMB Focus**: Enterprise-quality ratings display for small/medium businesses

The CSS injection system eliminates the common pain point of CSS import errors while providing consistent styling and theme support.
