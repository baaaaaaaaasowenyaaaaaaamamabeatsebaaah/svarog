// src/components/Typography/Typography.js
import './Typography.css';
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';

/**
 * Creates a Typography component for consistent text styling
 * @param {Object} props - Typography properties
 * @returns {Object} Typography component
 */
const createTypography = (props) => {
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
  } = props;

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
    children,
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
    if (typeof state.children === 'string') {
      element.innerHTML = state.children;
    } else if (state.children instanceof HTMLElement) {
      element.appendChild(state.children);
    } else if (typeof state.children.getElement === 'function') {
      element.appendChild(state.children.getElement());
    } else {
      throw new Error(
        'children must be string, HTMLElement, or component with getElement method'
      );
    }

    return element;
  };

  // Create initial element
  let element = buildTypographyElement();

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
     * Update typography properties
     * @param {Object} newProps - New properties
     * @returns {Object} Typography component (for chaining)
     */
    update(newProps) {
      // Update state
      Object.assign(state, newProps);

      // Rebuild element
      const oldElement = element;
      element = buildTypographyElement();

      // Replace in DOM if inserted
      if (oldElement.parentNode) {
        oldElement.parentNode.replaceChild(element, oldElement);
      }

      return this;
    },

    /**
     * Set text content
     * @param {string|HTMLElement} content - New content
     * @returns {Object} Typography component (for chaining)
     */
    setContent(content) {
      return this.update({ children: content });
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
      // No event listeners to clean up for Typography
      element = null;
    },
  };
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
createTypography.requiredProps = ['children'];

// Export as a component factory
export default createComponent('Typography', createTypography);
