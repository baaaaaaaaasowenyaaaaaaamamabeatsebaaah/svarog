import Typography from './Typography';

export default {
  title: 'Components/Typography',
  component: Typography,
};

export const Default = () => {
  const typography = new Typography({
    children: 'Default Typography',
    size: '16px',
    color: 'black',
    textAlign: 'left',
  });
  return typography.getElement();
};

export const Heading = () => {
  const typography = new Typography({
    children: 'Heading Typography',
    size: '24px',
    color: 'blue',
    textAlign: 'center',
    weight: 'bold',
    as: 'h1',
  });
  return typography.getElement();
};

export const Italic = () => {
  const typography = new Typography({
    children: 'Italic Typography',
    size: '14px',
    color: 'gray',
    textAlign: 'right',
    italic: true,
  });
  return typography.getElement();
};
