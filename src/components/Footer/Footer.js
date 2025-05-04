// src/components/Footer/Footer.js
import './Footer.css';
import { Component } from '../../utils/componentFactory.js';
import Link from '../Link/Link.js';

export default class Footer extends Component {
  constructor(props) {
    super();
    this.props = {
      siteName: '',
      footer: {
        copyright: '',
        links: [],
        social: [],
      },
      className: '',
      ...props,
    };
    this.element = this.createComponentElement();
  }

  createComponentElement() {
    const { siteName, footer = {}, className = '' } = this.props;
    const { copyright, links = [], social = [] } = footer;

    const footerElement = this.createElement('footer', {
      className: this.createClassNames('footer', className),
    });

    const container = this.createElement('div', {
      className: 'footer__container',
    });

    // Links section
    if (links.length > 0) {
      const linksSection = this.createElement('div', {
        className: 'footer__links',
      });

      links.forEach((link) => {
        const linkElement = new Link({
          children: link.label,
          href: link.url,
          underline: false,
        });
        linkElement.getElement().className = 'footer__link';
        linksSection.appendChild(linkElement.getElement());
      });

      container.appendChild(linksSection);
    }

    // Social links section
    if (social.length > 0) {
      const socialSection = this.createElement('div', {
        className: 'footer__social',
      });

      social.forEach((item) => {
        const socialLink = new Link({
          children: item.platform,
          href: item.url,
          target: '_blank',
          underline: false,
        });
        socialLink.getElement().className = 'footer__social-link';
        socialSection.appendChild(socialLink.getElement());
      });

      container.appendChild(socialSection);
    }

    // Copyright section
    const copyrightSection = this.createElement('div', {
      className: 'footer__copyright',
    });

    const copyrightText =
      copyright ||
      `© ${new Date().getFullYear()} ${siteName || ''}. All rights reserved.`;

    // Fix: Use createElement directly instead of Typography
    const copyrightElement = this.createElement('p', {
      className: 'footer__copyright-text',
      textContent: copyrightText,
    });

    copyrightSection.appendChild(copyrightElement);
    container.appendChild(copyrightSection);

    footerElement.appendChild(container);
    return footerElement;
  }
}
