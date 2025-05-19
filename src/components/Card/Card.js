// src/components/Card/Card.js
import './Card.css';
import { createComponent } from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';

/**
 * Creates a Card component for displaying content in a card container
 *
 * @param {Object} props - Card properties
 * @param {string|HTMLElement|Array} props.children - Card content
 * @param {string} [props.title] - Card title
 * @param {string|HTMLElement} [props.image] - Card image (URL string or HTMLElement)
 * @param {string|HTMLElement} [props.footer] - Card footer content
 * @param {boolean} [props.outlined=false] - Whether to use an outlined style
 * @param {boolean} [props.elevated=false] - Whether to add elevation shadow
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {Object} Card component API
 */
const createCard = (props) => {
  const {
    children,
    title,
    image,
    footer,
    outlined = false,
    elevated = false,
    className = '',
  } = props;

  // Validate required props
  if (!children) {
    throw new Error('Card: children is required');
  }

  // Create class name string with conditionals
  const createClassNames = (
    baseClass,
    customClass,
    conditionalClasses = {}
  ) => {
    const classNames = [baseClass];

    if (customClass) {
      classNames.push(customClass);
    }

    Object.entries(conditionalClasses).forEach(([className, condition]) => {
      if (condition) {
        classNames.push(className);
      }
    });

    return classNames.join(' ');
  };

  // Create the card element
  const createCardElement = () => {
    // Build class names
    const classNames = createClassNames('card', className, {
      'card--outlined': outlined,
      'card--elevated': elevated,
    });

    // Create the main card element
    const card = document.createElement('div');
    card.className = classNames;

    // Add image if provided
    if (image) {
      let imageEl;
      if (typeof image === 'string') {
        imageEl = document.createElement('img');
        imageEl.className = 'card__image';
        imageEl.src = image;
        imageEl.alt = title || 'Card image';
      } else {
        imageEl = image;
      }
      card.appendChild(imageEl);
    }

    // Add title if provided
    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'card__title';
      titleEl.textContent = title;
      card.appendChild(titleEl);
    }

    // Add content
    const content = document.createElement('div');
    content.className = 'card__content';

    // Handle different types of children
    if (typeof children === 'string') {
      content.textContent = children;
    } else if (children instanceof Node) {
      content.appendChild(children);
    } else if (Array.isArray(children)) {
      children.forEach((child) => {
        if (typeof child === 'string') {
          content.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
          content.appendChild(child);
        } else if (
          typeof child === 'object' &&
          child !== null &&
          typeof child.getElement === 'function'
        ) {
          content.appendChild(child.getElement());
        }
      });
    } else if (
      typeof children === 'object' &&
      children !== null &&
      typeof children.getElement === 'function'
    ) {
      content.appendChild(children.getElement());
    }

    card.appendChild(content);

    // Add footer if provided
    if (footer) {
      const footerEl = document.createElement('div');
      footerEl.className = 'card__footer';

      if (typeof footer === 'string') {
        footerEl.textContent = footer;
      } else if (footer instanceof Node) {
        footerEl.appendChild(footer);
      } else if (
        typeof footer === 'object' &&
        footer !== null &&
        typeof footer.getElement === 'function'
      ) {
        footerEl.appendChild(footer.getElement());
      }

      card.appendChild(footerEl);
    }

    return card;
  };

  // Initialize the card element
  const cardElement = createCardElement();

  // Return the public API
  return {
    /**
     * Gets the card element
     * @returns {HTMLElement} The card element
     */
    getElement() {
      return cardElement;
    },

    /**
     * Updates the card with new props
     * @param {Object} newProps - New properties to update
     * @returns {Object} Updated component
     */
    update(newProps) {
      // This would be more efficient with a partial update strategy
      // For now, we'll use a complete re-render approach
      const updatedProps = { ...props, ...newProps };
      const newCard = createCard(updatedProps);

      // Replace the old element with the new one if it's in the DOM
      if (cardElement.parentNode) {
        cardElement.parentNode.replaceChild(newCard.getElement(), cardElement);
      }

      return newCard;
    },

    /**
     * Clean up resources
     */
    destroy() {
      // Remove event listeners if any were added
      // Currently, the card component doesn't add any event listeners
    },
  };
};

// Set required props for validation
createCard.requiredProps = ['children'];

// Create the component factory with theme awareness
export default createComponent('Card', withThemeAwareness(createCard));
