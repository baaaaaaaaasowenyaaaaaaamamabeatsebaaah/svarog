// src/components/BackToTop/BackToTop.js (Simplified Version)
import {
  createElement,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { validateRequiredProps } from '../../utils/validation.js';
import { throttle } from '../../utils/performance.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { backToTopStyles } from './BackToTop.styles.js';

// Create style injector for BackToTop component
const injectBackToTopStyles = createStyleInjector('backtotop');

/**
 * Create icon element
 * @param {string|HTMLElement} icon - Icon content
 * @returns {HTMLElement} Icon element
 */
const createIcon = (icon = '↑') => {
  if (typeof icon === 'string') {
    return createElement('span', {
      classes: ['back-to-top__icon'],
      text: icon,
    });
  } else if (icon instanceof HTMLElement) {
    icon.classList.add('back-to-top__icon');
    return icon;
  }
  return createElement('span', {
    classes: ['back-to-top__icon'],
    text: '↑',
  });
};

/**
 * Update component position
 * @param {HTMLElement} element - Button element
 * @param {Object} position - Position object
 */
const updatePosition = (element, position) => {
  if (!element || !position) {
    return;
  }

  ['top', 'right', 'bottom', 'left'].forEach((prop) => {
    element.style[prop] = '';
  });

  Object.entries(position).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      element.style[key] = typeof value === 'number' ? `${value}px` : value;
    }
  });
};

/**
 * Get scroll position from scroll target
 * @param {HTMLElement|Window} scrollTarget - Scroll target
 * @returns {number} Current scroll position
 */
const getScrollPosition = (scrollTarget) => {
  if (!scrollTarget) {
    return 0;
  }

  if (scrollTarget === window) {
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  return scrollTarget.scrollTop || 0;
};

/**
 * Smooth scroll to top functionality
 * @param {HTMLElement|Window} scrollTarget - Scroll target
 * @param {number} scrollDuration - Animation duration
 * @param {Function} onComplete - Completion callback
 */
const smoothScrollToTop = (scrollTarget, scrollDuration, onComplete) => {
  const startPosition = getScrollPosition(scrollTarget);
  if (startPosition <= 0) {
    onComplete?.();
    return;
  }

  const startTime = performance.now();
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / scrollDuration, 1);
    const easeProgress = easeOutCubic(progress);
    const scrollPosition = startPosition * (1 - easeProgress);

    if (scrollTarget === window) {
      window.scrollTo(0, scrollPosition);
    } else {
      scrollTarget.scrollTop = scrollPosition;
    }

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else {
      onComplete?.();
    }
  };

  requestAnimationFrame(animateScroll);
};

/**
 * Creates BackToTop DOM structure
 * @param {Object} state - BackToTop state
 * @returns {HTMLElement} BackToTop element
 */
const renderBackToTop = (state) => {
  injectBackToTopStyles(backToTopStyles);

  const iconElement = createIcon(state.icon);

  const classes = [
    'back-to-top',
    state.disabled ? 'back-to-top--disabled' : '',
    state.className,
  ].filter(Boolean);

  const element = createElement('button', {
    classes,
    attributes: {
      type: 'button',
      'aria-label': state.ariaLabel,
      'aria-hidden': 'true',
      tabindex: state.disabled ? '-1' : '0',
    },
    children: [iconElement],
  });

  updatePosition(element, state.position);
  return element;
};

/**
 * Create a BackToTop component
 * @param {Object} props - BackToTop properties
 * @returns {Object} BackToTop component
 */
