// src/components/Header/Header.stories.js (continued)
import Header from './Header.js';

export default {
  title: 'Components/Layout/Header',
  component: Header,
};

const navigationItems = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Services', url: '/services' },
  { label: 'Blog', url: '/blog' },
  { label: 'Contact', url: '/contact' },
];

export const Default = () => {
  return new Header({
    siteName: 'Svarog Site',
    navigation: {
      items: navigationItems,
    },
    logo: 'https://via.placeholder.com/150x50/333/fff?text=LOGO',
  });
};

export const WithoutLogo = () => {
  return new Header({
    siteName: 'Svarog Site',
    navigation: {
      items: navigationItems,
    },
  });
};

export const WithoutNavigation = () => {
  return new Header({
    siteName: 'Svarog Site',
    logo: 'https://via.placeholder.com/150x50/333/fff?text=LOGO',
  });
};

export const MinimalHeader = () => {
  return new Header({
    siteName: 'Minimal Site',
  });
};

export const WithManyNavItems = () => {
  const manyItems = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Services', url: '/services' },
    { label: 'Portfolio', url: '/portfolio' },
    { label: 'Blog', url: '/blog' },
    { label: 'Team', url: '/team' },
    { label: 'Careers', url: '/careers' },
    { label: 'Contact', url: '/contact' },
  ];

  return new Header({
    siteName: 'Large Site',
    navigation: {
      items: manyItems,
    },
    logo: 'https://via.placeholder.com/150x50/333/fff?text=LOGO',
  });
};
