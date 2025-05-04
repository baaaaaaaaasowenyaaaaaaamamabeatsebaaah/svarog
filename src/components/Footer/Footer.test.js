// src/components/Footer/Footer.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import Footer from './Footer.js';

describe('Footer', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      siteName: 'My Website',
      footer: {
        copyright: '© 2024 My Website. All rights reserved.',
        links: [
          { label: 'Privacy Policy', url: '/privacy' },
          { label: 'Terms of Service', url: '/terms' },
        ],
        social: [
          { platform: 'Twitter', url: 'https://twitter.com' },
          { platform: 'GitHub', url: 'https://github.com' },
        ],
      },
    };
  });

  it('should render correctly with all props', () => {
    const footer = new Footer(defaultProps);
    const element = footer.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('footer');
    expect(element.classList.contains('footer')).toBe(true);
  });

  it('should render copyright text', () => {
    const footer = new Footer(defaultProps);
    const element = footer.getElement();
    const copyright = element.querySelector('.footer__copyright-text');

    expect(copyright).toBeTruthy();
    expect(copyright.textContent).toBe(
      '© 2024 My Website. All rights reserved.'
    );
  });

  it('should render default copyright when not provided', () => {
    const props = {
      siteName: 'My Website',
      footer: {},
    };
    const footer = new Footer(props);
    const element = footer.getElement();
    const copyright = element.querySelector('.footer__copyright-text');

    expect(copyright).toBeTruthy();
    expect(copyright.textContent).toContain('My Website');
    expect(copyright.textContent).toContain(
      new Date().getFullYear().toString()
    );
  });

  it('should render footer links', () => {
    const footer = new Footer(defaultProps);
    const element = footer.getElement();
    const links = element.querySelectorAll('.footer__link');

    expect(links.length).toBe(2);
    expect(links[0].textContent).toBe('Privacy Policy');
    expect(links[1].textContent).toBe('Terms of Service');
  });

  it('should render social links', () => {
    const footer = new Footer(defaultProps);
    const element = footer.getElement();
    const socialLinks = element.querySelectorAll('.footer__social-link');

    expect(socialLinks.length).toBe(2);
    expect(socialLinks[0].textContent).toBe('Twitter');
    expect(socialLinks[1].textContent).toBe('GitHub');
  });

  it('should work with minimal props', () => {
    const footer = new Footer({ siteName: 'My Website' });
    const element = footer.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('.footer__copyright-text')).toBeTruthy();
  });
});
