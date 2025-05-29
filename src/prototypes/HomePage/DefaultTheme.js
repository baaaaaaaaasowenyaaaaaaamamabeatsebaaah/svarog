// src/prototypes/HomePage/DefaultTheme.js
/**
 * Creates a homepage prototype with the default theme
 * @returns {HTMLElement} The prototype container element
 */
import { switchTheme } from '../../utils/themeManager.js';
import { Section } from '../../components/Section/index.js';
import Typography from '../../components/Typography/index.js';
import Button from '../../components/Button/index.js';
import Card from '../../components/Card/index.js';

export default function HomePageDefaultTheme() {
  // Ensure we're using the default theme
  switchTheme('default');

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
 * Creates the header for the default theme
 * @returns {HTMLElement} The header element
 */
function createHeader() {
  const header = document.createElement('header');
  header.className = 'prototype-header';
  header.style.padding = '20px';
  header.style.backgroundColor = '#f8f9fa';
  header.style.borderBottom = '1px solid #dee2e6';

  const headerContent = document.createElement('div');
  headerContent.style.maxWidth = '1200px';
  headerContent.style.margin = '0 auto';
  headerContent.style.display = 'flex';
  headerContent.style.justifyContent = 'space-between';
  headerContent.style.alignItems = 'center';

  const logo = Typography({
    as: 'h1',
    children: 'Svarog Demo',
    weight: 'bold',
  }).getElement();

  const nav = document.createElement('nav');
  ['Home', 'Products', 'About', 'Contact'].forEach((item) => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = item;
    link.style.marginLeft = '20px';
    link.style.textDecoration = 'none';
    link.style.color = '#007bff';
    nav.appendChild(link);
  });

  headerContent.appendChild(logo);
  headerContent.appendChild(nav);
  header.appendChild(headerContent);

  return header;
}

/**
 * Creates the hero section for the default theme
 * @returns {Object} The Section component
 */
function createHeroSection() {
  return Section({
    children: [
      Typography({
        as: 'h2',
        children: 'Welcome to Our Website',
        weight: 'bold',
      }).getElement(),
      Typography({
        as: 'p',
        children:
          'This is a sample homepage prototype using the Default theme.',
      }).getElement(),
      Button({
        text: 'Learn More',
        variant: 'primary',
        onClick: () => console.log('Button clicked'),
      }).getElement(),
    ],
  });
}

/**
 * Creates the features section for the default theme
 * @returns {Object} The Section component
 */
function createFeaturesSection() {
  return Section({
    variant: 'minor',
    children: [
      Typography({
        as: 'h2',
        children: 'Our Features',
        weight: 'bold',
      }).getElement(),
      createFeatureCards(),
    ],
  });
}

/**
 * Creates feature cards for the default theme
 * @returns {HTMLElement} Container with feature cards
 */
function createFeatureCards() {
  const cardContainer = document.createElement('div');
  cardContainer.style.display = 'flex';
  cardContainer.style.gap = '20px';
  cardContainer.style.marginTop = '20px';

  // Create three feature cards
  const features = [
    { title: 'Feature 1', content: 'Description of feature 1' },
    { title: 'Feature 2', content: 'Description of feature 2' },
    { title: 'Feature 3', content: 'Description of feature 3' },
  ];

  features.forEach((feature) => {
    const card = Card({
      title: feature.title,
      children: feature.content,
      elevated: true,
    });
    cardContainer.appendChild(card.getElement());
  });

  return cardContainer;
}

/**
 * Creates the footer for the default theme
 * @returns {HTMLElement} The footer element
 */
function createFooter() {
  const footer = document.createElement('footer');
  footer.style.padding = '20px';
  footer.style.backgroundColor = '#f8f9fa';
  footer.style.borderTop = '1px solid #dee2e6';
  footer.style.textAlign = 'center';
  footer.textContent = '© 2025 Svarog Component Library. All rights reserved.';

  return footer;
}
