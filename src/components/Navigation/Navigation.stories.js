// src/components/Navigation/Navigation.stories.js
import Navigation from './Navigation.js';

export default {
  title: 'Components/Navigation',
  component: Navigation,
};

// Create a reusable items array
const menuItems = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: 'home',
  },
  {
    id: 'products',
    label: 'Products',
    href: '/products',
    items: [
      {
        id: 'new',
        label: 'New Arrivals',
        href: '/products/new',
        icon: 'star',
      },
      {
        id: 'categories',
        label: 'Categories',
        href: '/products/categories',
        items: [
          {
            id: 'electronics',
            label: 'Electronics',
            href: '/products/electronics',
          },
          {
            id: 'books',
            label: 'Books',
            href: '/products/books',
          },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    disabled: true,
  },
];

export const Default = () => {
  const nav = new Navigation({
    items: menuItems,
  });
  return nav.getElement();
};

export const WithActiveItem = () => {
  const nav = new Navigation({
    items: menuItems,
    activeId: 'products',
  });
  return nav.getElement();
};

export const WithExpandedItems = () => {
  const nav = new Navigation({
    items: menuItems,
    expandedIds: ['products', 'categories'],
  });
  return nav.getElement();
};

export const NonResponsive = () => {
  const nav = new Navigation({
    items: menuItems,
    responsive: false,
  });
  return nav.getElement();
};
