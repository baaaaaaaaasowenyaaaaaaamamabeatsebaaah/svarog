// src/components/BackToTop/BackToTop.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import BackToTop from './BackToTop.js';
import { wait } from '../../utils/testUtils.js';

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

// Mock performance.now for consistent testing
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));

describe('BackToTop', () => {
  let backToTop;
  let container;

  beforeEach(() => {
    // Create container for testing
    container = document.createElement('div');
    document.body.appendChild(container);

    // Reset scroll position
    window.scrollTo(0, 0);

    // Clear any existing styles
    document
      .querySelectorAll('[data-svarog="backtotop"]')
      .forEach((el) => el.remove());
  });

  afterEach(() => {
    if (backToTop) {
      backToTop.destroy();
    }
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    vi.clearAllMocks();
  });

  describe('Component Creation', () => {
    it('should create a BackToTop component with default props', () => {
      backToTop = BackToTop();
      const buttonElement = backToTop.getElement();

      expect(buttonElement).toBeInstanceOf(HTMLButtonElement);
      expect(buttonElement.classList.contains('back-to-top')).toBe(true);
      expect(buttonElement.getAttribute('aria-label')).toBe('Back to top');
      expect(buttonElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('should inject styles on creation', () => {
      backToTop = BackToTop();
      backToTop.getElement();

      const styleElement = document.querySelector('[data-svarog="backtotop"]');
      expect(styleElement).toBeTruthy();
      expect(styleElement.textContent).toContain('.back-to-top');
    });

    it('should create component with custom props', () => {
      backToTop = BackToTop({
        icon: '🔝',
        ariaLabel: 'Custom back to top',
        className: 'custom-class',
        showAfter: 500,
      });

      const buttonElement = backToTop.getElement();

      expect(buttonElement.classList.contains('custom-class')).toBe(true);
      expect(buttonElement.getAttribute('aria-label')).toBe(
        'Custom back to top'
      );
      expect(buttonElement.textContent).toBe('🔝');
    });

    it('should handle custom icon element', () => {
      const iconElement = document.createElement('svg');
      iconElement.innerHTML = '<path d="M0 0h24v24H0z"/>';

      backToTop = BackToTop({
        icon: iconElement,
      });

      const buttonElement = backToTop.getElement();
      const icon = buttonElement.querySelector('svg');

      expect(icon).toBeTruthy();
      expect(icon.classList.contains('back-to-top__icon')).toBe(true);
    });
  });

  describe('Visibility Control', () => {
    it('should be hidden by default', () => {
      backToTop = BackToTop();
      const buttonElement = backToTop.getElement();

      expect(buttonElement.classList.contains('back-to-top--visible')).toBe(
        false
      );
      expect(buttonElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('should show when scrolled past threshold', async () => {
      backToTop = BackToTop({ showAfter: 100 });
      const buttonElement = backToTop.getElement();
      container.appendChild(buttonElement);

      // Simulate scroll
      Object.defineProperty(window, 'pageYOffset', {
        value: 150,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));

      await wait(50);

      expect(buttonElement.classList.contains('back-to-top--visible')).toBe(
        true
      );
      expect(buttonElement.getAttribute('aria-hidden')).toBe('false');
    });

    it('should hide when scrolled back above threshold', async () => {
      backToTop = BackToTop({ showAfter: 100 });
      const buttonElement = backToTop.getElement();
      container.appendChild(buttonElement);

      // Scroll down
      Object.defineProperty(window, 'pageYOffset', {
        value: 150,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
      await wait(50);

      // Scroll back up
      Object.defineProperty(window, 'pageYOffset', {
        value: 50,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
      await wait(50);

      expect(buttonElement.classList.contains('back-to-top--visible')).toBe(
        false
      );
      expect(buttonElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('should manually show/hide with API methods', () => {
      backToTop = BackToTop();
      const buttonElement = backToTop.getElement();

      backToTop.show();
      expect(buttonElement.classList.contains('back-to-top--visible')).toBe(
        true
      );

      backToTop.hide();
      expect(buttonElement.classList.contains('back-to-top--visible')).toBe(
        false
      );
    });
  });

  describe('Click Behavior', () => {
    it('should scroll to top when clicked', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo');

      backToTop = BackToTop();
      const buttonElement = backToTop.getElement();

      buttonElement.click();

      expect(scrollToSpy).toHaveBeenCalled();
    });

    it('should call custom onClick handler', () => {
      const onClickSpy = vi.fn();

      backToTop = BackToTop({
        onClick: onClickSpy,
      });

      const buttonElement = backToTop.getElement();
      buttonElement.click();

      expect(onClickSpy).toHaveBeenCalledOnce();
    });

    it('should handle keyboard events', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo');

      backToTop = BackToTop();
      const buttonElement = backToTop.getElement();

      // Create keyboard events manually with preventDefault
      const createKeyEvent = (key) => {
        const event = new Event('keydown');
        Object.defineProperty(event, 'key', { value: key, writable: false });
        Object.defineProperty(event, 'preventDefault', {
          value: vi.fn(),
          writable: false,
        });
        return event;
      };

      // Test Enter key
      const enterEvent = createKeyEvent('Enter');
      buttonElement.dispatchEvent(enterEvent);
      expect(scrollToSpy).toHaveBeenCalled();

      scrollToSpy.mockClear();

      // Test Space key
      const spaceEvent = createKeyEvent(' ');
      buttonElement.dispatchEvent(spaceEvent);
      expect(scrollToSpy).toHaveBeenCalled();
    });

    it('should not respond to clicks when disabled', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo');

      backToTop = BackToTop({ disabled: true });
      const buttonElement = backToTop.getElement();

      buttonElement.click();

      expect(scrollToSpy).not.toHaveBeenCalled();
      expect(buttonElement.classList.contains('back-to-top--disabled')).toBe(
        true
      );
    });
  });

  describe('Callback Functions', () => {
    it('should call onShow callback when button becomes visible', async () => {
      const onShowSpy = vi.fn();

      backToTop = BackToTop({
        showAfter: 100,
        onShow: onShowSpy,
      });

      const buttonElement = backToTop.getElement();
      container.appendChild(buttonElement);

      Object.defineProperty(window, 'pageYOffset', {
        value: 150,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));

      await wait(50);

      expect(onShowSpy).toHaveBeenCalledOnce();
    });

    it('should call onHide callback when button becomes hidden', async () => {
      const onHideSpy = vi.fn();

      backToTop = BackToTop({
        showAfter: 100,
        onHide: onHideSpy,
      });

      const buttonElement = backToTop.getElement();
      container.appendChild(buttonElement);

      // Show first
      Object.defineProperty(window, 'pageYOffset', {
        value: 150,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
      await wait(50);

      // Then hide
      Object.defineProperty(window, 'pageYOffset', {
        value: 50,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
      await wait(50);

      expect(onHideSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Custom Scroll Target', () => {
    it('should work with custom scroll container', async () => {
      const scrollContainer = document.createElement('div');
      scrollContainer.style.height = '200px';
      scrollContainer.style.overflow = 'auto';
      container.appendChild(scrollContainer);

      backToTop = BackToTop({
        scrollTarget: scrollContainer,
        showAfter: 50,
      });

      const buttonElement = backToTop.getElement();
      container.appendChild(buttonElement);

      // Simulate scroll in custom container
      Object.defineProperty(scrollContainer, 'scrollTop', {
        value: 100,
        writable: true,
      });
      scrollContainer.dispatchEvent(new Event('scroll'));

      await wait(50);

      expect(buttonElement.classList.contains('back-to-top--visible')).toBe(
        true
      );
    });
  });

  describe('Component Updates', () => {
    it('should update props correctly', () => {
      backToTop = BackToTop({
        ariaLabel: 'Original label',
        disabled: false,
      });

      const buttonElement = backToTop.getElement();

      backToTop.update({
        ariaLabel: 'Updated label',
        disabled: true,
      });

      expect(buttonElement.getAttribute('aria-label')).toBe('Updated label');
      expect(buttonElement.classList.contains('back-to-top--disabled')).toBe(
        true
      );
    });

    it('should update icon when changed', () => {
      backToTop = BackToTop({
        icon: 'Original',
      });

      const buttonElement = backToTop.getElement();
      expect(buttonElement.textContent).toBe('Original');

      backToTop.update({
        icon: 'Updated',
      });

      expect(buttonElement.textContent).toBe('Updated');
    });

    it('should handle prop validation errors gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      backToTop = BackToTop();

      // Try to update with invalid prop type (this should log an error but not crash)
      try {
        backToTop.update({
          showAfter: 'invalid', // Should be number
        });
      } catch (_error) {
        // Expected to catch validation error
      }

      // The component should still be functional
      expect(backToTop.getElement()).toBeTruthy();
      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid props during creation', () => {
      expect(() => {
        BackToTop({
          showAfter: 'invalid',
        });
      }).toThrow();
    });

    it('should handle destroyed component gracefully', () => {
      backToTop = BackToTop();
      backToTop.getElement();

      backToTop.destroy();

      // These should not throw errors
      backToTop.show();
      backToTop.hide();
      backToTop.scrollToTop();
      backToTop.update({ icon: 'new' });
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on destroy', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      backToTop = BackToTop();
      backToTop.getElement();

      backToTop.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });

    it('should remove element from DOM on destroy', () => {
      backToTop = BackToTop();
      const buttonElement = backToTop.getElement();
      container.appendChild(buttonElement);

      expect(container.contains(buttonElement)).toBe(true);

      backToTop.destroy();

      expect(container.contains(buttonElement)).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      backToTop = BackToTop();
      const buttonElement = backToTop.getElement();

      expect(buttonElement.getAttribute('aria-label')).toBe('Back to top');
      expect(buttonElement.getAttribute('aria-hidden')).toBe('true');
      expect(buttonElement.getAttribute('type')).toBe('button');
      expect(buttonElement.tagName).toBe('BUTTON');
    });

    it('should update tabindex when disabled', () => {
      backToTop = BackToTop();
      const buttonElement = backToTop.getElement();

      expect(buttonElement.getAttribute('tabindex')).toBe('0');

      backToTop.update({ disabled: true });

      expect(buttonElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should update aria-hidden based on visibility', async () => {
      backToTop = BackToTop({ showAfter: 100 });
      const buttonElement = backToTop.getElement();
      container.appendChild(buttonElement);

      // Initially hidden
      expect(buttonElement.getAttribute('aria-hidden')).toBe('true');

      // Show
      Object.defineProperty(window, 'pageYOffset', {
        value: 150,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
      await wait(50);

      expect(buttonElement.getAttribute('aria-hidden')).toBe('false');
    });
  });

  describe('Performance', () => {
    it('should throttle scroll events', async () => {
      const handleScrollSpy = vi.fn();

      backToTop = BackToTop({
        showAfter: 100,
        onShow: handleScrollSpy,
      });

      backToTop.getElement();

      // Dispatch multiple scroll events rapidly
      Object.defineProperty(window, 'pageYOffset', {
        value: 150,
        writable: true,
      });
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(new Event('scroll'));
      }

      await wait(100);

      // Should only be called once due to throttling
      expect(handleScrollSpy).toHaveBeenCalledTimes(1);
    });
  });
});
