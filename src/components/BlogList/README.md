# BlogList Component

The BlogList component displays a collection of blog posts in a responsive grid layout. Styles are automatically injected when the component is used - no separate CSS imports required.

## Usage

```javascript
import { BlogList } from '@svarog-ui/core';

// Create a blog list - styles are automatically injected
const myBlogList = BlogList({
  posts: [
    {
      title: 'Getting Started with Web Components',
      slug: 'getting-started-with-web-components',
      excerpt:
        'Learn how to create reusable web components using vanilla JavaScript...',
      imageUrl: 'https://example.com/image.jpg', // Standardized prop name
      publishedDate: '2024-01-15T00:00:00Z',
      author: 'Jane Smith',
      categories: ['Web Development', 'JavaScript'],
    },
    // More posts...
  ],
  title: 'Latest Blog Posts',
  columns: 3,
});

// Add to DOM - no CSS imports needed!
document.body.appendChild(myBlogList.getElement());
```

## Features

✅ **Zero Configuration** - No CSS imports required  
✅ **SSR Compatible** - Styles inject safely in browser environments  
✅ **Performance Optimized** - Styles are cached and deduped automatically  
✅ **Modern Architecture** - Uses CSS injection for maximum compatibility

## Props

| Prop      | Type   | Default | Description                            |
| --------- | ------ | ------- | -------------------------------------- |
| posts     | array  | []      | Array of blog post objects             |
| title     | string | ''      | Heading text for the blog list section |
| columns   | number | 3       | Number of grid columns                 |
| className | string | ''      | Additional CSS class names             |

### Post Object Structure

Each post in the `posts` array should have the following structure:

| Property      | Type   | Description                               |
| ------------- | ------ | ----------------------------------------- |
| title         | string | Blog post title                           |
| slug          | string | URL slug for the blog post                |
| excerpt       | string | Short excerpt or summary of the blog post |
| imageUrl      | string | URL for the featured image                |
| publishedDate | string | ISO date string for the publication date  |
| author        | string | Author name                               |
| categories    | array  | Array of category names                   |

> **Note:** For backward compatibility, the component also accepts `featuredImage` instead of `imageUrl`, but this is deprecated and will be removed in a future version.

## Methods

### getElement()

Returns the blog list DOM element.

```javascript
const blogListElement = myBlogList.getElement();
```

### update(props)

Updates the blog list with new properties.

```javascript
myBlogList.update({
  title: 'Updated Blog Posts',
  columns: 2,
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the blog list.

```javascript
myBlogList.destroy();
```

## CSS Customization

BlogList styles can be customized using CSS variables:

```css
:root {
  /* Blog list styling */
  --blog-list-padding: var(--space-6) 0;
  --blog-list-title-margin: 0 0 var(--space-6) 0;
  --blog-list-title-align: center;

  /* Empty state styling */
  --blog-list-empty-padding: var(--space-8) var(--space-4);
  --blog-list-empty-bg: var(--color-bg-secondary);
  --blog-list-empty-color: var(--color-text-light);
  --blog-list-empty-border-radius: var(--border-radius);
}
```

## Migration from CSS Imports

**Before (Old Method):**

```javascript
import { BlogList } from '@svarog-ui/core';
import '@svarog-ui/core/dist/BlogList.css'; // ❌ No longer needed

const blogList = BlogList(props);
```

**After (New Method):**

```javascript
import { BlogList } from '@svarog-ui/core';
// ✅ No CSS import needed - styles inject automatically

const blogList = BlogList(props);
```

## Accessibility

The BlogList component follows accessibility best practices:

- Proper heading structure with H2 for the section title
- Semantic HTML structure
- Descriptive text for empty state
- Proper keyboard navigation through blog cards

## Examples

### Basic Blog List

```javascript
const basicList = BlogList({
  posts: blogPosts,
  title: 'Latest Updates',
  columns: 3,
});
```

### Two-Column List

```javascript
const twoColumnList = BlogList({
  posts: blogPosts,
  title: 'Featured Posts',
  columns: 2,
});
```

### Single Column List

```javascript
const singleColumnList = BlogList({
  posts: blogPosts,
  title: 'Recent Articles',
  columns: 1,
});
```

### List Without Title

```javascript
const noTitleList = BlogList({
  posts: blogPosts,
});
```

### Empty List

```javascript
// Will display "No posts found." message
const emptyList = BlogList({
  posts: [],
  title: 'Category Posts',
});
```

## Node.js Compatibility

The component now works seamlessly in Node.js environments:

```javascript
// ✅ Works in Node.js - no CSS import errors
const { BlogList } = require('svarog-ui');

// Server-side rendering safe
const blogListHTML = BlogList(props).getElement().outerHTML;
```

## Browser Support

The BlogList component uses CSS Grid for layout and is compatible with:

- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+

For older browsers, consider using a CSS Grid polyfill or a fallback layout.

## Technical Details

### CSS Injection Architecture

- **Automatic Style Injection**: Styles are injected into `<head>` when component is first used
- **Deduplication**: Multiple instances share the same injected styles
- **SSR Safe**: No styles are injected on server-side
- **Performance**: Styles are cached and reused across component instances
- **Clean Up**: Styles can be removed for testing environments

### Performance Characteristics

- **Bundle Size**: Only CSS for used components is included
- **Runtime**: Minimal overhead for style injection (< 1ms)
- **Memory**: Efficient style caching prevents duplication
- **Network**: No separate CSS file requests needed

## Troubleshooting

### Styles Not Appearing

1. Check browser dev tools for injected `<style>` tags with `data-svarog="bloglist"`
2. Verify CSS variables are defined in your theme
3. Ensure component is rendered in browser environment (not SSR)

### Migration Issues

If migrating from CSS imports:

1. Remove all CSS import statements
2. Update build process to exclude CSS files
3. Test in both browser and Node.js environments
4. Verify no duplicate styles are loaded
