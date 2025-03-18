// src/components/StepsIndicator/StepsIndicator.stories.js
import StepsIndicator from './StepsIndicator.js';

export default {
  title: 'Components/StepsIndicator',
  component: StepsIndicator,
  parameters: {
    docs: {
      description: {
        component: 'A component for displaying multi-step process progress.',
      },
    },
  },
};

export const Default = () => {
  const steps = [
    { name: 'Step 1', completed: true },
    { name: 'Step 2', completed: false },
    { name: 'Step 3', completed: false },
  ];

  return new StepsIndicator({
    steps,
    activeIndex: 1,
  });
};

export const AllCompleted = () => {
  const steps = [
    { name: 'Step 1', completed: true },
    { name: 'Step 2', completed: true },
    { name: 'Step 3', completed: true },
  ];

  return new StepsIndicator({
    steps,
    activeIndex: 2,
  });
};

export const MultipleSteps = () => {
  const steps = [
    { name: 'Registration', completed: true },
    { name: 'Personal Info', completed: true },
    { name: 'Address', completed: false },
    { name: 'Payment', completed: false },
    { name: 'Confirmation', completed: false },
  ];

  return new StepsIndicator({
    steps,
    activeIndex: 2,
  });
};

export const WithCustomLabels = () => {
  const steps = [
    { name: 'Choose Product', completed: true },
    { name: 'Add to Cart', completed: true },
    { name: 'Checkout', completed: false },
    { name: 'Payment', completed: false },
  ];

  return new StepsIndicator({
    steps,
    activeIndex: 2,
    className: 'custom-steps',
  });
};

export const DynamicUpdate = () => {
  // Create container for demonstration
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '20px';

  // Initial steps
  const steps = [
    { name: 'Step 1', completed: false },
    { name: 'Step 2', completed: false },
    { name: 'Step 3', completed: false },
  ];

  const stepsIndicator = new StepsIndicator({
    steps,
    activeIndex: 0,
  });

  container.appendChild(stepsIndicator.getElement());

  // Create controls
  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '10px';

  // Next button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next Step';
  nextButton.onclick = () => {
    const currentIndex = stepsIndicator.props.activeIndex;
    if (currentIndex < steps.length - 1) {
      // Mark current step as completed
      steps[currentIndex].completed = true;

      // Update indicator
      stepsIndicator.update({
        steps: [...steps],
        activeIndex: currentIndex + 1,
      });
    }
  };

  // Reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';
  resetButton.onclick = () => {
    // Reset all steps
    steps.forEach((step) => (step.completed = false));

    // Update indicator
    stepsIndicator.update({
      steps: [...steps],
      activeIndex: 0,
    });
  };

  controls.appendChild(nextButton);
  controls.appendChild(resetButton);
  container.appendChild(controls);

  return container;
};
