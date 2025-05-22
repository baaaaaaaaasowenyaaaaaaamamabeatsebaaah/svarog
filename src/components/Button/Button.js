// src/components/Button/Button.js
import './Button.css';
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { debounce } from '../../utils/performance.js';

/**
 * Validates button-specific props
 * @param {Object} props - Button properties
 */
const validateButtonProps = (props) => {
  const validVariants = [
    'primary',
    'secondary',
    'text',
    'outlined',
    'success',
    'danger',
    'icon',
  ];
  const validSizes = ['sm', 'lg'];

  if (props.variant && !validVariants.includes(props.variant)) {
    console.warn(
      `Button: Unknown variant "${props.variant}", defaulting to standard button`
    );
  }

  if (props.size && !validSizes.includes(props.size)) {
    console.warn(`Button: Unknown size "${props.size}", defaulting to medium`);
  }
};

/**
 * Creates button DOM element
 * @param {Object} state - Button state
 * @returns {HTMLElement} - Button element
 */
const renderButton = (state) => {
  // Build CSS class list
  const classNames = [
    'btn',
    state.className,
    state.size && `btn--${state.size}`,
    state.variant && `btn--${state.variant}`,
    state.iconPosition === 'right' && 'btn--icon-right',
    state.iconOnly && 'btn--icon',
  ].filter(Boolean);

  // Create button attributes - NOTE: ARIA attributes should be "false" not null
  const attributes = {
    type: state.type,
    disabled: state.disabled ? '' : null,
    'aria-disabled': state.disabled ? 'true' : 'false',
    'aria-busy': state.loading ? 'true' : 'false',
    'aria-pressed': state.pressed ? 'true' : 'false',
  };

  // Create the button content
  let content = [];

  // Handle icon + text scenarios
  if (state.icon && state.text && !state.iconOnly) {
    // Create icon element
    const iconElement = createElement('span', {
      classes: [
        `btn__icon`,
        state.iconPosition === 'right' ? 'btn__icon--right' : '',
      ],
      text: state.icon, // This could be replaced with a proper icon component
    });

    if (state.iconPosition === 'right') {
      content = [state.text, iconElement];
    } else {
      content = [iconElement, state.text];
    }
  } else if (state.icon && state.iconOnly) {
    // Icon-only button
    content = [state.icon];
    attributes['aria-label'] = state.ariaLabel || state.text;
  } else {
    // Text-only button
    content = [state.text];
  }

  // Create the button element with event handlers conditional on disabled state
  const element = createElement('button', {
    attributes,
    classes: classNames,
    children: content,
    events: state.disabled
      ? {}
      : {
          click: state.onClick,
          mouseenter: state.onMouseEnter,
          mouseleave: state.onMouseLeave,
        },
  });

  // Store state on the element for updates
  element.state = state;

  return element;
};

/**
 * Create a Button component
 * @param {Object} props - Button properties
 * @returns {Object} Button component
 */
const createButton = (props) => {
  // Validate required props
  validateProps(props, createButton.requiredProps);

  // Validate button-specific props
  validateButtonProps(props);

  // Process click handler (debounce if requested)
  let clickHandler = props.onClick;
  if (typeof props.onClick === 'function' && props.debounce) {
    clickHandler = debounce(props.onClick, props.debounceWait || 250);
  }

  // Determine if this is an icon-only button
  const iconOnly = props.variant === 'icon' || (props.icon && !props.text);

  // Initial state with defaults
  const initialState = {
    text: props.text || '',
    onClick: clickHandler,
    onMouseEnter: props.onMouseEnter || null,
    onMouseLeave: props.onMouseLeave || null,
    className: props.className || '',
    disabled: props.disabled || false,
    loading: props.loading || false,
    pressed: props.pressed || false,
    type: props.type || 'button',
    size: props.size || '',
    variant: props.variant || '',
    icon: props.icon || '',
    iconPosition: props.iconPosition || 'left',
    iconOnly,
    ariaLabel: props.ariaLabel || '',
  };

  // Create the base component
  const buttonComponent = createBaseComponent(renderButton)(initialState);

  // Define the shouldRerender method
  buttonComponent.shouldRerender = (newProps) => {
    // These props require a full re-render
    return [
      'className',
      'size',
      'variant',
      'type',
      'icon',
      'iconPosition',
      'ariaLabel',
      'text', // Always re-render for text changes to simplify
      'disabled', // Always re-render for disabled changes to simplify
      'loading', // Always re-render for loading changes to simplify
      'pressed', // Always re-render for pressed changes to simplify
    ].some((prop) => newProps[prop] !== undefined);
  };

  // Add theme change handler
  buttonComponent.onThemeChange = (newTheme, previousTheme) => {
    // This could apply theme-specific adjustments if needed
    console.debug(`Button: theme changed from ${previousTheme} to ${newTheme}`);
  };

  // Add convenience methods
  buttonComponent.setText = function (newText) {
    return this.update({ text: newText });
  };

  buttonComponent.setDisabled = function (isDisabled) {
    return this.update({ disabled: isDisabled });
  };

  buttonComponent.setLoading = function (isLoading) {
    return this.update({ loading: isLoading });
  };

  buttonComponent.setPressed = function (isPressed) {
    return this.update({ pressed: isPressed });
  };

  return buttonComponent;
};

// Define required props for validation
createButton.requiredProps = ['text'];

// Create the component with theme awareness
const ButtonComponent = withThemeAwareness(
  createComponent('Button', createButton)
);

// Export as a factory function
export default ButtonComponent;
