# Typography Component

The Typography component provides consistent text styling and formatting across your application, supporting various text elements, alignments, weights, and styles.

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
    'This is a paragraph with multiple sentences. It can contain lots of text and will wrap naturally.',
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

## Accessibility

The Typography component follows best practices for accessibility:

- Proper heading hierarchy
- Semantic HTML elements
- Sufficient color contrast when using theme variables
- Proper text sizing and spacing for readability
