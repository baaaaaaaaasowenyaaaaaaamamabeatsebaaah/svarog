// src/components/BackToTop/BackToTop.js
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

// Shared scroll listener to avoid multiple instances
let globalScrollListener = null;
let componentInstances = new Set();

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
  if (!element || !position) return;

  // Clear existing position styles first
  ['top', 'right', 'bottom', 'left'].forEach((prop) => {
    element.style[prop] = '';
  });

  // Apply new position styles
  Object.entries(position).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      element.style[key] = typeof value === 'number' ? `${value}px` : value;
    }
  });
};

/**
 * Get scroll position from various scroll targets
 * @param {HTMLElement|Window} scrollTarget - Scroll target
 * @returns {number} Current scroll position
 */
const getScrollPosition = (scrollTarget) => {
  if (!scrollTarget) return 0;

  if (scrollTarget === window) {
    return (
      window.pageYOffset ||
      window.scrollY ||
      document.documentElement.scrollTop ||
      0
    );
  }

  // Handle iframe or other window objects
  if (scrollTarget.window === scrollTarget) {
    return scrollTarget.pageYOffset || scrollTarget.scrollY || 0;
  }

  // Handle regular DOM elements
  if (scrollTarget.scrollTop !== undefined) {
    return scrollTarget.scrollTop;
  }

  return 0;
};

/**
 * Smooth scroll to top functionality
 * @param {HTMLElement|Window} scrollTarget - Scroll target
 * @param {number} scrollDuration - Animation duration
 * @param {Function} onComplete - Completion callback
 */
const smoothScrollToTop = (scrollTarget, scrollDuration, onComplete) => {
  const startPosition = getScrollPosition(scrollTarget);
  const startTime = performance.now();

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / scrollDuration, 1);
    const easeProgress = easeOutCubic(progress);
    const scrollPosition = startPosition * (1 - easeProgress);

    // Scroll to the calculated position
    if (scrollTarget === window) {
      window.scrollTo(0, scrollPosition);
    } else if (scrollTarget.window === scrollTarget) {
      scrollTarget.scrollTo(0, scrollPosition);
    } else {
      scrollTarget.scrollTop = scrollPosition;
    }

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else if (onComplete) {
      onComplete();
    }
  };

  requestAnimationFrame(animateScroll);
};

/**
 * Global scroll handler for all instances
 */
const handleGlobalScroll = () => {
  componentInstances.forEach((instance) => {
    if (instance.checkVisibility) {
      instance.checkVisibility();
    }
  });
};

/**
 * Creates BackToTop DOM structure
 * @param {Object} state - BackToTop state
 * @returns {HTMLElement} BackToTop element
 */
const renderBackToTop = (state) => {
  // Inject styles on render
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

  // Apply custom position
  updatePosition(element, state.position);

  return element;
};

/**
 * Create a BackToTop component
 * @param {Object} props - BackToTop properties
 * @returns {Object} BackToTop component
 */
