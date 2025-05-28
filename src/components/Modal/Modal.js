// src/components/Modal/Modal.js
import { createElement } from '../../utils/componentFactory.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import Button from '../Button/index.js';
import { modalStyles } from './Modal.styles.js';

const injectStyles = createStyleInjector('modal');

/**
 * Creates a Modal component
 * @param {Object} props - Component properties
 * @param {string} [props.title] - Modal title
 * @param {string|HTMLElement|Object} [props.content] - Modal content
 * @param {string} [props.variant='default'] - Style variant
 * @param {string} [props.size='medium'] - Modal size
 * @param {boolean} [props.showCloseButton=true] - Show close button
 * @param {boolean} [props.closeOnBackdrop=true] - Close on backdrop click
 * @param {boolean} [props.closeOnEscape=true] - Close on ESC key
 * @param {boolean} [props.showBackdrop=true] - Show backdrop
 * @param {boolean} [props.lockBodyScroll=true] - Lock body scroll
 * @param {boolean} [props.autoFocus=true] - Auto-focus first element
 * @param {boolean} [props.restoreFocus=true] - Restore focus on close
 * @param {string} [props.ariaLabel] - Accessibility label
 * @param {string} [props.ariaDescribedBy] - Describing element ID
 * @param {string} [props.className] - Additional CSS classes
 * @param {Array} [props.actions] - Action buttons configuration
 * @param {Function} [props.onOpen] - Open callback
 * @param {Function} [props.onClose] - Close callback
 * @param {Function} [props.onAction] - Action button callback
 * @returns {Object} Modal component API
 */
