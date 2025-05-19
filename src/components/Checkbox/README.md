# Checkbox Component

The Checkbox component provides a customizable, accessible checkbox input with various states, validation, and styling options.

## Usage

```javascript
import { Checkbox } from '@svarog-ui/core';

// Create a basic checkbox
const myCheckbox = Checkbox({
  label: 'Accept terms and conditions',
  onChange: (event, checked) => console.log('Checked:', checked),
});

// Add to DOM
document.body.appendChild(myCheckbox.getElement());
```

## Props

| Prop              | Type     | Default    | Description                                |
| ----------------- | -------- | ---------- | ------------------------------------------ |
| label             | string   | (Required) | Checkbox label text                        |
| id                | string   | null       | HTML ID attribute                          |
| name              | string   | null       | Input name attribute                       |
| checked           | boolean  | false      | Whether checkbox is checked                |
| required          | boolean  | false      | Whether checkbox is required               |
| disabled          | boolean  | false      | Whether checkbox is disabled               |
| className         | string   | ''         | Additional CSS classes                     |
| onChange          | function | null       | Change event handler                       |
| validationMessage | string   | null       | Custom validation message                  |
| showValidation    | boolean  | true       | Whether to show validation messages        |
| indeterminate     | boolean  | false      | Whether checkbox is in indeterminate state |

## Methods

### getElement()

Returns the checkbox container DOM element.

```javascript
const checkboxElement = myCheckbox.getElement();
```

### setChecked(isChecked)

Sets the checkbox checked state.

```javascript
myCheckbox.setChecked(true); // Check
myCheckbox.setChecked(false); // Uncheck
```

### setIndeterminate(isIndeterminate)

Sets the checkbox indeterminate state.

```javascript
myCheckbox.setIndeterminate(true); // Set indeterminate
myCheckbox.setIndeterminate(false); // Clear indeterminate
```

### isChecked()

Returns whether the checkbox is checked.

```javascript
const isChecked = myCheckbox.isChecked();
```

### validate()

Validates the checkbox and updates validation state.

```javascript
const isValid = myCheckbox.validate();
```

### isValid()

Returns whether the checkbox is valid.

```javascript
const isValid = myCheckbox.isValid();
```

### update(props)

Updates multiple checkbox properties at once.

```javascript
myCheckbox.update({
  label: 'Updated label',
  required: true,
  validationMessage: 'This field is required',
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the checkbox.

```javascript
myCheckbox.destroy();
```

## CSS Customization

Checkbox styles can be customized using CSS variables:

```css
:root {
  --checkbox-bg: #ffffff;
  --checkbox-border: 1px solid #cbd5e0;
  --checkbox-radius: 4px;
  --checkbox-size: 20px;
  --checkbox-color: #2d3748;
  --checkbox-indicator-margin: 8px;
  --checkbox-font-size: 16px;
  --checkbox-font-family: inherit;
  --checkbox-margin-bottom: 12px;

  /* Hover state */
  --checkbox-hover-border-color: #a0aec0;

  /* Checked state */
  --checkbox-checked-bg: #3182ce;
  --checkbox-checked-border-color: #3182ce;

  /* Focus state */
  --checkbox-focus-shadow: 0 0 0 3px rgba(49, 130, 206, 0.25);

  /* Disabled state */
  --checkbox-disabled-bg: #edf2f7;
  --checkbox-disabled-border-color: #e2e8f0;
  --checkbox-disabled-color: #a0aec0;

  /* Validation states */
  --checkbox-valid-border-color: #48bb78;
  --checkbox-invalid-border-color: #e53e3e;
  --checkbox-validation-color: #e53e3e;
  --checkbox-valid-color: #48bb78;
  --checkbox-validation-font-size: 14px;
  --checkbox-required-color: #e53e3e;

  /* Indeterminate state */
  --checkbox-indeterminate-bg: #3182ce;
  --checkbox-indeterminate-border-color: #3182ce;
  --checkbox-indeterminate-width: 10px;
  --checkbox-indeterminate-height: 2px;

  /* Indicator (checkmark) */
  --checkbox-indicator-width: 6px;
  --checkbox-indicator-height: 10px;
}
```

## Examples

### Basic Checkbox

```javascript
const checkbox = Checkbox({
  label: 'Subscribe to newsletter',
  onChange: (event, checked) => console.log('Subscribed:', checked),
});
```

### Checked Checkbox

```javascript
const checkbox = Checkbox({
  label: 'Pre-selected option',
  checked: true,
});
```

### Required Checkbox with Validation

```javascript
const checkbox = Checkbox({
  label: 'I agree to the terms and conditions',
  required: true,
  validationMessage: 'You must agree to the terms and conditions',
});

// Validate before form submission
const isValid = checkbox.validate();
```

### Indeterminate Checkbox (Parent of other checkboxes)

```javascript
const parentCheckbox = Checkbox({
  label: 'Select all options',
  onChange: (event, checked) => {
    // Update children checkboxes
    childCheckboxes.forEach((cb) => cb.setChecked(checked));
  },
});

// Set parent to indeterminate when some children are checked
parentCheckbox.setIndeterminate(true);
```

### Disabled Checkbox

```javascript
const checkbox = Checkbox({
  label: 'Unavailable option',
  disabled: true,
});
```

### Checkbox with Custom Styling

```javascript
const checkbox = Checkbox({
  label: 'Custom styled checkbox',
  className: 'custom-checkbox',
});
```

## Accessibility

The Checkbox component follows best practices for accessibility:

- Uses native checkbox inputs
- Properly associates labels with inputs
- Supports keyboard navigation
- Includes aria attributes for validation messages
- Maintains proper color contrast ratios when using theme variables
