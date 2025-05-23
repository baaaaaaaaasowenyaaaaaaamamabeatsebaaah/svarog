# Input Component

The Input component provides a flexible, accessible input field with enhanced custom styling and validation capabilities.

## Usage

```javascript
import { Input } from '@svarog-ui/core';

// Create a basic input
const myInput = Input({
  placeholder: 'Enter your name',
  onChange: (event, value) => console.log('Input changed:', value),
});

// Add to DOM
document.body.appendChild(myInput.getElement());
```

## Props

| Prop           | Type     | Default   | Description                                             |
| -------------- | -------- | --------- | ------------------------------------------------------- |
| type           | string   | 'text'    | Input type (text, email, password, number, search, etc) |
| id             | string   | undefined | HTML id attribute                                       |
| name           | string   | undefined | Input name for form submission                          |
| value          | string   | ''        | Input value                                             |
| defaultValue   | string   | undefined | Initial value (used if value not provided)              |
| placeholder    | string   | ''        | Placeholder text                                        |
| required       | boolean  | false     | Whether input is required                               |
| disabled       | boolean  | false     | Whether input is disabled                               |
| readonly       | boolean  | false     | Whether input is read-only                              |
| pattern        | string   | undefined | Validation pattern regex                                |
| minLength      | number   | undefined | Minimum input length                                    |
| maxLength      | number   | undefined | Maximum input length                                    |
| className      | string   | ''        | Additional CSS classes                                  |
| onChange       | function | undefined | Change event handler: (event, value) => void            |
| onFocus        | function | undefined | Focus event handler: (event) => void                    |
| onBlur         | function | undefined | Blur event handler: (event) => void                     |
| error          | boolean  | null      | Error state (true = error, false = valid, null = unset) |
| errorMessage   | string   | ''        | Error message to display when validation fails          |
| loading        | boolean  | false     | Whether the input is in a loading state                 |
| showValidation | boolean  | true      | Whether to show validation message                      |

## Methods

### getElement()

Returns the input container DOM element.

```javascript
const inputElement = myInput.getElement();
```

### getValue()

Returns the current input value.

```javascript
const value = myInput.getValue();
```

### setValue(value)

Updates the input value.

```javascript
myInput.setValue('New text');
```

### validate()

Validates the input against its constraints (required, pattern, etc).

```javascript
const isValid = myInput.validate();
if (!isValid) {
  console.log('Input is invalid');
}
```

### update(props)

Updates multiple input properties at once.

```javascript
myInput.update({
  disabled: true,
  value: 'Updated value',
  errorMessage: 'Custom error message',
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the input.

```javascript
myInput.destroy();
```

## Special Input Types

### Password Input

Password inputs include a toggle button to show/hide the password:

```javascript
const passwordInput = Input({
  type: 'password',
  placeholder: 'Enter password',
});
```

### Search Input

Search inputs include a clear button that appears when the input has a value:

```javascript
const searchInput = Input({
  type: 'search',
  placeholder: 'Search...',
});
```

### Number Input

Number inputs include increment/decrement buttons:

```javascript
const numberInput = Input({
  type: 'number',
  placeholder: 'Enter amount',
});
```

## Validation

Enable validation by using the `required`, `pattern`, or `minLength`/`maxLength` props. You can provide a custom validation message with the `errorMessage` prop.

```javascript
const emailInput = Input({
  type: 'email',
  required: true,
  pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
  errorMessage: 'Please enter a valid email address',
});

// Trigger validation manually
const isValid = emailInput.validate();
```

## CSS Customization

Input styles can be customized using CSS variables:

```css
:root {
  --input-bg: #ffffff;
  --input-color: #333333;
  --input-border: 1px solid #cccccc;
  --input-radius: 4px;
  --input-padding: 0.5rem 1rem;
  --input-font-size: 1rem;
  --input-transition: all 0.2s ease;

  /* Focus state */
  --input-focus-border-color: #3182ce;
  --input-focus-shadow: 0 0 0 3px rgba(49, 130, 206, 0.25);

  /* Validation states */
  --input-valid-border-color: #48bb78;
  --input-invalid-border-color: #e53e3e;

  /* Other states and variants */
  /* (see base theme files for all variables) */
}
```

## Accessibility

The Input component is designed with accessibility in mind:

- Proper labeling support through ID attributes
- Keyboard navigation support
- Screen reader announcements for validation errors
- Visual AND programmatic state indication (disabled, invalid, etc.)
- Maintains proper focus handling

## Legacy Props Support

For backward compatibility, the component supports the following legacy props:

| Legacy Prop       | New Prop     | Notes                       |
| ----------------- | ------------ | --------------------------- |
| isValid           | error        | error is inverse of isValid |
| validationMessage | errorMessage | Use errorMessage instead    |
| isLoading         | loading      | Use loading instead         |

Using legacy props will log deprecation warnings to the console.
