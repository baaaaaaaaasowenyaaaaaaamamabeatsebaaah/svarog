# BlogCard Component

The BlogCard component displays blog post previews with a consistent, attractive card layout. It's designed to show post titles, excerpts, metadata, and categories.

## CSS Injection System

**✅ Zero Configuration Required** - Styles are automatically injected when the component is used.  
**✅ SSR Compatible** - Works safely in server-side rendering environments.  
**✅ Performance Optimized** - Styles are cached and deduped automatically.  
**✅ Node.js Compatible** - No CSS import errors in Node.js environments.

## Usage

```javascript
import { BlogCard } from '@svarog-ui/core';

// Create a blog card - styles are automatically injected
const myBlogCard = BlogCard({
  title: 'Getting Started with Web Components',
  slug: 'getting-started-with-web-components',
  excerpt:
    'Learn how to create reusable web components using vanilla JavaScript...',
  imageUrl: 'https://example.com/image.jpg',
  publishedDate: '2024-01-15T00:00:00Z',
  author: 'Jane Smith',
  categories: ['Web Development', 'JavaScript'],
});

// Add to DOM
document.body.appendChild(myBlogCard.getElement());

// Styles are automatically available - no separate CSS imports needed!
```

## Migration from CSS Imports

If you're migrating from the previous version that required CSS imports:

```javascript
// ❌ OLD - Required separate CSS import
import { BlogCard } from '@svarog-ui/core';
import '@svarog-ui/core/BlogCard.css'; // No longer needed!

// ✅ NEW - Styles automatically injected
import { BlogCard } from '@svarog-ui/core';
// That's it! No CSS imports required.
```

## Props

| Prop          | Type   | Default    | Description                               |
| ------------- | ------ | ---------- | ----------------------------------------- |
| title         | string | (Required) | Blog post title                           |
| slug          | string | (Required) | URL slug for the blog post                |
| excerpt       | string | ''         | Short excerpt or summary of the blog post |
| imageUrl      | string | ''         | URL for the featured image                |
| publishedDate | string | ''         | ISO date string for the publication date  |
| author        | string | ''         | Author name                               |
| categories    | array  | []         | Array of category names                   |
| className     | string | ''         | Additional CSS class names                |

### Deprecated Props

| Prop          | Deprecated Since | Use Instead | Migration Notes                  |
| ------------- | ---------------- | ----------- | -------------------------------- |
| featuredImage | v2.0.0           | imageUrl    | Will show console warning in dev |

## Methods

### getElement()

Returns the blog card DOM element.

```javascript
const blogCardElement = myBlogCard.getElement();
```

### update(props)

Updates multiple blog card properties at once.

```javascript
myBlogCard.update({
  title: 'Updated Title',
  author: 'New Author',
  categories: ['Updated Category'],
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the blog card.

```javascript
myBlogCard.destroy();
```

## Migration Guide

### From v1.x to v2.x

**CSS Import Removal**

- Remove any CSS imports for BlogCard
- Component now automatically injects styles when rendered

```javascript
// Before (v1.x)
import { BlogCard } from '@svarog-ui/core';
import '@svarog-ui/core/components/BlogCard/BlogCard.css'; // Remove this line

// After (v2.x)
import { BlogCard } from '@svarog-ui/core';
// CSS is automatically injected - no imports needed!
```

**Image Props Standardization**

- Change `featuredImage` to `imageUrl`
- The old prop will continue to work but will show deprecation warnings

```javascript
// Before (v1.x)
const blogCard = BlogCard({
  title: 'My Post',
  slug: 'my-post',
  featuredImage: 'https://example.com/image.jpg', // Deprecated
});

// After (v2.x)
const blogCard = BlogCard({
  title: 'My Post',
  slug: 'my-post',
  imageUrl: 'https://example.com/image.jpg', // New standardized prop
});
```

## CSS Customization

BlogCard styles can be customized using CSS variables:

```css
:root {
  /* Blog card styling */
  --blog-card-shadow: var(--shadow-md);
  --blog-card-hover-shadow: var(--shadow-lg);
  --blog-card-border-radius: var(--border-radius-md);

  /* Blog card title */
  --blog-card-title-size: var(--font-size-xl);
  --blog-card-title-color: var(--color-text);

  /* Blog card meta */
  --blog-card-meta-color: var(--color-text-light);
  --blog-card-meta-size: var(--font-size-sm);

  /* Blog card excerpt */
  --blog-card-excerpt-color: var(--color-text-light);
  --blog-card-excerpt-line-clamp: 3;

  /* Blog card category */
  --blog-card-category-bg: var(--color-bg-secondary);
  --blog-card-category-color: var(--color-text-light);
  --blog-card-category-padding: var(--space-1) var(--space-2);
  --blog-card-category-border-radius: var(--border-radius-sm);
}
```

## Browser Compatibility

The CSS injection system is compatible with all modern browsers and gracefully handles:

- **Server-Side Rendering** - Safe to use with SSR frameworks
- **Node.js Environments** - No CSS import errors when using in Node.js
- **Browser Support** - Works in all browsers that support ES6 modules

## Development Notes

### Style Injection Details

- Styles are injected once per component type (not per instance)
- Injection occurs during the first component render
- Styles are added to the document `<head>` with `data-svarog="blogcard"` attribute
- Multiple BlogCard instances share the same injected styles

### Testing

When writing tests, you may need to clean up injected styles:

```javascript
import { removeStyles } from '@svarog-ui/core/utils/styleInjection';

afterEach(() => {
  removeStyles('blogcard'); // Clean up after each test
});
```

## Accessibility

The BlogCard component follows accessibility best practices:

- Proper heading structure with H3 titles
- Descriptive image alt text
- Sufficient color contrast
- Semantic HTML structure
- Keyboard navigable links

## Examples

### Basic Blog Card

```javascript
const basicCard = BlogCard({
  title: 'Getting Started with Web Components',
  slug: 'getting-started-with-web-components',
  excerpt:
    'Learn how to create reusable web components using vanilla JavaScript...',
  imageUrl: 'https://example.com/image.jpg',
  publishedDate: '2024-01-15T00:00:00Z',
  author: 'Jane Smith',
  categories: ['Web Development', 'JavaScript'],
});
```

### Blog Card Without Image

```javascript
const noImageCard = BlogCard({
  title: 'Using Factory Functions',
  slug: 'using-factory-functions',
  excerpt: 'Understanding the benefits of factory functions over classes...',
  publishedDate: '2024-01-20T00:00:00Z',
  author: 'John Doe',
  categories: ['JavaScript', 'Programming'],
});
```

### Blog Card Without Author

```javascript
const noAuthorCard = BlogCard({
  title: 'CSS Variables Guide',
  slug: 'css-variables-guide',
  excerpt: 'A comprehensive guide to using CSS variables in your projects...',
  imageUrl: 'https://example.com/css-image.jpg',
  publishedDate: '2024-01-25T00:00:00Z',
  categories: ['CSS', 'Web Development'],
});
```
