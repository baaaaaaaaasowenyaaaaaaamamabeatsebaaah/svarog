// src/components/Tabs/Tabs.js
import './Tabs.css';
import { Component } from '../../utils/componentFactory.js';

export default class Tabs extends Component {
  constructor({
    tabs = [], // Array of { id, label, content }
    defaultActiveTab = 0,
    onTabChange,
    className = '',
    variant = 'default',
    align = 'left', // Add align prop with default value of 'left'
  }) {
    super();

    // Fix the validation to explicitly check if tabs is missing or empty
    if (!tabs || tabs.length === 0) {
      throw new Error('Tabs: tabs is required');
    }

    // Validate variant
    const validVariants = ['default', 'simple', 'border'];
    if (!validVariants.includes(variant)) {
      throw new Error(
        `Tabs: Invalid variant "${variant}". Must be one of: ${validVariants.join(', ')}`
      );
    }

    // Validate alignment
    const validAlignments = ['left', 'center', 'right'];
    if (!validAlignments.includes(align)) {
      throw new Error(
        `Tabs: Invalid alignment "${align}". Must be one of: ${validAlignments.join(', ')}`
      );
    }

    this.props = {
      tabs,
      defaultActiveTab,
      onTabChange,
      className,
      variant,
      align,
    };

    this.state = {
      activeTab: defaultActiveTab,
    };

    this.element = this.createTabs();
  }

  createTabs() {
    const { variant, align } = this.props;

    const container = this.createElement('div', {
      className: this.createClassNames(
        'tabs',
        variant !== 'default' && `tabs--${variant}`,
        align !== 'left' && `tabs--align-${align}`,
        this.props.className
      ),
    });

    // Create tab buttons
    this.tabList = this.createElement('div', {
      className: 'tabs__list',
      attributes: { role: 'tablist' },
    });

    // Create tab panels container
    this.tabPanels = this.createElement('div', {
      className: 'tabs__panels',
    });

    // Add tab buttons and panels
    this.props.tabs.forEach((tab, index) => {
      const isActive = index === this.state.activeTab;
      const isFirst = index === 0;

      // Tab button
      const button = this.createElement('button', {
        className: this.createClassNames(
          'tabs__button',
          isActive && 'tabs__button--active',
          variant === 'border' && isFirst && 'tabs__button--first',
          variant === 'border' && 'tabs__button--bordered'
        ),
        attributes: {
          role: 'tab',
          'aria-selected': isActive ? 'true' : 'false',
          'aria-controls': `panel-${tab.id}`,
          id: `tab-${tab.id}`,
        },
        textContent: tab.label,
        events: {
          click: () => this.switchTab(index),
        },
      });

      this.tabList.appendChild(button);

      // Tab panel
      const panel = this.createElement('div', {
        className: this.createClassNames(
          'tabs__panel',
          isActive && 'tabs__panel--active',
          variant === 'border' && 'tabs__panel--bordered'
        ),
        attributes: {
          role: 'tabpanel',
          'aria-labelledby': `tab-${tab.id}`,
          id: `panel-${tab.id}`,
        },
      });

      // Set hidden attribute only for inactive panels
      if (!isActive) {
        panel.hidden = true;
      }

      // Add content to panel
      if (tab.content instanceof HTMLElement) {
        panel.appendChild(tab.content);
      } else if (typeof tab.content === 'function') {
        const contentElement = tab.content();
        if (contentElement instanceof HTMLElement) {
          panel.appendChild(contentElement);
        } else if (contentElement?.getElement) {
          panel.appendChild(contentElement.getElement());
        }
      } else if (tab.content?.getElement) {
        panel.appendChild(tab.content.getElement());
      } else if (typeof tab.content === 'string') {
        panel.innerHTML = tab.content;
      }

      this.tabPanels.appendChild(panel);
    });

    container.appendChild(this.tabList);
    container.appendChild(this.tabPanels);

    return container;
  }

  switchTab(index) {
    if (
      index === this.state.activeTab ||
      index < 0 ||
      index >= this.props.tabs.length
    ) {
      return;
    }

    const previousTab = this.state.activeTab;
    this.state.activeTab = index;

    // Update tab buttons
    const buttons = this.tabList.querySelectorAll('.tabs__button');
    buttons.forEach((button, i) => {
      const isActive = i === index;
      button.classList.toggle('tabs__button--active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update tab panels
    const panels = this.tabPanels.querySelectorAll('.tabs__panel');
    panels.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle('tabs__panel--active', isActive);
      panel.hidden = !isActive;
    });

    // Call callback if provided
    if (this.props.onTabChange) {
      this.props.onTabChange(index, previousTab);
    }
  }

  getElement() {
    return this.element;
  }
}
