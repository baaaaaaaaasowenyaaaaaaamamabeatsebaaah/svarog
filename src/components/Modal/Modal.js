// src/components/Modal/Modal.js
import { createElement } from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { modalStyles } from './Modal.styles.js';
import Button from '../Button/index.js';

// Create style injector for Modal component
const injectModalStyles = createStyleInjector('Modal');

/**
 * Creates modal DOM structure
 * @param {Object} state - Modal state
 * @returns {HTMLElement} Modal element
 */
const renderModal = (state) => {
  // Inject styles on render
  injectModalStyles(modalStyles);

  // Create backdrop
  const backdrop = state.showBackdrop
    ? createElement('div', {
        classes: ['modal__backdrop'],
        attributes: {
          'aria-hidden': 'true',
        },
      })
    : null;

  // Create title
  const titleElement = state.title
    ? createElement('h2', {
        classes: ['modal__title'],
        text: state.title,
        attributes: { id: 'modal-title' },
      })
    : null;

  // Create close button
  const closeButton = state.showCloseButton
    ? createElement('button', {
        classes: ['modal__close'],
        attributes: {
          type: 'button',
          'aria-label': 'Close modal',
        },
        innerHTML: '&times;',
        events: {
          click: (e) => {
            e.preventDefault();
            if (state.onClose) {
              state.onClose();
            }
          },
        },
      })
    : null;

  // Create header
  const header =
    titleElement || closeButton
      ? createElement('div', {
          classes: ['modal__header'],
          children: [titleElement, closeButton].filter(Boolean),
        })
      : null;

  // Create content
  const content = createElement('div', {
    classes: ['modal__content'],
    attributes: { id: 'modal-content' },
  });

  // Set content based on type
  if (typeof state.content === 'string') {
    content.innerHTML = state.content;
  } else if (state.content instanceof HTMLElement) {
    content.appendChild(state.content.cloneNode(true));
  } else if (state.content && typeof state.content.getElement === 'function') {
    content.appendChild(state.content.getElement());
  }

  // Create footer with actions
  const footer = state.actions?.length
    ? createElement('div', {
        classes: ['modal__footer'],
        children: [
          createElement('div', {
            classes: ['modal__actions'],
            children: state.actions.map((action) => {
              const button = Button({
                text: action.text,
                variant: action.variant || 'secondary',
                onClick: () => {
                  if (state.onAction) {
                    state.onAction(action.action || action.text);
                  }
                },
              });
              return button.getElement();
            }),
          }),
        ],
      })
    : null;

  // Create dialog
  const dialog = createElement('div', {
    classes: [
      'modal__dialog',
      `modal__dialog--${state.size}`,
      state.variant !== 'default' && `modal--${state.variant}`,
    ].filter(Boolean),
    attributes: {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': state.title ? 'modal-title' : null,
      'aria-label': state.ariaLabel || (!state.title ? 'Modal dialog' : null),
      'aria-describedby': state.ariaDescribedBy || 'modal-content',
      tabindex: '-1',
    },
    children: [header, content, footer].filter(Boolean),
  });

  // Create container
  const container = createElement('div', {
    classes: ['modal__container', state.className].filter(Boolean),
    children: [dialog],
    events: {
      click: (e) => {
        if (state.closeOnBackdrop && e.target === container) {
          if (state.onClose) {
            state.onClose();
          }
        }
      },
    },
  });

  // Store references for event handling
  container._backdrop = backdrop;
  container._dialog = dialog;
  container._content = content;
  container._titleElement = titleElement;

  return container;
};

/**
 * Create a Modal component
 * @param {Object} props - Modal properties
 * @returns {Object} Modal component
 */
