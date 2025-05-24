// src/components/Accordion/Accordion.js
import './Accordion.css';
import { createElement, appendChildren } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
// Unused validation utilities removed
import {} from '../../utils/validation.js';

// Debug helper
const debugLog = (message, data = null) => {
  if (
    typeof window !== 'undefined' &&
    window.localStorage?.getItem('svarog-debug') === 'true'
  ) {
    if (data) {
      console.log(`[Accordion] ${message}`, data);
    } else {
      console.log(`[Accordion] ${message}`);
    }
  }
};

/**
 * Creates an Accordion component with multiple collapsible sections
 * @param {Object} props - Component configuration
 * @returns {Object} Accordion component API
 */
const createAccordion = (props = {}) => {
  debugLog('createAccordion called', {
    propsKeys: Object.keys(props),
    disabled: props.disabled,
    itemsCount: props.items?.length,
  });

  // Initialize state
  const state = {
    items: props.items || [],
    disabled: props.disabled || false,
    allowMultiple: props.allowMultiple || false,
    activeIndices: props.allowMultiple ? [] : 0,
  };

  // DOM Elements
  const elements = {
    container: null,
    items: [],
  };

  // Private methods
  const toggleItem = (index) => {
    if (state.disabled) return;

    if (state.allowMultiple) {
      const currentIndex = state.activeIndices.indexOf(index);
      if (currentIndex === -1) {
        state.activeIndices.push(index);
      } else {
        state.activeIndices.splice(currentIndex, 1);
      }
    } else {
      state.activeIndices = index;
    }
    updateUI();
  };

  const updateUI = () => {
    elements.items.forEach((item, index) => {
      const isActive = state.allowMultiple
        ? state.activeIndices.includes(index)
        : index === state.activeIndices;
      item.classList.toggle('active', isActive);
      const content = item.querySelector('.accordion-content');
      if (content) {
        content.style.maxHeight = isActive ? `${content.scrollHeight}px` : '0';
      }
    });
  };

  // Public methods
  const api = {
    render: () => {
      debugLog('rendering accordion');
      elements.container = createElement('div', {
        className: 'accordion',
      });

      state.items.forEach((item, index) => {
        const itemElement = createElement('div', {
          className: 'accordion-item',
        });

        const header = createElement('div', {
          className: 'accordion-header',
          onClick: () => toggleItem(index),
        });
        header.textContent = item.header;

        const content = createElement('div', {
          className: 'accordion-content',
          innerHTML: item.content,
        });

        appendChildren(itemElement, [header, content]);
        elements.items.push(itemElement);
        elements.container.appendChild(itemElement);
      });

      updateUI();
      return elements.container;
    },

    destroy: () => {
      debugLog('destroying accordion');
      elements.container.remove();
    },

    updateItems: (newItems) => {
      state.items = newItems;
      elements.items.forEach((item) => item.remove());
      elements.items = [];
      api.render();
    },
  };

  return api;
};

export default withThemeAwareness(createAccordion);
