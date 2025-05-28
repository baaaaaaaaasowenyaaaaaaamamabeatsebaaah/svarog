// src/components/CookieConsent/CookieConsent.test.js
/* eslint-env browser */
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

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => {
  setTimeout(cb, 0);
  return 1;
};

// Mock matchMedia for Modal
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: true, // Always prefer reduced motion in tests
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

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
      await new Promise((resolve) => setTimeout(resolve, 50));

      const dialog = document.querySelector('.modal__dialog');
      const container = document.querySelector('.modal__container');
      const title = document.querySelector('.modal__title');

      expect(dialog).toBeTruthy();
      expect(container?.classList.contains('cookie-consent--modal')).toBe(true);
      expect(title?.textContent).toBe('Test Title');
    });
  });

  describe('Display and Hide', () => {
    it('should show and hide the consent modal', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      expect(document.querySelector('.modal__container')).toBeFalsy();

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const modal = document.querySelector('.modal__container');
      expect(modal).toBeTruthy();

      cookieConsent.hide();
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(document.querySelector('.modal__container')).toBeFalsy();
    });

    it('should show as banner by default', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const container = document.querySelector('.modal__container');
      expect(container?.classList.contains('cookie-consent--banner')).toBe(
        true
      );
      expect(document.querySelector('.modal__backdrop')).toBeFalsy();
    });

    it('should show as modal when modal prop is true', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        modal: true,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const container = document.querySelector('.modal__container');
      const backdrop = document.querySelector('.modal__backdrop');

      expect(container?.classList.contains('cookie-consent--modal')).toBe(true);
      expect(backdrop).toBeTruthy();
    });
  });

  describe('Cookie Categories', () => {
    it('should render default cookie categories in detailed mode', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        mode: 'detailed',
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 200));

      const categories = document.querySelectorAll('.cookie-consent__category');
      expect(categories.length).toBeGreaterThan(0);

      const necessaryCategory = Array.from(categories).find((cat) =>
        cat.textContent.includes('Technisch notwendige Cookies')
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
      await new Promise((resolve) => setTimeout(resolve, 200));

      const customCategory = Array.from(
        document.querySelectorAll('.cookie-consent__category')
      ).find((cat) => cat.textContent.includes('Custom Category'));
      expect(customCategory).toBeTruthy();
    });

    it('should not show categories in simple mode', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        mode: 'simple',
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const categories = document.querySelectorAll('.cookie-consent__category');
      expect(categories.length).toBe(0);
    });
  });

  describe('User Interactions', () => {
    it('should handle accept all action', async () => {
      const onAccept = vi.fn();
      const cookieConsent = CookieConsent({
        autoShow: false,
        onAccept,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const acceptButton = Array.from(document.querySelectorAll('button')).find(
        (btn) => btn.textContent === 'Alle akzeptieren'
      );
      expect(acceptButton).toBeTruthy();

      acceptButton.click();
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(onAccept).toHaveBeenCalledWith(
        expect.objectContaining({
          necessary: true,
          functional: true,
          analytics: true,
          marketing: true,
        })
      );
    });

    it('should handle reject action (only necessary)', async () => {
      const onAccept = vi.fn();
      const cookieConsent = CookieConsent({
        autoShow: false,
        onAccept,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const rejectButton = Array.from(document.querySelectorAll('button')).find(
        (btn) => btn.textContent === 'Nur notwendige'
      );
      expect(rejectButton).toBeTruthy();

      rejectButton.click();
      await new Promise((resolve) => setTimeout(resolve, 10));

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
      await new Promise((resolve) => setTimeout(resolve, 100));

      const detailsButton = Array.from(
        document.querySelectorAll('button')
      ).find((btn) => btn.textContent === 'Einstellungen anpassen');
      expect(detailsButton).toBeTruthy();

      detailsButton.click();
      await new Promise((resolve) => setTimeout(resolve, 200));

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
      await new Promise((resolve) => setTimeout(resolve, 200));

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
    it('should save consent to localStorage', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const acceptButton = Array.from(document.querySelectorAll('button')).find(
        (btn) => btn.textContent === 'Alle akzeptieren'
      );
      acceptButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'svarog_cookie_consent',
        expect.stringContaining('"preferences"')
      );
    });

    it('should check existing consent', () => {
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
    it('should have proper ARIA attributes from Modal', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const dialog = document.querySelector('.modal__dialog');

      expect(dialog?.getAttribute('role')).toBe('dialog');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });

    it('should handle escape key via Modal', async () => {
      const onDismiss = vi.fn();
      const cookieConsent = CookieConsent({
        autoShow: false,
        closeOnEscape: true,
        onDismiss,
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const escapeEvent = new window.KeyboardEvent('keydown', {
        key: 'Escape',
      });
      document.dispatchEvent(escapeEvent);

      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe('GDPR Compliance', () => {
    it('should require explicit consent for non-necessary cookies', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        mode: 'detailed',
      });
      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 200));

      // All optional categories should be disabled by default (GDPR compliance)
      const optionalCheckboxes = document.querySelectorAll(
        '.cookie-consent__category-checkbox:not(:disabled)'
      );

      optionalCheckboxes.forEach((checkbox) => {
        expect(checkbox.checked).toBe(false);
      });

      // Verify that necessary cookies are enabled and disabled
      const necessaryCheckbox = document.querySelector(
        '.cookie-consent__category-checkbox[disabled]'
      );
      expect(necessaryCheckbox?.checked).toBe(true);
      expect(necessaryCheckbox?.disabled).toBe(true);
    });

    it('should store consent with proper versioning', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });
      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const acceptButton = Array.from(document.querySelectorAll('button')).find(
        (btn) => btn.textContent === 'Alle akzeptieren'
      );
      acceptButton?.click();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const savedConsent = localStorageMock.setItem.mock.calls.find(
        (call) => call[0] === 'svarog_cookie_consent'
      );

      expect(savedConsent).toBeTruthy();

      const consentData = JSON.parse(savedConsent[1]);
      expect(consentData.version).toBe('1.0');
      expect(consentData.timestamp).toBeTruthy();
      expect(consentData.expires).toBeTruthy();
    });
  });

  describe('Auto-show Behavior', () => {
    it('should auto-show when no consent exists', async () => {
      expect(CookieConsent.hasConsent()).toBe(false);

      CookieConsent({ autoShow: true });

      await new Promise((resolve) => setTimeout(resolve, 150));

      const modal = document.querySelector('.modal__container');
      expect(modal).toBeTruthy();
    });

    it('should not auto-show when valid consent exists', async () => {
      const validConsent = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        preferences: { necessary: true },
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };

      mockStorage['svarog_cookie_consent'] = JSON.stringify(validConsent);

      CookieConsent({ autoShow: true });

      await new Promise((resolve) => setTimeout(resolve, 150));

      const modal = document.querySelector('.modal__container');
      expect(modal).toBeFalsy();
    });
  });

  describe('Legal Links', () => {
    it('should render legal links', async () => {
      const cookieConsent = CookieConsent({
        autoShow: false,
        privacyPolicyUrl: '/datenschutz',
        imprintUrl: '/impressum',
      });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 200));

      const privacyLink = document.querySelector('a[href="/datenschutz"]');
      const imprintLink = document.querySelector('a[href="/impressum"]');

      expect(privacyLink).toBeTruthy();
      expect(imprintLink).toBeTruthy();
      expect(privacyLink?.textContent).toBe('Datenschutzerklärung');
      expect(imprintLink?.textContent).toBe('Impressum');
    });
  });

  describe('Component Management', () => {
    it('should clean up resources on destroy', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const element = cookieConsent.getElement();
      expect(element).toBeTruthy();

      cookieConsent.destroy();

      expect(document.querySelector('.modal__container')).toBeFalsy();
    });
  });

  describe('Method Chaining', () => {
    it('should support method chaining', async () => {
      const cookieConsent = CookieConsent({ autoShow: false });

      const result = cookieConsent.show().showDetails();
      expect(result).toBe(cookieConsent);

      await new Promise((resolve) => setTimeout(resolve, 200));

      const categories = document.querySelectorAll('.cookie-consent__category');
      expect(categories.length).toBeGreaterThan(0);

      cookieConsent.destroy();
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', async () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('localStorage is full');
      });

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      const cookieConsent = CookieConsent({ autoShow: false });
      cookieConsent.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const acceptButton = Array.from(document.querySelectorAll('button')).find(
        (btn) => btn.textContent === 'Alle akzeptieren'
      );

      expect(() => acceptButton?.click()).not.toThrow();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Could not save cookie consent:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });
});
