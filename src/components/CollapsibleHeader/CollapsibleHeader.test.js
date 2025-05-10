// src/components/CollapsibleHeader/CollapsibleHeader.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CollapsibleHeaderContainer from './CollapsibleHeaderContainer.js';
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

  // Mock for window.scrollY
  let originalScrollY;

  beforeEach(() => {
    // Store original scrollY
    originalScrollY = window.scrollY;

    // Mock window.scrollY to control scroll position in tests
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore scrollY
    Object.defineProperty(window, 'scrollY', {
      value: originalScrollY,
      configurable: true,
    });

    // Clear all mocks
    vi.restoreAllMocks();

    // Remove any sticky contact icons that might have been added to the document
    const stickyElements = document.querySelectorAll('.sticky-contact-icons');
    stickyElements.forEach((el) => {
      if (el.parentElement) {
        el.parentElement.removeChild(el);
      }
    });
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

    // Since Logo component should render an img element or similar
    const logoElement = logoContainer.querySelector('a');
    expect(logoElement).not.toBeNull();
  });

  it('should collapse when scrolled past threshold', () => {
    const header = new CollapsibleHeaderContainer({
      ...defaultProps,
      collapseThreshold: 50,
    });
    document.body.appendChild(header.getElement());

    // Initially not collapsed
    expect(header.state.isCollapsed).toBe(false);
    expect(
      header.getElement().classList.contains('collapsible-header--collapsed')
    ).toBe(false);

    // Simulate scroll past threshold
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      configurable: true,
    });

    // Manually trigger scroll event
    header.handleScroll();

    // Should be collapsed
    expect(header.state.isCollapsed).toBe(true);
    expect(
      header.getElement().classList.contains('collapsible-header--collapsed')
    ).toBe(true);

    document.body.removeChild(header.getElement());
  });

  it('should show sticky icons when collapsed if enabled', () => {
    const header = new CollapsibleHeaderContainer({
      ...defaultProps,
      collapseThreshold: 50,
      showStickyIcons: true,
    });
    document.body.appendChild(header.getElement());

    // Initially not collapsed
    expect(header.state.isCollapsed).toBe(false);

    // Simulate scroll past threshold
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      configurable: true,
    });

    // Manually trigger scroll event
    header.handleScroll();

    // Should be collapsed
    expect(header.state.isCollapsed).toBe(true);

    // Sticky icons should be created and added to DOM
    const stickyIcons = document.querySelector(
      '.collapsible-header__sticky-icons'
    );
    expect(stickyIcons).not.toBeNull();
    expect(stickyIcons.style.display).toBe('flex');

    document.body.removeChild(header.getElement());
  });

  it('should not show sticky icons when disabled', () => {
    const header = new CollapsibleHeaderContainer({
      ...defaultProps,
      collapseThreshold: 50,
      showStickyIcons: false,
    });
    document.body.appendChild(header.getElement());

    // Simulate scroll past threshold
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      configurable: true,
    });

    // Manually trigger scroll event
    header.handleScroll();

    // Should be collapsed but no sticky icons should be present
    expect(header.state.isCollapsed).toBe(true);
    const stickyIcons = document.querySelector(
      '.collapsible-header__sticky-icons'
    );
    expect(stickyIcons).toBeNull();

    document.body.removeChild(header.getElement());
  });

  it('should clean up event listeners when destroyed', () => {
    const header = new CollapsibleHeaderContainer({
      ...defaultProps,
      showStickyIcons: true,
    });
    document.body.appendChild(header.getElement());

    // Scroll to trigger sticky icons
    Object.defineProperty(window, 'scrollY', {
      value: 200,
      configurable: true,
    });
    header.handleScroll();

    // Verify sticky icons are created
    const stickyIcons = document.querySelector(
      '.collapsible-header__sticky-icons'
    );
    expect(stickyIcons).not.toBeNull();

    // Spy on removeEventListener
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    // Call destroy
    header.destroy();

    // Verify event listeners were removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      header.handleScroll
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      header.handleResize
    );

    // Verify sticky icons are removed
    const stickyIconsAfterDestroy = document.querySelector(
      '.collapsible-header__sticky-icons'
    );
    expect(stickyIconsAfterDestroy).toBeNull();

    document.body.removeChild(header.getElement());
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
