// src/components/Button/Button.stories.js
import Button from './Button.js';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Default = () => {
  return new Button({
    text: 'Default Button',
    onClick: () => console.log('Button clicked'),
  });
};

export const Primary = () => {
  return new Button({
    text: 'Primary Button',
    variant: 'primary',
    onClick: () => console.log('Primary button clicked'),
  });
};

export const Secondary = () => {
  return new Button({
    text: 'Secondary Button',
    variant: 'secondary',
    onClick: () => console.log('Secondary button clicked'),
  });
};

export const Text = () => {
  return new Button({
    text: 'Text Button',
    variant: 'text',
    onClick: () => console.log('Text button clicked'),
  });
};

export const Small = () => {
  return new Button({
    text: 'Small Button',
    size: 'sm',
    onClick: () => console.log('Small button clicked'),
  });
};

export const Large = () => {
  return new Button({
    text: 'Large Button',
    size: 'lg',
    onClick: () => console.log('Large button clicked'),
  });
};

export const Disabled = () => {
  return new Button({
    text: 'Disabled Button',
    disabled: true,
    onClick: () => console.log('This should not log'),
  });
};

export const WithCustomClass = () => {
  return new Button({
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

  // Add section for default, primary, secondary buttons
  const variantsSection = document.createElement('div');
  variantsSection.style.display = 'flex';
  variantsSection.style.gap = '16px';
  variantsSection.style.marginBottom = '24px';

  // Add different button variants
  ['default', 'primary', 'secondary', 'text'].forEach((variant) => {
    const button = new Button({
      text: variant
        ? `${variant.charAt(0).toUpperCase() + variant.slice(1)} Button`
        : 'Default Button',
      variant: variant === 'default' ? '' : variant,
      onClick: () => console.log(`${variant} button clicked`),
    });
    variantsSection.appendChild(button.getElement());
  });

  // Add section for different sizes
  const sizesSection = document.createElement('div');
  sizesSection.style.display = 'flex';
  sizesSection.style.gap = '16px';
  sizesSection.style.alignItems = 'center';
  sizesSection.style.marginBottom = '24px';

  // Add different button sizes
  ['sm', '', 'lg'].forEach((size) => {
    const button = new Button({
      text: size ? `${size.toUpperCase()} Size` : 'Default Size',
      size: size,
      variant: 'primary',
      onClick: () => console.log(`${size || 'default'} size button clicked`),
    });
    sizesSection.appendChild(button.getElement());
  });

  // Add section for states
  const statesSection = document.createElement('div');
  statesSection.style.display = 'flex';
  statesSection.style.gap = '16px';

  // Regular button
  const regularButton = new Button({
    text: 'Regular Button',
    variant: 'primary',
    onClick: () => console.log('Regular button clicked'),
  });
  statesSection.appendChild(regularButton.getElement());

  // Disabled button
  const disabledButton = new Button({
    text: 'Disabled Button',
    variant: 'primary',
    disabled: true,
    onClick: () => console.log('This should not log'),
  });
  statesSection.appendChild(disabledButton.getElement());

  // Assemble all sections
  container.appendChild(document.createElement('h3')).textContent =
    'Button Variants';
  container.appendChild(variantsSection);
  container.appendChild(document.createElement('h3')).textContent =
    'Button Sizes';
  container.appendChild(sizesSection);
  container.appendChild(document.createElement('h3')).textContent =
    'Button States';
  container.appendChild(statesSection);

  return container;
};
