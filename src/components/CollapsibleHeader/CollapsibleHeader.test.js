// src/components/CollapsibleHeader/CollapsibleHeader.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CollapsibleHeaderContainer from './CollapsibleHeaderContainer.js';
import { CollapsibleHeader } from './index.js';

describe('CollapsibleHeader Components', () => {
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

  describe('CollapsibleHeader', () => {
    it('should render correctly with all props', () => {
      const header = CollapsibleHeader(defaultProps);
      const element = header.getElement();

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('header');
      expect(element.classList.contains('collapsible-header')).toBe(true);
    });

    it('should render contact info and navigation', () => {
      const header = CollapsibleHeader(defaultProps);
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
      const header = CollapsibleHeader(defaultProps);
      const element = header.getElement();

      const logoContainer = element.querySelector('.collapsible-header__logo');
      expect(logoContainer).not.toBeNull();

      // Since Logo component renders as a link containing the logo element
      const logoLink = logoContainer.querySelector('a');
      expect(logoLink).not.toBeNull();
    });

    it('should update collapsed state via update method', () => {
      const header = CollapsibleHeader(defaultProps);
      const element = header.getElement();

      // Initially not collapsed
      expect(element.classList.contains('collapsible-header--collapsed')).toBe(
        false
      );

      // Update to collapsed state
      header.update({ isCollapsed: true });

      // Should be collapsed
      expect(element.classList.contains('collapsible-header--collapsed')).toBe(
        true
      );
    });

    it('should throw error if required props are missing', () => {
      // Missing contactInfo
      expect(() => {
        CollapsibleHeader({
          siteName: 'Test Site',
          navigation: { items: [{ id: 'home', label: 'Home', href: '/' }] },
        });
      }).toThrow(/contactInfo/i);

      // Missing navigation items
      expect(() => {
        CollapsibleHeader({
          siteName: 'Test Site',
          navigation: { items: [] },
          contactInfo: {
            location: 'Test Location',
            phone: '123-456-7890',
            email: 'test@example.com',
          },
        });
      }).toThrow(/navigation\.items/i);
    });
  });

  describe('CollapsibleHeaderContainer', () => {
    it('should collapse when scrolled past threshold', () => {
      const header = CollapsibleHeaderContainer({
        ...defaultProps,
        collapseThreshold: 50,
      });
      document.body.appendChild(header.getElement());

      // Initially not collapsed
      expect(header.getState().isCollapsed).toBe(false);

      // Simulate scrolling past threshold
      Object.defineProperty(window, 'scrollY', { value: 100 });
      header.handleScroll();

      // Should be collapsed
      expect(header.getState().isCollapsed).toBe(true);

      // Clean up
      try {
        document.body.removeChild(header.getElement());
      } catch (e) {
        // Ignore errors if already removed
      }
    });

    it('should show sticky icons when collapsed if enabled', () => {
      const header = CollapsibleHeaderContainer({
        ...defaultProps,
        collapseThreshold: 50,
        showStickyIcons: true,
      });
      document.body.appendChild(header.getElement());

      // Manually set collapsed state
      header.update({ isCollapsed: true });
      header.updateStickyIconsVisibility();

      // Check for sticky icons
      const stickyIcons = document.querySelector('.sticky-contact-icons');
      expect(stickyIcons).not.toBeNull();
      expect(stickyIcons.style.display).toBe('flex');

      // Clean up
      try {
        document.body.removeChild(header.getElement());
      } catch (e) {
        // Ignore errors if already removed
      }
    });

    it('should not show sticky icons when disabled', () => {
      const header = CollapsibleHeaderContainer({
        ...defaultProps,
        collapseThreshold: 50,
        showStickyIcons: false,
      });
      document.body.appendChild(header.getElement());

      // Manually set collapsed state
      header.update({ isCollapsed: true });
      header.updateStickyIconsVisibility();

      // Should not find sticky icons
      const stickyIcons = document.querySelector('.sticky-contact-icons');
      expect(stickyIcons).toBeNull();

      // Clean up
      try {
        document.body.removeChild(header.getElement());
      } catch (e) {
        // Ignore errors if already removed
      }
    });

    it('should clean up event listeners when destroyed', () => {
      const header = CollapsibleHeaderContainer({
        ...defaultProps,
        showStickyIcons: true,
      });

      // Store reference to element before adding to DOM
      const headerElement = header.getElement();
      document.body.appendChild(headerElement);

      // Create sticky icons manually
      header.update({ isCollapsed: true });
      header.updateStickyIconsVisibility();

      // Spy on removeEventListener
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      // Call destroy
      header.destroy();

      // Verify that removeEventListener was called
      expect(removeEventListenerSpy).toHaveBeenCalled();

      // Verify sticky icons are removed
      const stickyIconsAfterDestroy = document.querySelector(
        '.sticky-contact-icons'
      );
      expect(stickyIconsAfterDestroy).toBeNull();

      // Try to remove element only if it's still in the DOM
      try {
        if (headerElement.parentNode) {
          document.body.removeChild(headerElement);
        }
      } catch (e) {
        // Ignore errors if already removed
      }
    });

    it('should update mobile state on resize', () => {
      const header = CollapsibleHeaderContainer(defaultProps);
      document.body.appendChild(header.getElement());

      // Mock window.innerWidth to simulate mobile viewport
      const originalInnerWidth = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', { value: 480 });

      // Trigger resize handler
      header.handleResize();

      // Should be in mobile state
      expect(header.getState().isMobile).toBe(true);

      // Restore original innerWidth
      Object.defineProperty(window, 'innerWidth', {
        value: originalInnerWidth,
      });

      // Clean up
      try {
        document.body.removeChild(header.getElement());
      } catch (e) {
        // Ignore errors if already removed
      }
    });
  });
});
