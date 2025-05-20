// src/components/Card/Card.js
import './Card.css';
import {
  createComponent,
  createElement,
  appendChildren,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
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

  // Create card rendering function for use with baseComponent
  const renderCard = (state) => {
    const {
      children,
      title,
      image,
      footer,
      outlined = false,
      elevated = false,
      className = '',
    } = state;

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
    appendContent(content, children);
    card.appendChild(content);

    // Add footer if provided
    if (footer) {
      const footerEl = createElement('div', {
        classes: 'card__footer',
      });

      appendContent(footerEl, footer);
      card.appendChild(footerEl);
    }

    return card;
  };

  // Helper function to append different types of content
  const appendContent = (container, content) => {
    if (typeof content === 'string') {
      container.textContent = content;
    } else if (content instanceof Node) {
      container.appendChild(content);
    } else if (Array.isArray(content)) {
      appendChildren(container, content);
    } else if (
      typeof content === 'object' &&
      content !== null &&
      typeof content.getElement === 'function'
    ) {
      container.appendChild(content.getElement());
    }
  };

  // Create the component using baseComponent
  const component = createBaseComponent(renderCard)(props);

  // Add partial update method for more efficient DOM updates
  component.partialUpdate = (element, newProps) => {
    // Update styling classes
    if (
      newProps.elevated !== undefined ||
      newProps.outlined !== undefined ||
      newProps.className !== undefined
    ) {
      // Rebuild class list
      const classNames = ['card'];
      const outlined =
        newProps.outlined !== undefined ? newProps.outlined : props.outlined;
      const elevated =
        newProps.elevated !== undefined ? newProps.elevated : props.elevated;
      const className =
        newProps.className !== undefined ? newProps.className : props.className;

      if (className) classNames.push(className);
      if (outlined) classNames.push('card--outlined');
      if (elevated) classNames.push('card--elevated');

      element.className = classNames.join(' ');
    }

    // Handle image update
    if (newProps.image !== undefined) {
      updateImage(element, newProps.image, newProps.title || props.title);
    }

    // Handle title update
    if (newProps.title !== undefined) {
      updateTitle(element, newProps.title);
    }

    // Handle content update
    if (newProps.children !== undefined) {
      updateContent(element, newProps.children);
    }

    // Handle footer update
    if (newProps.footer !== undefined) {
      updateFooter(element, newProps.footer);
    }
  };

  // Helper functions for partial updates
  const updateImage = (element, image, title) => {
    let imageEl = element.querySelector('.card__image');

    if (image) {
      if (typeof image === 'string') {
        if (imageEl && imageEl.tagName === 'IMG') {
          // Update existing image
          imageEl.src = image;
          imageEl.alt = title || 'Card image';
        } else {
          // Create new image
          imageEl = createElement('img', {
            classes: 'card__image',
            attributes: {
              src: image,
              alt: title || 'Card image',
            },
          });
          element.insertBefore(imageEl, element.firstChild);
        }
      } else if (image instanceof Node) {
        if (imageEl) {
          element.replaceChild(image, imageEl);
        } else {
          element.insertBefore(image, element.firstChild);
        }
      }
    } else if (imageEl) {
      element.removeChild(imageEl);
    }
  };

  const updateTitle = (element, title) => {
    let titleEl = element.querySelector('.card__title');

    if (title) {
      if (titleEl) {
        titleEl.textContent = title;
      } else {
        titleEl = createElement('h3', {
          classes: 'card__title',
          text: title,
        });
        const imageEl = element.querySelector('.card__image');
        if (imageEl) {
          element.insertBefore(titleEl, imageEl.nextSibling);
        } else {
          element.insertBefore(titleEl, element.firstChild);
        }
      }
    } else if (titleEl) {
      element.removeChild(titleEl);
    }
  };

  const updateContent = (element, children) => {
    const contentEl = element.querySelector('.card__content');
    if (contentEl) {
      contentEl.innerHTML = '';
      appendContent(contentEl, children);
    }
  };

  const updateFooter = (element, footer) => {
    let footerEl = element.querySelector('.card__footer');

    if (footer) {
      if (footerEl) {
        footerEl.innerHTML = '';
        appendContent(footerEl, footer);
      } else {
        footerEl = createElement('div', {
          classes: 'card__footer',
        });
        appendContent(footerEl, footer);
        element.appendChild(footerEl);
      }
    } else if (footerEl) {
      element.removeChild(footerEl);
    }
  };

  // Add shouldRerender method to determine if a full re-render is needed
  component.shouldRerender = () => {
    // Always prefer partial updates for better performance
    return false;
  };

  // Add theme change handler
  component.onThemeChange = (theme, previousTheme) => {
    // Theme changes are handled through CSS variables, no manual updates needed
    console.debug(`Card: theme changed from ${previousTheme} to ${theme}`);
  };

  return component;
};

// Create the component factory with theme awareness
export default createComponent('Card', withThemeAwareness(createCard));
