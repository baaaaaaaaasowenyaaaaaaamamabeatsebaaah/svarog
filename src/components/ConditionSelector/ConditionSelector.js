// src/components/ConditionSelector/ConditionSelector.js
import './ConditionSelector.css';
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';

/**
 * Migrates legacy props to new standardized props
 * @param {Object} props - Component props
 * @returns {Object} - Normalized props
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  // Migrate onSelect to onChange
  if ('onSelect' in props && !('onChange' in props)) {
    console.warn(
      '[ConditionSelector] onSelect is deprecated, use onChange instead'
    );
    migrated.onChange = props.onSelect;
  }

  // Migrate isLoading to loading
  if ('isLoading' in props && !('loading' in props)) {
    console.warn(
      '[ConditionSelector] isLoading is deprecated, use loading instead'
    );
    migrated.loading = props.isLoading;
  }

  return migrated;
};

/**
 * Validates condition-specific props
 * @param {Object} props - Condition selector properties
 */
const validateConditionSelectorProps = (props) => {
  // Validate conditions array if provided
  if (props.conditions) {
    if (!Array.isArray(props.conditions)) {
      throw new Error('ConditionSelector: conditions must be an array');
    }

    // Validate condition objects
    props.conditions.forEach((condition, index) => {
      if (!condition.id) {
        throw new Error(
          `ConditionSelector: condition at index ${index} must have an id property`
        );
      }
      if (!condition.name) {
        throw new Error(
          `ConditionSelector: condition at index ${index} must have a name property`
        );
      }
    });
  }

  // Validate selectedId if provided
  if (props.selectedId && props.conditions) {
    const idExists = props.conditions.some(
      (c) => c.id.toString() === props.selectedId.toString()
    );
    if (!idExists) {
      console.warn(
        `ConditionSelector: selectedId "${props.selectedId}" does not match any condition id`
      );
    }
  }
};

/**
 * Get an icon for a condition based on its name
 * @param {string} conditionName - Name of the condition
 * @returns {string} Icon representation
 */
const getConditionIcon = (conditionName) => {
  const lowerName = conditionName.toLowerCase();

  if (lowerName.includes('new') || lowerName.includes('neu')) {
    return '✨';
  } else if (lowerName.includes('good') || lowerName.includes('gut')) {
    return '👍';
  } else if (lowerName.includes('fair') || lowerName.includes('akzeptabel')) {
    return '👌';
  } else if (lowerName.includes('poor') || lowerName.includes('schlecht')) {
    return '🔧';
  }

  return '📱';
};

/**
 * Function to handle condition selection
 * @param {Object} state - Component state
 * @param {string|number} conditionId - ID of the selected condition
 */
const handleConditionSelect = (state, conditionId) => {
  if (!state || state.loading || !state.onChange) {
    return;
  }

  try {
    // Convert ID to string for consistent comparison
    const id = conditionId.toString();

    // Validate the condition exists
    const conditionExists = state.conditions.some(
      (c) => c.id.toString() === id
    );
    if (!conditionExists) {
      console.warn(`ConditionSelector: No condition found with id "${id}"`);
      return;
    }

    // Call onChange callback
    state.onChange(conditionId);
  } catch (error) {
    console.error(
      'ConditionSelector: Error in condition selection handler',
      error
    );
  }
};

/**
 * Creates a single condition option
 * @param {Object} condition - Condition data
 * @param {string} selectedId - Currently selected condition ID
 * @param {Function} clickHandler - Click handler function
 * @returns {HTMLElement} Condition option element
 */
const createConditionOption = (condition, selectedId, clickHandler) => {
  const isSelected = condition.id.toString() === selectedId.toString();
  const conditionId = `condition-${condition.id}`;

  // Create option container
  const optionContainer = createElement('div', {
    classes: [
      'condition-option',
      isSelected ? 'condition-option--selected' : '',
    ],
    attributes: {
      'data-condition-id': condition.id.toString(),
      role: 'radiogroup',
    },
  });

  // Create radio input
  const radioInput = createElement('input', {
    attributes: {
      type: 'radio',
      name: 'condition',
      id: conditionId,
      value: condition.id.toString(),
      checked: isSelected ? '' : null,
      'aria-labelledby': `${conditionId}-title`,
      'aria-describedby': `${conditionId}-description`,
    },
  });

  // Create label with click handler
  const optionLabel = createElement('label', {
    classes: 'condition-option__label',
    attributes: {
      for: conditionId,
    },
    events: {
      click: clickHandler,
    },
  });

  // Store reference to the handler for cleanup
  optionLabel._conditionClickHandler = clickHandler;

  // Create icon
  const icon = createElement('span', {
    classes: 'condition-option__icon',
    text: getConditionIcon(condition.name),
    attributes: {
      'aria-hidden': 'true',
    },
  });

  // Create content container
  const content = createElement('div', {
    classes: 'condition-option__content',
  });

  // Create title
  const title = createElement('div', {
    classes: 'condition-option__title',
    text: condition.name,
    attributes: {
      id: `${conditionId}-title`,
    },
  });

  // Create description
  const description = createElement('div', {
    classes: 'condition-option__description',
    text: condition.description || '',
    attributes: {
      id: `${conditionId}-description`,
    },
  });

  // Assemble the elements
  content.appendChild(title);
  content.appendChild(description);
  optionLabel.appendChild(icon);
  optionLabel.appendChild(content);
  optionContainer.appendChild(radioInput);
  optionContainer.appendChild(optionLabel);

  return optionContainer;
};

