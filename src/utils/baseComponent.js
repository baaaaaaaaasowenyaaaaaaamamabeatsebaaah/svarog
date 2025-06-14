// src/utils/baseComponent.js

/**
 * Creates a base component with common functionality
 * @param {Function} renderFunction - Function that renders the component
 * @returns {Function} Component factory function
 */
export const createBaseComponent = (renderFunction) => {
  return (initialProps = {}) => {
    // Component state
    let state = { ...initialProps };
    let element = null;
    let destroyed = false;

    /**
     * Builds the component element
     * @returns {HTMLElement} Component element
     */
    const buildElement = () => {
      if (destroyed) return null;

      try {
        return renderFunction(state);
      } catch (error) {
        console.error('Error rendering component:', error);
        throw error;
      }
    };

    /**
     * Gets the current element, creating it if necessary
     * @returns {HTMLElement} Component element
     */
    const getElement = () => {
      if (destroyed) {
        throw new Error('Component has been destroyed');
      }

      if (!element) {
        element = buildElement();
      }

      return element;
    };

    /**
     * Updates component properties
     * @param {Object} newProps - New properties to merge
     * @returns {Object} Component instance for chaining
     */
    const update = (newProps) => {
      if (destroyed) return this;

      // Merge new props with existing state
      const updatedState = { ...state, ...newProps };

      // Check if we need a full rerender or can do partial update
      if (
        typeof this.shouldRerender === 'function' &&
        this.shouldRerender(newProps)
      ) {
        // Full rerender needed
        state = updatedState;
        const oldElement = element;
        element = buildElement();

        // Replace in DOM if the old element was inserted
        if (oldElement && oldElement.parentNode) {
          oldElement.parentNode.replaceChild(element, oldElement);
        }
      } else if (typeof this.partialUpdate === 'function' && element) {
        // Partial update possible
        state = updatedState;
        this.partialUpdate(element, newProps);
      } else {
        // Fallback to full rerender
        state = updatedState;
        const oldElement = element;
        element = buildElement();

        // Replace in DOM if the old element was inserted
        if (oldElement && oldElement.parentNode) {
          oldElement.parentNode.replaceChild(element, oldElement);
        }
      }

      return this;
    };

    /**
     * Gets current component state
     * @returns {Object} Current state
     */
    const getState = () => ({ ...state });

    /**
     * Destroys the component and cleans up resources
     */
    const destroy = () => {
      if (destroyed) return;

      destroyed = true;

      // Remove element from DOM
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      // Clear references
      element = null;
      state = null;
    };

    // Return the component API
    const componentAPI = {
      getElement,
      update,
      getState,
      destroy,
    };

    return componentAPI;
  };
};
