// src/components/Typography/Typography.js
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';
import { debounce } from '../../utils/performance.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { typographyStyles } from './Typography.styles.js';

// Create style injector for Typography component
const injectTypographyStyles = createStyleInjector('Typography');

/**
 * Creates a Typography component for consistent text styling
 * @param {Object} props - Typography properties
 * @returns {Object} Typography component
 */
const createTypography = (props) => {
  // Inject styles on first render
  injectTypographyStyles(typographyStyles);

  // Destructure props with defaults
  const {
    children,
    textAlign,
    tabletSize,
    mobileSize,
    color,
    as = 'span',
    id,
    italic = false,
    className = '',
    weight,
    block = null, // null to detect when explicitly set
    value, // Added for standardization
  } = props;

  // Migrate legacy props
  const content = value !== undefined ? value : children;

  // Type validation
  const validElements = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'span',
    'div',
  ];
  if (!validElements.includes(as)) {
    throw new Error(
      `Invalid element type: ${as}. Must be one of: ${validElements.join(', ')}`
    );
  }

  if (
    textAlign &&
    !['left', 'center', 'right', 'justify'].includes(textAlign)
  ) {
    throw new Error('textAlign must be one of: left, center, right, justify');
  }

  // Weight validation
  if (weight) {
    const validWeights = [
      'light',
      'regular',
      'medium',
      'semibold',
      'bold',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      'normal',
    ];
    if (!validWeights.includes(String(weight))) {
      throw new Error(
        `Invalid font weight value: ${weight}. Must be one of: ${validWeights.join(', ')}`
      );
    }
  }

  // Size validation
  validateSize(tabletSize, 'tabletSize');
  validateSize(mobileSize, 'mobileSize');

  // Color validation
  if (color && !isValidColor(color)) {
    throw new Error('Invalid color value');
  }

  // Component state
  const state = {
    content,
    textAlign,
    tabletSize,
    mobileSize,
    color,
    as,
    id,
    italic,
    className,
    weight,
    block,
  };

  /**
   * Build the typography element
   * @returns {HTMLElement} Typography element
   */
  const buildTypographyElement = () => {
    // Determine if element should be block by default
    const isHeadline = state.as.match(/^h[1-6]$/);
    const shouldBeBlock = state.block !== null ? state.block : isHeadline;

    // Build class names
    const classNames = [
      'typography',
      `typography--${state.as}`,
      shouldBeBlock ? 'typography--block' : 'typography--inline',
      state.textAlign ? `typography--align-${state.textAlign}` : '',
      state.italic ? 'typography--italic' : '',
      state.weight ? `typography--weight-${state.weight}` : '',
      state.className,
    ]
      .filter(Boolean)
      .join(' ');

    // Create the element with attributes
    const attributes = {
      id: state.id || null,
      class: classNames,
    };

    // Add responsive size data attributes if specified
    if (state.tabletSize) {
      attributes['data-tablet-size'] = state.tabletSize;
    }
    if (state.mobileSize) {
      attributes['data-mobile-size'] = state.mobileSize;
    }

    // Create element style
    const style = {};

    // Apply inline styles for testing and direct manipulation
    if (state.textAlign) {
      style.textAlign = state.textAlign;
    }

    // Only apply display style if block is explicitly set or it's a headline
    if (state.block !== null || isHeadline) {
      style.display = shouldBeBlock ? 'block' : 'inline';
    }

    if (state.italic) {
      style.fontStyle = 'italic';
    }

    // Apply inline styles that don't have CSS classes
    if (state.color) {
      style.color = state.color;
    }

    // Create the element
    const element = createElement(state.as, {
      attributes,
      style,
    });

    // Set content
    if (typeof state.content === 'string') {
      element.innerHTML = state.content;
    } else if (state.content instanceof HTMLElement) {
      element.appendChild(state.content);
    } else if (typeof state.content?.getElement === 'function') {
      element.appendChild(state.content.getElement());
    } else {
      throw new Error(
        'content (children/value) must be string, HTMLElement, or component with getElement method'
      );
    }

    return element;
  };

  // Create initial element
  let element = buildTypographyElement();

  /**
   * Determine if a full rerender is needed for the given props
   * @param {Object} newProps - New properties
   * @returns {boolean} Whether a full rerender is needed
   */
  const shouldRerender = (newProps) => {
    // Always rerender if tag type changes
    if (newProps.as && newProps.as !== state.as) return true;

    // Always rerender if content changes (check both children and value)
    const newContent =
      newProps.value !== undefined ? newProps.value : newProps.children;
    if (newContent && newContent !== state.content) return true;

    // Always rerender if block/inline display changes
    if (newProps.block !== undefined && newProps.block !== state.block)
      return true;

    // Don't need a full rerender for style changes only
    return false;
  };

  /**
   * Update the element without rebuilding it
   * @param {HTMLElement} currentElement - Current element
   * @param {Object} newProps - New properties
   */
  const partialUpdate = (currentElement, newProps) => {
    // Handle value/children migration for partial updates
    if (newProps.value !== undefined || newProps.children !== undefined) {
      const newContent =
        newProps.value !== undefined ? newProps.value : newProps.children;
      if (newContent !== state.content) {
        // This would require a full rerender, but shouldRerender already checks this
        state.content = newContent;
      }
    }

    // Update classes
    if (newProps.textAlign && newProps.textAlign !== state.textAlign) {
      // Remove old alignment class
      if (state.textAlign) {
        currentElement.classList.remove(`typography--align-${state.textAlign}`);
      }
      // Add new alignment class
      currentElement.classList.add(`typography--align-${newProps.textAlign}`);
      currentElement.style.textAlign = newProps.textAlign;
      state.textAlign = newProps.textAlign;
    }

    if (newProps.weight && newProps.weight !== state.weight) {
      // Remove old weight class
      if (state.weight) {
        currentElement.classList.remove(`typography--weight-${state.weight}`);
      }
      // Add new weight class
      currentElement.classList.add(`typography--weight-${newProps.weight}`);
      state.weight = newProps.weight;
    }

    if (newProps.italic !== undefined && newProps.italic !== state.italic) {
      // Toggle italic class
      currentElement.classList.toggle('typography--italic', newProps.italic);
      currentElement.style.fontStyle = newProps.italic ? 'italic' : '';
      state.italic = newProps.italic;
    }

    if (newProps.color && newProps.color !== state.color) {
      // Update color
      currentElement.style.color = newProps.color;
      state.color = newProps.color;
    }

    if (newProps.className && newProps.className !== state.className) {
      // Remove old class name
      if (state.className) {
        currentElement.classList.remove(...state.className.split(' '));
      }
      // Add new class name
      if (newProps.className) {
        currentElement.classList.add(...newProps.className.split(' '));
      }
      state.className = newProps.className;
    }

    if (newProps.id && newProps.id !== state.id) {
      // Update ID
      currentElement.id = newProps.id;
      state.id = newProps.id;
    }

    if (newProps.tabletSize && newProps.tabletSize !== state.tabletSize) {
      // Update tablet size
      currentElement.setAttribute('data-tablet-size', newProps.tabletSize);
      state.tabletSize = newProps.tabletSize;
    }

    if (newProps.mobileSize && newProps.mobileSize !== state.mobileSize) {
      // Update mobile size
      currentElement.setAttribute('data-mobile-size', newProps.mobileSize);
      state.mobileSize = newProps.mobileSize;
    }
  };

  // Handler for window resize events
  const handleWindowResize = debounce(() => {
    // This could be extended to dynamically adjust typography based on screen size
    // beyond what CSS media queries can do
    if (element && (state.tabletSize || state.mobileSize)) {
      // Any custom logic for responsive typography changes
    }
  }, 250);

  // Add resize listener for responsive behavior
  if (typeof window !== 'undefined' && (tabletSize || mobileSize)) {
    window.addEventListener('resize', handleWindowResize);
  }

  // Public API
  return {
    /**
     * Get the typography element
     * @returns {HTMLElement} Typography element
     */
    getElement() {
      return element;
    },

    /**
     * Determine if a full rerender is needed for the given props
     * @param {Object} newProps - New properties
     * @returns {boolean} Whether a full rerender is needed
     */
    shouldRerender,

    /**
     * Update element without rebuilding it completely
     * @param {HTMLElement} currentElement - Current element
     * @param {Object} newProps - New properties
     */
    partialUpdate,

    /**
     * Update typography properties
     * @param {Object} newProps - New properties
     * @returns {Object} Typography component (for chaining)
     */
    update(newProps) {
      const migratedProps = migrateLegacyProps(newProps);

      // If a full rerender is needed
      if (this.shouldRerender(migratedProps)) {
        // Update state
        Object.assign(state, migratedProps);

        // If children is provided but value is not, update content
        if (
          migratedProps.children !== undefined &&
          migratedProps.value === undefined
        ) {
          state.content = migratedProps.children;
        } else if (migratedProps.value !== undefined) {
          state.content = migratedProps.value;
        }

        // Rebuild element
        const oldElement = element;
        element = buildTypographyElement();

        // Replace in DOM if inserted
        if (oldElement.parentNode) {
          oldElement.parentNode.replaceChild(element, oldElement);
        }
      } else {
        // More efficient partial updates
        this.partialUpdate(element, migratedProps);
      }

      return this;
    },

    /**
     * Set text content
     * @param {string|HTMLElement} content - New content
     * @returns {Object} Typography component (for chaining)
     */
    setContent(content) {
      return this.update({ value: content });
    },

    /**
     * Set text color
     * @param {string} newColor - New color
     * @returns {Object} Typography component (for chaining)
     */
    setColor(newColor) {
      return this.update({ color: newColor });
    },

    /**
     * Set font weight
     * @param {string|number} newWeight - New font weight
     * @returns {Object} Typography component (for chaining)
     */
    setWeight(newWeight) {
      return this.update({ weight: newWeight });
    },

    /**
     * Clean up resources
     */
    destroy() {
      // Remove event listeners
      if (typeof window !== 'undefined' && (tabletSize || mobileSize)) {
        window.removeEventListener('resize', handleWindowResize);
      }

      // Clear element reference
      element = null;
    },
  };
};

/**
 * Migrates legacy props to standardized props
 * @param {Object} props - Component properties
 * @returns {Object} Migrated properties
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  // Currently no legacy props to migrate in Typography
  // This function is added for future compatibility

  return migrated;
};

/**
 * Validate size value
 * @param {string} size - Size value to validate
 * @param {string} propertyName - Property name for error message
 */
function validateSize(size, propertyName) {
  if (size && typeof size !== 'string') {
    throw new Error(`${propertyName} must be a string value`);
  }
  if (size && !size.match(/^(\d+(\.\d+)?)(px|rem|em|%)$/)) {
    throw new Error(
      `Invalid ${propertyName} format. Must be a valid CSS size value`
    );
  }
}

/**
 * Check if a color value is valid
 * @param {string} color - Color to validate
 * @returns {boolean} Whether the color is valid
 */
function isValidColor(color) {
  // Check if it's a valid CSS color
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
}

// Define required props for validation
createTypography.requiredProps = [];

// Export as a component factory
export default createComponent('Typography', createTypography);
