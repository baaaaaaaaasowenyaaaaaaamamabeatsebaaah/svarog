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

export const UsingValue = () => {
  return Checkbox({
    label: 'Using value prop instead of checked',
    value: true, // Using standardized value prop
    onChange: (event, checked) => console.log('Checkbox state:', checked),
  }).getElement();
};

export const UsingDefaultValue = () => {
  return Checkbox({
    label: 'Using defaultValue prop',
    defaultValue: true, // Using standardized defaultValue prop
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

export const Loading = () => {
  return Checkbox({
    label: 'Loading checkbox',
    loading: true, // Using standardized loading prop
    onChange: (event, checked) => console.log('Checkbox state:', checked),
  }).getElement();
};

export const LoadingAndChecked = () => {
  return Checkbox({
    label: 'Loading and checked checkbox',
    checked: true,
    loading: true,
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

export const StandardizedAPI = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '16px';

  // Create a section for each API demo
  const createSection = (title, component) => {
    const section = document.createElement('div');

    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.marginBottom = '8px';

    section.appendChild(titleEl);
    section.appendChild(component.getElement());

    return section;
  };

  // Traditional API
  const traditionalCheckbox = Checkbox({
    label: 'Traditional: Using checked prop',
    checked: true,
  });

  // Value API (standardized)
  const valueCheckbox = Checkbox({
    label: 'Standardized: Using value prop',
    value: true,
  });

  // getValue/setValue demo
  const valueMethodsCheckbox = Checkbox({
    label: 'Using getValue()/setValue() methods',
  });

  const valueMethodsButtons = document.createElement('div');
  valueMethodsButtons.style.display = 'flex';
  valueMethodsButtons.style.gap = '8px';
  valueMethodsButtons.style.marginTop = '8px';

  const getValueBtn = document.createElement('button');
  getValueBtn.textContent = 'Get Value';
  getValueBtn.addEventListener('click', () => {
    alert(`Current value: ${valueMethodsCheckbox.getValue()}`);
  });

  const setValueBtn = document.createElement('button');
  setValueBtn.textContent = 'Toggle Value';
  setValueBtn.addEventListener('click', () => {
    valueMethodsCheckbox.setValue(!valueMethodsCheckbox.getValue());
  });

  valueMethodsButtons.appendChild(getValueBtn);
  valueMethodsButtons.appendChild(setValueBtn);

  // Loading state (standardized)
  const loadingStateCheckbox = Checkbox({
    label: 'Standardized: Using loading prop',
    loading: true,
  });

  // Add all sections to container
  container.appendChild(createSection('Traditional API', traditionalCheckbox));
  container.appendChild(createSection('Standardized API', valueCheckbox));

  const methodsSection = createSection('Value Methods', valueMethodsCheckbox);
  methodsSection.appendChild(valueMethodsButtons);
  container.appendChild(methodsSection);

  container.appendChild(createSection('Loading State', loadingStateCheckbox));

  return container;
};

export const WithLinkInLabel = () => {
  // Create a label with a link
  const labelContent = document.createElement('span');
  labelContent.innerHTML =
    'I agree to the <a href="/terms" target="_blank">Terms of Service</a>';

  const checkbox = Checkbox({
    label: labelContent,
    required: true,
    onChange: (event, checked) => console.log('Agreement:', checked),
  });

  return checkbox.getElement();
};

export const WithPrivacyPolicyLink = () => {
  // Create a more complex label with multiple links
  const labelContent = document.createElement('span');

  const text1 = document.createTextNode('Ich stimme der ');
  const privacyLink = document.createElement('a');
  privacyLink.href = '/datenschutz';
  privacyLink.target = '_blank';
  privacyLink.textContent = 'Datenschutzerklärung';
  privacyLink.style.color = 'var(--color-primary, #3182ce)';

  const text2 = document.createTextNode(' und den ');
  const termsLink = document.createElement('a');
  termsLink.href = '/agb';
  termsLink.target = '_blank';
  termsLink.textContent = 'AGB';
  termsLink.style.color = 'var(--color-primary, #3182ce)';

  const text3 = document.createTextNode(' zu.');

  labelContent.appendChild(text1);
  labelContent.appendChild(privacyLink);
  labelContent.appendChild(text2);
  labelContent.appendChild(termsLink);
  labelContent.appendChild(text3);

  const checkbox = Checkbox({
    label: labelContent,
    required: true,
    validationMessage: 'Sie müssen den Datenschutzbestimmungen zustimmen',
    onChange: (event, checked) => console.log('Datenschutz accepted:', checked),
  });

  return checkbox.getElement();
};

export const WithIconInLabel = () => {
  // Create a label with an icon
  const labelContent = document.createElement('span');
  labelContent.style.display = 'flex';
  labelContent.style.alignItems = 'center';
  labelContent.style.gap = '8px';

  // Add an icon (using an emoji for simplicity, but could be SVG)
  const icon = document.createElement('span');
  icon.textContent = '🔒';
  icon.style.fontSize = '18px';

  const text = document.createElement('span');
  text.textContent = 'Enable secure mode';

  labelContent.appendChild(icon);
  labelContent.appendChild(text);

  const checkbox = Checkbox({
    label: labelContent,
    onChange: (event, checked) => console.log('Secure mode:', checked),
  });

  return checkbox.getElement();
};

export const NewsletterSignup = () => {
  // Real-world example: Newsletter signup with privacy policy
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.maxWidth = '400px';

  // Create newsletter description
  const description = document.createElement('p');
  description.textContent = 'Stay updated with our latest news and offers!';
  description.style.marginBottom = '16px';

  // Create checkbox with privacy policy link
  const labelContent = document.createElement('span');
  const text1 = document.createTextNode(
    'I agree to receive newsletters and accept the '
  );
  const privacyLink = document.createElement('a');
  privacyLink.href = '/privacy';
  privacyLink.textContent = 'Privacy Policy';
  privacyLink.style.color = '#3182ce';
  privacyLink.style.textDecoration = 'underline';
  privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Privacy Policy clicked - would open in new window');
  });

  labelContent.appendChild(text1);
  labelContent.appendChild(privacyLink);

  const checkbox = Checkbox({
    label: labelContent,
    required: true,
    onChange: (event, checked) => console.log('Newsletter consent:', checked),
  });

  // Create submit button
  const button = document.createElement('button');
  button.textContent = 'Subscribe';
  button.style.marginTop = '16px';
  button.style.padding = '8px 16px';
  button.style.backgroundColor = '#3182ce';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';

  button.addEventListener('click', () => {
    if (checkbox.validate()) {
      alert('Successfully subscribed!');
    } else {
      alert('Please accept the privacy policy to continue');
    }
  });

  container.appendChild(description);
  container.appendChild(checkbox.getElement());
  container.appendChild(button);

  return container;
};

export const DynamicLabelUpdate = () => {
  const container = document.createElement('div');

  // Initial label
  const checkbox = Checkbox({
    label: 'Initial label text',
    onChange: (event, checked) => console.log('Checked:', checked),
  });

  // Button to update with HTML label
  const button = document.createElement('button');
  button.textContent = 'Update to HTML label';
  button.style.marginTop = '16px';
  button.style.marginRight = '8px';

  button.addEventListener('click', () => {
    const newLabel = document.createElement('span');
    newLabel.innerHTML =
      'Updated with <strong>HTML content</strong> and <a href="#" style="color: #3182ce;">a link</a>';
    checkbox.update({ label: newLabel });
  });

  // Button to update back to text
  const textButton = document.createElement('button');
  textButton.textContent = 'Update to text label';
  textButton.style.marginTop = '16px';

  textButton.addEventListener('click', () => {
    checkbox.update({ label: 'Back to simple text label' });
  });

  container.appendChild(checkbox.getElement());
  container.appendChild(button);
  container.appendChild(textButton);

  return container;
};
export const ImprovedValidationUX = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '400px';

  // Add description
  const description = document.createElement('p');
  description.textContent =
    'The validation message only appears when you try to submit without checking the required checkbox:';
  description.style.marginBottom = '16px';

  // Create form
  const form = document.createElement('div');
  form.style.border = '1px solid #e2e8f0';
  form.style.padding = '20px';
  form.style.borderRadius = '8px';

  // Create checkbox with privacy policy link
  const labelContent = document.createElement('span');
  const text1 = document.createTextNode('I agree to the ');
  const link = document.createElement('a');
  link.href = '/terms';
  link.textContent = 'Terms of Service';
  link.style.color = '#3182ce';
  link.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Terms of Service clicked');
  });

  labelContent.appendChild(text1);
  labelContent.appendChild(link);

  const checkbox = Checkbox({
    label: labelContent,
    required: true,
    validationMessage: 'You must agree to the terms to continue',
  });

  // Create submit button
  const button = document.createElement('button');
  button.textContent = 'Submit';
  button.style.marginTop = '16px';
  button.style.padding = '8px 16px';
  button.style.backgroundColor = '#3182ce';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';

  button.addEventListener('click', () => {
    if (checkbox.validate()) {
      alert('Form submitted successfully!');
      // Clear the validation state
      checkbox.update({ checked: false });
    }
  });

  // Assemble
  form.appendChild(checkbox.getElement());
  form.appendChild(button);

  container.appendChild(description);
  container.appendChild(form);

  return container;
};
