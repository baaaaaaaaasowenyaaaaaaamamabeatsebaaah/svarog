// src/components/StepsIndicator/StepsIndicator.js
import './StepsIndicator.css';
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';

/**
 * Validates steps indicator props
 * @param {Object} props - StepsIndicator properties
 */
const validateStepsIndicatorProps = (props) => {
  // Check if steps is an array when it's provided
  if (props.steps && !Array.isArray(props.steps)) {
    throw new Error('StepsIndicator: steps must be an array');
  }

  if (typeof props.activeIndex !== 'number') {
    throw new Error('StepsIndicator: activeIndex must be a number');
  }
};

/**
 * Creates the steps indicator DOM structure
 * @param {Object} state - Component state
 * @returns {HTMLElement} - Steps indicator element
 */
const renderStepsIndicator = (state) => {
  const { steps, activeIndex, className } = state;

  // Main container with ARIA attributes for accessibility
  const container = createElement('div', {
    classes: ['steps-indicator', className].filter(Boolean),
    attributes: {
      role: 'navigation',
      'aria-label': 'Progress indicator',
    },
  });

  // Progress bar with exactly 3 sections
  const progressBar = createElement('div', {
    classes: 'steps-indicator__progress-bar',
    attributes: {
      'aria-hidden': 'true', // Hide from screen readers as it's decorative
    },
  });

  // Create the three progress sections
  const sections = 3;
  for (let i = 0; i < sections; i++) {
    const isActive = isSectionActive(i, activeIndex, steps.length);
    const isCompleted = isSectionCompleted(i, activeIndex, steps.length);
    const isSuccess = isSectionSuccess(i, activeIndex, steps);

    const section = createElement('div', {
      classes: [
        'steps-indicator__section',
        isActive && !isCompleted && !isSuccess
          ? 'steps-indicator__section--active'
          : '',
        isCompleted && !isSuccess ? 'steps-indicator__section--completed' : '',
        isSuccess ? 'steps-indicator__section--success' : '',
      ].filter(Boolean),
    });

    progressBar.appendChild(section);
  }

  // Step indicators
  const stepsRow = createElement('div', {
    classes: 'steps-indicator__steps',
    attributes: {
      role: 'list', // Semantic list for screen readers
    },
  });

  // Create each step
  steps.forEach((step, index) => {
    const isActive = index === activeIndex;
    const isCompleted = step.completed;

    const stepEl = createElement('div', {
      classes: [
        'steps-indicator__step',
        isActive ? 'steps-indicator__step--active' : '',
        isCompleted ? 'steps-indicator__step--completed' : '',
      ].filter(Boolean),
      attributes: {
        role: 'listitem', // Semantic list item
        'aria-current': isActive ? 'step' : null, // Mark current step
        'aria-label': `Step ${index + 1}: ${step.name}${isCompleted ? ', completed' : ''}${isActive ? ', current step' : ''}`,
      },
    });

    // Container for the number to ensure fixed positioning
    const numberContainer = createElement('div', {
      classes: 'steps-indicator__number-container',
    });

    // Step number
    const number = createElement('div', {
      classes: 'steps-indicator__number',
      text: (index + 1).toString(),
      attributes: {
        'aria-hidden': 'true', // Hide redundant number from screen readers
      },
    });

    // Step label
    const label = createElement('div', {
      classes: 'steps-indicator__label',
      text: step.name,
    });

    numberContainer.appendChild(number);
    stepEl.appendChild(numberContainer);
    stepEl.appendChild(label);
    stepsRow.appendChild(stepEl);
  });

  // Assemble the component
  container.appendChild(progressBar);
  container.appendChild(stepsRow);

  return container;
};

/**
 * Determines if a progress section should be active
 * @private
 * @param {number} sectionIndex - Index of the section (0-2)
 * @param {number} activeStepIndex - Index of the active step
 * @param {number} totalSteps - Total number of steps
 * @returns {boolean} Whether the section should be active
 *
 * For 3 steps or fewer, each section maps directly to a step.
 * For more than 3 steps, progress is distributed proportionally
 * across the sections based on the ratio of active step to total steps.
 */
const isSectionActive = (sectionIndex, activeStepIndex, totalSteps) => {
  // For 3 steps, map directly (section 0 → step 0, section 1 → step 1, etc.)
  if (totalSteps <= 3) {
    return sectionIndex <= activeStepIndex;
  }

  // For more than 3 steps, distribute progress proportionally
  const progressRatio = (activeStepIndex + 1) / totalSteps;
  const sectionThreshold = (sectionIndex + 1) / 3;

  return progressRatio >= sectionThreshold;
};

/**
 * Determines if a progress section should be marked as completed
 * @private
 * @param {number} sectionIndex - Index of the section (0-2)
 * @param {number} activeStepIndex - Index of the active step
 * @param {number} totalSteps - Total number of steps
 * @returns {boolean} Whether the section should be completed
 *
 * For 3 steps or fewer, a section is completed if its corresponding
 * step index is less than the active step index.
 * For more than 3 steps, a section is completed based on progress ratio.
 */
