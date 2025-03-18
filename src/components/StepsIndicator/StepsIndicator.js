// src/components/StepsIndicator/StepsIndicator.js
import './StepsIndicator.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * StepsIndicator component for displaying multi-step form progress
 * @extends Component
 */
export default class StepsIndicator extends Component {
  /**
   * Creates a new StepsIndicator instance
   *
   * @param {Object} props - StepsIndicator properties
   * @param {Array} props.steps - Array of step objects with name and completed properties
   * @param {number} props.activeIndex - Index of the currently active step
   * @param {string} [props.className=''] - Additional CSS class names
   */
  constructor({ steps, activeIndex, className = '' }) {
    super();

    // Validate required props
    if (!steps || !Array.isArray(steps)) {
      throw new Error('StepsIndicator: steps must be an array');
    }

    if (typeof activeIndex !== 'number') {
      throw new Error('StepsIndicator: activeIndex must be a number');
    }

    this.props = {
      steps,
      activeIndex,
      className,
    };

    this.element = this.createStepsIndicator();
  }

  /**
   * Creates the steps indicator element
   * @private
   * @returns {HTMLElement} The steps indicator element
   */
  createStepsIndicator() {
    const { steps, activeIndex } = this.props;

    const stepsContainer = this.createElement('div', {
      className: this.createClassNames('steps-indicator', this.props.className),
    });

    steps.forEach((step, index) => {
      const stepElement = this.createElement('div', {
        className: this.createClassNames('steps-indicator__step', {
          'steps-indicator__step--active': index === activeIndex,
          'steps-indicator__step--completed': step.completed,
        }),
      });

      const stepNumber = this.createElement('div', {
        className: 'steps-indicator__step-number',
        textContent: (index + 1).toString(),
      });

      const stepName = this.createElement('div', {
        className: 'steps-indicator__step-name',
        textContent: step.name,
      });

      stepElement.appendChild(stepNumber);
      stepElement.appendChild(stepName);
      stepsContainer.appendChild(stepElement);
    });

    return stepsContainer;
  }

  /**
   * Updates the steps indicator with new props
   *
   * @param {Object} props - New props to update
   * @param {Array} [props.steps] - Updated steps array
   * @param {number} [props.activeIndex] - Updated active index
   * @returns {StepsIndicator} This instance for chaining
   */
  update({ steps, activeIndex }) {
    // Update props if provided
    if (steps) this.props.steps = steps;
    if (typeof activeIndex === 'number') this.props.activeIndex = activeIndex;

    // Replace current element with new one
    const newElement = this.createStepsIndicator();
    if (this.element.parentNode) {
      this.element.parentNode.replaceChild(newElement, this.element);
    }
    this.element = newElement;

    return this;
  }

  /**
   * Gets the steps indicator element
   * @returns {HTMLElement} The steps indicator element
   */
  getElement() {
    return this.element;
  }
}
