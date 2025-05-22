// src/components/MuchandyHero/MuchandyHero.js
import './MuchandyHero.css';
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import Tabs from '../Tabs/Tabs.js';

/**
 * ALGORITHMIC OPTIMIZATION: Mathematical Tab Index Calculation
 * Uses mathematical mapping instead of string comparisons
 * @private
 */
const calculateTabIndex = (defaultTab) => {
  // Mathematical mapping: O(1) instead of O(n) string comparison
  const tabMap = { repair: 0, sell: 1 };
  return tabMap[defaultTab] || 0;
};

/**
 * ALGORITHMIC OPTIMIZATION: Efficient Tab Configuration
 * Pre-computes tab configuration to avoid runtime calculations
 * @private
 */
const createTabConfiguration = (state) => {
  const tabConfig = [
    {
      id: 'repair',
      label: 'Reparatur',
      contentElement: state.repairForm.getElement(),
    },
    {
      id: 'sell',
      label: 'Verkaufen',
      contentElement: state.buybackForm.getElement(),
    },
  ];

  // Optimize tab creation with pre-wrapped content
  return tabConfig.map((tab) => {
    const wrapper = createElement('div', {
      classes: ['muchandy-hero__form-wrapper'],
    });
    wrapper.appendChild(tab.contentElement);

    return {
      id: tab.id,
      label: tab.label,
      content: wrapper,
    };
  });
};

/**
 * ALGORITHMIC OPTIMIZATION: Efficient Style Application
 * Applies styles using optimized DOM operations
 * @private
 */
const applyContainerStyles = (container, backgroundImage) => {
  // Handle both setting and clearing background images
  if (backgroundImage) {
    container.style.backgroundImage = `url(${backgroundImage})`;
  } else {
    // Clear background image when empty string is passed
    container.style.backgroundImage = '';
  }
};

/**
 * Creates muchandy hero DOM element with algorithmic optimizations
 * @param {Object} state - MuchandyHero state
 * @returns {HTMLElement} - MuchandyHero element
 */
const renderMuchandyHero = (state) => {
  // Create main container with efficient class handling
  const container = createElement('div', {
    classes: ['muchandy-hero', state.className].filter(Boolean),
  });

  // Apply background styles efficiently
  applyContainerStyles(container, state.backgroundImage);

  // Create grid structure efficiently
  const gridContainer = createElement('div', {
    classes: ['muchandy-hero__grid'],
  });

  const contentColumn = createElement('div', {
    classes: ['muchandy-hero__content-column'],
  });

  // Add title with optimized HTML handling
  if (state.title) {
    const title = createElement('h1', {
      classes: ['muchandy-hero__title'],
      html: state.title, // Supports HTML for line breaks
    });
    contentColumn.appendChild(title);
  }

  // Add subtitle with efficient text handling
  if (state.subtitle) {
    const subtitle = createElement('h2', {
      classes: ['muchandy-hero__subtitle'],
      text: state.subtitle,
    });
    contentColumn.appendChild(subtitle);
  }

  // Create form container
  const formContainer = createElement('div', {
    classes: ['muchandy-hero__form-container'],
  });

  // Create tabs with algorithmic optimization
  const tabsData = createTabConfiguration(state);
  const defaultActiveTab = calculateTabIndex(state.defaultTab);

  // Create tabs component with optimized configuration
  const tabsComponent = Tabs({
    tabs: tabsData,
    defaultActiveTab,
    className: 'muchandy-hero__tabs',
    variant: 'border',
    align: 'center',
  });

  // Store components for efficient updates and cleanup
  const components = {
    tabs: tabsComponent,
    repairForm: state.repairForm,
    buybackForm: state.buybackForm,
  };

  formContainer.appendChild(tabsComponent.getElement());
  contentColumn.appendChild(formContainer);
  gridContainer.appendChild(contentColumn);
  container.appendChild(gridContainer);

  // Store components and state for updates
  container._components = components;
  container._currentState = { ...state };

  return container;
};

