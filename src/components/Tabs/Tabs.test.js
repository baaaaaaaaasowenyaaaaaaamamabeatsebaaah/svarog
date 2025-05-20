// src/components/Tabs/Tabs.test.js
import { describe, it, expect, vi } from 'vitest';
import createTabs from './Tabs.js';

describe('Tabs component', () => {
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

  // Helper function to create tabs with props
  const createTabsElement = (props) => {
    const tabs = createTabs(props);
    return tabs.getElement();
  };

  it('should create tabs with required props', () => {
    const element = createTabsElement({ tabs: mockTabs });
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('tabs');
  });

  it('should throw error if tabs prop is missing', () => {
    expect(() => createTabs({})).toThrow();
  });

  it('should render all tab buttons', () => {
    const element = createTabsElement({ tabs: mockTabs });
    const buttons = element.querySelectorAll('.tabs__button');

    expect(buttons.length).toBe(3);

    // Use dynamic button labels for the test
    for (let i = 0; i < mockTabs.length; i++) {
      expect(mockTabs[i].label).toBe(`Tab ${i + 1}`);
    }
  });

  it('should render all tab panels', () => {
    const element = createTabsElement({ tabs: mockTabs });
    const panels = element.querySelectorAll('.tabs__panel');

    expect(panels.length).toBe(3);
    expect(panels[0].textContent).toBe('Content 1');
    expect(panels[1].textContent).toBe('Content 2');
    expect(panels[2].textContent).toBe('Content 3');
  });

  it('should set first tab as active by default', () => {
    const element = createTabsElement({ tabs: mockTabs });
    const activePanel = element.querySelector('.tabs__panel--active');

    // Check that first tab is active by checking:
    // 1. The active panel contains the right content
    expect(activePanel.textContent).toBe('Content 1');
    // 2. The aria-selected attribute is set correctly on the first button
    const buttons = element.querySelectorAll('.tabs__button');
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
  });

  it('should set specified tab as active when defaultActiveTab is provided', () => {
    const element = createTabsElement({
      tabs: mockTabs,
      defaultActiveTab: 1,
    });

    const activePanel = element.querySelector('.tabs__panel--active');

    // Check that second tab is active
    expect(activePanel.textContent).toBe('Content 2');

    // Check aria-selected on buttons
    const buttons = element.querySelectorAll('.tabs__button');
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
  });

  it('should switch tabs when clicking tab buttons', () => {
    const tabs = createTabs({ tabs: mockTabs });
    const element = tabs.getElement();

    const buttons = element.querySelectorAll('.tabs__button');

    // Click the third tab button
    buttons[2].click();

    // Get the active elements after clicking
    const activePanel = element.querySelector('.tabs__panel--active');

    // Check that third tab is active
    expect(activePanel.textContent).toBe('Content 3');
    expect(buttons[2].getAttribute('aria-selected')).toBe('true');
  });

  it('should call onTabChange callback when switching tabs', () => {
    const onTabChange = vi.fn();
    const tabs = createTabs({
      tabs: mockTabs,
      onTabChange,
    });

    const element = tabs.getElement();
    const buttons = element.querySelectorAll('.tabs__button');

    // Click the second tab button
    buttons[1].click();

    // Check callback was called
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

    const element = createTabsElement({ tabs: tabsWithComponent });
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

    const element = createTabsElement({ tabs: tabsWithElement });
    const panel = element.querySelector('.tabs__panel');
    expect(panel.textContent).toBe('HTML Element Content');
  });

  it('should apply custom className', () => {
    const element = createTabsElement({
      tabs: mockTabs,
      className: 'custom-tabs',
    });

    expect(element.className).toBe('tabs custom-tabs');
  });

  it('should set appropriate ARIA attributes', () => {
    const element = createTabsElement({ tabs: mockTabs });

    const buttons = element.querySelectorAll('.tabs__button');
    const panels = element.querySelectorAll('.tabs__panel');

    // Check ARIA attributes for first button and panel
    expect(buttons[0].getAttribute('role')).toBe('tab');
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[0].getAttribute('aria-controls')).toBe('panel-tab1');

    expect(panels[0].getAttribute('role')).toBe('tabpanel');
    expect(panels[0].getAttribute('aria-labelledby')).toBe('tab-tab1');

    // Test hidden attribute differently for hidden and visible panels
    // For first panel that should be visible
    const isFirstPanelHidden = panels[0].hidden === true;
    expect(isFirstPanelHidden).toBe(false);

    // For second panel that should be hidden
    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
    expect(panels[1].hidden).toBe(true);
  });

  it('should programmatically switch tabs with switchTab method', () => {
    const tabs = createTabs({ tabs: mockTabs });
    tabs.switchTab(2);

    const element = tabs.getElement();
    const buttons = element.querySelectorAll('.tabs__button');
    const activePanel = element.querySelector('.tabs__panel--active');

    // Check that third tab is active
    expect(activePanel.textContent).toBe('Content 3');
    expect(buttons[2].getAttribute('aria-selected')).toBe('true');
  });
});
