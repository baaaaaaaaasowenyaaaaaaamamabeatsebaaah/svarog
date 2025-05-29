// src/utils/baseComponent.js

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
    const component = {
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
          return component;
        }

        // Store old state before updating
        const oldState = { ...state };

        // Update state
        Object.assign(state, newProps);

        // Check for custom update behavior first
        if (component.shouldRerender && component.shouldRerender(newProps)) {
          // Full rerender requested
          const oldElement = element;
          element = render();
          if (oldElement && oldElement.parentNode) {
            oldElement.parentNode.replaceChild(element, oldElement);
          }
        } else if (component.partialUpdate) {
          // Use partial update (either shouldRerender returned false or doesn't exist)
          component.partialUpdate(element, newProps, oldState);
        } else {
          // No partial update available, do full rerender
          const oldElement = element;
          element = render();
          if (oldElement && oldElement.parentNode) {
            oldElement.parentNode.replaceChild(element, oldElement);
          }
        }

        return component;
      },

      /**
       * Clean up resources
       */
      destroy() {
        if (isDestroyed) {
          return;
        }

        isDestroyed = true;

        // Remove event listeners
        if (element && element._listeners) {
          Object.entries(element._listeners).forEach(([event, handler]) => {
            element.removeEventListener(event, handler);
          });
          element._listeners = {};
        }

        // Allow child components to clean up their resources
        if (element && element._components) {
          Object.values(element._components).forEach((childComponent) => {
            if (
              childComponent &&
              typeof childComponent.destroy === 'function'
            ) {
              try {
                childComponent.destroy();
              } catch (error) {
                console.warn('Error destroying child component:', error);
              }
            }
          });
          element._components = {};
        }

        // Allow GC to reclaim element
        element = null;
      },
    };

    return component;
  };
};
