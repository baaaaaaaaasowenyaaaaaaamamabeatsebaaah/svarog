# Checkbox Component

The Checkbox component provides a customizable, accessible checkbox input with various states, validation, and styling options. It now uses CSS injection for seamless integration across different environments and supports HTML elements in labels for complex content like privacy policy links.

## Features

✅ **Zero Configuration** - No CSS imports needed, styles are automatically injected
✅ **SSR Compatible** - Styles inject safely in browser environments only
✅ **Tree Shakeable** - Only loads styles when component is used
✅ **HTML Label Support** - Labels can contain links, icons, or any HTML element
✅ **Standardized Props** - Supports both `checked` and `value` props for consistency
✅ **Smart Validation** - Error messages only appear after validation is triggered
✅ **Loading States** - Visual loading indicators with spinner
✅ **Indeterminate State** - Support for tri-state checkboxes
✅ **Disabled Checked State** - Properly shows checkmark even when disabled
✅ **Accessibility** - Full ARIA support and keyboard navigation

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

| Prop              | Type                  | Default    | Description                                |
| ----------------- | --------------------- | ---------- | ------------------------------------------ |
| label             | string \| HTMLElement | (Required) | Checkbox label text or HTML element        |
| id                | string                | null       | HTML ID attribute                          |
| name              | string                | null       | Input name attribute                       |
| checked           | boolean               | false      | Whether checkbox is checked                |
| value             | boolean               | false      | Alias for checked (standardized naming)    |
| defaultValue      | boolean               | false      | Alias for initial checked state            |
| required          | boolean               | false      | Whether checkbox is required               |
| disabled          | boolean               | false      | Whether checkbox is disabled               |
| loading           | boolean               | false      | Whether checkbox is in loading state       |
| isLoading         | boolean               | false      | Alias for loading (deprecated)             |
| className         | string                | ''         | Additional CSS classes                     |
| onChange          | function              | null       | Change event handler                       |
| validationMessage | string                | null       | Custom validation message                  |
| showValidation    | boolean               | true       | Whether to show validation messages        |
| indeterminate     | boolean               | false      | Whether checkbox is in indeterminate state |

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

### setValue(value)

Alias for setChecked - sets the checkbox checked state (standardized naming).

```javascript
myCheckbox.setValue(true); // Check
myCheckbox.setValue(false); // Uncheck
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

### getValue()

Alias for isChecked - returns whether the checkbox is checked (standardized naming).

```javascript
const value = myCheckbox.getValue();
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

The component uses CSS injection for styling. You can customize the appearance using CSS variables. Styles are automatically injected when the component is first used.

### CSS Variables

```css
:root {
  /* Basic styling */
  --checkbox-bg: #ffffff;
  --checkbox-border: 1px solid #cbd5e0;
  --checkbox-radius: 4px;
  --checkbox-size: 20px;
  --checkbox-color: #2d3748;
  --checkbox-indicator-margin: 8px;
  --checkbox-font-size: 16px;
  --checkbox-font-family: inherit;
  --checkbox-margin-bottom: 12px;
  --checkbox-padding: 4px;
  --checkbox-transition: all 0.2s ease-in-out;

  /* Hover state */
  --checkbox-hover-border-color: #a0aec0;

  /* Checked state */
  --checkbox-checked-bg: #3182ce;
  --checkbox-checked-border-color: #3182ce;

  /* Focus state */
  --checkbox-focus-shadow: 0 0 0 3px rgba(49, 130, 206, 0.25);

  /* Loading state */
  --checkbox-loading-bg: #edf2f7;
  --checkbox-loading-border-color: #e2e8f0;
  --checkbox-loading-color: #a0aec0;
  --checkbox-loading-spinner-color: #3182ce;
  --checkbox-loading-checked-bg: #3182ce; /* When loading and checked */
  --checkbox-loading-checked-border-color: #3182ce;

  /* Disabled state */
  --checkbox-disabled-bg: #edf2f7;
  --checkbox-disabled-border-color: #e2e8f0;
  --checkbox-disabled-color: #a0aec0;
  --checkbox-disabled-checked-bg: #3182ce; /* When disabled and checked */
  --checkbox-disabled-checked-border-color: #3182ce;

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

  /* Spacing variables (if not defined elsewhere) */
  --space-1: 4px;
  --space-5: 20px;
}
```

### Custom Styling Example

```javascript
// Apply custom theme to specific checkbox
const customCheckbox = Checkbox({
  label: 'Custom styled checkbox',
  className: 'my-custom-checkbox',
});

// Add custom CSS variables
document.documentElement.style.setProperty('--checkbox-checked-bg', '#10b981');
document.documentElement.style.setProperty(
  '--checkbox-checked-border-color',
  '#10b981'
);
```

## Examples

### Basic Checkbox

```javascript
const checkbox = Checkbox({
  label: 'Subscribe to newsletter',
  onChange: (event, checked) => console.log('Subscribed:', checked),
});
```

### Using Standardized Props

