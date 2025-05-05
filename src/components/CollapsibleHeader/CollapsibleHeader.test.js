// src/components/CollapsibleHeader/CollapsibleHeader.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

    // Mock the scroll event
    vi.spyOn(window, 'addEventListener').mockImplementation(
      (event, handler) => {
        if (event === 'scroll') {
          // Store the handler for later use
          window.scrollHandler = handler;
        }
      }
    );

    vi.spyOn(window, 'removeEventListener').mockImplementation((event) => {
      if (event === 'scroll') {
        window.scrollHandler = null;
      }
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

    // Simulate scroll past threshold
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      configurable: true,
    });

    // Call the scroll handler manually since we've mocked addEventListener
    if (window.scrollHandler) {
      window.scrollHandler();
    }

    // Should be collapsed
    expect(header.state.isCollapsed).toBe(true);
    expect(
      header.element.classList.contains('collapsible-header--collapsed')
    ).toBe(true);

    document.body.removeChild(header.element);
  });

  it('should show sticky icons when collapsed if enabled', () => {
    const header = new CollapsibleHeader({
      ...defaultProps,
      collapseThreshold: 50,
      showStickyIcons: true,
    });
    document.body.appendChild(header.getElement());

    // Initially not collapsed
    expect(header.state.isCollapsed).toBe(false);

    // Check if sticky icons exist but are hidden
    const stickyIcons = document.querySelector(
      '.collapsible-header__sticky-icons'
    );
    expect(stickyIcons).not.toBeNull();
    expect(stickyIcons.style.display).toBe('none');

    // Simulate scroll past threshold
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      configurable: true,
    });

    // Call the scroll handler manually since we've mocked addEventListener
    if (window.scrollHandler) {
      window.scrollHandler();
    }

    // Should be collapsed and sticky icons should be visible
    expect(header.state.isCollapsed).toBe(true);
    expect(stickyIcons.style.display).toBe('flex');

    document.body.removeChild(header.element);
  });

  it('should not show sticky icons when disabled', () => {
    const header = new CollapsibleHeader({
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

    // Call the scroll handler manually
    if (window.scrollHandler) {
      window.scrollHandler();
    }

    // Should be collapsed but no sticky icons should be present
    expect(header.state.isCollapsed).toBe(true);
    const stickyIcons = document.querySelector(
      '.collapsible-header__sticky-icons'
    );
    expect(stickyIcons).toBeNull();

    document.body.removeChild(header.element);
  });

  it('should clean up event listeners when destroyed', () => {
    const header = new CollapsibleHeader({
      ...defaultProps,
      showStickyIcons: true,
    });
    document.body.appendChild(header.getElement());

    // Verify sticky icons are created
    const stickyIcons = document.querySelector(
      '.collapsible-header__sticky-icons'
    );
    expect(stickyIcons).not.toBeNull();

    // Verify removeEventListener is called with correct params
    header.destroy();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      header.handleScroll
    );

    // Verify sticky icons are removed
    const stickyIconsAfterDestroy = document.querySelector(
      '.collapsible-header__sticky-icons'
    );
    expect(stickyIconsAfterDestroy).toBeNull();

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
