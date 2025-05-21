# MuchandyHero Component

The MuchandyHero component is a specialized hero section designed for phone repair and buyback services, featuring a tabbed interface that allows users to switch between repair and sell options.

## Usage

```javascript
import { MuchandyHero } from '@svarog-ui/core';
import PhoneRepairForm from '../PhoneRepairForm/PhoneRepairForm';
import UsedPhonePriceForm from '../UsedPhonePriceForm/UsedPhonePriceForm';

// Create forms
const repairForm = new PhoneRepairForm({
  onPriceChange: (price) => console.log('Repair price:', price),
});

const buybackForm = new UsedPhonePriceForm({
  onPriceChange: (price) => console.log('Buyback price:', price),
});

// Create a MuchandyHero component
const hero = MuchandyHero({
  backgroundImage: '/images/hero-background.jpg',
  title: 'Find<br>Your Price',
  subtitle: 'Calculate your price now.',
  repairForm,
  buybackForm,
  defaultTab: 'repair',
});

// Add to DOM
document.body.appendChild(hero.getElement());
```

## Props

| Prop            | Type   | Default                     | Description                                |
| --------------- | ------ | --------------------------- | ------------------------------------------ |
| repairForm      | Object | (Required)                  | Phone repair form component instance       |
| buybackForm     | Object | (Required)                  | Phone buyback form component instance      |
| backgroundImage | string | ""                          | URL for the hero background image          |
| title           | string | "Finden Sie<br>Ihren Preis" | Hero title text (supports HTML for breaks) |
| subtitle        | string | "Jetzt Preis berechnen."    | Hero subtitle text                         |
| defaultTab      | string | "repair"                    | Default active tab ("repair" or "sell")    |
| className       | string | ""                          | Additional CSS classes for the component   |

## Methods

### getElement()

Returns the MuchandyHero DOM element.

```javascript
const heroElement = hero.getElement();
```

### update(props)

Updates the MuchandyHero component with new props.

```javascript
hero.update({
  title: 'New<br>Title',
  subtitle: 'New subtitle text',
});
```

### destroy()

Cleans up resources and event listeners. Call when removing the component from the DOM.

```javascript
hero.destroy();
```

## Tab Configuration

The MuchandyHero component includes a tabbed interface with two tabs:

1. **Repair** ("Reparatur") - Shows the phone repair form
2. **Sell** ("Verkaufen") - Shows the phone buyback form

You can set the default active tab using the `defaultTab` prop.

## Theme Awareness

The MuchandyHero component automatically responds to theme changes using the theme manager.

## Grid Layout

The component uses a 12-column grid layout with the content positioned in columns 2-5 (span 4) by default, which provides proper spacing and positioning on various screen sizes.

## Examples

### Basic MuchandyHero

```javascript
const basicHero = MuchandyHero({
  repairForm,
  buybackForm,
});
```

### With Sell Tab as Default

```javascript
const sellHero = MuchandyHero({
  backgroundImage: '/images/hero-bg.jpg',
  title: 'Sell<br>Your Device',
  subtitle: 'Quick and easy for the best price.',
  repairForm,
  buybackForm,
  defaultTab: 'sell',
});
```

### With Custom Background and Text

```javascript
const customHero = MuchandyHero({
  backgroundImage: '/images/custom-bg.jpg',
  title: 'Your<br>Smartphone Service',
  subtitle: 'Repair or sell - your choice!',
  repairForm,
  buybackForm,
});
```

## CSS Customization

MuchandyHero styles can be customized using CSS variables:

```css
:root {
  /* MuchandyHero variables */
  --color-bg-dark: #222;
  --color-brand-secondary: #ff6b00;
  --color-white: #fff;
  --color-bg-transparent: rgba(0, 0, 0, 0.7);

  /* Spacing */
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-8: 2rem;
  --space-12: 3rem;

  /* Typography */
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-4xl: 2.25rem;
  --font-size-6xl: 3.75rem;
  --font-weight-bold: 700;
}
```

## Accessibility Features

The MuchandyHero component implements these accessibility features:

- Proper semantic HTML structure
- Appropriate heading hierarchy
- Accessible tab interface (via the Tabs component)
- Proper ARIA attributes for the tabbed interface

## Responsive Behavior

- On mobile devices (screen width < 768px), the content column spans the full width
- Font sizes scale down on smaller screens
- Tab buttons remain accessible on all screen sizes

## Integration with Form Components

The MuchandyHero component is designed to work seamlessly with:

- `PhoneRepairForm` - For device repair price calculations
- `UsedPhonePriceForm` - For device buyback price estimates

Both forms must implement the standard component API with `getElement()` and `destroy()` methods.