```javascript
// Using value instead of checked
const checkbox = Checkbox({
  label: 'Accept terms',
  value: true, // Same as checked: true
  onChange: (event, checked) => console.log('Accepted:', checked),
});

// Reading value
const isAccepted = checkbox.getValue(); // Same as isChecked()

// Setting value
checkbox.setValue(false); // Same as setChecked(false)
```

### Checkbox with Link in Label

```javascript
// Create label with privacy policy link
const labelElement = document.createElement('span');
labelElement.innerHTML =
  'I agree to the <a href="/privacy" target="_blank">Privacy Policy</a>';

const checkbox = Checkbox({
  label: labelElement,
  required: true,
  onChange: (event, checked) => console.log('Privacy accepted:', checked),
});
```

### Checkbox with Multiple Links (German Example)

```javascript
// Create complex label with multiple links
const labelContent = document.createElement('span');

const text1 = document.createTextNode('Ich stimme der ');
const privacyLink = document.createElement('a');
privacyLink.href = '/datenschutz';
privacyLink.target = '_blank';
privacyLink.textContent = 'Datenschutzerklärung';

const text2 = document.createTextNode(' und den ');
const termsLink = document.createElement('a');
termsLink.href = '/agb';
termsLink.target = '_blank';
termsLink.textContent = 'AGB';

const text3 = document.createTextNode(' zu.');

labelContent.appendChild(text1);
labelContent.appendChild(privacyLink);
labelContent.appendChild(text2);
labelContent.appendChild(termsLink);
labelContent.appendChild(text3);

const checkbox = Checkbox({
  label: labelContent,
  required: true,
  validationMessage: 'Sie müssen den Datenschutzbestimmungen zustimmen',
});
```

### Safe HTML Content Creation

For security, always create HTML elements programmatically rather than using innerHTML with user content:

```javascript
// ✅ Safe approach - create elements programmatically
const createSafeLabel = (text, linkText, linkUrl) => {
  const label = document.createElement('span');
  label.appendChild(document.createTextNode(text));

  const link = document.createElement('a');
  link.href = linkUrl;
  link.textContent = linkText;
  link.target = '_blank';

  label.appendChild(link);
  return label;
};

const checkbox = Checkbox({
  label: createSafeLabel('I agree to the ', 'Terms', '/terms'),
});

// ❌ Avoid using innerHTML with user content
// const unsafeLabel = document.createElement('span');
// unsafeLabel.innerHTML = userContent; // Potential XSS risk
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

### Smart Validation UX

The checkbox component implements a smart validation pattern where error messages only appear after validation is explicitly triggered:

```javascript
// Create required checkbox - initially shows only asterisk (*)
const checkbox = Checkbox({
  label: 'Accept privacy policy',
  required: true,
  validationMessage: 'Please accept our privacy policy to continue',
});

// No error message visible at this point
document.body.appendChild(checkbox.getElement());

// User clicks submit without checking the box
submitButton.addEventListener('click', () => {
  if (!checkbox.validate()) {
    // NOW the error message appears with animation
    // Red border also becomes visible
    console.log('Please complete required fields');
  } else {
    // Form submission logic
  }
});

// Error automatically clears when user checks the box
// No need to call validate() again
```

This approach provides:

- **Clean initial state**: Only shows asterisk (\*) for required fields
- **Progressive disclosure**: Errors appear only when relevant
- **Immediate feedback**: Errors clear as soon as the user fixes them
- **Smooth animations**: Error messages slide in gently

### Loading State

```javascript
const checkbox = Checkbox({
  label: 'Processing action',
  loading: true,
  onChange: (event, checked) => console.log('Checked:', checked),
});

// Update loading state
checkbox.update({ loading: false });
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
// Disabled unchecked
const checkbox = Checkbox({
  label: 'Unavailable option',
  disabled: true,
});

