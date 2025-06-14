// src/components/RichText/RichText.js
import {
  createElement,
  cleanupEventListeners,
} from '../../utils/componentFactory.js';
import {
  createStyleInjector,
  injectStyles,
} from '../../utils/styleInjection.js';
import { richTextStyles } from './RichText.styles.js';
import { baseVariables } from '../../styles/baseVariables.js';

// Ensure base variables are loaded
if (typeof document !== 'undefined') {
  injectStyles('svarog-base-vars', baseVariables, { priority: 'base' });
}

// Create style injector for RichText component
const injectRichTextStyles = createStyleInjector('RichText');

/**
 * HTML sanitization utility for XSS protection
 */
const SecurityHelpers = {
  // Allowed HTML tags for rich text content
  ALLOWED_TAGS: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'div',
    'span',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    'ul',
    'ol',
    'li',
    'a',
    'img',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'blockquote',
    'pre',
    'code',
    'hr',
    'sub',
    'sup',
  ],

  // Allowed attributes for each tag
  ALLOWED_ATTRIBUTES: {
    a: ['href', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    table: ['class'],
    th: ['scope', 'colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
    '*': ['class', 'id', 'data-*'],
  },

  /**
   * Sanitize HTML content to prevent XSS attacks
   * @param {string} html - HTML string to sanitize
   * @returns {string} Sanitized HTML string
   */
  sanitizeHTML(html) {
    if (!html || typeof html !== 'string') return '';

    // Create a temporary DOM element for parsing
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Recursively clean the DOM tree
    this.cleanNode(temp);

    return temp.innerHTML;
  },

  /**
   * Recursively clean a DOM node and its children
   * @param {Node} node - DOM node to clean
   */
  cleanNode(node) {
    if (!node) return;

    // Process all child nodes
    const children = Array.from(node.childNodes);
    children.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = child.tagName.toLowerCase();

        // Dangerous tags: remove completely including content (XSS protection)
        if (
          ['script', 'iframe', 'object', 'embed', 'style', 'link'].includes(
            tagName
          )
        ) {
          child.parentNode.removeChild(child);
          return;
        }

        // Other disallowed tags: remove tag but keep their content
        if (!this.ALLOWED_TAGS.includes(tagName)) {
          const parent = child.parentNode;
          while (child.firstChild) {
            parent.insertBefore(child.firstChild, child);
          }
          parent.removeChild(child);
          return;
        }

        // Clean attributes
        this.cleanAttributes(child);

        // Recursively clean children
        this.cleanNode(child);
      }
    });
  },

  /**
   * Clean attributes of an element
   * @param {Element} element - Element to clean
   */
  cleanAttributes(element) {
    const tagName = element.tagName.toLowerCase();
    const allowedForTag = this.ALLOWED_ATTRIBUTES[tagName] || [];
    const allowedGlobal = this.ALLOWED_ATTRIBUTES['*'] || [];
    const allowedAttrs = [...allowedForTag, ...allowedGlobal];

    // Remove disallowed attributes
    Array.from(element.attributes).forEach((attr) => {
      const attrName = attr.name.toLowerCase();

      // Check if attribute is allowed
      const isAllowed = allowedAttrs.some((allowed) => {
        if (allowed === attrName) return true;
        if (allowed.endsWith('*')) {
          return attrName.startsWith(allowed.slice(0, -1));
        }
        return false;
      });

      if (!isAllowed) {
        element.removeAttribute(attr.name);
      }
    });

    // Special handling for links
    if (tagName === 'a') {
      const href = element.getAttribute('href');
      if (href) {
        // Ensure external links have proper security attributes
        if (href.startsWith('http://') || href.startsWith('https://')) {
          if (element.getAttribute('target') === '_blank') {
            element.setAttribute('rel', 'noopener noreferrer');
          }
        }

        // Remove javascript: and data: URLs
        if (href.startsWith('javascript:') || href.startsWith('data:')) {
          element.removeAttribute('href');
        }
      }
    }

    // Special handling for images
    if (tagName === 'img') {
      const src = element.getAttribute('src');
      if (src && (src.startsWith('javascript:') || src.startsWith('data:'))) {
        element.removeAttribute('src');
      }
    }
  },
};

/**
 * Creates a RichText component for rendering sanitized HTML content
 * @param {Object} props - RichText properties
 * @returns {Object} RichText component
 */
