// src/components/Page/Page.js
import './Page.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Page component 
 * @extends Component
 */
export default class Page extends Component {
  /**
   * Creates a new Page instance
   * 
   * @param {Object} props - Page properties
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
    
    this.element = this.createElementPage();
  }
  
  /**
   * Creates the page element
   * @private
   * @returns {HTMLElement} The page element
   */
  createElementPage() {
    // Build class names
    const classNames = this.createClassNames(
      'page',
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
   * Gets the page element
   * @returns {HTMLElement} The page element
   */
  getElement() {
    return this.element;
  }
}
