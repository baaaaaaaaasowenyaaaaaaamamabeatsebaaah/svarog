# Accordion Component

The Accordion component provides a collapsible content panel system with smooth animations, full accessibility support, **flexible icon designs**, and multiple display variants. It uses modern CSS injection for zero-configuration styling.

## Features

✅ **Zero CSS Import Errors** - Styles inject automatically, works everywhere  
✅ **Multiple or Single Mode** - Allow multiple or single panels open  
✅ **Flexible Icon Types** - Content, CSS arrow, chevron, plus/minus, caret, or no icon  
✅ **Exact Select Arrow Match** - CSS arrow with identical styling to Select component  
✅ **Smooth Animations** - CSS transitions with reduced motion support  
✅ **Full Accessibility** - ARIA attributes, keyboard navigation  
✅ **Flexible Content** - Supports text, HTML, or components  
✅ **Theme Aware** - Automatically adapts to theme changes  
✅ **Programmatic Control** - Full API for expand/collapse operations  
✅ **Multiple Variants** - Default, bordered, minimal, and flush styles

## Usage

```javascript
import { Accordion } from '@svarog-ui/core';

// Basic accordion with default content icon
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

// Accordion with CSS arrow (Select-style)
const arrowAccordion = Accordion({
  items: items,
  iconType: 'arrow', // Clean CSS arrow
});

document.body.appendChild(accordion.getElement());
```

## Props

| Prop            | Type     | Default     | Description                                                                      |
| --------------- | -------- | ----------- | -------------------------------------------------------------------------------- |
| items           | Array    | required    | Array of accordion items (must have id and title)                                |
| multiple        | boolean  | true        | Whether multiple items can be expanded                                           |
| defaultExpanded | Array    | []          | Array of item IDs to expand by default                                           |
| variant         | string   | ""          | Visual variant ("bordered", "minimal", "flush")                                  |
| **iconType**    | string   | "content"   | **Icon style ("content", "arrow", "chevron", "plus-minus", "caret", "no-icon")** |
| className       | string   | ""          | Additional CSS classes                                                           |
| ariaLabel       | string   | "Accordion" | Accessible label for the accordion                                               |
| onChange        | Function | null        | Callback when expanded items change                                              |

### Item Structure

Each item in the `items` array must have:

| Property | Type                                     | Required | Description                      |
| -------- | ---------------------------------------- | -------- | -------------------------------- |
| id       | string                                   | Yes      | Unique identifier for the item   |
| title    | string                                   | Yes      | Header text for the item         |
| content  | string\|HTMLElement\|Function\|Component | Yes      | Content to display when expanded |

## Icon Types

The accordion supports multiple icon styles that can be easily switched:

### Content Icon (Default)

Traditional dropdown arrow using CSS content - fully backward compatible.

```javascript
Accordion({
  items: items,
  iconType: 'content', // or omit (default)
});
```

### CSS Arrow (Select-Style)

Clean, modern CSS arrow with **exact same styling as the Select component** - rotates smoothly and provides consistent design language across your application.

```javascript
Accordion({
  items: items,
  iconType: 'arrow', // Identical to Select component arrow
});
```

### Chevron

Right-pointing chevron that rotates to point down when expanded.

```javascript
Accordion({
  items: items,
  iconType: 'chevron',
});
```

### Plus/Minus

Plus sign that changes to minus when expanded - perfect for FAQ sections.

```javascript
Accordion({
  items: items,
  iconType: 'plus-minus',
});
```

### Caret

Small triangular caret that rotates - subtle and clean.

```javascript
Accordion({
  items: items,
  iconType: 'caret',
});
```

### No Icon

Clean accordion with no expand/collapse indicator - minimal design.

```javascript
Accordion({
  items: items,
  iconType: 'no-icon',
});
```

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

### **setIconType(iconType)**

**Changes the icon type dynamically.**

```javascript
accordion.setIconType('arrow'); // Switch to CSS arrow
accordion.setIconType('plus-minus'); // Switch to plus/minus
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
  iconType: 'arrow', // Change icon type
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
  iconType: 'arrow', // Looks great with CSS arrow
});
```

### Minimal

Clean design with minimal visual elements.

```javascript
Accordion({
  items,
  variant: 'minimal',
  iconType: 'chevron', // Subtle chevron works well
});
```

### Flush

No border radius, extends to container edges.

```javascript
Accordion({
  items,
  variant: 'flush',
  iconType: 'plus-minus', // Clear plus/minus indication
});
```

## Examples

### Modern FAQ Design

```javascript
const faqAccordion = Accordion({
  items: faqItems,
  multiple: false, // Only one FAQ open at a time
  iconType: 'plus-minus', // Clear expand/collapse indication
  variant: 'bordered', // Card-like appearance
  onChange: (expanded) => {
    console.log('Open FAQ:', expanded[0]);
  },
});
```

### Clean Navigation Accordion

```javascript
const navAccordion = Accordion({
  items: navigationItems,
  iconType: 'chevron', // Subtle navigation indicator
  variant: 'minimal', // Clean, minimal design
});
```

### Consistent Design Language

```javascript
// Both components use identical arrow styling
const select = Select({
  options: options,
  placeholder: 'Choose option',
});

const accordion = Accordion({
  items: items,
  iconType: 'arrow', // Same arrow as Select
});

// Perfect visual consistency across your UI
```

### Dynamic Icon Switching

