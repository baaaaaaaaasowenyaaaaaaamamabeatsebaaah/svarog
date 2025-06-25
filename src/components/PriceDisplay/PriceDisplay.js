// src/components/PriceDisplay/PriceDisplay.js
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { priceDisplayStyles } from './PriceDisplay.styles.js';

// Create style injector for PriceDisplay component
const injectPriceDisplayStyles = createStyleInjector('PriceDisplay');

/**
 * Normalizes props to handle both legacy and standardized prop names
 * @param {Object} props - Price display properties
 * @returns {Object} - Normalized props
 */
const normalizePriceDisplayProps = (props) => {
  const normalized = { ...props };

  // Check for deprecated prop only if new prop is not present
  if ('isLoading' in props && !('loading' in props)) {
    console.warn(
      'PriceDisplay: "isLoading" prop is deprecated, use "loading" instead'
    );
    normalized.loading = props.isLoading;
  }

  // Ensure internal state uses isLoading for backward compatibility
  if ('loading' in props) {
    normalized.isLoading = props.loading;
  } else if ('isLoading' in props) {
    normalized.isLoading = props.isLoading;
  }

  return normalized;
};

/**
 * Creates price display DOM element
 * @param {Object} state - Price display state
 * @returns {HTMLElement} - Price display element
 */
const renderPriceDisplay = (state) => {
  // Inject styles on render
  injectPriceDisplayStyles(priceDisplayStyles);

  // Build CSS class list
  const classNames = [
    'price-display',
    state.className,
    state.isLoading && 'price-display--loading',
    state.isHighlighted && 'price-display--highlighted',
    state.isPlaceholder && 'price-display--placeholder',
    state.isError && 'price-display--error',
    !state.label && 'price-display--no-label',
  ].filter(Boolean);

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

  // Create children array
  const children = [];

  // Only create label element if label is provided
  if (state.label) {
    const labelElement = createElement('span', {
      classes: ['price-display__label'],
      text: state.label,
    });
    children.push(labelElement);
  }

  children.push(valueElement);

  // Create the container
  const container = createElement('div', {
    classes: classNames,
    children,
  });

  // Store elements for easier access in partial updates
  container._elements = {
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

  // Validate required props (removed label requirement)
  validateProps(normalizedProps, createPriceDisplay.requiredProps);

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
        existingIndicator.remove();
        // Remove the text node (space) before it
        const textNode = existingIndicator.previousSibling;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          textNode.remove();
        }
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

// Define required props for validation (empty array - no required props)
createPriceDisplay.requiredProps = [];

// Create the component with theme awareness
const PriceDisplay = withThemeAwareness(
  createComponent('PriceDisplay', createPriceDisplay)
);

// Export as a factory function
export default PriceDisplay;
