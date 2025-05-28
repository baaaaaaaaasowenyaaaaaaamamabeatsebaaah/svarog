# Accordion Component

The Accordion component provides a collapsible content panel system with smooth animations, full accessibility support, and multiple display variants. It uses modern CSS injection for zero-configuration styling.

## Features

✅ **Zero CSS Import Errors** - Styles inject automatically, works everywhere  
✅ **Multiple or Single Mode** - Allow multiple or single panels open  
✅ **Smooth Animations** - CSS transitions with reduced motion support  
✅ **Full Accessibility** - ARIA attributes, keyboard navigation  
✅ **Flexible Content** - Supports text, HTML, or components  
✅ **Theme Aware** - Automatically adapts to theme changes  
✅ **Programmatic Control** - Full API for expand/collapse operations  
✅ **Multiple Variants** - Default, bordered, minimal, and flush styles

## Usage

```javascript
import { Accordion } from '@svarog-ui/core';

// Basic accordion
const accordion = Accordion({
  items: [
    {
      id: 'item-1',
      title: 'First Section',
      content: 'Content for the first section',
    },
    {
      id: 'item-2',
      title: 'Second Section',
      content: 'Content for the second section',
    },
  ],
});

document.body.appendChild(accordion.getElement());
```

## Props

| Prop            | Type     | Default     | Description                                       |
| --------------- | -------- | ----------- | ------------------------------------------------- |
| items           | Array    | required    | Array of accordion items (must have id and title) |
| multiple        | boolean  | true        | Whether multiple items can be expanded            |
| defaultExpanded | Array    | []          | Array of item IDs to expand by default            |
| variant         | string   | ""          | Visual variant ("bordered", "minimal", "flush")   |
| className       | string   | ""          | Additional CSS classes                            |
| ariaLabel       | string   | "Accordion" | Accessible label for the accordion                |
| onChange        | Function | null        | Callback when expanded items change               |

### Item Structure

Each item in the `items` array must have:

| Property | Type                                     | Required | Description                      |
| -------- | ---------------------------------------- | -------- | -------------------------------- |
| id       | string                                   | Yes      | Unique identifier for the item   |
| title    | string                                   | Yes      | Header text for the item         |
| content  | string\|HTMLElement\|Function\|Component | Yes      | Content to display when expanded |

## Methods

### expand(itemId)

Expands a specific item by ID.

```javascript
accordion.expand('item-2');
```

### collapse(itemId)

Collapses a specific item by ID.

```javascript
accordion.collapse('item-2');
```

### toggle(itemId)

Toggles the state of a specific item.

```javascript
accordion.toggle('item-2');
```

### expandAll()

Expands all items (only works when `multiple` is true).

```javascript
accordion.expandAll();
```

### collapseAll()

Collapses all items.

```javascript
accordion.collapseAll();
```

### getExpandedItems()

Returns an array of currently expanded item IDs.

```javascript
const expanded = accordion.getExpandedItems();
// ['item-1', 'item-3']
```

### update(props)

Updates accordion properties.

```javascript
accordion.update({
  items: newItems,
  variant: 'bordered',
});
```

### getElement()

Returns the accordion DOM element.

```javascript
const element = accordion.getElement();
```

### destroy()

Cleans up event listeners and resources.

```javascript
accordion.destroy();
```

## Content Types

### String Content

```javascript
{
  id: 'text-item',
  title: 'Simple Text',
  content: 'This is plain text content'
}
```

### HTML Content

```javascript
{
  id: 'html-item',
  title: 'Rich Content',
  content: `
    <h3>HTML Content</h3>
    <p>With <strong>formatting</strong> and <a href="#">links</a></p>
    <ul>
      <li>List items</li>
      <li>And more</li>
    </ul>
  `
}
```

### Component Content

```javascript
{
  id: 'component-item',
  title: 'Interactive Content',
  content: Button({
    text: 'Click Me',
    onClick: () => alert('Clicked!')
  })
}
```

### Function Content

```javascript
{
  id: 'dynamic-item',
  title: 'Dynamic Content',
  content: () => {
    const div = document.createElement('div');
    div.textContent = `Generated at: ${new Date().toLocaleTimeString()}`;
    return div;
  }
}
```

## Variants

### Default

Standard accordion with subtle borders and backgrounds.

```javascript
Accordion({ items }); // No variant needed
```

### Bordered

Each item appears as a separate card with spacing.

```javascript
Accordion({
  items,
  variant: 'bordered',
});
```

### Minimal

Clean design with minimal visual elements.

```javascript
Accordion({
  items,
  variant: 'minimal',
});
```

### Flush

No border radius, extends to container edges.

```javascript
Accordion({
  items,
  variant: 'flush',
});
```

## Examples

### Single Expansion Mode

```javascript
const faqAccordion = Accordion({
  items: faqItems,
  multiple: false, // Only one item can be open
  onChange: (expanded) => {
    console.log('Open item:', expanded[0]);
  },
});
```

### With Default Expanded Items

```javascript
const accordion = Accordion({
  items: items,
  defaultExpanded: ['item-1', 'item-3'],
  onChange: (expanded) => {
    console.log('Expanded items:', expanded);
  },
});
```

### Programmatic Control

```javascript
const accordion = Accordion({ items });

// Control buttons
button1.onclick = () => accordion.expandAll();
button2.onclick = () => accordion.collapseAll();
button3.onclick = () => accordion.toggle('item-1');

// Check state
const isFirstExpanded = accordion.getExpandedItems().includes('item-1');
```

### Dynamic Content Updates

```javascript
const accordion = Accordion({ items: initialItems });

// Update items later
fetchNewItems().then((newItems) => {
  accordion.update({ items: newItems });
});
```

### With Form Elements

