// src/components/Map/Map.test.js
import { describe, it, expect, vi } from 'vitest';
import Map from './Map.js';

describe('Map component', () => {
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
      locationName: 'San Francisco',
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
      locationName: 'Test Place',
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
    // Should not throw, but use defaults instead
    const map = Map({ latitude: 'invalid', longitude: 'invalid' });
    const mapElement = map.getElement();

    expect(mapElement).toBeTruthy();
    expect(mapElement.textContent).toContain('Location');
  });

  it('should clean up resources when destroyed', () => {
    const map = Map({});

    // Mock console.debug to prevent output during test
    const originalDebug = console.debug;
    console.debug = vi.fn();

    map.destroy();

    // Restore console.debug
    console.debug = originalDebug;

    // Cannot directly test element removal since it's not in the DOM
    // but we can verify it doesn't throw errors
    expect(() => map.destroy()).not.toThrow();
  });

  it('should handle setCoordinates method', () => {
    const map = Map({});

    // First check the initial state
    let mapElement = map.getElement();
    expect(mapElement.textContent).toContain('48.141726');

    // Now update the location
    map.setCoordinates(34.0522, -118.2437);
    map.update({ locationName: 'Los Angeles' });

    // We need to get the element again after update
    mapElement = map.getElement();
    expect(mapElement.textContent).toContain('Los Angeles');
    expect(mapElement.textContent).toContain('34.052200');
    expect(mapElement.textContent).toContain('-118.243700');
  });

  it('should display location name correctly', () => {
    const map = Map({
      latitude: 51.5074,
      longitude: -0.1278,
      locationName: 'London',
    });

    const mapElement = map.getElement();
    expect(mapElement.textContent).toContain('London');
  });

  it('should handle locationName prop correctly', () => {
    const map = Map({
      latitude: 55.7558,
      longitude: 37.6173,
      locationName: 'Moscow',
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
      locationName: 'Test Shop',
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
});
