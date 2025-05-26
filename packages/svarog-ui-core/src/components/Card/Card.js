// src/components/Card/Card.js
import {
  createComponent,
  createElement,
  appendChildren,
} from '../../utils/componentFactory.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { cardStyles } from './Card.styles.js';

// Create style injector for Card component
const injectCardStyles = createStyleInjector('Card');

/**
 * Migrates legacy props to the new standardized format
 * @param {Object} props - Original props
 * @returns {Object} Migrated props
 * @private
 */
const migrateLegacyProps = (props) => {
  const migrated = { ...props };

  if (
    'image' in props &&
    !('imageUrl' in props) &&
    !('imageElement' in props)
  ) {
    console.warn(
      '[Card] image is deprecated, use imageUrl for strings or imageElement for DOM elements'
    );
    if (typeof props.image === 'string') {
      migrated.imageUrl = props.image;
    } else {
      migrated.imageElement = props.image;
    }
    delete migrated.image;
  }

  return migrated;
};

/**
 * Creates a Card component for displaying content in a card container
 *
 * @param {Object} props - Card properties
 * @param {string|HTMLElement|Array} props.children - Card content
 * @param {string} [props.title] - Card title
 * @param {string} [props.imageUrl] - Card image URL
 * @param {HTMLElement} [props.imageElement] - Card image element
 * @param {string|HTMLElement} [props.footer] - Card footer content
 * @param {boolean} [props.outlined=false] - Whether to use an outlined style
 * @param {boolean} [props.elevated=false] - Whether to add elevation shadow
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {Object} Card component API
 */
const createCard = (props) => {
  // Inject styles on first render
  injectCardStyles(cardStyles);

  // Migrate legacy props
  const normalizedProps = migrateLegacyProps(props);

  // Validate required props
  if (!normalizedProps.children) {
    throw new Error('Card: children is required');
  }

  const {
    children,
    title,
    imageUrl,
    imageElement,
    footer,
    outlined = false,
    elevated = false,
    className = '',
  } = normalizedProps;

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
  if (imageUrl) {
    const imgEl = createElement('img', {
      classes: 'card__image',
      attributes: {
        src: imageUrl,
        alt: title || 'Card image',
      },
    });
    card.appendChild(imgEl);
  } else if (imageElement) {
    card.appendChild(imageElement);
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
      const updatedProps = { ...normalizedProps, ...newProps };
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
