import Button from './Button';

export default {
  title: 'Button',
};

export const Default = () => {
  return new Button({
    text: 'Click Me',
    onClick: () => alert('Button Clicked!'),
  });
};
