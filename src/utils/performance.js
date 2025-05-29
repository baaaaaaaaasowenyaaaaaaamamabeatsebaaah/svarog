/**
 * Performance utilities for optimizing component operations
 */

/**
 * Debounces a function to limit how often it can execute
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait before executing
 * @param {boolean} [immediate=false] - Whether to execute at the beginning of the wait period
 * @returns {Function} Debounced function
 */
export function debounce(func, wait, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * Throttles a function to execute at most once per specified period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum milliseconds between executions
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let lastCall = 0;
  let lastArgs = null;
  let lastThis = null;
  let timeout = null;

  const execute = function () {
    if (lastArgs) {
      func.apply(lastThis, lastArgs);
      lastCall = Date.now();
      lastArgs = lastThis = null;
    }
  };

  return function throttled(...args) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    lastArgs = args;
    lastThis = this;

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      func.apply(this, args);
      lastArgs = lastThis = null;
    } else if (!timeout) {
      timeout = setTimeout(execute, remaining);
    }
  };
}

/**
 * Throttles a function using requestAnimationFrame for smoother animations
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF-throttled function
 */
export function rafThrottle(func) {
  let queued = false;
  let lastArgs = null;
  let lastThis = null;

  return function throttled(...args) {
    lastArgs = args;
    lastThis = this;

    if (!queued) {
      queued = true;
      requestAnimationFrame(() => {
        func.apply(lastThis, lastArgs);
        queued = false;
      });
    }
  };
}

/**
 * Memoizes a function to cache results for repeated calls with the same arguments
 * @param {Function} func - Function to memoize
 * @param {Function} [keyResolver] - Function to generate cache key from args
 * @returns {Function} Memoized function
 */
export function memoize(func, keyResolver = JSON.stringify) {
  const cache = new Map();

  return function memoized(...args) {
    const key = keyResolver(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Batches DOM operations to reduce layout thrashing
 * @param {Function} updateFn - Function containing DOM updates
 */
export function batchDomUpdates(updateFn) {
  requestAnimationFrame(() => {
    updateFn();
  });
}

/**
 * Schedules a task to run during browser idle time
 * @param {Function} task - Task to execute
 * @param {Object} [options] - requestIdleCallback options
 */
export function runWhenIdle(task, options = { timeout: 1000 }) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(task, options);
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(task, 0);
  }
}

/**
 * Measures the execution time of a function
 * @param {Function} func - Function to measure
 * @param {string} [label] - Label for performance logging
 * @returns {Function} Wrapped function that logs performance
 */
export function measurePerformance(func, label = 'Function') {
  return function measured(...args) {
    const start = performance.now();
    const result = func.apply(this, args);
    const end = performance.now();
    console.log(`${label} execution time: ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

/**
 * Benchmark class for tracking component performance
 */
export class PerformanceBenchmark {
  constructor(componentName) {
    this.componentName = componentName;
    this.metrics = {
      renders: [],
      updates: [],
      events: [],
    };
    this.enabled =
      window &&
      window.localStorage &&
      window.localStorage.getItem('svarog-benchmark') === 'true';
  }

  /**
   * Start timing an operation
   * @param {string} operation - Operation name
   * @returns {Function} Function to call when operation completes
   */
  start(operation) {
    if (!this.enabled) {
      return () => {};
    }

    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (!this.metrics[operation]) {
        this.metrics[operation] = [];
      }

      this.metrics[operation].push(duration);

      // Log if explicitly requested
      if (window.localStorage.getItem('svarog-benchmark-log') === 'true') {
        console.log(
          `${this.componentName} ${operation}: ${duration.toFixed(2)}ms`
        );
      }

      return duration;
    };
  }

  /**
   * Get metrics summary
   * @returns {Object} Performance metrics summary
   */
  getSummary() {
    const summary = {};

    Object.entries(this.metrics).forEach(([operation, measurements]) => {
      if (measurements.length === 0) {
        return;
      }

      const total = measurements.reduce((sum, time) => sum + time, 0);
      const avg = total / measurements.length;
      const min = Math.min(...measurements);
      const max = Math.max(...measurements);

      summary[operation] = {
        count: measurements.length,
        average: avg,
        min,
        max,
        total,
      };
    });

    return summary;
  }

  /**
   * Reset all metrics
   */
  reset() {
    Object.keys(this.metrics).forEach((key) => {
      this.metrics[key] = [];
    });
  }
}
