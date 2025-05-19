// src/components/CollapsibleHeader/CollapsibleHeaderContainer.js
import { Container } from '../../utils/containerFactory.js';
import CollapsibleHeader from './CollapsibleHeader.js';
import { eventBus } from '../../utils/eventBus.js';

/**
 * Container for CollapsibleHeader component
 * @extends Container
 */
export default class CollapsibleHeaderContainer extends Container {
  /**
   * Create a CollapsibleHeader container
   * @param {Object} props - Container props
   * @param {string} props.siteName - Site name
   * @param {Object} props.navigation - Navigation configuration
   * @param {Object} props.contactInfo - Contact information
   * @param {string} props.logo - URL to logo image
   * @param {string} props.compactLogo - URL to compact logo for collapsed state
   * @param {string} props.callButtonText - Text for call button
   * @param {Function} props.onCallButtonClick - Callback for call button click
   * @param {string} props.className - Additional CSS classes
   * @param {boolean} props.isCollapsed - Whether header is collapsed
   * @param {boolean} props.isMobile - Whether in mobile view
   * @param {number} props.collapseThreshold - Scroll threshold for collapsing
   * @param {boolean} props.showStickyIcons - Whether to show sticky contact icons
   */
  constructor({
    siteName = '',
    navigation = { items: [] },
    contactInfo = {},
    logo = '',
    compactLogo = '',
    callButtonText = 'Call us',
    onCallButtonClick = null,
    className = '',
    isCollapsed = false,
    isMobile = false,
    collapseThreshold = 100,
    showStickyIcons = true,
  }) {
    // Initialize with CollapsibleHeader as presentational component
    super({
      PresentationalComponent: CollapsibleHeader,
      initialState: {
        isCollapsed,
        isMobile,
      },
      props: {
        siteName,
        navigation,
        contactInfo,
        logo,
        compactLogo,
        callButtonText,
        onCallButtonClick,
        className,
        showStickyIcons,
        collapseThreshold,
      },
    });
  }

  /**
   * Initialize container
   * @override
   */
  initialize() {
    super.initialize();

    // Set initial mobile state based on window width
    if (typeof window !== 'undefined') {
      this.setState({
        isMobile: window.innerWidth <= 768,
      });

      // Add scroll and resize event listeners
      this._bindEventHandlers();
    }

    // Emit initial header state to event bus
    eventBus.emit('header:initialized', {
      isCollapsed: this.getState('isCollapsed'),
      isMobile: this.getState('isMobile'),
    });
  }

  /**
   * Bind DOM event handlers
   * @private
   * @override
   */
  _bindEventHandlers() {
    // Scroll event
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.handleScroll);
    this._trackEventListener(window, 'scroll', this.handleScroll);

    // Resize event with debounce
    this.handleResize = this.debounce(this.handleResize.bind(this), 150);
    window.addEventListener('resize', this.handleResize);
    this._trackEventListener(window, 'resize', this.handleResize);

    // Initial check
    this.handleScroll();
    this.handleResize();
  }

  /**
   * Handle scroll events
   * @private
   */
  handleScroll() {
    const { collapseThreshold } = this.props;
    const shouldCollapse = window.scrollY > collapseThreshold;

    if (shouldCollapse !== this.getState('isCollapsed')) {
      this.setState({ isCollapsed: shouldCollapse });

      // Emit header state change
      eventBus.emit('header:collapsed', shouldCollapse);
    }
  }

  /**
   * Handle resize events
   * @private
   */
  handleResize() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile !== this.getState('isMobile')) {
      this.setState({ isMobile });

      // Emit header state change
      eventBus.emit('header:responsive', isMobile);
    }
  }

  /**
   * Debounce function to limit event handling
   * @private
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
        timeoutId = null;
      }, delay);
    };
  }

  /**
   * Manually set header collapsed state
   * @public
   * @param {boolean} isCollapsed - Whether header should be collapsed
   */
  setCollapsed(isCollapsed) {
    this.setState({ isCollapsed });
  }

  /**
   * Get current header collapsed state
   * @public
   * @returns {boolean} Whether header is collapsed
   */
  isCollapsed() {
    return this.getState('isCollapsed');
  }

  /**
   * Get current header mobile state
   * @public
   * @returns {boolean} Whether header is in mobile view
   */
  isMobile() {
    return this.getState('isMobile');
  }

  /**
   * Clean up resources
   * @override
   */
  destroy() {
    // Remove window event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleResize);
    }

    super.destroy();
  }
}
