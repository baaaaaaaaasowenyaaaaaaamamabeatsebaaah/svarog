# Page Component

The Page component provides a complete page management solution with SEO optimization, loading states, error handling, and integration capabilities for CMS systems like Storyblok. **Now features CSS injection for zero-configuration styling across all environments.**

## Features

- **Complete Page Structure** - Header, main content, footer with semantic HTML
- **SEO Management** - Integrated Head component for metadata optimization
- **Loading & Error States** - Built-in loading and error state management
- **Accessibility** - WCAG compliant with proper landmarks and skip links
- **CMS Integration** - Designed for easy integration with headless CMS systems
- **Performance Optimization** - Lazy loading, preloading, and efficient updates
- **Responsive Design** - Mobile-first responsive layout
- **🆕 CSS Injection** - Automatic style injection that works in Node.js, browsers, and bundlers
- **🆕 Zero Configuration** - No CSS imports needed, styles load automatically

## Basic Usage

```javascript
import { Page } from '@your-library/components';

// Create a basic page - styles inject automatically
const page = Page({
  id: 'home-page',
  seo: {
    title: 'Welcome to Our Site',
    description: 'A comprehensive platform for modern web solutions.',
    keywords: ['web', 'solutions', 'modern'],
  },
  content: {
    html: '<h1>Welcome</h1><p>Content goes here</p>',
  },
});

// Append to DOM - works everywhere (Node.js, browsers, bundlers)
document.body.appendChild(page.getElement());
```

## CSS Injection Architecture

The Page component now uses an advanced CSS injection system that:

✅ **Eliminates CSS Import Errors** - Works in Node.js environments without CSS parsing issues  
✅ **Zero Configuration Required** - No separate CSS imports or build configuration needed  
✅ **SSR Compatible** - Safely handles server-side rendering scenarios  
✅ **Automatic Deduplication** - Styles are injected once and cached efficiently  
✅ **Performance Optimized** - Only injects styles when components are actually used

### How It Works

```javascript
// OLD WAY (caused Node.js errors):
// import './Page.css'; // ❌ Would fail in Node.js

// NEW WAY (works everywhere):
import { Page } from '@your-library/components';
// ✅ Styles automatically inject when component renders
```

The component automatically injects its styles into the document head on first render, using a sophisticated caching system to prevent duplicate style injection.

## Props

| Prop              | Type     | Default   | Description                       |
| ----------------- | -------- | --------- | --------------------------------- |
| `id`              | string   | undefined | Unique page identifier            |
| `type`            | string   | 'page'    | Page type for categorization      |
| `seo`             | object   | undefined | SEO metadata (see Head component) |
| `loading`         | boolean  | false     | Initial loading state             |
| `error`           | object   | null      | Error state configuration         |
| `loadingOptions`  | object   | {}        | Loading state options             |
| `onRetry`         | function | undefined | Error state retry callback        |
| `header`          | object   | undefined | Header section configuration      |
| `content`         | object   | undefined | Main content configuration        |
| `footer`          | object   | undefined | Footer section configuration      |
| `componentMapper` | function | undefined | CMS component mapping function    |

### Content Configuration

Content can be provided in multiple formats:

```javascript
// HTML content
content: {
  html: '<h1>Title</h1><p>Content</p>';
}

// Text content
content: {
  text: 'Simple text content';
}

// Component-based content (for CMS integration)
content: {
  components: [
    { type: 'heading', content: { text: 'Title', level: 'h1' } },
    { type: 'paragraph', content: { text: 'Content text' } },
  ];
}
```

### Error Configuration

```javascript
error: {
  title: 'Page Not Found',
  message: 'The requested page could not be found.',
  code: 404
}
```

### Image Props

When working with images in components that render within the Page, follow these standardized props:

- Use `imageUrl` (string) for image sources instead of variants like `featuredImage` or `image`
- Use `backgroundImageUrl` (string) for background images
- For DOM elements, use `imageElement` or `backgroundImageElement` (HTMLElement)

## Methods

### Basic Methods

```javascript
// Get the DOM element
const element = page.getElement();

// Update page properties
page.update({
  seo: { title: 'New Title' },
  content: { text: 'New content' },
});

// Clean up resources
page.destroy();
```

### State Management

```javascript
// Set loading state
page.setLoading(true, {
  message: 'Loading content...',
  showSpinner: true,
});

// Set error state
page.setError({
  title: 'Error Title',
  message: 'Error description',
  code: 500,
});

// Update content
page.setContent({
  html: '<h1>New Content</h1>',
});
```

### SEO Management

```javascript
// Update SEO metadata
page.updateSEO({
  title: 'New Page Title',
  description: 'Updated description',
  keywords: ['new', 'keywords'],
});

// Render SEO to document head
page.renderSEO();
```