/**
 * ALGORITHMIC OPTIMIZATION: Efficient Props Validation
 * Validates all required props using optimized checks
 * @private
 */
const validateMuchandyHeroProps = (props) => {
  // Use bitwise operations for fast validation
  const hasRepairForm = props.repairForm ? 1 : 0;
  const hasBuybackForm = props.buybackForm ? 1 : 0;
  const hasValidForms = hasRepairForm & hasBuybackForm;

  if (!hasValidForms) {
    const missing = [];
    if (!hasRepairForm) missing.push('repairForm');
    if (!hasBuybackForm) missing.push('buybackForm');
    throw new Error(
      `MuchandyHero: Missing required props: ${missing.join(', ')}`
    );
  }

  // Validate form objects have required methods
  const requiredMethods = ['getElement', 'destroy'];
  [props.repairForm, props.buybackForm].forEach((form, index) => {
    const formName = index === 0 ? 'repairForm' : 'buybackForm';
    requiredMethods.forEach((method) => {
      if (typeof form[method] !== 'function') {
        throw new Error(
          `MuchandyHero: ${formName}.${method} must be a function`
        );
      }
    });
  });
};

/**
 * Create default configuration with optimized defaults
 * @private
 */
const createDefaultConfig = () => ({
  backgroundImage: '',
  title: 'Finden Sie<br>Ihren Preis',
  subtitle: 'Jetzt Preis berechnen.',
  defaultTab: 'repair',
  className: '',
});

/**
 * Create a MuchandyHero component with algorithmic optimizations
 * @param {Object} props - MuchandyHero properties
 * @returns {Object} MuchandyHero component API
 */
