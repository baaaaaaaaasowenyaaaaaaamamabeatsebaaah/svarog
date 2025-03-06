// src/components/Section/Section.js
import './Section.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Section component for defining page sections
 * @extends Component
 */
export class Section extends Component {
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
   * @throws {Error} If children is not provided or variant is invalid
   */
  constructor({
    children,
    id,
    variant,
    backgroundImage,
    noPaddingBottom = false,
    className = '',
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
    };

    this.section = this.createSectionElement();
  }

  /**
   * Creates the section element with all its content
   * @private
   * @returns {HTMLElement} The section element
   */
  createSectionElement() {
    const { id, variant, backgroundImage, noPaddingBottom, className } =
      this.props;

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

    // Create and add content container
    const content = this.createElement('div', {
      className: 'section__content',
      children: this.props.children,
    });
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

export default Section;
