/**
 * Advanced SEO-Focused Head Component
 * Prioritizes Core Web Vitals and Essential SEO Optimization
 */
export default class Head {
  /**
   * Create SEO-Optimized Head Metadata
   * @param {Object} config - SEO Configuration
   * @param {string} config.title - Page title (Max 60 characters)
   * @param {string} config.description - Meta description (Max 160 characters)
   * @param {string} [config.lang='en'] - Page language
   * @param {string} [config.canonicalUrl] - Canonical URL
   * @param {Object} [config.schema] - Structured data schema
   * @param {Array<string>} [config.keywords] - SEO Keywords
   * @param {Object} [config.robots] - Robots indexing configuration
   */
  constructor({
    title,
    description,
    lang = 'en',
    canonicalUrl = '',
    schema = null,
    keywords = [],
    robots = { index: true, follow: true },
  }) {
    // Validate and sanitize inputs
    this.config = {
      title: this.sanitizeTitle(title),
      description: this.sanitizeDescription(description),
      lang,
      canonicalUrl,
      keywords: keywords.slice(0, 10), // Limit keywords
      robots: {
        index: robots.index ? 'index' : 'noindex',
        follow: robots.follow ? 'follow' : 'nofollow',
      },
    };

    // Create head metadata
    this.headElement = this.createHeadElement(schema);
  }

  /**
   * Sanitize and truncate title
   * @param {string} title - Original title
   * @returns {string} Sanitized title
   */
  sanitizeTitle(title) {
    // Truncate to 60 characters, add ellipsis if needed
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  }

  /**
   * Sanitize and truncate description
   * @param {string} description - Original description
   * @returns {string} Sanitized description
   */
  sanitizeDescription(description) {
    // Truncate to 160 characters, add ellipsis if needed
    return description.length > 160
      ? description.substring(0, 157) + '...'
      : description;
  }

  /**
   * Create head metadata elements
   * @param {Object} [schema] - Optional JSON-LD schema
   * @returns {HTMLElement} Head metadata container
   */
  createHeadElement(schema) {
    const container = document.createElement('div');
    container.className = 'seo-head';
    container.style.display = 'none';

    // Core SEO Meta Tags
    const metaTags = [
      { name: 'description', content: this.config.description },
      { name: 'keywords', content: this.config.keywords.join(', ') },
      {
        name: 'robots',
        content: `${this.config.robots.index}, ${this.config.robots.follow}`,
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, minimum-scale=1',
      },
      { name: 'theme-color', content: '#ffffff' }, // Customize as needed
    ];

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

    // Create meta tags
    this.createAndAppendMetaTags(container, metaTags);
    this.createAndAppendMetaTags(container, performanceTags);
    this.createAndAppendMetaTags(container, webVitalsTags);

    // Title Tag
    const titleTag = document.createElement('title');
    titleTag.textContent = this.config.title;
    container.appendChild(titleTag);

    // Optional Canonical URL
    if (this.config.canonicalUrl) {
      const canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = this.config.canonicalUrl;
      container.appendChild(canonicalLink);
    }

    // Language Tag
    const htmlLangTag = document.createElement('meta');
    htmlLangTag.setAttribute('http-equiv', 'content-language');
    htmlLangTag.content = this.config.lang;
    container.appendChild(htmlLangTag);

    // Structured Data (JSON-LD)
    if (schema) {
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify(schema);
      container.appendChild(schemaScript);
    }

    return container;
  }

  /**
   * Create and append meta tags to container
   * @param {HTMLElement} container - Container element
   * @param {Array<Object>} tags - Meta tags to create
   */
  createAndAppendMetaTags(container, tags) {
    tags.forEach((tag) => {
      const metaTag = document.createElement('meta');
      Object.keys(tag).forEach((attr) => {
        metaTag.setAttribute(attr, tag[attr]);
      });
      container.appendChild(metaTag);
    });
  }

  /**
   * Render metadata to document head
   */
  render() {
    // Remove existing SEO metadata
    const existingMetadata = document.querySelector('.seo-head');
    if (existingMetadata) {
      existingMetadata.remove();
    }

    // Append new metadata to document head
    document.head.appendChild(this.headElement);

    // Set document language
    document.documentElement.lang = this.config.lang;
  }

  /**
   * Get the head metadata element
   * @returns {HTMLElement} Head metadata element
   */
  getElement() {
    return this.headElement;
  }
}
