# Form Component

The Form component provides a comprehensive, accessible form solution with built-in validation, field management, and data handling capabilities.

## Usage

```javascript
import { Form, FormGroup, FormSection, FormActions } from '@/components/Form';
import Input from '@/components/Input';
import Button from '@/components/Button';

// Create form elements
const nameInput = Input({
  id: 'name',
  name: 'name',
  placeholder: 'Enter your name',
});

const emailInput = Input({
  id: 'email',
  name: 'email',
  type: 'email',
  placeholder: 'Enter your email',
});

const nameGroup = FormGroup({
  label: 'Name',
  field: nameInput,
  id: 'name',
  required: true,
});

const emailGroup = FormGroup({
  label: 'Email',
  field: emailInput,
  id: 'email',
  helpText: 'We will never share your email.',
});

const submitButton = Button({
  text: 'Submit',
  type: 'submit',
});

const formActions = FormActions({
  children: submitButton,
});

// Create form with all elements
const form = Form({
  children: [nameGroup, emailGroup, formActions],
  onSubmit: (event, data, isValid) => {
    console.log('Form submitted:', data);
    console.log('Form valid:', isValid);
  },
});

// Add to the DOM
document.querySelector('#form-container').appendChild(form.getElement());
```

## Form Component Props

| Prop         | Type                           | Default    | Description                              |
| ------------ | ------------------------------ | ---------- | ---------------------------------------- |
| children     | Array\|HTMLElement\|Component  | (Required) | Form content                             |
| id           | string                         | undefined  | Form id attribute                        |
| className    | string                         | ''         | Additional CSS classes                   |
| onSubmit     | Function(event, data, isValid) | undefined  | Submit event handler                     |
| onChange     | Function(event, data)          | undefined  | Change event handler                     |
| autoValidate | boolean                        | true       | Whether to validate on submit            |
| layout       | string                         | 'vertical' | Form layout ('vertical' or 'horizontal') |

## FormGroup Component Props

| Prop          | Type                   | Default    | Description                                       |
| ------------- | ---------------------- | ---------- | ------------------------------------------------- |
| label         | string                 | (Required) | Label text for the form field                     |
| field         | HTMLElement\|Component | (Required) | Form field element or component                   |
| helpText      | string                 | undefined  | Help text displayed below the field               |
| id            | string                 | undefined  | ID for the field (used for label association)     |
| required      | boolean                | false      | Whether the field is required                     |
| className     | string                 | ''         | Additional CSS classes                            |
| labelPosition | string                 | 'top'      | Label position ('top', 'left', 'right', 'bottom') |

## Form Section Component Props

| Prop        | Type                          | Default    | Description              |
| ----------- | ----------------------------- | ---------- | ------------------------ |
| children    | Array\|HTMLElement\|Component | (Required) | Section content          |
| title       | string                        | undefined  | Section title            |
| description | string                        | undefined  | Section description text |
| className   | string                        | ''         | Additional CSS classes   |

## Form Actions Component Props

| Prop      | Type                          | Default    | Description                                        |
| --------- | ----------------------------- | ---------- | -------------------------------------------------- |
| children  | Array\|HTMLElement\|Component | (Required) | Action buttons/controls                            |
| align     | string                        | 'right'    | Alignment ('left', 'center', 'right', 'stretched') |
| className | string                        | ''         | Additional CSS classes                             |

## Methods

### getElement()

Returns the form element.

```javascript
const formElement = form.getElement();
```

### registerField(field)

Registers a form field component with the form for validation and state management.

```javascript
const input = Input({
  name: 'email',
  required: true,
});

form.registerField(input);
```

### validate()

Validates all registered form fields and returns whether the form is valid.

```javascript
const isValid = form.validate();
if (isValid) {
  console.log('Form is valid!');
}
```

### getFormData()

Gets the current form data as a key-value object.

```javascript
const data = form.getFormData();
console.log('Current form values:', data);
```

### reset()

Resets the form and all registered field components to their initial state.

```javascript
form.reset();
```

### setValues(values)

Sets form field values programmatically.

```javascript
form.setValues({
  name: 'John Doe',
  email: 'john@example.com',
  subscribe: true,
});
```

