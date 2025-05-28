# BackToTop Component

A floating button component that provides smooth scroll-to-top functionality with intelligent visibility control and full accessibility support.

## Features

- **Smart Visibility**: Automatically shows/hides based on scroll position
- **Smooth Scrolling**: Configurable smooth scroll animation
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance Optimized**: Throttled scroll handling for optimal performance
- **Themeable**: Complete CSS variable support for all visual aspects
- **Responsive**: Mobile-friendly positioning and sizing
- **Icon Support**: Custom icon support with default arrow icon

## Basic Usage

```javascript
import { BackToTop } from 'svarog-ui';

// Basic implementation
const backToTop = BackToTop({
  showAfter: 300, // Show after scrolling 300px
});

document.body.appendChild(backToTop.getElement());
```

## Advanced Usage

```javascript
// With custom configuration
const backToTop = BackToTop({
  showAfter: 500,
  scrollDuration: 800,
  icon: '↑',
  position: { bottom: '1rem', right: '1rem' },
  onClick: () => console.log('Scrolling to top'),
  className: 'custom-back-to-top',
});

// With custom scroll target
const backToTop = BackToTop({
  scrollTarget: document.querySelector('.scroll-container'),
  showAfter: 200,
});

// Programmatic control
backToTop.show();
backToTop.hide();
backToTop.scrollToTop();
```

## Props

| Prop             | Type            | Default                             | Description                                 |
| ---------------- | --------------- | ----------------------------------- | ------------------------------------------- |
| `showAfter`      | number          | `300`                               | Scroll distance (px) before button appears  |
| `scrollDuration` | number          | `500`                               | Smooth scroll animation duration (ms)       |
| `scrollTarget`   | Element         | `window`                            | Element to monitor for scroll events        |
| `icon`           | string\|Element | `'↑'`                               | Icon content (text, HTML, or DOM element)   |
| `ariaLabel`      | string          | `'Back to top'`                     | Accessibility label                         |
| `position`       | object          | `{ bottom: '2rem', right: '2rem' }` | CSS positioning                             |
| `onClick`        | function        | `null`                              | Custom click handler (called before scroll) |
| `onShow`         | function        | `null`                              | Callback when button becomes visible        |
| `onHide`         | function        | `null`                              | Callback when button becomes hidden         |
| `className`      | string          | `''`                                | Additional CSS classes                      |
| `disabled`       | boolean         | `false`                             | Whether the button is disabled              |

## Component API

```javascript
const backToTop = BackToTop(props);

// Get DOM element
const element = backToTop.getElement();

// Update props
backToTop.update({ showAfter: 400 });

// Manual control
backToTop.show(); // Force show button
backToTop.hide(); // Force hide button
backToTop.scrollToTop(); // Trigger scroll to top
backToTop.destroy(); // Clean up resources
```

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support with Enter/Space activation
- **Screen Reader Support**: Proper ARIA labels and role attributes
- **Focus Management**: Visible focus indicators and proper tab order
- **Semantic HTML**: Uses `<button>` element for proper semantics

## Theme Variables

All visual aspects can be customized through CSS variables:

### Position & Size

```css
:root {
  --back-to-top-bottom: 2rem;
  --back-to-top-right: 2rem;
  --back-to-top-size: 3rem;
  --back-to-top-z-index: 1030;
}
```

### Colors & Appearance

```css
:root {
  --back-to-top-bg: var(--color-primary);
  --back-to-top-color: var(--color-text-white);
  --back-to-top-border: none;
  --back-to-top-radius: 50%;
  --back-to-top-shadow: var(--shadow-lg);
}
```

### States

```css
:root {
  --back-to-top-hover-bg: var(--color-primary-dark);
  --back-to-top-hover-transform: translateY(-2px);
  --back-to-top-hover-shadow: var(--shadow-xl);

  --back-to-top-active-bg: var(--color-primary-dark);
  --back-to-top-active-transform: translateY(0);

  --back-to-top-focus-outline: 2px solid var(--focus-ring-color);
  --back-to-top-focus-outline-offset: 2px;

  --back-to-top-disabled-opacity: 0.6;
}
```

### Animations

```css
:root {
  --back-to-top-transition: all 0.3s ease;
  --back-to-top-visible-opacity: 1;
  --back-to-top-icon-transition: transform 0.2s ease;
  --back-to-top-icon-hover-transform: scale(1.1);
}
```

## Responsive Design

The component adapts to different screen sizes:

```css
/* Mobile adjustments */
@media (max-width: 768px) {
  :root {
    --back-to-top-bottom: 1rem;
    --back-to-top-right: 1rem;
    --back-to-top-size: 2.5rem;
    --back-to-top-icon-size: 1rem;
  }
}
```

## Performance Considerations

- **Throttled Scroll Events**: Scroll handling is throttled to 16ms for 60fps performance
- **Efficient DOM Updates**: Minimal DOM manipulations using CSS classes
- **Memory Management**: Proper cleanup of event listeners on destroy
- **Passive Event Listeners**: Non-blocking scroll event handling

## Examples

### Basic Implementation

```javascript
const backToTop = BackToTop();
document.body.appendChild(backToTop.getElement());
```

### Custom Icon and Styling

```javascript
const backToTop = BackToTop({
  icon: '⬆',
  className: 'my-custom-back-to-top',
  position: { bottom: '1rem', left: '1rem' },
});
```

### With Custom Scroll Container

```javascript
const backToTop = BackToTop({
  scrollTarget: document.querySelector('.main-content'),
  showAfter: 100,
});
```

### With Callbacks

```javascript
const backToTop = BackToTop({
  onClick: () => {
    analytics.track('Back to top clicked');
  },
  onShow: () => {
    console.log('Back to top button appeared');
  },
  onHide: () => {
    console.log('Back to top button hidden');
  },
});
```

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers with smooth scroll support

## CSS Injection

Styles are automatically injected when the component is first rendered. No manual CSS imports required.

## Testing

```javascript
import { BackToTop } from 'svarog-ui';

// Test basic functionality
const backToTop = BackToTop({ showAfter: 100 });
const element = backToTop.getElement();

// Test visibility
window.scrollTo(0, 200);
expect(element.classList.contains('back-to-top--visible')).toBe(true);

// Test click behavior
element.click();
expect(window.scrollY).toBe(0);

// Test cleanup
backToTop.destroy();
```

## Migration from v3

No breaking changes. The component is new in v4.

## Related Components

- [Button](../Button/README.md) - Basic button component
- [Navigation](../Navigation/README.md) - Navigation with scroll handling
- [StickyContactIcons](../StickyContactIcons/README.md) - Fixed position contact buttons

---

## File Structure

```
src/components/BackToTop/
├── index.js              # Main export
├── BackToTop.js          # Component implementation
├── BackToTop.test.js     # Unit tests
├── BackToTop.stories.js  # Storybook stories
└── README.md            # This file
```
