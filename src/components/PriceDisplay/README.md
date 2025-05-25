# PriceDisplay Component

The PriceDisplay component displays price information with various states such as loading, error, and highlighted. This component uses CSS injection for styling, eliminating the need for separate CSS imports.

## Features

✅ **Zero CSS Import Errors** - Styles are automatically injected  
✅ **SSR Compatible** - Safe for server-side rendering  
✅ **Tree Shakeable** - Only loads when component is used  
✅ **Performance Optimized** - Styles are cached and deduped  
✅ **Modern Architecture** - Uses CSS injection pattern

## Usage

```javascript
import { PriceDisplay } from '@svarog-ui/core';

// Create a basic price display
const myPriceDisplay = PriceDisplay({
  label: 'Price:',
  value: '€29.99',
});

// Add to DOM
document.body.appendChild(myPriceDisplay.getElement());
```

## Props

| Prop          | Type    | Default | Description                             |
| ------------- | ------- | ------- | --------------------------------------- |
| label         | string  | ""      | Label text for the price (required)     |
| value         | string  | ""      | Initial price value text                |
| loading       | boolean | false   | Whether the price is loading            |
| isLoading     | boolean | false   | DEPRECATED: Use `loading` instead       |
| isHighlighted | boolean | false   | Whether to highlight the price display  |
| isPlaceholder | boolean | false   | Whether the value is a placeholder/hint |
| isError       | boolean | false   | Whether displaying an error             |
| className     | string  | ""      | Additional CSS classes                  |

## Methods

### getElement()

Returns the price display DOM element.

```javascript
const priceElement = myPriceDisplay.getElement();
```

### setValue(value, isHighlighted, isPlaceholder)

Updates the price value.

```javascript
myPriceDisplay.setValue('€49.99', true, false);
```

### setLoading(isLoading)

Sets the loading state.

```javascript
myPriceDisplay.setLoading(true); // Show loading indicator
myPriceDisplay.setLoading(false); // Hide loading indicator
```

### setPlaceholder(isPlaceholder)

Sets the placeholder state.

```javascript
myPriceDisplay.setPlaceholder(true); // Mark as placeholder
myPriceDisplay.setPlaceholder(false); // Unmark placeholder
```

### setError(errorMessage)

Sets the error state and displays an error message.

```javascript
myPriceDisplay.setError('Could not retrieve price');
```

### update(props)

Updates multiple component properties at once.

```javascript
myPriceDisplay.update({
  value: '€39.99',
  isHighlighted: true,
  className: 'custom-class',
  loading: false,
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the component.

```javascript
myPriceDisplay.destroy();
```

## Examples

### Basic Price Display

```javascript
const regularPrice = PriceDisplay({
  label: 'Regular Price:',
  value: '€99.99',
});
```

### Loading State

```javascript
const loadingPrice = PriceDisplay({
  label: 'Price:',
  value: 'Loading...',
  loading: true,
});
```

### Highlighted Price

```javascript
const salePrice = PriceDisplay({
  label: 'Sale Price:',
  value: '€79.99',
  isHighlighted: true,
});
```

### Error State

```javascript
const errorPrice = PriceDisplay({
  label: 'Price:',
  value: 'Error loading price',
  isError: true,
});
```

### Dynamic Updates

```javascript
const priceDisplay = PriceDisplay({
  label: 'Price:',
  value: 'Select options to see price',
  isPlaceholder: true,
});

// Later, show loading state
priceDisplay.setLoading(true);
priceDisplay.setValue('Loading price...');

// Then update with final price
setTimeout(() => {
  priceDisplay.setLoading(false);
  priceDisplay.setValue('€49.99', true);
}, 1500);
```

## CSS Customization

Price display styles are automatically injected and can be customized using CSS variables:

```css
:root {
  --price-display-bg: transparent;
  --price-display-border: #eaeaea;
  --price-display-color: #333;
  --color-text: #333;
  --color-text-light: #666;
  --font-weight-bold: 700;
  --font-size-xs: 0.75rem;
  --font-size-2xl: 1.5rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --color-danger: #dc3545;
  --color-brand-secondary-light: #4a90e2;
}
```

## Architecture

This component follows the Unified Vanilla JavaScript Development Principles:

- **CSS Injection**: Styles are automatically injected when the component is used
- **Factory Pattern**: Component created via factory function
- **Prop Normalization**: Handles both new and legacy prop names
- **Performance Optimized**: Efficient DOM updates with partial rendering
- **Theme Aware**: Responds to theme changes
- **Memory Safe**: Proper cleanup on destroy

## Migration from CSS Imports

If upgrading from a version that used CSS imports:

1. **Remove CSS import**: No need to import `PriceDisplay.css` anymore
2. **No API changes**: All component methods and props remain the same
3. **Automatic styling**: Styles are now injected automatically

```javascript
// OLD (no longer needed)
import './PriceDisplay.css';
import { PriceDisplay } from '@svarog-ui/core';

// NEW (styles auto-injected)
import { PriceDisplay } from '@svarog-ui/core';
```

## Browser Compatibility

- Modern browsers supporting ES2024+ features
- SSR environments (Node.js)
- Bundle environments (Webpack, Vite, etc.)
- No external dependencies required

## Performance Notes

- Styles are injected once per component type (not per instance)
- Automatic deduplication prevents style conflicts
- Minimal DOM manipulation with efficient partial updates
- Memory usage optimized with proper cleanup

## Troubleshooting

**Issue: Styles not appearing**

- Styles are automatically injected - no additional setup required
- Check browser dev tools for `<style>` tags with `data-svarog="pricedisplay"`

**Issue: Legacy prop warnings**

- Update `isLoading` to `loading` prop to remove deprecation warnings
- Both props are supported for backward compatibility

**Issue: Theme not applying**

- Ensure CSS variables are defined in your theme
- Check that theme is properly initialized before component creation
