// src/services/BaseService.js

/**
 * Base service class for API interactions
 */
export default class BaseService {
  /**
   * Creates a new BaseService instance
   * @param {Object} options - Configuration options
   * @param {string} [options.baseUrl='/api'] - Base URL for API requests
   */
  constructor({ baseUrl = '/api' } = {}) {
    this.baseUrl = baseUrl;
    this.cache = new Map(); // Simple request cache
  }

  /**
   * Generic fetch method with error handling and caching
   * @param {string} url - URL to fetch
   * @param {boolean} [useCache=true] - Whether to use cache
   * @returns {Promise<any>} Response data
   */
  async fetchData(url, useCache = true) {
    // Return cached response if available and caching is enabled
    if (useCache && this.cache.has(url)) {
      return this.cache.get(url);
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Cache the response
      if (useCache) {
        this.cache.set(url, data);
      }

      return data;
    } catch (error) {
      console.error(`API fetch error (${url}):`, error);
      throw error;
    }
  }

  /**
   * Clear cache for specific URL or all URLs
   * @param {string} [url] - Specific URL to clear, or all if not provided
   */
  clearCache(url) {
    if (url) {
      this.cache.delete(url);
    } else {
      this.cache.clear();
    }
  }
}
