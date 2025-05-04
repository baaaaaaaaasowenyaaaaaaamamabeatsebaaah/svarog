// src/components/Logo/Logo.stories.js
import Logo from './Logo.js';
import { getCurrentTheme } from '../../utils/theme.js';
// Import SVG directly - webpack 5 will handle this with Asset Modules
import svarogSvg from '../../../.storybook/assets/svg/svarog.svg';
import muchandySvg from '../../../.storybook/assets/svg/logo-farbe.svg';

export default {
  title: 'Components/Logo',
  component: Logo,
};

export const Default = () => {
  const logo = new Logo({
    sources: svarogSvg,
  });
  return logo.getElement();
};

// Simple alias to handle backward compatibility with old stories
export const SingleLogo = Default;

export const WithThemeSpecificLogos = () => {
  // In a real application, these would be different images for each theme
  // For this example, we're using theme-named SVGs
  const logo = new Logo({
    sources: {
      default: svarogSvg,
      cabalou: svarogSvg,
      muchandy: muchandySvg,
    },
    alt: 'Theme-specific Logo',
  });

  // Create a container with descriptive text
  const container = document.createElement('div');

  // Create description
  const description = document.createElement('div');
  description.style.marginBottom = '20px';
  description.innerHTML = `
    <p><strong>Theme-specific Logo Example</strong></p>
    <p>This logo automatically updates when you change the theme using the 
    theme selector in the header toolbar above.</p>
    <p><em>Try switching between Default, Cabalou, and Muchandy themes to see the logo update.</em></p>
  `;

  container.appendChild(description);
  container.appendChild(logo.getElement());

  // Create a theme indicator to show current theme
  const themeIndicator = document.createElement('div');
  themeIndicator.style.marginTop = '20px';
  themeIndicator.style.padding = '10px';
  themeIndicator.style.backgroundColor = '#f5f5f5';
  themeIndicator.style.borderRadius = '4px';

  // Update theme indicator to show current theme
  const updateThemeIndicator = (event) => {
    const currentTheme = getCurrentTheme() || 'default';
    themeIndicator.textContent = `Current Theme: ${currentTheme}`;

    // Log information for debugging purposes
    console.log('Theme updated to:', currentTheme, event?.detail);
  };

  // Initial update
  updateThemeIndicator();

  // Listen for theme changes
  window.addEventListener('themechange', updateThemeIndicator);

  // Clean up event listener when component is destroyed
  // This helps with Storybook hot reloading
  const originalRemoveChild = container.removeChild;
  container.removeChild = function (child) {
    if (child === logo.getElement()) {
      window.removeEventListener('themechange', updateThemeIndicator);
      logo.destroy();
      console.log('Cleaned up theme listener in story');
    }
    return originalRemoveChild.call(this, child);
  };

  container.appendChild(themeIndicator);

  return container;
};

export const WithCustomSizes = () => {
  const logo = new Logo({
    sources: svarogSvg,
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
  const logo = new Logo({
    sources: {
      default: 'invalid-path.svg',
    },
    fallbackPath: '/assets/images/fallback-logo.svg',
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
  const logo = new Logo({
    sources: svarogSvg,
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
