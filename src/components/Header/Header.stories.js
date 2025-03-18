// src/components/Header/Header.stories.js
import Header from './Header.js';
import svarogLogo from '../../../.storybook/assets/svg/svarog.svg';

export default {
  title: 'Components/Header',
  component: Header,
};

// Sample navigation items
const navItems = [
  {
    id: 'home',
    label: 'Home',
    href: '#',
  },
  {
    id: 'products',
    label: 'Products',
    href: '#',
    items: [
      {
        id: 'category1',
        label: 'Category 1',
        href: '#category1',
      },
      {
        id: 'category2',
        label: 'Category 2',
        href: '#category2',
      },
    ],
  },
  {
    id: 'about',
    label: 'About',
    href: '#',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '#',
  },
];

export const Default = () => {
  return new Header({
    title: 'Svarog',
    navItems: navItems,
  });
};

export const WithLogo = () => {
  return new Header({
    logo: svarogLogo,
    title: 'Svarog',
    navItems: navItems,
  });
};

export const OnlyLogo = () => {
  return new Header({
    logo: svarogLogo,
    navItems: navItems,
  });
};

export const Sticky = () => {
  const container = document.createElement('div');
  container.style.height = '200vh'; // Make the page scrollable

  const headerDescription = document.createElement('div');
  headerDescription.innerHTML =
    '<p style="padding: 1rem; background: #f5f5f5; margin-bottom: 1rem;">This header is sticky. Scroll down to see it stick to the top.</p>';

  const header = new Header({
    logo: svarogLogo,
    title: 'Sticky Header',
    navItems: navItems,
    sticky: true,
  });

  const content = document.createElement('div');
  content.innerHTML =
    '<div style="padding: 1rem;"><h2>Page Content</h2><p>Scroll down to see the sticky header in action.</p></div>';

  container.appendChild(headerDescription);
  container.appendChild(header.getElement());
  container.appendChild(content);

  return container;
};

export const Transparent = () => {
  const container = document.createElement('div');

  // Create a colorful background to demonstrate transparency
  const background = document.createElement('div');
  background.style.position = 'absolute';
  background.style.top = '0';
  background.style.left = '0';
  background.style.right = '0';
  background.style.height = '200px';
  background.style.background =
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  background.style.zIndex = '0';

  const header = new Header({
    logo: svarogLogo,
    title: 'Transparent Header',
    navItems: navItems,
    transparent: true,
  });

  const content = document.createElement('div');
  content.style.paddingTop = '220px'; // Space for the header and background
  content.innerHTML =
    '<div style="padding: 1rem;"><h2>Page Content</h2><p>Notice how the header is transparent, showing the gradient background behind it.</p></div>';

  container.style.position = 'relative';
  container.appendChild(background);
  container.appendChild(header.getElement());
  container.appendChild(content);

  return container;
};

export const CustomStyling = () => {
  const container = document.createElement('div');

  // Add custom CSS
  const style = document.createElement('style');
  style.textContent = `
    .custom-header {
      --header-bg: #1a1a2e;
      --header-color: #ffffff;
      --header-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      --header-height: 70px;
    }
    
    .custom-header .header__title {
      font-family: 'Arial', sans-serif;
      font-weight: 300;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  `;

  const header = new Header({
    logo: svarogLogo,
    title: 'Custom Header',
    navItems: navItems,
    className: 'custom-header',
  });

  container.appendChild(style);
  container.appendChild(header.getElement());

  return container;
};
