# Navigation Component

The Navigation component provides a customizable, accessible navigation system with support for nested submenus, responsive design, and keyboard navigation.

## Usage

```javascript
import { Navigation } from '@svarog-ui/core';

// Define navigation items
const navItems = [
  { id: 'home', label: 'Home', href: '#home' },
  {
    id: 'products',
    label: 'Products',
    items: [
      { id: 'category1', label: 'Category 1', href: '#category1' },
      { id: 'category2', label: 'Category 2', href: '#category2' },
    ],
  },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' },
  { id: 'disabled', label: 'Disabled', href: '#', disabled: true },
];

// Create navigation
const navigation = Navigation({
  items: navItems,
  activeId: 'home', // or value: 'home'
  onSelect: (item) => console.log('Selected:', item),
});

// Add to DOM
document.body.appendChild(navigation.getElement());
```

## Props

| Prop           | Type     | Default | Description                                           |
| -------------- | -------- | ------- | ----------------------------------------------------- |
| items          | Array    | []      | Navigation items structure                            |
| responsive     | boolean  | true    | Whether navigation adapts to mobile screens           |
| activeId       | string   | null    | ID of the initially active navigation item            |
| value          | string   | null    | Alias for activeId                                    |
| horizontal     | boolean  | true    | Whether navigation is horizontal (false for vertical) |
| expandable     | boolean  | true    | Whether submenus can be expanded                      |
| onSelect       | Function | null    | Callback when item is selected                        |
| onItemSelect   | Function | null    | Deprecated: Use onSelect instead                      |
| className      | string   | ""      | Additional CSS classes                                |
| burgerPosition | string   | "left"  | Mobile burger position ("left" or "right")            |
| submenuShadow  | boolean  | false   | Whether to add shadow to submenus                     |

### Navigation Item Structure

Each navigation item should have the following structure:

```javascript
{
  id: 'unique-id',        // Required - Used for tracking active and expanded states
  label: 'Item Label',    // Required - Text to display
  href: '#optional-link', // Optional - Link destination (not used for items with children)
  disabled: false,        // Optional - Whether item is disabled
  items: [...]            // Optional - Array of child navigation items for submenus
}
```

## Methods

### getElement()

Returns the navigation DOM element.

```javascript
const navElement = navigation.getElement();
```

### setActiveItem(itemId)

Sets the active navigation item.

```javascript
navigation.setActiveItem('about');
```

### toggleMobileMenu()

Toggles the mobile menu open/closed state.

```javascript
navigation.toggleMobileMenu();
```

### closeMobileMenu()

Closes the mobile menu.

```javascript
navigation.closeMobileMenu();
```

### expandItem(itemId)

Expands a submenu by item ID.

```javascript
navigation.expandItem('products');
```

### collapseAll()

Collapses all expanded submenus.

```javascript
navigation.collapseAll();
```

### update(props)

Updates navigation properties.

```javascript
navigation.update({
  items: newItems,
  value: 'contact', // New standardized prop
  horizontal: false,
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the navigation.

```javascript
navigation.destroy();
```

## Accessibility Features

The Navigation component implements these accessibility features:

- Proper `aria-expanded` state for submenus
- `aria-haspopup` for items with submenus
- `aria-disabled` for disabled items
- Keyboard navigation support (Tab for focus, Enter/Space for activation, Escape to close)
- Appropriate ARIA roles (navigation, menubar, menu)
- Mobile menu with proper ARIA labeling

## Theme Awareness

The Navigation component responds to theme changes automatically through CSS variables.

## Responsive Behavior

The navigation automatically adapts to different screen sizes:

- On desktop: Displays as a horizontal or vertical menu with hover-triggered submenus
- On mobile (< 768px): Transforms into a mobile menu with a burger button and dropdown display

## Examples

### Horizontal Navigation with Submenus

```javascript
const horizontalNav = Navigation({
  items: navItems,
  submenuShadow: true,
});
```

### Vertical Navigation

```javascript
const sideNav = Navigation({
  items: navItems,
  horizontal: false,
});
```

### Mobile Navigation with Logo

```javascript
const mobileNav = Navigation({
  items: navItems,
  burgerPosition: 'right',
});

const navElement = mobileNav.getElement();
const logo = document.createElement('div');
logo.textContent = 'LOGO';
logo.style.margin = '0 auto';

navElement.insertBefore(logo, navElement.querySelector('.nav__list'));
```

### Navigation with Custom Styling

```javascript
const styledNav = Navigation({
  items: navItems,
  className: 'custom-nav',
});
```

## CSS Customization

Navigation styles can be customized using CSS variables:

```css
:root {
  /* Base navigation */
  --nav-font-size: 1rem;
  --nav-line-height: 1.5;
  --nav-item-spacing: 1.5rem;
  --nav-item-spacing-vertical: 0.75rem;
  --nav-link-color: #333;
  --nav-link-hover-color: #0066cc;
  --nav-link-active-color: #0066cc;

  /* Submenus */
  --nav-dropdown-bg: white;
  --nav-dropdown-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --nav-submenu-indent: 1rem;

  /* Burger menu */
  --nav-burger-size: 24px;
  --nav-burger-color: #333;

  /* Mobile navigation */
  --nav-mobile-bg: #f5f5f5;
  --nav-mobile-padding: 1rem;
  --nav-mobile-link-padding: 0.5rem 1rem;
  --nav-mobile-hover-bg: rgba(0, 0, 0, 0.05);
  --nav-mobile-active-bg: rgba(0, 0, 0, 0.1);
  --nav-mobile-submenu-bg: rgba(0, 0, 0, 0.02);
}
```

## Migration Notes

### Props Standardization (2025)

The Navigation component has been updated with standardized prop names:

- `onItemSelect` has been renamed to `onSelect` (deprecated but supported with warning)
- Added `value` as an alias for `activeId` for consistency with other components
- Items no longer support `url` property (use `href` instead)
