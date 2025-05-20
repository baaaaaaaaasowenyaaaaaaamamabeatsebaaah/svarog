// src/components/Card/Card.js
import './Card.css';
import {
  createComponent,
  createElement,
  appendChildren,
} from '../../utils/componentFactory.js';
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
  // Validate required props
  if (!props.children) {
    throw new Error('Card: children is required');
  }

  const {
    children,
    title,
    image,
    footer,
    outlined = false,
    elevated = false,
    className = '',
  } = props;

  // Create class name with conditionals
  const classNames = ['card'];
  if (className) classNames.push(className);
  if (outlined) classNames.push('card--outlined');
  if (elevated) classNames.push('card--elevated');

  // Create the main card element
  const card = createElement('div', {
    classes: classNames.join(' '),
  });

  // Add image if provided
  if (image) {
    if (typeof image === 'string') {
      const imageEl = createElement('img', {
        classes: 'card__image',
        attributes: {
          src: image,
          alt: title || 'Card image',
        },
      });
      card.appendChild(imageEl);
    } else {
      card.appendChild(image);
    }
  }

  // Add title if provided
  if (title) {
    const titleEl = createElement('h3', {
      classes: 'card__title',
      text: title,
    });
    card.appendChild(titleEl);
  }

  // Add content section
  const content = createElement('div', {
    classes: 'card__content',
  });

  // Handle different types of children content
  if (typeof children === 'string') {
    content.textContent = children;
  } else if (children instanceof Node) {
    content.appendChild(children);
  } else if (Array.isArray(children)) {
    appendChildren(content, children);
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
    const footerEl = createElement('div', {
      classes: 'card__footer',
    });

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

  // Return the public API
  return {
    /**
     * Gets the card element
     * @returns {HTMLElement} The card element
     */
    getElement() {
      return card;
    },

    /**
     * Updates the card with new props
     * @param {Object} newProps - New properties to update
     * @returns {Object} Updated component
     */
    update(newProps) {
      const updatedProps = { ...props, ...newProps };
      const newCard = createCard(updatedProps);

      // Replace the old element with the new one if it's in the DOM
      if (card.parentNode) {
        card.parentNode.replaceChild(newCard.getElement(), card);
      }

      return newCard;
    },

    /**
     * Clean up resources
     */
    destroy() {
      // No event listeners need to be removed in this component
    },

    /**
     * Handle theme changes
     * @param {string} theme - New theme
     * @param {string} previousTheme - Previous theme
     */
    onThemeChange(theme, previousTheme) {
      // Theme changes are handled through CSS variables, no manual updates needed
      console.debug(`Card: theme changed from ${previousTheme} to ${theme}`);
    },
  };
};

// Create the component factory with theme awareness
export default createComponent('Card', withThemeAwareness(createCard));
