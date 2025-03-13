// src/components/Image/Image.js
import './Image.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Image component 
 * @extends Component
 */
export default class Image extends Component {
  /**
   * Creates a new Image instance
   * 
   * @param {Object} props - Image properties
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
    
    this.element = this.createElementImage();
  }
  
  /**
   * Creates the image element
   * @private
   * @returns {HTMLElement} The image element
   */
  createElementImage() {
    // Build class names
    const classNames = this.createClassNames(
      'image',
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
   * Gets the image element
   * @returns {HTMLElement} The image element
   */
  getElement() {
    return this.element;
  }
}
