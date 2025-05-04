// src/components/Tabs/Tabs.test.js
import { describe, it, expect, vi } from 'vitest';
import Tabs from './Tabs.js';

describe('Tabs', () => {
  const mockTabs = [
    {
      id: 'tab1',
      label: 'Tab 1',
      content: 'Content 1',
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: 'Content 2',
    },
    {
      id: 'tab3',
      label: 'Tab 3',
      content: 'Content 3',
    },
  ];

  it('should create tabs with required props', () => {
    const tabs = new Tabs({ tabs: mockTabs });
    const element = tabs.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('tabs');
  });

  it('should throw error if tabs prop is missing', () => {
    expect(() => new Tabs({})).toThrow('Tabs: tabs is required');
  });

  it('should render all tab buttons', () => {
    const tabs = new Tabs({ tabs: mockTabs });
    const element = tabs.getElement();

    const buttons = element.querySelectorAll('.tabs__button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent).toBe('Tab 1');
    expect(buttons[1].textContent).toBe('Tab 2');
    expect(buttons[2].textContent).toBe('Tab 3');
  });

  it('should render all tab panels', () => {
    const tabs = new Tabs({ tabs: mockTabs });
    const element = tabs.getElement();

    const panels = element.querySelectorAll('.tabs__panel');
    expect(panels.length).toBe(3);
    expect(panels[0].textContent).toBe('Content 1');
    expect(panels[1].textContent).toBe('Content 2');
    expect(panels[2].textContent).toBe('Content 3');
  });

  it('should set first tab as active by default', () => {
    const tabs = new Tabs({ tabs: mockTabs });
    const element = tabs.getElement();

    const activeButton = element.querySelector('.tabs__button--active');
    const activePanel = element.querySelector('.tabs__panel--active');

    expect(activeButton.textContent).toBe('Tab 1');
    expect(activePanel.textContent).toBe('Content 1');
  });

  it('should set specified tab as active when defaultActiveTab is provided', () => {
    const tabs = new Tabs({ tabs: mockTabs, defaultActiveTab: 1 });
    const element = tabs.getElement();

    const activeButton = element.querySelector('.tabs__button--active');
    const activePanel = element.querySelector('.tabs__panel--active');

    expect(activeButton.textContent).toBe('Tab 2');
    expect(activePanel.textContent).toBe('Content 2');
  });

  it('should switch tabs when clicking tab buttons', () => {
    const tabs = new Tabs({ tabs: mockTabs });
    const element = tabs.getElement();

    const buttons = element.querySelectorAll('.tabs__button');
    buttons[2].click();

    const activeButton = element.querySelector('.tabs__button--active');
    const activePanel = element.querySelector('.tabs__panel--active');

    expect(activeButton.textContent).toBe('Tab 3');
    expect(activePanel.textContent).toBe('Content 3');
  });

  it('should call onTabChange callback when switching tabs', () => {
    const onTabChange = vi.fn();
    const tabs = new Tabs({ tabs: mockTabs, onTabChange });
    const element = tabs.getElement();

    const buttons = element.querySelectorAll('.tabs__button');
    buttons[1].click();

    expect(onTabChange).toHaveBeenCalledWith(1, 0);
  });

  it('should handle component content', () => {
    const mockComponent = {
      getElement: () => {
        const div = document.createElement('div');
        div.textContent = 'Component Content';
        return div;
      },
    };

    const tabsWithComponent = [
      {
        id: 'tab1',
        label: 'Tab 1',
        content: mockComponent,
      },
    ];

    const tabs = new Tabs({ tabs: tabsWithComponent });
    const element = tabs.getElement();

    const panel = element.querySelector('.tabs__panel');
    expect(panel.textContent).toBe('Component Content');
  });

  it('should handle HTMLElement content', () => {
    const div = document.createElement('div');
    div.textContent = 'HTML Element Content';

    const tabsWithElement = [
      {
        id: 'tab1',
        label: 'Tab 1',
        content: div,
      },
    ];

    const tabs = new Tabs({ tabs: tabsWithElement });
    const element = tabs.getElement();

    const panel = element.querySelector('.tabs__panel');
    expect(panel.textContent).toBe('HTML Element Content');
  });

  it('should apply custom className', () => {
    const tabs = new Tabs({ tabs: mockTabs, className: 'custom-tabs' });
    const element = tabs.getElement();

    expect(element.className).toBe('tabs custom-tabs');
  });

  it('should set appropriate ARIA attributes', () => {
    const tabs = new Tabs({ tabs: mockTabs });
    const element = tabs.getElement();

    const buttons = element.querySelectorAll('.tabs__button');
    const panels = element.querySelectorAll('.tabs__panel');

    expect(buttons[0].getAttribute('role')).toBe('tab');
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[0].getAttribute('aria-controls')).toBe('panel-tab1');

    expect(panels[0].getAttribute('role')).toBe('tabpanel');
    expect(panels[0].getAttribute('aria-labelledby')).toBe('tab-tab1');
    expect(panels[0].hidden).toBe(false);

    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
    expect(panels[1].hidden).toBe(true);
  });
});
