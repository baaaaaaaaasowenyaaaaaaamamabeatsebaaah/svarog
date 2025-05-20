# Select Component

The Select component provides a customizable, accessible dropdown selection with support for single and multiple selections, option groups, and validation.

## Usage

```javascript
import { Select } from '@svarog-ui/core';

// Create a basic select
const mySelect = Select({
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  onChange: (event, value) => console.log('Selected value:', value),
});

// Add to DOM
document.body.appendChild(mySelect.getElement());
```

## Props

| Prop              | Type            | Default            | Description                                        |
| ----------------- | --------------- | ------------------ | -------------------------------------------------- |
| options           | Array           | (Required)         | Array of option objects with value and label props |
| id                | string          | null               | ID attribute for the select element                |
| name              | string          | null               | Name attribute for form submission                 |
| value             | string/string[] | ''                 | Current value(s) (array for multiple selects)      |
| placeholder       | string          | 'Select an option' | Placeholder text when no option selected           |
| required          | boolean         | false              | Whether selection is required                      |
| disabled          | boolean         | false              | Whether select is disabled                         |
| multiple          | boolean         | false              | Allow multiple selections                          |
| className         | string          | ''                 | Additional CSS classes                             |
| onChange          | function        | null               | Change event handler (params: event, value)        |
| onFocus           | function        | null               | Focus event handler                                |
| onBlur            | function        | null               | Blur event handler                                 |
| validationMessage | string          | ''                 | Message shown for invalid selections               |
| showValidation    | boolean         | true               | Whether to show validation styling                 |

### Option Object Properties

| Property | Type    | Description                                        |
| -------- | ------- | -------------------------------------------------- |
| value    | string  | Option value (required)                            |
| label    | string  | Display text (falls back to value if not provided) |
| disabled | boolean | Whether the option is disabled/unselectable        |

## Methods

### getElement()

Returns the select DOM element.

```javascript
const selectElement = mySelect.getElement();
```

### getValue()

Gets the current value(s).

```javascript
const value = mySelect.getValue(); // Returns string or array for multiple selects
```

### setValue(value)

Updates the selected value(s).

```javascript
// For single select
mySelect.setValue('option2');

// For multiple select
mySelect.setValue(['option1', 'option3']);
```

### update(props)

Updates multiple select properties at once.

```javascript
mySelect.update({
  value: 'option3',
  disabled: true,
  validationMessage: 'Custom message',
});
```

### updateOptions(options, keepValue)

Updates the options array.

```javascript
mySelect.updateOptions(
  [
    { value: 'new1', label: 'New Option 1' },
    { value: 'new2', label: 'New Option 2' },
  ],
  true
); // Second parameter: try to keep current value if it exists in new options
```

### validate()

Validates the selection and updates UI. Returns validation result.

```javascript
const isValid = mySelect.validate();
```

### destroy()

Cleans up event listeners and resources. Call when removing the select.

```javascript
mySelect.destroy();
```

## CSS Customization

Select styles can be customized using CSS variables:

```css
:root {
  /* Base Styling */
  --select-bg: #fff;
  --select-color: #333;
  --select-border: 1px solid #ccc;
  --select-radius: 4px;
  --select-padding: 0.5rem 1rem;
  --select-font-size: 1rem;
  --select-font-family: sans-serif;
  --select-transition: all 0.2s ease;

  /* Dropdown */
  --select-dropdown-bg: #fff;
  --select-dropdown-border-color: #ccc;
  --select-dropdown-max-height: 300px;

  /* Options */
  --select-option-padding: 0.5rem 1rem;
  --select-option-hover-bg: #f5f5f5;
  --select-option-selected-bg: #e6f7ff;

  /* States */
  --select-hover-border-color: #999;
  --select-focus-border-color: #0066ff;
  --select-disabled-bg: #f5f5f5;
  --select-valid-border-color: #4caf50;
  --select-invalid-border-color: #f44336;
}
```

## Accessibility

The Select component is designed with accessibility in mind:

- Native `<select>` element for screen readers
- Keyboard navigation support (arrow keys, enter, escape)
- ARIA attributes for custom dropdown UI
- Focus management
- Proper disabled state handling

## Examples

### Single Select with Validation

```javascript
const validatedSelect = Select({
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  required: true,
  validationMessage: 'Please select an option',
  onChange: (event, value) => {
    // Validate on change
    validatedSelect.validate();
  },
});
```

### Multiple Select

```javascript
const multiSelect = Select({
  options: [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'yellow', label: 'Yellow' },
  ],
  multiple: true,
  value: ['red', 'blue'], // Initial values
  onChange: (event, values) => console.log('Selected colors:', values),
});
```

### Option Groups

```javascript
const groupedSelect = Select({
  options: [
    { value: 'fruits', label: 'Fruits', disabled: true }, // Group header
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'vegetables', label: 'Vegetables', disabled: true }, // Group header
    { value: 'carrot', label: 'Carrot' },
    { value: 'broccoli', label: 'Broccoli' },
  ],
  placeholder: 'Select a food item',
});
```
