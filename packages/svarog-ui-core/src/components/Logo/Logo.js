// src/components/Logo/Logo.js - FIXED VERSION
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';
import Image from '../Image/index.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { logoStyles } from './Logo.styles.js';

// Create style injector for Logo component
const injectLogoStyles = createStyleInjector('Logo');

/**
 * Creates a Logo component
 * @param {Object} props - Logo properties
 * @param {string} [props.imageUrl] - Path to the logo image
 * @param {string} [props.src] - Legacy: Path to the logo image (use imageUrl instead)
 * @param {string} [props.alt='Logo'] - Alt text for the logo
 * @param {string} [props.fallbackImageUrl=''] - Fallback image path if the primary image fails to load
 * @param {string} [props.fallbackSrc=''] - Legacy: Fallback image path (use fallbackImageUrl instead)
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Function} [props.onClick=null] - Click event handler
 * @param {boolean} [props.responsive=true] - Whether logo should be responsive
 * @returns {Object} Logo component API object
 */
const createLogo = (props = {}) => {
  // Inject styles on component creation
  injectLogoStyles(logoStyles);

  // Normalize legacy props
  const normalizedProps = { ...props };

  // Handle legacy src prop
  if ('src' in props && !('imageUrl' in props)) {
    console.warn('[Logo] src is deprecated, use imageUrl instead');
    normalizedProps.imageUrl = props.src;
    delete normalizedProps.src;
  }

  // Handle legacy fallbackSrc prop
  if ('fallbackSrc' in props && !('fallbackImageUrl' in props)) {
    console.warn(
      '[Logo] fallbackSrc is deprecated, use fallbackImageUrl instead'
    );
    normalizedProps.fallbackImageUrl = props.fallbackSrc;
    delete normalizedProps.fallbackSrc;
  }

  // Validate required props
  if (!normalizedProps.imageUrl) {
    throw new Error('Logo: imageUrl is required');
  }

  /**
   * Renders the logo element based on current state
   * @param {Object} state - Current component state
   * @returns {HTMLElement} Logo container element
   */
  const renderLogo = (state) => {
    // Create container with proper classes
    const containerClasses = [
      'logo-container',
      state.responsive ? 'logo-container--responsive' : '',
      state.className,
    ].filter(Boolean);

    const container = createElement('div', {
      classes: containerClasses,
    });

    // ✅ FIX: Create logo image using CORRECT prop names
    const image = Image({
      imageUrl: state.imageUrl, // ✅ Use correct prop name
      fallbackImageUrl: state.fallbackImageUrl, // ✅ Use correct prop name
      alt: state.alt,
      onClick: state.onClick,
      responsive: true, // Always make image responsive
      className: 'logo-image',
    });

    container.appendChild(image.getElement());
    return container;
  };

  // Create component using baseComponent with default props
  const baseComponent = createBaseComponent(renderLogo)({
    imageUrl: normalizedProps.imageUrl,
    alt: normalizedProps.alt || 'Logo',
    fallbackImageUrl: normalizedProps.fallbackImageUrl || '',
    className: normalizedProps.className || '',
    onClick: normalizedProps.onClick || null,
    responsive:
      normalizedProps.responsive !== undefined
        ? normalizedProps.responsive
        : true,
  });

  /**
   * Determines if component needs to fully re-render based on prop changes
   * @param {Object} newProps - New properties
   * @returns {boolean} Whether a full re-render is required
   */
  const shouldRerender = (newProps) => {
    // Normalize legacy props in updates
    const normalizedNewProps = { ...newProps };

    if ('src' in newProps && !('imageUrl' in newProps)) {
      console.warn('[Logo] src is deprecated, use imageUrl instead');
      normalizedNewProps.imageUrl = newProps.src;
      delete normalizedNewProps.src;
    }

    if ('fallbackSrc' in newProps && !('fallbackImageUrl' in newProps)) {
      console.warn(
        '[Logo] fallbackSrc is deprecated, use fallbackImageUrl instead'
      );
      normalizedNewProps.fallbackImageUrl = newProps.fallbackSrc;
      delete normalizedNewProps.fallbackSrc;
    }

    // Only rebuild if these props change
    const criticalProps = ['imageUrl', 'fallbackImageUrl', 'responsive'];
    return Object.keys(normalizedNewProps).some((key) =>
      criticalProps.includes(key)
    );
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
        'logo-container',
        baseComponent.getState().responsive ? 'logo-container--responsive' : '',
        newProps.className,
      ]
        .filter(Boolean)
        .join(' ');

      element.className = classes;
    }
  };

  // Extended component with custom methods
  const logoComponent = {
    ...baseComponent,

    /**
     * Override the update method to handle legacy props
     * @param {Object} newProps - New properties to update
     * @returns {Object} The component instance
     */
    update(newProps) {
      // Normalize legacy props
      const normalizedNewProps = { ...newProps };

      if ('src' in newProps && !('imageUrl' in newProps)) {
        console.warn('[Logo] src is deprecated, use imageUrl instead');
        normalizedNewProps.imageUrl = newProps.src;
        delete normalizedNewProps.src;
      }

      if ('fallbackSrc' in newProps && !('fallbackImageUrl' in newProps)) {
        console.warn(
          '[Logo] fallbackSrc is deprecated, use fallbackImageUrl instead'
        );
        normalizedNewProps.fallbackImageUrl = newProps.fallbackSrc;
        delete normalizedNewProps.fallbackSrc;
      }

      return baseComponent.update(normalizedNewProps);
    },

    shouldRerender,
    partialUpdate,

    /**
     * Set logo source (legacy method)
     * @param {string} newSrc - New image URL
     * @returns {Object} Logo component (for chaining)
     */
    setSrc(newSrc) {
      console.warn('[Logo] setSrc is deprecated, use setImageUrl instead');
      return this.setImageUrl(newSrc);
    },

    /**
     * Set logo image URL
     * @param {string} newImageUrl - New image URL
     * @returns {Object} Logo component (for chaining)
     */
    setImageUrl(newImageUrl) {
      return this.update({ imageUrl: newImageUrl });
    },
  };

  return logoComponent;
};

// Define required props for validation - empty since we handle validation ourselves
createLogo.requiredProps = [];

// Export the factory function
export default createLogo;
