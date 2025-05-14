// src/components/CollapsibleHeader/CollapsibleHeaderContainer.js
import { Component } from '../../utils/componentFactory.js';
import CollapsibleHeader from './CollapsibleHeader.js';
import StickyContactIcons from '../StickyContactIcons/StickyContactIcons.js';

/**
 * Container component that manages state for the CollapsibleHeader
 * Follows the container/presentational pattern from documentation
 * @class CollapsibleHeaderContainer
 * @extends Component
 */
export default class CollapsibleHeaderContainer extends Component {
  /**
   * Create a new CollapsibleHeaderContainer
   * @param {Object} props - All props for the CollapsibleHeader plus container settings
   * @param {number} [props.collapseThreshold=100] - Scroll threshold to collapse the header
   * @param {boolean} [props.showStickyIcons=true] - Whether to show sticky icons when collapsed
   * @param {string} [props.stickyIconsPosition='right'] - Position of sticky icons
   */
  constructor(props) {
    super();

    // Container properties
    this.collapseThreshold = props.collapseThreshold || 100;
    this.showStickyIcons = props.showStickyIcons !== false;
    this.stickyIconsPosition = props.stickyIconsPosition || 'right';

    // Special flag for story mode
    this.storyMode = props._storyMode === true;

    // Component state
    this.state = {
      isCollapsed: false,
      isMobile: this.checkIsMobile(),
      scrollY: 0,
    };

    // Create child components
    this.header = new CollapsibleHeader({
      ...props,
      isCollapsed: this.state.isCollapsed,
      isMobile: this.state.isMobile,
    });

    // Create sticky icons if enabled
    if (this.showStickyIcons) {
      this.stickyIcons = new StickyContactIcons({
        location: props.contactInfo.location,
        phone: props.contactInfo.phone,
        email: props.contactInfo.email,
        position: this.stickyIconsPosition,
        className: 'collapsible-header__sticky-icons',
      });
    }

    // Bind event handlers to maintain proper this context
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);

    // Add event listeners only if not in story mode
    if (!this.storyMode) {
      this.addEventListeners();
    }
  }

  /**
   * Check if viewport is mobile
   * @returns {boolean} True if viewport is mobile
   * @private
   */
  checkIsMobile() {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  /**
   * Add event listeners for scroll and resize
   * @private
   */
  addEventListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('resize', this.handleResize);
    }
  }

  /**
   * Handle scroll events
   * @private
   */
  handleScroll() {
    const scrollY = window.scrollY;

    // Check if scroll position passed threshold
    const shouldCollapse = scrollY > this.collapseThreshold;

    // Only update if state changed
    if (shouldCollapse !== this.state.isCollapsed) {
      this.state.isCollapsed = shouldCollapse;

      // Update header
      this.header.update({
        isCollapsed: shouldCollapse,
      });

      // Update sticky icons
      this.updateStickyIconsVisibility();
    }

    this.state.scrollY = scrollY;
  }

  /**
   * Handle resize events
   * @private
   */
  handleResize() {
    const isMobile = this.checkIsMobile();

    // Only update if state changed
    if (isMobile !== this.state.isMobile) {
      this.state.isMobile = isMobile;

      // Update header
      this.header.update({
        isMobile: isMobile,
      });

      // Update sticky icons
      this.updateStickyIconsVisibility();
    }
  }

  /**
   * Update sticky icons visibility based on state
   * @private
   */
  updateStickyIconsVisibility() {
    if (!this.stickyIcons || !this.showStickyIcons) return;

    const iconElement = this.stickyIcons.getElement();
    const shouldShow = this.state.isCollapsed || this.state.isMobile;

    // First time showing the icons, add to DOM
    if (shouldShow && !iconElement.parentNode) {
      document.body.appendChild(iconElement);
    }

    // Update visibility
    iconElement.style.display = shouldShow ? 'flex' : 'none';

    // Update position based on mobile state
    if (this.state.isMobile) {
      iconElement.style.position = 'fixed';
      iconElement.style.bottom = '16px';
      iconElement.style.right = '16px';
      iconElement.style.top = 'auto';
      iconElement.style.flexDirection = 'row';
    } else {
      iconElement.style.position = 'fixed';
      const headerHeight = this.header.getElement().offsetHeight || 160;
      iconElement.style.top = `${headerHeight + 40}px`;
      iconElement.style.right = '16px';
      iconElement.style.bottom = 'auto';
      iconElement.style.flexDirection = 'column';
    }
  }

  /**
   * Clean up event listeners and DOM elements when component is destroyed
   * @public
   */
  destroy() {
    // Remove event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleResize);
    }

    // Remove sticky icons from DOM
    if (this.stickyIcons) {
      const iconElement = this.stickyIcons.getElement();
      if (iconElement.parentNode) {
        iconElement.parentNode.removeChild(iconElement);
      }
    }
  }

  /**
   * Get the header element
   * @returns {HTMLElement} The header element
   * @public
   */
  getElement() {
    return this.header.getElement();
  }
}
