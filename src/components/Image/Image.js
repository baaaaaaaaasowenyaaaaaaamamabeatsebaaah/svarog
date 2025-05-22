// src/components/Image/Image.js
import './Image.css';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';

/**
 * Creates an Image component with lazy-loading, fallback support, and responsive options
 * @param {Object} props - Image properties
 * @param {string} props.src - Path to the image (required)
 * @param {string} [props.alt='Image'] - Alt text for the image
 * @param {string} [props.fallbackSrc] - Fallback image path if the primary image fails
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onClick] - Click event handler
 * @param {boolean} [props.responsive=true] - Whether image should be responsive
 * @returns {Object} Image component API object
 */
const createImage = (props) => {
  if (!props.src) {
    throw new Error('Image: src is required');
  }

  const renderImage = (state) => {
    // Create container with proper classes
    const containerClasses = [
      'image-container',
      state.responsive ? 'image-container--responsive' : '',
      state.className,
    ].filter(Boolean);

    const container = createElement('div', {
      classes: containerClasses,
      events: state.onClick ? { click: state.onClick } : {},
    });

    // Create and append the image element
    const img = createElement('img', {
      classes: ['image-element'],
      attributes: {
        src: state.src,
        alt: state.alt,
        loading: 'lazy',
      },
    });

    // Track error state to prevent infinite loops
    let errorHandled = false;

    // Handle image loading errors
    img.onerror = () => {
      // Prevent multiple error handling
      if (errorHandled) return;
      errorHandled = true;

      console.error(`Failed to load image from path: ${state.src}`);

      if (state.fallbackSrc) {
        // Set new error handler for fallback image
        img.onerror = () => {
          console.error(
            `Failed to load fallback image from path: ${state.fallbackSrc}`
          );
          // Remove the error handler to prevent further attempts
          img.onerror = null;
          // Show error text as last resort
          container.innerHTML = '';
          container.appendChild(
            createElement('span', {
              classes: ['image-error'],
              text: state.alt,
            })
          );
        };

        img.src = state.fallbackSrc;
      } else {
        // Show error text immediately if no fallback
        container.innerHTML = '';
        container.appendChild(
          createElement('span', {
            classes: ['image-error'],
            text: state.alt,
          })
        );
      }
    };

    container.appendChild(img);
    return container;
  };

  // Initialize with default props
  const defaultProps = {
    src: props.src,
    alt: props.alt || 'Image',
    fallbackSrc: props.fallbackSrc || '',
    className: props.className || '',
    onClick: props.onClick || null,
    responsive: props.responsive !== undefined ? props.responsive : true,
  };

  // Create base component
  const baseComponent = createBaseComponent(renderImage)(defaultProps);

  // Determine if component needs full re-render based on props
  const shouldRerender = (newProps) => {
    const criticalProps = ['src', 'fallbackSrc', 'responsive'];
    return Object.keys(newProps).some((key) => criticalProps.includes(key));
  };

  // Perform partial update for non-critical props
  const partialUpdate = (element, newProps) => {
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

    if (newProps.alt !== undefined) {
      const img = element.querySelector('img');
      if (img) img.alt = newProps.alt;
    }

    if (newProps.onClick !== undefined) {
      if (element._listeners?.click) {
        element.removeEventListener('click', element._listeners.click);
      }

      if (newProps.onClick) {
        element.addEventListener('click', newProps.onClick);
        element._listeners = element._listeners || {};
        element._listeners.click = newProps.onClick;
      }
    }
  };

  // Enhanced component API
  return {
    ...baseComponent,
    shouldRerender,
    partialUpdate,

    /**
     * Set image source
     * @param {string} src - New image source
     * @returns {Object} Component for chaining
     */
    setSrc(src) {
      return this.update({ src });
    },

    /**
     * Set image alt text
     * @param {string} alt - New alt text
     * @returns {Object} Component for chaining
     */
    setAlt(alt) {
      return this.update({ alt });
    },
  };
};

// Required props
createImage.requiredProps = ['src'];

export default createImage;
