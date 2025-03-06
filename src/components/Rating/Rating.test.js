import { describe, it, expect } from 'vitest';
import Rating from './Rating.js';

describe('Rating', () => {
  const baseConfig = {
    source: 'google',
    score: 4.7,
    totalRatings: 1234,
  };

  it('should render correctly with required parameters', () => {
    const rating = new Rating(baseConfig);
    const ratingElement = rating.getElement();

    // Check container exists
    expect(ratingElement).not.toBeNull();
    expect(ratingElement.classList.contains('rating')).toBe(true);
    expect(ratingElement.classList.contains('rating--google')).toBe(true);
  });

  it('should throw an error if source is missing', () => {
    expect(() => {
      new Rating({
        score: 4.7,
        totalRatings: 1234,
      });
    }).toThrow('Rating: source is required');
  });

  it('should throw an error if score is missing', () => {
    expect(() => {
      new Rating({
        source: 'google',
        totalRatings: 1234,
      });
    }).toThrow('Rating: score is required');
  });

  it('should throw an error if totalRatings is missing', () => {
    expect(() => {
      new Rating({
        source: 'google',
        score: 4.7,
      });
    }).toThrow('Rating: totalRatings is required');
  });

  it('should format large numbers correctly', () => {
    const tests = [
      { input: 999, expected: '999' },
      { input: 1000, expected: '1.0K' },
      { input: 1234, expected: '1.2K' },
      { input: 1000000, expected: '1.0M' },
    ];

    tests.forEach((test) => {
      const rating = new Rating({
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
      const rating = new Rating({
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
    const ratingWithImages = new Rating({
      source: 'google',
      score: 4.7,
      totalRatings: 1234,
      reviewerImages: images,
    });

    let reviewerImagesElement = ratingWithImages
      .getElement()
      .querySelector('.rating__reviewer-images');
    expect(reviewerImagesElement).not.toBeNull();

    const defaultMaxImages = ratingWithImages
      .getElement()
      .querySelectorAll('.rating__reviewer-image').length;
    expect(defaultMaxImages).toBe(3);

    // Test with custom max images
    const ratingWithLimitedImages = new Rating({
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
    const ratingWithoutImages = new Rating({
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
});
