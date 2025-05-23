// src/components/Map/Map.test.js
import { describe, it, expect, vi } from 'vitest';
import Map from './Map.js';

describe('Map component', () => {
  it('should create map container with default location', () => {
    const map = Map({});
    const mapElement = map.getElement();

    expect(mapElement).toBeTruthy();
    expect(mapElement.classList.contains('map-container')).toBe(true);
    expect(mapElement.textContent).toContain('New York City');
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
    expect(mapElement.textContent).toContain('37.7749');
    expect(mapElement.textContent).toContain('-122.4194');
  });

  it('should use store ID', () => {
    const map = Map({
      storeId: 'default',
    });

    const mapElement = map.getElement();

    expect(mapElement).toBeTruthy();
    expect(mapElement.textContent).toContain('Sample Store');
  });

  it('should fallback to default coordinates when no location provided', () => {
    const map = Map({});
    const mapElement = map.getElement();

    expect(mapElement.textContent).toContain('40.7128');
    expect(mapElement.textContent).toContain('-74.0060');
  });

  it('should throw error for invalid coordinates', () => {
    expect(() => {
      Map({ latitude: 'invalid' });
    }).toThrow('latitude must be a number');
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

  it('should handle setLocation method', () => {
    const map = Map({});

    // First check the initial state
    let mapElement = map.getElement();
    expect(mapElement.textContent).toContain('New York City');

    // Now update the location
    map.setLocation(34.0522, -118.2437, 'Los Angeles');

    // We need to get the element again after update
    mapElement = map.getElement();
    expect(mapElement.textContent).toContain('Los Angeles');
    expect(mapElement.textContent).toContain('34.0522');
    expect(mapElement.textContent).toContain('-118.2437');
  });

  it('should support legacy "location" prop for backward compatibility', () => {
    const map = Map({
      latitude: 51.5074,
      longitude: -0.1278,
      location: 'London',
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

  it('should log warning when using deprecated location prop', () => {
    // Mock console.warn
    const originalWarn = console.warn;
    console.warn = vi.fn();

    Map({
      location: 'Berlin',
    });

    expect(console.warn).toHaveBeenCalledWith(
      'Map: "location" prop is deprecated, use "locationName" instead'
    );

    // Restore console.warn
    console.warn = originalWarn;
  });
});
