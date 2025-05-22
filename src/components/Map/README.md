# Map Component

The Map component provides either a Google Maps integration or a fallback mock map display for applications requiring location visualization.

## Usage

```javascript
import { Map } from '@svarog-ui/core';

// Create a basic map with default location (New York City)
const myMap = Map({});

// Create a map with specific coordinates
const locationMap = Map({
  latitude: 37.7749,
  longitude: -122.4194,
  location: 'San Francisco',
});

// Add to DOM
document.body.appendChild(myMap.getElement());
```

## Props

| Prop      | Type   | Default         | Description                      |
| --------- | ------ | --------------- | -------------------------------- |
| apiKey    | string | null            | Google Maps API key (optional)   |
| latitude  | number | 40.7128         | Map center latitude              |
| longitude | number | -74.006         | Map center longitude             |
| location  | string | 'New York City' | Location name                    |
| storeId   | string | null            | ID for predefined store location |
| options   | object | {}              | Additional map options           |

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
  location: 'London',
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

Map styles can be customized using CSS variables:

```css
:root {
  --color-gray-100: #f8f9fa;
  --color-gray-300: #dee2e6;
  --color-primary: #007bff;
  --border-radius-default: 8px;
  --box-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
}
```

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
  location: 'London, UK',
});
```

### Map with Google Maps Integration

```javascript
const googleMap = Map({
  apiKey: 'your-google-maps-api-key',
  latitude: 48.8566,
  longitude: 2.3522,
  location: 'Paris, France',
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
  location: 'Moscow, Russia',
  options: {
    zoom: 16,
    mapType: 'terrain',
  },
});
```

## Accessibility

The Map component follows best practices for accessibility:

- Provides text-based location information for screen readers
- Maintains proper color contrast ratios when using theme variables
- Uses semantic HTML elements
