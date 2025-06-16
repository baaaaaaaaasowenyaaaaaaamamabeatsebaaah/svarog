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

    // Spy on console.warn for deprecation warnings
    vi.spyOn(console, 'warn').mockImplementation(() => {});
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
      let element = header.getElement();

      // Initially not collapsed
      expect(element.classList.contains('collapsible-header--collapsed')).toBe(
        false
      );

      // Update to collapsed state
      header.update({ isCollapsed: true });

      // ✅ Get the updated element after re-render (KISS approach does full re-render)
      element = header.getElement();

      // Should be collapsed
      expect(element.classList.contains('collapsible-header--collapsed')).toBe(
        true
      );
    });

    it('should update mobile state via update method', () => {
      const header = CollapsibleHeader(defaultProps);
      let element = header.getElement();

      // Initially not mobile
      expect(element.classList.contains('collapsible-header--mobile')).toBe(
        false
      );

      // Update to mobile state
      header.update({ isMobile: true });

      // ✅ Get the updated element after re-render
      element = header.getElement();

      // Should be mobile
      expect(element.classList.contains('collapsible-header--mobile')).toBe(
        true
      );
    });

    it('should switch logos when collapsed state changes', () => {
      const headerWithDifferentLogos = CollapsibleHeader({
        ...defaultProps,
        logo: 'full-logo.svg',
        compactLogo: 'compact-logo.svg',
      });

      let element = headerWithDifferentLogos.getElement();

      // Initially should use full logo
      const initialLogoImg = element.querySelector('.logo-container img');
      expect(initialLogoImg.src).toContain('full-logo.svg');

      // Update to collapsed state
      headerWithDifferentLogos.update({ isCollapsed: true });

      // ✅ Get updated element and check logo switched
      element = headerWithDifferentLogos.getElement();
      const collapsedLogoImg = element.querySelector('.logo-container img');
      expect(collapsedLogoImg.src).toContain('compact-logo.svg');

      // Switch back to expanded
      headerWithDifferentLogos.update({ isCollapsed: false });

      // ✅ Get updated element and check logo switched back
      element = headerWithDifferentLogos.getElement();
      const expandedLogoImg = element.querySelector('.logo-container img');
      expect(expandedLogoImg.src).toContain('full-logo.svg');
    });

    it('should switch logos when mobile state changes', () => {
      const headerWithDifferentLogos = CollapsibleHeader({
        ...defaultProps,
        logo: 'full-logo.svg',
        compactLogo: 'compact-logo.svg',
      });

      let element = headerWithDifferentLogos.getElement();

      // Initially should use full logo
      const initialLogoImg = element.querySelector('.logo-container img');
      expect(initialLogoImg.src).toContain('full-logo.svg');

      // Update to mobile state
      headerWithDifferentLogos.update({ isMobile: true });

      // ✅ Get updated element and check logo switched to compact
      element = headerWithDifferentLogos.getElement();
      const mobileLogoImg = element.querySelector('.logo-container img');
      expect(mobileLogoImg.src).toContain('compact-logo.svg');
    });

    it('should support onCallClick prop', () => {
      const onCallClick = vi.fn();
      const header = CollapsibleHeader({
        ...defaultProps,
        onCallClick,
      });

      const element = header.getElement();
      const callButton = element.querySelector(
        '.collapsible-header__call-button button'
      );

      expect(callButton).not.toBeNull();

      // Simulate click on the call button
      callButton.click();

      expect(onCallClick).toHaveBeenCalled();
    });

    it('should support legacy onCallButtonClick prop', () => {
      const onCallButtonClick = vi.fn();
      const header = CollapsibleHeader({
        ...defaultProps,
        onCallButtonClick,
      });

      const element = header.getElement();
      const callButton = element.querySelector(
        '.collapsible-header__call-button button'
      );

      expect(callButton).not.toBeNull();

      // Simulate click on the call button
      callButton.click();

      // Should log a deprecation warning
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('onCallButtonClick is deprecated')
      );

      // The function should still be called
      expect(onCallButtonClick).toHaveBeenCalled();
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

    it('should handle updates with multiple state changes', () => {
      const header = CollapsibleHeader(defaultProps);
      let element = header.getElement();

      // Initially in normal state
      expect(element.classList.contains('collapsible-header--collapsed')).toBe(
        false
      );
      expect(element.classList.contains('collapsible-header--mobile')).toBe(
        false
      );

      // Update both collapsed and mobile state at once
      header.update({ isCollapsed: true, isMobile: true });

      // ✅ Get updated element after re-render
      element = header.getElement();

      // Should have both classes
      expect(element.classList.contains('collapsible-header--collapsed')).toBe(
        true
      );
      expect(element.classList.contains('collapsible-header--mobile')).toBe(
        true
      );
    });

    it('should maintain state consistency across updates', () => {
      const header = CollapsibleHeader(defaultProps);

      // Update state
      header.update({ isCollapsed: true, className: 'custom-class' });

      // Check that getState returns updated values
      const state = header.getState();
      expect(state.isCollapsed).toBe(true);
      expect(state.className).toBe('custom-class');

      // Element should reflect the state
      const element = header.getElement();
      expect(element.classList.contains('collapsible-header--collapsed')).toBe(
        true
      );
      expect(element.classList.contains('custom-class')).toBe(true);
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
      } catch (_e) {
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
      } catch (_e) {
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
      } catch (_e) {
        // Ignore errors if already removed
      }
    });

    it('should support legacy onCallButtonClick prop', () => {
      const onCallButtonClick = vi.fn();
      const header = CollapsibleHeaderContainer({
        ...defaultProps,
        onCallButtonClick,
      });
      document.body.appendChild(header.getElement());

      // Should log a deprecation warning
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('onCallButtonClick is deprecated')
      );

      // Clean up
      try {
        document.body.removeChild(header.getElement());
      } catch (_e) {
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
      } catch (_e) {
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
      } catch (_e) {
        // Ignore errors if already removed
      }
    });

    it('should update logo when container state changes', () => {
      const header = CollapsibleHeaderContainer({
        ...defaultProps,
        logo: 'full-logo.svg',
        compactLogo: 'compact-logo.svg',
        collapseThreshold: 50,
      });

      let element = header.getElement();
      document.body.appendChild(element);

      // Initially should use full logo
      const initialLogoImg = element.querySelector('.logo-container img');
      expect(initialLogoImg.src).toContain('full-logo.svg');

      // Simulate scroll past threshold
      Object.defineProperty(window, 'scrollY', { value: 100 });
      header.handleScroll();

      // ✅ Get updated element after state change
      element = header.getElement();
      const collapsedLogoImg = element.querySelector('.logo-container img');
      expect(collapsedLogoImg.src).toContain('compact-logo.svg');

      // Clean up
      try {
        document.body.removeChild(header.getElement());
      } catch (_e) {
        // Ignore errors if already removed
      }
    });
  });
});
