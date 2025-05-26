// src/utils/logger.js
/**
 * Logger utility with production safeguards
 * @type {Object}
 */
export const logger = {
  /**
   * Log debug message (only in development)
   * @param {...*} args - Arguments to log
   */
  debug(...args) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },

  /**
   * Log info message (only in development)
   * @param {...*} args - Arguments to log
   */
  info(...args) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(...args);
    }
  },

  /**
   * Log warning message (always shown)
   * @param {...*} args - Arguments to log
   */
  warn(...args) {
    console.warn(...args);
  },

  /**
   * Log error message (always shown)
   * @param {...*} args - Arguments to log
   */
  error(...args) {
    console.error(...args);
  },
};
