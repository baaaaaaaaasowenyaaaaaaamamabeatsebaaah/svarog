// src/components/CookieConsent/CookieConsentContainer.js
import { createStyleInjector } from '../../utils/styleInjection.js';
import { cookieConsentStyles } from './CookieConsent.styles.js';

const injectCookieConsentStyles = createStyleInjector('CookieConsent');

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

// Default cookie categories - GDPR compliant (non-required default to false)
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
    enabled: false, // GDPR: explicit consent required
  },
  analytics: {
    id: 'analytics',
    name: 'Analytische Cookies',
    description:
      'Diese Cookies helfen uns dabei, die Nutzung unserer Website zu verstehen und zu verbessern.',
    required: false,
    enabled: false, // GDPR: explicit consent required
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing Cookies',
    description:
      'Diese Cookies werden verwendet, um Ihnen relevante Werbung und Inhalte anzuzeigen.',
    required: false,
    enabled: false, // GDPR: explicit consent required
  },
};

/**
 * Creates a CookieConsentContainer component
 * @param {Object} props - Container properties
 * @returns {Object} CookieConsentContainer component API
 */
const createCookieConsentContainer = (props = {}) => {
  // Component state
  let state = {
    autoShow: props.autoShow !== false, // Default to true
    mode: props.mode || 'simple',
    position: props.position || 'bottom',
    modal: props.modal || false,
    showCloseButton: props.showCloseButton || false,
    closeOnBackdrop: props.closeOnBackdrop || false,
    closeOnEscape: props.closeOnEscape !== false, // Default to true
    title: props.title || 'Cookie-Einstellungen',
    description: props.description,
    privacyPolicyUrl: props.privacyPolicyUrl,
    imprintUrl: props.imprintUrl,
    className: props.className,
    customCategories: props.customCategories || {},
    ...props,
  };

  let isVisible = false;
  let keydownHandler = null;
  let currentElement = null;

  // Create DOM element directly
  const createDOMElement = () => {
    injectCookieConsentStyles(cookieConsentStyles);

    // Merge categories and ensure GDPR compliance
    const categories = {};

    // Start with defaults
    Object.keys(DEFAULT_COOKIE_CATEGORIES).forEach((key) => {
      categories[key] = { ...DEFAULT_COOKIE_CATEGORIES[key] };
    });

    // Merge custom categories
    Object.keys(state.customCategories).forEach((key) => {
      categories[key] = { ...categories[key], ...state.customCategories[key] };
    });

    // GDPR compliance: Explicitly ensure non-required categories are unchecked
    Object.values(categories).forEach((category) => {
      if (!category.required) {
        // For GDPR compliance, non-required categories must default to false
        // Only allow true if explicitly set by user
        category.enabled = category.enabled === true ? true : false;
      }
    });

    // Create main container
    const container = document.createElement('div');
    container.className = [
      'cookie-consent',
      state.modal ? 'cookie-consent--modal' : 'cookie-consent--banner',
      state.className || '',
    ]
      .filter(Boolean)
      .join(' ');

    container.setAttribute('role', 'dialog');
    container.setAttribute('aria-modal', state.modal ? 'true' : 'false');
    container.setAttribute('aria-labelledby', 'cookie-consent-title');
    container.setAttribute('aria-describedby', 'cookie-consent-description');

    // Backdrop for modal
    if (state.modal) {
      const backdrop = document.createElement('div');
      backdrop.className = 'cookie-consent__backdrop';
      if (state.closeOnBackdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === e.currentTarget) handleDismiss();
        });
      }
      container.appendChild(backdrop);
    }

    // Banner
    const banner = document.createElement('div');
    banner.className = `cookie-consent__banner cookie-consent__banner--${
      state.position || 'bottom'
    }${state.mode === 'detailed' ? ' cookie-consent__banner--detailed' : ''}`;

    // Content wrapper
    const content = document.createElement('div');
    content.className = 'cookie-consent__content';

    // Header
    const header = document.createElement('div');
    header.className = 'cookie-consent__header';

    // Title
    const title = document.createElement('h2');
    title.className = 'cookie-consent__title';
    title.id = 'cookie-consent-title';
    title.textContent = state.title;
    header.appendChild(title);

    // Close button
    if (state.modal || state.showCloseButton) {
      const closeButton = document.createElement('button');
      closeButton.className = 'cookie-consent__close';
      closeButton.setAttribute('aria-label', 'Schließen');
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => handleDismiss());
      header.appendChild(closeButton);
    }

    content.appendChild(header);

    // Description
    const description = document.createElement('div');
    description.className = 'cookie-consent__description';
    description.id = 'cookie-consent-description';
    description.innerHTML =
      state.description ||
      `
      <p>Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
      Einige Cookies sind notwendig für den Betrieb der Website, während andere uns dabei helfen, 
      die Website und Ihre Erfahrung zu verbessern.</p>
    `;
    content.appendChild(description);

    // Categories for detailed mode
    if (state.mode === 'detailed') {
      const categoriesContainer = document.createElement('div');
      categoriesContainer.className = 'cookie-consent__categories';

      Object.values(categories).forEach((category) => {
        const categoryEl = document.createElement('div');
        categoryEl.className = `cookie-consent__category${
          category.required ? ' cookie-consent__category--required' : ''
        }`;

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'cookie-consent__category-header';

        const categoryLabel = document.createElement('label');
        categoryLabel.className = 'cookie-consent__category-label';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = Boolean(category.enabled); // Ensure boolean conversion
        checkbox.disabled = Boolean(category.required); // Ensure boolean conversion
        checkbox.className = 'cookie-consent__category-checkbox';
        checkbox.addEventListener('change', (e) => {
          category.enabled = e.target.checked;
          props.onCategoryChange?.(category.id, e.target.checked);
        });

        const categoryName = document.createElement('span');
        categoryName.className = 'cookie-consent__category-name';
        categoryName.textContent = category.name;

        categoryLabel.appendChild(checkbox);
        categoryLabel.appendChild(categoryName);

        if (category.required) {
          const requiredBadge = document.createElement('span');
          requiredBadge.className = 'cookie-consent__required-badge';
          requiredBadge.textContent = 'Erforderlich';
          categoryLabel.appendChild(requiredBadge);
        }

        categoryHeader.appendChild(categoryLabel);
        categoryEl.appendChild(categoryHeader);

        const categoryDesc = document.createElement('div');
        categoryDesc.className = 'cookie-consent__category-description';
        categoryDesc.textContent = category.description;
        categoryEl.appendChild(categoryDesc);

        // Store references for tests
        categoryEl._checkbox = checkbox;
        categoryEl._category = category;

        categoriesContainer.appendChild(categoryEl);
      });

      content.appendChild(categoriesContainer);
    }

    // Actions
    const actions = document.createElement('div');
    actions.className = 'cookie-consent__actions';

    // Reject button
    const rejectButton = document.createElement('button');
    rejectButton.className =
      'cookie-consent__button cookie-consent__button--reject';
    rejectButton.textContent = 'Nur notwendige';
    rejectButton.addEventListener('click', () => {
      const preferences = {};
      Object.keys(categories).forEach((key) => {
        preferences[key] = categories[key].required;
      });
      handleAccept(preferences);
    });
    actions.appendChild(rejectButton);

    // Details button (only in simple mode)
    if (state.mode === 'simple') {
      const detailsButton = document.createElement('button');
      detailsButton.className =
        'cookie-consent__button cookie-consent__button--details';
      detailsButton.textContent = 'Einstellungen anpassen';
      detailsButton.addEventListener('click', () => handleShowDetails());
      actions.appendChild(detailsButton);
    }

    // Accept selected button (only in detailed mode)
    if (state.mode === 'detailed') {
      const acceptSelectedButton = document.createElement('button');
      acceptSelectedButton.className =
        'cookie-consent__button cookie-consent__button--accept-selected';
      acceptSelectedButton.textContent = 'Auswahl speichern';
      acceptSelectedButton.addEventListener('click', () => {
        const preferences = {};
        const categoryElements = container.querySelectorAll(
          '.cookie-consent__category'
        );
        categoryElements.forEach((catEl) => {
          const category = catEl._category;
          const checkbox = catEl._checkbox;
          preferences[category.id] = checkbox.checked;
        });
        handleAccept(preferences);
      });
      actions.appendChild(acceptSelectedButton);
    }

    // Accept all button
    const acceptAllButton = document.createElement('button');
    acceptAllButton.className =
      'cookie-consent__button cookie-consent__button--accept-all';
    acceptAllButton.textContent = 'Alle akzeptieren';
    acceptAllButton.addEventListener('click', () => {
      const preferences = {};
      Object.keys(categories).forEach((key) => {
        preferences[key] = true;
      });
      handleAccept(preferences);
    });
    actions.appendChild(acceptAllButton);

    content.appendChild(actions);

    // Legal links
    if (state.privacyPolicyUrl || state.imprintUrl) {
      const legal = document.createElement('div');
      legal.className = 'cookie-consent__legal';

      if (state.privacyPolicyUrl) {
        const privacyLink = document.createElement('a');
        privacyLink.href = state.privacyPolicyUrl;
        privacyLink.target = '_blank';
        privacyLink.rel = 'noopener noreferrer';
        privacyLink.className = 'cookie-consent__legal-link';
        privacyLink.textContent = 'Datenschutzerklärung';
        legal.appendChild(privacyLink);
      }

      if (state.imprintUrl) {
        const imprintLink = document.createElement('a');
        imprintLink.href = state.imprintUrl;
        imprintLink.target = '_blank';
        imprintLink.rel = 'noopener noreferrer';
        imprintLink.className = 'cookie-consent__legal-link';
        imprintLink.textContent = 'Impressum';
        legal.appendChild(imprintLink);
      }

      content.appendChild(legal);
    }

    banner.appendChild(content);
    container.appendChild(banner);

    // Store categories reference for tests
    container._categories = categories;

    return container;
  };

  // Event handlers
  function handleAccept(preferences) {
    CookieManager.saveConsent(preferences);
    hide();
    dispatchConsentEvent(preferences);
    props.onAccept?.(preferences);
  }

  function handleShowDetails() {
    state.mode = 'detailed';
    update({});
    props.onShowDetails?.();
  }

  function handleDismiss() {
    hide();
    props.onDismiss?.();
  }

  function dispatchConsentEvent(preferences) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cookieConsentAccepted', {
          detail: { preferences },
        })
      );
    }
  }

  // Component methods
  function show() {
    if (isVisible) return containerComponent;

    isVisible = true;
    currentElement = createDOMElement();

    // Insert into DOM
    document.body.appendChild(currentElement);

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

    // Trigger animation
    setTimeout(() => {
      if (currentElement) {
        currentElement.classList.add('cookie-consent--visible');
      }
    }, 0);

    return containerComponent;
  }

  function hide() {
    if (!isVisible) return containerComponent;

    if (currentElement) {
      currentElement.classList.remove('cookie-consent--visible');
    }

    const cleanup = () => {
      if (currentElement && currentElement.parentNode) {
        currentElement.parentNode.removeChild(currentElement);
      }
      document.body.classList.remove('cookie-consent-open');

      if (keydownHandler) {
        document.removeEventListener('keydown', keydownHandler);
        keydownHandler = null;
      }

      isVisible = false;
      currentElement = null;
    };

    // For tests, cleanup immediately
    if (typeof window !== 'undefined' && window.vitest) {
      cleanup();
    } else {
      // Wait for transition
      setTimeout(cleanup, 50);
    }

    return containerComponent;
  }

  function showDetails() {
    state.mode = 'detailed';

    if (isVisible) {
      // Replace current element
      const newElement = createDOMElement();
      if (currentElement && currentElement.parentNode) {
        currentElement.parentNode.replaceChild(newElement, currentElement);
        currentElement = newElement;

        // Restore visibility
        setTimeout(() => {
          if (newElement) {
            newElement.classList.add('cookie-consent--visible');
          }
        }, 0);
      }
    }

    return containerComponent;
  }

  function showSimple() {
    state.mode = 'simple';

    if (isVisible) {
      // Replace current element
      const newElement = createDOMElement();
      if (currentElement && currentElement.parentNode) {
        currentElement.parentNode.replaceChild(newElement, currentElement);
        currentElement = newElement;

        // Restore visibility
        setTimeout(() => {
          if (newElement) {
            newElement.classList.add('cookie-consent--visible');
          }
        }, 0);
      }
    }

    return containerComponent;
  }

  function getPreferences() {
    return CookieManager.getConsent()?.preferences || null;
  }

  function hasConsent(category = null) {
    const consent = CookieManager.getConsent();
    if (!consent) return false;

    if (category) {
      return consent.preferences[category] === true;
    }

    return true;
  }

  function revokeConsent() {
    CookieManager.clearConsent();
    if (state.autoShow) {
      show();
    }
    return containerComponent;
  }

  function update(newProps) {
    Object.assign(state, newProps);

    // If currently visible, update the DOM
    if (isVisible) {
      const newElement = createDOMElement();
      if (currentElement && currentElement.parentNode) {
        currentElement.parentNode.replaceChild(newElement, currentElement);
        currentElement = newElement;

        // Restore visibility
        setTimeout(() => {
          if (newElement) {
            newElement.classList.add('cookie-consent--visible');
          }
        }, 0);
      }
    }

    return containerComponent;
  }

  function destroy() {
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }

    if (isVisible) {
      document.body.classList.remove('cookie-consent-open');
    }

    if (currentElement && currentElement.parentNode) {
      currentElement.parentNode.removeChild(currentElement);
    }

    isVisible = false;
    currentElement = null;

    return containerComponent;
  }

  // Container component API
  const containerComponent = {
    show,
    hide,
    showDetails,
    showSimple,
    getPreferences,
    hasConsent,
    revokeConsent,
    update,
    destroy,
    getElement: () => currentElement,
  };

  // Auto-show check
  if (typeof document !== 'undefined' && state.autoShow) {
    setTimeout(() => {
      if (!CookieManager.hasValidConsent()) {
        show();
      }
    }, 100);
  }

  return containerComponent;
};

// Static methods
createCookieConsentContainer.getConsent = () => CookieManager.getConsent();
createCookieConsentContainer.hasConsent = (category) => {
  const consent = CookieManager.getConsent();
  if (!consent) return false;
  return category ? consent.preferences[category] === true : true;
};
createCookieConsentContainer.revokeConsent = () => CookieManager.clearConsent();

export default createCookieConsentContainer;
export { createCookieConsentContainer, CookieManager };