/**
 * Creates the condition selector DOM structure
 * @param {Object} state - Component state
 * @returns {HTMLElement} Root element for the component
 */
const renderConditionSelector = (state) => {
  const { conditions, selectedId, loading, className } = state;

  // Create container with appropriate classes
  const classes = [
    'condition-selector',
    className,
    loading ? 'condition-selector--loading' : '',
  ].filter(Boolean);

  const container = createElement('div', {
    classes,
    attributes: {
      role: 'region',
      'aria-busy': loading ? 'true' : 'false',
      'aria-label': 'Condition Selection',
    },
  });

  // If there are no conditions, return empty container
  if (!conditions || !conditions.length) {
    // Add empty state message for screen readers
    const emptyMessage = createElement('div', {
      classes: 'sr-only',
      text: 'No conditions available',
      attributes: {
        'aria-live': 'polite',
      },
    });
    container.appendChild(emptyMessage);
    return container;
  }

  // Create condition options container
  const optionsContainer = createElement('div', {
    classes: 'condition-options',
    attributes: {
      role: 'group',
      'aria-label': 'Available conditions',
    },
  });

  // Create condition options
  conditions.forEach((condition) => {
    // Create a closure for this specific condition's click handler
    const clickHandler = () => handleConditionSelect(state, condition.id);

    const option = createConditionOption(condition, selectedId, clickHandler);
    optionsContainer.appendChild(option);
  });

  container.appendChild(optionsContainer);

  // Store a reference to the state object on the container
  container._state = { ...state };

  return container;
};

/**
 * Create a ConditionSelector component
 * @param {Object} props - ConditionSelector properties
 * @param {Array<{id: (string|number), name: string, description?: string}>} [props.conditions=[]] - Array of condition objects
 * @param {Function} [props.onChange=null] - Callback when a condition is selected
 * @param {Function} [props.onSelect=null] - (Deprecated) Callback when a condition is selected
 * @param {string|number} [props.selectedId=''] - ID of the currently selected condition
 * @param {boolean} [props.loading=false] - Whether the component is in loading state
 * @param {boolean} [props.isLoading=false] - (Deprecated) Whether the component is in loading state
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {Object} ConditionSelector component
 */
const createConditionSelector = (props) => {
  // Migrate legacy props
  const normalizedProps = migrateLegacyProps(props);

  // Validate props
  validateProps(normalizedProps, createConditionSelector.requiredProps);
  validateConditionSelectorProps(normalizedProps);

  // Initial state with defaults
  const initialState = {
    conditions: normalizedProps.conditions || [],
    onChange: normalizedProps.onChange || null,
    selectedId: normalizedProps.selectedId
      ? normalizedProps.selectedId.toString()
      : '',
    loading: normalizedProps.loading || false,
    className: normalizedProps.className || '',
  };

  // Create the base component
  const conditionSelector = createBaseComponent(renderConditionSelector)(
    initialState
  );

  // Define the shouldRerender method
  conditionSelector.shouldRerender = (newProps) => {
    // Normalize new props
    const normalizedNewProps = migrateLegacyProps(newProps);

    // These props require a full re-render
    return [
      'conditions',
      'className',
      'loading',
      'isLoading',
      'selectedId',
    ].some((prop) => normalizedNewProps[prop] !== undefined);
  };

  // Add theme change handler
  conditionSelector.onThemeChange = (newTheme, previousTheme) => {
    console.debug(
      `ConditionSelector: theme changed from ${previousTheme} to ${newTheme}`
    );
  };

  // Add convenience methods
  conditionSelector.setLoading = function (isLoading) {
    return this.update({ loading: isLoading });
  };

  conditionSelector.updateConditions = function (conditions, selectedId = '') {
    return this.update({
      conditions,
      selectedId,
    });
  };

  conditionSelector.setSelectedCondition = function (conditionId) {
    return this.update({ selectedId: conditionId.toString() });
  };

  // Add custom destroy method to ensure proper cleanup
  const originalDestroy = conditionSelector.destroy;
  conditionSelector.destroy = function () {
    const element = this.getElement();

    // Find all labels with click handlers and clean them up
    const labels = element.querySelectorAll('.condition-option__label');
    labels.forEach((label) => {
      if (label._conditionClickHandler) {
        label.removeEventListener('click', label._conditionClickHandler);
        delete label._conditionClickHandler;
      }
    });

    // Remove circular references
    if (element._state) {
      delete element._state;
    }

    // Call original destroy
    if (originalDestroy) {
      originalDestroy.call(this);
    }
  };

  return conditionSelector;
};

// Define required props (none are strictly required)
createConditionSelector.requiredProps = [];

// Create the component with theme awareness
const ConditionSelector = withThemeAwareness(
  createComponent('ConditionSelector', createConditionSelector)
);

// Export as a factory function
export default ConditionSelector;
