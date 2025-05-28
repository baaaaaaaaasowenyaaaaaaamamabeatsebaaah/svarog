# Textarea Component

The Textarea component provides a flexible, accessible multi-line text input with enhanced styling, validation, auto-resize capabilities, and character counting. It uses CSS injection for seamless integration across all environments.

## Features

✅ **Zero Configuration** - Works in Node.js, bundlers, everywhere  
✅ **Auto-styling** - Styles inject automatically when component is used  
✅ **Enhanced UI** - Custom visual interface with native accessibility  
✅ **Auto-resize** - Automatically adjusts height based on content  
✅ **Character Count** - Built-in character counter with max length support  
✅ **Validation** - Built-in HTML5 validation with custom messages  
✅ **Accessibility** - Full keyboard navigation and screen reader support  
✅ **Theming** - CSS variables for easy customization

## Usage

```javascript
import { Textarea } from '@svarog-ui/core';

// Create a basic textarea
const myTextarea = Textarea({
  placeholder: 'Enter your message...',
  onChange: (event, value) => console.log('Textarea changed:', value),
});

// Add to DOM
document.body.appendChild(myTextarea.getElement());
```

## Props

| Prop           | Type     | Default   | Description                                             |
| -------------- | -------- | --------- | ------------------------------------------------------- |
| id             | string   | undefined | HTML id attribute                                       |
| name           | string   | undefined | Textarea name for form submission                       |
| value          | string   | ''        | Textarea value                                          |
| defaultValue   | string   | undefined | Initial value (used if value not provided)              |
| placeholder    | string   | ''        | Placeholder text                                        |
| required       | boolean  | false     | Whether textarea is required                            |
| disabled       | boolean  | false     | Whether textarea is disabled                            |
| readonly       | boolean  | false     | Whether textarea is read-only                           |
| rows           | number   | 3         | Number of visible text rows                             |
| cols           | number   | undefined | Number of visible text columns                          |
| minLength      | number   | undefined | Minimum text length                                     |
| maxLength      | number   | undefined | Maximum text length                                     |
| className      | string   | ''        | Additional CSS classes                                  |
| onChange       | function | undefined | Change event handler: (event, value) => void            |
| onFocus        | function | undefined | Focus event handler: (event) => void                    |
| onBlur         | function | undefined | Blur event handler: (event) => void                     |
| onSubmit       | function | undefined | Ctrl/Cmd+Enter handler: (event, value) => void          |
| error          | boolean  | null      | Error state (true = error, false = valid, null = unset) |
| errorMessage   | string   | ''        | Error message to display when validation fails          |
| loading        | boolean  | false     | Whether the textarea is in a loading state              |
| showValidation | boolean  | true      | Whether to show validation message                      |
| autoResize     | boolean  | true      | Whether to auto-resize based on content                 |
| resizable      | boolean  | true      | Whether user can manually resize                        |
| showCharCount  | boolean  | false     | Whether to show character count                         |

## Methods

### getElement()

Returns the textarea container DOM element.

```javascript
const textareaElement = myTextarea.getElement();
```

### getValue()

Returns the current textarea value.

```javascript
const value = myTextarea.getValue();
```

### setValue(value)

Updates the textarea value.

```javascript
myTextarea.setValue('New text content');
```

### validate()

Validates the textarea against its constraints (required, minLength, maxLength, etc).

```javascript
const isValid = myTextarea.validate();
if (!isValid) {
  console.log('Textarea is invalid');
}
```

### update(props)

Updates multiple textarea properties at once.

```javascript
myTextarea.update({
  disabled: true,
  value: 'Updated content',
  errorMessage: 'Custom error message',
});
```

### destroy()

Cleans up event listeners and resources. Call when removing the textarea.

```javascript
myTextarea.destroy();
```

## Special Features

### Auto-resize

The textarea automatically adjusts its height based on content:

```javascript
const autoResizeTextarea = Textarea({
  placeholder: 'This textarea grows as you type...',
  autoResize: true,
  rows: 3, // Initial height
});
```

### Character Counter

Show a character counter with optional max length:

```javascript
const limitedTextarea = Textarea({
  placeholder: 'Maximum 200 characters',
  maxLength: 200,
  showCharCount: true,
});
```

### Form Submit with Ctrl/Cmd+Enter

Handle form submission with keyboard shortcut:

```javascript
const messageTextarea = Textarea({
  placeholder: 'Press Ctrl+Enter to send',
  onSubmit: (event, value) => {
    console.log('Submitting:', value);
    // Handle form submission
  },
});
```

## Validation

Enable validation by using the `required`, `minLength`, or `maxLength` props. You can provide a custom validation message with the `errorMessage` prop.

```javascript
const validatedTextarea = Textarea({
  required: true,
  minLength: 20,
  maxLength: 500,
  errorMessage: 'Please enter between 20 and 500 characters',
});

// Trigger validation manually
const isValid = validatedTextarea.validate();
```

## CSS Customization

Textarea styles can be customized using CSS variables:

```css
:root {
  --textarea-bg: #ffffff;
  --textarea-color: #333333;
  --textarea-border: 1px solid #cccccc;
  --textarea-radius: 4px;
  --textarea-padding: 0.5rem 1rem;
  --textarea-font-size: 1rem;
  --textarea-line-height: 1.5;
  --textarea-transition: all 0.2s ease;

  /* Focus state */
  --textarea-focus-border-color: #3182ce;
  --textarea-focus-shadow: 0 0 0 3px rgba(49, 130, 206, 0.25);

  /* Validation states */
  --textarea-valid-border-color: #48bb78;
  --textarea-invalid-border-color: #e53e3e;

  /* Character count */
  --textarea-char-count-color: #718096;
  --textarea-char-count-font-size: 0.75rem;

  /* Other states and variants */
  /* (see theme files for all variables) */
}
```

