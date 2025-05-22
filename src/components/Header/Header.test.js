// src/components/Header/Header.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import Header from './index.js';

describe('Header', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      siteName: 'My Website',
      navigation: {
        items: [
          { id: 'home', label: 'Home', url: '/' },
          { id: 'about', label: 'About', url: '/about' },
          { id: 'blog', label: 'Blog', href: '/blog' }, // Using href for testing compatibility
        ],
      },
      logo: 'https://via.placeholder.com/150x50',
    };
  });

  it('should render correctly with all props', () => {
    const header = Header(defaultProps);
    const element = header.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('header');
    expect(element.classList.contains('header')).toBe(true);
  });

  it('should render site name when no logo provided', () => {
    const props = { ...defaultProps };
    delete props.logo;

    const header = Header(props);
    const element = header.getElement();

    expect(element.querySelector('.header__site-name')).toBeTruthy();
    expect(element.querySelector('.header__site-name').textContent).toBe(
      'My Website'
    );
  });

  it('should render logo when provided', () => {
    const header = Header(defaultProps);
    const element = header.getElement();

    expect(element.querySelector('.logo-container')).toBeTruthy();
  });

  it('should render navigation items', () => {
    const header = Header(defaultProps);
    const element = header.getElement();

    const navItems = element.querySelectorAll('.nav__item');
    expect(navItems.length).toBe(3);
  });

  it('should handle both url and href properties in navigation items', () => {
    const header = Header({
      navigation: {
        items: [
          { id: 'item1', label: 'Item 1', url: '/item1' },
          { id: 'item2', label: 'Item 2', href: '/item2' },
        ],
      },
    });

    const element = header.getElement();
    const navLinks = element.querySelectorAll('.nav__link');

    expect(navLinks.length).toBe(2);
    // The Navigation component will convert both to href attribute
    expect(navLinks[0].getAttribute('href')).toBe('/item1');
    expect(navLinks[1].getAttribute('href')).toBe('/item2');
  });

  it('should handle nested navigation items with url properties', () => {
    const header = Header({
      navigation: {
        items: [
          {
            id: 'products',
            label: 'Products',
            url: '/products',
            items: [
              { id: 'product1', label: 'Product 1', url: '/products/1' },
              { id: 'product2', label: 'Product 2', href: '/products/2' },
            ],
          },
        ],
      },
    });

    const element = header.getElement();
    const navItem = element.querySelector('.nav__item--has-children');

    expect(navItem).toBeTruthy();
    // Parent items with children don't have href attributes in button elements
    const parentLink = navItem.querySelector('.nav__link');
    expect(parentLink.tagName.toLowerCase()).toBe('button');
  });

  it('should work without navigation', () => {
    const props = { ...defaultProps };
    delete props.navigation;

    const header = Header(props);
    const element = header.getElement();

    expect(element.querySelector('.nav')).toBeNull();
  });

  it('should update logo when setLogo method is called', () => {
    const header = Header(defaultProps);
    const newLogo = 'https://via.placeholder.com/200x60';

    header.setLogo(newLogo);

    // This should trigger a re-render, so we need to get the element again
    const element = header.getElement();
    const imgElement = element.querySelector('img');

    expect(imgElement).toBeTruthy();
    expect(imgElement.src).toContain(newLogo);
  });

  it('should update site name when setSiteName method is called', () => {
    const props = { ...defaultProps };
    delete props.logo;

    const header = Header(props);
    const newSiteName = 'Updated Site Name';

    header.setSiteName(newSiteName);

    // This should trigger a re-render, so we need to get the element again
    const element = header.getElement();
    const siteNameElement = element.querySelector('.header__site-name');

    expect(siteNameElement).toBeTruthy();
    expect(siteNameElement.textContent).toBe(newSiteName);
  });

  it('should apply custom class when provided', () => {
    const header = Header({
      ...defaultProps,
      className: 'custom-header',
    });

    const element = header.getElement();

    expect(element.classList.contains('header')).toBe(true);
    expect(element.classList.contains('custom-header')).toBe(true);
  });

  it('should clean up resources when destroyed', () => {
    const header = Header(defaultProps);

    expect(() => {
      header.destroy();
    }).not.toThrow();
  });
});
