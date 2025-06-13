# Tag Component

The Tag component provides an interactive tag/chip element for filtering, categorizing, or labeling content. It's commonly used for blog post tags, product categories, or filter selections.

## Features

✅ **Interactive States** - Selected, hover, focus, and disabled states
✅ **Removable Tags** - Optional close button with keyboard support
✅ **Icon Support** - Add icons for visual context
✅ **Count Display** - Show item counts for filters
✅ **Keyboard Navigation** - Full keyboard support (Enter, Space, Delete)
✅ **Accessibility** - ARIA attributes and screen reader support
✅ **Theme Aware** - Adapts to theme changes automatically
✅ **Multiple Variants** - Color and size options

## Usage

```javascript
import { Tag } from 'svarog-ui';

// Basic tag
const tag = Tag({
  label: 'JavaScript',
  onClick: (value) => console.log(`Selected: ${value}`),
});

document.body.appendChild(tag.getElement());
```

## Props

| Prop      | Type     | Default   | Description                                   |
| --------- | -------- | --------- | --------------------------------------------- |
| label     | string   | ""        | Tag text content (required)                   |
| value     | any      | null      | Tag value (defaults to label if not provided) |
| onClick   | function | null      | Click handler - receives (value, event)       |
| onRemove  | function | null      | Remove handler - receives (value)             |
| className | string   | ""        | Additional CSS classes                        |
| disabled  | boolean  | false     | Whether tag is disabled                       |
| selected  | boolean  | false     | Whether tag is selected/active                |
| removable | boolean  | false     | Whether to show remove button                 |
| size      | string   | "md"      | Tag size ("sm", "md", "lg")                   |
| variant   | string   | "default" | Color variant (see variants below)            |
| icon      | string   | ""        | Icon content (emoji, symbol, or text)         |
| count     | number   | undefined | Optional count to display                     |
| ariaLabel | string   | ""        | Custom accessibility label                    |

### Variants

- `default` - Gray background
- `primary` - Primary theme color
- `secondary` - Secondary theme color
- `success` - Green/success color
- `warning` - Yellow/warning color
- `danger` - Red/danger color
- `info` - Blue/info color

## Methods

### getElement()

Returns the tag DOM element.

```javascript
const element = tag.getElement();
```

### setSelected(isSelected)

Updates the selected state.

```javascript
tag.setSelected(true); // Select tag
tag.setSelected(false); // Deselect tag
```

### setDisabled(isDisabled)

Updates the disabled state.

```javascript
tag.setDisabled(true); // Disable tag
tag.setDisabled(false); // Enable tag
```

### setCount(count)

Updates the count display.

```javascript
tag.setCount(42); // Show count
tag.setCount(null); // Hide count
```

### getValue()

Returns the tag's value (or label if no value).

```javascript
const value = tag.getValue(); // 'javascript' or custom value
```

### getLabel()

Returns the tag's label text.

```javascript
const label = tag.getLabel(); // 'JavaScript'
```

### isSelected()

Returns whether the tag is selected.

```javascript
if (tag.isSelected()) {
  console.log('Tag is selected');
}
```

### update(props)

Updates multiple properties at once.

```javascript
tag.update({
  selected: true,
  count: 10,
  variant: 'primary',
});
```

### destroy()

Cleans up event listeners and resources.

```javascript
tag.destroy();
```

## Examples

### Filter Tags with Counts

```javascript
const categories = [
  { label: 'Technology', value: 'tech', count: 45 },
  { label: 'Design', value: 'design', count: 23 },
  { label: 'Business', value: 'business', count: 67 },
];

const selectedCategories = new Set();

const tagContainer = document.createElement('div');
tagContainer.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

categories.forEach((category) => {
  const tag = Tag({
    label: category.label,
    value: category.value,
    count: category.count,
    onClick: (value) => {
      if (selectedCategories.has(value)) {
        selectedCategories.delete(value);
        tag.setSelected(false);
      } else {
        selectedCategories.add(value);
        tag.setSelected(true);
      }
      console.log('Selected categories:', Array.from(selectedCategories));
    },
  });

  tagContainer.appendChild(tag.getElement());
});
```

### Removable Tags

```javascript
const skills = ['JavaScript', 'React', 'Node.js', 'CSS'];
const skillContainer = document.createElement('div');
skillContainer.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

skills.forEach((skill) => {
  const tag = Tag({
    label: skill,
    removable: true,
    variant: 'primary',
    onRemove: (value) => {
      const element = tag.getElement();
      element.style.animation = 'tag-fade-out 0.2s ease forwards';
      setTimeout(() => {
        tag.destroy();
        element.remove();
      }, 200);
      console.log(`Removed: ${value}`);
    },
  });

  skillContainer.appendChild(tag.getElement());
});
```

