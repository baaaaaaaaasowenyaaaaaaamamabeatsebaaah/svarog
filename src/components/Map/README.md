# Map Component

The Map component provides either a Google Maps integration or a fallback mock map display for applications requiring location visualization. Styles are automatically injected when the component is used, requiring no additional CSS imports.

## Features

✅ **Zero Configuration** - Styles automatically injected, no CSS imports needed  
✅ **Google Maps Integration** - Live maps when API key provided  
✅ **Fallback Mock Display** - Works without API key  
✅ **SSR Compatible** - Safe for server-side rendering  
✅ **Responsive Design** - Adapts to different screen sizes  
✅ **Theme Support** - Uses CSS variables for easy theming

## Usage

```javascript
import { Map } from '@svarog-ui/core';

// Create a basic map with default location (New York City)
const myMap = Map({});

// Create a map with specific coordinates
const locationMap = Map({
  latitude: 37.7749,
  longitude: -122.4194,
  locationName: 'San Francisco',
});

// Add to DOM
document.body.appendChild(myMap.getElement());
```

## Props

| Prop         | Type   | Default         | Description                      |
| ------------ | ------ | --------------- | -------------------------------- |
| apiKey       | string | null            | Google Maps API key (optional)   |
| latitude     | number | 40.7128         | Map center latitude              |
| longitude    | number | -74.006         | Map center longitude             |
| locationName | string | 'New York City' | Location name                    |
| storeId      | string | null            | ID for predefined store location |
| options      | object | {}              | Additional map options           |
| location     | string | -               | _Deprecated: Use locationName_   |

### Options Object

| Option  | Type   | Default   | Description                             |
| ------- | ------ | --------- | --------------------------------------- |
| zoom    | number | 12        | Map zoom level (1-20)                   |
| mapType | string | 'roadmap' | Map type ('roadmap', 'satellite', etc.) |

## Methods

### getElement()

Returns the map DOM element.

```javascript
const mapElement = myMap.getElement();
```

### setLocation(latitude, longitude, [locationName])

Updates the map's location.

```javascript
myMap.setLocation(34.0522, -118.2437, 'Los Angeles');
```

### setZoom(zoom)

Updates the map's zoom level.

```javascript
myMap.setZoom(14);
```

### setMapType(mapType)

Updates the map's type.

```javascript
myMap.setMapType('satellite');
```

### update(props)

Updates multiple map properties at once.

```javascript
myMap.update({
  latitude: 51.5074,
  longitude: -0.1278,
  locationName: 'London',
  options: {
    zoom: 10,
    mapType: 'hybrid',
  },
});
```

### destroy()

Cleans up resources and event listeners. Call when removing the map.

```javascript
myMap.destroy();
```

## CSS Customization

Map styles are automatically injected and can be customized using CSS variables:

```css
:root {
  --color-gray-100: #f8f9fa;
  --color-gray-300: #dee2e6;
  --color-primary: #007bff;
  --color-text: #212529;
  --color-text-light: #6c757d;
  --color-text-muted: #6c757d;
  --border-radius-default: 8px;
  --box-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --font-size-lg: 18px;
}
```

### Responsive Behavior

The map automatically adjusts for mobile devices:

- Height reduces to 300px on screens smaller than 768px
- Overlay padding adjusts for better mobile experience

## Examples

### Basic Map

```javascript
const basicMap = Map({});
```

### Map with Custom Location

```javascript
const londonMap = Map({
  latitude: 51.5074,
  longitude: -0.1278,
  locationName: 'London, UK',
});
```

### Map with Google Maps Integration

```javascript
const googleMap = Map({
  apiKey: 'your-google-maps-api-key',
  latitude: 48.8566,
  longitude: 2.3522,
  locationName: 'Paris, France',
  options: {
    zoom: 14,
    mapType: 'satellite',
  },
});
```

### Using Predefined Store Locations

```javascript
const storeMap = Map({
  storeId: 'default', // Uses predefined store location
});
```

### Map with Custom Options

```javascript
const customMap = Map({
  latitude: 55.7558,
  longitude: 37.6173,
  locationName: 'Moscow, Russia',
  options: {
    zoom: 16,
    mapType: 'terrain',
  },
});
```

### Dynamic Map Updates

```javascript
const dynamicMap = Map({
  latitude: 40.7128,
  longitude: -74.006,
  locationName: 'New York City',
});

// Update location programmatically
setTimeout(() => {
  dynamicMap.setLocation(37.7749, -122.4194, 'San Francisco');
}, 2000);

// Chain multiple updates
dynamicMap
  .setZoom(15)
  .setMapType('satellite')
  .setLocation(34.0522, -118.2437, 'Los Angeles');
```

## Architecture

### CSS Injection System

The Map component uses our modern CSS injection system:

- **Automatic Style Loading**: Styles are injected when the component is first rendered
- **Deduplication**: Styles are only injected once, even with multiple instances
- **SSR Safe**: No errors in Node.js environments
- **Performance Optimized**: Styles are cached and reused

### File Structure

```
src/components/Map/
├── Map.js              # Main component with CSS injection
├── Map.styles.js       # Component-specific styles
├── Map.stories.js      # Storybook stories
├── Map.test.js         # Unit tests
├── README.md           # This documentation
└── index.js            # Export wrapper
```

## Accessibility

The Map component follows best practices for accessibility:

- Provides text-based location information for screen readers
- Maintains proper color contrast ratios when using theme variables
- Uses semantic HTML elements
- Includes appropriate ARIA attributes for interactive elements

## Browser Support

- **Modern Browsers**: Full support for all features
- **IE11**: Basic mock map functionality (no Google Maps integration)
- **Server-Side Rendering**: Full support with automatic style injection

## Migration from CSS Imports

If migrating from the previous CSS import version:

1. **Remove CSS Import**: No longer needed in your application code
2. **No API Changes**: All component APIs remain the same
3. **Automatic Styles**: Styles are now automatically injected
4. **Better Performance**: Improved loading and caching behavior

```javascript
// OLD: Required CSS import
import 'svarog-ui/dist/Map.css';
import { Map } from 'svarog-ui';

// NEW: No CSS import needed
import { Map } from 'svarog-ui';
```

## Troubleshooting

**Issue: Styles not appearing**

- Check browser dev tools for injected `<style>` tags with `data-svarog="map"`
- Verify component is properly imported and used

**Issue: Google Maps not loading**

- Verify API key is valid and has Maps JavaScript API enabled
- Check browser console for API errors
- Component will fallback to mock display if API fails

**Issue: Theme variables not working**

- Ensure CSS variables are defined in your theme
- Check that theme is properly applied to document root
- Verify variable names match the expected format

## Performance Notes

- Styles are injected only once per page load
- Google Maps scripts are loaded lazily when needed
- Mock fallback has minimal performance impact
- Component cleanup prevents memory leaks
