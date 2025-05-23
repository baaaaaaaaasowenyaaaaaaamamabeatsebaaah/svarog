# ConditionSelector Component

The ConditionSelector component provides a user interface for selecting from a list of condition options, typically used in e-commerce scenarios where product condition is a factor.

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

| Deprecated Prop | Use Instead |
| --------------- | ----------- |
| onSelect        | onChange    |
| isLoading       | loading     |

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

## Accessibility Features

The ConditionSelector component uses radio buttons for selection, making it keyboard accessible and screen reader friendly.

## Theme Awareness

The component automatically responds to theme changes using the theme manager.

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

## CSS Customization

The component can be customized through CSS variables:

```css
:root {
  --condition-selector-bg: #ffffff;
  --condition-option-border: 1px solid #e2e8f0;
  --condition-option-border-selected: 1px solid #3182ce;
  --condition-option-bg-selected: #ebf8ff;
  --condition-option-hover-border: #3182ce;
  --condition-option-padding: 1rem;
  --condition-option-margin: 0.5rem;
  --condition-option-icon-size: 1.5rem;
  --condition-option-title-font-weight: 600;
  --condition-option-description-color: #718096;
}
```
