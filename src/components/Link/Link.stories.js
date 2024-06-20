import Link from './Link';

export default {
  title: 'Components/Link',
  component: Link,
};

export const Default = () => {
  const link = new Link({
    children: 'Click me',
    href: '#',
    target: '_blank',
    underline: true,
    block: false,
  });
  return link.getElement();
};

export const BlockLink = () => {
  const link = new Link({
    children: 'Block link',
    href: '#',
    target: '_self',
    underline: false,
    block: true,
  });
  return link.getElement();
};
