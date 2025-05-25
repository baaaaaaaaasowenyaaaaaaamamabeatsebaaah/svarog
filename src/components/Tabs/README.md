# Tabs Component

The Tabs component provides an accessible way to organize content into tabbed sections, allowing users to navigate between different views while maintaining a clean interface. **This component now uses CSS injection for zero-configuration styling.**

## Features

✅ **Zero CSS Imports** - Styles inject automatically, works everywhere  
✅ **SSR Compatible** - Safe injection in browser environments  
✅ **Accessible** - Full ARIA support and keyboard navigation  
✅ **Flexible Content** - Supports text, HTML, components, and functions  
✅ **Performance Optimized** - Styles cached and deduped automatically

## Usage

```javascript
import { Tabs } from '@svarog-ui/core';

// Create a basic tabs component
const myTabs = Tabs({
  tabs: [
    {
      id: 'tab1',
      label: 'First Tab',
      content: 'This is the content for the first tab',
    },
    {
      id: 'tab2',
      label: 'Second Tab',
      content: 'This is the content for the second tab',
    },
  ],
});

// Add to DOM
document.body.appendChild(myTabs.getElement());
```

## Props

| Prop             | Type                              | Default    | Description                                      |
| ---------------- | --------------------------------- | ---------- | ------------------------------------------------ |
| tabs             | Array                             | (Required) | Array of tab objects                             |
| defaultValue     | number                            | 0          | Index of the tab that should be active initially |
| defaultActiveTab | number                            | 0          | **Deprecated** - Use defaultValue instead        |
| onChange         | function                          | null       | Callback function when active tab changes        |
| onTabChange      | function                          | null       | **Deprecated** - Use onChange instead            |
| value            | number                            | -          | Current active tab index (controlled mode)       |
| activeTab        | number                            | -          | **Deprecated** - Use value instead               |
| className        | string                            | ''         | Additional CSS class                             |
| variant          | 'default' \| 'simple' \| 'border' | 'default'  | Visual style variant                             |
| align            | 'left' \| 'center' \| 'right'     | 'left'     | Alignment of tab buttons                         |

### Tab Object Properties

| Property | Type                                           | Description                   |
| -------- | ---------------------------------------------- | ----------------------------- |
| id       | string                                         | Unique identifier for the tab |
| label    | string                                         | Tab button label              |
| content  | string \| HTMLElement \| Component \| Function | Tab panel content             |

## Methods

### getElement()

Returns the tabs DOM element.

```javascript
const tabsElement = myTabs.getElement();
```

### switchTab(index)

Programmatically switches to a specific tab.

```javascript
myTabs.switchTab(1); // Switch to the second tab
```

### getActiveTab()

Returns the index of the currently active tab.

```javascript
const activeTabIndex = myTabs.getActiveTab();
```

### getValue()

Returns the current value (alias for getActiveTab).

```javascript
const value = myTabs.getValue();
```

### getTabCount()

Returns the total number of tabs.

```javascript
const tabCount = myTabs.getTabCount();
```

### update(props)

Updates multiple tabs properties at once.

