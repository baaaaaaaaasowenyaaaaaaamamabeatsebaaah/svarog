// src/components/Head/Head.js - Enhanced Version with Favicon & PWA Support
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
 * Creates favicon links for different platforms and resolutions
 * @param {Object} faviconConfig - Favicon configuration
 * @returns {Array} Array of favicon link configurations
 */
const createFaviconLinks = (faviconConfig) => {
  if (!faviconConfig) return [];

  const { basePath = '/favicon', format = 'png' } = faviconConfig;

  return [
    // Standard favicon
    { rel: 'icon', type: `image/${format}`, href: `${basePath}.${format}` },

    // Apple Touch Icons
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: `${basePath}-180x180.${format}`,
    },
    {
      rel: 'apple-touch-icon',
      sizes: '167x167',
      href: `${basePath}-167x167.${format}`,
    },
    {
      rel: 'apple-touch-icon',
      sizes: '152x152',
      href: `${basePath}-152x152.${format}`,
    },
    {
      rel: 'apple-touch-icon',
      sizes: '120x120',
      href: `${basePath}-120x120.${format}`,
    },

    // Android/Chrome Icons
    {
      rel: 'icon',
      type: `image/${format}`,
      sizes: '192x192',
      href: `${basePath}-192x192.${format}`,
    },
    {
      rel: 'icon',
      type: `image/${format}`,
      sizes: '512x512',
      href: `${basePath}-512x512.${format}`,
    },
    {
      rel: 'icon',
      type: `image/${format}`,
      sizes: '32x32',
      href: `${basePath}-32x32.${format}`,
    },
    {
      rel: 'icon',
      type: `image/${format}`,
      sizes: '16x16',
      href: `${basePath}-16x16.${format}`,
    },
  ];
};

/**
 * Creates PWA manifest link and related meta tags
 * @param {Object} pwaConfig - PWA configuration
 * @returns {Object} PWA links and meta tags
 */
const createPWAElements = (pwaConfig) => {
  if (!pwaConfig) return { links: [], metaTags: [] };

  const {
    manifestUrl = '/site.webmanifest',
    themeColor = '#ffffff',
    appleStatusBarStyle = 'default',
  } = pwaConfig;

  const links = [{ rel: 'manifest', href: manifestUrl }];

  const metaTags = [
    // Apple Web App
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: appleStatusBarStyle,
    },
    { name: 'apple-mobile-web-app-title', content: pwaConfig.appName || 'App' },

    // Microsoft
    { name: 'msapplication-TileColor', content: themeColor },
    { name: 'msapplication-config', content: '/browserconfig.xml' },

    // Theme colors
    { name: 'theme-color', content: themeColor },
    { name: 'msapplication-navbutton-color', content: themeColor },
  ];

  return { links, metaTags };
};

/**
 * Creates and appends meta tags to container
 * @param {HTMLElement} container - Container element
 * @param {Array} tags - Meta tags to create
 */
const createAndAppendMetaTags = (container, tags) => {
  tags.forEach((tag) => {
    if (!tag || !Object.keys(tag).length) return;
    const metaTag = createElement('meta', { attributes: tag });
    container.appendChild(metaTag);
  });
};

/**
 * Renders head DOM element structure with favicon and PWA support
 * @param {Object} state - Component state
 * @returns {HTMLElement} Head container element
 */
const renderHead = (state) => {
  const container = createElement('div', {
    classes: ['seo-head'],
    style: { display: 'none' },
  });

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
  ].filter(Boolean);

  // Add PWA elements
  const pwaMeta = createPWAElements(state.pwa);
  metaTags.push(...pwaMeta.metaTags);

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
    ].filter((tag) => tag.content);

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
    ].filter((tag) => tag.content);

    metaTags.push(...twitterTags);
  }

  // Add alternate language links
  if (state.alternateLanguages?.length) {
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
    { name: 'generator', content: 'Svarog Component Library' },
    { name: 'mobile-web-app-capable', content: 'yes' },
  ];

  // Create meta tags
  createAndAppendMetaTags(container, metaTags);
  createAndAppendMetaTags(container, performanceTags);
  createAndAppendMetaTags(container, state.additionalMeta || []);

  // Title Tag
  container.appendChild(createElement('title', { text: state.title }));

  // Favicon Links
  const faviconLinks = createFaviconLinks(state.favicon);
  faviconLinks.forEach((linkAttr) => {
    container.appendChild(createElement('link', { attributes: linkAttr }));
  });

  // PWA Links
  pwaMeta.links.forEach((linkAttr) => {
    container.appendChild(createElement('link', { attributes: linkAttr }));
  });

  // Canonical URL
  if (state.canonicalUrl) {
    container.appendChild(
      createElement('link', {
        attributes: { rel: 'canonical', href: state.canonicalUrl },
      })
    );
  }

  // Language Tag
  container.appendChild(
    createElement('meta', {
      attributes: { 'http-equiv': 'content-language', content: state.lang },
    })
  );

  // Structured Data (JSON-LD)
  if (state.schema) {
    container.appendChild(
      createElement('script', {
        attributes: { type: 'application/ld+json' },
        text: JSON.stringify(state.schema),
      })
    );
  }

  return container;
};

