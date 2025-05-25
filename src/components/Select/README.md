# Select Component

The Select component provides a customizable, accessible dropdown selection with support for single and multiple selections, option groups, validation, and **asynchronous data loading**. **Styles are automatically injected - no CSS imports required.**

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

| Prop              | Type            | Default                | Description                                        |
| ----------------- | --------------- | ---------------------- | -------------------------------------------------- |
| options           | Array           | []                     | Array of option objects with value and label props |
| **loading**       | boolean         | false                  | **Whether select is in loading state**             |
| **loadingText**   | string          | 'Loading options...'   | **Text shown during loading**                      |
| **emptyText**     | string          | 'No options available' | **Text shown when no options available**           |
| **onLoadOptions** | function        | null                   | **Async function to load options automatically**   |
| id                | string          | null                   | ID attribute for the select element                |
| name              | string          | null                   | Name attribute for form submission                 |
| value             | string/string[] | ''                     | Current value(s) (array for multiple selects)      |
| **defaultValue**  | string/string[] | ''                     | **Initial value(s) (alias for value)**             |
| placeholder       | string          | 'Select an option'     | Placeholder text when no option selected           |
| required          | boolean         | false                  | Whether selection is required                      |
| disabled          | boolean         | false                  | Whether select is disabled                         |
| multiple          | boolean         | false                  | Allow multiple selections                          |
| className         | string          | ''                     | Additional CSS classes                             |
| onChange          | function        | null                   | Change event handler (params: event, value)        |
| onFocus           | function        | null                   | Focus event handler                                |
| onBlur            | function        | null                   | Blur event handler                                 |
| validationMessage | string          | ''                     | Message shown for invalid selections               |
| showValidation    | boolean         | true                   | Whether to show validation styling                 |

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

### **setLoading(loading, loadingText)**

**Controls the loading state of the select.**

```javascript
// Show loading state
mySelect.setLoading(true, 'Fetching data...');

// Clear loading state
mySelect.setLoading(false);
```

### **loadOptions(optionsFn)**

**Loads options asynchronously.**

```javascript
// Load options with custom function
await mySelect.loadOptions(async () => {
  const response = await fetch('/api/options');
  return response.json();
});

// Or use the onLoadOptions function if set
await mySelect.loadOptions();
```

### update(props)

Updates multiple select properties at once.

```javascript
mySelect.update({
  value: 'option3',
  disabled: true,
  loading: false,
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
  true // Second parameter: try to keep current value if it exists in new options
);
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

## **Standardized Props**

This component follows the project's Props Standardization Guide:

- **Loading State**: Uses standard `loading` prop (boolean)
- **Value Management**: Uses standard `value` prop with added `defaultValue` alias
- **Event Handlers**: Uses standard `onChange`, `onFocus`, and `onBlur` handlers

## **Async Data Loading Examples**

### **Auto-loading on Creation**

```javascript
const select = Select({
  placeholder: 'Select a country',
  loadingText: 'Loading countries...',
  onLoadOptions: async () => {
    const response = await fetch('/api/countries');
    return response.json();
  },
  onChange: (event, value) => console.log('Selected:', value),
});
```

### **Manual Loading Control**

```javascript
const select = Select({
  options: [], // Start empty
  placeholder: 'Click button to load options',
  loadingText: 'Fetching data...',
  emptyText: 'No data loaded yet',
});

// Later, trigger loading manually
async function loadData() {
  try {
    await select.loadOptions(async () => {
      const response = await fetch('/api/data');
      return response.json();
    });
  } catch (error) {
    console.error('Failed to load:', error);
  }
}
```

### **Dependent Selects**

```javascript
const countrySelect = Select({
  placeholder: 'Select country',
  onLoadOptions: () => fetchCountries(),
  onChange: async (event, countryCode) => {
    if (countryCode) {
      await citySelect.loadOptions(() => fetchCities(countryCode));
    } else {
      citySelect.updateOptions([]);
    }
  },
});

const citySelect = Select({
  placeholder: 'Select city',
  emptyText: 'Please select a country first',
});
```

### **Error Handling**

```javascript
const select = Select({
  placeholder: 'Select option',
  loadingText: 'Loading...',
  emptyText: 'Failed to load options',
});

try {
  await select.loadOptions(async () => {
    const response = await fetch('/api/options');
    if (!response.ok) throw new Error('Network error');
    return response.json();
  });
} catch (error) {
  console.error('Load failed:', error);
  // Select will show emptyText
}
```

## **Loading States**

The component supports three distinct states:

1. **Normal**: Options available, ready for interaction
2. **Loading**: Fetching options, shows loading indicator
3. **Empty**: No options available (different from loading)

### **Visual Indicators**

- Loading state shows a spinning indicator instead of the dropdown arrow
- Custom text for loading and empty states
- Disabled interaction during loading
- Proper ARIA attributes for accessibility

## CSS Customization

**Styles are automatically injected - no CSS imports required.** Select styles can be customized using CSS variables:

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

  /* **Loading States** */
  --select-loading-color: #666;
  --select-loading-size: 16px;
  --select-loading-border-color: #e0e0e0;
  --select-loading-active-color: #0066ff;
  --select-empty-color: #999;

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
- **Loading state announcements with `aria-busy`**
- Focus management
- Proper disabled state handling

## **Migration from Previous Version**

All existing code continues to work without changes:

```javascript
// ✅ This still works exactly as before
const select = Select({
  options: staticOptions,
  onChange: handler,
});
```

**New features are opt-in:**

```javascript
// ✨ New async capabilities
const select = Select({
  onLoadOptions: fetchFromAPI,
  loadingText: 'Loading...',
});
```

## **CSS Injection Implementation**

This component now uses automatic CSS injection:

✅ **Zero CSS Import Errors** - Works in Node.js, bundlers, everywhere  
✅ **Zero Configuration** - Users just import and use components  
✅ **SSR Compatible** - Styles inject safely in browser only  
✅ **Tree Shakeable** - Only loads styles for used components  
✅ **Performance Optimized** - Styles are cached and deduped  
✅ **Developer Experience** - No separate CSS imports to remember

### **Before (Required CSS Import)**

```javascript
import './Select.css'; // ❌ This caused Node.js errors
import Select from './Select.js';
```

### **After (Automatic CSS Injection)**

```javascript
import { Select } from '@svarog-ui/core'; // ✅ Just works everywhere
```

The component automatically injects its styles when first used. Styles are cached and deduped, so multiple instances share the same CSS injection.

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

### Multiple Select with DefaultValue

```javascript
const multiSelect = Select({
  options: [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ],
  multiple: true,
  defaultValue: ['red', 'blue'], // Using standardized prop
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
