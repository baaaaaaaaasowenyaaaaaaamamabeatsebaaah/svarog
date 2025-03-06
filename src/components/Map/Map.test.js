import { describe, it, expect } from 'vitest';
import Map from './Map.js';

describe('Map', () => {
  it('should create map container with default location', () => {
    const map = new Map({});
    const mapElement = map.getElement();

    expect(mapElement).toBeTruthy();
    expect(mapElement.classList.contains('map-container')).toBe(true);
    expect(mapElement.textContent).toContain('New York City');
  });

  it('should handle specific coordinates', () => {
    const map = new Map({
      latitude: 37.7749,
      longitude: -122.4194,
      location: 'San Francisco',
    });

    const mapElement = map.getElement();

    expect(mapElement).toBeTruthy();
    expect(mapElement.textContent).toContain('San Francisco');
    expect(mapElement.textContent).toContain('37.7749');
    expect(mapElement.textContent).toContain('-122.4194');
  });

  it('should use store ID', () => {
    const map = new Map({
      storeId: 'default',
    });

    const mapElement = map.getElement();

    expect(mapElement).toBeTruthy();
    expect(mapElement.textContent).toContain('Sample Store');
  });

  it('should fallback to default coordinates when no location provided', () => {
    const map = new Map({});
    const mapElement = map.getElement();

    expect(mapElement.textContent).toContain('40.7128');
    expect(mapElement.textContent).toContain('-74.0060');
  });
});
