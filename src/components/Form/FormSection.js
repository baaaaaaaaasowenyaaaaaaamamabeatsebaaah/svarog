// src/components/Form/FormSection.js
import { Component } from '../../utils/componentFactory.js';

/**
 * FormSection component for grouping related form fields
 * @extends Component
 */
export default class FormSection extends Component {
  /**
   * Creates a new FormSection instance
   *
   * @param {Object} props - FormSection properties
   * @param {Array|Object} props.children - Section content
   * @param {string} [props.title] - Section title
   * @param {string} [props.description] - Section description
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({ children, title, description, className = '' }) {
    super();

    // Validation
    if (!children) {
      throw new Error('FormSection: children are required');
    }

    // Store props
    this.props = {
      children,
      title,
      description,
      className,
    };

    // Create element
    this.section = this.createSectionElement();
  }

  /**
   * Creates the section element
   * @private
   * @returns {HTMLElement} The section element
   */
  createSectionElement() {
    const { title, description, className, children } = this.props;

    // Create section element
    const section = this.createElement('div', {
      className: this.createClassNames('form-section', className),
    });

    // Add title if provided
    if (title) {
      const titleElement = this.createElement('h3', {
        className: 'form-section__title',
        textContent: title,
      });
      section.appendChild(titleElement);
    }

    // Add description if provided
    if (description) {
      const descriptionElement = this.createElement('p', {
        className: 'form-section__description',
        textContent: description,
      });
      section.appendChild(descriptionElement);
    }

    // Create content container
    const content = this.createElement('div', {
      className: 'form-section__content',
    });

    // Add content
    this.appendChildren(content, children);
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
