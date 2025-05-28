// src/components/BackToTop/BackToTopContainer.js
import { createComponent } from '../../utils/componentFactory.js';
import { debounce } from '../../utils/performance.js';
import { withThemeAwareness } from '../../utils/composition.js';
import BackToTop from './BackToTop.js';

/**
 * Creates a BackToTopContainer component that manages scroll events and state
 * @param {Object} props - BackToTopContainer properties
 * @returns {Object} BackToTopContainer component API
 */
const createBackToTopContainer = (props = {}) => {
  // Component state
  const componentState = {
    // Pass through all props to the BackToTop component
    ...props,
    // Container specific state
    isVisible: false,
    isScrolling: false,
    scrollY: 0,
    // Configuration
    showAfter: props.showAfter || 300,
    scrollTarget:
      props.scrollTarget || (typeof window !== 'undefined' ? window : null),
    mountTarget:
      props.mountTarget ||
      (typeof document !== 'undefined' ? document.body : null),
    storyMode: props._storyMode === true,
  };

  // Create the BackToTop component
  const backToTop = BackToTop({
    ...props,
    // Override some props for container control
    scrollTarget: null, // Container will handle scroll detection
  });

  // Event handler references for cleanup
  let scrollHandler = null;
  let backToTopElement = null;

  /**
   * Get scroll position from scroll target
   * @returns {number} Current scroll position
   */
  function getScrollPosition() {
    if (!componentState.scrollTarget) return 0;

    if (componentState.scrollTarget === window) {
      return (
        window.pageYOffset ||
        window.scrollY ||
        document.documentElement.scrollTop ||
        0
      );
    }

    return componentState.scrollTarget.scrollTop || 0;
  }

  /**
   * Handle scroll events and update visibility
   */
  function handleScroll() {
    const scrollY = getScrollPosition();
    const shouldShow = scrollY > componentState.showAfter;

    // Only update if state changed
    if (shouldShow !== componentState.isVisible) {
      componentState.isVisible = shouldShow;

      if (backToTopElement) {
        backToTopElement.classList.toggle('back-to-top--visible', shouldShow);
        backToTopElement.setAttribute('aria-hidden', (!shouldShow).toString());

        // Call visibility callbacks
        if (shouldShow && props.onShow) {
          props.onShow();
        } else if (!shouldShow && props.onHide) {
          props.onHide();
        }
      }
    }

    componentState.scrollY = scrollY;
  }

  /**
   * Handle smooth scroll to top
   */
  function scrollToTop() {
    if (!componentState.scrollTarget || componentState.isScrolling) return;

    componentState.isScrolling = true;

    const startPosition = getScrollPosition();
    const startTime = performance.now();
    const duration = props.scrollDuration || 500;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);
      const scrollPosition = startPosition * (1 - easeProgress);

      if (componentState.scrollTarget === window) {
        window.scrollTo(0, scrollPosition);
      } else {
        componentState.scrollTarget.scrollTop = scrollPosition;
      }

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        componentState.isScrolling = false;
      }
    };

    requestAnimationFrame(animateScroll);
  }

  /**
   * Handle click events
   */
  function handleClick(event) {
    if (props.disabled || componentState.isScrolling) return;

    event.preventDefault();

    // Call custom click handler if provided
    if (props.onClick) {
      props.onClick(event);
    }

    // Scroll to top
    scrollToTop();
  }

  /**
   * Handle keyboard events
   */
  function handleKeyDown(event) {
    if (props.disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  }

  // Set up the component
  function initialize() {
    backToTopElement = backToTop.getElement();

    // Add event listeners to the button
    backToTopElement.addEventListener('click', handleClick);
    backToTopElement.addEventListener('keydown', handleKeyDown);

    // Mount the element
    if (componentState.mountTarget && !componentState.storyMode) {
      componentState.mountTarget.appendChild(backToTopElement);
    }

    // Set up scroll listener
    if (componentState.scrollTarget && !componentState.storyMode) {
      scrollHandler = debounce(handleScroll, 16); // 60fps
      componentState.scrollTarget.addEventListener('scroll', scrollHandler, {
        passive: true,
      });
    }

    // Initial visibility check
    if (!componentState.storyMode) {
      setTimeout(handleScroll, 0);
    }
  }

  // Initialize the component
  initialize();

  const containerComponent = {
    /**
     * Get the BackToTop element
     * @returns {HTMLElement} The BackToTop element
     */
    getElement() {
      return backToTopElement;
    },

    /**
     * Update component with new props
     * @param {Object} newProps - New properties
     * @returns {Object} Component (for chaining)
     */
    update(newProps) {
      // Update internal state
      Object.assign(componentState, newProps);

      // Update the BackToTop component
      backToTop.update(newProps);

      return this;
    },

    /**
     * Manually show the button
     * @returns {Object} Component (for chaining)
     */
    show() {
      componentState.isVisible = true;
      if (backToTopElement) {
        backToTopElement.classList.add('back-to-top--visible');
        backToTopElement.setAttribute('aria-hidden', 'false');
      }
      if (props.onShow) props.onShow();
      return this;
    },

    /**
     * Manually hide the button
     * @returns {Object} Component (for chaining)
     */
    hide() {
      componentState.isVisible = false;
      if (backToTopElement) {
        backToTopElement.classList.remove('back-to-top--visible');
        backToTopElement.setAttribute('aria-hidden', 'true');
      }
      if (props.onHide) props.onHide();
      return this;
    },

    /**
     * Manually trigger scroll to top
     * @returns {Object} Component (for chaining)
     */
    scrollToTop() {
      scrollToTop();
      return this;
    },

    /**
     * Clean up event listeners and resources
     */
    destroy() {
      // Remove scroll listener
      if (scrollHandler && componentState.scrollTarget) {
        componentState.scrollTarget.removeEventListener(
          'scroll',
          scrollHandler
        );
      }

      // Remove button event listeners
      if (backToTopElement) {
        backToTopElement.removeEventListener('click', handleClick);
        backToTopElement.removeEventListener('keydown', handleKeyDown);

        // Remove from DOM if mounted
        if (backToTopElement.parentNode) {
          backToTopElement.parentNode.removeChild(backToTopElement);
        }
      }

      // Destroy the BackToTop component
      if (backToTop) {
        backToTop.destroy();
      }
    },

    /**
     * Get component state (for testing)
     * @returns {Object} Current state
     */
    getState() {
      return { ...componentState };
    },

    /**
     * Access to scroll handler for testing
     * @public
     */
    handleScroll,

    /**
     * Check if button is currently visible
     * @returns {boolean} Whether button is visible
     */
    isVisible() {
      return componentState.isVisible;
    },

    /**
     * For story mode - special handling
     * @public
     */
    _story: componentState.storyMode
      ? {
          mount(container) {
            if (container && backToTopElement) {
              container.appendChild(backToTopElement);
            }
          },
          setupScrollListener(scrollTarget) {
            if (scrollTarget) {
              componentState.scrollTarget = scrollTarget;
              scrollHandler = debounce(handleScroll, 16);
              scrollTarget.addEventListener('scroll', scrollHandler, {
                passive: true,
              });
            }
          },
          triggerScroll() {
            handleScroll();
          },
        }
      : null,
  };

  return containerComponent;
};

// Define required props for validation
createBackToTopContainer.requiredProps = [];

// Create the component with theme awareness
const BackToTopContainer = withThemeAwareness(
  createComponent('BackToTopContainer', createBackToTopContainer)
);

// Export as a factory function
export default BackToTopContainer;
