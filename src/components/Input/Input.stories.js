// src/components/Input/Input.stories.js
import Input from './Input.js';

export default {
  title: 'Components/Input',
  component: Input,
};

export const Default = () => {
  return new Input({
    placeholder: 'Enter text',
    onChange: (event, value) => console.log('Input value:', value),
  });
};

export const WithValue = () => {
  return new Input({
    value: 'Initial value',
    onChange: (event, value) => console.log('Input value:', value),
  });
};

export const Email = () => {
  return new Input({
    type: 'email',
    placeholder: 'Enter email',
    required: true,
    onChange: (event, value) => console.log('Email value:', value),
  });
};

export const Password = () => {
  return new Input({
    type: 'password',
    placeholder: 'Enter password',
    required: true,
    onChange: (event, value) => console.log('Password value:', value),
  });
};

export const Number = () => {
  return new Input({
    type: 'number',
    placeholder: 'Enter number',
    onChange: (event, value) => console.log('Number value:', value),
  });
};

export const Required = () => {
  return new Input({
    placeholder: 'Required field',
    required: true,
    onChange: (event, value) => console.log('Input value:', value),
  });
};

export const Disabled = () => {
  return new Input({
    value: 'This input is disabled',
    disabled: true,
  });
};

export const WithValidation = () => {
  const container = document.createElement('div');

  const input = new Input({
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
  return new Input({
    placeholder: 'Enter 3-digit code (e.g. 123)',
    pattern: '[0-9]{3}',
    validationMessage: 'Please enter a 3-digit code',
    onChange: (event, value) => console.log('Code value:', value),
  });
};

export const MinMaxLength = () => {
  return new Input({
    placeholder: 'Enter 5-10 characters',
    minLength: 5,
    maxLength: 10,
    validationMessage: 'Text must be 5-10 characters long',
    onChange: (event, value) => console.log('Input value:', value),
  });
};

export const Search = () => {
  return new Input({
    type: 'search',
    placeholder: 'Search...',
    onChange: (event, value) => console.log('Search value:', value),
  });
};
