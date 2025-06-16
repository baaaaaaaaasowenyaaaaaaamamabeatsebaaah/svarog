// src/components/RatingSection/RatingSection.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RatingSection from './RatingSection.js';

// Mock the API config - try local first, fallback to production
let mockApiConfig;
try {
  mockApiConfig = {
    apiConfig: {
      googleMaps: {
        apiKey: 'test_google_api_key',
      },
      facebook: {
        accessToken: 'test_facebook_token',
      },
    },
  };
} catch {
  mockApiConfig = {
    apiConfig: {
      googleMaps: { apiKey: '' },
      facebook: { accessToken: '' },
    },
  };
}

// Mock the config imports
vi.mock('../../config/api.config.local.js', () => mockApiConfig);
vi.mock('../../config/api.config.js', () => mockApiConfig);

// Mock fetch globally
global.fetch = vi.fn();

describe('RatingSection component', () => {
  let testComponents = [];

  beforeEach(() => {
    vi.clearAllMocks();
    testComponents = [];
    // Clear any cached data by creating and destroying a dummy component
    const _dummyComponent = RatingSection({ googlePlaceId: 'test' });
    _dummyComponent.destroy();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    // Clean up all components created during tests
    testComponents.forEach((component) => {
      try {
        component.destroy();
      } catch (e) {
        // Component may already be destroyed
      }
    });
    testComponents = [];
  });

  // Helper function to register components for cleanup
  const createTestComponent = (props) => {
    const component = RatingSection(props);
    testComponents.push(component);
    return component;
  };

  it('should throw error when neither googlePlaceId nor facebookPageId is provided', () => {
    expect(() => {
      RatingSection({});
    }).toThrow(
      'RatingSection: Either googlePlaceId or facebookPageId is required'
    );
  });

  it('should create component with googlePlaceId only', () => {
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
    });

    const element = ratingSection.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('.rating-section')).toBeTruthy();
    expect(element.querySelector('.rating-section__rows')).toBeTruthy();
  });

  it('should create component with facebookPageId only', () => {
    const ratingSection = createTestComponent({
      facebookPageId: 'test_page_id',
    });

    const element = ratingSection.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('.rating-section')).toBeTruthy();
  });

  it('should create component with both IDs', () => {
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
      facebookPageId: 'test_page_id',
    });

    const element = ratingSection.getElement();
    expect(element).toBeInstanceOf(HTMLElement);

    // Should have rows for both platforms
    const rows = element.querySelectorAll('.rating-section__row');
    expect(rows.length).toBeGreaterThanOrEqual(2); // Google + Facebook (+ Wertgarantie if enabled)
  });

  it('should show Wertgarantie logo by default', () => {
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
    });

    const element = ratingSection.getElement();
    expect(
      element.querySelector('.rating-section__row--wertgarantie')
    ).toBeTruthy();
  });

  it('should hide Wertgarantie logo when showWertgarantie is false', () => {
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
      showWertgarantie: false,
    });

    const element = ratingSection.getElement();
    expect(
      element.querySelector('.rating-section__row--wertgarantie')
    ).toBeNull();
  });

  it('should use custom title', () => {
    const customTitle = 'Custom Bewertungen Titel';
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
      title: customTitle,
    });

    const element = ratingSection.getElement();
    expect(element.textContent).toContain(customTitle);
  });

  it('should show loading states initially', () => {
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
      facebookPageId: 'test_page_id',
    });

    const element = ratingSection.getElement();

    // Should show loading elements
    const loadingElements = element.querySelectorAll(
      '.rating-section__loading'
    );
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should handle successful Google API response', async () => {
    const mockGoogleResponse = {
      status: 'OK',
      result: {
        name: 'Test Business',
        rating: 4.5,
        user_ratings_total: 123,
        formatted_address: 'Test Address',
        photos: [{ photo_reference: 'photo1' }, { photo_reference: 'photo2' }],
      },
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockGoogleResponse),
    });

    const onLoadComplete = vi.fn();
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
      onLoadComplete,
    });

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('maps.googleapis.com/maps/api/place/details/json')
    );

    // Should call onLoadComplete with the expected data structure
    expect(onLoadComplete).toHaveBeenCalledWith(
      'google',
      expect.objectContaining({
        source: 'google',
        score: 4.5,
        totalRatings: 123,
        name: 'Test Business',
      })
    );
  });

  it('should handle successful Facebook API response', async () => {
    const mockFacebookResponse = {
      name: 'Test Facebook Page',
      overall_star_rating: 4.2,
      rating_count: 456,
      location: {
        street: 'Test Street',
        city: 'Test City',
      },
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFacebookResponse),
    });

    const onLoadComplete = vi.fn();
    const ratingSection = createTestComponent({
      facebookPageId: 'test_page_id',
      onLoadComplete,
    });

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('graph.facebook.com/v18.0/')
    );

    expect(onLoadComplete).toHaveBeenCalledWith(
      'facebook',
      expect.objectContaining({
        source: 'facebook',
        score: 4.2,
        totalRatings: 456,
        name: 'Test Facebook Page',
      })
    );
  });

  it('should handle API errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const onError = vi.fn();
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
      onError,
    });

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(onError).toHaveBeenCalledWith('google', expect.any(Error));

    const element = ratingSection.getElement();
    expect(element.querySelector('.rating-section__error')).toBeTruthy();
  });

  it('should handle Google API error status', async () => {
    const mockErrorResponse = {
      status: 'INVALID_REQUEST',
      error_message: 'Invalid place ID',
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockErrorResponse),
    });

    const onError = vi.fn();
    const ratingSection = createTestComponent({
      googlePlaceId: 'invalid_place_id',
      onError,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(onError).toHaveBeenCalledWith('google', expect.any(Error));
  });

  it('should handle Facebook API error response', async () => {
    const mockErrorResponse = {
      error: {
        message: 'Invalid access token',
        code: 190,
      },
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockErrorResponse),
    });

    const onError = vi.fn();
    const ratingSection = createTestComponent({
      facebookPageId: 'test_page_id',
      onError,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(onError).toHaveBeenCalledWith('facebook', expect.any(Error));
  });

  it('should update properties correctly', () => {
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
      title: 'Original Title',
    });

    ratingSection.update({
      title: 'Updated Title',
      showWertgarantie: false,
    });

    const element = ratingSection.getElement();
    expect(element.textContent).toContain('Updated Title');
    expect(
      element.querySelector('.rating-section__row--wertgarantie')
    ).toBeNull();
  });

  it('should support method chaining', () => {
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
    });

    const result = ratingSection
      .setGooglePlaceId('new_place_id')
      .setFacebookPageId('new_page_id')
      .setShowWertgarantie(false);

    expect(result).toBe(ratingSection);
  });

  it('should handle refresh method', async () => {
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
    });

    // Mock successful refresh
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          status: 'OK',
          result: {
            name: 'Refreshed Business',
            rating: 5.0,
            user_ratings_total: 999,
          },
        }),
    });

    await ratingSection.refresh();

    // Should have made a new API call
    expect(fetch).toHaveBeenCalled();
  });

  it('should provide cache status', () => {
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
      facebookPageId: 'test_page_id',
    });

    const cacheStatus = ratingSection.getCacheStatus();

    expect(cacheStatus).toHaveProperty('google');
    expect(cacheStatus).toHaveProperty('facebook');
    expect(cacheStatus.google).toHaveProperty('cached');
    expect(cacheStatus.facebook).toHaveProperty('cached');
  });

  it('should clean up properly when destroyed', () => {
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
    });

    expect(() => ratingSection.destroy()).not.toThrow();
  });

  it('should handle missing API configuration gracefully', async () => {
    // Mock missing API key
    vi.doMock('../../config/api.config.js', () => ({
      apiConfig: {
        googleMaps: { apiKey: '' },
        facebook: { accessToken: '' },
      },
    }));

    const onError = vi.fn();
    const ratingSection = createTestComponent({
      googlePlaceId: 'test_place_id',
      onError,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(onError).toHaveBeenCalledWith('google', expect.any(Error));
  });

  it('should cache API responses', async () => {
    const mockResponse = {
      status: 'OK',
      result: {
        name: 'Cached Business',
        rating: 4.8,
        user_ratings_total: 789,
      },
    };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    // First call
    const ratingSection1 = createTestComponent({
      googlePlaceId: 'cached_place_id',
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Second call with same place ID
    const ratingSection2 = createTestComponent({
      googlePlaceId: 'cached_place_id',
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should only have made one API call due to caching
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
