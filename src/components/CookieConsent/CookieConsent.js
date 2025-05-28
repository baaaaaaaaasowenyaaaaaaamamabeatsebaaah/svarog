// src/components/CookieConsent/CookieConsent.js
import { createElement, validateProps } from '../../utils/componentFactory.js';
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

/**
 * Renders the CookieConsent component
 * @param {Object} state - Component state
 * @returns {HTMLElement} CookieConsent element
 */
const renderCookieConsent = (state) => {
  injectCookieConsentStyles(cookieConsentStyles);

  const categories = {
    ...DEFAULT_COOKIE_CATEGORIES,
    ...state.customCategories,
  };

  // Title
  const title = createElement('h2', {
    className: 'cookie-consent__title',
    attributes: { id: 'cookie-consent-title' },
    textContent: state.title || 'Cookie-Einstellungen',
  });

  // Close button (only for modal or when explicitly enabled)
  const closeButton =
    state.modal || state.showCloseButton
      ? createElement('button', {
          className: 'cookie-consent__close',
          attributes: { 'aria-label': 'Schließen' },
          innerHTML: '&times;',
          eventListeners: {
            click: () => state.onDismiss?.(),
          },
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
    attributes: { id: 'cookie-consent-description' },
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
        state.onReject?.(preferences);
      },
    },
  });

  const detailsButton =
    state.mode === 'simple'
      ? createElement('button', {
          className: 'cookie-consent__button cookie-consent__button--details',
          textContent: 'Einstellungen anpassen',
          eventListeners: {
            click: () => state.onShowDetails?.(),
          },
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
              state.onAcceptSelected?.(preferences);
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
        state.onAcceptAll?.(preferences);
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

/**
 * Creates a CookieConsent presentation component
 * @param {Object} props - Component properties
 * @returns {Object} CookieConsent component API
 */
const createCookieConsent = (props = {}) => {
  // Validate props
  validateProps(props, createCookieConsent.requiredProps);

  // Initial state with defaults
  const initialState = {
    mode: 'simple',
    position: 'bottom',
    modal: false,
    showCloseButton: false,
    closeOnBackdrop: false,
    closeOnEscape: true,
    customCategories: {},
    title: props.title || 'Cookie-Einstellungen',
    description: props.description,
    privacyPolicyUrl: props.privacyPolicyUrl,
    imprintUrl: props.imprintUrl,
    className: props.className,
    ...props,
  };

  // Create the base component
  const component = createBaseComponent(renderCookieConsent)(initialState);

  // Create extended component with additional methods
  const cookieConsentComponent = {
    ...component,

    /**
     * Switch to detailed mode
     * @returns {Object} Component instance for chaining
     */
    showDetails() {
      return this.update({ mode: 'detailed' });
    },

    /**
     * Switch to simple mode
     * @returns {Object} Component instance for chaining
     */
    showSimple() {
      return this.update({ mode: 'simple' });
    },
  };

  return cookieConsentComponent;
};

// Define required props for validation
createCookieConsent.requiredProps = [];

// Create the component with theme awareness
const CookieConsent = withThemeAwareness(createCookieConsent);

export default CookieConsent;
export { createCookieConsent };
