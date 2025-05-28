// src/components/CookieConsent/CookieConsentContainer.js
import {
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import CookieConsent from './CookieConsent.js';

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

/**
 * Creates a CookieConsentContainer component
 * @param {Object} props - Container properties
 * @returns {Object} CookieConsentContainer component API
 */
const createCookieConsentContainer = (props = {}) => {
  // Validate props
  validateProps(props, createCookieConsentContainer.requiredProps);

  // Component state
  const componentState = {
    ...props,
    autoShow: props.autoShow !== false, // Default to true
    mode: props.mode || 'simple',
    position: props.position || 'bottom',
    modal: props.modal || false,
    showCloseButton: props.showCloseButton || false,
    closeOnBackdrop: props.closeOnBackdrop || false,
    closeOnEscape: props.closeOnEscape !== false, // Default to true
  };

  let isVisible = false;
  let keydownHandler = null;

  // Create the presentation component
  const cookieConsent = CookieConsent({
    ...componentState,
    // Wire up event handlers
    onAcceptAll: handleAcceptAll,
    onAcceptSelected: handleAcceptSelected,
    onReject: handleReject,
    onShowDetails: handleShowDetails,
    onDismiss: handleDismiss,
    onCategoryChange: props.onCategoryChange,
  });

  // Event handlers
  function handleAcceptAll(preferences) {
    CookieManager.saveConsent(preferences);
    hide();
    dispatchConsentEvent(preferences);
    props.onAccept?.(preferences);
  }

  function handleAcceptSelected(preferences) {
    CookieManager.saveConsent(preferences);
    hide();
    dispatchConsentEvent(preferences);
    props.onAccept?.(preferences);
  }

  function handleReject(preferences) {
    CookieManager.saveConsent(preferences);
    hide();
    dispatchConsentEvent(preferences);
    props.onAccept?.(preferences);
  }

  function handleShowDetails() {
    cookieConsent.showDetails();
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
    const element = cookieConsent.getElement();

    // Ensure element is in DOM
    if (!element.parentNode) {
      document.body.appendChild(element);
    }

    if (componentState.modal) {
      document.body.classList.add('cookie-consent-open');
    }

    // Setup escape key handler
    if (componentState.closeOnEscape) {
      keydownHandler = (e) => {
        if (e.key === 'Escape') handleDismiss();
      };
      document.addEventListener('keydown', keydownHandler);
    }

    // Trigger animation
    setTimeout(() => {
      if (element) {
        element.classList.add('cookie-consent--visible');
      }
    }, 0);

    return containerComponent;
  }

  function hide() {
    if (!isVisible) return containerComponent;

    const element = cookieConsent.getElement();
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
    if (element && element.style.transition && !window.vitest) {
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

    return containerComponent;
  }

  function showDetails() {
    componentState.mode = 'detailed';
    cookieConsent.showDetails();
    return containerComponent;
  }

  function showSimple() {
    componentState.mode = 'simple';
    cookieConsent.showSimple();
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
    if (componentState.autoShow) {
      show();
    }
    return containerComponent;
  }

  function update(newProps) {
    Object.assign(componentState, newProps);

    // Update the presentation component
    cookieConsent.update({
      ...newProps,
      // Re-wire event handlers
      onAcceptAll: handleAcceptAll,
      onAcceptSelected: handleAcceptSelected,
      onReject: handleReject,
      onShowDetails: handleShowDetails,
      onDismiss: handleDismiss,
      onCategoryChange: props.onCategoryChange,
    });

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

    const element = cookieConsent.getElement();
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    isVisible = false;
    cookieConsent.destroy();

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
    getElement: () => cookieConsent.getElement(),
  };

  // Auto-show check - improved for tests
  if (typeof document !== 'undefined' && componentState.autoShow) {
    setTimeout(() => {
      if (!CookieManager.hasValidConsent()) {
        show();
      }
    }, 100);
  }

  return containerComponent;
};

// Define required props for validation
createCookieConsentContainer.requiredProps = [];

// Create the container component with theme awareness
const CookieConsentContainer = withThemeAwareness(
  createComponent('CookieConsentContainer', createCookieConsentContainer)
);

// Static methods
CookieConsentContainer.getConsent = () => CookieManager.getConsent();
CookieConsentContainer.hasConsent = (category) => {
  const consent = CookieManager.getConsent();
  if (!consent) return false;
  return category ? consent.preferences[category] === true : true;
};
CookieConsentContainer.revokeConsent = () => CookieManager.clearConsent();

export default CookieConsentContainer;
export { createCookieConsentContainer, CookieManager };
