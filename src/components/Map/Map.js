// src/components/Map/Map.js
import './Map.css';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';

/**
 * Creates a Map component
 * @param {Object} props - Map properties
 * @returns {Object} Map component
 */
const createMap = (props = {}) => {
  // Validate props
  if (props.apiKey !== undefined && typeof props.apiKey !== 'string') {
    throw new Error('apiKey must be a string');
  }

  if (props.latitude !== undefined && typeof props.latitude !== 'number') {
    throw new Error('latitude must be a number');
  }

  if (props.longitude !== undefined && typeof props.longitude !== 'number') {
    throw new Error('longitude must be a number');
  }

  if (props.location !== undefined && typeof props.location !== 'string') {
    throw new Error('location must be a string');
  }

  if (props.storeId !== undefined && typeof props.storeId !== 'string') {
    throw new Error('storeId must be a string');
  }

  // Validate options if provided
  if (props.options !== undefined) {
    if (typeof props.options !== 'object') {
      throw new Error('options must be an object');
    }

    if (
      props.options.zoom !== undefined &&
      typeof props.options.zoom !== 'number'
    ) {
      throw new Error('options.zoom must be a number');
    }

    if (props.options.mapType !== undefined) {
      const validTypes = ['roadmap', 'satellite', 'hybrid', 'terrain'];
      if (!validTypes.includes(props.options.mapType)) {
        throw new Error(
          `options.mapType must be one of: ${validTypes.join(', ')}`
        );
      }
    }
  }

  // Predefined store locations
  const predefinedStores = {
    default: {
      name: 'Sample Store',
      latitude: 40.7128,
      longitude: -74.006,
      location: 'New York City',
    },
  };

  // Resolve location and coordinates
  const resolveLocation = (config) => {
    const { location, latitude, longitude, storeId } = config;

    let resolvedLocation = location;
    let resolvedLatitude = latitude;
    let resolvedLongitude = longitude;

    if (storeId && predefinedStores[storeId]) {
      const store = predefinedStores[storeId];
      resolvedLocation = store.name;
      resolvedLatitude = store.latitude;
      resolvedLongitude = store.longitude;
    }

    // Use default coordinates if not provided
    if (!resolvedLatitude || !resolvedLongitude) {
      resolvedLatitude = 40.7128; // New York City
      resolvedLongitude = -74.006;
      resolvedLocation = resolvedLocation || 'New York City';
    }

    return {
      location: resolvedLocation,
      latitude: resolvedLatitude,
      longitude: resolvedLongitude,
    };
  };

  /**
   * Creates a live Google Maps element
   * @param {Object} config - Map configuration
   * @returns {HTMLElement} Live map container
   * @private
   */
  const createLiveMapElement = (config) => {
    const container = createElement('div', {
      classes: ['map-container', 'map-container--live'],
    });

    // Load Google Maps script if not already loaded
    if (typeof window !== 'undefined' && window.google === undefined) {
      loadGoogleMapsScript(() => initializeLiveMap(container, config), config);
    } else if (typeof window !== 'undefined') {
      initializeLiveMap(container, config);
    }

    return container;
  };

  /**
   * Load Google Maps JavaScript API
   * @param {Function} callback - Callback to execute after script loads
   * @param {Object} config - Map configuration with API key
   * @private
   */
  const loadGoogleMapsScript = (callback, config) => {
    if (typeof document === 'undefined') return;

    if (document.querySelector('#google-maps-script')) {
      if (callback) callback();
      return;
    }

    const script = createElement('script', {
      attributes: {
        id: 'google-maps-script',
        src: `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places`,
        async: true,
        defer: true,
      },
    });

    script.onload = () => {
      if (callback) callback();
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps API');
      // Optionally handle the error by calling callback with an error parameter
    };

    document.head.appendChild(script);
  };

  /**
   * Initialize live Google Map
   * @param {HTMLElement} container - Map container
   * @param {Object} config - Map configuration
   * @private
   */
  const initializeLiveMap = (container, config) => {
    if (typeof window === 'undefined' || !window.google) return;

    try {
      const mapOptions = {
        center: {
          lat: config.latitude,
          lng: config.longitude,
        },
        zoom: config.options.zoom,
        mapTypeId: config.options.mapType,
      };

      const map = new window.google.maps.Map(container, mapOptions);

      // Store map instance for later cleanup
      container._mapInstance = map;

      // Add marker
      const marker = new window.google.maps.Marker({
        position: {
          lat: config.latitude,
          lng: config.longitude,
        },
        map: map,
        title: config.location,
      });

      // Store marker instance for later cleanup
      container._markerInstance = marker;
    } catch (error) {
      console.error('Error initializing live map:', error);
      // Fallback to mock map if live map fails
      const mockMap = createMockMapElement(config);
      container.innerHTML = mockMap.innerHTML;
    }
  };

  /**
   * Create a mock map element
   * @param {Object} config - Map configuration
   * @returns {HTMLElement} Mock map container element
   * @private
   */
  const createMockMapElement = (config) => {
    const mockPin = createElement('div', {
      classes: ['map-mock-pin'],
    });

    const mockDetails = createElement('div', {
      classes: ['map-mock-details'],
      html: `
        <h3>${config.location}</h3>
        <p>Latitude: ${config.latitude.toFixed(4)}</p>
        <p>Longitude: ${config.longitude.toFixed(4)}</p>
        <small>${
          config.apiKey
            ? 'API Key Provided (Mock Fallback)'
            : 'Mock Map (No API Key)'
        }</small>
      `,
    });

    const mockOverlay = createElement('div', {
      classes: ['map-mock-overlay'],
      children: [mockPin, mockDetails],
    });

    return createElement('div', {
      classes: ['map-container', 'map-container--mock'],
      children: [mockOverlay],
    });
  };

  /**
   * Renders the map element based on current state
   * @param {Object} state - Current component state
   * @returns {HTMLElement} Map element
   */
  const renderMap = (state) => {
    // Create merged options with defaults
    const options = {
      zoom: 12,
      mapType: 'roadmap',
      ...(state.options || {}),
    };

    // Resolve location
    const locationInfo = resolveLocation({
      location: state.location,
      latitude: state.latitude,
      longitude: state.longitude,
      storeId: state.storeId,
    });

    // Create config object
    const config = {
      apiKey: state.apiKey,
      location: locationInfo.location,
      latitude: locationInfo.latitude,
      longitude: locationInfo.longitude,
      options,
    };

    // Create map element based on whether API key is provided
    return config.apiKey
      ? createLiveMapElement(config)
      : createMockMapElement(config);
  };

  // Create component using baseComponent
  const baseComponent = createBaseComponent(renderMap)(props);

  // Custom methods for Map component
  const mapComponent = {
    ...baseComponent,

    /**
     * Determines if component needs to fully re-render based on prop changes
     * @param {Object} newProps - New properties
     * @returns {boolean} Whether a full re-render is required
     */
    shouldRerender(newProps) {
      // Always re-render if any of these critical props change
      const criticalProps = [
        'latitude',
        'longitude',
        'location',
        'storeId',
        'apiKey',
      ];
      return Object.keys(newProps).some((key) => criticalProps.includes(key));
    },

    /**
     * Update map location
     * @param {number} latitude - New latitude
     * @param {number} longitude - New longitude
     * @param {string} [locationName] - Location name
     * @returns {Object} Map component (for chaining)
     */
    setLocation(latitude, longitude, locationName) {
      if (typeof latitude !== 'number') {
        throw new Error('latitude must be a number');
      }

      if (typeof longitude !== 'number') {
        throw new Error('longitude must be a number');
      }

      if (locationName !== undefined && typeof locationName !== 'string') {
        throw new Error('locationName must be a string');
      }

      return this.update({
        latitude,
        longitude,
        location: locationName || `Lat: ${latitude}, Lng: ${longitude}`,
      });
    },

    /**
     * Set map zoom level
     * @param {number} zoom - Zoom level (1-20)
     * @returns {Object} Map component (for chaining)
     */
    setZoom(zoom) {
      if (typeof zoom !== 'number') {
        throw new Error('zoom must be a number');
      }

      if (zoom < 1 || zoom > 20) {
        throw new Error('zoom must be between 1 and 20');
      }

      const newOptions = { ...(this.options || {}), zoom };
      return this.update({ options: newOptions });
    },

    /**
     * Set map type (roadmap, satellite, hybrid, terrain)
     * @param {string} mapType - Map type
     * @returns {Object} Map component (for chaining)
     */
    setMapType(mapType) {
      const validTypes = ['roadmap', 'satellite', 'hybrid', 'terrain'];
      if (!validTypes.includes(mapType)) {
        throw new Error(
          `Invalid map type. Must be one of: ${validTypes.join(', ')}`
        );
      }

      const newOptions = { ...(this.options || {}), mapType };
      return this.update({ options: newOptions });
    },

    /**
     * Override destroy to clean up Google Maps instances
     */
    destroy() {
      const element = this.getElement();

      // Clean up map instance if it exists
      if (element && element._mapInstance) {
        // Google Maps doesn't have a destroy method, but we need to remove markers
        if (element._markerInstance) {
          element._markerInstance.setMap(null);
          element._markerInstance = null;
        }

        element._mapInstance = null;
      }

      // Call base destroy method
      baseComponent.destroy();
    },

    /**
     * Handle theme changes
     * @param {string} newTheme - New theme name
     * @param {string} previousTheme - Previous theme name
     */
    onThemeChange(newTheme, previousTheme) {
      console.debug(`Map: theme changed from ${previousTheme} to ${newTheme}`);
      // Implement theme-specific adjustments if needed
    },
  };

  return mapComponent;
};

// Define required props for validation
createMap.requiredProps = [];

// Export as a factory function
export default createMap;
