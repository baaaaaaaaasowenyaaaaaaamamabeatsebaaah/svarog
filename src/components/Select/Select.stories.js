// src/components/Select/Select.stories.js
import Select from './Select.js';

export default {
  title: 'Components/Select',
  component: Select,
};

// Common options for examples
const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
];

// Default select without validation styling
export const Default = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Default select with no validation state';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = new Select({
    options: countryOptions,
    placeholder: 'Select a country',
    onChange: (event, value) => console.log('Selected value:', value),
    // Important: showValidation set to false to prevent automatic validation
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};

// Pre-selected value select
export const WithValue = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent =
    'Select with pre-selected value (no validation styling)';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = new Select({
    options: countryOptions,
    value: 'fr',
    onChange: (event, value) => console.log('Selected value:', value),
    // Important: showValidation set to false to prevent automatic validation
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};

// Valid state select
export const ValidState = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Valid state select (green border)';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = new Select({
    options: countryOptions,
    value: 'us',
    required: true,
    validationMessage: 'Valid selection',
    showValidation: true,
  });

  // Explicitly validate to show valid state
  select.validate();

  container.appendChild(select.getElement());
  return container;
};

// Invalid state select
export const InvalidState = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Invalid state select (red border)';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = new Select({
    options: countryOptions,
    value: '', // Empty value for required field = invalid
    required: true,
    validationMessage: 'Please select a country',
    showValidation: true,
  });

  // Explicitly validate to show invalid state
  select.validate();

  container.appendChild(select.getElement());
  return container;
};

export const Required = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent =
    'Required select (default state, no validation styling until interaction)';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = new Select({
    options: countryOptions,
    placeholder: 'Select a country (required)',
    required: true,
    onChange: (event, value) => console.log('Selected value:', value),
  });

  container.appendChild(select.getElement());
  return container;
};

export const Disabled = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Disabled select';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = new Select({
    options: countryOptions,
    value: 'us',
    disabled: true,
    onChange: (event, value) => console.log('Selected value:', value),
  });

  container.appendChild(select.getElement());
  return container;
};

export const WithValidation = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent =
    'Interactive validation demo (click Validate button to see state change)';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = new Select({
    options: countryOptions,
    placeholder: 'Select a country',
    required: true,
    validationMessage: 'Please select a country',
    onChange: (event, value) => console.log('Selected value:', value),
    // Important: Initially don't show validation styling
    showValidation: true,
  });

  const button = document.createElement('button');
  button.textContent = 'Validate';
  button.style.marginTop = '10px';
  button.addEventListener('click', () => {
    const isValid = select.validate();
    console.log('Is select valid?', isValid);
  });

  container.appendChild(select.getElement());
  container.appendChild(button);

  return container;
};

export const Multiple = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Multiple selection';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  const select = new Select({
    options: countryOptions,
    placeholder: 'Select countries',
    multiple: true,
    value: ['ca', 'fr'],
    onChange: (event, value) => console.log('Selected values:', value),
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};

export const GroupedOptions = () => {
  const container = document.createElement('div');

  const description = document.createElement('p');
  description.textContent = 'Grouped options';
  description.style.marginBottom = '8px';
  container.appendChild(description);

  // Options with groups
  const groupedOptions = [
    { value: 'north-america', label: 'North America', disabled: true },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },

    { value: 'europe', label: 'Europe', disabled: true },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },

    { value: 'asia', label: 'Asia', disabled: true },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
    { value: 'in', label: 'India' },
  ];

  const select = new Select({
    options: groupedOptions,
    placeholder: 'Select a country',
    onChange: (event, value) => console.log('Selected value:', value),
    showValidation: false,
  });

  container.appendChild(select.getElement());
  return container;
};
