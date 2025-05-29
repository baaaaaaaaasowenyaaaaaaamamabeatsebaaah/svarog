// src/utils/composition.js

/**
 * Creates a higher-order component that adds behavior to an existing component
 * @param {Function} createComponent - Component factory function
 * @param {Function} enhancer - Function that enhances component
 * @returns {Function} Enhanced component factory
 */
export const withBehavior = (createComponent, enhancer) => {
  return (props) => {
    const component = createComponent(props);
    return enhancer(component, props);
  };
};

/**
 * Creates a higher-order component that adds theme awareness
 * @param {Function} createComponent - Component factory function
 * @returns {Function} Theme-aware component factory
 */
export const withThemeAwareness = (createComponent) => {
  return (props) => {
    const component = createComponent(props);

    // Add theme change listener
    const handleThemeChange = (event) => {
      // Allow component to react to theme changes if it has the method
      if (component.onThemeChange) {
        component.onThemeChange(event.detail.theme, event.detail.previousTheme);
      }
    };

    window.addEventListener('themechange', handleThemeChange);

    // Enhance destroy method to clean up listeners
    const originalDestroy = component.destroy;
    component.destroy = () => {
      window.removeEventListener('themechange', handleThemeChange);
      if (originalDestroy) {
        originalDestroy.call(component);
      }
    };

    return component;
  };
};

/**
 * Creates a higher-order component that adds event delegation
 * @param {Function} createComponent - Component factory function
 * @param {Object} delegatedEvents - Map of events to delegate
 * @returns {Function} Component factory with event delegation
 */
export const withEventDelegation = (createComponent, delegatedEvents) => {
  return (props) => {
    const component = createComponent(props);
    const rootElement = component.getElement(); // Renamed to be more descriptive

    // Add delegated event listeners
    Object.entries(delegatedEvents).forEach(([event, selector]) => {
      rootElement.addEventListener(event, (e) => {
        const target = e.target.closest(selector);
        if (target) {
          const handlerName = `handle${event.charAt(0).toUpperCase() + event.slice(1)}`;
          if (component[handlerName]) {
            component[handlerName](e, target);
          }
        }
      });
    });

    return component;
  };
};
