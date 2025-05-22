// src/utils/environment.js

/**
 * Checks if the current environment is a test environment
 * @returns {boolean} Whether the current environment is a test environment
 */
export const isTestEnvironment = () => {
  return (
    typeof vi !== 'undefined' ||
    (typeof process !== 'undefined' &&
      process.env &&
      process.env.NODE_ENV === 'test')
  );
};
