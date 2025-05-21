// src/prototypes/HomePage/MuchandyTheme.js
/**
 * Creates a homepage prototype with the Muchandy theme
 * @returns {HTMLElement} The prototype container element
 */
import { switchTheme } from '../../utils/theme.js';
import { Section } from '../../components/Section/index.js';
import Typography from '../../components/Typography/index.js';
import Button from '../../components/Button/index.js';
import Card from '../../components/Card/index.js';
import Grid from '../../components/Grid/index.js';

export default function HomePageMuchandyTheme() {
  // Ensure we're using the Muchandy theme
  switchTheme('muchandy');

  // Create page container
  const container = document.createElement('div');
  container.className = 'prototype-page';

  // Create and append sections
  container.appendChild(createHeader());
  container.appendChild(createHeroSection().getElement());
  container.appendChild(createFeaturesSection().getElement());
  container.appendChild(createTestimonialsSection().getElement());
  container.appendChild(createCallToActionSection().getElement());
  container.appendChild(createFooter());

  return container;
}

/**
 * Creates the header for the Muchandy theme
 * @returns {HTMLElement} The header element
 */
function createHeader() {
  const header = document.createElement('header');
  header.className = 'prototype-header';
  header.style.padding = '20px';
  header.style.backgroundColor = '#ffffff';
  header.style.borderBottom = '2px solid #f0f0f0';
  header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';

  const headerContent = document.createElement('div');
  headerContent.style.maxWidth = '1200px';
  headerContent.style.margin = '0 auto';
  headerContent.style.display = 'flex';
  headerContent.style.justifyContent = 'space-between';
  headerContent.style.alignItems = 'center';

  const logo = Typography({
    as: 'h1',
    children: 'Muchandy',
    weight: 'bold',
    color: '#ff6b6b',
  }).getElement();

  const nav = document.createElement('nav');
  ['Home', 'Services', 'Products', 'About Us', 'Contact'].forEach((item) => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = item;
    link.style.marginLeft = '20px';
    link.style.textDecoration = 'none';
    link.style.color = '#333333';
    link.style.fontWeight = '500';
    link.style.fontSize = '16px';
    link.style.transition = 'color 0.2s ease';
    link.addEventListener('mouseover', () => {
      link.style.color = '#ff6b6b';
    });
    link.addEventListener('mouseout', () => {
      link.style.color = '#333333';
    });
    nav.appendChild(link);
  });

  headerContent.appendChild(logo);
  headerContent.appendChild(nav);
  header.appendChild(headerContent);

  return header;
}

/**
 * Creates the hero section for the Muchandy theme
 * @returns {Object} The Section component
 */
function createHeroSection() {
  return Section({
    backgroundColor: '#ffd8d8',
    children: [
      Typography({
        as: 'h2',
        children: 'Repair Services for Your Devices',
        weight: 'bold',
        color: '#333333',
      }).getElement(),
      Typography({
        as: 'p',
        children:
          'Fast, reliable, and affordable repair services for all your electronic devices. Get your devices fixed by certified technicians.',
        color: '#555555',
      }).getElement(),
      Button({
        text: 'Book a Repair',
        variant: 'primary',
        onClick: () => console.log('Repair button clicked'),
      }).getElement(),
    ],
  });
}

/**
 * Creates the features section for the Muchandy theme
 * @returns {Object} The Section component
 */
function createFeaturesSection() {
  return Section({
    backgroundColor: '#ffffff',
    children: [
      Typography({
        as: 'h2',
        children: 'Our Services',
        weight: 'bold',
        color: '#333333',
        textAlign: 'center',
      }).getElement(),
      Typography({
        as: 'p',
        children: 'We offer a variety of repair services to meet your needs.',
        color: '#666666',
        textAlign: 'center',
      }).getElement(),
      createServiceCards(),
    ],
  });
}

/**
 * Creates service cards for the Muchandy theme
 * @returns {HTMLElement} Grid with service cards
 */
function createServiceCards() {
  const grid = Grid({
    columns: 3,
    gap: '24px',
    children: [],
  });

  // Create service cards
  const services = [
    {
      title: 'Phone Repair',
      content:
        'Screen replacement, battery replacement, water damage repair, and more.',
    },
    {
      title: 'Tablet Repair',
      content:
        'Screen replacement, charging port repair, battery replacement, and more.',
    },
    {
      title: 'Laptop Repair',
      content:
        'Hardware upgrades, screen replacement, keyboard replacement, and more.',
    },
  ];

  services.forEach((service) => {
    const card = Card({
      title: service.title,
      children: service.content,
      elevated: true,
    });
    const cardElement = card.getElement();
    cardElement.style.borderRadius = '12px';
    cardElement.style.border = '1px solid #f0f0f0';
    grid.getElement().appendChild(cardElement);
  });

  return grid.getElement();
}

