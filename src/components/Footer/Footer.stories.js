// src/components/Footer/Footer.stories.js
import createFooter from './Footer.js';

export default {
  title: 'Components/Layout/Footer',
  component: createFooter,
};

const defaultFooterConfig = {
  copyright: '© 2024 Svarog Site. All rights reserved.',
  links: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    { platform: 'Twitter', href: 'https://twitter.com/svarog' },
    { platform: 'GitHub', href: 'https://github.com/svarog' },
    { platform: 'LinkedIn', href: 'https://linkedin.com/company/svarog' },
  ],
};

export const Default = () => {
  return createFooter({
    siteName: 'Svarog Site',
    footer: defaultFooterConfig,
  });
};

export const MinimalFooter = () => {
  return createFooter({
    siteName: 'Minimal Site',
    footer: {
      copyright: '© 2024 Minimal Site',
    },
  });
};

export const WithLinksOnly = () => {
  return createFooter({
    siteName: 'Site with Links',
    footer: {
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  });
};

export const WithSocialOnly = () => {
  return createFooter({
    siteName: 'Social Site',
    footer: {
      social: [
        { platform: 'Facebook', href: 'https://facebook.com' },
        { platform: 'Instagram', href: 'https://instagram.com' },
        { platform: 'YouTube', href: 'https://youtube.com' },
      ],
    },
  });
};

export const ExtensiveFooter = () => {
  return createFooter({
    siteName: 'Large Website',
    footer: {
      copyright: '© 2024 Large Website. All rights reserved.',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
      social: [
        { platform: 'Facebook', href: 'https://facebook.com' },
        { platform: 'Twitter', href: 'https://twitter.com' },
        { platform: 'Instagram', href: 'https://instagram.com' },
        { platform: 'LinkedIn', href: 'https://linkedin.com' },
        { platform: 'YouTube', href: 'https://youtube.com' },
        { platform: 'GitHub', href: 'https://github.com' },
      ],
    },
  });
};

// Example showing backward compatibility with url prop
export const LegacyPropUsage = () => {
  return createFooter({
    siteName: 'Legacy Props Example',
    footer: {
      copyright: '© 2024 Legacy Props Example',
      links: [
        { label: 'About', url: '/about' }, // Using legacy url prop
        { label: 'Contact', href: '/contact' }, // Using new href prop
      ],
      social: [
        { platform: 'Facebook', url: 'https://facebook.com' }, // Using legacy url prop
        { platform: 'Twitter', href: 'https://twitter.com' }, // Using new href prop
      ],
    },
  });
};
