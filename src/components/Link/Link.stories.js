import Link from './Link';

export default {
  title: 'Components/Link',
  component: Link,
};

export const Default = () => {
  const link = new Link({
    children: 'Click me',
    href: '#',
    color: 'blue',
    hoverColor: 'red',
    size: '1rem',
    target: '_blank',
    weight: 'bold',
    underline: true,
    block: false,
  });
  return link.getElement();
};

export const BlockLink = () => {
  const link = new Link({
    children: 'Block link',
    href: '#',
    color: 'green',
    hoverColor: 'darkgreen',
    size: '1.2rem',
    target: '_self',
    weight: 'normal',
    underline: false,
    block: true,
  });
  return link.getElement();
};
