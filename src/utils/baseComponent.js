// src/utils/baseComponent.js
// Remove the createElement import since it's not used directly

/**
 * Creates a base component with standard lifecycle
 * @param {Function} renderFn - Function that returns element structure
 * @returns {Function} Component factory function
 */
export const createBaseComponent = (renderFn) => {
  return (props = {}) => {
    // Component state
    const state = { ...props };
    let element = null;
    let isDestroyed = false;

    // Create the element by calling render function
    const render = () => {
      if (isDestroyed) {
        console.warn('Attempted to render destroyed component');
        return null;
      }

      return renderFn(state);
    };

    // Initialize on first render
    element = render();

    // Public API
    return {
      /**
       * Get the component element
       * @returns {HTMLElement} Component element
       */
      getElement() {
        return element;
      },

      /**
       * Update component with new props
       * @param {Object} newProps - New properties
       * @returns {Object} Component (for chaining)
       */
      update(newProps) {
        if (isDestroyed) {
          console.warn('Attempted to update destroyed component');
          return this;
        }

        // Update state
        Object.assign(state, newProps);

        // Check if we need a full re-render or partial update
        if (this.shouldRerender && this.shouldRerender(newProps)) {
          // Keep track of old element for replacement
          const oldElement = element;

          // Create new element
          element = render();

          // Replace in DOM if old element was inserted
          if (oldElement && oldElement.parentNode) {
            oldElement.parentNode.replaceChild(element, oldElement);
          }
        } else if (this.partialUpdate) {
          // Use more efficient partial update
          this.partialUpdate(element, newProps);
        }

        return this;
      },

      /**
       * Clean up resources
       */
      destroy() {
        if (isDestroyed) return;

        isDestroyed = true;

        // Remove event listeners
        if (element && element._listeners) {
          Object.entries(element._listeners).forEach(([event, handler]) => {
            element.removeEventListener(event, handler);
          });
          element._listeners = {};
        }

        // Allow GC to reclaim element
        element = null;
      },
    };
  };
};
