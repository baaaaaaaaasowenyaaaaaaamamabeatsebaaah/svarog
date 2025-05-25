// src/components/Rating/Rating.js
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';
import { validateRequiredProps } from '../../utils/validation.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { ratingStyles } from './Rating.styles.js';

// Create style injector for Rating component
const injectRatingStyles = createStyleInjector('Rating');

// SVG logos for different sources - defined outside the component for better performance
const LOGO_SVGS = {
  google: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Google logo">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.42 6.63v5.52h7.16c4.18-3.85 6.64-9.53 6.64-16.26z"/>
      <path fill="#34A853" d="M24 46c5.96 0 10.96-1.97 14.62-5.33l-7.16-5.52c-1.97 1.32-4.49 2.1-7.46 2.1-5.74 0-10.61-3.88-12.36-9.1H4.34v5.7C8.02 41.54 15.4 46 24 46z"/>
      <path fill="#FBBC05" d="M11.64 28.15c-.88-2.62-.88-5.47 0-8.1V14.35H4.34c-2.83 5.67-2.83 12.33 0 18l7.3-5.7z"/>
      <path fill="#EA4335" d="M24 9.5c3.25 0 6.18 1.18 8.48 3.48l6.36-6.36C34.96 2.54 29.96 0 24 0 15.4 0 8.02 4.46 4.34 11.35l7.3 5.7C13.39 13.38 18.26 9.5 24 9.5z"/>
    </svg>
  `,
  facebook: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Facebook logo">
      <path fill="#3F51B5" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4z"/>
      <path fill="#FFF" d="M26.57 35v-9.63h3.23l.48-3.75h-3.71v-2.4c0-1.09.3-1.83 1.86-1.83h2v-3.36c-.35-.05-1.54-.15-2.93-.15-2.9 0-4.89 1.77-4.89 5.02v2.79h-3.27v3.75h3.27V35h3.96z"/>
    </svg>
  `,
  trustpilot: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Trustpilot logo">
      <path fill="#00B67A" d="M24 4l5.49 16.88H47l-14.36 10.43 5.49 16.88L24 37.75l-14.13 10.44 5.49-16.88L1 20.88h17.51z"/>
    </svg>
  `,
};

// Valid sources for the rating component
const VALID_SOURCES = ['google', 'facebook', 'trustpilot'];

/**
 * Format large numbers with abbreviated notation
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Migrates legacy props to standardized props
 * @param {Object} props - Component props
 * @returns {Object} Normalized props
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  if (
    props.options?.fallbackImageSrc !== undefined &&
    !props.options?.fallbackImageUrl
  ) {
    console.warn(
      '[Rating] options.fallbackImageSrc is deprecated, use options.fallbackImageUrl instead'
    );
    migrated.options = {
      ...migrated.options,
      fallbackImageUrl: props.options.fallbackImageSrc,
    };
    // Keep fallbackImageSrc for backward compatibility
  }

  return migrated;
};

/**
 * Creates a Rating component for displaying ratings from various sources
 * @param {Object} props - Rating properties
 * @returns {Object} Rating component
 */
const createRating = (props) => {
  // Migrate legacy props
  const normalizedProps = migrateLegacyProps(props);

  // Validate required props
  validateRequiredProps(
    normalizedProps,
    {
      source: { type: 'string', required: true },
      score: { required: true },
      totalRatings: { required: true },
    },
    'Rating'
  );

  // Validate source
  const normalizedSource = normalizedProps.source.toLowerCase();
  if (!VALID_SOURCES.includes(normalizedSource)) {
    throw new Error(
      `Rating: source must be one of: ${VALID_SOURCES.join(', ')}`
    );
  }

  // Validate score range
  const score = parseFloat(normalizedProps.score);
  if (isNaN(score) || score < 0 || score > 5) {
    throw new Error('Rating: score must be a number between 0 and 5');
  }

  /**
   * Create source logo element
   * @param {string} source - Rating source
   * @returns {HTMLElement} Logo element with SVG
   */
  const createSourceLogo = (source) => {
    const logoContainer = createElement('div', {
      classes: [`rating__logo`, `rating__logo--${source}`],
    });

    // Create SVG element
    const svgElement = createElement('div', {
      classes: ['rating__logo-svg'],
      html: LOGO_SVGS[source] || LOGO_SVGS.google,
    });

    logoContainer.appendChild(svgElement);
    return logoContainer;
  };

  /**
   * Create star rating element
   * @param {number} score - Rating score
   * @returns {HTMLElement} Star rating element
   */
  const createStarRating = (score) => {
    const starContainer = createElement('div', {
      classes: ['rating__stars'],
      attributes: {
        role: 'img',
        'aria-label': `Rating: ${score} out of 5 stars`,
      },
    });

    // Calculate full, half, and empty stars
    const fullStars = Math.floor(score);
    const halfStar = score % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    // Create star elements
    const createStars = (type, count) => {
      for (let i = 0; i < count; i++) {
        const star = createElement('span', {
          classes: [`rating__star`, `rating__star--${type}`],
          text: '★',
          attributes: {
            'aria-hidden': 'true',
          },
        });
        starContainer.appendChild(star);
      }
    };

    createStars('full', fullStars);
    createStars('half', halfStar);
    createStars('empty', emptyStars);

    return starContainer;
  };

  /**
   * Create reviewer images element
   * @param {Array} images - Image URLs
   * @param {Object} options - Display options
   * @returns {HTMLElement|null} Reviewer images element
   */
  const createReviewerImages = (images, options) => {
    // Skip if images are disabled or empty
    if (!options.showReviewerImages || images.length === 0) {
      return null;
    }

    const imagesContainer = createElement('div', {
      classes: ['rating__reviewer-images'],
      attributes: {
        'aria-label': 'Reviewer profile images',
      },
    });

    // Limit number of images
    const imagesToShow = images.slice(0, options.maxReviewerImages);

    imagesToShow.forEach((imageUrl, index) => {
      const img = createElement('img', {
        attributes: {
          src: imageUrl,
          alt: `Reviewer profile ${index + 1}`,
        },
        classes: ['rating__reviewer-image'],
      });
      imagesContainer.appendChild(img);
    });

    return imagesContainer;
  };

  /**
   * Renders the rating element based on current state
   * @param {Object} state - Current component state
   * @returns {HTMLElement} Rating element
   */
  const renderRating = (state) => {
    // Inject styles on first render
    injectRatingStyles(ratingStyles);

    // Normalize and prepare data
    const source = state.source.toLowerCase();
    const score = parseFloat(state.score).toFixed(1);
    const totalRatings = formatNumber(state.totalRatings);
    const reviewerImages = state.reviewerImages || [];
    const options = {
      showReviewerImages: state.options?.showReviewerImages !== false,
      maxReviewerImages: state.options?.maxReviewerImages || 5,
      fallbackImageUrl:
        state.options?.fallbackImageUrl ||
        state.options?.fallbackImageSrc ||
        '',
    };

    // Create the main container
    const container = createElement('div', {
      classes: [`rating`, `rating--${source}`],
      attributes: {
        role: 'region',
        'aria-label': `${source} rating`,
      },
    });

    // Create score section
    const scoreSection = createElement('div', {
      classes: ['rating__score-section'],
    });

    // Add logo
    const logo = createSourceLogo(source);
    scoreSection.appendChild(logo);

    // Create score details
    const scoreDetails = createElement('div', {
      classes: ['rating__score-details'],
    });

    // Score number
    const scoreNumber = createElement('div', {
      classes: ['rating__score-number'],
      text: score,
    });
    scoreDetails.appendChild(scoreNumber);

    // Star rating
    const starRating = createStarRating(parseFloat(score));
    scoreDetails.appendChild(starRating);

    // Total ratings
    const totalRatingsElement = createElement('div', {
      classes: ['rating__total-ratings'],
      text: `${totalRatings} Bewertungen`,
    });
    scoreDetails.appendChild(totalRatingsElement);

    scoreSection.appendChild(scoreDetails);
    container.appendChild(scoreSection);

    // Add reviewer images if available
    const reviewerImagesElement = createReviewerImages(reviewerImages, options);
    if (reviewerImagesElement) {
      container.appendChild(reviewerImagesElement);
    }

    return container;
  };

  // Create component using baseComponent
  const baseComponent = createBaseComponent(renderRating)(normalizedProps);

  // Extended component with custom methods
  const ratingComponent = {
    ...baseComponent,

    update(props) {
      // Ensure legacy props are migrated
      const normalizedUpdateProps = migrateLegacyProps(props);
      // Call base update with normalized props
      return baseComponent.update(normalizedUpdateProps);
    },

    /**
     * Determines if component should fully re-render
     * @param {Object} newProps - New properties
     * @returns {boolean} Whether a full re-render is required
     */
    shouldRerender(newProps) {
      // Migrate legacy props before checking
      const normalizedNewProps = migrateLegacyProps(newProps);

      // Re-render if these critical props change
      const criticalProps = [
        'source',
        'score',
        'totalRatings',
        'reviewerImages',
        'options',
      ];
      return Object.keys(normalizedNewProps).some((key) =>
        criticalProps.includes(key)
      );
    },

    /**
     * Updates the rating score
     * @param {number} newScore - New score value
     * @returns {Object} Component for chaining
     * @throws {Error} If score is invalid
     */
    setScore(newScore) {
      const score = parseFloat(newScore);
      if (isNaN(score) || score < 0 || score > 5) {
        throw new Error('Rating: score must be a number between 0 and 5');
      }
      return this.update({ score });
    },

    /**
     * Updates the total ratings count
     * @param {number} newTotal - New total ratings
     * @returns {Object} Component for chaining
     */
    setTotalRatings(newTotal) {
      return this.update({ totalRatings: newTotal });
    },

    /**
     * Theme change handler
     * @param {string} newTheme - New theme name
     * @param {string} previousTheme - Previous theme name
     */
    onThemeChange(newTheme, previousTheme) {
      console.debug(
        `Rating: theme changed from ${previousTheme} to ${newTheme}`
      );
      // Theme-specific adjustments could be added here
    },
  };

  return ratingComponent;
};

// Define required props for validation
createRating.requiredProps = ['source', 'score', 'totalRatings'];

// Export as a factory function
export default createRating;
