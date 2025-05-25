# Card Component

The Card component provides a customizable, accessible container for displaying content with optional image, title, and footer sections. It automatically injects its styles when used, requiring no additional CSS imports.

## Features

✅ **Zero Configuration** - Styles inject automatically, no CSS imports needed  
✅ **SSR Compatible** - Works safely in Node.js and browser environments  
✅ **Performance Optimized** - Styles are cached and injected only once  
✅ **Theme Aware** - Responds to theme changes via CSS variables  
✅ **Accessible** - Built with semantic HTML and proper ARIA attributes

## Usage

```javascript
import { Card } from '@svarog-ui/core';

// Create a basic card - styles inject automatically
const myCard = Card({
  title: 'Card Title',
  children: 'This is the card content.',
});

// Add to DOM
document.body.appendChild(myCard.getElement());
```

## Props

| Prop         | Type                       | Default    | Description                            |
| ------------ | -------------------------- | ---------- | -------------------------------------- |
| children     | string\|HTMLElement\|Array | (Required) | The content of the card                |
| title        | string                     | undefined  | Optional title for the card            |
| imageUrl     | string                     | undefined  | URL of the image to display at the top |
| imageElement | HTMLElement                | undefined  | Image element to display at the top    |
| footer       | string\|HTMLElement        | undefined  | Optional footer content                |
| outlined     | boolean                    | false      | Whether to use an outlined style       |
| elevated     | boolean                    | false      | Whether to add elevation shadow        |
| className    | string                     | ''         | Additional CSS class names             |

> **Migration Note:** The `image` prop is deprecated. Use `imageUrl` for string URLs or `imageElement` for HTML elements instead. The component will show a console warning and automatically migrate the prop.

## Methods

### getElement()

Returns the card DOM element.

```javascript
const cardElement = myCard.getElement();
```

### update(props)

Updates multiple card properties at once.

```javascript
myCard.update({
  title: 'Updated Title',
  children: 'Updated content',
  outlined: true,
  elevated: false,
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the card.

```javascript
myCard.destroy();
```

## CSS Customization

Card styles can be customized using CSS variables. The component automatically injects its base styles, but you can override them:

```css
:root {
  /* Card styling */
  --card-bg: white;
  --card-color: black;
  --card-radius: 4px;
  --card-border: 1px solid #eee;
  --card-border-color: #eee;
  --card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --card-padding: 16px;
  --card-hover-border-color: #ccc;

  /* Card title styling */
  --card-title-padding: 0 0 16px 0;
  --card-title-font-size: 18px;
  --card-title-font-weight: bold;
  --card-title-border: 1px solid #eee;
  --card-title-margin-bottom: 16px;

  /* Card content styling */
  --card-content-padding: 0;

  /* Card footer styling */
  --card-footer-padding: 16px 0 0 0;
  --card-footer-bg: transparent;
  --card-footer-border: 1px solid #eee;
  --card-footer-margin-top: 16px;
  --card-footer-font-size: 14px;

  /* Mobile responsive overrides */
  --card-title-padding-mobile: 0 0 12px 0;
  --card-content-padding-mobile: 0;
  --card-footer-padding-mobile: 12px 0 0 0;
}
```

## Accessibility

The Card component is designed with accessibility in mind:

- Proper semantic structure with appropriate heading levels
- Image alt text for screen readers
- Logical content flow and navigation
- Appropriate contrast and text sizing
- ARIA attributes where needed

## Examples

### Basic Card

```javascript
const basicCard = Card({
  title: 'Basic Card',
  children: 'This is a simple card with a title and content.',
});
```

### Card with Image (URL)

```javascript
const imageCard = Card({
  title: 'Card with Image',
  imageUrl: 'https://example.com/image.jpg',
  children: 'This card includes an image at the top.',
});
```

### Card with Image (Element)

```javascript
// Create a custom image element
const imgElement = document.createElement('img');
imgElement.src = 'https://example.com/image.jpg';
imgElement.alt = 'Custom image';
imgElement.className = 'custom-image';

const imageElementCard = Card({
  title: 'Card with Image Element',
  imageElement: imgElement,
  children: 'This card includes a custom image element at the top.',
});
```

### Card with Footer

```javascript
const footerCard = Card({
  title: 'Card with Footer',
  children: 'This card has a footer with action buttons.',
  footer: document.querySelector('.card-actions'),
});
```

### Outlined Card

```javascript
const outlinedCard = Card({
  title: 'Outlined Card',
  children: 'This card uses the outlined style.',
  outlined: true,
});
```

### Elevated Card

```javascript
const elevatedCard = Card({
  title: 'Elevated Card',
  children: 'This card has a shadow elevation.',
  elevated: true,
});
```

### Complex Card with Multiple Elements

```javascript
// Create content with multiple elements
const contentContainer = document.createElement('div');

const paragraph1 = document.createElement('p');
paragraph1.textContent =
  'This is a complex card with multiple content elements.';
contentContainer.appendChild(paragraph1);

const list = document.createElement('ul');
['First item', 'Second item', 'Third item'].forEach((item) => {
  const li = document.createElement('li');
  li.textContent = item;
  list.appendChild(li);
});
contentContainer.appendChild(list);

// Create footer with buttons
const footerContainer = document.createElement('div');
footerContainer.style.display = 'flex';
footerContainer.style.justifyContent = 'space-between';

const cancelButton = Button({
  text: 'Cancel',
  onClick: () => alert('Cancel clicked'),
  variant: 'secondary',
}).getElement();

const confirmButton = Button({
  text: 'Confirm',
  onClick: () => alert('Confirm clicked'),
  variant: 'primary',
}).getElement();

footerContainer.appendChild(cancelButton);
footerContainer.appendChild(confirmButton);

const complexCard = Card({
  title: 'Complex Card Example',
  imageUrl: 'https://example.com/image.jpg',
  children: contentContainer,
  footer: footerContainer,
  elevated: true,
});
```

## Node.js Compatibility

The Card component is fully compatible with Node.js environments:

```javascript
// This works without any CSS import errors
const { Card } = require('@svarog-ui/core');

const card = Card({
  title: 'Server-side Card',
  children: 'This works in Node.js!',
});

// Get the HTML structure
const element = card.getElement();
console.log(element.outerHTML);
```

## Browser Support

- ✅ Modern browsers (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- ✅ CSS injection works in all environments
- ✅ Graceful degradation for older browsers
- ✅ SSR and hydration support

## Performance Notes

- **First Use**: Styles inject automatically on first component creation
- **Subsequent Uses**: Styles are cached, no additional injections
- **Bundle Size**: Only includes CSS for components you actually use
- **Memory Efficient**: Automatic cleanup and deduplication

## Migration from CSS Imports

If you were previously importing CSS files:

```javascript
// OLD - Remove these imports
// import '@svarog-ui/core/Card.css';
// import './Card.css';

// NEW - Just import and use
import { Card } from '@svarog-ui/core';

const card = Card({ children: 'Content' });
```

The component now automatically handles all styling without any CSS imports required.

## TypeScript Support

```typescript
interface CardProps {
  children: string | HTMLElement | Array<HTMLElement | string>;
  title?: string;
  imageUrl?: string;
  imageElement?: HTMLElement;
  footer?: string | HTMLElement;
  outlined?: boolean;
  elevated?: boolean;
  className?: string;
}

interface CardAPI {
  getElement(): HTMLElement;
  update(props: Partial<CardProps>): CardAPI;
  destroy(): void;
  onThemeChange?(theme: string, previousTheme: string): void;
}

declare function Card(props: CardProps): CardAPI;
```
