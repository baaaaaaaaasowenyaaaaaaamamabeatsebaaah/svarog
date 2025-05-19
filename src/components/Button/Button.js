// src/components/Button/Button.js
import './Button.css';
import {
  createComponent,
  createElement,
} from '../../utils/componentFactory.js';

/**
 * Create a Button component
 * @param {Object} props - Button properties
 * @returns {Object} Button component
 */
const createButton = (props) => {
  const {
    text,
    onClick,
    className = '',
    disabled = false,
    type = 'button',
    size = '',
    variant = '',
  } = props;

  // State
  let buttonState = {
    text,
    disabled,
    className,
    type,
    size,
    variant,
    onClick,
  };

  // Create the button element
  const buildButtonElement = () => {
    // Build class names
    const classNames = ['btn'];
    if (buttonState.className) classNames.push(buttonState.className);
    if (buttonState.size) classNames.push(`btn--${buttonState.size}`);
    if (buttonState.variant) classNames.push(`btn--${buttonState.variant}`);

    // Create button
    return createElement('button', {
      attributes: {
        type: buttonState.type,
        disabled: buttonState.disabled ? '' : null,
      },
      classes: classNames,
      text: buttonState.text,
      events: {
        click:
          !buttonState.disabled && buttonState.onClick
            ? buttonState.onClick
            : null,
      },
    });
  };

  // Initial button element
  let buttonElement = buildButtonElement();

  // Public API
  return {
    /**
     * Get the button element
     * @returns {HTMLButtonElement} Button element
     */
    getElement() {
      return buttonElement;
    },

    /**
     * Set button text
     * @param {string} newText - New button text
     * @returns {Object} Button component (for chaining)
     */
    setText(newText) {
      buttonState.text = newText;
      buttonElement.textContent = newText;
      return this;
    },

    /**
     * Set button disabled state
     * @param {boolean} isDisabled - Whether button should be disabled
     * @returns {Object} Button component (for chaining)
     */
    setDisabled(isDisabled) {
      // Only update if state changes
      if (buttonState.disabled !== isDisabled) {
        buttonState.disabled = isDisabled;
        buttonElement.disabled = isDisabled;

        // Update click event handler
        if (isDisabled) {
          if (
            buttonState.onClick &&
            buttonElement._listeners &&
            buttonElement._listeners.click
          ) {
            buttonElement.removeEventListener('click', buttonState.onClick);
            delete buttonElement._listeners.click;
          }
        } else if (buttonState.onClick) {
          buttonElement.addEventListener('click', buttonState.onClick);
          if (buttonElement._listeners) {
            buttonElement._listeners.click = buttonState.onClick;
          } else {
            buttonElement._listeners = { click: buttonState.onClick };
          }
        }
      }

      return this;
    },

    /**
     * Update multiple props at once
     * @param {Object} newProps - New properties
     * @returns {Object} Button component (for chaining)
     */
    update(newProps) {
      // Update state with new props
      Object.assign(buttonState, newProps);

      // Determine if we need full rebuild or simple updates
      const needsRebuild =
        newProps.className !== undefined ||
        newProps.size !== undefined ||
        newProps.variant !== undefined ||
        newProps.type !== undefined ||
        newProps.onClick !== undefined;

      if (needsRebuild) {
        // Store reference to the old element for replacement
        const oldElement = buttonElement;

        // Remove old event listeners
        this.destroy();

        // Create new element
        buttonElement = buildButtonElement();

        // Replace in DOM if the old element was inserted
        if (oldElement.parentNode) {
          oldElement.parentNode.replaceChild(buttonElement, oldElement);
        }
      } else {
        // Update simple properties without rebuilding
        if (newProps.text !== undefined) {
          buttonElement.textContent = buttonState.text;
        }

        if (newProps.disabled !== undefined) {
          buttonElement.disabled = buttonState.disabled;

          // Update click event handler
          if (buttonState.disabled) {
            if (
              buttonState.onClick &&
              buttonElement._listeners &&
              buttonElement._listeners.click
            ) {
              buttonElement.removeEventListener('click', buttonState.onClick);
              delete buttonElement._listeners.click;
            }
          } else if (buttonState.onClick) {
            buttonElement.addEventListener('click', buttonState.onClick);
            if (buttonElement._listeners) {
              buttonElement._listeners.click = buttonState.onClick;
            } else {
              buttonElement._listeners = { click: buttonState.onClick };
            }
          }
        }
      }

      return this;
    },

    /**
     * Clean up resources
     */
    destroy() {
      // Remove event listeners
      if (buttonElement._listeners) {
        Object.entries(buttonElement._listeners).forEach(([event, handler]) => {
          buttonElement.removeEventListener(event, handler);
        });
        buttonElement._listeners = {};
      }
    },
  };
};

// Define required props for validation
createButton.requiredProps = ['text'];

// Export as a factory function
export default createComponent('Button', createButton);
