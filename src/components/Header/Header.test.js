// src/components/Header/Header.test.js
import { describe, it, expect, vi } from 'vitest';
import Header from './Header.js';

// Mock the Logo and Navigation components
vi.mock('../Logo/Logo.js', () => {
  return {
    default: class MockLogo {
      constructor(props) {
        this.props = props;
      }

      getElement() {
        const div = document.createElement('div');
        div.className = 'mock-logo';
        div.dataset.src = this.props.sources;
        return div;
      }
    },
  };
});

vi.mock('../Navigation/Navigation.js', () => {
  return {
    default: class MockNavigation {
      constructor(props) {
        this.props = props;
      }

      getElement() {
        const nav = document.createElement('nav');
        nav.className = 'mock-navigation';
        nav.dataset.items = JSON.stringify(this.props.items);
        return nav;
      }
    },
  };
});

describe('Header component', () => {
  it('should create a header element', () => {
    const header = new Header({});

    const element = header.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('header');
    expect(element.className).toBe('header');
  });

  it('should add sticky class when sticky prop is true', () => {
    const header = new Header({ sticky: true });

    const element = header.getElement();
    expect(element.classList.contains('header--sticky')).toBe(true);
  });

  it('should add transparent class when transparent prop is true', () => {
    const header = new Header({ transparent: true });

    const element = header.getElement();
    expect(element.classList.contains('header--transparent')).toBe(true);
  });

  it('should render title when provided', () => {
    const title = 'Test Header';
    const header = new Header({ title });

    const element = header.getElement();
    const titleElement = element.querySelector('.header__title');
    expect(titleElement).not.toBeNull();
    expect(titleElement.textContent).toBe(title);
  });

  it('should render logo when logo source is provided', () => {
    const logoSrc = 'test-logo.svg';
    const header = new Header({ logo: logoSrc });

    const element = header.getElement();
    const logoElement = element.querySelector('.mock-logo');
    expect(logoElement).not.toBeNull();
    expect(logoElement.dataset.src).toBe(logoSrc);
  });

  it('should render navigation when navItems are provided', () => {
    const navItems = [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'about', label: 'About', href: '#' },
    ];
    const header = new Header({ navItems });

    const element = header.getElement();
    const navElement = element.querySelector('.mock-navigation');
    expect(navElement).not.toBeNull();
    expect(JSON.parse(navElement.dataset.items)).toEqual(navItems);
  });

  it('should apply custom className', () => {
    const customClass = 'custom-header';
    const header = new Header({ className: customClass });

    const element = header.getElement();
    expect(element.classList.contains(customClass)).toBe(true);
  });
});
