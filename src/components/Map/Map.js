import './Map.css';

export default class Map {
  constructor({
    apiKey = null, // Change to nullable
    location,
    latitude,
    longitude,
    storeId,
    options = {},
  }) {
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

    // Store configuration
    this.config = {
      apiKey,
      location: resolvedLocation,
      latitude: resolvedLatitude,
      longitude: resolvedLongitude,
      options: {
        zoom: options.zoom || 12,
        mapType: options.mapType || 'roadmap',
      },
    };

    // Create map element
    this.mapElement = apiKey
      ? this.createLiveMapElement()
      : this.createMockMapElement();
  }

  /**
   * Create a live Google Maps element
   * @returns {HTMLElement} Live map container
   */
  createLiveMapElement() {
    const container = document.createElement('div');
    container.className = 'map-container map-container--live';

    // Load Google Maps script if not already loaded
    if (typeof google === 'undefined') {
      this.loadGoogleMapsScript(() => this.initializeLiveMap(container));
    } else {
      this.initializeLiveMap(container);
    }

    return container;
  }

  /**
   * Load Google Maps JavaScript API
   * @param {Function} callback - Callback to execute after script loads
   */
  loadGoogleMapsScript(callback) {
    if (document.querySelector('#google-maps-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (callback) callback();
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps API');
      this.createMockMapElement();
    };

    document.head.appendChild(script);
  }

  /**
   * Initialize live Google Map
   * @param {HTMLElement} container - Map container
   */
  initializeLiveMap(container) {
    try {
      const mapOptions = {
        center: {
          lat: this.config.latitude,
          lng: this.config.longitude,
        },
        zoom: this.config.options.zoom,
        mapTypeId: this.config.options.mapType,
      };

      const map = new google.maps.Map(container, mapOptions);

      // Add marker
      new google.maps.Marker({
        position: {
          lat: this.config.latitude,
          lng: this.config.longitude,
        },
        map: map,
        title: this.config.location,
      });
    } catch (error) {
      console.error('Error initializing live map:', error);
      container.innerHTML = this.createMockMapElement().innerHTML;
    }
  }

  /**
   * Create a mock map element
   * @returns {HTMLElement} Mock map container element
   */
  createMockMapElement() {
    const container = document.createElement('div');
    container.className = 'map-container map-container--mock';

    container.innerHTML = `
      <div class="map-mock-overlay">
        <div class="map-mock-pin"></div>
        <div class="map-mock-details">
          <h3>${this.config.location}</h3>
          <p>Latitude: ${this.config.latitude.toFixed(4)}</p>
          <p>Longitude: ${this.config.longitude.toFixed(4)}</p>
          <small>${
            this.config.apiKey
              ? 'API Key Provided (Mock Fallback)'
              : 'Mock Map (No API Key)'
          }</small>
        </div>
      </div>
    `;

    return container;
  }

  /**
   * Get the map container element
   * @returns {HTMLElement} Map container element
   */
  getElement() {
    return this.mapElement;
  }
}
