// src/components/RatingSection/RatingSection.js
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { ratingSectionStyles } from './RatingSection.styles.js';

// Component dependencies
import Section from '../Section/Section.js';
import Rating from '../Rating/Rating.js';
import Image from '../Image/Image.js';
import Grid from '../Grid/Grid.js';

// Create style injector
const injectRatingSectionStyles = createStyleInjector('RatingSection');

// Constants
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// In-memory cache for API responses
const apiCache = new Map();

// Mock data for development and demo purposes
const mockData = {
  google: {
    source: 'google',
    score: 4.7,
    totalRatings: 1234,
    name: 'mucHANDY Handy Reparatur München',
    address: 'Rosenheimer Str. 145, 81671 München',
    reviewerImages: [
      'https://picsum.photos/40/40',
      'https://picsum.photos/40/40',
      'https://picsum.photos/40/40',
    ],
  },
  facebook: {
    source: 'facebook',
    score: 4.5,
    totalRatings: 987,
    name: 'mucHANDY München',
    address: 'Rosenheimer Str. 145, München',
    reviewerImages: [
      'https://picsum.photos/40/40',
      'https://picsum.photos/40/40',
      'https://picsum.photos/40/40',
    ],
  },
};

/**
 * Load API config with fallback (lazy loading for testing compatibility)
 * @returns {Promise<Object>} API configuration
 */
const loadApiConfig = async () => {
  try {
    const { apiConfig } = await import('../../config/api.config.local.js');
    console.log('🔑 RatingSection: Using local API config');
    return apiConfig;
  } catch {
    try {
      const { apiConfig } = await import('../../config/api.config.js');
      console.log('🌍 RatingSection: Using production API config');
      return apiConfig;
    } catch {
      console.warn('⚠️ RatingSection: No API config found, using mock data');
      return { googleMaps: {}, facebook: {} };
    }
  }
};

/**
 * Fetch data from cache or API
 * @param {string} cacheKey - Unique cache key
 * @param {Function} fetchFunction - Function to fetch data
 * @returns {Promise} Cached or fresh data
 */
const getCachedData = async (cacheKey, fetchFunction) => {
  const cached = apiCache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const data = await fetchFunction();
    apiCache.set(cacheKey, { data, timestamp: now });
    return data;
  } catch (error) {
    // Return cached data if available, even if expired
    if (cached) {
      console.warn(
        `[RatingSection] API failed for ${cacheKey}, using cached data:`,
        error
      );
      return cached.data;
    }
    throw error;
  }
};

/**
 * Check if API key is valid (not a placeholder)
 * @param {string} key - API key to validate
 * @returns {boolean} Whether key is valid
 */
const isValidApiKey = (key) => {
  const invalidKeys = [
    'YOUR_GOOGLE_MAPS_API_KEY',
    'YOUR_ACTUAL_API_KEY_HERE',
    'YOUR_API_KEY',
    'API_KEY_HERE',
    '',
  ];
  return key && !invalidKeys.includes(key);
};

/**
 * Fetch Google Places rating data with caching
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} Google rating data
 */
