# ProductCard Component

The ProductCard component provides a customizable card for displaying product information with image, specifications, price, and a reserve/buy button. **Styles are automatically injected when the component is used - no CSS imports required.**

## Features

✅ **Zero Configuration** - Just import and use, styles inject automatically
✅ **SSR Compatible** - Styles inject safely in browser only
✅ **Performance Optimized** - Styles are cached and deduped
✅ **Theme Aware** - Responds to theme changes automatically
✅ **Accessible** - Semantic HTML with proper ARIA attributes
✅ **Image Component Integration** - Uses the Image component for advanced image handling
✅ **PriceDisplay Integration** - Professional price presentation with loading states
✅ **Price Info Support** - Display additional price information (tax, shipping, etc.)

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
  priceInfo: 'inkl. MwSt.',
  onClick: () => console.log('Product reserved'),
});

// Add to DOM
document.body.appendChild(productCard.getElement());
```

## Props

| Prop             | Type           | Default    | Description                                 |
| ---------------- | -------------- | ---------- | ------------------------------------------- |
| imageUrl         | string         | (Required) | URL to the product image                    |
| fallbackImageUrl | string         | undefined  | Fallback image URL if primary fails         |
| title            | string         | (Required) | Product title                               |
| productData      | Object         | (Required) | Key-value pairs of product specifications   |
| price            | string\|number | (Required) | Product price                               |
| currency         | string         | '€'        | Currency symbol                             |
| buttonText       | string         | 'Reserve'  | Text for the reserve/buy button             |
| onClick          | Function       | () => {}   | Callback function when button is clicked    |
| onReserve        | Function       | -          | DEPRECATED: Use onClick instead             |
| className        | string         | ''         | Additional CSS classes                      |
| loading          | boolean        | false      | Whether price is loading                    |
| priceHighlighted | boolean        | false      | Whether price should be highlighted         |
| priceInfo        | string         | undefined  | Additional price info (e.g., "inkl. MwSt.") |

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
  priceInfo: 'inkl. 19% MwSt.',
  buttonText: 'Buy Now',
  onClick: () => console.log('Changed callback'),
});
```

### destroy()

Cleans up resources including sub-components. Call when removing the product card.

```javascript
productCard.destroy();
```

### setPriceLoading(isLoading)

Sets the loading state for the price display.

```javascript
// Show loading spinner for price
productCard.setPriceLoading(true);

// Hide loading spinner
productCard.setPriceLoading(false);
```

### setPrice(newPrice, isHighlighted)

Updates the price value dynamically.

```javascript
// Update price
productCard.setPrice('599.99');

// Update price with highlight
productCard.setPrice('499.99', true);
```

### setPriceInfo(newPriceInfo)

Updates the price info text dynamically.

```javascript
// Update price info
productCard.setPriceInfo('inkl. MwSt. + kostenloser Versand');

// Remove price info
productCard.setPriceInfo('');
```

## Image Handling

The ProductCard now uses the Image component internally, providing:

- **Lazy Loading**: Native browser lazy loading support
- **Fallback Support**: Graceful degradation if the primary image fails
- **Responsive Images**: Automatic responsive behavior
- **Alt Text**: Product title is used as alt text automatically

### With Fallback Image

```javascript
const productCard = ProductCard({
  imageUrl: 'https://example.com/phone.jpg',
  fallbackImageUrl: 'https://example.com/placeholder.jpg',
  title: 'iPhone 13 Pro',
  productData: {
    /* ... */
  },
  price: '699.99',
  priceInfo: 'inkl. MwSt.',
});
```

## Price Display

The ProductCard now uses the PriceDisplay component internally, providing:

- **Loading States**: Show spinner while price loads
- **Highlighting**: Emphasize special prices (sales, discounts)
- **Error Handling**: Graceful error display
- **Consistent Styling**: Matches other price displays in your app
- **Price Info**: Additional information below the price

### Price States Example

