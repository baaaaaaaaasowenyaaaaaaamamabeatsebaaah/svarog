// src/components/MuchandyHero/MuchandyHero.js
import './MuchandyHero.css';
import { Component } from '../../utils/componentFactory.js';

export default class MuchandyHero extends Component {
  constructor({
    backgroundImage = 'https://picsum.photos/1920/1080',
    title = 'Finden Sie Ihren Preis',
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

    // Add title
    if (this.props.title) {
      const title = this.createElement('h1', {
        className: 'muchandy-hero__title',
        textContent: this.props.title,
      });
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

    // Create tabs container
    const tabsContainer = this.createElement('div', {
      className: 'muchandy-hero__tabs muchandy-hero__tabs--bordered',
    });

    // Create tab buttons container with center alignment
    const tabList = this.createElement('div', {
      className: 'muchandy-hero__tabs-list',
    });
    tabList.style.justifyContent = 'center'; // Center align tabs

    // Create repair tab button
    const repairTab = this.createElement('button', {
      className: `muchandy-hero__tab-button ${this.props.defaultTab === 'repair' ? 'muchandy-hero__tab-button--active' : ''}`,
      textContent: 'Reparatur',
      events: {
        click: () => this.switchTab('repair'),
      },
    });

    // Create sell tab button
    const sellTab = this.createElement('button', {
      className: `muchandy-hero__tab-button ${this.props.defaultTab === 'sell' ? 'muchandy-hero__tab-button--active' : ''}`,
      textContent: 'Verkaufen',
      events: {
        click: () => this.switchTab('sell'),
      },
    });

    // Apply border styling to tabs
    repairTab.classList.add('muchandy-hero__tab-button--bordered');
    sellTab.classList.add('muchandy-hero__tab-button--bordered');

    // First tab gets left border and rounded corner
    repairTab.classList.add('muchandy-hero__tab-button--first');

    tabList.appendChild(repairTab);
    tabList.appendChild(sellTab);
    tabsContainer.appendChild(tabList);

    // Create tab panels
    const tabPanels = this.createElement('div', {
      className: 'muchandy-hero__tab-panels',
    });

    // Create repair panel
    const repairPanel = this.createElement('div', {
      className: `muchandy-hero__tab-panel ${this.props.defaultTab === 'repair' ? 'muchandy-hero__tab-panel--active' : ''} muchandy-hero__tab-panel--bordered`,
      attributes: {
        'data-tab': 'repair',
      },
    });
    repairPanel.appendChild(this.props.repairForm.getElement());

    // Create sell panel
    const sellPanel = this.createElement('div', {
      className: `muchandy-hero__tab-panel ${this.props.defaultTab === 'sell' ? 'muchandy-hero__tab-panel--active' : ''} muchandy-hero__tab-panel--bordered`,
      attributes: {
        'data-tab': 'sell',
      },
    });
    sellPanel.appendChild(this.props.buybackForm.getElement());

    // Store panels for tab switching
    this.repairPanel = repairPanel;
    this.sellPanel = sellPanel;
    this.repairTab = repairTab;
    this.sellTab = sellTab;

    tabPanels.appendChild(repairPanel);
    tabPanels.appendChild(sellPanel);
    tabsContainer.appendChild(tabPanels);

    formContainer.appendChild(tabsContainer);
    contentColumn.appendChild(formContainer);
    gridContainer.appendChild(contentColumn);
    container.appendChild(gridContainer);

    return container;
  }

  switchTab(tabId) {
    if (tabId === 'repair') {
      this.repairPanel.classList.add('muchandy-hero__tab-panel--active');
      this.sellPanel.classList.remove('muchandy-hero__tab-panel--active');
      this.repairTab.classList.add('muchandy-hero__tab-button--active');
      this.sellTab.classList.remove('muchandy-hero__tab-button--active');
    } else {
      this.repairPanel.classList.remove('muchandy-hero__tab-panel--active');
      this.sellPanel.classList.add('muchandy-hero__tab-panel--active');
      this.repairTab.classList.remove('muchandy-hero__tab-button--active');
      this.sellTab.classList.add('muchandy-hero__tab-button--active');
    }
  }

  getElement() {
    return this.element;
  }
}
