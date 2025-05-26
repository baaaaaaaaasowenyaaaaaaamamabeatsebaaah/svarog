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
 * Migrates legacy props to standardized prop names
 * @param {Object} props - Component properties
 * @returns {Object} - Migrated properties
 * @private
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  // Migrate onCallButtonClick → onCallClick
  if ('onCallButtonClick' in props && !('onCallClick' in props)) {
    console.warn(
      '[CollapsibleHeaderContainer] onCallButtonClick is deprecated, use onCallClick instead'
    );
    migrated.onCallClick = props.onCallButtonClick;
    delete migrated.onCallButtonClick;
  }

  return migrated;
};

/**
 * Creates a CollapsibleHeaderContainer component
 * @param {Object} props - CollapsibleHeaderContainer properties
 * @returns {Object} CollapsibleHeaderContainer component API
 */
const createCollapsibleHeaderContainer = (props) => {
  // Standardize props
  const standardizedProps = migrateLegacyProps(props);

  // Validate props
  validateProps(
    standardizedProps,
    createCollapsibleHeaderContainer.requiredProps
  );

  // Component state - use a simple object rather than getters/setters
  const componentState = {
    // Pass through all props to the header
    ...standardizedProps,
    // Container specific state
    isCollapsed: false,
    isMobile: checkIsMobile(),
    scrollY: 0,
    // Container configuration
    collapseThreshold: standardizedProps.collapseThreshold || 100,
    showStickyIcons: standardizedProps.showStickyIcons !== false,
    stickyIconsPosition: standardizedProps.stickyIconsPosition || 'right',
    storyMode: standardizedProps._storyMode === true,
  };

  // Create header component
  const header = CollapsibleHeader({
    ...standardizedProps,
    isCollapsed: componentState.isCollapsed,
    isMobile: componentState.isMobile,
  });

  // Create sticky icons if enabled
  let stickyIcons = null;
  if (componentState.showStickyIcons) {
    stickyIcons = StickyContactIcons({
      location: standardizedProps.contactInfo.location,
      phone: standardizedProps.contactInfo.phone,
      email: standardizedProps.contactInfo.email,
      position: componentState.stickyIconsPosition,
      className: 'collapsible-header__sticky-icons',
    });
  }

  // Event handler references for cleanup
  let windowScrollHandler = null;
  let windowResizeHandler = null;

  /**
   * Check if viewport is mobile
   * @returns {boolean} True if viewport is mobile
   */
  function checkIsMobile() {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  /**
   * Handle scroll events
   */
  function handleScroll() {
    if (typeof window === 'undefined') return;

    const scrollY = window.scrollY;

    // Check if scroll position passed threshold
    const shouldCollapse = scrollY > componentState.collapseThreshold;

    // Only update if state changed
    if (shouldCollapse !== componentState.isCollapsed) {
      componentState.isCollapsed = shouldCollapse;

      // Update header
      header.update({
        isCollapsed: shouldCollapse,
      });

      // Update sticky icons
      updateStickyIconsVisibility();
    }

    componentState.scrollY = scrollY;
  }

  /**
   * Handle resize events
   */
  function handleResize() {
    const isMobile = checkIsMobile();

    // Only update if state changed
    if (isMobile !== componentState.isMobile) {
      componentState.isMobile = isMobile;

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
   */
  function updateStickyIconsVisibility() {
    if (!stickyIcons || !componentState.showStickyIcons) return;

    const iconElement = stickyIcons.getElement();
    const shouldShow = componentState.isCollapsed || componentState.isMobile;

    // First time showing the icons, add to DOM
    if (shouldShow && !iconElement.parentNode) {
      document.body.appendChild(iconElement);
    }

    // Update visibility
    iconElement.style.display = shouldShow ? 'flex' : 'none';

    // Update position based on mobile state
    if (componentState.isMobile) {
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
  if (!componentState.storyMode && typeof window !== 'undefined') {
    // Use debounced handlers for better performance
    windowScrollHandler = debounce(handleScroll, 10);
    windowResizeHandler = debounce(handleResize, 100);

    window.addEventListener('scroll', windowScrollHandler, { passive: true });
    window.addEventListener('resize', windowResizeHandler, { passive: true });
  }

  // Special story mode helpers - completely isolated for testing only
  const storyHelpers = {
    setCollapsed(isCollapsed) {
      componentState.isCollapsed = isCollapsed;
      header.update({ isCollapsed });
    },
    getIconElement() {
      return stickyIcons ? stickyIcons.getElement() : null;
    },
    getHeaderElement() {
      return header.getElement();
    },
    isMobile() {
      return componentState.isMobile;
    },
    isCollapsed() {
      return componentState.isCollapsed;
    },
  };

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
      // Standardize any new props
      const standardizedNewProps = migrateLegacyProps(newProps);

      // Update internal state
      Object.assign(componentState, standardizedNewProps);

      // Update header component
      header.update(standardizedNewProps);

      // Update sticky icons if needed
      if (
        componentState.showStickyIcons &&
        (standardizedNewProps.isCollapsed !== undefined ||
          standardizedNewProps.isMobile !== undefined)
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
      // Return a copy to prevent direct mutation
      return { ...componentState };
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

    /**
     * Special accessor for stories - completely isolated API
     * @public
     */
    _story: componentState.storyMode ? storyHelpers : null,
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
