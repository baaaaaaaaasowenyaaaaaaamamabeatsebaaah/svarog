import { createElement } from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { cookieConsentStyles } from './CookieConsent.styles.js';

const injectCookieConsentStyles = createStyleInjector('CookieConsent');

// Default cookie categories
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

// Cookie storage manager
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

// Render function
const renderCookieConsent = (state) => {
  injectCookieConsentStyles(cookieConsentStyles);

  const categories = {
    ...DEFAULT_COOKIE_CATEGORIES,
    ...state.customCategories,
  };

  // Title
  const title = createElement('h2', {
    className: 'cookie-consent__title',
    id: 'cookie-consent-title',
    textContent: state.title || 'Cookie-Einstellungen',
  });

  // Close button (only for modal or when explicitly enabled)
  const closeButton =
    state.modal || state.showCloseButton
      ? createElement('button', {
          className: 'cookie-consent__close',
          attributes: { 'aria-label': 'Schließen' },
          innerHTML: '&times;',
          eventListeners: { click: () => state.onDismiss?.() },
        })
      : null;

  // Header
  const header = createElement('div', {
    className: 'cookie-consent__header',
    children: [title, closeButton].filter(Boolean),
  });

  // Description
  const description = createElement('div', {
    className: 'cookie-consent__description',
    id: 'cookie-consent-description',
    innerHTML:
      state.description ||
      `
      <p>Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
      Einige Cookies sind notwendig für den Betrieb der Website, während andere uns dabei helfen, 
      die Website und Ihre Erfahrung zu verbessern.</p>
    `,
  });

  // Categories container for detailed mode
  const categoriesContainer =
    state.mode === 'detailed'
      ? createElement('div', {
          className: 'cookie-consent__categories',
          children: Object.values(categories).map((category) => {
            const checkbox = createElement('input', {
              attributes: {
                type: 'checkbox',
                checked: category.enabled,
                disabled: category.required,
              },
              className: 'cookie-consent__category-checkbox',
              eventListeners: {
                change: (e) => {
                  category.enabled = e.target.checked;
                  state.onCategoryChange?.(category.id, e.target.checked);
                },
              },
            });

            const categoryName = createElement('span', {
              className: 'cookie-consent__category-name',
              textContent: category.name,
            });

            const requiredBadge = category.required
              ? createElement('span', {
                  className: 'cookie-consent__required-badge',
                  textContent: 'Erforderlich',
                })
              : null;

            const categoryLabel = createElement('label', {
              className: 'cookie-consent__category-label',
              children: [checkbox, categoryName, requiredBadge].filter(Boolean),
            });

            const categoryHeader = createElement('div', {
              className: 'cookie-consent__category-header',
              children: [categoryLabel],
            });

            const categoryDesc = createElement('div', {
              className: 'cookie-consent__category-description',
              textContent: category.description,
            });

            const categoryEl = createElement('div', {
              className: `cookie-consent__category${category.required ? ' cookie-consent__category--required' : ''}`,
              children: [categoryHeader, categoryDesc],
            });

            // Store references for easy access
            categoryEl._checkbox = checkbox;
            categoryEl._category = category;

            return categoryEl;
          }),
        })
      : null;

  // Action buttons
  const rejectButton = createElement('button', {
    className: 'cookie-consent__button cookie-consent__button--reject',
    textContent: 'Nur notwendige',
    eventListeners: {
      click: () => {
        const preferences = {};
        Object.keys(categories).forEach((key) => {
          preferences[key] = categories[key].required;
        });
        state.onAccept?.(preferences);
      },
    },
  });

  const detailsButton =
    state.mode === 'simple'
      ? createElement('button', {
          className: 'cookie-consent__button cookie-consent__button--details',
          textContent: 'Einstellungen anpassen',
          eventListeners: { click: () => state.onShowDetails?.() },
        })
      : null;

  const acceptSelectedButton =
    state.mode === 'detailed'
      ? createElement('button', {
          className:
            'cookie-consent__button cookie-consent__button--accept-selected',
          textContent: 'Auswahl speichern',
          eventListeners: {
            click: () => {
              const preferences = {};
              if (categoriesContainer) {
                categoriesContainer
                  .querySelectorAll('.cookie-consent__category')
                  .forEach((catEl) => {
                    const category = catEl._category;
                    const checkbox = catEl._checkbox;
                    preferences[category.id] = checkbox.checked;
                  });
              }
              state.onAccept?.(preferences);
            },
          },
        })
      : null;

  const acceptAllButton = createElement('button', {
    className: 'cookie-consent__button cookie-consent__button--accept-all',
    textContent: 'Alle akzeptieren',
    eventListeners: {
      click: () => {
        const preferences = {};
        Object.keys(categories).forEach((key) => {
          preferences[key] = true;
        });
        state.onAccept?.(preferences);
      },
    },
  });

  const actions = createElement('div', {
    className: 'cookie-consent__actions',
    children: [
      rejectButton,
      detailsButton,
      acceptSelectedButton,
      acceptAllButton,
    ].filter(Boolean),
  });

  // Legal links
  const legal =
    state.privacyPolicyUrl || state.imprintUrl
      ? createElement('div', {
          className: 'cookie-consent__legal',
          children: [
            state.privacyPolicyUrl
              ? createElement('a', {
                  attributes: {
                    href: state.privacyPolicyUrl,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  },
                  className: 'cookie-consent__legal-link',
                  textContent: 'Datenschutzerklärung',
                })
              : null,
            state.imprintUrl
              ? createElement('a', {
                  attributes: {
                    href: state.imprintUrl,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  },
                  className: 'cookie-consent__legal-link',
                  textContent: 'Impressum',
                })
              : null,
          ].filter(Boolean),
        })
      : null;

  // Content wrapper
  const content = createElement('div', {
    className: 'cookie-consent__content',
    children: [header, description, categoriesContainer, actions, legal].filter(
      Boolean
    ),
  });

  // Banner
  const banner = createElement('div', {
    className: `cookie-consent__banner cookie-consent__banner--${state.position || 'bottom'}${state.mode === 'detailed' ? ' cookie-consent__banner--detailed' : ''}`,
    children: [content],
  });

  // Backdrop for modal
  const backdrop = state.modal
    ? createElement('div', {
        className: 'cookie-consent__backdrop',
        eventListeners: state.closeOnBackdrop
          ? {
              click: (e) => {
                if (e.target === e.currentTarget) state.onDismiss?.();
              },
            }
          : {},
      })
    : null;

  // Main container
  const container = createElement('div', {
    className: [
      'cookie-consent',
      state.modal ? 'cookie-consent--modal' : 'cookie-consent--banner',
      state.className || '',
    ]
      .filter(Boolean)
      .join(' '),
    attributes: {
      role: 'dialog',
      'aria-modal': state.modal ? 'true' : 'false',
      'aria-labelledby': 'cookie-consent-title',
      'aria-describedby': 'cookie-consent-description',
    },
    children: [backdrop, banner].filter(Boolean),
  });

  // Store categories reference for tests
  container._categories = categories;

  return container;
};

