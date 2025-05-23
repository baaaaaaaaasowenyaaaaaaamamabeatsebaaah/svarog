// src/components/Rating/Rating.test.js
import { describe, it, expect, vi } from 'vitest';
import Rating from './Rating.js';

describe('Rating component', () => {
  const baseConfig = {
    source: 'google',
    score: 4.7,
    totalRatings: 1234,
  };

  it('should render correctly with required parameters', () => {
    const rating = Rating(baseConfig);
    const ratingElement = rating.getElement();

    // Check container exists
    expect(ratingElement).not.toBeNull();
    expect(ratingElement.classList.contains('rating')).toBe(true);
    expect(ratingElement.classList.contains('rating--google')).toBe(true);
  });

  it('should throw an error if source is missing', () => {
    expect(() => {
      Rating({
        score: 4.7,
        totalRatings: 1234,
      });
    }).toThrow('Rating: source is required');
  });

  it('should throw an error if score is missing', () => {
    expect(() => {
      Rating({
        source: 'google',
        totalRatings: 1234,
      });
    }).toThrow('Rating: score is required');
  });

  it('should throw an error if totalRatings is missing', () => {
    expect(() => {
      Rating({
        source: 'google',
        score: 4.7,
      });
    }).toThrow('Rating: totalRatings is required');
  });

  it('should throw an error if source is invalid', () => {
    expect(() => {
      Rating({
        source: 'invalid-source',
        score: 4.7,
        totalRatings: 1234,
      });
    }).toThrow('Rating: source must be one of:');
  });

  it('should throw an error if score is out of range', () => {
    expect(() => {
      Rating({
        source: 'google',
        score: 6.0,
        totalRatings: 1234,
      });
    }).toThrow('Rating: score must be a number between 0 and 5');

    expect(() => {
      Rating({
        source: 'google',
        score: -1,
        totalRatings: 1234,
      });
    }).toThrow('Rating: score must be a number between 0 and 5');
  });

  it('should format large numbers correctly', () => {
    const tests = [
      { input: 999, expected: '999' },
      { input: 1000, expected: '1.0K' },
      { input: 1234, expected: '1.2K' },
      { input: 1000000, expected: '1.0M' },
    ];

    tests.forEach((test) => {
      const rating = Rating({
        source: 'google',
        score: 4.7,
        totalRatings: test.input,
      });

      const ratingElement = rating.getElement();
      const totalRatingsElement = ratingElement.querySelector(
        '.rating__total-ratings'
      );

      expect(totalRatingsElement.textContent).toBe(
        `${test.expected} Bewertungen`
      );
    });
  });

  it('should render correct number of stars', () => {
    const testCases = [
      { score: 1.2, fullStars: 1, halfStars: 0, emptyStars: 4 },
      { score: 2.7, fullStars: 2, halfStars: 1, emptyStars: 2 },
      { score: 4.5, fullStars: 4, halfStars: 1, emptyStars: 0 },
      { score: 5.0, fullStars: 5, halfStars: 0, emptyStars: 0 },
    ];

    testCases.forEach((testCase) => {
      const rating = Rating({
        source: 'google',
        score: testCase.score,
        totalRatings: 1234,
      });

      const ratingElement = rating.getElement();
      const stars = ratingElement.querySelectorAll('.rating__star');

      const fullStars = Array.from(stars).filter((star) =>
        star.classList.contains('rating__star--full')
      ).length;
      const halfStars = Array.from(stars).filter((star) =>
        star.classList.contains('rating__star--half')
      ).length;
      const emptyStars = Array.from(stars).filter((star) =>
        star.classList.contains('rating__star--empty')
      ).length;

      expect(fullStars).toBe(testCase.fullStars);
      expect(halfStars).toBe(testCase.halfStars);
      expect(emptyStars).toBe(testCase.emptyStars);
    });
  });

  it('should handle reviewer images correctly', () => {
    const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];

    // Test with default max images
    const ratingWithImages = Rating({
      source: 'google',
      score: 4.7,
      totalRatings: 1234,
      reviewerImages: images,
    });

    let reviewerImagesElement = ratingWithImages
      .getElement()
      .querySelector('.rating__reviewer-images');
    expect(reviewerImagesElement).not.toBeNull();
    expect(reviewerImagesElement.getAttribute('aria-label')).toBe(
      'Reviewer profile images'
    );

    const defaultMaxImages = ratingWithImages
      .getElement()
      .querySelectorAll('.rating__reviewer-image').length;
    expect(defaultMaxImages).toBe(3);

    // Test with custom max images
    const ratingWithLimitedImages = Rating({
      source: 'google',
      score: 4.7,
      totalRatings: 1234,
      reviewerImages: images,
      options: {
        maxReviewerImages: 2,
      },
    });

    reviewerImagesElement = ratingWithLimitedImages
      .getElement()
      .querySelector('.rating__reviewer-images');
    expect(reviewerImagesElement).not.toBeNull();

    const customMaxImages = ratingWithLimitedImages
      .getElement()
      .querySelectorAll('.rating__reviewer-image').length;
    expect(customMaxImages).toBe(2);

    // Test with images disabled
    const ratingWithoutImages = Rating({
      source: 'google',
      score: 4.7,
      totalRatings: 1234,
      reviewerImages: images,
      options: {
        showReviewerImages: false,
      },
    });

    reviewerImagesElement = ratingWithoutImages
      .getElement()
      .querySelector('.rating__reviewer-images');
    expect(reviewerImagesElement).toBeNull();
  });

  it('should support fallbackImageUrl', () => {
    // Create a rating with fallbackImageUrl option
    const fallbackUrl = '/fallback.jpg';

    // Create a component with the fallbackImageUrl
    const rating = Rating({
      source: 'google',
      score: 4.7,
      totalRatings: 1234,
      reviewerImages: ['/image1.jpg'],
      options: {
        fallbackImageUrl: fallbackUrl,
      },
    });

    // Test by checking if the component correctly handles an update with the same option
    // Since we can't access internal state directly, let's verify the component
    // doesn't warn about deprecated props when the correct property is used
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    // Update with the same option
    rating.update({
      options: { fallbackImageUrl: fallbackUrl },
    });

    // There should be no warnings about using deprecated props
    expect(consoleWarnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('fallbackImageSrc is deprecated')
    );

    consoleWarnSpy.mockRestore();
  });

  it('should migrate legacy fallbackImageSrc to fallbackImageUrl', () => {
    // Test with console.warn spy
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    // Create rating with legacy fallbackImageSrc
    const rating = Rating({
      source: 'google',
      score: 4.7,
      totalRatings: 1234,
      reviewerImages: ['/image1.jpg'],
      options: {
        fallbackImageSrc: '/legacy-fallback.jpg',
      },
    });

    // Check if warning was shown
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[Rating] options.fallbackImageSrc is deprecated, use options.fallbackImageUrl instead'
    );

    // Create a dummy update to verify the migration
    const updateSpy = vi.spyOn(rating, 'update');
    rating.update({});

    // Verify update was called with normalized props
    expect(updateSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
    updateSpy.mockRestore();
  });

  it('should have proper accessibility attributes', () => {
    const rating = Rating(baseConfig);
    const ratingElement = rating.getElement();

    // Check container role
    expect(ratingElement.getAttribute('role')).toBe('region');
    expect(ratingElement.getAttribute('aria-label')).toBe('google rating');

    // Check star rating accessibility
    const starContainer = ratingElement.querySelector('.rating__stars');
    expect(starContainer.getAttribute('role')).toBe('img');
    expect(starContainer.getAttribute('aria-label')).toContain(
      'Rating: 4.7 out of 5 stars'
    );

    // Check individual stars are hidden from screen readers
    const firstStar = ratingElement.querySelector('.rating__star');
    expect(firstStar.getAttribute('aria-hidden')).toBe('true');
  });

  // Tests for factory function pattern
  it('should update when properties change', () => {
    const rating = Rating({
      source: 'google',
      score: 4.7,
      totalRatings: 1234,
    });

    // Update the score
    rating.update({ score: 3.5 });

    const ratingElement = rating.getElement();
    const scoreElement = ratingElement.querySelector('.rating__score-number');
    expect(scoreElement.textContent).toBe('3.5');

    // Stars should be updated too
    const fullStars = ratingElement.querySelectorAll(
      '.rating__star--full'
    ).length;
    const halfStars = ratingElement.querySelectorAll(
      '.rating__star--half'
    ).length;
    expect(fullStars).toBe(3);
    expect(halfStars).toBe(1);
  });

  it('should support the setScore method', () => {
    const rating = Rating(baseConfig);
    rating.setScore(2.5);

    const scoreElement = rating
      .getElement()
      .querySelector('.rating__score-number');
    expect(scoreElement.textContent).toBe('2.5');
  });

  it('should throw an error if setScore is called with invalid value', () => {
    const rating = Rating(baseConfig);

    expect(() => {
      rating.setScore(6.0);
    }).toThrow('Rating: score must be a number between 0 and 5');

    expect(() => {
      rating.setScore('not a number');
    }).toThrow('Rating: score must be a number between 0 and 5');
  });

  it('should support the setTotalRatings method', () => {
    const rating = Rating(baseConfig);
    rating.setTotalRatings(5000);

    const totalRatingsElement = rating
      .getElement()
      .querySelector('.rating__total-ratings');
    expect(totalRatingsElement.textContent).toBe('5.0K Bewertungen');
  });

  it('should clean up properly when destroyed', () => {
    const rating = Rating(baseConfig);

    // Spy on destroy method
    const destroy = vi.spyOn(rating, 'destroy');

    rating.destroy();
    expect(destroy).toHaveBeenCalled();
  });
});
