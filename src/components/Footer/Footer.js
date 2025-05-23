// src/components/Footer/Footer.js
import './Footer.css';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';
import { validateRequiredProps } from '../../utils/validation.js';

/**
 * Creates a Footer component
 * @param {Object} props - Footer properties
 * @param {string} [props.siteName=''] - Site name for copyright text
 * @param {Object} [props.footer={}] - Footer configuration
 * @param {string} [props.footer.copyright=''] - Copyright text
 * @param {Array} [props.footer.links=[]] - Footer links
 * @param {Array} [props.footer.social=[]] - Social media links
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {Object} Footer component
 */
const createFooter = (props) => {
  // Validate props
  const requirements = {
    siteName: { type: 'string', required: false },
    footer: { type: 'object', required: false },
    className: { type: 'string', required: false },
  };

  validateRequiredProps(props, requirements, 'Footer');

  // Initialize with default props
  const initialProps = {
    siteName: '',
    footer: {
      copyright: '',
      links: [],
      social: [],
    },
    className: '',
    ...props,
  };

  // Ensure footer contains all required properties
  initialProps.footer = {
    copyright: '',
    links: [],
    social: [],
    ...initialProps.footer,
  };

  // Reference to latest state
  let currentState = { ...initialProps };

  /**
   * Migrates legacy props to standardized ones
   * @param {Object} props - Component props
   * @returns {Object} Normalized props
   */
  const migrateLegacyProps = (props) => {
    if (!props || typeof props !== 'object') return props;

    const migrated = { ...props };

    // Handle footer links and social links
    if (migrated.footer?.links) {
      migrated.footer.links = migrated.footer.links.map((link) => {
        if ('url' in link && !('href' in link)) {
          console.warn(
            '[Footer] link.url is deprecated, use link.href instead'
          );
          return { ...link, href: link.url };
        }
        return link;
      });
    }

    if (migrated.footer?.social) {
      migrated.footer.social = migrated.footer.social.map((social) => {
        if ('url' in social && !('href' in social)) {
          console.warn(
            '[Footer] social.url is deprecated, use social.href instead'
          );
          return { ...social, href: social.url };
        }
        return social;
      });
    }

    return migrated;
  };

  /**
   * Renders the footer element based on current state
   * @param {Object} state - Current component state
   * @returns {HTMLElement} Footer element
   */
  const renderFooter = (state) => {
    // Update our reference to current state
    currentState = { ...state };

    const { siteName, footer, className } = state;
    const { copyright, links, social } = footer;

    // Create footer element
    const footerElement = createElement('footer', {
      classes: ['footer', className].filter(Boolean),
      attributes: {
        'data-testid': 'footer',
      },
    });

    // Create container
    const container = createElement('div', {
      classes: ['footer__container'],
    });

    // Links section
    if (links && links.length > 0) {
      const linksSection = createElement('div', {
        classes: ['footer__links'],
      });

      links.forEach((link) => {
        const linkElement = createElement('a', {
          classes: ['footer__link'],
          attributes: {
            href: link.href || link.url || '#', // Support both new href and legacy url
            'data-label': link.label, // Add data attribute for testing
          },
          text: link.label,
        });

        linksSection.appendChild(linkElement);
      });

      container.appendChild(linksSection);
    }

    // Social links section
    if (social && social.length > 0) {
      const socialSection = createElement('div', {
        classes: ['footer__social'],
      });

      social.forEach((item) => {
        const socialLink = createElement('a', {
          classes: ['footer__social-link'],
          attributes: {
            href: item.href || item.url || '#', // Support both new href and legacy url
            target: '_blank',
            rel: 'noopener noreferrer',
            'data-platform': item.platform, // Add data attribute for testing
          },
          text: item.platform,
        });

        socialSection.appendChild(socialLink);
      });

      container.appendChild(socialSection);
    }

    // Copyright section
    const copyrightSection = createElement('div', {
      classes: ['footer__copyright'],
    });

    const copyrightText =
      copyright ||
      `© ${new Date().getFullYear()} ${siteName || ''}. All rights reserved.`;

    const copyrightElement = createElement('p', {
      classes: ['footer__copyright-text'],
      attributes: {
        'data-copyright': copyright || 'default', // Add data attribute for testing
      },
      text: copyrightText,
    });

    copyrightSection.appendChild(copyrightElement);
    container.appendChild(copyrightSection);

    footerElement.appendChild(container);
    return footerElement;
  };

  // Normalize props before creating the component
  const normalizedProps = migrateLegacyProps(initialProps);

  // Create component using baseComponent
  const baseComponent = createBaseComponent(renderFooter)(normalizedProps);

  /**
   * Determines if component needs to fully re-render based on prop changes
   * @param {Object} newProps - New properties
   * @returns {boolean} Whether a full re-render is required
   */
  const shouldRerender = (newProps) => {
    // Critical props that require a full re-render
    const criticalProps = ['siteName', 'footer'];
    return Object.keys(newProps).some((key) => criticalProps.includes(key));
  };

  /**
   * Perform partial update without full re-render
   * @param {HTMLElement} element - Current element
   * @param {Object} newProps - New properties
   */
  const partialUpdate = (element, newProps) => {
    // Update className
    if (newProps.className !== undefined) {
      const baseClass = 'footer';
      const newClasses = newProps.className
        ? [baseClass, newProps.className]
        : [baseClass];
      element.className = newClasses.join(' ');
    }
  };

  // Extended component with custom methods
  const footerComponent = {
    ...baseComponent,
    shouldRerender,
    partialUpdate,

    /**
     * Update component with new properties
     * @param {Object} newProps - New properties to update
     * @returns {Object} Component instance for chaining
     */
    update(newProps) {
      return baseComponent.update(migrateLegacyProps(newProps));
    },

    /**
     * Updates the copyright text
     * @param {string} copyright - New copyright text
     * @returns {Object} Footer component (for chaining)
     */
    setCopyright(copyright) {
      const newFooter = {
        ...currentState.footer,
        copyright,
      };

      return this.update({
        footer: newFooter,
      });
    },

    /**
     * Updates the footer links
     * @param {Array} links - New footer links
     * @returns {Object} Footer component (for chaining)
     */
    setLinks(links) {
      // Normalize links to use href instead of url
      const normalizedLinks = links.map((link) => {
        if ('url' in link && !('href' in link)) {
          console.warn(
            '[Footer] link.url is deprecated, use link.href instead'
          );
          return { ...link, href: link.url };
        }
        return link;
      });

      const newFooter = {
        ...currentState.footer,
        links: normalizedLinks,
      };

      return baseComponent.update({
        footer: newFooter,
      });
    },

    /**
     * Updates the social links
     * @param {Array} social - New social links
     * @returns {Object} Footer component (for chaining)
     */
    setSocial(social) {
      // Normalize social links to use href instead of url
      const normalizedSocial = social.map((item) => {
        if ('url' in item && !('href' in item)) {
          console.warn(
            '[Footer] social.url is deprecated, use social.href instead'
          );
          return { ...item, href: item.url };
        }
        return item;
      });

      const newFooter = {
        ...currentState.footer,
        social: normalizedSocial,
      };

      return baseComponent.update({
        footer: newFooter,
      });
    },
  };

  // Add theme change handler
  footerComponent.onThemeChange = (newTheme, previousTheme) => {
    console.debug(`Footer: theme changed from ${previousTheme} to ${newTheme}`);
  };

  return footerComponent;
};

// Define required props for validation
createFooter.requiredProps = [];

// Export as a factory function
export default createFooter;
