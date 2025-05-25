# ProductCard Component

The ProductCard component provides a customizable card for displaying product information with image, specifications, price, and a reserve/buy button. **Styles are automatically injected when the component is used - no CSS imports required.**

## Features

✅ **Zero Configuration** - Just import and use, styles inject automatically  
✅ **SSR Compatible** - Styles inject safely in browser only  
✅ **Performance Optimized** - Styles are cached and deduped  
✅ **Theme Aware** - Responds to theme changes automatically  
✅ **Accessible** - Semantic HTML with proper ARIA attributes

## Usage

```javascript
import { ProductCard } from '@svarog-ui/core';

// Create a product card - styles inject automatically
const productCard = ProductCard({
  imageUrl: 'https://example.com/phone.jpg',
  title: 'iPhone 13 Pro',
  productData: {
    Storage: '128GB',
    Color: 'Graphite',
    Condition: 'Excellent',
    'Battery Health': '98%',
  },
  price: '699.99',
  onClick: () => console.log('Product reserved'),
});

// Add to DOM
document.body.appendChild(productCard.getElement());
```

## Props

| Prop        | Type           | Default    | Description                               |
| ----------- | -------------- | ---------- | ----------------------------------------- |
| imageUrl    | string         | (Required) | URL to the product image                  |
| title       | string         | (Required) | Product title                             |
| productData | Object         | (Required) | Key-value pairs of product specifications |
| price       | string\|number | (Required) | Product price                             |
| currency    | string         | '€'        | Currency symbol                           |
| buttonText  | string         | 'Reserve'  | Text for the reserve/buy button           |
| onClick     | Function       | () => {}   | Callback function when button is clicked  |
| onReserve   | Function       | -          | DEPRECATED: Use onClick instead           |
| className   | string         | ''         | Additional CSS classes                    |

## Methods

### getElement()

Returns the product card DOM element.

```javascript
const cardElement = productCard.getElement();
```

### update(props)

Updates multiple product card properties at once.

```javascript
productCard.update({
  price: '649.99',
  buttonText: 'Buy Now',
  onClick: () => console.log('Changed callback'),
});
```

### destroy()

Cleans up resources. Call when removing the product card.

```javascript
productCard.destroy();
```

## Theme Awareness

The ProductCard automatically responds to theme changes and can also use theme-specific styling:

```javascript
// Apply muchandy-theme styles
const themedCard = ProductCard({
  // ... other props
  className: 'muchandy-theme',
});
```

## CSS Customization

ProductCard styles can be customized using CSS variables. The component automatically injects its styles, but you can override them:

```css
:root {
  /* Spacing variables */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-10: 40px;

  /* Colors */
  --color-primary: #0d6efd;
  --color-text-light: #6c757d;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f8f9fa;

  /* Typography */
  --font-size-xl: 1.25rem;
  --font-weight-medium: 500;
}

/* Theme-specific overrides */
.muchandy-theme {
  --color-primary: #ff5722;
  --color-text-light: #757575;
}

/* Custom overrides for ProductCard */
.product-card {
  /* Your custom styles here */
}
```

## Architecture

The ProductCard follows the CSS injection pattern for optimal compatibility:

- **Automatic Style Injection**: Styles inject when component is first used
- **Performance Optimized**: Styles are cached and only injected once
- **SSR Safe**: No issues in Node.js environments
- **Zero Dependencies**: No separate CSS files to import

### File Structure

```
src/components/ProductCard/
├── ProductCard.js           # Main component with injection
├── ProductCard.styles.js    # Component-specific styles
├── ProductCard.test.js      # Tests
├── ProductCard.stories.js   # Storybook stories
├── README.md               # This file
└── index.js                # Exports
```

## Examples

### Basic Product Card

```javascript
const basicCard = ProductCard({
  imageUrl: 'https://example.com/phone.jpg',
  title: 'iPhone 13 Pro',
  productData: {
    Storage: '128GB',
    Color: 'Graphite',
  },
  price: '699.99',
  onClick: () => console.log('Product reserved'),
});
```

### Custom Currency and Button Text

```javascript
const customCard = ProductCard({
  imageUrl: 'https://example.com/phone.jpg',
  title: 'Samsung Galaxy S22',
  productData: {
    Storage: '256GB',
    Color: 'Phantom Black',
  },
  price: '799.99',
  currency: '$',
  buttonText: 'Buy Now',
  onClick: () => console.log('Product purchased'),
});
```

### Creating a Product Grid

```javascript
// Create grid container (styles automatically included)
const grid = document.createElement('div');
grid.className = 'product-grid';

// Add multiple product cards
products.forEach((product) => {
  const card = ProductCard({
    imageUrl: product.image,
    title: product.name,
    productData: product.specs,
    price: product.price,
    onClick: () => handleReserve(product.id),
  });

  grid.appendChild(card.getElement());
});

// Add grid to DOM
document.body.appendChild(grid);
```

### Working with Node.js/SSR

The component works perfectly in Node.js environments:

```javascript
// This works without CSS import errors
import { ProductCard } from 'svarog-ui';

// Component can be created and configured server-side
const card = ProductCard({
  title: 'Server-side Product',
  productData: { Storage: '256GB' },
  price: '499.99',
});

// Styles will inject when component renders in browser
```

## Migration Notes

### v2.0.0 Breaking Changes

- **CSS Import Removed**: No longer need to import CSS files
- The `onReserve` prop has been renamed to `onClick` for consistency
  - Legacy code using `onReserve` will continue to work but shows deprecation warning

### Migration from CSS Import Version

```javascript
// BEFORE (v1.x)
import ProductCard from './ProductCard.js';
import './ProductCard.css'; // ❌ Remove this line

// AFTER (v2.x)
import ProductCard from './ProductCard.js'; // ✅ Styles inject automatically
```

## Performance Considerations

- **First Usage**: ~1ms overhead for style injection
- **Subsequent Usage**: 0ms overhead (styles cached)
- **Bundle Size**: No change (styles embedded as JS strings)
- **Memory**: Minimal impact (one `<style>` tag per component type)

## Browser Support

- All modern browsers (ES2020+)
- SSR environments (Node.js)
- Build tools (Webpack, Vite, etc.)
- No configuration required

## Accessibility Features

The ProductCard component implements these accessibility features:

- Semantic HTML structure with proper headings
- Structured product specifications list
- Accessible button for actions
- Appropriate text contrast ratios
- Keyboard focusable elements
- Screen reader friendly markup

## Development

### Testing

Styles are automatically injected during testing:

```javascript
import { ProductCard } from './ProductCard.js';

// Styles inject automatically in tests
const card = ProductCard({
  /* props */
});
expect(card.getElement()).toBeInTheDocument();
```

### Debugging

Enable style injection debugging:

```javascript
// Check if styles were injected
const styleElement = document.querySelector('[data-svarog="productcard"]');
console.log('ProductCard styles injected:', !!styleElement);
```
