// src/components/Header/Header.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import Header from './Header.js';

describe('Header', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      siteName: 'My Website',
      navigation: {
        items: [
          { label: 'Home', url: '/' },
          { label: 'About', url: '/about' },
          { label: 'Blog', url: '/blog' },
        ],
      },
      logo: 'https://via.placeholder.com/150x50',
    };
  });

  it('should render correctly with all props', () => {
    const header = new Header(defaultProps);
    const element = header.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('header');
    expect(element.classList.contains('header')).toBe(true);
  });

  it('should render site name when no logo provided', () => {
    const props = { ...defaultProps };
    delete props.logo;

    const header = new Header(props);
    const element = header.getElement();

    expect(element.querySelector('.header__site-name')).toBeTruthy();
    expect(element.querySelector('.header__site-name').textContent).toBe(
      'My Website'
    );
  });

  it('should render logo when provided', () => {
    const header = new Header(defaultProps);
    const element = header.getElement();

    expect(element.querySelector('.logo')).toBeTruthy();
  });

  it('should render navigation items', () => {
    const header = new Header(defaultProps);
    const element = header.getElement();

    const navItems = element.querySelectorAll('.navigation__link');
    expect(navItems.length).toBe(3);
  });

  it('should work without navigation', () => {
    const props = { ...defaultProps };
    delete props.navigation;

    const header = new Header(props);
    const element = header.getElement();

    expect(element.querySelector('.navigation')).toBeNull();
  });
});
