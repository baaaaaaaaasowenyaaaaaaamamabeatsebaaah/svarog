// src/components/Link/Link.stories.js
import Link from './Link.js';

export default {
  title: 'Components/Link',
  component: Link,
};

export const Default = () => {
  const link = Link({
    children: 'Click me',
    href: '#',
    target: '_blank',
    underline: true,
    block: false,
  });
  return link.getElement();
};

export const BlockLink = () => {
  const link = Link({
    children: 'Block link',
    href: '#',
    target: '_self',
    underline: false,
    block: true,
  });
  return link.getElement();
};

export const WithClick = () => {
  const link = Link({
    children: 'Click event',
    href: '#',
    onClick: () => alert('Link clicked!'),
  });
  return link.getElement();
};

export const WithComponent = () => {
  // Create a simple icon span
  const icon = document.createElement('span');
  icon.textContent = '🔗 ';

  const link = Link({
    children: icon,
    href: 'https://example.com',
    target: '_blank',
  });

  // Add text node after the icon
  link.getElement().appendChild(document.createTextNode('Link with icon'));

  return link.getElement();
};
