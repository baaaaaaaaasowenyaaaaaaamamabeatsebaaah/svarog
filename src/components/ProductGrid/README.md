# ProductGrid Component

The ProductGrid component provides a smart, responsive grid layout for products with smooth loading animations, lazy loading, skeleton states, and tag-based filtering. **Styles are automatically injected - no CSS imports required.**

## Features

✅ **Smart Loading** - Smooth animations and skeleton loaders
✅ **Lazy Loading** - Infinite scroll with Intersection Observer
✅ **Tag Filtering** - Filter products by tags with smooth transitions
✅ **Skeleton States** - Beautiful loading placeholders
✅ **Responsive Design** - Configurable columns for all screen sizes
✅ **Performance Optimized** - Virtual scrolling for large datasets
✅ **Zero Configuration** - Works out of the box
✅ **Theme Aware** - Adapts to light/dark themes automatically

## Usage

```javascript
import { ProductGrid } from '@svarog-ui/core';

// Basic usage
const grid = ProductGrid({
  products: [
    {
      id: 'p1',
      imageUrl: 'phone1.jpg',
      title: 'iPhone 13',
      productData: {
        Storage: '128GB',
        Color: 'Blue',
      },
      price: '699',
      tags: ['Premium', '5G'],
    },
    // ... more products
  ],
  onProductClick: (product, index) => {
    console.log('Clicked:', product);
  },
});

document.body.appendChild(grid.getElement());
```

## Props

| Prop                 | Type     | Default  | Description                              |
| -------------------- | -------- | -------- | ---------------------------------------- |
| products             | Array    | []       | Array of product objects                 |
| columnsDesktop       | number   | 4        | Number of columns on desktop (≥1024px)   |
| columnsTablet        | number   | 2        | Number of columns on tablet (768-1023px) |
| columnsMobile        | number   | 1        | Number of columns on mobile (<768px)     |
| onProductClick       | Function | null     | Callback when product is clicked         |
| enableFiltering      | boolean  | true     | Enable tag-based filtering               |
| enableLazyLoad       | boolean  | true     | Enable infinite scroll                   |
| initialLoadCount     | number   | 8        | Products to load initially               |
| loadMoreCount        | number   | 8        | Products to load on scroll               |
| className            | string   | ''       | Additional CSS classes                   |
| gap                  | string   | '1.5rem' | Grid gap spacing                         |
| showLoadingSkeletons | boolean  | true     | Show skeleton loaders                    |
| skeletonCount        | number   | 8        | Number of skeletons to show              |

## Product Object Structure

```javascript
{
  id: 'unique-id',              // Unique identifier
  imageUrl: 'image.jpg',        // Product image URL
  fallbackImageUrl: 'fallback.jpg', // Optional fallback image
  title: 'Product Name',        // Product title
  productData: {                // Key-value specifications
    Storage: '128GB',
    Color: 'Black',
    // ... any other specs
  },
  price: '299.99',              // Product price
  currency: '€',                // Optional currency symbol
  priceInfo: 'inkl. MwSt.',     // Optional price info
  buttonText: 'Reserve',        // Optional button text
  loading: false,               // Price loading state
  priceHighlighted: false,      // Highlight price
  tags: ['Tag1', 'Tag2'],       // Tags for filtering
}
```

## Methods

### getElement()

Returns the grid container element.

```javascript
const element = grid.getElement();
```

### updateProducts(products)

Replace all products with a new array.

```javascript
grid.updateProducts(newProductArray);
```

### addProducts(products)

Add products to the existing list.

```javascript
grid.addProducts([{ id: 'p3', title: 'New Product' /* ... */ }]);
```

### updateProduct(productId, updates)

Update a specific product's properties.

```javascript
grid.updateProduct('p1', {
  price: '599.99',
  priceHighlighted: true,
  priceInfo: 'SALE!',
});
```

### getActiveFilters()

Get currently active tag filters.

```javascript
const activeTags = grid.getActiveFilters(); // ['Premium', '5G']
```

### setActiveFilters(tags)

Programmatically set active filters.

```javascript
grid.setActiveFilters(['Budget', 'Refurbished']);
```

### destroy()

Clean up resources and event listeners.

```javascript
grid.destroy();
```

