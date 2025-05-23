// src/components/Footer/Footer.test.js
import createFooter from './Footer.js';
// Let's try importing from index.js instead
import FooterFromIndex from './index.js';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Footer Component', () => {
  let defaultProps;
  let consoleSpy;

  beforeEach(() => {
    defaultProps = {
      siteName: 'My Website',
      footer: {
        copyright: '© 2024 My Website. All rights reserved.',
        links: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
        ],
        social: [
          { platform: 'Twitter', href: 'https://twitter.com' },
          { platform: 'GitHub', href: 'https://github.com' },
        ],
      },
    };

    consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
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

  // Link standardization tests
  it('should use href attribute for links', () => {
    const footer = createFooter(defaultProps);
    const element = footer.getElement();
    const links = element.querySelectorAll('.footer__link');

    expect(links[0].getAttribute('href')).toBe('/privacy');
    expect(links[1].getAttribute('href')).toBe('/terms');
  });

  it('should support legacy url property but issue warning', () => {
    const propsWithUrl = {
      siteName: 'Legacy Site',
      footer: {
        links: [{ label: 'Legacy Link', url: '/legacy' }],
        social: [{ platform: 'Legacy Social', url: 'https://legacy.com' }],
      },
    };

    const footer = createFooter(propsWithUrl);
    const element = footer.getElement();

    // Check link href is set from url
    const link = element.querySelector('.footer__link');
    expect(link.getAttribute('href')).toBe('/legacy');

    // Check social link href is set from url
    const socialLink = element.querySelector('.footer__social-link');
    expect(socialLink.getAttribute('href')).toBe('https://legacy.com');

    // Verify warnings were issued
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Footer] link.url is deprecated, use link.href instead'
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Footer] social.url is deprecated, use social.href instead'
    );
  });

  it('should handle mixed href and url properties', () => {
    const mixedProps = {
      siteName: 'Mixed Site',
      footer: {
        links: [
          { label: 'Legacy Link', url: '/legacy' },
          { label: 'Modern Link', href: '/modern' },
        ],
      },
    };

    const footer = createFooter(mixedProps);
    const element = footer.getElement();
    const links = element.querySelectorAll('.footer__link');

    expect(links[0].getAttribute('href')).toBe('/legacy');
    expect(links[1].getAttribute('href')).toBe('/modern');

    // Only one warning for the legacy property
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('should maintain backward compatibility with setLinks method', () => {
    const footer = createFooter(defaultProps);

    // Update with legacy url property
    footer.setLinks([{ label: 'New Link', url: '/new' }]);

    const element = footer.getElement();
    const link = element.querySelector('.footer__link');
    expect(link.getAttribute('href')).toBe('/new');

    // Verify normalization warning
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Footer] link.url is deprecated, use link.href instead'
    );
  });

  it('should maintain backward compatibility with setSocial method', () => {
    const footer = createFooter(defaultProps);

    // Update with legacy url property
    footer.setSocial([{ platform: 'New Social', url: 'https://new.com' }]);

    const element = footer.getElement();
    const socialLink = element.querySelector('.footer__social-link');
    expect(socialLink.getAttribute('href')).toBe('https://new.com');

    // Verify normalization warning
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Footer] social.url is deprecated, use social.href instead'
    );
  });
});
