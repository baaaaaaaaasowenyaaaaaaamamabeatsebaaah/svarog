# Head Component

The Head component provides comprehensive SEO metadata management with favicon support, PWA functionality, and advanced SMB-focused features including local business schema, FAQ rich snippets, and analytics integration.

## Features

- **🆕 Favicon Management** - Automatic generation of all required favicon sizes
- **🆕 PWA Support** - Web app manifest and mobile optimization
- **🆕 Advanced SEO** - Local business schema, FAQ rich snippets, analytics
- **SEO Optimization** - Title, description, Open Graph, Twitter Cards
- **Structured Data** - JSON-LD schema support
- **Performance** - Resource hints and preloading
- **Multi-language** - Alternate language support
- **Accessibility** - Proper meta tags and semantic structure

## Installation & Basic Usage

```javascript
import { Head } from '@svarog-ui/core';

// Basic usage with automatic favicon and PWA setup
const head = Head({
  title: 'My Website',
  description: 'A modern website with complete SEO setup',

  // 🆕 Favicon configuration
  favicon: {
    basePath: '/favicon',
    format: 'png',
  },

  // 🆕 PWA configuration
  pwa: {
    appName: 'My App',
    themeColor: '#2563eb',
    manifestUrl: '/site.webmanifest',
  },
});

head.render(); // Automatically injects all necessary tags
```

## Props

### Core Props

| Prop           | Type   | Default      | Description                                  |
| -------------- | ------ | ------------ | -------------------------------------------- |
| `title`        | string | **Required** | Page title (max 60 chars recommended)        |
| `description`  | string | **Required** | Meta description (max 160 chars recommended) |
| `lang`         | string | `"en"`       | Page language                                |
| `canonicalUrl` | string | `""`         | Canonical URL                                |
| `keywords`     | array  | `[]`         | SEO keywords (max 10)                        |

### 🆕 Enhanced Props

| Prop            | Type   | Default | Description                          |
| --------------- | ------ | ------- | ------------------------------------ |
| `favicon`       | object | `null`  | Favicon configuration                |
| `pwa`           | object | `null`  | PWA manifest and mobile app settings |
| `localBusiness` | object | `null`  | Local business schema data           |
| `faqs`          | array  | `null`  | FAQ data for rich snippets           |
| `analytics`     | object | `null`  | Google Analytics/GTM configuration   |
| `verifications` | object | `null`  | Search engine verification codes     |
| `resourceHints` | object | `null`  | Performance resource hints           |

### Social Media Props

| Prop          | Type   | Description                        |
| ------------- | ------ | ---------------------------------- |
| `openGraph`   | object | Open Graph data for social sharing |
| `twitterCard` | object | Twitter Card metadata              |

### Favicon Configuration

```javascript
favicon: {
  basePath: '/favicon',     // Base path for favicon files
  format: 'png'            // File format (png, ico, svg)
}
```

**Generates these favicon links automatically:**

- Standard favicon
- Apple Touch Icons (180x180, 167x167, 152x152, 120x120)
- Android Chrome Icons (192x192, 512x512, 32x32, 16x16)
- Windows Tile icons

### PWA Configuration

```javascript
pwa: {
  manifestUrl: '/site.webmanifest',        // Manifest file URL
  appName: 'My App',                       // App name
  themeColor: '#2563eb',                   // Theme color
  backgroundColor: '#ffffff',              // Background color
  appleStatusBarStyle: 'default'           // iOS status bar style
}
```

### 🆕 Local Business Schema

```javascript
localBusiness: {
  name: 'My Restaurant',
  businessType: 'Restaurant',              // Schema.org business type
  description: 'Best restaurant in town',
  address: {
    street: 'Main Street 123',
    city: 'Munich',
    state: 'Bavaria',
    zip: '80539',
    country: 'DE'
  },
  phone: '+49 89 123456789',
  email: 'info@restaurant.com',
  website: 'https://restaurant.com',
  priceRange: '€€',

  // Geo coordinates for local SEO
  geo: {
    latitude: 48.1351,
    longitude: 11.5820
  },

  // Opening hours
  openingHours: [
    { day: 'Monday', open: '09:00', close: '22:00' },
    { day: 'Tuesday', open: '09:00', close: '22:00' },
    // ... more days
  ],

  // Social media profiles
  socialMedia: {
    facebook: 'https://facebook.com/restaurant',
    instagram: 'https://instagram.com/restaurant'
  }
}
```

### 🆕 FAQ Rich Snippets

