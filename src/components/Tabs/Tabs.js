// src/components/Tabs/Tabs.js
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createElement } from '../../utils/componentFactory.js';
import { validateRequiredProps } from '../../utils/validation.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { tabsStyles } from './Tabs.styles.js';

// Create style injector for Tabs component (cached automatically)
const injectTabsStyles = createStyleInjector('Tabs');

/**
 * Creates a Tabs component
 * @param {Object} props - Tabs properties
 * @param {Array} props.tabs - Array of tab objects (id, label, content)
 * @param {number} [props.defaultActiveTab=0] - Index of initially active tab (deprecated, use defaultValue)
 * @param {number} [props.defaultValue=0] - Index of initially active tab
 * @param {Function} [props.onChange] - Callback when active tab changes
 * @param {Function} [props.onTabChange] - Callback when active tab changes (deprecated, use onChange)
 * @param {string} [props.className] - Additional CSS class
 * @param {string} [props.variant='default'] - Tab style variant ('default', 'simple', 'border')
 * @param {string} [props.align='left'] - Tab alignment ('left', 'center', 'right')
 * @returns {Object} Tabs component
 */
const createTabs = (props) => {
  // Inject styles on component creation
  injectTabsStyles(tabsStyles);

  // Migrate legacy props to new standard props
  const normalizedProps = migrateLegacyProps(props);

  // Validate props
  validateRequiredProps(
    normalizedProps,
    {
      tabs: {
        required: true,
        type: 'array',
        minLength: 1,
        validator: (tabs) => tabs.length > 0 || 'tabs array must not be empty',
      },
      defaultValue: {
        required: false,
        type: 'number',
      },
      variant: {
        required: false,
        type: 'string',
        allowedValues: ['default', 'simple', 'border'],
      },
      align: {
        required: false,
        type: 'string',
        allowedValues: ['left', 'center', 'right'],
      },
    },
    'Tabs'
  );

  // Create initial state by merging props with defaults
  const state = {
    tabs: normalizedProps.tabs || [],
    defaultValue: normalizedProps.defaultValue || 0,
    onChange: normalizedProps.onChange || null,
    className: normalizedProps.className || '',
    variant: normalizedProps.variant || 'default',
    align: normalizedProps.align || 'left',
    activeTab: normalizedProps.defaultValue || 0,
  };

  // References to DOM elements for easier access in switchTab
  let buttonRefs = [];
  let panelRefs = [];

  /**
   * Switches to a specific tab
   * @param {number} index - Index of tab to switch to
   * @returns {boolean} Whether the tab was switched
   */
  const switchTab = (index) => {
    // Don't switch if index is out of bounds or already active
    if (index === state.activeTab || index < 0 || index >= state.tabs.length) {
      return false;
    }

    const previousTab = state.activeTab;
    state.activeTab = index;

    // Update buttons
    buttonRefs.forEach((button, i) => {
      const isActive = i === index;
      button.classList.toggle('tabs__button--active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update panels
    panelRefs.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle('tabs__panel--active', isActive);
      panel.hidden = !isActive; // Hidden for inactive panels
    });

    // Call callback if provided
    if (state.onChange) {
      state.onChange(index, previousTab);
    }

    return true;
  };

  /**
   * Adds content to a tab panel based on its type
   * @param {HTMLElement} panel - The panel element to add content to
   * @param {Object} tab - The tab object containing content
   * @private
   */
  const addContentToPanel = (panel, tab) => {
    const content = tab.content;

    // Handle string content
    if (typeof content === 'string') {
      panel.innerHTML = content;
      return;
    }

    // Handle HTMLElement content
    if (content instanceof HTMLElement) {
      panel.appendChild(content);
      return;
    }

    // Handle component with getElement method
    if (content && typeof content.getElement === 'function') {
      try {
        const element = content.getElement();
        if (element instanceof HTMLElement) {
          panel.appendChild(element);
        } else {
          console.warn(
            `Tabs: content.getElement() did not return an HTMLElement for tab "${tab.id}"`
          );
        }
      } catch (error) {
        console.error(
          `Tabs: Error calling getElement() for tab "${tab.id}":`,
          error
        );
      }
      return;
    }

    // Handle function that returns content
    if (typeof content === 'function') {
      try {
        const contentElement = content();
        if (contentElement instanceof HTMLElement) {
          panel.appendChild(contentElement);
        } else if (
          contentElement &&
          typeof contentElement.getElement === 'function'
        ) {
          const el = contentElement.getElement();
          if (el instanceof HTMLElement) {
            panel.appendChild(el);
          } else {
            console.warn(
              `Tabs: content.getElement() did not return an HTMLElement for tab "${tab.id}"`
            );
          }
        } else {
          console.warn(
            `Tabs: Function content did not return a valid element or component for tab "${tab.id}"`
          );
        }
      } catch (error) {
        console.error(
          `Tabs: Error rendering content for tab "${tab.id}":`,
          error
        );
      }
      return;
    }

    // Handle null or undefined content
    if (content === null || content === undefined) {
      console.warn(`Tabs: No content provided for tab "${tab.id}"`);
      return;
    }

    // Handle unknown content type
    console.warn(
      `Tabs: Unsupported content type for tab "${tab.id}": ${typeof content}`
    );
  };

  /**
   * Renders the tabs based on current state
   * @param {Object} state - Current component state
   * @returns {HTMLElement} Tabs element
   */
  const renderTabs = (state) => {
    // Create container with proper class names
    const containerClasses = ['tabs'];

    if (state.variant !== 'default') {
      containerClasses.push(`tabs--${state.variant}`);
    }

    if (state.align !== 'left') {
      containerClasses.push(`tabs--align-${state.align}`);
    }

    if (state.className) {
      containerClasses.push(state.className);
    }

    const container = createElement('div', {
      classes: containerClasses,
    });

    // Create tab buttons list
    const tabList = createElement('div', {
      classes: 'tabs__list',
      attributes: { role: 'tablist' },
    });

    // Create tab panels container
    const tabPanelsContainer = createElement('div', {
      classes: 'tabs__panels',
    });

    // Reset button and panel references
    buttonRefs = [];
    panelRefs = [];

    // Add tab buttons and panels
    state.tabs.forEach((tab, index) => {
      const isActive = index === state.activeTab;
      const isFirst = index === 0;

      // Build class names for tab buttons
      const buttonClasses = ['tabs__button'];

      if (isActive) {
        buttonClasses.push('tabs__button--active');
      }

      if (state.variant === 'border') {
        buttonClasses.push('tabs__button--bordered');

        if (isFirst) {
          buttonClasses.push('tabs__button--first');
        }
      }

      // Create tab button
      const button = createElement('button', {
        classes: buttonClasses,
        attributes: {
          role: 'tab',
          'aria-selected': isActive ? 'true' : 'false',
          'aria-controls': `panel-${tab.id}`,
          id: `tab-${tab.id}`,
        },
        events: {
          click: (e) => {
            e.preventDefault();
            switchTab(index);
          },
        },
      });

      // Set button text directly
      button.textContent = tab.label;

      buttonRefs.push(button);
      tabList.appendChild(button);

      // Build class names for tab panels
      const panelClasses = ['tabs__panel'];

      if (isActive) {
        panelClasses.push('tabs__panel--active');
      }

      if (state.variant === 'border') {
        panelClasses.push('tabs__panel--bordered');
      }

      // Create tab panel
      const panel = createElement('div', {
        classes: panelClasses,
        attributes: {
          role: 'tabpanel',
          'aria-labelledby': `tab-${tab.id}`,
          id: `panel-${tab.id}`,
        },
      });

      // Set hidden attribute manually
      panel.hidden = !isActive;

      // Add content to the panel with improved error handling
      addContentToPanel(panel, tab);

      panelRefs.push(panel);
      tabPanelsContainer.appendChild(panel);
    });

    container.appendChild(tabList);
    container.appendChild(tabPanelsContainer);

    return container;
  };

  // Create component using baseComponent
  const baseComponent = createBaseComponent(renderTabs)(state);

  /**
   * Determines if component needs to fully re-render based on prop changes
   * @param {Object} newProps - New properties
   * @returns {boolean} Whether a full re-render is required
   */
  const shouldRerender = (newProps) => {
    // Normalize new props
    const normalizedNewProps = migrateLegacyProps(newProps);

    // Critical props that require a full re-render
    const criticalProps = ['tabs', 'variant', 'align'];
    return Object.keys(normalizedNewProps).some((key) =>
      criticalProps.includes(key)
    );
  };

  /**
   * Perform partial update without full re-render
   * @param {HTMLElement} element - Current element
   * @param {Object} newProps - New properties
   */
  const partialUpdate = (element, newProps) => {
    // Normalize new props
    const normalizedNewProps = migrateLegacyProps(newProps);

    // Handle className update without re-rendering
    if (normalizedNewProps.className !== undefined) {
      // Get the current class list
      const classList = element.className.split(' ');

      // Find and remove the old className if it exists
      const oldClassIndex = classList.findIndex(
        (cls) => cls !== 'tabs' && !cls.startsWith('tabs--')
      );

      if (oldClassIndex !== -1) {
        classList.splice(oldClassIndex, 1);
      }

      // Add the new className if it exists
      if (normalizedNewProps.className) {
        classList.push(normalizedNewProps.className);
      }

      // Set the new class list
      element.className = classList.join(' ');
    }

    // Handle activeTab/value change - IMPORTANT: do this before updating state
    // to ensure switchTab works with the correct values
    if (
      normalizedNewProps.activeTab !== undefined ||
      normalizedNewProps.value !== undefined
    ) {
      const newValue =
        normalizedNewProps.value !== undefined
          ? normalizedNewProps.value
          : normalizedNewProps.activeTab;
      switchTab(newValue);
    }

    // Update state with new props after processing any tab changes
    Object.assign(state, normalizedNewProps);
  };

  // Extended component with custom methods
  const tabsComponent = {
    ...baseComponent,

    /**
     * Determines if component should fully re-render
     * @param {Object} newProps - New properties
     * @returns {boolean} Whether a full re-render is required
     */
    shouldRerender,

    /**
     * Performs efficient partial updates
     * @param {HTMLElement} element - Current element
     * @param {Object} newProps - New properties
     */
    partialUpdate,

    /**
     * Switch to a specific tab
     * @param {number} index - Tab index to switch to
     * @returns {Object} Tabs component (for chaining)
     */
    switchTab(index) {
      switchTab(index);
      return this;
    },

    /**
     * Get the index of the active tab
     * @returns {number} Active tab index
     */
    getActiveTab() {
      return state.activeTab;
    },

    /**
     * Get the current value (alias for getActiveTab)
     * @returns {number} Current value (active tab index)
     */
    getValue() {
      return state.activeTab;
    },

    /**
     * Get the number of tabs
     * @returns {number} Number of tabs
     */
    getTabCount() {
      return state.tabs.length;
    },
  };

  // Add theme change handler
  tabsComponent.onThemeChange = (newTheme, previousTheme) => {
    // This could apply theme-specific adjustments if needed
    console.debug(`Tabs: theme changed from ${previousTheme} to ${newTheme}`);
  };

  return tabsComponent;
};

/**
 * Migrate legacy props to new standard props
 * @param {Object} props - Component props
 * @returns {Object} Normalized props
 */
const migrateLegacyProps = (props) => {
  const normalized = { ...props };

  // Handle onTabChange -> onChange
  if ('onTabChange' in props && !('onChange' in props)) {
    console.warn('[Tabs] onTabChange is deprecated, use onChange instead');
    normalized.onChange = props.onTabChange;
    delete normalized.onTabChange;
  }

  // Handle defaultActiveTab -> defaultValue
  if ('defaultActiveTab' in props && !('defaultValue' in props)) {
    console.warn(
      '[Tabs] defaultActiveTab is deprecated, use defaultValue instead'
    );
    normalized.defaultValue = props.defaultActiveTab;
    delete normalized.defaultActiveTab;
  }

  // Handle activeTab -> value (add alias)
  if ('activeTab' in props && !('value' in props)) {
    normalized.value = props.activeTab;
  }

  // Handle value -> activeTab (for internal state)
  if ('value' in props && !('activeTab' in props)) {
    normalized.activeTab = props.value;
  }

  return normalized;
};

// Define required props for validation
createTabs.requiredProps = ['tabs'];

// Export as a factory function
export default createTabs;