```javascript
const accordion = Accordion({
  items: items,
  iconType: 'content',
});

// Switch to different icon types based on context
if (isMobile) {
  accordion.setIconType('plus-minus'); // Clear on mobile
} else {
  accordion.setIconType('arrow'); // Elegant on desktop
}
```

### Programmatic Control

```javascript
const accordion = Accordion({
  items,
  iconType: 'arrow',
});

// Control buttons
button1.onclick = () => accordion.expandAll();
button2.onclick = () => accordion.collapseAll();
button3.onclick = () => accordion.toggle('item-1');
button4.onclick = () => accordion.setIconType('plus-minus');

// Check state
const isFirstExpanded = accordion.getExpandedItems().includes('item-1');
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

  /* Icon Container */
  --accordion-icon-size: 1.5rem;
  --accordion-icon-color: #666;

  /* Content Icons */
  --accordion-icon-content: '▼';
  --accordion-icon-font-size: 0.75rem;
  --accordion-icon-display: block;
  --accordion-icon-transition: transform 0.3s ease;
  --accordion-icon-expanded-transform: rotate(180deg);

  /* CSS Arrow (exact match with Select component) */
  --accordion-arrow-size: 6px;
  --accordion-arrow-right: 0px;
  --accordion-arrow-border: 2px solid currentColor;
  --accordion-arrow-display: none; /* Set to 'block' when using arrow type */
  --accordion-arrow-transform: translateY(-75%) rotate(45deg);
  --accordion-arrow-expanded-transform: translateY(-25%) rotate(-135deg);
  --accordion-arrow-transition: transform 0.2s ease;

  /* Chevron Icons */
  --accordion-chevron-content: '›';
  --accordion-chevron-font-size: 1rem;
  --accordion-chevron-transform: rotate(0deg);
  --accordion-chevron-expanded-transform: rotate(90deg);

  /* Plus/Minus Icons */
  --accordion-plus-content: '+';
  --accordion-minus-content: '−';
  --accordion-plus-font-size: 1.25rem;
  --accordion-plus-font-weight: 300;

  /* Caret Icons */
  --accordion-caret-content: '▸';
  --accordion-caret-font-size: 0.875rem;
  --accordion-caret-transform: rotate(0deg);
  --accordion-caret-expanded-transform: rotate(90deg);

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
  --accordion-icon-size-mobile: 1.25rem;
}
```

### Custom Icon Styling

You can customize any icon type using CSS variables:

#### Modern Arrow (Exact Select Match)

```css
/* Default settings match Select component exactly */
.my-accordion {
  --accordion-arrow-size: 6px;
  --accordion-arrow-border: 2px solid currentColor;
  --accordion-arrow-transition: transform 0.2s ease;
  --accordion-icon-color: #666;
}

/* Customize while maintaining consistency */
.custom-arrow {
  --accordion-arrow-size: 8px; /* Slightly larger */
  --accordion-arrow-border: 1.5px solid currentColor; /* Thinner */
  --accordion-icon-color: #0066ff; /* Brand color */
}
```

#### Custom Plus/Minus

```css
/* Rounded plus/minus */
.rounded-plus-minus {
  --accordion-plus-content: '⊕';
  --accordion-minus-content: '⊖';
  --accordion-plus-font-size: 1rem;
}
```

#### Custom Content Icons

```css
/* Custom symbols */
.custom-symbols {
  --accordion-icon-content: '◢';
  --accordion-icon-expanded-transform: rotate(45deg);
}
```

## Accessibility

The Accordion component implements comprehensive accessibility features:

- **ARIA Attributes**: Proper `aria-expanded`, `aria-controls`, and `aria-labelledby`
- **Keyboard Navigation**: Enter/Space to toggle, Tab to navigate
- **Screen Reader Support**: Clear announcements of state changes
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects `prefers-reduced-motion` preference
- **Icon Accessibility**: All icons have `aria-hidden="true"` as they're decorative

## Performance

- **Optimized Animations**: CSS transitions for smooth performance
- **Lazy Rendering**: Content only renders when needed
- **Event Delegation**: Efficient event handling
- **Memory Management**: Proper cleanup on destroy
- **Flexible Icons**: CSS-only icons for best performance

## Browser Support

- Modern browsers with CSS custom properties support
- CSS transitions for animations
- Fallback for browsers without custom properties
- Works with keyboard navigation in all browsers

## Migration Guide

### From Previous Version

The component is fully backward compatible. Existing code works without changes:

```javascript
// ✅ This still works exactly as before
const accordion = Accordion({
  items: items,
  variant: 'bordered',
});
```

### New Icon Features

To use the new icon types with **exact Select component consistency**, simply add the `iconType` prop:

```javascript
// ✨ Exact Select component arrow match
const accordion = Accordion({
  items: items,
  iconType: 'arrow', // Identical styling to Select
});

// ✨ Or any other icon type
accordion.setIconType('plus-minus'); // Switch dynamically
```

### CSS Migration

If you were overriding icon styles with custom CSS:

```css
/* Old way - still works */
.accordion__icon::before {
  content: '→';
}

/* New way - use icon types */
.my-accordion {
  /* Use iconType: 'chevron' instead */
}
```

## Related Components

- **Select**: Shares the same elegant CSS arrow design
- **Tabs**: For horizontal content organization
- **Card**: Can contain accordions for collapsible cards
- **Navigation**: Accordions work well for mobile menus
