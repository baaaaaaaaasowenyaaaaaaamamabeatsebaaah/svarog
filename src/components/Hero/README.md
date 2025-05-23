# Hero Component

The Hero component provides a customizable hero section for landing pages, featuring a title, subtitle, and call-to-action button.

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

- Proper semantic HTML structure
- Appropriate heading hierarchy
- Accessible button elements

## Theme Awareness

The Hero automatically responds to theme changes using the theme manager.

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

## CSS Customization

Hero styles can be customized using CSS variables:

```css
:root {
  /* Hero container */
  --section-bg: #f5f5f5;
  --section-color: #333;
  --section-padding: 4rem 2rem;

  /* Hero typography */
  --typography-h1-size: 3rem;
  --typography-h1-weight: 700;
  --typography-color: inherit;

  /* Hero content */
  --section-content-max-width: 800px;
}
```
