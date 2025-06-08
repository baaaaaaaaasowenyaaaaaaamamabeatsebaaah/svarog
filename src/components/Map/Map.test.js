// src/components/Map/Map.test.js - Modern API Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Map from './Map.js';

describe('Map component - Modern API', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should create map container with default location', () => {
    const map = Map({});
    const mapElement = map.getElement();

    expect(mapElement).toBeTruthy();
    expect(mapElement.classList.contains('map-container')).toBe(true);
    expect(mapElement.textContent).toContain('Location');
    expect(mapElement.textContent).toContain('48.141726');
    expect(mapElement.textContent).toContain('11.560982');
  });

  it('should handle specific coordinates', () => {
    const map = Map({
      latitude: 37.7749,
      longitude: -122.4194,
      title: 'San Francisco',
    });

    const mapElement = map.getElement();

    expect(mapElement).toBeTruthy();
    expect(mapElement.textContent).toContain('San Francisco');
    expect(mapElement.textContent).toContain('37.774900');
    expect(mapElement.textContent).toContain('-122.419400');
  });

  it('should handle place ID', () => {
    const map = Map({
      placeId: 'ChIJ9ZsAL_p1nkcRaVYZabonLbg',
      title: 'Test Place',
    });

    const mapElement = map.getElement();

    expect(mapElement).toBeTruthy();
    expect(mapElement.textContent).toContain('Test Place');
    expect(mapElement.textContent).toContain('ChIJ9ZsAL_p1nkcRaVYZabonLbg');
  });

  it('should fallback to default coordinates when no location provided', () => {
    const map = Map({});
    const mapElement = map.getElement();

    expect(mapElement.textContent).toContain('48.141726');
    expect(mapElement.textContent).toContain('11.560982');
  });

  it('should handle invalid coordinates gracefully', () => {
    const map = Map({ latitude: 'invalid', longitude: 'invalid' });
    const mapElement = map.getElement();

    expect(mapElement).toBeTruthy();
    expect(mapElement.textContent).toContain('Location');
    expect(mapElement.textContent).toContain('48.141726');
    expect(mapElement.textContent).toContain('11.560982');
  });

  it('should clean up resources when destroyed', () => {
    const map = Map({});
    expect(() => map.destroy()).not.toThrow();
    expect(() => map.destroy()).not.toThrow(); // Double destroy should be safe
  });

  it('should handle setCoordinates method', () => {
    const map = Map({});

    let mapElement = map.getElement();
    expect(mapElement.textContent).toContain('48.141726');

    map.setCoordinates(34.0522, -118.2437);
    map.update({ title: 'Los Angeles' });

    mapElement = map.getElement();
    expect(mapElement.textContent).toContain('Los Angeles');
    expect(mapElement.textContent).toContain('34.052200');
    expect(mapElement.textContent).toContain('-118.243700');
  });

  it('should display title correctly', () => {
    const map = Map({
      latitude: 51.5074,
      longitude: -0.1278,
      title: 'London',
    });

    const mapElement = map.getElement();
    expect(mapElement.textContent).toContain('London');
  });

  it('should handle title prop correctly', () => {
    const map = Map({
      latitude: 55.7558,
      longitude: 37.6173,
      title: 'Moscow',
    });

    const mapElement = map.getElement();
    expect(mapElement.textContent).toContain('Moscow');
  });

  it('should extract data from Google Maps URL', () => {
    const map = Map({
      googleMapsUrl:
        'https://maps.google.com/maps?q=@48.8566,2.3522&place_id=ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
    });

    const mapElement = map.getElement();
    expect(mapElement.textContent).toContain('48.856600');
    expect(mapElement.textContent).toContain('2.352200');
    expect(mapElement.textContent).toContain('ChIJD7fiBh9u5kcRYJSMaMOCCwQ');
  });

  it('should handle shop info', () => {
    const map = Map({
      latitude: 48.1371,
      longitude: 11.5754,
      title: 'Test Shop',
      shopInfo: {
        address: '123 Test Street',
        phone: '+49 123 456789',
        hours: 'Mon-Fri: 9AM-6PM',
      },
    });

    const mapElement = map.getElement();
    expect(mapElement.textContent).toContain('Test Shop');
    expect(mapElement.textContent).toContain('123 Test Street');
    expect(mapElement.textContent).toContain('+49 123 456789');
    expect(mapElement.textContent).toContain('Mon-Fri: 9AM-6PM');
  });

  it('should handle setGoogleMapsUrl method', () => {
    const map = Map({});

    map.setGoogleMapsUrl(
      'https://maps.google.com/maps/place/Berlin/@52.5200,13.4050'
    );
    const mapElement = map.getElement();

    expect(mapElement.textContent).toContain('Berlin');
    expect(mapElement.textContent).toContain('52.520000');
    expect(mapElement.textContent).toContain('13.405000');
  });

  it('should handle setPlaceId method', () => {
    const map = Map({});

    map.setPlaceId('ChIJAAAAAAAAAARYJSMaMOCCwQ');
    const mapElement = map.getElement();

    expect(mapElement.textContent).toContain('ChIJAAAAAAAAAARYJSMaMOCCwQ');
  });

  it('should validate API keys correctly', () => {
    const invalidKeys = [
      'YOUR_GOOGLE_MAPS_API_KEY',
      'YOUR_ACTUAL_API_KEY_HERE',
      'YOUR_API_KEY',
      'API_KEY_HERE',
      '',
      null,
      undefined,
      'short',
    ];

    invalidKeys.forEach((key) => {
      const map = Map({ apiKey: key, title: 'Test Location' });
      const mapElement = map.getElement();

      expect(mapElement.classList.contains('map-container--mock')).toBe(true);
      expect(mapElement.textContent).toContain('Map Preview Mode');
    });
  });

  it('should handle modern script loading', () => {
    const map = Map({
      apiKey: 'valid_api_key_12345',
      title: 'Test Location',
    });
    const mapElement = map.getElement();

    // Should create live map container
    expect(mapElement.classList.contains('map-container--live')).toBe(true);
    expect(mapElement.textContent).toContain('Loading map');
  });

  it('should handle update method correctly', () => {
    const map = Map({ title: 'Initial Location' });
    let mapElement = map.getElement();

    expect(mapElement.textContent).toContain('Initial Location');

    map.update({
      title: 'Updated Location',
      latitude: 40.7128,
      longitude: -74.006,
    });

    mapElement = map.getElement();
    expect(mapElement.textContent).toContain('Updated Location');
    expect(mapElement.textContent).toContain('40.712800');
    expect(mapElement.textContent).toContain('-74.006000');
  });

  it('should handle missing props gracefully', () => {
    const map = Map({});
    const mapElement = map.getElement();

    expect(mapElement).toBeTruthy();
    expect(mapElement.classList.contains('map-container')).toBe(true);
    expect(mapElement.textContent).toContain('Location');
  });

  it('should extract location name from Google Maps URL', () => {
    const map = Map({
      googleMapsUrl:
        'https://maps.google.com/maps/place/Eiffel+Tower/@48.8584,2.2945',
    });

    const mapElement = map.getElement();
    expect(mapElement.textContent).toContain('Eiffel Tower');
  });

  it('should handle complex shop info', () => {
    const map = Map({
      title: 'Test Business',
      shopInfo: {
        name: 'My Business Name',
        address: '123 Main Street, City 12345',
        phone: '+1 (555) 123-4567',
        hours: 'Mon-Fri: 9AM-5PM, Sat: 10AM-2PM',
        website: 'https://example.com',
      },
    });

    const mapElement = map.getElement();
    expect(mapElement.textContent).toContain('Test Business');
    expect(mapElement.textContent).toContain('123 Main Street, City 12345');
    expect(mapElement.textContent).toContain('+1 (555) 123-4567');
    expect(mapElement.textContent).toContain('Mon-Fri: 9AM-5PM, Sat: 10AM-2PM');
  });

  it('should maintain state consistency across updates', () => {
    const map = Map({
      title: 'Original',
      latitude: 48.1,
      longitude: 11.5,
    });

    const initialState = map.getState();
    expect(initialState.title).toBe('Original');
    expect(initialState.latitude).toBe(48.1);

    map.update({ title: 'Updated' });

    const updatedState = map.getState();
    expect(updatedState.title).toBe('Updated');
    expect(updatedState.latitude).toBe(48.1);
    expect(updatedState.longitude).toBe(11.5);
  });

  it('should handle modern API callbacks', () => {
    const onMapLoad = vi.fn();
    const onError = vi.fn();

    const map = Map({
      apiKey: 'valid_api_key_12345',
      title: 'Test Location',
      onMapLoad,
      onError,
    });

    expect(map.getElement()).toBeTruthy();
    // Note: Callbacks would be called during actual Google Maps loading
  });

  it('should provide modern API access methods', () => {
    const map = Map({ title: 'Test Location' });

    // Should have modern API methods
    expect(typeof map.getMapInstance).toBe('function');
    expect(typeof map.getMarkerInstance).toBe('function');

    // Should return null when map not loaded
    expect(map.getMapInstance()).toBeNull();
    expect(map.getMarkerInstance()).toBeNull();
  });

  it('should handle modern prop names consistently', () => {
    const map = Map({
      title: 'Modern Location',
      latitude: 48.8566,
      longitude: 2.3522,
      autoOpenInfo: false,
      options: {
        zoom: 18,
        mapType: 'satellite',
      },
    });

    const state = map.getState();
    expect(state.title).toBe('Modern Location');
    expect(state.autoOpenInfo).toBe(false);
    expect(state.options.zoom).toBe(18);
    expect(state.options.mapType).toBe('satellite');
  });
});
