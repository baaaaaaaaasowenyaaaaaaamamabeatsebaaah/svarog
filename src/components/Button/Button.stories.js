// src/components/Button/Button.stories.js
import Button from './Button.js';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Default = () => {
  return Button({
    text: 'Default Button',
    onClick: () => console.log('Button clicked'),
  });
};

export const Primary = () => {
  return Button({
    text: 'Primary Button',
    variant: 'primary',
    onClick: () => console.log('Primary button clicked'),
  });
};

export const Secondary = () => {
  return Button({
    text: 'Secondary Button',
    variant: 'secondary',
    onClick: () => console.log('Secondary button clicked'),
  });
};

export const Text = () => {
  return Button({
    text: 'Text Button',
    variant: 'text',
    onClick: () => console.log('Text button clicked'),
  });
};

export const Success = () => {
  return Button({
    text: 'Success Button',
    variant: 'success',
    onClick: () => console.log('Success button clicked'),
  });
};

export const Danger = () => {
  return Button({
    text: 'Danger Button',
    variant: 'danger',
    onClick: () => console.log('Danger button clicked'),
  });
};

export const Outlined = () => {
  return Button({
    text: 'Outlined Button',
    variant: 'outlined',
    onClick: () => console.log('Outlined button clicked'),
  });
};

export const IconButton = () => {
  return Button({
    text: '✓',
    variant: 'icon',
    onClick: () => console.log('Icon button clicked'),
  });
};

export const Small = () => {
  return Button({
    text: 'Small Button',
    size: 'sm',
    onClick: () => console.log('Small button clicked'),
  });
};

export const Large = () => {
  return Button({
    text: 'Large Button',
    size: 'lg',
    onClick: () => console.log('Large button clicked'),
  });
};

export const Disabled = () => {
  return Button({
    text: 'Disabled Button',
    disabled: true,
    onClick: () => console.log('This should not log'),
  });
};

export const WithCustomClass = () => {
  return Button({
    text: 'Custom Class Button',
    className: 'custom-button-class',
    onClick: () => console.log('Custom class button clicked'),
  });
};

export const AllVariants = () => {
  // Create a container to hold all button variants
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '16px';
  container.style.padding = '20px';

  // Add heading for variants section
  const variantsHeading = document.createElement('h3');
  variantsHeading.textContent = 'Button Variants';
  variantsHeading.style.marginBottom = '12px';
  container.appendChild(variantsHeading);

  // Add section for all button variants
  const variantsSection = document.createElement('div');
  variantsSection.style.display = 'flex';
  variantsSection.style.flexWrap = 'wrap';
  variantsSection.style.gap = '12px';
  variantsSection.style.marginBottom = '32px';

  // Add all button variants from CSS
  const variants = [
    { name: 'default', text: 'Default Button', variant: '' },
    { name: 'primary', text: 'Primary Button', variant: 'primary' },
    { name: 'secondary', text: 'Secondary Button', variant: 'secondary' },
    { name: 'text', text: 'Text Button', variant: 'text' },
    { name: 'success', text: 'Success Button', variant: 'success' },
    { name: 'danger', text: 'Danger Button', variant: 'danger' },
    { name: 'outlined', text: 'Outlined Button', variant: 'outlined' },
    { name: 'icon', text: '✓', variant: 'icon' },
  ];

  variants.forEach(({ name, text, variant }) => {
    const button = Button({
      text: text,
      variant: variant,
      onClick: () => console.log(`${name} button clicked`),
    });
    variantsSection.appendChild(button.getElement());
  });

  container.appendChild(variantsSection);

  // Add heading for sizes section
  const sizesHeading = document.createElement('h3');
  sizesHeading.textContent = 'Button Sizes';
  sizesHeading.style.marginBottom = '12px';
  container.appendChild(sizesHeading);

  // Add section for different sizes
  const sizesSection = document.createElement('div');
  sizesSection.style.display = 'flex';
  sizesSection.style.gap = '12px';
  sizesSection.style.alignItems = 'center';
  sizesSection.style.marginBottom = '32px';

  // Add different button sizes
  ['sm', '', 'lg'].forEach((size) => {
    const button = Button({
      text: size ? `${size.toUpperCase()} Size` : 'Default Size',
      size: size,
      variant: 'primary',
      onClick: () => console.log(`${size || 'default'} size button clicked`),
    });
    sizesSection.appendChild(button.getElement());
  });

  container.appendChild(sizesSection);

  // Add heading for button states
  const statesHeading = document.createElement('h3');
  statesHeading.textContent = 'Button States';
  statesHeading.style.marginBottom = '12px';
  container.appendChild(statesHeading);

  // Add section for states
  const statesSection = document.createElement('div');
  statesSection.style.display = 'flex';
  statesSection.style.gap = '12px';
  statesSection.style.marginBottom = '32px';

  // Regular button
  const regularButton = Button({
    text: 'Regular Button',
    variant: 'primary',
    onClick: () => console.log('Regular button clicked'),
  });
  statesSection.appendChild(regularButton.getElement());

  // Hover state (informational text)
  const hoverInfo = document.createElement('span');
  hoverInfo.textContent = '(Hover to see hover state)';
  hoverInfo.style.padding = '8px';
  hoverInfo.style.color = '#666';
  statesSection.appendChild(hoverInfo);

  // Disabled button
  const disabledButton = Button({
    text: 'Disabled Button',
    variant: 'primary',
    disabled: true,
    onClick: () => console.log('This should not log'),
  });
  statesSection.appendChild(disabledButton.getElement());

  container.appendChild(statesSection);

  return container;
};

export const ButtonWithIcon = () => {
  // This would need updates to the Button component to support icon + text
  // For now, showing a simple example with emoji
  return Button({
    text: '🔍 Search',
    onClick: () => console.log('Button with icon clicked'),
  });
};

export const ButtonIconRight = () => {
  // This would need updates to the Button component to support icon + text
  // For now, showing a simple example with emoji
  return Button({
    text: 'Next →',
    onClick: () => console.log('Button with right icon clicked'),
  });
};
