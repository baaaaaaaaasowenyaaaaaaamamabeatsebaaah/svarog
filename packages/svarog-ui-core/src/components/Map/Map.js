// src/components/Map/Map.js
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

/**
 * Creates a Map component with Google Maps integration
 * @param {Object} props - Map properties
 * @returns {Object} Map component
 */
const createMap = (props = {}) => {
  // Utilities
  const isValidApiKey = (key) =>
    key &&
    typeof key === 'string' &&
    key.length > 10 &&
    !INVALID_KEYS.includes(key);

  const isGoogleMapsLoaded = () =>
    typeof window !== 'undefined' && window.google?.maps;

  const parseCoordinate = (value, defaultValue) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  const extractFromUrl = (url, patterns) => {
    if (!url) return null;
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const extractPlaceId = (url) => {
    const placeId = extractFromUrl(url, [
      /place_id=([A-Za-z0-9_-]+)/,
      /data=[^/]*!1s([A-Za-z0-9_-]+)/,
      /place\/[^/]+\/[^/]+\/[^/]+\/[^/]+!1s([^!]+)/,
      /ftid=([^&]+)/,
    ]);

    if (placeId?.includes(':')) {
      console.warn(
        '[Map] Old place ID format detected. Place details may not load.'
      );
      return null;
    }
    return placeId;
  };

  const extractCoordinates = (url) => {
    const match = url?.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    return match
      ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) }
      : null;
  };

  const extractLocationName = (url) => {
    const match = url?.match(/place\/([^/@]+)/);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
  };

  // Normalize props
  const normalizeProps = (inputProps) => {
    const normalized = { ...inputProps };

    if (!isValidApiKey(normalized.apiKey)) {
      normalized.apiKey &&
        console.warn('[Map] Invalid API key detected. Using mock mode.');
      delete normalized.apiKey;
    }

    if (normalized.googleMapsUrl) {
      const placeId = extractPlaceId(normalized.googleMapsUrl);
      const coords = extractCoordinates(normalized.googleMapsUrl);
      const locationName = extractLocationName(normalized.googleMapsUrl);

      if (placeId) normalized.placeId = placeId;
      if (coords) Object.assign(normalized, coords);
      if (locationName && !normalized.locationName)
        normalized.locationName = locationName;
    }

    // Validate coordinates
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
  const createInfoContent = (type, data) => {
    const templates = {
      basic: (config) => `
        <div class="map-info-window">
          ${config.locationName || config.shopInfo?.name ? `<h3>${config.shopInfo?.name || config.locationName}</h3>` : ''}
          ${
            config.shopInfo
              ? Object.entries({
                  address: '📍',
                  phone: '📞',
                  website: '🌐',
                  hours: '🕐',
                })
                  .map(([key, icon]) =>
                    config.shopInfo[key]
                      ? `<p>${icon} ${
                          key === 'website'
                            ? `<a href="${config.shopInfo[key]}" target="_blank">Website</a>`
                            : config.shopInfo[key]
                        }</p>`
                      : ''
                  )
                  .join('')
              : ''
          }
        </div>`,

      places: (details) => `
        <div class="map-info-window map-info-window--places">
          <div class="map-info-header">
            ${details.name ? `<h3 class="map-info-title">${details.name}</h3>` : ''}
            ${
              details.openNow !== undefined
                ? `<span class="map-info-status map-info-status--${details.openNow ? 'open' : 'closed'}">
                ${details.openNow ? 'Open' : 'Closed'}</span>`
                : ''
            }
          </div>
          ${details.rating ? `<div class="map-info-rating">${'⭐'.repeat(Math.round(details.rating))} ${details.rating}/5</div>` : ''}
          <div class="map-info-content">
            ${details.address ? `<p class="map-info-address">📍 ${details.address}</p>` : ''}
            ${details.phone ? `<p class="map-info-phone">📞 <a href="tel:${details.phone}">${details.phone}</a></p>` : ''}
            ${
              details.website
                ? `<p class="map-info-website">🌐 <a href="${details.website}" target="_blank" rel="noopener">
              ${details.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a></p>`
                : ''
            }
            ${
              details.hours
                ? `
              <details class="map-info-hours-details">
                <summary>🕐 Opening Hours</summary>
                <div class="map-info-hours">${details.hours}</div>
              </details>`
                : ''
            }
          </div>
        </div>`,
    };

    return templates[type](data);
  };

  /**
   * Create mock map element
   */
  const createMockMapElement = (config) => {
    const content = `
      <div class="map-mock-background"></div>
      <div class="map-mock-overlay">
        <div class="map-mock-pin">📍</div>
        <div class="map-mock-details">
          <h3>${config.locationName || 'Location'}</h3>
          <p class="map-coords">
            Latitude: ${config.latitude.toFixed(6)}<br>
            Longitude: ${config.longitude.toFixed(6)}
          </p>
          ${config.placeId ? `<p class="map-place-info"><small>Place ID: ${config.placeId}</small></p>` : ''}
          ${
            config.shopInfo
              ? Object.entries({ address: '📍', phone: '📞', hours: '🕐' })
                  .map(([key, icon]) =>
                    config.shopInfo[key]
                      ? `<p>${icon} ${config.shopInfo[key]}</p>`
                      : ''
                  )
                  .join('')
              : ''
          }
          <div class="map-mock-notice">
            <p>📍 Map Preview Mode</p>
            <small>Add a Google Maps API key to see interactive map</small>
          </div>
        </div>
      </div>`;

    return createElement('div', {
      classes: ['map-container', 'map-container--mock'],
      html: content,
    });
  };

  /**
   * Load Google Maps script
   */
  const loadGoogleMapsScript = async (apiKey) => {
    if (typeof window === 'undefined')
      throw new Error('Google Maps requires a browser environment');
    if (isGoogleMapsLoaded()) return;

    const existingScript = document.querySelector('#google-maps-script');
    if (existingScript) {
      return new Promise((resolve, reject) => {
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
      });
    }

    return new Promise((resolve, reject) => {
      const script = createElement('script', {
        attributes: {
          id: 'google-maps-script',
          src: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`,
          async: true,
          defer: true,
        },
      });

      script.addEventListener('load', resolve);
      script.addEventListener('error', () =>
        reject(new Error('Failed to load Google Maps'))
      );
      document.head.appendChild(script);
    });
  };

  /**
   * Initialize Google Map
   */
  const initializeGoogleMap = async (container, config) => {
    try {
      await loadGoogleMapsScript(config.apiKey);
      if (!isGoogleMapsLoaded()) throw new Error('Google Maps failed to load');

      const { maps } = window.google;
      const position = { lat: config.latitude, lng: config.longitude };

      const map = new maps.Map(container, {
        center: position,
        zoom: config.options.zoom,
        mapTypeId: config.options.mapType,
      });

      const marker = new maps.Marker({
        position,
        map,
        title: config.locationName,
      });

      container._mapInstance = map;
      container._markerInstance = marker;

      // Setup info window
      const setupInfoWindow = (content) => {
        const infoWindow = new maps.InfoWindow({ content, maxWidth: 400 });
        if (config.autoOpenInfo) infoWindow.open(map, marker);
        marker.addListener('click', () => infoWindow.open(map, marker));
      };

      // Basic info window
      if (config.shopInfo || config.locationName) {
        setupInfoWindow(createInfoContent('basic', config));
      }

      // Try to get place details
      if (config.placeId && !config.placeId.includes(':')) {
        try {
          const service = new maps.places.PlacesService(map);
          service.getDetails(
            {
              placeId: config.placeId,
              fields: [
                'name',
                'formatted_address',
                'geometry',
                'rating',
                'opening_hours',
                'formatted_phone_number',
                'website',
              ],
            },
            (place, status) => {
              if (status === maps.places.PlacesServiceStatus.OK && place) {
                if (place.geometry?.location) {
                  marker.setPosition(place.geometry.location);
                  map.setCenter(place.geometry.location);
                }

                const details = {
                  name: place.name,
                  address: place.formatted_address,
                  phone: place.formatted_phone_number,
                  website: place.website,
                  rating: place.rating,
                  openNow: place.opening_hours?.isOpen?.(),
                  hours: place.opening_hours?.weekday_text?.join('<br>'),
                };

                setupInfoWindow(createInfoContent('places', details));
              }
            }
          );
        } catch (error) {
          console.warn('[Map] Could not fetch place details:', error);
        }
      }
    } catch (error) {
      console.error('[Map] Failed to initialize:', error);
      container.innerHTML = '';
      container.appendChild(createMockMapElement(config));
    }
  };

  /**
   * Create live map element
   */
  const createLiveMapElement = (config) => {
    const container = createElement('div', {
      classes: ['map-container', 'map-container--live'],
      html: '<div class="map-loading">Loading map...</div>',
    });

    if (typeof window !== 'undefined') {
      initializeGoogleMap(container, config);
    }

    return container;
  };

  /**
   * Render the map
   */
  const renderMap = (state) => {
    injectMapStyles(mapStyles);

    const config = {
      apiKey: state.apiKey,
      locationName: state.locationName || 'Location',
      latitude: state.latitude,
      longitude: state.longitude,
      placeId: state.placeId,
      shopInfo: state.shopInfo,
      autoOpenInfo: state.autoOpenInfo !== false,
      options: {
        zoom: state.options?.zoom || DEFAULT_ZOOM,
        mapType: state.options?.mapType || 'roadmap',
      },
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

    setGoogleMapsUrl(url) {
      const updates = {};
      const placeId = extractPlaceId(url);
      const coords = extractCoordinates(url);
      const locationName = extractLocationName(url);

      if (placeId) updates.placeId = placeId;
      if (coords) Object.assign(updates, coords);
      if (locationName) updates.locationName = locationName;

      return this.update(updates);
    },

    setPlaceId(placeId) {
      return this.update({ placeId });
    },

    setCoordinates(lat, lng) {
      return this.update({
        latitude: parseCoordinate(lat, DEFAULT_COORDS.lat),
        longitude: parseCoordinate(lng, DEFAULT_COORDS.lng),
      });
    },
  };
};

export default createMap;
