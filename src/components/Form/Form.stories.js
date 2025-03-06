import Form from './Form.js';
import FormGroup from './FormGroup.js';
import FormSection from './FormSection.js';
import FormActions from './FormActions.js';
import Input from '../Input/Input.js';
import Select from '../Select/Select.js';
import Checkbox from '../Checkbox/Checkbox.js';
import RadioGroup from '../Radio/RadioGroup.js';
import Button from '../Button/Button.js';

export default {
  title: 'Components/Form',
  component: Form,
};

export const SimpleForm = () => {
  // Create form components
  const nameInput = new Input({
    id: 'name',
    name: 'name',
    placeholder: 'Enter your name',
  });

  const emailInput = new Input({
    id: 'email',
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
  });

  const nameGroup = new FormGroup({
    label: 'Name',
    field: nameInput,
    id: 'name',
    required: true,
  });

  const emailGroup = new FormGroup({
    label: 'Email',
    field: emailInput,
    id: 'email',
    helpText: 'We will never share your email.',
  });

  const submitButton = new Button({
    text: 'Submit',
    type: 'submit',
    onClick: () => console.log('Submit button clicked'),
  });

  const formActions = new FormActions({
    children: submitButton,
  });

  // Create form
  const form = new Form({
    children: [nameGroup, emailGroup, formActions],
    onSubmit: (event, data) => {
      console.log('Form submitted:', data);
    },
  });

  return form.getElement();
};

export const CompleteForm = () => {
  // Create form elements
  const personalSection = new FormSection({
    title: 'Personal Information',
    description: 'Please provide your personal details.',
    children: [
      new FormGroup({
        label: 'First Name',
        field: new Input({
          id: 'firstName',
          name: 'firstName',
          placeholder: 'Enter your first name',
          required: true,
        }),
        id: 'firstName',
        required: true,
      }),
      new FormGroup({
        label: 'Last Name',
        field: new Input({
          id: 'lastName',
          name: 'lastName',
          placeholder: 'Enter your last name',
          required: true,
        }),
        id: 'lastName',
        required: true,
      }),
      new FormGroup({
        label: 'Email',
        field: new Input({
          id: 'email',
          name: 'email',
          type: 'email',
          placeholder: 'Enter your email',
          required: true,
        }),
        id: 'email',
        required: true,
        helpText: 'We will use this for communication.',
      }),
      new FormGroup({
        label: 'Phone',
        field: new Input({
          id: 'phone',
          name: 'phone',
          type: 'tel',
          placeholder: 'Enter your phone number',
        }),
        id: 'phone',
      }),
    ],
  });

  const addressSection = new FormSection({
    title: 'Address',
    description: 'Please provide your address details.',
    children: [
      new FormGroup({
        label: 'Country',
        field: new Select({
          id: 'country',
          name: 'country',
          options: [
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'mx', label: 'Mexico' },
            { value: 'uk', label: 'United Kingdom' },
          ],
          required: true,
        }),
        id: 'country',
        required: true,
      }),
      new FormGroup({
        label: 'City',
        field: new Input({
          id: 'city',
          name: 'city',
          placeholder: 'Enter your city',
        }),
        id: 'city',
      }),
      new FormGroup({
        label: 'Zip/Postal Code',
        field: new Input({
          id: 'zipCode',
          name: 'zipCode',
          placeholder: 'Enter your zip code',
        }),
        id: 'zipCode',
      }),
    ],
  });

  const preferencesSection = new FormSection({
    title: 'Preferences',
    description: 'Please select your preferences.',
    children: [
      new FormGroup({
        label: 'Communication',
        field: new RadioGroup({
          name: 'communicationPreference',
          options: [
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
            { label: 'SMS', value: 'sms' },
          ],
          value: 'email',
        }),
        id: 'communicationPreference',
      }),
      new FormGroup({
        label: 'Subscribe',
        field: new Checkbox({
          id: 'newsletter',
          name: 'newsletter',
          label: 'Subscribe to newsletter',
          checked: true,
        }),
        helpText: 'You can unsubscribe at any time.',
        labelPosition: 'left',
      }),
      new FormGroup({
        label: 'Terms',
        field: new Checkbox({
          id: 'terms',
          name: 'terms',
          label: 'I agree to the terms and conditions',
          required: true,
        }),
        required: true,
        labelPosition: 'left',
      }),
    ],
  });

  const formActions = new FormActions({
    children: [
      new Button({
        text: 'Cancel',
        className: 'btn--secondary',
        onClick: () => console.log('Cancel clicked'),
      }),
      new Button({
        text: 'Submit',
        type: 'submit',
        onClick: () => console.log('Submit clicked'),
      }),
    ],
    align: 'right',
  });

  // Create form with all sections
  const form = new Form({
    children: [
      personalSection,
      addressSection,
      preferencesSection,
      formActions,
    ],
    onSubmit: (event, data, isValid) => {
      console.log('Form submitted:', data);
      console.log('Form valid:', isValid);
    },
    onChange: (event, data) => {
      console.log('Form changed:', data);
    },
  });

  return form.getElement();
};

