// src/components/MuchandyHero/MuchandyHero.js
import './MuchandyHero.css';
import { Component } from '../../utils/componentFactory.js';
import Tabs from '../Tabs/Tabs.js';

export default class MuchandyHero extends Component {
  constructor({
    backgroundImage = '',
    title = 'Reparatur in wenigen Klicks:',
    subtitle = 'Finden Sie Ihren Preis.',
    repairForm,
    buybackForm,
    defaultTab = 'repair',
    className = '',
  }) {
    super();

    this.props = {
      backgroundImage,
      title,
      subtitle,
      repairForm,
      buybackForm,
      defaultTab,
      className,
    };

    // Create default forms if not provided
    if (!this.props.repairForm) {
      throw new Error('repairForm is required');
    }

    if (!this.props.buybackForm) {
      throw new Error('buybackForm is required');
    }

    this.element = this.createMuchandyHero();
  }

  createMuchandyHero() {
    const container = this.createElement('div', {
      className: this.createClassNames('muchandy-hero', this.props.className),
      styles: this.props.backgroundImage
        ? {
            backgroundImage: `url(${this.props.backgroundImage})`,
          }
        : {},
    });

    // Create overlay for better text readability
    const overlay = this.createElement('div', {
      className: 'muchandy-hero__overlay',
    });

    // Create content container
    const content = this.createElement('div', {
      className: 'muchandy-hero__content',
    });

    // Add title
    if (this.props.title) {
      const title = this.createElement('h1', {
        className: 'muchandy-hero__title',
        textContent: this.props.title,
      });
      content.appendChild(title);
    }

    // Add subtitle if provided
    if (this.props.subtitle) {
      const subtitle = this.createElement('h2', {
        className: 'muchandy-hero__subtitle',
        textContent: this.props.subtitle,
      });
      content.appendChild(subtitle);
    }

    // Create form container
    const formContainer = this.createElement('div', {
      className: 'muchandy-hero__form-container',
    });

    // Wrap forms in divs to control their display
    const repairFormWrapper = this.createElement('div', {
      className: 'muchandy-hero__form-wrapper',
    });
    repairFormWrapper.appendChild(this.props.repairForm.getElement());

    const buybackFormWrapper = this.createElement('div', {
      className: 'muchandy-hero__form-wrapper',
    });
    buybackFormWrapper.appendChild(this.props.buybackForm.getElement());

    // Create tabs configuration
    const tabs = [
      {
        id: 'repair',
        label: 'Reparatur',
        content: repairFormWrapper,
      },
      {
        id: 'sell',
        label: 'Verkaufen',
        content: buybackFormWrapper,
      },
    ];

    // Create tabs
    const tabsComponent = new Tabs({
      tabs,
      defaultActiveTab: this.props.defaultTab === 'sell' ? 1 : 0,
      className: 'muchandy-hero__tabs',
    });

    formContainer.appendChild(tabsComponent.getElement());
    content.appendChild(formContainer);
    overlay.appendChild(content);
    container.appendChild(overlay);

    return container;
  }

  getElement() {
    return this.element;
  }
}