const createBackToTop = (props = {}) => {
  validateRequiredProps(
    props,
    {
      showAfter: { type: 'number' },
      scrollDuration: { type: 'number' },
      scrollTarget: {
        validator: (value) => {
          return (
            !value || value === window || (value && typeof value === 'object')
          );
        },
      },
      icon: {
        validator: (value) => {
          return (
            !value ||
            typeof value === 'string' ||
            (value && typeof value === 'object' && 'classList' in value)
          );
        },
      },
      ariaLabel: { type: 'string' },
      position: { type: 'object' },
      onClick: { type: 'function' },
      onShow: { type: 'function' },
      onHide: { type: 'function' },
      className: { type: 'string' },
      disabled: { type: 'boolean' },
    },
    'BackToTop'
  );

  // Initial state
  const state = {
    showAfter: props.showAfter || 300,
    scrollDuration: props.scrollDuration || 500,
    scrollTarget: props.scrollTarget || window,
    icon: props.icon || '↑',
    ariaLabel: props.ariaLabel || 'Back to top',
    position: props.position || { bottom: '2rem', right: '2rem' },
    onClick: props.onClick || null,
    onShow: props.onShow || null,
    onHide: props.onHide || null,
    className: props.className || '',
    disabled: props.disabled || false,
    isVisible: false,
    isScrolling: false,
  };

  const backToTopComponent = createBaseComponent(renderBackToTop)(state);

  let currentElement = null;
  let scrollListener = null;
  let destroyed = false;

  // Check visibility based on scroll position
  const checkVisibility = () => {
    if (destroyed || !state.scrollTarget || state.disabled) {
      return;
    }

    const scrollPosition = getScrollPosition(state.scrollTarget);
    const shouldShow = scrollPosition > state.showAfter;

    if (shouldShow !== state.isVisible) {
      state.isVisible = shouldShow;

      if (currentElement) {
        currentElement.classList.toggle('back-to-top--visible', shouldShow);
        currentElement.setAttribute('aria-hidden', (!shouldShow).toString());
      }

      if (shouldShow && state.onShow) {
        state.onShow();
      } else if (!shouldShow && state.onHide) {
        state.onHide();
      }
    }
  };

  // Handle interactions
  const handleInteraction = (event) => {
    if (destroyed || state.disabled || state.isScrolling) {
      return;
    }

    event.preventDefault();

    if (state.onClick) {
      state.onClick(event);
    }

    if (state.scrollTarget) {
      state.isScrolling = true;
      smoothScrollToTop(state.scrollTarget, state.scrollDuration, () => {
        state.isScrolling = false;
      });
    }
  };

  // Override getElement to set up event listeners
  const originalGetElement = backToTopComponent.getElement;
  backToTopComponent.getElement = function () {
    if (destroyed) {
      return null;
    }

    if (!currentElement) {
      currentElement = originalGetElement.call(this);

      // Attach event handlers
      currentElement.addEventListener('click', handleInteraction);
      currentElement.addEventListener('keydown', (event) => {
        if (destroyed || state.disabled) {
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          handleInteraction(event);
        }
      });

      // Setup scroll listener
      if (state.scrollTarget) {
        scrollListener = throttle(checkVisibility, 16);
        state.scrollTarget.addEventListener('scroll', scrollListener, {
          passive: true,
        });
      }

      // Initial check
      setTimeout(checkVisibility, 0);
    }

    return currentElement;
  };

  // Public methods
  backToTopComponent.show = function () {
    if (destroyed) {
      return this;
    }
    state.isVisible = true;
    if (currentElement) {
      currentElement.classList.add('back-to-top--visible');
      currentElement.setAttribute('aria-hidden', 'false');
    }
    if (state.onShow) {
      state.onShow();
    }
    return this;
  };

  backToTopComponent.hide = function () {
    if (destroyed) {
      return this;
    }
    state.isVisible = false;
    if (currentElement) {
      currentElement.classList.remove('back-to-top--visible');
      currentElement.setAttribute('aria-hidden', 'true');
    }
    if (state.onHide) {
      state.onHide();
    }
    return this;
  };

  backToTopComponent.scrollToTop = function () {
    if (destroyed || !state.scrollTarget || state.isScrolling) {
      return this;
    }
    state.isScrolling = true;
    smoothScrollToTop(state.scrollTarget, state.scrollDuration, () => {
      if (!destroyed) {
        state.isScrolling = false;
      }
    });
    return this;
  };

  // Override update
  const originalUpdate = backToTopComponent.update;
  backToTopComponent.update = function (newProps) {
    if (destroyed) {
      console.warn('Attempted to update destroyed BackToTop component');
      return this;
    }

    Object.assign(state, newProps);

    if (currentElement) {
      currentElement.className = [
        'back-to-top',
        state.disabled ? 'back-to-top--disabled' : '',
        state.className || '',
      ]
        .filter(Boolean)
        .join(' ');

      currentElement.setAttribute('aria-label', state.ariaLabel);
      currentElement.setAttribute('tabindex', state.disabled ? '-1' : '0');

      if (newProps.icon !== undefined) {
        const newIconElement = createIcon(state.icon);
        const oldIcon = currentElement.querySelector('.back-to-top__icon');
        if (oldIcon) {
          currentElement.replaceChild(newIconElement, oldIcon);
        }
      }

      if (newProps.position) {
        updatePosition(currentElement, state.position);
      }
    }

    return originalUpdate.call(this, newProps);
  };

  // Override destroy
  const originalDestroy = backToTopComponent.destroy;
  backToTopComponent.destroy = function () {
    if (destroyed) {
      return this;
    }
    destroyed = true;

    if (scrollListener && state.scrollTarget) {
      state.scrollTarget.removeEventListener('scroll', scrollListener);
      scrollListener = null;
    }

    if (currentElement && currentElement.parentNode) {
      currentElement.parentNode.removeChild(currentElement);
    }
    currentElement = null;

    return originalDestroy.call(this);
  };

  return backToTopComponent;
};

// Create the component with theme awareness
const BackToTopComponent = withThemeAwareness(
  createComponent('BackToTop', createBackToTop)
);

export default BackToTopComponent;
