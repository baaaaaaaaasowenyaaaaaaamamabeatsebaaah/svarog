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

export const Default = () => {
  return new Select({
    options: countryOptions,
    placeholder: 'Select a country',
    onChange: (event, value) => console.log('Selected value:', value),
  });
};

export const WithValue = () => {
  return new Select({
    options: countryOptions,
    value: 'fr',
    onChange: (event, value) => console.log('Selected value:', value),
  });
};

export const Required = () => {
  return new Select({
    options: countryOptions,
    placeholder: 'Select a country (required)',
    required: true,
    onChange: (event, value) => console.log('Selected value:', value),
  });
};

export const Disabled = () => {
  return new Select({
    options: countryOptions,
    value: 'us',
    disabled: true,
    onChange: (event, value) => console.log('Selected value:', value),
  });
};

export const WithValidation = () => {
  const container = document.createElement('div');

  const select = new Select({
    options: countryOptions,
    placeholder: 'Select a country',
    required: true,
    validationMessage: 'Please select a country',
    onChange: (event, value) => console.log('Selected value:', value),
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
  return new Select({
    options: countryOptions,
    placeholder: 'Select countries',
    multiple: true,
    value: ['ca', 'fr'],
    onChange: (event, value) => console.log('Selected values:', value),
  });
};

export const GroupedOptions = () => {
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

  return new Select({
    options: groupedOptions,
    placeholder: 'Select a country',
    onChange: (event, value) => console.log('Selected value:', value),
  });
};

export const CustomStyling = () => {
  const container = document.createElement('div');

  const select = new Select({
    options: countryOptions,
    placeholder: 'Custom styled select',
    className: 'custom-select',
  });

  // Add custom styles
  const style = document.createElement('style');
  style.textContent = `
    .custom-select .select {
      background-color: #f8f9fa;
      border: 2px solid #6c757d;
      border-radius: 8px;
      font-weight: bold;
    }
    
    .custom-select .select:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
    }
  `;

  container.appendChild(style);
  container.appendChild(select.getElement());

  return container;
};
