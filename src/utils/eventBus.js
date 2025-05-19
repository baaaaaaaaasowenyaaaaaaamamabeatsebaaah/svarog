// src/utils/eventBus.js

/**
 * Simple event bus for component communication
 */
class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);

    return () => {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);

      // Clean up empty event arrays
      if (this.events[event].length === 0) {
        delete this.events[event];
      }
    };
  }

  /**
   * Subscribe to an event once
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  once(event, callback) {
    const unsubscribe = this.on(event, (...args) => {
      unsubscribe();
      callback(...args);
    });

    return unsubscribe;
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {...any} args - Event arguments
   */
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Remove all subscribers for an event
   * @param {string} [event] - Event name (omit to clear all events)
   */
  clear(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

// Export singleton instance
export const eventBus = new EventBus();

// Named exports for convenience
export const on = eventBus.on.bind(eventBus);
export const once = eventBus.once.bind(eventBus);
export const emit = eventBus.emit.bind(eventBus);
export const clear = eventBus.clear.bind(eventBus);