// Create cookie consent component
const createCookieConsent = (props = {}) => {
  const state = {
    mode: 'simple',
    position: 'bottom',
    modal: false,
    showCloseButton: false,
    closeOnBackdrop: false,
    closeOnEscape: true,
    autoShow: true,
    customCategories: {},
    ...props,
  };

  let isVisible = false;
  let element = null;
  let keydownHandler = null;

  const baseComponent = createBaseComponent(renderCookieConsent)(state);

  // Component methods
  const component = {
    ...baseComponent,

    show() {
      if (isVisible) return this;

      isVisible = true;
      element = this.getElement();

      // Ensure element is in DOM
      if (!element.parentNode) {
        document.body.appendChild(element);
      }

      if (state.modal) {
        document.body.classList.add('cookie-consent-open');
      }

      // Setup escape key handler
      if (state.closeOnEscape) {
        keydownHandler = (e) => {
          if (e.key === 'Escape') handleDismiss();
        };
        document.addEventListener('keydown', keydownHandler);
      }

      // Trigger animation with delay for tests
      setTimeout(() => {
        if (element) {
          element.classList.add('cookie-consent--visible');
        }
      }, 0);

      return this;
    },

    hide() {
      if (!isVisible) return this;

      element = this.getElement();
      if (element) {
        element.classList.remove('cookie-consent--visible');
      }

      const cleanup = () => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
        document.body.classList.remove('cookie-consent-open');

        if (keydownHandler) {
          document.removeEventListener('keydown', keydownHandler);
          keydownHandler = null;
        }

        isVisible = false;
      };

      // Wait for transition or cleanup immediately for tests
      if (element && element.style.transition) {
        const handleTransitionEnd = (e) => {
          if (e.target === element) {
            element.removeEventListener('transitionend', handleTransitionEnd);
            cleanup();
          }
        };

        element.addEventListener('transitionend', handleTransitionEnd);
        setTimeout(() => {
          if (element) {
            element.removeEventListener('transitionend', handleTransitionEnd);
          }
          cleanup();
        }, 50);
      } else {
        cleanup();
      }

      return this;
    },

    showDetails() {
      state.mode = 'detailed';
      this.update({ mode: 'detailed' });
      return this;
    },

    showSimple() {
      state.mode = 'simple';
      this.update({ mode: 'simple' });
      return this;
    },

    getPreferences() {
      return CookieManager.getConsent()?.preferences || null;
    },

    hasConsent(category = null) {
      const consent = CookieManager.getConsent();
      if (!consent) return false;

      if (category) {
        return consent.preferences[category] === true;
      }

      return true;
    },

    revokeConsent() {
      CookieManager.clearConsent();
      if (state.autoShow) {
        this.show();
      }
      return this;
    },

    destroy() {
      if (keydownHandler) {
        document.removeEventListener('keydown', keydownHandler);
        keydownHandler = null;
      }

      if (isVisible) {
        document.body.classList.remove('cookie-consent-open');
      }

      element = this.getElement();
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      isVisible = false;

      return baseComponent.destroy.call(this);
    },
  };

  // Event handlers
  const handleAccept = (preferences) => {
    CookieManager.saveConsent(preferences);
    component.hide();

    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cookieConsentAccepted', {
          detail: { preferences },
        })
      );
    }

    props.onAccept?.(preferences);
  };

  const handleDismiss = () => {
    component.hide();
    props.onDismiss?.();
  };

  // Setup state callbacks
  state.onAccept = handleAccept;
  state.onDismiss = handleDismiss;
  state.onShowDetails = () => {
    component.showDetails();
    props.onShowDetails?.();
  };
  state.onCategoryChange = props.onCategoryChange;

  // Auto-show check - improved for tests
  if (typeof document !== 'undefined' && state.autoShow) {
    setTimeout(() => {
      if (!CookieManager.hasValidConsent()) {
        component.show();
      }
    }, 100);
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

// Export both the component and the factory function
export default CookieConsent;
export { createCookieConsent, CookieConsent };