### CMS Integration

```javascript
// Load from CMS data
page.loadFromCMS({
  seo: { title: 'CMS Title', description: 'CMS Description' },
  header: { components: [...] },
  content: { components: [...] },
  footer: { components: [...] }
});

// Handle navigation
await page.navigate('/new-path', {
  showLoading: true,
  onNavigate: async (path) => {
    // Fetch new content
    return await fetchCMSContent(path);
  }
});
```

### Performance Optimization

```javascript
// Optimize page performance
page.optimize();

// Preload critical resources
page.preloadCriticalResources();

// Validate accessibility
const validation = page.validateAccessibility();
console.log(validation.valid); // true/false
console.log(validation.issues); // array of issues
```

## Component Mapping

For CMS integration, provide a component mapper function:

```javascript
const componentMapper = (component) => {
  const { type, content } = component;

  switch (type) {
    case 'heading':
      const heading = document.createElement(content.level || 'h2');
      heading.textContent = content.text;
      return heading;

    case 'paragraph':
      const p = document.createElement('p');
      p.textContent = content.text;
      return p;

    case 'image':
      const img = document.createElement('img');
      img.src = content.src;
      img.alt = content.alt || '';
      return img;

    default:
      return null;
  }
};

const page = Page({
  componentMapper,
  content: {
    components: [
      { type: 'heading', content: { text: 'Title', level: 'h1' } },
      { type: 'paragraph', content: { text: 'Content' } },
    ],
  },
});
```

## Event Handler Standardization

For components rendered within the Page component, use these standardized event handler names:

- `onClick` for primary click actions (instead of variants like `onCtaClick` or `onReserve`)
- `onChange` for value change events (instead of variants like `onTabChange` or `onSelect`)
- `onSubmit` for form submissions
- `onBlur` and `onFocus` for focus events

## Node.js Compatibility

The Page component now works seamlessly in Node.js environments:

```javascript
// This works in Node.js without CSS errors
const { Page } = require('@your-library/components');

const page = Page({
  id: 'server-rendered-page',
  content: { text: 'Server-side content' },
});

// Safe to call - styles only inject in browser
const html = page.getElement().outerHTML;
```

## Storyblok Integration

For Storyblok CMS integration, use the StoryblokPageManager:

```javascript
import { StoryblokPageManager } from './services/storyblok/StoryblokPageManager.js';

// Initialize manager
const storyblokManager = new StoryblokPageManager({
  apiToken: 'your-storyblok-token',
  baseUrl: 'https://your-site.com',
  componentMapper: customComponentMapper,
});

// Create page from Storyblok story
const page = await storyblokManager.createPageFromStory('home', {
  container: document.getElementById('app'),
  onLoading: (page) => console.log('Loading...'),
  onSuccess: (page, story) => console.log('Loaded successfully'),
  onError: (error) => console.error('Failed to load:', error),
});
```

## Advanced Examples

### Complete Page with All Features

```javascript
const page = Page({
  id: 'complete-example',
  type: 'article',
  seo: {
    title: 'Complete Page Example | Site Name',
    description:
      'A comprehensive example of the Page component with all features.',
    canonicalUrl: 'https://example.com/complete-page',
    keywords: ['complete', 'example', 'page'],
    openGraph: {
      title: 'Complete Page Example',
      description: 'See all the features of our Page component.',
      image: 'https://example.com/og-image.jpg',
      type: 'article',
    },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Complete Page Example',
      author: { '@type': 'Person', name: 'Author Name' },
    },
  },
  header: {
    components: [
      { type: 'navigation', content: { items: ['Home', 'About', 'Contact'] } },
    ],
  },
  content: {
    components: [
      { type: 'hero', content: { title: 'Page Title', subtitle: 'Subtitle' } },
      { type: 'text_block', content: { text: 'Main content here...' } },
    ],
  },
  footer: {
    components: [
      { type: 'footer_info', content: { copyright: '© 2023 Site Name' } },
    ],
  },
  componentMapper: myComponentMapper,
});
```

### Dynamic Page with Loading and Error Handling

```javascript
const createDynamicPage = async (slug) => {
  const page = Page({
    id: `dynamic-${slug}`,
    loading: true,
    loadingOptions: {
      message: 'Loading page content...',
      showSpinner: true,
    },
    onRetry: () => createDynamicPage(slug),
  });

  try {
    const content = await fetchContentFromAPI(slug);
    page.loadFromCMS(content);
  } catch (error) {
    page.setError({
      title: 'Failed to Load Page',
      message: 'Could not load the requested page. Please try again.',
      code: error.status || 500,
    });
  }

  return page;
};
```

