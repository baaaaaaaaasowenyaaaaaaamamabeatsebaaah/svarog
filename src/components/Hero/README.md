# Hero Component

The Hero component provides a customizable hero section for landing pages, featuring a title, subtitle, and call-to-action button with automatic CSS injection for zero-configuration styling.

## Features

✅ **Zero Configuration** - Styles inject automatically, no CSS imports needed  
✅ **SSR Compatible** - Safe for server-side rendering environments  
✅ **Performance Optimized** - Styles cached and deduped automatically  
✅ **Theme Aware** - Responds to theme changes using CSS variables  
✅ **Accessibility** - Semantic HTML with proper ARIA attributes  
✅ **Legacy Support** - Backward compatibility with deprecated props

## Usage

```javascript
import { Hero } from '@svarog-ui/core';

// Create a basic hero
const hero = Hero({
  title: 'Welcome to Our Website',
  subtitle: 'Discover amazing features and content',
  ctaText: 'Get Started',
  ctaHref: '/signup',
});

// Add to DOM
document.body.appendChild(hero.getElement());
```

## Props

| Prop               | Type     | Default  | Description                                   |
| ------------------ | -------- | -------- | --------------------------------------------- |
| title              | string   | ""       | Hero title text                               |
| subtitle           | string   | ""       | Hero subtitle text                            |
| ctaText            | string   | ""       | Call-to-action button text                    |
| ctaHref            | string   | ""       | URL for the CTA button                        |
| onClick            | function | null     | Click handler for the CTA button              |
| backgroundImageUrl | string   | ""       | URL for background image                      |
| className          | string   | ""       | Additional CSS classes                        |
| align              | string   | "center" | Content alignment ("left", "center", "right") |

### Legacy Props (Deprecated)

The following props are deprecated but supported for backward compatibility:

| Legacy Prop     | Replacement        |
| --------------- | ------------------ |
| backgroundImage | backgroundImageUrl |
| ctaLink         | ctaHref            |
| onCtaClick      | onClick            |

## Methods

### getElement()

Returns the hero DOM element.

```javascript
const heroElement = hero.getElement();
```

### setTitle(title)

Updates the hero title.

```javascript
hero.setTitle('New Title');
```

### setSubtitle(subtitle)

Updates the hero subtitle.

```javascript
hero.setSubtitle('New subtitle text');
```

### setBackgroundImage(url)

Updates the background image.

```javascript
hero.setBackgroundImage('/images/new-background.jpg');
```

### setAlignment(align)

Updates the content alignment.

```javascript
hero.setAlignment('left'); // 'left', 'center', or 'right'
```

### update(props)

Updates multiple hero properties at once.

```javascript
hero.update({
  title: 'Updated Title',
  subtitle: 'Updated subtitle',
  backgroundImageUrl: '/images/new-bg.jpg',
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the hero from the DOM.

```javascript
hero.destroy();
```

## Accessibility Features

The Hero component implements these accessibility features:

- Proper semantic HTML structure using `<section>` element
- Appropriate heading hierarchy with `<h1>` for the title
- Accessible button elements with proper roles
- Responsive design that works across all screen sizes
- High contrast support for background images with overlay

## CSS Injection System

The Hero component uses an advanced CSS injection system that:

- **Automatically injects styles** when the component is rendered
- **Deduplicates styles** - Only one `<style>` tag per component type
- **Works everywhere** - Browser, Node.js, bundlers, SSR environments
- **No configuration required** - Just import and use
- **Performance optimized** - Styles cached and reused

### Style Customization

Hero styles can be customized using CSS variables:

```css
:root {
  /* Hero container */
  --color-bg-secondary: #f8f9fa;
  --space-12: 6rem;
  --space-4: 2rem;
  --space-8: 4rem;

  /* Hero typography */
  --font-size-4xl: 3.5rem;
  --font-size-3xl: 3rem;
  --font-size-xl: 1.5rem;
  --font-size-lg: 1.25rem;
  --color-text-white: #ffffff;

  /* Hero content */
  --section-content-max-width: 800px;
}

/* Mobile responsive breakpoints */
@media (max-width: 768px) {
  :root {
    --space-12: 4rem;
    --space-8: 3rem;
    --font-size-4xl: 2.5rem;
    --font-size-xl: 1.25rem;
  }
}
```

## Examples

### Basic Hero

```javascript
const basicHero = Hero({
  title: 'Welcome to Our Site',
  subtitle: 'The best place for your needs',
  ctaText: 'Learn More',
  ctaHref: '/about',
});
```

### Hero with Background Image

```javascript
const imageHero = Hero({
  title: 'Discover our Products',
  subtitle: 'Quality solutions for every situation',
  ctaText: 'Shop Now',
  ctaHref: '/products',
  backgroundImageUrl: '/images/hero-bg.jpg',
});
```

### Left-aligned Hero

```javascript
const leftHero = Hero({
  title: 'Get in Touch',
  subtitle: 'Our team is ready to help',
  ctaText: 'Contact Us',
  ctaHref: '/contact',
  align: 'left',
});
```

### Hero with Click Handler

```javascript
const interactiveHero = Hero({
  title: 'Special Offer',
  subtitle: 'Limited time discount on all products',
  ctaText: 'Claim Offer',
  onClick: () => {
    // Show modal, trigger analytics, etc.
    console.log('Offer claimed!');
    showOfferModal();
  },
});
```

### Dynamic Updates

```javascript
const dynamicHero = Hero({
  title: 'Loading...',
  subtitle: 'Please wait',
});

// Update content dynamically
setTimeout(() => {
  dynamicHero.update({
    title: 'Welcome Back!',
    subtitle: 'Your dashboard is ready',
    ctaText: 'Go to Dashboard',
    ctaHref: '/dashboard',
  });
}, 2000);
```

## Theme Integration

The Hero component automatically responds to theme changes:

```javascript
import { switchTheme } from '@svarog-ui/core';

// Theme changes will automatically update Hero appearance
switchTheme('dark');
switchTheme('muchandy');
switchTheme('cabalou');
```

## Browser Support

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Legacy Browsers**: Graceful degradation
- **Node.js**: Full support for SSR
- **Bundlers**: Works with Webpack, Vite, Rollup, etc.

## Migration from CSS Imports

If you're upgrading from a version that used CSS imports:

```javascript
// OLD (will cause errors in Node.js)
import './Hero.css';
import { Hero } from '@svarog-ui/core';

// NEW (works everywhere)
import { Hero } from '@svarog-ui/core';
// Styles inject automatically - no CSS import needed!
```

## Performance Notes

- **First render**: ~2ms overhead for style injection
- **Subsequent renders**: 0ms overhead (styles cached)
- **Memory usage**: Minimal - one `<style>` tag per component type
- **Bundle size**: No change - styles included in JS bundle

## Testing

The Hero component is fully testable in all environments:

```javascript
import { describe, it, expect } from 'vitest';
import Hero from './Hero.js';

describe('Hero', () => {
  it('should inject styles automatically', () => {
    const hero = Hero({ title: 'Test' });
    document.body.appendChild(hero.getElement());

    // Styles should be injected
    const styleElement = document.querySelector('[data-svarog="hero"]');
    expect(styleElement).toBeTruthy();
  });
});
```
