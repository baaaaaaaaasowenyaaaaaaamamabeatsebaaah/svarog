// src/components/PriceDisplay/PriceDisplay.js
import './PriceDisplay.css';
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';

/**
 * Validates price display-specific props
 * @param {Object} props - Price display properties
 */
const validatePriceDisplayProps = (props) => {
  if (!props.label) {
    console.warn(
      'PriceDisplay: label is required for proper component rendering'
    );
  }
};

/**
 * Creates price display DOM element
 * @param {Object} state - Price display state
 * @returns {HTMLElement} - Price display element
 */
const renderPriceDisplay = (state) => {
  // Build CSS class list
  const classNames = [
    'price-display',
    state.className,
    state.isLoading && 'price-display--loading',
    state.isHighlighted && 'price-display--highlighted',
    state.isPlaceholder && 'price-display--placeholder',
    state.isError && 'price-display--error',
  ].filter(Boolean);

  // Create label element
  const labelElement = createElement('span', {
    classes: ['price-display__label'],
    text: state.label,
  });

  // Create value element
  const valueElement = createElement('span', {
    classes: ['price-display__value'],
    text: state.value,
  });

  // Add loading indicator if loading
  if (state.isLoading) {
    const loadingIndicator = createElement('span', {
      classes: ['price-display__loading-indicator'],
    });
    valueElement.appendChild(document.createTextNode(' '));
    valueElement.appendChild(loadingIndicator);
  }

  // Create the container
  const container = createElement('div', {
    classes: classNames,
    children: [labelElement, valueElement],
  });

  // Store elements for easier access in partial updates
  container._elements = {
    labelElement,
    valueElement,
  };

  return container;
};

/**
 * Create a PriceDisplay component
 * @param {Object} props - Price display properties
 * @returns {Object} PriceDisplay component
 */
const createPriceDisplay = (props) => {
  // Validate required props
  validateProps(props, createPriceDisplay.requiredProps);

  // Validate price display-specific props
  validatePriceDisplayProps(props);

  // Initial state with defaults
  const initialState = {
    label: props.label || '',
    value: props.value || '',
    isLoading: props.isLoading || false,
    isHighlighted: props.isHighlighted || false,
    isPlaceholder: props.isPlaceholder || false,
    isError: props.isError || false,
    className: props.className || '',
  };

  // Track component destroyed state
  let isDestroyed = false;

  // Create the base component
  const priceDisplayComponent =
    createBaseComponent(renderPriceDisplay)(initialState);

  // Add partial update method for more efficient updates
  priceDisplayComponent.partialUpdate = (element, newProps) => {
    // Skip updates if component is destroyed
    if (isDestroyed) {
      console.warn('PriceDisplay: Attempted to update destroyed component');
      return;
    }

    // Skip updates if element is invalid
    if (!element || !element._elements) {
      return;
    }

    const { valueElement } = element._elements;

    // Handle value updates
    if (newProps.value !== undefined) {
      valueElement.textContent = newProps.value;
    }

    // Handle class-based state changes
    if (newProps.isHighlighted !== undefined) {
      element.classList.toggle(
        'price-display--highlighted',
        newProps.isHighlighted
      );
    }

    if (newProps.isPlaceholder !== undefined) {
      element.classList.toggle(
        'price-display--placeholder',
        newProps.isPlaceholder
      );
    }

    if (newProps.isError !== undefined) {
      element.classList.toggle('price-display--error', newProps.isError);
    }

    // Handle loading state changes
    if (newProps.isLoading !== undefined) {
      element.classList.toggle('price-display--loading', newProps.isLoading);

      // Remove existing loading indicator if any
      const existingIndicator = valueElement.querySelector(
        '.price-display__loading-indicator'
      );
      if (existingIndicator) {
        valueElement.removeChild(existingIndicator);
      }

      // Add new loading indicator if loading
      if (newProps.isLoading) {
        const loadingIndicator = createElement('span', {
          classes: ['price-display__loading-indicator'],
        });
        valueElement.appendChild(document.createTextNode(' '));
        valueElement.appendChild(loadingIndicator);
      }
    }
  };

  // Add convenience methods - using arrow functions for consistency with Button
  priceDisplayComponent.setValue = (
    value,
    isHighlighted = false,
    isPlaceholder = false
  ) => {
    return priceDisplayComponent.update({
      value,
      isHighlighted,
      isPlaceholder,
      isError: false,
    });
  };

  priceDisplayComponent.setLoading = (isLoading) => {
    return priceDisplayComponent.update({ isLoading });
  };

  priceDisplayComponent.setPlaceholder = (isPlaceholder) => {
    return priceDisplayComponent.update({ isPlaceholder });
  };

  priceDisplayComponent.setError = (errorMessage) => {
    return priceDisplayComponent.update({
      value: errorMessage,
      isHighlighted: false,
      isPlaceholder: false,
      isError: true,
      isLoading: false,
    });
  };

  // Add theme change handler
  priceDisplayComponent.onThemeChange = (newTheme, previousTheme) => {
    console.debug(
      `PriceDisplay: theme changed from ${previousTheme} to ${newTheme}`
    );
  };

  // Enhance destroy method
  const originalDestroy = priceDisplayComponent.destroy;
  priceDisplayComponent.destroy = () => {
    if (isDestroyed) return;

    isDestroyed = true;
    originalDestroy();

    // Clear any references to help with garbage collection
    const element = priceDisplayComponent.getElement();
    if (element) element._elements = null;
  };

  return priceDisplayComponent;
};

// Define required props for validation
createPriceDisplay.requiredProps = ['label'];

// Create the component with theme awareness
const PriceDisplay = withThemeAwareness(
  createComponent('PriceDisplay', createPriceDisplay)
);

// Export as a factory function
export default PriceDisplay;
