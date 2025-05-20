// src/components/Button/Button.js
import './Button.css';
import {
  createComponent,
  createElement,
  validateProps,
} from '../../utils/componentFactory.js';

/**
 * Create a Button component
 * @param {Object} props - Button properties
 * @returns {Object} Button component
 */
const createButton = (props) => {
  // Validate required props
  validateProps(props, createButton.requiredProps);

  // Initial state with defaults
  const state = {
    text: props.text,
    onClick: props.onClick,
    className: props.className || '',
    disabled: props.disabled || false,
    type: props.type || 'button',
    size: props.size || '',
    variant: props.variant || '',
  };

  // Create button element
  let buttonElement = buildElement();

  // Build CSS class list
  function getClassNames() {
    return [
      'btn',
      state.className,
      state.size && `btn--${state.size}`,
      state.variant && `btn--${state.variant}`,
    ].filter(Boolean);
  }

  // Create the DOM element
  function buildElement() {
    return createElement('button', {
      attributes: {
        type: state.type,
        disabled: state.disabled ? '' : null,
      },
      classes: getClassNames(),
      text: state.text,
      events: state.disabled ? {} : { click: state.onClick },
    });
  }

  // Update or replace the button element
  function updateElement(needsRebuild = false) {
    if (needsRebuild) {
      const oldElement = buttonElement;
      detachEvents();
      buttonElement = buildElement();

      if (oldElement.parentNode) {
        oldElement.parentNode.replaceChild(buttonElement, oldElement);
      }
    } else {
      buttonElement.textContent = state.text;
      buttonElement.disabled = state.disabled;

      // Update event listeners if disabled state changed
      if (state.onClick) {
        if (state.disabled) {
          buttonElement.removeEventListener('click', state.onClick);
        } else {
          buttonElement.addEventListener('click', state.onClick);
        }
      }
    }
  }

  // Clean up event listeners
  function detachEvents() {
    if (state.onClick) {
      buttonElement.removeEventListener('click', state.onClick);
    }
  }

  // Public API
  return {
    getElement() {
      return buttonElement;
    },

    setText(newText) {
      state.text = newText;
      buttonElement.textContent = newText;
      return this;
    },

    setDisabled(isDisabled) {
      if (state.disabled !== isDisabled) {
        state.disabled = isDisabled;
        updateElement(false);
      }
      return this;
    },

    update(newProps) {
      // Check which props require a rebuild
      const needsRebuild = [
        'className',
        'size',
        'variant',
        'type',
        'onClick',
      ].some((prop) => newProps[prop] !== undefined);

      // Update state
      Object.assign(state, newProps);

      // Update the DOM
      updateElement(needsRebuild);
      return this;
    },

    destroy() {
      detachEvents();
    },
  };
};

// Define required props for validation
createButton.requiredProps = ['text'];

// Export as a factory function
export default createComponent('Button', createButton);
