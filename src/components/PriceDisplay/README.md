# PriceDisplay Component

The PriceDisplay component displays price information with various states such as loading, error, and highlighted.

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

Price display styles can be customized using CSS variables:

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