// Disabled but checked - checkmark is still visible
const checkedDisabled = Checkbox({
  label: 'Locked selection',
  checked: true,
  disabled: true,
});
```

The disabled state properly handles both checked and unchecked states:

- **Disabled unchecked**: Gray background with no checkmark
- **Disabled checked**: Shows checkmark with reduced opacity (60%) to indicate disabled state
- **Visual clarity**: Users can always see which options are selected, even when disabled

### Newsletter Signup Form

```javascript
// Real-world example with privacy policy consent
const createNewsletterForm = () => {
  const container = document.createElement('div');

  // Create checkbox with privacy link
  const labelContent = document.createElement('span');
  const text = document.createTextNode(
    'I agree to receive newsletters and accept the '
  );
  const privacyLink = document.createElement('a');
  privacyLink.href = '/privacy';
  privacyLink.textContent = 'Privacy Policy';
  privacyLink.style.color = '#3182ce';

  labelContent.appendChild(text);
  labelContent.appendChild(privacyLink);

  const checkbox = Checkbox({
    label: labelContent,
    required: true,
    validationMessage: 'Please accept our privacy policy to subscribe',
  });

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Subscribe';
  submitButton.addEventListener('click', () => {
    if (checkbox.validate()) {
      console.log('Newsletter subscription confirmed!');
    }
  });

  container.appendChild(checkbox.getElement());
  container.appendChild(submitButton);

  return container;
};
```

### Complete Form Example

```javascript
// Comprehensive example showing all features
const createRegistrationForm = () => {
  const form = document.createElement('div');
  form.style.maxWidth = '400px';
  form.style.padding = '20px';

  // Terms checkbox with link
  const termsLabel = document.createElement('span');
  termsLabel.innerHTML =
    'I accept the <a href="/terms" target="_blank">Terms of Service</a>';

  const termsCheckbox = Checkbox({
    label: termsLabel,
    required: true,
    validationMessage: 'You must accept the terms to continue',
  });

  // Marketing checkbox (optional)
  const marketingCheckbox = Checkbox({
    label: 'Send me promotional emails',
    checked: true, // Pre-checked but optional
  });

  // Age verification (disabled after verification)
  const ageCheckbox = Checkbox({
    label: 'I am over 18 years old',
    checked: true,
    disabled: true, // Already verified, can't be changed
  });

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Create Account';
  submitBtn.style.marginTop = '20px';

  submitBtn.addEventListener('click', () => {
    // Validate only triggers error messages
    if (termsCheckbox.validate()) {
      const data = {
        termsAccepted: termsCheckbox.getValue(),
        marketingOptIn: marketingCheckbox.getValue(),
        ageVerified: ageCheckbox.getValue(),
      };
      console.log('Form data:', data);
    }
  });

  // Assemble form
  form.appendChild(termsCheckbox.getElement());
  form.appendChild(marketingCheckbox.getElement());
  form.appendChild(ageCheckbox.getElement());
  form.appendChild(submitBtn);

  return form;
};
```

### Multi-checkbox Management

```javascript
const createCheckboxGroup = (options) => {
  const checkboxes = options.map((option) =>
    Checkbox({
      id: option.id,
      name: 'group',
      label: option.label,
      onChange: (event, checked) => {
        console.log(`${option.label} selected:`, checked);
      },
    })
  );

  const selectAllCheckbox = Checkbox({
    label: 'Select All',
    onChange: (event, checked) => {
      checkboxes.forEach((cb) => cb.setChecked(checked));
    },
  });

  return { selectAllCheckbox, checkboxes };
};
```

## Migration from CSS Import Version

If you're upgrading from a version that required CSS imports:

### Before (CSS imports required)

```javascript
import { Checkbox } from '@svarog-ui/core';
import '@svarog-ui/core/styles/checkbox.css'; // ❌ No longer needed

const checkbox = Checkbox({ label: 'My checkbox' });
```

### After (CSS injection)

```javascript
import { Checkbox } from '@svarog-ui/core';
// ✅ No CSS import needed - styles are automatically injected

const checkbox = Checkbox({ label: 'My checkbox' });
```

## Browser Support

- ✅ **Chrome/Edge**: Full support including CSS injection
- ✅ **Firefox**: Full support including CSS injection
- ✅ **Safari**: Full support including CSS injection
- ✅ **SSR/Node.js**: Graceful degradation (no styles injected on server)
- ✅ **CSP Compliant**: Uses standard style elements, no inline styles

## Accessibility

The Checkbox component follows best practices for accessibility:

- Uses native checkbox inputs for screen reader compatibility
- Properly associates labels with inputs using `<label>` elements
- Supports keyboard navigation (Space to toggle, Tab to navigate)
- Includes ARIA attributes for validation messages (`aria-live="polite"`)
- Maintains proper color contrast ratios when using theme variables
- Loading and disabled states are properly conveyed to assistive technologies
- Required state is indicated both visually (\*) and semantically (`required` attribute)
- HTML labels maintain click targets and accessibility relationships

## Performance

- **CSS Injection**: Styles are injected once per component type and cached
- **Partial Updates**: DOM updates only changed properties, not the entire element
- **Event Delegation**: Efficient event handling with cleanup
- **Memory Management**: Proper cleanup of event listeners and references
- **Bundle Size**: Tree-shakeable - only loads when used
- **HTML Labels**: Cloned nodes prevent memory leaks and maintain performance

## Security Considerations

When using HTML labels, follow these best practices:

1. **Create Elements Programmatically**: Use DOM methods instead of innerHTML when possible
2. **Sanitize User Content**: Never pass unsanitized user input to innerHTML
3. **Use Text Content**: For dynamic text, use textContent instead of innerHTML
4. **Clone Nodes**: The component clones label elements to prevent external modifications

## Recent Improvements

### Version 2.1.0

- **Smart Validation UX**: Error messages now only appear after `validate()` is called
- **Fixed Disabled Checked State**: Checkmarks now properly display on disabled checked checkboxes
- **Enhanced CSS Variables**: Added `--checkbox-disabled-checked-bg` and related variables
- **Improved Animations**: Error messages slide in smoothly when they appear

### Version 2.0.0

- **HTML Label Support**: Labels can now contain links, icons, or any HTML element
- **CSS Injection**: No more CSS import errors - styles inject automatically
- **Standardized Props**: Added `value` and `setValue()` for consistency across components
