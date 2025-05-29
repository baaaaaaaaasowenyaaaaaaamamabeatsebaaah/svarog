// src/components/Image/Image.js
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { imageStyles } from './Image.styles.js';

// Create style injector for Image component
const injectImageStyles = createStyleInjector('Image');

/**
 * Creates an Image component with lazy-loading, fallback support, and responsive options
 * @param {Object} props - Image properties
 * @param {string} props.imageUrl - Path to the image (required)
 * @param {string} [props.src] - DEPRECATED: Path to the image (use imageUrl instead)
 * @param {string} [props.alt='Image'] - Alt text for the image
 * @param {string} [props.fallbackImageUrl] - Fallback image path if the primary image fails
 * @param {string} [props.fallbackSrc] - DEPRECATED: Fallback image path (use fallbackImageUrl instead)
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onClick] - Click event handler
 * @param {boolean} [props.responsive=true] - Whether image should be responsive
 * @returns {Object} Image component API object
 */
const Image = (props) => {
  // Inject styles on component creation
  injectImageStyles(imageStyles);

  // Migrate legacy props
  const normalizedProps = migrateLegacyProps(props);

  if (!normalizedProps.imageUrl) {
    throw new Error('Image: imageUrl is required');
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
        src: state.imageUrl,
        alt: state.alt,
        loading: 'lazy',
      },
    });

    // Track error state to prevent infinite loops
    let errorHandled = false;

    // Handle image loading errors
    img.onerror = () => {
      // Prevent multiple error handling
      if (errorHandled) {
        return;
      }
      errorHandled = true;

      console.error(`Failed to load image from path: ${state.imageUrl}`);

      if (state.fallbackImageUrl) {
        // Set new error handler for fallback image
        img.onerror = () => {
          console.error(
            `Failed to load fallback image from path: ${state.fallbackImageUrl}`
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

        img.src = state.fallbackImageUrl;
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
    imageUrl: normalizedProps.imageUrl,
    alt: normalizedProps.alt || 'Image',
    fallbackImageUrl: normalizedProps.fallbackImageUrl || '',
    className: normalizedProps.className || '',
    onClick: normalizedProps.onClick || null,
    responsive:
      normalizedProps.responsive !== undefined
        ? normalizedProps.responsive
        : true,
  };

  // Create base component
  const baseComponent = createBaseComponent(renderImage)(defaultProps);

  // Determine if component needs full re-render based on props
  const shouldRerender = (newProps) => {
    const normalizedNewProps = migrateLegacyProps(newProps);
    const criticalProps = ['imageUrl', 'fallbackImageUrl', 'responsive'];
    return Object.keys(normalizedNewProps).some((key) =>
      criticalProps.includes(key)
    );
  };

  // Perform partial update for non-critical props
  const partialUpdate = (element, newProps) => {
    const normalizedNewProps = migrateLegacyProps(newProps);

    if (normalizedNewProps.className !== undefined) {
      const classes = [
        'image-container',
        baseComponent.getState().responsive
          ? 'image-container--responsive'
          : '',
        normalizedNewProps.className,
      ]
        .filter(Boolean)
        .join(' ');

      element.className = classes;
    }

    if (normalizedNewProps.alt !== undefined) {
      const img = element.querySelector('img');
      if (img) {
        img.alt = normalizedNewProps.alt;
      }
    }

    if (normalizedNewProps.onClick !== undefined) {
      if (element._listeners?.click) {
        element.removeEventListener('click', element._listeners.click);
      }

      if (normalizedNewProps.onClick) {
        element.addEventListener('click', normalizedNewProps.onClick);
        element._listeners = element._listeners || {};
        element._listeners.click = normalizedNewProps.onClick;
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
     * @param {string} imageUrl - New image source
     * @returns {Object} Component for chaining
     */
    setImageUrl(imageUrl) {
      return this.update({ imageUrl });
    },

    /**
     * DEPRECATED: Set image source
     * @param {string} src - New image source
     * @returns {Object} Component for chaining
     */
    setSrc(src) {
      console.warn('Image: setSrc is deprecated, use setImageUrl instead');
      return this.update({ imageUrl: src });
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

/**
 * Migrate legacy props to standardized props
 * @param {Object} props - Original props
 * @returns {Object} Normalized props
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  if ('src' in props && !('imageUrl' in props)) {
    console.warn('[Image] src is deprecated, use imageUrl instead');
    migrated.imageUrl = props.src;
    delete migrated.src;
  }

  if ('fallbackSrc' in props && !('fallbackImageUrl' in props)) {
    console.warn(
      '[Image] fallbackSrc is deprecated, use fallbackImageUrl instead'
    );
    migrated.fallbackImageUrl = props.fallbackSrc;
    delete migrated.fallbackSrc;
  }

  return migrated;
};

// Required props
Image.requiredProps = ['imageUrl'];

export default Image;
