import Logo from './Logo.js';
import './Logo.css';
// Import SVG directly - webpack 5 will handle this with Asset Modules
import svgLogo from '../../../.storybook/assets/svg/svarog.svg';

export default {
  title: 'Components/Logo',
  component: Logo,
};

export const Default = () => {
  const logo = new Logo({ svgPath: svgLogo });
  return logo.getElement();
};
