// src/components/Input/Input.stories.js
import Input from './Input.js';

export default {
  title: 'Components/Input',
  component: Input,
};

export const Default = () => {
  return Input({
    placeholder: 'Enter text',
    onChange: (event, value) => console.log('Input value:', value),
  });
};

export const WithValue = () => {
  return Input({
    value: 'Initial value',
    onChange: (event, value) => console.log('Input value:', value),
  });
};

export const Email = () => {
  return Input({
    type: 'email',
    placeholder: 'Enter email',
    required: true,
    onChange: (event, value) => console.log('Email value:', value),
  });
};

export const Password = () => {
  return Input({
    type: 'password',
    placeholder: 'Enter password',
    required: true,
    onChange: (event, value) => console.log('Password value:', value),
  });
};

export const Number = () => {
  return Input({
    type: 'number',
    placeholder: 'Enter number',
    onChange: (event, value) => console.log('Number value:', value),
  });
};

export const Required = () => {
  return Input({
    placeholder: 'Required field',
    required: true,
    onChange: (event, value) => console.log('Input value:', value),
  });
};

export const Disabled = () => {
  return Input({
    value: 'This input is disabled',
    disabled: true,
  });
};

export const WithValidation = () => {
  const container = document.createElement('div');

  const input = Input({
    type: 'email',
    placeholder: 'Enter a valid email',
    required: true,
    validationMessage: 'Please enter a valid email address',
    onChange: (event, value) => console.log('Email value:', value),
  });

  const button = document.createElement('button');
  button.textContent = 'Validate';
  button.style.marginTop = '10px';
  button.addEventListener('click', () => {
    const isValid = input.validate();
    console.log('Is input valid?', isValid);
  });

  container.appendChild(input.getElement());
  container.appendChild(button);

  return container;
};

export const Pattern = () => {
  return Input({
    placeholder: 'Enter 3-digit code (e.g. 123)',
    pattern: '[0-9]{3}',
    validationMessage: 'Please enter a 3-digit code',
    onChange: (event, value) => console.log('Code value:', value),
  });
};

export const MinMaxLength = () => {
  return Input({
    placeholder: 'Enter 5-10 characters',
    minLength: 5,
    maxLength: 10,
    validationMessage: 'Text must be 5-10 characters long',
    onChange: (event, value) => console.log('Input value:', value),
  });
};

export const Search = () => {
  return Input({
    type: 'search',
    placeholder: 'Search...',
    onChange: (event, value) => console.log('Search value:', value),
  });
};

export const AllTypes = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';
  container.style.padding = '20px';

  const types = [
    { type: 'text', label: 'Text Input', placeholder: 'Text input' },
    { type: 'email', label: 'Email Input', placeholder: 'name@example.com' },
    { type: 'password', label: 'Password Input', placeholder: 'Password' },
    { type: 'number', label: 'Number Input', placeholder: '123' },
    { type: 'search', label: 'Search Input', placeholder: 'Search...' },
    { type: 'tel', label: 'Telephone Input', placeholder: '+1 (555) 123-4567' },
    { type: 'url', label: 'URL Input', placeholder: 'https://example.com' },
  ];

  types.forEach(({ type, label, placeholder }) => {
    const wrapper = document.createElement('div');

    const labelElement = document.createElement('div');
    labelElement.textContent = label;
    labelElement.style.marginBottom = '5px';
    labelElement.style.fontWeight = 'bold';

    const input = Input({
      type,
      placeholder,
      onChange: (event, value) => console.log(`${type} value:`, value),
    });

    wrapper.appendChild(labelElement);
    wrapper.appendChild(input.getElement());
    container.appendChild(wrapper);
  });

  return container;
};

export const Validation = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';
  container.style.padding = '20px';

  // Required field
  const requiredWrapper = document.createElement('div');
  const requiredLabel = document.createElement('div');
  requiredLabel.textContent = 'Required Field';
  requiredLabel.style.marginBottom = '5px';
  requiredLabel.style.fontWeight = 'bold';

  const requiredInput = Input({
    required: true,
    placeholder: 'This field is required',
    validationMessage: 'This field is required',
  });

  // Pattern field
  const patternWrapper = document.createElement('div');
  const patternLabel = document.createElement('div');
  patternLabel.textContent = 'Pattern Validation (3 digits)';
  patternLabel.style.marginBottom = '5px';
  patternLabel.style.fontWeight = 'bold';

  const patternInput = Input({
    pattern: '[0-9]{3}',
    placeholder: 'Enter 3 digits',
    validationMessage: 'Please enter exactly 3 digits',
  });

  // Length field
  const lengthWrapper = document.createElement('div');
  const lengthLabel = document.createElement('div');
  lengthLabel.textContent = 'Length Validation (5-10 characters)';
  lengthLabel.style.marginBottom = '5px';
  lengthLabel.style.fontWeight = 'bold';

  const lengthInput = Input({
    minLength: 5,
    maxLength: 10,
    placeholder: 'Enter 5-10 characters',
    validationMessage: 'Text must be 5-10 characters',
  });

  // Validate button
  const validateButton = document.createElement('button');
  validateButton.textContent = 'Validate All Fields';
  validateButton.style.padding = '10px';
  validateButton.style.marginTop = '20px';
  validateButton.addEventListener('click', () => {
    const isRequiredValid = requiredInput.validate();
    const isPatternValid = patternInput.validate();
    const isLengthValid = lengthInput.validate();

    console.log('Validation results:', {
      required: isRequiredValid,
      pattern: isPatternValid,
      length: isLengthValid,
    });
  });

  // Append elements
  requiredWrapper.appendChild(requiredLabel);
  requiredWrapper.appendChild(requiredInput.getElement());

  patternWrapper.appendChild(patternLabel);
  patternWrapper.appendChild(patternInput.getElement());

  lengthWrapper.appendChild(lengthLabel);
  lengthWrapper.appendChild(lengthInput.getElement());

  container.appendChild(requiredWrapper);
  container.appendChild(patternWrapper);
  container.appendChild(lengthWrapper);
  container.appendChild(validateButton);

  return container;
};