```javascript
const formAccordion = Accordion({
  items: [
    {
      id: 'personal',
      title: 'Personal Information',
      content: () => createPersonalInfoForm(),
    },
    {
      id: 'address',
      title: 'Address Details',
      content: () => createAddressForm(),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      content: () => createPreferencesForm(),
    },
  ],
  variant: 'bordered',
});
```

## Styling & Theming

### CSS Variables

Customize the accordion appearance with CSS variables:

```css
:root {
  /* Container */
  --accordion-border: 1px solid #e0e0e0;
  --accordion-radius: 4px;
  --accordion-bg: white;

  /* Items */
  --accordion-item-border: 1px solid #e0e0e0;
  --accordion-expanded-bg: #f5f5f5;
  --accordion-transition: all 0.2s ease;

  /* Header */
  --accordion-header-padding: 1rem;
  --accordion-header-bg: transparent;
  --accordion-header-hover-bg: #f0f0f0;
  --accordion-header-color: #333;
  --accordion-header-hover-color: #333;
  --accordion-header-gap: 0.75rem;
  --accordion-font-family: inherit;
  --accordion-font-size: 1rem;
  --accordion-font-weight: 500;

  /* Icon - Text-based (default) */
  --accordion-icon-size: 1.5rem;
  --accordion-icon-content: '▼';
  --accordion-icon-font-size: 0.75rem;
  --accordion-icon-color: #666;
  --accordion-icon-transition: transform 0.3s ease;
  --accordion-icon-expanded-transform: rotate(180deg);
  --accordion-icon-display: block; /* Set to 'none' when using arrow */

  /* Icon - CSS Arrow (optional) */
  --accordion-arrow-display: none; /* Set to 'block' to use arrow */
  --accordion-arrow-width: 8px;
  --accordion-arrow-height: 8px;
  --accordion-arrow-border: 2px solid currentColor;
  --accordion-arrow-transform: rotate(45deg);
  --accordion-arrow-expanded-transform: rotate(-135deg);
  --accordion-arrow-transition: transform 0.3s ease;

  /* Content */
  --accordion-content-padding: 1rem;
  --accordion-content-color: #666;
  --accordion-content-font-size: 0.875rem;
  --accordion-content-line-height: 1.6;

  /* Animation */
  --accordion-panel-transition: max-height 0.3s ease;
  --accordion-panel-max-height: 2000px;

  /* Focus */
  --accordion-focus-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  --accordion-focus-outline-color: #4299e1;

  /* Variants */
  --accordion-bordered-item-border: 1px solid #e0e0e0;
  --accordion-bordered-radius: 4px;
  --accordion-bordered-gap: 0.5rem;
  --accordion-minimal-border: 1px solid #e0e0e0;

  /* Mobile */
  --accordion-header-padding-mobile: 0.75rem;
  --accordion-font-size-mobile: 0.875rem;
  --accordion-content-padding-mobile: 0.75rem;
}
```

### Custom Icons

The accordion supports two icon approaches: text-based icons and CSS-drawn arrows.

#### Text-based Icons (Default)

```css
/* Plus/Minus Icons */
.custom-plus-minus {
  --accordion-icon-content: '+';
  --accordion-icon-font-size: 1.25rem;
  --accordion-icon-expanded-transform: none;
}

.custom-plus-minus .accordion__item--expanded .accordion__icon::before {
  content: '−';
}

/* Chevron Icons */
.custom-chevron {
  --accordion-icon-content: '›';
  --accordion-icon-font-size: 1rem;
  --accordion-icon-expanded-transform: rotate(90deg);
}
```

#### CSS Arrow Icons

For more flexibility, use CSS-drawn arrows:

```css
/* Modern Arrow Style */
.modern-arrow {
  /* Hide text icon */
  --accordion-icon-display: none;

  /* Show and style arrow */
  --accordion-arrow-display: block;
  --accordion-arrow-width: 8px;
  --accordion-arrow-height: 8px;
  --accordion-arrow-border: 2px solid currentColor;
  --accordion-arrow-transform: rotate(45deg);
  --accordion-arrow-expanded-transform: rotate(-135deg);
}

/* Thin Arrow Style */
.thin-arrow {
  --accordion-icon-display: none;
  --accordion-arrow-display: block;
  --accordion-arrow-width: 6px;
  --accordion-arrow-height: 6px;
  --accordion-arrow-border: 1.5px solid currentColor;
  --accordion-arrow-transform: translateY(-25%) rotate(45deg);
  --accordion-arrow-expanded-transform: translateY(25%) rotate(-135deg);
}
```

## Accessibility

The Accordion component implements comprehensive accessibility features:

- **ARIA Attributes**: Proper `aria-expanded`, `aria-controls`, and `aria-labelledby`
- **Keyboard Navigation**: Enter/Space to toggle, Tab to navigate
- **Screen Reader Support**: Clear announcements of state changes
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects `prefers-reduced-motion` preference

## Performance

- **Optimized Animations**: CSS transitions for smooth performance
- **Lazy Rendering**: Content only renders when needed
- **Event Delegation**: Efficient event handling
- **Memory Management**: Proper cleanup on destroy

## Browser Support

- Modern browsers with CSS custom properties support
- CSS transitions for animations
- Fallback for browsers without custom properties
- Works with keyboard navigation in all browsers

## Migration Guide

If migrating from another accordion library:

```javascript
// Old accordion
$('.accordion').accordion({
  collapsible: true,
  active: false,
});

// New Svarog accordion
const accordion = Accordion({
  items: items,
  multiple: true,
  defaultExpanded: [],
});
```

## Related Components

- **Tabs**: For horizontal content organization
- **Card**: Can contain accordions for collapsible cards
- **Navigation**: Accordions work well for mobile menus