```javascript
faqs: [
  {
    question: 'What are your opening hours?',
    answer: 'We are open Monday to Friday from 9 AM to 10 PM.',
  },
  {
    question: 'Do you take reservations?',
    answer: 'Yes, you can make reservations by phone or through our website.',
  },
];
```

### 🆕 Analytics Configuration

```javascript
analytics: {
  googleAnalytics: {
    measurementId: 'G-XXXXXXXXXX',
    config: {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    }
  },
  googleTagManager: 'GTM-XXXXXXX'
}
```

### 🆕 Search Engine Verifications

```javascript
verifications: {
  google: 'your-google-verification-code',
  bing: 'your-bing-verification-code',
  pinterest: 'your-pinterest-verification-code',
  facebook: 'your-facebook-verification-code'
}
```

### 🆕 Resource Hints (Performance)

```javascript
resourceHints: {
  dnsPrefetch: ['//fonts.googleapis.com', '//www.google-analytics.com'],
  preconnect: ['//fonts.gstatic.com'],
  preload: [
    { href: '/critical.css', as: 'style' },
    { href: '/hero-image.jpg', as: 'image' }
  ],
  prefetch: ['/next-page', '/about']
}
```

## Methods

### Core Methods

```javascript
// Get the DOM element
const element = head.getElement();

// Render to document head
head.render();

// Update properties
head.update({ title: 'New Title', description: 'New description' });

// Clean up
head.destroy();
```

### Meta Tag Management

```javascript
// Add meta tag
head.addMeta({ name: 'author', content: 'Author Name' });

// Update existing meta tag
head.updateMeta('description', 'New description');

// Set theme color
head.setThemeColor('#ff0000');
```

### 🆕 Enhanced Methods

```javascript
// Set favicon configuration
head.setFavicon({ basePath: '/custom-favicon', format: 'png' });

// Configure PWA settings
head.setPWA({
  appName: 'My App',
  themeColor: '#2563eb',
  manifestUrl: '/app.webmanifest',
});

// Generate web app manifest
const manifest = head.generateManifest({
  name: 'My Progressive Web App',
  shortName: 'MyPWA',
  themeColor: '#2563eb',
});

// Add structured data
head.addSchema({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Article Title',
});

// Add alternate language
head.addAlternateLanguage('es', 'https://example.com/es');
```

### 🆕 Advanced Methods (from Head.advanced.js)

```javascript
import { createAdvancedHead, createSMBHead } from '@svarog-ui/core';

// Setup local business
head.setupLocalBusiness(businessData);

// Add FAQ data
head.addFAQs(faqData);

// Setup analytics
head.setupAnalytics(analyticsConfig);

// Add search engine verifications
head.addVerifications(verificationCodes);

// Setup resource hints
head.setupResourceHints(hintsConfig);

// Complete SMB setup in one call
head.setupSMB({
  business: businessData,
  faqs: faqData,
  analytics: analyticsConfig,
  verifications: verificationCodes,
  resourceHints: hintsConfig,
});
```

## Usage Examples

### Basic Website

```javascript
const head = Head({
  title: 'Professional Web Design Services',
  description: 'Expert web design and development for modern businesses.',
  keywords: ['web design', 'development', 'professional'],

  favicon: { basePath: '/favicon', format: 'png' },

  openGraph: {
    title: 'Professional Web Design Services',
    description: 'Expert web design and development',
    image: 'https://example.com/og-image.jpg',
    type: 'website',
  },
});

head.render();
```

### 🆕 SMB Restaurant Website

```javascript
import { createSMBHead } from '@svarog-ui/core';

const restaurantHead = createSMBHead({
  businessName: 'Bella Vista Restaurant',
  description: 'Authentic Italian cuisine in the heart of Munich',
  keywords: ['italian restaurant', 'munich', 'authentic cuisine'],
  website: 'https://bellavista-munich.com',
  themeColor: '#8B4513',

  business: {
    name: 'Bella Vista Restaurant',
    businessType: 'Restaurant',
    address: {
      street: 'Maximilianstrasse 42',
      city: 'München',
      state: 'Bavaria',
      zip: '80539',
      country: 'DE',
    },
    phone: '+49 89 123456789',
    email: 'info@bellavista-munich.com',
    priceRange: '€€',

    geo: {
      latitude: 48.1391,
      longitude: 11.5802,
    },

    openingHours: [
      { day: 'Monday', open: '17:00', close: '23:00' },
      { day: 'Tuesday', open: '17:00', close: '23:00' },
      // ... more days
    ],

    socialMedia: {
      facebook: 'https://facebook.com/bellavistarestaurant',
      instagram: 'https://instagram.com/bellavista_munich',
    },
  },

  faqs: [
    {
      question: 'Do you take reservations?',
      answer: 'Yes, we accept reservations by phone or through our website.',
    },
    {
      question: 'Do you offer vegetarian options?',
      answer: 'Absolutely! We have a dedicated vegetarian menu.',
    },
  ],

  analytics: {
    googleAnalytics: {
      measurementId: 'G-XXXXXXXXXX',
    },
  },

  verifications: {
    google: 'your-google-verification-code',
  },
});

restaurantHead.render();
```

