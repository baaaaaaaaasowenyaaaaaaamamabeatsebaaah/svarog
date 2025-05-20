/// src/components/Image/Image.js
import './Image.css';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';

/**
 * Creates an Image component
 * @param {Object} props - Image properties
 * @param {string} props.src - Path to the image
 * @param {string} [props.alt='Image'] - Alt text for the image
 * @param {string} [props.fallbackSrc=''] - Fallback image path if the primary image fails to load
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Function} [props.onClick=null] - Click event handler
 * @param {boolean} [props.responsive=true] - Whether image should be responsive
 * @returns {Object} Image component API object
 */
const createImage = (props) => {
  // Validate props
  if (!props.src) {
    throw new Error('Image: src is required');
  }

  /**
   * Renders the image element based on current state
   * @param {Object} state - Current component state
   * @returns {HTMLElement} Image container element
   */
  const renderImage = (state) => {
    // Create container with proper classes
    const containerClasses = [
      'image-container',
      state.responsive ? 'image-container--responsive' : '',
      state.className,
    ].filter(Boolean);

    // Important change: Use 'classes' instead of 'className' for createElement
    const container = createElement('div', {
      classes: containerClasses,
      events: {
        click: state.onClick,
      },
    });

    // Create and append the image element
    const img = createElement('img', {
      attributes: {
        src: state.src,
        alt: state.alt,
      },
      classes: ['image-element'],
    });

    // Handle image loading errors
    img.onerror = () => {
      console.error(`Failed to load image from path: ${state.src}`);

      // Try fallback if available
      if (state.fallbackSrc) {
        img.src = state.fallbackSrc;
      } else {
        // Create a text fallback if we can't load the image
        container.innerHTML = `<span class="image-error">${state.alt}</span>`;
      }
    };

    container.appendChild(img);
    return container;
  };

  // Create component using baseComponent with default props
  const baseComponent = createBaseComponent(renderImage)({
    src: props.src,
    alt: props.alt || 'Image',
    fallbackSrc: props.fallbackSrc || '',
    className: props.className || '',
    onClick: props.onClick || null,
    responsive: props.responsive !== undefined ? props.responsive : true,
  });

  /**
   * Determines if component needs to fully re-render based on prop changes
   * @param {Object} newProps - New properties
   * @returns {boolean} Whether a full re-render is required
   */
  const shouldRerender = (newProps) => {
    // Only rebuild if these props change
    const criticalProps = ['src', 'fallbackSrc', 'responsive'];
    return Object.keys(newProps).some((key) => criticalProps.includes(key));
  };

  /**
   * Perform partial update without full re-render
   * @param {HTMLElement} element - Current element
   * @param {Object} newProps - New properties
   */
  const partialUpdate = (element, newProps) => {
    // Update classes directly
    if (newProps.className !== undefined) {
      const classes = [
        'image-container',
        baseComponent.getState().responsive
          ? 'image-container--responsive'
          : '',
        newProps.className,
      ]
        .filter(Boolean)
        .join(' ');

      element.className = classes;
    }

    // Update alt text on image
    if (newProps.alt !== undefined) {
      const img = element.querySelector('img');
      if (img) {
        img.alt = newProps.alt;
      }
    }

    // Update click handler
    if (newProps.onClick !== undefined) {
      // Remove old listener if it exists
      if (element._listeners && element._listeners.click) {
        element.removeEventListener('click', element._listeners.click);
      }

      // Add new listener if provided
      if (newProps.onClick) {
        element.addEventListener('click', newProps.onClick);
        if (!element._listeners) element._listeners = {};
        element._listeners.click = newProps.onClick;
      }
    }
  };

  // Extended component with custom methods
  const imageComponent = {
    ...baseComponent,
    shouldRerender,
    partialUpdate,

    /**
     * Set image source
     * @param {string} newSrc - New src
     * @returns {Object} Image component (for chaining)
     */
    setSrc(newSrc) {
      return this.update({ src: newSrc });
    },

    /**
     * Set image alt text
     * @param {string} newAlt - New alt text
     * @returns {Object} Image component (for chaining)
     */
    setAlt(newAlt) {
      return this.update({ alt: newAlt });
    },
  };

  return imageComponent;
};

// Define required props for validation
createImage.requiredProps = ['src'];

// Export the factory function
export default createImage;