const fetchGoogleRating = (placeId) =>
  getCachedData(`google_${placeId}`, async () => {
    const apiConfig = await loadApiConfig();
    const hasValidKey = isValidApiKey(apiConfig.googleMaps?.apiKey);

    if (!hasValidKey) {
      console.log('🔑 RatingSection: No valid Google API key, using mock data');
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockData.google;
    }

    console.warn(
      '[RatingSection] Direct Google API calls blocked by CORS. Use backend proxy in production.'
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockData.google;
  });

/**
 * Fetch Facebook page rating data with caching
 * @param {string} pageId - Facebook Page ID
 * @returns {Promise<Object>} Facebook rating data
 */
const fetchFacebookRating = (pageId) =>
  getCachedData(`facebook_${pageId}`, async () => {
    const apiConfig = await loadApiConfig();
    const hasValidToken = isValidApiKey(apiConfig.facebook?.accessToken);

    if (!hasValidToken) {
      console.log('🔑 RatingSection: No valid Facebook token, using mock data');
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return mockData.facebook;
    }

    console.warn(
      '[RatingSection] Direct Facebook API calls blocked by CORS. Use backend proxy in production.'
    );
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return mockData.facebook;
  });

/**
 * Create loading state element
 * @param {string} platform - Platform name (google/facebook)
 * @returns {HTMLElement} Loading element
 */
const createLoadingElement = (platform) => {
  const loadingContainer = createElement('div', {
    classes: ['rating-section__loading'],
  });

  const spinner = createElement('div', {
    classes: ['rating-section__spinner'],
  });

  const text = createElement('span', {
    classes: ['rating-section__loading-text'],
    textContent: `Lade ${platform === 'google' ? 'Google' : 'Facebook'} Bewertungen...`,
  });

  loadingContainer.appendChild(spinner);
  loadingContainer.appendChild(text);

  return loadingContainer;
};

/**
 * Create error state element
 * @param {string} platform - Platform name
 * @param {Error} error - Error object
 * @returns {HTMLElement} Error element
 */
const createErrorElement = (platform, _error) => {
  const errorContainer = createElement('div', {
    classes: ['rating-section__error'],
  });

  const icon = createElement('span', {
    classes: ['rating-section__error-icon'],
    textContent: '⚠️',
  });

  const message = createElement('span', {
    classes: ['rating-section__error-text'],
    textContent: `${platform === 'google' ? 'Google' : 'Facebook'} Bewertungen konnten nicht geladen werden.`,
  });

  errorContainer.appendChild(icon);
  errorContainer.appendChild(message);

  return errorContainer;
};

/**
 * Creates a RatingSection component with 3 columns using Grid
 * @param {Object} props - Component properties
 * @param {string} props.googlePlaceId - Google Place ID for fetching ratings
 * @param {string} props.facebookPageId - Facebook Page ID for fetching ratings
 * @param {string} [props.wertgarantieImageUrl] - URL for Wertgarantie logo
 * @param {string} [props.title] - Section title
 * @param {boolean} [props.showWertgarantie=true] - Whether to show Wertgarantie logo
 * @param {Function} [props.onLoadComplete] - Callback when all data is loaded
 * @param {Function} [props.onError] - Callback when errors occur
 * @returns {Object} RatingSection component
 */
const createRatingSection = (props = {}) => {
  // Validate required props
  if (!props.googlePlaceId && !props.facebookPageId) {
    throw new Error(
      'RatingSection: Either googlePlaceId or facebookPageId is required'
    );
  }

  // Normalize props with defaults
  const normalizedProps = {
    title: 'Bewertungen',
    showWertgarantie: true,
    wertgarantieImageUrl: 'https://picsum.photos/200/80',
    ...props,
  };

  /**
   * Create rating column with async data loading
   * @param {string} platform - Platform (google/facebook)
   * @param {string} id - Platform ID
   * @param {Object} state - Component state
   * @returns {Object} Grid column with rating
   */
  const createRatingColumn = (platform, id, state) => {
    const content = createLoadingElement(platform);
    const column = Grid.Column({
      width: 4,
      mobileWidth: 12,
      children: content,
    });

    // Fetch data based on platform
    const fetchFunction =
      platform === 'google' ? fetchGoogleRating : fetchFacebookRating;

    fetchFunction(id)
      .then((data) => {
        const rating = Rating(data);
        column.update({ children: rating.getElement() });

        if (typeof state.onLoadComplete === 'function') {
          state.onLoadComplete(platform, data);
        }
      })
      .catch((error) => {
        console.error(`[RatingSection] ${platform} API error:`, error);
        const errorElement = createErrorElement(platform, error);
        column.update({ children: errorElement });

        if (typeof state.onError === 'function') {
          state.onError(platform, error);
        }
      });

    return column;
  };

  /**
   * Create Wertgarantie column
   * @param {Object} state - Component state
   * @returns {Object} Grid column with Wertgarantie logo
   */
  const createWertgarantieColumn = (state) => {
    const wertgarantieImage = Image({
      imageUrl: state.wertgarantieImageUrl,
      alt: 'Wertgarantie Siegel',
      className: 'rating-section__wertgarantie-logo',
      responsive: true,
    });

    return Grid.Column({
      width: 4,
      mobileWidth: 12,
      children: wertgarantieImage.getElement(),
    });
  };

  /**
   * Render the rating section using Grid
   * @param {Object} state - Component state
   * @returns {HTMLElement} Section element
   */
  const renderRatingSection = (state) => {
    // Inject styles
    injectRatingSectionStyles(ratingSectionStyles);

    // Create grid with columns
    const grid = Grid({
      gap: '1rem',
      alignItems: 'center',
    });

    // Add columns based on configuration
    const columns = [
      state.googlePlaceId &&
        createRatingColumn('google', state.googlePlaceId, state),
      state.facebookPageId &&
        createRatingColumn('facebook', state.facebookPageId, state),
      state.showWertgarantie && createWertgarantieColumn(state),
    ].filter(Boolean);

    columns.forEach((column) => grid.appendChild(column.getElement()));

    // Create section with grid as children
    const section = Section({
      title: state.title,
      className: 'rating-section',
      children: grid.getElement(),
    });

    return section.getElement();
  };

  // Create base component
  const baseComponent =
    createBaseComponent(renderRatingSection)(normalizedProps);

  // Create extended component with additional methods
  const extendedComponent = {
    ...baseComponent,

    /**
     * Refresh ratings data
     * @returns {Promise} Promise that resolves when refresh is complete
     */
    async refresh() {
      const state = baseComponent.getState
        ? baseComponent.getState()
        : normalizedProps;

      // Clear cache for this component's data
      [
        state.googlePlaceId && `google_${state.googlePlaceId}`,
        state.facebookPageId && `facebook_${state.facebookPageId}`,
      ]
        .filter(Boolean)
        .forEach((key) => apiCache.delete(key));

      // Re-render component
      baseComponent.update({});
      // Override baseComponent methods to return extendedComponent for chaining
      extendedComponent.update = (newProps) => {
        baseComponent.update(newProps);
        return extendedComponent;
      };

      return extendedComponent;
    },

    /**
     * Update Google Place ID and refresh data
     * @param {string} placeId - New Google Place ID
     * @returns {Object} Component for chaining
     */
    setGooglePlaceId(placeId) {
      baseComponent.update({ googlePlaceId: placeId });
      return extendedComponent;
    },

    /**
     * Update Facebook Page ID and refresh data
     * @param {string} pageId - New Facebook Page ID
     * @returns {Object} Component for chaining
     */
    setFacebookPageId(pageId) {
      baseComponent.update({ facebookPageId: pageId });
      return extendedComponent;
    },

    /**
     * Toggle Wertgarantie logo visibility
     * @param {boolean} show - Whether to show the logo
     * @returns {Object} Component for chaining
     */
    setShowWertgarantie(show) {
      baseComponent.update({ showWertgarantie: show });
      return extendedComponent;
    },

    /**
     * Get current cache status
     * @returns {Object} Cache information
     */
    getCacheStatus() {
      const state = baseComponent.getState
        ? baseComponent.getState()
        : normalizedProps;
      const now = Date.now();

      const getCacheInfo = (key) => {
        const cached = apiCache.get(key);
        return cached
          ? {
              cached: true,
              age: now - cached.timestamp,
              expired: now - cached.timestamp > CACHE_DURATION,
            }
          : { cached: false, age: null, expired: false };
      };

      return {
        google: state.googlePlaceId
          ? getCacheInfo(`google_${state.googlePlaceId}`)
          : null,
        facebook: state.facebookPageId
          ? getCacheInfo(`facebook_${state.facebookPageId}`)
          : null,
      };
    },
  };

  return extendedComponent;
};

// Required props for validation
createRatingSection.requiredProps = ['googlePlaceId|facebookPageId'];

export default createRatingSection;
