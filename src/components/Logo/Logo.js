// src/components/Logo/Logo.js
import './Logo.css';
import { Component } from '../../utils/componentFactory.js';
import { getCurrentTheme } from '../../utils/theme.js';

/**
 * Logo component that supports theme-specific assets
 *
 * This component automatically displays the correct logo for the current theme.
 * In a real application, each project would typically use a single theme,
 * so you would only need to provide the logo for that specific theme.
 *
 * @extends Component
 */
export default class Logo extends Component {
  /**
   * Creates a new Logo instance
   *
   * @param {Object} props - Logo properties
   * @param {Object|string} props.sources - Either a single path string or an object mapping theme names to paths
   * @param {string} [props.alt='Logo'] - Alt text for the logo
   * @param {string} [props.fallbackPath] - Fallback path if theme-specific logo isn't found
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {Function} [props.onClick] - Click event handler
   * @param {boolean} [props.responsive=true] - Whether the logo should be responsive
   */
  constructor({
    sources,
    alt = 'Logo',
    fallbackPath = '',
    className = '',
    onClick = null,
    responsive = true,
  }) {
    super();

    // Validate required props
    if (!sources) {
      throw new Error('Logo: sources is required');
    }

    // SVG validation - for backward compatibility
    if (
      typeof sources === 'string' &&
      sources.toLowerCase().endsWith('.svg') &&
      !fallbackPath
    ) {
      console.warn(
        'Logo: Using SVG without fallback may not work in all environments'
      );
    }

    // Store props
    this.props = {
      sources,
      alt,
      fallbackPath,
      className,
      onClick,
      responsive,
    };

    // Create logo container
    this.container = this.createLogoContainer();

    // Bind the theme change handler once to ensure proper event removal
    this._themeChangeHandler = this.handleThemeChange.bind(this);

    // Listen for theme changes to update the logo if needed
    if (typeof window !== 'undefined') {
      window.addEventListener('themechange', this._themeChangeHandler);
    }
  }

  /**
   * Creates the logo container with the appropriate image
   * @private
   * @returns {HTMLElement} The logo container element
   */
  createLogoContainer() {
    // Create container
    const container = this.createElement('div', {
      className: this.createClassNames(
        'logo-container',
        this.props.responsive ? 'logo-container--responsive' : '',
        this.props.className
      ),
      events: {
        click: this.props.onClick,
      },
    });

    // Add image element with current theme's logo
    this.updateLogoImage(container);

    return container;
  }

  /**
   * Updates the logo image based on the current theme
   * @private
   * @param {HTMLElement} container - The container to update (defaults to this.container)
   */
  updateLogoImage(container = this.container) {
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Get the current theme
    const currentTheme = getCurrentTheme();

    // Determine which logo path to use
    let logoPath;

    if (typeof this.props.sources === 'string') {
      // If sources is just a string, use it directly
      logoPath = this.props.sources;
    } else if (typeof this.props.sources === 'object') {
      // If sources is an object, try to get the theme-specific path
      logoPath =
        this.props.sources[currentTheme] ||
        this.props.sources.default ||
        this.props.fallbackPath ||
        Object.values(this.props.sources)[0];
    }

    // Create and append the image element
    if (logoPath) {
      const img = this.createElement('img', {
        attributes: {
          src: logoPath,
          alt: this.props.alt,
          'data-theme': currentTheme,
        },
        className: 'logo-image',
      });

      // Handle image loading errors
      img.onerror = () => {
        console.error(`Failed to load logo from path: ${logoPath}`);

        // Try fallback if available and not already using it
        if (this.props.fallbackPath && logoPath !== this.props.fallbackPath) {
          img.src = this.props.fallbackPath;
          img.setAttribute('data-theme', 'fallback');
        } else {
          // Create a text fallback if we can't load the image
          container.innerHTML = `<span class="logo-error">${this.props.alt}</span>`;
        }
      };

      // Add a themed badge for story demo purposes
      if (
        typeof this.props.sources === 'object' &&
        Object.keys(this.props.sources).length > 1
      ) {
        // Only add theme badge if we have multiple themes (for demo purposes)
        const themeBadge = this.createElement('span', {
          className: 'logo-theme-badge',
          textContent: currentTheme,
        });
        container.appendChild(themeBadge);
      }

      container.appendChild(img);
    } else {
      // If no valid path found, show error text
      container.innerHTML = `<span class="logo-error">${this.props.alt}</span>`;
    }
  }

  /**
   * Handles theme change events
   * @private
   */
  handleThemeChange() {
    this.updateLogoImage();
  }

  /**
   * Clean up event listeners when the component is destroyed
   */
  destroy() {
    if (typeof window !== 'undefined' && this._themeChangeHandler) {
      // Use the stored bound handler reference for proper removal
      window.removeEventListener('themechange', this._themeChangeHandler);
      this._themeChangeHandler = null;
    }
  }

  /**
   * Gets the logo element
   * @returns {HTMLElement} The logo container element
   */
  getElement() {
    return this.container;
  }
}
