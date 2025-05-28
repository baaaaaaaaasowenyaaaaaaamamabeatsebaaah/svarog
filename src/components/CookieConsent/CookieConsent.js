// src/components/CookieConsent/CookieConsent.js
import { createElement } from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { cookieConsentStyles } from './CookieConsent.styles.js';

const injectCookieConsentStyles = createStyleInjector('CookieConsent');

/**
 * Cookie categories with German descriptions as per DSGVO requirements
 */
const DEFAULT_COOKIE_CATEGORIES = {
  necessary: {
    id: 'necessary',
    name: 'Notwendige Cookies',
    description:
      'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
    required: true,
    enabled: true,
  },
  functional: {
    id: 'functional',
    name: 'Funktionale Cookies',
    description:
      'Diese Cookies ermöglichen verbesserte Funktionalitäten und Personalisierung der Website.',
    required: false,
    enabled: false,
  },
  analytics: {
    id: 'analytics',
    name: 'Analytische Cookies',
    description:
      'Diese Cookies helfen uns dabei, die Nutzung unserer Website zu verstehen und zu verbessern.',
    required: false,
    enabled: false,
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing Cookies',
    description:
      'Diese Cookies werden verwendet, um Ihnen relevante Werbung und Inhalte anzuzeigen.',
    required: false,
    enabled: false,
  },
};

/**
 * Cookie storage manager
 */
class CookieManager {
  static CONSENT_KEY = 'svarog_cookie_consent';
  static VERSION = '1.0';
  static EXPIRY_DAYS = 365;

