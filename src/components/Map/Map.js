/* global google */
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { mapStyles } from './Map.styles.js';

const injectMapStyles = createStyleInjector('Map');

// List of invalid API keys to detect
const INVALID_API_KEYS = [
  'YOUR_GOOGLE_MAPS_API_KEY',
  'YOUR_ACTUAL_API_KEY_HERE',
  'YOUR_API_KEY',
  'API_KEY_HERE',
  '',
  null,
  undefined,
];

/**
 * Creates a Map component with Google Maps integration
 * @param {Object} props - Map properties
 * @returns {Object} Map component
 */
const createMap = (props = {}) => {
  // Check if API key is valid
  const isValidApiKey = (key) => {
    return (
      key &&
      typeof key === 'string' &&
      key.length > 10 &&
      !INVALID_API_KEYS.includes(key)
    );
  };

  // Extract place ID from Google Maps URL
  const extractPlaceId = (url) => {
    if (!url) return null;

    // Try new format first (without colon)
    const newFormatMatch = url.match(/place_id=([A-Za-z0-9_-]+)/);
    if (newFormatMatch) return newFormatMatch[1];

    // Try data parameter format
    const dataMatch = url.match(/data=[^/]*!1s([A-Za-z0-9_-]+)/);
    if (dataMatch) return dataMatch[1];

    // Legacy formats (convert to new format if needed)
    const patterns = [
      /place\/[^/]+\/[^/]+\/[^/]+\/[^/]+!1s([^!]+)/,
      /ftid=([^&]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        // If it contains a colon, it's an old format - we can't use it
        if (match[1].includes(':')) {
          console.warn(
            '[Map] Old place ID format detected. Place details may not load.'
          );
          return null;
        }
        return match[1];
      }
    }

    return null;
  };

  // Extract coordinates from URL
  const extractCoordinates = (url) => {
    if (!url) return null;

    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
      };
    }

    return null;
  };

  // Extract location name from URL
  const extractLocationName = (url) => {
    if (!url) return null;

    const match = url.match(/place\/([^/@]+)/);
    if (match) {
      return decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    return null;
  };

  // Normalize props
  const normalizeProps = (inputProps) => {
    const normalized = { ...inputProps };

    // Validate API key
    if (!isValidApiKey(normalized.apiKey)) {
      if (normalized.apiKey) {
        console.warn('[Map] Invalid API key detected. Using mock mode.');
      }
      delete normalized.apiKey;
    }

    // Handle Google Maps URL
    if (normalized.googleMapsUrl) {
      const placeId = extractPlaceId(normalized.googleMapsUrl);
      if (placeId) normalized.placeId = placeId;

      const coords = extractCoordinates(normalized.googleMapsUrl);
      if (coords) {
        normalized.latitude = normalized.latitude || coords.latitude;
        normalized.longitude = normalized.longitude || coords.longitude;
      }

      const locationName = extractLocationName(normalized.googleMapsUrl);
      if (locationName && !normalized.locationName) {
        normalized.locationName = locationName;
      }
    }

    return normalized;
  };

  const normalizedProps = normalizeProps(props);

  /**
   * Create mock map element for development/no API key
   */
  const createMockMapElement = (config) => {
    const mockPin = createElement('div', {
      classes: ['map-mock-pin'],
      html: '📍',
    });

    const detailsHtml = [];

    // Title
    if (config.locationName) {
      detailsHtml.push(`<h3>${config.locationName}</h3>`);
    } else {
      detailsHtml.push(`<h3>Location</h3>`);
    }

    // Coordinates
    detailsHtml.push(
      `<p class="map-coords">`,
      `Latitude: ${config.latitude.toFixed(6)}<br>`,
      `Longitude: ${config.longitude.toFixed(6)}`,
      `</p>`
    );

    // Place ID if available
    if (config.placeId) {
      detailsHtml.push(
        `<p class="map-place-info">`,
        `<small>Place ID: ${config.placeId}</small>`,
        `</p>`
      );
    }

    // Shop info if provided
    if (config.shopInfo) {
      if (config.shopInfo.address) {
        detailsHtml.push(`<p>📍 ${config.shopInfo.address}</p>`);
      }
      if (config.shopInfo.phone) {
        detailsHtml.push(`<p>📞 ${config.shopInfo.phone}</p>`);
      }
      if (config.shopInfo.hours) {
        detailsHtml.push(`<p>🕐 ${config.shopInfo.hours}</p>`);
      }
    }

    // Development notice
    detailsHtml.push(
      `<div class="map-mock-notice">`,
      `<p>📍 Map Preview Mode</p>`,
      `<small>Add a Google Maps API key to see interactive map</small>`,
      `</div>`
    );

    const mockDetails = createElement('div', {
      classes: ['map-mock-details'],
      html: detailsHtml.join(''),
    });

    const mockOverlay = createElement('div', {
      classes: ['map-mock-overlay'],
      children: [mockPin, mockDetails],
    });

    // Background with gradient to simulate map
    const mockBackground = createElement('div', {
      classes: ['map-mock-background'],
    });

    return createElement('div', {
      classes: ['map-container', 'map-container--mock'],
      children: [mockBackground, mockOverlay],
    });
  };

  /**
   * Check if Google Maps is loaded
   */
  const isGoogleMapsLoaded = () => {
    return (
      typeof window !== 'undefined' &&
      typeof window.google !== 'undefined' &&
      typeof window.google.maps !== 'undefined'
    );
  };

  /**
   * Load Google Maps script
   */
  const loadGoogleMapsScript = async (config) => {
    if (typeof window === 'undefined') {
      throw new Error('Google Maps requires a browser environment');
    }

    // Check if already loaded
    if (isGoogleMapsLoaded()) {
      return;
    }

    // Check if script is already loading
    const existingScript = document.querySelector('#google-maps-script');
    if (existingScript) {
      return new Promise((resolve, reject) => {
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
      });
    }

    // Create and load script (without loading=async for legacy support)
    return new Promise((resolve, reject) => {
      const script = createElement('script', {
        attributes: {
          id: 'google-maps-script',
          src: `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places`,
          async: true,
          defer: true,
        },
      });

      script.addEventListener('load', resolve);
      script.addEventListener('error', () => {
        reject(new Error('Failed to load Google Maps'));
      });

      document.head.appendChild(script);
    });
  };

  /**
   * Initialize Google Map with legacy API
   */
  const initializeGoogleMap = async (container, config) => {
    try {
      // Load Google Maps if needed
      await loadGoogleMapsScript(config);

      // Double-check that google is available
      if (!isGoogleMapsLoaded()) {
        throw new Error('Google Maps failed to load');
      }

      // Get the global google object
      const googleMaps = window.google;

      // Create map
      const map = new googleMaps.maps.Map(container, {
        center: { lat: config.latitude, lng: config.longitude },
        zoom: config.options.zoom,
        mapTypeId: config.options.mapType,
      });

      // Create marker (using standard Marker for now)
      const marker = new googleMaps.maps.Marker({
        position: { lat: config.latitude, lng: config.longitude },
        map,
        title: config.locationName,
      });

      // Store instances
      container._mapInstance = map;
      container._markerInstance = marker;

      // Create basic info window without place details
      if (config.shopInfo || config.locationName) {
        const infoContent = createBasicInfoWindowContent(config);
        const infoWindow = new googleMaps.maps.InfoWindow({
          content: infoContent,
          maxWidth: 400,
        });

        if (config.autoOpenInfo) {
          infoWindow.open(map, marker);
        }

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }

      // If we have a valid place ID, try to get details
      if (config.placeId && !config.placeId.includes(':')) {
        try {
          const service = new googleMaps.maps.places.PlacesService(map);

          const request = {
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
          };

          service.getDetails(request, (place, status) => {
            if (
              status === googleMaps.maps.places.PlacesServiceStatus.OK &&
              place
            ) {
              // Update marker position if geometry available
              if (place.geometry && place.geometry.location) {
                marker.setPosition(place.geometry.location);
                map.setCenter(place.geometry.location);
              }

              // Update info window with place details
              const placeInfo = formatPlaceDetails(place);
              const infoContent = createPlacesInfoWindowContent(placeInfo);
              const infoWindow = new googleMaps.maps.InfoWindow({
                content: infoContent,
                maxWidth: 400,
              });

              if (config.autoOpenInfo) {
                infoWindow.open(map, marker);
              }

              marker.addListener('click', () => {
                infoWindow.open(map, marker);
              });
            }
          });
        } catch (error) {
          console.warn('[Map] Could not fetch place details:', error);
        }
      }
    } catch (error) {
      console.error('[Map] Failed to initialize:', error);
      // Replace with mock on error
      const mock = createMockMapElement(config);
      container.innerHTML = '';
      container.appendChild(mock);
    }
  };

  /**
   * Format place details from Places API
   */
  const formatPlaceDetails = (place) => {
    const details = {
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating,
    };

    // Format opening hours
    if (place.opening_hours) {
      details.openNow = place.opening_hours.isOpen
        ? place.opening_hours.isOpen()
        : false;
      if (place.opening_hours.weekday_text) {
        details.hours = place.opening_hours.weekday_text.join('<br>');
      }
    }

    return details;
  };

  /**
   * Create basic info window content
   */
  const createBasicInfoWindowContent = (config) => {
    const parts = [`<div class="map-info-window">`];

    if (config.locationName || config.shopInfo?.name) {
      parts.push(`<h3>${config.shopInfo?.name || config.locationName}</h3>`);
    }

    if (config.shopInfo) {
      if (config.shopInfo.address) {
        parts.push(`<p>📍 ${config.shopInfo.address}</p>`);
      }
      if (config.shopInfo.phone) {
        parts.push(`<p>📞 ${config.shopInfo.phone}</p>`);
      }
      if (config.shopInfo.website) {
        parts.push(
          `<p>🌐 <a href="${config.shopInfo.website}" target="_blank">Website</a></p>`
        );
      }
      if (config.shopInfo.hours) {
        parts.push(`<p>🕐 ${config.shopInfo.hours}</p>`);
      }
    }

    parts.push(`</div>`);
    return parts.join('');
  };

  /**
   * Create places info window content
   */
  const createPlacesInfoWindowContent = (details) => {
    const parts = [`<div class="map-info-window map-info-window--places">`];

    // Header
    parts.push(`<div class="map-info-header">`);
    if (details.name) {
      parts.push(`<h3 class="map-info-title">${details.name}</h3>`);
    }
    if (details.openNow !== undefined) {
      const statusClass = details.openNow ? 'open' : 'closed';
      const statusText = details.openNow ? 'Open' : 'Closed';
      parts.push(
        `<span class="map-info-status map-info-status--${statusClass}">${statusText}</span>`
      );
    }
    parts.push(`</div>`);

    // Rating
    if (details.rating) {
      const stars = '⭐'.repeat(Math.round(details.rating));
      parts.push(
        `<div class="map-info-rating">${stars} ${details.rating}/5</div>`
      );
    }

    // Contact info
    parts.push(`<div class="map-info-content">`);

    if (details.address) {
      parts.push(`<p class="map-info-address">📍 ${details.address}</p>`);
    }

    if (details.phone) {
      parts.push(
        `<p class="map-info-phone">📞 <a href="tel:${details.phone}">${details.phone}</a></p>`
      );
    }

    if (details.website) {
      const displayUrl = details.website
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '');
      parts.push(
        `<p class="map-info-website">🌐 <a href="${details.website}" target="_blank" rel="noopener">${displayUrl}</a></p>`
      );
    }

    // Opening hours
    if (details.hours) {
      parts.push(`<details class="map-info-hours-details">`);
      parts.push(`<summary>🕐 Opening Hours</summary>`);
      parts.push(`<div class="map-info-hours">${details.hours}</div>`);
      parts.push(`</details>`);
    }

    parts.push(`</div></div>`);
    return parts.join('');
  };

  /**
   * Create live map element
   */
  const createLiveMapElement = (config) => {
    const container = createElement('div', {
      classes: ['map-container', 'map-container--live'],
      html: '<div class="map-loading">Loading map...</div>',
    });

    // Initialize map asynchronously
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
      latitude: state.latitude || 48.1417262,
      longitude: state.longitude || 11.5609816,
      placeId: state.placeId,
      shopInfo: state.shopInfo,
      autoOpenInfo: state.autoOpenInfo !== false,
      options: {
        zoom: state.options?.zoom || 16,
        mapType: state.options?.mapType || 'roadmap',
      },
    };

    // Only use live map if we have a valid API key
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
      if (placeId) updates.placeId = placeId;

      const coords = extractCoordinates(url);
      if (coords) {
        updates.latitude = coords.latitude;
        updates.longitude = coords.longitude;
      }

      const locationName = extractLocationName(url);
      if (locationName) updates.locationName = locationName;

      return this.update(updates);
    },

    setPlaceId(placeId) {
      return this.update({ placeId });
    },

    setCoordinates(lat, lng) {
      return this.update({ latitude: lat, longitude: lng });
    },
  };
};

export default createMap;
