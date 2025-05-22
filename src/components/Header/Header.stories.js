// src/components/Header/Header.stories.js
import Header from './index.js';

export default {
  title: 'Components/Layout/Header',
  component: Header,
};

const navigationItems = [
  { id: 'home', label: 'Home', url: '/' },
  { id: 'about', label: 'About', url: '/about' },
  { id: 'services', label: 'Services', href: '/services' }, // Using href for demonstration
  { id: 'blog', label: 'Blog', href: '/blog' }, // Using href for demonstration
  { id: 'contact', label: 'Contact', url: '/contact' },
];

export const Default = () => {
  return Header({
    siteName: 'Svarog Site',
    navigation: {
      items: navigationItems,
    },
    logo: 'https://via.placeholder.com/150x50/333/fff?text=LOGO',
  });
};

export const WithoutLogo = () => {
  return Header({
    siteName: 'Svarog Site',
    navigation: {
      items: navigationItems,
    },
  });
};

export const WithoutNavigation = () => {
  return Header({
    siteName: 'Svarog Site',
    logo: 'https://via.placeholder.com/150x50/333/fff?text=LOGO',
  });
};

export const MinimalHeader = () => {
  return Header({
    siteName: 'Minimal Site',
  });
};

export const WithManyNavItems = () => {
  const manyItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
    { id: 'blog', label: 'Blog', href: '/blog' },
    { id: 'team', label: 'Team', href: '/team' },
    { id: 'careers', label: 'Careers', href: '/careers' },
    { id: 'contact', label: 'Contact', href: '/contact' },
  ];

  return Header({
    siteName: 'Large Site',
    navigation: {
      items: manyItems,
    },
    logo: 'https://via.placeholder.com/150x50/333/fff?text=LOGO',
  });
};

export const WithNestedNavigation = () => {
  const nestedItems = [
    { id: 'home', label: 'Home', href: '/' },
    {
      id: 'products',
      label: 'Products',
      items: [
        { id: 'product1', label: 'Product 1', url: '/products/1' },
        { id: 'product2', label: 'Product 2', href: '/products/2' },
        {
          id: 'categories',
          label: 'Categories',
          items: [
            { id: 'category1', label: 'Category 1', url: '/categories/1' },
            { id: 'category2', label: 'Category 2', url: '/categories/2' },
          ],
        },
      ],
    },
    { id: 'about', label: 'About', url: '/about' },
  ];

  return Header({
    siteName: 'Nested Navigation Example',
    navigation: {
      items: nestedItems,
    },
    logo: 'https://via.placeholder.com/150x50/333/fff?text=LOGO',
  });
};

export const WithCustomClassName = () => {
  return Header({
    siteName: 'Custom Styled Site',
    navigation: {
      items: navigationItems,
    },
    logo: 'https://via.placeholder.com/150x50/333/fff?text=LOGO',
    className: 'custom-header',
  });
};