const createBackToTop = (props = {}) => {
  // Validate props
  validateRequiredProps(
    props,
    {
      showAfter: { type: 'number' },
      scrollDuration: { type: 'number' },
      scrollTarget: {
        validator: (value) => {
          return (
            !value ||
            value === window ||
            (value && typeof value === 'object' && 'scrollTop' in value)
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
    scrollTarget:
      props.scrollTarget || (typeof window !== 'undefined' ? window : null),
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

  // Create base component
  const backToTopComponent = createBaseComponent(renderBackToTop)(state);

  // Instance-specific methods and handlers
  let currentElement = null;

  // Check visibility based on scroll position
  backToTopComponent.checkVisibility = function () {
    if (!state.scrollTarget || state.disabled) return;

    const scrollPosition = getScrollPosition(state.scrollTarget);
    const shouldShow = scrollPosition > state.showAfter;

    if (shouldShow !== state.isVisible) {
      state.isVisible = shouldShow;

      currentElement = this.getElement();
      if (currentElement) {
        currentElement.classList.toggle('back-to-top--visible', shouldShow);
        currentElement.setAttribute('aria-hidden', (!shouldShow).toString());
      }

      // Call visibility callbacks
      if (shouldShow && state.onShow) {
        state.onShow();
      } else if (!shouldShow && state.onHide) {
        state.onHide();
      }
    }
  };

  // Handle click and keyboard events
  const handleInteraction = (event) => {
    if (state.disabled || state.isScrolling) return;

    event.preventDefault();

    // Call custom click handler if provided
    if (state.onClick) {
      state.onClick(event);
    }

    // Scroll to top
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
    if (!currentElement) {
      currentElement = originalGetElement.call(this);

      // Attach click handler
      currentElement.addEventListener('click', handleInteraction);

      // Attach keyboard handler
      currentElement.addEventListener('keydown', (event) => {
        if (state.disabled) return;

        if (event.key === 'Enter' || event.key === ' ') {
          handleInteraction(event);
        }
      });

      currentElement._backToTopHandlersAdded = true;
    }

    return currentElement;
  };

  // Add public methods
  backToTopComponent.show = function () {
    state.isVisible = true;
    currentElement = this.getElement();
    if (currentElement) {
      currentElement.classList.add('back-to-top--visible');
      currentElement.setAttribute('aria-hidden', 'false');
    }
    if (state.onShow) state.onShow();
    return this;
  };

  backToTopComponent.hide = function () {
    state.isVisible = false;
    currentElement = this.getElement();
    if (currentElement) {
      currentElement.classList.remove('back-to-top--visible');
      currentElement.setAttribute('aria-hidden', 'true');
    }
    if (state.onHide) state.onHide();
    return this;
  };

  backToTopComponent.scrollToTop = function () {
    if (state.scrollTarget && !state.isScrolling) {
      state.isScrolling = true;
      smoothScrollToTop(state.scrollTarget, state.scrollDuration, () => {
        state.isScrolling = false;
      });
    }
    return this;
  };

  // Override update to handle special cases
  const originalUpdate = backToTopComponent.update;
  backToTopComponent.update = function (newProps) {
    // Prevent updates if component is destroyed
    if (this._destroyed) {
      console.warn('Attempted to update destroyed component');
      return this;
    }

    // Update internal state
    Object.assign(state, newProps);

    // Update element attributes if it exists
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

      // Update icon if changed
      if (newProps.icon !== undefined) {
        const newIconElement = createIcon(state.icon);
        const oldIcon = currentElement.querySelector('.back-to-top__icon');
        if (oldIcon) {
          currentElement.replaceChild(newIconElement, oldIcon);
        }
      }

      // Update position if changed
      if (newProps.position) {
        updatePosition(currentElement, state.position);
      }
    }

    return originalUpdate.call(this, newProps);
  };

  // Override destroy to clean up
  const originalDestroy = backToTopComponent.destroy;
  backToTopComponent.destroy = function () {
    // Mark as destroyed
    this._destroyed = true;

    // Remove from global instances
    componentInstances.delete(this);

    // Clean up global scroll listener if no instances left
    if (componentInstances.size === 0 && globalScrollListener) {
      if (state.scrollTarget) {
        state.scrollTarget.removeEventListener('scroll', globalScrollListener);
      }
      globalScrollListener = null;
    }

    // Remove element from DOM
    if (currentElement && currentElement.parentNode) {
      currentElement.parentNode.removeChild(currentElement);
    }

    return originalDestroy.call(this);
  };

  // Add to global instances and set up scroll listener
  componentInstances.add(backToTopComponent);

  if (state.scrollTarget && !globalScrollListener) {
    globalScrollListener = throttle(handleGlobalScroll, 16); // 60fps
    state.scrollTarget.addEventListener('scroll', globalScrollListener, {
      passive: true,
    });
  }

  // Initial visibility check
  if (typeof window !== 'undefined') {
    setTimeout(() => backToTopComponent.checkVisibility(), 0);
  }

  return backToTopComponent;
};

// Create the component with theme awareness
const BackToTopComponent = withThemeAwareness(
  createComponent('BackToTop', createBackToTop)
);

// Export as factory function
export default BackToTopComponent;
