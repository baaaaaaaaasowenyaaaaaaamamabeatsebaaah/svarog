# Svarog UI - Modular Component Library

A lightweight, highly optimized vanilla JavaScript component library with powerful theming capabilities. Built with performance, maintainability, and flexibility in mind - **all with zero external dependencies**.

## 🚀 New in v4.0: Modular Package System

Svarog UI now offers theme-specific packages for optimal bundle sizes! Install only what you need:

```bash
# Option 1: Core only (no themes)
npm install svarog-ui-core

# Option 2: Core + specific theme
npm install svarog-ui-core @svarog-ui/theme-cabalou

# Option 3: Traditional all-in-one (includes default theme)
npm install svarog-ui
```

## Features

- 📦 **Modular Packages** - Install only the themes you need
- 🔍 **Zero Dependencies** - Pure JavaScript with no external runtime dependencies
- 🎨 **Powerful Theming** - Comprehensive CSS variable-based theming system
- 🧱 **Factory Pattern** - Consistent component API using factory functions
- 🚀 **Performance Optimized** - Event delegation, DOM batching, and CSS injection
- ♿ **Accessible** - Follows accessibility best practices
- 🧪 **Well Tested** - Comprehensive test coverage with Vitest
- 📚 **Custom Component Explorer** - Built-in Storybook-like viewer
- 🎯 **Zero Configuration** - Components automatically inject their own styles
- 🌐 **Universal Compatibility** - Works in Node.js, browsers, bundlers without CSS import errors

## Installation Options

### 1. Minimal Installation (Recommended)

Install only what you need for the smallest bundle size:

```bash
# Core components only
npm install svarog-ui-core

# Add specific themes as needed
npm install @svarog-ui/theme-default
npm install @svarog-ui/theme-cabalou
npm install @svarog-ui/theme-muchandy
```

### 2. Traditional Installation

For backward compatibility or if you prefer the all-in-one approach:

```bash
npm install svarog-ui
```

This includes the core components and default theme pre-applied.

## Available Packages

| Package                     | Description                       | Size  |
| --------------------------- | --------------------------------- | ----- |
| `svarog-ui-core`            | Core components without themes    | ~50KB |
| `@svarog-ui/theme-default`  | Material Design inspired theme    | ~15KB |
| `@svarog-ui/theme-cabalou`  | Cabalou theme                     | ~15KB |
| `@svarog-ui/theme-muchandy` | Muchandy theme                    | ~15KB |
| `svarog-ui`                 | All-in-one (core + default theme) | ~65KB |

## Quick Start

### Modular Approach (New)

```javascript
// Import only what you need
import { Button, Card } from 'svarog-ui-core';
import cabalouTheme from '@svarog-ui/theme-cabalou';

// Apply theme
cabalouTheme.apply();

// Create components
const button = Button({
  text: 'Click Me',
  variant: 'primary',
  onClick: () => console.log('Clicked!'),
});

document.body.appendChild(button.getElement());
```

### Traditional Approach

```javascript
import { Button, Card } from 'svarog-ui';

// Default theme is already applied
const button = Button({
  text: 'Click Me',
  variant: 'primary',
});

document.body.appendChild(button.getElement());
```

### Theme Management

Each theme package exports an object with these methods:

```javascript
import defaultTheme from '@svarog-ui/theme-default';
import cabalouTheme from '@svarog-ui/theme-cabalou';
import muchandyTheme from '@svarog-ui/theme-muchandy';

// Apply a theme
defaultTheme.apply();

// Remove current theme
defaultTheme.remove();

// Get theme CSS string
const css = defaultTheme.getStyles();

// Switch themes
function switchTheme(newTheme) {
  // Remove any existing theme
  document
    .querySelectorAll('[data-svarog*="theme"]')
    .forEach((el) => el.remove());

  // Apply new theme
  newTheme.apply();
}

// Usage
switchTheme(cabalouTheme);
```

### Custom Theme Creation

Currently, custom themes can be created by following the pattern of existing theme packages. A dedicated theme creation utility is planned for a future release.

```javascript
// Example custom theme structure
const myCustomTheme = {
  name: 'custom',

  apply() {
    const styles = `.custom-theme {
      --color-primary: #FF6B6B;
      --color-primary-light: #FF8E8E;
      --color-primary-dark: #E55555;
      /* ... more variables ... */
    }`;

    const styleEl = document.createElement('style');
    styleEl.id = 'svarog-theme-custom';
    styleEl.setAttribute('data-svarog', 'theme-custom');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    document.documentElement.classList.add('custom-theme');
    document.body.classList.add('custom-theme');
  },

  remove() {
    document.documentElement.classList.remove('custom-theme');
    document.body.classList.remove('custom-theme');

    const styleEl = document.getElementById('svarog-theme-custom');
    if (styleEl) styleEl.remove();
  },

  getStyles() {
    return '/* theme CSS */';
  },
};
```

## Component API

All components follow a consistent factory pattern:

```javascript
const component = Component({
  // Component props
});

// Get DOM element
const element = component.getElement();

// Update props
component.update({ text: 'New Text' });

// Cleanup
component.destroy();
```

## Available Components

### Layout Components

- `Grid` - Flexible grid system
- `Section` - Content sections with variants
- `Card` - Content containers

### Form Components

- `Form` - Form container with validation
- `FormGroup` - Form field grouping
- `FormSection` - Form sections
- `FormActions` - Form action buttons
- `Input` - Text inputs
- `Select` - Dropdown selections
- `Checkbox` - Checkbox inputs
- `Radio` & `RadioGroup` - Radio buttons
- `ConditionSelector` - Condition selection UI

### UI Components