### update(props)

Updates form properties.

```javascript
form.update({
  layout: 'horizontal',
  className: 'compact-form',
});
```

### destroy()

Cleans up resources and event listeners. Call this when removing the form.

```javascript
form.destroy();
```

## Form Layout

The form component supports two layout options:

### Vertical Layout (Default)

Labels appear above form fields.

```javascript
const form = Form({
  children: [...formElements],
  layout: 'vertical', // Or omit, as this is the default
});
```

### Horizontal Layout

Labels appear to the left of form fields, aligned to the right.

```javascript
const form = Form({
  children: [...formElements],
  layout: 'horizontal',
});
```

In responsive views (mobile), horizontal layouts automatically switch to vertical for better usability.

## Form Composition

Forms are typically composed of several complementary components:

- **Form**: The main container component
- **FormGroup**: Groups a form field with its label and validation message
- **FormSection**: Creates a section within a form with title and description
- **FormActions**: Container for form buttons/actions with alignment options

## Validation

The Form component supports validation through field registration:

1. Register fields with the form using `form.registerField(field)`
2. When form is submitted, it automatically validates all registered fields
3. Validation results are passed to the onSubmit handler

```javascript
const form = Form({
  children: [...formElements],
  onSubmit: (event, data, isValid) => {
    if (isValid) {
      // Safe to proceed with form submission
      submitToServer(data);
    } else {
      // Form has validation errors
      showError('Please fix form errors');
    }
  },
});
```

## CSS Customization

Form styles can be customized using CSS variables:

```css
:root {
  /* Form layout variables */
  --form-label-width: 30%;
  --form-section-margin-bottom: 24px;

  /* Form group spacing */
  --form-group-margin-bottom: 16px;

  /* Form actions alignment */
  --form-actions-justify: flex-end;
  --form-actions-gap: 12px;
  --form-actions-margin-top: 20px;

  /* Section styling */
  --form-section-title-font-size: 18px;
  --form-section-title-color: #212529;
  --form-section-title-font-weight: 600;
  --form-section-title-margin-bottom: 12px;
  --form-section-title-border: 1px solid #e9ecef;
  --form-section-description-font-size: 16px;
  --form-section-description-color: #6c757d;
  --form-section-description-margin-bottom: 12px;
}
```

## Accessibility

The Form component follows accessibility best practices:

- Properly associates labels with form controls
- Uses appropriate ARIA attributes
- Provides validation feedback
- Supports keyboard navigation

## Form Examples

### Basic Form

```javascript
const form = Form({
  children: [
    FormGroup({
      label: 'Username',
      field: Input({ name: 'username', required: true }),
      required: true,
    }),
    FormGroup({
      label: 'Password',
      field: Input({ name: 'password', type: 'password', required: true }),
      required: true,
    }),
    FormActions({
      children: Button({ text: 'Login', type: 'submit' }),
    }),
  ],
  onSubmit: (event, data, isValid) => {
    if (isValid) {
      loginUser(data);
    }
  },
});
```

### Form With Sections

```javascript
const form = Form({
  children: [
    FormSection({
      title: 'Personal Information',
      description: 'Please provide your personal details.',
      children: [
        // Personal info form groups...
      ],
    }),
    FormSection({
      title: 'Account Details',
      description: 'Create your account credentials.',
      children: [
        // Account form groups...
      ],
    }),
    FormActions({
      children: [
        Button({ text: 'Back', className: 'btn--secondary' }),
        Button({ text: 'Continue', type: 'submit' }),
      ],
      align: 'right',
    }),
  ],
});
```

### Form With Validation

```javascript
// Create input with validation
const emailInput = Input({
  id: 'email',
  name: 'email',
  type: 'email',
  required: true,
  pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
  validationMessage: 'Please enter a valid email address',
});

// Create form
const form = Form({
  children: [
    FormGroup({
      label: 'Email',
      field: emailInput,
      required: true,
    }),
    FormActions({
      children: Button({ text: 'Subscribe', type: 'submit' }),
    }),
  ],
});

// Register the field for validation
form.registerField(emailInput);
```
