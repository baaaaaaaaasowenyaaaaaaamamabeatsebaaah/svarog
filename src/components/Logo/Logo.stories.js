import Logo from './Logo';
import './Logo.css';
import svgLogo from '../../../.storybook/assets/svg/svarog.svg';

export default {
  title: 'Components/Logo',
  component: Logo,
};

export const Default = () => {
  const logo = new Logo({ svgPath: svgLogo });
  return logo.getElement();
};
