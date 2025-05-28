// src/components/CookieConsent/CookieConsent.js
import { createStyleInjector } from '../../utils/styleInjection.js';
import { cookieConsentStyles } from './CookieConsent.styles.js';
import Modal from '../Modal/index.js';

const injectCookieConsentStyles = createStyleInjector('CookieConsent');

// Default cookie categories - GDPR compliant with realistic texts
const DEFAULT_COOKIE_CATEGORIES = {
  necessary: {
    id: 'necessary',
    name: 'Technisch notwendige Cookies',
    description:
      'Diese Cookies sind für den Betrieb der Website unerlässlich. Sie ermöglichen grundlegende Funktionen wie Seitennavigation, Zugriff auf sichere Bereiche und das Speichern von Warenkorb-Inhalten. Diese Cookies sammeln keine Informationen, die Sie identifizieren könnten.',
    required: true,
    enabled: true,
  },
  functional: {
    id: 'functional',
    name: 'Funktionale Cookies',
    description:
      'Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung. Sie können von uns oder von Drittanbietern gesetzt werden, deren Dienste wir auf unseren Seiten verwenden. Beispiele: Spracheinstellungen, Standortdienste, Live-Chat-Funktionen.',
    required: false,
    enabled: false,
  },
  analytics: {
    id: 'analytics',
    name: 'Analyse-Cookies',
    description:
      'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem sie Informationen anonym sammeln und melden. Wir verwenden diese Daten zur Verbesserung unserer Website (z.B. Google Analytics, Hotjar).',
    required: false,
    enabled: false,
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing- und Werbe-Cookies',
    description:
      'Diese Cookies werden verwendet, um Ihnen relevante Werbeanzeigen zu zeigen und die Wirksamkeit von Werbekampagnen zu messen. Sie können auch verwendet werden, um Ihre Interessen zu identifizieren und Ihnen gezielte Werbung auf anderen Websites zu zeigen.',
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
 * Creates a CookieConsent component using Modal as string-based content
 */
const createCookieConsent = (props = {}) => {
  const state = {
    autoShow: props.autoShow !== false,
    mode: props.mode || 'simple',
    position: props.position || 'bottom',
    modal: props.modal || false,
    title: props.title || 'Cookie-Einstellungen',
    description: props.description,
    privacyPolicyUrl: props.privacyPolicyUrl,
    imprintUrl: props.imprintUrl,
    customCategories: props.customCategories || {},
    className: ['cookie-consent', props.className].filter(Boolean).join(' '),
    ...props,
  };

  let currentModal = null;

  // Get merged categories with GDPR compliance
  const getCategories = () => {
    const categories = {};
    Object.keys(DEFAULT_COOKIE_CATEGORIES).forEach((key) => {
      categories[key] = { ...DEFAULT_COOKIE_CATEGORIES[key] };
    });
    Object.keys(state.customCategories).forEach((key) => {
      categories[key] = { ...categories[key], ...state.customCategories[key] };
    });

    // GDPR compliance: non-required categories default to false
    Object.values(categories).forEach((category) => {
      if (!category.required) {
        category.enabled = category.enabled === true ? true : false;
      }
    });

    return categories;
  };

  // Create HTML content as string
  const createContentHTML = () => {
    injectCookieConsentStyles(cookieConsentStyles);

    const categories = getCategories();
    let html = `<div class="cookie-consent__content">`;

    // Description
    html += `<div class="cookie-consent__description">`;
    html +=
      state.description ||
      `
      <p><strong>Ihre Privatsphäre ist uns wichtig.</strong></p>
      <p>Wir verwenden Cookies und ähnliche Technologien, um Ihnen die bestmögliche Nutzererfahrung zu bieten, den Traffic zu analysieren und Inhalte zu personalisieren.</p>
      <p>Sie können selbst entscheiden, welche Cookie-Kategorien Sie zulassen möchten. Bitte beachten Sie, dass aufgrund Ihrer Einstellungen möglicherweise nicht alle Funktionen der Website verfügbar sind.</p>
      <p>Weitere Informationen finden Sie in unserer Datenschutzerklärung.</p>
    `;
    html += `</div>`;

    // Categories for detailed mode
    if (state.mode === 'detailed') {
      html += `<div class="cookie-consent__categories">`;

      Object.values(categories).forEach((category) => {
        const requiredClass = category.required
          ? ' cookie-consent__category--required'
          : '';
        const checkedAttr = category.enabled ? ' checked' : '';
        const disabledAttr = category.required ? ' disabled' : '';

        html += `
          <div class="cookie-consent__category${requiredClass}">
            <div class="cookie-consent__category-header">
              <label class="cookie-consent__category-label">
                <input 
                  type="checkbox" 
                  class="cookie-consent__category-checkbox"
                  data-category="${category.id}"
                  ${checkedAttr}${disabledAttr}
                />
                <span class="cookie-consent__category-name">${category.name}</span>
                ${category.required ? '<span class="cookie-consent__required-badge">Erforderlich</span>' : ''}
              </label>
            </div>
            <div class="cookie-consent__category-description">${category.description}</div>
          </div>
        `;
      });

      html += `</div>`;
    }

    // Legal links
    if (state.privacyPolicyUrl || state.imprintUrl) {
      html += `<div class="cookie-consent__legal">`;

      if (state.privacyPolicyUrl) {
        html += `<a href="${state.privacyPolicyUrl}" target="_blank" rel="noopener noreferrer" class="cookie-consent__legal-link">Datenschutzerklärung</a>`;
      }

      if (state.imprintUrl) {
        html += `<a href="${state.imprintUrl}" target="_blank" rel="noopener noreferrer" class="cookie-consent__legal-link">Impressum</a>`;
      }

      html += `</div>`;
    }

    html += `</div>`;
    return html;
  };

  // Setup event handlers after modal content is inserted
  const setupEventHandlers = () => {
    if (state.mode === 'detailed') {
      const checkboxes = document.querySelectorAll(
        '.cookie-consent__category-checkbox:not(:disabled)'
      );
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (e) => {
          const categoryId = e.target.dataset.category;
          props.onCategoryChange?.(categoryId, e.target.checked);
        });
      });
    }
  };

  const getActions = () => {
    const actions = [];

    // Reject button (necessary only)
    actions.push({
      text: 'Nur notwendige',
      variant: 'secondary',
      action: 'reject',
    });

    // Details button (only in simple mode)
    if (state.mode === 'simple') {
      actions.push({
        text: 'Einstellungen anpassen',
        variant: 'secondary',
        action: 'details',
      });
    }

    // Accept selected button (only in detailed mode)
    if (state.mode === 'detailed') {
      actions.push({
        text: 'Auswahl speichern',
        variant: 'primary',
        action: 'accept-selected',
      });
    }

    // Accept all button
    actions.push({
      text: 'Alle akzeptieren',
      variant: 'primary',
      action: 'accept-all',
    });

    return actions;
  };

  const handleAction = (action) => {
    const categories = getCategories();

    switch (action) {
      case 'reject': {
        const rejectPreferences = {};
        Object.keys(categories).forEach((key) => {
          rejectPreferences[key] = categories[key].required;
        });
        handleAccept(rejectPreferences);
        break;
      }

      case 'details':
        state.mode = 'detailed';
        recreateModal();
        props.onShowDetails?.();
        break;

      case 'accept-selected': {
        const selectedPreferences = {};
        const checkboxes = document.querySelectorAll(
          '.cookie-consent__category-checkbox'
        );

        if (checkboxes.length > 0) {
          checkboxes.forEach((checkbox) => {
            const categoryId = checkbox.dataset.category;
            selectedPreferences[categoryId] = checkbox.checked;
          });
        } else {
          // Fallback: use categories from state
          Object.keys(categories).forEach((key) => {
            selectedPreferences[key] = categories[key].enabled;
          });
        }

        handleAccept(selectedPreferences);
        break;
      }

      case 'accept-all': {
        const allPreferences = {};
        Object.keys(categories).forEach((key) => {
          allPreferences[key] = true;
        });
        handleAccept(allPreferences);
        break;
      }
    }
  };

  const handleAccept = (preferences) => {
    CookieManager.saveConsent(preferences);
    cookieConsent.hide();
    dispatchConsentEvent(preferences);
    props.onAccept?.(preferences);
  };

  const dispatchConsentEvent = (preferences) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cookieConsentAccepted', {
          detail: { preferences },
        })
      );
    }
  };

  const recreateModal = () => {
    if (!currentModal) return;

    const wasOpen = currentModal.isOpen();
    currentModal.destroy();
    currentModal = createModal();

    if (wasOpen) {
      currentModal.open();
      // Setup event handlers after modal is open and content is rendered
      setTimeout(setupEventHandlers, 0);
    }
  };

  const createModal = () => {
    const modalConfig = {
      title: state.title,
      content: createContentHTML(),
      variant: 'minimal',
      size: state.mode === 'detailed' ? 'large' : 'medium',
      showCloseButton: state.modal || state.showCloseButton,
      closeOnBackdrop: state.closeOnBackdrop || false,
      closeOnEscape: state.closeOnEscape !== false,
      showBackdrop: state.modal,
      lockBodyScroll: state.modal,
      className: state.className,
      actions: getActions(),
      onAction: handleAction,
      onClose: () => {
        props.onDismiss?.();
      },
      onOpen: () => {
        // Setup event handlers after modal opens
        setTimeout(setupEventHandlers, 0);
      },
    };

    // Position handling for banner mode
    if (!state.modal) {
      modalConfig.showBackdrop = false;
      modalConfig.lockBodyScroll = false;
      modalConfig.closeOnBackdrop = false;
      modalConfig.className += ` cookie-consent--banner cookie-consent--${state.position}`;
    } else {
      modalConfig.className += ' cookie-consent--modal';
    }

    return Modal(modalConfig);
  };

  const cookieConsent = {
    show() {
      if (!currentModal) {
        currentModal = createModal();
      }
      currentModal.open();
      return this;
    },

    hide() {
      if (currentModal) {
        currentModal.close();
      }
      return this;
    },

    showDetails() {
      state.mode = 'detailed';
      recreateModal();
      return this;
    },

    showSimple() {
      state.mode = 'simple';
      recreateModal();
      return this;
    },

    update(newProps) {
      Object.assign(state, newProps);
      recreateModal();
      return this;
    },

    destroy() {
      if (currentModal) {
        currentModal.destroy();
        currentModal = null;
      }
      return this;
    },

    getElement() {
      return currentModal?.getElement() || null;
    },

    getPreferences() {
      return CookieManager.getConsent()?.preferences || null;
    },

    hasConsent(category = null) {
      const consent = CookieManager.getConsent();
      if (!consent) return false;
      return category ? consent.preferences[category] === true : true;
    },

    revokeConsent() {
      CookieManager.clearConsent();
      if (state.autoShow) {
        this.show();
      }
      return this;
    },
  };

  // Auto-show check
  if (typeof document !== 'undefined' && state.autoShow) {
    setTimeout(() => {
      if (!CookieManager.hasValidConsent()) {
        cookieConsent.show();
      }
    }, 100);
  }

  return cookieConsent;
};

// Static methods
createCookieConsent.getConsent = () => CookieManager.getConsent();
createCookieConsent.hasConsent = (category) => {
  const consent = CookieManager.getConsent();
  if (!consent) return false;
  return category ? consent.preferences[category] === true : true;
};
createCookieConsent.revokeConsent = () => CookieManager.clearConsent();

export default createCookieConsent;
export { createCookieConsent, CookieManager };
