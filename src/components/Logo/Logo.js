// src/components/Logo/Logo.js
import './Logo.css';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';
import Image from '../Image/index.js';

/**
 * Creates a Logo component
 * @param {Object} props - Logo properties
 * @param {string} props.src - Path to the logo image
 * @param {string} [props.alt='Logo'] - Alt text for the logo
 * @param {string} [props.fallbackSrc=''] - Fallback image path if the primary image fails to load
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Function} [props.onClick=null] - Click event handler
 * @param {boolean} [props.responsive=true] - Whether logo should be responsive
 * @returns {Object} Logo component API object
 */
const createLogo = (props) => {
  // Validate props
  if (!props.src) {
    throw new Error('Logo: src is required');
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

    // Use 'classes' instead of 'className' for createElement
    const container = createElement('div', {
      classes: containerClasses,
    });

    // Create logo image using Image component
    const image = Image({
      src: state.src,
      fallbackSrc: state.fallbackSrc,
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
    src: props.src,
    alt: props.alt || 'Logo',
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
    shouldRerender,
    partialUpdate,

    /**
     * Set logo source
     * @param {string} newSrc - New src
     * @returns {Object} Logo component (for chaining)
     */
    setSrc(newSrc) {
      return this.update({ src: newSrc });
    },
  };

  return logoComponent;
};

// Define required props for validation
createLogo.requiredProps = ['src'];

// Export the factory function
export default createLogo;
