/**
 * Modern CSS injection system for Svarog UI components
 * Handles automatic style deduplication and proper injection order
 */

// Cache to prevent duplicate style injection
const injectedStyles = new Map();
let injectionOrder = 0;

/**
 * CSS template literal tag for better syntax highlighting
 * @param {TemplateStringsArray} strings
 * @param {...any} values
 * @returns {string}
 */
export const css = (strings, ...values) => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || '');
  }, '');
};

/**
 * Inject styles into the document head with deduplication
 * @param {string} id - Unique identifier for the styles
 * @param {string} cssContent - CSS content to inject
 * @param {Object} options - Injection options
 * @param {string} options.priority - 'high', 'normal', or 'low'
 * @param {boolean} options.replace - Replace existing styles if true
 */
export const injectStyles = (id, cssContent, options = {}) => {
  const { priority = 'normal', replace = false } = options;

  // Skip injection in non-browser environments
  if (typeof document === 'undefined') {
    return;
  }

  // Check if already injected
  if (injectedStyles.has(id) && !replace) {
    return;
  }

  // Remove existing style if replacing
  if (replace) {
    const existingStyle = document.getElementById(`svarog-${id}`);
    if (existingStyle) {
      existingStyle.remove();
    }
  }

  // Create style element
  const style = document.createElement('style');
  style.id = `svarog-${id}`;
  style.setAttribute('data-svarog', id);
  style.setAttribute('data-priority', priority);
  style.setAttribute('data-order', injectionOrder++);
  style.textContent = cssContent;

  // Insert based on priority
  const head = document.head;
  const insertionPoint = findInsertionPoint(priority);

  if (insertionPoint) {
    head.insertBefore(style, insertionPoint);
  } else {
    head.appendChild(style);
  }

  // Cache injection
  injectedStyles.set(id, {
    element: style,
    content: cssContent,
    priority,
    timestamp: Date.now(),
  });
};

/**
 * Find the correct insertion point based on priority
 * @param {string} priority
 * @returns {Element|null}
 */
function findInsertionPoint(priority) {
  const existingStyles = Array.from(
    document.querySelectorAll('style[data-svarog]')
  );

  if (priority === 'high') {
    // Insert at the beginning
    return document.head.firstChild;
  }

  if (priority === 'low') {
    // Insert at the end, return null to append
    return null;
  }

  // Normal priority - insert after high priority styles
  const highPriorityStyles = existingStyles.filter(
    (el) => el.getAttribute('data-priority') === 'high'
  );

  if (highPriorityStyles.length > 0) {
    const lastHighPriority = highPriorityStyles[highPriorityStyles.length - 1];
    return lastHighPriority.nextSibling;
  }

  return null;
}

/**
 * Create a style injector for a specific component
 * @param {string} componentName - Name of the component
 * @returns {Function} Injection function
 */
export const createStyleInjector = (componentName) => {
  return (cssContent, options = {}) => {
    injectStyles(componentName, cssContent, options);
  };
};

/**
 * Remove injected styles
 * @param {string} id - Style ID to remove
 */
export const removeStyles = (id) => {
  if (typeof document === 'undefined') {
    return;
  }

  const styleElement = document.getElementById(`svarog-${id}`);
  if (styleElement) {
    styleElement.remove();
    injectedStyles.delete(id);
  }
};

/**
 * Get information about injected styles
 * @returns {Array} Array of style information
 */
export const getInjectedStyles = () => {
  return Array.from(injectedStyles.entries()).map(([id, data]) => ({
    id,
    priority: data.priority,
    timestamp: data.timestamp,
    size: data.content.length,
  }));
};

/**
 * Clear all injected styles (useful for testing)
 */
export const clearAllStyles = () => {
  if (typeof document === 'undefined') {
    return;
  }

  document.querySelectorAll('style[data-svarog]').forEach((el) => el.remove());
  injectedStyles.clear();
  injectionOrder = 0;
};

/**
 * Utility to handle CSS imports in components
 * @param {string} cssContent - CSS content (can be imported CSS)
 * @param {string} componentName - Component name for scoping
 */
export const handleComponentStyles = (cssContent, componentName) => {
  // Skip if no CSS content or not in browser
  if (!cssContent || typeof document === 'undefined') {
    return;
  }

  // If CSS content is a default export object (from build process)
  if (typeof cssContent === 'object' && cssContent.default) {
    cssContent = cssContent.default;
  }

  // Inject styles
  injectStyles(componentName, cssContent, { priority: 'normal' });
};

/**
 * Development helper to show style injection stats
 */
export const debugStyleInjection = () => {
  if (typeof console === 'undefined') return;

  const styles = getInjectedStyles();
  console.group('Svarog Style Injection Debug');
  console.log(`Total injected styles: ${styles.length}`);
  console.table(styles);
  console.groupEnd();
};

// Export default object for easier importing
export default {
  css,
  injectStyles,
  createStyleInjector,
  removeStyles,
  getInjectedStyles,
  clearAllStyles,
  handleComponentStyles,
  debugStyleInjection,
};
