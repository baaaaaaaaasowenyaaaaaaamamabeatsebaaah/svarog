# Svarog Theme System Documentation

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Base Variables](#base-variables)
4. [Using Themes](#using-themes)
5. [Creating New Themes](#creating-new-themes)
6. [Component Theming](#component-theming)
7. [Theme Utilities](#theme-utilities)

## Overview

The Svarog theme system uses CSS custom properties (variables) for consistent styling across components. The system is built in layers:

- Base variables (colors, spacing, typography)
- Theme-specific overrides
- Component-specific variables

## Directory Structure

```
styles/
├── base/
│   ├── 00-reset.css
│   ├── 01-colors.css
│   ├── 02-spacing.css
│   ├── 03-typography.css
│   ├── 04-layout.css
│   └── 05-states.css
└── themes/
    ├── default-theme.css
    └── cabalou-theme.css
```

## Base Variables

Base variables are defined in the `:root` selector and provide default values for:

- Colors
- Spacing
- Typography
- Layout
- Interactive states

Example usage:

```css
.my-component {
  color: var(--color-primary);
  padding: var(--space-4);
  font-size: var(--font-size-base);
}
```

## Using Themes

### In JavaScript

```javascript
import { themeManager } from '../utils/theme';

// Switch themes
themeManager.switchTheme('default'); // or 'cabalou'

// Get current theme
const currentTheme = themeManager.getCurrentTheme();

// Listen for theme changes
window.addEventListener('themechange', (event) => {
  console.log(`Theme changed to: ${event.detail.theme}`);
  console.log(`Previous theme was: ${event.detail.previousTheme}`);
});
```

### In CSS

Components should use theme variables for styling:

```css
.button {
  background-color: var(--button-bg);
  color: var(--button-color);
  padding: var(--button-padding);
  border-radius: var(--button-radius);
  transition: var(--button-transition);
}
```

## Creating New Themes

1. Create a new theme file in `/styles/themes/`:

```css
.my-new-theme {
  /* Typography */
  --font-family-primary: 'Your Font', sans-serif;

  /* Colors - Brand */
  --color-brand-primary: #your-color;
  --color-brand-secondary: #your-color;

  /* Component Variables */
  --button-bg: var(--color-brand-primary);
  --button-color: var(--color-text-white);
  /* ... other component variables ... */
}
```

2. Add the theme to `/src/constants/themes.js`:

```javascript
export const THEMES = {
  default: 'default',
  cabalou: 'cabalou',
  myNewTheme: 'my-new-theme',
};
```

## Component Theming

Components should follow this pattern for theme variables:

```css
/* In component CSS */
.component {
  /* Use component-specific theme variables */
  property: var(--component-property);
}

/* In theme CSS */
.theme {
  /* Define component-specific variables */
  --component-property: value;
}
```

Example for a new component:

```css
/* /src/components/MyComponent/MyComponent.css */
.my-component {
  background: var(--my-component-bg);
  color: var(--my-component-color);
  padding: var(--my-component-padding);
}

/* /styles/themes/default-theme.css */
.default-theme {
  --my-component-bg: var(--color-primary);
  --my-component-color: var(--color-text-white);
  --my-component-padding: var(--space-4);
}

/* /styles/themes/cabalou-theme.css */
.cabalou-theme {
  --my-component-bg: var(--color-brand-primary);
  --my-component-color: var(--color-text-white);
  --my-component-padding: var(--space-6);
}
```

## Theme Utilities

The ThemeManager class provides several utilities:

```javascript
// Get theme names
const themes = themeManager.getThemeNames();

// Get computed value of a theme variable
const primaryColor = themeManager.getThemeValue('--color-primary');

// Switch theme with validation
themeManager.switchTheme('theme-name');

// Get current theme
const currentTheme = themeManager.getCurrentTheme();
```

### Best Practices

1. Always use CSS variables for themeable properties
2. Use semantic variable names (e.g., --button-primary-bg instead of --blue)
3. Keep component-specific variables prefixed with component name
4. Use base variables as values in theme files
5. Test themes across all components when making changes

### Responsive Considerations

When creating themes, consider responsive breakpoints:

```css
.my-theme {
  /* Desktop defaults */
  --component-spacing: var(--space-4);

  @media (max-width: 768px) {
    /* Tablet overrides */
    --component-spacing: var(--space-2);
  }

  @media (max-width: 480px) {
    /* Mobile overrides */
    --component-spacing: var(--space-1);
  }
}
```
