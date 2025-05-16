// src/components/MuchandyHero/MuchandyHero.js
import './MuchandyHero.css';
import { Component } from '../../utils/componentFactory.js';
import Tabs from '../Tabs/Tabs.js';

export default class MuchandyHero extends Component {
  constructor({
    backgroundImage,
    title = 'Finden Sie<br>Ihren Preis',
    subtitle = 'Jetzt Preis berechnen.',
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

    // Validate required props
    if (!this.props.repairForm) {
      throw new Error('repairForm is required');
    }

    if (!this.props.buybackForm) {
      throw new Error('buybackForm is required');
    }

    this.element = this.createMuchandyHero();
  }

  createMuchandyHero() {
    // Create main container with background image
    const container = this.createElement('div', {
      className: this.createClassNames('muchandy-hero', this.props.className),
    });

    container.style.backgroundImage = `url(${this.props.backgroundImage})`;
    container.style.paddingLeft = '64px';
    container.style.paddingRight = '64px';

    // Create grid container
    const gridContainer = this.createElement('div', {
      className: 'muchandy-hero__grid',
    });
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(12, 1fr)';
    gridContainer.style.gap = '12px';

    // Create content column (columns 2-5)
    const contentColumn = this.createElement('div', {
      className: 'muchandy-hero__content-column',
    });
    contentColumn.style.gridColumn = '2 / span 4'; // Start at column 2, span 4 columns

    // Add title with line break
    if (this.props.title) {
      const title = this.createElement('h1', {
        className: 'muchandy-hero__title',
      });
      // Use innerHTML to allow for line breaks with <br> tags
      title.innerHTML = this.props.title;
      contentColumn.appendChild(title);
    }

    // Add subtitle if provided
    if (this.props.subtitle) {
      const subtitle = this.createElement('h2', {
        className: 'muchandy-hero__subtitle',
        textContent: this.props.subtitle,
      });
      contentColumn.appendChild(subtitle);
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

    // Create tabs using the Tab component
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

    // Use the existing Tab component with border variant
    const tabsComponent = new Tabs({
      tabs,
      defaultActiveTab: this.props.defaultTab === 'sell' ? 1 : 0,
      className: 'muchandy-hero__tabs',
      variant: 'border',
      align: 'center',
    });

    formContainer.appendChild(tabsComponent.getElement());
    contentColumn.appendChild(formContainer);
    gridContainer.appendChild(contentColumn);
    container.appendChild(gridContainer);

    return container;
  }

  getElement() {
    return this.element;
  }
}
