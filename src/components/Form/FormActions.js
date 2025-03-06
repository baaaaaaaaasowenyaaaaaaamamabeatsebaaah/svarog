// src/components/Form/FormActions.js
import { Component } from '../../utils/componentFactory.js';

/**
 * FormActions component for form buttons and actions
 * @extends Component
 */
export default class FormActions extends Component {
  /**
   * Creates a new FormActions instance
   *
   * @param {Object} props - FormActions properties
   * @param {Array|Object} props.children - Button elements or components
   * @param {string} [props.align='right'] - Alignment of buttons ('left', 'center', 'right', 'stretched')
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({ children, align = 'right', className = '' }) {
    super();

    // Validation
    if (!children) {
      throw new Error('FormActions: children are required');
    }

    if (!['left', 'center', 'right', 'stretched'].includes(align)) {
      throw new Error(
        'FormActions: align must be one of: left, center, right, stretched'
      );
    }

    // Store props
    this.props = {
      children,
      align,
      className,
    };

    // Create element
    this.container = this.createActionsContainer();
  }

  /**
   * Creates the actions container
   * @private
   * @returns {HTMLElement} The actions container element
   */
  createActionsContainer() {
    const { align, className, children } = this.props;

    // Create container element
    const container = this.createElement('div', {
      className: this.createClassNames(
        'form-actions',
        align !== 'right' ? `form-actions--${align}` : '',
        className
      ),
    });

    // Add buttons
    this.appendChildren(container, children);

    return container;
  }

  /**
   * Gets the actions container element
   * @returns {HTMLElement} The actions container element
   */
  getElement() {
    return this.container;
  }
}
