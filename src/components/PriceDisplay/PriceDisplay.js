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
 * Normalizes props to handle both legacy and standardized prop names
 * @param {Object} props - Price display properties
 * @returns {Object} - Normalized props
 */
const normalizePriceDisplayProps = (props) => {
  const normalized = { ...props };

  // Handle loading/isLoading standardization
  if ('isLoading' in props) {
    console.warn(
      'PriceDisplay: "isLoading" prop is deprecated, use "loading" instead'
    );
  }

  if ('loading' in props) {
    normalized.isLoading = props.loading;
  } else if ('isLoading' in props) {
    normalized.loading = props.isLoading;
  }

  return normalized;
};

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
  // Normalize props to handle both legacy and new prop names
  const normalizedProps = normalizePriceDisplayProps(props);

  // Validate required props
  validateProps(normalizedProps, createPriceDisplay.requiredProps);

  // Validate price display-specific props
  validatePriceDisplayProps(normalizedProps);

  // Initial state with defaults
  const initialState = {
    label: normalizedProps.label || '',
    value: normalizedProps.value || '',
    isLoading: normalizedProps.isLoading || false,
    isHighlighted: normalizedProps.isHighlighted || false,
    isPlaceholder: normalizedProps.isPlaceholder || false,
    isError: normalizedProps.isError || false,
    className: normalizedProps.className || '',
  };

  // Track component destroyed state
  let isDestroyed = false;

  // Create the base component
  const priceDisplayComponent =
    createBaseComponent(renderPriceDisplay)(initialState);

  // Override update method to handle prop normalization
  const originalUpdate = priceDisplayComponent.update;
  priceDisplayComponent.update = (newProps) => {
    if (isDestroyed) {
      console.warn('PriceDisplay: Attempted to update destroyed component');
      return priceDisplayComponent;
    }

    // Normalize props before updating
    const normalizedNewProps = normalizePriceDisplayProps(newProps);
    return originalUpdate(normalizedNewProps);
  };

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

    // Normalize props
    const normalizedNewProps = normalizePriceDisplayProps(newProps);
    const { valueElement } = element._elements;

    // Handle value updates
    if (normalizedNewProps.value !== undefined) {
      valueElement.textContent = normalizedNewProps.value;
    }

    // Handle class-based state changes
    if (normalizedNewProps.isHighlighted !== undefined) {
      element.classList.toggle(
        'price-display--highlighted',
        normalizedNewProps.isHighlighted
      );
    }

    if (normalizedNewProps.isPlaceholder !== undefined) {
      element.classList.toggle(
        'price-display--placeholder',
        normalizedNewProps.isPlaceholder
      );
    }

    if (normalizedNewProps.isError !== undefined) {
      element.classList.toggle(
        'price-display--error',
        normalizedNewProps.isError
      );
    }

    // Handle loading state changes
    if (normalizedNewProps.isLoading !== undefined) {
      element.classList.toggle(
        'price-display--loading',
        normalizedNewProps.isLoading
      );

      // Remove existing loading indicator if any
      const existingIndicator = valueElement.querySelector(
        '.price-display__loading-indicator'
      );
      if (existingIndicator) {
        valueElement.removeChild(existingIndicator);
      }

      // Add new loading indicator if loading
      if (normalizedNewProps.isLoading) {
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
    return priceDisplayComponent.update({ loading: isLoading });
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
      loading: false,
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
