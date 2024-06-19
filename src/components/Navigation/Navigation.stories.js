import { Navigation } from './Navigation';

export default {
  title: 'Navigation',
  component: Navigation,
};

export const Default = () => {
  const items = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Services', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  const navigation = new Navigation({ items, theme: 'default-theme' });
  return navigation.getElement();
};
