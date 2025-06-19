# ConditionSelector Component

The ConditionSelector component provides a user interface for selecting from a list of condition options, typically used in e-commerce scenarios where product condition is a factor. The component automatically injects its styles using modern CSS injection patterns.

## Features

- **Automatic Style Injection**: Styles are automatically injected when the component is first rendered
- **SSR Compatible**: Works safely in server-side rendering environments
- **Accessibility**: Full keyboard navigation and screen reader support
- **Legacy Props Support**: Maintains backward compatibility with deprecated props
- **Loading States**: Visual feedback during async operations
- **Theme Awareness**: Automatically responds to theme changes
- **Flexible Icons**: Support for emoji, SVG, and image icons with automatic fallbacks
- **Icon Toggle**: Option to show or hide icons entirely
- **Image Component Integration**: Uses Svarog's Image component for robust image handling

## Usage

```javascript
import { ConditionSelector } from '@svarog-ui/core';

// Create a condition selector with default icons
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
  ],
  onChange: (conditionId) => console.log('Selected:', conditionId),
});

// Add to DOM
document.body.appendChild(conditionSelector.getElement());
```

## Props

| Prop       | Type     | Default | Description                                                       |
| ---------- | -------- | ------- | ----------------------------------------------------------------- |
| conditions | Array    | []      | Array of condition objects with id, name, and optional properties |
| onChange   | Function | null    | Callback function that receives the selected condition id         |
| selectedId | String   | ''      | ID of the initially selected condition                            |
| loading    | Boolean  | false   | Whether the component is in a loading state                       |
| showIcons  | Boolean  | true    | Whether to show icons for conditions                              |
| className  | String   | ''      | Additional CSS classes to apply to the component                  |

## Deprecated Props

| Deprecated Prop | Use Instead | Migration Notes                          |
| --------------- | ----------- | ---------------------------------------- |
| onSelect        | onChange    | Automatic migration with console warning |
| isLoading       | loading     | Automatic migration with console warning |

## Condition Object Structure

Each condition in the `conditions` array should have this structure:

```javascript
{
  id: Number or String,      // Unique identifier (required)
  name: String,              // Display name (required)
  description: String,       // Optional description
  icon: String,              // Optional custom emoji/text icon
  imageUrl: String,          // Optional image URL for icon
  svgIcon: String            // Optional SVG markup for icon
}
```

### Icon Priority

Icons are displayed based on the following priority:

1. `imageUrl` - If provided, displays an image using the Image component
2. `svgIcon` - If provided, renders SVG markup
3. `icon` - If provided, displays text/emoji
4. Default icons based on condition name (if none above provided)

### Default Icon Mapping

When no custom icon is provided, the component uses these defaults based on the condition name:

- Names containing "new" or "neu" → ✨
- Names containing "good" or "gut" → 👍
- Names containing "fair" or "akzeptabel" → 👌
- Names containing "poor" or "schlecht" → 🔧
- All other names → 📱

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

### setShowIcons(show)

Toggle the visibility of icons.

```javascript
conditionSelector.setShowIcons(false); // Hide all icons
conditionSelector.setShowIcons(true); // Show icons again
```

### update(props)

Updates multiple component properties at once.

```javascript
conditionSelector.update({
  conditions: newConditions,
  selectedId: '3',
  loading: false,
  showIcons: true,
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the component.

```javascript
conditionSelector.destroy();
```

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

### With Custom Icons

```javascript
const conditionsWithIcons = [
  {
    id: 1,
    name: 'Premium',
    description: 'Top quality',
    icon: '💎', // Emoji icon
  },
  {
    id: 2,
    name: 'Standard',
    description: 'Regular quality',
    svgIcon: '<svg viewBox="0 0 24 24">...</svg>', // SVG icon
  },
  {
    id: 3,
    name: 'Budget',
    description: 'Economic option',
    imageUrl: 'https://picsum.photos/28/28?random=1', // Image icon
  },
];

const selector = ConditionSelector({
  conditions: conditionsWithIcons,
  onChange: handleSelection,
});
```

### Without Icons

```javascript
const selector = ConditionSelector({
  conditions,
  showIcons: false, // No icons will be displayed
  onChange: handleSelection,
});
```

### Dynamic Icon Toggle

```javascript
// Create selector with icons
const selector = ConditionSelector({
  conditions,
  showIcons: true,
  onChange: handleSelection,
});

