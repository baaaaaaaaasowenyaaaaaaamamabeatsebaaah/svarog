// src/components/Accordion/Accordion.js
import {
  createElement,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { validateRequiredProps } from '../../utils/validation.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { accordionStyles } from './Accordion.styles.js';

// Create style injector for Accordion component
const injectAccordionStyles = createStyleInjector('Accordion');

/**
 * Creates accordion item elements
 * @param {Object} item - Accordion item data
 * @param {boolean} isExpanded - Whether item is expanded
 * @param {Function} onToggle - Toggle handler
 * @param {string} iconType - Icon type for styling
 * @returns {HTMLElement} Accordion item element
 */
const renderAccordionItem = (item, isExpanded, onToggle) => {
  const itemElement = createElement('div', {
    classes: [
      'accordion__item',
      isExpanded && 'accordion__item--expanded',
    ].filter(Boolean),
    attributes: {
      'data-accordion-item': item.id || '',
    },
  });

  // Header/Trigger
  const header = createElement('button', {
    classes: ['accordion__header'],
    attributes: {
      'aria-expanded': isExpanded.toString(),
      'aria-controls': `accordion-panel-${item.id}`,
      id: `accordion-header-${item.id}`,
      type: 'button',
    },
    events: {
      click: (e) => {
        e.preventDefault();
        if (onToggle) {
          onToggle(item.id);
        }
      },
    },
  });

  // Header content
  const headerContent = createElement('span', {
    classes: ['accordion__title'],
    text: item.title,
  });

  // Icon container - always create both elements for maximum flexibility
  const icon = createElement('span', {
    classes: ['accordion__icon'],
    attributes: {
      'aria-hidden': 'true',
    },
  });

  // Always create the arrow element (CSS controls visibility)
  const iconArrow = createElement('span', {
    classes: ['accordion__icon-arrow'],
  });

  icon.appendChild(iconArrow);
  header.appendChild(headerContent);
  header.appendChild(icon);

  // Panel/Content
  const panel = createElement('div', {
    classes: ['accordion__panel'],
    attributes: {
      id: `accordion-panel-${item.id}`,
      'aria-labelledby': `accordion-header-${item.id}`,
      'aria-hidden': (!isExpanded).toString(),
      role: 'region',
    },
  });

  const panelContent = createElement('div', {
    classes: ['accordion__content'],
  });

  // Handle content type
  if (typeof item.content === 'string') {
    panelContent.innerHTML = item.content;
  } else if (item.content instanceof HTMLElement) {
    panelContent.appendChild(item.content);
  } else if (typeof item.content === 'function') {
    const contentElement = item.content();
    if (contentElement instanceof HTMLElement) {
      panelContent.appendChild(contentElement);
    }
  } else if (item.content && typeof item.content.getElement === 'function') {
    panelContent.appendChild(item.content.getElement());
  }

  panel.appendChild(panelContent);
  itemElement.appendChild(header);
  itemElement.appendChild(panel);

  return itemElement;
};

/**
 * Creates accordion DOM structure
 * @param {Object} state - Accordion state
 * @returns {HTMLElement} Accordion element
 */
const renderAccordion = (state) => {
  // Inject styles on render
  injectAccordionStyles(accordionStyles);

  const classNames = [
    'accordion',
    state.variant && `accordion--${state.variant}`,
    state.iconType &&
      state.iconType !== 'content' &&
      `accordion--${state.iconType}`,
    state.className,
  ].filter(Boolean);

  const accordion = createElement('div', {
    classes: classNames,
    attributes: {
      role: 'region',
      'aria-label': state.ariaLabel || 'Accordion',
    },
  });

  // Store reference to toggle handler
  accordion._onToggle = state.onToggle;

  // Render items
  state.items.forEach((item) => {
    const isExpanded = state.expandedItems.includes(item.id);
    const itemElement = renderAccordionItem(
      item,
      isExpanded,
      accordion._onToggle,
      state.iconType
    );
    accordion.appendChild(itemElement);
  });

  return accordion;
};

/**
 * Create an Accordion component
 * @param {Object} props - Accordion properties
 * @returns {Object} Accordion component
 */
const createAccordion = (props) => {
  // Validate props
  validateRequiredProps(
    props,
    {
      items: {
        required: true,
        type: 'array',
        minLength: 1,
        validator: (items) => {
          return (
            items.every((item) => item.id && item.title) ||
            'Each item must have an id and title'
          );
        },
      },
      iconType: {
        required: false,
        type: 'string',
        validator: (iconType) => {
          const validTypes = [
            'content',
            'arrow',
            'chevron',
            'plus-minus',
            'caret',
            'no-icon',
          ];
          return (
            validTypes.includes(iconType) ||
            `iconType must be one of: ${validTypes.join(', ')}`
          );
        },
      },
    },
    'Accordion'
  );

  // Initial state
  const state = {
    items: props.items || [],
    expandedItems: props.defaultExpanded || [],
    multiple: props.multiple !== false, // Default to true
    variant: props.variant || '',
    iconType: props.iconType || 'content', // Default to content-based icons
    className: props.className || '',
    ariaLabel: props.ariaLabel || '',
    onChange: props.onChange || null,
  };

  // Toggle handler - define it here so it's available during render
  state.onToggle = (itemId) => {
    const currentExpanded = [...state.expandedItems];
    const isExpanded = currentExpanded.includes(itemId);

    if (isExpanded) {
      // Collapse
      state.expandedItems = currentExpanded.filter((id) => id !== itemId);
    } else {
      // Expand
      if (state.multiple) {
        state.expandedItems = [...currentExpanded, itemId];
      } else {
        // Single mode - collapse others
        state.expandedItems = [itemId];
      }
    }

    // Update DOM
    accordionComponent.update({ expandedItems: state.expandedItems });

    // Call onChange callback
    if (state.onChange) {
      state.onChange(state.expandedItems);
    }
  };

  // Create base component with state that includes onToggle
  const accordionComponent = createBaseComponent(renderAccordion)(state);

  // Add public methods
  accordionComponent.expand = function (itemId) {
    if (!state.expandedItems.includes(itemId)) {
      state.onToggle(itemId);
    }
    return this;
  };

  accordionComponent.collapse = function (itemId) {
    if (state.expandedItems.includes(itemId)) {
      state.onToggle(itemId);
    }
    return this;
  };

  accordionComponent.expandAll = function () {
    if (state.multiple) {
      const allIds = state.items.map((item) => item.id);
      state.expandedItems = allIds;
      this.update({ expandedItems: allIds });

      if (state.onChange) {
        state.onChange(allIds);
      }
    }
    return this;
  };

  accordionComponent.collapseAll = function () {
    state.expandedItems = [];
    this.update({ expandedItems: [] });

    if (state.onChange) {
      state.onChange([]);
    }
    return this;
  };

  accordionComponent.toggle = function (itemId) {
    state.onToggle(itemId);
    return this;
  };

  accordionComponent.getExpandedItems = function () {
    return [...state.expandedItems];
  };

  accordionComponent.setIconType = function (iconType) {
    const validTypes = [
      'content',
      'arrow',
      'chevron',
      'plus-minus',
      'caret',
      'no-icon',
    ];
    if (!validTypes.includes(iconType)) {
      console.warn(
        `Invalid iconType: ${iconType}. Valid types: ${validTypes.join(', ')}`
      );
      return this;
    }

    state.iconType = iconType;
    this.update({ iconType });
    return this;
  };

  // Override update to handle special cases
  const originalUpdate = accordionComponent.update;
  accordionComponent.update = function (newProps) {
    if (newProps.items) {
      // Update items in state
      state.items = newProps.items;
      // Filter out invalid expanded items when items change
      const validIds = newProps.items.map((item) => item.id);
      state.expandedItems = state.expandedItems.filter((id) =>
        validIds.includes(id)
      );
      newProps.expandedItems = state.expandedItems;
    }

    // Update internal state
    if (newProps.expandedItems !== undefined) {
      state.expandedItems = newProps.expandedItems;
    }

    // Update onChange if provided
    if (newProps.onChange !== undefined) {
      state.onChange = newProps.onChange;
    }

    // Update iconType if provided
    if (newProps.iconType !== undefined) {
      state.iconType = newProps.iconType;
    }

    // Update variant if provided
    if (newProps.variant !== undefined) {
      state.variant = newProps.variant;
    }

    return originalUpdate.call(this, newProps);
  };

  // Override destroy to remove element from DOM
  const originalDestroy = accordionComponent.destroy;
  accordionComponent.destroy = function () {
    const element = this.getElement();
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    return originalDestroy.call(this);
  };

  return accordionComponent;
};

// Create the component with theme awareness
const AccordionComponent = withThemeAwareness(
  createComponent('Accordion', createAccordion)
);

// Export as factory function
export default AccordionComponent;
