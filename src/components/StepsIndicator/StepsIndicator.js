// src/components/StepsIndicator/StepsIndicator.js
import './StepsIndicator.css';
import {
  createElement,
  validateProps,
  createComponent,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';

// Helper to determine section state
function getSectionState(sectionIndex, steps, activeIndex) {
  const totalSteps = steps.length;

  // For section active state
  let isActive = false;
  if (totalSteps <= 3) {
    // Direct mapping for 3 or fewer steps
    isActive = sectionIndex <= activeIndex;
  } else {
    // Proportional mapping for more than 3 steps
    const progressRatio = (activeIndex + 1) / totalSteps;
    const sectionThreshold = (sectionIndex + 1) / 3;
    isActive = progressRatio >= sectionThreshold;
  }

  // For section completed state
  let isCompleted = false;
  if (totalSteps <= 3) {
    isCompleted = sectionIndex < activeIndex;
  } else {
    const progressRatio = activeIndex / totalSteps;
    const sectionThreshold = sectionIndex / 3;
    isCompleted = progressRatio > sectionThreshold;
  }

  // For section success state
  let isSuccess = false;
  if (totalSteps <= 3) {
    // If we have exactly 3 steps, check direct mapping
    if (sectionIndex < totalSteps) {
      // Special case for last step
      const step = steps[sectionIndex];
      isSuccess =
        step &&
        step.completed === true &&
        (sectionIndex !== activeIndex || sectionIndex === totalSteps - 1);
    }
  } else {
    // For more steps, calculate which steps correspond to this section
    const stepsPerSection = totalSteps / 3;
    const startStep = Math.floor(sectionIndex * stepsPerSection);
    const endStep = Math.floor((sectionIndex + 1) * stepsPerSection) - 1;

    // Check if all steps in this section are completed
    let allCompleted = true;
    for (let i = startStep; i <= endStep && i < steps.length; i++) {
      if (!steps[i] || steps[i].completed !== true) {
        allCompleted = false;
        break;
      }
    }

    // If all steps in this section are completed, it's a success
    isSuccess =
      allCompleted &&
      startStep <= activeIndex &&
      (endStep >= activeIndex || activeIndex === totalSteps - 1);
  }

  return { isActive, isCompleted, isSuccess };
}

// Render function to create component DOM
function renderStepsIndicator(state) {
  const { steps, activeIndex, className, loading } = state;

  // Main container with ARIA attributes
  const container = createElement('div', {
    classes: [
      'steps-indicator',
      className,
      loading ? 'steps-indicator--loading' : '',
    ].filter(Boolean),
    attributes: {
      role: 'navigation',
      'aria-label': 'Progress indicator',
      'aria-busy': loading ? 'true' : 'false',
    },
  });

  // Store state directly on element for easier access
  container.state = { ...state };

  // Progress bar with exactly 3 sections
  const progressBar = createElement('div', {
    classes: 'steps-indicator__progress-bar',
    attributes: {
      'aria-hidden': 'true',
    },
  });

  // Create the three sections
  for (let i = 0; i < 3; i++) {
    const sectionState = getSectionState(i, steps, activeIndex);
    const isActive = sectionState.isActive;
    const isCompleted = sectionState.isCompleted;
    const isSuccess = sectionState.isSuccess;

    // Apply CSS classes based on section state
    const classes = ['steps-indicator__section'];

    // Apply success class with highest priority
    if (isSuccess) {
      classes.push('steps-indicator__section--success');
    } else if (isCompleted) {
      classes.push('steps-indicator__section--completed');
    } else if (isActive) {
      classes.push('steps-indicator__section--active');
    }

    const section = createElement('div', {
      classes,
    });

    progressBar.appendChild(section);
  }

  // Step indicators row
  const stepsRow = createElement('div', {
    classes: 'steps-indicator__steps',
    attributes: { role: 'list' },
  });

  // Create each step marker
  steps.forEach((step, index) => {
    const isActive = index === activeIndex;
    const isCompleted = step && step.completed === true;
    const stepName = step && (step.name || `Step ${index + 1}`);

    const stepEl = createElement('div', {
      classes: [
        'steps-indicator__step',
        isActive ? 'steps-indicator__step--active' : '',
        isCompleted ? 'steps-indicator__step--completed' : '',
      ].filter(Boolean),
      attributes: {
        role: 'listitem',
        'aria-current': isActive ? 'step' : null,
        'aria-label': `Step ${index + 1}: ${stepName}${isCompleted ? ', completed' : ''}${isActive ? ', current step' : ''}`,
        'data-step-index': index.toString(),
      },
    });

    // Number container for positioning
    const numberContainer = createElement('div', {
      classes: 'steps-indicator__number-container',
    });

    // Step number
    const number = createElement('div', {
      classes: 'steps-indicator__number',
      text: (index + 1).toString(),
      attributes: { 'aria-hidden': 'true' },
    });

    // Step label
    const label = createElement('div', {
      classes: 'steps-indicator__label',
      text: stepName,
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
}

// Function to migrate legacy props to standardized props
function migrateLegacyProps(props) {
  const migrated = { ...props };

  // Support for value alias of activeIndex
  if ('value' in props && !('activeIndex' in props)) {
    migrated.activeIndex = props.value;
  }

  // Support for onChange alias of onStepChange
  if ('onChange' in props && !('onStepChange' in props)) {
    migrated.onStepChange = props.onChange;
  }

  return migrated;
}

// Factory function to create the component
function createStepsIndicator(props) {
  // Migrate legacy props to standardized props
  const normalizedProps = migrateLegacyProps(props);

  // Validate required props with component name
  validateProps(normalizedProps, ['steps', 'activeIndex'], 'StepsIndicator');

  // Validate numeric activeIndex
  if (typeof normalizedProps.activeIndex !== 'number') {
    throw new Error('StepsIndicator: activeIndex must be a number');
  }

  // Validate steps array
  if (!Array.isArray(normalizedProps.steps)) {
    throw new Error('StepsIndicator: steps must be an array');
  }

  // Validate empty steps array
  if (normalizedProps.steps.length === 0) {
    throw new Error('StepsIndicator: steps array cannot be empty');
  }

  // Validate activeIndex within bounds
  if (
    normalizedProps.activeIndex < 0 ||
    normalizedProps.activeIndex >= normalizedProps.steps.length
  ) {
    throw new Error(
      'StepsIndicator: activeIndex must be within steps array bounds'
    );
  }

  // Create base component with render function
  const stepsIndicator = createBaseComponent(renderStepsIndicator)({
    steps: normalizedProps.steps,
    activeIndex: normalizedProps.activeIndex,
    className: normalizedProps.className || '',
    loading: normalizedProps.loading || false,
    onStepChange: normalizedProps.onStepChange, // Support for callback, but component doesn't trigger it
  });

  // Add component API methods
  stepsIndicator.getState = function () {
    return { ...this.getElement().state };
  };

  stepsIndicator.setActiveStep = function (index) {
    // Validate index within bounds
    const currentState = this.getState();
    const steps = currentState.steps || [];

    if (index < 0 || index >= steps.length) {
      throw new Error(
        'StepsIndicator: activeIndex must be within steps array bounds'
      );
    }

    // Call onStepChange callback if provided
    if (
      currentState.onStepChange &&
      typeof currentState.onStepChange === 'function'
    ) {
      currentState.onStepChange(index);
    }

    return this.update({ activeIndex: index });
  };

  stepsIndicator.completeStep = function (index) {
    const currentState = this.getState();
    const updatedSteps = [...currentState.steps];

    // Validate index
    if (index < 0 || index >= updatedSteps.length) {
      throw new Error(
        'StepsIndicator: index must be within steps array bounds'
      );
    }

    // Ensure proper cloning and property setting
    if (updatedSteps[index]) {
      updatedSteps[index] = {
        ...updatedSteps[index],
        completed: true,
      };
      return this.update({ steps: updatedSteps });
    }

    return this;
  };

  stepsIndicator.resetSteps = function () {
    const currentState = this.getState();
    const updatedSteps = currentState.steps.map((step) => ({
      ...step,
      completed: false,
    }));

    // Call onStepChange callback if provided since we're moving to step 0
    if (
      currentState.onStepChange &&
      typeof currentState.onStepChange === 'function' &&
      currentState.activeIndex !== 0
    ) {
      currentState.onStepChange(0);
    }

    return this.update({
      steps: updatedSteps,
      activeIndex: 0,
    });
  };

  // Alias method for setActiveStep to match value pattern
  stepsIndicator.setValue = function (index) {
    return this.setActiveStep(index);
  };

  // Force full re-render on update
  stepsIndicator.shouldRerender = function () {
    return true;
  };

  return stepsIndicator;
}

// Create the component with theme awareness
const StepsIndicator = withThemeAwareness(
  createComponent('StepsIndicator', createStepsIndicator)
);

export default StepsIndicator;
