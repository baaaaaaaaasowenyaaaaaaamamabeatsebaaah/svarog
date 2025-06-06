# Button Component

The Button component provides a customizable, accessible button element with various styles, sizes, and states. It uses modern CSS injection for zero-configuration styling.

## Features

✅ **Zero CSS Import Errors** - Styles inject automatically, works everywhere  
✅ **Zero Configuration** - Just import and use, no separate CSS imports needed  
✅ **SSR Compatible** - Styles inject safely in browser only  
✅ **Performance Optimized** - Styles are cached and deduped automatically  
✅ **Modern Approach** - CSS injection eliminates dependency issues  
✅ **Theme Awareness** - Automatically responds to theme changes  
✅ **Full Accessibility** - ARIA attributes, keyboard navigation, screen reader support

## Usage

```javascript
import { Button } from '@svarog-ui/core';

// Create a basic button
const myButton = Button({
  text: 'Click Me',
  onClick: () => console.log('Button clicked'),
});

// Add to DOM
document.body.appendChild(myButton.getElement());
```

## Props

| Prop         | Type     | Default  | Description                                                                              |
| ------------ | -------- | -------- | ---------------------------------------------------------------------------------------- |
| text         | string   | ""       | Button's text content (required)                                                         |
| onClick      | function | null     | Click event handler                                                                      |
| onMouseEnter | function | null     | Mouse enter event handler                                                                |
| onMouseLeave | function | null     | Mouse leave event handler                                                                |
| className    | string   | ""       | Additional CSS classes                                                                   |
| disabled     | boolean  | false    | Whether button is disabled                                                               |
| loading      | boolean  | false    | Whether button is in loading state                                                       |
| pressed      | boolean  | false    | Whether button is in pressed state (for toggle buttons)                                  |
| type         | string   | "button" | Button type ("button", "submit", "reset")                                                |
| size         | string   | ""       | Button size ("sm", "", "lg")                                                             |
| variant      | string   | ""       | Button variant ("primary", "secondary", "text", "outlined", "success", "danger", "icon") |
| icon         | string   | ""       | Icon content (can be emoji, SVG, or text)                                                |
| iconPosition | string   | "left"   | Icon position ("left" or "right")                                                        |
| ariaLabel    | string   | ""       | Accessible label (required for icon-only buttons)                                        |
| debounce     | boolean  | false    | Whether to debounce the click handler                                                    |
| debounceWait | number   | 250      | Milliseconds to wait for debouncing                                                      |

## Methods

### getElement()

Returns the button DOM element.

```javascript
const buttonElement = myButton.getElement();
```

### setText(text)

Updates the button text.

```javascript
myButton.setText('New Text');
```

### setDisabled(isDisabled)

Updates the button disabled state.

```javascript
myButton.setDisabled(true); // Disable
myButton.setDisabled(false); // Enable
```

### setLoading(isLoading)

Updates the button loading state.

```javascript
myButton.setLoading(true); // Show loading spinner
myButton.setLoading(false); // Hide loading spinner
```

### setPressed(isPressed)

Updates the button pressed state (for toggle buttons).

```javascript
myButton.setPressed(true); // Set to pressed state
myButton.setPressed(false); // Set to unpressed state
```

### update(props)

Updates multiple button properties at once.

```javascript
myButton.update({
  text: 'Updated Text',
  className: 'custom-class',
  variant: 'primary',
  disabled: true,
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the button.

```javascript
myButton.destroy();
```

## Accessibility Features

The Button component implements comprehensive accessibility features:

- Proper `aria-disabled` state management
- `aria-busy` for loading states
- `aria-pressed` for toggle buttons
- `aria-label` for icon-only buttons
- Keyboard focus styling through `:focus-visible`
- Screen reader support
- Semantic HTML structure

## Examples

### Primary Button with Icon

```javascript
const primaryButton = Button({
  text: 'Next Step',
  icon: '→',
  iconPosition: 'right',
  variant: 'primary',
  onClick: () => console.log('Next step clicked'),
});
```

### Icon-only Button

```javascript
const iconButton = Button({
  text: '', // Required but empty for icon-only
  icon: '✓',
  variant: 'icon',
  ariaLabel: 'Confirm selection',
  onClick: () => console.log('Confirmed'),
});
```

### Loading Button

```javascript
const loadingButton = Button({
  text: 'Submit',
  variant: 'primary',
  loading: true,
  onClick: () => console.log("This won't trigger during loading"),
});
```

### Toggle Button

```javascript
let isPressed = false;

const toggleButton = Button({
  text: 'Mute',
  pressed: isPressed,
  onClick: function () {
    isPressed = !isPressed;
    this.setPressed(isPressed);
    console.log(isPressed ? 'Muted' : 'Unmuted');
  },
});
```

### Debounced Button

```javascript
const saveButton = Button({
  text: 'Save',
  variant: 'primary',
  onClick: saveData, // This will only be called once even if clicked multiple times
  debounce: true,
  debounceWait: 500, // Will only trigger once per 500ms
});
```

### Async Action Button

```javascript
const apiButton = Button({
  text: 'Submit Form',
  variant: 'primary',
  onClick: async function () {
    this.setLoading(true);
    this.setText('Submitting...');

    try {
      await submitForm();
      this.setText('Success!');
      this.setVariant('success');
    } catch (error) {
      this.setText('Error - Try Again');
      this.setVariant('danger');
    } finally {
      this.setLoading(false);

      // Reset after 2 seconds
      setTimeout(() => {
        this.setText('Submit Form');
        this.setVariant('primary');
      }, 2000);
    }
  },
});
```

## Styling & Theming

### Automatic Style Injection

The Button component automatically injects its styles when first used. No manual CSS imports are required:

```javascript
// ✅ This works automatically - no CSS imports needed!
import { Button } from '@svarog-ui/core';

