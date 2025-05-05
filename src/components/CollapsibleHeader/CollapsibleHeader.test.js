// src/components/CollapsibleHeader/CollapsibleHeader.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import CollapsibleHeader from './CollapsibleHeader.js';

describe('CollapsibleHeader', () => {
  // Default props for testing
  const defaultProps = {
    siteName: 'Test Site',
    navigation: {
      items: [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'about', label: 'About', href: '/about' },
      ],
    },
    contactInfo: {
      location: 'Test Location',
      phone: '123-456-7890',
      email: 'test@example.com',
    },
    logo: 'test-logo.svg',
  };

  // Mock scroll event
  const mockScroll = (scrollY) => {
    Object.defineProperty(window, 'scrollY', {
      value: scrollY,
      configurable: true,
    });
    window.dispatchEvent(new Event('scroll'));
  };

  // Clear any added event listeners after each test
  afterEach(() => {
    // Reset scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });

    // Clear all event listeners
    vi.restoreAllMocks();
  });

  it('should render correctly with all props', () => {
    const header = new CollapsibleHeader(defaultProps);
    const element = header.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('header');
    expect(element.classList.contains('collapsible-header')).toBe(true);
  });

  it('should render contact info and navigation', () => {
    const header = new CollapsibleHeader(defaultProps);
    const element = header.getElement();

    // Check for contact info elements
    const contactContainer = element.querySelector(
      '.collapsible-header__contact-container'
    );
    expect(contactContainer).not.toBeNull();

    const contactInfo = contactContainer.querySelector('.contact-info');
    expect(contactInfo).not.toBeNull();

    // Check for navigation
    const navigation = element.querySelector('.nav');
    expect(navigation).not.toBeNull();

    const navItems = navigation.querySelectorAll('.nav__item');
    expect(navItems.length).toBe(2);
  });

  it('should render logo when provided', () => {
    const header = new CollapsibleHeader(defaultProps);
    const element = header.getElement();

    const logoContainer = element.querySelector('.collapsible-header__logo');
    expect(logoContainer).not.toBeNull();

    // Since Logo component should render an img element
    const logoElement = logoContainer.querySelector('.logo-container');
    expect(logoElement).not.toBeNull();
  });

  it('should collapse when scrolled past threshold', () => {
    const header = new CollapsibleHeader({
      ...defaultProps,
      collapseThreshold: 50,
    });
    document.body.appendChild(header.getElement());

    // Initially not collapsed
    expect(header.state.isCollapsed).toBe(false);
    expect(
      header.element.classList.contains('collapsible-header--collapsed')
    ).toBe(false);

    // Scroll past threshold
    mockScroll(100);

    // Should be collapsed
    expect(header.state.isCollapsed).toBe(true);
    expect(
      header.element.classList.contains('collapsible-header--collapsed')
    ).toBe(true);

    // Scroll back to top
    mockScroll(0);

    // Should be expanded
    expect(header.state.isCollapsed).toBe(false);
    expect(
      header.element.classList.contains('collapsible-header--collapsed')
    ).toBe(false);

    document.body.removeChild(header.element);
  });

  it('should clean up event listeners when destroyed', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const header = new CollapsibleHeader(defaultProps);
    document.body.appendChild(header.getElement());

    header.destroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      header.handleScroll
    );

    document.body.removeChild(header.element);
  });

  it('should throw error if required props are missing', () => {
    // Missing contactInfo
    expect(() => {
      new CollapsibleHeader({
        siteName: 'Test Site',
        navigation: { items: [{ id: 'home', label: 'Home', href: '/' }] },
      });
    }).toThrow('Missing required props');

    // Missing navigation items
    expect(() => {
      new CollapsibleHeader({
        siteName: 'Test Site',
        navigation: { items: [] },
        contactInfo: {
          location: 'Test Location',
          phone: '123-456-7890',
          email: 'test@example.com',
        },
      });
    }).toThrow('Missing required props');
  });
});
