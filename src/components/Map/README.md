# Map Component

The Map component provides Google Maps integration with an automatic fallback to a mock display when no API key is available. It features automatic style injection, place details integration, and full SSR compatibility.

## Features

✅ **Zero Configuration** - Styles automatically injected, no CSS imports needed
✅ **Google Maps Integration** - Interactive maps with Places API support
✅ **Smart Fallback** - Clean preview mode when no API key is provided
✅ **Place Details** - Automatic fetching of business information via Place ID
✅ **URL Parsing** - Extract coordinates and place IDs from Google Maps URLs
✅ **SSR Compatible** - Safe for server-side rendering
✅ **Responsive Design** - Adapts to different screen sizes
✅ **Theme Support** - Uses CSS variables for easy theming

## Usage

```javascript
import { Map } from 'svarog-ui-core';

// Basic map with coordinates
const map = Map({
  latitude: 48.1417262,
  longitude: 11.5609816,
  locationName: 'Munich Shop',
});

// Map with Google Maps API
const googleMap = Map({
  apiKey: 'YOUR_API_KEY',
  latitude: 48.8566,
  longitude: 2.3522,
  locationName: 'Paris, France',
});

// Map with Place ID
const placeMap = Map({
  apiKey: 'YOUR_API_KEY',
  placeId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
  autoOpenInfo: true,
});

// Add to DOM
document.body.appendChild(map.getElement());
```

## Props

| Prop          | Type    | Default    | Description                                   |
| ------------- | ------- | ---------- | --------------------------------------------- |
| apiKey        | string  | null       | Google Maps API key (enables interactive map) |
| latitude      | number  | 48.1417262 | Map center latitude                           |
| longitude     | number  | 11.5609816 | Map center longitude                          |
| locationName  | string  | 'Location' | Display name for the location                 |
| placeId       | string  | null       | Google Places ID for automatic details        |
| googleMapsUrl | string  | null       | Google Maps URL to extract data from          |
| shopInfo      | object  | null       | Manual shop information                       |
| autoOpenInfo  | boolean | true       | Auto-open info window on load                 |
| options       | object  | {}         | Additional map options                        |

### Shop Info Object

```javascript
{
  name: string,      // Business name
  address: string,   // Street address
  phone: string,     // Phone number
  website: string,   // Website URL
  hours: string      // Opening hours
}
```

### Options Object

| Option  | Type   | Default   | Description                                           |
| ------- | ------ | --------- | ----------------------------------------------------- |
| zoom    | number | 16        | Map zoom level (1-20)                                 |
| mapType | string | 'roadmap' | Map type: 'roadmap', 'satellite', 'hybrid', 'terrain' |

## Methods

### getElement()

Returns the map DOM element.

```javascript
const element = map.getElement();
document.body.appendChild(element);
```

### update(props)

Updates multiple map properties at once.

```javascript
map.update({
  locationName: 'Updated Location',
  latitude: 52.52,
  longitude: 13.405,
});
```

### setCoordinates(latitude, longitude)

Updates the map's center coordinates.

```javascript
map.setCoordinates(48.8566, 2.3522);
```

### setPlaceId(placeId)

Sets a Google Places ID to fetch location details.

```javascript
map.setPlaceId('ChIJ9ZsAL_p1nkcRaVYZabonLbg');
```

### setGoogleMapsUrl(url)

Extracts and sets data from a Google Maps URL.

```javascript
map.setGoogleMapsUrl(
  'https://maps.google.com/maps/place/Berlin/@52.5200,13.4050'
);
```

### destroy()

Cleans up resources and removes the map.

```javascript
map.destroy();
```

## Examples

### Basic Mock Map (No API Key)

```javascript
const mockMap = Map({
  latitude: 48.1371,
  longitude: 11.5754,
  locationName: 'Munich Electronics Store',
  shopInfo: {
    address: 'Marienplatz 1, 80331 München',
    phone: '+49 89 12345678',
    hours: 'Mon-Sat: 10:00-20:00',
  },
});
```

### Interactive Map with API Key

```javascript
const liveMap = Map({
  apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  latitude: 48.1351,
  longitude: 11.582,
  locationName: 'Viktualienmarkt',
  options: {
    zoom: 17,
    mapType: 'satellite',
  },
});
```

### Using Google Maps URL

```javascript
const urlMap = Map({
  apiKey: 'YOUR_API_KEY',
  googleMapsUrl:
    'https://maps.google.com/maps/place/Neues+Rathaus/@48.1374,11.5755,17z',
  autoOpenInfo: true,
});
```

