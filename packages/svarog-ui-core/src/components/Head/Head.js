// src/components/Head/Head.js
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';

/**
 * Validates head-specific props
 * @param {Object} props - Head properties
 */
const validateHeadProps = (props) => {
  if (props.title && props.title.length > 60) {
    console.warn(
      'Head: Title exceeds 60 characters, it may be truncated by search engines'
    );
  }

  if (props.description && props.description.length > 160) {
    console.warn(
      'Head: Description exceeds 160 characters, it may be truncated by search engines'
    );
  }
};

/**
 * Sanitizes and truncates title
 * @param {string} title - Original title
 * @returns {string} Sanitized title
 */
const sanitizeTitle = (title) => {
  return title.length > 60 ? title.substring(0, 57) + '...' : title;
};

/**
 * Sanitizes and truncates description
 * @param {string} description - Original description
 * @returns {string} Sanitized description
 */
const sanitizeDescription = (description) => {
  return description.length > 160
    ? description.substring(0, 157) + '...'
    : description;
};

/**
 * Creates and appends meta tags to container
 * @param {HTMLElement} container - Container element
 * @param {Array<Object>} tags - Meta tags to create
 */
const createAndAppendMetaTags = (container, tags) => {
  tags.forEach((tag) => {
    if (!tag || !Object.keys(tag).length) return;

    const metaTag = createElement('meta', {
      attributes: tag,
    });
    container.appendChild(metaTag);
  });
};

/**
 * Renders head DOM element structure
 * @param {Object} state - Component state
 * @returns {HTMLElement} Head container element
 */
