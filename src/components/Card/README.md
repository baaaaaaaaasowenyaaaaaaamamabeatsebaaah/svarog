# Card Component

The Card component provides a customizable, accessible container for displaying content with optional image, title, and footer sections.

## Usage

```javascript
import { Card } from '@svarog-ui/core';

// Create a basic card
const myCard = Card({
  title: 'Card Title',
  children: 'This is the card content.',
});

// Add to DOM
document.body.appendChild(myCard.getElement());
```

## Props

| Prop      | Type                       | Default    | Description                                                     |
| --------- | -------------------------- | ---------- | --------------------------------------------------------------- |
| children  | string\|HTMLElement\|Array | (Required) | The content of the card                                         |
| title     | string                     | undefined  | Optional title for the card                                     |
| image     | string\|HTMLElement        | undefined  | Optional image URL or element to display at the top of the card |
| footer    | string\|HTMLElement        | undefined  | Optional footer content                                         |
| outlined  | boolean                    | false      | Whether to use an outlined style                                |
| elevated  | boolean                    | false      | Whether to add elevation shadow                                 |
| className | string                     | ''         | Additional CSS class names                                      |

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

Card styles can be customized using CSS variables:

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
}
```

## Accessibility

The Card component is designed with accessibility in mind:

- Proper semantic structure with appropriate heading levels
- Image alt text for screen readers
- Logical content flow and navigation
- Appropriate contrast and text sizing

## Examples

### Basic Card

```javascript
const basicCard = Card({
  title: 'Basic Card',
  children: 'This is a simple card with a title and content.',
});
```

### Card with Image

```javascript
const imageCard = Card({
  title: 'Card with Image',
  image: 'https://example.com/image.jpg',
  children: 'This card includes an image at the top.',
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
