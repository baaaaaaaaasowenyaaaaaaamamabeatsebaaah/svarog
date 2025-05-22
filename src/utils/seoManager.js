// src/utils/seoManager.js

/**
 * SEO optimization and validation utilities
 */

/**
 * Validates SEO metadata for optimal search engine performance
 * @param {Object} seoData - SEO metadata to validate
 * @returns {Object} Validation result with recommendations
 */
export const validateSEO = (seoData) => {
  const issues = [];
  const warnings = [];
  const recommendations = [];

  // Title validation
  if (!seoData.title) {
    issues.push('Missing page title');
  } else {
    if (seoData.title.length < 30) {
      warnings.push('Title is shorter than recommended (30-60 characters)');
    }
    if (seoData.title.length > 60) {
      warnings.push('Title exceeds recommended length (60 characters)');
    }
    if (!seoData.title.includes('|') && !seoData.title.includes('-')) {
      recommendations.push('Consider adding brand name separator (| or -)');
    }
  }

  // Description validation
  if (!seoData.description) {
    issues.push('Missing meta description');
  } else {
    if (seoData.description.length < 120) {
      warnings.push(
        'Description is shorter than recommended (120-160 characters)'
      );
    }
    if (seoData.description.length > 160) {
      warnings.push('Description exceeds recommended length (160 characters)');
    }
  }

  // Keywords validation
  if (seoData.keywords && seoData.keywords.length > 10) {
    warnings.push('Too many keywords (recommended: 5-10)');
  }

  // Open Graph validation
  if (!seoData.openGraph) {
    recommendations.push(
      'Add Open Graph metadata for better social media sharing'
    );
  } else {
    if (!seoData.openGraph.image) {
      warnings.push('Missing Open Graph image');
    }
    if (seoData.openGraph.image && !isValidImageUrl(seoData.openGraph.image)) {
      warnings.push('Invalid Open Graph image URL');
    }
  }

  // Twitter Card validation
  if (!seoData.twitterCard) {
    recommendations.push(
      'Add Twitter Card metadata for better Twitter sharing'
    );
  }

  // Canonical URL validation
  if (!seoData.canonicalUrl) {
    recommendations.push(
      'Add canonical URL to prevent duplicate content issues'
    );
  } else if (!isValidUrl(seoData.canonicalUrl)) {
    issues.push('Invalid canonical URL format');
  }

  // Structured data validation
  if (!seoData.schema) {
    recommendations.push('Add structured data (Schema.org) for rich snippets');
  }

  return {
    valid: issues.length === 0,
    score: calculateSEOScore(issues, warnings, recommendations),
    issues,
    warnings,
    recommendations,
  };
};

/**
 * Calculates SEO score based on validation results
 * @param {Array} issues - Critical issues
 * @param {Array} warnings - Non-critical warnings
 * @param {Array} recommendations - Improvement suggestions
 * @returns {number} Score from 0-100
 */
const calculateSEOScore = (issues, warnings, recommendations) => {
  let score = 100;

  // Deduct points for issues
  score -= issues.length * 20;

  // Deduct points for warnings
  score -= warnings.length * 10;

  // Deduct points for missing recommendations
  score -= recommendations.length * 5;

  return Math.max(0, score);
};

/**
 * Validates if URL is properly formatted
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates if image URL is accessible and properly formatted
 * @param {string} imageUrl - Image URL to validate
 * @returns {boolean} Whether image URL is valid
 */
const isValidImageUrl = (imageUrl) => {
  if (!isValidUrl(imageUrl)) return false;

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const url = new URL(imageUrl);

  return imageExtensions.some((ext) =>
    url.pathname.toLowerCase().includes(ext)
  );
};

/**
 * Generates SEO-friendly slug from title
 * @param {string} title - Page title
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Optimizes SEO metadata with best practices
 * @param {Object} seoData - Original SEO data
 * @param {Object} options - Optimization options
 * @returns {Object} Optimized SEO data
 */
