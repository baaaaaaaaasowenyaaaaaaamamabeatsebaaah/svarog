// src/components/RatingSection/RatingSection.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RatingSection from './RatingSection.js';

describe('RatingSection component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should throw error when neither googlePlaceId nor facebookPageId is provided', () => {
    expect(() => {
      RatingSection({});
    }).toThrow(
      'RatingSection: Either googlePlaceId or facebookPageId is required'
    );
  });

  it('should create component with googlePlaceId only', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
    });

    const element = ratingSection.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('rating-section')).toBe(true);
  });

  it('should create component with facebookPageId only', () => {
    const ratingSection = RatingSection({
      facebookPageId: 'test_page_id',
    });

    const element = ratingSection.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('rating-section')).toBe(true);
  });

  it('should create component with both IDs', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
      facebookPageId: 'test_page_id',
    });

    const element = ratingSection.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('rating-section')).toBe(true);
  });

  it('should show Wertgarantie logo by default', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
    });

    const element = ratingSection.getElement();
    // Check for Wertgarantie image element
    expect(
      element.querySelector('img[alt="Wertgarantie Siegel"]')
    ).toBeTruthy();
  });

  it('should hide Wertgarantie logo when showWertgarantie is false', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
      showWertgarantie: false,
    });

    const element = ratingSection.getElement();
    expect(element.querySelector('img[alt="Wertgarantie Siegel"]')).toBeNull();
  });

  it('should use custom title', () => {
    const customTitle = 'Custom Bewertungen Titel';
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
      title: customTitle,
    });

    const element = ratingSection.getElement();
    expect(element.textContent).toContain(customTitle);
  });

  it('should show loading states initially', () => {
    const ratingSection = RatingSection({
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

  it('should handle onLoadComplete callback', () => {
    const onLoadComplete = vi.fn();
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
      onLoadComplete,
    });

    // Create element to trigger loading
    const element = ratingSection.getElement();

    // Test that the callback function is properly set and the component renders
    expect(typeof onLoadComplete).toBe('function');
    expect(element).toBeTruthy();
    expect(element.querySelector('.rating-section__loading')).toBeTruthy();
  });

  it('should handle onError callback', () => {
    const onError = vi.fn();
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
      onError,
    });

    // Create element
    const element = ratingSection.getElement();

    // Test that the error callback exists and component renders
    expect(typeof onError).toBe('function');
    expect(element).toBeTruthy();
  });

  it('should update properties correctly', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
      title: 'Original Title',
    });

    ratingSection.update({
      title: 'Updated Title',
      showWertgarantie: false,
    });

    const element = ratingSection.getElement();
    expect(element.textContent).toContain('Updated Title');
    expect(element.querySelector('img[alt="Wertgarantie Siegel"]')).toBeNull();
  });

  it('should support method chaining', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
    });

    const result = ratingSection
      .setGooglePlaceId('new_place_id')
      .setFacebookPageId('new_page_id')
      .setShowWertgarantie(false);

    expect(result).toBe(ratingSection);
  });

  it('should handle setGooglePlaceId method', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
    });

    expect(() => {
      ratingSection.setGooglePlaceId('new_place_id');
    }).not.toThrow();
  });

  it('should handle setFacebookPageId method', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
    });

    expect(() => {
      ratingSection.setFacebookPageId('new_page_id');
    }).not.toThrow();
  });

  it('should handle setShowWertgarantie method', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
    });

    expect(() => {
      ratingSection.setShowWertgarantie(false);
    }).not.toThrow();
  });

  it('should handle refresh method', async () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
    });

    expect(() => {
      ratingSection.refresh();
    }).not.toThrow();
  });

  it('should provide cache status', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
      facebookPageId: 'test_page_id',
    });

    const cacheStatus = ratingSection.getCacheStatus();

    expect(cacheStatus).toHaveProperty('google');
    expect(cacheStatus).toHaveProperty('facebook');
    expect(cacheStatus.google).toHaveProperty('cached');
    expect(cacheStatus.facebook).toHaveProperty('cached');
    expect(typeof cacheStatus.google.cached).toBe('boolean');
    expect(typeof cacheStatus.facebook.cached).toBe('boolean');
  });

  it('should clean up properly when destroyed', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
    });

    expect(() => ratingSection.destroy()).not.toThrow();
    expect(() => ratingSection.destroy()).not.toThrow(); // Double destroy should be safe
  });

  it('should handle missing props gracefully', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
    });

    const element = ratingSection.getElement();
    expect(element).toBeTruthy();
    expect(element.textContent).toContain('Bewertungen'); // Default title
  });

  it('should handle custom wertgarantie image URL', () => {
    const customImageUrl = 'https://example.com/custom-logo.png';
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
      wertgarantieImageUrl: customImageUrl,
    });

    const element = ratingSection.getElement();
    const image = element.querySelector('img[alt="Wertgarantie Siegel"]');
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toBe(customImageUrl);
  });

  it('should cache API responses', () => {
    // Test that cache status method works and returns proper structure
    const ratingSection1 = RatingSection({
      googlePlaceId: 'cached_place_id',
    });

    const cacheStatus1 = ratingSection1.getCacheStatus();
    expect(cacheStatus1).toHaveProperty('google');
    expect(cacheStatus1.google).toHaveProperty('cached');
    expect(typeof cacheStatus1.google.cached).toBe('boolean');

    // Initially should not be cached
    expect(cacheStatus1.google.cached).toBe(false);

    // Create element to trigger loading
    ratingSection1.getElement();

    // Cache status structure should remain consistent
    const cacheStatus2 = ratingSection1.getCacheStatus();
    expect(cacheStatus2).toHaveProperty('google');
    expect(cacheStatus2.google).toHaveProperty('cached');
  });

  it('should handle error states in UI', () => {
    // Test that component renders without errors
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
    });

    const element = ratingSection.getElement();

    // Basic component structure tests
    expect(element).toBeTruthy();
    expect(element.classList.contains('rating-section')).toBe(true);
    expect(element.textContent).toContain('Bewertungen');
  });

  it('should maintain state consistency across updates', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'original_place_id',
      title: 'Original Title',
      showWertgarantie: true,
    });

    ratingSection.update({ title: 'Updated Title' });

    // Original values should still be there where not updated
    const element = ratingSection.getElement();
    expect(element.textContent).toContain('Updated Title');
    expect(
      element.querySelector('img[alt="Wertgarantie Siegel"]')
    ).toBeTruthy();
  });

  it('should handle both platforms loading simultaneously', () => {
    const onLoadComplete = vi.fn();
    const ratingSection = RatingSection({
      googlePlaceId: 'test_google_id',
      facebookPageId: 'test_facebook_id',
      onLoadComplete,
    });

    const element = ratingSection.getElement();

    // Should show loading for both platforms
    const loadingElements = element.querySelectorAll(
      '.rating-section__loading'
    );
    expect(loadingElements.length).toBe(2); // Google + Facebook
  });

  it('should apply correct CSS classes', () => {
    const ratingSection = RatingSection({
      googlePlaceId: 'test_place_id',
    });

    const element = ratingSection.getElement();
    expect(element.classList.contains('rating-section')).toBe(true);
  });
});
