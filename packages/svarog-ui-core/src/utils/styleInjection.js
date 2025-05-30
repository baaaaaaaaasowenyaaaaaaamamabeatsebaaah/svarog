/**
 * CSS injection utilities with proper priority system
 * Provides SSR-safe, deduped style injection for components
 */

const injectedStyles = new Map(); // Changed to Map to store priority info
const isServer = typeof document === 'undefined';

// Define numeric priority levels for proper cascade order
const PRIORITY_LEVELS = {
  base: 100, // Base/reset styles (lowest priority)
  component: 200, // Component default styles
  theme: 300, // Theme overrides (highest priority)
};

/**
 * Injects CSS styles into the document head with priority-based ordering
 * @param {string} id - Unique identifier for the styles
 * @param {string} css - CSS content to inject
 * @param {Object} options - Injection options
 */
export const injectStyles = (id, css, options = {}) => {
  if (isServer) return;

  const {
    priority = 'component', // 'base', 'component', 'theme'
    media = 'all',
  } = options;

  // Get numeric priority value
  const numericPriority =
    PRIORITY_LEVELS[priority] || PRIORITY_LEVELS.component;

  // Check if already injected with same or higher priority
  const existingEntry = injectedStyles.get(id);
  if (existingEntry && existingEntry.priority >= numericPriority) {
    return; // Don't re-inject with lower priority
  }

  // Remove existing style if it exists (will re-add in correct position)
  if (existingEntry) {
    removeStyles(id);
  }

  const style = document.createElement('style');
  style.id = `svarog-${id}`;
  style.setAttribute('data-svarog', id);
  style.setAttribute('data-priority', priority);
  style.setAttribute('data-priority-value', numericPriority.toString());
  style.setAttribute('media', media);
  style.textContent = css;

  // Find correct insertion point based on numeric priority
  const insertionPoint = findInsertionPoint(numericPriority);

  if (insertionPoint) {
    document.head.insertBefore(style, insertionPoint);
  } else {
    document.head.appendChild(style);
  }

  injectedStyles.set(id, { priority: numericPriority, element: style });
};

/**
 * Finds the correct insertion point based on numeric priority
 * @param {number} priority - Numeric priority value
 * @returns {Element|null} Element to insert before
 */
const findInsertionPoint = (priority) => {
  const styles = document.head.querySelectorAll('style[data-svarog]');

  for (const style of styles) {
    const stylePriority = parseInt(
      style.getAttribute('data-priority-value') || '200'
    );
    if (stylePriority > priority) {
      return style;
    }
  }

  return null;
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
 * Creates a component style injector with proper priority
 * @param {string} componentName - Name of the component
 * @param {string} defaultPriority - Default priority level
 * @returns {Function} Style injection function
 */
export const createStyleInjector = (
  componentName,
  defaultPriority = 'component'
) => {
  const id = componentName.toLowerCase();

  return (styles, options = {}) => {
    injectStyles(id, styles, {
      priority: defaultPriority,
      ...options,
    });
  };
};

/**
 * Removes injected styles
 * @param {string} id - Style ID to remove
 */
export const removeStyles = (id) => {
  if (isServer) return;

  const entry = injectedStyles.get(id);
  if (entry && entry.element) {
    entry.element.remove();
    injectedStyles.delete(id);
  }
};

/**
 * Debug function to log current style order
 */
export const debugStyleOrder = () => {
  console.log('Current style injection order:');
  const styles = document.head.querySelectorAll('style[data-svarog]');
  styles.forEach((style) => {
    console.log(
      `- ${style.id}: priority=${style.getAttribute('data-priority')} (${style.getAttribute('data-priority-value')})`
    );
  });
};
