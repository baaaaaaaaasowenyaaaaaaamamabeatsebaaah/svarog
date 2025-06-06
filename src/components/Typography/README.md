# Typography Component

The Typography component provides consistent text styling and formatting across your application, supporting various text elements, alignments, weights, and styles. **This component uses automatic CSS injection - no separate CSS imports required.**

## Features

✅ **Zero Configuration** - Styles automatically inject when component is used  
✅ **SSR Compatible** - Works in Node.js environments without CSS import errors  
✅ **Performance Optimized** - Styles are cached and deduped automatically  
✅ **Tree Shakeable** - Only loads when component is actually used

## Usage

```javascript
import { Typography } from '@svarog-ui/core';

// Create a heading
const heading = Typography({
  children: 'Hello World',
  as: 'h1',
  textAlign: 'center',
  weight: 'bold',
});

// Add to DOM
document.body.appendChild(heading.getElement());
```

## Props

| Prop       | Type                           | Default    | Description                                                                           |
| ---------- | ------------------------------ | ---------- | ------------------------------------------------------------------------------------- |
| children   | string\|HTMLElement\|Component | (Required) | Text content or element to display                                                    |
| value      | string\|HTMLElement\|Component | undefined  | Alternative to children prop for content (takes precedence over children)             |
| as         | string                         | 'span'     | HTML element type ('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div')            |
| textAlign  | string                         | null       | Text alignment ('left', 'center', 'right', 'justify')                                 |
| weight     | string\|number                 | null       | Font weight ('light', 'regular', 'medium', 'semibold', 'bold', '100'-'900', 'normal') |
| color      | string                         | null       | Text color (any valid CSS color value)                                                |
| italic     | boolean                        | false      | Whether text should be italicized                                                     |
| block      | boolean                        | null       | Whether element should be displayed as block (defaults to block for headings)         |
| id         | string                         | null       | HTML ID attribute                                                                     |
| className  | string                         | ''         | Additional CSS classes                                                                |
| tabletSize | string                         | null       | Font size for tablet devices (valid CSS size value)                                   |
| mobileSize | string                         | null       | Font size for mobile devices (valid CSS size value)                                   |

## Methods

### getElement()

Returns the typography DOM element.

```javascript
const typographyElement = myTypography.getElement();
```

### setContent(content)

Updates the typography content.

```javascript
myTypography.setContent('New text content');
// Or with HTML element
myTypography.setContent(document.createElement('strong'));
// Or with another component
myTypography.setContent(anotherComponent);
```

### setColor(color)

Updates the text color.

```javascript
myTypography.setColor('#ff0000');
```

### setWeight(weight)

Updates the font weight.

```javascript
myTypography.setWeight('bold');
// Or using numeric values
myTypography.setWeight('500');
```

### update(props)

Updates multiple typography properties at once.

```javascript
myTypography.update({
  textAlign: 'center',
  color: 'blue',
  italic: true,
  weight: 'semibold',
});
```

### destroy()

Cleans up resources. Call when removing the typography.

```javascript
myTypography.destroy();
```

## CSS Customization

Typography styles can be customized using CSS variables:

```css
:root {
  --typography-color: #333;
  --typography-muted-color: #666;
  --typography-margin-bottom: 1rem;
  --font-family-primary: 'Arial', sans-serif;
  --line-height-normal: 1.5;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Size variables */
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 28px;
  --font-size-4xl: 32px;
  --font-size-6xl: 48px;
}
```

## Examples

### Heading Elements

```javascript
const h1 = Typography({
  children: 'Heading 1',
  as: 'h1',
});

const h2 = Typography({
  children: 'Heading 2',
  as: 'h2',
});

// ... h3 through h6
```

### Paragraph

```javascript
const paragraph = Typography({
  children:
    'This is a paragraph element. It contains regular body text that can wrap across multiple lines when needed.',
  as: 'p',
});
```

### Using the value prop

```javascript
const paragraph = Typography({
  value: 'This text uses the standardized value prop',
  as: 'p',
});
```

### Styled Text

```javascript
const styledText = Typography({
  children: 'Important Message',
  color: 'red',
  weight: 'bold',
  italic: true,
});
```

### Text Alignment

```javascript
const centeredText = Typography({
  children: 'Centered Text',
  textAlign: 'center',
});

const rightAlignedText = Typography({
  children: 'Right Aligned Text',
  textAlign: 'right',
});
```

### Responsive Typography

```javascript
const responsiveHeading = Typography({
  children: 'Responsive Heading',
  as: 'h2',
  tabletSize: '24px',
  mobileSize: '20px',
});
```

### Complex Content

```javascript
// With HTML elements
const link = document.createElement('a');
link.href = 'https://example.com';
link.textContent = 'Example Link';

const complexContent = Typography({
  children: link,
  as: 'div',
});

// Or with another component
const buttonComponent = Button({ text: 'Click Me' });
const wrappedButton = Typography({
  children: buttonComponent,
  as: 'div',
  textAlign: 'center',
});
```

## Performance Optimizations

The Typography component includes several performance optimizations:

- **Style Injection Caching**: Styles are injected once and cached globally
- **Partial Updates**: Style-only changes don't trigger full DOM rebuilds
- **Debounced Resize Handling**: Window resize events are throttled for performance
- **Efficient Class Management**: Class names are updated incrementally when possible

## Architecture

### CSS Injection System

This component uses our modern CSS injection system:

- **Automatic**: Styles inject automatically when component is used
- **Deduped**: Multiple instances share the same injected styles
- **SSR Safe**: Works in Node.js environments without errors
- **Performance**: Styles are cached in memory and DOM

### Component Structure

```
src/components/Typography/
├── Typography.js              # Main component with CSS injection
├── Typography.styles.js       # Component-specific styles
├── Typography.test.js         # Component tests
├── Typography.performance.test.js  # Performance tests
├── Typography.stories.js      # Storybook stories
├── README.md                  # This documentation
└── index.js                   # Public exports
```

## Browser Support

- **Modern Browsers**: Full support with CSS injection
- **Legacy Browsers**: Graceful fallback to inline styles
- **SSR**: Full Node.js compatibility

## Migration from CSS Imports

If upgrading from a version that used CSS imports:

**Before:**

```javascript
import './Typography.css'; // ❌ No longer needed
import { Typography } from '@svarog-ui/core';
```

**After:**

```javascript
import { Typography } from '@svarog-ui/core'; // ✅ Styles auto-inject
```

## Accessibility

The Typography component follows best practices for accessibility:

- Proper heading hierarchy
- Semantic HTML elements
- Sufficient color contrast when using theme variables
- Proper text sizing and spacing for readability
- Support for assistive technologies