// Later, hide icons based on user preference
selector.setShowIcons(false);

// Show them again
selector.setShowIcons(true);
```

### Mixed Icon Types

```javascript
const mixedConditions = [
  {
    id: 1,
    name: 'New',
    // No icon specified - will use default ✨
  },
  {
    id: 2,
    name: 'Certified',
    icon: '✓', // Text icon
  },
  {
    id: 3,
    name: 'Warranty',
    svgIcon: '<svg>...</svg>', // SVG markup
  },
  {
    id: 4,
    name: 'Special',
    imageUrl: 'https://picsum.photos/28/28?random=2', // Image URL
  },
];
```

## Styling

### CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.25rem;

  /* Colors */
  --color-bg: #ffffff;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-brand-secondary: #3b82f6;
  --color-text-light: #6b7280;

  /* Typography */
  --font-size-base: 1rem;
  --font-size-sm: 0.875rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-weight-bold: 600;
}
```

### Custom Styling

Apply custom styles by targeting the component's CSS classes:

```css
/* Custom icon styling */
.my-condition-selector .condition-option__icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f3f4f6;
}

/* Custom selected state */
.my-condition-selector .condition-option--selected .condition-option__icon {
  background-color: #3b82f6;
  color: white;
}

/* Style for no-icon mode */
.my-condition-selector.condition-selector--no-icons .condition-option__label {
  padding-left: 24px;
}

/* Custom image icon styling */
.my-condition-selector .condition-option__icon-image {
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
```

## Accessibility Features

- **Radio Button Semantics**: Uses proper radio button implementation for single selection
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indication and management
- **Loading State Indication**: Screen reader announcements for loading states
- **Icon Accessibility**: Icons marked as decorative with `aria-hidden="true"`

## Performance

- **Lazy Style Injection**: Styles are only injected when component is first used
- **Style Deduplication**: Multiple instances share the same stylesheet
- **Memory Management**: Proper cleanup of event listeners and references
- **Optimized Rendering**: Minimal DOM updates on prop changes
- **Image Component Benefits**: Automatic lazy loading, error handling, and fallback support

## Migration from Previous Versions

If upgrading from a version without icon support:

```javascript
// Old conditions (still work)
const conditions = [{ id: 1, name: 'New', description: 'Brand new' }];

// New with custom icons
const conditions = [
  {
    id: 1,
    name: 'New',
    description: 'Brand new',
    icon: '🌟', // Optional custom icon
  },
];

// Hide icons entirely (new feature)
const selector = ConditionSelector({
  conditions,
  showIcons: false,
});
```

## Integration with Other Components

The ConditionSelector integrates seamlessly with other Svarog components:

- **Image Component**: Used internally for image icons, providing automatic error handling and lazy loading
- **Theme System**: Responds to theme changes automatically
- **Form Components**: Can be used within form contexts for device condition selection

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

  it('should handle image icons properly', () => {
    const conditions = [
      {
        id: 1,
        name: 'Test',
        imageUrl: 'https://picsum.photos/28/28',
      },
    ];

    const selector = ConditionSelector({ conditions });
    const element = selector.getElement();

    const img = element.querySelector('.condition-option__icon-image img');
    expect(img).toBeTruthy();
    expect(img.src).toContain('picsum.photos');
  });
});
```

## File Structure

```
src/components/ConditionSelector/
├── ConditionSelector.js           # Component with CSS injection
├── ConditionSelector.styles.js    # Component styles (auto-injected)
├── ConditionSelector.test.js      # Tests
├── ConditionSelector.stories.js   # Storybook stories
├── README.md                      # This documentation
└── index.js                       # Export file
```

## Implementation Details

This component uses the **CSS Injection Pattern** and follows our [Unified Vanilla JavaScript Development Principles](../../docs/principles.md):

1. **Algorithmic Elegance**: Smart icon priority system with fallbacks
2. **Zero Configuration**: No build setup or CSS imports required
3. **Performance Optimized**: Styles cached and injected once per component type
4. **SSR Safe**: Injection only occurs in browser environment
5. **Modern Architecture**: Factory function pattern with clean lifecycle management
6. **Component Reuse**: Leverages existing Image component for consistency

The component automatically injects its styles when first used, ensuring they're available without any manual setup.
