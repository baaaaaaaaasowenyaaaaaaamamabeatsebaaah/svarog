// src/components/CollapsibleHeader/CollapsibleHeaderContainer.js
import {
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { debounce } from '../../utils/performance.js';
import { withThemeAwareness } from '../../utils/composition.js';
import CollapsibleHeader from './CollapsibleHeader.js';
import StickyContactIcons from '../StickyContactIcons/StickyContactIcons.js';

/**
 * Creates a CollapsibleHeaderContainer component
 * @param {Object} props - CollapsibleHeaderContainer properties
 * @returns {Object} CollapsibleHeaderContainer component API
 */
const createCollapsibleHeaderContainer = (props) => {
  // Validate props
  validateProps(props, createCollapsibleHeaderContainer.requiredProps);

  // Component state
  const state = {
    // Pass through all props to the header
    ...props,
    // Container specific state
    isCollapsed: false,
    isMobile: checkIsMobile(),
    scrollY: 0,
    // Container configuration
    collapseThreshold: props.collapseThreshold || 100,
    showStickyIcons: props.showStickyIcons !== false,
    stickyIconsPosition: props.stickyIconsPosition || 'right',
    storyMode: props._storyMode === true,
  };

  // Create header component
  let header = CollapsibleHeader({
    ...props,
    isCollapsed: state.isCollapsed,
    isMobile: state.isMobile,
  });

  // Create sticky icons if enabled
  let stickyIcons = null;
  if (state.showStickyIcons) {
    stickyIcons = StickyContactIcons({
      location: props.contactInfo.location,
      phone: props.contactInfo.phone,
      email: props.contactInfo.email,
      position: state.stickyIconsPosition,
      className: 'collapsible-header__sticky-icons',
    });
  }

  // Event handler references for cleanup
  let windowScrollHandler = null;
  let windowResizeHandler = null;

  /**
   * Check if viewport is mobile
   * @returns {boolean} True if viewport is mobile
   * @private
   */
  function checkIsMobile() {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  /**
   * Handle scroll events
   * @private
   */
  function handleScroll() {
    if (typeof window === 'undefined') return;

    const scrollY = window.scrollY;

    // Check if scroll position passed threshold
    const shouldCollapse = scrollY > state.collapseThreshold;

    // Only update if state changed
    if (shouldCollapse !== state.isCollapsed) {
      state.isCollapsed = shouldCollapse;

      // Update header
      header.update({
        isCollapsed: shouldCollapse,
      });

      // Update sticky icons
      updateStickyIconsVisibility();
    }

    state.scrollY = scrollY;
  }

  /**
   * Handle resize events
   * @private
   */
  function handleResize() {
    const isMobile = checkIsMobile();

    // Only update if state changed
    if (isMobile !== state.isMobile) {
      state.isMobile = isMobile;

      // Update header
      header.update({
        isMobile: isMobile,
      });

      // Update sticky icons
      updateStickyIconsVisibility();
    }
  }

  /**
   * Update sticky icons visibility based on state
   * @private
   */
  function updateStickyIconsVisibility() {
    if (!stickyIcons || !state.showStickyIcons) return;

    const iconElement = stickyIcons.getElement();
    const shouldShow = state.isCollapsed || state.isMobile;

    // First time showing the icons, add to DOM
    if (shouldShow && !iconElement.parentNode) {
      document.body.appendChild(iconElement);
    }

    // Update visibility
    iconElement.style.display = shouldShow ? 'flex' : 'none';

    // Update position based on mobile state
    if (state.isMobile) {
      iconElement.style.position = 'fixed';
      iconElement.style.bottom = '16px';
      iconElement.style.right = '16px';
      iconElement.style.top = 'auto';
      iconElement.style.flexDirection = 'row';
    } else {
      iconElement.style.position = 'fixed';
      const headerHeight = header.getElement().offsetHeight || 160;
      iconElement.style.top = `${headerHeight + 40}px`;
      iconElement.style.right = '16px';
      iconElement.style.bottom = 'auto';
      iconElement.style.flexDirection = 'column';
    }
  }

  // Set up event listeners if not in story mode
  if (!state.storyMode && typeof window !== 'undefined') {
    // Use debounced handlers for better performance
    windowScrollHandler = debounce(handleScroll, 10);
    windowResizeHandler = debounce(handleResize, 100);

    window.addEventListener('scroll', windowScrollHandler, { passive: true });
    window.addEventListener('resize', windowResizeHandler, { passive: true });
  }

  const containerComponent = {
    /**
     * Get the header element
     * @returns {HTMLElement} The header element
     */
    getElement() {
      return header.getElement();
    },

    /**
     * Update component with new props
     * @param {Object} newProps - New properties
     * @returns {Object} Component (for chaining)
     */
    update(newProps) {
      // Update internal state
      Object.assign(state, newProps);

      // Update header component
      header.update(newProps);

      // Update sticky icons if needed
      if (
        state.showStickyIcons &&
        (newProps.isCollapsed !== undefined || newProps.isMobile !== undefined)
      ) {
        updateStickyIconsVisibility();
      }

      return this;
    },

    /**
     * Clean up event listeners and resources
     */
    destroy() {
      // Remove event listeners
      if (typeof window !== 'undefined') {
        if (windowScrollHandler) {
          window.removeEventListener('scroll', windowScrollHandler, {
            passive: true,
          });
        }

        if (windowResizeHandler) {
          window.removeEventListener('resize', windowResizeHandler, {
            passive: true,
          });
        }
      }

      // Remove sticky icons from DOM
      if (stickyIcons) {
        const iconElement = stickyIcons.getElement();
        if (iconElement.parentNode) {
          iconElement.parentNode.removeChild(iconElement);
        }
      }

      // Destroy header component
      if (header) {
        header.destroy();
      }
    },

    /**
     * Force update of sticky icons visibility
     * @public
     */
    updateStickyIconsVisibility,

    /**
     * Get component state (for testing)
     * @returns {Object} Current state
     */
    getState() {
      return state;
    },

    /**
     * Access to scroll handler for testing
     * @public
     */
    handleScroll,

    /**
     * Access to resize handler for testing
     * @public
     */
    handleResize,
  };

  return containerComponent;
};

// Define required props for validation
createCollapsibleHeaderContainer.requiredProps = ['navigation', 'contactInfo'];

// Create the component with theme awareness
const CollapsibleHeaderContainer = withThemeAwareness(
  createComponent(
    'CollapsibleHeaderContainer',
    createCollapsibleHeaderContainer
  )
);

// Export as a factory function
export default CollapsibleHeaderContainer;
