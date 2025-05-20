# Head Component

The Head component provides a powerful way to manage SEO metadata for your web pages, including title, description, Open Graph data, Twitter cards, and structured data.

## Usage

```javascript
import { Head } from '@svarog-ui/core';

// Create a basic SEO head
const seoHead = Head({
  title: 'Page Title',
  description: 'Page description for search engines',
  keywords: ['keyword1', 'keyword2'],
});

// Render to document head
seoHead.render();
```

## Props

| Prop               | Type   | Default                  | Description                                  |
| ------------------ | ------ | ------------------------ | -------------------------------------------- |
| title              | string | Required                 | Page title (recommended max 60 chars)        |
| description        | string | Required                 | Meta description (recommended max 160 chars) |
| lang               | string | "en"                     | Page language                                |
| canonicalUrl       | string | ""                       | Canonical URL                                |
| schema             | object | null                     | Structured data JSON-LD schema               |
| keywords           | array  | []                       | SEO keywords (max 10)                        |
| robots             | object | {index:true,follow:true} | Robots indexing configuration                |
| openGraph          | object | null                     | Open Graph metadata for social sharing       |
| twitterCard        | object | null                     | Twitter Card metadata                        |
| alternateLanguages | array  | []                       | Alternate language versions                  |
| additionalMeta     | array  | []                       | Additional meta tags to include              |
| themeColor         | string | "#ffffff"                | Theme color for browser UI                   |

### Open Graph Props

| Prop        | Type   | Description                                    |
| ----------- | ------ | ---------------------------------------------- |
| title       | string | The title of the page for social sharing       |
| description | string | The description of the page for social sharing |
| image       | string | The URL to the image representing the content  |
| type        | string | The type of content (website, article, etc.)   |
| url         | string | The canonical URL of the page                  |
| siteName    | string | The name of the site                           |

### Twitter Card Props

| Prop        | Type   | Description                                     |
| ----------- | ------ | ----------------------------------------------- |
| title       | string | The title of the page for Twitter               |
| description | string | The description of the page for Twitter         |
| image       | string | The URL to the image representing the content   |
| type        | string | The type of card (summary, summary_large_image) |
| site        | string | The Twitter handle of the site                  |
| creator     | string | The Twitter handle of the content creator       |

### Alternate Language Props

| Prop     | Type   | Description                                |
| -------- | ------ | ------------------------------------------ |
| hreflang | string | The language code (e.g., "en", "fr", "es") |
| href     | string | The URL of the alternate language version  |

## Methods

### getElement()

Returns the head DOM element.

```javascript
const headElement = seoHead.getElement();
```

### render()

Renders metadata to document head.

```javascript
seoHead.render();
```

### update(props)

Updates head properties with new values.

```javascript
seoHead.update({
  title: 'New Page Title',
  description: 'Updated description',
});
```

### addMeta(metaProps)

Adds a new meta tag.

```javascript
seoHead.addMeta({ name: 'author', content: 'Author Name' });
```

### updateMeta(name, content)

Updates a specific meta tag.

```javascript
seoHead.updateMeta('description', 'New description text');
```

### addSchema(schema)

Adds a JSON-LD structured data schema.

```javascript
seoHead.addSchema({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Article Title',
  // ... more schema properties
});
```

### setThemeColor(color)

Sets the theme color for browser UI.

```javascript
seoHead.setThemeColor('#3182ce');
```

### addAlternateLanguage(hreflang, href)

Adds an alternate language version link.

```javascript
seoHead.addAlternateLanguage('es', 'https://example.com/es/page');
```

### setConsentPreferences(preferences)

Sets GDPR/CCPA cookie consent preferences.

```javascript
seoHead.setConsentPreferences({
  advertising: false,
  analytics: false,
});
```

### destroy()

Cleans up resources.

```javascript
seoHead.destroy();
```

## Advanced SEO Features

### Core Web Vitals Optimization

The Head component automatically includes best practices for improving Core Web Vitals:

- Properly formatted viewport settings
- Mobile web app capability tags
- Compatible browser configurations

### Structured Data (JSON-LD)

Structured data helps search engines understand the content of your page:

```javascript
const productPage = Head({
  title: 'Super Widget Pro',
  description: 'The best widget on the market',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Super Widget Pro',
    description: 'The best widget on the market',
    offers: {
      '@type': 'Offer',
      price: '99.99',
      priceCurrency: 'USD',
    },
  },
});
```

### Social Media Optimization

Optimize content sharing on social platforms:

```javascript
const socialOptimized = Head({
  title: 'Article Title',
  description: 'Article description',
  openGraph: {
    title: 'Share This Article',
    description: "You won't believe what happened next!",
    image: 'https://example.com/share-image.jpg',
    type: 'article',
  },
  twitterCard: {
    type: 'summary_large_image',
    title: 'Must-Read Article',
    description: 'The most interesting story of the year',
    image: 'https://example.com/twitter-image.jpg',
  },
});
```