- `Button` - Buttons with variants
- `Typography` - Text components
- `Link` - Enhanced links
- `Image` - Responsive images
- `Logo` - Logo display
- `Rating` - Star ratings
- `PriceDisplay` - Price formatting
- `StepsIndicator` - Progress steps
- `Tabs` - Tabbed interface

### Navigation

- `Navigation` - Main navigation
- `Pagination` - Page navigation
- `Header` - Page header
- `CollapsibleHeader` - Collapsing header
- `Footer` - Page footer

### Content Components

- `Hero` - Hero sections
- `BlogCard` - Blog post cards
- `BlogList` - Blog post lists
- `BlogDetail` - Blog post detail
- `ProductCard` - Product cards
- `Map` - Map integration

### Specialized

- `MuchandyHero` - Custom hero variant
- `PhoneRepairForm` - Phone repair form
- `UsedPhonePriceForm` - Price calculator
- `ContactInfo` - Contact information
- `StickyContactIcons` - Sticky contact buttons
- `Page` - Page wrapper
- `Head` - Document head management

## CSS Injection System

Svarog's innovative CSS injection system eliminates CSS import errors:

```javascript
// No CSS imports needed!
const button = Button({ text: 'Click' });
// Styles are automatically injected on first render

// Works everywhere:
// ✅ Browser
// ✅ Node.js (SSR)
// ✅ Build tools
// ✅ Test environments
```

### Benefits

- **Zero Configuration** - No webpack/build setup needed
- **Automatic Deduplication** - Styles injected only once
- **Tree Shaking** - Only used component styles are loaded
- **SSR Compatible** - Works with server-side rendering
- **Performance Optimized** - Efficient style injection

## Package Contents

### svarog-ui-core

- All component JavaScript files
- Component CSS for style injection
- Utility functions (except theme-specific utilities)
- No themes included

### Theme Packages

Each theme package (`@svarog-ui/theme-*`) includes:

- JavaScript module with `apply()`, `remove()`, and `getStyles()` methods
- Embedded CSS variables and styles
- No external dependencies

### svarog-ui (Main Package)

- Re-exports all core components
- Includes default theme pre-applied
- Convenience package for quick setup

## Migration Guide (v3 to v4)

### What's Changed

- Themes are now separate packages for optimal bundle size
- Core can be used without any theme
- Three themes currently available: default, cabalou, muchandy
- Backward compatibility maintained through the main `svarog-ui` package

### For Minimal Bundle Size

**Before (v3):**

```javascript
import { Button } from 'svarog-ui';
// All themes were bundled (~120KB)
```

**After (v4):**

```javascript
import { Button } from 'svarog-ui-core';
import cabalouTheme from '@svarog-ui/theme-cabalou';
cabalouTheme.apply();
// Only what you need (~65KB)
```

### For Backward Compatibility

No changes needed! The `svarog-ui` package works the same way:

```javascript
import { Button } from 'svarog-ui'; // Still works!
```

## Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/svarog.git
cd svarog

# Install dependencies
npm install

# Build all packages
npm run build:all

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
svarog/
├── packages/                      # Monorepo packages
│   ├── svarog-ui/                # Main package (backward compatible)
│   ├── svarog-ui-core/           # Core components
│   └── @svarog-ui/               # Scoped packages
│       ├── theme-default/        # Default theme
│       ├── theme-cabalou/        # Cabalou theme
│       └── theme-muchandy/       # Muchandy theme
│
├── src/                          # Source code
│   ├── components/               # Component implementations
│   ├── styles/                   # Theme definitions
│   └── utils/                    # Utilities
│
├── .storybook/                   # Component explorer
├── scripts/                      # Build scripts
└── docs/                         # Documentation
```

## Performance

Svarog is built for performance:

- **Small Bundle Sizes** - Modular packages mean you only ship what you use
- **Fast Runtime** - Optimized algorithms and efficient DOM updates
- **Lazy Loading** - Components can be dynamically imported
- **Memory Efficient** - Proper cleanup and memory management

### Bundle Size Comparison

| Setup                   | Size   | Reduction   |
| ----------------------- | ------ | ----------- |
| v3 (All themes bundled) | ~120KB | -           |
| v4 Core + 1 theme       | ~65KB  | 46% smaller |
| v4 Core only            | ~50KB  | 58% smaller |

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Opera 74+
- Chrome for Android
- Safari on iOS 14+

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

```bash
# Fork and clone
git clone https://github.com/your-username/svarog.git
cd svarog

# Install and bootstrap
npm install
npm run build:all

# Create new component
npm run create-component MyComponent

# Run tests
npm test

# Start dev server
npm start
```

## Roadmap

Planned features and packages for future releases:

- `@svarog-ui/theme-dark` - Dark mode theme
- `@svarog-ui/theme-light` - Light mode theme
- `@svarog-ui/theme-red` - Red accent theme
- `@svarog-ui/create-theme` - Theme creation utilities
- TypeScript declarations
- React/Vue adapters
- Additional components based on community feedback

## License

ISC License - see [LICENSE](LICENSE) file for details.

## Links

- [Documentation](https://svarog-ui.dev)
- [Component Explorer](https://svarog-ui.dev/storybook)
- [GitHub Repository](https://github.com/your-username/svarog)
- [NPM Package](https://www.npmjs.com/package/svarog-ui)
- [Migration Guide](https://svarog-ui.dev/migration)

---

<p align="center">
  Made with ❤️ by Sebastian Huber
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/svarog-ui">
    <img src="https://img.shields.io/npm/v/svarog-ui.svg" alt="npm version">
  </a>
  <a href="https://github.com/your-username/svarog/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/svarog-ui.svg" alt="license">
  </a>
  <a href="https://www.npmjs.com/package/svarog-ui">
    <img src="https://img.shields.io/npm/dm/svarog-ui.svg" alt="downloads">
  </a>
</p>
