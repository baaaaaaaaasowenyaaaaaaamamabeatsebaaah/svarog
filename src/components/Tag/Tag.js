// src/components/Tag/Tag.js
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';

// CSS injection imports
import { createStyleInjector } from '../../utils/styleInjection.js';
import { tagStyles } from './Tag.styles.js';

// Create style injector for Tag component (memoized)
const injectTagStyles = createStyleInjector('Tag');

/**
 * Validates tag-specific props
 * @param {Object} props - Tag properties
 */
const validateTagProps = (props) => {
  const validVariants = [
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
  ];
  const validSizes = ['sm', 'md', 'lg'];

  if (props.variant && !validVariants.includes(props.variant)) {
    console.warn(
      `Tag: Unknown variant "${props.variant}", defaulting to "default"`
    );
  }

  if (props.size && !validSizes.includes(props.size)) {
    console.warn(`Tag: Unknown size "${props.size}", defaulting to "md"`);
  }
};

/**
 * Creates tag DOM element
 * @param {Object} state - Tag state
 * @returns {HTMLElement} - Tag element
 */
const renderTag = (state) => {
  // Inject styles on render (automatically cached)
  injectTagStyles(tagStyles);

  // Build CSS class list
  const classNames = [
    'tag',
    state.className,
    state.size && `tag--${state.size}`,
    state.variant && `tag--${state.variant}`,
    state.selected && 'tag--selected',
    state.disabled && 'tag--disabled',
    state.removable && 'tag--removable',
  ].filter(Boolean);

  // Create tag attributes
  const attributes = {
    role: 'button',
    tabindex: state.disabled ? '-1' : '0',
    'aria-pressed': state.selected ? 'true' : 'false',
    'aria-disabled': state.disabled ? 'true' : 'false',
    'aria-label': state.ariaLabel || `Tag: ${state.label}`,
  };

  // Create children elements
  const children = [];

  // Add icon if provided
  if (state.icon) {
    children.push(
      createElement('span', {
        classes: ['tag__icon'],
        text: state.icon,
      })
    );
  }

  // Add label
  children.push(
    createElement('span', {
      classes: ['tag__label'],
      text: state.label,
    })
  );

  // Add count if provided
  if (state.count !== undefined && state.count !== null) {
    children.push(
      createElement('span', {
        classes: ['tag__count'],
        text: `(${state.count})`,
      })
    );
  }

  // Add remove button if removable
  if (state.removable && !state.disabled) {
    children.push(
      createElement('button', {
        classes: ['tag__remove'],
        attributes: {
          type: 'button',
          'aria-label': `Remove ${state.label} tag`,
          tabindex: '-1',
        },
        text: '×',
        events: {
          click: (e) => {
            e.stopPropagation();
            state.onRemove?.(state.value || state.label);
          },
        },
      })
    );
  }

  // Create the tag element
  const element = createElement('span', {
    attributes,
    classes: classNames,
    children,
    events: state.disabled
      ? {}
      : {
          click: (e) => {
            state.onClick?.(state.value || state.label, e);
          },
          keydown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              state.onClick?.(state.value || state.label, e);
            }
            if (e.key === 'Delete' && state.removable) {
              state.onRemove?.(state.value || state.label);
            }
          },
        },
  });

  // Store state on the element for updates
  element.state = state;

  return element;
};

/**
 * Create a Tag component
 * @param {Object} props - Tag properties
 * @returns {Object} Tag component
 */
const createTag = (props) => {
  // Validate required props
  validateProps(props, createTag.requiredProps);

  // Validate tag-specific props
  validateTagProps(props);

  // Initial state with defaults
  const initialState = {
    label: props.label || '',
    value: props.value || null,
    onClick: props.onClick || null,
    onRemove: props.onRemove || null,
    className: props.className || '',
    disabled: props.disabled || false,
    selected: props.selected || false,
    removable: props.removable || false,
    size: props.size || 'md',
    variant: props.variant || 'default',
    icon: props.icon || '',
    count: props.count,
    ariaLabel: props.ariaLabel || '',
  };

  // Create the base component
  const tagComponent = createBaseComponent(renderTag)(initialState);

  // Define the shouldRerender method
  tagComponent.shouldRerender = (newProps) => {
    // All props require a full re-render for simplicity
    return Object.keys(newProps).length > 0;
  };

  // Add convenience methods - use arrow functions to preserve context
  tagComponent.setSelected = function (isSelected) {
    return this.update({ selected: isSelected });
  };

  tagComponent.setDisabled = function (isDisabled) {
    return this.update({ disabled: isDisabled });
  };

  tagComponent.setCount = function (count) {
    return this.update({ count });
  };

  // For getter methods, we need to ensure they have access to state
  tagComponent.getValue = function () {
    const state = this.state || this.getState?.() || initialState;
    return state.value || state.label;
  };

  tagComponent.getLabel = function () {
    const state = this.state || this.getState?.() || initialState;
    return state.label;
  };

  tagComponent.isSelected = function () {
    const state = this.state || this.getState?.() || initialState;
    return state.selected;
  };

  return tagComponent;
};

// Define required props for validation
createTag.requiredProps = ['label'];

// Create the component with theme awareness
const TagComponent = withThemeAwareness(createComponent('Tag', createTag));

// Export as a factory function
export default TagComponent;
