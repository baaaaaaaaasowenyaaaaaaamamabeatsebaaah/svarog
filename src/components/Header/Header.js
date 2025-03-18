// src/components/Header/Header.js
import './Header.css';
import { Component } from '../../utils/componentFactory.js';
import Logo from '../Logo/Logo.js';
import Navigation from '../Navigation/Navigation.js';

/**
 * Header component for site header
 * @extends Component
 */
export default class Header extends Component {
  /**
   * Creates a new Header instance
   *
   * @param {Object} props - Header properties
   * @param {string} [props.logo] - Logo source path
   * @param {string} [props.title] - Header title
   * @param {Array} [props.navItems=[]] - Navigation items
   * @param {boolean} [props.sticky=false] - Whether header should be sticky
   * @param {boolean} [props.transparent=false] - Whether header should have transparent background
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({
    logo,
    title,
    navItems = [],
    sticky = false,
    transparent = false,
    className = '',
  }) {
    super();

    this.props = {
      logo,
      title,
      navItems,
      sticky,
      transparent,
      className,
    };

    this.element = this.createHeaderElement();
  }

  /**
   * Creates the header element
   * @private
   * @returns {HTMLElement} The header element
   */
  createHeaderElement() {
    // Build class names
    const classNames = this.createClassNames(
      'header',
      {
        'header--sticky': this.props.sticky,
        'header--transparent': this.props.transparent,
      },
      this.props.className
    );

    // Create the main header element
    const header = this.createElement('header', {
      className: classNames,
    });

    // Create the container for content
    const container = this.createElement('div', {
      className: 'header__container',
    });

    // Create branding section (logo + title)
    const branding = this.createBranding();
    container.appendChild(branding);

    // Create navigation if nav items are provided
    if (this.props.navItems.length > 0) {
      const nav = new Navigation({
        items: this.props.navItems,
        responsive: true,
      });
      container.appendChild(nav.getElement());
    }

    header.appendChild(container);
    return header;
  }

  /**
   * Creates the branding section with logo and title
   * @private
   * @returns {HTMLElement} The branding element
   */
  createBranding() {
    const branding = this.createElement('div', {
      className: 'header__branding',
    });

    // Add logo if provided
    if (this.props.logo) {
      const logo = new Logo({
        sources: this.props.logo,
        alt: this.props.title || 'Site Logo',
      });
      branding.appendChild(logo.getElement());
    }

    // Add title if provided
    if (this.props.title) {
      const title = this.createElement('h1', {
        className: 'header__title',
        textContent: this.props.title,
      });
      branding.appendChild(title);
    }

    return branding;
  }

  /**
   * Gets the header element
   * @returns {HTMLElement} The header element
   */
  getElement() {
    return this.element;
  }
}
