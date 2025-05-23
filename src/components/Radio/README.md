# Radio Component

A customizable Radio component and RadioGroup implementation for building accessible form controls.

## Table of Contents

1. [Overview](#overview)
2. [Usage](#usage)
3. [API Reference](#api-reference)
   - [Radio](#radio)
   - [RadioGroup](#radiogroup)
4. [Examples](#examples)
5. [CSS Customization](#css-customization)
6. [Accessibility](#accessibility)
7. [Best Practices](#best-practices)

## Overview

The Radio component provides a styled, accessible alternative to the native HTML radio input. It follows WAI-ARIA best practices and supports keyboard navigation, custom styling, and form integration.

The RadioGroup component combines multiple radio buttons into a group with support for validation, keyboard navigation, and consistent styling.

## Usage

### Basic Radio Button

```javascript
import { Radio } from 'path/to/components/Radio';

const myRadio = Radio({
  label: 'My Option',
  value: 'option1',
  name: 'options',
  onChange: (event, value) => console.log('Selected:', value),
});

// Add to the DOM
document.querySelector('#container').appendChild(myRadio.getElement());
```

### Radio Group

```javascript
import { RadioGroup } from 'path/to/components/Radio';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

const myRadioGroup = RadioGroup({
  options,
  name: 'options',
  legend: 'Select an option',
  onChange: (event, value) => console.log('Selected:', value),
});

// Add to the DOM
document.querySelector('#container').appendChild(myRadioGroup.getElement());
```

## API Reference

### Radio

#### Props

| Prop        | Type       | Default     | Description                             |
| ----------- | ---------- | ----------- | --------------------------------------- |
| `label`     | `string`   | _Required_  | Text label for the radio button         |
| `value`     | `string`   | _Required_  | Value of the radio button               |
| `id`        | `string`   | `undefined` | ID attribute for the input element      |
| `name`      | `string`   | `undefined` | Name attribute for form submission      |
| `checked`   | `boolean`  | `false`     | Whether the radio is initially checked  |
| `required`  | `boolean`  | `false`     | Whether the radio is required           |
| `disabled`  | `boolean`  | `false`     | Whether the radio is disabled           |
| `className` | `string`   | `''`        | Additional CSS class names              |
| `onChange`  | `Function` | `undefined` | Handler called when radio state changes |

#### Methods

| Method                | Parameters | Return        | Description                          |
| --------------------- | ---------- | ------------- | ------------------------------------ |
| `getElement()`        | None       | `HTMLElement` | Returns the root DOM element         |
| `getValue()`          | None       | `string`      | Returns the radio value              |
| `isChecked()`         | None       | `boolean`     | Returns whether the radio is checked |
| `setChecked(checked)` | `boolean`  | `Radio`       | Sets the checked state               |
| `update(props)`       | `Object`   | `Radio`       | Updates component with new props     |
| `destroy()`           | None       | `undefined`   | Cleans up resources                  |

### RadioGroup

#### Props

| Prop                | Type            | Default      | Description                                       |
| ------------------- | --------------- | ------------ | ------------------------------------------------- |
| `options`           | `Array<Object>` | _Required_   | Array of radio options                            |
| `name`              | `string`        | _Required_   | Name attribute for form submission                |
| `value`             | `string`        | `undefined`  | Currently selected value                          |
| `defaultValue`      | `string`        | `undefined`  | Initially selected value (if value not provided)  |
| `defaultActiveTab`  | `string`        | `undefined`  | **Deprecated:** Use `defaultValue` instead        |
| `legend`            | `string`        | `undefined`  | Group label/title                                 |
| `required`          | `boolean`       | `false`      | Whether selection is required                     |
| `disabled`          | `boolean`       | `false`      | Whether the group is disabled                     |
| `className`         | `string`        | `''`         | Additional CSS class names                        |
| `onChange`          | `Function`      | `undefined`  | Handler called on selection changes               |
| `layout`            | `string`        | `'vertical'` | Layout direction (`'vertical'` or `'horizontal'`) |
| `validationMessage` | `string`        | `undefined`  | Custom validation message                         |
| `showValidation`    | `boolean`       | `true`       | Whether to show validation messages               |

The `options` array should contain objects with at least:

- `label`: The option text
- `value`: The option value

Optional option properties:

- `id`: Custom ID for the radio input
- `disabled`: Whether this specific option is disabled

#### Methods

| Method            | Parameters | Return        | Description                      |
| ----------------- | ---------- | ------------- | -------------------------------- |
| `getElement()`    | None       | `HTMLElement` | Returns the root DOM element     |
| `getValue()`      | None       | `string`      | Returns the selected value       |
| `setValue(value)` | `string`   | `RadioGroup`  | Sets the selected value          |
| `validate()`      | None       | `boolean`     | Validates the radio group        |
| `update(props)`   | `Object`   | `RadioGroup`  | Updates component with new props |
| `destroy()`       | None       | `undefined`   | Cleans up resources              |

## Examples

### Single Radio Button

```javascript
const radio = Radio({
  label: 'Subscribe to newsletter',
  value: 'subscribe',
  name: 'subscription',
  onChange: (event, value) => {
    if (event.target.checked) {
      console.log('Subscribed!');
    }
  },
});
```

### Required Radio Group with Validation

```javascript
const options = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Maybe', value: 'maybe' },
];

const radioGroup = RadioGroup({
  options,
  name: 'answer',
  legend: 'Will you attend?',
  required: true,
  validationMessage: 'Please indicate your attendance',
  onChange: (event, value) => console.log('Response:', value),
});

// Manual validation
document.querySelector('#submit-btn').addEventListener('click', () => {
  if (radioGroup.validate()) {
    console.log('Form is valid!');
  }
});
```

### Horizontal Layout with Preselected Value

```javascript
const options = [
  { label: 'Credit Card', value: 'credit' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Bank Transfer', value: 'bank' },
];

const paymentMethods = RadioGroup({
  options,
  name: 'payment',
  legend: 'Payment Method',
  layout: 'horizontal',
  value: 'credit', // Preselected
  onChange: (event, value) => console.log('Method:', value),
});
```

### Using defaultValue

```javascript
const options = [
  { label: 'Standard (Free)', value: 'standard' },
  { label: 'Express ($10)', value: 'express' },
  { label: 'Next Day ($25)', value: 'next_day' },
];

const shipping = RadioGroup({
  options,
  name: 'shipping',
  legend: 'Shipping Method',
  defaultValue: 'standard', // Initial value
  onChange: (event, value) => console.log('Shipping:', value),
});
```

### Mixed Disabled Options

```javascript
const options = [
  { label: 'Standard (Free)', value: 'standard' },
  { label: 'Express ($10)', value: 'express' },
  { label: 'Next Day ($25)', value: 'next_day', disabled: true },
];

const shipping = RadioGroup({
  options,
  name: 'shipping',
  legend: 'Shipping Method',
  onChange: (event, value) => console.log('Shipping:', value),
});
```

## CSS Customization

The Radio component and RadioGroup can be customized using CSS variables:

### Radio Variables

```css
:root {
  --radio-size: 20px;
  --radio-inner-size: 12px;
  --radio-indicator-margin: 8px;
  --radio-margin-bottom: 8px;
  --radio-padding: 4px;
  --radio-transition: all 0.2s ease-in-out;

  /* Colors */
  --radio-bg: #ffffff;
  --radio-border: 1px solid #6c757d;
  --radio-hover-border-color: #495057;
  --radio-checked-color: #007bff;
  --radio-checked-border-color: #007bff;
  --radio-disabled-bg: #e9ecef;
  --radio-disabled-border-color: #ced4da;
  --radio-disabled-color: #6c757d;
  --radio-disabled-checked-color: #adb5bd;
  --radio-color: #212529;
  --radio-required-color: #dc3545;
  --radio-focus-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);

  /* Typography */
  --radio-font-size: 16px;
  --radio-font-family: sans-serif;
}
```

### RadioGroup Variables

```css
:root {
  --radio-group-margin-bottom: 16px;
  --radio-group-padding: 8px;
  --radio-group-border: 1px solid #dee2e6;
  --radio-group-radius: 4px;
  --radio-group-gap: 8px;

  /* Legend styling */
  --radio-group-legend-font-size: 16px;
  --radio-group-legend-color: #212529;
  --radio-group-font-family: sans-serif;
  --radio-group-legend-font-weight: 500;
  --radio-group-legend-padding: 0 8px;
  --radio-group-legend-margin-bottom: 8px;

  /* Validation states */
  --radio-group-required-color: #dc3545;
  --radio-group-valid-border-color: #28a745;
  --radio-group-invalid-border-color: #dc3545;
  --radio-group-validation-font-size: 14px;
  --radio-group-validation-color: #dc3545;
  --radio-group-valid-color: #28a745;

  /* Disabled state */
  --radio-group-disabled-opacity: 0.7;
  --radio-group-disabled-bg: #f8f9fa;
}
```

## Accessibility

The Radio and RadioGroup components follow accessibility best practices:

- Proper use of `fieldset` and `legend` elements for groups
- ARIA attributes for validation states and messages
- Keyboard navigation support
- Focus states with customizable styling
- Screen reader-friendly label association

Keyboard support:

- `Tab`: Move focus to the selected radio button within the group
- `Space`: Select the focused radio button
- `Arrow Keys`: When focus is on a radio button, move to and select the next/previous radio button in the group

## Best Practices

1. **Always provide labels**: Each radio button should have a descriptive label.

2. **Use RadioGroup for related options**: Group related radio buttons with RadioGroup to ensure proper association and navigation.

3. **Validate at appropriate times**: Trigger validation on submit or on blur, not on every change, to reduce user frustration.

4. **Use clear validation messages**: Validation messages should be specific about what the user needs to do.

5. **Provide preselected values when appropriate**: For options with a logical default, preselect it using `value` or `defaultValue` to reduce user effort.

6. **Use horizontal layout only for small option sets**: Vertical layouts are easier to scan for most users, especially on mobile devices.

7. **Indicate required fields**: Use the `required` prop and provide visual indication for required fields.

8. **Clean up resources**: Always call the `destroy()` method when removing components to prevent memory leaks.

9. **Size appropriately for touch targets**: Ensure radio buttons and their labels are large enough for comfortable touch interaction on mobile devices.

10. **Test with keyboard navigation**: Ensure your radio implementation works properly with keyboard-only navigation.