export const optimizeSEO = (seoData, options = {}) => {
  const optimized = { ...seoData };

  // Optimize title
  if (optimized.title) {
    optimized.title = optimizeTitle(optimized.title, options.brandName);
  }

  // Optimize description
  if (optimized.description) {
    optimized.description = optimizeDescription(optimized.description);
  }

  // Add default robots if missing
  if (!optimized.robots) {
    optimized.robots = { index: true, follow: true };
  }

  // Generate canonical URL if missing
  if (!optimized.canonicalUrl && options.baseUrl && optimized.title) {
    const slug = generateSlug(optimized.title);
    optimized.canonicalUrl = `${options.baseUrl}/${slug}`;
  }

  // Add default Open Graph if missing critical data
  if (!optimized.openGraph && optimized.title && optimized.description) {
    optimized.openGraph = {
      title: optimized.title,
      description: optimized.description,
      type: 'website',
    };
  }

  // Add image dimensions for Open Graph if possible
  if (optimized.openGraph?.image && !optimized.openGraph.imageWidth) {
    optimized.openGraph.imageWidth = 1200;
    optimized.openGraph.imageHeight = 630;
  }

  return optimized;
};

/**
 * Optimizes page title with best practices
 * @param {string} title - Original title
 * @param {string} brandName - Brand name to append
 * @returns {string} Optimized title
 */
const optimizeTitle = (title, brandName) => {
  let optimized = title.trim();

  // Add brand name if missing and provided
  if (brandName && !optimized.includes(brandName)) {
    if (optimized.length + brandName.length + 3 <= 60) {
      optimized = `${optimized} | ${brandName}`;
    }
  }

  // Truncate if too long
  if (optimized.length > 60) {
    optimized = optimized.substring(0, 57) + '...';
  }

  return optimized;
};

/**
 * Optimizes meta description with best practices
 * @param {string} description - Original description
 * @returns {string} Optimized description
 */
const optimizeDescription = (description) => {
  let optimized = description.trim();

  // Ensure it ends with proper punctuation
  if (!/[.!?]$/.test(optimized)) {
    optimized += '.';
  }

  // Truncate if too long
  if (optimized.length > 160) {
    optimized = optimized.substring(0, 157) + '...';
  }

  return optimized;
};

/**
 * Generates structured data for common page types
 * @param {string} type - Page type (article, product, website, etc.)
 * @param {Object} data - Page data
 * @returns {Object} JSON-LD structured data
 */
export const generateStructuredData = (type, data) => {
  const baseSchema = {
    '@context': 'https://schema.org',
  };

  switch (type) {
    case 'article': {
      return {
        ...baseSchema,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        author: data.author
          ? {
              '@type': 'Person',
              name: data.author,
            }
          : undefined,
        datePublished: data.publishDate,
        dateModified: data.modifiedDate,
        image: data.image,
        publisher: data.publisher
          ? {
              '@type': 'Organization',
              name: data.publisher.name,
              logo: data.publisher.logo
                ? {
                    '@type': 'ImageObject',
                    url: data.publisher.logo,
                  }
                : undefined,
            }
          : undefined,
      };
    }

    case 'product': {
      return {
        ...baseSchema,
        '@type': 'Product',
        name: data.title,
        description: data.description,
        image: data.image,
        offers: data.price
          ? {
              '@type': 'Offer',
              price: data.price,
              priceCurrency: data.currency || 'USD',
              availability: data.availability || 'https://schema.org/InStock',
            }
          : undefined,
        brand: data.brand
          ? {
              '@type': 'Brand',
              name: data.brand,
            }
          : undefined,
      };
    }

    case 'website':
    default: {
      return {
        ...baseSchema,
        '@type': 'WebSite',
        name: data.title,
        description: data.description,
        url: data.url,
      };
    }
  }
};

/**
 * Extracts SEO data from CMS content
 * @param {Object} cmsContent - Raw CMS content
 * @param {Object} mappings - Field mapping configuration
 * @returns {Object} Extracted SEO data
 */
export const extractSEOFromCMS = (cmsContent, mappings = {}) => {
  const defaultMappings = {
    title: 'title',
    description: 'description',
    keywords: 'keywords',
    image: 'featured_image',
    publishDate: 'published_at',
    author: 'author',
  };

  const fieldMappings = { ...defaultMappings, ...mappings };

  const extractField = (path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], cmsContent);
  };

  return {
    title: extractField(fieldMappings.title),
    description: extractField(fieldMappings.description),
    keywords: extractField(fieldMappings.keywords),
    openGraph: {
      title: extractField(fieldMappings.title),
      description: extractField(fieldMappings.description),
      image: extractField(fieldMappings.image),
      type: cmsContent.content_type || 'website',
    },
    schema: generateStructuredData(cmsContent.content_type || 'website', {
      title: extractField(fieldMappings.title),
      description: extractField(fieldMappings.description),
      image: extractField(fieldMappings.image),
      publishDate: extractField(fieldMappings.publishDate),
      author: extractField(fieldMappings.author),
    }),
  };
};