### International SEO

Support for international sites with alternate language versions:

```javascript
const multiLanguage = Head({
  title: 'Welcome to Our Site',
  description: 'International company website',
  lang: 'en',
  alternateLanguages: [
    { hreflang: 'es', href: 'https://example.com/es' },
    { hreflang: 'fr', href: 'https://example.com/fr' },
    { hreflang: 'de', href: 'https://example.com/de' },
    { hreflang: 'x-default', href: 'https://example.com' },
  ],
});
```

## Examples

### Basic SEO

```javascript
const basicSEO = Head({
  title: 'Professional Web Design Services',
  description:
    'Expert web design and development, creating stunning, high-performance websites tailored to your business needs.',
  keywords: ['web design', 'development', 'responsive websites'],
});

basicSEO.render();
```

### With Open Graph for Social Sharing

```javascript
const socialSEO = Head({
  title: 'Article Title',
  description: 'Article description text',
  openGraph: {
    title: 'Share This Article',
    description: 'Check out this amazing article!',
    image: 'https://example.com/image.jpg',
    type: 'article',
    url: 'https://example.com/article',
    siteName: 'Example Blog',
  },
});

socialSEO.render();
```

### With Structured Data

```javascript
const structuredSEO = Head({
  title: 'Product: Super Widget',
  description: 'The amazing Super Widget that solves all your problems.',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Super Widget',
    description: 'The amazing Super Widget that solves all your problems.',
    image: 'https://example.com/super-widget.jpg',
    offers: {
      '@type': 'Offer',
      price: '99.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  },
});

structuredSEO.render();
```

### Multi-language Support

```javascript
const multiLanguageSEO = Head({
  title: 'Multilingual Content',
  description: 'Content available in multiple languages',
  lang: 'en',
  alternateLanguages: [
    { hreflang: 'es', href: 'https://example.com/es/page' },
    { hreflang: 'fr', href: 'https://example.com/fr/page' },
    { hreflang: 'de', href: 'https://example.com/de/page' },
  ],
});

multiLanguageSEO.render();
```

### Comprehensive SEO Setup

```javascript
const comprehensiveSEO = Head({
  title: 'Ultimate Guide to Web Development',
  description:
    'A comprehensive guide to modern web development technologies and best practices.',
  lang: 'en',
  canonicalUrl: 'https://example.com/web-dev-guide',
  keywords: ['web development', 'HTML', 'CSS', 'JavaScript', 'tutorial'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Web Development Guide 2023',
    description:
      'Learn everything about modern web development in this comprehensive guide.',
    image: 'https://example.com/guide-cover.jpg',
    type: 'article',
    url: 'https://example.com/web-dev-guide',
    siteName: 'Dev Academy',
  },
  twitterCard: {
    title: 'Web Development Guide',
    description: 'Master modern web development with this in-depth guide',
    image: 'https://example.com/guide-twitter.jpg',
    type: 'summary_large_image',
    site: '@devacademy',
    creator: '@author',
  },
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Ultimate Guide to Web Development',
    author: {
      '@type': 'Person',
      name: 'Author Name',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dev Academy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png',
      },
    },
    datePublished: '2023-05-15',
    image: 'https://example.com/guide-cover.jpg',
    description:
      'A comprehensive guide to modern web development technologies and best practices.',
  },
  themeColor: '#3182ce',
});

comprehensiveSEO.render();

// Add additional meta tags
comprehensiveSEO.addMeta({ name: 'author', content: 'Author Name' });
comprehensiveSEO.addMeta({ name: 'copyright', content: '© 2023 Dev Academy' });
```

### Dynamic Updates

```javascript
const dynamicSEO = Head({
  title: 'Product Page',
  description: 'View our products',
});

dynamicSEO.render();

// Later, when a specific product is loaded
function updateProductMetadata(product) {
  dynamicSEO.update({
    title: `${product.name} - Product Details`,
    description: product.description,
  });

  dynamicSEO.updateMeta('keywords', product.tags.join(', '));

  // Update Open Graph data
  if (!dynamicSEO.getElement().querySelector('meta[property="og:title"]')) {
    // Add Open Graph tags if they don't exist
    dynamicSEO.update({
      openGraph: {
        title: product.name,
        description: product.description,
        image: product.imageUrl,
        type: 'product',
      },
    });
  } else {
    // Update existing Open Graph tags
    dynamicSEO.updateMeta('og:title', product.name);
    dynamicSEO.updateMeta('og:description', product.description);
    dynamicSEO.updateMeta('og:image', product.imageUrl);
  }

  // Update structured data
  dynamicSEO.addSchema({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
    },
  });

  dynamicSEO.render();
}
```
