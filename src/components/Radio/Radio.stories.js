// src/components/Radio/Radio.stories.js
import Radio from './Radio.js';
import RadioGroup from './RadioGroup.js';

export default {
  title: 'Components/Radio',
  component: Radio,
};

export const SingleRadio = () => {
  return Radio({
    label: 'Single radio button',
    value: 'single',
    name: 'singleRadio',
    onChange: (event, value) => console.log('Radio value:', value),
  });
};

export const CheckedRadio = () => {
  return Radio({
    label: 'Checked radio button',
    value: 'checked',
    name: 'checkedRadio',
    checked: true,
    onChange: (event, value) => console.log('Radio value:', value),
  });
};

export const DisabledRadio = () => {
  return Radio({
    label: 'Disabled radio button',
    value: 'disabled',
    name: 'disabledRadio',
    disabled: true,
    onChange: (event, value) => console.log('Radio value:', value),
  });
};

export const DisabledCheckedRadio = () => {
  return Radio({
    label: 'Disabled checked radio button',
    value: 'disabledChecked',
    name: 'disabledCheckedRadio',
    checked: true,
    disabled: true,
    onChange: (event, value) => console.log('Radio value:', value),
  });
};

export const RequiredRadio = () => {
  return Radio({
    label: 'Required radio button',
    value: 'required',
    name: 'requiredRadio',
    required: true,
    onChange: (event, value) => console.log('Radio value:', value),
  });
};

// RadioGroup examples

export const BasicRadioGroup = () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return RadioGroup({
    options,
    name: 'basicGroup',
    legend: 'Basic Radio Group',
    onChange: (event, value) => console.log('Selected:', value),
  });
};

export const WithSelectedValue = () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return RadioGroup({
    options,
    name: 'preselectedGroup',
    legend: 'Preselected Radio Group',
    value: 'option2',
    onChange: (event, value) => console.log('Selected:', value),
  });
};

export const WithDefaultValue = () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return RadioGroup({
    options,
    name: 'defaultValueGroup',
    legend: 'Default Value Radio Group',
    defaultValue: 'option3',
    onChange: (event, value) => console.log('Selected:', value),
  });
};

export const WithLegacyDefaultActiveTab = () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return RadioGroup({
    options,
    name: 'legacyDefaultGroup',
    legend: 'Legacy Default Active Tab (Now Uses defaultValue)',
    defaultActiveTab: 'option1', // Legacy prop
    onChange: (event, value) => console.log('Selected:', value),
  });
};

export const HorizontalLayout = () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return RadioGroup({
    options,
    name: 'horizontalGroup',
    legend: 'Horizontal Radio Group',
    layout: 'horizontal',
    onChange: (event, value) => console.log('Selected:', value),
  });
};

export const RequiredGroup = () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const container = document.createElement('div');

  const radioGroup = RadioGroup({
    options,
    name: 'requiredGroup',
    legend: 'Required Radio Group',
    required: true,
    validationMessage: 'Please select one option',
    onChange: (event, value) => console.log('Selected:', value),
  });

  const button = document.createElement('button');
  button.textContent = 'Validate';
  button.style.marginTop = '10px';
  button.addEventListener('click', () => {
    const isValid = radioGroup.validate();
    console.log('Is radio group valid?', isValid);
  });

  container.appendChild(radioGroup.getElement());
  container.appendChild(button);

  return container;
};

export const DisabledGroup = () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return RadioGroup({
    options,
    name: 'disabledGroup',
    legend: 'Disabled Radio Group',
    disabled: true,
    onChange: (event, value) => console.log('Selected:', value),
  });
};

export const MixedDisabled = () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2 (Disabled)', value: 'option2', disabled: true },
    { label: 'Option 3', value: 'option3' },
  ];

  return RadioGroup({
    options,
    name: 'mixedDisabledGroup',
    legend: 'Mixed Disabled Options',
    onChange: (event, value) => console.log('Selected:', value),
  });
};

export const ProgrammaticControl = () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const container = document.createElement('div');

  const radioGroup = RadioGroup({
    options,
    name: 'controlledGroup',
    legend: 'Programmatically Controlled',
    onChange: (event, value) => console.log('Selected:', value),
  });

  // Create buttons to control the radio group
  const buttonContainer = document.createElement('div');
  buttonContainer.style.marginTop = '10px';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '8px';

  options.forEach((option) => {
    const button = document.createElement('button');
    button.textContent = `Select ${option.label}`;
    button.addEventListener('click', () => {
      radioGroup.setValue(option.value);
    });
    buttonContainer.appendChild(button);
  });

  container.appendChild(radioGroup.getElement());
  container.appendChild(buttonContainer);

  return container;
};
