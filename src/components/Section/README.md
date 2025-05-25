# Section Component

The Section component provides a customizable, structured container for page content with support for backgrounds, titles, and consistent spacing. This component uses **automatic CSS injection** - no separate CSS imports needed.

## Features

✅ **Zero Configuration** - Styles inject automatically  
✅ **SSR Compatible** - Works in Node.js environments without errors  
✅ **Performance Optimized** - Styles cached and deduped automatically  
✅ **Theme Support** - Responds to theme changes dynamically  
✅ **Accessibility** - Semantic HTML with proper ARIA support  
✅ **Responsive** - Mobile-first responsive design built-in

## Usage

```javascript
import { Section } from '@svarog-ui/core';

// Create a basic section
const mySection = Section({
  children: 'Section content goes here',
});

// Add to DOM
document.body.appendChild(mySection.getElement());
```

## Props

| Prop                   | Type                       | Default    | Description                                       |
| ---------------------- | -------------------------- | ---------- | ------------------------------------------------- |
| children               | string\|HTMLElement\|Array | (Required) | Content for the section                           |
| id                     | string                     | null       | Section ID for anchor links                       |
| variant                | string                     | null       | Section variant ("minor" for alternative styling) |
| backgroundImageElement | HTMLElement                | null       | Optional background image element                 |
| backgroundColor        | string                     | null       | Custom background color (CSS color value)         |
| noPaddingBottom        | boolean                    | false      | Whether to remove bottom padding                  |
| className              | string                     | ''         | Additional CSS classes                            |
| title                  | string                     | null       | Optional section title                            |
| description            | string                     | null       | Optional section description                      |

## Methods

### getElement()

Returns the section DOM element.

```javascript
const sectionElement = mySection.getElement();
```

### setVariant(variant)

Updates the section variant.

```javascript
mySection.setVariant('minor');
```

### setBackgroundColor(color)

Updates the background color.

```javascript
mySection.setBackgroundColor('#f5f5f5');
```

### setNoPaddingBottom(value)

Toggles the bottom padding.

```javascript
mySection.setNoPaddingBottom(true); // Remove bottom padding
mySection.setNoPaddingBottom(false); // Add back bottom padding
```

### setTitle(title)

Updates the section title.

```javascript
mySection.setTitle('New Section Title');
```

### setDescription(description)

Updates the section description.

```javascript
mySection.setDescription('This is an updated section description');
```

### update(props)

Updates multiple section properties at once.

```javascript
mySection.update({
  variant: 'minor',
  backgroundColor: '#e6f7ff',
  noPaddingBottom: true,
  title: 'Updated Title',
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the section.

```javascript
mySection.destroy();
```

## CSS Customization

Section styles can be customized using CSS variables. The component automatically injects its styles, but you can override them with your own CSS:

```css
:root {
  --section-bg: #ffffff;
  --section-color: #333333;
  --section-bg-minor: #f5f5f5;
  --section-color-minor: #333333;
  --section-padding: 3rem 2rem;
  --section-padding-tablet: 2rem 1.5rem;
  --section-padding-mobile: 1.5rem 1rem;
  --section-gap: 1.5rem;
  --section-gap-tablet: 1rem;
  --section-content-max-width: 1200px;
}

/* Custom overrides */
.my-custom-section {
  --section-bg: #f0f8ff;
  --section-padding: 4rem 2rem;
}
```

## Examples

### Standard Section

```javascript
const content = document.createElement('div');
content.textContent = 'This is a standard section with default styling.';

const standardSection = Section({
  children: [content],
});
```

### Minor Variant

```javascript
const minorSection = Section({
  variant: 'minor',
  children: 'This section uses the minor variant with alternate styling.',
});
```

### With Title and Description

```javascript
const sectionWithTitle = Section({
  title: 'Section Title',
  description: 'This is a descriptive text that appears below the title.',
  children: 'Main content goes here.',
});
```

### With Background Image

```javascript
// Create a background image element
const bgImage = document.createElement('img');
bgImage.src = 'background.jpg';
bgImage.alt = '';
bgImage.style.objectFit = 'cover';

const sectionWithBg = Section({
  backgroundImageElement: bgImage,
  children: 'Section with background image',
});
```

### With Custom Background Color

```javascript
const coloredSection = Section({
  backgroundColor: '#e6f7ff',
  children: 'This section has a custom background color.',
});
```

### With ID for Anchor Links

```javascript
const anchorSection = Section({
  id: 'my-section',
  children: 'This section can be linked to with #my-section',
});
```

### Combining Features

```javascript
const complexSection = Section({
  id: 'complex-section',
  variant: 'minor',
  title: 'Complex Section',
  description: 'This section combines multiple features.',
  backgroundColor: '#f0f8ff',
  noPaddingBottom: true,
  children: [
    /* Array of content elements */
  ],
});
```

## Performance Features

### Automatic Style Injection

Styles are automatically injected when the component is first rendered. The injection system:

- **Caches styles** - Each component type only injects styles once
- **Deduplicates** - Multiple instances share the same injected styles
- **SSR Safe** - No CSS imports that break in Node.js environments
- **Tree Shakeable** - Only loads styles for components you actually use

### Efficient Updates

The component uses intelligent update strategies:

- **Partial Updates** - Minor changes don't trigger full re-renders
- **Class Optimization** - CSS classes updated efficiently
- **Memory Management** - Proper cleanup prevents memory leaks

## Accessibility

The Section component follows best practices for accessibility:

- Uses semantic HTML structure
- Provides proper heading hierarchy when titles are used
- Supports ID attributes for anchor links
- Ensures background images have appropriate contrast for overlaid content
- Maintains consistent spacing and layout across various screen sizes

## Migration from CSS Imports

If you're migrating from a version that required CSS imports:

```javascript
// OLD: Required separate CSS import
import { Section } from '@svarog-ui/core';
import '@svarog-ui/core/Section.css'; // ❌ No longer needed

// NEW: Styles inject automatically
import { Section } from '@svarog-ui/core'; // ✅ Just import and use
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+)
- **Legacy Support**: Graceful fallback with basic styling
- **SSR**: Full Node.js compatibility without CSS import errors

## Prop Migration

Note: The `backgroundImage` prop is now deprecated. Please use `backgroundImageElement` instead.

```javascript
// DEPRECATED
const section = Section({
  backgroundImage: imageElement, // ⚠️ Deprecated
});

// RECOMMENDED
const section = Section({
  backgroundImageElement: imageElement, // ✅ Use this instead
});
```

## Architecture Notes

This component follows the **Unified Vanilla JavaScript Development Principles**:

- **Algorithmic Elegance**: Efficient DOM updates and class management
- **Modern JavaScript**: Uses ES modules, template literals, modern APIs
- **Performance First**: Optimized rendering with minimal DOM operations
- **Clean Architecture**: Separation of concerns with injected styles
- **Developer Experience**: Zero configuration, works everywhere

The CSS injection system eliminates the common pain point of CSS import errors in Node.js environments while maintaining all functionality and performance benefits.