const renderHead = (state) => {
  const container = createElement('div', {
    classes: ['seo-head'],
    style: { display: 'none' },
  });

  // Store state on the element for access in render method
  container._state = state;

  // Core SEO Meta Tags
  const metaTags = [
    { name: 'description', content: state.description },
    state.keywords.length > 0
      ? { name: 'keywords', content: state.keywords.join(', ') }
      : null,
    {
      name: 'robots',
      content: `${state.robots.index}, ${state.robots.follow}`,
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, minimum-scale=1',
    },
    { name: 'theme-color', content: state.themeColor || '#ffffff' },
  ].filter(Boolean);

  // Add Open Graph meta tags if enabled
  if (state.openGraph) {
    const { openGraph } = state;
    const ogTags = [
      { property: 'og:title', content: openGraph.title || state.title },
      {
        property: 'og:description',
        content: openGraph.description || state.description,
      },
      { property: 'og:type', content: openGraph.type || 'website' },
      { property: 'og:url', content: openGraph.url || state.canonicalUrl },
      { property: 'og:image', content: openGraph.image },
      { property: 'og:site_name', content: openGraph.siteName },
    ].filter((tag) => tag.content); // Only include tags with content

    metaTags.push(...ogTags);
  }

  // Add Twitter Card meta tags if enabled
  if (state.twitterCard) {
    const { twitterCard } = state;
    const twitterTags = [
      { name: 'twitter:card', content: twitterCard.type || 'summary' },
      { name: 'twitter:site', content: twitterCard.site },
      { name: 'twitter:title', content: twitterCard.title || state.title },
      {
        name: 'twitter:description',
        content: twitterCard.description || state.description,
      },
      { name: 'twitter:image', content: twitterCard.image },
      { name: 'twitter:creator', content: twitterCard.creator },
    ].filter((tag) => tag.content); // Only include tags with content

    metaTags.push(...twitterTags);
  }

  // Add alternate language links
  if (state.alternateLanguages && state.alternateLanguages.length) {
    state.alternateLanguages.forEach((altLang) => {
      if (altLang.hreflang && altLang.href) {
        const linkTag = createElement('link', {
          attributes: {
            rel: 'alternate',
            hreflang: altLang.hreflang,
            href: altLang.href,
          },
        });
        container.appendChild(linkTag);
      }
    });
  }

  // Performance and Crawler Optimization
  const performanceTags = [
    { 'http-equiv': 'x-ua-compatible', content: 'IE=edge' },
    { name: 'format-detection', content: 'telephone=no' },
  ];

  // Core Web Vitals Preparation
  const webVitalsTags = [
    { name: 'generator', content: 'Svarog Component Library' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
  ];

  // Add any additional custom meta tags
  const additionalTags = state.additionalMeta || [];

  // Create meta tags
  createAndAppendMetaTags(container, metaTags);
  createAndAppendMetaTags(container, performanceTags);
  createAndAppendMetaTags(container, webVitalsTags);
  createAndAppendMetaTags(container, additionalTags);

  // Title Tag
  const titleTag = createElement('title', {
    text: state.title,
  });
  container.appendChild(titleTag);

  // Optional Canonical URL
  if (state.canonicalUrl) {
    const canonicalLink = createElement('link', {
      attributes: {
        rel: 'canonical',
        href: state.canonicalUrl,
      },
    });
    container.appendChild(canonicalLink);
  }

  // Language Tag
  const htmlLangTag = createElement('meta', {
    attributes: {
      'http-equiv': 'content-language',
      content: state.lang,
    },
  });
  container.appendChild(htmlLangTag);

  // Structured Data (JSON-LD)
  if (state.schema) {
    const schemaScript = createElement('script', {
      attributes: {
        type: 'application/ld+json',
      },
      text: JSON.stringify(state.schema),
    });
    container.appendChild(schemaScript);
  }

  return container;
};

/**
 * Create a Head component for SEO optimization
 * @param {Object} props - Head properties
 * @returns {Object} Head component with standard API
 */
const createHead = (props) => {
  // Validate required props
  validateProps(props, createHead.requiredProps, 'Head');

  // Additional head-specific validation
  validateHeadProps(props);

  // Process and sanitize props
  const initialState = {
    title: sanitizeTitle(props.title),
    description: sanitizeDescription(props.description),
    lang: props.lang || 'en',
    canonicalUrl: props.canonicalUrl || '',
    schema: props.schema || null,
    keywords: (props.keywords || []).slice(0, 10), // Limit keywords
    themeColor: props.themeColor || '#ffffff',
    robots: {
      index: props.robots?.index !== false ? 'index' : 'noindex',
      follow: props.robots?.follow !== false ? 'follow' : 'nofollow',
    },
    openGraph: props.openGraph || null,
    twitterCard: props.twitterCard || null,
    alternateLanguages: props.alternateLanguages || [],
    additionalMeta: props.additionalMeta || [],
  };

  // Create base component
  const headComponent = createBaseComponent(renderHead)(initialState);

  // Extend with additional methods

  /**
   * Render SEO metadata to document head
   * @returns {Object} Component instance for chaining
   */
  headComponent.render = function () {
    // Get the current element
    const headElement = this.getElement();

    // Remove existing SEO metadata
    const existingMetadata = document.querySelector('.seo-head');
    if (existingMetadata) {
      existingMetadata.remove();
    }

    // Append new metadata to document head
    document.head.appendChild(headElement);

    // Set document language - access state directly from the component
    const state = this.getElement()._state || {};
    document.documentElement.lang = state.lang || 'en';

    return this;
  };

  /**
   * Determines if component should completely re-render on props change
   * @param {Object} newProps - New properties
   * @returns {boolean} Whether to do a full re-render
   */
  headComponent.shouldRerender = function () {
    // Always re-render for Head component as it's not performance critical
    // and the DOM structure is relatively simple
    return true;
  };

  /**
   * Add additional meta tag
   * @param {Object} metaProps - Properties for the meta tag
   * @returns {Object} Component instance for chaining
   */
  headComponent.addMeta = function (metaProps) {
    const headElement = this.getElement();
    const metaTag = createElement('meta', {
      attributes: metaProps,
    });
    headElement.appendChild(metaTag);
    return this;
  };

  /**
   * Add structured data schema
   * @param {Object} schema - JSON-LD schema object
   * @returns {Object} Component instance for chaining
   */
  headComponent.addSchema = function (schema) {
    const headElement = this.getElement();
    const schemaScript = createElement('script', {
      attributes: {
        type: 'application/ld+json',
      },
      text: JSON.stringify(schema),
    });
    headElement.appendChild(schemaScript);
    return this;
  };

  /**
   * Updates a specific meta tag
   * @param {string} name - Name or property of the meta tag to update
   * @param {string} content - New content value
   * @returns {Object} Component instance for chaining
   */
  headComponent.updateMeta = function (name, content) {
    const headElement = this.getElement();
    const metaTag =
      headElement.querySelector(`meta[name="${name}"]`) ||
      headElement.querySelector(`meta[property="${name}"]`);

    if (metaTag) {
      metaTag.setAttribute('content', content);
    } else {
      // If meta tag doesn't exist, create it
      this.addMeta({ name, content });
    }

    return this;
  };

  /**
   * Sets the document theme color
   * @param {string} color - Hex color code
   * @returns {Object} Component instance for chaining
   */
  headComponent.setThemeColor = function (color) {
    return this.updateMeta('theme-color', color);
  };

  /**
   * Respond to theme changes
   * @param {string} newTheme - New theme name
   */
  headComponent.onThemeChange = function (newTheme) {
    // Theme-specific adjustments could be made here
    // For example, updating theme-color meta tag based on the theme
    console.debug(`Head: theme changed to ${newTheme}`);
  };

  /**
   * Set GDPR/CCPA cookie consent preferences
   * @param {Object} preferences - Consent preferences
   * @returns {Object} Component instance for chaining
   */
  headComponent.setConsentPreferences = function (preferences) {
    // Add cookie consent meta tags
    const consentTags = [];

    if (preferences.advertising === false) {
      consentTags.push({ name: 'robots', content: 'noai, noimageai' });
    }

    if (preferences.analytics === false) {
      consentTags.push({ name: 'googlebot', content: 'noanalytics' });
    }

    consentTags.forEach((tag) => this.addMeta(tag));

    return this;
  };

  // Add alternate language version
  headComponent.addAlternateLanguage = function (hreflang, href) {
    const headElement = this.getElement();
    const linkTag = createElement('link', {
      attributes: {
        rel: 'alternate',
        hreflang: hreflang,
        href: href,
      },
    });
    headElement.appendChild(linkTag);
    return this;
  };

  return headComponent;
};

// Define required props for validation
createHead.requiredProps = ['title', 'description'];

// Create the component with theme awareness
const HeadComponent = withThemeAwareness(createComponent('Head', createHead));

// Export as a factory function
export default HeadComponent;
