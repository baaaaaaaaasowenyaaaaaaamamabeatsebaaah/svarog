// src/components/Badge/Badge.js
import './Badge.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Badge component 
 * @extends Component
 */
export default class Badge extends Component {
  /**
   * Creates a new Badge instance
   * 
   * @param {Object} props - Badge properties
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({
    className = '',
    // Add your props here
  }) {
    super();
    
    this.props = {
      className,
      // Store your props here
    };
    
    this.element = this.createElementBadge();
  }
  
  /**
   * Creates the badge element
   * @private
   * @returns {HTMLElement} The badge element
   */
  createElementBadge() {
    // Build class names
    const classNames = this.createClassNames(
      'badge',
      this.props.className
    );
    
    // Create the main element
    const element = this.createElement('div', { 
      className: classNames,
      // Add content and other properties here
    });
    
    return element;
  }
  
  /**
   * Gets the badge element
   * @returns {HTMLElement} The badge element
   */
  getElement() {
    return this.element;
  }
}
