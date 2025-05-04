// src/components/StepsIndicator/StepsIndicator.js
import './StepsIndicator.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * StepsIndicator component for displaying multi-step form progress with a 3-part progress bar
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

    // Main container
    const container = this.createElement('div', {
      className: this.createClassNames('steps-indicator', this.props.className),
    });

    // Progress bar with exactly 3 sections
    const progressBar = this.createElement('div', {
      className: 'steps-indicator__progress-bar',
    });

    // Create the three progress sections
    const sections = 3;
    for (let i = 0; i < sections; i++) {
      const isActive = this.isSectionActive(i, activeIndex, steps.length);

      const section = this.createElement('div', {
        className: this.createClassNames('steps-indicator__section', {
          'steps-indicator__section--active': isActive,
        }),
      });

      progressBar.appendChild(section);
    }

    // Step indicators
    const stepsRow = this.createElement('div', {
      className: 'steps-indicator__steps',
    });

    // Create each step
    steps.forEach((step, index) => {
      const stepEl = this.createElement('div', {
        className: this.createClassNames('steps-indicator__step', {
          'steps-indicator__step--active': index === activeIndex,
          'steps-indicator__step--completed': step.completed,
        }),
      });

      // Step number
      const number = this.createElement('div', {
        className: 'steps-indicator__number',
        textContent: (index + 1).toString(),
      });

      // Step label
      const label = this.createElement('div', {
        className: 'steps-indicator__label',
        textContent: step.name,
      });

      stepEl.appendChild(number);
      stepEl.appendChild(label);
      stepsRow.appendChild(stepEl);
    });

    // Assemble the component
    container.appendChild(progressBar);
    container.appendChild(stepsRow);

    return container;
  }

  /**
   * Determines if a progress section should be active
   * @private
   * @param {number} sectionIndex - Index of the section (0-2)
   * @param {number} activeStepIndex - Index of the active step
   * @param {number} totalSteps - Total number of steps
   * @returns {boolean} Whether the section should be active
   */
  isSectionActive(sectionIndex, activeStepIndex, totalSteps) {
    // For 3 steps, map directly (section 0 → step 0, section 1 → step 1, etc.)
    if (totalSteps <= 3) {
      return sectionIndex <= activeStepIndex;
    }

    // For more than 3 steps, distribute progress proportionally
    const progressRatio = (activeStepIndex + 1) / totalSteps;
    const sectionThreshold = (sectionIndex + 1) / 3;

    return progressRatio >= sectionThreshold;
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
