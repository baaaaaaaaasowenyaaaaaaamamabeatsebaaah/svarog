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
 * Validates muchandy-hero-specific props
 * @param {Object} props - MuchandyHero properties
 */
const validateMuchandyHeroProps = (props) => {
  if (!props.repairForm) {
    throw new Error('MuchandyHero: repairForm is required');
  }

  if (!props.buybackForm) {
    throw new Error('MuchandyHero: buybackForm is required');
  }
};

/**
 * Creates muchandy hero DOM element
 * @param {Object} state - MuchandyHero state
 * @returns {HTMLElement} - MuchandyHero element
 */
const renderMuchandyHero = (state) => {
  // Create main container with background image
  const container = createElement('div', {
    classes: ['muchandy-hero', state.className].filter(Boolean),
  });

  // Apply background image if provided
  if (state.backgroundImage) {
    container.style.backgroundImage = `url(${state.backgroundImage})`;
  }

  // Create grid container
  const gridContainer = createElement('div', {
    classes: ['muchandy-hero__grid'],
  });

  // Create content column (columns 2-5)
  const contentColumn = createElement('div', {
    classes: ['muchandy-hero__content-column'],
  });

  // Add title with line break
  if (state.title) {
    const title = createElement('h1', {
      classes: ['muchandy-hero__title'],
      html: state.title, // Use innerHTML to allow for line breaks with <br> tags
    });
    contentColumn.appendChild(title);
  }

  // Add subtitle if provided
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

  // Wrap forms in divs to control their display
  const repairFormWrapper = createElement('div', {
    classes: ['muchandy-hero__form-wrapper'],
  });
  repairFormWrapper.appendChild(state.repairForm.getElement());

  const buybackFormWrapper = createElement('div', {
    classes: ['muchandy-hero__form-wrapper'],
  });
  buybackFormWrapper.appendChild(state.buybackForm.getElement());

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
  const tabsComponent = Tabs({
    tabs,
    defaultActiveTab: state.defaultTab === 'sell' ? 1 : 0,
    className: 'muchandy-hero__tabs',
    variant: 'border',
    align: 'center',
  });

  // Store the tabs component for cleanup
  container._tabsComponent = tabsComponent;

  formContainer.appendChild(tabsComponent.getElement());
  contentColumn.appendChild(formContainer);
  gridContainer.appendChild(contentColumn);
  container.appendChild(gridContainer);

  return container;
};

/**
 * Create a MuchandyHero component
 * @param {Object} props - MuchandyHero properties
 * @returns {Object} MuchandyHero component
 */
const createMuchandyHero = (props) => {
  // Validate props
  validateProps(props, createMuchandyHero.requiredProps);
  validateMuchandyHeroProps(props);

  // Initial state with defaults
  const initialState = {
    backgroundImage: props.backgroundImage || '',
    title: props.title || 'Finden Sie<br>Ihren Preis',
    subtitle: props.subtitle || 'Jetzt Preis berechnen.',
    repairForm: props.repairForm,
    buybackForm: props.buybackForm,
    defaultTab: props.defaultTab || 'repair',
    className: props.className || '',
  };

  // Create the base component
  const muchandyHeroComponent =
    createBaseComponent(renderMuchandyHero)(initialState);

  // Store original destroy method
  const originalDestroy = muchandyHeroComponent.destroy;

  // Override destroy to also clean up child components
  muchandyHeroComponent.destroy = function () {
    const element = this.getElement();

    // Clean up the tabs component if it exists
    if (element && element._tabsComponent) {
      element._tabsComponent.destroy();
      element._tabsComponent = null;
    }

    // Call the original destroy method
    originalDestroy.call(this);
  };

  // Define when we need a full re-render
  muchandyHeroComponent.shouldRerender = (newProps) => {
    // Any of these props changing requires a full re-render
    return [
      'backgroundImage',
      'title',
      'subtitle',
      'repairForm',
      'buybackForm',
      'defaultTab',
      'className',
    ].some((prop) => newProps[prop] !== undefined);
  };

  // Add theme change handler
  muchandyHeroComponent.onThemeChange = (newTheme, previousTheme) => {
    console.debug(
      `MuchandyHero: theme changed from ${previousTheme} to ${newTheme}`
    );
    // Apply theme-specific adjustments if needed
  };

  return muchandyHeroComponent;
};

// Required props
createMuchandyHero.requiredProps = ['repairForm', 'buybackForm'];

// Create the component with theme awareness
const MuchandyHeroComponent = withThemeAwareness(
  createComponent('MuchandyHero', createMuchandyHero)
);

// Export as a factory function
export default MuchandyHeroComponent;
