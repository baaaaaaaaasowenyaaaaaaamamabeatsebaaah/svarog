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
    onClick: () => {
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

export const NoLabelsValidation = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '1rem';

  // Description
  const description = document.createElement('h3');
  description.textContent = 'Validation Without Labels';
  container.appendChild(description);

  const subDescription = document.createElement('p');
  subDescription.textContent =
    'Demonstrates fields without labels to clearly show zero-space validation messages.';
  container.appendChild(subDescription);

  // Create inputs directly without FormGroup to test validation messages without labels
  const nameInput = new Input({
    id: 'name-no-label',
    name: 'name-no-label',
    placeholder: 'Enter your name (required)',
    required: true,
    validationMessage: 'Name is required',
  });

  const emailInput = new Input({
    id: 'email-no-label',
    name: 'email-no-label',
    type: 'email',
    placeholder: 'Enter email (valid format required)',
    required: true,
    pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
    validationMessage: 'Please enter a valid email address',
  });

  const selectInput = new Select({
    options: [
      { value: '', label: 'Select an option' },
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    id: 'select-no-label',
    name: 'select-no-label',
    required: true,
    validationMessage: 'Please select an option',
  });

  // Container for inputs
  const noLabelsContainer = document.createElement('div');
  noLabelsContainer.style.padding = '1rem';
  noLabelsContainer.style.border = '1px solid #ddd';
  noLabelsContainer.style.borderRadius = '4px';
  noLabelsContainer.style.display = 'flex';
  noLabelsContainer.style.flexDirection = 'column';
  noLabelsContainer.style.gap = '0.5rem';

  // Add inputs with separators to highlight the spacing
  noLabelsContainer.appendChild(nameInput.getElement());
  noLabelsContainer.appendChild(emailInput.getElement());
  noLabelsContainer.appendChild(selectInput.getElement());

  // Button controls for validation
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '0.5rem';
  buttonContainer.style.marginTop = '1rem';

  const validateButton = document.createElement('button');
  validateButton.textContent = 'Validate All (Show Messages)';
  validateButton.addEventListener('click', () => {
    // Validate all fields - should show validation messages
    nameInput.validate();
    emailInput.validate();
    selectInput.validate();
  });

  const makeValidButton = document.createElement('button');
  makeValidButton.textContent = 'Make All Valid (Hide Messages)';
  makeValidButton.addEventListener('click', () => {
    // Make all fields valid - should hide validation messages
    nameInput.setValue('John Doe');
    emailInput.setValue('john@example.com');
    selectInput.setValue('option1');

    nameInput.validate();
    emailInput.validate();
    selectInput.validate();
  });

  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset All';
  resetButton.addEventListener('click', () => {
    nameInput.setValue('');
    emailInput.setValue('');
    selectInput.setValue('');

    // Don't validate after reset to show clean state
  });

  buttonContainer.appendChild(validateButton);
  buttonContainer.appendChild(makeValidButton);
  buttonContainer.appendChild(resetButton);

  // Visual inspection guide
  const guide = document.createElement('div');
  guide.style.marginTop = '1rem';
  guide.style.padding = '0.5rem';
  guide.style.backgroundColor = '#f8f9fa';
  guide.style.borderRadius = '4px';
  guide.style.fontSize = '0.875rem';

  const guideTitle = document.createElement('strong');
  guideTitle.textContent = 'Visual Inspection Guide:';
  guide.appendChild(guideTitle);

  const guideList = document.createElement('ul');
  guideList.style.margin = '0.5rem 0 0 0';
  guideList.style.paddingLeft = '1.5rem';

  const guideItems = [
    'The grey separators should be directly adjacent to each input when no validation messages are shown',
    'When you click "Validate All", error messages should appear and push down the grey separators',
    'When you click "Make All Valid", the error messages should disappear and elements should return to their original positions',
    'Inspect elements to verify that validation message elements have 0 height when empty',
  ];

  guideItems.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    guideList.appendChild(li);
  });

  guide.appendChild(guideList);

  // Add everything to main container
  container.appendChild(noLabelsContainer);
  container.appendChild(buttonContainer);
  container.appendChild(guide);

  return container;
};
