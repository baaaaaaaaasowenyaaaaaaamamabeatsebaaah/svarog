// src/components/Head/Head.advanced.js
// Additional SEO features specifically valuable for SMBs

import { createElement } from '../../utils/componentFactory.js';
import { createHead } from './Head.js';

/**
 * Creates resource hints for performance optimization
 * @param {Object} resourceHints - Resource hints configuration
 * @returns {Array} Array of link configurations
 */
const createResourceHints = (resourceHints) => {
  if (!resourceHints) return [];

  const links = [];

  // DNS prefetch for external domains
  if (resourceHints.dnsPrefetch) {
    resourceHints.dnsPrefetch.forEach((domain) => {
      links.push({ rel: 'dns-prefetch', href: domain });
    });
  }

  // Preconnect for critical external resources
  if (resourceHints.preconnect) {
    resourceHints.preconnect.forEach((domain) => {
      links.push({ rel: 'preconnect', href: domain, crossorigin: true });
    });
  }

  // Preload critical resources
  if (resourceHints.preload) {
    resourceHints.preload.forEach((resource) => {
      links.push({
        rel: 'preload',
        href: resource.href,
        as: resource.as,
        type: resource.type,
        crossorigin: resource.crossorigin,
      });
    });
  }

  // Prefetch for likely next pages
  if (resourceHints.prefetch) {
    resourceHints.prefetch.forEach((href) => {
      links.push({ rel: 'prefetch', href });
    });
  }

  return links;
};

/**
 * Creates local business structured data (crucial for SMBs)
 * @param {Object} businessData - Business information
 * @returns {Object} JSON-LD structured data
 */
const createLocalBusinessSchema = (businessData) => {
  if (!businessData) return null;

  const {
    name,
    description,
    address,
    phone,
    email,
    website,
    openingHours,
    priceRange,
    image,
    logo,
    socialMedia = {},
    geo = {},
    businessType = 'LocalBusiness',
  } = businessData;

  const schema = {
    '@context': 'https://schema.org',
    '@type': businessType,
    name,
    description,
    telephone: phone,
    email,
    url: website,
    priceRange,
    image,
    logo,
  };

  // Address
  if (address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: address.country,
    };
  }

  // Geo coordinates
  if (geo.latitude && geo.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }

  // Opening hours
  if (openingHours) {
    schema.openingHoursSpecification = openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.day,
      opens: hours.open,
      closes: hours.close,
    }));
  }

  // Social media profiles
  if (Object.keys(socialMedia).length > 0) {
    schema.sameAs = Object.values(socialMedia).filter(Boolean);
  }

  return schema;
};

/**
 * Creates FAQ structured data for rich snippets
 * @param {Array} faqs - Array of FAQ objects
 * @returns {Object} JSON-LD structured data
 */
const createFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Creates verification meta tags
 * @param {Object} verifications - Verification codes
 * @returns {Array} Array of meta tag configurations
 */
const createVerificationTags = (verifications) => {
  if (!verifications) return [];

  const tags = [];

  if (verifications.google) {
    tags.push({
      name: 'google-site-verification',
      content: verifications.google,
    });
  }

  if (verifications.bing) {
    tags.push({ name: 'msvalidate.01', content: verifications.bing });
  }

  if (verifications.pinterest) {
    tags.push({ name: 'p:domain_verify', content: verifications.pinterest });
  }

  if (verifications.facebook) {
    tags.push({
      name: 'facebook-domain-verification',
      content: verifications.facebook,
    });
  }

  return tags;
};

/**
 * Creates analytics and tracking tags
 * @param {Object} analytics - Analytics configuration
 * @returns {Array} Array of script elements
 */
const createAnalyticsTags = (analytics) => {
  if (!analytics) return [];

  const scripts = [];

  // Google Analytics 4
  if (analytics.googleAnalytics) {
    const { measurementId, config = {} } = analytics.googleAnalytics;

    const gaScript = createElement('script', {
      attributes: {
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
      },
    });
    scripts.push(gaScript);

    const configScript = createElement('script', {
      text: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}', ${JSON.stringify(config)});
      `,
    });
    scripts.push(configScript);
  }

  // Google Tag Manager
  if (analytics.googleTagManager) {
    const gtmScript = createElement('script', {
      text: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${analytics.googleTagManager}');
      `,
    });
    scripts.push(gtmScript);
  }

  return scripts;
};