```javascript
// Loading state
const card = ProductCard({
  // ... other props
  price: 'Loading...',
  loading: true,
  priceInfo: 'Final price',
});

// Highlighted price (e.g., sale)
const saleCard = ProductCard({
  // ... other props
  price: '499.99',
  priceHighlighted: true,
  priceInfo: 'inkl. MwSt. - Sonderangebot',
});
```

### Price Info Examples

```javascript
// Tax information
ProductCard({
  // ... other props
  price: '699.99',
  priceInfo: 'inkl. 19% MwSt.',
});

// Shipping information
ProductCard({
  // ... other props
  price: '449.99',
  priceInfo: '+ Versandkosten',
});

// Multiple information
ProductCard({
  // ... other props
  price: '299.99',
  priceInfo: 'inkl. MwSt. + kostenloser Versand',
});

// VAT exclusive pricing
ProductCard({
  // ... other props
  price: '499.99',
  currency: '$',
  priceInfo: 'Excl. VAT',
});
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
  --color-text-secondary: #6b7280;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f8f9fa;

  /* Typography */
  --font-size-sm: 14px;
  --font-size-xl: 1.25rem;
  --font-weight-medium: 500;
}

/* Theme-specific overrides */
.muchandy-theme {
  --color-primary: #ff5722;
  --color-text-light: #757575;
  --color-text-secondary: #737373;
}

/* Custom overrides for ProductCard */
.product-card {
  /* Your custom styles here */
}

/* Custom image styling */
.product-card__image .image-element {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Price display customization (via PriceDisplay component) */
.product-card__price-display .price-display__value {
  /* Custom price styling */
  font-size: 1.5rem;
  color: #0066cc;
}

/* Price info customization */
.product-card__price-info {
  font-style: italic;
  color: #555;
}
```

## Architecture

The ProductCard follows the CSS injection pattern for optimal compatibility:

- **Automatic Style Injection**: Styles inject when component is first used
- **Performance Optimized**: Styles are cached and only injected once
- **SSR Safe**: No issues in Node.js environments
- **Zero Dependencies**: No separate CSS files to import
- **Component Composition**: Uses Image, Card, Button, Typography, and PriceDisplay components

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

### Dependencies

The ProductCard component internally uses:

- **Card**: For the base card structure
- **Image**: For product image display with fallback support
- **Button**: For the reserve/buy action
- **Typography**: For text elements including price info
- **PriceDisplay**: For price presentation with loading states

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

### With Price Information

```javascript
const cardWithTax = ProductCard({
  imageUrl: 'https://example.com/phone.jpg',
  title: 'iPhone 13 Pro',
  productData: {
    Storage: '128GB',
    Color: 'Graphite',
  },
  price: '699.99',
  priceInfo: 'inkl. 19% MwSt.',
  onClick: () => console.log('Product reserved'),
});
```

### With Fallback Image

```javascript
const cardWithFallback = ProductCard({
  imageUrl: 'https://example.com/phone.jpg',
  fallbackImageUrl: 'https://example.com/placeholder.jpg',
  title: 'iPhone 13 Pro',
  productData: {
    Storage: '128GB',
    Color: 'Graphite',
  },
  price: '699.99',
  priceInfo: 'inkl. MwSt.',
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
  priceInfo: 'Excl. VAT',
  buttonText: 'Buy Now',
  onClick: () => console.log('Product purchased'),
});
```

### With Loading Price