/**
 * Creates the testimonials section for the Muchandy theme
 * @returns {Object} The Section component
 */
function createTestimonialsSection() {
  return Section({
    variant: 'minor',
    backgroundColor: '#f9f9f9',
    children: [
      Typography({
        as: 'h2',
        children: 'Customer Testimonials',
        weight: 'bold',
        color: '#333333',
        textAlign: 'center',
      }).getElement(),
      createTestimonialCards(),
    ],
  });
}

/**
 * Creates testimonial cards for the Muchandy theme
 * @returns {HTMLElement} Container with testimonial cards
 */
function createTestimonialCards() {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '24px';
  container.style.marginTop = '32px';
  container.style.justifyContent = 'center';

  // Create testimonial cards
  const testimonials = [
    {
      name: 'John Smith',
      comment:
        'Great service! My phone was fixed within an hour and works like new again.',
    },
    {
      name: 'Sarah Johnson',
      comment:
        'The team at Muchandy saved my laptop after water damage. Highly recommended!',
    },
  ];

  testimonials.forEach((testimonial) => {
    const card = document.createElement('div');
    card.style.padding = '24px';
    card.style.backgroundColor = '#ffffff';
    card.style.borderRadius = '12px';
    card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    card.style.maxWidth = '400px';

    const comment = document.createElement('p');
    comment.textContent = `"${testimonial.comment}"`;
    comment.style.fontSize = '16px';
    comment.style.fontStyle = 'italic';
    comment.style.marginBottom = '16px';
    comment.style.color = '#555555';

    const name = document.createElement('p');
    name.textContent = `- ${testimonial.name}`;
    name.style.fontSize = '14px';
    name.style.fontWeight = 'bold';
    name.style.color = '#333333';

    card.appendChild(comment);
    card.appendChild(name);
    container.appendChild(card);
  });

  return container;
}

/**
 * Creates the call to action section for the Muchandy theme
 * @returns {Object} The Section component
 */
function createCallToActionSection() {
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'center';
  buttonContainer.style.marginTop = '24px';

  const button = Button({
    text: 'Contact Us Now',
    variant: 'secondary',
    onClick: () => console.log('Contact button clicked'),
  });

  buttonContainer.appendChild(button.getElement());

  return Section({
    backgroundColor: '#ff6b6b',
    children: [
      Typography({
        as: 'h2',
        children: 'Ready to Get Your Device Fixed?',
        weight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
      }).getElement(),
      Typography({
        as: 'p',
        children: 'Contact us today for a free quote and fast service.',
        color: '#ffffff',
        textAlign: 'center',
      }).getElement(),
      buttonContainer,
    ],
  });
}

/**
 * Creates the footer for the Muchandy theme
 * @returns {HTMLElement} The footer element
 */
function createFooter() {
  const footer = document.createElement('footer');
  footer.style.padding = '40px 20px';
  footer.style.backgroundColor = '#333333';
  footer.style.color = '#ffffff';

  const footerContent = document.createElement('div');
  footerContent.style.maxWidth = '1200px';
  footerContent.style.margin = '0 auto';
  footerContent.style.display = 'flex';
  footerContent.style.flexDirection = 'column';
  footerContent.style.alignItems = 'center';

  const copyright = document.createElement('p');
  copyright.textContent =
    '© 2025 Muchandy Repair Services. All rights reserved.';
  copyright.style.marginBottom = '16px';

  const address = document.createElement('p');
  address.textContent = '123 Repair Street, Techville, TX 12345';
  address.style.fontSize = '14px';
  address.style.color = '#cccccc';

  const socialLinks = document.createElement('div');
  socialLinks.style.display = 'flex';
  socialLinks.style.gap = '16px';
  socialLinks.style.marginTop = '16px';

  ['Facebook', 'Twitter', 'Instagram'].forEach((platform) => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = platform;
    link.style.color = '#ff6b6b';
    link.style.textDecoration = 'none';
    socialLinks.appendChild(link);
  });

  footerContent.appendChild(copyright);
  footerContent.appendChild(address);
  footerContent.appendChild(socialLinks);
  footer.appendChild(footerContent);

  return footer;
}
