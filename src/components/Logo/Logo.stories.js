// src/components/Logo/Logo.stories.js
import Logo from './index.js';
// Import SVG directly - webpack 5 will handle this with Asset Modules
import svarogSvg from '../../../.storybook/assets/svg/svarog.svg';
import muchandySvg from '../../../.storybook/assets/svg/logo-farbe.svg';

export default {
  title: 'Components/Logo',
  component: Logo,
};

export const Default = () => {
  const logo = Logo({
    src: svarogSvg,
  });
  return logo.getElement();
};

// Simple alias to handle backward compatibility with old stories
export const SingleLogo = Default;

export const WithCustomSizes = () => {
  const logo = Logo({
    src: svarogSvg,
    className: 'custom-size-logo',
  });

  // Add custom styles
  const style = document.createElement('style');
  style.textContent = `
    .custom-size-logo {
      --logo-width: 200px;
      --logo-height: 60px;
    }
  `;

  const container = document.createElement('div');
  container.appendChild(style);
  container.appendChild(logo.getElement());

  return container;
};

export const WithFallback = () => {
  // Use an invalid path to trigger the fallback
  const logo = Logo({
    src: 'invalid-path.svg',
    fallbackSrc: '/assets/images/fallback-logo.svg',
    alt: 'Fallback Logo',
  });

  const container = document.createElement('div');
  const description = document.createElement('p');
  description.textContent =
    'This logo uses an invalid path, so it falls back to the fallback SVG:';
  description.style.marginBottom = '10px';
  container.appendChild(description);
  container.appendChild(logo.getElement());

  return container;
};

export const WithClickHandler = () => {
  const logo = Logo({
    src: svarogSvg,
    onClick: () => {
      alert('Logo clicked!');
    },
  });

  const container = document.createElement('div');
  container.appendChild(logo.getElement());

  const description = document.createElement('p');
  description.textContent = 'Click the logo to trigger an action';
  description.style.marginTop = '10px';
  container.appendChild(description);

  return container;
};
