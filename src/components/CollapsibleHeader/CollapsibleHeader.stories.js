// src/components/CollapsibleHeader/CollapsibleHeader.stories.js
import CollapsibleHeader from './CollapsibleHeader.js';
import StickyContactIcons from '../StickyContactIcons/StickyContactIcons.js';
import logoFarbe from '../../../.storybook/assets/svg/logo-farbe.svg';
import logoIconFarbe from '../../../.storybook/assets/svg/logo-icon-farbe.svg';
import { Component } from '../../utils/componentFactory.js';

export default {
  title: 'Components/Layout/CollapsibleHeader',
  component: CollapsibleHeader,
};

/**
 * Container component that manages state for the CollapsibleHeader
 */
class HeaderContainer extends Component {
  constructor(props) {
    super();

    this.state = {
      isCollapsed: false,
      isMobile: this.checkIsMobile(),
      scrollY: 0,
    };

    this.collapseThreshold = props.collapseThreshold || 100;
    this.header = null;
    this.stickyIcons = null;

    // Create wrapper for scrolling
    this.wrapper = document.createElement('div');
    this.wrapper.style.height = '500px';
    this.wrapper.style.overflow = 'auto';
    this.wrapper.style.position = 'relative';
    this.wrapper.style.border = '1px solid #ccc';
    this.wrapper.classList.add('story-wrapper');

    // Create content for scrolling
    this.content = document.createElement('div');
    this.content.style.height = '1200px';
    this.content.style.padding = '20px';
    this.content.style.paddingTop = '200px';
    this.content.innerHTML =
      '<h2>Scroll down to see header collapse</h2>' +
      '<p>This is using a container component to manage state</p>';

    // Bind methods
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);

    // Initialize components
    this.initialize(props);
  }

  /**
   * Initialize components with props
   */
  initialize(props) {
    // Create header component
    this.header = new CollapsibleHeader({
      ...props,
      isCollapsed: this.state.isCollapsed,
      isMobile: this.state.isMobile,
    });

    // Create sticky icons but don't add to DOM yet
    this.stickyIcons = new StickyContactIcons({
      location: props.contactInfo.location,
      phone: props.contactInfo.phone,
      email: props.contactInfo.email,
      position: props.stickyIconsPosition || 'right',
      className: 'collapsible-header__sticky-icons',
    });

    // Setup event listeners
    this.wrapper.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);

    // Build DOM
    this.wrapper.appendChild(this.header.getElement());
    this.wrapper.appendChild(this.content);

    // Initialize sticky icons
    this.updateStickyIconsVisibility();
  }

  /**
   * Check if the viewport is mobile
   */
  checkIsMobile() {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrollY = this.wrapper.scrollTop;

    // Check if we need to update state
    const shouldCollapse = scrollY > this.collapseThreshold;

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
   */
  handleResize() {
    const isMobile = this.checkIsMobile();

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
   */
  updateStickyIconsVisibility() {
    if (!this.stickyIcons) return;

    const iconElement = this.stickyIcons.getElement();
    const shouldShow = this.state.isCollapsed || this.state.isMobile;

    // First time showing the icons, add to DOM
    if (shouldShow && !iconElement.parentNode) {
      document.body.appendChild(iconElement);
    }

    // Update visibility
    iconElement.style.display = shouldShow ? 'flex' : 'none';

    // Update position
    if (this.state.isMobile) {
      iconElement.style.position = 'fixed';
      iconElement.style.bottom = '16px';
      iconElement.style.right = '16px';
      iconElement.style.top = 'auto';
      iconElement.style.flexDirection = 'row';
      iconElement.style.zIndex = '999';
    } else {
      iconElement.style.position = 'fixed';
      const headerHeight = this.header.getElement().offsetHeight || 120;
      iconElement.style.top = `${headerHeight + 16}px`;
      iconElement.style.right = '16px';
      iconElement.style.bottom = 'auto';
      iconElement.style.flexDirection = 'column';
      iconElement.style.zIndex = '999';
    }
  }

  /**
   * Clean up before component is destroyed
   */
  destroy() {
    this.wrapper.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);

    // Remove sticky icons
    const iconElement = this.stickyIcons.getElement();
    if (iconElement.parentNode) {
      iconElement.parentNode.removeChild(iconElement);
    }
  }

  getElement() {
    return this.wrapper;
  }
}

export const MuchandyHeader = () => {
  // Create a header container with custom logos
  const headerProps = {
    siteName: 'MUCHANDY',
    navigation: {
      items: [
        { id: 'repair', label: 'Reparatur', href: '/reparatur' },
        { id: 'purchase', label: 'Ankauf', href: '/ankauf' },
        { id: 'used', label: 'Gebrauchte', href: '/gebrauchte' },
        { id: 'services', label: 'Services', href: '/services' },
        { id: 'find-us', label: 'So Finden Sie Uns', href: '/kontakt' },
      ],
    },
    contactInfo: {
      location: 'Luisenstr. 1',
      phone: '0176/88778877',
      email: 'info@muchandy.de',
    },
    collapseThreshold: 50,
    callButtonText: 'Anrufen',
    logo: logoFarbe,
    compactLogo: logoIconFarbe,
    stickyIconsPosition: 'right',
  };

  const container = new HeaderContainer(headerProps);
  return container.getElement();
};

// Ensure all sticky contact icons are removed when the story is unmounted
export const parameters = {
  docs: {
    story: {
      inline: false,
    },
  },
  beforeDestroy: () => {
    // Remove any sticky contact icons in the document
    const stickyElements = document.querySelectorAll('.sticky-contact-icons');
    stickyElements.forEach((el) => {
      if (el.parentElement) {
        el.parentElement.removeChild(el);
      }
    });

    // Remove any custom styles we added
    const customStyles = document.querySelectorAll('style');
    customStyles.forEach((style) => {
      if (
        style.textContent.includes('story-wrapper') ||
        style.textContent.includes('data-logo-type')
      ) {
        style.parentNode.removeChild(style);
      }
    });
  },
};
