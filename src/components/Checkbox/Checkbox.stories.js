// src/components/Checkbox/Checkbox.stories.js
import Checkbox from './Checkbox.js';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
};

export const Default = () => {
  return Checkbox({
    label: 'Default checkbox',
    onChange: (event, checked) => console.log('Checkbox state:', checked),
  }).getElement();
};

export const Checked = () => {
  return Checkbox({
    label: 'Checked checkbox',
    checked: true,
    onChange: (event, checked) => console.log('Checkbox state:', checked),
  }).getElement();
};

export const Required = () => {
  return Checkbox({
    label: 'Required checkbox',
    required: true,
    onChange: (event, checked) => console.log('Checkbox state:', checked),
  }).getElement();
};

export const Disabled = () => {
  return Checkbox({
    label: 'Disabled checkbox',
    disabled: true,
    onChange: (event, checked) => console.log('Checkbox state:', checked),
  }).getElement();
};

export const DisabledChecked = () => {
  return Checkbox({
    label: 'Disabled checked checkbox',
    checked: true,
    disabled: true,
    onChange: (event, checked) => console.log('Checkbox state:', checked),
  }).getElement();
};

export const WithValidation = () => {
  const container = document.createElement('div');

  const checkbox = Checkbox({
    label: 'I agree to the terms and conditions',
    required: true,
    validationMessage: 'You must agree to the terms and conditions',
    onChange: (event, checked) => console.log('Checkbox state:', checked),
  });

  const button = document.createElement('button');
  button.textContent = 'Validate';
  button.style.marginTop = '10px';
  button.addEventListener('click', () => {
    const isValid = checkbox.validate();
    console.log('Is checkbox valid?', isValid);
  });

  container.appendChild(checkbox.getElement());
  container.appendChild(button);

  return container;
};

export const Indeterminate = () => {
  const container = document.createElement('div');

  const checkbox = Checkbox({
    label: 'Indeterminate state (click to toggle)',
    onChange: (event, checked) => console.log('Checkbox state:', checked),
  });

  // Set the checkbox to indeterminate state
  setTimeout(() => {
    checkbox.setIndeterminate(true);
  }, 0);

  // Create a button to toggle indeterminate state
  const button = document.createElement('button');
  button.textContent = 'Toggle Indeterminate';
  button.style.marginTop = '10px';
  button.addEventListener('click', () => {
    const input = checkbox.getElement().querySelector('input');
    checkbox.setIndeterminate(!input.indeterminate);
  });

  container.appendChild(checkbox.getElement());
  container.appendChild(button);

  return container;
};

export const Multiple = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '8px';

  // Create checkboxes for different options
  const options = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'orange', label: 'Orange' },
    { id: 'grape', label: 'Grape' },
  ];

  const checkboxes = options.map((option) => {
    const checkbox = Checkbox({
      id: option.id,
      name: 'fruits',
      label: option.label,
      onChange: (event, checked) => {
        console.log(`${option.label} selected:`, checked);
      },
    });
    container.appendChild(checkbox.getElement());
    return checkbox;
  });

  // Create a "Select All" checkbox
  const selectAllCheckbox = Checkbox({
    label: 'Select All',
    onChange: (event, checked) => {
      checkboxes.forEach((cb) => cb.setChecked(checked));
      console.log('All selected:', checked);
    },
  });

  // Insert at the beginning
  container.insertBefore(selectAllCheckbox.getElement(), container.firstChild);

  return container;
};

export const CustomStyling = () => {
  const container = document.createElement('div');

  const checkbox = Checkbox({
    label: 'Custom styled checkbox',
    className: 'custom-checkbox',
  });

  // Add custom styles
  const style = document.createElement('style');
  style.textContent = `
    .custom-checkbox .checkbox-indicator {
      border-radius: 0;
      border-width: 2px;
      border-color: #6c757d;
    }
    
    .custom-checkbox .checkbox-input:checked ~ .checkbox-indicator {
      background-color: #28a745;
      border-color: #28a745;
    }
    
    .custom-checkbox .checkbox-label {
      font-weight: bold;
    }
  `;

  container.appendChild(style);
  container.appendChild(checkbox.getElement());

  return container;
};