### 🆕 Progressive Web App

```javascript
const pwaHead = Head({
  title: 'My Progressive Web App',
  description: 'A modern PWA with offline capabilities',

  favicon: { basePath: '/app-icons/favicon', format: 'png' },

  pwa: {
    manifestUrl: '/app.webmanifest',
    appName: 'My PWA',
    themeColor: '#673ab7',
    backgroundColor: '#ffffff',
    appleStatusBarStyle: 'black-translucent',
  },

  resourceHints: {
    preconnect: ['//api.example.com'],
    preload: [
      { href: '/app.css', as: 'style' },
      { href: '/app-icon-192.png', as: 'image' },
    ],
  },
});

// Generate the manifest file
const manifest = pwaHead.generateManifest({
  name: 'My Progressive Web App',
  shortName: 'MyPWA',
  startUrl: '/',
  display: 'standalone',
  orientation: 'portrait-primary',
  icons: [
    {
      src: '/app-icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable',
    },
    {
      src: '/app-icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
});

// Save manifest as /public/app.webmanifest
console.log(JSON.stringify(manifest, null, 2));

pwaHead.render();
```

### 🆕 E-commerce Product Page

```javascript
const productHead = Head({
  title: 'Premium Smartphone - TechStore',
  description: 'Latest smartphone with advanced features and premium design.',
  canonicalUrl: 'https://techstore.com/products/premium-smartphone',

  favicon: { basePath: '/store-favicon', format: 'png' },

  openGraph: {
    title: 'Premium Smartphone - TechStore',
    description: 'Latest smartphone with advanced features',
    image: 'https://techstore.com/products/smartphone-og.jpg',
    type: 'product',
    url: 'https://techstore.com/products/premium-smartphone',
  },

  schema: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Premium Smartphone',
    description: 'Latest smartphone with advanced features',
    image: 'https://techstore.com/products/smartphone.jpg',
    offers: {
      '@type': 'Offer',
      price: '799.99',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'TechStore',
      },
    },
    brand: {
      '@type': 'Brand',
      name: 'TechBrand',
    },
  },
});

productHead.render();
```

### 🆕 Blog Article with Rich Snippets

```javascript
const articleHead = Head({
  title: 'How to Build a Progressive Web App in 2024',
  description:
    'Complete guide to building modern PWAs with the latest technologies.',
  canonicalUrl: 'https://blog.com/pwa-guide-2024',

  openGraph: {
    title: 'How to Build a Progressive Web App in 2024',
    description: 'Complete guide to building modern PWAs',
    image: 'https://blog.com/articles/pwa-guide-cover.jpg',
    type: 'article',
  },

  schema: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Build a Progressive Web App in 2024',
    author: {
      '@type': 'Person',
      name: 'Tech Expert',
      url: 'https://blog.com/authors/tech-expert',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tech Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blog.com/logo.png',
      },
    },
    datePublished: '2024-01-15',
    dateModified: '2024-01-20',
    image: 'https://blog.com/articles/pwa-guide-cover.jpg',
    articleSection: 'Web Development',
    wordCount: 2500,
  },

  faqs: [
    {
      question: 'What is a Progressive Web App?',
      answer:
        'A Progressive Web App (PWA) is a web application that uses modern web capabilities to deliver an app-like experience to users.',
    },
    {
      question: 'Do PWAs work on all devices?',
      answer:
        'Yes, PWAs are designed to work on any device with a modern web browser.',
    },
  ],
});

articleHead.render();
```

## 🆕 Required Files for Complete Setup

To use all features, create these files in your `public/` directory:

### Favicon Files

```
public/
├── favicon.ico                    # Legacy favicon
├── favicon.png                    # Standard favicon
├── favicon-16x16.png             # Small favicon
├── favicon-32x32.png             # Medium favicon
├── favicon-192x192.png           # Android icon
├── favicon-512x512.png           # Large Android icon
├── apple-touch-icon-120x120.png  # iPhone
├── apple-touch-icon-152x152.png  # iPad
├── apple-touch-icon-167x167.png  # iPad Pro
├── apple-touch-icon-180x180.png  # iPhone Plus
└── site.webmanifest              # PWA manifest
```