```javascript
myTabs.update({
  className: 'custom-tabs',
  variant: 'border',
  align: 'center',
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the tabs.

```javascript
myTabs.destroy();
```

## CSS Customization

Tabs styles can be customized using CSS variables. The component automatically injects its styles, but you can override them:

```css
:root {
  --color-border-light: #e2e8f0;
  --color-brand-secondary: #3182ce;
  --color-brand-secondary-light: #4299e1;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --font-size-xl: 1.25rem;
  --font-weight-bold: 700;
  --font-family-base: system-ui, sans-serif;
  --color-text: #1a202c;
  --color-bg-transparent: #ffffff;
  --button-disabled-bg: #edf2f7;
  --button-disabled-color: #a0aec0;
}
```

## Variants

### Default Variant

Standard tabs with a bottom border and active tab indicator.

```javascript
const defaultTabs = Tabs({
  tabs: [...],
  variant: 'default' // This is the default
});
```

### Simple Variant

Clean tabs without bottom border.

```javascript
const simpleTabs = Tabs({
  tabs: [...],
  variant: 'simple'
});
```

### Border Variant

Tabs with border styling, highlighted active tab, and a clean, contained look.

```javascript
const borderTabs = Tabs({
  tabs: [...],
  variant: 'border'
});
```

## Tab Alignments

### Left Alignment (Default)

```javascript
const leftAlignedTabs = Tabs({
  tabs: [...],
  align: 'left' // This is the default
});
```

### Center Alignment

```javascript
const centerAlignedTabs = Tabs({
  tabs: [...],
  align: 'center'
});
```

### Right Alignment

```javascript
const rightAlignedTabs = Tabs({
  tabs: [...],
  align: 'right'
});
```

## Examples

### Basic Tabs

```javascript
const basicTabs = Tabs({
  tabs: [
    {
      id: 'about',
      label: 'About',
      content: 'About us content...',
    },
    {
      id: 'services',
      label: 'Services',
      content: 'Our services...',
    },
    {
      id: 'contact',
      label: 'Contact',
      content: 'Contact information...',
    },
  ],
});
```

### Tabs with Default Active Tab

```javascript
const preselectedTabs = Tabs({
  tabs: [
    {
      id: 'tab1',
      label: 'First Tab',
      content: 'First tab content',
    },
    {
      id: 'tab2',
      label: 'Second Tab',
      content: 'This tab is active by default',
    },
    {
      id: 'tab3',
      label: 'Third Tab',
      content: 'Third tab content',
    },
  ],
  defaultValue: 1, // Second tab (index 1) is active by default
});
```

### Tabs with Components as Content

```javascript
const tabsWithComponents = Tabs({
  tabs: [
    {
      id: 'button',
      label: 'Button',
      content: Button({
        text: 'Click me!',
        variant: 'primary',
      }),
    },
    {
      id: 'card',
      label: 'Card',
      content: Card({
        title: 'Card Title',
        children: 'This is a card component inside a tab',
      }),
    },
  ],
});
```

### Tabs with HTML Content

```javascript
const htmlTabs = Tabs({
  tabs: [
    {
      id: 'html1',
      label: 'HTML Content',
      content: `
        <div style="padding: 20px;">
          <h3>Rich HTML Content</h3>
          <p>This tab contains <strong>formatted</strong> HTML content.</p>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
            <li>List item 3</li>
          </ul>
        </div>
      `,
    },
  ],
});
```

### Tabs with Change Callback

```javascript
const callbackTabs = Tabs({
  tabs: [...],
  onChange: (newIndex, oldIndex) => {
    console.log(`Switched from tab ${oldIndex} to tab ${newIndex}`);
    // Perform actions when tab changes
  }
});
```

## Migration from CSS Imports

If you were previously importing CSS files, you can now remove those imports:

```javascript
// REMOVE: import './Tabs.css';
// REMOVE: import '@svarog-ui/core/dist/tabs.css';

// The component now injects styles automatically
import { Tabs } from '@svarog-ui/core';
```

## Accessibility

The Tabs component follows best practices for accessibility:

- Uses semantic ARIA roles (`tablist`, `tab`, `tabpanel`)
- Proper `aria-selected` and `aria-controls` attributes
- Keyboard navigation support
- Focus management between tabs
- Hidden attribute for inactive tab panels

## Browser Support

- Modern browsers with ES2020+ support
- SSR/Node.js environments (styles inject only in browser)
- Works with bundlers, CDN, and direct imports
- No external CSS dependencies required

## Performance

- **Automatic style injection**: Styles load only when component is used
- **Caching**: Styles are cached and deduped across instances
- **Memory efficient**: Cleanup handled automatically
- **Tree-shakeable**: Only loads what you use