```javascript
const loadingCard = ProductCard({
  imageUrl: 'https://example.com/phone.jpg',
  title: 'iPhone 13 Pro',
  productData: {
    Storage: '128GB',
    Color: 'Graphite',
  },
  price: 'Loading...',
  loading: true, // Shows loading spinner for price
  priceInfo: 'Final price',
  buttonText: 'Reserve',
  onClick: () => console.log('Product reserved'),
});

// Later update the price
setTimeout(() => {
  loadingCard.setPriceLoading(false);
  loadingCard.setPrice('699.99', true); // With highlight
  loadingCard.setPriceInfo('inkl. MwSt. - Sonderpreis!');
}, 2000);
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
    fallbackImageUrl: '/images/product-placeholder.jpg',
    title: product.name,
    productData: product.specs,
    price: product.price,
    priceInfo: product.includesTax ? 'inkl. MwSt.' : 'zzgl. MwSt.',
    onClick: () => handleReserve(product.id),
  });

  grid.appendChild(card.getElement());
});

// Add grid to DOM
document.body.appendChild(grid);
```

### Dynamic Price Updates

```javascript
const productCard = ProductCard({
  imageUrl: 'https://example.com/phone.jpg',
  title: 'iPhone 13 Pro',
  productData: {
    Storage: '128GB',
    Color: 'Graphite',
  },
  price: '0.00',
  priceInfo: 'Berechne Preis...',
  loading: true,
});

document.body.appendChild(productCard.getElement());

// Simulate fetching price from API
async function fetchPrice() {
  productCard.setPriceLoading(true);
  productCard.setPriceInfo('Berechne Preis...');

  try {
    const response = await fetch('/api/products/price');
    const data = await response.json();

    productCard.setPriceLoading(false);
    productCard.setPrice(data.price, data.isOnSale);
    productCard.setPriceInfo(data.includesTax ? 'inkl. MwSt.' : 'zzgl. MwSt.');
  } catch (error) {
    productCard.setPriceLoading(false);
    productCard.setPrice('Error', false);
    productCard.setPriceInfo('Preis nicht verfügbar');
  }
}

fetchPrice();
```

### Working with Node.js/SSR

The component works perfectly in Node.js environments:

```javascript
// This works without CSS import errors
import { ProductCard } from 'svarog-ui';

// Component can be created and configured server-side
const card = ProductCard({
  imageUrl: 'https://example.com/phone.jpg',
  title: 'Server-side Product',
  productData: { Storage: '256GB' },
  price: '499.99',
  priceInfo: 'inkl. MwSt.',
});

// Styles will inject when component renders in browser
```

## Migration Notes

### v2.3.0 Updates

- **New Prop**: Added `priceInfo` prop for displaying additional price information
- **New Method**: Added `setPriceInfo()` for dynamic price info updates
- **Typography Integration**: Price info uses Typography component with caption variant
- **Styling**: Price info appears below the price with appropriate spacing

### v2.2.0 Updates

- **PriceDisplay Integration**: ProductCard now uses the PriceDisplay component for prices
- **New Props**: Added `loading` and `priceHighlighted` props
- **New Methods**: Added `setPriceLoading()` and `setPrice()` for dynamic updates
- **Better Loading States**: Price can show loading spinner while data fetches
- **Consistent Styling**: Price display matches other price components in the system

### v2.1.0 Updates

- **Image Component Integration**: ProductCard now uses the Image component internally
- **New Prop**: Added `fallbackImageUrl` for fallback image support
- **Better Error Handling**: Images gracefully fall back when loading fails
- **Improved Performance**: Leverages Image component's lazy loading

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
- **Image Loading**: Lazy loading enabled through Image component
- **Price Updates**: Efficient partial DOM updates through PriceDisplay

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
- Product images include alt text (uses product title)
- Price information is properly associated with the price

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

// Check if Image component is used
const imageContainer = card.getElement().querySelector('.product-card__image');
console.log('Image component present:', !!imageContainer);

// Check if PriceDisplay component is used
const priceDisplay = card
  .getElement()
  .querySelector('.product-card__price-display');
console.log('PriceDisplay component present:', !!priceDisplay);

// Check if price info is rendered
const priceInfo = card.getElement().querySelector('.product-card__price-info');
console.log('Price info present:', !!priceInfo);
```

---

_This component is part of the Svarog UI library, providing enterprise-quality components to small and medium businesses._