### Tag Input Component

```javascript
function createTagInput() {
  const container = document.createElement('div');
  const tags = new Map();

  const tagList = document.createElement('div');
  tagList.style.cssText =
    'display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Add tag and press Enter';
  input.style.cssText =
    'padding: 8px; border: 1px solid #ccc; border-radius: 4px;';

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      const value = input.value.trim();

      if (!tags.has(value)) {
        const tag = Tag({
          label: value,
          removable: true,
          size: 'sm',
          variant: 'info',
          onRemove: (tagValue) => {
            tags.delete(tagValue);
            tag.destroy();
            tag.getElement().remove();
          },
        });

        tags.set(value, tag);
        tagList.appendChild(tag.getElement());
        input.value = '';
      }
    }
  });

  container.appendChild(tagList);
  container.appendChild(input);

  return container;
}
```

### Icon Tags

```javascript
const socialTags = [
  { label: 'Twitter', icon: '🐦', color: 'info' },
  { label: 'GitHub', icon: '🐙', color: 'secondary' },
  { label: 'YouTube', icon: '📺', color: 'danger' },
];

socialTags.forEach((social) => {
  const tag = Tag({
    label: social.label,
    icon: social.icon,
    variant: social.color,
    onClick: (value) => {
      window.open(`https://${value.toLowerCase()}.com`);
    },
  });

  document.body.appendChild(tag.getElement());
});
```

## Styling & Theming

### CSS Variables

Tags can be customized using CSS variables:

```css
:root {
  /* Base styles */
  --tag-padding: 0.25rem 0.75rem;
  --tag-font-size: 0.875rem;
  --tag-font-family: inherit;
  --tag-font-weight: 500;
  --tag-color: #374151;
  --tag-bg: #f3f4f6;
  --tag-border: 1px solid transparent;
  --tag-radius: 9999px;
  --tag-gap: 0.375rem;
  --tag-transition: all 0.2s ease;

  /* States */
  --tag-hover-bg: #e5e7eb;
  --tag-hover-color: #111827;
  --tag-hover-transform: translateY(-1px);
  --tag-hover-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  --tag-selected-bg: #3b82f6;
  --tag-selected-color: #ffffff;
  --tag-selected-border-color: transparent;

  --tag-disabled-opacity: 0.5;

  /* Sizes */
  --tag-padding-sm: 0.125rem 0.5rem;
  --tag-font-size-sm: 0.75rem;
  --tag-gap-sm: 0.25rem;

  --tag-padding-lg: 0.375rem 1rem;
  --tag-font-size-lg: 1rem;
  --tag-gap-lg: 0.5rem;

  /* Remove button */
  --tag-remove-size: 1.25em;
  --tag-remove-margin: 0.25rem;
  --tag-remove-opacity: 0.7;
  --tag-remove-hover-bg: rgba(0, 0, 0, 0.1);

  /* Variants - customize per theme */
  --tag-primary-bg: #3b82f6;
  --tag-primary-color: #ffffff;
  /* ... etc for other variants */
}
```

## Accessibility

- **Keyboard Navigation**:
  - `Tab` - Focus tags
  - `Enter`/`Space` - Select/click tag
  - `Delete` - Remove tag (if removable)
- **ARIA Attributes**:
  - `role="button"` - Identifies as interactive
  - `aria-pressed` - Indicates selected state
  - `aria-disabled` - Indicates disabled state
  - `aria-label` - Provides accessible name
- **Focus Management**: Clear focus indicators
- **Screen Reader Support**: Announces state changes

## Performance

- Efficient event delegation
- Minimal DOM operations
- Style injection cached after first use
- Memory cleanup on destroy

## Use Cases

1. **Blog Post Tags** - Categorize and filter articles
2. **Product Filters** - E-commerce category selection
3. **Skill Lists** - Profile or resume displays
4. **Search Filters** - Refine search results
5. **Multi-select Inputs** - Alternative to checkboxes
6. **Label Management** - Tagging systems
7. **Category Navigation** - Content organization

## Related Components

- **Checkbox** - For traditional multi-select
- **Radio** - For single selection
- **Button** - For actions instead of selection
- **Badge** - For non-interactive labels
