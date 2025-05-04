// src/components/Header/Header.js
import './Header.css';
import { Component } from '../../utils/componentFactory.js';
import Navigation from '../Navigation/Navigation.js';
import Logo from '../Logo/Logo.js';
import Link from '../Link/Link.js';

export default class Header extends Component {
  constructor(props) {
    super();
    this.props = {
      siteName: '',
      navigation: { items: [] },
      logo: '',
      className: '',
      ...props,
    };
    this.element = this.createComponentElement();
  }

  createComponentElement() {
    const { siteName, navigation, logo, className = '' } = this.props;

    const header = this.createElement('header', {
      className: this.createClassNames('header', className),
    });

    const container = this.createElement('div', {
      className: 'header__container',
    });

    const brand = this.createElement('div', {
      className: 'header__brand',
    });

    // Fix: Logo component expects 'sources' prop
    if (logo) {
      const logoLink = new Link({
        children: new Logo({
          sources: [{ src: logo, theme: 'default' }],
          alt: siteName || 'Logo',
        }).getElement(),
        href: '/',
        block: true,
      });
      brand.appendChild(logoLink.getElement());
    } else if (siteName) {
      const siteNameLink = new Link({
        children: siteName,
        href: '/',
        block: true,
      });
      siteNameLink.getElement().className = 'header__site-name';
      brand.appendChild(siteNameLink.getElement());
    }

    container.appendChild(brand);

    if (navigation && navigation.items && navigation.items.length > 0) {
      const nav = new Navigation({
        items: navigation.items,
        responsive: true,
        theme: 'default',
      });
      container.appendChild(nav.getElement());
    }

    header.appendChild(container);
    return header;
  }

  getElement() {
    return this.element;
  }
}