### SEO-Optimized Landing Page

```javascript
const landingPage = Page({
  id: 'landing-page',
  seo: {
    title: 'Best Web Solutions | Company Name',
    description: 'Discover our premium web development services designed to grow your business and enhance your online presence.',
    keywords: ['web development', 'business solutions', 'premium services'],
    canonicalUrl: 'https://company.com/landing',
    openGraph: {
      title: 'Transform Your Business Online',
      description: 'Professional web solutions that drive results.',
      image: 'https://company.com/images/landing-og.jpg',
      type: 'website'
    },
    twitterCard: {
      title: 'Transform Your Business Online',
      description: 'Professional web solutions that drive results.',
      image: 'https://company.com/images/landing-twitter.jpg',
      type: 'summary_large_image'
    },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Landing Page',
      description: 'Premium web development services',
      provider: {
        '@type': 'Organization',
        name: 'Company Name',
        url: 'https://company.com'
      }
    }
  },
  content: {
    components: [
      { type: 'hero', content: { title: 'Transform Your Business', cta: 'Get Started' } },
      { type: 'features', content: { items: [...] } },
      { type: 'testimonials', content: { reviews: [...] } }
    ]
  }
});
```

## Migration from CSS Imports

If you're migrating from the old CSS import system:

### Before (Old System)

```javascript
// This would cause Node.js errors
import './Page.css'; // ❌ Problematic
import { Page } from '@your-library/components';
```

### After (New CSS Injection System)

```javascript
// Clean and works everywhere
import { Page } from '@your-library/components'; // ✅ Styles auto-inject
```

### Testing in Node.js

```bash
# This now works without CSS errors
node -e "import('@your-library/components').then(m => console.log('✅ Page component loaded successfully!'))"
```

## Best Practices

### SEO Optimization

- Always provide meaningful titles and descriptions
- Use structured data for rich snippets
- Include Open Graph and Twitter Card metadata
- Set canonical URLs to prevent duplicate content

### Performance

- Use lazy loading for images and non-critical content
- Implement proper loading states for better user experience
- Optimize images and use appropriate formats (WebP, AVIF)
- Preload critical resources

### Accessibility

- Use semantic HTML structure
- Provide proper heading hierarchy
- Include skip links for keyboard navigation
- Test with screen readers

### Error Handling

- Provide meaningful error messages
- Include retry mechanisms where appropriate
- Log errors for debugging
- Gracefully degrade functionality

### CMS Integration

- Create efficient component mappers
- Handle missing or malformed CMS data
- Implement caching strategies
- Validate CMS content before rendering

### Props Standardization

Follow these standardized props for child components:

- `loading` (boolean) for loading states
- `imageUrl` for image sources
- `backgroundImageUrl` for background images
- `href` for links and URLs (not `url` or `link`)
- `onClick` for primary click handlers
- `onChange` for value change events

### CSS Injection Best Practices

- **No Manual CSS Imports**: Never import CSS files manually when using components
- **Automatic Loading**: Trust the injection system to handle styling automatically
- **Environment Agnostic**: Component works identically in Node.js, browsers, and bundlers
- **Style Isolation**: Each component manages its own styles independently
- **Performance Optimized**: Styles are deduplicated and cached automatically

## Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Node.js**: v14+ (full compatibility with CSS injection)
- **SSR Frameworks**: Next.js, Nuxt.js, SvelteKit, etc.
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Core Web Vitals optimized
- **Mobile**: Responsive design with touch support

## Dependencies

- Head component (for SEO management)
- Base component utilities
- Performance utilities (debounce, throttle)
- Component factory utilities
- **🆕 Style injection utilities** (automatic CSS management)

## Architecture Benefits

The CSS injection architecture provides several key advantages:

### Development Experience

- **No Configuration**: Works out of the box in any environment
- **No Build Setup**: No webpack, rollup, or vite configuration needed for CSS
- **Error Prevention**: Eliminates Node.js CSS import errors completely
- **Consistent Behavior**: Same API across all JavaScript environments

### Performance

- **Tree Shaking**: Only loads styles for components actually used
- **Automatic Deduplication**: Prevents duplicate style injection
- **Lazy Loading**: Styles load only when components render
- **Memory Efficient**: Optimal style caching and cleanup

### Maintainability

- **Co-located Styles**: Styles live alongside component code
- **Version Consistency**: Styles and component logic always in sync
- **Modular Architecture**: Each component owns its styling completely
- **Zero Breaking Changes**: Maintains full backward compatibility

This approach follows modern best practices used by libraries like Chakra UI, Mantine, and other CSS-in-JS solutions, while maintaining the simplicity and performance of vanilla JavaScript.
