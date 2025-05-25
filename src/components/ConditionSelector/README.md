# ConditionSelector Component

The ConditionSelector component provides a user interface for selecting from a list of condition options, typically used in e-commerce scenarios where product condition is a factor. The component automatically injects its styles using modern CSS injection patterns.

## Features

- **Automatic Style Injection**: Styles are automatically injected when the component is first rendered
- **SSR Compatible**: Works safely in server-side rendering environments
- **Accessibility**: Full keyboard navigation and screen reader support
- **Legacy Props Support**: Maintains backward compatibility with deprecated props
- **Loading States**: Visual feedback during async operations
- **Theme Awareness**: Automatically responds to theme changes

## Usage

```javascript
import { ConditionSelector } from '@svarog-ui/core';

// Create a condition selector with options
const conditionSelector = ConditionSelector({
  conditions: [
    {
      id: 1,
      name: 'New',
      description: 'Device is brand new with no signs of wear',
    },
    {
      id: 2,
      name: 'Good',
      description: 'Minor signs of wear but fully functional',
    },
    { id: 3, name: 'Fair', description: 'Visible signs of use but works well' },
  ],
  onChange: (conditionId) => console.log('Selected:', conditionId),
});

// Add to DOM
document.body.appendChild(conditionSelector.getElement());
```

## Props

| Prop       | Type     | Default | Description                                                          |
| ---------- | -------- | ------- | -------------------------------------------------------------------- |
| conditions | Array    | []      | Array of condition objects with id, name, and description properties |
| onChange   | Function | null    | Callback function that receives the selected condition id            |
| selectedId | String   | ''      | ID of the initially selected condition                               |
| loading    | Boolean  | false   | Whether the component is in a loading state                          |
| className  | String   | ''      | Additional CSS classes to apply to the component                     |

## Deprecated Props

| Deprecated Prop | Use Instead | Migration Notes                          |
| --------------- | ----------- | ---------------------------------------- |
| onSelect        | onChange    | Automatic migration with console warning |
| isLoading       | loading     | Automatic migration with console warning |

## Condition Object Structure

Each condition in the `conditions` array should have this structure:

```javascript
{
  id: Number or String,   // Unique identifier
  name: String,           // Display name
  description: String     // Optional description
}
```

## Methods

### getElement()

Returns the condition selector DOM element.

```javascript
const selectorElement = conditionSelector.getElement();
```

### setLoading(isLoading)

Updates the loading state of the component.

```javascript
conditionSelector.setLoading(true); // Enable loading state
conditionSelector.setLoading(false); // Disable loading state
```

### updateConditions(conditions, selectedId)

Updates the list of conditions and optionally sets a selected condition.

```javascript
conditionSelector.updateConditions(
  [
    { id: 1, name: 'Excellent', description: 'Like new condition' },
    { id: 2, name: 'Good', description: 'Some wear but works perfectly' },
  ],
  '1'
);
```

### setSelectedCondition(conditionId)

Updates which condition is selected.

```javascript
conditionSelector.setSelectedCondition(2); // Select condition with ID 2
```

### update(props)

Updates multiple component properties at once.

```javascript
conditionSelector.update({
  conditions: newConditions,
  selectedId: '3',
  loading: false,
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the component.

```javascript
conditionSelector.destroy();
```

## Styling

### Automatic Style Injection

The component automatically injects its styles when first rendered. No separate CSS imports are needed.

### CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;

  /* Colors */
  --color-bg: #ffffff;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-brand-secondary: #3b82f6;
  --color-text-light: #6b7280;

  /* Typography */
  --font-size-base: 1rem;
  --font-size-sm: 0.875rem;
  --font-size-xl: 1.25rem;
  --font-weight-bold: 600;
}
```

### Custom Styling

Apply custom styles by targeting the component's CSS classes:

```css
/* Custom styling example */
.my-condition-selector .condition-option__label {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.my-condition-selector .condition-option--selected .condition-option__label {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

## Accessibility Features

- **Radio Button Semantics**: Uses proper radio button implementation for single selection
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indication and management
- **Loading State Indication**: Screen reader announcements for loading states

## Browser Compatibility

- Works in all modern browsers
- SSR compatible (no CSS import errors in Node.js)
- Falls back gracefully if JavaScript is disabled

## Examples

### Basic Condition Selector

```javascript
const conditions = [
  { id: 1, name: 'New', description: 'Brand new, in original packaging' },
  { id: 2, name: 'Like New', description: 'Open box, never used' },
  { id: 3, name: 'Good', description: 'Used with minor signs of wear' },
  { id: 4, name: 'Fair', description: 'Noticeable wear but fully functional' },
];

const selector = ConditionSelector({
  conditions,
  onChange: (id) => console.log(`Selected condition: ${id}`),
});
```

### With Pre-selected Condition

```javascript
const selector = ConditionSelector({
  conditions,
  selectedId: '2', // 'Like New' is pre-selected
  onChange: (id) => console.log(`Changed selection to: ${id}`),
});
```

### Loading State

```javascript
const selector = ConditionSelector({
  conditions,
  loading: true, // Show loading state
});

// Later, when data is ready:
selector.setLoading(false);
```

### Dynamic Updates

```javascript
// Create selector with initial conditions
const selector = ConditionSelector({
  conditions: initialConditions,
  onChange: handleConditionChange,
});

// Later, update with new conditions
selector.updateConditions(newConditions, '3');

// Or update just the selection
selector.setSelectedCondition('2');
```

### Custom Styling

```javascript
const selector = ConditionSelector({
  conditions,
  className: 'my-custom-selector',
  onChange: handleSelection,
});

// Add custom styles
const style = document.createElement('style');
style.textContent = `
  .my-custom-selector .condition-option__label {
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .my-custom-selector .condition-option:hover .condition-option__label {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;
document.head.appendChild(style);
```

## Migration from Previous Versions

### Legacy Props

The component automatically migrates legacy props:

```javascript
// Old way (still works with warnings)
const selector = ConditionSelector({
  conditions,
  onSelect: handleSelection, // Migrated to onChange
  isLoading: true, // Migrated to loading
});

// New way (recommended)
const selector = ConditionSelector({
  conditions,
  onChange: handleSelection,
  loading: true,
});
```

### CSS Import Removal

If upgrading from a version that required CSS imports:

```javascript
// Remove this line:
// import 'svarog-ui/dist/ConditionSelector.css';

// Just import the component - styles are automatic:
import { ConditionSelector } from 'svarog-ui';
```

## Performance

- **Lazy Style Injection**: Styles are only injected when component is first used
- **Style Deduplication**: Multiple instances share the same stylesheet
- **Memory Management**: Proper cleanup of event listeners and references
- **Optimized Rendering**: Minimal DOM updates on prop changes

## Testing

The component includes comprehensive test coverage and provides testing utilities:

```javascript
import { describe, it, expect, vi } from 'vitest';
import ConditionSelector from './ConditionSelector.js';

describe('ConditionSelector', () => {
  it('should inject styles automatically', () => {
    const selector = ConditionSelector({ conditions: [] });
    selector.getElement(); // Triggers style injection

    const injectedStyle = document.querySelector(
      '[data-svarog="conditionselector"]'
    );
    expect(injectedStyle).toBeTruthy();
  });
});
```
