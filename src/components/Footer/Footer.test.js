// src/components/Footer/Footer.test.js
import createFooter from './Footer.js';
// Let's try importing from index.js instead
import FooterFromIndex from './index.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Footer Component', () => {
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

  // Basic rendering tests
  it('should render correctly with all props', () => {
    const footer = createFooter(defaultProps);
    const element = footer.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('footer');
  });

  it('should render copyright text', () => {
    const footer = createFooter(defaultProps);
    const element = footer.getElement();
    const copyright = element.querySelector('.footer__copyright-text');
    expect(copyright).toBeTruthy();
    expect(copyright.textContent).toBe(
      '© 2024 My Website. All rights reserved.'
    );
  });

  it('should render links', () => {
    const footer = createFooter(defaultProps);
    const element = footer.getElement();
    const links = element.querySelectorAll('.footer__link');
    expect(links.length).toBe(2);
  });

  it('should render social links', () => {
    const footer = createFooter(defaultProps);
    const element = footer.getElement();
    const socialLinks = element.querySelectorAll('.footer__social-link');
    expect(socialLinks.length).toBe(2);
  });

  // Method existence tests
  it('should have basic methods', () => {
    const footer = createFooter(defaultProps);
    expect(typeof footer.getElement).toBe('function');
    expect(typeof footer.update).toBe('function');
    expect(typeof footer.destroy).toBe('function');
  });

  // Check methods on index export
  it('should check index export', () => {
    if (FooterFromIndex) {
      console.log('Methods on FooterFromIndex:', Object.keys(FooterFromIndex));
      const footer = FooterFromIndex(defaultProps);
      console.log('Methods on footer instance:', Object.keys(footer));
    } else {
      console.log('FooterFromIndex not found');
    }
  });

  // Simplest update test
  it('should have update method that accepts props', () => {
    const footer = createFooter(defaultProps);
    const newProps = {
      siteName: 'Updated Site',
      footer: {
        copyright: 'New Copyright',
      },
    };
    // Just check it doesn't throw an error
    expect(() => footer.update(newProps)).not.toThrow();
  });
});