const isSectionCompleted = (sectionIndex, activeStepIndex, totalSteps) => {
  // For 3 steps, map directly
  if (totalSteps <= 3) {
    return sectionIndex < activeStepIndex;
  }

  // For more than 3 steps, distribute progress proportionally
  const progressRatio = activeStepIndex / totalSteps;
  const sectionThreshold = sectionIndex / 3;

  return progressRatio > sectionThreshold;
};

/**
 * Determines if a progress section should be marked as success
 * @private
 * @param {number} sectionIndex - Index of the section (0-2)
 * @param {number} activeStepIndex - Index of the active step
 * @param {Array} steps - The steps array
 * @returns {boolean} Whether the section should have success state
 *
 * A section is in a "success" state when all steps corresponding to that
 * section are completed, except for the active step which is currently in progress.
 * For 3 or fewer steps, each section corresponds to one step.
 * For more steps, each section corresponds to a range of steps.
 */
const isSectionSuccess = (sectionIndex, activeStepIndex, steps) => {
  // If we have 3 or fewer steps, check if this section's corresponding step is completed
  if (steps.length <= 3) {
    // If this exact section has a completed step and it's not the active one
    return (
      steps[sectionIndex] &&
      steps[sectionIndex].completed &&
      sectionIndex !== activeStepIndex
    );
  }

  // For more steps, calculate which steps correspond to this section
  const stepsPerSection = steps.length / 3;
  const startStep = Math.floor(sectionIndex * stepsPerSection);
  const endStep = Math.floor((sectionIndex + 1) * stepsPerSection) - 1;

  // Check if all steps in this section are completed
  let allCompleted = true;
  for (let i = startStep; i <= endStep && i < steps.length; i++) {
    // Skip the active step
    if (i === activeStepIndex) continue;

    if (!steps[i] || !steps[i].completed) {
      allCompleted = false;
      break;
    }
  }

  return (
    allCompleted && startStep <= activeStepIndex && endStep >= activeStepIndex
  );
};

/**
 * Create a StepsIndicator component
 * @param {Object} props - StepsIndicator properties
 * @returns {Object} StepsIndicator component
 */
const createStepsIndicator = (props) => {
  // Validate required props
  validateProps(props, createStepsIndicator.requiredProps);

  // Validate component-specific props
  validateStepsIndicatorProps(props);

  // Initial state
  const initialState = {
    steps: props.steps,
    activeIndex: props.activeIndex,
    className: props.className || '',
  };

  // Create the base component
  const stepsIndicator =
    createBaseComponent(renderStepsIndicator)(initialState);

  // Define the shouldRerender method
  stepsIndicator.shouldRerender = (newProps) => {
    // These props require a full re-render
    return ['steps', 'activeIndex', 'className'].some(
      (prop) => newProps[prop] !== undefined
    );
  };

  // Add theme change handler
  stepsIndicator.onThemeChange = (newTheme, previousTheme) => {
    // This could apply theme-specific adjustments if needed
    console.debug(
      `StepsIndicator: theme changed from ${previousTheme} to ${newTheme}`
    );
  };

  /**
   * Get a copy of the component's current state
   * @returns {Object} Copy of current state
   */
  stepsIndicator.getState = function () {
    return { ...this.getElement().state };
  };

  /**
   * Set the active step
   * @param {number} index - Index of the step to set as active
   * @returns {Object} Component instance for chaining
   */
  stepsIndicator.setActiveStep = function (index) {
    return this.update({ activeIndex: index });
  };

  /**
   * Mark a step as completed
   * @param {number} index - Index of the step to mark as completed
   * @returns {Object} Component instance for chaining
   */
  stepsIndicator.completeStep = function (index) {
    const currentState = this.getState();
    const updatedSteps = [...currentState.steps];

    if (updatedSteps[index]) {
      updatedSteps[index] = {
        ...updatedSteps[index],
        completed: true,
      };
      return this.update({ steps: updatedSteps });
    }

    return this;
  };

  /**
   * Reset all steps to incomplete
   * @returns {Object} Component instance for chaining
   */
  stepsIndicator.resetSteps = function () {
    const currentState = this.getState();
    const updatedSteps = currentState.steps.map((step) => ({
      ...step,
      completed: false,
    }));

    return this.update({
      steps: updatedSteps,
      activeIndex: 0,
    });
  };

  return stepsIndicator;
};

// Define required props for validation
createStepsIndicator.requiredProps = ['steps', 'activeIndex'];

// Create the component with theme awareness
const StepsIndicator = withThemeAwareness(
  createComponent('StepsIndicator', createStepsIndicator)
);

// Export as a factory function
export default StepsIndicator;
