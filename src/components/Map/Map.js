// src/components/Map/Map.js - Modern Google Maps API 2025
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { mapStyles } from './Map.styles.js';

const injectMapStyles = createStyleInjector('Map');

// Constants
const INVALID_KEYS = [
  'YOUR_GOOGLE_MAPS_API_KEY',
  'YOUR_ACTUAL_API_KEY_HERE',
  'YOUR_API_KEY',
  'API_KEY_HERE',
];
const DEFAULT_COORDS = { lat: 48.1417262, lng: 11.5609816 };
const DEFAULT_ZOOM = 16;
const SCRIPT_LOAD_TIMEOUT = 15000;

/**
 * Creates a modern Map component with Google Maps API 2025
 * @param {Object} props - Map properties
 * @param {string} [props.apiKey] - Google Maps API key
 * @param {number} [props.latitude] - Map center latitude
 * @param {number} [props.longitude] - Map center longitude
 * @param {string} [props.title] - Location title (Svarog standard)
 * @param {string} [props.placeId] - Google Places ID
 * @param {string} [props.googleMapsUrl] - Google Maps URL to parse
 * @param {Object} [props.shopInfo] - Business information
 * @param {boolean} [props.autoOpenInfo=true] - Auto-open info window
 * @param {Object} [props.options] - Map configuration
 * @param {Function} [props.onMapLoad] - Map load callback
 * @param {Function} [props.onError] - Error callback
 * @returns {Object} Map component
 */
