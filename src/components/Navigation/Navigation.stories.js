import { Navigation } from './Navigation';

export default {
  title: 'Navigation',
  component: Navigation,
};

export const Default = () => {
  const items = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  let activeHref = window.location.hash || '#home'; // Set the initial active item based on the URL hash

  const handleItemClick = (href) => {
    activeHref = href;
    window.location.hash = href; // Update the URL hash
    updateActiveState();
  };

  const updateActiveState = () => {
    const links = navigation.getElement().querySelectorAll('a');
    links.forEach((link) => {
      if (link.getAttribute('href') === activeHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  const navigation = new Navigation({
    items: items.map((item) => ({
      ...item,
      onClick: () => handleItemClick(item.href),
    })),
    onItemClick: handleItemClick,
  });

  setTimeout(updateActiveState, 0); // Initial active state update

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    activeHref = window.location.hash;
    updateActiveState();
  });

  return navigation.getElement();
};
