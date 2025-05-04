// src/components/MuchandyHero/MuchandyHero.js
import './MuchandyHero.css';
import { Component } from '../../utils/componentFactory.js';
import Tabs from '../Tabs/Tabs.js';
import PhoneRepairForm from '../PhoneRepairForm/PhoneRepairForm.js';
import UsedPhonePriceForm from '../UsedPhonePriceForm/UsedPhonePriceForm.js';

export default class MuchandyHero extends Component {
  constructor({
    backgroundImage = '',
    title = 'Reparatur in wenigen Klicks:',
    subtitle = 'Finden Sie Ihren Preis.',
    repairFormConfig = {},
    usedPhoneFormConfig = {},
    defaultTab = 'repair', // 'repair' or 'sell'
    className = '',
  }) {
    super();

    this.props = {
      backgroundImage,
      title,
      subtitle,
      repairFormConfig,
      usedPhoneFormConfig,
      defaultTab,
      className,
    };

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

    // Add subtitle
    if (this.props.subtitle) {
      const subtitle = this.createElement('h2', {
        className: 'muchandy-hero__subtitle',
        textContent: this.props.subtitle,
      });
      content.appendChild(subtitle);
    }

    // Create forms
    const repairForm = new PhoneRepairForm(this.props.repairFormConfig);
    const usedPhoneForm = new UsedPhonePriceForm(
      this.props.usedPhoneFormConfig
    );

    // Create tabs configuration
    const tabs = [
      {
        id: 'repair',
        label: 'Reparatur',
        content: repairForm,
      },
      {
        id: 'sell',
        label: 'Verkaufen',
        content: usedPhoneForm,
      },
    ];

    // Create tabs
    const tabsComponent = new Tabs({
      tabs,
      defaultActiveTab: this.props.defaultTab === 'sell' ? 1 : 0,
      className: 'muchandy-hero__tabs',
    });

    content.appendChild(tabsComponent.getElement());

    overlay.appendChild(content);
    container.appendChild(overlay);

    return container;
  }

  getElement() {
    return this.element;
  }
}
