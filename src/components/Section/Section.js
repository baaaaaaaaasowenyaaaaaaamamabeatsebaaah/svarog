// src/components/Section/Section.js
import './Section.css';
import { Component } from '../../utils/componentFactory.js';
import Typography from '../Typography/Typography.js';

/**
 * Section component for defining page sections
 * @extends Component
 */
class Section extends Component {
  /**
   * Creates a new Section instance
   *
   * @param {Object} props - Section properties
   * @param {string|HTMLElement|Array} props.children - Content for the section
   * @param {string} [props.id] - Section ID for anchor links
   * @param {string} [props.variant] - Section variant ("minor" for alternative styling)
   * @param {HTMLElement} [props.backgroundImage] - Optional background image element
   * @param {boolean} [props.noPaddingBottom=false] - Whether to remove bottom padding
   * @param {string} [props.className=''] - Additional CSS class names
   * @param {string} [props.title] - Optional section title
   * @param {string} [props.description] - Optional section description
   * @throws {Error} If children is not provided or variant is invalid
   */
  constructor({
    children,
    id,
    variant,
    backgroundImage,
    noPaddingBottom = false,
    className = '',
    title,
    description,
  }) {
    super();

    // Validation
    this.validateRequiredProps({ children }, ['children'], 'Section');

    if (variant && variant !== 'minor') {
      throw new Error('Section variant must be "minor" or undefined');
    }

    if (backgroundImage && !(backgroundImage instanceof HTMLElement)) {
      throw new Error('backgroundImage must be an HTMLElement');
    }

    this.props = {
      children,
      id,
      variant,
      backgroundImage,
      noPaddingBottom,
      className,
      title,
      description,
    };

    this.section = this.createSectionElement();
  }

  /**
   * Creates the section element with all its content
   * @private
   * @returns {HTMLElement} The section element
   */
  createSectionElement() {
    const {
      id,
      variant,
      backgroundImage,
      noPaddingBottom,
      className,
      title,
      description,
    } = this.props;

    // Build class names
    const classNames = this.createClassNames('section', className, {
      'section--minor': variant === 'minor',
      'section--no-padding-bottom': noPaddingBottom,
    });

    // Create the main section element
    const section = this.createElement('div', { className: classNames });

    // Add ID anchor if specified
    if (id) {
      const anchor = this.createElement('div', { attributes: { id } });
      section.appendChild(anchor);
    }

    // Add background image if provided
    if (backgroundImage) {
      const bgContainer = this.createElement('div', {
        className: 'section__background-image',
        children: backgroundImage,
      });
      section.appendChild(bgContainer);
    }

    // Create content container
    const content = this.createElement('div', {
      className: 'section__content',
    });

    // Add title if provided
    if (title) {
      const titleEl = new Typography({
        children: title,
        as: 'h2',
        className: 'section__title',
      }).getElement();
      content.appendChild(titleEl);
    }

    // Add description if provided
    if (description) {
      const descriptionEl = new Typography({
        children: description,
        as: 'p',
        className: 'section__description',
      }).getElement();
      content.appendChild(descriptionEl);
    }

    // Add main content
    this.appendChildren(content, this.props.children);

    // Add content to section
    section.appendChild(content);

    return section;
  }

  /**
   * Gets the section element
   * @returns {HTMLElement} The section element
   */
  getElement() {
    return this.section;
  }
}

// Export as both named export and default export
export { Section };
export default Section;
