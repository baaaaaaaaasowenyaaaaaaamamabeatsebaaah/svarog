// src/components/CookieConsent/CookieConsent.test.js
/* eslint-env browser */
/* global KeyboardEvent */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import CookieConsent from './CookieConsent.js';

// Mock localStorage
const mockStorage = {};
const localStorageMock = {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, value) => {
    mockStorage[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete mockStorage[key];
  }),
  clear: vi.fn(() => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock document.cookie
let mockCookie = '';
Object.defineProperty(document, 'cookie', {
  get: () => mockCookie,
  set: (value) => {
    mockCookie = value;
  },
  configurable: true,
});

global.requestAnimationFrame = (cb) => {
  setTimeout(cb, 0);
  return 1;
};

// Mock KeyboardEvent for tests
global.KeyboardEvent =
  global.KeyboardEvent ||
  class KeyboardEvent extends Event {
    constructor(type, options = {}) {
      super(type, options);
      this.key = options.key || '';
      this.code = options.code || '';
      this.ctrlKey = options.ctrlKey || false;
      this.shiftKey = options.shiftKey || false;
      this.altKey = options.altKey || false;
      this.metaKey = options.metaKey || false;
    }
  };

describe('CookieConsent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
    mockCookie = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('Component Creation', () => {
    it('should create cookie consent with default props', () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      expect(cookieConsent).toBeDefined();
      expect(cookieConsent.show).toBeInstanceOf(Function);
      expect(cookieConsent.hide).toBeInstanceOf(Function);
      expect(cookieConsent.getPreferences).toBeInstanceOf(Function);
      expect(cookieConsent.hasConsent).toBeInstanceOf(Function);
      expect(cookieConsent.revokeConsent).toBeInstanceOf(Function);
    });

    it('should create with custom props', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        modal: true,
        title: 'Test Title',
      });

      cookieConsent.show();

      // Wait a bit for rendering
      await new Promise((resolve) => setTimeout(resolve, 50));

      const element = document.querySelector('.cookie-consent');
      const title = document.querySelector('.cookie-consent__title');

      expect(element).toBeTruthy();
      expect(element.classList.contains('cookie-consent--modal')).toBe(true);
      expect(title?.textContent).toBe('Test Title');
    });
  });

  describe('Display and Hide', () => {
    it('should show and hide the consent banner', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      // Should not be visible initially
      expect(document.querySelector('.cookie-consent')).toBeFalsy();

      // Show banner
      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const element = document.querySelector('.cookie-consent');
      expect(element).toBeTruthy();

      // Hide banner
      cookieConsent.hide();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Element should be removed
      expect(document.querySelector('.cookie-consent')).toBeFalsy();
    });

    it('should show modal with backdrop', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        modal: true,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const backdrop = document.querySelector('.cookie-consent__backdrop');
      const modal = document.querySelector('.cookie-consent--modal');

      expect(backdrop).toBeTruthy();
      expect(modal).toBeTruthy();
    });
  });

  describe('Cookie Categories', () => {
    it('should render default cookie categories', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        mode: 'detailed',
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const categories = document.querySelectorAll('.cookie-consent__category');
      expect(categories.length).toBeGreaterThan(0);

      // Should have necessary category that's required
      const necessaryCategory = Array.from(categories).find((cat) =>
        cat.textContent.includes('Notwendige Cookies')
      );
      expect(necessaryCategory).toBeTruthy();

      const necessaryCheckbox = necessaryCategory?.querySelector(
        'input[type="checkbox"]'
      );
      expect(necessaryCheckbox?.disabled).toBe(true);
      expect(necessaryCheckbox?.checked).toBe(true);
    });

    it('should handle custom categories', async () => {
      const customCategories = {
        necessary: {
          id: 'necessary',
          name: 'Required Cookies',
          description: 'Essential cookies',
          required: true,
          enabled: true,
        },
        custom: {
          id: 'custom',
          name: 'Custom Category',
          description: 'Custom description',
          required: false,
          enabled: false,
        },
      };

      const cookieConsent = CookieConsent({
        autoShow: false,
        mode: 'detailed',
        customCategories,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const customCategory = Array.from(
        document.querySelectorAll('.cookie-consent__category')
      ).find((cat) => cat.textContent.includes('Custom Category'));
      expect(customCategory).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should handle accept all', async () => {
      const onAccept = vi.fn();
      const cookieConsent = CookieConsent({
        autoShow: false,
        onAccept,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const acceptButton = document.querySelector(
        '.cookie-consent__button--accept-all'
      );
      expect(acceptButton).toBeTruthy();

      acceptButton.click();

      expect(onAccept).toHaveBeenCalledWith(
        expect.objectContaining({
          necessary: true,
          functional: true,
          analytics: true,
          marketing: true,
        })
      );
    });

    it('should handle reject all (only necessary)', async () => {
      const onAccept = vi.fn();
      const cookieConsent = CookieConsent({
        autoShow: false,
        onAccept,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const rejectButton = document.querySelector(
        '.cookie-consent__button--reject'
      );
      expect(rejectButton).toBeTruthy();

      rejectButton.click();

      expect(onAccept).toHaveBeenCalledWith(
        expect.objectContaining({
          necessary: true,
          functional: false,
          analytics: false,
          marketing: false,
        })
      );
    });

    it('should switch to detailed mode', async () => {
      const onShowDetails = vi.fn();
      const cookieConsent = CookieConsent({
        autoShow: false,
        onShowDetails,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const detailsButton = document.querySelector(
        '.cookie-consent__button--details'
      );
      expect(detailsButton).toBeTruthy();

      detailsButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Should now be in detailed mode
      const categories = document.querySelectorAll('.cookie-consent__category');
      expect(categories.length).toBeGreaterThan(0);
      expect(onShowDetails).toHaveBeenCalled();
    });

    it('should handle category changes in detailed mode', async () => {
      const onCategoryChange = vi.fn();
      const cookieConsent = CookieConsent({
        autoShow: false,
        mode: 'detailed',
        onCategoryChange,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Find a non-required checkbox
      const checkboxes = document.querySelectorAll(
        '.cookie-consent__category-checkbox:not(:disabled)'
      );
      expect(checkboxes.length).toBeGreaterThan(0);

      const firstCheckbox = checkboxes[0];
      firstCheckbox.click();

      expect(onCategoryChange).toHaveBeenCalled();
    });
  });

  describe('Cookie Storage', () => {
    it('should save consent to localStorage and cookies', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const acceptButton = document.querySelector(
        '.cookie-consent__button--accept-all'
      );
      acceptButton?.click();

      // Check localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'svarog_cookie_consent',
        expect.stringContaining('"preferences"')
      );
    });

    it('should check existing consent', () => {
      // Mock existing consent
      const existingConsent = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        preferences: { necessary: true, analytics: false },
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };

      mockStorage['svarog_cookie_consent'] = JSON.stringify(existingConsent);

      const consent = CookieConsent.getConsent();
      expect(consent).toEqual(existingConsent);

      const hasConsent = CookieConsent.hasConsent();
      expect(hasConsent).toBe(true);

      const hasAnalytics = CookieConsent.hasConsent('analytics');
      expect(hasAnalytics).toBe(false);
    });

    it('should revoke consent', () => {
      // Set up existing consent
      mockStorage['svarog_cookie_consent'] = JSON.stringify({
        version: '1.0',
        preferences: { necessary: true },
      });

      CookieConsent.revokeConsent();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'svarog_cookie_consent'
      );
      expect(CookieConsent.hasConsent()).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const container = document.querySelector('.cookie-consent');

      expect(container?.getAttribute('role')).toBe('dialog');
      expect(container?.getAttribute('aria-labelledby')).toBe(
        'cookie-consent-title'
      );
      expect(container?.getAttribute('aria-describedby')).toBe(
        'cookie-consent-description'
      );
    });

    it('should handle escape key', async () => {
      const onDismiss = vi.fn();
      const cookieConsent = CookieConsent({
        autoShow: false,
        modal: true,
        closeOnEscape: true,
        onDismiss,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Simulate escape key
      const escapeEvent = new window.KeyboardEvent('keydown', {
        key: 'Escape',
      });
      document.dispatchEvent(escapeEvent);

      expect(onDismiss).toHaveBeenCalled();
    });

    it('should handle close button', async () => {
      const onDismiss = vi.fn();
      const cookieConsent = CookieConsent({
        autoShow: false,
        showCloseButton: true,
        onDismiss,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const closeButton = document.querySelector('.cookie-consent__close');
      expect(closeButton).toBeTruthy();

      closeButton?.click();
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe('Legal Requirements (DSGVO)', () => {
    it('should render legal links', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        privacyPolicyUrl: '/datenschutz',
        imprintUrl: '/impressum',
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const privacyLink = document.querySelector('a[href="/datenschutz"]');
      const imprintLink = document.querySelector('a[href="/impressum"]');

      expect(privacyLink).toBeTruthy();
      expect(imprintLink).toBeTruthy();
      expect(privacyLink?.textContent).toBe('Datenschutzerklärung');
      expect(imprintLink?.textContent).toBe('Impressum');
    });

    it('should require explicit consent for non-necessary categories', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        mode: 'detailed',
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // All non-necessary categories should be unchecked by default
      const optionalCheckboxes = document.querySelectorAll(
        '.cookie-consent__category-checkbox:not(:disabled)'
      );

      optionalCheckboxes.forEach((checkbox) => {
        expect(checkbox.checked).toBe(false);
      });
    });

    it('should store consent version and timestamp', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const acceptButton = document.querySelector(
        '.cookie-consent__button--accept-all'
      );
      acceptButton?.click();

      // Check that consent includes version and timestamp
      const savedConsent = localStorageMock.setItem.mock.calls.find(
        (call) => call[0] === 'svarog_cookie_consent'
      );

      expect(savedConsent).toBeTruthy();

      const consentData = JSON.parse(savedConsent[1]);
      expect(consentData.version).toBe('1.0');
      expect(consentData.timestamp).toBeTruthy();
      expect(consentData.expires).toBeTruthy();
      expect(new Date(consentData.expires)).toBeInstanceOf(Date);
    });
  });

  describe('Auto-show Behavior', () => {
    it('should auto-show when no consent exists', async () => {
      // Ensure no existing consent
      expect(CookieConsent.hasConsent()).toBe(false);

      CookieConsent({ autoShow: true });

      // Wait for auto-show delay
      await new Promise((resolve) => setTimeout(resolve, 150));

      const element = document.querySelector('.cookie-consent');
      expect(element).toBeTruthy();
    });

    it('should not auto-show when valid consent exists', async () => {
      // Mock valid consent
      const validConsent = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        preferences: { necessary: true },
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };

      mockStorage['svarog_cookie_consent'] = JSON.stringify(validConsent);

      CookieConsent({ autoShow: true });

      // Wait to ensure it doesn't show
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should not show
      const element = document.querySelector('.cookie-consent');
      expect(element).toBeFalsy();
    });
  });

  describe('Custom Events', () => {
    it('should dispatch consent accepted event', async () => {
      const eventSpy = vi.fn();
      window.addEventListener('cookieConsentAccepted', eventSpy);

      const cookieConsent = CookieConsent({ autoShow: false });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const acceptButton = document.querySelector(
        '.cookie-consent__button--accept-all'
      );
      acceptButton?.click();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(eventSpy).toHaveBeenCalled();

      const eventDetail = eventSpy.mock.calls[0][0].detail;
      expect(eventDetail.preferences).toBeTruthy();

      window.removeEventListener('cookieConsentAccepted', eventSpy);
    });
  });

  describe('Component Management', () => {
    it('should handle multiple show/hide cycles', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      // Show
      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(document.querySelector('.cookie-consent')).toBeTruthy();

      // Hide
      cookieConsent.hide();
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(document.querySelector('.cookie-consent')).toBeFalsy();

      // Show again
      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(document.querySelector('.cookie-consent')).toBeTruthy();

      // Cleanup
      cookieConsent.destroy();
    });

    it('should clean up resources on destroy', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const element = cookieConsent.getElement();
      expect(element).toBeTruthy();

      cookieConsent.destroy();

      // Element should be removed
      expect(document.querySelector('.cookie-consent')).toBeFalsy();
      expect(document.body.classList.contains('cookie-consent-open')).toBe(
        false
      );
    });
  });

  describe('Static Methods', () => {
    it('should provide static consent management methods', () => {
      expect(CookieConsent.getConsent).toBeInstanceOf(Function);
      expect(CookieConsent.hasConsent).toBeInstanceOf(Function);
      expect(CookieConsent.revokeConsent).toBeInstanceOf(Function);
    });

    it('should handle expired consent', () => {
      // Mock expired consent
      const expiredConsent = {
        version: '1.0',
        timestamp: new Date(
          Date.now() - 2 * 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        preferences: { necessary: true },
        expires: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Expired yesterday
      };

      mockStorage['svarog_cookie_consent'] = JSON.stringify(expiredConsent);

      const consent = CookieConsent.getConsent();
      expect(consent).toBe(null);

      const hasConsent = CookieConsent.hasConsent();
      expect(hasConsent).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', async () => {
      // Mock localStorage error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('localStorage is full');
      });

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      const cookieConsent = CookieConsent({ autoShow: false });
      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const acceptButton = document.querySelector(
        '.cookie-consent__button--accept-all'
      );

      // Should not throw
      expect(() => acceptButton?.click()).not.toThrow();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Could not save cookie consent:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle malformed consent data', () => {
      // Mock malformed consent
      mockStorage['svarog_cookie_consent'] = 'invalid-json';

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      const consent = CookieConsent.getConsent();
      expect(consent).toBe(null);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Could not read cookie consent:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Position and Modal Modes', () => {
    it('should apply correct position classes', async () => {
      const positions = ['top', 'bottom', 'center'];

      for (const position of positions) {
        const cookieConsent = CookieConsent({
          autoShow: false,
          position,
          modal: position === 'center',
        });

        cookieConsent.show();
        await new Promise((resolve) => setTimeout(resolve, 50));

        const banner = document.querySelector('.cookie-consent__banner');
        expect(
          banner?.classList.contains(`cookie-consent__banner--${position}`)
        ).toBe(true);

        cookieConsent.destroy();
      }
    });

    it('should handle backdrop clicks in modal mode', async () => {
      const onDismiss = vi.fn();
      const cookieConsent = CookieConsent({
        autoShow: false,
        modal: true,
        closeOnBackdrop: true,
        onDismiss,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const backdrop = document.querySelector('.cookie-consent__backdrop');
      expect(backdrop).toBeTruthy();

      backdrop?.click();
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe('Component State Management', () => {
    it('should maintain state between simple and detailed modes', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        mode: 'simple',
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Switch to detailed
      cookieConsent.showDetails();
      await new Promise((resolve) => setTimeout(resolve, 50));

      let categories = document.querySelectorAll('.cookie-consent__category');
      expect(categories.length).toBeGreaterThan(0);

      // Switch back to simple
      cookieConsent.showSimple();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const detailsButton = document.querySelector(
        '.cookie-consent__button--details'
      );
      expect(detailsButton).toBeTruthy();
    });

    it('should update content when props change', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        title: 'Original Title',
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      let title = document.querySelector('.cookie-consent__title');
      expect(title?.textContent).toBe('Original Title');

      // Update props
      cookieConsent.update({ title: 'Updated Title' });
      await new Promise((resolve) => setTimeout(resolve, 50));

      title = document.querySelector('.cookie-consent__title');
      expect(title?.textContent).toBe('Updated Title');
    });
  });

  describe('Method Chain Support', () => {
    it('should support method chaining', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      // Should support chaining
      const result = cookieConsent.show().showDetails();
      expect(result).toBe(cookieConsent);

      await new Promise((resolve) => setTimeout(resolve, 50));

      const categories = document.querySelectorAll('.cookie-consent__category');
      expect(categories.length).toBeGreaterThan(0);

      cookieConsent.destroy();
    });
  });

  describe('Theme Integration', () => {
    it('should apply custom className', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        className: 'custom-theme',
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const container = document.querySelector('.cookie-consent');
      expect(container?.classList.contains('custom-theme')).toBe(true);
    });
  });
});