const createModal = (props = {}) => {
  // Inject styles on first render
  injectStyles(modalStyles);

  // State
  const state = {
    isOpen: false,
    mounted: false,
    previousActiveElement: null,
    ...props,
    variant: props.variant || 'default',
    size: props.size || 'medium',
    showCloseButton: props.showCloseButton !== false,
    closeOnBackdrop: props.closeOnBackdrop !== false,
    closeOnEscape: props.closeOnEscape !== false,
    showBackdrop: props.showBackdrop !== false,
    lockBodyScroll: props.lockBodyScroll !== false,
    autoFocus: props.autoFocus !== false,
    restoreFocus: props.restoreFocus !== false,
  };

  // Elements
  let backdropElement = null;
  let containerElement = null;
  let dialogElement = null;
  let contentElement = null;
  let focusableElements = [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;

  // Create modal structure
  const render = () => {
    // Backdrop
    if (state.showBackdrop) {
      backdropElement = createElement('div', {
        className: 'modal__backdrop',
        attributes: {
          'aria-hidden': 'true',
        },
      });
    }

    // Header
    const headerElement =
      state.title || state.showCloseButton
        ? createElement('div', {
            className: 'modal__header',
            children: [
              state.title &&
                createElement('h2', {
                  className: 'modal__title',
                  textContent: state.title,
                  attributes: { id: 'modal-title' },
                }),
              state.showCloseButton &&
                createElement('button', {
                  className: 'modal__close',
                  attributes: {
                    type: 'button',
                    'aria-label': 'Close modal',
                  },
                  innerHTML: '&times;',
                }),
            ].filter(Boolean),
          })
        : null;

    // Content
    contentElement = createElement('div', {
      className: 'modal__content',
      attributes: { id: 'modal-content' },
    });

    // Handle different content types
    if (typeof state.content === 'string') {
      contentElement.innerHTML = state.content;
    } else if (state.content instanceof HTMLElement) {
      contentElement.appendChild(state.content);
    } else if (
      state.content &&
      typeof state.content.getElement === 'function'
    ) {
      contentElement.appendChild(state.content.getElement());
    }

    // Footer with actions
    const footerElement = state.actions?.length
      ? createElement('div', {
          className: 'modal__footer',
          children: [
            createElement('div', {
              className: 'modal__actions',
              children: state.actions.map((action) =>
                Button({
                  text: action.text,
                  variant: action.variant || 'secondary',
                  onClick: () => handleAction(action.action || action.text),
                }).getElement()
              ),
            }),
          ],
        })
      : null;

    // Dialog
    dialogElement = createElement('div', {
      className: `modal__dialog modal__dialog--${state.size}`,
      attributes: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': state.title ? 'modal-title' : undefined,
        'aria-label':
          state.ariaLabel || (state.title ? undefined : 'Modal dialog'),
        'aria-describedby': state.ariaDescribedBy || 'modal-content',
        tabindex: '-1',
      },
      children: [headerElement, contentElement, footerElement].filter(Boolean),
    });

    // Apply variant class
    if (state.variant !== 'default') {
      dialogElement.classList.add(`modal--${state.variant}`);
    }

    // Container
    containerElement = createElement('div', {
      className: 'modal__container',
      children: [dialogElement],
    });

    // Add custom class
    if (state.className) {
      containerElement.classList.add(state.className);
    }

    // Add event listeners
    addEventListeners();
  };

  // Public API (define early for event handlers)
  const api = {};

  // Event handling
  const handleBackdropClick = (e) => {
    if (state.closeOnBackdrop && e.target === containerElement) {
      api.close();
    }
  };

  const handleEscapeKey = (e) => {
    if (state.closeOnEscape && e.key === 'Escape' && state.isOpen) {
      api.close();
    }
  };

  const handleCloseClick = () => {
    api.close();
  };

  const handleAction = (action) => {
    if (state.onAction) {
      state.onAction(action);
    }
  };

  const handleTabKey = (e) => {
    if (!state.isOpen || focusableElements.length === 0) return;

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    }
  };

  // Focus management
  const updateFocusableElements = () => {
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    focusableElements = Array.from(dialogElement.querySelectorAll(selector));
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
  };

  const addEventListeners = () => {
    if (containerElement) {
      containerElement.addEventListener('click', handleBackdropClick);
    }

    const closeButton = dialogElement?.querySelector('.modal__close');
    if (closeButton) {
      closeButton.addEventListener('click', handleCloseClick);
    }

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleTabKey);
  };

  const removeEventListeners = () => {
    if (containerElement) {
      containerElement.removeEventListener('click', handleBackdropClick);
    }

    document.removeEventListener('keydown', handleEscapeKey);
    document.removeEventListener('keydown', handleTabKey);
  };

  // Lifecycle methods
  const mount = () => {
    if (state.mounted) return;

    render();

    if (backdropElement) {
      document.body.appendChild(backdropElement);
    }
    document.body.appendChild(containerElement);

    state.mounted = true;
  };

  const unmount = () => {
    if (!state.mounted) return;

    removeEventListeners();

    if (backdropElement && backdropElement.parentNode) {
      backdropElement.parentNode.removeChild(backdropElement);
    }
    if (containerElement && containerElement.parentNode) {
      containerElement.parentNode.removeChild(containerElement);
    }

    state.mounted = false;
  };

  // Public API methods
  Object.assign(api, {
    /**
     * Opens the modal
     */
    open() {
      if (state.isOpen) return;

      // Store current focus
      if (state.restoreFocus) {
        state.previousActiveElement = document.activeElement;
      }

      // Mount if needed
      if (!state.mounted) {
        mount();
      }

      // Force reflow
      void containerElement.offsetHeight;

      // Add visible classes
      requestAnimationFrame(() => {
        if (backdropElement) {
          backdropElement.classList.add('modal__backdrop--visible');
        }
        containerElement.classList.add('modal__container--open');
        dialogElement.classList.add('modal__dialog--visible');

        // Lock body scroll
        if (state.lockBodyScroll) {
          document.body.classList.add('modal-open');
        }

        // Update focusable elements and focus
        updateFocusableElements();

        if (state.autoFocus) {
          if (firstFocusableElement) {
            firstFocusableElement.focus();
          } else {
            dialogElement.focus();
          }
        }

        state.isOpen = true;

        // Callback
        if (state.onOpen) {
          state.onOpen();
        }
      });
    },

    /**
     * Closes the modal
     */
    close() {
      if (!state.isOpen) return;

      // Remove visible classes
      if (backdropElement) {
        backdropElement.classList.remove('modal__backdrop--visible');
      }
      containerElement.classList.remove('modal__container--open');
      dialogElement.classList.remove('modal__dialog--visible');

      // Unlock body scroll
      if (state.lockBodyScroll) {
        document.body.classList.remove('modal-open');
      }

      // Wait for animation
      const handleTransitionEnd = () => {
        unmount();

        // Restore focus
        if (state.restoreFocus && state.previousActiveElement) {
          state.previousActiveElement.focus();
        }

        state.isOpen = false;

        // Callback
        if (state.onClose) {
          state.onClose();
        }
      };

      // Use transition end if animations are enabled
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReducedMotion) {
        handleTransitionEnd();
      } else {
        dialogElement.addEventListener('transitionend', handleTransitionEnd, {
          once: true,
        });
      }
    },

    /**
     * Checks if modal is open
     * @returns {boolean}
     */
    isOpen() {
      return state.isOpen;
    },

    /**
     * Updates modal props
     * @param {Object} newProps
     */
    update(newProps) {
      Object.assign(state, newProps);

      if (state.mounted) {
        // Update title
        const titleElement = dialogElement.querySelector('.modal__title');
        if (titleElement && state.title) {
          titleElement.textContent = state.title;
        }

        // Update content
        if (contentElement && state.content) {
          contentElement.innerHTML = '';
          if (typeof state.content === 'string') {
            contentElement.innerHTML = state.content;
          } else if (state.content instanceof HTMLElement) {
            contentElement.appendChild(state.content);
          } else if (
            state.content &&
            typeof state.content.getElement === 'function'
          ) {
            contentElement.appendChild(state.content.getElement());
          }
        }
      }
    },

    /**
     * Destroys the modal
     */
    destroy() {
      if (state.isOpen) {
        api.close();
      } else {
        unmount();
      }
    },

    /**
     * Gets the modal element
     * @returns {HTMLElement}
     */
    getElement() {
      return containerElement;
    },
  });

  return api;
};

export default createModal;
