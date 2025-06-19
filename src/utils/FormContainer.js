// src/utils/FormContainer.js

/**
 * Base class for form container components
 * Provides common form state management functionality
 */
export default class FormContainer {
  /**
   * Create a new FormContainer
   * @param {Object} service - API service instance
   * @param {Function} [onStateChange] - Callback for state changes
   */
  constructor(service, onStateChange) {
    this.service = service;
    this.onStateChange = onStateChange;

    // Initialize state
    this.state = {
      loading: {},
      error: {},
      data: {},
      selection: {},
    };
  }

  /**
   * Update component state
   * @param {Object} newState - New state to merge
   */
  setState(newState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };

    // Call state change callback if provided
    if (this.onStateChange) {
      this.onStateChange(this.state, prevState);
    }

    return this.state;
  }

  /**
   * Set loading state for a specific key
   * @param {string} key - Resource key
   * @param {boolean} loading - Whether the resource is loading
   */
  setLoading(key, loading) {
    return this.setState({
      loading: { ...this.state.loading, [key]: loading },
      error: { ...this.state.error, [key]: null }, // Clear errors when loading
    });
  }

  /**
   * Set error state for a specific key
   * @param {string} key - Resource key
   * @param {Error} error - Error object
   */
  setError(key, error) {
    return this.setState({
      loading: { ...this.state.loading, [key]: false },
      error: { ...this.state.error, [key]: error.message },
    });
  }

  /**
   * Set data for a specific key
   * @param {string} key - Resource key
   * @param {*} data - Resource data
   */
  setData(key, data) {
    return this.setState({
      loading: { ...this.state.loading, [key]: false },
      data: { ...this.state.data, [key]: data },
    });
  }

  /**
   * Set selection for a specific key
   * @param {string} key - Selection key
   * @param {*} value - Selected value
   */
  setSelection(key, value) {
    return this.setState({
      selection: { ...this.state.selection, [key]: value },
    });
  }

  /**
   * DEPRECATED: Use loading() instead
   * @deprecated
   * @returns {boolean} Whether any resources are loading
   */
  isLoading() {
    console.warn(
      'FormContainer: isLoading() is deprecated, use loading() instead'
    );
    return this.loading();
  }

  /**
   * Check if any resources are loading
   * @returns {boolean} Whether any resources are loading
   */
  loading() {
    return Object.values(this.state.loading).some(Boolean);
  }

  /**
   * Check if any resources have errors
   * @returns {boolean} Whether any resources have errors
   */
  hasErrors() {
    return Object.values(this.state.error).some(Boolean);
  }

  /**
   * Generic fetch method with state management
   * @param {string} key - Resource key for state tracking
   * @param {Function} fetchFunc - Async function to fetch data
   * @returns {Promise<*>} Fetched data
   */
  async fetchResource(key, fetchFunc) {
    this.setLoading(key, true);

    try {
      const data = await fetchFunc();
      this.setData(key, data);
      return data;
    } catch (error) {
      this.setError(key, error);
      throw error;
    }
  }
}