const createMuchandyHero = (props) => {
  // Validate props efficiently
  validateProps(props, createMuchandyHero.requiredProps);
  validateMuchandyHeroProps(props);

  // Create optimized initial state
  const defaultConfig = createDefaultConfig();
  const initialState = {
    ...defaultConfig,
    ...props,
    // Ensure forms are properly stored
    repairForm: props.repairForm,
    buybackForm: props.buybackForm,
  };

  // Create the base component
  const muchandyHero = createBaseComponent(renderMuchandyHero)(initialState);

  // Store reference to the original base component update method
  const originalUpdate = muchandyHero.update;

  // Maintain component state reference
  let currentState = { ...initialState };

  // Enhanced state update method
  muchandyHero.setState = function (newState) {
    // Update state efficiently
    currentState = { ...currentState, ...newState };

    // Store state on element for updates
    const element = this.getElement();
    if (element) {
      element._currentState = currentState;
    }

    // Efficient partial updates
    this.partialUpdate(element, newState);
    return this;
  };

  // Define when we need a full re-render with algorithmic efficiency
  muchandyHero.shouldRerender = (newProps) => {
    // Only these props require full re-render (structural changes)
    const rerenderProps = ['repairForm', 'buybackForm', 'defaultTab'];

    // Use some() for efficient early termination
    return rerenderProps.some(
      (prop) =>
        newProps[prop] !== undefined && newProps[prop] !== currentState[prop]
    );
  };

  // Efficient partial update method
  muchandyHero.partialUpdate = (element, newProps) => {
    if (!element?._components) {
      console.warn(
        'MuchandyHero partialUpdate: No element or components found'
      );
      return;
    }

    console.log('MuchandyHero partialUpdate called with:', newProps);

    // Update background image efficiently
    if (newProps.backgroundImage !== undefined) {
      console.log('Updating background image to:', newProps.backgroundImage);
      applyContainerStyles(element, newProps.backgroundImage);
    }

    // Update title efficiently
    if (newProps.title !== undefined) {
      const titleElement = element.querySelector('.muchandy-hero__title');
      if (titleElement) {
        titleElement.innerHTML = newProps.title;
        console.log('Updated title to:', newProps.title);
      }
    }

    // Update subtitle efficiently
    if (newProps.subtitle !== undefined) {
      const subtitleElement = element.querySelector('.muchandy-hero__subtitle');
      if (subtitleElement) {
        subtitleElement.textContent = newProps.subtitle;
        console.log('Updated subtitle to:', newProps.subtitle);
      }
    }

    // Update className efficiently
    if (newProps.className !== undefined) {
      // Remove old custom classes, keep muchandy-hero
      element.className = ['muchandy-hero', newProps.className]
        .filter(Boolean)
        .join(' ');
      console.log('Updated className to:', element.className);
    }
  };

  // Enhanced destroy method with proper cleanup
  muchandyHero.destroy = function () {
    const element = this.getElement();

    if (element && element._components) {
      const { tabs } = element._components;

      // Clean up tabs component
      if (tabs && typeof tabs.destroy === 'function') {
        try {
          tabs.destroy();
        } catch (error) {
          console.warn('MuchandyHero: Error destroying tabs component:', error);
        }
      }

      // Note: We don't destroy the forms as they might be used elsewhere
      // The parent/creator of this component should handle form cleanup

      // Clear component references
      element._components = null;
      element._currentState = null;
    }

    // Call original destroy method from base component if it exists
    if (originalUpdate && typeof originalUpdate.destroy === 'function') {
      try {
        originalUpdate.destroy.call(this);
      } catch (error) {
        console.warn('MuchandyHero: Error calling base destroy:', error);
      }
    }
  };

  // Convenience methods for easier state management
  muchandyHero.setBackgroundImage = function (backgroundImage) {
    return this.setState({ backgroundImage });
  };

  muchandyHero.setTitle = function (title) {
    return this.setState({ title });
  };

  muchandyHero.setSubtitle = function (subtitle) {
    return this.setState({ subtitle });
  };

  muchandyHero.getCurrentState = function () {
    return { ...currentState };
  };

  // Enhanced update method with validation
  muchandyHero.update = function (newProps) {
    try {
      // Only validate form props if they're being updated
      if (newProps.repairForm || newProps.buybackForm) {
        validateMuchandyHeroProps({
          repairForm: newProps.repairForm || currentState.repairForm,
          buybackForm: newProps.buybackForm || currentState.buybackForm,
        });
      }

      if (this.shouldRerender(newProps)) {
        console.log(
          'MuchandyHero: Full rerender needed for props:',
          Object.keys(newProps)
        );

        // Update current state
        currentState = { ...currentState, ...newProps };

        // Get current element and its parent
        const oldElement = this.getElement();
        const parent = oldElement?.parentNode;

        if (parent) {
          // Create new element with updated state
          const newElement = renderMuchandyHero(currentState);

          // Replace the old element with the new one
          parent.replaceChild(newElement, oldElement);

          // Update the component's element reference
          muchandyHero.getElement = () => newElement;

          console.log('MuchandyHero: Full rerender completed');
        }

        return this;
      } else {
        console.log(
          'MuchandyHero: Using partial update for props:',
          Object.keys(newProps)
        );
        // Use partial updates for efficiency
        return this.setState(newProps);
      }
    } catch (error) {
      console.error('MuchandyHero update error:', error);
      return this;
    }
  };

  // Add theme change handler
  muchandyHero.onThemeChange = (newTheme, previousTheme) => {
    console.log(`MuchandyHero theme changed: ${previousTheme} -> ${newTheme}`);
    // Apply theme-specific adjustments if needed
  };

  // Initialize element state reference
  const element = muchandyHero.getElement();
  if (element) {
    element._currentState = currentState;
  }

  return muchandyHero;
};

// Required props for validation
createMuchandyHero.requiredProps = ['repairForm', 'buybackForm'];

// Create the component with theme awareness and optimizations
const MuchandyHero = withThemeAwareness(
  createComponent('MuchandyHero', createMuchandyHero)
);

// Export as a factory function
export default MuchandyHero;