### Map with Place Details

```javascript
const detailsMap = Map({
  apiKey: 'YOUR_API_KEY',
  placeId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
  autoOpenInfo: true,
});

// Place details are automatically fetched and displayed:
// - Business name
// - Address
// - Phone number
// - Website
// - Opening hours
// - Rating
// - Open/Closed status
```

### Dynamic Location Updates

```javascript
const dynamicMap = Map({
  latitude: 48.1351,
  longitude: 11.582,
  locationName: 'Current Location',
});

// Update location from URL
dynamicMap.setGoogleMapsUrl(
  'https://maps.google.com/maps/@48.1374,11.5755,17z'
);

// Update coordinates directly
dynamicMap.setCoordinates(48.1486, 11.5633);
dynamicMap.update({ locationName: 'New Location' });

// Switch to a place with details
dynamicMap.setPlaceId('ChIJ9ZsAL_p1nkcRaVYZabonLbg');
```

## Google Maps Setup

1. **Get an API Key**

   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Maps JavaScript API" and "Places API"
   - Create credentials (API Key)

2. **Restrict Your API Key**

   - Add HTTP referrer restrictions
   - Limit to your domain(s)
   - Enable only required APIs

3. **Use in Component**
   ```javascript
   const map = Map({
     apiKey: 'YOUR_RESTRICTED_API_KEY',
     // ... other props
   });
   ```

## CSS Customization

Map styles use CSS variables for theming:

```css
:root {
  /* Colors */
  --color-gray-100: #f8f9fa;
  --color-gray-300: #dee2e6;
  --color-primary: #007bff;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;

  /* Typography */
  --font-family: system-ui, -apple-system, sans-serif;
  --font-size-lg: 18px;

  /* Borders & Shadows */
  --border-radius-default: 8px;
  --box-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --box-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Responsive Behavior

- Desktop: 400px height
- Mobile (<768px): 300px height
- Info windows adapt to screen size

## Architecture

### Component Structure

```
src/components/Map/
├── Map.js              # Main component logic
├── Map.styles.js       # CSS-in-JS styles
├── Map.stories.js      # Storybook stories
├── Map.test.js         # Unit tests
├── README.md           # Documentation
└── index.js            # Export wrapper
```

### Key Features

1. **Automatic Fallback** - Displays mock map when API key is missing
2. **Smart URL Parsing** - Extracts coordinates and place IDs from URLs
3. **Place Details Integration** - Fetches business info via Places API
4. **Coordinate Validation** - Handles invalid inputs gracefully
5. **Style Injection** - CSS loaded only when component is used

## Troubleshooting

### Common Issues

**Map shows preview mode instead of interactive map**

- Verify API key is valid and not a placeholder
- Check that Maps JavaScript API is enabled
- Ensure API key has proper restrictions

**Place details not loading**

- Verify Places API is enabled for your API key
- Check that place ID is in new format (without colons)
- Old format IDs (with `:`) are no longer supported

**Coordinates showing as NaN**

- Component validates and converts invalid coordinates to defaults
- Check that latitude/longitude are numbers, not strings

**Console errors about Google not defined**

- Normal in SSR environments
- Component handles this gracefully with fallback

### Performance Tips

1. **Lazy Load Maps** - Only create maps when visible
2. **Reuse API Keys** - Use same key across all map instances
3. **Cache Place Data** - Store fetched place details
4. **Optimize Info Windows** - Keep content lightweight

## Migration Notes

### From Previous Version

The component has been refactored for better performance and maintainability:

1. **Default Location** - Now Munich (48.1417262, 11.5609816) instead of NYC
2. **Removed Features**:
   - `storeId` prop (use coordinates or placeId instead)
   - `location` prop (use `locationName`)
   - Custom validation errors
3. **New Features**:
   - Google Maps URL parsing
   - Automatic coordinate validation
   - Better error handling
   - Cleaner codebase (~150 lines shorter)

### API Changes

```javascript
// Old
map.setLocation(lat, lng, name);

// New
map.setCoordinates(lat, lng);
map.update({ locationName: name });
```

## Browser Support

- **Modern Browsers**: Full support
- **IE11**: Mock map only (no Google Maps)
- **Mobile**: Full touch support
- **SSR**: Complete compatibility

## Contributing

When contributing to the Map component:

1. Maintain zero-dependency architecture
2. Ensure SSR compatibility
3. Add tests for new features
4. Update documentation
5. Follow Svarog UI principles
