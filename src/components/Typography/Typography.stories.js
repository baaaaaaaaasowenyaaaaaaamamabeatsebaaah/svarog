import Typography from './Typography.js';

export default {
  title: 'Components/Typography',
  component: Typography,
};

export const Default = () => {
  const typography = new Typography({
    children: 'Default Typography',
    textAlign: 'left',
  });
  return typography.getElement();
};

export const Heading = () => {
  const typography = new Typography({
    children: 'Heading Typography',
    textAlign: 'center',
    as: 'h1',
    block: true,
  });
  return typography.getElement();
};

export const Italic = () => {
  const typography = new Typography({
    children: 'Italic Typography',

    textAlign: 'right',
    italic: true,
  });
  return typography.getElement();
};