/**
 * Create a Head component for SEO optimization with favicon and PWA support
 * @param {Object} props - Head properties
 * @returns {Object} Head component with standard API
 */
export const createHead = (props) => {
  validateProps(props, createHead.requiredProps, 'Head');
  validateHeadProps(props);

  const initialState = {
    title:
      props.title.length > 60
        ? `${props.title.substring(0, 57)}...`
        : props.title,
    description:
      props.description.length > 160
        ? `${props.description.substring(0, 157)}...`
        : props.description,
    lang: props.lang || 'en',
    canonicalUrl: props.canonicalUrl || '',
    schema: props.schema || null,
    keywords: (props.keywords || []).slice(0, 10),
    robots: {
      index: props.robots?.index !== false ? 'index' : 'noindex',
      follow: props.robots?.follow !== false ? 'follow' : 'nofollow',
    },
    openGraph: props.openGraph || null,
    twitterCard: props.twitterCard || null,
    alternateLanguages: props.alternateLanguages || [],
    additionalMeta: props.additionalMeta || [],
    favicon: props.favicon || null,
    pwa: props.pwa || null,
  };

  const headComponent = createBaseComponent(renderHead)(initialState);

  headComponent.render = function () {
    const headElement = this.getElement();
    const existingMetadata = document.querySelector('.seo-head');
    if (existingMetadata) existingMetadata.remove();

    document.head.appendChild(headElement);
    document.documentElement.lang = this.getElement()._state?.lang || 'en';
    return this;
  };

  headComponent.shouldRerender = () => true;

  headComponent.addMeta = function (metaProps) {
    const headElement = this.getElement();
    const metaTag = createElement('meta', { attributes: metaProps });
    headElement.appendChild(metaTag);
    return this;
  };

  headComponent.addSchema = function (schema) {
    const headElement = this.getElement();
    const schemaScript = createElement('script', {
      attributes: { type: 'application/ld+json' },
      text: JSON.stringify(schema),
    });
    headElement.appendChild(schemaScript);
    return this;
  };

  headComponent.updateMeta = function (name, content) {
    const headElement = this.getElement();
    const metaTag =
      headElement.querySelector(`meta[name="${name}"]`) ||
      headElement.querySelector(`meta[property="${name}"]`);

    if (metaTag) {
      metaTag.setAttribute('content', content);
    } else {
      this.addMeta({ name, content });
    }
    return this;
  };

  headComponent.setThemeColor = function (color) {
    const state = this.getElement()._state;
    if (state?.pwa) {
      this.update({ pwa: { ...state.pwa, themeColor: color } });
    }
    return this.updateMeta('theme-color', color);
  };

  headComponent.setFavicon = function (faviconConfig) {
    this.update({ favicon: faviconConfig });
    return this;
  };

  headComponent.setPWA = function (pwaConfig) {
    this.update({ pwa: pwaConfig });
    return this;
  };

  headComponent.generateManifest = function (manifestConfig = {}) {
    const state = this.getElement()._state || {};
    const {
      name = state.title,
      shortName = name?.substring(0, 12),
      description = state.description,
      startUrl = '/',
      display = 'standalone',
      backgroundColor = '#ffffff',
      themeColor = '#000000',
      orientation = 'portrait-primary',
      scope = '/',
      icons = [],
    } = manifestConfig;

    return {
      name,
      short_name: shortName,
      description,
      start_url: startUrl,
      display,
      background_color: backgroundColor,
      theme_color: themeColor,
      orientation,
      scope,
      icons: icons.length
        ? icons
        : [
            {
              src: '/favicon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/favicon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
    };
  };

  headComponent.onThemeChange = function (newTheme) {
    console.debug(`Head: theme changed to ${newTheme}`);
  };

  headComponent.setConsentPreferences = function (preferences) {
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

  headComponent.addAlternateLanguage = function (hreflang, href) {
    const headElement = this.getElement();
    const linkTag = createElement('link', {
      attributes: { rel: 'alternate', hreflang, href },
    });
    headElement.appendChild(linkTag);
    return this;
  };

  return headComponent;
};

createHead.requiredProps = ['title', 'description'];

const HeadComponent = withThemeAwareness(createComponent('Head', createHead));

export default HeadComponent;
