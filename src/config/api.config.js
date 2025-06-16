// src/config/api.config.js
// Production API configuration - uses environment variables
// Safe for Git repository

export const apiConfig = {
  // Google APIs configuration
  googleMaps: {
    apiKey: '', // Set via environment variables or local config
    libraries: ['places', 'geometry'],
    region: 'DE', // Germany
    language: 'de', // German
    endpoints: {
      places: 'https://maps.googleapis.com/maps/api/place',
      geocoding: 'https://maps.googleapis.com/maps/api/geocode',
    },
  },

  // Facebook Graph API configuration
  facebook: {
    accessToken: '', // Set via environment variables or local config
    appId: '', // Set via environment variables or local config
    version: 'v18.0',
    endpoints: {
      graph: 'https://graph.facebook.com',
    },
  },

  // Rate limiting and caching
  rateLimit: {
    // Requests per minute
    google: 1000,
    facebook: 600,
  },

  // Cache settings
  cache: {
    // Duration in milliseconds
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    ratingsTTL: 15 * 60 * 1000, // 15 minutes for ratings
    maxSize: 100, // Maximum cache entries
  },

  // Timeouts
  timeouts: {
    default: 10000, // 10 seconds
    google: 8000, // 8 seconds
    facebook: 12000, // 12 seconds
  },

  // Development/production settings
  isDevelopment: false,

  // Debug settings
  debug: {
    logRequests: false,
    logResponses: false,
    mockResponses: false,
  },
};