export const HorizontalForm = () => {
  // Create form components
  const nameInput = new Input({
    id: 'name',
    name: 'name',
    placeholder: 'Enter your name',
  });

  const emailInput = new Input({
    id: 'email',
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
  });

  const nameGroup = new FormGroup({
    label: 'Name',
    field: nameInput,
    id: 'name',
    required: true,
  });

  const emailGroup = new FormGroup({
    label: 'Email',
    field: emailInput,
    id: 'email',
    helpText: 'We will never share your email.',
  });

  const checkbox = new Checkbox({
    id: 'remember',
    name: 'remember',
    label: 'Remember me',
  });

  const checkboxGroup = new FormGroup({
    label: 'Options',
    field: checkbox,
    id: 'remember',
    labelPosition: 'left',
  });

  const submitButton = new Button({
    text: 'Submit',
    type: 'submit',
    onClick: () => console.log('Submit clicked'),
  });

  const cancelButton = new Button({
    text: 'Cancel',
    className: 'btn--secondary',
    onClick: () => console.log('Cancel clicked'),
  });

  const formActions = new FormActions({
    children: [cancelButton, submitButton],
  });

  // Create form
  const form = new Form({
    children: [nameGroup, emailGroup, checkboxGroup, formActions],
    layout: 'horizontal',
    onSubmit: (event, data) => {
      console.log('Form submitted:', data);
    },
  });

  return form.getElement();
};

export const FormWithValidation = () => {
  // Create form components with validation
  const nameInput = new Input({
    id: 'name',
    name: 'name',
    placeholder: 'Enter your name',
    required: true,
    minLength: 3,
    validationMessage: 'Name is required and must be at least 3 characters',
  });

  const emailInput = new Input({
    id: 'email',
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
    required: true,
    pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
    validationMessage: 'Please enter a valid email address',
  });

  const passwordInput = new Input({
    id: 'password',
    name: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
    minLength: 8,
    validationMessage: 'Password must be at least 8 characters',
  });

  const termsCheckbox = new Checkbox({
    id: 'terms',
    name: 'terms',
    label: 'I agree to the terms and conditions',
    required: true,
    validationMessage: 'You must agree to the terms',
  });

  const nameGroup = new FormGroup({
    label: 'Name',
    field: nameInput,
    id: 'name',
    required: true,
  });

  const emailGroup = new FormGroup({
    label: 'Email',
    field: emailInput,
    id: 'email',
    required: true,
  });

  const passwordGroup = new FormGroup({
    label: 'Password',
    field: passwordInput,
    id: 'password',
    required: true,
  });

  const termsGroup = new FormGroup({
    label: 'Terms',
    field: termsCheckbox,
    id: 'terms',
    required: true,
  });

  const submitButton = new Button({
    text: 'Submit',
    type: 'submit',
    onClick: () => console.log('Submit clicked'),
  });

  const validateButton = new Button({
    text: 'Validate',
    onClick: (event) => {
      const isValid = form.validate();
      console.log('Validation result:', isValid);
    },
  });

  const formActions = new FormActions({
    children: [validateButton, submitButton],
  });

  // Create form
  const form = new Form({
    children: [nameGroup, emailGroup, passwordGroup, termsGroup, formActions],
    onSubmit: (event, data, isValid) => {
      console.log('Form submitted:', data);
      console.log('Form valid:', isValid);

      if (isValid) {
        alert('Form is valid and submitted!');
      }
    },
    autoValidate: true,
  });

  // Register fields for form validation
  form.registerField(nameInput);
  form.registerField(emailInput);
  form.registerField(passwordInput);
  form.registerField(termsCheckbox);

  return form.getElement();
};

export const FormWithDifferentLabelPositions = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '2rem';

  // Create different label positions
  const positions = ['top', 'left', 'right', 'bottom'];

  positions.forEach((position) => {
    const title = document.createElement('h3');
    title.textContent = `Label Position: ${position}`;
    container.appendChild(title);

    const input = new Input({
      id: `input-${position}`,
      name: `input-${position}`,
      placeholder: `Input with ${position} label`,
    });

    const formGroup = new FormGroup({
      label: `Label (${position})`,
      field: input,
      id: `input-${position}`,
      labelPosition: position,
      helpText: 'This is help text for the field.',
    });

    container.appendChild(formGroup.getElement());
  });

  return container;
};
