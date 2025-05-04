// src/components/Footer/Footer.stories.js
import Footer from './Footer.js';

export default {
  title: 'Components/Layout/Footer',
  component: Footer,
};

const defaultFooterConfig = {
  copyright: '© 2024 Svarog Site. All rights reserved.',
  links: [
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Terms of Service', url: '/terms' },
    { label: 'Cookie Policy', url: '/cookies' },
  ],
  social: [
    { platform: 'Twitter', url: 'https://twitter.com/svarog' },
    { platform: 'GitHub', url: 'https://github.com/svarog' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/svarog' },
  ],
};

export const Default = () => {
  return new Footer({
    siteName: 'Svarog Site',
    footer: defaultFooterConfig,
  });
};

export const MinimalFooter = () => {
  return new Footer({
    siteName: 'Minimal Site',
    footer: {
      copyright: '© 2024 Minimal Site',
    },
  });
};

export const WithLinksOnly = () => {
  return new Footer({
    siteName: 'Site with Links',
    footer: {
      links: [
        { label: 'About', url: '/about' },
        { label: 'Blog', url: '/blog' },
        { label: 'Contact', url: '/contact' },
      ],
    },
  });
};

export const WithSocialOnly = () => {
  return new Footer({
    siteName: 'Social Site',
    footer: {
      social: [
        { platform: 'Facebook', url: 'https://facebook.com' },
        { platform: 'Instagram', url: 'https://instagram.com' },
        { platform: 'YouTube', url: 'https://youtube.com' },
      ],
    },
  });
};

export const ExtensiveFooter = () => {
  return new Footer({
    siteName: 'Large Website',
    footer: {
      copyright: '© 2024 Large Website. All rights reserved.',
      links: [
        { label: 'About Us', url: '/about' },
        { label: 'Services', url: '/services' },
        { label: 'Portfolio', url: '/portfolio' },
        { label: 'Blog', url: '/blog' },
        { label: 'Careers', url: '/careers' },
        { label: 'Contact', url: '/contact' },
        { label: 'Privacy Policy', url: '/privacy' },
        { label: 'Terms of Service', url: '/terms' },
      ],
      social: [
        { platform: 'Facebook', url: 'https://facebook.com' },
        { platform: 'Twitter', url: 'https://twitter.com' },
        { platform: 'Instagram', url: 'https://instagram.com' },
        { platform: 'LinkedIn', url: 'https://linkedin.com' },
        { platform: 'YouTube', url: 'https://youtube.com' },
        { platform: 'GitHub', url: 'https://github.com' },
      ],
    },
  });
};