const button = Button({ text: 'Styled automatically!' });
```

### Theme Integration

The Button automatically responds to theme changes using CSS variables:

```javascript
// Styles automatically adapt to current theme
import { switchTheme } from '@svarog-ui/core';

switchTheme('dark'); // Button styles update automatically
```

### CSS Customization

Button styles can be customized using CSS variables. All theme variables are applied automatically:

```css
:root {
  /* Base button styles */
  --button-bg: #f0f0f0;
  --button-color: #333;
  --button-border: 1px solid #ccc;
  --button-radius: 4px;
  --button-padding: 0.5rem 1rem;
  --button-font-size: 1rem;
  --button-font-family: inherit;
  --button-font-weight: 500;
  --button-transition: all 0.2s ease;
  --button-shadow: none;

  /* Icon spacing */
  --button-icon-margin: 0.5rem;
  --button-icon-size: 1.2em;
  --button-icon-padding: 0.5rem;
  --button-icon-radius: 50%;

  /* States */
  --button-hover-bg: #e0e0e0;
  --button-hover-color: #222;
  --button-hover-border-color: #bbb;
  --button-hover-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --button-hover-transform: -1px;

  --button-active-bg: #d0d0d0;
  --button-active-border-color: #aaa;
  --button-active-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  --button-active-transform: translateY(1px);

  --button-focus-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  --button-focus-outline-color: #4299e1;

  --button-disabled-bg: #f5f5f5;
  --button-disabled-color: #999;
  --button-disabled-border-color: #ddd;
  --button-disabled-opacity: 0.6;

  /* Variants */
  --button-primary-bg: #4299e1;
  --button-primary-color: white;
  --button-primary-border-color: transparent;
  --button-primary-hover-bg: #3182ce;
  --button-primary-hover-color: white;
  --button-primary-hover-border-color: transparent;
  --button-primary-active-bg: #2b6cb0;
  --button-primary-active-border-color: transparent;

  --button-secondary-bg: #718096;
  --button-secondary-color: white;
  --button-secondary-border-color: transparent;
  --button-secondary-hover-bg: #4a5568;
  --button-secondary-hover-color: white;
  --button-secondary-hover-border-color: transparent;
  --button-secondary-active-bg: #2d3748;
  --button-secondary-active-border-color: transparent;

  --button-success-bg: #48bb78;
  --button-success-color: white;
  --button-success-border-color: transparent;
  --button-success-hover-bg: #38a169;
  --button-success-hover-color: white;
  --button-success-hover-border-color: transparent;

  --button-danger-bg: #f56565;
  --button-danger-color: white;
  --button-danger-border-color: transparent;
  --button-danger-hover-bg: #e53e3e;
  --button-danger-hover-color: white;
  --button-danger-hover-border-color: transparent;

  --button-outlined-color: #4299e1;
  --button-outlined-border-color: currentColor;
  --button-outlined-hover-bg: rgba(66, 153, 225, 0.1);
  --button-outlined-hover-color: #3182ce;
  --button-outlined-hover-border-color: currentColor;

  --button-text-color: #4299e1;
  --button-text-hover-color: #3182ce;
  --button-text-padding: 0.25rem 0.5rem;

  /* Sizes */
  --button-padding-sm: 0.25rem 0.5rem;
  --button-font-size-sm: 0.875rem;
  --button-radius-sm: 0.25rem;

  --button-padding-lg: 0.75rem 1.5rem;
  --button-font-size-lg: 1.125rem;
  --button-radius-lg: 0.5rem;

  /* Icon button sizes */
  --button-icon-size-sm: 1em;
  --button-icon-padding-sm: 0.25rem;
  --button-icon-padding-lg: 0.75rem;
}
```

## Technical Implementation

### CSS Injection Architecture

The Button component uses a modern CSS injection system that:

1. **Automatically injects styles** on first render
2. **Caches styles** to prevent duplicate injections
3. **Works in all environments** (Node.js, browsers, SSR)
4. **Requires zero configuration** from developers
5. **Supports tree-shaking** - only loads when used

### Performance Characteristics

- **Time Complexity**: O(1) for style injection (cached after first use)
- **Space Complexity**: O(1) for style storage (single injection per component type)
- **Render Performance**: Optimized with minimal DOM operations
- **Memory Management**: Automatic cleanup on component destruction

### Browser Support

- Modern browsers with CSS custom properties support
- Graceful degradation for older browsers
- SSR compatible with hydration
- Works in Node.js environments (no CSS errors)

## Migration from CSS Imports

If you were previously importing CSS manually, you can now remove those imports:

```javascript
// ❌ OLD: Manual CSS imports required
import './Button.css';
import { Button } from '@svarog-ui/core';

// ✅ NEW: Styles inject automatically
import { Button } from '@svarog-ui/core';
```

## Testing

The component includes comprehensive test coverage for:

- All prop variations and combinations
- Event handling and state management
- Accessibility compliance
- Style injection functionality
- Performance characteristics
- Error handling scenarios

## Related Components

- **Link**: For navigation-style buttons
- **Typography**: For text styling within buttons
- **Form**: Buttons work seamlessly in form contexts
- **Navigation**: Uses buttons for menu interactions
