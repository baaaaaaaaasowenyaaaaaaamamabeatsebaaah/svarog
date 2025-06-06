// src/components/Header/Header.js
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';
import Navigation from '../Navigation/index.js';
import Logo from '../Logo/index.js';
import Link from '../Link/index.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { headerStyles } from './Header.styles.js';

// Create style injector for Header component
const injectStyles = createStyleInjector('Header');

/**
 * Creates a Header component
 * @param {Object} props - Header properties
 * @param {string} [props.siteName=''] - Website name
 * @param {Object} [props.navigation={}] - Navigation configuration
 * @param {string} [props.logo=''] - Logo source URL
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {Object} Header component API object
 */
const createHeader = (props) => {
  // Default props with proper validation
  const initialProps = {
    siteName: '',
    navigation: { items: [] },
    logo: '',
    className: '',
    ...props,
  };

  /**
   * Normalizes navigation items to use standardized href property
   * @param {Array} items - Navigation items
   * @returns {Array} Updated navigation items
   */
  const normalizeNavigationItems = (items) => {
    if (!items || !Array.isArray(items)) {
      return items;
    }

    return items.map((item) => {
      const newItem = { ...item };

      // Convert url to href if needed
      if (newItem.url && !newItem.href) {
        console.warn('[Header] url is deprecated, use href instead');
        newItem.href = newItem.url;
        delete newItem.url;
      }

      // Recursively handle children
      if (newItem.items && Array.isArray(newItem.items)) {
        newItem.items = normalizeNavigationItems(newItem.items);
      }

      return newItem;
    });
  };

  /**
   * Renders the header element based on current state
   * @param {Object} state - Current component state
   * @returns {HTMLElement} Header element
   */
  const renderHeader = (state) => {
    // Inject styles on render
    injectStyles(headerStyles);

    // Create header container with proper classes
    const header = createElement('header', {
      classes: ['header', state.className].filter(Boolean).join(' '),
    });

    // Create container
    const container = createElement('div', {
      classes: 'header__container',
    });

    // Create brand section
    const brand = createElement('div', {
      classes: 'header__brand',
    });

    // Add logo or site name
    if (state.logo) {
      const logoLink = Link({
        children: Logo({
          src: state.logo,
          alt: state.siteName || 'Logo',
        }),
        href: '/',
        block: true,
      });
      brand.appendChild(logoLink.getElement());
    } else if (state.siteName) {
      const siteNameLink = Link({
        children: state.siteName,
        href: '/',
        block: true,
      });
      siteNameLink.getElement().className = 'header__site-name';
      brand.appendChild(siteNameLink.getElement());
    }

    container.appendChild(brand);

    // Add navigation if provided
    if (
      state.navigation &&
      state.navigation.items &&
      state.navigation.items.length > 0
    ) {
      // Normalize navigation items to use href consistently
      const navigationItems = normalizeNavigationItems(state.navigation.items);

      const nav = Navigation({
        items: navigationItems,
        responsive: true,
        theme: 'default',
      });
      container.appendChild(nav.getElement());
    }

    header.appendChild(container);
    return header;
  };

  // Create component using baseComponent
  const headerComponent = createBaseComponent(renderHeader)(initialProps);

  /**
   * Determines if component needs to fully re-render based on prop changes
   * @param {Object} newProps - New properties
   * @returns {boolean} Whether a full re-render is required
   */
  const shouldRerender = (newProps) => {
    // Key props that require full re-render
    const criticalProps = ['siteName', 'logo', 'navigation'];
    return Object.keys(newProps).some((key) => criticalProps.includes(key));
  };

  /**
   * Perform partial update without full re-render
   * @param {HTMLElement} element - Current element
   * @param {Object} newProps - New properties
   */
  const partialUpdate = (element, newProps) => {
    // Update className if it changed
    if (newProps.className !== undefined) {
      const baseClass = 'header';
      const newClasses = [baseClass];

      if (newProps.className) {
        newClasses.push(newProps.className);
      }

      element.className = newClasses.join(' ');
    }
  };

  // Extended component with additional methods
  return {
    ...headerComponent,
    shouldRerender,
    partialUpdate,

    /**
     * Set header site name
     * @param {string} newSiteName - New site name
     * @returns {Object} Header component (for chaining)
     */
    setSiteName(newSiteName) {
      return this.update({ siteName: newSiteName });
    },

    /**
     * Set header logo
     * @param {string} newLogo - New logo URL
     * @returns {Object} Header component (for chaining)
     */
    setLogo(newLogo) {
      return this.update({ logo: newLogo });
    },

    /**
     * Handle theme changes
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      console.debug(`Header: theme changed from ${previousTheme} to ${theme}`);
      // Theme-specific adaptations could be added here
    },
  };
};

// Export the factory function
export default createHeader;
