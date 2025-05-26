/**
 * CSS injection utilities for component styling
 * Provides SSR-safe, deduped style injection for components
 */

const injectedStyles = new Set();
const isServer = typeof document === 'undefined';

/**
 * Injects CSS styles into the document head
 * @param {string} id - Unique identifier for the styles
 * @param {string} css - CSS content to inject
 * @param {Object} options - Injection options
 */
export const injectStyles = (id, css, options = {}) => {
  // Skip injection on server or if already injected
  if (isServer || injectedStyles.has(id)) {
    return;
  }

  const {
    priority = 'normal', // 'high', 'normal', 'low'
    media = 'all',
  } = options;

  const style = document.createElement('style');
  style.id = `svarog-${id}`;
  style.setAttribute('data-svarog', id);
  style.setAttribute('media', media);
  style.textContent = css;

  // Insert based on priority
  const insertionPoint = getInsertionPoint(priority);
  if (insertionPoint) {
    document.head.insertBefore(style, insertionPoint);
  } else {
    document.head.appendChild(style);
  }

  injectedStyles.add(id);
};

/**
 * Gets the insertion point for style priority
 * @param {string} priority - Style priority level
 * @returns {Element|null} Element to insert before
 */
const getInsertionPoint = (priority) => {
  switch (priority) {
    case 'high':
      return document.head.firstChild;
    case 'low':
      return document.head.querySelector('[data-svarog]');
    case 'normal':
    default:
      return document.head.querySelector('[data-svarog][data-priority="low"]');
  }
};

/**
 * CSS template literal helper for better DX
 * @param {TemplateStringsArray} strings - Template strings
 * @param {...any} values - Template values
 * @returns {string} CSS string
 */
export const css = (strings, ...values) => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || '');
  }, '');
};

/**
 * Creates a component style injector
 * @param {string} componentName - Name of the component
 * @returns {Function} Style injection function
 */
export const createStyleInjector = (componentName) => {
  const id = componentName.toLowerCase();

  return (styles, options = {}) => {
    injectStyles(id, styles, {
      priority: 'normal',
      ...options,
    });
  };
};

/**
 * Removes injected styles (useful for testing)
 * @param {string} id - Style ID to remove
 */
export const removeStyles = (id) => {
  if (isServer) return;

  const style = document.getElementById(`svarog-${id}`);
  if (style) {
    style.remove();
    injectedStyles.delete(id);
  }
};
