# Button Component

The Button component provides a customizable, accessible button element with various styles, sizes, and states.

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

| Prop      | Type     | Default    | Description                                                                              |
| --------- | -------- | ---------- | ---------------------------------------------------------------------------------------- |
| text      | string   | (Required) | Button's text content                                                                    |
| onClick   | function | null       | Click event handler                                                                      |
| className | string   | ''         | Additional CSS classes                                                                   |
| disabled  | boolean  | false      | Whether button is disabled                                                               |
| type      | string   | 'button'   | Button type ('button', 'submit', 'reset')                                                |
| size      | string   | ''         | Button size ('sm', '', 'lg')                                                             |
| variant   | string   | ''         | Button variant ('primary', 'secondary', 'text', 'outlined', 'success', 'danger', 'icon') |

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

## CSS Customization

Button styles can be customized using CSS variables:

```css
:root {
  --button-bg: #f0f0f0;
  --button-color: #333;
  --button-border: 1px solid #ccc;
  --button-radius: 4px;
  --button-padding: 0.5rem 1rem;
  --button-font-size: 1rem;
  --button-transition: all 0.2s ease;

  /* Hover state */
  --button-hover-bg: #e0e0e0;

  /* Other states and variants */
  /* (see base theme files for all variables) */
}
```

## Accessibility

The Button component is designed with accessibility in mind:

- Proper disabled attribute management
- Keyboard navigation support
- Contrast-compliant text colors
- Screen reader friendly

## Examples

### Primary Button

```javascript
const primaryButton = Button({
  text: 'Primary Action',
  variant: 'primary',
  onClick: () => console.log('Primary action'),
});
```

### Small Danger Button

```javascript
const dangerButton = Button({
  text: 'Delete',
  variant: 'danger',
  size: 'sm',
  onClick: () => console.log('Danger action'),
});
```

### Disabled Button

```javascript
const disabledButton = Button({
  text: 'Unavailable',
  disabled: true,
});
```

### Text Button

```javascript
const textButton = Button({
  text: 'Learn More',
  variant: 'text',
  onClick: () => console.log('Text button clicked'),
});
```