## Examples

### Basic Grid

```javascript
const products = [
  {
    id: '1',
    imageUrl: 'phone1.jpg',
    title: 'iPhone 13',
    productData: { Storage: '128GB', Color: 'Blue' },
    price: '699',
  },
  // ... more products
];

const grid = ProductGrid({
  products,
  onProductClick: (product) => {
    window.location.href = `/products/${product.id}`;
  },
});
```

### With Tag Filtering

```javascript
const products = [
  {
    id: '1',
    title: 'iPhone 13',
    tags: ['Premium', '5G', 'iOS'],
    // ... other props
  },
  {
    id: '2',
    title: 'Galaxy S21',
    tags: ['Premium', '5G', 'Android'],
    // ... other props
  },
];

const grid = ProductGrid({
  products,
  enableFiltering: true,
  onProductClick: (product) => {
    console.log('Selected:', product.title);
    console.log('Tags:', product.tags);
  },
});
```

### Custom Column Layout

```javascript
const grid = ProductGrid({
  products: productArray,
  columnsDesktop: 5, // 5 columns on desktop
  columnsTablet: 3, // 3 columns on tablet
  columnsMobile: 2, // 2 columns on mobile
  gap: '1rem', // Smaller gap
});
```

### With Initial Loading State

```javascript
// Start with empty products to show skeletons
const grid = ProductGrid({
  products: [],
  showLoadingSkeletons: true,
  skeletonCount: 12,
});

// Load products asynchronously
fetch('/api/products')
  .then((res) => res.json())
  .then((products) => {
    grid.updateProducts(products);
  });
```

### Infinite Scroll Configuration

```javascript
const grid = ProductGrid({
  products: largeProductArray, // e.g., 100+ products
  enableLazyLoad: true,
  initialLoadCount: 12, // Show 12 initially
  loadMoreCount: 12, // Load 12 more each time
  onProductClick: (product, index) => {
    console.log(`Product ${index}:`, product);
  },
});
```

### Programmatic Filter Control

```javascript
const grid = ProductGrid({
  products: productArray,
  enableFiltering: true,
});

// Filter buttons outside the grid
document.getElementById('premiumBtn').onclick = () => {
  grid.setActiveFilters(['Premium']);
};

document.getElementById('budgetBtn').onclick = () => {
  grid.setActiveFilters(['Budget']);
};

document.getElementById('allBtn').onclick = () => {
  grid.setActiveFilters([]); // Show all
};
```

### Dynamic Price Updates

```javascript
const grid = ProductGrid({ products });

// Update prices from real-time API
const socket = new WebSocket('ws://price-updates');
socket.onmessage = (event) => {
  const { productId, newPrice, isOnSale } = JSON.parse(event.data);

  grid.updateProduct(productId, {
    price: newPrice,
    priceHighlighted: isOnSale,
    priceInfo: isOnSale ? 'LIMITED OFFER!' : null,
  });
};
```

## Styling

The component automatically injects all required styles. You can customize appearance using CSS variables:

```css
:root {
  /* Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-primary: #0066cc;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}

/* Dark theme automatically supported */
@media (prefers-color-scheme: dark) {
  /* Component adapts automatically */
}
```

## Performance

The ProductGrid is optimized for large datasets:

- **Lazy Loading**: Only loads visible products
- **Virtual Scrolling**: Efficient DOM management
- **Skeleton States**: Perceived performance improvement
- **Smart Animations**: GPU-accelerated transitions
- **Component Reuse**: Efficient memory usage

### Performance Tips

1. **Use IDs**: Always provide unique `id` for products
2. **Optimize Images**: Use appropriate image sizes
3. **Limit Initial Load**: Start with 8-12 products
4. **Progressive Enhancement**: Load more as needed

## Accessibility

- Semantic HTML structure
- Keyboard navigation for filters
- ARIA labels for loading states
- Screen reader announcements
- Focus management

## Browser Support

- Modern browsers with ES2020 support
- IntersectionObserver API required for lazy loading
- Graceful degradation for older browsers

## Migration Notes

This is a new component in v2.4.0 with no breaking changes.

---

_This component is part of the Svarog UI library, providing enterprise-quality components to small and medium businesses._