  static saveConsent(preferences) {
    const consent = {
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      preferences,
      expires: new Date(
        Date.now() + this.EXPIRY_DAYS * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    try {
      localStorage.setItem(this.CONSENT_KEY, JSON.stringify(consent));
      this.setCookie(
        this.CONSENT_KEY,
        JSON.stringify(consent),
        this.EXPIRY_DAYS
      );
    } catch (error) {
      console.warn('Could not save cookie consent:', error);
    }
  }

  static getConsent() {
    try {
      const stored =
        localStorage.getItem(this.CONSENT_KEY) ||
        this.getCookie(this.CONSENT_KEY);
      if (!stored) return null;

      const consent = JSON.parse(stored);

      // Check if consent has expired
      if (new Date(consent.expires) < new Date()) {
        this.clearConsent();
        return null;
      }

      return consent;
    } catch (error) {
      console.warn('Could not read cookie consent:', error);
      return null;
    }
  }

  static clearConsent() {
    try {
      localStorage.removeItem(this.CONSENT_KEY);
      this.deleteCookie(this.CONSENT_KEY);
    } catch (error) {
      console.warn('Could not clear cookie consent:', error);
    }
  }

  static hasValidConsent() {
    const consent = this.getConsent();
    return consent && consent.version === this.VERSION;
  }

  static setCookie(name, value, days) {
    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  static getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
  }

  static deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

/**
 * Renders the cookie consent banner
 */
const renderCookieConsent = (state) => {
  injectCookieConsentStyles(cookieConsentStyles);

  const categories = {
    ...DEFAULT_COOKIE_CATEGORIES,
    ...state.customCategories,
  };

  // Main content
  const content = createElement('div', {
    className: 'cookie-consent__content',
    children: [
      // Header
      createElement('div', {
        className: 'cookie-consent__header',
        children: [
          createElement('h2', {
            className: 'cookie-consent__title',
            textContent: state.title || 'Cookie-Einstellungen',
          }),
          state.showCloseButton
            ? createElement('button', {
                className: 'cookie-consent__close',
                attributes: { 'aria-label': 'Schließen' },
                innerHTML: '&times;',
                events: {
                  click: () => state.onDismiss?.(),
                },
              })
            : null,
        ].filter(Boolean),
      }),

      // Description
      createElement('div', {
        className: 'cookie-consent__description',
        innerHTML:
          state.description ||
          `
          <p>Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
          Einige Cookies sind notwendig für den Betrieb der Website, während andere uns dabei helfen, 
          die Website und Ihre Erfahrung zu verbessern.</p>
          <p>Durch Klicken auf "Alle akzeptieren" stimmen Sie der Verwendung aller Cookies zu. 
          Sie können Ihre Einstellungen jederzeit ändern oder nur notwendige Cookies akzeptieren.</p>
        `,
      }),

      // Cookie categories (detailed view)
      state.mode === 'detailed'
        ? createElement('div', {
            className: 'cookie-consent__categories',
            children: Object.values(categories).map((category) =>
              createElement('div', {
                className: `cookie-consent__category ${category.required ? 'cookie-consent__category--required' : ''}`,
                children: [
                  createElement('div', {
                    className: 'cookie-consent__category-header',
                    children: [
                      createElement('label', {
                        className: 'cookie-consent__category-label',
                        children: [
                          createElement('input', {
                            type: 'checkbox',
                            className: 'cookie-consent__category-checkbox',
                            checked: category.enabled,
                            disabled: category.required,
                            events: {
                              change: (e) => {
                                category.enabled = e.target.checked;
                                state.onCategoryChange?.(
                                  category.id,
                                  e.target.checked
                                );
                              },
                            },
                          }),
                          createElement('span', {
                            className: 'cookie-consent__category-name',
                            textContent: category.name,
                          }),
                          category.required
                            ? createElement('span', {
                                className: 'cookie-consent__required-badge',
                                textContent: 'Erforderlich',
                              })
                            : null,
                        ].filter(Boolean),
                      }),
                    ],
                  }),
                  createElement('div', {
                    className: 'cookie-consent__category-description',
                    textContent: category.description,
                  }),
                ],
              })
            ),
          })
        : null,

      // Actions
      createElement('div', {
        className: 'cookie-consent__actions',
        children: [
          // Reject all (only non-necessary)
          createElement('button', {
            className: 'cookie-consent__button cookie-consent__button--reject',
            textContent: 'Nur notwendige',
            events: {
              click: () => {
                const preferences = {};
                Object.keys(categories).forEach((key) => {
                  preferences[key] = categories[key].required;
                });
                state.onAccept?.(preferences);
              },
            },
          }),

          // Show details toggle
          state.mode === 'simple'
            ? createElement('button', {
                className:
                  'cookie-consent__button cookie-consent__button--details',
                textContent: 'Einstellungen anpassen',
                events: {
                  click: () => state.onShowDetails?.(),
                },
              })
            : null,

          // Accept selected (detailed mode)
          state.mode === 'detailed'
            ? createElement('button', {
                className:
                  'cookie-consent__button cookie-consent__button--accept-selected',
                textContent: 'Auswahl speichern',
                events: {
                  click: () => {
                    const preferences = {};
                    Object.keys(categories).forEach((key) => {
                      preferences[key] = categories[key].enabled;
                    });
                    state.onAccept?.(preferences);
                  },
                },
              })
            : null,

          // Accept all
          createElement('button', {
            className:
              'cookie-consent__button cookie-consent__button--accept-all',
            textContent: 'Alle akzeptieren',
            events: {
              click: () => {
                const preferences = {};
                Object.keys(categories).forEach((key) => {
                  preferences[key] = true;
                });
                state.onAccept?.(preferences);
              },
            },
          }),
        ].filter(Boolean),
      }),

      // Legal links
      createElement('div', {
        className: 'cookie-consent__legal',
        children: [
          state.privacyPolicyUrl
            ? createElement('a', {
                href: state.privacyPolicyUrl,
                className: 'cookie-consent__legal-link',
                textContent: 'Datenschutzerklärung',
                target: '_blank',
                rel: 'noopener noreferrer',
              })
            : null,
          state.imprintUrl
            ? createElement('a', {
                href: state.imprintUrl,
                className: 'cookie-consent__legal-link',
                textContent: 'Impressum',
                target: '_blank',
                rel: 'noopener noreferrer',
              })
            : null,
        ].filter(Boolean),
      }),
    ].filter(Boolean),
  });

  // Banner container
  const banner = createElement('div', {
    className: `cookie-consent__banner cookie-consent__banner--${state.position || 'bottom'} ${state.mode === 'detailed' ? 'cookie-consent__banner--detailed' : ''}`,
    children: [content],
  });

  // Backdrop (for modal mode)
  const backdrop = state.modal
    ? createElement('div', {
        className: 'cookie-consent__backdrop',
        events: {
          click: (e) => {
            if (e.target === e.currentTarget && state.closeOnBackdrop) {
              state.onDismiss?.();
            }
          },
        },
      })
    : null;

  // Main container
  const container = createElement('div', {
    className: `cookie-consent ${state.modal ? 'cookie-consent--modal' : 'cookie-consent--banner'} ${state.className || ''}`,
    attributes: {
      role: 'dialog',
      'aria-modal': state.modal ? 'true' : 'false',
      'aria-labelledby': 'cookie-consent-title',
      'aria-describedby': 'cookie-consent-description',
    },
    children: [backdrop, banner].filter(Boolean),
  });

  // Keyboard handling
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && state.closeOnEscape) {
      state.onDismiss?.();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  container._cleanup = () => {
    document.removeEventListener('keydown', handleKeyDown);
  };

  return container;
};

/**
 * Creates a Cookie Consent component
 */
const createCookieConsent = (props = {}) => {
  const state = {
    mode: 'simple', // 'simple' | 'detailed'
    position: 'bottom', // 'top' | 'bottom' | 'center'
    modal: false,
    showCloseButton: false,
    closeOnBackdrop: false,
    closeOnEscape: true,
    autoShow: true,
    customCategories: {},
    ...props,
  };

  let isVisible = false;

  const component = createBaseComponent(renderCookieConsent)(state);

  // Check if consent is needed and auto-show
  const checkAndShow = () => {
    if (state.autoShow && !CookieManager.hasValidConsent()) {
      component.show();
    }
  };

  // Enhanced methods
  component.show = function () {
    if (isVisible) return this;

    isVisible = true;
    const element = this.getElement();

    // Only append if not already in DOM
    if (!element.parentNode) {
      document.body.appendChild(element);
    }

    // Add body class for modal
    if (state.modal) {
      document.body.classList.add('cookie-consent-open');
    }

    // Trigger animation
    requestAnimationFrame(() => {
      element.classList.add('cookie-consent--visible');
    });

    return this;
  };

  component.hide = function () {
    if (!isVisible) return this;

    const element = this.getElement();
    element.classList.remove('cookie-consent--visible');

    const handleTransitionEnd = () => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      document.body.classList.remove('cookie-consent-open');
      element.removeEventListener('transitionend', handleTransitionEnd);
      isVisible = false;
    };

    element.addEventListener('transitionend', handleTransitionEnd);
    // Fallback for when transition doesn't fire
    setTimeout(handleTransitionEnd, 300);

    return this;
  };

  component.showDetails = function () {
    state.mode = 'detailed';
    this.update({ mode: 'detailed' });
    return this;
  };

  component.showSimple = function () {
    state.mode = 'simple';
    this.update({ mode: 'simple' });
    return this;
  };

  component.getPreferences = function () {
    return CookieManager.getConsent()?.preferences || null;
  };

  component.hasConsent = function (category = null) {
    const consent = CookieManager.getConsent();
    if (!consent) return false;

    if (category) {
      return consent.preferences[category] === true;
    }

    return true;
  };

  component.revokeConsent = function () {
    CookieManager.clearConsent();
    if (state.autoShow) {
      this.show();
    }
    return this;
  };

  // Event handlers
  state.onAccept = (preferences) => {
    CookieManager.saveConsent(preferences);
    component.hide();

    // Trigger custom event
    window.dispatchEvent(
      new CustomEvent('cookieConsentAccepted', {
        detail: { preferences },
      })
    );

    props.onAccept?.(preferences);
  };

  state.onDismiss = () => {
    component.hide();
    props.onDismiss?.();
  };

  state.onShowDetails = () => {
    component.showDetails();
    props.onShowDetails?.();
  };

  state.onCategoryChange = (categoryId, enabled) => {
    props.onCategoryChange?.(categoryId, enabled);
  };

  // Enhanced destroy
  const originalDestroy = component.destroy;
  component.destroy = function () {
    if (this.getElement()?._cleanup) {
      this.getElement()._cleanup();
    }

    if (isVisible) {
      document.body.classList.remove('cookie-consent-open');
    }

    return originalDestroy.call(this);
  };

  // Auto-check on creation
  if (typeof document !== 'undefined') {
    setTimeout(checkAndShow, 100);
  }

  return component;
};

// Create with theme awareness
const CookieConsent = withThemeAwareness(createCookieConsent);

// Static methods
CookieConsent.getConsent = () => CookieManager.getConsent();
CookieConsent.hasConsent = (category) => {
  const consent = CookieManager.getConsent();
  if (!consent) return false;
  return category ? consent.preferences[category] === true : true;
};
CookieConsent.revokeConsent = () => CookieManager.clearConsent();

export default CookieConsent;
