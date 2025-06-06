# BlogDetail Component

The BlogDetail component displays a full blog post with title, author information, publication date, categories, featured image, and formatted content. Styles are automatically injected when the component is used.

## Features

✅ **Zero Configuration** - Styles automatically inject when component is used  
✅ **SSR Compatible** - Works in Node.js environments without CSS import errors  
✅ **Performance Optimized** - Styles are cached and deduped automatically  
✅ **Tree Shakeable** - Only loads styles when component is actually used

## Usage

```javascript
import { BlogDetail } from '@svarog-ui/core';

// Create a blog detail component - styles automatically inject
const myBlogDetail = BlogDetail({
  title: 'Getting Started with Web Components',
  content:
    '<p>Web Components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps.</p>',
  imageUrl: 'https://example.com/image.jpg',
  publishedDate: '2024-01-15T00:00:00Z',
  author: 'Jane Smith',
  categories: ['Web Development', 'JavaScript'],
});

// Add to DOM
document.body.appendChild(myBlogDetail.getElement());
```

## Props

| Prop          | Type   | Default | Description                              |
| ------------- | ------ | ------- | ---------------------------------------- |
| title         | string | ''      | Blog post title                          |
| content       | string | ''      | HTML content for the blog post           |
| imageUrl      | string | ''      | URL for the featured image               |
| publishedDate | string | ''      | ISO date string for the publication date |
| author        | string | ''      | Author name                              |
| categories    | array  | []      | Array of category names                  |
| className     | string | ''      | Additional CSS class names               |

> **Note:** The `featuredImage` prop is deprecated and will be removed in a future version. Please use `imageUrl` instead.

## CSS Injection

The BlogDetail component uses automatic CSS injection:

- **Automatic**: Styles inject when component is first created
- **Cached**: Styles are injected only once, even with multiple components
- **SSR Safe**: No CSS imports that break in Node.js environments
- **Deduped**: Multiple BlogDetail instances share the same injected styles

### Style Customization

BlogDetail styles can be customized using CSS variables:

```css
:root {
  /* Blog detail layout */
  --blog-detail-max-width: 800px;
  --blog-detail-padding: var(--space-6) var(--space-4);

  /* Blog detail header */
  --blog-detail-header-margin: var(--space-6);
  --blog-detail-title-size: var(--font-size-4xl);
  --blog-detail-title-color: var(--color-text);
  --blog-detail-meta-color: var(--color-text-light);

  /* Blog detail content */
  --blog-detail-content-size: var(--font-size-lg);
  --blog-detail-content-line-height: 1.7;
  --blog-detail-link-color: var(--color-primary);
  --blog-detail-code-bg: var(--color-bg-secondary);

  /* Blog detail image */
  --blog-detail-image-margin: var(--space-6) 0;
  --blog-detail-image-border-radius: var(--border-radius);
}
```

## Methods

### getElement()

Returns the blog detail DOM element.

```javascript
const blogDetailElement = myBlogDetail.getElement();
```

### update(props)

Updates multiple blog detail properties at once.

```javascript
myBlogDetail.update({
  title: 'Updated Title',
  author: 'New Author',
  categories: ['Updated Category'],
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the blog detail.

```javascript
myBlogDetail.destroy();
```

## Migration from CSS Imports

If you were previously importing CSS manually:

```javascript
// ❌ OLD - Remove this
import './BlogDetail.css';
import BlogDetail from './BlogDetail.js';

// ✅ NEW - Just import the component
import BlogDetail from './BlogDetail.js';
```

The component now handles its own styling automatically.

## Performance Benefits

- **Reduced Bundle Size**: No CSS files in your bundle
- **Lazy Loading**: Styles only load when component is used
- **Cache Efficient**: Styles are deduplicated across instances
- **SSR Friendly**: Works in any JavaScript environment

## Accessibility

The BlogDetail component follows accessibility best practices:

- Proper heading structure with H1 title and semantic headings in content
- Descriptive image alt text
- Sufficient color contrast
- Semantic HTML structure
- Proper spacing for improved readability

## Examples

### Basic Blog Detail

```javascript
const basicDetail = BlogDetail({
  title: 'Getting Started with Web Components',
  content: '<p>Learn how to create reusable web components...</p>',
  imageUrl: 'https://example.com/image.jpg',
  publishedDate: '2024-01-15T00:00:00Z',
  author: 'Jane Smith',
  categories: ['Web Development', 'JavaScript'],
});
```

### Blog Detail Without Image

```javascript
const noImageDetail = BlogDetail({
  title: 'Understanding JavaScript Modules',
  content: '<p>A deep dive into modern JavaScript module systems...</p>',
  publishedDate: '2024-01-20T00:00:00Z',
  author: 'John Doe',
  categories: ['JavaScript', 'Programming'],
});
```

### Minimal Blog Detail

```javascript
const minimalDetail = BlogDetail({
  title: 'Quick Update',
  content: '<p>A short announcement about our upcoming features.</p>',
});
```

## Testing

When testing components, you can verify style injection:

```javascript
import { removeStyles } from '../../utils/styleInjection.js';

// Clean up styles after tests
afterEach(() => {
  removeStyles('blogdetail');
});

// Verify styles are injected
it('should inject styles', () => {
  BlogDetail(props);
  const styleElement = document.querySelector('[data-svarog="blogdetail"]');
  expect(styleElement).toBeTruthy();
});
```