const createRichText = (props) => {
  // Inject styles on first render
  injectRichTextStyles(richTextStyles);

  // Migrate legacy props according to standardization
  const migrateLegacyProps = (originalProps) => {
    const migrated = { ...originalProps };

    // Map common legacy prop names
    if (migrated.html && !migrated.content) {
      console.warn('[RichText] html prop is deprecated, use content instead');
      migrated.content = migrated.html;
      delete migrated.html;
    }

    if (migrated.value && !migrated.content) {
      migrated.content = migrated.value;
      delete migrated.value;
    }

    return migrated;
  };

  // Apply prop migration
  const migratedProps = migrateLegacyProps(props);

  // Validate props
  if (!migratedProps.content) {
    throw new Error('RichText: content is required');
  }

  if (typeof migratedProps.content !== 'string') {
    throw new Error('RichText: content must be a string');
  }

  if (
    migratedProps.sanitize !== undefined &&
    typeof migratedProps.sanitize !== 'boolean'
  ) {
    throw new Error('RichText: sanitize must be a boolean');
  }

  if (
    migratedProps.maxLength !== undefined &&
    (!Number.isInteger(migratedProps.maxLength) || migratedProps.maxLength < 0)
  ) {
    throw new Error('RichText: maxLength must be a positive integer');
  }

  // Component state
  let state = { ...migratedProps };
  let element = null;
  let isDestroyed = false;
  let wasTruncated = false; // Track truncation state for isTruncated()

  /**
   * Process links in the rendered content
   * @param {HTMLElement} container - Container element
   */
  const processLinks = (container) => {
    const links = container.querySelectorAll('a');

    links.forEach((link) => {
      const href = link.getAttribute('href');

      if (href) {
        // Add classes for styling
        link.classList.add('richtext__link');

        // Handle external links
        if (href.startsWith('http://') || href.startsWith('https://')) {
          link.classList.add('richtext__link--external');
          if (link.getAttribute('target') === '_blank') {
            link.setAttribute('rel', 'noopener noreferrer');
          }
        }

        // Handle email links
        if (href.startsWith('mailto:')) {
          link.classList.add('richtext__link--email');
        }

        // Handle phone links
        if (href.startsWith('tel:')) {
          link.classList.add('richtext__link--phone');
        }
      }
    });
  };

  /**
   * Renders the rich text element
   * @returns {HTMLElement} RichText element
   */
  const render = () => {
    if (isDestroyed) {
      console.warn('Attempted to render destroyed RichText component');
      return null;
    }

    // Build class names
    const classNames = [
      'richtext',
      state.variant ? `richtext--${state.variant}` : '',
      state.size ? `richtext--${state.size}` : '',
      state.className || '',
    ].filter(Boolean);

    // Sanitize content if enabled (default: true)
    const shouldSanitize = state.sanitize !== false;
    let processedContent = state.content;

    if (shouldSanitize) {
      processedContent = SecurityHelpers.sanitizeHTML(processedContent);
    }

    // Apply maxLength if specified
    wasTruncated = false; // Reset truncation state
    if (state.maxLength && processedContent.length > state.maxLength) {
      // Find a good place to truncate (avoid breaking HTML tags)
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = processedContent;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      if (textContent.length > state.maxLength) {
        const truncated = `${textContent.substring(0, state.maxLength - 3)}...`;
        processedContent = SecurityHelpers.sanitizeHTML(truncated);
        wasTruncated = true; // Mark as truncated
      }
    }

    // Use componentFactory createElement utility
    const newElement = createElement('div', {
      classes: classNames,
      attributes: {
        id: state.id || null,
        role: 'document',
        'aria-label': state.ariaLabel || null,
      },
      events: {
        click: state.onClick,
      },
    });

    // Set innerHTML with processed content
    newElement.innerHTML = processedContent;

    // Post-process links if needed
    if (state.processLinks !== false) {
      processLinks(newElement);
    }

    return newElement;
  };

  // Initial render
  element = render();

  // Public API following Svarog component patterns
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
        console.warn('Attempted to update destroyed RichText component');
        return this;
      }

      // Apply prop migration to new props
      const migratedNewProps = migrateLegacyProps(newProps);

      // Update state
      Object.assign(state, migratedNewProps);

      // Re-render (vanilla JS approach - always full re-render for simplicity)
      const oldElement = element;
      element = render();

      // Replace in DOM if the old element was inserted
      if (oldElement && oldElement.parentNode) {
        oldElement.parentNode.replaceChild(element, oldElement);
      }

      return this;
    },

    /**
     * Set rich text content
     * @param {string} newContent - New HTML content
     * @returns {Object} RichText component (for chaining)
     */
    setContent(newContent) {
      return this.update({ content: newContent });
    },

    /**
     * Get the text content (without HTML tags)
     * @returns {string} Plain text content
     */
    getTextContent() {
      if (!element) return '';
      return element.textContent || element.innerText || '';
    },

    /**
     * Get the HTML content
     * @returns {string} HTML content
     */
    getHTMLContent() {
      if (!element) return '';
      return element.innerHTML;
    },

    /**
     * Check if content exceeds maximum length
     * @returns {boolean} Whether content is truncated
     */
    isTruncated() {
      return wasTruncated;
    },

    /**
     * Search for text within the content
     * @param {string} searchTerm - Text to search for
     * @returns {boolean} Whether the text was found
     */
    contains(searchTerm) {
      const textContent = this.getTextContent().toLowerCase();
      return textContent.includes(searchTerm.toLowerCase());
    },

    /**
     * Clean up resources - using componentFactory cleanup pattern
     */
    destroy() {
      if (isDestroyed) return;

      isDestroyed = true;

      // Use componentFactory cleanup utility
      if (element) {
        cleanupEventListeners(element);

        // Remove from DOM if inserted
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }

      // Clear references
      element = null;
      state = null;
    },

    /**
     * Theme change handler
     */
    onThemeChange(newTheme, previousTheme) {
      console.debug(
        `RichText: theme changed from ${previousTheme} to ${newTheme}`
      );
    },
  };
};

// Define required props for validation
createRichText.requiredProps = ['content'];

// Export as a factory function
export default createRichText;
