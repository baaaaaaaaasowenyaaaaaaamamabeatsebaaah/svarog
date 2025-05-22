// src/prototypes/HomePage/CabalouTheme.js
/**
 * Creates a homepage prototype with the Cabalou theme
 * @returns {HTMLElement} The prototype container element
 */
import { switchTheme } from '../../utils/theme.js';
import { Section } from '../../components/Section/index.js';
import Typography from '../../components/Typography/index.js';
import Button from '../../components/Button/index.js';
import Card from '../../components/Card/index.js';

export default function HomePageCabalouTheme() {
  // Ensure we're using the Cabalou theme
  switchTheme('cabalou');

  // Create page container
  const container = document.createElement('div');
  container.className = 'prototype-page';

  // Create and append sections
  container.appendChild(createHeader());
  container.appendChild(createHeroSection().getElement());
  container.appendChild(createFeaturesSection().getElement());
  container.appendChild(createFooter());

  return container;
}

/**
 * Creates the header for the Cabalou theme
 * @returns {HTMLElement} The header element
 */
function createHeader() {
  const header = document.createElement('header');
  header.className = 'prototype-header';
  header.style.padding = '24px';
  header.style.backgroundColor = '#1a1a2e';
  header.style.borderBottom = '1px solid #16213e';
  header.style.color = '#ffffff';

  const headerContent = document.createElement('div');
  headerContent.style.maxWidth = '1200px';
  headerContent.style.margin = '0 auto';
  headerContent.style.display = 'flex';
  headerContent.style.justifyContent = 'space-between';
  headerContent.style.alignItems = 'center';

  const logo = Typography({
    as: 'h1',
    children: 'Cabalou Demo',
    weight: 'bold',
    color: '#e94560',
  }).getElement();

  const nav = document.createElement('nav');
  ['Home', 'Products', 'About', 'Contact'].forEach((item) => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = item;
    link.style.marginLeft = '24px';
    link.style.textDecoration = 'none';
    link.style.color = '#ffffff';
    link.style.fontWeight = '500';
    link.style.transition = 'color 0.3s ease';
    link.addEventListener('mouseover', () => {
      link.style.color = '#e94560';
    });
    link.addEventListener('mouseout', () => {
      link.style.color = '#ffffff';
    });
    nav.appendChild(link);
  });

  headerContent.appendChild(logo);
  headerContent.appendChild(nav);
  header.appendChild(headerContent);

  return header;
}

/**
 * Creates the hero section for the Cabalou theme
 * @returns {Object} The Section component
 */
function createHeroSection() {
  return Section({
    backgroundColor: '#16213e',
    children: [
      Typography({
        as: 'h2',
        children: 'Modern Solutions for Your Business',
        weight: 'bold',
        color: '#ffffff',
      }).getElement(),
      Typography({
        as: 'p',
        children:
          'This is a sample homepage prototype using the Cabalou theme with dark color scheme and modern design elements.',
        color: '#a9a9a9',
      }).getElement(),
      Button({
        text: 'Get Started',
        variant: 'primary',
        onClick: () => console.log('Button clicked'),
      }).getElement(),
    ],
  });
}

/**
 * Creates the features section for the Cabalou theme
 * @returns {Object} The Section component
 */
function createFeaturesSection() {
  return Section({
    backgroundColor: '#0f3460',
    children: [
      Typography({
        as: 'h2',
        children: 'Our Services',
        weight: 'bold',
        color: '#ffffff',
      }).getElement(),
      createFeatureCards(),
    ],
  });
}

/**
 * Creates feature cards for the Cabalou theme
 * @returns {HTMLElement} Container with feature cards
 */
function createFeatureCards() {
  const cardContainer = document.createElement('div');
  cardContainer.style.display = 'flex';
  cardContainer.style.gap = '24px';
  cardContainer.style.marginTop = '32px';

  // Create three feature cards
  const features = [
    {
      title: 'Consulting',
      content: 'Strategic business consulting for growth and optimization',
    },
    {
      title: 'Development',
      content: 'Custom software development with cutting-edge technologies',
    },
    {
      title: 'Analytics',
      content: 'Data-driven insights to improve business performance',
    },
  ];

  features.forEach((feature) => {
    const card = Card({
      title: feature.title,
      children: feature.content,
      elevated: true,
    });
    const cardElement = card.getElement();
    cardElement.style.backgroundColor = '#1a1a2e';
    cardElement.style.color = '#ffffff';
    cardElement.style.borderRadius = '8px';
    cardContainer.appendChild(cardElement);
  });

  return cardContainer;
}

/**
 * Creates the footer for the Cabalou theme
 * @returns {HTMLElement} The footer element
 */
function createFooter() {
  const footer = document.createElement('footer');
  footer.style.padding = '24px';
  footer.style.backgroundColor = '#1a1a2e';
  footer.style.borderTop = '1px solid #16213e';
  footer.style.textAlign = 'center';
  footer.style.color = '#a9a9a9';
  footer.textContent = '© 2025 Cabalou Solutions. All rights reserved.';

  return footer;
}
