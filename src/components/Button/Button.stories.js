import Button from './Button.js';

export default {
  title: 'Stage with Button',
  component: Button,
};

export const Default = () => {
  return new Button({
    text: 'Click Me',
    onClick: () => alert('Button in Stage Clicked'),
    className: '',
    disabled: false,
  });
};

export const Disabled = () => {
  return new Button({
    text: 'Disabled',
    onClick: () => alert('Button in Stage Clicked'),
    className: '',
    disabled: true,
  });
};