const createModal = (props = {}) => {
  // Initial state
  const state = {
    isOpen: false,
    mounted: false,
    previousActiveElement: null,
    variant: props.variant || 'default',
    size: props.size || 'medium',
    showCloseButton: props.showCloseButton !== false,
    closeOnBackdrop: props.closeOnBackdrop !== false,
    closeOnEscape: props.closeOnEscape !== false,
    showBackdrop: props.showBackdrop !== false,
    lockBodyScroll: props.lockBodyScroll !== false,
    autoFocus: props.autoFocus !== false,
    restoreFocus: props.restoreFocus !== false,
    ...props,
  };

  // Focus management
  let focusableElements = [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;

  // Event handlers
  const handleEscapeKey = (e) => {
    if (state.closeOnEscape && e.key === 'Escape' && state.isOpen) {
      modalComponent.close();
    }
  };

  const handleTabKey = (e) => {
    if (!state.isOpen || focusableElements.length === 0) return;

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement?.focus();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement?.focus();
        }
      }
    }
  };

  const updateFocusableElements = () => {
    const element = modalComponent.getElement();
    if (!element) return;

    const dialog = element._dialog;
    if (!dialog) return;

    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    focusableElements = Array.from(dialog.querySelectorAll(selector));

    // Prioritize content area elements over modal controls
    const contentElements = focusableElements.filter(
      (el) => element._content && element._content.contains(el)
    );
    const controlElements = focusableElements.filter(
      (el) => !element._content || !element._content.contains(el)
    );

    // Reorder: content elements first, then control elements
    focusableElements = [...contentElements, ...controlElements];

    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
  };

  // Set onClose handler that updates the component
  state.onClose = () => {
    modalComponent.close();
  };

  // Create base component
  const modalComponent = createBaseComponent(renderModal)(state);

  // Add public methods
  modalComponent.open = function () {
    if (state.isOpen) return this;

    // Store current focus
    if (state.restoreFocus) {
      state.previousActiveElement = document.activeElement;
    }

    // Mount to DOM if not already mounted
    if (!state.mounted) {
      const element = this.getElement();

      // Add backdrop to body if it exists
      if (element._backdrop) {
        document.body.appendChild(element._backdrop);
      }

      // Add container to body
      document.body.appendChild(element);

      // Add global event listeners
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('keydown', handleTabKey);

      state.mounted = true;
    }

    // Set state
    state.isOpen = true;

    // Lock body scroll
    if (state.lockBodyScroll) {
      document.body.classList.add('modal-open');
    }

    const element = this.getElement();

    // Add visible classes
    requestAnimationFrame(() => {
      if (element._backdrop) {
        element._backdrop.classList.add('modal__backdrop--visible');
      }
      element.classList.add('modal__container--open');
      element._dialog.classList.add('modal__dialog--visible');

      // Update focusable elements and focus
      updateFocusableElements();

      if (state.autoFocus && firstFocusableElement) {
        firstFocusableElement.focus();
      } else if (state.autoFocus) {
        element._dialog.focus();
      }

      // Callback
      if (props.onOpen) {
        props.onOpen();
      }
    });

    return this;
  };

  modalComponent.close = function () {
    if (!state.isOpen) return this;

    state.isOpen = false;

    const element = this.getElement();
    if (!element) return this;

    // Remove visible classes
    if (element._backdrop) {
      element._backdrop.classList.remove('modal__backdrop--visible');
    }
    element.classList.remove('modal__container--open');
    element._dialog.classList.remove('modal__dialog--visible');

    // Unlock body scroll
    if (state.lockBodyScroll) {
      document.body.classList.remove('modal-open');
    }

    const handleCloseComplete = () => {
      if (state.mounted) {
        // Remove from DOM
        if (element._backdrop?.parentNode) {
          element._backdrop.parentNode.removeChild(element._backdrop);
        }
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }

        // Remove global event listeners
        document.removeEventListener('keydown', handleEscapeKey);
        document.removeEventListener('keydown', handleTabKey);

        state.mounted = false;

        // Restore focus
        if (state.restoreFocus && state.previousActiveElement) {
          state.previousActiveElement.focus();
        }

        // Callback
        if (props.onClose) {
          props.onClose();
        }
      }
    };

    // Check for reduced motion preference
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Immediate close for reduced motion (tests use this)
      handleCloseComplete();
    } else {
      // Wait for animation to complete
      const handleTransitionEnd = (e) => {
        if (e.target === element._dialog) {
          element._dialog.removeEventListener(
            'transitionend',
            handleTransitionEnd
          );
          handleCloseComplete();
        }
      };

      element._dialog.addEventListener('transitionend', handleTransitionEnd);

      // Fallback timeout
      setTimeout(handleCloseComplete, 300);
    }

    return this;
  };

  modalComponent.isOpen = function () {
    return state.isOpen;
  };

  modalComponent.toggle = function () {
    return state.isOpen ? this.close() : this.open();
  };

  // Override update to handle special cases
  const originalUpdate = modalComponent.update;
  modalComponent.update = function (newProps) {
    // Update internal state
    Object.assign(state, newProps);

    if (state.mounted) {
      const element = this.getElement();

      // Update title
      if (element._titleElement && 'title' in newProps) {
        element._titleElement.textContent = state.title || '';
      }

      // Update content
      if ('content' in newProps && element._content) {
        element._content.innerHTML = '';
        if (typeof state.content === 'string') {
          element._content.innerHTML = state.content;
        } else if (state.content instanceof HTMLElement) {
          element._content.appendChild(state.content.cloneNode(true));
        } else if (
          state.content &&
          typeof state.content.getElement === 'function'
        ) {
          element._content.appendChild(state.content.getElement());
        }
      }
    }

    return originalUpdate.call(this, newProps);
  };

  // Override destroy to handle cleanup
  const originalDestroy = modalComponent.destroy;
  modalComponent.destroy = function () {
    if (state.isOpen) {
      state.isOpen = false;
      if (state.lockBodyScroll) {
        document.body.classList.remove('modal-open');
      }
    }

    if (state.mounted) {
      const element = this.getElement();

      // Remove from DOM
      if (element._backdrop?.parentNode) {
        element._backdrop.parentNode.removeChild(element._backdrop);
      }
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }

      // Remove global event listeners
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('keydown', handleTabKey);

      state.mounted = false;
    }

    return originalDestroy.call(this);
  };

  return modalComponent;
};

// Create the component with theme awareness
const ModalComponent = withThemeAwareness(createModal);

// Export as factory function
export default ModalComponent;