const createMap = (props = {}) => {
  // Validation utilities
  const isValidApiKey = (key) =>
    key &&
    typeof key === 'string' &&
    key.length > 10 &&
    !INVALID_KEYS.includes(key);

  const parseCoordinate = (value, defaultValue) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // URL parsing utilities
  const extractPlaceId = (url) => {
    if (!url) return null;
    const patterns = [
      /place_id=([A-Za-z0-9_-]+)/,
      /data=[^/]*!1s([A-Za-z0-9_-]+)/,
      /place\/[^/]+\/[^/]+\/[^/]+\/[^/]+!1s([^!]+)/,
      /ftid=([^&]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const placeId = match[1];
        if (placeId.includes(':')) {
          console.warn('[Map] Old place ID format detected and ignored');
          return null;
        }
        return placeId;
      }
    }
    return null;
  };

  const extractCoordinates = (url) => {
    if (!url) return null;
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    return match
      ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) }
      : null;
  };

  const extractLocationName = (url) => {
    if (!url) return null;
    const match = url.match(/place\/([^/@]+)/);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
  };

  // Props normalization
  const normalizeProps = (inputProps) => {
    const normalized = { ...inputProps };

    if (!isValidApiKey(normalized.apiKey)) {
      if (normalized.apiKey) {
        console.warn('[Map] Invalid API key provided. Using mock mode.');
      }
      delete normalized.apiKey;
    }

    if (normalized.googleMapsUrl) {
      const placeId = extractPlaceId(normalized.googleMapsUrl);
      const coords = extractCoordinates(normalized.googleMapsUrl);
      const locationName = extractLocationName(normalized.googleMapsUrl);

      if (placeId) normalized.placeId = placeId;
      if (coords) Object.assign(normalized, coords);
      if (locationName && !normalized.title) normalized.title = locationName;
    }

    normalized.latitude = parseCoordinate(
      normalized.latitude,
      DEFAULT_COORDS.lat
    );
    normalized.longitude = parseCoordinate(
      normalized.longitude,
      DEFAULT_COORDS.lng
    );

    return normalized;
  };

  const normalizedProps = normalizeProps(props);

  /**
   * Create info window content
   */
  const createInfoContent = (data) => {
    if (data.name || data.address || data.phone) {
      // Places API data
      return `
        <div style="font-family: Arial, sans-serif; max-width: 300px;">
          ${data.name ? `<h3 style="margin: 0 0 8px 0; font-size: 16px;">${data.name}</h3>` : ''}
          ${data.address ? `<p style="margin: 4px 0; font-size: 14px;">📍 ${data.address}</p>` : ''}
          ${data.phone ? `<p style="margin: 4px 0; font-size: 14px;">📞 ${data.phone}</p>` : ''}
          ${data.website ? `<p style="margin: 4px 0; font-size: 14px;">🌐 <a href="${data.website}" target="_blank">Website</a></p>` : ''}
          ${data.rating ? `<p style="margin: 4px 0; font-size: 14px;">⭐ ${data.rating}/5</p>` : ''}
        </div>
      `;
    } else {
      // Basic data
      return `
        <div style="font-family: Arial, sans-serif; max-width: 300px;">
          ${data.title ? `<h3 style="margin: 0 0 8px 0; font-size: 16px;">${data.title}</h3>` : ''}
          ${data.shopInfo?.address ? `<p style="margin: 4px 0; font-size: 14px;">📍 ${data.shopInfo.address}</p>` : ''}
          ${data.shopInfo?.phone ? `<p style="margin: 4px 0; font-size: 14px;">📞 ${data.shopInfo.phone}</p>` : ''}
          ${data.shopInfo?.hours ? `<p style="margin: 4px 0; font-size: 14px;">🕐 ${data.shopInfo.hours}</p>` : ''}
        </div>
      `;
    }
  };

  /**
   * Create mock map element
   */
  const createMockMapElement = (config) => {
    const container = createElement('div', {
      classes: 'map-container map-container--mock',
    });

    container.innerHTML = `
      <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.9); border-radius: 8px; max-width: 400px;">
        <div style="font-size: 32px; margin-bottom: 16px;">📍</div>
        <h3 style="margin: 0 0 12px 0;">${config.title || 'Location'}</h3>
        <p style="margin: 4px 0; color: #666; font-size: 12px;">
          Lat: ${config.latitude.toFixed(6)}<br>
          Lng: ${config.longitude.toFixed(6)}
        </p>
        ${config.placeId ? `<p style="margin: 4px 0; color: #666; font-size: 10px; font-family: monospace; word-break: break-all;">Place ID: ${config.placeId}</p>` : ''}
        ${config.shopInfo?.address ? `<p style="margin: 8px 0;">📍 ${config.shopInfo.address}</p>` : ''}
        ${config.shopInfo?.phone ? `<p style="margin: 4px 0;">📞 ${config.shopInfo.phone}</p>` : ''}
        ${config.shopInfo?.hours ? `<p style="margin: 4px 0;">🕐 ${config.shopInfo.hours}</p>` : ''}
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
          <p style="margin: 0;">📍 Map Preview Mode</p>
          <small>Add Google Maps API key for interactive map</small>
        </div>
      </div>
    `;

    return container;
  };

  /**
   * Load Google Maps with modern async loading
   */
  const loadGoogleMapsAsync = (apiKey) => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (
        window.google?.maps?.Map &&
        window.google?.maps?.marker?.AdvancedMarkerElement
      ) {
        resolve();
        return;
      }

      // Check for existing script
      const existingScript = document.querySelector('#google-maps-script');
      if (existingScript) {
        const pollForReady = () => {
          if (
            window.google?.maps?.Map &&
            window.google?.maps?.marker?.AdvancedMarkerElement
          ) {
            resolve();
          } else {
            setTimeout(pollForReady, 100);
          }
        };
        pollForReady();
        return;
      }

      // Create unique callback name
      const callbackName = `initGoogleMaps_${Date.now()}`;

      // Set up global callback
      window[callbackName] = () => {
        delete window[callbackName];
        resolve();
      };

      // Create script with modern loading
      const script = createElement('script', {
        attributes: {
          id: 'google-maps-script',
          src: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&callback=${callbackName}&loading=async`,
          async: true,
          defer: true,
        },
      });

      script.addEventListener('error', () => {
        delete window[callbackName];
        reject(new Error('Failed to load Google Maps'));
      });

      // Timeout protection
      setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName];
          reject(new Error('Google Maps loading timeout'));
        }
      }, SCRIPT_LOAD_TIMEOUT);

      document.head.appendChild(script);
    });
  };

  /**
   * Create modern AdvancedMarkerElement
   */
  const createAdvancedMarker = (map, position, title) => {
    const { maps } = window.google;

    // Use modern AdvancedMarkerElement
    if (maps.marker?.AdvancedMarkerElement) {
      return new maps.marker.AdvancedMarkerElement({
        map,
        position,
        title,
      });
    }

    // Fallback to legacy Marker (shouldn't happen with modern loading)
    console.warn(
      '[Map] AdvancedMarkerElement not available, using legacy Marker'
    );
    return new maps.Marker({
      map,
      position,
      title,
    });
  };

  /**
   * Fetch place details using modern Places API
   */
  const fetchPlaceDetails = async (placeId, map) => {
    const { maps } = window.google;

    // Try modern Place class first
    if (maps.places?.Place) {
      try {
        const place = new maps.places.Place({
          id: placeId,
          requestedLanguage: 'en',
        });

        await place.fetchFields({
          fields: [
            'displayName',
            'formattedAddress',
            'location',
            'rating',
            'nationalPhoneNumber',
            'websiteURI',
          ],
        });

        return {
          name: place.displayName,
          address: place.formattedAddress,
          phone: place.nationalPhoneNumber,
          website: place.websiteURI?.toString(),
          rating: place.rating,
          location: place.location,
        };
      } catch (error) {
        console.warn('[Map] Modern Places API failed:', error);
      }
    }

    // Fallback to legacy PlacesService
    return new Promise((resolve) => {
      if (!maps.places?.PlacesService) {
        console.warn('[Map] Places API not available');
        resolve(null);
        return;
      }

      console.warn(
        '[Map] Using legacy PlacesService - consider upgrading API version'
      );
      const service = new maps.places.PlacesService(map);

      service.getDetails(
        {
          placeId,
          fields: [
            'name',
            'formatted_address',
            'geometry',
            'rating',
            'formatted_phone_number',
            'website',
          ],
        },
        (place, status) => {
          if (status === maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              name: place.name,
              address: place.formatted_address,
              phone: place.formatted_phone_number,
              website: place.website,
              rating: place.rating,
              location: place.geometry?.location,
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  };

  /**
   * Initialize modern Google Map
   */
  const initializeModernMap = async (container, config) => {
    try {
      await loadGoogleMapsAsync(config.apiKey);

      const { maps } = window.google;
      const position = { lat: config.latitude, lng: config.longitude };

      // Clear loading content
      container.innerHTML = '';

      // Create map with mapId for AdvancedMarkerElement
      const map = new maps.Map(container, {
        center: position,
        zoom: config.options.zoom || DEFAULT_ZOOM,
        mapTypeId: config.options.mapType || 'roadmap',
        mapId: 'svarog-map-modern', // Required for AdvancedMarkerElement
      });

      // Create modern marker
      const marker = createAdvancedMarker(
        map,
        position,
        config.title || 'Location'
      );

      // Store references
      container._mapInstance = map;
      container._markerInstance = marker;

      // Setup info window with modern event handling
      await setupModernInfoWindow(map, marker, config);

      // Trigger success callback
      if (typeof config.onMapLoad === 'function') {
        config.onMapLoad({ map, marker });
      }
    } catch (error) {
      console.error('[Map] Failed to initialize modern map:', error);

      if (typeof config.onError === 'function') {
        config.onError(error);
      }

      // Fallback to mock map
      container.innerHTML = '';
      container.appendChild(createMockMapElement(config));
    }
  };

  /**
   * Setup info window with modern marker events
   */
  const setupModernInfoWindow = async (map, marker, config) => {
    const { maps } = window.google;
    let infoWindow = null;

    const createAndShowInfoWindow = (content) => {
      if (infoWindow) {
        infoWindow.close();
      }

      infoWindow = new maps.InfoWindow({
        content,
        maxWidth: 400,
      });

      if (config.autoOpenInfo !== false) {
        infoWindow.open(map, marker);
      }

      // Modern marker event handling
      if (marker.addListener) {
        // Legacy Marker
        marker.addListener('click', () => infoWindow.open(map, marker));
      } else {
        // AdvancedMarkerElement
        marker.addEventListener('gmp-click', () =>
          infoWindow.open(map, marker)
        );
      }
    };

    // Try to get place details if placeId provided
    if (config.placeId && !config.placeId.includes(':')) {
      try {
        const placeDetails = await fetchPlaceDetails(config.placeId, map);

        if (placeDetails) {
          // Update marker position if place has location
          if (placeDetails.location) {
            if (marker.position !== undefined) {
              // AdvancedMarkerElement
              marker.position = placeDetails.location;
            } else if (marker.setPosition) {
              // Legacy Marker
              marker.setPosition(placeDetails.location);
            }
            map.setCenter(placeDetails.location);
          }

          createAndShowInfoWindow(createInfoContent(placeDetails));
          return;
        }
      } catch (error) {
        console.warn('[Map] Place details fetch failed:', error);
      }
    }

    // Use basic configuration data
    createAndShowInfoWindow(createInfoContent(config));
  };

  /**
   * Create live map element
   */
  const createLiveMapElement = (config) => {
    const container = createElement('div', {
      classes: 'map-container map-container--live',
    });

    // Add loading state
    container.innerHTML = `
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255,255,255,0.9);
        padding: 16px 24px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      ">
        <div style="font-size: 24px; margin-bottom: 8px;">🗺️</div>
        <div style="font-size: 14px; color: #666;">Loading modern map...</div>
      </div>
    `;

    // Initialize map after DOM is ready
    setTimeout(() => {
      initializeModernMap(container, config);
    }, 100);

    return container;
  };

  /**
   * Render the map
   */
  const renderMap = (state) => {
    injectMapStyles(mapStyles);

    const config = {
      apiKey: state.apiKey,
      title: state.title || 'Location',
      latitude: state.latitude,
      longitude: state.longitude,
      placeId: state.placeId,
      shopInfo: state.shopInfo,
      autoOpenInfo: state.autoOpenInfo,
      options: state.options || {},
      onMapLoad: state.onMapLoad,
      onError: state.onError,
    };

    return isValidApiKey(config.apiKey)
      ? createLiveMapElement(config)
      : createMockMapElement(config);
  };

  // Create base component
  const baseComponent = createBaseComponent(renderMap)(normalizedProps);

  // Extended API
  return {
    ...baseComponent,

    /**
     * Update map from Google Maps URL
     */
    setGoogleMapsUrl(url) {
      const updates = {};
      const placeId = extractPlaceId(url);
      const coords = extractCoordinates(url);
      const locationName = extractLocationName(url);

      if (placeId) updates.placeId = placeId;
      if (coords) Object.assign(updates, coords);
      if (locationName) updates.title = locationName;

      return this.update(updates);
    },

    /**
     * Set Google Places ID
     */
    setPlaceId(placeId) {
      return this.update({ placeId });
    },

    /**
     * Update map coordinates
     */
    setCoordinates(lat, lng) {
      return this.update({
        latitude: parseCoordinate(lat, DEFAULT_COORDS.lat),
        longitude: parseCoordinate(lng, DEFAULT_COORDS.lng),
      });
    },

    /**
     * Get map instance (modern)
     */
    getMapInstance() {
      const element = this.getElement();
      return element?._mapInstance || null;
    },

    /**
     * Get marker instance (modern)
     */
    getMarkerInstance() {
      const element = this.getElement();
      return element?._markerInstance || null;
    },
  };
};

export default createMap;