## Advanced Styling

The component uses automatic CSS injection, so styles are loaded when the component is first used. You can also override specific parts:

```css
/* Override specific textarea styles */
.textarea-custom {
  font-family: 'Monaco', monospace;
}

.textarea-custom--focused {
  box-shadow: 0 0 0 4px rgba(49, 130, 206, 0.5);
}

/* Custom character count styling */
.textarea-char-count--warning {
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 2px 6px;
  border-radius: 2px;
}
```

## Accessibility

The Textarea component is designed with accessibility in mind:

- **Semantic HTML**: Uses proper textarea element with correct attributes
- **Keyboard Navigation**: Full keyboard support including tab order
- **Screen Reader Support**: Proper ARIA labels and live announcements
- **Visual Indicators**: Clear visual states for all interaction states
- **Focus Management**: Proper focus handling with visible indicators
- **Character Count**: Announced to screen readers via live regions

### Keyboard Shortcuts

- `Tab` - Move focus to/from textarea
- `Ctrl/Cmd + Enter` - Trigger submit handler (if provided)
- Standard text editing shortcuts supported

## Browser Compatibility

- **Modern Browsers**: Full support for all features
- **Legacy Browsers**: Graceful degradation
- **Mobile**: Optimized for touch interaction and mobile browsers
- **Screen Readers**: Compatible with JAWS, NVDA, VoiceOver

## Performance

- **CSS Injection**: Styles loaded only when component is used
- **Event Delegation**: Efficient event handling
- **Auto-resize**: Throttled for performance
- **Memory Management**: Proper cleanup on component destruction

## Legacy Props Support

For backward compatibility, the component supports the following legacy props:

| Legacy Prop       | New Prop     | Notes                       |
| ----------------- | ------------ | --------------------------- |
| isValid           | error        | error is inverse of isValid |
| validationMessage | errorMessage | Use errorMessage instead    |
| isLoading         | loading      | Use loading instead         |

Using legacy props will log deprecation warnings to the console.

## Examples

### Basic Textarea

```javascript
const basicTextarea = Textarea({
  placeholder: 'Enter your comments...',
  onChange: (event, value) => console.log('Value:', value),
});
```

### Auto-growing Textarea

```javascript
const growingTextarea = Textarea({
  placeholder: 'This expands as you type...',
  autoResize: true,
  rows: 2,
});
```

### Limited Textarea with Counter

```javascript
const limitedTextarea = Textarea({
  placeholder: 'Tweet (max 280 chars)',
  maxLength: 280,
  showCharCount: true,
  rows: 4,
});
```

### Form Integration

```javascript
const formTextarea = Textarea({
  name: 'message',
  placeholder: 'Your message',
  required: true,
  minLength: 10,
  errorMessage: 'Message must be at least 10 characters',
  autoResize: true,
  showCharCount: true,
  maxLength: 1000,
});

// In a form
const form = document.querySelector('form');
form.appendChild(formTextarea.getElement());

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (formTextarea.validate()) {
    const message = formTextarea.getValue();
    // Submit the form data
  }
});
```

### All Options Example

```javascript
const fullyConfigured = Textarea({
  id: 'comment-input',
  name: 'comment',
  value: 'Initial comment text',
  placeholder: 'Share your thoughts...',
  required: true,
  rows: 5,
  minLength: 10,
  maxLength: 500,
  className: 'custom-textarea',
  autoResize: true,
  resizable: false,
  showCharCount: true,
  showValidation: true,
  errorMessage: 'Please enter between 10 and 500 characters',
  onChange: (event, value) => {
    console.log('Content changed:', value);
  },
  onFocus: (event) => {
    console.log('Textarea focused');
  },
  onBlur: (event) => {
    console.log('Textarea blurred');
  },
  onSubmit: (event, value) => {
    console.log('Submit triggered:', value);
  },
});
```

## Migration from Standard Textarea

Replace standard HTML textareas with the enhanced component:

```html
<!-- Before -->
<textarea
  name="message"
  placeholder="Enter message"
  required
  rows="5"
></textarea>

<!-- After -->
<script>
  import { Textarea } from '@svarog-ui/core';

  const enhancedTextarea = Textarea({
    name: 'message',
    placeholder: 'Enter message',
    required: true,
    rows: 5,
    autoResize: true, // Bonus feature!
    showCharCount: true, // Another bonus!
  });

  document.body.appendChild(enhancedTextarea.getElement());
</script>
```

## Troubleshooting

### Textarea not auto-resizing

Ensure `autoResize` prop is set to `true` and the textarea has proper CSS box-sizing:

```css
.textarea-native {
  box-sizing: border-box;
}
```

### Character count not visible

Check that the textarea wrapper has `position: relative` and the character count element is properly positioned.

### Validation not working

Ensure you're calling the `validate()` method when needed, or that `showValidation` prop is `true` for automatic validation on blur.

## Related Components

- [Input](../Input/README.md) - Single-line text input
- [Form](../Form/README.md) - Form container with validation
- [FormGroup](../Form/README.md#formgroup) - Form field grouping