/**
 * Enhanced Head component factory with advanced SMB-focused SEO features
 * @param {Object} props - Enhanced props including advanced SEO features
 * @returns {Object} Enhanced Head component
 */
export const createAdvancedHead = (props) => {
  const baseHead = createHead(props);

  const advancedState = {
    ...baseHead.getElement()._state,
    resourceHints: props.resourceHints || null,
    localBusiness: props.localBusiness || null,
    faqs: props.faqs || null,
    verifications: props.verifications || null,
    analytics: props.analytics || null,
    security: props.security || null,
  };

  const originalRender = baseHead.render;

  baseHead.render = function () {
    const headElement = this.getElement();

    // Add resource hints
    const resourceHintLinks = createResourceHints(advancedState.resourceHints);
    resourceHintLinks.forEach((linkAttr) => {
      if (linkAttr && Object.keys(linkAttr).length > 0) {
        headElement.appendChild(
          createElement('link', { attributes: linkAttr })
        );
      }
    });

    // Add verification tags
    const verificationTags = createVerificationTags(
      advancedState.verifications
    );
    verificationTags.forEach((metaAttr) => {
      headElement.appendChild(createElement('meta', { attributes: metaAttr }));
    });

    // Add local business schema
    const localBusinessSchema = createLocalBusinessSchema(
      advancedState.localBusiness
    );
    if (localBusinessSchema) {
      headElement.appendChild(
        createElement('script', {
          attributes: { type: 'application/ld+json' },
          text: JSON.stringify(localBusinessSchema),
        })
      );
    }

    // Add FAQ schema
    const faqSchema = createFAQSchema(advancedState.faqs);
    if (faqSchema) {
      headElement.appendChild(
        createElement('script', {
          attributes: { type: 'application/ld+json' },
          text: JSON.stringify(faqSchema),
        })
      );
    }

    // Add analytics scripts
    const analyticsScripts = createAnalyticsTags(advancedState.analytics);
    analyticsScripts.forEach((script) => {
      headElement.appendChild(script);
    });

    // Security headers
    if (advancedState.security) {
      const { contentSecurityPolicy, referrerPolicy } = advancedState.security;

      if (contentSecurityPolicy) {
        headElement.appendChild(
          createElement('meta', {
            attributes: {
              'http-equiv': 'Content-Security-Policy',
              content: contentSecurityPolicy,
            },
          })
        );
      }

      if (referrerPolicy) {
        headElement.appendChild(
          createElement('meta', {
            attributes: { name: 'referrer', content: referrerPolicy },
          })
        );
      }
    }

    return originalRender.call(this);
  };

  baseHead.setupLocalBusiness = function (businessData) {
    advancedState.localBusiness = businessData;
    this.render();
    return this;
  };

  baseHead.addFAQs = function (faqs) {
    advancedState.faqs = faqs;
    this.render();
    return this;
  };

  baseHead.setupResourceHints = function (hints) {
    advancedState.resourceHints = hints;
    this.render();
    return this;
  };

  baseHead.addVerifications = function (verifications) {
    advancedState.verifications = verifications;
    this.render();
    return this;
  };

  baseHead.setupAnalytics = function (analytics) {
    advancedState.analytics = analytics;
    this.render();
    return this;
  };

  baseHead.setupSMB = function (smbConfig) {
    const {
      business,
      faqs,
      analytics,
      verifications,
      resourceHints,
      security,
    } = smbConfig;

    Object.assign(advancedState, {
      localBusiness: business,
      faqs,
      analytics,
      verifications,
      resourceHints,
      security,
    });

    this.render();
    return this;
  };

  return baseHead;
};

/**
 * Simplified SMB Head factory
 * @param {Object} config - SMB configuration
 * @returns {Object} SMB-optimized Head component
 */
export const createSMBHead = (config) => {
  return createAdvancedHead({
    title: config.businessName,
    description: config.description,
    keywords: config.keywords,
    canonicalUrl: config.website,

    favicon: { basePath: '/favicon', format: 'png' },
    pwa: {
      manifestUrl: '/site.webmanifest',
      appName: config.businessName,
      themeColor: config.themeColor || '#2563eb',
    },

    localBusiness: config.business,
    faqs: config.faqs,
    analytics: config.analytics,
    verifications: config.verifications,

    resourceHints: {
      dnsPrefetch: ['//fonts.googleapis.com', '//www.google-analytics.com'],
      preconnect: ['//fonts.gstatic.com'],
      preload: config.criticalResources || [],
    },
  });
};