### Example site.webmanifest

```json
{
  "name": "My Progressive Web App",
  "short_name": "MyPWA",
  "description": "A fantastic web application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "orientation": "portrait-primary",
  "scope": "/",
  "icons": [
    {
      "src": "/favicon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/favicon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Example browserconfig.xml (Optional)

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/favicon-144x144.png"/>
      <TileColor>#2563eb</TileColor>
    </tile>
  </msapplication>
</browserconfig>
```

## Best Practices

### SEO Optimization

- Keep titles under 60 characters
- Keep descriptions under 160 characters
- Use structured data for rich snippets
- Include Open Graph and Twitter Card metadata
- Set canonical URLs to prevent duplicate content

### Performance

- Use resource hints for external domains
- Preload critical resources
- Optimize images and use appropriate formats
- Minimize the number of meta tags

### PWA Optimization

- Provide multiple icon sizes
- Use appropriate theme colors
- Configure proper manifest settings
- Test on multiple devices and browsers

### Local Business SEO

- Include complete business information
- Add geo coordinates for local search
- Use proper Schema.org business types
- Keep opening hours up to date

## Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Favicon Support**: All browsers including legacy IE
- **PWA Support**: Chrome, Edge, Safari 14.1+, Firefox (limited)
- **Structured Data**: All search engines
- **Resource Hints**: Chrome 46+, Firefox 39+, Safari 11.1+

## Migration Guide

### From Basic Head to Enhanced Head

```javascript
// Before
const head = Head({
  title: 'My Site',
  description: 'My description',
});

// After - add favicon and PWA
const head = Head({
  title: 'My Site',
  description: 'My description',
  favicon: { basePath: '/favicon', format: 'png' },
  pwa: { appName: 'My Site', themeColor: '#2563eb' },
});
```

### Adding Advanced Features

```javascript
// Import advanced features
import { createSMBHead } from '@svarog-ui/core';

// Use SMB-optimized head
const head = createSMBHead({
  businessName: 'My Business',
  description: 'My business description',
  business: {
    /* business data */
  },
  faqs: [
    /* FAQ data */
  ],
});
```

## Testing

```javascript
// Test basic functionality
const head = Head({
  title: 'Test Page',
  description: 'Test description',
  favicon: { basePath: '/favicon', format: 'png' },
});

head.render();

// Check if favicon links are added
const faviconLinks = document.querySelectorAll('link[rel*="icon"]');
console.log('Favicon links:', faviconLinks.length);

// Check theme color
const themeColor = document.querySelector('meta[name="theme-color"]');
console.log('Theme color:', themeColor?.content);

// Test manifest generation
const manifest = head.generateManifest({
  name: 'Test App',
  themeColor: '#2563eb',
});
console.log('Generated manifest:', manifest);
```

## Troubleshooting

### Common Issues

**Favicon not showing:**

- Ensure favicon files exist in the specified path
- Check browser cache (hard refresh with Ctrl+F5)
- Verify file permissions

**PWA not installable:**

- Check manifest file is valid JSON
- Ensure HTTPS is used (required for PWA)
- Verify service worker is registered

**Structured data not working:**

- Validate JSON-LD with Google's Structured Data Testing Tool
- Check for syntax errors in schema markup
- Ensure all required fields are present

**Theme color not applying:**

- Verify meta tag is in document head
- Check browser support for theme-color
- Ensure valid CSS color format

### Debug Tools

```javascript
// Debug what's in document.head
console.log('Document head:', document.head.innerHTML);

// Check specific meta tags
const metas = document.querySelectorAll('meta');
metas.forEach((meta, i) => {
  console.log(`Meta ${i}:`, {
    name: meta.name,
    property: meta.property,
    content: meta.content,
  });
});

// Validate manifest
fetch('/site.webmanifest')
  .then((r) => r.json())
  .then((manifest) => console.log('Manifest:', manifest))
  .catch((err) => console.error('Manifest error:', err));
```

## Performance Impact

- **Basic Head**: ~2KB
- **With Favicon**: ~2.5KB
- **With PWA**: ~3KB
- **Full SMB Setup**: ~4KB
- **Runtime overhead**: <1ms

The Head component is optimized for minimal performance impact while providing maximum SEO and PWA benefits.
